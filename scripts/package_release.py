# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Package one immutable Git commit and validate that exact extracted source."""
import argparse
import compileall
import hashlib
import json
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
PREFIX = "zoe-g-music-lab/"
sys.path.insert(0, str(ROOT))
from musiclab.delivery_versions import decode_policy, MAX_CONTRACT_BYTES
from musiclab.release_metadata import decode_metadata, validate_metadata, MAX_PROJECT_METADATA_BYTES
from musiclab.test_run_summary import decode_summary, WORKERS
from musiclab.release_archive import RAW_PROFILE, archive_args, source_tree, blob_digest, MAX_SOURCE_BYTES
from musiclab.release_zip_fs import inspect_archive, write_manifest
from musiclab.release_git_fs import read_tree


def command(args, cwd=ROOT, input=None, timeout=60):
    process = subprocess.run(args, cwd=cwd, input=input, capture_output=True, timeout=timeout)
    if process.returncode:
        detail = (process.stdout + process.stderr).decode("utf-8", errors="replace")[-4000:]
        raise ValueError(f"Check failed: {args[0]} {args[1]}\n{detail}")
    return process.stdout


def entries(archive, objects=None):
    hashes = {}
    expanded = 0
    for entry in archive.infolist():
        if entry.is_dir():
            continue
        name = PurePosixPath(entry.filename)
        if not entry.filename.startswith(PREFIX) or ".." in name.parts or name.is_absolute():
            raise ValueError("Unsafe archive path")
        relative = entry.filename[len(PREFIX):]
        parts = PurePosixPath(relative).parts
        if any(part.startswith((".env", ".dev.vars")) or part in (".git", "outputs", "__pycache__") for part in parts):
            raise ValueError("Unexpected private or generated file in archive")
        expanded += entry.file_size
        if relative in hashes or expanded > MAX_SOURCE_BYTES:
            raise ValueError("Archive duplicates or expanded budget exceeded")
        expected = objects.get(relative) if objects is not None else None
        if objects is not None and (expected is None or expected['size'] != entry.file_size):
            raise ValueError("Archived source does not match immutable Git tree")
        digest = hashlib.sha256()
        blob = blob_digest(entry.file_size) if expected is not None else None
        with archive.open(entry) as source:
            while block := source.read(1024 * 1024):
                digest.update(block)
                if blob is not None:blob.update(block)
        if expected is not None and blob.hexdigest() != expected['oid']:
            raise ValueError("Archived source bytes differ from immutable Git blob")
        hashes[relative] = digest.hexdigest()
    if objects is not None and set(hashes) != set(objects):
        raise ValueError("Archive omits immutable source files")
    return hashes


def committed_file(commit, name, limit):
    """Read only a fixed selected Git blob, checking its size before capture."""
    spec = f"{commit}:{name}"
    size = int(command(["git", "cat-file", "-s", spec]).decode("ascii").strip())
    if not 0 <= size <= limit:
        raise ValueError(f"Selected {name} exceeds its metadata limit")
    raw = command(["git", "show", spec])
    if len(raw) != size:
        raise ValueError(f"Selected {name} bytes differ from the Git blob size")
    return raw


def committed_metadata(commit):
    metadata = decode_metadata(committed_file(commit, "projects.json", MAX_PROJECT_METADATA_BYTES))
    policy = decode_policy(committed_file(commit, "musiclab/assets/delivery-versions.json", MAX_CONTRACT_BYTES))
    return metadata, validate_metadata(metadata, policy.descriptor())


