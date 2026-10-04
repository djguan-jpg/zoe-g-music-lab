# 原文分段閱讀（v0.44）

ZIP 核對後，選「對照檔案」並展開「分段閱讀完整原文」，選 ZIP 原文或目前保留成果，以前一段、下一段及回到開頭閱讀全文。空檔與沒有檔案分別提示；內容只作文字顯示。閱讀不替換成果、表單或音檔，原文下載仍是全文。

每段最多16 KiB UTF-8 bytes，不切斷字元；顯示的起點／終點是原文位置。BOM、emoji、換行與控制字元保留在來源及下載，textarea 的換行顯示仍由瀏覽器處理。沒有推測或替換字元。換檔／換來源回到開頭，編修或取消後清除舊段落；載入與限定撤回保持既有契約。

## Agent／MCP 明確讀取

沿既有啟動參數 `--delivery-zip` 選來源，呼叫 `delivery_inspect`：

```json
{"text_window":{"file_name":"plan.md"}}
```

`files` 保持空物件，`data.text_window` 是有明確範圍的原文片段，不是完整檔案。獨立 format `zoe-delivery-text-window`／schema1，包含 file_name、archive_sha256、file_sha256、text、start_byte、end_byte、source_bytes、max_bytes 與 next_byte。末段 next_byte=null；有效空檔也有來源 hash 與0-byte位置。

要讀後續段落，使用回覆的 next_byte 與 archive_sha256：

```json
{"text_window":{"file_name":"plan.md","start_byte":16384,"archive_sha256":"前次回覆的64位小寫SHA-256"}}
```

以上位置只是示例，實際依 next_byte 接續。每次 request 都先核對整份 ZIP 的 CRC／SHA／canonical bytes，未選取檔損壞仍拒絕。非零起點必須帶前次 ZIP hash；來源變更，即使只有 label 改變也拒絕，避免混用兩份來源。起點需為 UTF-8 字元邊界，指向字元中間或超過全文拒絕，不自動調整。單段 max_bytes4–16384、預設16384；整份來源仍是合計8 MiB／64檔，序列化回覆保持有界。

text_window 不可與 include_files:true、file_names 或 include_report:true 混用；明確 baseline 可保留全份比較。未知欄位、null、布林位置、路徑、裝置名或保留清單名拒絕。未指定分段的既有 wire 與512 KiB files JSON上限保持。

## CLI

```powershell
python music_lab.py delivery-inspect --input selected.zip --text-file plan.md --out outputs/window-first
```

後續指定 `--start-byte`、`--archive-sha256`，可選 `--window-bytes`。輸出 `delivery-inspection.json`，明示原文片段與來源位置；不將片段當作完整原檔另存。分段設定需要 text-file，不可混用 file-name／comparison-report。來源保持，預設拒絕覆寫，只有明確 overwrite 替換指定輸出。

## 分層與資源

delivery_text純請求／UTF-8範圍 → application整份核對與來源pin → CLI／Agent／MCP adapter。Browser delivery-text純有界模型／注入 reader controller → DOM adapter → delivery-import current pending source。來源 key 在讀取前隔離，讀後再查，不保留可變物件作比較基準。第一段建立的唯讀 UTF-8 buffer 最多8 MiB、同時只快取一份；換檔／來源失效／取消／載入／撤回清除。段落最多16 KiB，前段位置紀錄最多512筆，全文8 MiB最壞513段可完整讀完；不將buffer放入status、草稿或wire。

新增 text-window1 與其capability；12／啟用草稿庫17工具、Agent1／draft3及其他交付schemas保持。明確來源工具38–44，未知拒絕。既有HTTP仍核對完整文字，新增兩個靜態JS資產；沒有新的寫檔、來源路徑、網路或模型權限。ZOE. G／djguan-jpg；private Repo、PolyForm Noncommercial 1.0.0，FreeTWAI not_submitted。
