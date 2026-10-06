# 單鏡待辦逐項定位與欄位可見性（v0.114）

點選清單定位到後面的鏡頭後，可以在既有固定分鏡定位列按「上一項待辦／下一項待辦」。直接點清單也會接續到那一項；「重查這一鏡」重用原local檢查，不呼叫模型或HTTP。首／末不循環，新報告只重設游標，不自動搶焦點。零待辦仍需整份時間／影格／連戲與媒體驗證。

純 issue-cursor.createController 注入capture／onLocate／onState。只取有界metadata {detailCount,hasReport,revision,stale,busy,visible}，最多32明細；無來源全文、媒體、DOM、網路、timer或持久狀態。前後重查同一報告revision／count與可用狀態，onLocate明確true才提交index；失敗、來源變更、busy或換台不能前進。新revision／count重設；stale精確復原可保留原位置。舊清單callback的revision先拒絕，原Checkpoint仍核對完整選定context與stable IDs。輸出只index／revision／count／前後可用／提示，不進draft3、Agent或報告wire。

storyboard-shot-review-dom沿原source controller，將清單與工具列接至同一游標，literal text與disabled狀態分層；重查透過注入callback呼叫既有按鈕。busy、hidden、空選擇重查停用；取消／晚回覆契約保持。原報告schema與JSON／Markdown bytes除產品metadata版本外不變。

原共享focusShot只捲到鏡頭卡片開頭再preventScroll聚焦，後面的畫面動作／鏡頭運動可在viewport外。新增純shot-field-position.scrollOffset核對有界四個有限數值top／bottom／height／coverBottom，依上下12px間距與工具列下方可用範圍計算delta。已可見不捲動，超高欄位只露出開頭，不宣稱完整容納。app保持展開原卡片與focus，再注入實際DOM rect／viewport，以window.scrollBy補位置；不改選擇、表單、草稿、File或播放。summary／不存在鏡頭保留原卡片導覽。高度≤620px工具列static，避免固定列遮住整個短viewport；窄寬按鈕換行。幾何驗證不等於完整視覺或screen reader驗收。

新增兩個固定GET /issue-cursor.js與/shot-field-position.js，按依賴順序於app前載入。既有application／CLI／Agent／MCP／HTTP POST／25組schemas保持，18基本／明確啟庫25；Agent1、draft3及單鏡review1獨立。唯一delivery policy明確38–114，未知115拒絕。

PolyForm Noncommercial 1.0.0、private；創辦ZOE. G／GitHub djguan-jpg。平台not_submitted；SHA、來源與待辦不證明作者權利或平台創始身分。
