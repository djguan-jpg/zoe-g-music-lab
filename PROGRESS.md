# 進度：目前 v0.52.0

## v0.52.0

2026-10-04：校時建立從本次送出的 cues／總長或完整 package 派生期望，核對完整回應、時間來源／歷史說明、嚴格JSON及字面LRC／SRT後才替換表格與成果。純 lyrics-result 共用建立及所有帶時間匯入；錯來源／損壞／不完整保留原編修、上一份成果及待套用校時。raw JSON也核對原句，seed保持。HTML只核對存在與字串、不完整語義驗證；wire／schemas／12／17 tools不變。442／672／55 syntax／4 Skills，一新Python＋十八新JS／HTTP／application跨語言／原生tab87故障保留及重試／完整package歷史／三寬度、v51 ZIP441／654還原通過。tab87關閉、server原handle exit0、lazy staging未建立。指定private發布／實際遠端／latest52／51／50及typed jobs依收據。正式媒體／完整視覺／Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.51.0

2026-10-04：SRT 尾空白／Unicode原文遺失、direct BOM差異與browser wrong-source回應已重現並修正；Python／JS SRT純層、shared timed-source guard完成。441／654／54 syntax／4 Skills，十三個新Python＋十三個新JS、CLI／JSON-lines／MCP／HTTP／cross-language、原生校時兩種總長／撤回／重讀／export、v50 ZIP428／641還原通過。LRC Unicode候選未重現，原LRC維持。tab85／86關閉、viewport reset、server原handle exit0／lazy staging未建立。private exact-source／actual遠端／latest51／50／49及typed jobs依收據。正式媒體／實聽／完整視覺／特定Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.50.0

2026-10-04：四種 LRC 原文遺失重現並修正；Python／JS 純解析分層、瀏覽器 source-response 核對完成。428／641／53 syntax／4 Skills，十二個新 Python＋十二個新 JS、CLI／JSON-lines／MCP／HTTP／cross-language／原生校時及 v49 ZIP416／629還原通過。tab84關閉、viewport reset、server原handle exit0、lazy staging未建立。private exact-source／actual遠端／最新50／49／48與typed jobs依收據。瀏覽器下載事件15秒逾時，保存檔未確認，未再點擊；正式媒體／實聽／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.49.0

2026-10-04：搜尋上一批與有界cursor history／command generation／DOM焦點完成；只留512對數字，不保留歷史全文或context，前進不限批數。416 Python／629 JS／52 syntax／4 Skill；十個新回歸、四台原生鍵盤往返／前後來源／編修失效／Undo與三寬度DOM、v48 ZIP416／619還原通過。tab82／83關閉、viewport reset、server原handle exit0及staging未建立。private exact-source發布／actual遠端與latest3／typed jobs依收據；正式媒體／完整視覺／Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.48.0

2026-10-04：大檔 current／讀取／refresh 不再複製及JSON序列化全文；純plain source snapshot／精確比較、controller full status與metadata view、DOM及單份preview cache分層。合成Node約8MiB／30次14,060.47ms→0.99ms、序列化2,516,606,400 chars→0，非瀏覽器速度或heap保證。416 Python／619 JS／52 syntax／4 Skill；原生四台、雙大檔來源各10次Next／尾端／明確Apply／後續編修失效與Undo保留編修、v47 ZIP416／602還原通過。tab81關閉、QA server原handle exit0及staging未建立；exact private發布／actual遠端SHA與latest3／typed jobs依收據。正式媒體／完整視覺／Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.47.0

2026-10-04：context1命中前後文完成，純UTF8／presentation／search opt-in／全份ZIP application／adapter及DOM分層；64-byte兩側／1152單項、單buffer共用，預設位置回覆保持。416 Python／602 JS／51 syntax／4 Skill，四台新頁面原生UI、8MiB尾端／保留來源／失效／Undo保留編修／三寬度DOM與v46 ZIP408／594還原通過。QA server正常關閉後metrics錯取未建立staging，原handle exit1與補證port0如實保留。exact private發布／actual遠端SHA及latest3／typed jobs依本輪收據。正式媒體／完整視覺／Host／瀏覽器全文保存／FreeTWAI仍待，rolling active。

## v0.46.0

2026-10-04：原文搜尋／直接定位完成，text-search1／完整ZIP application／CLI／Agent／MCP及Browser KMP／searcher／DOM分層，單buffer8MiB與reader共用、20筆有界結果，SHA pin接續及current source失效保護。408 Python／594 JS／50 syntax／4 Skill；四台原生UI、8MiB尾端與保留來源、empty／missing／literal、Enterfocus、三寬度DOM、Apply／Undo及v45 ZIP398／582還原通過。本輪下載送出但保存事件未核實；正式媒體／完整視覺／特定Host／FreeTWAI仍待。private exact-source與實際遠端SHA、latest3／typed jobs依本輪收據，rolling active。

## v0.45.0

