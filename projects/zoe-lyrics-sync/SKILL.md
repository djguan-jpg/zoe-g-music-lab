---
name: zoe-lyrics-sync
description: Manually refine lyric timing with local audio and export validated LRC, SRT or JSON. Use for lyric subtitles, waveform timing or format conversion when source audio and text are available.
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Lyrics Sync

## v0.119 選定歌詞校時待辦

選定歌詞待辦共用 lyrics_review 的完整來源與時間分析，先依原句／作品時長篩選再套200明細上限；全部原句仍參與重複開始與horizon重疊核對。新增獨立 lyrics_cue_review schema1、application／CLI／HTTP／Agent-MCP，20基本／27明確啟庫，舊26組schemas保持。單句report只帶選定cue與title／duration，不帶整份歌詞；source controller核對整份原值、stable IDs與選列，其他句子也可使舊位置失效。檢查／報告不改原文、時間、音檔或草稿；零待辦仍須完整歌詞包與實聽。產品119／唯一交付policy38–119共82，未知120拒絕；Agent1／draft3及其他schemas保持。 見[契約](../../docs/LYRICS-CUE-REVIEW.md)。

## v0.118 歌詞診斷完整核對

歌詞校時診斷先以共用strict JSON值核對來源，再讀取欄位與建立隔離副本；getter、稀疏陣列、隱藏／symbol／undefined／無效Unicode拒絕。完整回覆精確核對root data／files／meta、當前唯一產品版本、protocol1及needs_review=true，再核對完整report與JSON／Markdown，checkedResult交付自有data／files副本。舊inspect API保留。Controller將capture放在try內，失敗不送transport，當前pending才釋放；晚回應／錯誤／finally不覆蓋後續工作。原request可省略title／duration，僅report明示既有defaults；時間規則與診斷格式保持。19基本／26啟庫、原26組schemas及Agent1／draft3／review1保持，沒有新operation或GET。產品118／唯一policy38–118共81，未知119拒絕。 見[契約](../../docs/LYRICS-REVIEW-GUARD.md)。

## v0.117 單段逐項定位

歌曲單段待辦新增工具列「上一項／下一項／重查這一段」。共享 issue-cursor 只保留report revision／有界index，明確定位成功才前進；重查重設而不自動搶焦點，來源／stable IDs／選擇／busy／換台拒絕舊定位。共用純 editor-field-position 幾何與既有shot wrapper，明確focus原欄位後核對工具列遮擋；窄視窗維持表格內水平捲動，height≤400px改static流。單段DOM使用注入的literal段落訊息，既有單鏡預設文字與API保持。新增一個固定GET，沒有POST、Agent權限或schema變更；19基本／26啟庫、原26組工具schemas、Agent1／draft3／section-review1／shot-review1保持。產品117／唯一policy38–117共80，未知118拒絕。 見[契約](../../docs/SECTION-ISSUE-NAVIGATION.md)。

## v0.116 單段報告跨工具

新增「建立單段報告」與唯讀 music_section_review：共用 Python music_review 的 required／numeric 規則，獨立 section-review1 保留原段落1起、總段數與選定五欄原字串；JSON／Markdown 經完整 data／files／meta 核對才提交成果。共享注入 readiness-request 管理來源／晚回覆／取消／重試，既有單鏡 wrapper 沿相同 controller。CLI／Agent／MCP／HTTP 共用 application，19基本／明確啟庫26工具，需重新 discovery；原25組 input/output schemas 不變。產品116／唯一 policy38–116共79，未知117拒絕；Agent1／draft3保持。新增一個固定GET與一個唯讀POST，沒有新路徑、模型、外網或寫入權限。零待辦仍須整首歌曲、總長與實聽驗證。 見[契約](../../docs/MUSIC-SECTION-REPORT.md)。

## v0.115 選定歌曲段落待辦

