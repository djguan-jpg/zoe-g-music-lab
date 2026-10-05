# 本機 Agent 接口 v1

v0.89 範例載入保護：app refreshExampleControls DOM adapter只讀state.busy/examples與兩固定button；exampleAllowed在load/clear/dirty/render之前拒絕busy或null。初始HTML disabled、startup首/finally與共用run的timingControls沿既有成功/失敗/過期釋放；不新增獨立timer。晚到startup只有idle且retention.atInitial才套用，busy不重寫進度；後續編修保持。明確idle範例仍只替換對應panel及清除其history，不冒充保存/撤回。15/22、Agent1/draft3及domain保持，無新asset/route/operation/schema/依賴/權限。產品89/来源38–89共52/unknown90，legal4/private/not_submitted保持，見[契約](EXAMPLE-AVAILABILITY.md)。

v0.88 共用清單busy：collections固定add/remove metadata→app refreshCollectionControls DOM adapter；四新增入口在capture/ID/write/dirty/focus前以既有state.busy拒絕。六add/指定remove/三台還原select與button沿run timingControls/finally切換；不讀來源或重建選單，較早選擇與歷史保持。原欄位編修沿revision/current及dirty保護；纯domain/History/controller保持，無新asset/HTTP/CLI/Agent/MCP operation/schema/權限。15/22、Agent1/draft3保持；產品88/來源38–88共51/unknown89，legal4/private/not_submitted保持。見[契約](COLLECTION-BUSY.md)。

v0.87 刪除鏡頭保留原時間：共用純History.remove/restore保留stable ID與原值→app原生entriesFor/writeEntries→限定markDirty與editor-focus。刪除只取remaining/record，不呼叫compactShotTimes或生成effects；保留既有純工具與歷史格式相容。原缺口/負值/極短秒數交由現有純時間診斷與完整domain驗證；CLI/Agent/MCP/HTTP皆共用application，無新operation/schema/asset/權限。15/22、Agent1/draft3保持；產品87/明確来源38–87共50/unknown88，legal4/private/not_submitted保持。見[契約](STORYBOARD-DELETION.md)。

v0.86 完整原文核對：text-verification.js純原文UTF-8與選定bytes模型（8MiB、本機view1）→text-verification-controller.js注入capture/describe/readFile與latest/current/大小保護→text-verification-dom.js原生File/arrayBuffer/literal status→app state.textVerification與canonical state.files。refresh只取字串/metadata，不編碼全文；明確選檔才有界讀取。三固定靜態JS，沒有POST或CLI/Agent/MCP操作，沒有新增領域schema/路徑/網路/寫檔權限。15/22、Agent1/draft3與既有schema保持；核對不解草稿另存提示，不進保存/備份。產品86/明確來源38–86共49/unknown87，legal4/private/not_submitted保持。見[契約](TEXT-VERIFICATION.md)。

v0.85 原句搜尋：獨立search1，texts原順序/Unicode/重複句、10000列/每句2000codepoints/compact UTF8 array2MiB/query1024bytes/1–50結果。prefix+array SHA只pin文字，start_row>1必須前次SHA。Python/JS純層→application四adapter；browser injected generation/current完整texts+IDs/query/results revision→complete reply data/JSON/MD/meta核對→literal DOM→原生穩定ID文字欄focus。query/results/pager不進draft3，不因播放tick掃整表；時間編修與音檔保持。新增CLI lyrics-search、Agent/MCP lyrics_search、POST /api/lyrics-search及三固定JS資產；基本15/啟庫22需重新discovery。Agent1/draft3與既有schemas、legal4/private/not_submitted保持，產品85/來源38–85共48/unknown86。見[契約](LYRICS-SEARCH.md)。

v0.84：editor-focus純六清單metadata（IDs／visible／busy）與entry/new/add候選→注入capture/focusTarget雙來源核對controller→editor-focus-dom固定入口/目標/原生activeElement確認→app。ID不入草稿；最多40/100/100/30/1000/10000列、ID64，未知list/field/mode/超界/重複ID拒絕；dispose停讀與副作用。新增歌詞focus文字、空表focus新增、還原row與shot摘要；只明確add/delete/undo時執行，不因播放/載入自動搶焦點。focus本身不寫編修值、markDirty或media；shot details.open沿原暫態行為。兩固定JS路由，不增加POST/Agent/CLI操作或路徑權限。產品84／來源38–84共47／unknown85／expectedtag84，14/21／Agent1/draft3/legal4/private/not_submitted保持。見[契約](EDITOR-FOCUS.md)。

v0.83播放熱路徑：pure checked rows/context→private prepared playback→injected失效／fresh focus controller→owned DOM marker→app，position-only不重讀整表；完整來源核對仍在明確操作時使用。原four adapters與wire保持，沒有新資產或HTTP／Agent操作，14/21／Agent1/draft3保持，產品83／來源38–83／unknown84。見[契約](CURRENT-CUE-PLAYBACK.md)。

v0.82原句首：pure cue-position→injected原列／媒體重查controller→delegated DOM→app，只改native播放位置；播放狀態、編修及撤回保持。共用Python／JS時間層在捨入前沿原十進位字串拒絕負值下溢，四adapter仍由application共用。只新增兩固定JS資產，14/21／Agent1/draft3／原schema及操作權限保持，產品82／來源38–82／unknown83。見[分層契約](CUE-POSITION.md)。

v0.81目前句：pure current-cue→injected capture/focus controller→literal DOM→app共同媒體快照，明確定位原列文字；顯示更新不搶焦點。只增加兩固定JS資產路由，沒有新Agent/HTTP operation、path/write/network能力；14/21／Agent1/draft3／領域schema保持，產品81／來源38–81／unknown82。見[分層契約](CURRENT-CUE.md)。

v0.80發佈資料：pure release_metadata→selected Git metadata/policy→package前及archive核對，expected tag與實際publication分開。未新增Agent operation、path/write/network能力；14/21／Agent1/draft3與領域schemas保持，產品80／來源38–80／unknown81。見[發佈契約](RELEASE-METADATA.md)。

v0.79逐句標記撤回：pure cue-stamp-edit→注入row／media／實際after重查controller→literal DOM／native player組合。只還原最近目標時間，文字／其他句／media保持；載入Agent新歌詞清除頁面歷史，預覽保持。未新增Agent工具或網路／路徑／寫檔能力；14/21／Agent1／draft3及原schemas保持。新產品79／交付明確38–79／unknown80，詳見[逐句撤回契約](CUE-STAMP-EDIT.md)。

v0.78波形定位：pure wave-position→注入來源重查controller→DOM／native player組合；定位只改原生播放位置，歌詞／宣告／草稿保持。未新增Agent工具或網路／路徑／寫檔能力；14/21／Agent1／draft3及原schemas保持。新產品78／交付明確38–78／unknown79，詳見[波形契約](WAVE-POSITION.md)。

v0.77 UTC時間：pure utc_timestamp.py/utc-timestamp.js strict Unicode/extended date/one-codepoint separator/hour-minute-second/3or6 fraction/zero offset/Gregorian ranges→library record/backup created_at/browser revision+backup plan→原controllers/DOM。返回原文不Date.parse/normalize/timezone convert，Z與既有短clock/零offset秒互通，原stored_at+ID lexical排序/backup bytes保持；unknown/invalid拒絕不寫入。原wire/schema/14+21/Agent1/draft3/library1/backup1保持，產品77/來源38–77/unknown78。見[UTC契約](UTC-TIMESTAMP.md)。下方歷史按當版保留。

v0.76 保存清單呈現：Python/JS library-match純四欄字面query/Unicode codepoint非重疊spans → 原search过滤/完整reply validator；pure library-presentation完整context/selected metadata → detached literal library-presentation-dom → app原controls。空庫/no matches/unreadable/disabled分開；accepted query+counts只作browser暫態，stale/pending保留舊query及preview/edit/media。四欄/最多560marks、256px局部捲動/窄版換行；無新wire/operation/schema/工具/路徑/寫檔/model/依賴，14/21保持，產品76/來源38–76/unknown77。見[契約](LIBRARY-PRESENTATION.md)。下方歷史按當版保留。

