# 迭代說明

## v0.51.0 — 2026-10-04

- 修正 SRT 匯入尾端空白刪除與 Unicode U+0085／U+2028／U+2029 被當換行改為 /；原文各行文字、tab及前後空白保留，真正多行仍沿既有 / 合為單句。ASCII空白行分段，原排版／空白cue限制於介面與文件告知。
- 新增 Python lyrics_srt／原生 JS lyrics-srt 純解析層；CRLF／CR／LF、可選ASCII索引、逗號／點時碼與空白／tab箭頭，checked integer milliseconds、單次文首BOM。超界／缺文字／無效時鐘拒絕；倒置／重疊由共用validate拒絕，不裁切。
- LRC與SRT沿同一timed-source回應核對，從所選原文核對cues／time／inference與JSON／LRC／SRT輸出，拒絕自洽但wrong-source回應。LRC原解析／測試維持；一項Unicode候選未重現。HTML preview僅存在／型別檢查，不宣稱完整語義核對。
- 441 Python／654 JS／54 syntax／4 Skills及原生／三寬度／v50還原通過。產品51與來源38–51、各wire／schema／12／17tools／legal4維持；private exact-source與maintenance依收據。

## v0.50.0 — 2026-10-04

- 修正 LRC 去除歌詞前後空白、將句中 timestamp 視為額外 cue、句中 offset 移動全曲、Unicode 分隔符截斷文字。只解析相鄰行首時間標籤；標籤後全文原值保留，offset 僅獨立行最後值生效，換行只分 CRLF／CR／LF。
- 獨立 Python lyrics_lrc 與原生 JS lyrics-lrc 純模型，整數毫秒與既有精度驗證；單次文首 BOM，CLI／browser／Agent 不重複去除。超界／負時間／無效行首時間拒絕；巨大前導零先縮小再轉整數。
- 瀏覽器 LRC 回應核對原文推得的 cues、duration、estimated、timing／review_notes 及 LRC／SRT 原文輸出。JSON self-consistency 仍保持；完整 preview.html 只核對存在與文字型別，沒有宣稱完整 HTML 語義驗證。
- 428 Python／641 JS／53 syntax／4 Skills、原生預覽／Space套用／重新讀原文／錯誤拒絕／取消／撤回及三寬度／前版還原通過。句首字面 timestamp 與多標籤歧義保留並告知，JSON 作完整保存。產品50／來源38–50；wire／schema／12／17tools／legal4保持。

## v0.49.0 — 2026-10-04

- 新增搜尋「上一批」，回讀同來源cursor重建20筆結果與原序號；每次換批清選取與context，原文reader不自動跳。顯示範圍，最後／第一批停用相應按鈕並讓鍵盤焦點接到另一可用控制。
- controller只保留最近512個start／offset，超出丟最舊返回位置，前進可繼續；提示重新尋找回開頭。query／source／availability變更與重新find清除；失敗保留當前批次、選取、cursor，可重試。
- 修正注入回呼換批／query-change-back／nested read後，舊操作仍提交選取或錯誤的重現；generation／來源／query／batch再次核對。實際DOM callback未重現換批，不誇稱普遍UI故障。
- 十個新JS回歸，416／629／52 syntax／4 Skill及四台原生、三寬度／前版還原通過。產品49／明確來源38–49，wire／schema／12／17tools／legal4保持；private exact-source與maintenance依收據。

## v0.48.0 — 2026-10-04

- 把內部成果來源的隔離snapshot／精確比對移到純delivery-source層，複製容器、保留不可變字串值；每次current仍核對全部原值及原生media身份，不能只依revision或object identity。
- 新增metadata-only view／refreshView／onView；工作台畫面不用完整proposal，完整status／legacy onState／refresh仍提供隔離資料。單份32768-unit雙側excerpt及全文換行計數快取，換檔／新ZIP／cancel／apply／undo釋放。
- 約8MiB原文30次Node讀取／刷新：14,060.47ms→0.99ms，JSON序列化2,516,606,400 chars→0；不是瀏覽器延遲／heap／所有搜尋速度保證。新增17個有意義回歸案例，416 Python／619 JS／52 syntax／4 Skill與四台原生操作通過。
- 產品48與明確來源38–48同步；沒有新wire/schema／tool／依賴／Agent權限，legal4保持。v47指定ZIP還原416／602通過；本輪private exact-source、actual remote及latest3維護依收據。

## v0.47.0 — 2026-10-04

- 用有界原文前後文區分重複搜尋字，選擇後顯示readonly片段並定位。清單標示控制符號、側邊空格縮合／120字元省略；原文與query空格不變。
- context1純bytes裁切／嚴格DTO／presentation、search opt-in／完整ZIP application／CLI／Agent／MCP及DOM分層；每側64／單項1152 bytes，單8MiB buffer共用。預設七欄位置及12／17工具保持。
- strict include_context、來源／query／下一批／Apply／Undo失效；產品47及來源38–47、legal4保持。416 Python／602 JS／51 syntax／4 Skill及四台原生UI、8MiB EOF、後續編修／Undo、三寬度DOM與v46 ZIP408／594還原通過。
- server正常關閉後QA取未建立lazy staging屬性exit1；原handle及錯誤保留，補核對port0／staging未建立，沒有重啟。正式媒體、完整視覺／Host／FreeTWAI與瀏覽器全文保存仍待。

## v0.46.0 — 2026-10-04

- 搜尋完整原文並跳到命中位置，解決長文只能逐段翻頁的缺口。browser ZIP／保留成果每批20筆，Enter／下拉與下一批；來源或query改變清除舊結果。
- text-search1純UTF8 literal位置、完整ZIP／SHA pin application與CLI／Agent／MCP分層；純KMP／controller／DOM與reader共用單8MiB cache，不重新編碼全文；16KiB頁面與原文下載保持。
- query最多1024 UTF8 bytes／Agent1–50，非重疊、one-lookahead、非零起點必須SHA；未知、字元中間、source改變、未選CRC或混用模式拒絕。產品46／明確來源38–46；12／17工具與legal4保持。
- 408 Python／594 JS／50 syntax／4 Skills；四台真瀏覽器、8MiB尾端、保留來源、空／缺／literal、Enterfocus、三寬度DOM、Apply／Undo與前v45 ZIP398／582還原通過。本輪下載保存事件未確認，正式媒體／實聽／完整視覺／Host／FreeTWAI仍待。

## v0.45.0

- 修正 Windows 原生 identity unavailable 導致已退出工作留在未確認狀態；只補查同一PID的本機三欄CIM。
- probe1嚴格有界解碼、單PIDWindows adapter及原生路由分層；純政策保留±9 ticks精度範圍，近似身份不能宣告ownership。
- 失敗／warning／空／錯PID／未知／逾時保持未知；live／unknown阻擋prune，重用的外部程序保持。operation3秒、helper5秒，沒有新維護權限。
- 產品45、來源工具明確38–45；法律／創辦紀錄及12／17 tools／既有schemas保持。398 Python／582 JavaScript／48 syntax／4 Skill與diff通過。

## v0.44.0 — 2026-10-04

- 完整核對ZIP後明確原文分段，Agent／MCP／CLI讀長檔不擴大512KiB files cap。非零起點pin前次archive SHA，變更來源、UTF-8字元中間與缺檔拒絕；片段明示位置與來源，不冒充完整原檔。
- Browser獨立唯讀reader可選目前成果／ZIP原文、前後段與回開頭，empty／missing分開，原下載及Apply／Undo保持。單buffer最多8MiB、頁面16KiB、history512，失效清除，不重複編碼全文。
- 純text-window1／application／adapter與純JS模型／隔離source key的controller／DOM分層；12／17與Agent1／draft3保持，來源38–44，新增兩靜態JS。
- 387Python／582JS／48syntax／4Skill；新增10Python／10JS、8MiB全模型拼回、實際CLI／Agent／MCP，四台20段顯示與4檔完整下載同來源、保留原WAV／後續編修、鍵盤／取消晚回應／三寬度及前版v43 ZIP377／572還原通過。私有發布與維護依收據。