2026-10-04：新增限定PID本機CIM補查；嚴格probe1、±9 ticks不確定範圍、清除保護與原handle退出保持。398 Python／582 JavaScript／48 syntax／4 Skill與diff通過。 原生父／子程序、6 ticks差值與正常退出核對通過；v44 ZIP387／582還原。指定source／privatePR／Release／actual remote SHA與latest3／typed run依本輪收據。正式媒體／實聽／完整視覺／Host／FreeTWAI仍待，rolling active。

2026-10-04：完整ZIP核對後可按UTF-8 byte boundary分段閱讀，text-window1／application／CLI／Agent／MCP及Browser純模型／controller／DOM分層。非零位置pin前次ZIP SHA，來源變更拒絕；原文4–16KiB有界，Browser單buffer8MiB／history512，前後段／回開頭與兩來源保持baseline。387Python／582JS／48syntax／4Skill；四台20段到EOF顯示核對，4份全文下載同ZIP bytes／SHA，原WAV、後續編修、晚回應取消、鍵盤focus及三寬度DOM通過。v43 ZIP377／572還原，private exact-source發布／actual remote bytes與latest3／typed run維護依收據。正式媒體／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.43.0

2026-10-04：完成全份 ZIP 核對後的明確原檔選取，pure selection1／共用 application／CLI／Agent／MCP 及唯讀 browser 原文下載分層。8 MiB／64檔可選小檔，512 KiB序列化 JSON cap保持；缺檔或未選取檔損壞整次拒絕。377Python／572JS／46syntax／4Skill；四台12檔加8388526-byte全文共13份實際下載同 ZIP bytes／SHA，baseline／後續編修／原WAV保持。取消晚回應、套用撤回、三寬度DOM與前版 v42 ZIP365／565還原通過。private exact-source／遠端核對／latest3與typed run維護依本輪收據；正式媒體／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.42.0

2026-10-04：完成共用原文 UTF-8 bytes／注入 controller／native Blob DOM，修正 form 換行與2MiB body截斷交付。五種文字入口 current source 重查，失敗不新增待確認，URL最多2個且1秒釋放；長文 preview32768units不拆emoji、完整來源與ZIP保持。365Python／565JS／46syntax／4Skill；四台13檔與原ZIP逐bytes一致、正好8MiB重下載、2份Python報告／draft3／stored版本／acceptance1真下載回讀通過，後續編修／原WAV SHA保持。三寬度DOM與v41 ZIP365／554還原通過；private exact-source發布／遠端hash及latest3／typed run維護依收據。正式媒體／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.41.0

2026-10-04：完成可保存的交付差異JSON／Markdown與來源ZIP SHA，controller過期來源拒絕；原生form encoded文字回復原bytes，四scope8份真下載與Python相同。launcher明確WAV／ZIP完整設定，在另一cwd實際MCP兩工具接受；default text output exclusive create修正race，同名新檔保持，多檔部分輸出明示。365Python／554JS／44syntax／4Skill；原WAV SHA、鍵盤Apply／Undo／取消晚回應、390／1024／1800geometry通過；v40 ZIP349／546還原通過。private exact-source PR／Release與遠端byte及latest3／typed-run維護依收據；正式媒體／完整視覺／Host／FreeTWAI仍待，rolling active。

## v0.40.0

2026-10-04：完成ZIP替換前精確原文差異／新增變更移除相同／換行計數／有界預覽及面板寬度排版；pure domain／application／adapter與跨語言model／controller／DOM分層。局部比較候選再查token／target，晚到不覆蓋新摘要，表單／媒體／全文保持；comparison1與其他schema獨立，12／17保持。349Python／546JS／43syntax／4Skill，四台原生對照／Enter載入撤回、5包真下載逐bytes同源、40000字全文／原WAV SHA與390／1024／1800px通過；v39 ZIP340／531還原。private發布／exact source／remote bytes及latest3／typed run維護依收據；正式媒體／完整視覺／Host／FreeTWAI仍待，rolling active。

## v0.39.0

2026-10-04：完成四台文字交付ZIP接續、原清單與SHA核對、預覽／明確載入／限定撤回；純domain／application／四adapter／controller／DOM分層。表單／媒體保持、原label再封裝，取消／late／跨scope拒絕；12／17工具，inspection1／package1／Agent1／draft3獨立。340Python／531JS／4Skill／42syntax及diff，原生5包下載讀回逐檔相同、原WAV SHA、390px Enter／1366px清單寬度及新文件成功提示通過；v38 ZIP328／491還原。private發布、source／remote bytes與latest3／typed run維護依本輪收據；正式媒體／完整視覺／Host／FreeTWAI仍待，rolling active。

## v0.38.0