歌曲工作台新增「檢查選定段落」：即使整份待辦200明細已滿，也能檢查原第40段的五個編曲欄位並定位。既有music-readiness共用規則 → 選定原列／stable IDs的純checkpoint controller → 字面DOM → app原欄位focus分層；不補寫、改原值或提交成果。選擇／順序／選定欄位改變停舊定位，精確復原可接續；其他段落與全域欄位的合法編修不影響這五欄的診斷。零待辦仍需整首歌曲、總長與實聽驗證。產品115／唯一policy38–115共78，未知116拒絕；18基本／25啟庫及原25組schemas、Agent1／draft3保持，新增兩個固定GET。 見[契約](../../docs/MUSIC-SECTION-REVIEW.md)。

## v0.114 單鏡逐項定位

單鏡待辦新增固定工具列的上一項／下一項與重查入口；純issue-cursor管理report revision／index與邊界，DOM沿原來源核對定位原欄位。新報告不自動定位，來源／選擇／順序／busy與換台停舊位置。共享focusShot以純shot-field-position計算目前欄位與工具列遮擋後的捲動；短視窗工具列改static。既有25組工具schemas、18基本／25啟庫、Agent1／draft3／shot-review1及POST保持；新增兩個固定GET。產品114／唯一policy38–114共77，未知115拒絕。 見[契約](../../docs/SHOT-ISSUE-NAVIGATION.md)。

## v0.113 選定鏡頭請求

選定鏡頭報告先核對完整回覆的 JSON 值與來源，再交給獨立注入式 request controller 管理成功、錯誤、來源改變、取消及重試；DOM 僅提交已核對成果。舊請求不能結束新請求的 pending 狀態或覆蓋新成果。原 25 組工具 schemas、18 基本／25 啟庫工具、Agent1／draft3／shot-review1 保持；僅新增一個固定 GET 資產，既有 POST 與授權邊界保持。產品113／唯一 policy38–113共76，未知114拒絕。 見[契約](../../docs/STORYBOARD-SHOT-REQUEST.md)。

## v0.112 選定鏡頭待辦

新增選定原鏡號的必填欄位、方向與母題引用檢查，整份分鏡200明細上限保持。可定位後面的鏡頭，舊選擇／順序／來源與晚回覆不能替換新編修。Python／JS共用既有整份診斷規則，controller暫態與字面DOM分層；CLI／Agent／MCP／HTTP共用同一報告，18基本／25啟庫工具，原24組schemas保持。獨立shot-review1，Agent1／draft3保持；無新依賴／模型／媒體／外網或路徑權限。產品112／唯一policy38–112共75，未知113拒絕。 見[契約](../../docs/STORYBOARD-SHOT-REVIEW.md)。

## v0.111 待辦原列ID來源

歌曲／分鏡待辦沿共用自有dense ID讀取層定位，不讀caller方法或iterator；缺項、超長、重複或讀取期間長度改變拒絕並保留上一份report。原欄位、媒體、draft3、17基本／24啟庫工具與PolyForm Noncommercial 1.0.0保持；沒有新AI／媒體能力。見[契約](../../docs/READINESS-IDS.md)。

## v0.110 歌曲與分鏡待辦分頁

歌曲欄位／分鏡創作／時間待辦每頁20項、最多200項，依原報告順序定位原欄位；超過上限明示。編修或列ID換序後停舊定位，重新檢查回第一頁；精確恢復原來源沿guard核對。分頁不改原文、時間、媒體或草稿。17基本／24啟庫工具與PolyForm Noncommercial 1.0.0保持；沒有新的AI／媒體生成能力。見[契約](../../docs/READINESS-PAGE.md)。

## v0.109 歌詞待辦分頁

工作台歌詞校時／匯出格式報告可每頁20項翻閱最多200項明細，依原報告順序定位原欄位。編修後可讀舊報告但停定位，重新檢查回到第一頁；不改原句、時間、媒體或草稿。17基本／24啟庫工具及PolyForm Noncommercial 1.0.0保持；沒有新的AI或媒體生成能力。見[契約](../../docs/ISSUE-PAGE.md)。

## v0.108 回應核對與預覽接續

