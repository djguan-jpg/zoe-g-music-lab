# 指定 ZIP 原文（v0.43）

四個工作台在 ZIP 核對後，選「對照檔案」並按「下載ZIP中的這個原文」，可以先保存完整原文。這項下載保留目前成果、表單與音檔；空檔可下載，移除項目沒有 ZIP 原文。HTML 以文字交付，不在工作台執行。預覽最多 32768 UTF-16 units，下載保留完整 UTF-8、BOM、原換行與控制字元。

下載前會重查來源、工作台、表單及成果 revision、bundle、busy 與媒體。編修、取消、載入、切換或晚回應造成來源失效時拒絕舊原文。送出下載仍須核對瀏覽器保存的檔案。明確「載入這份ZIP成果」與限定「撤回成果匯入」沿既有替換契約。

## CLI 明確輸出

```powershell
python music_lab.py delivery-inspect --input selected.zip --file-name brief.json --file-name plan.md --out outputs/selected-originals
```

`--file-name` 可重複；先核對完整 ZIP，再輸出全部指定原檔及 `delivery-inspection.json`。預設拒絕同名輸出，只有明確 `--overwrite` 替換指定輸出；不修改來源。不能與 `--comparison-report` 混用，原檔名大小寫不符、缺檔、路徑、裝置名、保留清單名或與輸出 metadata 同名均拒絕。CLI 明確檔案輸出接受既有合計 8 MiB 來源，不套用 Agent 回覆上限。

## Agent 與 MCP

在啟動時明確提供既有 `--delivery-zip`，呼叫 `delivery_inspect` 的 payload 可使用：

```json
{"include_files":true,"file_names":["brief.json","plan.md"]}
```

檔名清單需 1–64 個 portable 原檔名、大小寫精確、不可重複；不能從 JSON 指定來源路徑。指定 `file_names` 必須同時 `include_files:true`，不能與 `include_report:true` 混用。全份 ZIP 逐檔大小、CRC、SHA 與 canonical 封裝都核對後才選取；未選取檔損壞也拒絕，缺任一選定檔整次失敗。比較摘要仍針對整份來源及完整明確 baseline。

選定內容的序列化 JSON 限 512 KiB，包含字串 escape 與欄位格式；原文 bytes 小於上限不保證 JSON 可內嵌。超限拒絕，不截斷或偷偷減少檔案。回傳 `files` 只含選定原文，`data.selection` 的 format `zoe-delivery-file-selection`／schema1 記錄排序名稱、檔數、UTF-8 source_bytes 與 json_bytes。完整 manifest 與 archive 摘要保持。未指定 `file_names` 的摘要／全部檔案／報告回覆形狀保持。

## 分層與版本

`delivery_package.validate_name` 共用原 portable 檔名契約；`delivery_selection` 是已核對來源的純選取與獨立 schema1。`application.inspect_delivery` 負責先完整核對再選取、比較及上限；CLI、Agent、MCP adapter 共用。`operation_errors` 只提供依操作分類的 I/O 提示，不輸出例外或私人路徑。

Browser 的 `delivery-import.originalFile` 重查 pending 來源與 revision；DOM 只選檔、顯示狀態並交給既有 native UTF-8 download adapter。DOM cache 只存 names Set 與可用狀態，避免每次切換檔名再複製大原文。物件 URL 最多兩個，一秒後或 pagehide／dispose 釋放。

12／啟用草稿庫17工具、Agent protocol1、draft3、package1、inspection1、comparison1、report1 分別管理；新增 selection1。明確來源工具版本38–43，未知拒絕。既有 HTTP 核對仍回完整文字，不新增網路端點、路徑或自動寫檔權限。ZOE. G／djguan-jpg；private Repo、PolyForm Noncommercial 1.0.0，平台 `not_submitted`。
