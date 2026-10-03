# 本機 Agent 接口 v1

`music_lab_agent.py` 是 JSON-lines 的本機 adapter。v0.4 另提供 `music_lab_mcp.py`；兩個格式與入口各自獨立。沒有模型、網路、憑證或工具安裝要求。可讓不同 Agent 以子程序呼叫同一套領域操作；目前已驗證本機子程序，不宣稱任何特定 Agent 平台已整合。

查看能力：

```powershell
python music_lab_agent.py --describe
```

一個 request 一行 JSON，UTF-8，每行最多 2 MiB：

```json
{"protocol_version":1,"id":"lyrics-001","operation":"lyrics","payload":{"content":"[00:00.000]這次換我回答","suffix":".lrc","title":"原創示例","duration":3}}
```

在 PowerShell 將它存到 `request.json` 後：

```powershell
Get-Content -Raw -Encoding utf8 request.json | python music_lab_agent.py > response.jsonl
```

成功時回傳 `ok: true`、相同 id，及 result.files／data／meta。files 是創作成果檔名與內容，由呼叫者決定保存。預設 Agent 不寫檔；啟動時明確啟用草稿庫後，draft_save 與 v0.10 的 draft_backup_restore 在所選庫建立不可覆寫版本。失敗回傳 `ok: false` 與 error.code／message，stdout 不混入狀態文字或 traceback。錯誤 request 不會阻止下一行正常 request。

五種 operation：music、storyboard、lyrics、audio、storyboard_seed。前兩者 payload 對應 examples 的需求 JSON；歌詞採 content／suffix 或 cues，另可含 title／duration。音訊來源必須透過啟動參數明確選定：

```powershell
Get-Content -Raw -Encoding utf8 audio-request.json | python music_lab_agent.py --audio '指定作品.wav' > response.jsonl
```

音訊 payload 可含 profile（distribution／video）及 rates／bits／channels 接受條件。JSON 不接受 path 等檔案來源欄位，只能分析此程序啟動時選定的 WAV；保持原檔。這仍是人工選定的本機工作流。

常見 error.code：invalid_request、invalid_input、request_too_large、invalid_encoding、io_error、internal_error。缺少實際媒體時不產生音樂／影片；meta.needs_review 表示有需檢視項目，不能視為音樂品質保證。

授權為 PolyForm Noncommercial 1.0.0，見 LICENSE／NOTICE。商業使用沒有由本版授權。

## MCP stdio adapter

`music_lab_mcp.py` 以 Python 標準函式庫實作，所有工具呼叫同一個 application.build，不複製領域計算。明確支援 MCP `2025-11-25`，並非宣稱最新版。未知版本的 initialize 回傳 -32602 及 supported 清單；呼叫者可明確選支援版再重試。2026 的 stateless server/discover 未實作，回傳 -32601。

以使用的 MCP host 設定 command=`python`，args 第一項為此版 `music_lab_mcp.py` 的完整路徑。需分析音訊時在 args 明確加入 `--audio` 與所選 WAV 的路徑；JSON payload 不可選其他音檔。伺服器不開網路埠，EOF 退出；不自動安裝全域設定或取得其他工具權限。

連線順序：initialize → notifications/initialized → tools/list 或 tools/call。工具名稱：music_plan、storyboard_plan、lyrics_validate、audio_report、storyboard_seed。每個工具的 arguments 都有一個 payload 物件；歌曲／分鏡使用 examples 的需求格式，其餘與上方 JSON-lines 的 payload 相同。tools/list 提供參數描述與 schema。

