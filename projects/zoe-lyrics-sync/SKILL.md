---
name: zoe-lyrics-sync
description: Manually refine lyric timing with local audio and export validated LRC, SRT or JSON. Use for lyric subtitles, waveform timing or format conversion when source audio and text are available.
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Lyrics Sync

## v0.58 原文能一致保存與回讀

完整JSON會保留名稱、文字與歷史。若名稱／歌詞／說明含不完整Unicode字元，請修正來源後重試；程式不會改成替代字或匯出無法再載入的JSON。合法emoji、空格與原字元保持；錯來源不覆寫原表格與上一份成果，修好後重新驗證建立。見[契約](../../docs/LYRICS-UNICODE.md)。


## v0.57 獨立預覽下載

下載LRC／SRT／JSON會先套用目前編修；錯誤時間會提示修正，修好可重試。三種檔名為lyrics.lrc／lyrics.srt／lyrics.json，作品名稱與全部時間來源／歷史保存在完整JSON。畫面會顯示已交給瀏覽器，請確認保存位置；關頁前保存完整JSON及音檔。見[下載契約](../../docs/LYRICS-DOWNLOAD.md)。


## v0.56 獨立預覽也會提醒格式遺失

另存preview.html後，格式保留區會標示LRC句首時間標籤與SRT空白句，按提醒到目前歌詞。修改後舊提醒不可定位，按「套用編修」重新檢查；刪除／新增／時間或總長變動亦如此。全部句子計數，頁面前20項明示截斷。沒有提醒仍先保存完整JSON，LRC缺句尾、LRC／SRT缺總長与歷史；仍需實聽核對。獨立提示在瀏覽器本機同步運作，不需要服務或模型。見[契約](../../docs/LYRICS-OFFLINE-EXPORT.md)。


## v0.55 預覽也要符合這一份歌詞

建立或匯入帶時間歌詞時，完整 preview.html 的來源、標題及固定程式需與本次歌詞和本機範本一致才接受。錯誤時原編修與上一份成果保留，可正常重試。從舊完整 lyrics.json 匯入會重新產生目前範本；不是接受任意舊 HTML。原離線預覽仍可選本機音檔、人工編修後套用；實聽同步與格式限制仍需核對。無模型辨識或作者／版權證明。見[契約](../../docs/LYRICS-PREVIEW.md)。


SRT v0.51：保留各行空白與Unicode原文，實際多行仍以 / 合句。原排版保留原SRT檔；空白cue用版本1JSON，原文亦可另存draft3。先預覽再明確套用，回應cues／time／來源推得及JSON／LRC／SRT需符合原文。未宣告總長依末句原結束推得，不當已確認音檔時長；原檔保持。見[契約](../../docs/LYRICS-SRT.md)。

LRC v0.50：保留時間標籤後的空白、句中標籤及 Unicode 原文；offset 需獨立一行。先預覽再明確套用，回應必須與原文推得的 cues／時間／來源說明及 LRC／SRT 輸出相符。相鄰行首多時間標籤展開多句；字面歌詞若以 timestamp 開頭會有格式歧義，請以版本1 JSON完整保存。原檔保持；不是自動辨識。見[契約](../../docs/LYRICS-LRC.md)。

ZOE. G 發起的原創歌詞校時工具。資料與時序驗證規則見 [工具說明](README.md)。

先判斷素材是否已有逐句時間。已有 LRC／SRT／JSON 時匯入；只有純文字時，可先用歌曲設計的「預覽已有歌詞的校時起稿」，或CLI lyrics-seed建立未校時JSON，再匯入校時工作台。先核對原文及影響、明確套用；開始／結束留白，依實際音檔逐句標記，不能把任意配給的時間說成辨識結果。

本機介面由工作區 `python music_lab_server.py` 啟動，選「波形校時」。載入使用者指定的音檔；第一聲道波形用於定位，播放器時間才是實際校時位置。

工作台可分別按「記下開始」與「記下結束」，或「整句移動」保留已有句長。未填時間不能匯出；已校時句子仍可播放顯示。調整開始、結束及文字，再驗證；遇到重疊、空白、負時間或超過作品宣告時長時先核對；實際音檔與作品宣告分開顯示。SRT 多行會以 ` / ` 合成一行；要保存原排版時，保留原檔並明確說明這個限制。

交回匯出的檔案與待聆聽核對的句子。LRC 只保留開始時間；SRT／JSON 保留結束時間。沒有完成辨識或校時時，不宣稱歌詞已自動同步。

CLI 範例：