## v0.43.0 — 2026-10-04

- 先完整核對 ZIP，再按明確原檔名選取，解決大封裝無法只取小檔。Agent／MCP維持512 KiB files JSON上限，CLI明確輸出沿8 MiB來源，缺檔與未選取檔損壞都拒絕。
- 四工作台在載入前下載完整 ZIP 原文，empty可下載、removed停用；重查來源與revision，保持目前成果、表單、媒體及限定撤回。DOM只快取檔名與可用狀態，避免切換時再複製大原文。
- 新增pure selection1與共用 sanitized I/O提示，沿原portable檔名、application與native UTF-8 adapter分層。12／17工具與Agent1／draft3保持，來源版本明確38–43。
- 377Python／572JS／46syntax／4Skill；新增12Python／7JS、實際CLI／Agent／MCP，四台13份原文同ZIP bytes／SHA與保留原WAV，三寬度DOM、晚回應取消及v42 ZIP365／565還原通過。exact-source私有發布與維護依收據。

## v0.42.0 — 2026-10-04

- 五種文字下載共用原生UTF-8 bytes，修正form換行正規化及body上限；保持BOM／CRLF／LF／CR／NUL／emoji／空檔。每次取current canonical source，dirty／busy拒絕，下載失敗不新增保存確認。
- pure text-download／注入controller／DOM與app分層，最多2個object URL、一秒／失敗／pagehide釋放自有timer與連結；ZIP／備份staging、相容HTTP、12／17工具及schema不變，來源版本明確38–42。
- 重現8MiB全文textarea拖慢操作，成果預覽重用有界excerpt與aria提示，不拆emoji，下載與ZIP仍全文。
- 365Python／565JS／46syntax／4Skill；新增11JS，四台13份實際原文與ZIP相同、正好8MiB原文重下載、2份報告／三種保存檔回讀、原WAV SHA／後續編修／三寬度geometry及v41 ZIP365／554還原通過。private封裝／PR／Release／actual remote bytes及latest3維護依本輪收據。

## v0.41.0 — 2026-10-04

- ZIP預覽可保存完整差異JSON／Markdown，來源ZIP SHA／bytes、manifest與兩側檔案摘要；下載不套用，編修／取消／晚回應保護沿用，報告schema1獨立。CLI --comparison-report／Agent include_report要求baseline、拒絕include_files碰撞，12／17工具保持。
- Python與browser純報告層、application／adapter分層；原生form明確JSON字串編碼還原原LF／CRLF bytes，未知／重複欄位拒絕；不改legacy export。
- launcher列印絕對WAV／ZIP選擇，不修改Host；default text writer exclusive create修正另一writer預檢後建立檔案被覆蓋的race，多檔可能部分輸出明示，不刪除回滾。
- 365Python／554JS／44syntax／4Skill，新增16Python／8JS；原生四scope8報告逐bytes同契約、原WAV SHA／Enter與三寬度geometry、v40 ZIP349／546還原通過。private exact-source封裝／PR／Release、actual remote hashes與latest3／typed run維護依收據。

## v0.40.0 — 2026-10-04

- ZIP替換前新增精確文字差異／新增變更移除相同／兩份原文與原換行計數；長檔有界摘錄但載入下載全文，按實際面板寬度排版，表單與音檔保持。
- pure Python比較／application／CLI、JSON-lines與MCP；browser同契約model／最新候選controller／literal DOM，HTTP既有inspection核對保持。baseline明確提供scope／files，0–64檔／8MiB、聯集128；comparison1與inspection1／package1／Agent1／draft3獨立，12／17工具保持。
- 349Python／546JS／43syntax／4Skill及diff，新增9Python／15JS；四scope真fixture／Agent／MCP、原生五包下载逐bytes相同、原WAV SHA／40000字全文／Enter撤回與390／1024／1800px通過。v39指定ZIP340／531還原；private PR／指定source封裝／Release／遠端bytes與latest3／typed run維護依收據。

## v0.39.0 — 2026-10-04

- 補齊下載ZIP後無法接回工作台的缺口：四scope原文字ZIP核對／预覽／明確載入／限定撤回，表單與已選音檔保持。讀取中取消、晚回應與跨scope保護，200字原說明再封裝。
- 純有界inspector／canonical producer／application／CLI、HTTP、JSON-lines與MCP分層；browser原二進位清單anchor／純controller／DOM防回覆label沿用ZIP SHA。只接受標準工具38／39，未知拒絕、不解壓。metadata預設、明確files JSON≤512KiB；12／17tools，inspection1／package1／Agent1／draft3獨立。
- 340Python／531JS／4Skill／42syntax及diff，新增12Python／40JS；四scope原生舊ZIP→載入→重下載逐檔相同，長label另包、原WAV SHA／表單保持、4秒late／取消／錯誤来源／390px Enter及1366px可見清單無橫溢。前版v38 ZIP328／491還原通過。指定source封裝／private PR／Release／遠端bytes與限定run／latest3依本輪收據；診斷失敗不當作接受。

## v0.38.0 — 2026-10-04

- 補齊逐檔下載容易漏掉附檔的交付流程：目前工作台所有文字成果ZIP及完整逐檔SHA清單，修改後停用、重建後再下載；不自行收集音檔、草稿或其他素材。
- 純來源／manifest1／確定性ZIP、application、CLI排他寫檔及HTTP有界staging、Agent／MCP adapter、browser純controller／DOM分層。1–64檔／8MiB文字／32MiB封套；Agent預設摘要、明確小型inline上限512KiB，11／16工具及Agent1／draft3保持。
- 完整來源／scope／revision及逐檔清單回覆核對，未知／不符／晚回應取消自身暫存。328Python／491JS／4Skill／39syntax，16新Python／31新JS；四台5次原生下載及全部bytes／SHA讀回、4秒晚回應未逾時取消、390px鍵盤／1366px無頁面橫溢、原合成WAV保留。v37指定ZIP312／460還原通過；private PR／指定commit封裝／Release及遠端bytes／latest3維護依本輪收據。兩次舊工具數量斷言失敗的診斷留在outputs，本輪最終完整檢查通過。

## v0.37.0 — 2026-10-04

- 補齊工作台與CLI／Agent之間的自訂接受值差異：Hz／bit／聲道數，原值獨立schema1條件草稿，未完成可另存，preview／apply／cancel與自己的另存checkpoint。
- 純shape／精確整數／既有直接清單normalize、application、四adapter與browser model／controller／DOM分層。長小數不因float捨入接受；原值、限定target及media身份／busy／late保護，回覆實際清單／來源／report JSON-data核對後才提交。原draft3保持、整份project載入deactivate自訂且保留raw；10／15 tools保持。
- 312Python／460JS／4Skill／37syntax與diff、12新Python／17新JS；四入口實際來源一致、長Unicode HTTP界限、native report／未完成／換行原值及project3下載回讀、390px鍵盤／1366px／500／4秒late／其他panel及media保持。v36 ZIP300／443還原通過；指定commit封裝／privatePR／Release及遠端bytes、latest3／限定程序／維護依收據。PolyForm非商用／legal4／署名保持，平台not_submitted。

## v0.36.0 — 2026-10-04

- 修正窄螢幕建立後成功訊息與成果在視窗下方難尋找：四工作台建立旁狀態及明確查看／返回，聚焦成果標題再返回原控制。清空成果則返回可操作的build，換台清舊目標。
- 純presentation／注入controller／DOM分層；完成不搶焦點，busy停用、dirty明示上一份並保持下載停用，晚回應保留新內容與舊成果。literal文字／鍵盤／auto捲動，導航不進draft或wire；HTTP只新增固定JS assets，10／15工具保持。
- 300Python／443JS／4Skill／35syntax及diff，12新測試；390px／1366px四工作台往返、busy／500／4秒晚回應、原音檔及實際report／draft3下載讀回、真draft載入清空返回build；v35ZIP300／431還原通過。指定commit封裝／privatePR／Release／遠端bytes依本輪收據。PolyForm非商用、署名保持，FreeTWAI not_submitted。

