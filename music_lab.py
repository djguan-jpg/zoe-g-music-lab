# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""CLI for four original ZOE. G projects. Python standard library only."""
import argparse
import json
import sys
from pathlib import Path
from musiclab.common import read_json, write_bundle
from musiclab.application import build, export_library_backup, prepare_delivery, inspect_delivery
from musiclab.backup_files import write_backup
from musiclab import __version__
from musiclab.draft_library import DraftLibrary, revision_id


def main(argv=None):
    parser = argparse.ArgumentParser(description=f"ZOE. G Music Lab · 本機 v{__version__}")
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("music", "storyboard", "lyrics", "audio", "audio-acceptance-review", "storyboard-seed", "lyrics-seed", "lyrics-review", "lyrics-search", "storyboard-search", "music-search", "lyrics-export-review", "music-review", "storyboard-review", "storyboard-timing-review", "storyboard-shot-review", "delivery-package", "delivery-inspect"):
        sub = commands.add_parser(name)
        sub.add_argument("--out", required=True, help="指定本輪輸出資料夾")
        sub.add_argument("--overwrite", action="store_true", help="明確替換此輸出目錄的同名成果")
        if name=='lyrics-export-review':sub.add_argument('--include-package',action='store_true',help='明確另輸出同來源的完整lyrics.json，與格式報告一起保存')
        if name=='delivery-inspect':sub.add_argument('--compare-input',help='明確比較基準JSON，只含scope與files；不合併或寫入原文')
        if name=='delivery-inspect':sub.add_argument('--comparison-report',action='store_true',help='明確比較基準時另輸出JSON與Markdown來源報告')
        if name=='delivery-inspect':sub.add_argument('--file-name',action='append',help='明確輸出此原文檔，可重複；完整核對ZIP後選取，不覆寫，不能與comparison-report混用')
        if name=='delivery-inspect':
            sub.add_argument('--text-file',help='明確原檔名；只輸出有來源雜湊與位置的文字分段摘要')
            sub.add_argument('--start-byte',type=int,help='原文UTF-8字元邊界；非零需archive-sha256')
            sub.add_argument('--window-bytes',type=int,help='分段最多4–16384 bytes；預設16384')
            sub.add_argument('--archive-sha256',help='前次核對的ZIP SHA；來源變更拒絕接續')
            sub.add_argument('--match-context',action='store_true',help='明確要求命中前後文；需text-file及find-text，每側最多64 UTF-8 bytes')
            sub.add_argument('--find-text',help='與text-file一起使用；搜尋原文完全相同的字串，只輸出命中位置摘要')
            sub.add_argument('--max-matches',type=int,help='字面搜尋每批1–50筆；預設20，可依摘要接續')
        if name == 'storyboard-shot-review':sub.add_argument('--row',type=int,help='--draft 必須明確指定一開始的原始鏡號；--input 已含 row，不可覆蓋')
        if name in ('music-review', 'storyboard-review', 'storyboard-timing-review', 'storyboard-shot-review'):
            source_group = sub.add_mutually_exclusive_group(required=True)
            source_group.add_argument('--input', help='含 panel 的原始工作台欄位 JSON')
            source_group.add_argument('--draft', help='明確選定 schema3 草稿，只檢查命令所選的工作台')
        elif name == 'lyrics-seed':
            source_group = sub.add_mutually_exclusive_group(required=True)
            source_group.add_argument('--text', help='明確選定UTF-8純文字檔，不猜測時間')
            source_group.add_argument('--seed', help='未校時歌詞起稿JSON，核對後輸出')
            sub.add_argument('--title', help='--text需要作品名稱；--seed不可覆蓋名稱')
        elif name == "storyboard-seed":
            source_group = sub.add_mutually_exclusive_group(required=True)
            source_group.add_argument("--brief")
            source_group.add_argument("--seed", help="已產生的起稿 JSON，先核對再輸出")
        elif name in ("music", "storyboard"):
            sub.add_argument("--brief", required=True)
        else:
            sub.add_argument("--input", required=True)
        if name == "lyrics":
            sub.add_argument("--title", help="逐句來源名稱；完整歌詞包保留原名稱")
            sub.add_argument("--duration", type=float)
            sub.add_argument("--shift", type=float)
            sub.add_argument("--legacy-json", action="store_true", help="明確轉換完整舊版無版本歌詞包")
            sub.add_argument("--set", action="append", default=[])
            sub.add_argument("--text", action="append", default=[])
        if name == "audio":
            sub.add_argument("--acceptance-draft", help="明確選定接受條件草稿或完整檢查報告 JSON；先核對原始條件，不能與 profile／rates／bits／channels 混用")
            sub.add_argument("--profile", choices=["distribution", "video"])
            for setting in ("rates", "bits", "channels"):
                sub.add_argument(f"--{setting}", type=int, nargs="+")
        if name == 'storyboard-seed':
            sub.add_argument('--fps', type=float)
            sub.add_argument('--bars-per-shot', type=int)
    drafts = commands.add_parser("draft", help="明確選定本機草稿庫；保存版本不覆寫")
    actions = drafts.add_subparsers(dest="draft_action", required=True)
    for action in ("save", "list", "search", "read", "backup", "backup-export", "inspect", "restore"):
        sub = actions.add_parser(action)
        sub.add_argument("--library", required=True, help="明確選定草稿庫目錄")
        if action == "save":
            sub.add_argument("--input", required=True, help="已轉換的 schema 3 草稿 JSON")
            sub.add_argument("--label", required=True)
            sub.add_argument("--id", help="相同內容重試用相同 ID，不同內容用新 ID")
        elif action == "read":
            sub.add_argument("--id", required=True)
        elif action == "backup":
            sub.add_argument("--out", required=True, help="新備份 ZIP 路徑，不覆寫")
            sub.add_argument("--ids", nargs="+", help="可選：只備份明確選定的保存 ID")
        elif action == 'backup-export':
            sub.add_argument('--ids', nargs='+', help='明確保存 ID；省略則匯出全部版本摘要')
            sub.add_argument('--include-archive', action='store_true', help='明確回傳不超過512 KiB的ZIP base64，只輸出JSON，不寫檔')
        elif action in ("inspect", "restore"):
            sub.add_argument("--input", required=True, help="明確選定的備份 ZIP")
            if action == "restore":
                sub.add_argument("--sha256", required=True, help="inspect 預覽的備份摘要")
        else:
            if action == 'search':sub.add_argument('--query', required=True, help='字面搜尋保存名稱與三種作品名；保留大小寫與空白，不搜尋草稿正文')
            sub.add_argument("--limit", type=int, default=20)
            sub.add_argument("--cursor", help='search 接續使用前次 INDEX:SHA256；list 使用保存 ID')
    args = parser.parse_args(argv)
    status = 0
    try:
        if args.command == 'delivery-inspect':
            from musiclab.common import json_text
            payload={}
            if args.text_file is not None:
                mode='text_search' if args.find_text is not None else 'text_window'
                payload[mode]={'file_name':args.text_file}
                if mode=='text_search':
                    if args.window_bytes is not None:raise ValueError('find-text與window-bytes不可混用')
                    payload[mode]['query']=args.find_text
                    if args.match_context:payload[mode]['include_context']=True
                elif args.max_matches is not None or args.match_context:raise ValueError('搜尋附加設定需明確find-text')
                for key,value in [('start_byte',args.start_byte),('max_matches',args.max_matches) if mode=='text_search' else ('max_bytes',args.window_bytes),('archive_sha256',args.archive_sha256)]:
                    if value is not None:payload[mode][key]=value
                if args.file_name:raise ValueError('text-file與file-name不可同時選用')
            elif any(value is not None for value in (args.start_byte,args.window_bytes,args.archive_sha256,args.find_text,args.max_matches)) or args.match_context:raise ValueError('原文設定需明確text-file')
            if args.comparison_report:payload['include_report']=True
            if args.compare_input:
                from musiclab.delivery_package import decode, MAX_REQUEST_BYTES
                with Path(args.compare_input).open('rb') as source:payload['baseline']=decode(source.read(MAX_REQUEST_BYTES+1))
            if args.file_name:
                result=inspect_delivery(args.input,True,limit_files=False,baseline=payload.get('baseline'),include_report=args.comparison_report,file_names=args.file_name)
            else:result=build('delivery_inspect',payload,delivery_source=args.input)
            if any(name.lower()=='delivery-inspection.json' for name in result.files):raise ValueError('選定原檔名與CLI摘要delivery-inspection.json衝突；請在工作台下載原檔，沒有寫出')
            paths=write_bundle(args.out,{'delivery-inspection.json':json_text(result.data),**result.files},args.overwrite)
            print('交付ZIP雜湊核對完成；選定原文'+str(len(result.files))+'檔，沒有創作品質驗收：'+paths[0]);return 0
        if args.command == 'delivery-package':
            from musiclab.delivery_package import decode, MAX_REQUEST_BYTES
            from musiclab.delivery_files import write_archive
            with Path(args.input).open('rb') as source: payload = decode(source.read(MAX_REQUEST_BYTES+1))
            prepared = prepare_delivery(payload)
            target = write_archive(args.out, prepared, args.overwrite)
            print(f'文字成果 ZIP 已建立：{target}；SHA-256 {prepared.summary()["sha256"]}')
            print('清單核對檔案位元組；不代表創作、媒體或收件接受。')
            return 0
        if args.command == "draft":
            if hasattr(sys.stdout, "reconfigure"):
                sys.stdout.reconfigure(encoding="utf-8")
            library = DraftLibrary(args.library)
            if args.draft_action == "backup":
                raw, result = export_library_backup(library, args.ids)
                write_backup(args.out, raw, library)
            elif args.draft_action == 'backup-export':
                payload = {'include_archive': args.include_archive}
                if args.ids is not None:payload['ids'] = args.ids
                result = build('draft_backup_export', payload, draft_library=library).wire()
            elif args.draft_action == 'search':
                from musiclab.library_search import cli_cursor
                result = build('draft_search', {'query': args.query, 'limit': args.limit, 'cursor': cli_cursor(args.cursor)}, draft_library=library).wire()
            elif args.draft_action in ("inspect", "restore"):
                payload = {"backup_sha256": args.sha256} if args.draft_action == "restore" else {}
                result = build("draft_backup_"+args.draft_action, payload, draft_library=library, backup_source=args.input).wire()
            else:
                payload = ({"draft": read_json(args.input), "label": args.label, "id": args.id or revision_id()} if args.draft_action == "save" else
                       {"id": args.id} if args.draft_action == "read" else {"limit": args.limit, "cursor": args.cursor})
                result = build("draft_" + args.draft_action, payload, draft_library=library).wire()
            print(json.dumps(result, ensure_ascii=False, allow_nan=False))
            return 0
        if args.command in ('music-review', 'storyboard-review', 'storyboard-timing-review', 'storyboard-shot-review'):
            if args.draft:
                from musiclab.draft_contract import validate_draft, MAX_DRAFT_BYTES
                if Path(args.draft).stat().st_size > MAX_DRAFT_BYTES + 3:
                    raise ValueError('欄位檢查的草稿檔最多1 MiB')
                draft = validate_draft(read_json(args.draft))
                if args.command == 'storyboard-shot-review':
                    if args.row is None:raise ValueError('--draft 必須搭配 --row 原始鏡號')
                    selected = draft['panels']['storyboard']
                elif args.command == 'storyboard-timing-review':
                    from musiclab.storyboard_timing_review import timing_panel
                    selected = timing_panel(draft['panels']['storyboard'])
                else:
                    selected = draft['panels'][args.command.removesuffix('-review')]
                payload = {'panel': selected}
                if args.command == 'storyboard-shot-review':payload['row'] = args.row
            else:
                if args.command == 'storyboard-shot-review' and args.row is not None:raise ValueError('--input 已含 row；不能另用 --row 覆蓋')
                payload = read_json(args.input)
            result = build(args.command.replace('-', '_'), payload)
            bundle = result.files
            status = 2 if result.data['issue_count'] else 0
        elif args.command == 'audio-acceptance-review':
            from musiclab.audio_acceptance_input import decode, MAX_BYTES
            with Path(args.input).open('rb') as source:
                document = decode(source.read(MAX_BYTES + 1))['document']
            result = build('audio_acceptance_review', {'document': document})
            bundle = result.files
            status = 2 if result.data['issue_count'] else 0
        elif args.command in ('lyrics-search', 'storyboard-search', 'music-search'):
            result=build(args.command.replace('-', '_'),read_json(args.input));bundle=result.files
        elif args.command in ('lyrics-review','lyrics-export-review'):
            payload=read_json(args.input)
            result = build('lyrics_export_review', {'package':payload,**({'include_package':True} if args.include_package else {})}) if args.command=='lyrics-export-review' else build('lyrics_review',payload)
            bundle = result.files
            status = 2 if result.data['issue_count'] else 0
        elif args.command == 'lyrics-seed':
            if args.seed:
                if args.title is not None: raise ValueError('--seed 不接受 --title 覆蓋')
                payload = {'seed':read_json(args.seed)}
            else:
                path=Path(args.text)
                if path.stat().st_size>64*1024+3: raise ValueError('純歌詞文字最多64 KiB')
                payload = {'title':args.title,'text':path.read_bytes().decode('utf-8-sig')}
            bundle=build('lyrics_seed',payload).files
        elif args.command == 'storyboard-seed':
            if args.seed:
                if args.fps is not None or args.bars_per_shot is not None:
                    raise ValueError('--seed 不接受 --fps／--bars-per-shot 覆蓋；請保留原起稿設定')
                payload = {'seed': read_json(args.seed)}
            else:
                payload = {'music': read_json(args.brief), 'fps': args.fps if args.fps is not None else 24,
                           'bars_per_shot': args.bars_per_shot if args.bars_per_shot is not None else 4}
            bundle = build('storyboard_seed', payload).files
        elif args.command in ("music", "storyboard"):
            bundle = build(args.command, read_json(args.brief)).files
        elif args.command == "lyrics":
            path = Path(args.input)
            from musiclab.lyrics_package import decode_document, is_legacy, MAX_PACKAGE_BYTES
            if path.stat().st_size > MAX_PACKAGE_BYTES + 3:
                raise ValueError('歌詞檔最多2 MiB')
            content = path.read_bytes().decode('utf-8' if path.suffix.lower() in ('.lrc','.srt') else 'utf-8-sig')
            parsed = decode_document(content) if path.suffix.lower() == '.json' else None
            package_input = isinstance(parsed, dict) and (is_legacy(parsed) or {'format', 'schema_version'} & set(parsed))
            if package_input:
                if args.title is not None or args.duration is not None or args.shift is not None or args.set or args.text:
                    raise ValueError('完整歌詞包檢查不可使用 --title／--duration／--shift／--set／--text 覆蓋')
                payload = {'package': parsed}
                if args.legacy_json:
                    if not is_legacy(parsed): raise ValueError('--legacy-json 只用於完整舊歌詞包')
                    payload['allow_legacy'] = True
            else:
                if args.legacy_json: raise ValueError('--legacy-json 只用於完整舊歌詞包')
                payload = {'content': content, 'suffix': path.suffix}
                for key, value in (('title', args.title), ('duration', args.duration), ('shift_seconds', args.shift)):
                    if value is not None: payload[key] = value
                if args.set: payload['time_changes'] = args.set
                if args.text: payload['text_changes'] = args.text
            bundle = build('lyrics', payload).files
        else:
            options = {name: getattr(args, name) for name in ("profile", "rates", "bits", "channels") if getattr(args, name) is not None}
            if args.acceptance_draft:
                if options: raise ValueError('--acceptance-draft 不能與 --profile／--rates／--bits／--channels 混用')
                from musiclab.audio_acceptance_input import decode, MAX_BYTES
                with Path(args.acceptance_draft).open('rb') as source:
                    options = {'acceptance_draft': decode(source.read(MAX_BYTES + 1))['document']}
            result = build("audio", options, audio_source=args.input)
            bundle = result.files
            status = 2 if result.needs_review else 0
        paths = write_bundle(args.out, bundle, args.overwrite)
    except (ValueError, OSError, TypeError, KeyError) as error:
        print(f"錯誤：{error}", file=sys.stderr)
        return 1
    print(f"{args.command} 完成，輸出 {len(paths)} 個檔案：{Path(args.out).resolve()}")
    if args.command == 'storyboard-seed':
        print('時間起稿尚未完成分鏡；請依實際音檔校準，並人工編寫畫面、運鏡、轉場與人物狀態。')
    if args.command == 'lyrics-seed':
        print('未校時歌詞起稿已建立；沒有猜測時間，請依實際音檔標記開始與結束。')
    if status == 2:
        print("已完成條件檢查；有待修正項目，詳見 audio-acceptance-review.md。" if args.command == 'audio-acceptance-review' else
              "已完成分鏡欄位檢查；有待修正項目，詳見 storyboard-review.md。" if args.command == 'storyboard-review' else
              "已完成歌曲欄位檢查；有待修正項目，詳見 music-review.md。" if args.command == 'music-review' else
              "已完成校時檢查；有待修正項目，詳見 lyrics-review.md。" if args.command == 'lyrics-review' else
              "已完成格式檢查；完整 JSON 請另存，詳見 lyrics-export-review.md。" if args.command == 'lyrics-export-review' else
              "已完成分析，有需確認項目；詳見 report.md。")
    return status


if __name__ == "__main__":
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    raise SystemExit(main())
