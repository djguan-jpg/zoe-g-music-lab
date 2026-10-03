# v0.9.0 驗證紀錄

2026-10-03，Windows 本機、Python 標準函式庫、Node 測試、Codex IAB。合成資料，沒有讀取使用者其他專案／素材、秘密、模型或遠端 infra。

## 自動測試

77 Python／47 JavaScript／四份 Skill 格式檢查／五個 JS 語法檢查通過。既有 62／38 保留。新增覆蓋草稿 Python／生產 JS 同源接受矩陣、原始空白／多行／字串保留、未知草稿／紀錄版本拒絕、不修改輸入、1 MiB 限制、ID 路徑拒絕、不可覆寫及相同 ID 重用、失敗 staged 清理、毀損／連結拒絕、分頁／容量、四執行緒同 ID、四真實程序競爭容量、程序鎖釋放。

實際 JSON-lines／CLI／MCP／HTTP 保存讀取往返、預設停用、啟用後七工具、MCP 保存寫入 annotation、生成 launcher 在其他 cwd 啟動、hostile Origin 拒絕及契約 asset 通過。JS 覆蓋點擊時不可變快照、未知結果同 ID 重試、已知錯誤、放棄重試不刪資料、最新 list/read、取消、無效內容拒絕與不覆蓋編修。證據在忽略的 outputs/v09-qa/checks.json。

## 真實瀏覽器

另以未加 -X utf8 且 PYTHONIOENCODING=ascii 的 CLI 子程序，保存含表情符號的名稱／歌名；stdout 仍是可解析 UTF-8，內容完整，程序正常退出。

- 預設服務：本機保存按鈕停用，清楚顯示需重啟並明確選庫。頁面非空、標題／網址及 v0.9 正確，沒有錯誤覆蓋。
- 受控 HTTP 測試：先保存空白小節／多行文字，已寫入後故意讓第一次回應為 500。修改歌名與保存名稱後按重試，磁碟仍一版，回到原名稱／內容，reused=true；後來的歌名保留並顯示尚未保存。
- 第二次保存形成第二 ID，未完成歌詞開始時間保留，已載入的合成 3 秒 WAV 與波形保留。預覽舊版不改目前表單或音檔。
- 保存版 JSON 真正下載並和原保存草稿解析後完全相同，保留空白與換行；5807 bytes、SHA-256 2c38f2addcd30c5dcba5cb7713ce03d8706deed7c6ce08fccbb639aa901d2bad。
- 預覽後再編修才按載入，套用舊版並重設音檔選擇；撤回恢復按下套用前的歌名與未完成校時，不恢復檔案選擇。
- 停止受控服務，啟動正常服務並重載頁面，兩版仍在。真實 Agent 在另一 cwd 保存 21 版，工作台先讀 20 版，再讀更早版本共 23；最後頁隱藏更多按鈕。Agent 版本可預覽，現有表單保留。
- 僅更動自有合成版本，先備份再加一個 newline，摘要錯誤拒絕預覽，現有草稿及音檔保留；測試後按原摘要逐位元組恢復該版本。
- 200 字名稱：1280×720，client／scroll width 同為 1265；390×844，同為 375。保存區按鈕在可用寬度內且未重疊，選單寬 313；Tab 可到 library-select。最後捕捉 error／warn 為空。只核對 DOM 幾何和互動，沒有截圖視覺評審。

QA 有控制失敗的測試 helper，不在交付程式或 Git 內。自有合成音檔、草稿庫、下載與 browser-evidence.json 留在 outputs/v09-qa；使用者草稿庫沒有被建立或清理。

## 封裝、還原與維護

v0.8 ZIP 重算 SHA-256 bfb0827f5fd0609d861422855533944f1ba3e0123f55a73e8ab04ab92b6b8f19，179953 bytes，安全解壓後原版 62 Python／38 JavaScript 通過；證據 previous-restore-evidence.json。本輪 restore tag 指向 55c36efb55aea301410236d315ebe69b608ee66c，前輪 HANDOFF 保存。

v0.9 只封裝指定 Git commit；解壓重跑全部測試／Agent metadata／MCP 握手，檢查結果及每檔摘要記在 manifest。完成 private PR 後比對 main／source tree；Release 資產下載核對逐位元組與 GitHub digest，實際證據留在 release-remote-evidence.json。本文不是提前發布的證明。

本輪 HTTP exec 63152／23420／81203 已 Ctrl+C 停止（exit 1），8875 監聽為 0；自建頁 9 關閉、viewport reset。其餘程序只依測試 bounded／EOF 結束，沒有清理其他程序。本輪盤點只讀 outputs；保留最新三版及尚未超過七天的舊產物。草稿庫不由 Git 重建，不列清除候選；inventory-final.json 記實際結果。

## 未驗證

特定 Agent host 安裝／模型呼叫、官方完整 MCP conformance、POSIX、其他瀏覽器、完整視覺／正式作品評測、音樂／影片生成、ASR、自動校時、LUFS／true peak、斷電復原保證。瀏覽器檢查透過 CUA IAB；本輪未使用 Browser plugin，可於需要跨瀏覽器或完整視覺測試時使用該插件。FreeTWAI 公開決策未確認，未投稿或取得平台創始人核實。