異常回覆會保留目前內容、上一份成果與音檔；修正後重新操作。三種原文搜尋、歌曲／分鏡來源與歌詞診斷共用完整值核對，17基本／24啟庫工具保持。保留舊preview.html與完整lyrics.json；現版只接受本安裝模組的固定HTML，需要接續時以完整JSON重新建立預覽。沒有新的AI或媒體生成能力，授權保持PolyForm Noncommercial 1.0.0。見[契約](../../docs/JSON-VALUE.md)。

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


## v0.78 波形定位

工作台的波形下方顯示播放位置／總長，方向鍵0.5秒、Shift0.05秒細調。空／錯／換檔狀態清除舊位置；手動定位不修改原歌詞、作品宣告或草稿，Agent工具保持14／啟庫21。產品78／交付來源明確38–78、未知79拒絕；詳見[分層契約](../../docs/WAVE-POSITION.md)。


## v0.79 逐句標記撤回

工作台可撤回最近一次逐句開始／結束／整句移動標記，精確還原原時間字串並保留後續文字／其他句／音檔。目標改時或刪除停用，載入新歌詞清除；history只在頁面，不進草稿或Agent。工具保持14／啟庫21，產品79／交付來源明確38–79、未知80拒絕；詳見[分層契約](../../docs/CUE-STAMP-EDIT.md)。


## v0.80 發佈資料核對

source的產品與預期tag由固定版本policy核對，過期metadata不靜默改寫；預期tag不是GitHub或平台接受證明。原創作功能／Agent1／draft3／14基本/啟庫21工具保持，產品80／交付來源38–80／unknown81；詳見[分層契約](../../docs/RELEASE-METADATA.md)。


## v0.81 目前歌詞定位

波形校時目前句與高亮沿共同媒體就緒來源；明確按鍵定位原列文字，編修焦點／資料／音檔保持。部分可播放不表示完整匯出通過；沒有新Agent操作或權限。產品81／來源38–81／unknown82，Agent1／draft3／14基本/啟庫21保持，詳見[分層契約](../../docs/CURRENT-CUE.md)。


## v0.82 原句首定位

波形校時按逐句「定位句首」或Enter回到原開始，結束留白也可操作；只播放位置，原資料／播放狀態／標記撤回保持。共用時間層在捨入前拒絕原字串極小負值，真正負零及signed shift保持；部分可定位不代表完整歌詞接受。沒有新Agent操作或權限。產品82／來源38–82／unknown83、Agent1/draft3／14基本／啟庫21保持，詳見[分層契約](../../docs/CUE-POSITION.md)。


## v0.83 長歌詞播放更新

目前句共用有界的本頁prepared播放資料，編修／標記／撤回／載入後失效；position-only不重讀整表，明確focus仍核對最新完整來源。原句子、時長、播放狀態、草稿與Agent操作保持；整批校時後句首按鈕依實際media重新核對。產品83／來源38–83／unknown84、Agent1/draft3／14基本／啟庫21保持，詳見[分層契約](../../docs/CURRENT-CUE-PLAYBACK.md)。


## v0.84 編修接續

工作台新增、刪除與還原沿共用純定位／注入controller／固定DOM分層；空表接回新增入口，新歌詞接回文字，鏡頭展開後接回指定欄位。只改焦點與既有鏡頭展開狀態，資料／音檔／草稿／Agent權限保持。產品84／來源38–84共47／unknown85、Agent1/draft3／14基本／啟庫21保持。見[契約](../../docs/EDITOR-FOCUS.md)。


## v0.85 共用原句搜尋

逐句表格以原文字查找，尚未校時可查；每批20，點結果回原文字欄。基本15/明確啟庫22工具，Agent需重新discovery；`lyrics_search` 不修改或接受校時，不呼叫模型。query/text/列ID變更重新搜尋，結果不進草稿；音檔另存，下載提示只代表送出。見[契約](../../docs/LYRICS-SEARCH.md)。


## v0.86 共用原文核對