v0.75 搜尋：pure library_search query/metadata index/SHA/page/schema → shared metadata_snapshot → application CLI／Agent／MCP／HTTP，固定POST /api/drafts/search。query1–200 Unicode codepoints／800UTF8、limit1–100、cursor index+全觀察來源hash，來源／query變更拒接。browser pure library-search精確wire/current/search1/全metadata/query/頁長/排序/continuation → injected latest/cancel/已顯示ID → DOM；原清單/preview/draft/media保持，搜尋不進draft。基本14／啟庫21需重新discovery，Agent1/draft3/library1/backup1保持；無正文／media／path／寫檔／model權限。見[契約](LIBRARY-SEARCH.md)。下方歷史按當版保留。

v0.74 保存回覆：工作台 save/list/read 與 save confirmation readback 先通過 library-result 的完整 HTTP envelope 核對，三操作的 files 必須空、current產品與protocol1一致、needs_review依操作精確。共享 checkedMetadata 與純 bounded checkedList 核對所有列、原時間／ID排序、cursor metadata與接續位置，再沿 required injected checkList／latest 交 DOM。保存內容仍由 receipt／revision 核對；不符 ACK 保留同ID pending、錯回讀仍為 uncertain save。CLI／Agent／MCP／HTTP producer wire、Agent1／draft3／library1／14及20工具保持。見[契約](LIBRARY-RESULT.md)。下方歷史描述按當版保留。

v0.73 備份匯出：新draft_backup_export唯讀，需啟動時明確草稿庫；預設metadata，optional ids與explicit include_archive<=512KiB。pure request/selected IDs→既有producer→同一次ZIP完整read/hash/source IDs→不可變export1→application→CLI/Agent/MCP/HTTP，無payload path或自動寫檔。MCP新工具具體outputSchema，其他outputSchema保持；capabilities給data_schema。基本14／啟庫20，需重新discovery；export1與backup1/Agent1/draft3/library1分開。見[契約](BACKUP-EXPORT.md)。下方歷史工具數按當版保留。

v0.72 備份下載：pure backup-download exact descriptor／archive bytes → required injected prepare/read/hash/send及latest lifecycle → native backup-download-dom bounded stream／AbortController →共用text-download-dom byte sender。32MiB binary／8MiB text各自domain保持，native backup-file.sha256共用File及下載buffer；backup1／draft3／library1／Agent1、14／19工具、routes及backend canonical ZIP契約保持。取消連線headers/body遇ConnectionError只close_connection，不重送回覆；其他I/O錯誤不吞。sent只代表anchor click＋清理排程，保存檔案未驗證。見[契約](BACKUP-DOWNLOAD.md)。下列為歷史。

v0.71 備份來源與確認：native backup-file有界32MiB File bytes／SHA→pure backup-result exact wire、current產品／protocol／來源／全部plan計數與ID分組→required injected controller→DOM明確restore／同File retry。restore成功摘要不符不onRestored；backend既有完整ZIP／CRC／manifest／revision bytes／SHA及immutable restore保持，browser不獨立解析ZIP內容或核對目標磁碟耐久性。Agent1／draft3／library1／backup1、14／19工具保持。見[契約](BACKUP-RESULT.md)。下列各版為歷史。

v0.70 保存版本來源：pure library-revision共享完整entry／read data核對→讀前隔離選定metadata→required checkRead→原latest／target preview→app完成／Apply／export active selection重查。save receipt重用純entry/read並保持click-time原稿比較；切換版本取消舊預覽且提示重新預覽。backend核對磁碟bytes／SHA，browser完整值比較不獨立重算磁碟雜湊。Agent1／draft3／library1、14／19工具保持。見[契約](LIBRARY-REVISION.md)。下列各版為歷史。

v0.69 保存回讀：pure library-receipt完整data ACK／metadata／draft3→注入同ID readonly read→原pending controller→DOM／retention。核對失敗保留原ID／click-time原稿，read4xx不能當成原save拒絕；確認後才retain，後續編修保持。backend既有read核對磁碟SHA／bytes，browser比較完整回讀原值，沒有獨立重算磁碟SHA或耐久性保證。見[契約](LIBRARY-SAVE-RECEIPT.md)。下列各版為歷史。

v0.68 分鏡自訂畫幅：原生text+datalist建議→既有raw-fields／draft3→planning-import原值映射→原target preview／明確Apply／actual after Undo。移除額外四值白名單，Python／Agent既有文字語義保持；空白可保存與診斷，完整plan仍拒絕。無新schema／operation／權限。見[契約](STORYBOARD-RATIO.md)。下列各版為歷史。

v0.67 歌曲／分鏡報告接續：planning-report-input純完整來源診斷核對→planning-import限定panel proposal→既有讀檔／target preview→DOM明確載入及actual after Undo。1MiB原入口、raw字串與ID保持；無法表示的來源拒絕，不補寫／抹除。Agent1／draft3／14／19 tools保持，見[契約](PLANNING-REPORT-INPUT.md)。下列各版為歷史記錄。

v0.66 條件套用撤回：共享pure validated value history→audio controller限定before／實際after→明確Undo→DOM成功焦點回原欄位。後續raw／profile／custom改動拒絕整份撤回，record保留；最近loaded復原與confirmed分開，媒體／其他台保持。Agent／CLI／HTTP與保存schemas無變更。見[契約](AUDIO-ACCEPTANCE-UNDO.md)。下列各版本為歷史記錄。

v0.65 接續接受條件報告：pure input1→完整review1來源派生核對→隔離draft1→CLI或browser注入controller→明確預覽／套用。已載入與已確認下載各保留最近一個指紋，不以舊確認取代新載入。原Agent／MCP／HTTP payload、14／19 tools及Agent1／draft3保持；沒有報告路徑或媒體權限。見[契約](AUDIO-ACCEPTANCE-INPUT.md)。下列各版為歷史記錄。

v0.64 自訂接受條件診斷：共享原解析→pure三欄review→application／四adapter；JS完整來源与JSON／MD核對→readiness-state current快照→DOM文字／焦點。基本14／啟庫19工具，review1獨立，Agent1／draft3與媒體／保存／路徑權限保持。見[契約](AUDIO-ACCEPTANCE-REVIEW.md)。以下各版本為歷史記錄。

## v0.54 報告與完整歌詞包

lyrics_export_review 新增可選 strict boolean include_package。省略／false仍回兩個報告，true另附完整 lyrics.json；JSON-lines／MCP／HTTP共用應用層，CLI明確 --include-package。report／source SHA與預設wire保持，13／18工具、Agent1／draft3及report1不變。見[契約](LYRICS-EXPORT-BUNDLE.md)。以下為歷史迭代記錄。

## v0.53 歌詞匯出格式保留

新增歌詞匯出格式保留檢查：句首時間標籤的 LRC 歧義與 ASCII 空白／tab 句的 SRT 遺失可定位原表格；完整 JSON 保存句尾、作品總長與校時歷史。唯讀報告用完整 package 的 SHA-256 核對來源，錯回應保留編修與成果；建立歌詞包會自動顯示提醒。新 review1 與 Agent1／draft3 分開，基本13／啟庫18工具；產品53與明確交付來源38–53同步。451 Python／683 JavaScript／57語法／4 Skills、原生三寬度及 v52 ZIP442／672還原通過。 見[契約](LYRICS-EXPORT-REVIEW.md)。以下工具數與來源範圍為各歷史迭代。

v0.51 SRT 純解析／原文核對：原各行空白與Unicode保留，物理多行明確 / 合句、原排版保留原檔／空白cue用JSON；Python／JS integer clock與單次文首BOM，application共用各adapter。lyrics-import對LRC／SRT沿共用timed-source guard核對原cues／time／inference與文字exports再preview／Apply；LRC原解析保持。產品51／來源38–51，wire／schema／12／17tools維持。見[契約](LYRICS-SRT.md)。下方保留歷史迭代。

v0.50 LRC 原文保留：獨立 Python／JS 只解析相鄰行首時間、獨立 offset 與單次文首 BOM；literal remainder 保留。瀏覽器以原文核對 cues／time／inference 與 LRC／SRT 輸出，拒絕自洽但錯來源回覆，再 preview／Apply。多標籤歧義以版本1 JSON保存；原檔保持，wire／schema／12／17tools保持，明確來源38–50。見[契約](LYRICS-LRC.md)。下方保留歷史迭代。

v0.49搜尋上一批：controller私有最多512對cursor與command generation，單batch／context保持；返回回讀原位置及序號，前進仍可全文接續。DOM範圍／邊界焦點、來源／query失效及retry分層；wire／schemas與12／17tools保持，明確來源38–49。見[導航契約](DELIVERY-SEARCH-NAVIGATION.md)。下方保留歷史迭代。