```powershell
python music_lab.py lyrics --input lyrics.lrc --duration 120 --out outputs/lyrics-run
```

只有UTF-8純文字時：

```powershell
python music_lab.py lyrics-seed --text lyrics.txt --title '作品名稱' --out outputs/untimed-lyrics
```

原文最多64 KiB、1000非空白行。lyrics-seed schema1保留重複句、前後空白與來源行號；不是已校時字幕。未知格式／版本／來源不一致拒絕，原檔保留；非空白段落標籤也成為句子，需人工調整。

## 歌詞選檔與預覽（v0.18）

校時工作台選TXT／LRC／SRT／JSON即檢查與預覽，不立即改原文或cue。先確認原文／句數／時間，再明確套用；取消保留音檔與編修。TXT嚴格UTF-8／64KiB／1000行，沿用lyrics_seed1，開始結束留白。帶時間檔最多2MiB，SRT多行合單行／LRC補結束由預覽告知；Agent／CLI JSON沿用同一操作。目標變更或舊回應拒絕替換；未編修的最近套用可撤回。沒有ASR／模型。

完整版本化歌詞包使用zoe-lyrics-package schema1。檢查／回讀保留名稱、總長、句尾及推得來源；不要抽取cues丟掉metadata。未知版本／重複欄位／矛盾來源拒絕。舊完整包只可明確轉換並另存，CLI需--legacy-json；不混入覆蓋欄位。工作台完整包宣告與目前已填時長衝突拒絕，先核對再明確修改；估計值不當已確認。音檔確認總長不能抹去曾補齊句尾的待實聽提示。一般cue JSON仍是建立新包的輸入。

外部JSON接續採共用嚴格UTF-8／JSON decoder，CLI最多2MiB、最大64層；重複欄位含跳脫同名、無效Unicode與非有限數字拒絕，不能默默取最後一個版本／值。保留原檔，協助另存有效UTF-8後重新預覽；不要把傳輸檢查當創作／媒體驗證。

## 工作台草稿另存（v0.21）

上方狀態核對四個工作台的完整草稿內容。Agent建包／送出下載不表示目前編修已保存；下載後先核對本機檔再明確確認，或明確啟用草稿庫並保存。晚到保存只確認當時的快照，後來編修仍需另存。已驗證現代檔案／庫版本須明確載入，legacy轉換需另存v3。預覽與取消不更改目前狀態，撤回後依內容判定。音檔與成果另存；離頁提醒受瀏覽器互動／裝置限制，不能取代主動保存，沒有自動寫檔或模型呼叫。

## 音檔時長接續（v0.24）

選音檔保留已有宣告，先核對兩個時長；需要採用時才按明確按鈕，再驗證匯出。撤回只還原宣告，保留後續歌詞；後來改時長／換音檔拒絕不安全撤回。原本空白且讀取期間沒有編修才自動接續首個有效時長。不要為短音檔裁切或移動句子；完整包超出總長仍拒絕。獨立預覽採用後須套用或下載才更新。媒體與撤回只在本頁，不存入 Agent／draft；不宣稱播放或時长比較等於實聽同步。

## 校時待辦（v0.25）

未完成表格先「檢查校時進度」或Agent／MCP lyrics_review；CLI lyrics-review --input raw-cues.json --out outputs/review。按問題定位原列開始／結束／文字，保留未標記值、不猜時間或裁切。局部已填數量不表示無重疊；修正後重查並以lyrics正式驗證，報告schema1不能當完成字幕。CLI2表示有待修正的報告已保存，meta.needs_review始終true，仍需實聽。原稿／媒體另存，編修後舊報告與定位停用。


## v0.38 完整文字交付

完成本工作台後可下載本輪所有文字成果ZIP與逐檔SHA清單，CLI／Agent／MCP共用 delivery_package。Agent預設摘要，小型ZIP需明確include_archive；不自動寫檔，封裝不等於實聽或實際畫面接受。基本11／啟庫16工具，Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-PACKAGE.md)。

## v0.39 接續文字ZIP

本工作台可選取本工具v38／v39交付ZIP，先核對原清單與逐檔SHA、再明確載入文字成果；表單與已選音檔保留，可限定撤回。跨scope先切換工作台再選檔；讀取中可取消，編修／換台後晚回應不能覆蓋。原文可再下载，但不代表由目前表單重建或正式媒體接受。CLI delivery-inspect／Agent與MCP delivery_inspect共用檢查，啟動時--delivery-zip明確選來源，預設metadata、include_files小型JSON≤512KiB；12／17工具，inspection1／package1／Agent1／draft3獨立。見[共用契約](../../docs/DELIVERY-INSPECTION.md)。