2026-10-04：完成本輪全部文字成果ZIP／manifest1及四入口分層；基本11／啟庫16，Agent1／draft3保持。328Python／491JS／4Skill／39syntax，原生四工作台5次下載／逐檔SHA及未逾時取消／重建、390px鍵盤與1366pxDOM幾何通過；合成WAV原檔保留。v37 ZIP312／460還原通過。私有發布及限定run／latest3維護以本輪收據核實，正式媒體／實聽／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.37.0

2026-10-04：音檔自訂接受值與獨立原值條件草稿完成，model／controller／DOM及共用application／四adapter分層；shape保存未完成原文、active精確正整數，未知／來源不符／late拒絕。原音檔及限定套用其他panel保持，條件另存與draft3／下載確認分開，整份project載入回示範而raw仍在。312Python／460JS／4Skill／37syntax、四入口與HTTPUnicode界限／精確小數，原生download回讀、4秒late／500、390px Enter及1366px接受；v36 ZIP300／443解壓還原通過。指定source／privatePR／Release／遠端bytes／restore及latest3限定run收據跟進；兩QA server正常停止、tab59關閉／viewport reset。正式媒體／實聽／完整視覺／特定Host／FreeTWAI尚待，rolling active。

## v0.36.0


2026-10-04：四工作台建立旁狀態／查看成果／返回、清空後build fallback，純presentation／controller／DOM分層；沿既有bundle／busy／dirty及revision來源保護，不進draft3／wire。300Python／443JS／4Skill／35syntax、12新測試；390px／1366px四工作台原生成果及焦點往返，busy／500／4秒晚回應／原音檔保持、實際report／draft3下載讀回、真draft載入清空返回build。v35指定ZIP300／431還原通過；指定source封裝／privatePR／Release／遠端bytes、restore／限定run與latest3依收據。三QA server正常停止、tabs57／58關閉與viewport復原；正式媒體／實聽／完整視覺／Host／FreeTWAI仍待，rolling active。

## v0.35.0

2026-10-04：完成可重用維護工具，pure policy／Windows單handle唯讀／filesystem-Git／CLI分層；run1／audit1／recovery1分開，10／15工具與Agent1／draft3保持。creation identity排除PID重用、活動／未知阻擋；封裝latest3／嚴格七天／exact tag及Git bytes／preview token／journal先保存與無覆寫還原。300Python／431JS／4Skill／33syntax，19新增維護測試及合成真CLI清除一版、8檔bytes恢復、Windows handle與live server正常退出、原生四工作台／draft3讀回、v34 ZIP281／431還原通過。指定commit封裝／private PR與Release／遠端bytes／restore與最終限定維護依本輪收據；正式媒體／實聽／完整視覺／Host／FreeTWAI／原生file播放仍待，rolling active。

## v0.34.0

2026-10-04：完成原分鏡時間診斷及四adapter／工作台定位，與創作欄位／完整建立分層；秒數和影格各自核對，原值、順序、媒體及保存狀態保持。281Python／431JS／4Skill／33語法／diff；103跨語言及完成時鐘接受、11組IAB、三原生report／CLI草稿3／Agent與10／15工具、390px Enter、晚回應／500／來源／版本不符保護、1000列／2000待辦計數、24影格完整包。前版v0.33 ZIP267／413還原與暫存移除通過；指定commit封裝／privatePR／Release／遠端bytes／restore及限定PID、latest3依本輪收據。正式媒體／實聽／完整視覺／特定Host／FreeTWAI／原生file播放仍待；rolling active。

## v0.33.0

2026-10-04：完成真實瀏覽器原值遺失修正：數值／未知畫幅12值與特殊欄位8值，草稿四panel逐值相等；純raw-fields／DOM adapter／既有domain分層，排序與三工作台刪除還原、明確編修、原值報告及四adapter一致。267Python／413JS／四Skill／32語法／diff、24IAB、原生草稿／兩報告、390px Enter／4秒晚回應／foreign來源／原音檔6秒／確認另存；修正後歌曲136秒、分鏡576影格及歌詞6秒完整建立。前版v0.32指定ZIP267／400解壓還原通過。指定commit封裝／privatePR及Release／遠端實際bytes／restore與限定PID、latest3盤點依本輪收據。正式媒體、實聽、完整視覺、特定Host、FreeTWAI及原生file播放仍待；rolling active。

## v0.32.0

2026-10-04：分鏡唯讀storyboard_review、CLI原欄位／modern草稿、HTTP／JSON-lines／MCP與工作台報告完成；pure domain／application／四adapter、raw schema、共享readiness-report回覆核對與DOM分層。9／14工具、report1與舊protocol／schema分開；原鏡號／母題ID／原字串／音檔／另存確認保持。267Python／400JS／四Skill／30語法、64跨語言report／Markdown、27IAB／兩native／四adapter／真draft3→CLI及Agent、390px Enter／母題相關原列／35待辦20定位／4秒晚回應／完整時間重疊拒絕與576影格通過。前版v0.31 ZIP258／391還原；指定commit封裝、privatePR／Release／遠端bytes／PID與最新三版盤點依收據。正式媒體／完整視覺／特定Host／FreeTWAI／原生file仍待，rolling active。