v0.48產品版本與delivery producer支援同步至0.38–0.48。本輪source snapshot／metadata view是瀏覽器內部分層，不新增Agent工具或wire schema；基本12／明確啟庫17、Agent1／draft3與所有交付schemas保持。詳見[DELIVERY-SOURCE](DELIVERY-SOURCE.md)。

## v0.47 命中前後文

搜尋清單改以原文鄰近文字辨認重複句，選擇後顯示唯讀片段並定位原文。context1每側最多64 UTF-8 bytes、不拆字元，單項最多1152 bytes；清單標示換行／控制符號、整理側邊連續空格及120字元摘錄，原文DTO與片段仍保留原值。Agent／MCP明確include_context=true、CLI --match-context才提供；預設位置回覆與12／17工具保持，source SHA與current source失效保護沿既有搜尋。產品47、來源明確38–47，未知拒絕。見[前後文契約](DELIVERY-CONTEXT.md)。下方保留較早迭代。

## v0.46 原文搜尋與定位

完整核對 ZIP 後，text-search1 精確比對原文並回傳有限筆 UTF-8 命中位置；非零接續需前次 ZIP SHA。瀏覽器在「分段閱讀完整原文」輸入搜尋字，按尋找或 Enter，再選擇命中位置直接跳到原文；可搜尋 ZIP 或目前保留成果。每批20筆，原文、表單與媒體保留，來源變更清除舊結果。12／17工具、Agent1／draft3及既有交付 schemas 保持；交付來源明確38–46，未知拒絕。見[搜尋契約](DELIVERY-SEARCH.md)。以下較早章節保留歷史迭代。

## v0.44 原文分段閱讀

text-window1獨立，完整來源核對後讀明確UTF-8邊界，單段4–16KiB、非零位置pin前次ZIP SHA，未指定分段的原契約保持。Browser唯讀reader有界buffer／頁面／history、current source重查；全文下載、Apply／Undo與12／17工具保持，來源明確38–44。見[使用與分層](DELIVERY-TEXT.md)。以下早期章節保留迭代來源。

## v0.43 指定 ZIP 原文

完整核對來源後才能選取明確原檔名，pure selection1／application／CLI／Agent／MCP共用；Browser pending current source唯讀下載沿native bytes。512 KiB選定JSON上限、8 MiB完整來源與原文保持；來源明確38–43，12／17工具與Agent1／draft3及既有交付schemas保持。見[目前契約與使用](DELIVERY-SELECTION.md)。以下早期版本段落保留迭代來源。

## v0.42 Browser 原文下載

Browser文字入口改native UTF-8 bytes，與Agent／MCP分層：沒有新增工具或自動寫檔／路徑／網路能力。12／17與所有schema／inline512KiB／行2MiB保持，producer／inspector／browser來源版本明確38–42，未知拒絕。原文8MiB可由工作台下載或CLI明確ZIP輸出；不因此擴大Agent回覆。見[下載契約](TEXT-DOWNLOAD.md)。

## v0.41 可保存報告與完整啟動選檔

delivery_inspect payload新增include_report嚴格布林，要求baseline且不能include_files=true；files回兩個固定報告，data保留來源與comparison。report schema1／256KiB合計／128列，不帶成果原文或媒體；default wire與12／17保持，重新discovery。launcher新增--audio／--delivery-zip，只列印絕對設定並驗副檔名，不讀寫／啟動Host；另一cwd真MCP兩工具同源接受，特定Host仍未驗證。CLI --comparison-report寫三檔，default exclusive create拒絕raced-in同名檔，多檔可部分輸出。見[契約](DELIVERY-REPORT.md)。

## v0.40 明確基準文字比較

delivery_inspect payload可加baseline={scope,files}，只接受原文字、不選路徑；預設files={}，data.comparison帶完整新增／變更／移除／相同及雙側SHA／bytes，needs_review=true。CLI --compare-input明確讀JSON，不寫來源；Agent／MCP仍啟動--delivery-zip，未提供baseline保持v39形狀。基準0–64檔／8MiB、128聯集，既有Agent行2MiB與inline files JSON512KiB保持，12／17工具與舊protocol／schema不變。comparison1獨立，重新discovery。見[契約](DELIVERY-COMPARISON.md)。

## v0.39 文字交付回讀

新增唯讀 delivery_inspect，啟動時明確 --delivery-zip 選定來源；JSON不能傳路徑、URL或ZIP bytes。預設metadata／files={}，include_files=true才回傳原文字集合，序列化JSON UTF8最多512KiB；既有2MiB行界限保持。檢查不解壓、不寫檔、不呼叫模型，needs_review=true。基本12／啟庫17，重新discovery；inspection1／package1／Agent1／draft3各自管理，支援工具38／39，未知拒絕。見[契約與CLI](DELIVERY-INSPECTION.md)；以下工具數為歷史版本。

## v0.38 完整文字交付

新增唯讀 delivery_package；基本11／明確啟庫16工具，需重新discovery。預設摘要清單，include_archive=true才回傳不超過512KiB的ZIP base64，Agent行2MiB仍保持；無路徑／自動寫檔／網路／模型新增。needs_review始終true，交付schema1與Agent1／draft3獨立。見[契約](DELIVERY-PACKAGE.md)。後續章節工具數為歷史版本。

## v0.34 原分鏡時間診斷

新唯讀 operation／MCP tool `storyboard_timing_review` 只接受 `{panel:{fields:{"mv-duration":原字串,"mv-fps":原字串},shots:[{start:原字串,end:原字串}]}}`。沒有創作或路徑欄位；最多1000鏡，全數計數／前200明細／原鏡號與 related_row（前鏡）保留。零待辦仍 meta.needs_review=true；時間report1獨立，舊創作report1、Agent1／MCP2025-11-25／draft3保持。重新 discovery 為基本10、明確啟庫15工具；下方章節工具數為各歷史版本。

CLI `storyboard-timing-review` 明確 --input 最小時間JSON或 --draft 已驗證modern草稿，輸出JSON／Markdown及0／2／1退出碼。HTTP `/api/storyboard-timing-review` 與 stdio 共用application；不自動寫檔、不呼叫模型。前端核對完整來源／data／JSON／Markdown及版本，晚回應或來源不符保留成果與編修。見 [契約](STORYBOARD-TIMING-REVIEW.md)。

## v0.32 分鏡原欄位診斷

新增唯讀storyboard_review operation／MCP tool，payload精確panel（fields／motifs／shots），原字串、母題ID、留白與原鏡號保持；未知方向列待辦，未知shape／ID拒絕。report zoe-storyboard-review schema1含related_row、全部count／前200明細；完整時間／影格／連戲另由storyboard驗證。

CLI storyboard-review明確--input或modern --draft、0／2／1及預設不覆寫；HTTP／Agent／MCP同application。9基本／明確啟庫14工具，需重新discovery，meta.needs_review始終true；Agent1／MCP2025-11-25／draft3與舊schema保持，無模型／路徑或自動寫檔新增。歌曲／分鏡前端共用純完整回覆核對層，報告不進草稿。見STORYBOARD-REVIEW.md；v0.31的8／13及更早7／12為歷史清單。


## v0.31 歌曲原欄位診斷

新增唯讀music_review operation／MCP tool，payload只含panel（modern草稿panels.music），允許未完成原字串與空列；報告zoe-music-review schema1、JSON／Markdown保留source／原位置，不補創作。CLI music-review可明確--input或--draft；0為欄位零、2為已輸出待修正、1為失敗。meta.needs_review始終true，完整歌曲與媒體仍須驗證。預設8工具、明確啟庫13，需重新discovery；Agent1／MCP2025-11-25／draft3及舊schema保持。沒有Host／路徑／模型／自動寫檔權限新增。見MUSIC-REVIEW.md；既有v0.25–v0.30章節的7／12為歷史清單。

## v0.30 歌曲欄位待辦

工作台歌曲必填／範圍待辦只存在本頁，建立歌曲及從目前歌曲起稿分鏡先定位原缺漏。完整 music／storyboard_seed 仍由共用 application／domain 接受，零待辦不代表總長或媒體通過。BPM120.0004保留精度；純有限十進位與文字空白規則由 planning-values 重用。檔案 Agent 起稿獨立核對／預覽再明確套用，保留目前歌曲及音檔。真17鏡檔及限定撤回通過；產品0.30，各schema／protocol及七／十二tools保持，不新增operation／待辦wire／模型。見 MUSIC-READINESS.md。

## v0.29 歌曲段落順序

