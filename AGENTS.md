# ZOE. G Music Lab

v0.52歌詞來源核對：校時建立從本次送出的 cues／總長或完整 package 派生期望，核對完整回應、時間來源／歷史說明、嚴格JSON及字面LRC／SRT後才替換表格與成果。純 lyrics-result 共用建立及所有帶時間匯入；錯來源／損壞／不完整保留原編修、上一份成果及待套用校時。raw JSON也核對原句，seed保持。HTML只核對存在與字串、不完整語義驗證；wire／schemas／12／17 tools不變。見[契約](docs/LYRICS-RESULT.md)。下方保留歷史迭代。

v0.51 SRT 純解析／原文核對：原各行空白與Unicode保留，物理多行明確 / 合句、原排版保留原檔／空白cue用JSON；Python／JS integer clock與單次文首BOM，application共用各adapter。lyrics-import對LRC／SRT沿共用timed-source guard核對原cues／time／inference與文字exports再preview／Apply；LRC原解析保持。產品51／來源38–51，wire／schema／12／17tools維持。見[契約](docs/LYRICS-SRT.md)。下方保留歷史迭代。

v0.50 LRC 原文保留：獨立 Python／JS 只解析相鄰行首時間、獨立 offset 與單次文首 BOM；literal remainder 保留。瀏覽器以原文核對 cues／time／inference 與 LRC／SRT 輸出，拒絕自洽但錯來源回覆，再 preview／Apply。多標籤歧義以版本1 JSON保存；原檔保持，wire／schema／12／17tools保持，明確來源38–50。見[契約](docs/LYRICS-LRC.md)。下方保留歷史迭代。

v0.49搜尋上一批：controller私有最多512對cursor與command generation，單batch／context保持；返回回讀原位置及序號，前進仍可全文接續。DOM範圍／邊界焦點、來源／query失效及retry分層；wire／schemas與12／17tools保持，明確來源38–49。見[導航契約](docs/DELIVERY-SEARCH-NAVIGATION.md)。下方保留歷史迭代。

## v0.48 輕量來源核對

delivery-source純internal plain bundle隔離容器／精確值比較，current核對原scope／revision／resultRevision／bundle及File身份，不只信任revision或共享object；不JSON序列化／clone全文。delivery-import full status／legacy onState保持，新view／onView／refreshView只含metadata；DOM明確走輕量路徑。單份雙側excerpt32768units／完整line counts快取，換檔／新ZIP／cancel／apply／undo清除。wire與12／17tools不變，產品48／明確來源38–48，未知拒絕。見[分層](docs/DELIVERY-SOURCE.md)。

在此工作區維護四個新專案，功能與狀態以 `projects.json`、`README.md`、`PROGRESS.md` 為準。

- 創辦署名 ZOE. G；GitHub 帳號 djguan-jpg；AI 協作範圍記錄在 FOUNDER-RECORD.md。
- 本機執行，Python 標準函式庫與瀏覽器原生 API；沒有模型金鑰或登入，不對外網路呼叫。本機工作台只綁定 127.0.0.1。
- 使用者已授權將第一版上傳至新 GitHub Repo，並準備自由工坊的原創專案發起資料。Repo 預設 private；公開需當次明確授權。新增依賴不在施工範圍。
- 只登錄本工作區的新作品，不認領既有 FreeTWAI 手冊的原作者身分；平台審核狀態需依實際結果記錄。
- 保留輸入媒體。輸出預設拒絕覆寫；使用者明確選擇 --overwrite 才替換指定輸出。
- 範例皆為合成資料。完整音檔、影片及私人素材不進 Git；測試產物留在忽略的 outputs 或暫存位置。
- 純字面包裝器不能宣稱已呼叫 AI；滿刻度樣本是可能削波訊號，不是聲音品質或版權判決；RMS 與 LUFS 分開。
- 修改後執行相稱測試；報告實際結果與未驗證範圍。
- 每輪採 codex/iteration-* 分支，開始前建立 restore tag，結束時提供 CHANGELOG／HANDOFF、指定提交的封裝與 SHA-256。驗收通過後以 private PR 合併，保留可審閱差異與還原點。
- 共用應用層服務 HTTP、CLI、Agent；產品版本、Agent protocol、草稿、保存紀錄與備份 schema 分別管理，未知版本拒絕，不靜默遷移。草稿庫只在啟動時明確指定目錄後提供保存操作，版本不可覆寫；備份恢復只新增／重用完整版本，保留原 ID／時間／位元組，不能藉 JSON 更換來源或目的路徑。
- 四個新專案目前採 PolyForm Noncommercial 1.0.0。保留 LICENSE／NOTICE；不另授予 AGPL 或商用許可。
- 每輪唯讀盤點本工作區 outputs、封裝及本輪程序。保留最新三個封裝版本；只有超過七天且可由 Git tag／遠端已驗證備份重建的本專案產物才列為清除候選。不得清理其他專案、素材或未確認程序。
- 使用者保存的草稿不是可由 Git 重建的產物，不進 Git／原始碼封裝，不得隨封裝維護清除；另行下載或備份所選草稿庫。
- 本專案採全新構思。只讀本次新建工作區及通用工具指引；不得參考使用者其他本機專案、歷史作品、記憶或 GitHub 專案。公開第三方 Repo 僅作有來源的需求研究；未授權不得搬入程式碼或素材。

