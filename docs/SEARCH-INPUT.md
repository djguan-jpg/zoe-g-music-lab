# 搜尋鍵盤判斷與輸入法 v0.95

歌詞、分鏡及 ZIP 原文搜尋共用 `web/search-input.js`。DOM adapter只擷取 key／isComposing／keyCode 三欄 plain snapshot；純 shouldFind 回傳是否應執行原普通 Enter 行為。明確組字 true 或 keyCode229 均回 false，不 preventDefault、不呼叫 setQuery／find／capture／onState，原候選字確認交給瀏覽器。普通 Enter 保留原搜尋與錯誤提示；按鈕沿原直接入口。

纯 metadata 精確三鍵；key需等於Enter、isComposing需false、keyCode需非負safe integer且≤0xffffffff，229拒絕；未知形狀／型別回false，不修補或更改來源。DOM沿原事件，以缺少旗標／legacy code的相容缺省false／0擷取，不新增composition listener、keyup、計時器或組字持久狀態。這是本機事件判斷，不是新domain/wire schema；不推測OS候選字、IME種類或字素邊界。

三個既有 DOM adapter → 各原 controller；歌詞／分鏡的generation、source／stable IDs、完整回覆與signal ownership保持。ZIP純搜尋／來源cache、前後分頁、已選命中、原文context及reader保持。搜尋中組字事件不取消、不建立新job；編修輸入本身仍沿原input失效規則。沒有修改字面查詢、時間、媒體、草稿、成果或平台登錄。

只serve一固定JS，不增加HTTP POST、CLI／Agent／MCP operation、模型、依賴或路徑／寫檔／network權限。16／23、Agent1／draft3／既有schemas保持；產品版本95及supported38–95共58由既有唯一policy管理，未知96拒絕。

需求依據：[MDN keydown IME事件](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event#keydown_events_with_ime)。其中組字邊界的事件可能在compositionstart／end之外，因此同時檢查isComposing與229。只用規範需求研究，程式自行撰寫，未搬入第三方程式／素材。

驗證見[QA](QA-v0.95.0.md)。合成KeyboardEvent精確測試入口與事件flags，普通Enter及按鈕使用瀏覽器實際鍵盤／滑鼠；沒有聲稱Windows OS輸入法候選面板、所有瀏覽器或screen-reader驗收。合成事件不冒充可信OS事件；未知環境仍按實際觀察處理。