## v0.31.0

2026-10-04：共用唯讀 music_review、CLI原欄位／modern草稿、HTTP／JSON-lines／MCP及工作台明確待辦報告完成；純診斷／report、application／四adapter、schema／JS完整回覆核對與DOM分層。8／13工具，protocol與舊schema保持，原值／原列／音檔／另存狀態保持；來源不同／未知版本／晚回應保留。258Python／391JS／四Skill／29語法、75報告／Markdown跨語言、18IAB／兩native／四adapter／實draft3→CLI及Agent、390px Enter／4秒晚回應通過。前版v0.30 ZIP249／382還原；指定commit封裝／privatePR／Release／遠端bytes與最新三版／PID依收據。正式媒體、完整視覺、Host、FreeTWAI及原生file仍待，rolling active。

## v0.30.0

2026-10-04：歌曲欄位待辦與建立／起稿前原位置定位，修正有效 BPM 120.0004 被 HTML 步長拒絕。純數值與文字規則、歌曲診斷、共享歌曲／分鏡快照控制器及 DOM 分層；40 段／200 明細／20 UI，修改或排序停舊位置、載入清暫態。249 Python／382 JS／四 Skill／29 JS 語法、69 欄位與 29 數值跨語言、26 IAB／四 adapter／四 native／實 draft3、Agent17鏡套用／撤回／390px Enter／晚回應通過。前版 v0.29 ZIP246／367還原；指定提交封裝／private PR／Release／遠端 bytes 及最新三版／PID 依收據。正式媒體、完整視覺、Host、FreeTWAI 及原生 file 仍待，rolling active。

## v0.29.0

2026-10-04：歌曲段落前移／後移與限定撤回，純順序／注入controller／DOM分層；同名與原欄位保持，後續文字／小節保留，結構變更或歌曲載入清舊紀錄。歌曲／起稿重建同序、既有分鏡／音檔保持；246Python／367JS／四Skill／26JS語法、10跨語言與21IAB、四adapter／四native／真draft3、Agent18鏡限定接續／撤回／390px Enter／晚回應通過。前版v0.28ZIP244／353還原；指定commit封裝／privatePR／Release／遠端bytes及最新三版／PID依收據。正式媒體／完整視覺／Host／FreeTWAI／原生file仍待，rolling active。

## v0.28.0

2026-10-04：分鏡創作待辦與建立前精確定位，純必填／引用、注入原始快照controller、DOM分層；其他panel／音檔保留，修改停舊位置、載入清暫態，待辦零仍須完整驗證。244Python／353JS／四Skill／25JS語法、59真Node／Python與27IAB、五native／draft3／四adapter、實際Agent17鏡102待辦與390px Enter通過。前版v0.27 ZIP241／336還原，指定commit封裝／privatePR／Release／遠端bytes和PID／最新三版依收據。非商用／private／schema保持；正式媒體／完整視覺／Host／FreeTWAI與原生file仍待，rolling active。

## v0.27.0

2026-10-04：修正新增／刪除鏡頭覆寫作品宣告，純時間／影格候選、注入controller及DOM分層，明確接續／限定撤回與實際after保護。241Python／336JS／四Skill／24JS語法、60跨語言及25真IAB，四adapter／五個native下載／真draft3／390px Enter與原生音檔保持；前版v0.26 ZIP239／321還原。指定commit封裝／privatePR／Release及遠端bytes依收據確認，最新三版與確定PID盤點。各schema／七與十二tools、非商用／private保持；完整視覺／正式媒體／Host／FreeTWAI與原生file仍待，rolling active。

## v0.26.0

2026-10-04：同名不同需求與JSON矛盾拒絕，建立／需求回讀共用純來源核對，修正歌名空白，原文／秒數／音檔及後續編修保持。239Python／321JS／四Skill／23JS語法、60跨語言與28真IAB、九個下載及draft3／四adapter／390px／Enter通過；前版v0.25 ZIP234／305還原。指定commit封裝、privatePR／Release／遠端bytes和PID依manifest收據確認。CSV／MD沒有瀏覽器逐字重算；正式媒體／完整視覺／Host／FreeTWAI及file:原生仍待，滾動目標active。

## v0.25.0

2026-10-04：可定位校時待辦與唯讀lyrics_review schema1，純Python／sharedJS／controller／DOM分層，原列／空白／source／media保持，沒有猜時間／裁切。七基本／啟庫十二tools；234Python／305JS／四Skill／22JS語法、50組跨語言／10000句邊界、21真IAB／四adapter／實檔／390px與Enter通過，前版v0.24 ZIP221／289還原。指定commit封裝、privatePR／Release／遠端bytes和確定PID以manifest收據核對。完整視覺／正式媒體／Host／FreeTWAI與獨立file:原生仍待，滾動目標active。

## v0.24.0