建立成果後選回保存檔，核對完整原文位元組；改名不影響，切檔/編修/換台重新核對。只檢查選定內容，不改作品/媒體/草稿或確認保存。瀏覽器限定native File與8MiB，三fixed assets；15/22工具、Agent1/draft3保持，Agent沒有新增路徑或核對操作。見[契約](../../docs/TEXT-VERIFICATION.md)。


## v0.87 共用刪除與時間

分鏡刪除只移除所選鏡頭，其他原時間/創作/宣告總長保留；用時間待辦核對缺口，完整分鏡仍須通過時間/影格/連戲。還原保留後續時間與文字編修。既有共用History純層及app adapter，沒有新Agent操作或路徑權限；基本15／啟庫22、Agent1/draft3保持。見[契約](../../docs/STORYBOARD-DELETION.md)。


## v0.88 共用處理中控制

共用run處理中停用清單新增/刪除/還原，完成或失敗後恢復，保留較早還原選擇與原值。原欄位編修仍沿revision/current拒絕舊回覆，不代表保存或作品接受。固定collections metadata与app DOM adapter，無新Agent操作或路徑權限；基本15／啟庫22、Agent1/draft3保持。見[契約](../../docs/COLLECTION-BUSY.md)。


## v0.89 範例載入保護

本機範例入口在例子讀取完成且共用處理idle後開放，處理中保留原來源/刪除紀錄；晚到startup不替換pending來源，人工編修保持。明確idle載入仍清除所選panel歷史，並非保存/撤回。app DOM adapter與原run finally，無新Agent操作或權限；15/22、Agent1/draft3保持。見[契約](../../docs/EXAMPLE-AVAILABILITY.md)。


## v0.90 取消等待

共用工作台可取消本次瀏覽器等待；純 gate/明確request context/固定DOM adapter分層，原source/revision核對保持。取消保留編修/歷史/媒體/上一份成果；人工dirty保持。本機非中斷讀檔/雜湊需等該階段settle；後端可完成，不新增kill/取消endpoint/依賴/Agent權限。15/22、Agent1/draft3保持，獨立library/search/backup/file-preview/ZIP-import仍依原控制。見[契約](../../docs/OPERATION-CANCEL.md)。


## v0.91 處理列

共用run開始前只擷取workbench/動作名稱，pure operation-presentation→隔離metadata/固定DOM→main上方sticky單一取消入口。處理中/取消中隨捲動可達，idle清空；不讀寫創作來源、不新增timer/scroll或取消生命週期。既有gate/request/current/focus保持，15/22、Agent1/draft3/domain/權限/依賴不變。取消不表示後端停止或保存。見[契約](../../docs/OPERATION-PRESENTATION.md)。


## v0.92 分鏡原文搜尋

v0.92 分鏡原文搜尋：pure storyboard_search／原生storyboard-search→application四adapter→注入source/ID/query/generation/results current controller→literal DOM／原欄focus。新獨立search1，只讀八敘事欄位；16基本／23啟庫需重新discovery，Agent1／draft3／既有22 schemas保持。產品92／交付38–92／unknown93，見[契約](../../docs/STORYBOARD-SEARCH.md)。


## v0.93 搜尋等待可取消

歌詞／分鏡工作台的原文搜尋可取消本次等待、保留上一批及分頁再重試。換查詢／原文／工作台使舊請求失效並中止自己的fetch；原文、時間、媒體與草稿保持。共用純ownership／注入controller／明確signal／DOM分層，不新增Agent操作或取消endpoint。後端可完成，本機SHA未必可中斷；16／23、Agent1／draft3及既有schemas保持。見[契約](../../docs/SEARCH-CANCEL.md)。


## v0.94 辨認長原文命中

歌詞／分鏡搜尋顯示命中附近摘錄並以mark標示，完整原文仍在原欄位與完整報告。長查詢會標示「命中已摘錄」；原文控制符只在清單可見化，來源不改字。共享純UTF-8前後文／query核對與literal DOM分層，原controller、取消、分頁及focus保持。沒有新Agent操作或schema，16／23、Agent1／draft3及既有schemas保持。見[契約](../../docs/SEARCH-EXCERPT.md)。


