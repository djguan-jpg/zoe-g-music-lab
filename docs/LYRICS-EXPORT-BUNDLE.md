# 格式報告與完整歌詞包

格式報告建議以完整 lyrics.json 保存來源。v0.54讓單獨檢查時可一起取得對應完整歌詞包，不必再次從別份內容建立。完整JSON保存目前已驗證的包資料值（含字面歌詞、時間來源、可選shift及review_notes）；原JSON的空白排版、object鍵順序或數字字面表示不承諾逐bytes保存，請另保留原檔。

## 明確選擇與限制

application／Agent／MCP `lyrics_export_review` 及 HTTP `/api/lyrics-export-review` 接受精確 `{package:現代完整包,include_package:true}`。include_package可省略或false，預設回原先兩個lyrics-export-review.json／.md，data、meta及來源SHA完全保持；true附加lyrics.json，共三檔。值必須是boolean，null、0、1、字串、列表或object拒絕；未知版本／path／URL／extra欄位拒絕。無新operation、模型、依賴、路徑或自動寫檔權限，13／18工具、Agent1／draft3／review1／source1保持。

完整附檔從同一份已驗證及複製的來源序列化，不重新讀可變呼叫端object；report仍是精簡來源摘要，不放完整cues。完整源JSON UTF-8最多2MiB，報告256KiB。來源SHA沿用[export-source1](LYRICS-EXPORT-REVIEW.md)，所有包資料／timing／history參與，include_package不改其值。

CLI `python music_lab.py lyrics-export-review --input lyrics.json --include-package --out outputs/format-review` 明確輸出三檔；旗標只存在此subcommand。0表示已查欄位沒有提醒，2表示有提醒但成果已寫，1為拒絕；輸入檔保留，exclusive-create預設不覆寫，明確--overwrite才替換指定输出。多檔寫出失敗可能已有部分檔，不能宣稱交易式全有全無。

## 分層與瀏覽器

Python純模型checked source → report／bundle →共用application →四種adapter。原生JS files(data,payload)共用相同報告及optional附檔；inspect核對完整wire資料、meta、兩報告JSON／Markdown與精確files鍵，要求full source時也核對strict JSON／2MiB／所有來源語義值。附檔漏失、多出、損壞、duplicate keys、錯歷史或錯来源皆拒絕。驗證前capture深拷貝；async SHA後重查current／scope／sequence／row IDs，late／cancel／改稿保留現有編修與成果。

「建立格式報告與歌詞包」明確請求true，安裝三個成果且不修改原文／表格／名稱／時長。建立歌詞包用本次已核對來源產生原lyrics.json／.lrc／.srt／preview.html與兩報告，共六檔。下載使用既有本輪ZIP流程；本輪原生檢查只確認控制可用及內容預覽，未驗證瀏覽器保存的檔案。提醒stable ID定位／stale停用保持；新增CSS只讓長提醒按鈕限寬換行，表格保留自身捲動。

無編修時完整包保留既有來源及歷史。編修後建包依既有provenance規則保留先前review note，加入逐句編修說明，移除舊applied_shift_seconds主張；完整附檔保存這份目前建包結果，不將舊shift說成新編修已驗證證據。LRC缺句尾、LRC／SRT缺metadata限制仍在；零提醒不代表實聽、外部播放器、作者或版權驗收。

產品0.54／明確交付來源0.38–0.54；未知來源拒絕，schema不靜默升級。ZOE. G／djguan-jpg、PolyForm Noncommercial1.0.0／private與FreeTWAI not_submitted保持。
