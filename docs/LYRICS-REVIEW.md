# 歌詞表格校時檢查 schema 1

`lyrics_review` 是獨立唯讀診斷。它接受尚未完成的表格，不把診斷報告當歌詞包，也不補時間、裁切／移動句子或排序原表格。最終匯出仍走 `lyrics`／lyrics_package 完整驗證；檢查無問題不證明實聽同步或ASR。

## 輸入

JSON物件只接受 `cues` 及可選 `title`／`duration`。每句精確三欄 `start`／`end`／`text`，時間為文字、有限數字、null或布林；布林與無效十進位文字成為時間待辦，不當有效數字。null／Unicode空白是未標記，負值在毫秒捨入前拒絕，半毫秒取離零一側。已填區間須 end > start。單行歌詞與重複文字原樣保留，文字最多2000字；title非空白1–200字，預設「歌詞校時檢查」。

最多10000列，transport request仍2MiB。欄位容量另採共用預算：文字以UTF-8 JSON字串bytes計，非文字scalar各32bytes，合計最多2MiB；不因Python float／JS integer序列化差異改變閾值。未知欄位、版本覆蓋、路徑、物件時間及非有限數字拒絕。完整歌詞包不能直接當request；不要丟掉它的metadata後宣稱原包已驗證。

```json
{"title":"原創待辦","duration":"10","cues":[{"start":"","end":"","text":"尚未標記"},{"start":"0","end":"2","text":"已校時"}]}
```

## 報告與位置

`format=zoe-lyrics-review`、schema_version1。source保留原始title、duration、全部cues及原順序，省略title／duration時填明確預設／null。status為needs_correction或timing_checked；空表格必有no_cues，不能宣稱通過。total_rows是原表格列數，timed_rows只表示開始／結束有效且end較晚、文字單行的局部區間數，仍可能與其他句重疊或超出總長。blocking_rows計至少一項列問題的不同句數；全域duration／空表格問題另用row0。

issues包含row、field、code、related_row、message。row從1起，依原表格列號，不因時間排序改號；全域row0。field為start／end／text／duration／cues；related_row給重複／重疊對方。duplicate_start、overlap、past_duration、missing_time、invalid_time、invalid_end、multiline_text、invalid_duration、no_cues有固定碼與訊息。

暫時按有效start排序檢查，保留原row；用目前最遠有效end作占用界線，能找出跨多個短句的長句重疊。exclusive end與下一句start相同可接受。重複開始與重疊可各自列出，不去重問題種類。issue_count和blocking_rows涵蓋全表；issues最多前200項，details_truncated明示。工作台最多列前20項，全部已檢查，修正後重查；aria-invalid只對本次有明細的欄位標示。

所有結果meta.needs_review=true，表示仍需人工實聽。JSON／Markdown是診斷成果，不能以它作已同步歌詞或媒體完成證明。

## 分層與入口

lyrics_review.py純資料／診斷／有限明細與markdown，無I/O。共用lyrics-review.js核對同一規則、真HTTP結果／schema／source／全部計數／JSON與Markdown；未知或矛盾報告拒絕。注入controller核對最新token、按下時隔離snapshot及實際目前內容；晚成功／錯誤不覆蓋後續編修。app只做安全文字、欄位標示與focus；報告與定位暫態不進draft3。

CLI、HTTP、JSON-lines、MCP共用application；產品0.25.0，診斷schema1獨立。operation／tool名稱 `lyrics_review`、HTTP POST `/api/lyrics-review`，預設七tool、啟庫十二tool。MCP readOnlyHint=true、openWorldHint=false，不增加路徑權限；Agent1／MCP2025-11-25與其他domain schemas不變。

```powershell
python music_lab.py lyrics-review --input partial-cues.json --out outputs/lyrics-review
```

CLI0：檢查無問題，仍需實聽。CLI2：診斷已保存、存在待修正問題；不是已完成字幕匯出。CLI1：request／I/O／覆寫拒絕等錯誤。來源不改，輸出預設拒覆寫，明確--overwrite才替換。本輪覆寫拒絕、真正四adapter與browser下載證據見QA-v0.25.0.md。

獨立preview.html的原生file:播放／下載仍受browser工具政策限制，本輪未變更或驗證該頁；沒有繞過。完整視覺／正式歌曲實聽／特定AgentHost仍未完成。