### v0.95 搜尋選字保護

歌詞、分鏡與 ZIP 原文搜尋在中文輸入法選字時，Enter 不再提前尋找或重設原結果；一般 Enter 與「尋找」按鈕仍可使用。命中摘錄、原欄位定位、取消／重試、前後分頁及私人編修保留。search-input 純三欄鍵盤 metadata → 三個原 DOM adapter → 既有搜尋 controller。isComposing 或 legacy keyCode229 不 preventDefault、不讀來源／清單或呼叫搜尋；只有有效普通 Enter 才執行原動作。純層無 DOM／事件副作用、timer、網路或持久狀態；固定一 JS asset。控制器、app、application／CLI／Agent／MCP、領域 schemas 與 23 operation input/output schemas不變。產品95／唯一policy38–95共58／unknown96拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。鍵盤暫態不進Agent／草稿；工具數及操作保持。見../../docs/SEARCH-INPUT.md。

## v0.96 原負時間與交付版本

分鏡開始／結束的極小負數字串（例如 -1e-999）會先依原值拒絕，不再因浮點下溢變成零而誤判有效。時間待辦可定位原欄位，建立分鏡包、鏡尾總長提案與新增下一鏡共用此界線；原時間與創作保持。真正負零、Unicode十進位、底線與既有數字空白規則保持。

Python common 與原生 planning-values 的 pure 原符號判定／非負讀取 → complete storyboard 與 partial timing → application 原四 adapters；browser 原 timing／overview／source guard／add-shot adapter。只在既有 finite decimal 驗證後核對負號及非零 mantissa，exponent 不作非零來源。signed number 與歌詞位移保持；frame ties-to-even／seconds tolerance不变。duration controller沿同Timing診斷拒絕提案，原 revision／late／scope／undo保持。無新asset／operation／schema／依賴／timer／模型／權限。產品96／唯一policy38–96共59／unknown97，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。完整來源與自訂媒體另行保存；本工具仍只規劃與核對資料。共用契約見 ../../docs/NONNEGATIVE-PLANNING.md；實際發佈依本輪收據。


## v0.97 複製創作列與交付版本

段落、鏡頭與歌詞可複製到原列後方。段落保留五個編曲欄位；鏡頭保留創作、母題與畫面方向，歌詞保留原句，兩者的開始／結束留白後人工校時。原列、總長與媒體保持；新列可用既有刪除／還原操作管理，處理中或達上限時停用複製。editor-copy 純原值／隔離提案／完整來源與 actual-after 核對 → injected controller → delegated editor-copy-dom → app 原 readValue／writeEntries／markDirty／editor-focus。draft3 契約提供三個列上限與欄位；40段／1000鏡／10000句，不猜時間、不合併同名、不改創作字串。鏡頭 open 僅頁面 metadata；新 row ID 使用同單調序列，完整替換舊列時保留原 IDs／open 狀態。busy／hidden／capacity 在 DOM gate 先拒絕，不讀原值、不分配 ID；full source 於 ID 前及寫入前重查，寫入後依隔離 expected 核對才通知焦點。render／busy／換台刷新按鈕只讀 count／visibility，不讀全部原文。複製只更新自己的 panel、dirty/checkpoint 与既有診斷，不增持久 copy 紀錄或 Agent operation。固定兩 JS assets；沒有新依賴、模型、網路、timer、路徑／寫檔能力或 auth。產品97／唯一 policy38–97共60／unknown98；16基本／23啟庫、Agent1／draft3／領域 schemas／legal4／private／FreeTWAI not_submitted保持。見 `docs/EDITOR-COPY.md`。複製後仍須完整領域驗證；多行歌詞可保存在草稿，但歌詞包仍要求逐句單行。


## v0.98 列順序與交付版本