2026-10-03：修正選音檔默默改宣告總長，純共用時長比較／注入controller與DOM adapter分層；明確採用／撤回只改時長，原本空白且未編修才接續，source／cue／媒體保持。221Python／289JS／四Skill／21JS語法、20真IAB、四adapter／實檔／390px／Enter通過，前版v0.23 ZIP217／263還原。指定提交封裝、privatePR／Release／遠端bytes與確定PID以manifest和收據核對。file:原生離線驗證被工具政策阻擋，仅驗source VM；完整視覺／正式媒體／Host／FreeTWAI仍待，滾動目標active。

## v0.23.0

2026-10-03：修正分鏡1 ms內重疊／空缺／尾鏡影格不符；純共用映射／完成覆蓋及schema1宣告，JSON／CSV／提示稿／摘要同範圍，原秒數與FPS保持。另修正真下載草稿工具版本過期。217Python／263JS／四Skill／20JS語法、20項IAB、四入口／實檔／390px／Enter通過，前版v0.22 ZIP還原200／247。指定提交封裝、private PR／Release／遠端bytes與本輪PID以manifest及收據確認。非商用／private保持；正式媒體／Host／完整視覺／FreeTWAI仍待，滾動目標active。

## v0.22.0

2026-10-03：補齊獨立LUFS整合響度，純K-weighting／兩道gate、nearest-sample串流量測與有界自有ledger分層，同份SHA／PCM／RMS來源。不可測保持null與原技術接受結果，audio_loudness schema1與產品／協定分離。200Python／247JS／四Skill／19JS語法，20組原創WAV與FFmpeg最大差0.009464LU、26真報告JS核對；24項IAB、四adapter／實檔下載／錯誤與晚到／390px／Enter通過。前版v0.21 ZIP182／237可還原。指定提交封裝、私人PR／Release／遠端bytes與本輪PID以manifest及收據確認。非商用／private保持；完整規範／true peak／正式實聽／Host／視覺／FreeTWAI仍待，滾動目標active。

## v0.21.0

2026-10-03：修正編修離頁缺少提醒，純草稿內容 checkpoint、注入事件 controller、DOM adapter 分層；晚到保存只確認當時版本，下載需明確確認，現代檔案／保存版本明確載入才作比較。範例晚到保留編修，下載在同源框架中完成。182 Python／237 JS／四 Skill／19 JS 語法與29項 IAB，真 Agent 保存接續、四秒成功／500、下載／回讀／撤回／390px Enter及PCM通過。前版v0.20 ZIP180／220可還原。指定提交封裝、私人 PR／Release與遠端 bytes 以manifest和收據確認。離頁提示受瀏覽器互動與生命週期限制，完整視覺、正式作品、特定Host與FreeTWAI仍未完成；滾動目標active。

## v0.20.0

2026-10-03：共用嚴格JSON／UTF-8層修正需求損壞文字與重複版本被接受，外部CLI／HTTP／stdio／草稿保存與三個原生選檔入口共用，領域schema及六／十一工具保持。180Python／220JS／四Skill／十八JS語法，31項IAB含正常adapter接續、編碼／重複拒絕、音檔／晚回應保護、實檔下載／讀回與390px DOM。前版v0.19 ZIP168／206可還原。精確提交ZIP／private PR／Release與SHA以manifest與遠端收據為準；完整視覺、正式作品、特定host與FreeTWAI仍未完成，滾動目標active。

## v0.19.0

2026-10-03：完整歌詞包schema1保留名稱、宣告總長與待核對來源，嚴格JSON／未知版本拒絕、舊完整包明確轉換，工作台與離線編修共享契約。168 Python／206 JS／四Skill／十七JS語法；26項IAB含四adapter實檔、十秒音樂尾奏、推估提示、時長衝突、延遲／500、草稿讀回及390px／Enter。前版v0.18 ZIP156／189可還原。精確提交ZIP／private PR／Release及SHA以manifest、遠端下載收據為準。完整視覺、正式作品、特定host與FreeTWAI未完成，滾動目標active。

## v0.18.0

2026-10-03：歌詞TXT／LRC／SRT／JSON統一預覽後明確套用、取消與限定撤回；嚴格UTF-8／BOM、原文與留白起稿保持，修正慢讀取覆蓋與立即替換表格。156 Python／189 JS／四Skill／十六JS語法通過，CLI／JSON-lines／MCP真實產物接續，IAB延遲／取消／重選／下載及手機DOM證據見QA-v0.18.0。v0.17 ZIP156／168可還原。精確提交ZIP／private PR／Release以manifest及遠端收據為準。完整視覺、正式作品、特定host與FreeTWAI仍未完成，滾動目標active。

## v0.17.0

