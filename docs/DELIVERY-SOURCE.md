# v0.48 大檔來源與輕量畫面

同一份交付成果的閱讀、搜尋、狀態刷新仍核對原始來源。這輪減少重複全文複製，不改寫文字、不跳過ZIP完整驗證，不以revision未變代替原值核對。

`delivery-source.js`只處理本工具內部plain bundle。snapshot遞迴複製container，字串／primitive原值保留；media array隔離但原生File參照保持。current一次capture後，精確核對scope／revision／resultRevision／全部bundle值與key order／media身份及busy。文字CRLF／BOM／控制符號／空檔／missing維持區分，直接in-place修改即使revision未變也拒絕舊來源。它不是外部JSON解碼器；外部輸入仍由既有嚴格parser／schema／全份ZIP reader驗證。

`delivery-import.js`私有job／pending／undo保持。`view()`及`refreshView()`回傳reading／pending／canApply／canUndo、隔離的inspection metadata `source`及comparison，不含files／proposal原文；`onView`訂閱此狀態。既有明確`status()`／`refresh()`及`onState`仍提供隔離full proposal，呼叫時仍可能複製全文。DOM adapter明確以onView／refreshView更新清單、reader與searcher，完整Apply／Undo仍隔離傳給修改callback。

原文比較preview私有cache只留最近一個檔名的雙側摘錄（每側最多32768 UTF16 units、不拆surrogate）及完整line-ending counts；不快取全部檔案。對外回傳隔離小副本。換檔／新ZIP／cancel／apply／undo清除或取代；檔案／before baseline／pending原字串本來就隔離，不受view或preview外部編修影響。reader／search共用既有單個最多8MiB prepared buffer，失效保護保持。

合成Node fixture8388598 bytes，30次window＋UI路徑refresh：baseline14,060.47ms／270 structuredClone calls／2,516,606,400 JSON chars；after0.99ms／60個metadata clone calls／0 JSON chars，兩次都拒絕same-revision原文改動。這是本機單次量測，未含ZIP解碼／完整雜湊／首次encoding／搜尋全文／DOM操作；不宣稱瀏覽器延遲、確切heap節省或跨機固定倍率。測試用直接禁止全文clone／JSON serialization驗證機制，不用脆弱時間門檻。

產品0.48與來源工具0.38–0.48明確列入，未知拒絕。沒有新增wire/schema/tool／依賴／模型／路徑／寫檔權限；12／17tools、Agent1／draft3與交付schema保持。來源、query／batch、表單編修、busy與File身份、晚回應、取消與限定Undo的既有保護照常。正式媒體／實聽、完整視覺與Host／瀏覽器保存／FreeTWAI尚未核實。


## v0.60 ZIP核對的本地失敗狀態

`delivery-import` controller持有scope/latest job失敗；view/status加隔離nullable failure `{code,message,truncated}`，message最多240 Unicode字元加ellipsis。只屬本地UI metadata，原HTTP/Agent/MCP wire與schemas不變。early invalid/busy與讀取／完整核對拒絕皆保持原成果；onError原error callback不改寫。新選檔／cancel／apply／undo清除，scope refresh清除，old/cancelled promise不恢復錯誤。DOM literal text保持local role=status，失敗可清除／重選，clear只走既有cancel，不取消scoped undo。相同note不重寫，減少普通refresh重複live通知；未做真人screen-reader驗收。見[契約](DELIVERY-FEEDBACK.md)。