- 歌詞校時共用 application、純 Python lyric_timing 及原生 lyric-time.js；half-away-from-zero 至毫秒，負值在捨入前拒絕。整批預覽／一次撤回不進草稿，套用只改時間；後續時間或句子改動拒絕整份撤回，文字／音檔／刪除歷史保留。

- 音檔雜湊與量測使用 audio_source 的同一自有副本，不重新開來源混用。PCM fmt 不一致拒絕；副本關閉，不洩漏臨時路徑。不宣稱外部同時改寫的原子快照、完整 RIFF conformance 或多聲道位置解讀。
- audio-review 純模型／inspect 核對 revision、原生 File 身份及接受條件；晚到成功／錯誤不覆蓋。輸入修改後標示上一份報告並停用下載，重新分析才恢復。

- 歌曲／分鏡成功回應經planning-review純模型與isCurrent才提交DOM／成果；共用run只顯示當前錯誤，過期成功／錯誤保留後續編修。dirty標示上一份設計並停用下載，收合不進草稿。設計能量不是實測音量，資料完成不是媒體生成。
- 寬桌面成果面板維持有界高度及局部捲動／鍵盤可達，窄視窗static流；修正後以實際滑鼠／鍵盤與下載驗證，不把DOM幾何當完整視覺驗收。

- storyboard_seed 為獨立 schema1 時間起稿，共用歌曲驗證與 application／四 adapter；v0.25至v0.30預設七工具／啟庫十二工具。source 的固定速度假設保留；未完成創作欄位留空，不能冒充分鏡／成片。每鏡最多整小節，保留段落邊界，超1000鏡／不足一影格拒絕。
- 起稿 preview／proposal 核對來源、目標與設定，晚回應不提交；局部套用保留其他 panel／音檔。draft-undo 核對實際 after 的限定／全部 panels，後續編修拒絕整份撤回，不覆蓋或丟棄 record；預覽／撤回不進草稿。

- 起稿檔回讀共用timing_slots／validate_seed／seed_files，seed1未知欄位或矛盾時間拒絕；storyboard_seed的music／seed互斥，匯入不能覆蓋FPS／bars設定。保留原檔，無靜默修正／丟棄創作欄位。
- file preview只核對target storyboard與檔案語義，music／settings編修保留；run可指定revision scope。checked file成果inputIndependent保留於頁面切換，生成成果dirty規則保持；上述暫態旗標不進草稿。

- replacement-preview純層共用需求／草稿／保存版本的讀取前與套用前snapshot，scope只核對目標，完整替換核對所有panels及原生File身份；未知／晚回應不覆蓋編修。原生媒體參照與preview payload不進持久草稿／Git／Agent。現代草稿也須明確預覽再載入，legacy維持明確轉換。

- lyrics_seed獨立schema1，純來源／行號／原文檢查共用application及四adapter；64KiB／1000非空白行，不猜時間、不去重／修剪原文。lyrics preview scope保留音檔／目前時長／其他panels，生成核對music來源、檔案核對目標；未知欄位／晚回應不替換，限定套用與實際after undo分層。
- cue-stamp純位置提案重用lyric-time毫秒規則，start／end分開、move保留句長及拒絕超音檔；部分有效cue只用於播放顯示，完整匯出仍拒絕空白時間。預覽／撤回暫態不進draft3，來源起稿JSON可保存於既有lyrics-source。

- 歌詞檔匯入由lyrics-import純request／reply／draft提案與controller分層，原生arrayBuffer嚴格UTF-8；讀取前snapshot、讀取後及HTTP後target scope與最新token檢查。TXT走既有lyrics_seed1／draft3，字幕走lyrics；選檔與Read均先預覽，不直接改原文／cue。apply／cancel與實際after限定undo保留其他panel／audio／duration；未知或晚回應不靜默取代。

- lyrics_package為獨立schema1，完整包root／timing／review_notes嚴格核對，未知版本／重複JSON欄位／矛盾來源拒絕。application三種lyrics輸入互斥，完整包檢查不可覆蓋名稱／時長／編修；legacy須明確轉換、原檔保持。
- 純lyrics-package.js與Python契約共用工作台／離線預覽，未改cue保留來源、確認總長仍提示曾補齊結束；人工編修加待實聽說明。provided時長衝突拒絕、空白才接續，estimated不填；source可保存於draft3既有欄位，不靜默遷移。