## v0.35.0 — 2026-10-04

- 新增獨立開發維護CLI，預設唯讀稽核／exact preview token清除／recovery journal還原。pure policy、Windows identity reader、filesystem-Git adapter分層，未知schema拒絕；創作10／15工具與既有protocol／draft保持。
- 受管理程序記錄PID／啟動creation／image，重用／已退出／未知分別呈現；read-only單handlefinally關閉，不讀環境、不kill未知或其他程序。
- 封裝限定本專案完整manifest／ZIP兩檔，最新三版／嚴格七天／exact tag與來源、ledger／CRC／現場Git archive SHA；journal先保存、限定搬移與兩檔刪除、restore不覆寫。草稿／備份／媒體與不完整／未知封裝保留。ZIP中央目錄預分配與journal大小有界，I/O部分結果保留journal，不宣稱原子交易。
- 300Python／431JS／4Skill／33syntax；19新增測試、真合成CLI清除／8檔bytes還原、Windows live／handle、原生四工作台／draft3下載讀回、前版v34ZIP281／431還原；指定commit封裝與privatePR／Release／遠端bytes依收據。PolyForm非商用／署名保持，FreeTWAI not_submitted。

## v0.34.0 — 2026-10-04

- 分鏡創作欄位為零仍可能有無效原時間；新增獨立時間待辦，可定位 FPS、秒數、影格缺口／重疊、短於一幀及尾端覆蓋，建立完整包先定位時間問題。
- 新唯讀 storyboard_timing_review、CLI storyboard-timing-review、HTTP 與 JSON-lines／MCP 共用 application；最小原時間來源與 report1 獨立，舊創作 report1／Agent1／draft3保持。基本10／明確啟庫15工具。
- 純部分時間診斷、版本報告、共享影格映射與秒數容差、adapter／DOM 分層；總長接續重用診斷與有限十進位規則，全形數字可明確採用原鏡尾並撤回原總長。原字串、原鏡號／順序、創作及媒體保留。
- 281 Python／431 JS／4 Skill／33語法及diff；103跨語言完整report／Markdown與完成分鏡時鐘接受一致，1000列／2000待辦只截明細。11組 IAB 行為、三份原生報告與四adapter、四panel原值往返、390px DOM／Enter、晚成功／500／不同來源／未知版本保護、原音檔保持及24影格完整包通過。
- 前版v0.33指定ZIP267／413解壓還原通過；本版指定commit封裝、private PR／Release與遠端bytes／SHA、restore及限定維護依本輪收據。PolyForm非商用、署名保持，FreeTWAI not_submitted。

## v0.33.0 — 2026-10-04

- 修正合法 draft3 的原字串被 number／select／單行控制項清空或改寫：12 個數值／畫幅重現值與 8 個特殊欄位經真實瀏覽器下載，四個 panel 與載入來源相等。
- 新增純 raw-fields 控制器與 raw-fields-dom adapter；數值文字欄位保留未完成值，未知畫幅有「原值需核對」選項，特殊字元以可見符號與描述提示。明確編修使用新文字，不自動解碼或轉換。
- 草稿、排序／刪除還原、時長撤回與歌曲／分鏡待辦共用原值；完整分鏡保留時間字串交給 domain，歌詞及鏡頭摘要／新增／刪除壓縮不再將十六進位當十進位。
- 267 Python／413 JS／四 Skill／32 語法與 diff；24 IAB 項目、原生草稿與兩份報告、四 adapter、390px Enter、4 秒晚回應、來源不符保護、原音檔及確認保存；修正後歌曲136秒／分鏡576影格／歌詞6秒完整建立。前版v0.32 ZIP267／400解壓還原通過。
- 指定commit封裝、SHA、private PR／Release與遠端bytes、restore tag及限定維護依HANDOFF與本輪收據。PolyForm非商用、署名、9／14工具及各schema保持；FreeTWAI尚未提交或核准。

## v0.32.0 — 2026-10-04

- 分鏡原欄位診斷／JSON與Markdown報告接通CLI、HTTP、JSON-lines及MCP；原鏡號／母題ID與引用保持，明確--draft只取modern草稿分鏡工作台。
- 歌曲與分鏡抽取共享純回覆核對層；完整來源／data／JSON／Markdown與protocol／schema核對後才提交，未知或晚回應保留編修／成果／媒體／另存狀態。
- 新唯讀工具，9／14 discovery；原協定和schema保持，零待辦不是完整時間／影格／連戲或媒體驗收。
- 267Python／400JS／四Skill／30語法、64跨語言、27IAB／兩native／四adapter／真draft CLI及Agent、390px Enter／母題原列／35待辦20定位／4秒晚回應／完整重疊拒絕及576影格通過；前版v0.31 ZIP258／391還原通過。
- 本輪分支、restore tag、指定commit封裝與SHA、privatePR／Release、遠端檔案與限定維護收據；使用者草稿／素材不清除。見HANDOFF與QA-v0.32.0。

## v0.31.0 — 2026-10-04

- 基線真Agent無music_review、IAB歌曲待辦沒有可交付報告。新增唯讀歌曲原欄位診斷與獨立zoe-music-review schema1，JSON／Markdown；原字串／留白／原列保持，不補創作，零待辦仍須完整歌曲建立。
- music_review.py純形狀／範圍／必填及report，application供HTTP、CLI、JSON-lines、MCP；discovery精確原panel／允許空字串與空列。CLI --input／--draft互斥、modern草稿不遷移、0／2／1狀態與預設不覆寫。8基本／啟庫13工具，舊schema／protocol保持。
- music-readiness重用純模型重算source／完整data／JSON／Markdown及protocol／schema；app明確報告動作、revision／late guard與busy，核對後才替換成果／隱藏舊設計。錯誤、來源不符／未知版本／晚回應保留原成果及後續文字；其他panel／音檔／另存狀態保持。
- 258Python／391JS／四Skill／29語法、9新Python／9新JS、75真Node↔Python報告／Markdown及18IAB，兩native／四adapter、實draft3→CLI及Agent、390px Enter／雙控制／4秒晚回應通過。前版v0.30 ZIP249／382解壓還原；restore-v0.30.0-before-v0.31.0保留main起點。
- 產品0.31.0，無新依賴／模型／auth／production／路徑權限。ZOE. G／PolyForm Noncommercial1.0.0／private保持；指定commit封裝／privatePR合併／Release／遠端bytes、最新三版SHA與確定PID／outputs盤點依收據。完整視覺／正式媒體／Host／FreeTWAI／原生file仍待，rolling active。

## v0.30.0 — 2026-10-04

- 基線 IAB 重現空白段落只顯示泛用錯誤、有效 BPM120.0004 被 HTML 步長攔下。新增歌曲欄位待辦及建立／歌曲分鏡起稿前原欄位定位；BPM step=any，完整數值範圍與 domain 保持。
- planning-values 提取本專案既有文字／有限十進位規則，需求清單與 planning-source／兩種待辦重用。music-readiness 純診斷、readiness-state 注入快照控制器由歌曲／分鏡共用、app 只呈現／聚焦／busy。40 段、每種清單100、8 MiB、全部計數／200明細／前20UI。
- 原始全部歌曲與穩定列 ID 快照，修改／排序／刪除停舊定位、定位前重查、歌曲載入清暫態；其他工作台／音檔保持。待辦零仍可能總長超限，完整歌曲／起稿驗證及來源核對照常執行；Agent檔案起稿獨立。
- 249 Python／382 JS／四 Skill／29 JS 語法、3新Python／15新JS、69歌曲欄位及29數值跨語言、26 IAB通過。四adapter／四native／實draft3、真17鏡Agent接續／撤回、390px Enter、4秒晚回應及CLI預設不覆寫通過；前版v0.29 ZIP246／367還原，restore-v0.29.0-before-v0.30.0保留起點。
- 產品0.30.0，各protocol／schema及七／十二工具保持，無新operation／依賴／模型／auth／production。非商用／private／ZOE. G保持。指定提交封裝／privatePR／Release／遠端bytes與最新三版SHA／確定PID盤點依收據；正式媒體／完整視覺／Host／FreeTWAI及原生file仍待，rolling active。

