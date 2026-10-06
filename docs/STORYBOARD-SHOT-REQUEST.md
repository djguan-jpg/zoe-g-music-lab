# 選定鏡頭請求與完整值核對（v0.113）

`storyboard-shot-review.checkedResult` 首先透過共享 `json-document.sameValue(reply,reply)` 檢查整份執行期資料，再核對 root／meta／data／files 與完整原來源。共享限制為最多262144個值節點、64層；拒絕隱藏額外欄位、symbol、自有accessor、稀疏陣列、非有限數字與無效Unicode。測試證明自有getter不被讀取；不宣稱任意Proxy／繼承行為安全或HTTP可編碼getter，也不是新的HTTP漏洞證明。原單鏡JSON256KiB與完整來源8MiB限制保持。

`storyboard-shot-request.createController` 純注入 request／source／onReport／onError／onStale／onState，無DOM、網路、timer、模型或路徑能力。source.payload的私有原生ID proof不搬到傳輸；request只收到structuredClone之{panel,row}，外層current函式傳遞其signal給原有api。每份request分配序號，來源與外層current在await之前、回覆後、核對後重查；舊成功／錯誤保持目前編修與上一份成果。來源不符時僅當外層仍current才提示重新建立；取消外層current為false時安靜丟棄。當前有效錯誤可顯示、重試可恢復。invalidate只失效自身序號；舊finally不能清掉新pending。onState僅{pending}，controller不保留報告或草稿。

`app.js` 沿既有run operation-gate／busy／revision／AbortSignal，注入api並在onReport提交files。原生選擇在busy時停用；對「選定來源變更但外層仍current」的額外錯誤保護以注入adapter測試證明，不冒充實際busy時可以變更選單。文字欄位仍可編修，native全工作台revision拒絕其晚回覆。報告與pending不進draft3或Agent wire；檢查不補寫創作。

新增固定GET `/storyboard-shot-request.js`；既有唯讀POST、Python domain／application、CLI、Agent、MCP及25组schemas保持。`needs_review=true`、完整JSON／Markdown與來源核對保持；零待辦仍須整份時間／影格／連戲及實際媒體驗證。

PolyForm Noncommercial 1.0.0、private；創辦ZOE. G／GitHub djguan-jpg。SHA與來源檢查不能證明作者權利或FreeTWAI創始身分，平台not_submitted。
