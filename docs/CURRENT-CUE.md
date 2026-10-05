# 目前歌詞與原列定位（v0.81）

音檔未就緒時，舊工作台仍會以播放器預設的零秒選中已校時句子；換檔期間也可能保留舊句。現在目前歌詞與列高亮共同使用已載入媒體的來源、時長、位置及就緒狀態。按「前往目前這句」或 Enter，明確移動到原列歌詞文字欄位。

## 分層與資料

`current-cue.js` 是純模型與注入 controller。輸入只能是 `{media, rows, visible, busy}`；media 沿既有 wave-position 嚴格契約，rows 是原順序的 `{id, start, end, text}` 原字串。最多10000列、唯一ID最多64字元、開始／結束各最多4096字元。使用 cue-stamp 的原時間文法與毫秒規則，再交給 editor-state.activeCueIndex；不另猜時間、合併或排序。

輸出只含原列 index、ID、原文字、可定位旗標及固定提示。缺媒體、來源不同、未就緒、媒體錯誤或工作台不可見時顯示等待，清除全部高亮並停用定位；有效音檔的空隙／句尾顯示「…」。部分有效列可供播放顯示，原空白列仍保留；重疊沿既有最後命中規則，不代表整份表格已通過匯出驗證。busy 時可讀目前句，定位停用。

## 明確定位

controller 在操作時重新 capture 兩次，核對可見、非busy、可定位媒體及同一目前ID；原目標 start／end／text 和媒體 source／current_source／duration 必須一致。自然播放在同句內前進，或其他列的編修，不必阻擋；前面未校時列刪除後，依穩定ID取得現在原列位置。

DOM adapter 在最後定位前再核對原列ID、三個原欄位、可見工作台及 enabled／connected 文字欄位。只捲到該列並 focus 文字，確認 document.activeElement 確實是目標才回報成功。拒絕或失敗不虛報定位；refresh 不搶焦點、不改文字／時間／媒體、不 markDirty，也不建立撤回紀錄。

`current-cue-dom.js` 使用 literal textContent 與固定按鈕；文字留白僅顯示提示，原資料保持。文字與role=status只在值改變時寫入，避免每影格重寫相同提示。dispose 只移除自己擁有的click listener。app 從共同 captureLyricPlayer 和原表格entries提供資料，沿既有 drawWave／tick、原列render、busy、頁面切換及媒體生命週期 refresh；沒有第二個計時器。

## 邊界與版本

controller 不持久保存完整來源、歷史、媒體或URL；DOM不進純模型。兩個JS由固定server資產路由提供，沒有新HTTP操作、JSON路徑、檔案寫入、模型或外部網路能力。沒有新增依賴。

產品0.81.0與預期tag v0.81.0同步；交付來源38–81共44項、未知82拒絕。Agent1、draft3、14基本／啟庫21工具及領域schemas保持。目前句與焦點皆為本頁暫態；PolyForm Noncommercial、private、ZOE. G及FreeTWAI not_submitted保持。媒體就緒與導航不代表實聽、完整歌詞、權利或平台創始接受。