鏡頭與歌詞可選列向前／向後移動、查看選定列，並撤回最近一次移動。順序撤回保留後續文字與時間編修；新增、複製、刪除、還原或載入新內容會取消舊順序撤回。原時間、總長與音檔保持；鏡頭移動後須重新檢查時間覆蓋，已校時歌詞匯出仍依開始時間排序。entry-order 純 ID 相鄰排列與逆序核對，供原 music-arrangement 與新 editor-order 共用；editor-copy 原值 source guard → injected controller → editor-order-dom 原生選列／四按鈕 → app 原 readValue／writeEntries／markDirty／editor-focus。只保留最近 ID 順序與來源核對，metadata view 只有可撤回／stale／位置，不帶全文；busy／hidden 先拒絕讀取，提交前完整 source 與提交後隔離 expected 再查。DOM 只更新單列輸入標籤，未變順序不重建 options，原列 stable ID、raw 字串與 shot open 保持。三個固定 JS assets，沒有新依賴、operation、schema、Agent 路徑／寫檔／模型／網路／timer 或 auth。產品98／唯一 policy38–98共61／unknown99；16基本／23啟庫、Agent1／draft3、23 operation schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted 保持。見 `docs/EDITOR-ORDER.md`；順序編修由原草稿／需求傳給既有工具，不新增排序 operation。


## v0.99 編修選列與交付版本

段落、鏡頭與歌詞的選列會跟隨正在編修的列。新增、複製、刪除後鄰列、還原及待辦定位也會同步選列；等待中保留焦點，完成後同步目前列。鏡頭段落名稱修改後立即更新選單；單純換焦點保留創作內容與順序撤回。editor-selection 純 metadata／ID 提案重用 editor-focus 與 entry-order → injected controller 三次 current IDs／visible／busy 核對 → 三容器 delegated focusin／refresh DOM → app 原 music selection 或 editor-order.select。只同步原生 selector／行標示／邊界按鈕，不呼叫 focus、讀創作來源、markDirty、改 revision 或建立 history；原動作保持移動按鈕焦點。busy 結束沿既有 collection refresh 核對當前原生焦點；隱藏、外部、已移除及 disabled target 拒絕。鏡頭 caption 使用 raw readValue 的目前 section／purpose，不依賴稍後才更新的 summary；穩定 IDs 時 select 不重建 options 或讀全文。兩個固定 JS assets，無新 operation／schema／依賴／timer／模型／網路／路徑／auth 權限。產品99／唯一 policy38–99共62／unknown100拒絕；16基本／23啟庫、Agent1／draft3、23 operation input/output schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted保持。見 `docs/EDITOR-SELECTION.md`；焦點／選列是瀏覽器暫態，不進草稿或Agent wire，原完整panel繼續傳給既有工具。


## v0.100 欄位快捷移動與交付版本

段落、鏡頭與歌詞的文字或時間欄可按 Alt＋↑／↓ 移動目前列；保留同一欄位、游標選取、原文與時間。沿原順序撤回保留後續文字編修，移動後須重新建立成果。原生選單、一般方向鍵、組字／重複鍵、其他修飾鍵、等待中與首尾邊界保持原行為。editor-keys 純 gesture／相鄰 ID 提案 → injected controller current metadata／consume／writer／actual-after 核對 → editor-keys-dom 三容器 delegated keydown 與暫態欄位／caret bookmark → app 共用原 music-arrangement／editor-order 完整 raw-source 移動與撤回。keyboard 才回同一欄位，原工具列保持按鈕焦點；沒有新 history、創作 schema 或 Agent operation。兩個固定 JS assets；无新依賴、模型、外網、timer、路徑、auth 或寫檔權限。產品0.100.0／唯一 policy38–100共63／unknown101拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4 保持。PolyForm Noncommercial 1.0.0／private，創辦 ZOE. G／GitHub djguan-jpg；FreeTWAI not_submitted。見 `docs/EDITOR-KEYS.md`；gesture／caret／焦點為瀏覽器暫態，原完整panel繼續傳給既有工具。


## v0.101 摘要快捷移動