2026-10-03：完成已有歌詞→未校時起稿、Agent／CLI起稿讀回、預覽／取消／限定套用／撤回；保留原文與重複句，開始／結束留白。修正空白句不能記下播放位置，分別標記及整句移動、部分已校時播放；空白匯出拒絕。156 Python／168 JS／四Skill／十五JS語法，真正四adapter、三格式與草稿下載／讀回、音檔保留、晚回應／500保護及390px DOM／Enter通過；v0.16 ZIP146／146通過。精確提交ZIP／private PR／Release以manifest及遠端收據為準。完整視覺、正式作品、特定host與FreeTWAI仍未完成，滾動目標active。

## v0.16.0

2026-10-03：修正需求／保存版本預覽後覆蓋編修，現代草稿加入明確預覽／載入／取消；共用純replacement-preview、scope／全panels及原生File身份核對，讀取／預覽後改動保留內容。146 Python／146 JavaScript、四Skill／十三JS語法；真正Agent保存→HTTP清單／預覽／拒絕／載入／撤回、實檔草稿下載／讀回、音檔／延遲／錯誤／legacy／BOM／未知版、390px DOM及Enter焦點通過，v0.15 ZIP146／121通過。見docs/QA-v0.16.0.md；精確提交ZIP／private PR／Release以manifest及遠端收據為準。署名及非商用授權保持；完整視覺、正式作品、特定host與FreeTWAI未完成，滾動目標active。

## v0.15.0

2026-10-03：完成Agent／CLI分鏡時間起稿讀回、互斥檢查入口、1MiB預覽／取消／限定套用／撤回、來源毫秒／影格核對及目標編修保護。146 Python／121 JavaScript／四Skill／十二JS語法與diff、真正CLI／HTTP／JSON-lines／MCP、瀏覽器實檔JSON與draft3下載／讀回、音檔與其他草稿保持、延遲／錯誤／毀損／舊版相容、390px DOM與Enter通過。v0.14 ZIP解壓136／109通過。見docs/QA-v0.15.0.md；精確提交ZIP／private PR／Release以manifest／遠端收據為準。非商用與署名保持；完整視覺、正式作品、特定host及FreeTWAI未完成，滾動目標active。

## v0.14.0

2026-10-03：完成歌曲小節→分鏡時間起稿、預覽／取消／限定套用／撤回、來源與目標晚回應保護；修正需求／草稿撤回覆蓋後續編修。136 Python／109 JavaScript／四 Skill／十二 JS 語法與 diff、真正 CLI／HTTP／JSON-lines／五工具 MCP、瀏覽器起稿／空白拒絕／下載與草稿往返／音檔保留／晚成功與錯誤／390px DOM 與鍵盤通過。v0.13 ZIP 解壓124／93通過。見 docs/QA-v0.14.0.md；指定提交 ZIP／private PR／Release 以 manifest／遠端收據為準。完整視覺、正式作品、特定 host 與 FreeTWAI 投稿未完成，滾動目標 active。

## v0.13.0

2026-10-03：歌曲／分鏡晚成功不覆蓋，共用操作過期錯誤保護、純設計摘要／上一份狀態、歌曲小節／能量／任務、逐鏡提醒／母題位置及短桌面高度成果面板修正完成。124 Python／93 JavaScript／四 Skill／十 JS 語法與 diff，真正 CLI／HTTP／JSON-lines／MCP 四／五檔一致、IAB 延遲／錯誤保留／文字安全／JSON實檔／滑鼠與鍵盤下載／390px DOM 通過；v0.12 ZIP 核對／解壓124／80通過。見 docs/QA-v0.13.0.md。指定提交封裝／private PR／Release 以 manifest／遠端證據為準。署名與非商用授權保持；完整視覺、正式作品、特定 host 及 FreeTWAI 未完成。

## v0.12.0

2026-10-03：音檔單次複製／同份 SHA 與量測、PCM fmt 拒絕不一致、來源／接受條件／尾部安靜段／DC 摘要、換檔後上一份狀態與晚成功／錯誤保護完成。124 Python／80 JavaScript／四 Skill／九 JS 語法與 diff、真正 CLI／HTTP／JSON-lines／MCP、IAB 實際操作／JSON與Markdown下載／桌面與390px DOM／鍵盤通過；前版 v0.11 ZIP 核對／解壓112／69通過。詳細見 docs/QA-v0.12.0.md。指定提交封裝／private PR／Release 以 manifest／遠端證據為準。署名與非商用授權保持；完整視覺／正式實聽、特定 host 及 FreeTWAI 投稿未完成。

## v0.11.0

2026-10-03：整批歌詞校時預覽／套用／一次撤回、共用 CLI／HTTP／JSON-lines／MCP 校時、跨語言毫秒精度、離線 timing 提示及排序後 ID 修正完成。112 Python／69 JavaScript／四 Skill／八 JS 語法、實際瀏覽器錯誤／晚回應保留、音檔／文字／刪除歷史保留、JSON／草稿／獨立三格式實檔匯出及桌面／390px DOM 通過；前版 v0.10 ZIP 核對／解壓 99／55 通過，見 docs/QA-v0.11.0.md。指定提交封裝／private PR／Release 以 manifest／遠端證據為準。授權非商用保持；正式 host、完整視覺／正式作品及 FreeTWAI 投稿尚未完成。

