# v0.7.0 驗證紀錄

2026-10-03。只讀本工作區新作品與通用工具指引／官方 MCP 2025-11-25 規格；沒有參考其他個人作品、Git、記憶或搬入第三方程式。使用 frontend-testing-debugging；Browser plugin 未提供，沿用 CUA IAB Playwright，沒有安裝瀏覽器依賴。

## 可重現問題與修正

- baseline-errors.json：同時提供 cues 與 content 被接受，輸出只保留 cues；channels=[true] 被接受，單聲道檢查通過。新測試修正前失敗，現在要求明確來源與正整數接受條件。1.0 這類 JSON 整數值正規化為 1，布林／非整數／錯誤型態／未知 profile 在開檔前被拒絕。
- MCP arguments=[] 原先是工具結果，現在明確非物件（包括 null）回 -32602；payload／領域錯誤保留 isError=true，真實 stdio 之後仍能有效呼叫。
- 發現原工具 schema 只有 payload 物件，缺少語言／需求清單／巢狀結構與成功成果契約。新 tool_contracts 層由三種 discovery 共用，領域計算保留在既有層。

## 自動與 schema 核對

62 Python／24 JavaScript／四份 Skill 通過。五項新契約測試與一項 HTTP 測試涵蓋上述錯誤、拒絕前不開檔、實際 stdio 恢復、有效音訊 hash／不寫檔、HTTP 恢復及契約欄位探索。

使用已存在的 jsonschema 4.26.0（沒有安裝、新 runtime 或測試依賴）核對四工具的八份 schema，meta-schema 全部通過；七次真實 stdio 呼叫包含現代／舊版歌曲、現代／舊版分鏡、兩種歌詞來源及音訊。成功 input／structuredContent 皆符合 schema，文字內容與結構資料、共用 application 結果一致；媒體 hash 保留，除所選合成 WAV 外沒有新檔，EOF exit 0。來源衝突、布林／小數音訊條件及 JSON 路徑被 schema 拒絕。證據存 outputs/v07-qa/schema-evidence.json；不是特定 Agent host、模型或完整官方 conformance 證明。

## 瀏覽器流程與證據

流程：本機工作台 → 建立歌曲 → 加入空白需求 → 欄位旁提示／焦點 → 修正／重建 → 實際下載 → 需求回讀／撤回／重新驗證。

環境 http://127.0.0.1:8875/，標題 ZOE. G Music Lab · 創作工作台，測試頁 7；1280×720 與 390×844。沒有截圖或完整視覺評審，依使用者媒體嵌入限制採 DOM／互動驗證。

| 檢查 | 實際結果 |
|---|---|
| 頁面／非空 | URL／標題正確，四工作台與原創範例可見 |
| 錯誤覆蓋／console | 未見框架覆蓋；最後 error／warn 空陣列 |
| 截圖視覺 | 未進行，沒有宣稱完整視覺完成 |
| 桌面／窄螢幕 | clientWidth=scrollWidth，分別 1265／375；提示右界 359，無橫向溢出 |
| 操作 | 空白項目定位、修正清除、重建下載、全空交付、新增鍵盤、回讀撤回通過 |

1. 原歌曲建立 136 秒／6 段包，下載可用。新增避免事項 3 空白後，下載停用，焦點為該欄，aria-invalid=true、aria-describedby 指向對應提示。
2. 填入多行需求後，舊標示／關聯清除，重建成功且下載恢復。刪除全部交付項目後顯示「至少需要一個交付項目」，焦點定位新增按鈕，關聯指向清單級提示；Enter 新增、填入後能重建。
3. 最終版提示在該 requirement-item 內，桌面避免事項 1／窄螢幕避免事項 3 的提示距欄位底部 8px，欄位與提示均在 viewport 內。
4. 最終版真正下載 brief 與草稿，0.7.0／schema 3、多行需求保留；下載內容再交共用 application，歌曲時長 136 秒。
5. 留下空白需求錯誤後載入剛下載的需求。預覽不改表單，明確載入後恢復多行值、錯誤標示清除；撤回還原原空白但沒有殘留標示，再建立後重新指出避免事項 3。
6. 本次自動化曾把 summary 當 button locator，以及 Windows 路徑斜線跳脫錯誤；讀取狀態後改用可見文字／完整路徑完成。沒有把自動化問題當產品缺陷。測試頁關閉，viewport reset。

下載／還原證據在 outputs/v07-qa/download-and-restore-evidence.json；實際下載副本在 browser-brief.json／browser-draft.json。

## 還原、程序與限制

保留 v0.6 ZIP SHA-256 f40a4c04103dd7d4949dbe5c6bca59b4d2a542a8c8a21ccd0a6f51574802330f 核對後解壓，原版 56 Python／24 JavaScript 通過。指定提交封裝另在解壓版本跑全部測試與 metadata／MCP 握手，以 manifest 實際結果為準。

本輪臨時 HTTP exec 57015 已 Ctrl+C 停止（exit 1），8875 監聽數 0；沒有動其他程序或保留背景服務。MCP／測試皆 bounded subprocess 或 EOF 正常退出。

只盤點本工作區 outputs。最新三版 v0.5／v0.6／v0.7 保留；更舊產物尚未超過七天，仍保留，本輪沒有清除候選／素材刪除。盤點位於 inventory-start.json／inventory-final.json。

特定 Agent host 接入、完整官方 conformance、完整視覺／跨瀏覽器、正式作品／媒體生成／ASR／LUFS／true peak 未完成。Repo private；FreeTWAI 未投稿，平台創始人未核實。