- 外部JSON共用json_document.py與json-document.js；嚴格UTF-8／重複鍵含跳脫同名／非有限數字／無效Unicode／64層，有界bytes。原生需求／起稿／草稿使用arrayBuffer及File.size核對，保留latest／target／預覽／proposal。可信生成結果與外部輸入分開，領域schema照常驗證，不做自動修補或版本遷移。

- draft-retention 純完整panel checkpoint／注入事件controller與DOM分層；markDirty只capture目標，離頁重查全部。原始範例與file／library／download各最近一筆完整確認可比較，metadata／File／成果／預覽不進草稿狀態。保存只確認click-time隔離快照，未知保存／放棄／送出下載不解警示；下載須明確核對後確認。現代檔／庫版本明確載入才留點，legacy轉換需另存；範例晚到保留編修。beforeunload受瀏覽器互動／生命週期限制，不宣稱自動保存／無資料遺失。

- audio_loudness獨立schema1；純loudness.py與有界自有loudness_blocks ledger分層，從同一音檔副本一次PCM掃描量測。單聲道／立體聲能量相加，nearest-sample 400ms／100ms；短檔／門檻下／未知layout／響度rate範圍外以null與status表達，不改既有技術接受。未知量測schema拒絕，舊無欄位報告明示未提供；RMS與LUFS／sample peak與true peak分開。FFmpeg僅外部校對，不引入執行或測試依賴，不宣稱完整規範認證、正規化或實聽。
- storyboard_frames 獨立 schema1；純映射與完成分鏡覆蓋層共用於 Python creative／seed 及 JS review／seed。保留最近整數、半幀取偶數；秒數容差不允許影格重疊／空缺或尾端不符，不自動調整原秒數／FPS。舊有效報告明示未宣告，現代缺失或未知版本拒絕；連續覆蓋不代表實際音畫同步。

- lyrics-media 共用純時長比較與注入 controller；選音檔保留已有作品宣告，原本空白且讀取期間未編修才接續首次有效時長。明確採用／撤回只寫 duration、同來源／實際 after 核對，保留後續 cue／原文／媒體。未知媒體與過期事件不能改內容；不裁切句子。比較／撤回不進 draft3／Agent，獨立 Apply 不直接用 player.duration，保留來源歷史提示。

- lyrics_review獨立schema1為唯讀未完成表格診斷；Python純layer與共用JS／注入controller／DOM分層。原列1起、global0，全部計數／有限200明細／前20UI，局部timed不表示全表通過。原始空白、文字與順序保持；不補時間／裁切，最終lyrics仍完整驗證。未知report／source不符／晚回應拒絕，報告與focus不進draft3；新tool唯讀、無路徑權限，v0.25至v0.30預設七／啟庫十二tools。

- planning-source 純核對本次完整需求與主要 JSON，planning-review checkedResult／checkedBrief 共用於建立與需求檔回讀；先 isCurrent，再檢查，最後提交 DOM。音樂標題依 Python 已清理 brief；數字與文字空白規則分開，母題提醒保留輸入順序。單份 JSON8MiB、重複鍵拒絕；不逐字重建 CSV／Markdown，sourceChecked 暫態不進草稿／wire。

- storyboard-duration純時間／影格候選與注入controller；新增／刪除保留宣告，明確採用只寫原始鏡尾。撤回核對原始時間／列ID／順序／數量／FPS及實際after，保留後續文字及媒體；載入新分鏡清除暫態，記錄不進draft或wire。仍須完整創作驗證。

- storyboard-readiness為純必填／引用與注入快照controller，定位前重查原分鏡；全部1000鏡／200明細／前20UI，載入清暫態，其他panel與媒體保持。filled不是完整驗證，原時間／影格／連戲照常拒絕，optional change_reason不改成必填，待辦不進draft3／wire。

## v0.29 段落順序

- music-arrangement純order／注入controller與DOM分層；五原字串、最多40列，穩定ID只存在本頁。同名不可合併；限定撤回只還原最近順序並保留後續欄位編修。
- 列或順序變更停舊撤回，歌曲載入清暫態。排序後歌曲及時間起稿重建同序，既有分鏡／其他panel／音檔保持；完整domain仍驗證，暫態不進draft3／wire。

## v0.30 歌曲欄位待辦

- planning-values 重用本專案 Python 文字空白／有限十進位文法，不使用空字串轉零；music-readiness 純欄位／範圍模型、共享 readiness-state 快照 controller、DOM 分層。保留原字串與 optional 歌詞，BPM step=any 仍完整驗證。
- 歌曲全部來源與列ID參與暫態定位；即使同文字列換序也停舊位置，定位前重查。歌曲載入清暫態；其他panel／媒體保持。40段／100清單／8MiB、全部計數／200明細／前20UI，零待辦及filled不是總長或作品接受。schema／wire／七及十二tools保持。