## v0.10 歷史紀錄


2026-10-03：新增有界可攜 ZIP 備份、整份預覽與不可覆寫恢復；共用純版本契約／保存層及 HTTP／CLI／Agent，原 ID／時間／原始 bytes 保留。99 Python／55 JavaScript／四 Skill、真實瀏覽器下載／摘要、提交後 500 同備份重試、衝突／毀損保留、重啟與 390px DOM 檢查通過；v0.9 ZIP 解壓 77／47 通過。細節見 docs/QA-v0.10.0.md，指定提交封裝／private PR／Release 以 manifest 與遠端實際證據為準。重要草稿另存可靠備份；正式 Agent host、完整視覺／其他平台／正式作品與 FreeTWAI 投稿仍未完成。

## v0.9 歷史紀錄

2026-10-03：加入明確啟用的本機草稿庫，HTTP／CLI／Agent／MCP 共用不可覆寫版本保存、讀取摘要核對及分頁；瀏覽器有預覽／明確載入／撤回、未知結果同 ID 重試。77 Python／47 JavaScript、實際瀏覽器保存、受控回應失敗、Agent 寫入／23 版分頁、重啟持續保存、JSON 下載往返、毀損拒絕與桌面／窄螢幕 DOM 檢查通過；詳見 docs/QA-v0.9.0.md。v0.8 封裝解壓 62／38 通過。指定提交封裝與 private PR／Release 狀態以 manifest／遠端實際結果為準。授權、署名保持；特定 Agent host、完整視覺／正式作品及平台投稿未完成。

## v0.8 歷史紀錄

2026-10-03：六種列的局部刪除還原、選擇歷史、20 筆上限、容量保護、原始空白保留與歌詞晚回應保護完成。62 Python／38 JavaScript／四 Skill、瀏覽器真正下載回讀、音檔保留、容量／紀錄界限與延遲回應、390px DOM 幾何通過；前版 v0.7 ZIP 解壓 62／24 通過，詳見 docs/QA-v0.8.0.md。GitHub 提交／封裝／合併以 manifest、PR／Release 實際狀態為準；特定 host、完整視覺／正式作品與平台投稿仍未完成。

## v0.7 歷史紀錄

2026-10-03：四工具 discovery schema 分層共用、互斥歌詞來源／音訊正整數／MCP envelope 錯誤修正，清單項目旁提示與焦點完成。62 Python／24 JavaScript／四 Skill 通過；八 schema meta-schema 與七次真實 stdio 呼叫符合契約，瀏覽器實際修正／下載／回讀／撤回及 390px DOM 幾何通過。前版 v0.6 封裝核對、原版 56／24 通過。詳見 docs/QA-v0.7.0.md。特定 host、完整視覺／正式作品仍未完成，FreeTWAI 未投稿，GitHub 結果以實際 PR／Release／manifest 為準。

## v0.6 歷史紀錄


2026-10-03：歌曲語言／需求清單可編修，Agent／CLI brief 可經預覽回讀指定工作台並限定撤回；草稿 v3 保存新資料，v1／v2 明確轉換／取消／撤回通過。SRT 提示修正並新增 timing 來源。56 Python／24 JavaScript／四 Skill、實際 MCP → 瀏覽器 → 下載往返及 390 像素 DOM 幾何通過，詳見 docs/QA-v0.6.0.md。沒有宣稱實際 host 或完整視覺完成；前版封裝解壓 53／13 通過。授權不變，本輪 GitHub／封裝證據以實際 PR／Release／manifest 為準。

## v0.5 歷史紀錄

2026-10-03：本輪修正歌詞檔晚完成覆蓋與失敗選檔停用成果，加入分鏡概要／收合／定位／錯誤欄位展開，以及本版 Agent 啟動設定產生器。53 Python／13 JavaScript／四 Skill 通過；實際草稿、分鏡、歌詞下載與回讀、390 像素 DOM 幾何見 docs/QA-v0.5.0.md。Codex CLI 只驗證設定解析，未完成實際 host 工具呼叫。授權不變，前版封裝還原通過 52／8 測試。本輪封裝／GitHub 結果以 manifest、PR／Release 實際狀態為準。

## v0.4 歷史紀錄

2026-10-03：本輪完成多母題 UI、草稿 v2 明確轉換／取消／撤回、MCP stdio 2025-11-25 四工具，以及過深 JSON／空白時間鏡頭刪除修正。52 Python／8 JavaScript 及瀏覽器實際往返／下載驗證，詳見 docs/QA-v0.4.0.md。授權保持 PolyForm Noncommercial 1.0.0。前版封裝摘要重新核對，解壓後 44 項原版測試通過。指定提交封裝與 GitHub 狀態以 manifest／Release 為準。

