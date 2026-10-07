# 本機 Agent 與 MCP：目前使用指南

先取得當前 discovery，再按回傳的 input／output schema 選操作。CLI、HTTP、JSON-lines Agent 與 MCP 共用 `musiclab.application.build`；工具整理文字與 PCM 證據，不呼叫模型或外網。

## JSON-lines Agent

在 Repo 根目錄執行：

```powershell
python -X utf8 music_lab_agent.py --describe
```

目前有 **22 個基本操作**。描述含 protocol、產品版本、schemas、容量、可用操作與各領域能力。啟動未指定草稿庫時沒有保存／恢復能力。

啟動 `python -X utf8 music_lab_agent.py` 後，stdin 每行一份嚴格 UTF-8 JSON，stdout 每行一份回應。下列是可直接提交的未校時歌詞起稿範例：

```json
{"protocol_version":1,"id":"guide-seed","operation":"lyrics_seed","payload":{"title":"Synthetic lyric seed","text":"First line\nSecond line"}}
```

成功回應有相同 `id`、`ok:true` 及 `result.files`／`data`／`meta`；此例 `data.status` 為 `untimed`，不猜時間。失敗有 `ok:false` 和 `error.code`／`message`。輸入與回應依 protocol1，不把產品 v0.159.0 當協定版本。終止時關閉 stdin，正常 EOF 離開；只有呼叫命令不代表 Host 已安装。

## MCP stdio

在 Repo 根目錄以 `python -X utf8 music_lab_mcp.py` 啟動。Host 使用此 entrypoint 的實際完整路徑並傳相同參數；Host 設定方式依該 Host，不假定其目前工作目錄。

支援 MCP **2025-11-25**，順序如下。每段 JSON 各佔一行；initialized 是 notification，沒有回應。

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"MusicLabGuide","version":"1"}}}
{"jsonrpc":"2.0","method":"notifications/initialized"}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"lyrics_seed","arguments":{"payload":{"title":"Synthetic lyric seed","text":"First line\nSecond line"}}}}
```

呼叫參數只有 `arguments.payload`；不要將 Agent 的 `operation`／`protocol_version` 包進 MCP arguments。tools/list 回傳當前 inputSchema／outputSchema，tools/call 回傳 `structuredContent`、相同 JSON 的文字 content 與 `isError`。工具錯誤與 JSON-RPC 錯誤分開處理，不把 `needs_review` 當執行失敗。

## 選擇操作

| 使用情境 | Agent operation | MCP tool |
| --- | --- | --- |
| 完整歌曲需求 | `music` | `music_plan` |
| 完整分鏡需求 | `storyboard` | `storyboard_plan` |
| 歌詞輸入／完整包檢查 | `lyrics` | `lyrics_validate` |
| 明確選定 PCM WAV | `audio` | `audio_report` |
| 未完成歌曲／分鏡／歌詞待辦 | `music_review`／`storyboard_review`／`lyrics_review` | 同名 |
| 原列與原文搜尋 | `music_section_review`／`storyboard_shot_review`／`lyrics_cue_review`；各自 `*_search` | 同名 |
| 時間／歌詞起稿 | `storyboard_seed`／`lyrics_seed` | 同名 |
| 格式／原始接受條件診斷 | `lyrics_export_review`／`audio_acceptance_review` | 同名 |
| 完整／指定原列草稿比較 | `draft_compare`／`draft_compare_row` | 同名 |
| 文字封裝與完整 ZIP 核對 | `delivery_package`／`delivery_inspect` | 同名 |

表格是入口索引，完整 22 操作以 discovery 為準，另含 `storyboard_timing_review`。未完成原值診斷不能替代完整創作、時間、媒體或實聽接受。原列號從 1 起；搜尋接續要使用原回應的來源 SHA，不以原檔名猜測來源。

## 明確啟用來源與保存能力

音檔使用啟動參數 `--audio` 選 WAV；文字 ZIP 用 `--delivery-zip`；草稿库用 `--draft-library`。只有明確選庫才增加 **7 個操作／工具，合計29**。備份來源 `--draft-backup` 要同時選庫，JSON不能選來源或目的路徑。不要自行啟用使用者尚未選定的路徑、媒體或保存能力。

庫版本不可覆寫；恢复只新增／重用完整版本，保留原ID／時間／位元組，先核對指定備份 SHA。文字檔與封裝結果預設以回應交給呼叫者，Agent／MCP 不自動將 `files` 寫到任意路徑。

## 邊界與交接

每行request最多2MiB、JSON最大64層；重複鍵、非法Unicode、非有限數字、未知版本與未知欄位拒絕，不能靜默修補／遷移。領域各有更小上限，依 discovery/schema。交付ZIP的原檔選取JSON及inline archive有512KiB限制；大資料先明確選定来源，再用來源釘定的有界分段／搜尋，不擴大inline限制。

`meta.needs_review` 提醒人工審閱；計數零也不能宣稱創作、音畫、保存或權利通過。不要把response、預覽、雜湊或瀏覽器click當實際保存證明。保留原始需求、來源與回應；編修後重建成果，匯入工作台先預覽再明確套用。

資料層以 [projects.json](../projects.json)、[版本policy](../musiclab/assets/delivery-versions.json)及各domain契約為準。起步讀[開始指南](START-HERE.md)，分層讀[架構](ARCHITECTURE.md)。PolyForm Noncommercial1.0.0，禁止商用；不授予AGPL。先前接口與迭代文字原文保留於[截至v0.154歷史](AGENT-HISTORY-through-v0.154.0.md)，舊工具數／狀態不可當現行discovery。
