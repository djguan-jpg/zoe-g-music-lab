# v0.129.0 交接與可逆

## v0.129.0 封裝盤點與復原容量

封裝目錄超過128時，原本的標準唯讀稽核會拒絕整輪盤點。現在將目錄上限與復原日誌分開：先完整列舉最多1024個direct entries，再逐份核對；超限在開啟封裝前拒絕，不以部分清單判斷最新三版。每份完整manifest核對後只留下保留政策與identity所需metadata，釋放完整來源ledger。

maintenance純保留／身份政策 → maintenance_fs明確本機root、ZIP／Git核對與有界catalog → iteration_audit既有CLI與新receipt。復原仍最多128份／日誌2MiB，prune候選超128在來源重查、journal及move前拒絕；既有嚴格超七日、最新三版、exact tag／可重建bytes、未知與未核實資料保留，以及active／unverified程序拒絕清除的政策保持。

628 Python、1592 JavaScript、143 syntax與四Skills通過；新增6 Python。真129目錄CLI預覽／清除／復原及partial檔保持、1024／1025邊界、完整manifest釋放與128／129復原限制核對。原v128指定ZIP實際還原622／1592；364份歷史交付bytes與27組operation schemas相同。正式標準CLI已盤點本workspace129目錄，沒有清除候選；v77另一份source與正式tag不符，兩份partial36／53均保留。

產品129／唯一交付來源38–129共92版，未知130拒絕。20基本／啟庫27工具、27組schemas、Agent1／draft3／audit1／recovery1保持。工作台與創作application、HTTP／Agent／MCP執行能力沿原介面；本輪沒有新增瀏覽器操作驗收。PolyForm Noncommercial1.0.0、ZOE. G與public保持；平台仍submitted_unverified。已公開v128及其補查收據保留，新的restore／codex分支提供可逆差異。

見[契約](docs/MAINTENANCE-CATALOG.md)。以下保留歷史迭代。

## v0.128.0 多版本分批備份

工作台新增「分批備份選取清單」：從已保存版本選單加入不同版本，跨搜尋或重新整理保留選取；清單明示名稱、保存時間與ID，可移出／清空後下載這一批。按下時固定1–1000唯一ID，整庫與單版入口保持。清空／移出只改本頁清單，不刪保存版本；重新開啟本頁需重新選取。備份只含已保存版本，未保存編修、音檔與成果另存。

backup-selection純metadata／注入capture controller → backup-selection-dom字面清單與焦點／變更及availability通知 → 原backup-download純request、同一下載controller及完整串流／SHA／sender。來源沿library-revision完整metadata檢查，view只含ID／名稱／保存時間，不持有草稿、File、ZIP或路徑；重複不倍增，矛盾metadata保留原清單。原始request副本與latest／cancel／dispose、32 MiB及URL cap保持。busy拒絕編選與下載，取消保留上一份成功備份。草稿與成果不確認為已保存，不自動恢復或載入。

加入／移出／清空與可下載狀態變更通知既有下載adapter，app.run開始／結束刷新選取狀態；避免最後一版移出後按鈕仍可按。移出後焦點到下一個可用按鈕；搜尋無結果且清空時回可聚焦清單。1000版有界局部捲動，窄視窗名稱／ID換行。新增兩個固定GET JS；backup1／draft3／Agent1、20基本／啟庫27工具及27組schemas保持，既有POST／Python備份domain／CLI／Agent／MCP無diff。產品128／唯一policy來源38–128共91，未知129拒絕。

見[契約](docs/BACKUP-BATCH.md)。下方保留歷史迭代。

622 Python（98.078秒）、1592 JavaScript與143 syntax通過；新增16 JS，Python後續未改，沿同次622成功，指定source封裝另完整驗證。四Skills再驗；v127指定source ZIP（2380239 bytes，SHA 95cde57b5630f53606f9a476834e64d089e640dd440f8e861673ad25a4d4d633）實際還原622／1576。四scope×90的360份歷史ZIP／manifest原bytes保持，27組schemas與八份whole lyrics Python／JS報告保持。

原生27份完整快照：四台原值、17個row IDs、歌曲四檔／完整目前預覽／下载旗標、draft dirty與兩預覽狀態保持；另保留三份早期較窄快照。加入3後搜尋1，再加入1，無結果仍可備份[1,3]；按下載後刷新並選2，本次來源仍[1,3]。三秒QA-only prepare延遲驗取消與busy；整庫檔拒絕確認多版，多版也拒絕確認後來單版，正確合成source成功。清空首次重現按鈕未即時停用，保留失敗快照，補通知後reload四份快照實際通過。1280×720／390×844／1280×360六份前後快照原值保持、頁面與清單不水平溢出，Tab可達批次下載、Enter移出／清空焦點可達，console warn/error零。

