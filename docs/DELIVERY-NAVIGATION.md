# 成果導覽與工作台返回

v0.36 在四工作台的建立按鈕旁新增狀態及「查看本輪成果（檔案數）」；建立成功不會自動捲動或搶走正在編輯的焦點。窄螢幕的成果仍在編輯內容下方，使用者可明確前往，不必自行尋找。

按下查看或以 Enter 啟動時，將成果區內部捲動回頂端、定位並聚焦「本輪成果」標題。「回到歌曲設計／母題分鏡／波形校時／交付檢查」返回剛才工作台的查看按鈕；如果明確載入草稿等操作已清空成果，改回該工作台可操作的建立按鈕。切換工作台後清除舊返回目標，避免指向隱藏工作台。沒有改網址或保存導覽歷史。

尚無成果不能查看；處理中暫停查看與返回。輸入有修改時明示「上一份成果」及下載已停用，仍可閱讀原內容。這些控制沿用現有 bundle、dirty、inputIndependent 與下載規則，不把舊檔案當新驗證結果。建立失敗及晚回應不清除原成果；原 revision／來源核對照常保留後續輸入。

建立按鈕旁的訊息使用 literal textContent 與自動換行，沒有把服務文字當 HTML。原成果區的 aria-live status 保持，行內訊息不另重複宣告；查看按鈕以 aria-controls／describedby 指向成果與狀態，標題 tabindex=-1，焦點有可見輪廓。按鈕可 Tab／Enter 操作；捲動使用 auto，沒有平滑動畫。這些是原生瀏覽器操作，仍需由實際裝置驗證完整視覺與輔助技術。

## 分層與契約

- delivery-navigation.js 的 describe 是純 presentation DTO，只讀 scope／檔名列表／busy／dirty／message／error；不讀創作、媒體或 DOM。createController 注入 capture／render／goOutput／goEditor，明確點擊前重新核對；只保存暫態 scope，不持有草稿或原生 File。
- delivery-navigation-dom.js 僅更新按鈕與文字、處理原生焦點／捲動；清空時使用既定 build ID fallback。app.js 從現有 bundle／busy／status 組合 DTO，在 say、setFiles、clearOutput、markDirty 及 run begin/finally 同步。
- HTTP 只增加兩個固定 JS assets，沒有新服務 operation 或權限。產品0.36與Agent1／MCP2025-11-25／draft3／現有report及run／audit／recovery各schema1分開；基本10／明確啟庫15工具保持。導覽不進草稿、Agent wire、成果 JSON 或備份，沒有新依賴。

這是成果閱讀與焦點便利，不代表檔案已下載、草稿已另存、內容已完成或媒體通過驗收。下載仍由瀏覽器保存後核對；音檔、素材及作品判斷保留原流程。