工作台排序後重建歌曲包與storyboard_seed，兩者沿用同一arrangement順序。Agent／CLI契約不新增ID／移動紀錄；Agent起稿檔先核對預覽再明確限定套用，歌曲與原音檔保持。歌曲brief明確替換或撤回替換時，清本頁暫態排序紀錄；沒有自動遷移或模型。產品0.29，各protocol／schema及七／十二tools保持。見MUSIC-ARRANGEMENT.md。

## v0.28 起稿創作待辦

Agent／CLI的storyboard_seed1先核對預覽再明確套用，工作台列出原鏡頭留白及母題待辦，可限定撤回。模型不補寫畫面，不把起稿當完整分鏡。完整storyboard_plan仍經既有完整驗證；新待辦為工作台暫態，不接收Agent報告或新增operation。產品0.28，protocol／schema、七／十二tools保持。見STORYBOARD-READINESS.md。

## v0.27 分鏡宣告保持

工作台新增／刪除鏡頭保留宣告；核對後明確接續鏡尾／限定撤回。Agent／CLI payload仍需由呼叫者明確提供總長，不由application自動覆蓋。現代需求回讀先核對預覽，再明確載入；清除工作台暫態總長紀錄，其他panel與音檔保留。產品0.27，七／十二tools與各protocol／schema不變。見[契約](STORYBOARD-DURATION.md)。

## v0.26 設計需求接續

四 adapter 的 planning domain 保持。Agent／CLI 回傳 brief.json、mv-brief.json 由工作台核對本次檔案與主要 JSON 後才預覽，還需明確載入。產品0.26、七／啟庫十二工具，各協定與 schema 不變，沒有新增安裝或模型。CLI 返回正常來源包，瀏覽器 sourceChecked 是暫態，沒有要求 Agent 傳入此旗標。詳見 PLANNING-SOURCE.md。

## v0.25 唯讀校時待辦

新增operation／MCP tool lyrics_review、HTTP /api/lyrics-review、CLI lyrics-review。輸入cues原始start／end／text和可選title／duration，可包含時間留白；只作診斷，不補值／裁切／排序來源。來源最多10000列，明細前200項／完整計數，row為原順序1起、global0。報告schema1與lyrics_package1分開，不將檢查報告當字幕。詳細輸入、budget、固定code與CLI0／2／1語義見LYRICS-REVIEW.md。

需要重新discovery：預設七tools，啟庫十二tools，readOnlyHint=true/openWorldHint=false。所有診斷meta.needs_review=true，尚待實聽；來源／report不寫檔，CLI明確--out才保存且預設拒覆寫。protocol1／MCP2025-11-25／draft3與其他schema保持，不新增Host／媒體路徑權限。

真stdiosession壞request後有效、tools/list、call／EOF、CLI／HTTP與browser下載已驗證；特定Host仍未安裝。

## v0.24 時長接續保持明確

沿用 lyrics operation／lyrics_validate tool／HTTP /api/lyrics／CLI lyrics。已有完整包的宣告總長保持；瀏覽器選定不同音檔不會默默送出新總長。明確採用後只改 duration，仍驗證 cue 邊界並保留待實聽說明；撤回只還原欄位，不能刪去已套用過的來源歷史。

媒體觀測及撤回不進 payload 或 draft3。沒有新工具、Host 設定、模型或持久 schema；CLI／HTTP／JSON-lines／MCP 同一 package request 仍產生四檔。見 LYRICS-MEDIA-DURATION.md 與 QA-v0.24.0.md。

## v0.23 完成分鏡影格契約

沿用 operation storyboard／tool storyboard_plan／HTTP /api/storyboard。完成分鏡 data 與 storyboard.json 新增 frame_timeline：format zoe-storyboard-frames、schema_version1、rounding nearest_ties_to_even、end_semantics exclusive、total_frames。--describe／HTTP capabilities 的 storyboard_frames 描述獨立版本，不新增工具或 request 欄位。

秒數通過原 1 ms 容差後，影格仍須從 0 連續至 total_frames；重疊、空缺、零幀鏡頭或尾端不符明確失敗，原輸入與輸出保持。最近整數且正好半幀取偶數，沒有改用 ceil 或改秒數修補。CSV／prompts.md 顯示同一排他範圍。既有 seed1 使用相同映射，仍是待人工編寫的時間稿。規格與相容性見 FRAME-TIMELINE.md；完成資料不表示已生成或校準實際媒體。

## v0.22 響度量測

沿用operation audio／tool audio_report與啟動時明確選定的--audio；request不得指定來源路徑。data與report.json新增獨立loudness schema1，--describe／HTTP capabilities提供audio_loudness版本、單聲道／立體聲與8000–192000Hz範圍。響度不可測保留null／status，不把它當技術接受失敗或通過。四adapter同源，既有needs_review、退出碼及六／十一工具保持；未知量測schema拒絕顯示。方法、欄位與限制見[量測契約](LOUDNESS.md)。沒有FFmpeg依賴、模型、Host設定或自動正規化。

## v0.21 保存快照與瀏覽器另存提示

Agent／MCP 的 draft_save 共用既有不可覆寫保存層；工具、路徑選擇及schema不變。瀏覽器只在收到成功回應時確認當時送出的draft，保存期間新增的編修仍需另存。未知結果應保留原ID及內容重試／draft_read確認；放棄重試不表示已保存或刪除版本。

真 JSON-lines Agent v1 在本輪合成草稿庫完成 draft_save／draft_read／EOF，瀏覽器refresh→選版→read預覽→明確載入後辨識完整已保存內容。預覽不清除目前未保存提醒；局部起稿／撤回依目前內容重查。Agent另建的資料不表示目前瀏覽器編修已保存。草稿下載送出後須使用者核對檔案再確認；狀態不進Agent資料、沒有新持久schema或Host安裝。

## v0.20 外部 request 的 JSON 邊界

HTTP／JSON-lines／MCP在領域操作前共用json_document decoder：重複欄位（含跳脫同名）、非有限數字／溢位、無效Unicode與超64層拒絕。不能用兩個protocol_version／method／schema_version覆蓋較早值。JSON-lines回invalid_request，MCP回-32700，HTTP回400；同一stdio串流下一筆有效request仍可正常執行。

capabilities／--describe新增json_document encoding UTF-8、max_depth64、duplicate_keys reject、nonfinite_numbers reject，max_request_bytes2MiB保持。Agent已有單BOM處理，HTTP維持不接BOM；CLI／原生選檔允許一個開頭BOM，不修剪字串內內容。CLI外部JSON同樣上限2MiB，領域工具仍另驗schema與限制；沒有新工具／protocol或路徑權限。

真CLI另一cwd／BOM／覆寫拒絕、HTTP壞後好、JSON-lines重複版本後有效request、MCP重複method後握手／六tools／call／EOF已驗證。原生需求／起稿／草稿也使用同規則、先預覽再明確套用；特定Host尚未安裝，沒有模型執行。

## v0.19 完整歌詞包檢查

沿用JSON-lines operation lyrics、MCP tool lyrics_validate、HTTP POST /api/lyrics。生成cues或content／suffix，檢查用 `{"package": 完整版本1資料}`；三者互斥，檢查不可附title／duration／shift／time_changes／text_changes。直接content JSON完整包也會嚴格辨認；舊五欄包須package模式明確 `allow_legacy:true`，CLI則 --legacy-json。未知／額外欄位或來源矛盾拒絕，不接受路徑。

新data／lyrics.json含format=zoe-lyrics-package、schema_version1、title、duration、duration_estimated、cues、timing、review_notes。包最大2MiB、10000句，時間為有限數字且已排序／毫秒；total需涵蓋全部句尾。timing含duration_source／inferred_end_count／tail_end_inferred及可選applied_shift_seconds。meta.needs_review反映推估、曾補結束、shift或待確認說明；false不證明聲音或權利已核實。

input_schemas／tools/list新增互斥package與明確legacy資料形狀，capabilities提供獨立lyrics_package版本與容量。先重新discovery再使用新模式。files仍文字，檢查不寫檔；CLI --out明確保存且拒絕覆寫。真正CLI／HTTP／JSON-lines壞後好／MCP握手與call／EOF及瀏覽器接續已驗證；特定Host尚未安裝。

歌詞包1與Agent1／MCP2025-11-25／draft3／兩seed1／library1／backup1獨立；預設六工具、啟庫十一工具保持。以下v0.18完整JSON名稱與總長限制由此版本修正。

## v0.18 匯入資料先預覽