## v0.40 ZIP原文與差異

選ZIP後先審阅目前成果與將載入原文，新增／變更／移除／相同完整摘要；原換行計數與長檔有界預覽，Apply與下載仍保留全文。只替換本工作台成果，表單／音檔／限定Undo保持，不合併。CLI delivery-inspect --compare-input及Agent／MCP delivery_inspect明確baseline同一比較契約，12／17工具保持，comparison1獨立。見[共用契約](../../docs/DELIVERY-COMPARISON.md)。


## v0.41 可保存差異報告

選交付ZIP核對完成後可下載來源SHA與完整變更摘要JSON／Markdown，原成果／表單／音檔保留，載入仍需明確動作。修改後重新核對，不把報告當原文或素材權利驗收。CLI --comparison-report／Agent include_report要求baseline且不能include_files=true，12／17工具保持，report1獨立。launcher可列印明確WAV／ZIP選擇，沒有Host設定或模型呼叫。default text output拒絕raced-in同名檔，多檔可能部分輸出須查看錯誤。見[共用契約](../../docs/DELIVERY-REPORT.md)。


## v0.42 原文下載

成果、草稿、保存版本、接受條件與差異報告共用native UTF-8 bytes，原文與換行保持；長檔只在預覽摘錄，8MiB完整成果下載與ZIP仍全文。編修後舊generated成果停下載，失敗不新增另存確認，明確確認舊檔不覆蓋後續編修。Agent／CLI／MCP既有application／12與17tools／schema與inline cap保持。見[共用契約](../../docs/TEXT-DOWNLOAD.md)。


## v0.43 指定 ZIP 原文

核對完整ZIP後可先下載選定原文，保持目前成果、表單與音檔；empty可下載，removed或來源變動停用。CLI --file-name明確輸出原檔；Agent／MCP file_names需要include_files:true，512 KiB選定JSON cap保持。所有來源檔先完整核對，缺檔整次拒絕；selection1獨立，12／17工具與Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-SELECTION.md)。


## v0.44 原文分段閱讀

ZIP核對後可切目前成果／ZIP原文逐段閱讀，原文下載仍是全文，保持表單與媒體。CLI text-file／Agent-MCP text_window明確讀16KiB原文，後續位置pin前次archive SHA；完整來源先核對，UTF-8字元中間或來源變動拒絕。text-window1獨立、12／17工具與Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-TEXT.md)。


## v0.52 歌詞建立與回讀來源

校時建立從本次送出的 cues／總長或完整 package 派生期望，核對完整回應、時間來源／歷史說明、嚴格JSON及字面LRC／SRT後才替換表格與成果。純 lyrics-result 共用建立及所有帶時間匯入；錯來源／損壞／不完整保留原編修、上一份成果及待套用校時。raw JSON也核對原句，seed保持。HTML只核對存在與字串、不完整語義驗證；wire／schemas／12／17 tools不變。產品0.52／交付來源38–52，原schema與Agent操作保持；不是模型或實聽驗證。


## v0.53 匯出格式保留

建立歌詞包會顯示格式提醒；也可按「建立格式檢查報告」另存 JSON／Markdown。句首含時間標籤的原歌詞用完整 lyrics.json 保存；ASCII空白／tab句亦如此。LRC缺句尾，LRC／SRT缺作品總長與歷史；零提醒也請保存完整JSON。提醒只定位當前表格原句，作者自行決定修改，原文與音檔保持。唯讀 Agent／MCP lyrics_export_review 接受精確 {package:現代完整包}；CLI lyrics-export-review --input lyrics.json --out outputs/format-review。CLI2是提醒報告已輸出、0是已查欄位无提醒、1是拒絕；預設不覆寫。基本13／啟庫18，新report1／source1與Agent1／draft3分開。見[契約](../../docs/LYRICS-EXPORT-REVIEW.md)。

## v0.54 一起保存報告與完整歌詞

按「建立格式報告與歌詞包」產生報告JSON／Markdown與完整lyrics.json；按「驗證並建立歌詞包」產生原四個歌詞檔及兩報告，可一起另存本輪ZIP。只保存目前已驗證來源的值，原JSON排版另保留。Agent／MCP lyrics_export_review {package:完整包,include_package:true} 明確取完整附檔；省略／false只兩報告。CLI `python music_lab.py lyrics-export-review --input lyrics.json --include-package --out outputs/format-review`；0無已查提醒／2有提醒且報告已寫／1拒絕，預設不覆寫，明確--overwrite才替換指定輸出。提醒仍需實聽核對，不改歌詞或時間。見[契約](../../docs/LYRICS-EXPORT-BUNDLE.md)。