## v0.29.0 — 2026-10-04

- 真IAB確認段落只能新增／刪除。新增歌曲段落前移／後移，同名、五原字串及穩定列識別保持；控制在橫向表格外，新增選取並聚焦新列。
- music-arrangement純move／restore、注入controller與DOM分層，最多40段。限定撤回只還原最近順序，保留後續文字／小節／能量；列或順序變更及歌曲載入後舊紀錄失效，busy停用排序／新增。
- 歌曲成果需重建，新的歌曲與分鏡時間起稿同序；既有分鏡／其他panel／音檔保持，舊歌曲起稿預覽拒絕套用。真Agent18鏡檔明確限定接續及撤回，需求載入清暫態。
- 246Python／367JS／四Skill／26JS語法、2新Python／14新JS、78種40段移動／反向恢復、10真Node→Python歌曲／起稿及21IAB；四adapter、四native下載／實draft3、390px Enter、4秒晚回應及預設不覆寫通過。前版v0.28ZIP244／353還原，restore-v0.28.0-before-v0.29.0保留起點；指定commit封裝／privatePR／Release／遠端bytes依收據。
- 產品0.29，各protocol／schema及七／十二tools保持，無新operation／依賴／模型／auth／production。非商用／private／ZOE. G保持。最新三版SHA與確定PID／outputs盤點，合格舊產物才清理；正式媒體／完整視覺／Host／FreeTWAI及原生file仍待，rolling active。

## v0.28.0 — 2026-10-04

- 真IAB重現未選母題先停在泛用錯誤、焦點留建立。新分鏡創作待辦列必填與母題引用，建立先定位第一項，留白與原創作保持。
- storyboard-readiness純模型／注入快照controller／DOM分層，1000鏡／30母題／8MiB、200明細／前20UI，定位前重查、修改後停舊位置、載入清暫態；其他panel／音檔保留，optional理由不改必填，待辦零仍須完整時間／影格／連戲驗證。
- 244Python／353JS／四Skill／25JS語法、3新Python／17新JS、59真Node／Python與27IAB、四adapter／五native下載／真draft3、Agent17鏡102待辦／390px Enter與晚回應保護通過。前版v0.27 ZIP241／336還原，restore-v0.27.0-before-v0.28.0保留起點；精確commit封裝／privatePR／Release／遠端bytes依收據。
- 產品0.28，protocol／schema及七／十二工具保持，無新operation／依賴／模型／production／auth。非商用／private／ZOE. G保持；最新三版與確定PID／outputs盤點，合格舊產物才清理。正式媒體／完整視覺／Host／FreeTWAI及原生file仍待，rolling active。

## v0.27.0 — 2026-10-04

- 真IAB重現60秒宣告新增鏡頭後被改30秒；新增／刪除鏡頭保留宣告，原有有效時間收合與刪除還原保持。
- 新storyboard-duration純proposal／compare／注入controller與DOM分層，重用影格層；完整時間與影格覆蓋才提供候選，明確接續／只撤回總長，不捨入原秒數、不更改創作或音檔。
- 採用前核對同一顯示來源，撤回核對原始時間／列身份／順序／數量／FPS與實際after；後續文字保留，載入新內容清除暫態。處理中停用操作，晚回應保留編修。
- 241Python／336JS／四Skill／24JS語法、2新Python／15新JS、60跨語言與25真IAB、四adapter／五檔native下載／真draft3／390px Enter通過；v0.26 ZIP239／321還原，restore-v0.26.0-before-v0.27.0保留起點，精確commit ZIP／privatePR／Release與遠端bytes依收據。
- 產品0.27；各protocol／schema與七／十二tools、ZOE. G／PolyForm非商用／private保持。沒有依賴／模型／auth／production。每輪盤點確定PID及outputs，最新三版SHA核對，合格舊產物才清理。正式媒體／完整視覺／Host／FreeTWAI／原生file仍待，rolling active。

## v0.26.0 — 2026-10-04

- 真IAB與實際 application 重現同名80 BPM回應可覆蓋120 BPM需求，以及有前後空白的歌名被拒絕；Python歌曲標題改用清理後brief，原檔／表單保留。
- 新planning-source純需求／主要JSON核對與planning-review checkedResult／checkedBrief分層，建立及Agent需求回讀共用。歌曲段落／原歌詞／清單／提醒及分鏡所有鏡頭／母題／影格／連戲核對，單份JSON8MiB嚴格解碼。
- 物件鍵順序可不同，原始型別／陣列順序保持；Python文字／數字空白分開，numeric bool／null不猜預設，數字母題與__proto__保持資料。歌曲時間先查毫秒精度再查半毫秒界，拒絕0.0004秒偏移。CSV／Markdown未在瀏覽器逐字重建，本輪九個真實檔案全文與四adapter核對。
- 新核對提示在編修後明示上一份需求，停用舊成果下載；晚成功／500保護、原生音檔、預覽／明確限定載入／撤回及草稿保持。產品0.26，各protocol／schema與七／十二tools不變。
- 239Python／321JS／四Skill／23JS語法、5新Python／16新JS、60組跨語言、28真IAB／九個下載與draft3／390px Enter通過。v0.25 ZIP234／305還原，restore-v0.25.0-before-v0.26.0保留起點；精確commit封裝、privatePR／Release及遠端bytes以manifest收據核對。
- 不新增依賴、模型、auth或production變更。非商用／ZOE. G／private保持；完整視覺／正式媒體／指定AgentHost／FreeTWAI與原生file:離線仍未驗，滾動目標active。每輪只盤點自有PID與outputs、保留最新三版，合格舊產物才清理。

## v0.25.0 — 2026-10-04

- 真IAB重現未完成表格只有泛用數字錯誤，focus停在建立；新增可定位校時進度／待辦與建立前標示，原句號／欄位保持。
- lyrics_review.py純diagnostics與sharedJS／reply核對／注入controller／DOM分層；暫排序與最遠end跨句檢查、不改source／空白／文字／音檔。局部timed_rows不是全表通過，空表明示no_cues。
- 新唯讀lyrics_review schema1／四adapter，七基本與啟庫十二tools、無路徑權限。CLI0／2／1區分無問題、待修正報告已保存與request／I/O失敗；完整lyrics另驗證，所有diagnostics needs_review=true。
- 10000列全計數、report前200／DOM前20與截斷，變更後舊report過期／停定位與下載。產品0.25、其他protocol／schema保持，真草稿保存空白及後續編修，不存報告暫態。
- 234Python／305JS／四Skill／22JS語法、13新Python／16新JS、50組跨語言與21真IAB、四adapter／真下載／晚成功／500／schema999／390px與Enter通過。v0.24 ZIP221／289還原，restore-v0.24.0-before-v0.25.0保留起點；指定commit封裝／privatePR／Release與遠端bytes依manifest收據確認。
- 非商用／private／ZOE. G與來源保持；無新依賴、模型或auth。file:既有政策阻擋未繞過，本輪獨立頁未變更；原生離線播放／正式媒體／完整視覺／AgentHost／平台創始人核實仍待，滾動目標active。

## v0.24.0 — 2026-10-03

