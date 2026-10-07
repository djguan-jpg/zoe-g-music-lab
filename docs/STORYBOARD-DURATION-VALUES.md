# 分鏡總長的原值分類

本契約補充[作品總長與鏡尾](STORYBOARD-DURATION.md)；目前使用入口見[開始指南](START-HERE.md)，既有投稿／作者未核實狀態見[平台紀錄](../PLATFORM-STATUS.md)。

`web/planning-values.js`沿Python str.strip欄位空白規則，`web/storyboard-duration.js`的compare使用同一helper一次判定宣告是否空白。Python application時間報告、原生storyboard-timing與此宣告提示因此一致。U+FEFF不是欄位空白：BOM-only為無效宣告，顯示「請核對宣告」，時間待辦列數字格式錯誤。U+0085與U+001C–001F-only為留白宣告，顯示「尚未宣告」，時間待辦列尚未填寫。

此空白分類不等於數值接受。共用number仍使用有限十進位及其數值空白文法；包住數字的C0 separators或BOM不能藉分類成為合法數值。合法數字、Unicode十進位數字、下劃線、範圍及影格接受沿既有planning-values／storyboard-timing。宣告需大於0且不超過14400秒；候選仍完整檢查原鏡時間及影格覆蓋。

compare只產生有限提示與候選，不修剪、正規化或寫入原字串。有可用鏡尾時區分empty／invalid／matches／differs；沒有可用鏡尾時仍為unavailable，宣告標籤仍按原值分類，不能呼叫採用寫入。這些暫態提示不進draft3、成果或Agent wire。

既有注入controller只在明確採用後寫入原鏡尾字串；使用者未重新核對的任何原宣告變更，即使兩份都是留白，也拒絕舊offer。撤回仍核對原FPS、鏡頭ID／原時間／順序／數量與實際after，回填之前的原字串；BOM／NEL／控制空白均逐字保留。後續創作文字、其他工作台与媒體保持，時間來源變更仍拒絕撤回。DOM只呈現controller結果與既有按鈕，app的限定writeValue／markDirty保持。

沒有新的HTTP／CLI／Agent／MCP操作、schema、依賴、asset或路徑／網路權限。22基本／明確啟庫29操作、Agent1／draft3／template1保持；完整資料建立、實際畫面與音畫同步仍是各自接受。驗證見[本輪QA](QA-v0.162.0.md)。