## v0.3 歷史紀錄

2026-10-01：本輪完成共用 application 層、Agent JSON-lines v1、歌詞即時預覽與音檔競態修正、草稿下載／回讀／撤回，以及 PolyForm Noncommercial 1.0.0 授權。44 項 Python、4 項 JavaScript 與四份 Skill 格式檢查通過；具體瀏覽器證據見 docs/QA-v0.3.0.md，迭代／還原／交接見 CHANGELOG.md、HANDOFF.md。

下方保留 v0.3／v0.2 的歷史驗證，不表示本輪完整視覺、正式作品或 Agent 平台整合已完成。公開投稿與平台作者核實仍未完成。

## v0.2 歷史紀錄

2026-10-01（Asia/Taipei）· 創辦署名 ZOE. G · GitHub 帳號 djguan-jpg。

此輪採全新構思，只讀本次新建工作區與通用工具指引。未取用使用者其他本機專案、GitHub Repo、歷史作品或素材。公開第三方 README 的比較來源及自行設計差異見 CONCEPT.md；沒有 clone 或複製第三方程式／素材。

## 已提供

- 歌曲設計：BPM、小節、記憶點、敘事任務與能量曲線；四個可編修／交接的成果檔。brief 可重新讀入。
- 母題分鏡：時間覆蓋、母題狀態、人物與左右方向變化理由；五個成果檔，包含可重新讀入的 mv-brief。
- 波形校時：LRC／SRT／JSON 匯入、第一聲道波形、點擊與鍵盤定位、播放時間填入、逐句文字／時間驗證、匯出。
- 交付檢查：PCM WAV 規格、每聲道 peak／RMS／DC／滿刻度樣本、-60 dBFS 安靜段、整段立體聲相關性、SHA-256。
- 本機四工作台介面；修改輸入後標示成果尚未重新驗證，暫停舊成果下載；重建後恢復。
- 四份原創 SKILL.md。既有 v0.1 CLI 需求仍支援。

## 實際驗證

- Python unittest：35 項通過（21 項原有、14 項新增）。涵蓋各 CLI、規格／時間、PCM 數值、頭尾安靜段、反相聲道、規劃匯出往返、本機 HTTP 操作、錯誤輸入、接受來源、只開放指定頁面、真正 UTF-8 attachment 回應。
- Node 語法檢查通過；四份 Skill 皆通過 quick_validate.py。
- CLI 實跑原創範例：outputs/v02/music 4 檔，outputs/v02/mv 5 檔。
- IAB 實際網址與標題正確，內容非空，未見框架錯誤覆蓋；最後檢查沒有捕捉到 error／warn。
- 歌曲：120 BPM 為 136 秒；改 90 為 181.333 秒。JSON 真正下載至本機，檔案內容已核對。最後版本再確認 100 BPM 為 163.2 秒；修改後禁止舊下載，切換工作台仍保留提示，重建後才恢復。
- 分鏡：4 鏡、24 秒，檢查通過；移除鏡頭 3 的變化理由會出現待審查提醒。最終匯出包含 mv-brief。
- 歌詞：4 句匯入，60 秒合成 WAV 載入，波形完成，播放／暫停、點擊定位及 0.5 秒键盤微調、填入第四句時間與修改文字後驗證；新時間與文字出現在實際成果。故意重疊被拒絕。
- 音檔：合成 60 秒、48 kHz、16 bit、雙聲道，兩聲道 peak -20.002 dBFS／RMS -23.013 dBFS、無滿刻度樣本；相關性 1、SHA-256 與來源一致。
- 390×844 窄螢幕設定：歌曲工作台頁面沒有橫向溢出，四個導覽與成果區均在可用寬度內；已重設 viewport。只做 DOM 幾何與互動核對，沒有截圖視覺評審。
- 臨時 HTTP 測試伺服器已停止，沒有保留背景服務。

## 實際限制

尚未生成歌曲或影片、做語音辨識／自動對齊、使用正式作品評測、量測 LUFS／true peak，或完成其他瀏覽器及完整手機視覺驗收。原音檔保留；WAV 檢查不代表音樂品質或授權核實。

本機工作台的 HTTP 下載已確認 JSON 實檔及 UTF-8 attachment 回應；舊獨立 preview.html 的 Blob 下載本輪未重新確認。

## GitHub 與投稿狀態

已建立新的 private Repo：<https://github.com/djguan-jpg/zoe-g-music-lab>。第一版上傳保留本次四專案的 Git 歷史，創辦署名 ZOE. G，實際帳號 djguan-jpg，Codex 協作範圍如實記錄。

自由工坊新作品登錄表單要求「公開專案網址」；關係可選原作者，但頁面明示為自行聲明，平台不以此驗證作者或擁有權。Repo 仍 private，尚未送出；投稿資料已整理在 SUBMISSION-PACKET.md。沒有宣稱已取得平台創始人核實，也沒有認領既有手冊的原作者。