def package(ref):
    commit = command(["git", "rev-parse", "--verify", f"{ref}^{{commit}}"] ).decode().strip()
    manifest_source, identity = committed_metadata(commit)
    version = identity.version
    destination = ROOT / "outputs/releases" / f"v{version}-{commit[:12]}"
    if destination.exists():
        raise ValueError("Package already exists; keep the verified artifact or use another commit")
    destination.mkdir(parents=True)
    source = destination / f"zoe-g-music-lab-v{version}.zip"
    try:
        objects = source_tree(read_tree(ROOT, commit))
        command(["git", *archive_args(commit, source, RAW_PROFILE)])
        inspect_archive(source)
        with zipfile.ZipFile(source) as archive:
            hashes = entries(archive, objects)
            if archive.testzip() is not None:
                raise ValueError("Damaged package")
            archived_metadata = decode_metadata(archive.read(PREFIX + "projects.json"))
            archived_policy = decode_policy(archive.read(PREFIX + "musiclab/assets/delivery-versions.json"))
            if (validate_metadata(archived_metadata, archived_policy.descriptor()) != identity
                    or archived_metadata != manifest_source):
                raise ValueError("Archived release metadata differs from the selected Git source")
            required_files = ["LICENSE", "NOTICE", "README.md", "music_lab_agent.py", "music_lab_server.py"]
            has_mcp = "mcp_protocol_version" in manifest_source
            if has_mcp:
                required_files.append("music_lab_mcp.py")
            for required in required_files:
                if required not in hashes:
                    raise ValueError(f"Missing required release file: {required}")
            with tempfile.TemporaryDirectory(prefix="zoe-release-check-") as folder:
                selected = Path(folder).resolve()
                if selected.parent != Path(tempfile.gettempdir()).resolve():
                    raise ValueError("Unverified release validation temporary directory")
                archive.extractall(folder)
                checkout = Path(folder) / "zoe-g-music-lab"
                # Prepare only this verified, disposable checkout. Cache files
                # stay outside the source archive and the runner's fixed budget.
                if not compileall.compile_dir(checkout, quiet=2):
                    raise ValueError("Verified Python source could not be prepared")
                # The full suite includes real Git/Windows process fixtures; use a
                # bounded execution deadline separately from each caller's wait.
                # The runner owns the approved 600-second budget; allow it to collect and
                # close both workers before this outer process can time out.
                python_summary = decode_summary(command([sys.executable, "-X", "utf8", "scripts/check_python_tests.py", "--report-json"], checkout, timeout=630))
                command(["node", "--check", "web/app.js"], checkout)
                javascript_tests = sorted(file.relative_to(checkout).as_posix() for file in (checkout / "tests").glob("test_*.js"))
                if not javascript_tests:
                    raise ValueError("No packaged JavaScript tests found")
                command(["node", "--test", f"--test-concurrency={WORKERS}", *javascript_tests], checkout, timeout=180)
                if "web/planning-import.js" in hashes:
                    command(["node", "--check", "web/planning-import.js"], checkout)
                capabilities = json.loads(command([sys.executable, "music_lab_agent.py", "--describe"], checkout))
                if capabilities["version"] != version or capabilities["license"] != manifest_source["license"]:
                    raise ValueError("Packaged capabilities differ from release metadata")
                if "delivery_versions_schema_version" in manifest_source:
                    from_script = command([sys.executable, "-X", "utf8", "-c",
                        "import json;from musiclab.delivery_versions import POLICY;print(json.dumps(POLICY.descriptor()))"], checkout)
                    policy = json.loads(from_script)
                    if ("musiclab/assets/delivery-versions.json" not in hashes
                            or policy['current'] != version
                            or policy['schema_version'] != manifest_source['delivery_versions_schema_version']
                            or policy['supported'] != capabilities['delivery_inspection']['supported_tool_versions']):
                        raise ValueError("Packaged delivery-version policy differs from release metadata")
                if has_mcp:
                    request = {"jsonrpc": "2.0", "id": "package-check", "method": "initialize", "params": {
                        "protocolVersion": manifest_source["mcp_protocol_version"], "capabilities": {},
                        "clientInfo": {"name": "release-check", "version": "1.0"}}}
                    reply = json.loads(command([sys.executable, "-X", "utf8", "music_lab_mcp.py"], checkout,
                                               input=(json.dumps(request)+"\n").encode()))
                    if reply.get("result", {}).get("serverInfo", {}).get("version") != version or reply["result"]["protocolVersion"] != manifest_source["mcp_protocol_version"]:
                        raise ValueError("Packaged MCP metadata differs from release metadata")
        manifest = {"schema_version": 2, "archive_profile": RAW_PROFILE, "commit": commit, "version": version,
                    "license": manifest_source["license"], "archive": source.name,
                    "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                    "bytes": source.stat().st_size, "files": hashes,
                    "checks": {"zip_integrity": "passed", "release_metadata": "passed", "packaged_python_tests": "passed",
                               "packaged_javascript_tests": "passed", "agent_metadata": "passed", "mcp_metadata": "passed" if has_mcp else "not_in_this_version",
                               "python_run": python_summary},
                    "restore": f"git -c core.autocrlf=false -c core.eol=lf -c core.attributesFile= archive --format=zip --prefix={PREFIX} --output=restored.zip {commit}"}
        write_manifest(destination / "manifest.json", manifest)
        return destination, manifest
    except Exception:
        # Keep failed evidence and refuse silent replacement on a repeated run.
        try:
            with (destination / "FAILED.txt").open('xb') as target:
                target.write(b"Packaging did not pass. No successful manifest was issued.\n")
        except OSError:
            # Preserve unknown diagnostic files and the original refusal.
            pass
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ref", required=True, help="Explicit commit, branch or immutable release tag")
    args = parser.parse_args()
    try:
        path, manifest = package(args.ref)
    except (ValueError, OSError, subprocess.TimeoutExpired) as error:
        print(str(error), file=sys.stderr)
        return 1
    print(json.dumps({"path": str(path), "commit": manifest["commit"], "sha256": manifest["sha256"],
                      "bytes": manifest["bytes"], "checks": manifest["checks"]}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
