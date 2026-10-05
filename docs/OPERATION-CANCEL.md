# 共用操作取消等待契約

歌曲／分鏡工作包與報告、歌詞讀取／起稿／驗證／格式報告、音檔及接受條件報告、文字交付包使用共用 run。處理中顯示「取消等待」；使用者按下後本次 current 立即失效，再 abort 本次 native request。編修、原文、刪除還原紀錄、媒體與上一份成果保持。後續人工編修仍沿 dirty 規則停用舊成果下載；取消本身不增加 revision，不表示保存或交易回滾。

| 狀態 | 取消入口 | 其他共用控制 | current |
| --- | --- | --- | --- |
| idle | hidden/disabled | 依既有條件 | 沒有 owned job |
| running | enabled | busy | 仍需原tab/revision/source核對 |
| cancelling，task未settle | visible/disabled | busy | false |
| 同一task已settle | hidden/disabled | 既有finally恢復 | 舊handle失效，可新begin |

`operation-gate.js` 是純狀態模型，注入 createAbort，無 DOM/網路/timer。每次 begin 取得隔離 frozen job 及 native signal；已有 owned job 拒絕重複。cancel 先標記失效才 abort，重複取消 no-op；finish 只接受 owned handle，舊/foreign handle 無法釋放新任務。取消成功/錯誤都沿既有 source guard 拒絕提交。原失敗及普通 stale 編修流程保持。

app.run 將 native signal 放在本次 injected current callback context。直接 request、planning/audio closure 與 persistent seed/import/review/export/delivery controller 明確轉傳；api 僅使用明確 signal，沒有依目前全域busy猜測signal。controller額外參數保持既有預設相容；lyrics-review 新增可選 current guard，在完整回應核對及 onReport/onError 前再查。domain/application/CLI/Agent/MCP無取消或路徑能力擴張。

`operation-control-dom.js` 是固定 DOM adapter，讀 gate view、呼叫注入 cancel。只寫固定取消按鈕/提示及符合條件的焦點，沒有來源寫入或timer。cancel focus在idle refresh前記下，最後只有焦點仍在cancel/body且發起button connected/enabled/not hidden時返回；後續輸入焦點保持，重複refresh不遺失返回意圖。Enter沿原生button執行。

fetch/response body可由AbortController中斷，但已收到的後端請求仍可能完成；沒有server取消endpoint或process kill。File.arrayBuffer/WebCrypto等本機不可中斷階段仍須等其promise settle，期間顯示cancelling且保持busy，沒有提早釋放讓舊task與新task競爭。文字交付若取消時無法取得新ID，原bounded staging expiry/server close負責生命週期；已知ID原discard保持。不宣稱立即釋放後端資源或取消所有operation。

library/search/backup/file preview/ZIP import與局部校時仍依各自既有controller及取消/undo，不接入全域隱含signal。server只新增兩個固定JS靜態路由，原POST/backend code保持。無依賴、模型呼叫、登入、秘密、網路權限或wire/schema擴張。產品90，明確來源38–90共53，unknown91拒絕；基本15／啟庫22、Agent1/draft3、legal4、private與FreeTWAI not_submitted保持。

15項新測試執行gate、實際app.run/api、固定DOM與lyrics-review controller，涵蓋abort listener時已失效、owner/foreign/重試、未settle保留busy、late成功/錯誤、人工編修與原普通stale、JSON/binary/bodyabort、明確signal及focus保護。原生证据见QA-v0.90.0.md；沒有宣稱完整視覺/輔具驗收。
