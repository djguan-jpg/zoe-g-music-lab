# 歌詞建立與回讀的來源核對（v0.52）

按「驗證並建立歌詞包」時，回應必須屬於本次送出的句子或完整歌詞包。修正前有效但不同來源，以及缺少meta／完整檔案的不完整回應都會替換表格；outputs/v52-qa/gap-evidence.json記錄兩種基線重現。

## 分層

Python純lyrics／lyrics_package與共用application仍產生HTTP／CLI／JSON-lines／MCP同一wire。原生JS lyric-time及lyrics-package → web/lyrics-result.js純expectedBuild／textFiles／checkedResult → lyrics-import controller或app建立adapter → revision檢查／DOM與成果提交。純層不呼叫HTTP、不讀DOM、不寫檔、不持有媒體或應用狀態。

建立只接受精確{title,cues,duration}或{package}的工作台請求。第一種重用毫秒規則、排序、結束推估與總長來源，保留原title／單行literal text，生成format1／review_notes空陣列；第二種直接驗證已由既有buildRequest明確編修的package，保留historical shift／notes／inference。這個內部browser helper不是Agent新操作，不取代application對CLI的shift／time_changes／text_changes支持。

expected與回覆皆完整package1；根keys、meta keys／protocol1／needs_review、精確四files、完整data、嚴格有界JSON與expected語義相同，LRC／SRT按原cues精確文字比較。物件鍵順序無關，array順序／原字元／數字／未知欄位／版本仍嚴格。meta.version沿既有非空字串契約，產品版本與wire schema分開，不把版本文字當來源證明。

preview.html僅存在與字串型別檢查，不執行、不完整核對HTML语義。JSON原文入口沿外部嚴格decoder；生成回應JSON也改用同decoder，重複keys／Unicode／非有限／大小／深度規則保持。returned metadata或自洽JSON不足以證明來源。

lyrics-import對LRC／SRT以既有純parser取得原cues，plain JSON array／精確{cues}也派生原cues；完整現代／明確legacy轉換以package期待。所有帶時間回覆共用checkedResult核對四檔再preview。TXT／lyrics_seed原契約保持。選檔／原文讀取／預覽／明確Apply與scope Undo、raw-fields／duration／media／其他panel保持。

## 提交與失效

app先隔離期待，再送請求；回應後先isCurrent，再checkedResult，最後才invalidate校時proposal／renderCues／setFiles。來源不符或不完整只顯示錯誤，保留原列ID／句子／時間／原文／時長、上一份成果及待套用校時。有效回應才沿既有行為提交；舊校時卡片文字可能保留，Apply停用，不能以卡片文字推定仍有ready proposal。後續編修照常將舊成果標stale／停下載。這是資料核對，不代表實聽、模型或媒體驗收。

SRT空白cue不能無損回讀，請用版本1JSON保存；物理多行仍 / 合句，原排版保留原檔。LRC相鄰行首時間標籤歧義規則保持。四檔生成不代表每個文字格式都可表達完整package歷史。

產品0.52與明確交付來源0.38–0.52同步；Agent1／draft3／各schema獨立，12基本／啟庫17工具保持，無新依賴／模型／外網／路徑或自動寫檔權限。


## v0.55 更新

本文件 v0.52 的 HTML 僅存在／字串限制已由完整預覽核對取代；目前 schema1 共用固定範本、完整內嵌來源與全部固定模組／程式碼一致才提交。回傳 HTML 仍不執行。詳見[目前契約](LYRICS-PREVIEW.md)。