Agent與CLI產物可在校時工作台直接選lyrics.json或lyrics-seed.json，即檢查／預覽，按「套用這份歌詞」才替換；直接TXT也走既有lyrics_seed操作。取消／目標編修／晚回應保護，保留音檔與目前時長。帶時間JSON的title／duration仍依目前校時欄位，起稿JSON的title保持；原檔保留。

真正JSON-lines lyrics及MCP initialize／tools list／lyrics_seed call／EOF產物已由IAB選檔與明確套用，CLI UTF8 BOM／CRLF起稿亦已回讀。Agent1／MCP2025-11-25／draft3／兩seed1／library1／backup1及六／十一工具不變；沒有Host安裝、全域設定、模型或網路呼叫。

## v0.17 未校時歌詞起稿

JSON-lines operation／MCP tool lyrics_seed、HTTP POST /api/lyrics-seed 共用 application 與 musiclab/lyrics_seed.py。生成 payload為 {"title":"作品名稱","text":"第一句\n第二句"}；檢查外部起稿用 {"seed":完整起稿JSON}，兩者互斥，不接受覆蓋／未知欄位或路徑。title最多200字元；text UTF-8最多64 KiB、1–1000個非空白行。

結果 files為 lyrics-seed.json／lyrics-seed.md，data格式zoe-lyrics-seed、schema_version1、statusuntimed、title／source_text／lines／review_notes。lines只含來源1-based行號與未修剪text；空白行不建cue但保留於source_text，重複句保留。不能加入start／end／媒體結果或宣稱校時完成，needs_review永遠true。生成與檢查都不寫磁碟；CLI由使用者明確--out保存，預設拒絕覆寫。

瀏覽器「匯入歌詞」選lyrics-seed.json即檢查，先核對／預覽，再明確套用；目標編修／晚回應保護，保留目前音檔與時長。時間空白，須依實際音檔標記後才匯出；來源JSON可存於既有draft3，沒有自動schema遷移。現有Agent1／MCP2025-11-25／library1／backup1／storyboard seed1不變；預設六工具、明確啟庫十一工具。真實CLI、HTTP、JSON-lines及MCP子程序已驗證，特定host未安裝或驗證，沒有模型呼叫。


## v0.16 工作台接續保護

Agent輸出的brief.json／mv-brief.json與草稿庫保存版本會先預覽，proposal再次核對。需求只核對目標工作台；完整草稿與保存版本另核對四工作台及原生音檔身份。讀取／預覽後編修拒絕替換，重新預覽後才可載入；沒有靜默合併。草稿JSON也改成先預覽再明確載入，BOM可讀，legacy仍明確轉換，原檔保留。

純replacement-preview與transport／DOM分開，不改Agent1、MCP2025-11-25、draft3、library1、backup1、seed1及五／十工具；沒有Host安裝／模型呼叫。實際JSON-lines v1 draft_save→本輪合成草稿庫→HTTP瀏覽器預覽／guard／明確載入／撤回已驗證，特定Host連線仍未驗證。


`music_lab_agent.py` 是 JSON-lines 的本機 adapter。v0.4 另提供 `music_lab_mcp.py`；兩個格式與入口各自獨立。沒有模型、網路、憑證或工具安裝要求。可讓不同 Agent 以子程序呼叫同一套領域操作；目前已驗證本機子程序，不宣稱任何特定 Agent 平台已整合。

查看能力：

```powershell
python music_lab_agent.py --describe
```

一個 request 一行 JSON，UTF-8，每行最多 2 MiB：

```json
{"protocol_version":1,"id":"lyrics-001","operation":"lyrics","payload":{"content":"[00:00.000]這次換我回答","suffix":".lrc","title":"原創示例","duration":3}}
```

在 PowerShell 將它存到 `request.json` 後：

```powershell
Get-Content -Raw -Encoding utf8 request.json | python music_lab_agent.py > response.jsonl
```

成功時回傳 `ok: true`、相同 id，及 result.files／data／meta。files 是創作成果檔名與內容，由呼叫者決定保存。預設 Agent 不寫檔；啟動時明確啟用草稿庫後，draft_save 與 v0.10 的 draft_backup_restore 在所選庫建立不可覆寫版本。失敗回傳 `ok: false` 與 error.code／message，stdout 不混入狀態文字或 traceback。錯誤 request 不會阻止下一行正常 request。

六種 operation：music、storyboard、lyrics、audio、storyboard_seed、lyrics_seed。前兩者 payload 對應 examples 的需求 JSON；歌詞採 content／suffix 或 cues，另可含 title／duration。音訊來源必須透過啟動參數明確選定：

```powershell
Get-Content -Raw -Encoding utf8 audio-request.json | python music_lab_agent.py --audio '指定作品.wav' > response.jsonl
```

音訊 payload 可含 profile（distribution／video）及 rates／bits／channels 接受條件。JSON 不接受 path 等檔案來源欄位，只能分析此程序啟動時選定的 WAV；保持原檔。這仍是人工選定的本機工作流。

常見 error.code：invalid_request、invalid_input、request_too_large、invalid_encoding、io_error、internal_error。缺少實際媒體時不產生音樂／影片；meta.needs_review 表示有需檢視項目，不能視為音樂品質保證。

授權為 PolyForm Noncommercial 1.0.0，見 LICENSE／NOTICE。商業使用沒有由本版授權。

## MCP stdio adapter

`music_lab_mcp.py` 以 Python 標準函式庫實作，所有工具呼叫同一個 application.build，不複製領域計算。明確支援 MCP `2025-11-25`，並非宣稱最新版。未知版本的 initialize 回傳 -32602 及 supported 清單；呼叫者可明確選支援版再重試。2026 的 stateless server/discover 未實作，回傳 -32601。

以使用的 MCP host 設定 command=`python`，args 第一項為此版 `music_lab_mcp.py` 的完整路徑。需分析音訊時在 args 明確加入 `--audio` 與所選 WAV 的路徑；JSON payload 不可選其他音檔。伺服器不開網路埠，EOF 退出；不自動安裝全域設定或取得其他工具權限。

連線順序：initialize → notifications/initialized → tools/list 或 tools/call。工具名稱：music_plan、storyboard_plan、lyrics_validate、audio_report、storyboard_seed、lyrics_seed。每個工具的 arguments 都有一個 payload 物件；歌曲／分鏡使用 examples 的需求格式，其餘與上方 JSON-lines 的 payload 相同。tools/list 提供參數描述與 schema。

