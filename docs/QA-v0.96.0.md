# v0.96.0 驗證

577 Python85.250秒（兩隔離workers／120秒整體期限）／1110 JS／108 syntax／四Skills；11項新測試。v95原ZIP還原572／1104，232歷史ZIP／manifest bytes相同，23舊operation input/output schemas相同。27原生狀態、22份各599來源欄位核對；桌面／390px滑鼠與Enter定位、拒絕／恢復、總長採用／撤回、負鏡尾新增拒絕、有效新增／刪除及晚回覆保留。7原生完整HTTP回覆等於application；實際CLI／Agent／MCP及6個直接HTTP good/bad/good核對，診斷CLI2／invalid1無輸出／預設覆寫1 bytes保持。2tabs關閉、viewport reset、2bounded servers及臨時HTTP thread正常停止，console0。瀏覽器文字下載click已送出但download事件逾時，未確認保存；完整視覺／screen-reader／正式媒體／Host／平台接受仍未驗證。

|項目|結果|
|---|---|
|身份／非空白／無framework overlay|127.0.0.1:8875、創作工作台、原四台與成果呈現|
|Console|0 warn/error|
|本機互動|負值拒絕、定位、恢復、總長採用撤回、新增拒絕及原列保留|
|來源|22完整snapshot各599欄位；只允許本次明確clock／總長編修|
|晚回覆|來源改動後保留編修與上一份成果，fresh retry接受|
|截圖|outputs/v96-qa四份JPEG保存；沒有嵌入對話|
|瀏覽器文字下載保存|未確認；click後download事件逾時，沒有虛構檔案|
|原封裝還原／歷史交付|v95真ZIP572／1104；232 ZIP／manifests bytes一致|
|工具|23 schemas相同；7原生回覆及CLI／Agent／MCP／6直接HTTP完整核對|

修正前native baseline極小負開始被顯示0–6秒，且宣告300時仍可採用鏡尾；獨立application與純timing在原270秒宣告直接重現誤接受／零待辦。修正後原負字串保留，invalid_range定位原列，建立拒絕；真正Unicode負零與正下溢可恢復。

工具驗證helpers首次有QA錯誤：fixture numeric與browser raw strings／example metadata映射、draft fields按scope flatten、CLI--brief、不可覆寫既有QA input、MCP storyboard_plan名稱、diagnostic CLI exit2。原失敗helper及run records均保留，fresh helper及fresh namespace完成；未藉此修改產品CLI/MCP契約。首次focused unittest使用tests package路徑不存在，改以既有discovery核對通過；首次DOM觀察使用不存在operation-status，改讀實際operation-bar，未觸發操作。沒有重送已啟動的工作。

使用frontend-testing-debugging技能；Browser技能未列出，依可用CUA原生browser APIs完成，沒有Playwright shell fallback或新增依賴。流程：本機分鏡→原時間編修→檢查／建立→原列定位→回覆來源保護→修正重試。桌面與390×844採read-only DOM觀察、原生locator click/fill/Enter及screenshots本機落檔；tab163/164關閉、viewport reset。完整視覺／screen-reader／實際保存／媒體／Host／平台未接受。
