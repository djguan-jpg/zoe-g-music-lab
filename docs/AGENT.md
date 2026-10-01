# 本機 Agent 接口 v1

這是 JSON-lines 的本機 adapter，**不是 MCP server**。沒有模型、網路、憑證或工具安裝要求。可讓不同 Agent 以子程序呼叫同一套領域操作；目前已驗證本機子程序，不宣稱任何特定 Agent 平台已整合。

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

成功時回傳 `ok: true`、相同 id，及 result.files／data／meta。files 是成果檔名與內容，Agent adapter 不寫入磁碟；是否保存由呼叫者決定。失敗回傳 `ok: false` 與 error.code／message，stdout 不混入狀態文字或 traceback。錯誤 request 不會阻止下一行正常 request。

四種 operation：music、storyboard、lyrics、audio。前兩者 payload 對應 examples 的需求 JSON；歌詞採 content／suffix 或 cues，另可含 title／duration。音訊來源必須透過啟動參數明確選定：

```powershell
Get-Content -Raw -Encoding utf8 audio-request.json | python music_lab_agent.py --audio '指定作品.wav' > response.jsonl
```

音訊 payload 可含 profile（distribution／video）及 rates／bits／channels 接受條件。JSON 不接受 path 等檔案來源欄位，只能分析此程序啟動時選定的 WAV；保持原檔。這仍是人工選定的本機工作流。

常見 error.code：invalid_request、invalid_input、request_too_large、invalid_encoding、io_error、internal_error。缺少實際媒體時不產生音樂／影片；meta.needs_review 表示有需檢視項目，不能視為音樂品質保證。

授權為 PolyForm Noncommercial 1.0.0，見 LICENSE／NOTICE。商業使用沒有由本版授權。