## v0.31 歌曲診斷跨工具報告

- music_review為唯讀原歌曲panel診斷；純Python report／application／四adapter、raw shape schema與JS同模型完整回覆核對／DOM分層。新的report1不替代music brief或完成驗證，原字串與原位置保持；零待辦仍needs_review=true。
- 8基本／明確啟庫13工具，需重新discovery，舊protocol／schema保持。40段／100清單／8MiB純source、傳輸2MiB／CLI草稿1MiB，全部計數／200明細／20UI；CLI0／2／1及預設不覆寫。核對source／完整data／JSON／Markdown後才提交成果，未知版本／來源不符／晚回應保留原成果、後續編修、媒體及草稿另存狀態。

## v0.32 分鏡診斷跨工具報告

- storyboard_review純原形狀／必填／畫面方向／母題引用、原列related_row與確定性report；application／四adapter／raw schema分層。1000鏡／30母題／8MiB純source、傳輸2MiB／modern草稿1MiB、全部計數／200明細／20UI；零待辦仍needs_review=true，不能代替完整時間／影格／連戲／媒體驗證。
- readiness-report純完整回覆核對由歌曲／分鏡共用，schema／protocol／source／data／JSON／Markdown一致才交出隔離結果；app沿revision／late／busy保護後才提交DOM。來源不同／未知／晚回應保留原成果與後續編修、音檔及草稿checkpoint。原字串／鏡號／母題ID保持，暫態不進draft3；9基本／明確啟庫14工具，需重新discovery，v0.31的8／13為歷史。


## v0.35 迭代封裝與程序

- 維護pure policy／Windows唯讀reader／filesystem-Git adapter／CLI分層，run1／audit1／recovery1獨立；不用Agent或HTTP增加清除／程序權限。
- Managed Python job啟動時自我登記PID／creation ticks／image basename，same-host核對；bare PID不判定ownership，重用外部程序保留，unknown不冒充已停止。不枚舉／kill或讀環境、命令列。
- scripts/iteration_audit.py預設稽核，僅完整direct release manifest／ZIP且latest3之外、嚴格超七天、exact tag／source／現場Git archive SHA才可列候選。prune需exact preview token與無running／unverified記錄，journal先保存；只搬移核對的本專案目錄、unlink兩檔／空目錄；restore拒絕覆寫。未知檔／連結／不完整封裝及草稿／備份／媒體保留。
- 讀寫有界manifest／journal與ZIP中央目錄，超限在搬移前拒絕。I/O可有部分結果，保留journal／隔離檔人工核對，不宣稱原子交易；Git objects／archive bytes不足不能冒充復原。每輪管理job依原handle正常停止，最終audit不能取代actual session completion。


## v0.36 成果查看與返回

- delivery-navigation純DTO／注入controller與DOM adapter分層；只讀scope／names／busy／dirty／message／error。導覽不進draft3、成果或Agent wire，完成不自動搶焦點。
- show／back明確操作前重查；busy停用，dirty仍可閱讀上一份且保持原下載停用，換台清舊返回目標。成果清空返回目前可操作build，避免聚焦disabled／hidden控制。literal text、aria關聯與auto捲動；新增asset不擴大Agent／HTTP operation權限。

## v0.37 接受條件草稿

- audio_acceptance獨立schema1原值模型／application／四adapter，64KiB／每欄1024字元／64值／safe integer；精確十進位整數，不因float捨入接受小數。shape可保存未完成欄位，active prepare才驗證數值；未知／額外／互斥拒絕。原profile及直接清單保持，10／15 tools與draft3保持。
- browser純原值／注入capture-read-replace-events controller／DOM；選檔先preview，read及apply重查token／target原文／native audio identity／busy。條件另存checkpoint與下載明確確認獨立，beforeunload不是自動保存。整份project載入deactivate自訂但保留raw，其他panel與媒體限定套用保持。
- inspect先驗有效條件、後revision／File／raw source，再實際acceptance／echo draft／report JSON-data／檔名核對才提交。未知／不符／late保留原成果與編修；dirty停下載。原音檔與legal4保持，未完成原值不冒充接受或實聽通過。


## v0.38 本輪文字交付

以下v38章節為當輪契約；v39新增delivery_inspect後基本12／啟庫17。

