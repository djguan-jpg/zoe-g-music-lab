# v0.32.0 驗證紀錄

2026-10-04；本機 Windows、Python 標準函式庫、Node 原生測試、CUA／IAB。合成資料只來自本次新建工作區。正式作品、完整視覺與實聽未驗收。

## 可重現基線與修正

v0.31 main e17793339fd23d818bf098d19a4e35982173d9be：正確 Agent1 envelope 呼叫 storyboard_review 被拒絕，discovery 無該 operation。IAB tab51 清空原鏡頭3畫面後，即時待辦可定位，但沒有報告控制，也無成果。收據在忽略的 outputs/v32-qa/baseline-*。

新純 storyboard_review／application／四 adapter、原欄位 schema 與確定性 JSON／Markdown；新工作台報告及共享 readiness-report 回覆核對層。原來源和原位置保持，零待辦仍待完整建立。

## 自動化與封裝

- 267 Python、400 JavaScript、四 Skill、30 JS 語法與 diff 通過；新增9 Python／9 JS，既有歌曲報告測試覆蓋抽取後的共享核對層。
- 64 組真 Node↔Python 完整分鏡報告與 Markdown 比對，包括必填、Unicode 空白、方向、母題名稱／意義／引用、空清單及1000鏡／30母題。全部11060待辦與前200明細分開；精確8MiB來源邊界及未知形狀拒絕。
- 真 CLI --input／--draft、0／2／1、預設不覆寫與原檔不變；實際 JSON-lines／MCP 無效後有效恢復、EOF退出、9／14 discovery、唯讀與無路徑 schema；loopback HTTP 與 application 一致。
- 前版 v0.31 指定 ZIP 688945 bytes、SHA-256 c62bff251711027c0f1aa680ae6160f45023039d17e2ab9c97be26f6c9ab9b33：解壓後258 Python／391 JS通過，限定暫存已移除。本版封裝內測試、指定 commit／SHA、private PR／Release／重新下載核對以本輪 package／release 收據為準。

## 實際瀏覽器操作

流程：127.0.0.1:8875 → 母題分鏡 → 原鏡號留白／引用待辦 → 建立報告 → 定位／下載 → 編修與重查。頁名正確、非空、無框架錯誤覆蓋；console error／warn為空。27項案例通過，原生 tab52 已關閉，暫時 viewport 已恢復。

原鏡頭3留白報告1待辦，兩原生檔成功下載；編修後舊定位／下載停用。完整且自洽的不同來源回覆與未知 JSON schema 被拒絕。確定4秒延遲時兩檢查控制與定位停用；晚回應保留後續畫面和上一份成果。重新檢查採用最新內容。

欄位零待辦仍允許原始重疊開始字串；完整 storyboard 實際拒絕「鏡頭 2 與前鏡有重疊／空缺，應從 6 秒開始」。修正後完整4鏡／24秒／576影格設計建立並核對本次需求。後續待辦報告收起舊設計。

同名兩母題列6待辦，原母題列與相關列、4引用鏡號保持；定位母題1名稱。改名後原 ID 保持，鏡頭4明確使用 motif-2；清空其意義會指出母題2及鏡頭4，定位原選項。其他工作台、已選原生6秒合成音檔保持。

390×844：Enter建立報告、Enter定位原鏡頭3；頁面寬375，待辦框 x16／w343／right359，兩控制 right254.9765625／232.9765625，都在390內。增加5留白鏡頭後9鏡／35待辦、頁面20定位；只刪新增鏡頭後原4鏡、兩母題、編修與音檔保持。歌曲報告經共享核對層仍成功。

實際 native 草稿 schema3／產品0.32，4鏡／2母題；Python驗證、CLI --draft與Agent完全相同零待辦，原檔不變、重複輸出拒絕。先驗實檔再「已確認草稿檔案」，後續唯讀報告仍顯示「目前內容一致」。暫態待辦／媒體不進草稿。

| 實檔 | Bytes | SHA-256 |
|---|---:|---|
| storyboard-review.json | 3402 | 64dbea0bb48fe9c521547c8dc565aa77860b927b0f88d0db0e6e2c1ddd7eadfb |
| storyboard-review.md | 379 | 7eccf05cabe558e8b621abef4b4a2a963376afc7d5a487d406f78f9dd1850495 |
| native 草稿 | 6012 | 6d2e161a77ffeff55cfcc579fbe4a02b68f5c914d9ad0a562315fc2d5e4385a8 |

Native CRLF位元組保持；只在與application／HTTP／CLI／Agent／MCP文字比對時正規化換行。q/native、adapter-evidence、draft-evidence保存收據，沒有把 raw byte 差異宣稱一致。測試腳本曾修正物件鍵序比較、不存在的toast選取器、延遲marker與目前選取成果比對；應用程式沒有因此放寬接受條件。

## 維護與限制

唯讀盤點本工作區 outputs／封裝與本輪明確 PID；正常結束兩QA服務，沒有自動重啟或持久服務。最新三版32／31／30保留；只有超過七天且可由Git tag或已驗證遠端備份重建的本專案產物才可列候選；草稿、備份、原媒體排除。數量、清除及程序以 inventory-final 收據為準。

無完整視覺／媒體／正式實聽驗收，DOM幾何不能代替；特定Agent Host、其他瀏覽器／OS、原生 file播放與FreeTWAI投稿／創始人資格仍待。沒有配置GitHub CI；本機來源與封裝測試分別記錄。非商用授權、private、ZOE. G署名保持，rolling goal active。