- 真IAB重現已有10秒歌詞包選4秒WAV後被metadata覆寫；修正為兩時長分開顯示，明確採用／撤回只改宣告，原本空白且未編修才接續首次有效時長。
- 共用lyrics-media純compare／mediaTime與注入controller；原native來源、修訂與actual after核對，換來源或後續時長編修拒絕不安全撤回，後續歌詞文字保持。
- 獨立HTML嵌入同模組，Apply只取明確欄位或沿用來源、不直接用player.duration；較短總長不裁切cue，review_notes歷史保持。媒體與undo不進draft3／Agent。
- 初次nativeUI發現defer模組遺漏，修正實際script與HTTP順序回歸後全新tab20項驗證。221Python／289JS／四Skill／21JS語法與diff通過；真正四adapter與實檔、current500／晚成功／晚500、草稿回讀、390px／Enter通過。
- v0.23 ZIP217／263還原通過；restore-v0.23.0-before-v0.24.0保留起點，指定提交封裝／privatePR／Release與遠端下載以manifest收據確認。產品0.24、protocol／schema／六與十一工具保持。
- file:離線原生驗證被browser工具安全政策拒絕，只有source受控VM，本輪離線播放／下載與完整視覺未驗證；無繞過／新依賴。非商用／署名／private與使用者來源保持，滾動目標active。

## v0.23.0 — 2026-10-03

- 重現1 ms內秒數容差跨半幀而接受重疊、空缺、尾端不符；完成分鏡在輸出前核對由0到總長的精確排他影格覆蓋，不改原秒數或FPS。
- 純Python／JS影格映射與完成報告驗證分層，共用seed；保留最近整數／半幀取偶數，JS拒絕先前半幀容差內的另一個整數。
- frame_timeline獨立schema1與discovery descriptor；摘要、每鏡範圍與提示稿增加幀數。舊有效報告明示未宣告，現代缺失／未知schema／矛盾資料拒絕且保留上一份成果。
- 真下載重現草稿tool_version仍為0.21.0，修正為0.23.0並核對實際captureDraft與application版本，draft3與舊有效草稿保持。
- 217Python／263JS、四Skill／20JS語法及diff、20項IAB／四入口／實檔／390px與Enter通過；17新Python／16新JS。v0.22 ZIP還原200／247通過，指定提交封裝／private PR／Release與遠端下載由manifest及收據確認。
- restore-v0.22.0-before-v0.23.0保留起點。Agent／MCP／各既有schema與六／十一工具不變；非商用、署名、private及使用者來源保持。影格覆蓋不代表實際媒體／視覺驗收，目標active。

## v0.22.0 — 2026-10-03

- 交付檢查新增獨立LUFS整合響度。純loudness.py負責K-weighting、400ms／100ms nearest-sample幀與−70 LUFS／−10 LU gate；loudness_blocks.py有界64KiB後轉暫存，成功／失敗均關閉。audio.py在同一音檔副本的一次PCM掃描整合，無FFmpeg執行或新依賴。
- mono／stereo、8000–192000Hz、至少400ms；反相聲道能量相加。短檔／門檻下／未知layout／範圍外rate為null及明確status，不改PCM技術接受／警告／退出碼。
- report與discovery新增獨立audio_loudness schema1，產品0.22.0；既有protocol／草稿／保存schema與六／十一工具保持。純JS核對未知版本、數值、來源幀／時長／聲道權重／區塊／尾幀／門檻，舊無量測報告明示未提供。DOM分開RMS／peak／LUFS，保持late File／profile保護與keyboard。
- 200Python／247JS、四Skill／19JS語法及diff通過；18新Python／10新JS，舊HTTP retention版本斷言改比對實際產品。四adapter一致、ledger溢存／close、來源替換／gate／邊界／奇數rate測試通過。
- 20組合成WAV與既有FFmpeg7.1校對最大0.009464 LU（容差0.02）；26真報告JS模型，30秒stereo實際5.607秒。24項IAB含不可測、反相、四秒晚成功／500、schema999、有效復原、實檔JSON／MD、390px與Enter。有限校對不宣稱完整ITU／EBU認證或正式實聽。
- 前版v0.21 ZIP182／237還原通過，restore-v0.21.0-before-v0.22.0保留起點。指定提交封裝／private PR／Release與遠端bytes以manifest／收據確認；授權／署名／private與使用者素材保持。

## v0.21.0 — 2026-10-03

- 真瀏覽器重現重新整理直接丟失歌名編修。新增上方另存狀態及有未另存草稿時才註冊的 beforeunload；原生點擊後實際觸發提醒／closed(false)，編修保留。沒有互動時 IAB 省略提醒並重新整理，明確列為瀏覽器限制。
- draft-retention.js 純 checkpoint 與注入事件 controller 分層，共用既有 panel fingerprint；比較原始範例與各來源最近一次確認的完整內容。逐字編修只 capturePanel，離頁重查全草稿；時間戳、頁面、收合、媒體及成果不進狀態或持久 schema。
- 保存 callback 提供隔離的按下當時 draft，不冒用晚到期間的編修。未知保存、放棄、送出下載不能解除提醒；下載須明確確認本機檔。已驗證現代草稿／保存版本在明確載入後記錄，legacy 轉換仍需另存。
- 範例啟動回應晚到保留既有編修；三種草稿／成果表單改同源 hidden iframe，下載不導離編修頁。狀態可換行、色彩與文字共同提示，確認按鈕可 Enter 操作。
- 182 Python／237 JS、四 Skill／19 JS 語法與 diff 通過；兩新 Python／17 新 JS，舊 seed fixture 注入實際 retention controller，原來成果 dirty 規則保持。29 項 IAB 包含真 Agent 保存／讀取／載入、四秒成功／500、原生下載／讀回／確認、撤回、四工作台、PCM 與 390px。
- 前版 v0.20 ZIP 還原 180／220 通過；restore-v0.20.0-before-v0.21.0 保留 main 起點。產品0.21.0，所有 protocol／領域 schema 與六／十一工具保持；無新依賴或模型、授權／署名／private 保持。

## v0.20.0 — 2026-10-03

- 重現需求無效UTF-8被File.text替換「�」後仍接受，以及Agent／CLI／草稿重複版本或title被默默採用最後一個值。改為嚴格UTF-8與重複JSON欄位拒絕，原檔與工作台保持。
- 新增純json_document.py與原生json-document.js。統一重複鍵、跳脫同名、非有限數字、Unicode、bytes與64層；Python iterator traversal額外記憶體只隨深度增加，沒有第三方依賴。
- 外部CLI／HTTP／JSON-lines／MCP、草稿庫／備份、歌詞包共用Python decoder；需求／分鏡起稿／草稿選檔改原生arrayBuffer、核對File.size，保留讀取前snapshot／latest／晚回應與明確預覽。工作台與離線歌詞共用同一JS模組，discovery提供JSON讀取限制。
- 180Python／220JS、四Skill／十八JS語法及diff；12新Python／14新JS測試包含跨語言語料、原生File、真CLI另一cwd／BOM／覆寫拒絕、真HTTP與stdio壞後好。31項IAB含真正Agent／MCP／CLI產物、音檔保持、損壞資料拒絕、4秒成功／500、下載／讀回與390px／Enter。
- 前版v0.19 ZIP安全還原168／206；restore-v0.19.0-before-v0.20.0保留main起點。產品0.20.0，Agent1／MCP2025-11-25／draft3／兩seed1／lyrics_package1／library1／backup1及六／十一工具保持。ZOE. G／非商用／private保持。

## v0.19.0 — 2026-10-03

- 修正完整歌詞 JSON 回讀丟失名稱、總長及推估來源；兩秒歌詞後的十秒音樂尾奏保持，未知包版本不再被抽取 cues 後默默接受。
- 新增純 Python lyrics_package 與共用原生 lyrics-package.js；schema 1、嚴格 UTF-8／重複欄位／有限數字／毫秒／來源一致性／2 MiB。application 與 CLI／HTTP／JSON-lines／MCP 使用同一檢查；完整包、一般字幕與 cues 互斥。
- 工作台及離線預覽共享明確編修提案，保留未改動的推估／校時來源，音檔更新總長後仍提示曾補齊的結束；編修加待核對說明。舊完整包須明確轉換，時長衝突拒絕，估計值不寫入時長欄。
- 168 Python／206 JavaScript、四 Skill／十七 JS 語法及 diff；26 項 IAB 操作、真正四 adapter、實檔 JSON／草稿回讀、4秒晚成功／500、390px DOM／Enter。測試的備份競爭斷言僅排除暫態 .write-lock bytes，版本與完整資料核對保持，生產鎖未修改。
- 前版 v0.18 精確 ZIP 安全還原156／189；restore-v0.18.0-before-v0.19.0保留main起點。產品0.19.0／歌詞包1獨立，Agent1／MCP2025-11-25／draft3／兩seed1／library1／backup1與六／十一工具保持。沒有新依賴或host安裝，ZOE. G／非商用／private保持。

