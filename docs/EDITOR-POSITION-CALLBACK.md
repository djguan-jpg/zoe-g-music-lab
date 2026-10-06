# 指定移動回呼隔離 v0.104

指定位置移動的成功通知只在實際列順序、選列與原始請求一致時發出。修正注入回呼能修改共用提案、使錯誤排列或選列被判為成功的問題；普通瀏覽器 adapter 並未修改此提案。本輪隔離回呼資料，歌曲、分鏡及歌詞的原按鈕／Enter、原文與時間、逐鏡展開、同列焦點及後續編修撤回保持。

editor-position 純五欄來源／排列提案 → injected controller 保留自有 expected → writer 專屬六欄 DTO（before 五欄及 ids、afterIds 另複製）→ 原 raw-source order controller → 原始 expected actual-after → 固定原始位置通知。button／Enter 共用 finish；允許回呼修改自己的副本，不以 freeze 改變回呼介面，保留讀取次數與原 current-before／after-consume／false writer 語義。拒絕不符時不覆蓋或回滾外部編修。

產品0.104.0／唯一 policy38–104共67／unknown105拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改一個純控制器，沒有 DOM／app／server／adapter、固定資產清單、依賴、路徑或網路權限變動。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

原 proposal 保持六鍵 list／id／index／from／before／afterIds（before 僅 ids／selected／position／visible／busy）。finish 傳出新的頂層物件、新的 before 物件與兩個新的 dense ID arrays，字串／數字／布林沿原值。控制器核對與成功通知只讀本次自有 plan 及 before，不接受回呼再指定 expected、selected 或通知位置。writer 可以修改或保留它收到的 DTO，不能藉該副本改变後續 current 比較；不強制凍結回呼值。

錯誤 writer 回 true 仍須完整 actual-after；修改 expected arrays、id 或通知值不會改核對基準。回 false／throw／actual mismatch 保持原拒絕與 onError；已寫入的外部來源不回滾，只有成功才 onMoved。傳出 DTO 不含創作全文、File、DOM、路徑或 history；原 raw writer 自行驗完整原字串、時間與 actual-after 後才建立最近撤回。

既有 DOM adapter 只將 list／id／index 原始值交給 app，實際 UI 未改。普通 Enter 在寫入前保留兩次 current／consume 檢查；blank／invalid／current／repeat 仍沿既有 hold 語義。既有13/18或早期tools計數為歷史；目前16/23與所有schema保持。