在鏡頭摘要按 Alt＋↑／↓ 可直接移動鏡頭，收合或展開皆可。焦點跟著同一鏡頭，逐鏡展開狀態、原文與原時間保持；Enter／Space 繼續展開或收合。移動後原成果停下載，撤回保持後續編修，重新建立才恢復下载。沿 editor-keys 純 gesture／ID 提案與 injected current／consume／writer／actual-after 核對 → editor-keys-dom 自有 native SUMMARY 暫態 target／open bookmark → app 原完整 raw-source order controller。文字欄仍走原 caret 分支；摘要只讀 details.open，不讀或寫 input value／selection、不強制展開。只有同 ID、同 open 狀態、当前自有焦點才恢復 summary focus；沒有新 history、依賴、固定 assets、server diff、schema 或 Agent operation。產品0.101.0／唯一 policy38–101共64／unknown102拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4保持。PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見 `docs/EDITOR-SUMMARY-KEYS.md`；焦點與open暫態不進草稿／Agent wire。


## v0.102 指定列移動

歌曲段落、鏡頭及歌詞句新增「移至第幾列」與「移至指定位置」。輸入最終列號，一次移至首列、中間或尾列；其他列保持相對順序，原文、原時間、逐鏡展開狀態與音檔保持。撤回只還原最近順序，保留後續欄位編修；移動後舊成果停下載，重新建立才恢復。entry-order 純 arbitrary insertion／dense inverse → editor-position 純 metadata view／proposal／injected current + actual-after controller → editor-position-dom 自有九 listeners／literal ARIA／selected selector focus → app 原完整 raw-source order controllers。editor-order／music-arrangement 的 moveTo 共用原 history；歌曲移動及撤回增加完整來源的寫入前、實際 after 核對，拒絕 sparse sources／forged inverse。position 原字串是暫態 data-view-control，不修改 draft／revision；原操作仍完整驗證創作與時間。產品0.102.0／唯一 policy38–102共65／unknown103拒絕。16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持；只新增兩固定 GET assets，沒有新 POST operation、路徑、模型、依賴或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見 `docs/EDITOR-POSITION.md`；位置原字串與selection暫態不進草稿／Agent。


## v0.103 位置欄Enter

修正歌曲「移至第幾列」按 Enter 誤建立歌曲包、沒有移動的問題。歌曲段落、分鏡與歌詞的位置欄現在可輸入最終列號後按 Enter，一次移動同一列。空白、無效或相同位置的普通 Enter 保留原文字、游標與撤回紀錄；原按鈕仍可用。成功後焦點回到同一選列，原文、時間、逐鏡展開及音檔保持；後續編修撤回與舊成果停下載保持。editor-position 純 strict gesture／none-hold-move intent → 原五欄metadata proposal／injected current-before-consume + current-after-consume + actual-after → editor-position-dom 自有可編輯INPUT keydown／preventDefault／focus → app 原完整raw-source order controllers。request button與enter共用finish，不新增history。只有自有當前位置input普通Enter消費default；IME／229、修飾鍵、其他鍵與已消費事件保持原生，repeat只消費不移動。純來源visible／busy也核對；失敗不回滾或宣稱成功。九原listeners加三keydown共十二，dispose只移除自身。產品0.103.0／唯一policy38–103共66／unknown104拒絕。16基本／23啟庫工具、23既有input/output schemas、Agent1／draft3保持；沒有新增assets、server／app diff、POST operation、依賴、路徑、模型或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見 `docs/EDITOR-POSITION-ENTER.md`；事件及位置暫態不進草稿／Agent。


## v0.104 指定移動回呼隔離

