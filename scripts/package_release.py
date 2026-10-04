# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Package one immutable Git commit and validate that exact extracted source."""
import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
PREFIX = "zoe-g-music-lab/"


def command(args, cwd=ROOT, input=None, timeout=60):
    process = subprocess.run(args, cwd=cwd, input=input, capture_output=True, timeout=timeout)
    if process.returncode:
        detail = (process.stdout + process.stderr).decode("utf-8", errors="replace")[-4000:]
        raise ValueError(f"Check failed: {args[0]} {args[1]}\n{detail}")
    return process.stdout


def entries(archive):
    hashes = {}
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
        hashes[relative] = hashlib.sha256(archive.read(entry)).hexdigest()
    return hashes


def package(ref):
    commit = command(["git", "rev-parse", "--verify", f"{ref}^{{commit}}"] ).decode().strip()
    manifest_source = json.loads(command(["git", "show", f"{commit}:projects.json"]).decode("utf-8"))
    version = manifest_source["version"]
    if not all(c.isdigit() or c=="." for c in version):
        raise ValueError("Unsupported release version")
    destination = ROOT / "outputs/releases" / f"v{version}-{commit[:12]}"
    if destination.exists():
        raise ValueError("Package already exists; keep the verified artifact or use another commit")
    destination.mkdir(parents=True)
    source = destination / f"zoe-g-music-lab-v{version}.zip"
    try:
        command(["git", "archive", "--format=zip", f"--prefix={PREFIX}", f"--output={source}", commit])
        with zipfile.ZipFile(source) as archive:
            hashes = entries(archive)
            if archive.testzip() is not None:
                raise ValueError("Damaged package")
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
                # The full suite includes real Git/Windows process fixtures; use a
                # bounded execution deadline separately from each caller's wait.
                command([sys.executable, "-X", "utf8", "-m", "unittest", "discover", "-s", "tests"], checkout, timeout=120)
                command(["node", "--check", "web/app.js"], checkout)
                javascript_tests = sorted(file.relative_to(checkout).as_posix() for file in (checkout / "tests").glob("test_*.js"))
                if not javascript_tests:
                    raise ValueError("No packaged JavaScript tests found")
                command(["node", "--test", *javascript_tests], checkout)
                if "web/planning-import.js" in hashes:
                    command(["node", "--check", "web/planning-import.js"], checkout)
                capabilities = json.loads(command([sys.executable, "music_lab_agent.py", "--describe"], checkout))
                if capabilities["version"] != version or capabilities["license"] != manifest_source["license"]:
                    raise ValueError("Packaged capabilities differ from release metadata")
                if has_mcp:
                    request = {"jsonrpc": "2.0", "id": "package-check", "method": "initialize", "params": {
                        "protocolVersion": manifest_source["mcp_protocol_version"], "capabilities": {},
                        "clientInfo": {"name": "release-check", "version": "1.0"}}}
                    reply = json.loads(command([sys.executable, "-X", "utf8", "music_lab_mcp.py"], checkout,
                                               input=(json.dumps(request)+"\n").encode()))
                    if reply.get("result", {}).get("serverInfo", {}).get("version") != version or reply["result"]["protocolVersion"] != manifest_source["mcp_protocol_version"]:
                        raise ValueError("Packaged MCP metadata differs from release metadata")
        manifest = {"schema_version": 1, "commit": commit, "version": version,
                    "license": manifest_source["license"], "archive": source.name,
                    "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                    "bytes": source.stat().st_size, "files": hashes,
                    "checks": {"zip_integrity": "passed", "packaged_python_tests": "passed",
                               "packaged_javascript_tests": "passed", "agent_metadata": "passed", "mcp_metadata": "passed" if has_mcp else "not_in_this_version"},
                    "restore": f"git archive --format=zip --prefix={PREFIX} --output=restored.zip {commit}"}
        (destination / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
        return destination, manifest
    except Exception:
        # Keep failed evidence and refuse silent replacement on a repeated run.
        (destination / "FAILED.txt").write_text("Packaging did not pass. No successful manifest was issued.\n", encoding="utf-8")
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