多版[1,3]的完整inspection在application／CLI／Agent／MCP／HTTP回覆相同；good-bad-good及200／400／200、路徑拒絕與27工具discovery保持。實際CLI多ID備份與預設拒覆寫，以及application／Agent／MCP完整inline ZIP核對相同ID與record／draft原bytes；created_at為實際時間，不宣稱整包bytes相同。四固定HTTP assets逐byte等於source，短命HTTP threads join，subprocess EOF，兩個有界server按原記錄正常stop並觀察EOF，一個QA tab已關閉及viewport reset。兩組三版合成草稿库各六檔hash保持，未恢復。

QA原生選回四份server合成source ZIP，並非實際瀏覽器保存檔。下載事件10秒未取得path，保存落盤未驗證。保留首次QA report舊版號、CLI把nargs多ID錯接為逗號字串、refine helper全檔count不符及DOM通知測試的失敗；fresh修正後重驗，產品HTTP／CLI語義不因此放寬。工作包測試在外層驗忙碌觀察，避免run錯誤處理吞掉測試內assert。

分支codex/iteration-v0.128.0；restore-v0.127.0-before-v0.128.0固定d182ebfd6db8c0b79a655c002f316326f9ea871f。由tag另建codex/restore-*分支及PR審閱還原，不改私人草稿／素材、不撤銷外部投稿。精確source封裝、合併與已授權公開prerelease；actual提交、ZIP／SHA及兩個asset逐byte回讀以outputs/v128-qa收據／manifest為準，GitHub CI未設定。

每輪只稽核本workspace outputs、完整direct封裝及明確same-host run，保護最新128／127／126三版；嚴格超七日且exact tag／現場Git archive可重建才列清除候選。草稿、備份、媒體、未知、失敗36／53與QA保持，無候選不刪，不終止外部程序。ZOE. G、djguan-jpg、PolyForm Noncommercial1.0.0及public保持，四份FreeTWAI已投稿，platform仍submitted_unverified。本輪是滾動goal進展，仍active；實際瀏覽器落盤、完整視覺／screen reader、實聽／同步、Host安裝與平台正式創始核實未驗證。


## v0.127.0 單版本備份

本機保存版本新增「下載選定版本備份」，可將選單中一個已保存版本另存ZIP。按下時固定ID，即使下載途中切換選單，也不改本次來源；成功提示明示該ID，整庫備份保持。空選擇／未啟庫／busy時停用；取消只中止自己請求、保留上一份成功備份來源。備份只含已保存版本，未保存編修、音檔與成果仍須另存。

backup-download純request嚴格核對ids、隔離／排序1–1000唯一ID；controller以click-time副本核對descriptor.selection及選定數量，沿原完整串流／SHA與latest／cancel／dispose。DOM共用同一sender、URL cap及verification來源，不增加第二個下載控制器或持久buffer。captureSelected只讀目前已展示records；library選擇事件刷新可用狀態，原预覽取消及後續編修保持。

既有POST /api/drafts/backup/prepare由{}整庫相容接續可選ids，沿共享Python selected_ids／export_library_backup；拒絕路徑、額外欄位、query、重複／空ID及跨Origin。ID不能選檔案路徑；沒有恢復或新增寫入權限。選定健康版本不讀未選定版本，整庫仍完整檢查。有效格式但不存在的ID維持既有HTTP500本機讀寫失敗，不自動重送。descriptor六欄、backup1／draft3／Agent1與27組operation schemas保持，20基本／啟庫27工具不變，沒有新asset、依賴、模型或外網。產品127／唯一policy明確來源38–127共90版，未知128拒絕。

見[契約](docs/BACKUP-SELECTION.md)。下方保留歷史迭代。

622 Python（92.422秒）、1576 JavaScript、141 syntax及四Skills通過；新增3 Python／8 JS，focus43 JS及3 Python。初次Python兩處oracle不符：既有populate只建兩個版本，缺少的合法ID沿原HTTP500；按實際資料／契約修正，產品錯誤路徑不改。首輪完整JS只有舊selection-event VM缺少新增backupControls回呼；補上並驗其一次刷新後完整1576成功。Python源與測試此後沒有再改，沿同次622成功；所有失敗log與fresh retry收據保持。

v126精確source ZIP（2357756 bytes，SHA 35786baee1e7355b8e4e98b1f189f4e9205cdc72b1c26b63df83c792adb4fd08）實際還原619／1568；四scope×89的356份歷史ZIP／manifest原bytes保持，27組schema及八份whole lyrics Python／JS診斷保持。單版本原生合成source的完整inspection回覆在application／CLI／Agent／MCP／HTTP相同，good-bad-good與200／400／200保持。另實際CLI選ID備份／拒覆寫，application、Agent及MCP完整inline ZIP均核對相同選定ID與保存record／draft原bytes；created_at按實際時間不同，不宣稱整包bytes相同。原三份合成版本六個檔案hash不變，未restore。

