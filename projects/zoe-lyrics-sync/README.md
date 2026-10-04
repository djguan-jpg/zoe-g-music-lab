# ZOE Lyrics Sync

v0.51：SRT保留每行空白、tab與Unicode原字元，真正多行仍以 / 合句；原排版保存原檔／draft3原文，空白cue用版本1JSON。獨立Python／JS parser與integer clock、單次文首BOM共用adapter；browser從LRC／SRT原文核對cues／time／inference及文字輸出再preview／Apply。末句原結束估總長不填宣告、不宣稱音檔確認。見[契約](../../docs/LYRICS-SRT.md)、[QA](../../docs/QA-v0.51.0.md)。

v0.25「檢查校時進度」可接受時間留白，找出原句缺失／重複開始／跨句重疊／超出宣告的位置，按待辦定位欄位。建立包失敗也定位第一項，原文與音檔保持；編修後舊報告過期、停用定位和下載。JSON／Markdown報告是診斷，不是完成字幕；最多10000句、全部count／前200明細與頁面前20項。Agent／MCP唯讀lyrics_review和CLI lyrics-review沿用同一層，CLI2表示診斷保存且有待修正項目。見[契約](../../docs/LYRICS-REVIEW.md)／[QA](../../docs/QA-v0.25.0.md)。

v0.24 選音檔與作品宣告分開。已有十秒宣告、選六秒音檔仍保持十秒；需要新時長時按「採用選定音檔時長」，再驗證。撤回只改時長、保留後續歌詞；後來改時長或換來源會停用不安全撤回。原本空白且讀取期間未編修才自動接續首次時長。較短時長不裁切歌詞；獨立預覽也須明確採用並套用。見[契約](../../docs/LYRICS-MEDIA-DURATION.md)與[QA](../../docs/QA-v0.24.0.md)。

v0.20接續外部JSON共用嚴格UTF-8與重複欄位檢查；損壞編碼／重複版本拒絕，不修補後替換目前內容。CLI外部JSON最多2MiB，工作台需求／分鏡起稿／草稿仍1MiB、歌詞JSON2MiB；單BOM規則與領域schema分開。見[本輪QA](../../docs/QA-v0.20.0.md)。

v0.19完整歌詞包回讀保留作品名稱、宣告總長、明確句尾與推得時間來源。歌詞兩秒結束但歌曲十秒，回讀仍保持十秒；離線預覽確認音檔總長也保留曾推估句尾的提示。工作台時長衝突拒絕，估計值不自動填入時長欄；未知包版本、重複JSON欄位與矛盾資料拒絕。舊完整JSON須明確「轉換舊歌詞包並套用」或CLI --legacy-json，另存schema1原檔保持。

```powershell
python music_lab.py lyrics --input outputs/lyrics/lyrics.json --out outputs/checked-package
python music_lab.py lyrics --input old-lyrics.json --legacy-json --out outputs/converted-package
```

完整包檢查不可混入CLI覆蓋選項；一般cue JSON／LRC／SRT編修保持。未改cue下載保留來源，編修後另附待實聽說明；合成adapter與瀏覽器證據見[QA](../../docs/QA-v0.19.0.md)。以下歷史版本功能仍適用，完整JSON契約以上述v0.19為準。

創辦：ZOE. G · GitHub：djguan-jpg · v0.25

v0.18：TXT／LRC／SRT／JSON選檔先檢查、顯示完整原文與前六句，再明確套用／取消。TXT嚴格UTF-8、64KiB／1000非空白行，時間留白；字幕最多2MiB，無效編碼與未知JSON拒絕。慢讀取／晚回應／預覽後編修不覆蓋新內容，音檔／時長／其他工作台保持；最近一次未編修套用可撤回。直接修改原文後按讀取也先預覽；SRT多行轉單行與LRC推測結束需實聽核對。詳細證據見[QA](../../docs/QA-v0.18.0.md)。

離線歌詞時間編修與匯出。可讀 LRC、SRT 和 JSON；LRC 多重時間標籤、offset 與小數時間會轉成逐句時間軸。純文字檔尚不會自動辨識歌曲咬字。

v0.17可由已有純文字歌詞建立未校時起稿：歌曲工作台先預覽，再明確套用到校時；或CLI lyrics-seed --text lyrics.txt --title '作品名稱' --out outputs/untimed建立JSON，於校時選檔即檢查／預覽。原文、前後空白與重複句保留，空白行保留在source_text；段落標籤由你調整。時間留白，不猜測；來源／目標編修拒絕套用，音檔及時長保留。最近一次未編修的套用可撤回；未知版本或矛盾來源拒絕，不靜默丟欄。


```powershell
python music_lab.py lyrics --input examples/lyrics.lrc --duration 60 --out outputs/lyrics
python music_lab.py lyrics --input examples/lyrics.lrc --shift 1.25 --set '2=14.5' --text '2=新的第二句歌詞' --duration 60 --out outputs/lyrics-edited
```