## v0.18.0 — 2026-10-03

- 修正歌詞檔慢讀取完成後覆蓋手動原文；帶時間歌詞不再一按讀取就替換表格。TXT／LRC／SRT／JSON統一先檢查／預覽，再明確套用／取消與限定撤回。
- 新增純前端lyrics-import層，原生arrayBuffer與嚴格UTF-8解碼、BOM／大小檢查、目標snapshot／最新序列、回應與JSON成果一致性；原文、時長、音檔及其他工作台保護。取代舊File.text adapter；HTTP只新增靜態模組，既有application與四adapter共用。
- TXT接既有lyrics_seed1，原文／重複句／空白保留、時間留白，草稿仍schema3／.json。SRT多行與LRC推測結束告知，預覽前六句但套用不截短。
- 156 Python／189 JavaScript、四Skill／十六JS語法通過；26新增JS覆蓋舊五項adapter測試並擴充實際DOM handler／慢讀取／晚成功錯誤／最新檔／取消／clone／回應矛盾／限定undo。真正CLI／JSON-lines／MCP產物、IAB選檔／三格式下載／草稿及手機DOM驗證見QA。
- 前版v0.17 ZIP安全還原156／168通過；restore-v0.17.0-before-v0.18.0保留main起點。產品0.18.0，Agent1／MCP2025-11-25／draft3／lyrics seed1／storyboard seed1／library1／backup1保持，六／十一工具，無新依賴或host安裝。ZOE. G、非商用授權與private保持。

## v0.17.0 — 2026-10-03

- 新增未校時歌詞起稿／JSON檢查：共用Python domain與application、CLI／HTTP／JSON-lines／MCP；原文、重複句、前後空白及來源行號保留，不猜測時間。獨立lyrics seed schema1，未知／矛盾資料拒絕。
- 新增純lyrics-seed preview／proposal：來源與目標核對、晚成功／錯誤保護、取消／明確限定套用及撤回；音檔、時長與其他工作台保留，草稿仍schema3。
- 修正空白句子不能記下播放位置：分別記下開始／結束、保留句長的整句移動及超音檔拒絕；已校時句子可播放顯示，未完成時間禁止匯出。
- 156 Python／168 JavaScript、四Skill／十五JS語法；真正CLI／HTTP／JSON-lines／MCP、IAB預覽／guard／校時／三格式實檔／草稿往返／390px DOM與Enter焦點。前版ZIP安全還原146／146通過。
- 產品0.17.0，Agent1／MCP2025-11-25／draft3／storyboard seed1／library1／backup1保持，六／十一工具。ZOE. G、非商用授權與private保持；restore-v0.16.0-before-v0.17.0提供還原點。

## v0.16.0 — 2026-10-03

- 重現並修正需求／保存版本預覽後覆蓋編修；新格式草稿由選檔即載入改為明確預覽／載入／取消，舊版維持明確轉換。
- replacement-preview純模組共用scope／全panels內容指紋、原生File身份及最新任務／payload複製。需求只核對目標，完整草稿／保存版另核對音檔選擇；晚成功／錯誤及proposal都保護目前編修。
- brief及library transport可注入同一preview；app只管理DOM、明確操作及既有undo，沒有新後端寫入能力／依賴／Host設定。草稿加入BOM／副檔名／1 byte–1 MiB界限及讀取狀態，正常預覽使用中性色與有界文字區。
- 146 Python／146 JavaScript、四Skill／十三JS語法通過；真實Agent保存、HTTP assets、瀏覽器載入／撤回／音檔／延遲／錯誤及封裝見QA／HANDOFF。前版ZIP146／121通過。
- 產品0.16.0；Agent1／seed1／MCP2025-11-25／draft3／library1／backup1保留。ZOE. G、PolyForm Noncommercial 1.0.0與private保持；restore-v0.15.0-before-v0.16.0提供還原點。

## v0.15.0 — 2026-10-03

- 補齊Agent／CLI的storyboard-seed.json回讀入口；先檢查／預覽／取消，再明確套用至分鏡。匯入與目前歌曲分開，套用保留其他工作台、音檔與目前歌曲，新鏡頭仍需人工創作。
- 共用timing_slots與validate_seed；完整schema1形狀、固定BPM來源毫秒／影格／小節／任務一致，未知版本與延伸欄位拒絕，不靜默丟失已加的畫面或修正時間。CLI --seed與--brief互斥，匯入不接受FPS／每鏡小節覆蓋。
- 原storyboard_seed operation新增互斥seed payload，HTTP／JSON-lines／MCP共用，discovery公布完整schema；預設五／啟庫十工具保持。
- 純前端file read／request／proposal共享latest token，匯入核對目標分鏡與檔案語義相等；共用run可指定revision scope，歌曲編修不使外部起稿失效。已檢查檔案成果標為inputIndependent，切換頁面保持；生成型成果仍須輸入修改後重新驗證。
- 146 Python／121 JavaScript／四Skill／十二JS語法與diff、真正CLI／HTTP／JSON-lines／MCP、實際起稿讀回／檔案下載／未覆蓋編修／取消與錯誤、前版ZIP136／109通過，詳見docs/QA-v0.15.0.md。
- 產品0.15.0；seed1／Agent1／MCP2025-11-25／draft3／library1／backup1保留。private／ZOE. G／PolyForm Noncommercial1.0.0保持；沒有模型、依賴、host或其他使用者專案參考。restore-v0.14.0-before-v0.15.0及封裝／private PR／Release見HANDOFF／manifest。

## v0.14.0 — 2026-10-03

- 新增 `storyboard_seed` 共用領域與應用入口：驗證現代歌曲需求，按整小節與段落邊界分鏡；最多 1000 鏡，不足一影格拒絕。獨立起稿 schema 1／兩份中間檔，固定速度估算與創作未完成清楚標示，不捏造畫面。
- CLI `storyboard-seed`、HTTP `/api/storyboard-seed`、JSON-lines／MCP `storyboard_seed` 共用結果與 discovery schema；預設五工具／啟庫十工具，四個專案保留。
- 純前端模型驗版本／來源／時間／影格／小節與成果一致；preview token、來源／目標／設定快照保護晚回應與套用。明確套用只替換分鏡標題／時長／FPS／鏡頭，其他資料與音檔保留，創作欄位留空。
- 修正需求、完整草稿與保存版本「撤回載入」覆蓋後續編修；純 undo 快照核對目標 panel／全部 panels，衝突保留內容與撤回紀錄。不把 transient tab／timestamp 當內容改動。
- 136 Python／109 JavaScript／四 Skill／十二 JS 語法及 diff；實際瀏覽器起稿／取消／錯誤／過期回應／撤回保護／下載／草稿往返／校時音檔保留／390px DOM／鍵盤通過。前版 v0.13 ZIP 124／93通過，細節見 docs/QA-v0.14.0.md。
- 產品 0.14.0；Agent1／MCP2025-11-25／draft3／library1／backup1保留。PolyForm Noncommercial1.0.0／ZOE. G／Codex、private／未投稿保持；沒有新依賴、模型、host、秘密或其他使用者專案參考。restore-v0.13.0-before-v0.14.0與本輪交接見HANDOFF／manifest。

## v0.13.0 — 2026-10-03

