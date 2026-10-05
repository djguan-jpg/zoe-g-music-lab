# 原句搜尋契約 v1

搜尋逐句表格的原文字，保留重複句、空白、Unicode、大小寫與原列順序。每句只列第一個精確字面命中，不正規化、不用 regex、不檢查或修改開始／結束。因此不完整校時亦可查；搜尋成功不代表時間、實聽、權利或平台創始身分通過。

| 層 | 責任 |
| --- | --- |
| musiclab/lyrics_search.py、assets/lyrics-search.js | 有界原文／查詢、純 SHA source pin、全部計數、有限列與 UTF-8 byte位置、JSON／metadata-only Markdown |
| application、tool_contracts | 獨立 search1、統一 DTO／嚴格 input/output schema、needs_review=true |
| CLI／Agent／MCP／HTTP | 同一服務，沒有模型、媒體、任意路徑或自動寫檔能力；CLI明確指定輸入／輸出 |
| lyrics-search-controller.js | 注入 capture/request/hash/focus，generation/latest、完整來源與resultRevision核對、512筆分頁歷史、晚回覆拒絕 |
| lyrics-search-dom.js／app | 固定 input/buttons、literal前100codepoint標籤、原生穩定ID文字欄與實際focus確認；不seek或markDirty |

輸入 `{texts:["原句 🎵","原句 🎵"],query:"原句",start_row:1,max_results:20}`，只允許 texts/query/start_row/max_results/source_sha256。texts必填0–10000列，每句至2000 Unicode codepoints；compact UTF-8 JSON array至2MiB，query1–1024 UTF-8 bytes，max_results1–50預設20。start_row以原列1起，最多len+1；start_row>1必須前次source_sha256（64小寫hex），任何提供pin都必須符合。SHA256涵蓋ASCII `zoe-lyrics-texts-v1`+LF與compact UTF-8 array bytes，不含時間／標題／媒體／query，也不证明作者。Python與JS只序列化string array，避開浮點拼法差異。

matches包含原row、原text、第一命中的start_byte/end_byte（UTF-8，end不含）；total_matched_rows掃全部原列，包括本批之前。next_row為最後返回原列+1，只在還有命中時提供。下一次仍逐原序查找，不合併或去重。JSON完整核對，Markdown只列計數／byte位置／SHA，不插入查詢或原句。最多50句×2000控制字的JSON可超512KiB；完整JSON檢查限1MiB，不截斷。完整傳輸沿既有2MiB：source domain能接受接近2MiB array，不保證加上query/envelope仍適用每個adapter。CLI read_json／HTTP body／Agent行均有自己的完整請求限制，browser POST前核對2MiB bytes。

```powershell
python music_lab.py lyrics-search --input request.json --out outputs/search
```

CLI預設拒絕同名成果；只有明確 `--overwrite` 可替換指定输出。有效零命中exit0，invalid/IO exit1。Agent operation及MCP tool為 `lyrics_search`，input沿 `{payload:{...}}` 的既有tool envelope，readOnly/idempotent=true，openWorld/destructive=false。新增基本15／明確啟庫22工具；請重新discovery。Agent1／MCP2025-11-25／draft3保持。

瀏覽器Find／Enter每批20，Previous／Next重讀同source pin；新query清舊batch/pending/history。原文或stable IDs變更也清除，重新renderCues保守清除。單純時間或媒體編修可保留文字搜尋，但既有成果dirty下載规则仍較保守。capture包含原texts、IDs、visible/busy/resultRevision；await hash、HTTP後及完整reply校驗前後核對，別的成果已建立時不覆蓋。reply完整data／嚴格JSON／MD與安裝version／protocol1／needs_review均一致才交出。onReport與UI DTO隔離；焦點前再核對完整texts/IDs及目標原文，app沿共用editor-focus確認activeElement。hidden/busy不可focus或發新請求。

搜尋與焦點只由明確操作觸發；播放tick不刷新此來源。沒有新timer、外部URL、依賴、AI呼叫、秘密或權限。query/pager/reports/stableIDs不進draft3。報告保存不證明實際音畫同步，下載sent不等於已保存。