一個in-app本機QA頁保留19份完整快照：13份流程中的四台原值／17個row或清單ID／歌曲四個成果與dirty保持；busy時兩下載按鈕、取消與核對控制正確。三秒QA-only prepare延遲驗取消保留整庫source，以及點版本2後切版本1仍交付2；整庫檔不能確認單版2，單版2也不能確認新的單版1，正確檔案成功。四份QA server source分別含[1,2,3]／取消請求[2]／成功[2]／[1]；它們是合成source，不是實際瀏覽器保存檔案。下載事件10秒未取得path，不繞過先前被拒的下載管理頁。

1280×720／390×844／1280×360均以實際DOM尺寸核對完整值，頁面與ID／摘要提示不水平溢出，從整庫按Tab可達單版按鈕。warn/error零，viewport reset，QA tab關閉，原會員tab保持。QA server正常stop／context close／deadline thread join並觀察實際exec EOF；短命HTTP threads正常join，CLI／Agent／MCP EOF。未選媒體，不宣稱native File身份或實聽驗收。PNG留本機忽略QA。

分支codex/iteration-v0.127.0；restore-v0.126.0-before-v0.127.0固定101b76fb0f6ab2a748058d7eb7e0195d84658a4e。由tag另建codex分支審閱還原，不覆寫私人草稿／素材；Git不撤銷外部投稿。精確source封裝、PR合併與公開prerelease，兩個assets逐byte回讀，以outputs/v127-qa成功收據及manifest記錄實際提交／SHA。

唯讀稽核本工作區outputs、完整直接封裝及明確same-host run；最新127／126／125保護，嚴格超七天且exact tag／Git archive可重建才列候選。保存草稿、備份、素材、未知、失敗36／53與QA保持；無候選不清除，不終止外部程序。ZOE. G、GitHub djguan-jpg、PolyForm Noncommercial1.0.0與已授權public保持；四份FreeTWAI已投稿，創始核實仍submitted_unverified。仍未驗證實際瀏覽器落盤、完整視覺／screen reader、實聽／同步、Host安裝與平台正式核實。本輪為滾動goal進展，goal仍active。


## v0.126.0 備份下載檔案核對

草稿庫備份旁新增「核對下載的備份 ZIP」。成功送出後可選回本機檔案，先核對1 byte至32 MiB容量，再以完整檔案SHA-256及大小核對本輪備份。來源只保留bytes／摘要／版本數；不持有完整備份，不恢復、載入、保存版本或确认未保存編修。新的成功送出遞增revision，即使內容相同也使舊讀取失效；下載失敗保留上一份來源。舊ZIP不能確認新ZIP。

純backup-verification嚴格原值模型、注入controller、原生File DOM adapter與原有backup-download sender分層。讀取與hash後重查本輪source／revision／busy、完整ArrayBuffer大小與選檔metadata，latest／cancel／pagehide／dispose保護晚回覆。原始32 MiB可完整核對；超限在arrayBuffer前拒絕。同大小錯bytes、短讀及來源失效保留原工作台、成果、列ID及草稿庫；選檔標為verification view control，不誤觸編修。單獨純verificationAllowed避免availability refresh寫入library訊息。

只新增三個固定GET JS資產；原備份domain／CLI／Agent／MCP／HTTP POST權限及schemas不变。20基本／啟庫27工具、27組schema、Agent1／draft3與backup1保持。產品126與唯一policy明確來源38–126共89版，未知127拒絕。PolyForm Noncommercial 1.0.0、ZOE. G及公開授權保持；四份自由工坊投稿已送出，創始身分仍submitted_unverified。

見[契約](docs/BACKUP-DOWNLOAD-VERIFICATION.md)。下方保留歷史迭代。

619 Python（90.875秒）、1568 JavaScript、141 syntax與4 Skills通過；新增17個JS測試、focus29項。覆蓋strict descriptor／getter拒絕、未知欄位／符號、Unicode basename、空庫metadata、大小與SHA雙核對、32 MiB最後一byte與預讀超限、無來源／busy／讀取與hash晚回覆／來源revision失效／cancel／dispose／短讀／metadata漂移／失敗retry、成功下載才留來源及availability純callback。沒有新增依賴。

v125精確source ZIP（2331451 bytes，SHA 1a34371e4887a4366708f3b8de0c82a02263f41d388697f76d463eb6774a24a4）實際還原619／1551。四scope×88的352份歷史ZIP／manifest原bytes保持，27組schema保持、八份whole lyrics跨Python／JS診斷保持。既有歌詞request与本輪QA server產生的3680-byte合成備份，在application／CLI／Agent／MCP／短命HTTP完整成功回覆相同，good-bad-good、200／400／200保持。備份僅inspect，未restore，三份合成版本六個原檔hash不變。