指定位置移動的成功通知只在實際列順序、選列與原始請求一致時發出。修正注入回呼能修改共用提案、使錯誤排列或選列被判為成功的問題；普通瀏覽器 adapter 並未修改此提案。本輪隔離回呼資料，歌曲、分鏡及歌詞的原按鈕／Enter、原文與時間、逐鏡展開、同列焦點及後續編修撤回保持。editor-position 純五欄來源／排列提案 → injected controller 保留自有 expected → writer 專屬六欄 DTO（before 五欄及 ids、afterIds 另複製）→ 原 raw-source order controller → 原始 expected actual-after → 固定原始位置通知。button／Enter 共用 finish；允許回呼修改自己的副本，不以 freeze 改變回呼介面，保留讀取次數與原 current-before／after-consume／false writer 語義。拒絕不符時不覆蓋或回滾外部編修。產品0.104.0／唯一 policy38–104共67／unknown105拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改一個純控制器，沒有 DOM／app／server／adapter、固定資產清單、依賴、路徑或網路權限變動。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見 `docs/EDITOR-POSITION-CALLBACK.md`；暫態 DTO 不進草稿／Agent。


## v0.105 歌曲段落定位

歌曲段落選單新增「查看選定段落」，按一下或以原生 Enter 將焦點移到目前選定段落的名稱欄。首、中、末段與排序、複製、刪除還原後均按目前列 ID 定位；空清單或等待中停用。查看保留創作原文、順序、撤回紀錄、成果下載與音檔。editor-focus 純 byId 完整來源驗證與目前 ID 提案 → injected request controller 兩次 metadata capture 核對列序／visible／busy → 原 editor-focus-dom 依 ID 查實際名稱欄並核對可聚焦狀態 → app 原生 type=button／aria-controls／點擊。新 focusId 與原 index focus 共用 controller，保留原空列 add 行為；ID 查找不回退到新增。沒有新 keyboard listener，Tab／Enter 使用原生按鈕。產品0.105.0／唯一 policy38–105共68／unknown106拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模組及 app／HTML，沒有新增静態 asset、依賴、domain/application/server/adapter operation、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見 `docs/MUSIC-ROW-LOCATE.md`；定位暫態不進草稿／Agent。


## v0.106 完整列身份核對

修正共用編修焦點來源驗證跳過空洞 ID、接受繼承的數字位置，或被來源自訂 mapper 替換列 ID 的問題。完整自己的 ID 位置才可進入定位與選列；錯誤來源拒絕，正常請求可繼續。原生 UI 本來產生完整 ID 陣列，本輪沒有宣稱瀏覽器內存在惡意回呼或外部漏洞。editor-focus.checkedSource 純有界 length／own-index／ID 字串及唯一性檢查 → 隔離 dense ID 副本 → 原 index／ID proposal 與兩capture controller → 未改 editor-focus-dom。editor-selection 共用同一來源再沿原三capture／actual-after與DOM；不呼叫 caller map／iterator。固定原 length 控制讀取次數，讀完長度改變拒絕，不因 getter 增長超出上限。產品0.106.0／唯一 policy38–106共69／unknown107拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模型，app／HTML／DOM／domain/application/server/adapters與固定資產清單無diff，沒有新依賴、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見 `docs/EDITOR-FOCUS-IDS.md`；metadata不進草稿／Agent。


## v0.107 歌曲段落搜尋

歌曲段落表新增原文搜尋，查找名稱、敘事任務、聲音配置；每批20段，可前後分頁，點命中直接回到目前原欄位。保留重複段落、原文、小節、能量與音檔。文字、列ID或順序改變清除舊定位；數值編修保留命中，但原成果仍依既有規則停用下載。取消等待保留上一批，晚回覆不覆蓋後來編修或成果。

music_search／原生 music-search 純三欄字面與UTF-8位置、schema1／來源SHA → 共用application → CLI／Agent／MCP／HTTP → 注入current source／query／ID／result revision controller → literal excerpt DOM／native field focus。重用現有嚴格JSON、搜尋請求ownership、摘錄、輸入法Enter政策及editor-focus自有dense IDs核對；新三個固定JS assets。新增唯讀 music_search，17基本／24啟庫工具，需重新discovery；原23組input/output schemas保持。Agent1／draft3／既有交付schemas不改，產品107／唯一policy38–107共70，unknown108拒絕。沒有依賴、模型、媒體生成、外網或auth／路徑權限擴張。 見[契約](../../docs/MUSIC-SEARCH.md)。