- delivery_package純來源／manifest1／確定性ZIP、application、CLI排他filesystem／HTTP有界staging／Agent-MCP及browser controller／DOM分層。1–64檔、8MiB文字、32MiB封套，平面可攜text names；不新增媒體／路徑／模型／自動寫檔能力。
- Agent預設metadata；明確include_archive且ZIP≤512KiB才inline，傳輸行2MiB保持，基本11／啟庫16工具。needs_review=true；封裝不冒充創作／媒體／權利接受，product0.38／交付schema1／protocol1／draft3獨立。
- browser完整source／revision／scope／dirty核對及逐檔摘要，未知／不符／late拒絕並取消自身有效ID；busy停用、原輸入／其他台／媒體保持，清單不進草稿。HTTP每類最多2slot／60秒／take一次／SHA，discard／expire／close只清自身檔且保留未知檔；不新增auth或常駐程序。CLI預設拒覆寫，--overwrite才替換明確目的ZIP。

## v0.39 文字ZIP接續

- delivery_inspect共用pure bounded canonical reader，不解壓／不執行HTML；CLI只寫指定摘要，Agent／MCP啟動時--delivery-zip選來源，JSON不得選路徑。預設metadata，include_files明確選擇且序列化JSON UTF8≤512KiB。
- browser先讀選定ZIP原清單，與自身bytes／SHA及server完整逐檔回覆核對；probe不冒充完整CRC核對。選檔→預覽→明確載入成果，表單／media保留，限定undo不覆蓋後續結果。原label與display note分開。
- inspection1／package1／Agent1／draft3獨立；基本12／啟庫17。只接受明確工具38／39，升產品版本先同步producer／inspector／browser支援表與契約測試，不自動接受未知版本。SHA／清單不驗證作者、權利或平台創始身分。


## v0.40 原文差異審閱

- 以下新規補充v39：delivery_inspect baseline明確scope／files，不可路徑；0–64檔／8MiB，聯集128，原檔名／UTF8精確比較，不合併。application服務CLI／Agent／MCP，HTTP原binary inspection保持，browser同契約經跨語言測試。
- comparison1與inspection1／package1／Agent1／draft3獨立，12／17工具保持。本版明確支持producer／inspector／browser工具38／39／40，未知拒絕；升版同步支持表與測試。
- 比較候選留局部，token與target再核對後才提交；不得讓舊async比較改新摘要。excerpt最多32768 UTF16且不拆surrogate pair；換行計數讀完整原文，textarea顯示不冒充原bytes。預覽與計數不進原wire/files，載入／下载保持全文。
- DOM literal text、readonly與缺檔／空檔分開，container width≥640px才雙欄，窄側欄上下；沿既有scope／revision／result／media／busy及限定undo保護。


## v0.41 可保存報告

- delivery_report純來源metadata／comparison驗證，JSON與Markdown逐UTF8 bytes跨語言相同；report1獨立、256KiB合計、最多128列，不帶成果原文／媒體／來源路徑。application從真ZIP與明確baseline派生，不能接受任意報告取代來源。
- include_report strict bool，要求baseline、與include_files=true互斥；default wire、12／17工具及其他schema保持。controller只對current pending來源下載；過期／取消／已apply／reading保護與hidden fields清除。
- HTML form會正規化換行。報告使用encoding=json-string，DOM JSON.stringify全文→HTTP既有嚴格decoder還原字串→下載原UTF8；拒絕未知／額外／重複欄位，勿全域正規化成果原文。
- launcher明確--audio WAV／--delivery-zip ZIP只列印絕對設定，不能改Host／讀媒體或宣稱Host安裝接受。
- filesystem text_outputs預設exclusive create，common保留API；預檢後同名新增也拒絕。多檔可部分輸出，錯誤明示，不宣稱交易式回滾、不刪除interloper。
- 本版producer／inspector／browser package／archive／import／report明確來源工具38／39／40／41，升版同步與測試，未知拒絕。


## v0.42 原文下載

- 五種browser文字入口共用text-download純Unicode／UTF8 bytes／注入controller及native DOM Blob adapter；current canonical source重查busy／dirty／選定名稱，不讀preview或hidden field，不經form正規化。單檔最多8MiB，其他領域原上限保持；未知Unicode／路徑／裝置名拒絕。
- object URL最多2個，送出後1秒、失敗、pagehide／dispose清理自身URL與timer。sent不冒充保存成功，確認舊snapshot保留後續編修；acceptance send callback先完成，失敗不新增pending。
- 結果預覽重用excerpt32768UTF16 units、不拆surrogate，aria提示明示摘錄，download與ZIP仍全文。binary staging與v41 HTTP相容保持，沒有Agent路徑／寫檔／網路權限擴張。
- 明確來源工具38／39／40／41／42，未知拒絕；12／17工具及Agent1／draft3／交付schema保持。v41 browser form段落是歷史實作，現版使用native bytes，HTTP編碼相容仍保留。


## v0.43 指定 ZIP 原文