Chrome實際核對保留七份完整panels／所有17個row或清單ID／成果／dirty／library快照；六組前後全值相同、原歌曲四個成果下載仍啟用。同大小錯檔、32 MiB+1、舊source對新送出拒絕，兩次最新source成功。Chrome viewport API雖回應成功，DOM仍1920×919；該三次快照未當成三種尺寸驗收。另用in-app本機QA頁實際核對1280×720／390×844／1280×360：完整原值／列ID保持，摘要與Unicode錯檔名在頁寬內，沒有水平溢出，Tab可達備份匯入控制。兩個QA頁warn/error零，兩套暫時viewport均reset；PNG只留忽略QA，不宣稱完整視覺或screen reader驗收。本輪未選音檔，不宣稱native media身份驗證。

第一次原生下載事件等候10秒未取得檔案路徑。瀏覽器安全政策拒絕chrome://downloads/，未繞過；僅關閉本輪建立的空白頁。選回的三份canonical備份為QA server額外保存的同一份合成來源bytes，明確不是瀏覽器落盤下載。第一phase正常停止並觀察exec EOF；第二phase專為記錄合成source，不因延遲重啟或重送。兩個phase均正常停機、thread join／context close／實際exec EOF，三份合成版本原bytes保持。三個本輪QA tabs全關，會員與公開介紹頁保留。

來源提交、封裝器抽出精確source再檢查與遠端asset實際bytes/SHA，以本輪成功收據／manifest為準。仍未驗證實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。

分支codex/iteration-v0.126.0；還原tag restore-v0.125.0-before-v0.126.0固定e0d19479cf6b950ba5a032e992ced214ee9e6594。需還原時另建codex分支審閱，不覆寫現有草稿庫；Git不能撤銷外部投稿或公開狀態。採精確source提交封裝、PR審查與合併，公開prerelease連同ZIP／manifest逐byte回讀。

每輪唯讀稽核本工作區outputs、直接完整封裝和明確same-host run記錄。最新三版126／125／124保護；嚴格超七天、exact tag／現場Git archive可重建的完整封裝才列候選。草稿、备份、素材、未知檔／失敗36與53／QA證據保持，不因版本舊直接刪除，無候選不清除。不清理其他專案或未確認程序。本輪實際終態與SHA見outputs/v126-qa成功收據。滾動goal仍active，本輪為進展。


## v0.125.0 條件草稿下載核對

接受條件草稿下載旁新增「核對下載的條件草稿」。成功送出後可選回本次完整 JSON，以共享純 UTF-8 位元組核對確認該次保存快照；條件原值、工作台、列ID、媒體及既有報告保持。核對舊送出稿只確認它當時的條件，後來編修仍需另存；新的成功送出即使內容相同也使舊讀取失效。原本「已確認條件草稿檔案」按鈕保留。

既有純 audio-acceptance 保存模型不變；DOM adapter 只在 downloadText 成功後保留完整送出文字／遞增 revision，注入共享 text-verification controller／原生 File adapter，容量64 KiB在 arrayBuffer 前核對，沿 busy／visibility／latest／pagehide／dispose 保護。來源不取預覽或後來編修；失敗下載保留上一份有效來源。核對無需條件數值可解析，但分析仍完整驗證；BOM、重排、缺尾、同長錯文字、未知版本與額外欄位只要 bytes 不同就不確認。核對不是載入來源，不套用外部 JSON，也不改音檔。

原生測試重現核對選檔的 input 被通用 editor listener 視為編修，導致未改條件的報告過期。新 File 控制明確標示 data-view-control="verification"，重用既有唯讀排除；實際條件 input 仍照常標過期。沒有新增固定 asset、operation、POST、依賴、模型、外網或路徑權限。產品125／唯一policy來源38–125共88，未知126拒絕；20／27 tools、27組schemas、Agent1／draft3與獨立domain schemas保持。

見[契約](docs/AUDIO-ACCEPTANCE-DOWNLOAD.md)。以下保留歷史迭代。

619 Python（89.157秒）、1551 JavaScript、138 syntax及4 Skills通過；新增19個JS測試。focused65項是新增最後一項之前的實際結果；最後以完整1551為準。覆蓋未送出、未完成條件原文、Unicode／空白、同長錯bytes、BOM／排版／缺尾／未知版本／額外欄位、改檔名、64 KiB預讀拒絕、busy／隱藏／late／新送出／讀取失敗與retry、手動確認、載入checkpoint／預覽／媒體保持、dispose及實際editor input listener不誤標報告。

