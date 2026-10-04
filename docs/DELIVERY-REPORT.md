# 可保存的交付差異報告（v0.41）

選取文字交付 ZIP，核對完成後可按「下載差異 JSON」或「下載差異 Markdown」，保存載入前的審閱摘要。報告包含來源 ZIP 的 bytes／SHA-256、原始 manifest、完整差異計數與每檔兩側 bytes／SHA；不含成果原文、音檔、來源路徑或時間戳。報告不修改表單或套用成果，仍須另外明確載入。修改表單／成果、更換媒體、切換工作台、取消或更換選檔後，舊報告下載停用；重新選 ZIP 核對。

JSON 保留來源說明原字串；Markdown 將 HTML、Markdown 語法與控制字元顯示為字面文字。來源的說明與檔名仍可能含使用者提供的資訊，分享前請自己確認。檔案摘要不代表作者、素材權利、實唱／實聽或媒體品質驗收。

## CLI 與 Agent

```powershell
python music_lab.py delivery-package --input examples/delivery-request.json --out outputs/my-delivery
python music_lab.py delivery-inspect --input outputs/my-delivery/zoe-delivery.zip --compare-input examples/delivery-baseline.json --comparison-report --out outputs/review
```

這會寫 `delivery-inspection.json`、`delivery-comparison.json`、`delivery-comparison.md`。沒有 `--comparison-report` 時維持既有單份 inspection；報告必須有明確的 baseline。原 ZIP／baseline 保持。預設不覆寫；另一程序在預檢後建立同名檔案時也會拒絕並保留該檔案。多檔輸出沒有交易式回滾，較早的新檔可能已寫出，錯誤會提示檢查目錄。只有明確 `--overwrite` 才替換指定正常檔案。

JSON-lines operation／MCP tool 仍為 `delivery_inspect`，payload 如下：

```json
{"baseline":{"scope":"music","files":{}},"include_report":true}
```

`include_report` 為嚴格布林值，要求 baseline，不能同時 `include_files:true`，避免報告檔名碰撞原成果。files 回傳兩個固定報告；data 保持來源 inspection 加 comparison。沒有報告選項時既有 wire 保持。基本 12／明確啟庫 17 工具，沒有新增 operation；重新 discovery 取得選項 schema。來源只由啟動參數 `--delivery-zip` 選定，payload 不接受路徑或 ZIP bytes。

## 選檔啟動設定

```powershell
python scripts/agent_launch.py --delivery-zip outputs/my-delivery/zoe-delivery.zip --audio outputs/selected.wav
python scripts/agent_launch.py --format codex --delivery-zip outputs/my-delivery/zoe-delivery.zip --audio outputs/selected.wav
```

產生目前 checkout 與 Python 的絕對啟動設定；明確 WAV／ZIP 副檔名不符會拒絕。產生器只列印，不讀來源、建立檔案、修改 Host 設定或啟動 MCP。草稿庫／備份原選項保持，備份仍要求明確啟庫。生成的命令已在另一 cwd 用合成 WAV／ZIP 完成 MCP 握手、兩工具呼叫與 EOF；特定 Host 的設定載入仍未驗證，使用前由呼叫者確認所選檔案存在。

## 分層與版本

純 Python `delivery_report.py` 與 browser `delivery-report.js` 驗證來源摘要／精確名稱／大小／SHA／計數，產生 deterministic JSON／Markdown。真 ZIP fixture 與跨語言測試核對完整報告位元組；最多 128 列、兩檔合計 256 KiB。application 從已驗證 ZIP 與 baseline 派生比較，CLI／JSON-lines／MCP 共用。瀏覽器 controller 在當前來源有效時才產生報告，DOM 只選固定格式與下載。

原生 HTML 表單會將 LF 轉成 CRLF。新報告使用 `/api/export` 的明確 `encoding=json-string`：DOM 先將整份報告編成單一 JSON 字串，HTTP adapter 用既有嚴格 JSON decoder 回復，再回傳原 UTF-8。未知編碼、重複／額外欄位或非字串拒絕；沒有編碼欄位的既有匯出行為保持。不是任意路徑下載，也不在 server 建立報告檔。

報告格式 `zoe-delivery-comparison-report` schema1，與 comparison1／inspection1／package1／Agent1／draft3 各自管理。本版明確支援來源工具 38／39／40／41；未知版本拒絕，不靜默遷移。Python filesystem adapter `text_outputs.py` 使用預設 exclusive create，common 保留原 API 入口；純報告層不寫檔。

見 [QA](QA-v0.41.0.md)與[交接](HANDOFF-v0.41.0.md)。本版仍為 PolyForm Noncommercial，private GitHub；FreeTWAI `not_submitted`。