- 原檔名驗證共用 delivery_package；selection1是已完整核對來源的純選取，不得跳過未選取檔的CRC／hash／canonical核對。明確檔名1–64且大小寫精確，全部存在才回傳。
- application／Agent／MCP選定files JSON限512 KiB；CLI --file-name明確輸出沿8 MiB完整來源，拒絕metadata碰撞、預設覆寫及report混用。沒有JSON路徑或自動寫檔權限。
- Browser originalFile只讀pending current source，重查工作台、表單／成果revision、bundle、busy與media。empty可下載、removed停用，取消／套用後拒絕舊來源；DOM只快取names與可用狀態，沿既有native bytes adapter。
- selection1獨立於Agent1／draft3及交付schemas，12／17工具保持，來源工具明確38–43，未知拒絕；I/O提示共用operation_errors且不漏私人路徑。見[契約](docs/DELIVERY-SELECTION.md)。


## v0.44 原文分段閱讀

- text-window1純請求／UTF-8 byte boundary model → application全份ZIP核對與SHA pin → CLI／Agent／MCP。起點字元中間拒絕、不自動調整；max4–16384，非零需archive_sha256，未選取檔損壞仍拒絕。明示片段不是完整檔案，files保持空、不能混用include_files／file_names／include_report。
- Browser純UTF-8模型／注入reader／DOM → current pending source；source key隔離原值、讀後重查。單buffer最多8MiB，頁面16KiB，history最多512；換檔／失效／cancel／apply／undo清除，不進status／草稿／wire。empty與missing分開，原下載全文及限定撤回保持。
- 12／17工具與Agent1／draft3及交付schemas保持，text-window1獨立；來源明確38–44，未知拒絕。只新增兩靜態JS，沒有路徑／寫檔／模型權限擴張。見[契約](docs/DELIVERY-TEXT.md)。

## v0.45 程序唯讀補查

- 原 Windows native unavailable 才補查同一明確 PID 的本機 CIM，三欄 ProcessId／Name／CreationDate、hidden／no-profile／no-interactive，operation3秒／自有helper5秒。無全域列舉／command line／環境／remote／原工作或外部程序終止。
- process-probe1純嚴格有界解碼／Windows adapter／原生路由／maintenance純政策分層；成功明確null才absent，未知／錯誤／warning／逾時保持unavailable。CIM時間±9 ticks內保持unverified，不假造精確ownership；明確分離／不同image才pid_reused並保留外部程序。
- run1／audit1／recovery1及12／17工具／Agent1／draft3保持；補查evidence只有basename／ticks／精度。產品45與交付來源明確38–45同步，未知拒絕；沒有新增Agent／HTTP維護權限。見[契約](docs/PROCESS-PROBE.md)。


## v0.46 原文搜尋與定位

完整核對 ZIP 後，text-search1 精確比對原文並回傳有限筆 UTF-8 命中位置；非零接續需前次 ZIP SHA。瀏覽器在「分段閱讀完整原文」輸入搜尋字，按尋找或 Enter，再選擇命中位置直接跳到原文；可搜尋 ZIP 或目前保留成果。每批20筆，原文、表單與媒體保留，來源變更清除舊結果。12／17工具、Agent1／draft3及既有交付 schemas 保持；交付來源明確38–46，未知拒絕。見[搜尋契約](docs/DELIVERY-SEARCH.md)。以下較早章節保留歷史迭代。


## v0.47 命中前後文

搜尋清單改以原文鄰近文字辨認重複句，選擇後顯示唯讀片段並定位原文。context1每側最多64 UTF-8 bytes、不拆字元，單項最多1152 bytes；清單標示換行／控制符號、整理側邊連續空格及120字元摘錄，原文DTO與片段仍保留原值。Agent／MCP明確include_context=true、CLI --match-context才提供；預設位置回覆與12／17工具保持，source SHA與current source失效保護沿既有搜尋。產品47、來源明確38–47，未知拒絕。見[前後文契約](docs/DELIVERY-CONTEXT.md)。下方保留較早迭代。


## v0.53 匯出格式檢查分層

純 Python／原生 JS export-review1與 integer-ms export-source1 SHA → 共用 application → CLI／Agent／MCP／HTTP；browser 注入 controller → current capture／完整回應核對 → DOM。新 operation 唯讀13／18；Agent1／draft3保持，row ID只在頁面，report不帶完整cues。LRC共享既有grammar，不修改解析語義；SRT ASCII空白／tab精確規則。全部10000句計數／前200明細／畫面前20，有界報告。wire package句號與當前表格句號分開，stable IDs定位；編修／late／cancel保留原資料。legal4與private保持，FreeTWAI未提交。見docs/LYRICS-EXPORT-REVIEW.md。

## v0.54 完整歌詞與精簡報告分層

