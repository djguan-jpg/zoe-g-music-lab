# 完整焦點列身份 v0.106

修正共用編修焦點來源驗證跳過空洞 ID、接受繼承的數字位置，或被來源自訂 mapper 替換列 ID 的問題。完整自己的 ID 位置才可進入定位與選列；錯誤來源拒絕，正常請求可繼續。原生 UI 本來產生完整 ID 陣列，本輪沒有宣稱瀏覽器內存在惡意回呼或外部漏洞。

editor-focus.checkedSource 純有界 length／own-index／ID 字串及唯一性檢查 → 隔離 dense ID 副本 → 原 index／ID proposal 與兩capture controller → 未改 editor-focus-dom。editor-selection 共用同一來源再沿原三capture／actual-after與DOM；不呼叫 caller map／iterator。固定原 length 控制讀取次數，讀完長度改變拒絕，不因 getter 增長超出上限。

產品0.106.0／唯一 policy38–106共69／unknown107拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模型，app／HTML／DOM／domain/application/server/adapters與固定資產清單無diff，沒有新依賴、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

來源維持恰三欄 ids／visible／busy 與六固定集合上限：arrangement40、music-avoid100、music-deliverables100、motifs30、shots1000、cues10000。原 ID 非空1–64字元、唯一性與精確布林契約保持。raw必須是Array，讀取一次length並核對safe integer非負及capacity。固定0至length−1逐一Object.hasOwn(raw,i)才讀值，字串檢查後push至自有dense array；讀完raw.length變更拒絕，最後以自有array核對duplicate。caller.map及Symbol.iterator完全不讀不呼叫，其額外存在不改变實際own位置的值。副本不持有原array。

new Array(1)、首／中／末缺列、delete掉numeric slot、只由prototype提供numeric slot均拒絕；一個完整正常自有array即使具有自訂mapper/iterator也按自己的索引值隔離複製。沒有「補undefined」、自動壓縮空洞或從prototype補值。empty array仍是合法完整來源，原index0 add fallback保持；focusId仍不得空列回退。dispose、unknown-list早拒絕及confirmed focus===true保持。

focus的first/second capture任一無效皆onError/false且不調focusTarget；原before/after所有ID與visible/busy比對沿原路徑。共用selection first/second無效不調selectTarget；第三capture無效表示已發生操作後來源不符，回false/onError並保留外部現狀，不回滾或假稱成功。valid/bad/valid不污染後續請求，沒有history/cache/timer或輸入正文。

不能以此宣稱通用Proxy/accessor/pollution安全或外部同時改寫的原子快照。來源讀取仍是本次明確注入契約；檢查固定length只保障讀取容量，修改owned ID的getter仍需原second/current guard。app、DOM、HTTP、CLI、Agent、MCP未改，沒有新操作或路徑權限。