v124指定source ZIP（2308909 bytes，SHA a398767b3bc28b116715304321de8f62a08c2c37b94dbc3b7db743c6bcbd32d3）實際還原619／1532；四scope×87版的348份歷史ZIP／manifest原bytes相同，27組schemas保持，八份whole lyrics跨Python／JS診斷保持。既有合成歌詞request與本輪原生可見的完整合成條件報告，分別和application／CLI／Agent／MCP／短命HTTP完整回覆相同；good-bad-good及200／400／200通過，CLI2、重覆輸出1保留原bytes、無效資料拒絕且無輸出。四個固定GET JS原bytes相同。指定source封裝器會另驗解出原始碼，結果以manifest為準。

原生先保留兩份失敗快照，修正input排除後另保留18份完整快照及18份報告操作旗標。六組功能前後核對完整panels／條件／成果及旗標：超限與同長錯檔仍可下載原報告、舊送出稿確認後新編修仍需另存、舊檔無法確認新送出、相同JSON語義但不同欄位順序仍拒絕、最新canonical檔成功確認。三組1280×720／390×844／1280×360前後完整值與列ID相同，長錯誤檔名在頁寬內、沒有水平溢出，Tab可達載入條件控制。原生8秒合成WAV的File身份保持；本輪未實聽或檢查播放時刻，console warn/error零。PNG留忽略的本機QA，未作完整視覺／screen reader接受。

瀏覽器下載事件等候10秒沒有回報檔案路徑，選回的232／228 bytes是依可見原值獨立構造的合成probe，不是實際下載。第二份probe因欄位排序和canonical送出bytes不同而正確拒絕，保留它，另建正確canonical檔才取得成功；不把語義相同冒充完整文字相同。原生input錯誤與首輪JS oracle length87失敗均保留；HTML排除修正、oracle改88與最後新增input測試後完整JS1551通過，未再改Python而保留同次619成功結果。

分支 codex/iteration-v0.125.0；基線 main 80e606ec5f73ffc850244ffe562ff18675da6d71；還原 tag restore-v0.124.0-before-v0.125.0。由tag建立codex/restore-*分支與PR可還原原始碼，不變更私人草稿／素材或外部投稿。創辦ZOE. G、GitHub djguan-jpg與PolyForm Noncommercial 1.0.0保持；不授予AGPL或商用許可。Repo已獲明確授權公開；本次登入頁確認GitHub已連結djguan-jpg，四份ZOE. G介紹仍在社群書架；作者身分仍自行聲明、尚未核實，不重複提交。

一個owned有界QA server經exact recorded身份正常shutdown並確認實際session EOF；兩次短命HTTP thread正常join，CLI／Agent／MCP EOF。一個owned本機QA瀏覽器tab關閉、viewport reset；平台查閱使用既有會員tab，不關閉使用者tab。不終止外部程序。發佈後唯讀稽核本workspace outputs、直接封裝及typed runs，保護最新125／124／123三版。只有嚴格超七天且exact tag／現場Git archive可重建的完整封裝才列候選；草稿、備份、素材、未知、失敗36／53及QA保留。無候選不清除。source提交、兩個release assets實際下載bytes／SHA及最後稽核以 outputs/v125-qa 成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。本輪為滾動goal的一版進展，goal仍active。


## v0.124.0 草稿變更工作台

專案草稿的保存提醒新增變更工作台清單。尚未確認任何保存版本時，比對起始範例；已確認載入檔案、本機保存版本或下載草稿後，比對最近一次完整確認的內容。四個名稱固定依歌曲設計、母題分鏡、波形校時、交付檢查排序。還原一台的原值，該台退出清單；精確符合任何仍保留的完整版本或起始範例時，整份草稿維持既有已確認判定。

draft-retention 既有 checkpoint／注入 guard只新增隔離的 difference DTO（reference＋panels）；獨立 draft-difference 純模型嚴格核對列舉、最多四台、唯一／完整資料屬性後產生固定文字，app只更新提示 textContent／hidden。待確認下載不能替換參考；確認舊送出快照後，後續編修仍dirty。拼接不同保存版本的工作台片段仍需整份另存。原稿、列ID、媒體、成果、下載／本機保存流程與 beforeunload 原判定保持；摘要不帶原文／fingerprint／File／路徑，不進 draft3／Agent wire。新增一個固定GET JS，不新增 operation、依賴、模型、外網、登入或寫檔權限。產品124／唯一policy來源38–124共87，未知125拒絕；20／27 tools、27組schemas與獨立domain schemas保持。另修正根目錄 HANDOFF.md 的過期首頁版號。

見[契約](docs/DRAFT-DIFFERENCE.md)。以下保留歷史迭代。