純 export-review 驗證一次並複製完整來源 → 精簡 report + opt-in JSON → application → CLI／Agent／MCP／HTTP。JS純 files／完整 inspect → injected controller current capture／scope → DOM；完整附檔精確鍵、strict JSON、2MiB及語義值核對，report維持256KiB。default兩檔保持；browser明確三檔／建包六檔，row IDs仍只在頁面。來源排版bytes非保存承諾；無新路徑／寫檔權限／模型／依賴。窄螢幕提醒換行限寬，table自己捲動。產品54／來源38–54、13／18工具及Agent1／draft3／review1／source1保持，legal4／private／平台not_submitted保持。見docs/LYRICS-EXPORT-BUNDLE.md。


## v0.55 完整歌詞預覽核對

Python fixed assets/lyric-preview.html + 同一套 timing／strict JSON／package／media模組 → render_preview／公開固定template1 script → application既有HTTP／CLI／Agent／MCP。JS lyrics-preview純有界來源與整份HTML核對 → lyrics-result共用guard → injected import／app current revision → DOM與成果提交。範本與模組不取使用者路徑；回傳HTML不執行。完整來源2MiB、encoded JSON12MiB、HTML16MiB、contract256KiB；未知schema拒絕，物件key排序與數字拼法不作來源證明。固定HTML外框逐字比較；只接受本安裝的共用範本與模組，非通用HTML安全或作者／版權證明。产品55／明確交付來源38–55、13／18tools、Agent1／draft3／review1／source1保持。見[契約](docs/LYRICS-PREVIEW.md)。下方較早HTML僅存在的描述保留歷史，以此輪為準。


## v0.56 獨立預覽格式保留

既有shared export-review同步analyzeSource／public analyze → async完整report來源SHA（原wire）或offline controller有界view → literal DOM presenter／revision定位 →固定preview範本。Controller只保留counts／前20issues／固定notes／stale及revision，沒有歌詞全文／media／DOM／網路；current edit／delete／add／stamp／duration及media adoption／undo均invalidate，成功Apply才accept按已排序rows定位。DOM只文字與焦點，舊callback帶revision拒絕。同步提示不依賴WebCrypto，完整Agent report仍沿原SHA功能。Python固定producer嵌入LRC grammar／export rules／controller／presenter，template1 whole-envelope核對包含這些程式。產品56／來源明確38–56、13／18、Agent1／draft3／review1／source1／template1保持；HTTP與授權邊界無diff。詳見[契約](docs/LYRICS-OFFLINE-EXPORT.md)。


## v0.57 獨立歌詞下載分層

純lyrics-download.select驗證完整package／明確三格式後回傳固定name+content；不取DOM／media或保存狀態。共享text-download模型嚴格準備UTF8 bytes，text-download-dom新增createController factory沿同internal sendPrepared，既有form bind也沿該factory。預覽select先驗格式、執行既有Apply，再取完整目前data；adapter只建Blob與暫存anchor，兩pending上限／排程或離頁回收，失敗不留ownedURL。onSent是已提交click+schedule，與實際saved file區分；成功Apply已提交的編修不因下載失敗撤回。Python固定producer另嵌入formatter與web兩共享原生模組，無外部script URL；whole-envelope template1檢查包含新內容。產品57／來源明確38–57、13／18、Agent1／draft3／review1／source1／template1保持。見[契約](docs/LYRICS-DOWNLOAD.md)。


## v0.58 完整來源Unicode邊界

json_document.utf8_bytes與json-document.assertUnicode共享既有嚴格Unicode規則，Python decoder亦沿同helper而不重複編碼；native parser保留既有private呼叫。完整lyrics_package／lyrics-package在schema與時間檢查後，逐一核對title／cues.text／review_notes，再容量與隔離回傳。valid原字元不正規化或替換；非法UTF16/Unicode不能以JSON escape繞過package驗證。revise／legacy／download／offline診斷／application／固定preview共用domain；原生runtime右值validate失敗不提交data或render／transport，修好可retry。Agent raw JSON早拒絕invalid_request原行為保持，連續good/bad/good不影響後續。產品58／來源38–58、13／18、Agent1／draft3／review1／source1／template1保持。見[契約](docs/LYRICS-UNICODE.md)。


## v0.59 固定交付版本契約

`musiclab/assets/delivery-versions.json` 是產品版本與交付來源版本的唯一執行期資料源；`delivery_versions.py`／`delivery-versions.js` 純驗證後隔離保存，未知schema／缺失／錯序／重複／非標準版本即拒絕。Python package與inspection、browser package/import/report、application Agent／MCP metadata共用；schema和protocol不由產品版本推導。固定GET契約script沿既有本機Host／Origin門檻，無任意路徑或寫入。更新產品只改registry current及明確supported項，projects.json發布metadata需一致；歷史支援不靠range推測。測試保留獨立歷史oracle；封裝必須交叉核對registry／metadata／discovery。見[契約](docs/DELIVERY-VERSIONS.md)。


## v0.60 ZIP核對的本地失敗狀態