最小請求範例，每個 JSON 各一行：

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"my-client","version":"1.0"}}}
{"jsonrpc":"2.0","method":"notifications/initialized"}
{"jsonrpc":"2.0","id":2,"method":"tools/list"}
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"lyrics_validate","arguments":{"payload":{"content":"[00:00.000]原創測試","duration":3}}}}
```

回應的 structuredContent 與 text 內容都包含 files/data/meta；files 是文字內容，不是已保存的檔案。meta.protocol_version=1 是共用應用結果的原有版本，MCP transport 版本以握手的 protocolVersion 為準。程式不呼叫 AI；有 review/warnings 仍需人工判斷。

未知方法／工具是 JSON-RPC error；領域或 payload 錯誤是 isError=true 的工具結果。錯誤行不終止後續有效請求。每行上限 2 MiB，UTF-8；notifications 沒有回應。只宣告靜態 tools；沒有 resources/prompts、HTTP MCP、Tasks、背景作業、主動要求權限或模型 sampling。同步呼叫不提供執行中的取消／進度通知，host 應設定逾時並管理子程序。

本輪以獨立子程序完成握手、發現四工具、實際呼叫四操作、錯誤恢復與 EOF 結束，成果比對共用 application；沒有把此服務安裝進 Codex 或其他 Agent，特定 host 與官方 conformance suite 尚未驗證。

規格研究僅採官方文件：[2025 lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle)、[stdio transport](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)、[tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)、[2026 versioning](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/versioning.mdx)。未搬入第三方程式或素材。

## v0.5：產生目前版本的啟動設定

在解壓後的專案目錄執行：

```powershell
python scripts/agent_launch.py
python scripts/agent_launch.py --format codex
```

第一個指令顯示 JSON command／args／逾時設定，第二個顯示 `[mcp_servers.zoe_music_lab]` TOML 片段。command 為執行此指令的 Python 完整路徑，args 為本版 `music_lab_mcp.py` 完整路徑；移動專案或更換 Python 後重新產生。音檔仍由使用者明確加入 `--audio` 與指定 WAV 路徑。JSON descriptor 含 Codex 的逾時欄位，其他 host 應依其設定格式採用 command／args，不直接假設格式相同。

工具只列印設定，沒有寫入全域檔案、啟動 host 或取得其他工具權限。由使用者依選定 host 的設定方式加入片段後，仍需驗證連線與一次實際工具呼叫；不要把 `mcp get` 的成功當成可呼叫證明。

本輪已由生成的 command／args，在另一個暫存工作目錄啟動實際 MCP 子程序，完成握手與 `lyrics_validate`，核對歌詞成果，EOF 退出且不寫檔。另以本機 `codex-cli 0.153.4` 的 `mcp get --json` 與臨時 `-c` 覆寫解析設定，command／args 與生成值一致；只顯示本工具的白名單 metadata，不讀出其他服務或秘密，沒有修改全域設定。此項沒有建立服務連線，也沒有呼叫模型。實際 Agent host、官方 conformance、跨 host 與 2026 MCP 支援仍未完成。

## v0.6：把需求交回工作台

music_plan／JSON-lines music 的 `result.files["brief.json"]`、storyboard_plan／storyboard 的 `result.files["mv-brief.json"]` 是文字內容。由呼叫者明確保存這兩個成果後，工作台可選需求類型、讀入檔案、看預覽／待審查項目，再載入指定工作台，繼續人工編修。Adapter 仍不自動寫檔，不執行文件裡的指令、不安裝 host。

歌曲回讀需含 arrangement、BPM、memory_hook 等設計需求，分鏡需含 motifs。既有簡單 CLI 格式仍可使用 CLI；UI 不猜測或填造缺失的設計資訊。未知欄位／UI 無法保存的畫幅或容量拒絕；整個 response envelope 或 music-plan／storyboard 結果檔需保留作參考，不能直接當輸入。

本輪以實際 MCP 子程序呼叫兩工具，將回傳 brief 檔載入瀏覽器、人工確認、重建、真正下載；歌曲 brief 與來源完全一致，分鏡共用領域輸出一致。另有 Python → 生產 JS 轉換層 → Python 的實跑往返測試。這證明 artifact 交接，沒有宣稱任何特定 Agent host 已安裝或呼叫模型。

lyrics 結果的 timing metadata 區分總時長來源與逐句結束補齊；duration_estimated 保留舊語義，不能直接解讀為 SRT 尾句被估計。音檔分析入口與授權不變。

## v0.7：可探索的工具契約

musiclab/tool_contracts.py 集中宣告四工具的 JSON Schema 2020-12 資料形狀；MCP inputSchema 包含 payload，JSON-lines --describe 與 HTTP /api/capabilities 的 input_schemas 直接描述 payload。兩者共用同一份契約，output_schema／outputSchema 描述成功回應的 files/data/meta。files 是文字內容，不代表已寫入磁碟；data 隨操作而異，meta.protocol_version 仍為 1。

歌曲列出 language／avoid／deliverables、BPM／小節／能量／記憶點及現代／舊版條件；分鏡列出母題、鏡頭欄位與方向；歌詞明確選 cues 或 content 原文，cues 不搭 suffix；音訊列出接受條件與啟動選定媒體的限制。未知額外註記仍按原領域流程處理，不把工具 schema 當 UI 能完整回讀所有第三方格式的承諾。

schema 不執行計算，也沒有新增 runtime validator。application／domain 仍驗證有限數字、時間覆蓋、母題引用與 PCM；跨 adapter 的來源衝突由 application 拒絕，音訊正整數條件由 audio 層在開檔前檢查。JSON 的 1.0 等整數值會轉為 1，true 不會當 1。

tools/call 明確提供非物件 arguments（包括 null）時回 -32602；payload 的內容或領域錯誤仍回 isError=true。缺少 payload 的物件仍是可修正的工具輸入錯誤。回應後可繼續呼叫；同步執行與 EOF 退出不變，execution.taskSupport=forbidden。

來源核對：[MCP 2025-11-25 Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) 定義 inputSchema、outputSchema 與兩種錯誤；[Lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle) 定義初始化／退出。本專案依既有規則拒絕未知 transport 版本，不把此行為宣稱為完整官方 conformance；仍僅支援 2025-11-25。

本輪使用已安裝 jsonschema 4.26.0 作開發核對，沒有安裝或新增依賴：八份 schema 通過 meta-schema 檢查；七次真實 stdio 呼叫涵蓋四工具與兩種舊版企劃，成功輸入／成果皆符合 schema 並與共用 application 一致，錯誤範例被 schema 拒絕。這不是特定 Agent host 接入或模型執行證明。

## v0.9：明確啟用草稿庫

未帶草稿庫參數時，仍只有原有四個操作／MCP 工具，不讀寫任何草稿庫。明確指定目錄後，兩個 adapter 才增加 draft_save、draft_list、draft_read，共用相同 application、草稿形狀與保存層：

```powershell
python music_lab_agent.py --draft-library outputs/drafts --describe
python music_lab_mcp.py --draft-library outputs/drafts
python scripts/agent_launch.py --format codex --draft-library outputs/drafts
```

第二行是由 host 管理的 stdio 入口，EOF 退出；第三行只印出 command／args，不啟動 host 或更動設定。移動 checkout 後重新產生。明確選相同的庫即可和工作台／CLI 交換保存版本，不由 request JSON 決定路徑。

| 操作／MCP 工具 | payload | 成功 data |
| --- | --- | --- |
| draft_save | id、label、完整草稿 v3 的 draft | entry、reused、status |
| draft_list | 可選 limit（1–100，預設 20）、cursor（上一頁 next_cursor） | entries、next_cursor、issues、status |
| draft_read | id | entry、draft、status |

外層格式保持 JSON-lines 的 protocol_version／id／operation／payload，或 MCP arguments.payload。request id 與草稿版本 ID 是兩個不同欄位；草稿 ID 需為 `draft-` 加 32 個小寫十六進位字元。label 為 1–200 字元的非空白文字，草稿保存上限 1 MiB，單庫最多 1000 版。讀取回應的 data.draft 可下載或匯入；整個 envelope 不是草稿。

draft_save 會實際寫入選定目錄，MCP readOnlyHint=false／destructiveHint=false／idempotentHint=true。相同 ID＋完整內容＋名稱才可重試，reused=true 表示沿用原保存時間及紀錄；不同內容拒絕，不能覆寫。逾時／io_error 不足以判定磁碟未保存，保留原 ID／內容重試或先 draft_read 確認。新內容使用新 ID。其他兩個草稿工具為讀取。

files 為空；保存／讀取 meta.needs_review=true，status=draft_only_not_validated。保存只證明已檢查資料形狀，未完成小節／校時可以保留；必須回到四工作台重新驗證創作與時間。list 狀態 metadata_only_checksum_verified_on_read 表示沒有逐份讀取草稿，讀取時才核對摘要。讀取壞版本拒絕，不遷移或修補檔案。

產品 0.9.0、草稿 schema 3、保存紀錄 schema 1、Agent 1 與 MCP 2025-11-25 分別管理。能力查詢提供啟用狀態、容量及同源輸入 schema，不回傳草稿庫的機器路徑。已有 Windows 真實 JSON-lines／MCP／CLI／HTTP 往返與另一工作目錄的 launcher 驗證；特定 Agent host、模型執行、POSIX 及官方 conformance 尚未驗證。草稿庫與原始碼封裝／Git 還原點分開，使用者需另行備份。


## v0.10：選定備份的預覽與恢復

預設仍為四工具；明確帶 --draft-library 時共九工具，新增 draft_backup_inspect／draft_backup_restore。這兩工具還需啟動時選定 --draft-backup，不能從 payload 指定 path／input 或更換庫目錄。能力查詢只回傳 source_selected、backup schema 與容量，不洩出機器路徑。

```powershell
python music_lab_agent.py --draft-library outputs/restored-drafts --draft-backup '構思備份.zip' --describe
python scripts/agent_launch.py --draft-library outputs/restored-drafts --draft-backup '構思備份.zip'
```

產生器仍只列印所選路徑的可審閱 command／args，不安裝或啟動 host。JSON-lines：

```json
{"protocol_version":1,"id":"preview-1","operation":"draft_backup_inspect","payload":{}}
```

inspect 的 result.data 包含 backup_sha256、entry_count、new_count／reused_count、conflicts、capacity_ok／can_restore、原名稱／時間清單；status=backup_validated_not_restored。檢查整份 ZIP，不寫入庫，也不以未審查 placeholder 代替缺失草稿。

確認結果後，draft_backup_restore 的唯一 payload 欄位為 backup_sha256，值需使用此次 inspect 的結果。MCP 外層一樣使用 tools/call 的 arguments.payload；inspect readOnlyHint=true，restore=false／destructiveHint=false／idempotentHint=true。files 為空，恢復 data 回傳 added_count／reused_count／entry_count，status=restored_drafts_need_creative_validation，needs_review=true。

restore 再讀有界來源、核對相同 SHA 與所有版本，鎖內再次檢查衝突／容量。原始 record／draft 檔完全相同才重用，已存在但不同的 ID 拒絕；不覆寫／遷移。io_error 或未知回應可能已發布部分完整新版本，保持同一份備份重試，或先 inspect；不用新 ID 或變更備份規避衝突。已知衝突／未知 schema／毀損在新版本寫入前拒絕。

ZIP 上限 32 MiB、展開 64 MiB、每版 draft 1 MiB／metadata 16 KiB、單庫 1000 版。備份 binary 不經 JSON-lines／MCP base64；匯出使用 CLI draft backup 或工作台，超限可 CLI --ids 明確分批。備份只含已保存草稿及紀錄，不含媒體、成果、未保存編修或刪除歷史；恢復不套用工作台內容，需另行明確載入／重建創作成果。

產品 0.10.0／Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 分別管理。Windows 實際 JSON-lines、由生成 command／args 啟動的 MCP、CLI／HTTP 往返與三程序同 ZIP 恢復已驗證；不是特定 Agent host、模型執行、POSIX 或官方 conformance 的證明。


## v0.11：同一歌詞操作的整批與逐句編修

lyrics（MCP lyrics_validate）的來源仍明確二擇一：cues，或 content＋suffix。新增可選 payload：

| 欄位 | 形狀與行為 |
| --- | --- |
| shift_seconds | 有限十進位數字或數字字串；正數延後、負數提前，已有 start／end 一起移動 |
| time_changes | 字串陣列，例如 ["1=2"]；修改開始，有明確 end 時保留原句長 |
| text_changes | 字串陣列，例如 ["2=新的歌詞"]；文字空白保留，仍只接受單行 |

```json
{"protocol_version":1,"id":"timing-001","operation":"lyrics","payload":{"cues":[{"start":1,"end":2,"text":"原創一"},{"start":4,"end":5,"text":"原創二"}],"duration":10,"shift_seconds":0.5,"time_changes":["1=2"],"text_changes":["2=第二句後修"]}}
```

輸出第一句 2–3、第二句 4.5–5.5，duration 仍為 10。句號先按原始開始時間排序，由 1 起算；先 shift，再逐個 time_changes／text_changes，最後重排／檢查。原始負時間拒絕；最終負時間、重疊、重複開始或超過指定總長整份拒絕，沒有截斷。缺失 end 在編修後推得，LRC offset 只套用一次。time_changes／text_changes 型態錯誤不是成功 no-op。

時間以毫秒整數運算，半毫秒往遠離零捨入；布林值、非有限值、非十進位字串及不能保留毫秒精度的值拒絕。timing.applied_shift_seconds 僅在明確傳入 shift_seconds 時新增，表示套用的正規化量；沒有宣稱實聽驗收。非零 shift 或非空編修清單的成功結果 needs_review=true；原有總長／推得時間提醒仍保留。輸出 files 仍是內容，由呼叫者決定保存，Agent 不因此寫檔。

實際 CLI／HTTP／JSON-lines／MCP 與 application 結果一致；discovery 同源新增欄位，預設四工具／啟庫九工具不變。產品 0.11.0，transport 與草稿／保存／備份 schema 不變；尚未接入特定 host，沒有模型呼叫。

## v0.12 音檔結果的來源證據

既有 audio／audio_report 回傳新增 data.source_evidence：bytes、analysis_source（copied_bytes）、wave_format_tag（1）、block_align、average_bytes_per_second、declared_riff_bytes。data.sha256 與量測使用同一次複製的位元組，沒有 hash 後再次開原路徑；不是外部改檔的原子快照或著作權證明。JSON／Markdown 同源，不含暫存或原資料夾路徑。

PCM fmt 不一致或截斷會明確失敗；來源保留，錯誤後可再呼叫。接受值可自訂但不擴大已支援格式；多聲道不解讀位置，仍有 needs_review。報告沒有提醒只表示本次技術檢查通過，不能當實聽、LUFS／true peak、完整 RIFF conformance 或版權驗收。

產品 0.12.0；Agent v1／MCP 2025-11-25 不變，預設四／明確啟庫九工具，未新增 JSON 路徑選擇、工具或權限，特定 host 未整合。

## v0.13 設計結果在工作台的接收

music／storyboard及MCP的music_plan／storyboard_plan仍共用同一application結果。工作台新增純planning-review呈現modern設計資料；只接收當前編修版本對應的結果，過期不取代，修改後既有摘要標為上一份設計。由Agent／CLI接續需求的預覽／載入流程保持；設計結果本身不被當成草稿或生成媒體。

本版真正CLI四／五檔UTF-8 bytes、HTTP、JSON-lines壞後好、MCP握手／discovery／call與application已核對，純模型也測真正application結果。產品0.13.0；Agent1／MCP2025-11-25、四／九工具與草稿／保存／備份schema不變；特定host未整合，沒有模型呼叫或權限新增。

## v0.14 分鏡時間起稿

新增 JSON-lines operation／MCP tool `storyboard_seed`，HTTP `/api/storyboard-seed`；payload 為 `{ "music": 現代歌曲brief, "fps": 24, "bars_per_shot": 4 }`。只接受 music／fps／bars_per_shot，music 必須含 arrangement／bpm／memory_hook 與歌曲基本欄位。fps1–120；bars_per_shot為1–128整數（預設4）。重新讀取 discovery，不硬編碼工具數；目前預設五／啟庫十工具。readOnlyHint=true，Agent 不自行寫檔／生成媒體，CLI依明確out寫檔且預設拒絕覆寫。

回應 files 含 storyboard-seed.json／md，data為 format=zoe-storyboard-seed、schema_version1、status=timing_seed_incomplete。source記錄固定BPM／拍數／段落，小節1-based閉區間；時間end及end_frame_exclusive為排他端點。slots只有時間、影格、小節、段落與來源敘事任務，沒有畫面／人物的虛構內容；needs_review永遠true。上限1000鏡、不足一影格拒絕，時間須按實際歌曲校準。

此中間JSON不能當mv-brief載入。瀏覽器先讀歌曲brief，再預覽／套用自己的起稿；或由協作Agent根據slots補寫創作欄位、另交完整mv-brief並經storyboard驗證。不能把未完成seed當完成分鏡。純模型版本拒絕與late回應保護見ARCHITECTURE，CLI／HTTP／JSON-lines／真正五工具MCP及瀏覽器草稿往返見QA-v0.14.0。沒有特定host安裝／模型工具呼叫驗收。

## v0.15 起稿檢查與瀏覽器接續

storyboard_seed沿用原工具，增加payload `{ "seed": 已生成的zoe-storyboard-seed資料 }`。不可與music／fps／bars_per_shot混用。tools/list、--describe與/api/capabilities提供oneOf和完整seed schema；需要新功能先重新discovery，不硬編碼只接music。預設五／啟庫十工具不變。

validate_seed精確核對source段落與BPM／拍數／bars推得時間、所有slots／小節／影格和來源敘事任務。傳入未知版本、未知欄位（包括新增visual）、不完整／非有限值／矛盾狀態都拒絕，不修正或丟失。創作由Agent發展時另交完整mv-brief；時間seed不是成片或完成分鏡，needs_review=true。

CLI `storyboard-seed --seed 起稿.json --out 新目錄`檢查並輸出兩檔，不能覆蓋FPS或每鏡小節設定；原檔保留，重跑預設拒絕覆寫。瀏覽器用「接續Agent／CLI起稿」選JSON，預覽後才套用；不要求目前歌曲與檔案同名，保留目前歌曲及其他panel／音檔。目標分鏡修改後重新預覽，沒有靜默覆蓋。

本輪真正MCP stdio產生→CLI同bytes→IAB讀回→下載JSON／draft3與撤回、錯誤恢復已驗；特定Agent host／模型仍未接入，沒有擴大權限。數字格式／換行可重新排版，保留JSON語義，沒有原檔bytes不變的下載宣稱。