最小請求範例，每個 JSON 各一行：

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"my-client","version":"1.0"}}}
{"jsonrpc":"2.0","method":"notifications/initialized"}
{"jsonrpc":"2.0","id":2,"method":"tools/list"}
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"lyrics_validate","arguments":{"payload":{"content":"[00:00.000]原創測試","duration":3}}}}
```

回應的 structuredContent 與 text 內容都包含 files/data/meta；files 是文字內容，不是已保存的檔案。meta.protocol_version=1 是共用應用結果的原有版本，MCP transport 版本以握手的 protocolVersion 為準。程式不呼叫 AI；有 review/warnings 仍需人工判斷。

未知方法／工具是 JSON-RPC error；領域或 payload 錯誤是 isError=true 的工具結果。錯誤行不終止後續有效請求。每行上限 2 MiB，UTF-8；notifications 沒有回應。只宣告靜態 tools；沒有 resources/prompts、HTTP MCP、Tasks、背景作業、主動要求權限或模型 sampling。同步呼叫不提供執行中的取消／進度通知，host 應設定逾時並管理子程序。

本輪以獨立子程序完成握手、發現四工具、實際呼叫四操作、錯誤恢復與 EOF 結束，成果比對共用 application；沒有把此服務安裝進 Codex 或其他 Agent，特定 host 與官方 conformance suite 尚未驗證。

規格研究僅採官方文件：[2025 lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle)、[stdio transport](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)、[tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)、[2026 versioning](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/versioning.mdx)。未搬入第三方程式或素材。

## v0.5：產生目前版本的啟動設定

在解壓後的專案目錄執行：

```powershell
python scripts/agent_launch.py
python scripts/agent_launch.py --format codex
```

第一個指令顯示 JSON command／args／逾時設定，第二個顯示 `[mcp_servers.zoe_music_lab]` TOML 片段。command 為執行此指令的 Python 完整路徑，args 為本版 `music_lab_mcp.py` 完整路徑；移動專案或更換 Python 後重新產生。音檔仍由使用者明確加入 `--audio` 與指定 WAV 路徑。JSON descriptor 含 Codex 的逾時欄位，其他 host 應依其設定格式採用 command／args，不直接假設格式相同。

工具只列印設定，沒有寫入全域檔案、啟動 host 或取得其他工具權限。由使用者依選定 host 的設定方式加入片段後，仍需驗證連線與一次實際工具呼叫；不要把 `mcp get` 的成功當成可呼叫證明。

本輪已由生成的 command／args，在另一個暫存工作目錄啟動實際 MCP 子程序，完成握手與 `lyrics_validate`，核對歌詞成果，EOF 退出且不寫檔。另以本機 `codex-cli 0.153.4` 的 `mcp get --json` 與臨時 `-c` 覆寫解析設定，command／args 與生成值一致；只顯示本工具的白名單 metadata，不讀出其他服務或秘密，沒有修改全域設定。此項沒有建立服務連線，也沒有呼叫模型。實際 Agent host、官方 conformance、跨 host 與 2026 MCP 支援仍未完成。

## v0.6：把需求交回工作台

music_plan／JSON-lines music 的 `result.files["brief.json"]`、storyboard_plan／storyboard 的 `result.files["mv-brief.json"]` 是文字內容。由呼叫者明確保存這兩個成果後，工作台可選需求類型、讀入檔案、看預覽／待審查項目，再載入指定工作台，繼續人工編修。Adapter 仍不自動寫檔，不執行文件裡的指令、不安裝 host。

歌曲回讀需含 arrangement、BPM、memory_hook 等設計需求，分鏡需含 motifs。既有簡單 CLI 格式仍可使用 CLI；UI 不猜測或填造缺失的設計資訊。未知欄位／UI 無法保存的畫幅或容量拒絕；整個 response envelope 或 music-plan／storyboard 結果檔需保留作參考，不能直接當輸入。

本輪以實際 MCP 子程序呼叫兩工具，將回傳 brief 檔載入瀏覽器、人工確認、重建、真正下載；歌曲 brief 與來源完全一致，分鏡共用領域輸出一致。另有 Python → 生產 JS 轉換層 → Python 的實跑往返測試。這證明 artifact 交接，沒有宣稱任何特定 Agent host 已安裝或呼叫模型。

lyrics 結果的 timing metadata 區分總時長來源與逐句結束補齊；duration_estimated 保留舊語義，不能直接解讀為 SRT 尾句被估計。音檔分析入口與授權不變。

## v0.7：可探索的工具契約

musiclab/tool_contracts.py 集中宣告四工具的 JSON Schema 2020-12 資料形狀；MCP inputSchema 包含 payload，JSON-lines --describe 與 HTTP /api/capabilities 的 input_schemas 直接描述 payload。兩者共用同一份契約，output_schema／outputSchema 描述成功回應的 files/data/meta。files 是文字內容，不代表已寫入磁碟；data 隨操作而異，meta.protocol_version 仍為 1。

歌曲列出 language／avoid／deliverables、BPM／小節／能量／記憶點及現代／舊版條件；分鏡列出母題、鏡頭欄位與方向；歌詞明確選 cues 或 content 原文，cues 不搭 suffix；音訊列出接受條件與啟動選定媒體的限制。未知額外註記仍按原領域流程處理，不把工具 schema 當 UI 能完整回讀所有第三方格式的承諾。

schema 不執行計算，也沒有新增 runtime validator。application／domain 仍驗證有限數字、時間覆蓋、母題引用與 PCM；跨 adapter 的來源衝突由 application 拒絕，音訊正整數條件由 audio 層在開檔前檢查。JSON 的 1.0 等整數值會轉為 1，true 不會當 1。

tools/call 明確提供非物件 arguments（包括 null）時回 -32602；payload 的內容或領域錯誤仍回 isError=true。缺少 payload 的物件仍是可修正的工具輸入錯誤。回應後可繼續呼叫；同步執行與 EOF 退出不變，execution.taskSupport=forbidden。

來源核對：[MCP 2025-11-25 Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) 定義 inputSchema、outputSchema 與兩種錯誤；[Lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle) 定義初始化／退出。本專案依既有規則拒絕未知 transport 版本，不把此行為宣稱為完整官方 conformance；仍僅支援 2025-11-25。

本輪使用已安裝 jsonschema 4.26.0 作開發核對，沒有安裝或新增依賴：八份 schema 通過 meta-schema 檢查；七次真實 stdio 呼叫涵蓋四工具與兩種舊版企劃，成功輸入／成果皆符合 schema 並與共用 application 一致，錯誤範例被 schema 拒絕。這不是特定 Agent host 接入或模型執行證明。

## v0.9：明確啟用草稿庫

未帶草稿庫參數時，仍只有原有四個操作／MCP 工具，不讀寫任何草稿庫。明確指定目錄後，兩個 adapter 才增加 draft_save、draft_list、draft_read，共用相同 application、草稿形狀與保存層：

```powershell
python music_lab_agent.py --draft-library outputs/drafts --describe
python music_lab_mcp.py --draft-library outputs/drafts
python scripts/agent_launch.py --format codex --draft-library outputs/drafts
```

第二行是由 host 管理的 stdio 入口，EOF 退出；第三行只印出 command／args，不啟動 host 或更動設定。移動 checkout 後重新產生。明確選相同的庫即可和工作台／CLI 交換保存版本，不由 request JSON 決定路徑。

| 操作／MCP 工具 | payload | 成功 data |
| --- | --- | --- |
| draft_save | id、label、完整草稿 v3 的 draft | entry、reused、status |
| draft_list | 可選 limit（1–100，預設 20）、cursor（上一頁 next_cursor） | entries、next_cursor、issues、status |
| draft_read | id | entry、draft、status |

外層格式保持 JSON-lines 的 protocol_version／id／operation／payload，或 MCP arguments.payload。request id 與草稿版本 ID 是兩個不同欄位；草稿 ID 需為 `draft-` 加 32 個小寫十六進位字元。label 為 1–200 字元的非空白文字，草稿保存上限 1 MiB，單庫最多 1000 版。讀取回應的 data.draft 可下載或匯入；整個 envelope 不是草稿。

draft_save 會實際寫入選定目錄，MCP readOnlyHint=false／destructiveHint=false／idempotentHint=true。相同 ID＋完整內容＋名稱才可重試，reused=true 表示沿用原保存時間及紀錄；不同內容拒絕，不能覆寫。逾時／io_error 不足以判定磁碟未保存，保留原 ID／內容重試或先 draft_read 確認。新內容使用新 ID。其他兩個草稿工具為讀取。

files 為空；保存／讀取 meta.needs_review=true，status=draft_only_not_validated。保存只證明已檢查資料形狀，未完成小節／校時可以保留；必須回到四工作台重新驗證創作與時間。list 狀態 metadata_only_checksum_verified_on_read 表示沒有逐份讀取草稿，讀取時才核對摘要。讀取壞版本拒絕，不遷移或修補檔案。

產品 0.9.0、草稿 schema 3、保存紀錄 schema 1、Agent 1 與 MCP 2025-11-25 分別管理。能力查詢提供啟用狀態、容量及同源輸入 schema，不回傳草稿庫的機器路徑。已有 Windows 真實 JSON-lines／MCP／CLI／HTTP 往返與另一工作目錄的 launcher 驗證；特定 Agent host、模型執行、POSIX 及官方 conformance 尚未驗證。草稿庫與原始碼封裝／Git 還原點分開，使用者需另行備份。


## v0.10：選定備份的預覽與恢復

預設仍為四工具；明確帶 --draft-library 時共九工具，新增 draft_backup_inspect／draft_backup_restore。這兩工具還需啟動時選定 --draft-backup，不能從 payload 指定 path／input 或更換庫目錄。能力查詢只回傳 source_selected、backup schema 與容量，不洩出機器路徑。

```powershell
python music_lab_agent.py --draft-library outputs/restored-drafts --draft-backup '構思備份.zip' --describe
python scripts/agent_launch.py --draft-library outputs/restored-drafts --draft-backup '構思備份.zip'
```

產生器仍只列印所選路徑的可審閱 command／args，不安裝或啟動 host。JSON-lines：

```json
{"protocol_version":1,"id":"preview-1","operation":"draft_backup_inspect","payload":{}}
```

inspect 的 result.data 包含 backup_sha256、entry_count、new_count／reused_count、conflicts、capacity_ok／can_restore、原名稱／時間清單；status=backup_validated_not_restored。檢查整份 ZIP，不寫入庫，也不以未審查 placeholder 代替缺失草稿。

確認結果後，draft_backup_restore 的唯一 payload 欄位為 backup_sha256，值需使用此次 inspect 的結果。MCP 外層一樣使用 tools/call 的 arguments.payload；inspect readOnlyHint=true，restore=false／destructiveHint=false／idempotentHint=true。files 為空，恢復 data 回傳 added_count／reused_count／entry_count，status=restored_drafts_need_creative_validation，needs_review=true。

restore 再讀有界來源、核對相同 SHA 與所有版本，鎖內再次檢查衝突／容量。原始 record／draft 檔完全相同才重用，已存在但不同的 ID 拒絕；不覆寫／遷移。io_error 或未知回應可能已發布部分完整新版本，保持同一份備份重試，或先 inspect；不用新 ID 或變更備份規避衝突。已知衝突／未知 schema／毀損在新版本寫入前拒絕。

ZIP 上限 32 MiB、展開 64 MiB、每版 draft 1 MiB／metadata 16 KiB、單庫 1000 版。備份 binary 不經 JSON-lines／MCP base64；匯出使用 CLI draft backup 或工作台，超限可 CLI --ids 明確分批。備份只含已保存草稿及紀錄，不含媒體、成果、未保存編修或刪除歷史；恢復不套用工作台內容，需另行明確載入／重建創作成果。

產品 0.10.0／Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 分別管理。Windows 實際 JSON-lines、由生成 command／args 啟動的 MCP、CLI／HTTP 往返與三程序同 ZIP 恢復已驗證；不是特定 Agent host、模型執行、POSIX 或官方 conformance 的證明。


## v0.11：同一歌詞操作的整批與逐句編修

lyrics（MCP lyrics_validate）的來源仍明確二擇一：cues，或 content＋suffix。新增可選 payload：

| 欄位 | 形狀與行為 |
| --- | --- |
| shift_seconds | 有限十進位數字或數字字串；正數延後、負數提前，已有 start／end 一起移動 |
| time_changes | 字串陣列，例如 ["1=2"]；修改開始，有明確 end 時保留原句長 |
| text_changes | 字串陣列，例如 ["2=新的歌詞"]；文字空白保留，仍只接受單行 |

```json
{"protocol_version":1,"id":"timing-001","operation":"lyrics","payload":{"cues":[{"start":1,"end":2,"text":"原創一"},{"start":4,"end":5,"text":"原創二"}],"duration":10,"shift_seconds":0.5,"time_changes":["1=2"],"text_changes":["2=第二句後修"]}}
```

輸出第一句 2–3、第二句 4.5–5.5，duration 仍為 10。句號先按原始開始時間排序，由 1 起算；先 shift，再逐個 time_changes／text_changes，最後重排／檢查。原始負時間拒絕；最終負時間、重疊、重複開始或超過指定總長整份拒絕，沒有截斷。缺失 end 在編修後推得，LRC offset 只套用一次。time_changes／text_changes 型態錯誤不是成功 no-op。

時間以毫秒整數運算，半毫秒往遠離零捨入；布林值、非有限值、非十進位字串及不能保留毫秒精度的值拒絕。timing.applied_shift_seconds 僅在明確傳入 shift_seconds 時新增，表示套用的正規化量；沒有宣稱實聽驗收。非零 shift 或非空編修清單的成功結果 needs_review=true；原有總長／推得時間提醒仍保留。輸出 files 仍是內容，由呼叫者決定保存，Agent 不因此寫檔。

實際 CLI／HTTP／JSON-lines／MCP 與 application 結果一致；discovery 同源新增欄位，預設四工具／啟庫九工具不變。產品 0.11.0，transport 與草稿／保存／備份 schema 不變；尚未接入特定 host，沒有模型呼叫。

## v0.12 音檔結果的來源證據

既有 audio／audio_report 回傳新增 data.source_evidence：bytes、analysis_source（copied_bytes）、wave_format_tag（1）、block_align、average_bytes_per_second、declared_riff_bytes。data.sha256 與量測使用同一次複製的位元組，沒有 hash 後再次開原路徑；不是外部改檔的原子快照或著作權證明。JSON／Markdown 同源，不含暫存或原資料夾路徑。

PCM fmt 不一致或截斷會明確失敗；來源保留，錯誤後可再呼叫。接受值可自訂但不擴大已支援格式；多聲道不解讀位置，仍有 needs_review。報告沒有提醒只表示本次技術檢查通過，不能當實聽、LUFS／true peak、完整 RIFF conformance 或版權驗收。

產品 0.12.0；Agent v1／MCP 2025-11-25 不變，預設四／明確啟庫九工具，未新增 JSON 路徑選擇、工具或權限，特定 host 未整合。

## v0.13 設計結果在工作台的接收

music／storyboard及MCP的music_plan／storyboard_plan仍共用同一application結果。工作台新增純planning-review呈現modern設計資料；只接收當前編修版本對應的結果，過期不取代，修改後既有摘要標為上一份設計。由Agent／CLI接續需求的預覽／載入流程保持；設計結果本身不被當成草稿或生成媒體。

本版真正CLI四／五檔UTF-8 bytes、HTTP、JSON-lines壞後好、MCP握手／discovery／call與application已核對，純模型也測真正application結果。產品0.13.0；Agent1／MCP2025-11-25、四／九工具與草稿／保存／備份schema不變；特定host未整合，沒有模型呼叫或權限新增。

## v0.14 分鏡時間起稿

新增 JSON-lines operation／MCP tool `storyboard_seed`，HTTP `/api/storyboard-seed`；payload 為 `{ "music": 現代歌曲brief, "fps": 24, "bars_per_shot": 4 }`。只接受 music／fps／bars_per_shot，music 必須含 arrangement／bpm／memory_hook 與歌曲基本欄位。fps1–120；bars_per_shot為1–128整數（預設4）。重新讀取 discovery，不硬編碼工具數；目前預設五／啟庫十工具。readOnlyHint=true，Agent 不自行寫檔／生成媒體，CLI依明確out寫檔且預設拒絕覆寫。

回應 files 含 storyboard-seed.json／md，data為 format=zoe-storyboard-seed、schema_version1、status=timing_seed_incomplete。source記錄固定BPM／拍數／段落，小節1-based閉區間；時間end及end_frame_exclusive為排他端點。slots只有時間、影格、小節、段落與來源敘事任務，沒有畫面／人物的虛構內容；needs_review永遠true。上限1000鏡、不足一影格拒絕，時間須按實際歌曲校準。

此中間JSON不能當mv-brief載入。瀏覽器先讀歌曲brief，再預覽／套用自己的起稿；或由協作Agent根據slots補寫創作欄位、另交完整mv-brief並經storyboard驗證。不能把未完成seed當完成分鏡。純模型版本拒絕與late回應保護見ARCHITECTURE，CLI／HTTP／JSON-lines／真正五工具MCP及瀏覽器草稿往返見QA-v0.14.0。沒有特定host安裝／模型工具呼叫驗收。

## v0.15 起稿檢查與瀏覽器接續

storyboard_seed沿用原工具，增加payload `{ "seed": 已生成的zoe-storyboard-seed資料 }`。不可與music／fps／bars_per_shot混用。tools/list、--describe與/api/capabilities提供oneOf和完整seed schema；需要新功能先重新discovery，不硬編碼只接music。預設五／啟庫十工具不變。

validate_seed精確核對source段落與BPM／拍數／bars推得時間、所有slots／小節／影格和來源敘事任務。傳入未知版本、未知欄位（包括新增visual）、不完整／非有限值／矛盾狀態都拒絕，不修正或丟失。創作由Agent發展時另交完整mv-brief；時間seed不是成片或完成分鏡，needs_review=true。

CLI `storyboard-seed --seed 起稿.json --out 新目錄`檢查並輸出兩檔，不能覆蓋FPS或每鏡小節設定；原檔保留，重跑預設拒絕覆寫。瀏覽器用「接續Agent／CLI起稿」選JSON，預覽後才套用；不要求目前歌曲與檔案同名，保留目前歌曲及其他panel／音檔。目標分鏡修改後重新預覽，沒有靜默覆蓋。

本輪真正MCP stdio產生→CLI同bytes→IAB讀回→下載JSON／draft3與撤回、錯誤恢復已驗；特定Agent host／模型仍未接入，沒有擴大權限。數字格式／換行可重新排版，保留JSON語義，沒有原檔bytes不變的下載宣稱。

## v0.37 原接受條件接續

`audio`／`audio_report` payload 可嵌入 acceptance_draft schema1；不能與 profile／rates／bits／channels 混用。discovery新增 audio_acceptance_draft descriptor及input schema；基本10／啟庫15工具、Agent1及MCP版本保持。media仍由啟動參數選定。report會交回原條件JSON與實際acceptance；未完成原值可以保存，但分析拒絕。詳見[AUDIO-ACCEPTANCE](AUDIO-ACCEPTANCE.md)。

## v0.45

v0.45產品與明確交付來源38–45同步，12／17工具、Agent1／draft3及交付schema保持。限定PID程序補查只供開發維護CLI，沒有新增Agent／MCP程序或清除權限。見[維護契約](PROCESS-PROBE.md)。


## v0.52 歌詞建立與回讀來源

校時建立從本次送出的 cues／總長或完整 package 派生期望，核對完整回應、時間來源／歷史說明、嚴格JSON及字面LRC／SRT後才替換表格與成果。純 lyrics-result 共用建立及所有帶時間匯入；錯來源／損壞／不完整保留原編修、上一份成果及待套用校時。raw JSON也核對原句，seed保持。HTML只核對存在與字串、不完整語義驗證；wire／schemas／12／17 tools不變。產品0.52／交付來源38–52，原schema與Agent操作保持；不是模型或實聽驗證。


## v0.55 完整歌詞預覽核對

Python fixed assets/lyric-preview.html + 同一套 timing／strict JSON／package／media模組 → render_preview／公開固定template1 script → application既有HTTP／CLI／Agent／MCP。JS lyrics-preview純有界來源與整份HTML核對 → lyrics-result共用guard → injected import／app current revision → DOM與成果提交。範本與模組不取使用者路徑；回傳HTML不執行。完整來源2MiB、encoded JSON12MiB、HTML16MiB、contract256KiB；未知schema拒絕，物件key排序與數字拼法不作來源證明。固定HTML外框逐字比較；只接受本安裝的共用範本與模組，非通用HTML安全或作者／版權證明。产品55／明確交付來源38–55、13／18tools、Agent1／draft3／review1／source1保持。見[契約](LYRICS-PREVIEW.md)。下方較早HTML僅存在的描述保留歷史，以此輪為準。


## v0.56 獨立預覽格式保留

既有shared export-review同步analyzeSource／public analyze → async完整report來源SHA（原wire）或offline controller有界view → literal DOM presenter／revision定位 →固定preview範本。Controller只保留counts／前20issues／固定notes／stale及revision，沒有歌詞全文／media／DOM／網路；current edit／delete／add／stamp／duration及media adoption／undo均invalidate，成功Apply才accept按已排序rows定位。DOM只文字與焦點，舊callback帶revision拒絕。同步提示不依賴WebCrypto，完整Agent report仍沿原SHA功能。Python固定producer嵌入LRC grammar／export rules／controller／presenter，template1 whole-envelope核對包含這些程式。產品56／來源明確38–56、13／18、Agent1／draft3／review1／source1／template1保持；HTTP與授權邊界無diff。詳見[契約](LYRICS-OFFLINE-EXPORT.md)。


## v0.57 獨立歌詞下載分層

純lyrics-download.select驗證完整package／明確三格式後回傳固定name+content；不取DOM／media或保存狀態。共享text-download模型嚴格準備UTF8 bytes，text-download-dom新增createController factory沿同internal sendPrepared，既有form bind也沿該factory。預覽select先驗格式、執行既有Apply，再取完整目前data；adapter只建Blob與暫存anchor，兩pending上限／排程或離頁回收，失敗不留ownedURL。onSent是已提交click+schedule，與實際saved file區分；成功Apply已提交的編修不因下載失敗撤回。Python固定producer另嵌入formatter與web兩共享原生模組，無外部script URL；whole-envelope template1檢查包含新內容。產品57／來源明確38–57、13／18、Agent1／draft3／review1／source1／template1保持。見[契約](LYRICS-DOWNLOAD.md)。


## v0.58 完整來源Unicode邊界

json_document.utf8_bytes與json-document.assertUnicode共享既有嚴格Unicode規則，Python decoder亦沿同helper而不重複編碼；native parser保留既有private呼叫。完整lyrics_package／lyrics-package在schema與時間檢查後，逐一核對title／cues.text／review_notes，再容量與隔離回傳。valid原字元不正規化或替換；非法UTF16/Unicode不能以JSON escape繞過package驗證。revise／legacy／download／offline診斷／application／固定preview共用domain；原生runtime右值validate失敗不提交data或render／transport，修好可retry。Agent raw JSON早拒絕invalid_request原行為保持，連續good/bad/good不影響後續。產品58／來源38–58、13／18、Agent1／draft3／review1／source1／template1保持。見[契約](LYRICS-UNICODE.md)。


## v0.59 固定交付版本契約

`musiclab/assets/delivery-versions.json` 是產品版本與交付來源版本的唯一執行期資料源；`delivery_versions.py`／`delivery-versions.js` 純驗證後隔離保存，未知schema／缺失／錯序／重複／非標準版本即拒絕。Python package與inspection、browser package/import/report、application Agent／MCP metadata共用；schema和protocol不由產品版本推導。固定GET契約script沿既有本機Host／Origin門檻，無任意路徑或寫入。更新產品只改registry current及明確supported項，projects.json發布metadata需一致；歷史支援不靠range推測。測試保留獨立歷史oracle；封裝必須交叉核對registry／metadata／discovery。見[契約](DELIVERY-VERSIONS.md)。


## v0.60 ZIP核對的本地失敗狀態

`delivery-import` controller持有scope/latest job失敗；view/status加隔離nullable failure `{code,message,truncated}`，message最多240 Unicode字元加ellipsis。只屬本地UI metadata，原HTTP/Agent/MCP wire與schemas不變。early invalid/busy與讀取／完整核對拒絕皆保持原成果；onError原error callback不改寫。新選檔／cancel／apply／undo清除，scope refresh清除，old/cancelled promise不恢復錯誤。DOM literal text保持local role=status，失敗可清除／重選，clear只走既有cancel，不取消scoped undo。相同note不重寫，減少普通refresh重複live通知；未做真人screen-reader驗收。見[契約](DELIVERY-FEEDBACK.md)。


## v0.61 音檔報告数值核對

`audio-statistics.js`是無I/O、無UI的整數PCM bounds validator；`audio-review`在組成presentation／onResult之前呼叫。固定HTTP asset／index dependency提供同一模組；CLI、Agent、MCP、HTTP依原共用Python application產生報告，跨語言實際producer matrix確認可讀。影格／時長／bytes、peak/RMS/null/DC/full-scale、安靜邊界与mono/multichannel correlation互相核對；只驗證報告自洽，不重算PCM／響度、不證明實聽、授權或SHA對所選瀏覽器File的獨立核對。原report schema、loudness1／acceptance-draft1、Agent1／project draft3保持。見[數值契約](AUDIO-STATISTICS.md)。


## v0.62 音檔回覆與所選File來源

`audio-file` native File.arrayBuffer/WebCrypto SHA-256 → `audio-result`純exact envelope/current product/protocol/raw JSON/file-set/source-echo核對 → `audio-review`既有PCM/loudness presentation/inspect → app DOM。兩async邊界重新核對原File identity/revision/profile/rawdraft，過期hash/error不upload/回寫；只保留64字元digest，read buffer不持久快取，64MiB既有選檔上限保持。preset與draft都走完整來源guard；live response須與固定頁面current product相同，legacy buildReview label保持另行使用。report.md只核對非空有界有效Unicode文字，不宣稱語義重算。見[AUDIO-RESULT](AUDIO-RESULT.md)。


## v0.63 音檔完整文字報告

純audio_report.py／audio-report.js canonical render → audio_bundle共用application（CLI/Agent/MCP/HTTP）／audio-result checked逐字MD → 原audio-review PCM/LUFS/current → DOM。取代v62僅非空Unicode的MD檢查；JSON量測、原媒體／schema／protocol保持。固定小數是顯示契約，null明示不可測；全文有效Unicode／8MiB，錯誤／late保留原結果。數字契約見[AUDIO-REPORT](AUDIO-REPORT.md)，非實聽、重測或權利證明。


v0.77追加：UTC.compare以原始Unicode codepoint比較，list/search沿Python stored_at+ASCII ID排序；不以UTF16比較、Date或locale替代原source順序。完整timestamp驗證與原字串保持，matched tuple/continuation/原schema保持，見UTC-TIMESTAMP契約與QA final收據。
