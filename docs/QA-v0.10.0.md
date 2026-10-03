# v0.10.0 驗證紀錄

2026-10-03，Windows 本機，Python 標準函式庫／Node 與 Codex In-app Browser。只使用本工作區合成草稿／WAV；沒有模型呼叫、其他個人專案、秘密或第三方程式搬入。outputs/v10-qa 保存細項收據，忽略於 Git／封裝；本文保存可審閱的結果。

## 自動與程序驗證

99 Python／55 JavaScript 全數通過；四份 Skill 格式、六 JS 模組語法與 git diff --check 通過。

新增 22 Python 覆蓋原始 bytes／ID／metadata／時間往返、指定 ID／空庫備份、未知版本、最後一筆毀損也整批拒絕、來源 SHA 改變、既有 ID 衝突／容量、受控部分磁碟故障與重試、真實三程序同 ZIP 恢復（新增數 2／0／0）、不同 cwd CLI／JSON-lines／生成設定的 MCP／HTTP、惡意路徑／重複／額外檔、連結／加密／不支援壓縮、中央目錄／展開／archive 上限、重複 JSON／索引、毀損來源不略過、排他輸出／fsync 故障／版本目錄拒絕、下載暫存的容量／有效期／單次取用／摘要改變／未知檔保留／立即清空目錄。

新增八 JS 測試涵蓋 latest preview、取消、固定來源 File／SHA（callback 修改 plan 不影響恢復）、未知 500 同 artifact 重試、已知 400 清預覽、衝突停用、檔案／版本拒絕與恢復中操作界線。原有 77／47 保持通過；預設未啟庫仍四工具，明確啟庫共九工具。

實際 ZIP 無效 DEFLATE 壓縮區塊曾引發未處理 zlib.error；修正後共用備份層轉 ValueError，真實 HTTP 回 400、不建立目標庫，下一個有效 request 繼續成功。已知錯誤／衝突／容量在新版本寫入前拒絕；受控磁碟中斷保留先前完整版本，同檔再試補完，不宣稱整批磁碟原子性。

v0.9 封裝 212210 bytes、SHA-256 `32daf16c8d58c1bcbadbed2ee76001e80d1467509d298228a43bb2934e91dccd` 核對；安全路徑檢查／解壓後原版 77 Python／47 JS 通過。指定提交 v0.10 ZIP 由 scripts/package_release.py 解壓再跑全部測試、Agent metadata／MCP initialize，結果在每提交 manifest；工作區測試不替代包內驗收。

## 瀏覽器實際操作

- 未啟庫的備份下載與選檔停用，提示可見；console 無捕捉到 error／warn。
- 兩版合成草稿整庫下載實檔 5930 bytes，SHA-256 `8323b0db9d5d2e47c9c8e82ae259ed283f79008658a4934374fcddf2ba554ce5`。每版兩檔 bytes 與原來源一致。下載採原生 HTTP attachment；初次 Blob 沒收到 download event 不能斷言未落檔，不將該次當成功或失敗證明。
- 恢復前歌曲名稱編為「QA 恢復期間保留的未保存構思」、選定合成 3 秒 WAV，刪除紀錄一筆。ZIP 預覽兩版待新增、不寫庫；按恢復後 server 已寫兩版但回 500，UI 保留預覽／同 File／SHA 待重試。再次恢復新增 0／重用 2，清單兩版，表單／音檔／刪除紀錄均保留。
- 相同 ID 不同內容＋另一新 ID 的兩版 ZIP，預覽一個衝突、一版新建，恢復停用；目標仍只有原兩版，新 ID 不建立，現有資料保留。
- 自有來源版本故意附加 newline 毀損，下載檢查失敗，主頁仍在工作台，未保存輸入／音檔／歷史保留；合成來源恢復為原始 bytes。無效 DEFLATE 上傳顯示資料錯誤，不留預覽、不替換工作台。
- 原 ZIP 再預覽兩版重用；1280×720 的 client／scroll width 1265／1265，390×844 為 375／375，按鈕無水平溢出／交疊、SHA 換行，Tab 可至 backup-cancel。這是 DOM 幾何與互動檢查，沒有完整視覺評審。
- 真正下載目前草稿，tool_version=0.10.0／schema=3／未保存名稱保留，SHA-256 `8e17b7a1cdf59f87635067ccea141813daf60cdbc91ac110f359eba43718ffc9`。
- 停止受控 server、重新啟動正常庫，清單兩版／原 ID／名稱／時間保留；再次下載 ZIP SHA-256 `a3fe483cfe3480a10d232edbaab74e5d2a7c759f1056c66d5b3b8418e9a2aa3d`，每版原始兩檔與第一次下載一致。ZIP 整體摘要可因 manifest 建立時間改變。
- 清理修正後實際再下載 ZIP，SHA-256 `7646b354da4e04efe3bcad9eb2b5451ca2a6b73ff1642dbc41b809bda19680cd`；服務仍運作時收據為 cached_paths=0／records=0／root=None、原暫存目錄不存在，console 無 error／warn。停止終端不是 finally 曾執行的證明。

## 界線與維護

所有本輪 HTTP exec 35821／70571／14713／17600／89217／28051 停止，8875 監聽數 0；測試頁 10／11 關閉、viewport reset。先前本輪兩個空下載暫存目錄核對確切路徑／非連結／空後，非遞迴刪除；保留任何未知內容，沒有大範圍清理。過期下載由下一次 prepare／take 或正常 server_close 清除，無定時器；強制中止仍可能留下未取走的檔案。

維護只盤點本工作區 outputs，保留最新三版 v0.10／v0.9／v0.8；其他未過七天保留，最終收據記錄實際結果。使用者草稿／備份不可由 Git 重建，不列為清除候選、不進 Git／原始碼 ZIP。未建立原使用者 outputs/drafts。

未驗證其他瀏覽器／完整視覺／正式媒體／特定 Agent host／模型／POSIX／hard-link 不同檔案系統／官方 conformance；hash 不是署名與版權核實。Repo private，FreeTWAI 未投稿或取得平台創始人核實。原始碼 Release、使用者資料備份與平台作者審核是不同結果。