- 歌曲與分鏡透過純 planning-review 接收當前回應，編修後晚成功不替換；共用 run 捨棄過期錯誤並恢復控制。目前錯誤仍顯示，修正後可再建立。
- 摘要明確呈現設計資料與上一份狀態；歌曲總小節、BPM／拍數、記憶點與可收合能量／任務，分鏡逐鏡提醒／母題位置，沒有媒體生成宣稱。自由文字用 textContent。
- 修正 1280×720 sticky 成果面板高於畫面、下載按鈕在畫面外；桌面高度限制與局部捲動，Tab／PageDown 可操作，窄螢幕保持 static 流。
- 產品 0.13.0；Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 保持，沒有領域、輸出 schema、工具、模型、依賴或 host 新增。PolyForm Noncommercial 1.0.0 與 ZOE. G／Codex 紀錄保留。
- 124 Python／93 JavaScript／四 Skill／十 JS 語法與 diff、真正 CLI／三 transport、IAB 兩個工作台延遲成功／錯誤、目前錯誤保留／修正、提醒／文字安全、實檔下載、短高度滑鼠／鍵盤及390px DOM通過；v0.12 ZIP 解壓124／80通過。詳見 docs/QA-v0.13.0.md。
- restore-v0.12.0-before-v0.13.0、指定提交封裝／private PR／Release 見 HANDOFF／manifest；前輪交接存 docs/HANDOFF-v0.12.0.md。完整視覺／實唱實聽／特定 host／平台創始人未驗證。

## v0.12.0 — 2026-10-03

- 開檔一次的自有音檔副本，SHA-256 與量測使用同份 bytes；新增 source_evidence，所有出口關閉暫存。不代表外部改檔原子快照。
- 拒絕不一致 PCM fmt／截斷標頭，多聲道不解讀位置並列提醒。Markdown 補接受條件／副本範圍。
- 純 audio-review 模型與非同步選擇保護，晚到成功／錯誤不覆蓋；上一份報告與停用下載清楚呈現。補來源、逐項條件、尾安靜段／DC／−∞及不可測。
- 產品 0.12.0；Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 保持。沒有新依賴／工具／模型／host；署名及 PolyForm Noncommercial 1.0.0 保留。
- 124 Python／80 JavaScript／四 Skill／九 JS 語法與 diff、真正 CLI／三 transport、IAB 正常／錯誤／晚回應／實檔下載／桌面與390px DOM／鍵盤通過；v0.11 ZIP 解壓112／69通過。詳見 docs/QA-v0.12.0.md。
- restore-v0.11.0-before-v0.12.0、指定提交封裝與 private PR／Release 見 HANDOFF／manifest；前輪交接存 docs/HANDOFF-v0.11.0.md。完整視覺／實聽／特定 host／平台創始人未驗證。

## v0.11.0 — 2026-10-03

- 加入整批歌詞校時的預覽／明確套用／一次撤回；只改 start／end，音檔、後續文字與刪除歷史保留。其他時間改動／增刪句子阻止整份撤回；過期候選／晚回應不寫入。
- 共用 application 的 shift_seconds／time_changes／text_changes，CLI 不另編修。sorted original 1-based index、先 shift 再 set（保留明確句長）／text，再推缺失結束／完整驗證；非法結果不截斷，原來源與指定總長保留。
- 分離 Python lyric_timing、原生 lyric-time.js、離線 lyric_preview 及前端 lyrics-timing controller。half-away-from-zero 至毫秒；修正負的不足半毫秒被接受／跨語言捨入不一致、離線提示／timing 過期與結果排序後句子 ID 錯配。模板標記只替換一次，輸入標記文字保持原樣。
- Agent discovery 同源新增欄位；非零校時／非空編修標 needs_review。產品 0.11.0，預設四工具／啟庫九工具、Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 不變，暫態控制／撤回不進草稿。
- 112 Python／69 JavaScript／四 Skill／八 JS 語法／diff、實際 transport／CLI、IAB 工作台與獨立實檔下載、桌面／390px DOM 檢查通過；v0.10 ZIP 摘要核對／原版 99／55 通過。詳見 docs/QA-v0.11.0.md。
- PolyForm Noncommercial 1.0.0／LICENSE／NOTICE 保留，沒有依賴／host／模型新增。restore-v0.10.0-before-v0.11.0、指定提交封裝與 private PR／Release 見 HANDOFF.md／manifest。




## v0.10.0 — 2026-10-03

- 加入整庫／明確選 ID 的可攜 ZIP 備份、整份檢查／衝突預覽／恢復。保留原 ID、metadata、名稱、時間與草稿原始 bytes，只新增／重用完整相同版本，既有版本不覆寫。
- 分離 library_contract、draft_backup、CLI backup_files、HTTP backup_downloads 及前端 backup-transfer；HTTP／CLI／Agent 共用 application 與純驗證／保存層。backup schema 1／library 1／draft 3 分別管理，未知版拒絕。
- 限制 ZIP 32 MiB／展開 64 MiB／1000 版，核對中央目錄、檔名、型態、索引、大小與 SHA；不 extractall，整份有錯不略過。恢復前、鎖內重查衝突／容量；磁碟故障可能留下完整部分版本，同一 ZIP 重試補完，不宣稱多目錄交易。
- 工作台加入下載、選 ZIP、唯讀預覽與明確恢復；保留未保存編修、音檔及刪除紀錄。回應未知時保持同一 File／SHA 重試；已知失敗要求重選。Agent 啟動明確 --draft-backup，JSON 不能改來源路徑；明確啟庫共九工具，預設仍四工具。
- 修正可重現的損壞 DEFLATE 未處理例外，HTTP 回 400 且工作台保留。下載先驗證再原生 attachment，錯誤不導離主頁。最多兩份／60 秒的下載暫存，取完即清除自有檔與空目錄，不依賴終端強制停止時的 finally。
- 99 Python／55 JavaScript／四 Skill／六 JS 語法與實際瀏覽器備份、已提交後 500 再試、衝突／毀損保留、重啟、原始 bytes 往返、桌面／390px DOM 檢查通過。v0.9 ZIP 核對／解壓原版 77／47 通過。詳細見 docs/QA-v0.10.0.md。
- 產品 0.10.0，Agent 1／MCP 2025-11-25／草稿 3 不變。PolyForm Noncommercial 1.0.0／LICENSE／NOTICE 保留；無新依賴／host 安裝／模型呼叫。分支 codex/iteration-v0.10.0，還原點 restore-v0.9.0-before-v0.10.0，指定提交封裝與 private PR／Release 見 HANDOFF.md／manifest。


## v0.9.0 — 2026-10-03

- 新增明確啟用的本機草稿庫，選定目錄後 HTTP／CLI／JSON-lines／MCP 共用 application 與不可覆寫版本保存；預設接口仍無草稿寫入。分頁與摘要核對、1 MiB／1000 版上限、失敗 staged 檔清理及程序間短時鎖獨立於領域計算。
- 草稿 v3 結構改由 contracts/draft-v3.json 共用，Python／瀏覽器／Agent schema 同源，允許未完成的原始字串；保存紀錄 schema 1 另行管理，未知版本拒絕。
- 加入命名保存、保存版本清單、預覽／下載／明確載入／撤回；保存或預覽不重設音檔。未知保存結果保留點擊時的 ID／內容重試，晚編修保留並提示未保存，放棄重試不刪除磁碟版本。
- 修正 Windows 目錄別名使同 ID 並行保存遭誤拒絕；改比對實際檔案系統身分。程序間鎖使容量檢查與發布在同一界線，四程序競爭一版容量的測試通過。
- 草稿 CLI 明確輸出 UTF-8 JSON，避免終端編碼無法表示原創名稱／表情符號時，檔案已保存但回應失敗；以強制 ASCII 終端的實際子程序驗證。
- 77 Python／47 JavaScript、真實三種 transport／CLI、瀏覽器回應失敗重試、重啟、Agent 保存／23 版分頁、實檔下載與毀損保留測試；v0.8 封裝核對／解壓 62／38 通過。詳細 QA、四 Skill 與封裝結果見 docs/QA-v0.9.0.md／manifest。
- 產品 0.9.0，Agent 1／MCP 2025-11-25／草稿 3 不變；授權保持 PolyForm Noncommercial 1.0.0，沒有依賴或 host 安裝。還原點 restore-v0.8.0-before-v0.9.0，交接及 private PR／Release 見 HANDOFF.md。