619 Python（89.141秒）、1532 JavaScript、138 syntax及4 Skills通過，新增16個JS測試；focused保存／下載／確認整合59項通過。覆蓋四台與空白／清單順序／空列、三種完整確認來源、待確認下載、後續編修、舊完整版本／起始精確復原、混合版本、最近事件／同kind有界替換、DTO污染隔離、局部capture及beforeunload完整重查、嚴格列舉／額外／隱藏／symbol／accessor拒絕、固定文字DOM與資產順序。

v123指定source ZIP（2287710 bytes，SHA 083784b560fb932236d9889a27fb6dbb8eb7fe446792a72ef2314f3c5da2887f）實際還原619／1516；四scope×86版的344份歷史ZIP／manifest原bytes相同，27組schemas保持，八份whole lyrics跨Python／JS診斷保持。當前合成request的application／CLI／Agent／MCP／短命HTTP完整回覆相同，good-bad-good及200／400／200通過；CLI2、重覆輸出1保留原bytes、無效row拒絕且無輸出，四個固定GET JS原bytes相同。指定source封裝器會再驗證解出的來源，結果以release manifest為準。

原生18份創作快照，後10份另核對historyId；兩組手動確認前後核對完整創作，其中一組包含列ID。三組1280×720／390×844／1280×360排版前後完整值與列ID相同；四台完整提示在頁寬內且沒有頁面水平溢出，Tab可達載入草稿，確認可用Enter。精確復原已確認內容後dirty解除，原生8秒合成靜音WAV的File身份保持、暫停且0秒，console warn/error零。原先較窄觀察未捕獲historyId，後續擴充獨立核對；不宣稱前八份具備列ID證據。短視窗一次滑鼠命中失敗，重新觀察頁面後用原生Enter成功；PNG留忽略本機QA，未作完整視覺／screen reader接受。

本輪原生下載僅驗證成功送出與手動確認流程；手動確認為合成QA操作，不證明實際下載落盤或使用者素材保存。初次runtime2 helper錯把含runtime替換的index.html當固定bytes比較，該assert拒絕；保留失敗產物，以新runtime3只核對固定JS且完整重驗。準備helper的PowerShell嵌入字串曾解析失敗，未建立目標腳本；改以有界保存的Python helper後成功。無失敗結果冒充成功。

分支 codex/iteration-v0.124.0；基線 main e3d30319a28fd6ee5a78354ca6bd33301222f8d9；還原 tag restore-v0.123.0-before-v0.124.0。由tag建立codex/restore-*分支與PR可還原原始碼，不變更私人草稿／素材或外部平台投稿。創辦ZOE. G、GitHub djguan-jpg與PolyForm Noncommercial 1.0.0保持；不授予AGPL或商用許可。Repo已獲明確授權公開；四份FreeTWAI介紹頁先前已建立，作者／創始身分仍submitted_unverified，本輪不重複提交。

本輪一個owned有界QA server經exact recorded身份正常shutdown並確認實際session EOF，CLI／Agent／MCP EOF及短命HTTP thread正常join；一個owned本機瀏覽器tab關閉、viewport reset。發佈後唯讀稽核本workspace outputs、直接封裝及typed runs；保護最新124／123／122三版。只有嚴格超七天且exact tag／現場Git archive可重建的完整封裝才列候選；草稿、備份、素材、未知、失敗36／53及QA保留，不終止外部程序。無候選不清除。source提交、兩個release assets實際下載bytes／SHA及最後稽核以 outputs/v124-qa 成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。本輪為滾動goal的一版進展，goal仍active。


## v0.123.0 草稿下載完整核對

草稿下載旁新增「核對下載草稿」。只有實際成功送出草稿後才可選檔；沿共享完整 UTF-8 原文位元組核對，比對本次送出的完整 JSON，而非預覽、檔名或 JSON 語義。相同檔案確認既有 click-time 保存快照；後續編修仍需另存，原工作台、時間、列 ID、音檔及成果保持。檔案可重新命名；BOM、重新排版、缺尾、舊送出稿或錯原文拒絕保存確認。原本明確「已確認草稿檔案」按鈕保留。

純 text-verification 模型 → 支援 draft scope／可選容量的注入 controller → 可選 IDs 的原生 File DOM adapter → app 的成功 onSent 與原 draft-retention guard。草稿容量1 MiB，在 arrayBuffer 前核對；既有成果預設8 MiB保持。最新 token、送出 revision、完整 source、busy、離頁及 dispose 防護保持；允許核對舊送出快照與後續 dirty 編修共存。送出時間只提供可見辨識，不是保存成功證據；File／檔案路徑、核對報告及暫態完整 source 不進持久草稿或 Agent wire。產品123／唯一 policy38–123共86，未知124拒絕；20／27 tools、27組 schemas、Agent1／draft3及領域契約保持，沒有新 operation、固定 asset、依賴、模型或外網能力。

見[契約](docs/DRAFT-DOWNLOAD-VERIFICATION.md)。以下保留歷史迭代。

