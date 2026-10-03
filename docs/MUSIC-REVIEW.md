# 歌曲待辦跨工具報告（v0.31）

「檢查歌曲待辦」仍即時定位原缺漏。「建立待辦報告」經本機共用服務產生 music-review.json／music-review.md，未完成欄位也可交付診斷，原創作保持。欄位修正、排序或刪除後，上一份報告停用下載；重新建立才代表目前內容。零待辦仍須完整歌曲建立與實唱／實聽。

## CLI 與 Agent

```powershell
python music_lab.py music-review --input examples/unfinished-song-review.json --out outputs/song-field-review
python music_lab.py music-review --draft outputs/my-song-draft.json --out outputs/draft-field-review
```

第一個指令使用本專案合成範例，會寫出兩個診斷檔並以 2 結束，表示三項待修正；不是執行失敗。第二個指令的草稿路徑由你指定，讀取 modern schema3 後只診斷歌曲。草稿檔最多1 MiB，舊／未知 schema 拒絕，不自動遷移。原檔保持；相同輸出預設拒絕，只有明確 --overwrite 才替換指定同名檔。

Agent JSON-lines operation／MCP tool 均為 `music_review`，payload 為 `{"panel": 草稿的panels.music}`；MCP arguments 仍包在 `{"payload": ...}`。原歌曲 panel 精確含 fields、sections、avoid、deliverables；全部欄位為原字串，未填數字也保持空字串。沒有路徑、完整草稿、規劃 brief、自訂診斷或版本覆蓋的混合入口。完整 brief 使用既有 music，這個工具專門檢查未完成原欄位。

CLI 狀態 0 表示欄位零待辦、2 表示已寫出待修正報告、1 表示輸入／寫入失敗。JSON-lines 的 ok 與 MCP isError 表示工具有否成功執行；issue_count 表示待辦數。每份報告的 meta.needs_review 仍為 true，不把 0／ok／isError=false 當作作品完成。

## 報告契約

獨立 format `zoe-music-review`、schema_version1。status 為 needs_correction 或 fields_checked；source 包含完整原歌曲 panel，total_sections／filled_sections／issue_count 與 issues／details_truncated 各有明確意義。issues 的 scope 是 fields、sections、avoid、deliverables；全域 row0、清單／段落為原順序1起，field 使用原欄位名稱；code 為 missing_field、invalid_number、invalid_range、no_sections、no_deliverables。

全部欄位計數、前200明細、工作台前20項並明示截斷。最多40段、每種清單100項。純診斷來源的 compact UTF-8 JSON 上限8 MiB，無效Unicode拒絕；HTTP／Agent／MCP／CLI JSON 輸入沿既有2 MiB，完整草稿入口1 MiB。容量拒絕保留原輸入及前次成果。

已有歌詞可留白，避免清單可以完全不列；原字串及順序不改。數值、文字空白與範圍沿 v0.30 原欄位規則，見 [歌曲欄位待辦](MUSIC-READINESS.md)。filled_sections 僅計算每段欄位，不代表全域或完整總長接受。報告不是歌曲 brief、時間起稿或已完成媒體，不能用它替換創作來源。

## 分層與回覆核對

| 層 | 責任 |
|---|---|
| music_review.py | 從既有 draft3 契約取形狀與欄位，純原字串快照、必填／範圍診斷與確定性 JSON／Markdown；不讀媒體或寫檔 |
| application.build | 同一 music_review 結果供 HTTP／CLI／JSON-lines／MCP；回傳 needs_review=true |
| tool_contracts | 診斷 schema 允許未填原字串與空列清單，精確 panel、沒有路徑；舊完成規劃 schema 保持 |
| music-readiness.js | 重用已有純診斷，產生同一 report／Markdown；核對本次 source、完整 data、JSON、Markdown、protocol及診斷版本後才接受回覆 |
| app.js | 明確報告動作、先捕捉歌曲、既有 revision／late guard、busy及安全文字；核對後才替換成果並隱藏舊設計摘要 |

即時欄位檢查與報告 I/O 分開；沒有把外部報告當可信診斷或自動載入創作。來源不符、未知版本、JSON矛盾或晚回應都保留原成果與後續編修。其他工作台、音檔及草稿另存狀態保持。

產品0.31.0，新增一個唯讀 operation／tool，預設8工具、明確啟庫13工具；需重新 discovery。Agent protocol1／MCP2025-11-25、draft3與各舊領域schema保持。沒有新依賴、模型、auth、金流、外網或自動寫檔權限。

證據及還原見 [本輪QA](QA-v0.31.0.md)、[交接](HANDOFF-v0.31.0.md)。