## v0.8.0 — 2026-10-03

- 加入獨立 deletion-history 層與集合 adapter，六種列可選擇刪除紀錄還原，每工作台最多 20 筆；穩定頁內 ID、插入錨點、原始字串及分鏡自動時間副作用分開，不覆蓋後續其他編修／音檔。
- 母題 ID 在可還原期間保留；容量拒絕不丟紀錄，可刪除另一列後選原紀錄。刪除／還原重新編號及定位，未完成歌曲／歌詞可新增並保存原始空白。
- 修正歌詞匯入／驗證晚回應覆蓋後續表格編修；revision 在替換前檢查，其他工作台修改不受影響。
- 62 Python／38 JavaScript／四 Skill、實際下載回讀、音檔保留、滿容量／20 筆上限、延遲回應及窄螢幕 DOM 驗證通過。前版 v0.7 解壓 62／24 通過。
- 產品 0.8.0，Agent 1／MCP 2025-11-25／草稿 3 不變；授權保持 PolyForm Noncommercial 1.0.0，沒有新依賴／host 安裝／模型呼叫。
- 還原點 restore-v0.7.0-before-v0.8.0；指定提交封裝、private PR／Release，見 HANDOFF.md、docs/QA-v0.8.0.md。

## v0.7.0 — 2026-10-03

- 四工具完整的輸入／成功成果 schema 移至獨立 tool_contracts 層，MCP 與共用 capabilities 使用相同契約，明確描述現代／舊版條件、創作語言、需求清單與母題欄位。
- 修正歌詞同時傳 cues 與 content／suffix 時原文被忽略；改成明確拒絕，保留單一來源的流程。
- 修正音訊接受條件把 true 當 1、接受非整數及錯誤型態進入開檔的問題；開檔前驗證，JSON 整數值 1.0 正規化為 1。
- MCP 非物件 arguments 回協定錯誤；領域／payload 錯誤保留可重試工具結果。後續呼叫仍正常。
- 清單錯誤在項目旁顯示，定位焦點與讀屏關聯；空交付清單定位新增按鈕，修正／回讀／撤回後清除舊標示。
- 62 Python／24 JavaScript／四 Skill、八 schema meta-schema／七次 stdio 四工具核對、實際下載／窄螢幕／前版解壓還原通過。沒有新依賴／特定 host 安裝／模型呼叫；授權保留。
- 還原點 restore-v0.6.0-before-v0.7.0，指定提交封裝、private PR／Release；詳見 HANDOFF.md、docs/QA-v0.7.0.md。

## v0.6.0 — 2026-10-03

- 歌曲語言、避免事項與交付項目改成可編修清單；多行項目完整保存。草稿 schema 升為 3，v1／v2 需先看摘要、明確轉換，可撤回，原檔保留。
- 工作台回讀 Agent／CLI 的設計 brief：指定歌曲或分鏡、共用應用層檢查、完整預覽／創作待審查提醒、明確載入，只替換選定工作台；限定撤回保留其他工作台後續編修與已選音檔。
- 新增 planning-import.js 純轉換／讀取控制層；未知欄位、不可保存的畫幅／清單拒絕，過期讀取或驗證結果不改預覽。業務檢查仍由 application.build 執行。
- 修正 SRT 明確結束時間被提示為尾句估計；新增 timing 來源 metadata，duration_estimated 仍表示總時長未提供，Agent／MCP 協定不變。
- 封裝發現所有 test_*.js 並檢查新 JS 模組；新增跨 Python／生產 JS 往返、v3／舊版轉換、讀取競態與需求保存測試。
- v0.5 封裝核對 SHA-256、解壓通過原版 53 Python／13 JavaScript。LICENSE／NOTICE 不變，沒有新增 runtime 依賴或參考其他個人專案。

## v0.5.0 — 2026-10-03

- 修正歌詞檔非同步覆蓋：最後一次選檔才提交原文／格式，過期結果及錯誤忽略；手動修改／草稿回讀／離開頁面取消待完成讀取。限制 2 MiB 與 LRC／SRT／JSON。
- 修正失敗選檔使有效成果失效的 input 事件冒泡；只有成功讀入新內容才標記須重建。
- 分鏡加入逐鏡收合、時間／段落／母題摘要與固定定位列，預設只展開第一鏡；編修資料完整保留，缺時間／母題自動展開定位。顯示控制不影響成果有效性。
- 新增無依賴啟動設定產生器，輸出當前 Python 與本版入口的 JSON／Codex TOML；不同目錄的實際 MCP 子程序測試及 Codex 設定解析通過，未安裝或宣稱實際 Agent host 接入。
- 保留產品／Agent／MCP／草稿版本分層，本輪僅產品升為 0.5.0；前輪交接另存，v0.4 封裝核對摘要並還原通過原版 52 Python／8 JavaScript 測試。
- 授權維持 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 不變；沒有新增依賴或使用其他個人作品。

## v0.4.0 — 2026-10-03

- 分鏡介面支援最多 30 個母題與逐鏡選擇；穩定 ID 避免改名破壞對應，仍被鏡頭使用時拒絕刪除。
- 草稿 schema 升為 v2。v1 經格式檢查後展示轉換摘要，按明確按鈕才轉換／載入；未知版本拒絕，原檔保留，最近一次載入可撤回。
- 修正時間空白時無法刪除問題鏡頭；只在剩餘鏡頭時間有效時重新接續。
- 加入無依賴 MCP stdio adapter，明確支援 2025-11-25、四個工具、文字／結構化成果及兩類錯誤。保留 Agent JSON-lines v1，全部共用 application 層。
- 修正過深 JSON 導致 HTTP 連線被關閉；回傳 400，正常下一次請求仍可使用。
- 封裝增加 MCP 檔案及包內握手／版本一致性驗證；保留 v0.3 交接及還原點。
- 授權仍為 PolyForm Noncommercial 1.0.0；沒有新增依賴、讀取其他作品或對外部署。

## v0.3.0 — 2026-10-01

- HTTP、CLI 與 Agent 共用 application 層；保留 v0.1／v0.2 需求相容。
- 加入 Agent JSON-lines v1：四種 operation、能力查詢、id、結構化錯誤；明確選定音檔，不自動寫檔。
- 修正刪除／修改歌詞後播放預覽使用舊資料，以及舊音檔解碼覆寫最新波形的競態。
- 加入專案草稿 v1 的實際下載、回讀與表單撤回。未知／錯誤版本不替換目前內容；回讀後需重新建立成果。
- 草稿操作列、授權條文與來源通知可由介面查看。
- 依使用者最新選擇加入 PolyForm Noncommercial 1.0.0，取代先前提出的 AGPL；未改寫 v0.2.0 tag。
- 加入指定 commit 封裝、ZIP 完整性／SHA-256 與解壓後驗證腳本；分支與還原方式見 docs/ARCHITECTURE.md。

## v0.2.0 — 2026-10-01

第一版四工作台、原創 Skill、35 項 Python 測試與 private GitHub 上傳。Release tag 保留首次發起與 AI 協作紀錄；未附開源授權、未送出自由工坊投稿。


### v0.36 封裝驗證修復

完整Python套件含Git／Windows實體fixture，舊60秒deadline於指定commit封裝實跑不足。只將封裝Python套件deadline明確設為120秒，其他command保留60秒；caller bounded wait仍最多60秒。失敗artifact保留，新commit另建不可覆寫封裝；暫存解壓位置先驗證系統temp parent。