619 Python（90.390秒）、1516 JavaScript、137 syntax及4 Skills通過；新增14個JS測試。覆蓋完整 Unicode／原文空白與換行、same-size錯bytes、BOM／排版／缺尾／未知版本、重命名、容量在讀取前拒絕、讀取不完整／File冒充／size drift／I/O、busy／cancel／晚成功或錯誤、新送出失效、manual保存與dispose。Python未再改，沿用同一完整成功結果；修正JS fixture後重跑完整JS與syntax。上一版v122指定source ZIP（2265851 bytes，SHA 67122d24d2140d58be766264ebdab0b851643fe072b85a825ff4c8aa852a97d3）實際還原619／1502；四scope×85版的340份歷史ZIP／manifest原bytes相同，27組schemas保持，八份whole lyrics跨Python／JS診斷保持。指定source封裝器會另跑解出原始碼的完整驗證，成功以manifest為準。

原生14份唯讀快照，首份為較窄欄位觀察，後13份擴為142個創作控制與列ID。兩組功能前後及三組排版前後逐值／順序核對：舊相同檔確認保存但新編修仍dirty、精確復原欄值後dirty解除、舊檔不能確認新送出、最新相同檔確認。合成8秒WAV的原生File身份保持，暫停0秒，不seek。1280×720、390×844及1280×360核對入口在頁面寬度內，沒有頁面水平溢出；console warn/error零。PNG留忽略的本機QA，不宣稱完整視覺或screen reader接受。

Chrome下載事件等待10秒未回報落盤路徑；本輪原生選回的5718／5730／5728 bytes檔案是依創作DOM與可見送出時間獨立構造的合成probe，並非實際瀏覽器下載。它們驗證原生讀檔與完整bytes比較、保存guard及原資料保留；不能作為下載落盤或使用者原稿保存證明。當前合成request的application／CLI／Agent／MCP／短命HTTP完整回覆相同，good-bad-good及200／400／200通過；CLI2、重覆輸出1保留原bytes、無效row拒絕且無輸出，四個固定GET原文相同。此次未宣稱取得原生下載的報告檔。

失敗紀錄保留：版本fixture length／tuple修正；新送出fixture原先誤把prepared bytes當content、舊VM缺adapter，修正fixture後 focused56通過。可見時間新增後一項測試使用JS逗號索引而讀錯node，修正後完整1516全過。唯讀觀察先用不存在player ID與不支援的DOM FileList，改用正確lyrics-player及唯讀CDP原生File引用；初次runtime helper沿舊版寫死metadata與native聲明，保留原紀錄並以獨立runtime2完整重驗且正確標示合成來源。上述未冒充成功。

分支 codex/iteration-v0.123.0；基線 main da8f6f38057d2cfae7960cfee2989f55f4ef6ecb；還原 tag restore-v0.122.0-before-v0.123.0。由tag建立codex/restore-*分支與PR可還原原始碼，不改私人草稿／素材，也不撤銷外部投稿或Repo公開。LICENSE／NOTICE／LICENSING／FOUNDER及PLATFORM收據保持；創辦ZOE. G、GitHub djguan-jpg，PolyForm Noncommercial 1.0.0，沒有AGPL或商用許可。Repo已獲明確授權公開，四份FreeTWAI介紹頁已建立，作者／創始身分未核實，本輪只讀核對不重複提交。

有界owned QA server經exact recorded身份正常shutdown與實際session EOF；CLI／Agent／MCP EOF及短命HTTP thread正常join，兩個owned本機瀏覽器tab結束，viewport reset。不終止外部程序。發佈後唯讀稽核本workspace outputs、直接封裝與typed runs；保護最新123／122／121三版。嚴格超七天且exact tag／現場Git archive可重建才列清除候選；草稿、備份、媒體、未知、失敗36／53及QA保留。沒有候選就不清除。遠端合併、兩個release assets實際下載bytes／SHA、最終稽核以 outputs/v123-qa 的成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。此輪完成一版進展，滾動goal仍active。


歌曲單段、分鏡單鏡與歌詞單句的工具列新增「回到目前待辦」。檢查並成功定位後，手動查看其他欄位可直接返回最後成功位置；只有一項待辦時，上一項／下一項停用，返回仍可用。共享純 issue-cursor 提供 canReturn／returnCurrent，重用原來源與 revision 核對、onLocate、頁面 reveal 及原欄位 focus；不前進 cursor、不改原文／時間／媒體。未定位、零待辦、來源失效、busy、隱藏或無選列停用；新 report revision 清除位置，精確回復來源可接續舊位置。歌詞手動換頁後返回原 global 明細所在頁，沿全部計數／前200保留明細。三個 DOM adapter 只綁定原生按鈕與狀態；沒有新 asset、operation、POST、模型或路徑權限。產品122／唯一交付 policy38–122共85，未知123拒絕；20／27 tools、原27組 schemas、Agent1／draft3及其他領域契約保持。