## v0.69 共用草稿保存

工作台保存會回讀同ID並核對完整原稿後才確認。失敗保留原ID與點擊時草稿供明確重試，不把後續編修代入重試；音檔／成果另存。CLI／Agent既有save與readonly read仍共用Python immutable library，沒有新增JSON路徑／寫檔權限。核對不證明作品品質、作者權利或平台創始接受。見[契約](../../docs/LIBRARY-SAVE-RECEIPT.md)。

## v0.70 共用保存版本預覽

選定版本後，預覽須核對同ID與完整版本資料；讀取完成、套用與匯出前重查目前選擇。切換版本請重新預覽，失敗保留目前編修與音檔。明確整份專案載入／撤回沿既有行為需重選媒體，原保存版本不改寫。CLI／Agent／MCP仍使用同一Python readonly read與immutable library，無新增操作或路徑權限。見[契約](../../docs/LIBRARY-REVISION.md)。

## v0.71 共用備份確認

工作台備份預覽先量測選定ZIP的SHA，再核對完整來源與計數。恢復回覆未確認時保留同一File／SHA供明確重試；只加入／重用immutable版本，不自動載入目前工作台，編修與音檔保持。CLI／Agent／MCP沿同一Python完整備份驗證與immutable restore，沒有新增操作／路徑／依賴。見[契約](../../docs/BACKUP-RESULT.md)。

## v0.72 共用備份下載

草稿庫ZIP完整摘要、實際串流長度與SHA核對後才原生下載交接；可取消自身請求，晚回覆保留編修與媒體。送出提示不是保存成功，音檔／成果／未保存草稿另存。CLI／Agent／MCP維持原完整備份驗證、路徑與immutable規則；無新操作／依賴。見[契約](../../docs/BACKUP-DOWNLOAD.md)。

## v0.73 Agent備份匯出

啟動時--draft-library明確選定來源後重新discovery（20工具；未啟庫14）。可呼叫draft_backup_export，payload={}取得已保存版本的備份摘要；先draft_list取得真ID，再payload={"ids":[已保存ID],"include_archive":true}只取<=512KiB完整ZIP base64。無媒體／未保存編修或成果，自動寫檔不在工具內；需要磁碟ZIP則用既有CLI draft backup --out明確另存。匯出status=prepared_not_saved，不是保存／權利／平台驗收。見[契約](../../docs/BACKUP-EXPORT.md)。

## v0.74 保存清單與回覆

接續工作台保存版本時，先核對完整回覆與分頁資料；錯誤保留清單、預覽及目前內容。未確認保存使用同一 ID 與點擊時草稿重試，後續修改另存；清單只有metadata，版本bytes／SHA由讀取核對，不能當成創作／權利接受。Agent1／draft3／library1與14基本／20啟庫工具保持，見[契約](../../docs/LIBRARY-RESULT.md)。

## v0.75 保存名稱搜尋

選定草稿庫後，可用draft_search搜尋保存名稱及歌曲／分鏡／歌詞名。字面且保留大小寫／空白，不搜尋正文；接續需相同query與前次cursor，來源變更重新搜尋。回覆只有metadata，選定版本仍先預覽／bytes+SHA檢查，再明確Apply；不推定創作或權利接受。基本14／啟庫21需重新discovery，search1獨立、原schema保持，見[契約](../../docs/LIBRARY-SEARCH.md)。

## v0.76 保存搜尋位置

工作台選定搜尋版本時可看保存名稱及歌曲／分鏡／歌詞名的原文命中。零命中與空庫不同，不可讀摘要提示原資料保留；查詢改動仍標示上一份接受query。這些提示不進Agent wire或草稿，draft_search與原schema/14基本/21啟庫工具保持，選定版本仍需核對預覽再明確載入。見[分層](../../docs/LIBRARY-PRESENTATION.md)。

## v0.77 保存與備份時間

保存stored_at及備份created_at現在共用純UTC曆日/時間驗證，拒絕不存在日期或時間溢位。原UTC時間字串、ID、排序与bytes保留，不轉時區、不補日或遷移；Agent draft_read/list/search/backup均沿相同Python contract。工作台回覆錯誤保留編修/音檔，合法資料重新預覽；14基本/21啟庫及原wire/schema保持，見[契約](../../docs/UTC-TIMESTAMP.md)。
