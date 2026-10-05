# 搜尋取消契約（v0.93）

歌詞與分鏡搜尋各自管理一個請求。等待中按「取消搜尋」可保留上一批定位與分頁，再次尋找或前後分頁可重試。取消只結束該搜尋的瀏覽器等待；後端可能完成已開始的計算。

## 分層

`web/search-request.js` 是純 ownership lifecycle，注入 `createAbort`，沒有網路、DOM、timer、路徑或媒體存取。`begin` 驗證 factory 後保存 frozen job；`invalidate` 先放棄 ownership 再 abort，`finish(job)` 只釋放同一個 job。舊 finally 不能清掉後來的請求；正常完成不再 abort。

歌詞／分鏡 controller 沿完整 source／stable IDs／query／generation／resultRevision 核對。HTTP 前的本機SHA与回覆後完整files/data/meta檢查保持；request callback明確收到 `{signal}`，app傳給各自loopback api，沒有讀取隱含全域signal。無效factory會顯示當前錯誤但不保留job；下一次可重試。

顯式取消在仍pending且來源／可操作狀態有效時，使generation失效、清pending再abort；batch／history／source／上一份成果保持。idle cancel立即返回false，不capture、render或建立job。換查詢／原文／ID順序、切台／busy／clear仍沿原reset清舊定位，但也失效自己的HTTP。取消或晚回覆不觸發onReport／onError，舊finally不能使新請求退出pending。

DOM只顯示literal status與兩個固定取消button；只有取消button仍持有焦點、查詢欄connected且可用時返回查詢欄。後續焦點不被舊callback移動。document-owned pagehide listener呼叫cancel；idle時無副作用，沒有永久dispose或阻止返回後明確搜尋。離開／返回是否使用BFCache由瀏覽器決定，本輪不宣稱BFCache接受。

搜尋不是修改／保存作業，因此ownership在失效時立即釋放。WebCrypto SHA不能保證中斷，晚settle受current保護；快速連續重試可能有晚settle的本機工作，不宣稱停止計算或節省其已用資源。共用 `operation-gate` 的local settle後才釋放規則保持，不把兩者混用。

## 版本與邊界

產品0.93.0；唯一policy明確交付38–93共56個版本，未知94拒絕。16基本／明確啟庫23工具，Agent1／draft3／兩種search1與23既有operation input/output schemas保持。server只新增 `/search-request.js` 固定asset；沒有POST取消endpoint、CLI／Agent／MCP取消工具、路徑／寫檔／模型／依賴擴張。legal4、PolyForm Noncommercial、private、FreeTWAI not_submitted保持。

獨立preview、草稿庫搜尋、備份與其他生命週期仍依自身契約。搜尋結果與取消狀態不进草稿／備份／Agent wire；原時間、原媒體、人工後續編修與dirty提醒保持。

## 驗證與限制

見[本輪QA](QA-v0.93.0.md)。測試注入fake abort與遲到resolve/reject，驗證先失效後abort、hash期間取消、旧finish不釋放新job、保留batch／history、query/source/IDs/hidden/busy/clear、factory／錯誤重試、DOM自有焦點／外部焦點／pagehide與固定script順序。

原生合成45鏡／45句，31觀察、三尺寸；10個實際HTTP取消與7個完成，原文／報告與分頁保留、鍵盤／滑鼠focus／換來源與換台核對。pending頁面離開與新document返回已操作，但pagehide handler獨立中止及BFCache未由原生事件分離證明，只由注入測試覆蓋。保存的screenshot與DOM幾何不冒充完整視覺或screen-reader驗收；正式媒體、模型、指定Host、browser保存與平台創始認定仍未驗證。
