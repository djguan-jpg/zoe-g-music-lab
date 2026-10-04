# 歌詞匯出格式保留 v1

完整版本1 lyrics.json 是保存歌詞包的格式。LRC只保留開始與文字，句尾會重推；SRT保留起迄與單句文字，但兩者都不保存作品名稱、總長、估計来源、校時歷史與 review_notes。本檢查不改寫原句、不阻止既有匯出、不猜時間。只檢查本工具的文法；其他播放器、實聽同步、作者及權利另驗證。

## 輸入與提醒

operation／MCP tool `lyrics_export_review`、HTTP `/api/lyrics-export-review` 精確接受 `{package:完整現代歌詞包}`。既有 validate_package 核對格式／版本、2MiB、10000句、完整時間及 metadata；原cue列表、legacy、URL／path與額外欄位拒絕。CLI `python music_lab.py lyrics-export-review --input lyrics.json --out outputs/format-review` 明確讀原JSON，來源不改；0無已查欄位提醒、2有提醒但報告已寫、1拒絕。exclusive-create預設不覆寫；多檔失敗可能部分寫出。明確 --overwrite 才替換指定輸出。

LRC原句第一個字元即符合既有 TIMESTAMP grammar 時，leading_time_tag 提醒相鄰標籤會被當额外時間或拒絕。前置空格或不符合grammar的中間字面標籤不列此項。SRT原句只含 ASCII空格／tab（含空字串）時，blank_srt_line 提醒回讀缺文字；U+0085／U+2028／U+2029／NBSP不是此空白規則。現有解析文法／輸出不變，不加入逃脫格式。

## 來源與報告

`zoe-lyrics-export-review` schema1獨立於 package1、Agent protocol1與draft3。data含來源title／duration_ms／estimated／cue_count／sha256、格式保存欄位、全部issue_count與前200項 issues、details_truncated、recommended_preservation及固定review_notes；沒有完整歌詞。兩個固定 files為lyrics-export-review.json／.md；tested最大明細合計低於256KiB。meta.needs_review始終true。checked_cue_fields_preserved只聲明所列欄位，不是完整檔案保存或品質判決。

SHA-256來源表示 `zoe-lyrics-export-source` schema1按固定欄位順序建立緊密UTF-8 JSON。包版本、title、整數duration_ms、estimated、按package順序每cue(start_ms,end_ms,text)、timing(duration_source,inferred_end_count,tail_end_inferred與optional applied_shift_ms)、review_notes全部參與。每個秒數經共用milliseconds核對；Python1／JS1.0表示與原object鍵順序不改雜湊。hash核對來源，不證明作者、簽章或權利。

## 分層與畫面

Python純model／原生JS純model共用既有package與LRC grammar；application產生DTO與報告；CLI／JSON-lines／MCP／HTTP同一服務。基本工具13、明確啟庫18，重新discovery。新operation無模型、網路、路徑或自動寫檔權限。

Browser controller capture本輪完整package與內部排序row IDs，深拷貝送出，scope／sequence／完整capture在等待及SHA核對後重查。錯資料、metadata、嚴格JSON或Markdown全部拒絕；取消／late／改稿保留原成果。DOM列前20項，以stable ID顯示和定位當前表格；報告的row是時間排序package的一基句號。建包成功後原表格按時間排序并自動顯示檢查；單獨檢查不排序／改表格。編修后舊定位停用，report不入draft3。

產品0.53與明確delivery來源0.38–0.53同步，未知來源拒絕；既有wire及schemas保持。PolyForm Noncommercial1.0.0、ZOE. G、private與FreeTWAI not_submitted保持。
