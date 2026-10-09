# ZOE. G Music Lab

接續現成剪輯工具的字幕與素材，做本機核對、保存與交接。署名 ZOE. G；GitHub djguan-jpg。採 PolyForm Noncommercial 1.0.0，禁止商用。

v0.172.0 依使用者要求隱藏編輯器，頁面只保留三條流程：

- **字幕交付**：匯入已校時 SRT／LRC／歌詞 JSON，確認後建立標準字幕與格式報告。
- **音檔核對**：分析 PCM WAV 的規格、音量與削波風險，建立原檔報告。
- **素材交接**：重開本工具 `.zoemv.json`，核對原音檔、圖片與文字，再保存或下載 Agent 企劃。

不再把人工校時與簡易 MV 編輯器當主要產品。這些元件保留在隱藏容器；頁面不自動填入示範企劃。現成工具已有成熟能力，交接與核對能否省事仍需真實作品驗證，見[實用性與取捨](docs/PRODUCT-UTILITY.md)、[本版 QA](docs/QA-v0.172.0.md)及[交接](docs/HANDOFF-v0.172.0.md)。本工具不是 CapCut、Kdenlive 或 DAW 原生專案轉換器。

## 先開始一份作品

取得本 Repo，在根目錄開啟終端。需要 Python 3.10 以上及支援原生 File／Blob 的現代瀏覽器；沒有第三方 Python 套件或模型金鑰。

```powershell
python -X utf8 music_lab_server.py
```

開啟 <http://127.0.0.1:8875/>，選擇字幕交付、音檔核對或素材交接，載入已完成的字幕、PCM WAV 或本工具的素材專案。建立成果後主動下載、保留原始素材；下載後可選回檔案核對完整原文。結束時在終端按 Ctrl+C。伺服器只綁定 127.0.0.1，音檔、影片和私人素材不進 Git。

下一步讀[開始指南](docs/START-HERE.md)：第一次使用、CLI 可執行範例、檔案接續、草稿與常見結果狀態。Agent 使用者直接讀[目前接口指南](docs/AGENT.md)；先 discovery，再依當前 schema 呼叫工具。

原編輯器的校時與撤回契約仍保留供舊流程相容，見[寫入接受規則](docs/LYRICS-TIMING-ACCEPTANCE.md)；目前一般介面不提供這些編輯操作。

## 保存、版本與授權

素材專案保留原企劃、音檔與圖片；沒有自動保存，離頁警示不能替代主動保存。原純文字草稿／成果與草稿庫接口仍保留供 CLI 使用。要使用本機不可覆寫版本庫，請依開始指南明確指定 `--draft-library`。原檔保留，CLI 預設拒絕覆寫，只有明確 `--overwrite` 才替換指定輸出。

四個專案採 **PolyForm Noncommercial 1.0.0，禁止商用**；保留 [LICENSE](LICENSE)／[NOTICE](NOTICE)。没有另授予 AGPL 或商用許可。AI 協作與發起署名見 [FOUNDER-RECORD.md](FOUNDER-RECORD.md)；既有四份自由工坊投稿仍為作者自行聲明、尚未核實，狀態見 [PLATFORM-STATUS.json](PLATFORM-STATUS.json)。

此候選來源版本 **v0.172.0**；正式發佈需完整接受、精確封裝及指定資安掃描結果，狀態見[本版 QA](docs/QA-v0.172.0.md)。產品與協定分開管理，以 [projects.json](projects.json) 和 [delivery-versions.json](musiclab/assets/delivery-versions.json) 為準。更新與驗收讀 [CHANGELOG](CHANGELOG.md)／[本輪交接](docs/HANDOFF-v0.172.0.md)，開發讀[分層架構](docs/ARCHITECTURE.md)。舊 README 原文保留在[截至 v0.154 的歷史](README-HISTORY-through-v0.154.0.md)；歷史中的舊版本、舊工具數與舊平台狀態不代表現況。
