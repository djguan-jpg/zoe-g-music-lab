# 草稿保存回讀核對 · v0.69

原controller收到保存回應即呼叫onSaved，wrong ID／label亦可解除未保存提醒。本版確認完整data ACK，再用既有readonly draft_read回讀同ID的完整版本，與點擊時原稿及ACK逐值一致才確認。

## 分層與邊界

library-receipt.js為無I/O／DOM／media／路徑的純checkedAck與checkedReadback。ACK exact entry／reused strict bool／draft_only_not_validated，entry exact library1／draft3／ID／label／UTC保存時間／有界bytes與SHA格式／created_with／三項title。title按Unicode codepoint取原稿前120字元，原值含空白、CRLF與Unicode保持。完整回讀exact entry／draft／status；entry必須等於ACK，draft經既有validateDraft後與完整click-time draft逐值一致，含saved_at／tool_version／tab、全部四panels與列順序。物件鍵順序不是來源證明；所有返回值隔離。

createVerifier只注入read(id)與validate，先核對ACK再讀、兩個async邊界保留隔離原稿。app提供既有/api/drafts/read且只傳ID；原/api/drafts/save保持。新純層檢查data，沒有新增整個HTTP meta／files的wire核對。library controller required confirmSave，未提供就拒絕初始化；測試中explicit identity callback只隔離既有controller測試，production必須使用完整verifier。

backend DraftLibrary.read原本核對磁碟record／draft格式、原bytes長度與SHA。browser此輪比較完整回讀內容與metadata，沒有獨立取得磁碟canonical bytes來重算SHA；一致不證明作者、權利、作品接受、耐久保存或原子交易。沒有增加密碼、模型、外部網路、任意路徑或常駐服務。

## 保存狀態

click時保存隔離ID／label／完整draft，直到read確認前saving=true，重試與放棄停用。先取得ACK後，ACK拒絕／read錯誤（包括4xx）／完整內容不符都保留uncertain pending；只有原save在ACK前的4xx拒絕沿舊行為清pending。無自動重送。明確retry送同ID與原payload，backend immutable/idempotent save重用已存在且同內容版本；read再次核對才onSaved。

確認後才retain原click-time checkpoint；current capture指紋與原稿比較以顯示後續修改尚未保存，原編修不被回讀覆蓋。failed不清dirty提醒，已確認原案也不替後續編修解除提醒。放棄pending只清本頁待重試紀錄，不刪磁碟版本；重新整理清單不代替保存確認。沒有自動保存／無資料遺失承諾；page生命周期仍沿既有限制。

產品69、交付明確38–69／未知70；Agent1／draft3／library1、14基本／明確啟庫19工具保持。CLI／Agent／MCP仍走既有application及immutable library。legal4 PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、private、FreeTWAI not_submitted保持。
