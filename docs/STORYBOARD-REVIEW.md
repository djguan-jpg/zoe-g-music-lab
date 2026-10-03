# 分鏡欄位報告（v0.32）

工作台「母題分鏡 → 建立待辦報告」會輸出 `storyboard-review.json` 與 `storyboard-review.md`。留白、重複母題名稱或失效引用也能診斷；不補寫畫面、不改秒數、不生成媒體。即時待辦仍能展開並定位原欄位。

```powershell
python music_lab.py storyboard-review --input examples/unfinished-storyboard-review.json --out outputs/mv-review-run
python music_lab.py storyboard-review --draft 已另存的草稿.json --out outputs/mv-draft-review
```

`--input` 只接受 `{ "panel": 原始分鏡工作台 }`。`--draft` 明確選定現代 schema3 草稿，完整驗證草稿形狀與選項，再取 `panels.storyboard`；不接受舊版自動轉換或從 JSON 指定路徑。退出 0 表示已輸出且欄位零待辦，2 表示已輸出且有待修正，1 表示輸入／輸出失敗。預設拒絕覆寫，只有明確 `--overwrite` 才替換指定輸出。

## 原始來源與版本

`panel` 精確包含 `fields`、`motifs`、`shots`。欄位與鏡頭欄位沿本專案 draft3 契約，全為原字串；母題為 `id`、`name`、`meaning`，ID 必須是唯一 `motif-正整數`。直接原欄位診斷允許未知畫面方向，會列待辦；草稿讀取仍要求合法保存選項。

最多 1000 鏡、30 個母題。未知欄位、非字串、重複／不合法 ID、無效 Unicode 拒絕，不丟棄創作。純來源的緊密 UTF-8 JSON 上限 8 MiB；HTTP／Agent／MCP／CLI JSON 傳輸上限 2 MiB；CLI 草稿上限 1 MiB，加可選單一 UTF-8 BOM 的 3 bytes。

輸出 `zoe-storyboard-review` schema1 包含 `source`、`total_shots`、`filled_shots`、`total_motifs`、`issue_count`、`issues`、`details_truncated`、`review_notes`。`status` 為 `needs_correction` 或 `fields_checked`。Issue 包含 scope、原列 row、field、code、message、related_row；原列從 1 起，全域列 0，母題相關列無值時為 null。

必填、畫面方向、母題名稱重複與引用完整性全部計數；JSON／Markdown 明細最多 200 項，頁面定位前 20 項。原鏡號、母題 ID、文字、留白、順序與 optional change_reason 保留。單鏡欄位已填或零待辦不表示時間、影格、連戲、素材或成片通過；完整 `storyboard` 仍會拒絕重疊／空缺。

產品 0.32、報告1、Agent1、MCP2025-11-25、draft3 與其他 schema 獨立管理。新唯讀 `storyboard_review` operation／MCP tool，預設 9 個工具，明確啟庫 14 個；需重新 discovery。HTTP `/api/storyboard-review`、CLI、JSON-lines、MCP 由同一 application 供給，`meta.needs_review` 始終 true。Agent 不自動寫檔或讀來源路徑；沒有新增模型權限。

## 分層與接受順序

Python `storyboard_review.py` 只驗原形狀、計算診斷與確定性 JSON／Markdown。Application 組合資料／meta；schema 描述原字串；adapter 管傳輸、明確選檔與輸出。

JS `storyboard-readiness.js` 重用既有診斷重算完整報告；歌曲與分鏡共用 `readiness-report.js` 核對 envelope、protocol、needs_review、完整 source／data、嚴格 JSON 與 Markdown。未知 schema、同名不同來源、重複 JSON key 或矛盾成果拒絕。

DOM 層先捕捉本次原欄位，沿既有 revision／busy／晚回應保護，核對後才替換成果並收起上一份設計。編修停用舊定位／下載；定位前重查。其他工作台、媒體與草稿另存確認保持；報告／定位不進 draft3。報告供交接待辦，沒有自動套用創作或靜默修復。