`--set`／`--text` 的句號從 1 起算，基於讀入並排序的逐句順序。先整體 shift，再套用個別 set／text，最後重排。負時間、重複時間、倒置 SRT 及超過歌曲結束的時間會回報錯誤。

每輪輸出 `lyrics.json`、`lyrics.lrc`、`lyrics.srt`、`preview.html`。SRT 保留原有結束時間；多行字幕合為單行，以 ` / ` 分隔。LRC／JSON 未指定結束時，使用下一句開始作結束。最後一句使用提供的 `--duration`，未提供且尾句也沒有結束時暫取最後開始加 3 秒；尾句有明確結束則保留。duration_estimated 表示總長未明確提供，timing 另記錄缺失結束的推得，兩者不混為同一判斷。

開啟 `preview.html`，選自己的本機音檔，播放並修改表格。按「使用播放位置」記下某句開始時間；按「套用編修」後才更新播放預覽與匯出內容。瀏覽器讀取音檔不會上傳。匯出 LRC 時只保留開始時間；SRT／JSON 保留開始和結束。

本機工作台：在專案根目錄執行 `python music_lab_server.py`，開啟本機介面的「波形校時」。可匯入歌詞、載入本機音檔、查看第一聲道波形、點擊定位或左右鍵微調 0.5 秒，再分別按「記下開始」與「記下結束」填入某句；「整句移動」保留長度，超過音檔結束拒絕。修改後驗證，成果在右側預覽並下載。

波形解碼上限 64 MiB，超過時保留播放功能、略過波形；音訊格式以瀏覽器支援為準。較細的逐字時間、拖曳及音訊辨識尚未實作。工作台的 HTTP 下載已驗證實際 JSON 檔案；v0.11 曾確認獨立 preview.html 的 JSON／LRC／SRT Blob 下載與毫秒精度；v0.24 的時長規則已改，本輪獨立頁原生播放／下載受工具 file: 政策限制，僅有程式層驗證。完整視覺、其他瀏覽器與正式歌曲實聽尚未驗證。


「整批校時」先預覽再套用，正數延後、負數提前；有明確結束的句長保留。撤回只改時間，後來的歌詞文字、音檔與刪除紀錄保留；任何後續時間改動或句子增刪會拒絕整份撤回，避免蓋掉編修。最近一次校時撤回與調整量只存在本頁，不存進草稿；重新載入逐句內容／草稿會清除。修改後仍需驗證並建立歌詞包。

時間統一至毫秒，半毫秒往遠離零方向捨入；1.2345 秒變成 1.235。負值在捨入前拒絕；重複／重疊／超過指定歌曲總長整份拒絕，沒有自動截斷。--set 保留已有的明確句長，--shift 不改指定 duration。原始來源需為非負時間；shift 後仍以最終校時結果驗證。Agent 同一 payload 可用 shift_seconds、time_changes、text_changes，見根目錄 docs/AGENT.md。


## v0.38 完整文字交付

完成本工作台後可下載本輪所有文字成果ZIP與逐檔SHA清單，CLI／Agent／MCP共用 delivery_package。Agent預設摘要，小型ZIP需明確include_archive；不自動寫檔，封裝不等於實聽或實際畫面接受。基本11／啟庫16工具，Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-PACKAGE.md)。

## v0.39 接續文字ZIP

本工作台可選取本工具v38／v39交付ZIP，先核對原清單與逐檔SHA、再明確載入文字成果；表單與已選音檔保留，可限定撤回。跨scope先切換工作台再選檔；讀取中可取消，編修／換台後晚回應不能覆蓋。原文可再下载，但不代表由目前表單重建或正式媒體接受。CLI delivery-inspect／Agent與MCP delivery_inspect共用檢查，啟動時--delivery-zip明確選來源，預設metadata、include_files小型JSON≤512KiB；12／17工具，inspection1／package1／Agent1／draft3獨立。見[共用契約](../../docs/DELIVERY-INSPECTION.md)。

## v0.40 ZIP原文與差異

選ZIP後先審阅目前成果與將載入原文，新增／變更／移除／相同完整摘要；原換行計數與長檔有界預覽，Apply與下載仍保留全文。只替換本工作台成果，表單／音檔／限定Undo保持，不合併。CLI delivery-inspect --compare-input及Agent／MCP delivery_inspect明確baseline同一比較契約，12／17工具保持，comparison1獨立。見[共用契約](../../docs/DELIVERY-COMPARISON.md)。


## v0.41 可保存差異報告

選交付ZIP核對完成後可下載來源SHA與完整變更摘要JSON／Markdown，原成果／表單／音檔保留，載入仍需明確動作。修改後重新核對，不把報告當原文或素材權利驗收。CLI --comparison-report／Agent include_report要求baseline且不能include_files=true，12／17工具保持，report1獨立。launcher可列印明確WAV／ZIP選擇，沒有Host設定或模型呼叫。default text output拒絕raced-in同名檔，多檔可能部分輸出須查看錯誤。見[共用契約](../../docs/DELIVERY-REPORT.md)。