`delivery-import` controller持有scope/latest job失敗；view/status加隔離nullable failure `{code,message,truncated}`，message最多240 Unicode字元加ellipsis。只屬本地UI metadata，原HTTP/Agent/MCP wire與schemas不變。early invalid/busy與讀取／完整核對拒絕皆保持原成果；onError原error callback不改寫。新選檔／cancel／apply／undo清除，scope refresh清除，old/cancelled promise不恢復錯誤。DOM literal text保持local role=status，失敗可清除／重選，clear只走既有cancel，不取消scoped undo。相同note不重寫，減少普通refresh重複live通知；未做真人screen-reader驗收。見[契約](docs/DELIVERY-FEEDBACK.md)。


## v0.61 音檔報告数值核對

`audio-statistics.js`是無I/O、無UI的整數PCM bounds validator；`audio-review`在組成presentation／onResult之前呼叫。固定HTTP asset／index dependency提供同一模組；CLI、Agent、MCP、HTTP依原共用Python application產生報告，跨語言實際producer matrix確認可讀。影格／時長／bytes、peak/RMS/null/DC/full-scale、安靜邊界与mono/multichannel correlation互相核對；只驗證報告自洽，不重算PCM／響度、不證明實聽、授權或SHA對所選瀏覽器File的獨立核對。原report schema、loudness1／acceptance-draft1、Agent1／project draft3保持。見[數值契約](docs/AUDIO-STATISTICS.md)。


## v0.62 音檔回覆與所選File來源

`audio-file` native File.arrayBuffer/WebCrypto SHA-256 → `audio-result`純exact envelope/current product/protocol/raw JSON/file-set/source-echo核對 → `audio-review`既有PCM/loudness presentation/inspect → app DOM。兩async邊界重新核對原File identity/revision/profile/rawdraft，過期hash/error不upload/回寫；只保留64字元digest，read buffer不持久快取，64MiB既有選檔上限保持。preset與draft都走完整來源guard；live response須與固定頁面current product相同，legacy buildReview label保持另行使用。report.md只核對非空有界有效Unicode文字，不宣稱語義重算。見[AUDIO-RESULT](docs/AUDIO-RESULT.md)。


## v0.63 音檔完整文字報告

純audio_report.py／audio-report.js canonical render → audio_bundle共用application（CLI/Agent/MCP/HTTP）／audio-result checked逐字MD → 原audio-review PCM/LUFS/current → DOM。取代v62僅非空Unicode的MD檢查；JSON量測、原媒體／schema／protocol保持。固定小數是顯示契約，null明示不可測；全文有效Unicode／8MiB，錯誤／late保留原結果。數字契約見[AUDIO-REPORT](docs/AUDIO-REPORT.md)，非實聽、重測或權利證明。


## v0.64 自訂接受條件診斷

pure field_values／fieldValues沿原精確正整數文法→review1全部三欄→application readonly與四adapter；JS whole source／JSON／MD／current產品核對→readiness-state快照→獨立DOM定位。custom false保留未用原值不阻擋，zero issue始終needs_review；不冒充音檔接受。極大零指數Decimal InvalidOperation轉受控正整數錯誤，原小數不捨入。基本14／啟庫19、Agent1／draft3與legal4／private／not_submitted保持；產品64／明確交付38–64。見[契約](docs/AUDIO-ACCEPTANCE-REVIEW.md)。


## v0.65 條件報告接續

audio_acceptance_input／audio-acceptance-input獨立純contract1：64KiB嚴格decoder→整份review1重新派生並核對→隔離source draft1。CLI兩個既有明確選檔入口與browser注入decodeSelection支援；原draft decoder與Agent／MCP／HTTP payload保持draft-only，無新operation。previewKind暫態不入草稿，current／native File／busy／late與明確Apply保持。條件保存以最近loaded與confirmed兩個指紋留點，較早download確認不能取消新loaded；非保存成功或自動保存承諾。產品65／明確來源38–65，14／19 tools／Agent1／draft3／legal4／private／not_submitted保持。見[契約](docs/AUDIO-ACCEPTANCE-INPUT.md)。


## v0.66 條件套用撤回

draft-undo.createValueUndo純注入validator／隔離before與after／精確proposal→audio controller→DOM。history只一筆完整接受條件，Apply記actual capture after；載入checkpoint仍只確認檔案原document，adapter改寫值不可冒充保留原檔。Undo核對當前全部profile／custom／fields，再只改條件並復原以前loaded，confirmed／媒體／其他台保持；編修拒絕且record保留，success清preview／late token／record，projectLoaded／dispose清暫態。DOM成功focus可編修rates或profile，不聚焦停用Undo。無新schema／wire／Agent operation；產品66／明確來源38–66、14／19工具、Agent1／draft3／legal4／private／not_submitted保持。見[契約](docs/AUDIO-ACCEPTANCE-UNDO.md)。