Repo已獲使用者當次授權公開，四個FreeTWAI新作品公開介紹頁已建立；平台目前為作者自行聲明、尚未核實，正式收錄仍需另行審核。保留PLATFORM-STATUS.md／json的2026-10-06實際觀察與四個網址，不重複提交、不宣稱取得創始認證。PolyForm Noncommercial 1.0.0、LICENSE／NOTICE、創辦ZOE. G／GitHub djguan-jpg保持。

619 Python（101.640秒）、1502 JavaScript、137 syntax與4個專案 Skills通過；新增18個JS測試、0 Python。單項邊界、任意原index含199、canReturn DTO隔離、stale／busy／hidden／missing selection、revision／count改變、false／throw focus及retry、定位期間來源失效與跨頁返回均覆蓋。上一版v121指定source ZIP（2245849 bytes、SHA a93b23de06079f0e5ca1dfbec3379417f598505358823c6c48c3aec6b859c594）實際還原619／1484，暫存還原移除。四scope×84個歷史producer的336份ZIP／manifest bytes相同，舊27組operation input/output schemas不變；八份既有whole lyrics Python data／files與JS data／Markdown及跨語言診斷相同，只更新產品meta。封裝器另對指定source commit的解出原始碼執行完整檢查，結果與SHA留本機manifest。

原生工作台先重現只有一项待辦時缺少直接返回入口。v122保留47份唯讀快照；10組功能返回加10組排版返回逐組核對完整創作DOM原值、stable row IDs與原生File身份。歌曲第40段的首／末與唯一待辦、鏡頭2的開始／母題引用、歌詞220開始／結束、精確來源復原、歌詞221的21／200跨頁與200／200末項均成功，總計219項只保留前200。Enter與滑鼠均實際定位；來源改動／新revision／零待辦／換台／未定位停返回，建立新報告不自動搶焦點。合成8秒WAV保持暫停0.5秒，返回不seek；其他工作台及原文保持，console warn/error零。未把DOM原值比對宣稱為完整持久草稿bytes驗證。

1280×720、390×844、720×900、1280×360共10組排版返回，活動欄位在viewport內、低於可見sticky工具列；低高度工具列static、頁寬未超過viewport。重用既有幾何與CSS，本輪沒有修改app.js或style.css。PNG留忽略QA目錄；只做原生操作與唯讀幾何，不宣稱完整視覺或screen reader接受。

實際工作台單句報告含219項，完整JSON及Markdown與application相同；CLI完整檔案bytes相同、exit2，重覆輸出exit1且原bytes保持，無效row拒絕／無輸出。Agent與MCP good-bad-good及短命HTTP 200／400／200完整成功回覆一致，四個既有固定JS GET與來源bytes相同。子程序取得EOF，短命HTTP thread正常join；兩個owned有界QA server正常停止、實際session EOF exit0，兩個owned瀏覽器tab關閉與viewport reset。native server沒有延遲注入，busy／無選列返回保護由純controller及三個DOM測試驗證。

首輪完整JS兩項失敗來自既有cue fake DOM未建立新增return按鈕，補齊fixture後1502全過；實際產品沒有因這兩項失敗改動。首次長句合成資料的end0.5沒有重疊，因此下一項停用；保留零待辦失敗觀察，明確改end5後才驗21／200與200／200。草稿原生下載事件等待5秒沒有取得落盤路徑；UI仍顯示「下載已送出，請核對」，沒有按確認、沒有把sent當saved，也沒有用CLI檔案冒充瀏覽器下載。

分支 `codex/iteration-v0.122.0`、基線main `1d428e2103687c92a14918d035e5d329b787d54f`、還原tag `restore-v0.121.0-before-v0.122.0`。由tag建立codex/restore-*分支經PR還原原始碼；不改草稿／素材，不撤銷已公開Repo或已送出的外部申請。指定source commit封裝，merge tree、遠端refs、公開release兩個assets實際下載bytes與SHA另留outputs/v122-qa。GitHub CI未設定，本機與指定source封裝檢查分開記錄。

只唯讀盤點本workspace outputs、直接release封裝與typed owned runs；發佈後最新122／121／120三版保護。嚴格超七天且exact tag／現場Git archive可重建才列清除候選；未知檔、素材、草稿、備份、失敗36／53及失敗QA保持。各session實際EOF後才最終稽核，不終止外部程序。瀏覽器落盤下載、完整視覺／screen reader、實聽／實際音畫同步、Host安裝及平台創始核實仍未驗證。

見[契約](docs/ISSUE-RETURN.md)，平台實際狀態見[PLATFORM-STATUS.md](PLATFORM-STATUS.md)。
