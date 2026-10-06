# ZOE. G Music Lab

## v0.132.0 備份選取撤回

「分批備份選取清單」新增撤回最近一次成功的加入、整批加入、移出、整批移出或清空。清空後鍵盤焦點移到撤回；按鈕明示上次操作與可還原的版數。搜尋或讀取更多不清除紀錄；撤回後沒有更早一步或重做，下一次成功變更替換紀錄，無效／失敗操作保留紀錄。只改本頁選取，保存版本與已送出的備份來源保持。

backup-selection 純原值與完整 before／after metadata Map、順序及目前 capture 核對 → 注入控制器 → backup-selection-dom 字面提示／原生操作／焦點。每份最多1000版，私有最近一筆；完整核對來源、重複與已知版本矛盾後才還原，錯誤可修正重試。busy／disabled／disposed拒絕；pagehide釋放紀錄。只核對已捕捉metadata，不宣稱未載入資料的新鮮度或外部原子快照。

628 Python（75.438秒）、1647 JS（新增20）、143語法與四Skills通過；集中63。43完整DOM快照核對四台全部欄位、21列ID、目前成果全文與下載旗標、未保存提醒；另逐一切換四份成果，前後全文相同。41版清空→搜尋無結果→還原41、單版及整批移出撤回、下載後還原21而來源仍為10版、取消保留來源，以及單版／整批加入撤回通過。三尺寸1280×720／390×844／1280×360的Tab／Enter清空10→0→撤回10與焦點可達，頁面與提示沒有水平溢出。

82份合成草稿JSON hash保持。三份QA來源ZIP完整核對41／10／取消10版，原生選回舊41版不符、目前10版相符；這不是瀏覽器落盤下載檔。application／CLI／Agent／MCP／短命HTTP完整inspection一致，good-bad-good及200／400／200保持；選10版的record／draft原bytes相同，各次建立時間不同。原v131指定ZIP實際還原628／1627、376歷史交付原bytes及27組schemas保持。

產品132／唯一來源38–132共95版，未知133拒絕；20基本／啟庫27工具、Agent1／draft3／backup1與維護schema保持。app.js、下載器、Python domain與HTTP／CLI／Agent權限沒有變更。更正v131十二份概覽的focused51為實際43；已公開v131 tag／ZIP保持原樣。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg及四份submitted_unverified投稿保持。

一個受控QA server按原PID／creation identity正常shutdown、context close及deadline thread join，實際exec EOF；一個IAB頁已關閉、viewport reset，console warn/error0。六張PNG留忽略outputs/v132-qa，不嵌入對話。完整視覺／screen reader、瀏覽器保存檔、媒體身份／實聽／同步、Host安裝與平台正式創始核實仍未驗證。

見[契約](docs/BACKUP-SELECTION-UNDO.md)。以下保留歷史迭代。

## v0.131.0 移出目前顯示版本

備份清單新增「移出目前顯示版本」，按鈕顯示目前已載入版本與清單的交集版數。搜尋31版但只載入20版時，只移出這20版；尚未載入與其他已选版本保留。讀取更多後可再移出剩餘11版。空搜尋或無交集停用，保存版本原檔不刪除；需要補回時仍可使用「加入目前顯示版本」。

backup-selection純metadata核對／共用完整batch提案 → 注入capture controller → backup-selection-dom字面提示／原生按鈕／焦點。remove先核對整份displayed、retained與同批duplicate一致後才delete交集；late conflict、unselected duplicate conflict、getter／sparse／額外欄位全部拒絕且保持原清單。已滿1000版且顯示其他新版本時，加入可因上限拒絕，但合法移出仍可用；add與remove proposal分別派生。舊三欄caller缺displayed不能推定整庫，沒有新fetch、分頁、保存／恢復、Agent operation或持久欄位。

忙碌停用編選；成功移出後若原按鈕持有焦點且停用，回到可用的整批加入，再按Enter可補回。下載沿既有固定ID／完整串流與SHA；取消仍保留上一份來源。app.js沿v130既有libraryRecords注入，無diff；後端、domain、CLI／Agent／MCP及HTTP權限保持。

628 Python（75.422秒）、1627 JS、143 syntax與四Skills通過；新增16 JS，focused43。29完整DOM快照核對四台全部原值、21個stable IDs（歌曲6結構＋6段落／分鏡1母題＋4鏡／歌詞4句）、四份成果全文／下載旗標及dirty=true提醒保持。三尺寸1280×720、390×844、1280×360的Tab／Enter移出10→0→補回10及焦點通過，頁面／提示／清單無水平溢出。41合成版本82 JSON hash保持；三個canonical來源ZIP完整核對，舊41版檔不符目前10版、當前10版相符。

application／CLI／Agent／MCP／短命HTTP inspection完整回覆相同，good-bad-good與200／400／200；10版export完整record／draft bytes保持，各次實際建立時間不同，不宣稱整包bytes相同。第一次inspection輔助脚本廣泛字串替換將HTTP200誤改100，保留失敗helper並以新helper只修正oracle後通過；產品沒有因該錯誤變更。原v130指定ZIP2448724 bytes／SHA fd4299bf1f69491699d1e24c71629c48128e76d5b955798b77641b70baf855e5實際還原628／1611；372歷史交付ZIP／manifest bytes及27組schemas保持。

產品131／唯一來源38–131共94版，未知132拒絕；20基本／啟庫27工具、Agent1／draft3／backup1與維護schemas保持。ZOE. G／djguan-jpg、PolyForm Noncommercial1.0.0、本次既有公開授權與四份平台submitted_unverified保持；不重複投稿或宣稱官方核實創始人。

瀏覽器download event未提供保存path；本輪選回的是QA server同份合成來源ZIP，實際瀏覽器落盤仍未驗證。完整視覺／screen reader、媒體File身份、實聽／音畫同步、Host安裝與平台創始核實仍未驗證。六PNG只留忽略QA。兩個刻意按版本分開的有界server正常shutdown／context close／thread join且實際exec EOF；一個本輪IAB頁關閉並reset viewport。

見[契約](docs/BACKUP-DISPLAYED-REMOVE.md)。以下保留歷史迭代。

## v0.130.0 加入目前顯示版本

分批備份新增「加入目前顯示版本」，一次加入保存版本選單已載入的版本。按鈕標示目前版數，旁邊提示尚未加入的數量；搜尋找到31版但只顯示20版時，只加入20版。需要其他版本時先手動讀取更多，再加入；搜尋無結果保留先前選取。相同ID不重複，資料矛盾或合計超1000版時整批拒絕並保留原清單。

backup-selection純原值metadata／dense array／全批提案 → 注入capture controller → backup-selection-dom字面文字、原生按鈕與焦點 → app只提供目前已載入libraryRecords。原三欄capture保持相容，沒有displayed的舊caller不能推定整庫。原selected的metadata ID getter會先執行問題已重現並修正；新增及原單版都先核對own data descriptors，再沿library-revision檢查，拒絕getter／未知欄位／sparse及custom hooks。這不是通用Proxy安全保證。

下載仍沿既有backup-download固定1–1000唯一排序ID及完整串流／SHA核對；沒有新增fetch、分頁、自動保存／恢復、草稿欄位、server operation或Agent權限。忙碌拒絕編選，取消保留上一份備份來源；原整庫／單版入口保持。Tab可達整批加入，Enter成功後新按鈕停用時焦點回到可用備份下載；搜尋／移出／清空只改本頁選取。

628 Python（76.921秒）、1611 JavaScript、143 syntax、四Skills通過；新增19 JS，focused35。26份完整DOM快照核對四台原值／歌曲六段ID、四份成果原文與下載旗標、草稿提醒保持；三種1280×720／390×844／1280×360尺寸的移出／重新加入和Tab／Enter通過，頁面與清單不水平溢出。41份合成保存版本82檔hash保持，三份canonical來源ZIP完整核對。CLI／Agent／MCP／HTTP inspect完整回覆相同，good-bad-good及200／400／200保持；20版export核對每版record／draft原bytes相同，建立時間為各次實際時間，不宣稱整包bytes相同。

原v129指定source ZIP2422138 bytes、SHA5ee78350428c823027fa41c36e341d3930390e03e3cd0a2a44fbad7376d35c4f實際還原628／1592；368份歷史交付ZIP／manifest bytes與27組schemas保持。產品130／唯一來源38–130共93版，未知131拒絕；20基本／啟庫27工具、Agent1／draft3／backup1及維護schemas保持。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、公開催權及四份投稿submitted_unverified保持，不重複提交。

瀏覽器下載事件未取得本機path；選回檔案為QA server額外保留的同份合成來源，明確不是瀏覽器落盤下載。完整視覺／screen reader、含非空分鏡／歌詞的本輪原生操作、媒體身份、實聽／同步、Host安裝與平台正式創始核實仍未驗證。六份響應截圖只留忽略QA目錄，未嵌入對話。兩個刻意分開的版本server phase按原handle正常shutdown、thread join與context close並觀察exec EOF；本輪IAB頁關閉、viewport reset。

見[契約](docs/BACKUP-DISPLAYED.md)。以下保留歷史迭代。

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


## v0.127.0 單版本備份

本機保存版本新增「下載選定版本備份」，可將選單中一個已保存版本另存ZIP。按下時固定ID，即使下載途中切換選單，也不改本次來源；成功提示明示該ID，整庫備份保持。空選擇／未啟庫／busy時停用；取消只中止自己請求、保留上一份成功備份來源。備份只含已保存版本，未保存編修、音檔與成果仍須另存。

backup-download純request嚴格核對ids、隔離／排序1–1000唯一ID；controller以click-time副本核對descriptor.selection及選定數量，沿原完整串流／SHA與latest／cancel／dispose。DOM共用同一sender、URL cap及verification來源，不增加第二個下載控制器或持久buffer。captureSelected只讀目前已展示records；library選擇事件刷新可用狀態，原预覽取消及後續編修保持。

既有POST /api/drafts/backup/prepare由{}整庫相容接續可選ids，沿共享Python selected_ids／export_library_backup；拒絕路徑、額外欄位、query、重複／空ID及跨Origin。ID不能選檔案路徑；沒有恢復或新增寫入權限。選定健康版本不讀未選定版本，整庫仍完整檢查。有效格式但不存在的ID維持既有HTTP500本機讀寫失敗，不自動重送。descriptor六欄、backup1／draft3／Agent1與27組operation schemas保持，20基本／啟庫27工具不變，沒有新asset、依賴、模型或外網。產品127／唯一policy明確來源38–127共90版，未知128拒絕。

見[契約](docs/BACKUP-SELECTION.md)。下方保留歷史迭代。


## v0.126.0 備份下載檔案核對

草稿庫備份旁新增「核對下載的備份 ZIP」。成功送出後可選回本機檔案，先核對1 byte至32 MiB容量，再以完整檔案SHA-256及大小核對本輪備份。來源只保留bytes／摘要／版本數；不持有完整備份，不恢復、載入、保存版本或确认未保存編修。新的成功送出遞增revision，即使內容相同也使舊讀取失效；下載失敗保留上一份來源。舊ZIP不能確認新ZIP。

純backup-verification嚴格原值模型、注入controller、原生File DOM adapter與原有backup-download sender分層。讀取與hash後重查本輪source／revision／busy、完整ArrayBuffer大小與選檔metadata，latest／cancel／pagehide／dispose保護晚回覆。原始32 MiB可完整核對；超限在arrayBuffer前拒絕。同大小錯bytes、短讀及來源失效保留原工作台、成果、列ID及草稿庫；選檔標為verification view control，不誤觸編修。單獨純verificationAllowed避免availability refresh寫入library訊息。

只新增三個固定GET JS資產；原備份domain／CLI／Agent／MCP／HTTP POST權限及schemas不变。20基本／啟庫27工具、27組schema、Agent1／draft3與backup1保持。產品126與唯一policy明確來源38–126共89版，未知127拒絕。PolyForm Noncommercial 1.0.0、ZOE. G及公開授權保持；四份自由工坊投稿已送出，創始身分仍submitted_unverified。

見[契約](docs/BACKUP-DOWNLOAD-VERIFICATION.md)。下方保留歷史迭代。


## v0.125.0 條件草稿下載核對

接受條件草稿下載旁新增「核對下載的條件草稿」。成功送出後可選回本次完整 JSON，以共享純 UTF-8 位元組核對確認該次保存快照；條件原值、工作台、列ID、媒體及既有報告保持。核對舊送出稿只確認它當時的條件，後來編修仍需另存；新的成功送出即使內容相同也使舊讀取失效。原本「已確認條件草稿檔案」按鈕保留。

既有純 audio-acceptance 保存模型不變；DOM adapter 只在 downloadText 成功後保留完整送出文字／遞增 revision，注入共享 text-verification controller／原生 File adapter，容量64 KiB在 arrayBuffer 前核對，沿 busy／visibility／latest／pagehide／dispose 保護。來源不取預覽或後來編修；失敗下載保留上一份有效來源。核對無需條件數值可解析，但分析仍完整驗證；BOM、重排、缺尾、同長錯文字、未知版本與額外欄位只要 bytes 不同就不確認。核對不是載入來源，不套用外部 JSON，也不改音檔。

原生測試重現核對選檔的 input 被通用 editor listener 視為編修，導致未改條件的報告過期。新 File 控制明確標示 data-view-control="verification"，重用既有唯讀排除；實際條件 input 仍照常標過期。沒有新增固定 asset、operation、POST、依賴、模型、外網或路徑權限。產品125／唯一policy來源38–125共88，未知126拒絕；20／27 tools、27組schemas、Agent1／draft3與獨立domain schemas保持。

見[契約](docs/AUDIO-ACCEPTANCE-DOWNLOAD.md)。以下保留歷史迭代。


## v0.124.0 草稿變更工作台

專案草稿的保存提醒新增變更工作台清單。尚未確認任何保存版本時，比對起始範例；已確認載入檔案、本機保存版本或下載草稿後，比對最近一次完整確認的內容。四個名稱固定依歌曲設計、母題分鏡、波形校時、交付檢查排序。還原一台的原值，該台退出清單；精確符合任何仍保留的完整版本或起始範例時，整份草稿維持既有已確認判定。

draft-retention 既有 checkpoint／注入 guard只新增隔離的 difference DTO（reference＋panels）；獨立 draft-difference 純模型嚴格核對列舉、最多四台、唯一／完整資料屬性後產生固定文字，app只更新提示 textContent／hidden。待確認下載不能替換參考；確認舊送出快照後，後續編修仍dirty。拼接不同保存版本的工作台片段仍需整份另存。原稿、列ID、媒體、成果、下載／本機保存流程與 beforeunload 原判定保持；摘要不帶原文／fingerprint／File／路徑，不進 draft3／Agent wire。新增一個固定GET JS，不新增 operation、依賴、模型、外網、登入或寫檔權限。產品124／唯一policy來源38–124共87，未知125拒絕；20／27 tools、27組schemas與獨立domain schemas保持。另修正根目錄 HANDOFF.md 的過期首頁版號。

見[契約](docs/DRAFT-DIFFERENCE.md)。以下保留歷史迭代。


## v0.123.0 草稿下載完整核對

草稿下載旁新增「核對下載草稿」。只有實際成功送出草稿後才可選檔；沿共享完整 UTF-8 原文位元組核對，比對本次送出的完整 JSON，而非預覽、檔名或 JSON 語義。相同檔案確認既有 click-time 保存快照；後續編修仍需另存，原工作台、時間、列 ID、音檔及成果保持。檔案可重新命名；BOM、重新排版、缺尾、舊送出稿或錯原文拒絕保存確認。原本明確「已確認草稿檔案」按鈕保留。

純 text-verification 模型 → 支援 draft scope／可選容量的注入 controller → 可選 IDs 的原生 File DOM adapter → app 的成功 onSent 與原 draft-retention guard。草稿容量1 MiB，在 arrayBuffer 前核對；既有成果預設8 MiB保持。最新 token、送出 revision、完整 source、busy、離頁及 dispose 防護保持；允許核對舊送出快照與後續 dirty 編修共存。送出時間只提供可見辨識，不是保存成功證據；File／檔案路徑、核對報告及暫態完整 source 不進持久草稿或 Agent wire。產品123／唯一 policy38–123共86，未知124拒絕；20／27 tools、27組 schemas、Agent1／draft3及領域契約保持，沒有新 operation、固定 asset、依賴、模型或外網能力。

見[契約](docs/DRAFT-DOWNLOAD-VERIFICATION.md)。以下保留歷史迭代。


## v0.111 待辦原列ID來源

三個純readiness模型 → 既有 `editor-focus.checkedSource` 的40段／1000鏡、own dense ID／64 UTF16 units／唯一性／固定initial length檢查 → 隔離ID副本與原panel精確列數檢查 → 原readiness-state來源fingerprint／report revision → 未改DOM橋接／原欄位定位。純共享呼叫提供固定visible=true／busy=false，只借用ID來源驗證，不改實際app的busy／visible門檻。來源的some／map／Symbol.iterator不呼叫，不把caller hooks搬入snapshot；沒有新增重複reader或新資產。

缺少自有index、空白ID、非字串、重複、超64units或與原panel列數不符時拒絕；讀取期間長度改變也拒絕。failed check保留上一份report及revision；refresh標stale，舊定位停用，精確恢復原欄值與ID順序後沿guard重新核對。成功重新檢查回第一頁，舊revision callback拒絕。未提供ID的歌曲／創作舊caller介面保持；時間原本要求ID仍保持。

產品0.111.0／唯一runtime policy38–111共74，未知112拒絕；17基本／24啟庫工具與24組既有input/output schemas、Agent1／draft3及領域schema保持。只改三個純JS控制器的ID來源，不改editor-focus本體、DOM／app／HTML／CSS、固定資產、Python domain／producer／application、server／CLI／Agent／MCP或程序政策。沒有新依賴、模型、路徑或網路能力。 見[契約](docs/READINESS-IDS.md)。

## v0.110 歌曲與分鏡待辦分頁

沿既有 `issue-page.js` 純metadata模型／注入controller → `issue-page-dom.js` literal DOM → 新 `readiness-page-dom.js` 報告橋接 → app 的原欄位與stable row IDs。橋接只在DOM層讀已保留報告；純分頁層不持有作品、File、DOM或網路。`readiness-state.js` 每次成功check／clear增加暫態revision，failed check不改上一份；定位同時核對報告revision與實際來源，舊callback拒絕。歌曲與時間沿原ID來源，創作補入鏡頭ID。翻頁只改暫態頁碼，不改原文、時間、媒體、草稿、上一份成果或下載dirty規則。

busy或離開所屬工作台時停用操作；stale可唯讀翻頁但停定位。來源原值與ID順序精確恢復時沿既有guard重新判為current，不要求永久stale；成功重新檢查即使內容相同仍增加revision並回第一頁。零明細隱藏導航。首末頁Enter使原按鈕停用時，焦點回到另一個可用翻頁按鈕；不搶走其他焦點。

產品0.110.0／唯一runtime policy38–110共73，未知111拒絕；17基本／24啟庫工具與24組既有input/output schemas保持，Agent1／draft3及領域schema保持。只新增一個固定GET資產；HTTP POST、application、Python producer、CLI／Agent／MCP、程序政策與授權邊界不變。沒有新依賴、模型、媒體生成或外網能力。 見[契約](docs/READINESS-PAGE.md)。

## v0.109 歌詞待辦分頁

`issue-page.js` 純 metadata 模型與注入 capture controller → `issue-page-dom.js` literal DOM／受控定位 → app 既有完整報告與 stable row IDs。純層只接受 detailCount／totalCount／revision／stale／busy／visible，不持有歌詞、File、DOM或網路；回調核對当前 revision及頁內原明細 index。忙碌或離開歌詞台時停用操作；編修後可唯讀翻閱上一份報告，定位必須重新檢查。翻頁不改原句、時間、音檔、草稿或上一份成果。首末頁按 Enter 後若原按鈕停用，焦點移到另一個可用翻頁按鈕；其他焦點不搶走。

產品0.109.0／唯一 policy38–109共72，未知110拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3及所有領域 schema保持。只新增兩個固定GET資產；HTTP POST、application、Python producer、CLI／Agent／MCP及程序政策沒有變更。沒有新依賴、模型、媒體生成或外網能力。

Windows CIM補查可能在既有3秒operation／5秒helper期限內回傳unavailable；沒有證據就保持unverified並拒絕清除。本輪只修正測試，涵蓋limited及unavailable時均保留資料，以及子程序EOF完成與外部補查是否確認的分離；不放寬程序政策或增加重試期限。早期完整測試與舊版還原遇CIM未確認的失败保留，最後現版595與原封裝v108595／1270均實際通過。 見[契約](docs/ISSUE-PAGE.md)。

## v0.108 完整回應值核對

既有 `json-document.sameValue` 純層 → 七個來源／完整回覆核對模組 → 原 current revision／scope controller → 原 DOM 與成果提交。比較原型別、完整自有欄位與 dense 陣列，不轉成 JSON 再比較；字面 Unicode、空白、換行及物件鍵順序獨立保持。有限數字、64層容器與262144對節點上限；不呼叫自有 getter、toJSON 或 caller map。Python producer、application、HTTP／CLI／Agent／MCP、app／HTML與操作權限保持，無新 asset、依賴、模型、媒體生成或外網能力。

產品0.108.0／唯一 policy38–108共71，未知109拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3／所有領域 schema保持。

固定歌詞預覽沿 template1全外框與本安裝模組核對。更新共用模組後，舊v107 HTML所嵌模組不同，現版明確拒絕回讀；同完整package的現版HTML通過，舊檔SHA保持，臨時還原移除。保留舊HTML與完整lyrics.json，需要接續時載入完整JSON並重新建立現版預覽；schema沒有遷移。舊版離線HTML仍保留其原程式，本輪沒有重写或宣稱新修正適用於舊檔。

五個外部JSON非有限數字案例與三個runtime額外undefined案例在基線確實誤判一致；undefined不是可在JSON編碼的欄位值。lyrics-preview只統一共用比較器，未宣稱它有上述基線缺陷。own descriptor／dense檢查不代表通用prototype、Proxy、繼承accessor安全或原子快照；比較器遇throw回傳false但未防止任意caller object的全部副作用。節點上限是比較訪問數，非任意外部物件的記憶體上限。PNG留ignored outputs；實際瀏覽器保存、完整視覺、screen reader、各OS IME、實聽、正式媒體、Host安裝及平台創始接受未驗證。 見[契約](docs/JSON-VALUE.md)。

## v0.107 歌曲段落搜尋

music_search／原生 music-search 純三欄字面與UTF-8位置、schema1／來源SHA → 共用application → CLI／Agent／MCP／HTTP → 注入current source／query／ID／result revision controller → literal excerpt DOM／native field focus。重用現有嚴格JSON、搜尋請求ownership、摘錄、輸入法Enter政策及editor-focus自有dense IDs核對；新三個固定JS assets。新增唯讀 music_search，17基本／24啟庫工具，需重新discovery；原23組input/output schemas保持。Agent1／draft3／既有交付schemas不改，產品107／唯一policy38–107共70，unknown108拒絕。沒有依賴、模型、媒體生成、外網或auth／路徑權限擴張。

搜尋不是歌曲完成、時間校準、實聽或權利接受；只按固定name／focus／texture順序列每段第一個字面命中。大小寫精確，不正規化或regex；開始原列1起，接續需來源SHA。原生下載點擊顯示已送出，但內建瀏覽器10秒未回報download事件，實際保存未驗證。PNG留在ignored outputs；完整視覺、screen reader、各OS IME、正式媒體、Host安裝與平台創始接受未驗證。不宣稱通用prototype／Proxy／accessor安全或外部改寫原子保證。 見[契約](docs/MUSIC-SEARCH.md)。

v0.106 完整焦點來源：editor-focus.checkedSource 純有界 length／own-index／ID 字串及唯一性檢查 → 隔離 dense ID 副本 → 原 index／ID proposal 與兩capture controller → 未改 editor-focus-dom。editor-selection 共用同一來源再沿原三capture／actual-after與DOM；不呼叫 caller map／iterator。固定原 length 控制讀取次數，讀完長度改變拒絕，不因 getter 增長超出上限。產品0.106.0／唯一 policy38–106共69／unknown107拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模型，app／HTML／DOM／domain/application/server/adapters與固定資產清單無diff，沒有新依賴、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-FOCUS-IDS.md)。下方保留歷史迭代。


v0.105 歌曲段落定位：editor-focus 純 byId 完整來源驗證與目前 ID 提案 → injected request controller 兩次 metadata capture 核對列序／visible／busy → 原 editor-focus-dom 依 ID 查實際名稱欄並核對可聚焦狀態 → app 原生 type=button／aria-controls／點擊。新 focusId 與原 index focus 共用 controller，保留原空列 add 行為；ID 查找不回退到新增。沒有新 keyboard listener，Tab／Enter 使用原生按鈕。產品0.105.0／唯一 policy38–105共68／unknown106拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模組及 app／HTML，沒有新增静態 asset、依賴、domain/application/server/adapter operation、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/MUSIC-ROW-LOCATE.md)。下方保留歷史迭代。


v0.104 回呼隔離：editor-position 純五欄來源／排列提案 → injected controller 保留自有 expected → writer 專屬六欄 DTO（before 五欄及 ids、afterIds 另複製）→ 原 raw-source order controller → 原始 expected actual-after → 固定原始位置通知。button／Enter 共用 finish；允許回呼修改自己的副本，不以 freeze 改變回呼介面，保留讀取次數與原 current-before／after-consume／false writer 語義。拒絕不符時不覆蓋或回滾外部編修。產品0.104.0／唯一 policy38–104共67／unknown105拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改一個純控制器，沒有 DOM／app／server／adapter、固定資產清單、依賴、路徑或網路權限變動。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-POSITION-CALLBACK.md)。下方保留歷史迭代。


v0.103 位置欄Enter：editor-position 純 strict gesture／none-hold-move intent → 原五欄metadata proposal／injected current-before-consume + current-after-consume + actual-after → editor-position-dom 自有可編輯INPUT keydown／preventDefault／focus → app 原完整raw-source order controllers。request button與enter共用finish，不新增history。只有自有當前位置input普通Enter消費default；IME／229、修飾鍵、其他鍵與已消費事件保持原生，repeat只消費不移動。純來源visible／busy也核對；失敗不回滾或宣稱成功。九原listeners加三keydown共十二，dispose只移除自身。產品0.103.0／唯一policy38–103共66／unknown104拒絕。16基本／23啟庫工具、23既有input/output schemas、Agent1／draft3保持；沒有新增assets、server／app diff、POST operation、依賴、路徑、模型或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-POSITION-ENTER.md)。下方保留歷史迭代。


v0.102 指定列移動：entry-order 純 arbitrary insertion／dense inverse → editor-position 純 metadata view／proposal／injected current + actual-after controller → editor-position-dom 自有九 listeners／literal ARIA／selected selector focus → app 原完整 raw-source order controllers。editor-order／music-arrangement 的 moveTo 共用原 history；歌曲移動及撤回增加完整來源的寫入前、實際 after 核對，拒絕 sparse sources／forged inverse。position 原字串是暫態 data-view-control，不修改 draft／revision；原操作仍完整驗證創作與時間。產品0.102.0／唯一 policy38–102共65／unknown103拒絕。16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持；只新增兩固定 GET assets，沒有新 POST operation、路徑、模型、依賴或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-POSITION.md)。下方保留歷史迭代。


v0.101 摘要快捷移動：沿 editor-keys 純 gesture／ID 提案與 injected current／consume／writer／actual-after 核對 → editor-keys-dom 自有 native SUMMARY 暫態 target／open bookmark → app 原完整 raw-source order controller。文字欄仍走原 caret 分支；摘要只讀 details.open，不讀或寫 input value／selection、不強制展開。只有同 ID、同 open 狀態、当前自有焦點才恢復 summary focus；沒有新 history、依賴、固定 assets、server diff、schema 或 Agent operation。產品0.101.0／唯一 policy38–101共64／unknown102拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4保持。PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-SUMMARY-KEYS.md)。下方保留歷史迭代。


v0.100 欄位快捷移動：editor-keys 純 gesture／相鄰 ID 提案 → injected controller current metadata／consume／writer／actual-after 核對 → editor-keys-dom 三容器 delegated keydown 與暫態欄位／caret bookmark → app 共用原 music-arrangement／editor-order 完整 raw-source 移動與撤回。keyboard 才回同一欄位，原工具列保持按鈕焦點；沒有新 history、創作 schema 或 Agent operation。兩個固定 JS assets；无新依賴、模型、外網、timer、路徑、auth 或寫檔權限。產品0.100.0／唯一 policy38–100共63／unknown101拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4 保持。PolyForm Noncommercial 1.0.0／private，創辦 ZOE. G／GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-KEYS.md)。下方保留歷史迭代。


v0.99 編修選列：editor-selection 純 metadata／ID 提案重用 editor-focus 與 entry-order → injected controller 三次 current IDs／visible／busy 核對 → 三容器 delegated focusin／refresh DOM → app 原 music selection 或 editor-order.select。只同步原生 selector／行標示／邊界按鈕，不呼叫 focus、讀創作來源、markDirty、改 revision 或建立 history；原動作保持移動按鈕焦點。busy 結束沿既有 collection refresh 核對當前原生焦點；隱藏、外部、已移除及 disabled target 拒絕。鏡頭 caption 使用 raw readValue 的目前 section／purpose，不依賴稍後才更新的 summary；穩定 IDs 時 select 不重建 options 或讀全文。兩個固定 JS assets，無新 operation／schema／依賴／timer／模型／網路／路徑／auth 權限。產品99／唯一 policy38–99共62／unknown100拒絕；16基本／23啟庫、Agent1／draft3、23 operation input/output schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted保持。見[契約](docs/EDITOR-SELECTION.md)。下方保留歷史迭代。


v0.98 列順序：entry-order 純 ID 相鄰排列與逆序核對，供原 music-arrangement 與新 editor-order 共用；editor-copy 原值 source guard → injected controller → editor-order-dom 原生選列／四按鈕 → app 原 readValue／writeEntries／markDirty／editor-focus。只保留最近 ID 順序與來源核對，metadata view 只有可撤回／stale／位置，不帶全文；busy／hidden 先拒絕讀取，提交前完整 source 與提交後隔離 expected 再查。DOM 只更新單列輸入標籤，未變順序不重建 options，原列 stable ID、raw 字串與 shot open 保持。三個固定 JS assets，沒有新依賴、operation、schema、Agent 路徑／寫檔／模型／網路／timer 或 auth。產品98／唯一 policy38–98共61／unknown99；16基本／23啟庫、Agent1／draft3、23 operation schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted 保持。見[契約](docs/EDITOR-ORDER.md)。下方保留歷史迭代。


v0.97 複製創作列：editor-copy 純原值／隔離提案／完整來源與 actual-after 核對 → injected controller → delegated editor-copy-dom → app 原 readValue／writeEntries／markDirty／editor-focus。draft3 契約提供三個列上限與欄位；40段／1000鏡／10000句，不猜時間、不合併同名、不改創作字串。鏡頭 open 僅頁面 metadata；新 row ID 使用同單調序列，完整替換舊列時保留原 IDs／open 狀態。busy／hidden／capacity 在 DOM gate 先拒絕，不讀原值、不分配 ID；full source 於 ID 前及寫入前重查，寫入後依隔離 expected 核對才通知焦點。render／busy／換台刷新按鈕只讀 count／visibility，不讀全部原文。複製只更新自己的 panel、dirty/checkpoint 与既有診斷，不增持久 copy 紀錄或 Agent operation。固定兩 JS assets；沒有新依賴、模型、網路、timer、路徑／寫檔能力或 auth。產品97／唯一 policy38–97共60／unknown98；16基本／23啟庫、Agent1／draft3／領域 schemas／legal4／private／FreeTWAI not_submitted保持。見[契約](docs/EDITOR-COPY.md)。下方保留歷史迭代。


v0.96 原值非負時間：Python common 與原生 planning-values 的 pure 原符號判定／非負讀取 → complete storyboard 與 partial timing → application 原四 adapters；browser 原 timing／overview／source guard／add-shot adapter。只在既有 finite decimal 驗證後核對負號及非零 mantissa，exponent 不作非零來源。signed number 與歌詞位移保持；frame ties-to-even／seconds tolerance不变。duration controller沿同Timing診斷拒絕提案，原 revision／late／scope／undo保持。無新asset／operation／schema／依賴／timer／模型／權限。產品96／唯一policy38–96共59／unknown97，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。見[契約](docs/NONNEGATIVE-PLANNING.md)。下方保留歷史迭代。

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


## v0.67 歌曲／分鏡報告接續

planning-report-input純strict decode／全部來源診斷→readiness-report精確完整document比較→隔離raw panel；planning-import.panelDraft驗draft3與UI可表示畫幅／引用／方向→既有latest target preview→DOM明確Apply／actual after scopedUndo。1MiB入口保持，report1／Agent1／draft3／14／19 tools無新權限；kind與報告暫態不入草稿。原文／未完成數值／母題ID保持；未知或不符拒絕，來源一致不證明作者／權利。產品67／交付來源38–67，legal4／private／not_submitted保持。見[契約](docs/PLANNING-REPORT-INPUT.md)。


## v0.68 分鏡自訂畫幅

原生text／datalist四建議→共用raw-fields→既有draft3／planning-import／target preview／explicit Apply／actual after scopedUndo。Python／Agent原文字契約保持，移除額外四值匯入拒絕；原文／空白／Unicode保持，不解析比例、補值、裁切或改素材。完整plan仍驗非空文字及所有創作／時間／影格。其他unsupported引用／方向拒絕保持；無新schema／工具／權限／依賴。產品68／交付來源38–68、14／19 tools、Agent1／draft3／report1／legal4／private／not_submitted保持，見[契約](docs/STORYBOARD-RATIO.md)。


## v0.69 保存回讀核對

pure library-receipt完整data ACK／同ID metadata／全部draft3→注入readonly read→required confirmSave→既有pending controller→DOM／retention。保存ACK後任何回讀錯誤（含4xx）／不符保持原ID與click-time原稿供重試；原save4xx拒絕規則保持。確認前saving仍阻擋放棄／重試，確認後才retain原稿、後續編修保持dirty。backend read核對磁碟bytes／SHA，browser不獨立重算保存bytes或承諾原子／耐久交易。產品69／來源明確38–69、14／19 tools、Agent1／draft3／library1／legal4／private／not_submitted保持，見[契約](docs/LIBRARY-SAVE-RECEIPT.md)。


## v0.70 保存版本預覽來源

pure library-revision共享完整entry／read data與save receipt→讀前clone selected metadata→required checkRead→原latest token／replacement snapshot→DOM current ID／完整metadata在read完成、Apply與export重查。wrong ID／metadata／late拒絕且保留編修／media；切換取消preview並提示重新預覽。checkedSelection只比較已驗entry，不冒充獨立完整record validator。backend read核對磁碟bytes／SHA，browser不獨立重算磁碟bytes；純data層未新增HTTP meta/files核對。全案load／Undo原media重選邊界保持。產品70／明確來源38–70、14／19 tools、Agent1／draft3／library1／legal4／private／not_submitted保持，見[契約](docs/LIBRARY-REVISION.md)。


## v0.71 備份來源及恢復確認

native backup-file最多32MiB File.arrayBuffer／大小核對／WebCrypto SHA→pure backup-result exact files/data/meta及current product／protocol1／needs_review=true→required hashFile/checkPlan/checkRestore controller→DOM。雜湊後與request後latest重查；plan核對同SHA／bytes、全部unique IDs與new/reused/conflict分組／計數及can_restore一致。restore核對同SHA／總數與added+reused，允許retry後分布改變；不符成功回覆保留same File／SHA供明確retry，原4xx拒絕規則保持。backend原ZIP CRC／manifest／revision bytes／hash及immutable restore保持，browser不獨立解析ZIP或承諾目標耐久／原子恢復。proof暫態不入draft／Agent。產品71／來源38–71、14／19 tools、Agent1／draft3／library1／backup1／legal4／private／not_submitted保持，見[契約](docs/BACKUP-RESULT.md)。


## v0.72 備份下載及取消

pure backup-download exact backup1 descriptor／knownrelative token URL／counts／32MiB bytes → required injected prepare/read/hash/send latest controller → native bounded stream及WebCrypto backup-file.sha256 → shared text-download-dom createByteSender有限URL ledger →DOM。text domain的8MiB／Unicode／name規則保持，generic sender只接受domain已驗prepared，不自作path／ZIP驗證。讀後、hash後及handoff前current重查；cancel/pagehide abort自身request，late success/error不覆蓋，dispose清自身URLs/timers/listeners，BFCache新明確下載可用。取消headers/body的ConnectionError只關回應，其他I/O錯誤保持。sent是click+schedule，保存未驗證；沒有獨立ZIP語義parse或作者／權利證明。產品72／來源38–72、14／19、Agent1／draft3／library1／backup1／legal4／private／not_submitted保持。見[契約](docs/BACKUP-DOWNLOAD.md)。


## v0.73 唯讀備份匯出

純backup_export checked_request／shared selected_ids→原immutable export_backup→同一次raw完整read_backup／CRC／manifest／revision hashes與producer摘要/selection/IDs核對→不可變bytes/hash/selection/IDs PreparedBackupExport→共用application→CLI stdout／Agent JSONlines／MCP strict outputSchema／HTTP readonly export。metadata預設，explicit include_archive=true且ZIP<=512KiB才base64；超限在encode前拒絕。JSON不可選來源/目的路徑、overwrite、media或未保存draft；來源由啟動時明確草稿庫。export1與backup1/draft3/library1/Agent1分開，未知輸入欄位拒絕；schema形狀不代替ZIP/來源核對。新工具readonly，基本14/啟庫20需重新discovery；原backup/prepare/inspect/restore語義保持。沒有自動寫檔、耐久或全庫原子快照承諾。產品73/來源38–73/unknown74、legal4/private/not_submitted保持，見[契約](docs/BACKUP-EXPORT.md)。


## v0.74 保存回覆與清單

shared library-revision.checkedMetadata→pure library-result exact save/list/read envelope／bounded list/source→required injected checkList／latest→DOM。current產品／protocol1／empty files／operation needs_review精確，save確認回讀也沿同門檻；原receipt／完整revision檢查保持。不符ACK保留pending同ID及原稿，錯readback保持uncertain；不假造status400釋放ID。list metadata全部欄位／Unicode／unique IDs及issues／原stored_at+ID排序／next cursor與完整page／current cursor metadata核對，before onList；未知／late不覆蓋編修、清單、預覽、media及dirty。metadata不驗實際draft SHA，read仍由backend核對bytes/hash。固定asset只新增原生JS，無新wire／schema／權限／工具／依賴。產品74／明確來源38–74／unknown75、14/20／Agent1／draft3／library1／legal4／private／not_submitted保持。見[契約](docs/LIBRARY-RESULT.md)。


## v0.75 全庫保存名稱搜尋

pure library_search strict query/metadata index/canonical observed SHA/page/schema→DraftLibrary.metadata_snapshot→application四adapter；新唯讀draft_search僅明確啟庫，14基本/21啟庫需重新discovery。1–200codepoints/800UTF8/limit1–100/最多1000版本，literal case-sensitive保留Unicode/空白；只label與三title，不body/media。cursor pin query+全部可讀metadata及排序unreadable IDs，變更／end越界拒絕；不是disk bytes或原子snapshot/作者證明。browser pure envelope/data/current/search1/metadata/每列匹配/頁長/原stored_at+ID排序/cursor及前次boundary→latest/query/已顯示ID/controller→literal DOM；query改動、cancel、unknown/late保留清單/preview/edit/media；all refresh取消自身搜尋，明確成功才切all。search不進draft或新增write/path/model/依賴。新scripts/check_python_tests.py固定2隔離程序且120s整體期限，parent完整discovery逐ID核對coverage；package使用同runner，不提高期限。產品75／來源38–75／unknown76、Agent1/draft3/library1/backup1/legal4/private/not_submitted保持。見[契約](docs/LIBRARY-SEARCH.md)。


## v0.76 保存搜尋呈現

pure library_match/原生library-match：完整metadata/strict Unicode/query→四欄字面匹配與nonoverlap codepoint spans，原search重用，不增wire。pure library-presentation完整DTO/acceptedquery/selectedmetadata/零命中/空庫/unreadable/disabled→library-presentation-dom detached literal text/mark→原app controls；不讀目前editedquery冒充舊來源、不進draft/checkpoint/Agent。4欄/最多560marks、256px局部scroll/tabindex/窄版換行；未知或不符capture拒絕並保留既有DOM，非transactional DOM或通用HTML安全/作者/權利接受。原latest/cancel/selection preview/edit/media保持，14/21/Agent1/draft3/library1/backup1/search1/legal4/private/platform not_submitted保持。產品76/來源38–76/unknown77，見[契約](docs/LIBRARY-PRESENTATION.md)。


## v0.77 可攜 UTC 時間

pure utc_timestamp與shared native utc-timestamp strict Unicode/最多128codepoints/extended YYYY-MM-DD/任一單codepoint separator/HH可選:MM可選:SS與3或6位秒小數/Z或±00:00可選:00與3或6零小數；year1–9999/Gregorian leap/day/HH0–23/MMSS0–59，unknown/invalid拒絕且不改原字串。library_contract及backup created_at、browser revision/list/search/receipt及backup-result plan共用，無Date.parse/fromisoformat runtime寬鬆接受；producer正常UTC isoformat不變、raw stored_at+ID lexical排序與restore bytes保持，不做timezoneconversion/migration。前版browser-only Z現同Python接受，native3.11額外格式不自動開放。oneUnicode separator沿既有Python契約，controls只以原文展示不執行；不是任意ISO8601/RFC3339或人類時間信任證明。新固定asset1、不增wire/schema/operation/tools/path/write/model/依賴；產品77/來源38–77/unknown78、14/21/Agent1/draft3/library1/backup1/search1/legal4/private/not_submitted保持，見[契約](docs/UTC-TIMESTAMP.md)。


v0.77追加：UTC.compare以原始Unicode codepoint比較，list/search沿Python stored_at+ASCII ID排序；不以UTF16比較、Date或locale替代原source順序。完整timestamp驗證與原字串保持，matched tuple/continuation/原schema保持，見UTC-TIMESTAMP契約與QA final收據。


## v0.78 波形定位

pure wave-position完整source/current_source/duration/position/ready/error快照→顯示／鍵盤／滑鼠候選→注入controller套用前重查來源/時長→wave-position-dom literal text/ARIA/owned listeners→原native player/app同view比例畫游標。空／未知／錯／source不符歸零停用、tabindex-1，不攔截不可用鍵；顯示毫秒不改原秒數。方向鍵0.5秒／Shift0.05秒／HomeEnd，組合快捷鍵保持，無timer/URL/新媒體decode。定位不進draft3/wire，原waveTask/時長採用/手動stamp/草稿保持；2fixed assets/產品78/來源38–78/unknown79，14/21及原schema/legal4/private/not_submitted保持。見docs/WAVE-POSITION.md。


## v0.79 逐句標記撤回

pure cue-stamp-edit重用既有stamp毫秒及wave-position readiness→注入readRow/writeTimes/captureMedia controller→literal cue-stamp-edit-dom／app。單筆stable ID＋原start/end字串＋actual after，文字不留歷史；套用前核對完整row與source/current_source/duration，natural position前進可保持本次capture。undo先核對target actual after，只寫時間並再核對實際值；目標改時／刪除永久stale，改回／刪句還原不復活，文字／其他row／media改動可保留。同值／錯誤保留原有效record，new lyrics render無ID清除。history不進draft3/wire/Agent/results；busy阻擋、owned click listener dispose，無timer/URL/媒體decode。共用captureLyricPlayer維持原波形路徑。2fixed assets/產品79/來源38–79/unknown80，14/21及原schema/legal4/private/not_submitted保持。見docs/CUE-STAMP-EDIT.md。


## v0.80 發佈預期標籤

projects.version及release_version精確等於selected commit policy.current及v+current，schema1 strict；release_version僅預期tag，不是remote publication或創始接受。pure release_metadata frozen identity／原policy grammar→strict marker64KiB/policy8192B→Git cat-file size前檢查/show同blob bytes→package mkdir前guard與archive完整metadata/policy再核對，working files不換来源、不靜默修復。manifest1只新增checks.release_metadata=passed，歷史ZIP/tag/原packager與maintenance判定保持。產品80／supported38–80／unknown81，14/21／Agent1/draft3/領域schemas/legal4/private/not_submitted保持，web/HTTP/Agent/CLI無diff，無新依賴/模型/路徑或網路權限。見docs/RELEASE-METADATA.md。


## v0.81 目前歌詞原列定位

current-cue純media/rows/visible/busy→既有wave-position/CueStamp/activeCueIndex→注入capture/focus controller→literal DOM與app。最多10000列、ID64、time4096；未知／不可定位媒體清舊句與高亮，busy只讀停focus、hidden等待、gap/exclusive end沿舊規則，部分可播放不等於完整匯出。明確focus雙capture同ID／原目標欄位／media source/current_source/duration，再DOM核對enabled/connected/raw fields並確認activeElement；同句自然前進／其他列編修保持，不自動focus，不改草稿／media／歷史。status只變更時寫入，dispose只清自有listener，沿原drawWave/tick/reset/loadstart/error/tab/busy/render更新、不新增timer。server僅兩固定JS路由，產品81／來源38–81／unknown82／expectedtag81，14/21／Agent1/draft3／領域schemas/legal4/private/not_submitted保持。見docs/CURRENT-CUE.md。


## v0.82 原句首播放定位

cue-position純原row／wave-position完整media／LyricTime毫秒→注入readRow/captureMedia/isAllowed/setPosition controller→delegated DOM→app。stable ID／完整raw start/end/text與source/current_source/duration雙讀前核對，寫後第三media核對實際位置±1ms；natural progression可保持，失敗不虛報或承諾media回滾。只currentTime、明確成功focus波形，play/pause／表單／草稿／撤回保持；結束留白可定位不代表完整cue接受。input/render/stamp undo強制refresh，position-only tick沿便宜context不重掃rows，busy/hidden停用，dispose清自身兩listeners，無新timer/URL/decode。共用lyric_timing/lyric-time沿strict decimal原mantissa拒絕負值下溢字串（-1e-999），真正負零與signed shift保持；已轉numeric0無法恢復原字面，不宣稱任意JSON數值精度。server只兩固定JS路由，產品82／來源38–82共45／unknown83／expectedtag82，14/21／Agent1/draft3／領域schemas/legal4/private/not_submitted保持。見docs/CUE-POSITION.md。


## v0.83 目前歌詞播放資料

current-cue checkedRows／checkedContext／原playableCues與activeCueIndex→private單份prepared rows→注入playback controller→owned DOM高亮／app。input/render/stamp與undo/batch apply與undo明確invalidate，token拒絕讀取中失效；錯rows只嘗試一次，下一次失效或明確fresh focus可重查。position-only只context，hidden/unready初次不讀rows，busy維持唯讀但停focus；media每次核對，原exclusive／last overlap保持，仍O(n)numeric scan。focus沿原createController完整fresh來源雙讀及DOM原欄位核對，顯示cache不替代來源。未發送事件的外部任意value改寫不保證即時display，明確focus仍fresh；single prepared copy有界10000列，invalidate/dispose釋放。高亮僅owned old/new，same connected ID不重resolve或write、detached同ID新node重resolve，dispose清owned listeners/class。無新timer、asset、schema或操作；product83／來源38–83共46／unknown84／expectedtag83，14/21／Agent1/draft3／legal4/private/not_submitted保持。見docs/CURRENT-CUE-PLAYBACK.md。


## v0.84 編修焦點接續

editor-focus純六清單metadata（IDs／visible／busy）與entry/new/add候選→注入capture/focusTarget雙來源核對controller→editor-focus-dom固定入口/目標/原生activeElement確認→app。ID不入草稿；最多40/100/100/30/1000/10000列、ID64，未知list/field/mode/超界/重複ID拒絕；dispose停讀與副作用。新增歌詞focus文字、空表focus新增、還原row與shot摘要；只明確add/delete/undo時執行，不因播放/載入自動搶焦點。focus本身不寫編修值、markDirty或media；shot details.open沿原暫態行為。兩固定JS路由，不增加POST/Agent/CLI操作或路徑權限。產品84／來源38–84共47／unknown85／expectedtag84，14/21／Agent1/draft3/legal4/private/not_submitted保持。見docs/EDITOR-FOCUS.md。


## v0.85 原句搜尋

v0.85 原句搜尋：獨立search1，texts原順序/Unicode/重複句、10000列/每句2000codepoints/compact UTF8 array2MiB/query1024bytes/1–50結果。prefix+array SHA只pin文字，start_row>1必須前次SHA。Python/JS純層→application四adapter；browser injected generation/current完整texts+IDs/query/results revision→complete reply data/JSON/MD/meta核對→literal DOM→原生穩定ID文字欄focus。query/results/pager不進draft3，不因播放tick掃整表；時間編修與音檔保持。新增CLI lyrics-search、Agent/MCP lyrics_search、POST /api/lyrics-search及三固定JS資產；基本15/啟庫22需重新discovery。Agent1/draft3與既有schemas、legal4/private/not_submitted保持，產品85/來源38–85共48/unknown86。見[契約](docs/LYRICS-SEARCH.md)。


## v0.86 完整原文核對

v0.86 完整原文核對：text-verification.js純原文UTF-8與選定bytes模型（8MiB、本機view1）→text-verification-controller.js注入capture/describe/readFile與latest/current/大小保護→text-verification-dom.js原生File/arrayBuffer/literal status→app state.textVerification與canonical state.files。refresh只取字串/metadata，不編碼全文；明確選檔才有界讀取。三固定靜態JS，沒有POST或CLI/Agent/MCP操作，沒有新增領域schema/路徑/網路/寫檔權限。15/22、Agent1/draft3與既有schema保持；核對不解草稿另存提示，不進保存/備份。產品86/明確來源38–86共49/unknown87，legal4/private/not_submitted保持。見[契約](docs/TEXT-VERIFICATION.md)。


## v0.87 刪除鏡頭保留原時間

v0.87 刪除鏡頭保留原時間：共用純History.remove/restore保留stable ID與原值→app原生entriesFor/writeEntries→限定markDirty與editor-focus。刪除只取remaining/record，不呼叫compactShotTimes或生成effects；保留既有純工具與歷史格式相容。原缺口/負值/極短秒數交由現有純時間診斷與完整domain驗證；CLI/Agent/MCP/HTTP皆共用application，無新operation/schema/asset/權限。15/22、Agent1/draft3保持；產品87/明確来源38–87共50/unknown88，legal4/private/not_submitted保持。見[契約](docs/STORYBOARD-DELETION.md)。


## v0.88 共用清單busy

v0.88 共用清單busy：collections固定add/remove metadata→app refreshCollectionControls DOM adapter；四新增入口在capture/ID/write/dirty/focus前以既有state.busy拒絕。六add/指定remove/三台還原select與button沿run timingControls/finally切換；不讀來源或重建選單，較早選擇與歷史保持。原欄位編修沿revision/current及dirty保護；纯domain/History/controller保持，無新asset/HTTP/CLI/Agent/MCP operation/schema/權限。15/22、Agent1/draft3保持；產品88/來源38–88共51/unknown89，legal4/private/not_submitted保持。見[契約](docs/COLLECTION-BUSY.md)。


## v0.89 範例載入保護

v0.89 範例載入保護：app refreshExampleControls DOM adapter只讀state.busy/examples與兩固定button；exampleAllowed在load/clear/dirty/render之前拒絕busy或null。初始HTML disabled、startup首/finally與共用run的timingControls沿既有成功/失敗/過期釋放；不新增獨立timer。晚到startup只有idle且retention.atInitial才套用，busy不重寫進度；後續編修保持。明確idle範例仍只替換對應panel及清除其history，不冒充保存/撤回。15/22、Agent1/draft3及domain保持，無新asset/route/operation/schema/依賴/權限。產品89/来源38–89共52/unknown90，legal4/private/not_submitted保持，見[契約](docs/EXAMPLE-AVAILABILITY.md)。


## v0.90 取消等待

v0.90 取消等待：pure operation-gate 注入 AbortController factory，以 job identity/current/cancelled/finish 管理同一共用任務；失效先於 abort，非中斷階段未settle前不釋放。app.run/current.signal → 明確各request callback → api native signal；不讀全域隱含signal。固定 operation-control DOM adapter 只顯示可取消/cancelling並在仍持有cancel焦點時返回可用發起按鈕，後續focus保留。原source/revision/dirty保持，取消不新增synthetic revision或覆蓋編修/歷史/媒體/上一份成果。server只serve兩固定JS；後端可完成，不新增取消endpoint、Agent權限或依賴；15/22、Agent1/draft3保持。獨立控制生命週期保持。見[契約](docs/OPERATION-CANCEL.md)。


## v0.91 處理列

v0.91 處理列：operation-presentation純有界known scope/action metadata與gate view一致性→operation-control-dom begin隔離原動作、refresh只取gate與literal DOM→app.run開始前擷取發起button.textContent。main上方單一sticky取消入口；idle清title/note/context，無timer/scroll/source讀寫。既有operation-gate/native signal/source-current/finally與focus保持，server只serve一固定JS；15/22、Agent1/draft3/domain/wire/legal4/private/not_submitted保持。產品91/supported38–91共54/unknown92拒絕。見[契約](docs/OPERATION-PRESENTATION.md)。


## v0.92 分鏡原文搜尋

v0.92 分鏡原文搜尋：pure storyboard_search／原生storyboard-search→application四adapter→注入source/ID/query/generation/results current controller→literal DOM／原欄focus。新獨立search1，只讀八敘事欄位；16基本／23啟庫需重新discovery，Agent1／draft3／既有22 schemas保持。產品92／交付38–92／unknown93，見[契約](docs/STORYBOARD-SEARCH.md)。


## v0.93 歌詞與分鏡搜尋取消

v0.93 歌詞／分鏡搜尋取消：共用 search-request 純請求 ownership／注入 AbortController factory → 各搜尋 controller generation/source/ID/results current → app 明確傳遞 signal → native fetch；固定 DOM 顯示取消並在仍持有焦點時返回查詢欄。失效先於 abort，旧 finally 不能釋放新 job；顯式取消保留上一批、分頁歷史、原文與成果，換查詢／來源／換台沿原 reset 清除舊定位。idle cancel 不 capture／render／建立 job；pagehide listener 屬於 document。讀取本機 SHA 可晚 settle、後端可完成；搜尋 ownership 立即失效，可明確重試，與共用 operation-gate 等待 local settle 的契約分開。只新增一固定 JS asset，無新 operation／schema／取消 endpoint／路徑／模型／依賴。16基本／23啟庫、Agent1／draft3／23既有 input/output schemas／legal4／private／FreeTWAI not_submitted保持。產品93／交付38–93共56／unknown94拒絕。見[契約](docs/SEARCH-CANCEL.md)。


## v0.94 搜尋命中前後文

v0.94 命中前後文：共享 search-excerpt 純來源／UTF-8 span與query核對，重用既有 delivery-context 的每側64byte邊界模型；2000codepoints原欄位、query≤1024bytes，顯示每側48／命中96codepoints，控制符visible token不能被截斷。shared literal search-excerpt-dom建立span／mark，再由兩個原DOM adapter接到現有current controller；先准备全批view再改DOM。無innerHTML／source寫入／網路／timer，新server僅兩固定JS assets。原prefix caption helper相容保持，live結果使用新view；完整files/data/meta與兩種search1／23舊operation schemas不變。產品94／policy38–94共57／unknown95拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。見[契約](docs/SEARCH-EXCERPT.md)。


## v0.95 搜尋選字保護

search-input 純三欄鍵盤 metadata → 三個原 DOM adapter → 既有搜尋 controller。isComposing 或 legacy keyCode229 不 preventDefault、不讀來源／清單或呼叫搜尋；只有有效普通 Enter 才執行原動作。純層無 DOM／事件副作用、timer、網路或持久狀態；固定一 JS asset。控制器、app、application／CLI／Agent／MCP、領域 schemas 與 23 operation input/output schemas不變。產品95／唯一policy38–95共58／unknown96拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。見[契約](docs/SEARCH-INPUT.md)。


## v0.112 選定鏡頭待辦

新增選定原鏡號的必填欄位、方向與母題引用檢查，整份分鏡200明細上限保持。可定位後面的鏡頭，舊選擇／順序／來源與晚回覆不能替換新編修。Python／JS共用既有整份診斷規則，controller暫態與字面DOM分層；CLI／Agent／MCP／HTTP共用同一報告，18基本／25啟庫工具，原24組schemas保持。獨立shot-review1，Agent1／draft3保持；無新依賴／模型／媒體／外網或路徑權限。產品112／唯一policy38–112共75，未知113拒絕。

純共用shot診斷及完整回覆核對→注入current IDs／selected context checkpoint→literal DOM；IDs、report與preview不進draft3。單鏡JSON最多256 KiB、完整source8 MiB；CLI --draft必須--row，--input不可覆蓋原row。零待辦不代表完整時間／影格／连戏或媒體接受；舊選擇、source／revision及晚回覆保護原編修。見[契約](docs/STORYBOARD-SHOT-REVIEW.md)。


## v0.113 選定鏡頭請求

選定鏡頭報告先核對完整回覆的 JSON 值與來源，再交給獨立注入式 request controller 管理成功、錯誤、來源改變、取消及重試；DOM 僅提交已核對成果。舊請求不能結束新請求的 pending 狀態或覆蓋新成果。原 25 組工具 schemas、18 基本／25 啟庫工具、Agent1／draft3／shot-review1 保持；僅新增一個固定 GET 資產，既有 POST 與授權邊界保持。產品113／唯一 policy38–113共76，未知114拒絕。

完整DTO先核對自有JSON值、再來源；request序號／外層current／selected proof控制成功與錯誤；取消／invalidate不讓舊finally終止新pending。無新HTTP／Agent權限。見[契約](docs/STORYBOARD-SHOT-REQUEST.md)。


## v0.114 單鏡逐項定位

單鏡待辦新增固定工具列的上一項／下一項與重查入口；純issue-cursor管理report revision／index與邊界，DOM沿原來源核對定位原欄位。新報告不自動定位，來源／選擇／順序／busy與換台停舊位置。共享focusShot以純shot-field-position計算目前欄位與工具列遮擋後的捲動；短視窗工具列改static。既有25組工具schemas、18基本／25啟庫、Agent1／draft3／shot-review1及POST保持；新增兩個固定GET。產品114／唯一policy38–114共77，未知115拒絕。

游標只保留有界metadata與report revision；定位成功才前進。共享欄位位置純模型與DOM讀取分層，來源改變不能舊定位；短視窗工具列static，來源、File及草稿保持。無新HTTP／Agent權限。見[契約](docs/SHOT-ISSUE-NAVIGATION.md)。


## v0.115 選定歌曲段落待辦

歌曲工作台新增「檢查選定段落」：即使整份待辦200明細已滿，也能檢查原第40段的五個編曲欄位並定位。既有music-readiness共用規則 → 選定原列／stable IDs的純checkpoint controller → 字面DOM → app原欄位focus分層；不補寫、改原值或提交成果。選擇／順序／選定欄位改變停舊定位，精確復原可接續；其他段落與全域欄位的合法編修不影響這五欄的診斷。零待辦仍需整首歌曲、總長與實聽驗證。產品115／唯一policy38–115共78，未知116拒絕；18基本／25啟庫及原25組schemas、Agent1／draft3保持，新增兩個固定GET。

選定診斷只保留五欄原值、完整stable IDs與原列；沒有新Agent operation，整首報告與dirty規則保持。來源改變拒絕舊定位，暫態不進draft3；literal DOM與current capture分層。見[契約](docs/MUSIC-SECTION-REVIEW.md)。


## v0.116 單段報告跨工具

新增「建立單段報告」與唯讀 music_section_review：共用 Python music_review 的 required／numeric 規則，獨立 section-review1 保留原段落1起、總段數與選定五欄原字串；JSON／Markdown 經完整 data／files／meta 核對才提交成果。共享注入 readiness-request 管理來源／晚回覆／取消／重試，既有單鏡 wrapper 沿相同 controller。CLI／Agent／MCP／HTTP 共用 application，19基本／明確啟庫26工具，需重新 discovery；原25組 input/output schemas 不變。產品116／唯一 policy38–116共79，未知117拒絕；Agent1／draft3保持。新增一個固定GET與一個唯讀POST，沒有新路徑、模型、外網或寫入權限。零待辦仍須整首歌曲、總長與實聽驗證。

共享領域／完整來源與回覆guard → 注入純request → literal DOM／成果，late／cancel／retry不覆蓋後續編修。既有單鏡wrapper API保持，25 schemas保持；selected local context與app完整revision明確分開。見[契約](docs/MUSIC-SECTION-REPORT.md)。


## v0.117 單段逐項定位

歌曲單段待辦新增工具列「上一項／下一項／重查這一段」。共享 issue-cursor 只保留report revision／有界index，明確定位成功才前進；重查重設而不自動搶焦點，來源／stable IDs／選擇／busy／換台拒絕舊定位。共用純 editor-field-position 幾何與既有shot wrapper，明確focus原欄位後核對工具列遮擋；窄視窗維持表格內水平捲動，height≤400px改static流。單段DOM使用注入的literal段落訊息，既有單鏡預設文字與API保持。新增一個固定GET，沒有POST、Agent權限或schema變更；19基本／26啟庫、原26組工具schemas、Agent1／draft3／section-review1／shot-review1保持。產品117／唯一policy38–117共80，未知118拒絕。

cursor只保留有界metadata與report revision，定位成功且來源仍有效才前進；新report重設。共用純geometry與DOM讀取分層，stable IDs及原生focus不進草稿。見[契約](docs/SECTION-ISSUE-NAVIGATION.md)。


## v0.118 歌詞診斷完整核對

歌詞校時診斷先以共用strict JSON值核對來源，再讀取欄位與建立隔離副本；getter、稀疏陣列、隱藏／symbol／undefined／無效Unicode拒絕。完整回覆精確核對root data／files／meta、當前唯一產品版本、protocol1及needs_review=true，再核對完整report與JSON／Markdown，checkedResult交付自有data／files副本。舊inspect API保留。Controller將capture放在try內，失敗不送transport，當前pending才釋放；晚回應／錯誤／finally不覆蓋後續工作。原request可省略title／duration，僅report明示既有defaults；時間規則與診斷格式保持。19基本／26啟庫、原26組schemas及Agent1／draft3／review1保持，沒有新operation或GET。產品118／唯一policy38–118共81，未知119拒絕。

嚴格來源驗證先於欄位讀取／clone，完整當前meta與兩檔核對後才交隔離結果。capture錯誤與晚回應按token歸屬保留後續工作。見[契約](docs/LYRICS-REVIEW-GUARD.md)。


## v0.119 選定歌詞校時待辦

選定歌詞待辦共用 lyrics_review 的完整來源與時間分析，先依原句／作品時長篩選再套200明細上限；全部原句仍參與重複開始與horizon重疊核對。新增獨立 lyrics_cue_review schema1、application／CLI／HTTP／Agent-MCP，20基本／27明確啟庫，舊26組schemas保持。單句report只帶選定cue與title／duration，不帶整份歌詞；source controller核對整份原值、stable IDs與選列，其他句子也可使舊位置失效。檢查／報告不改原文、時間、音檔或草稿；零待辦仍須完整歌詞包與實聽。產品119／唯一交付policy38–119共82，未知120拒絕；Agent1／draft3及其他schemas保持。

先篩原句／global row再套detail cap，全部原句關係仍驗證；browser完整source／IDs／selection proof核對成功後才提交隔離DTO。見[契約](docs/LYRICS-CUE-REVIEW.md)。


## v0.120 單句逐項導覽

選定歌詞新增「重查這一句／上一項單句待辦／下一項單句待辦」工具列，成功定位後同步目前明細頁；修正長表格需返回上方清單逐項處理的操作缺口。純 issue-cursor 明確 maxDetails 1–200，舊鏡頭／段落預設32保持；純 issue-page.reveal 核對 revision／可定位狀態及兩次metadata後，顯示選定保留項所在頁。單句沿原200明細／20頁內項與全部issue_count，頁面／cursor／焦點不改時間或進draft。可見黏附工具列與既有field-position共用幾何，global作品宣告忽略畫面外工具列；高度≤400px回普通流。產品120／唯一交付policy38–120共83，未知121拒絕；20／27 tools、舊27組schemas與Agent1／draft3保持。

source／IDs／selection先核對再定位；cursor成功後保留來源檢查，pager reveal只走retained前200項，完整issue_count不得充當detailCount。見[契約](docs/LYRICS-CUE-NAVIGATION.md)。


## v0.121 目前待辦原因與位置

單鏡、單段與單句工具列現在顯示最後成功定位待辦的原位置、欄位、原因及關聯列，讓長表格編修時也能知道正在處理什麼。純 issue-summary 只格式化有界嚴格 JSON metadata；三個 DOM adapter 共用清單與工具列文字，在來源失效、busy、隱藏、無選列、未定位或新 revision 時清除說明。回復精確來源可恢復上一個成功位置；不因手動焦點改動重寫 cursor。說明換行後由 app 重新量測活動欄位，僅對已活動的原欄位調整捲動，不重新聚焦其他控制。實際窄畫面發現單鏡長待辦按鈕造成31px溢出，改為有界換行；空鏡頭選列也停用清單與 cursor。新增一個固定 GET asset，沒有新 operation。產品121／唯一交付policy38–121共84，未知122拒絕；20／27 tools、旧27組schemas、Agent1／draft3與其他domain保持。

目前說明為最後成功cursor診斷，不能冒充手動activeElement始終與cursor一致；post-caption reveal只作用於相同原活動欄位。單鏡長待辦按鈕有界換行；不做資料補寫、不擴大API。見[契約](docs/ISSUE-SUMMARY.md)。


## v0.122 回到目前待辦

歌曲單段、分鏡單鏡與歌詞單句的工具列新增「回到目前待辦」。檢查並成功定位後，手動查看其他欄位可直接返回最後成功位置；只有一項待辦時，上一項／下一項停用，返回仍可用。共享純 issue-cursor 提供 canReturn／returnCurrent，重用原來源與 revision 核對、onLocate、頁面 reveal 及原欄位 focus；不前進 cursor、不改原文／時間／媒體。未定位、零待辦、來源失效、busy、隱藏或無選列停用；新 report revision 清除位置，精確回復來源可接續舊位置。歌詞手動換頁後返回原 global 明細所在頁，沿全部計數／前200保留明細。三個 DOM adapter 只綁定原生按鈕與狀態；沒有新 asset、operation、POST、模型或路徑權限。產品122／唯一交付 policy38–122共85，未知123拒絕；20／27 tools、原27組 schemas、Agent1／draft3及其他領域契約保持。

Repo已獲使用者當次授權公開，四個FreeTWAI新作品公開介紹頁已建立；平台目前為作者自行聲明、尚未核實，正式收錄仍需另行審核。保留PLATFORM-STATUS.md／json的2026-10-06實際觀察與四個網址，不重複提交、不宣稱取得創始認證。PolyForm Noncommercial 1.0.0、LICENSE／NOTICE、創辦ZOE. G／GitHub djguan-jpg保持。

返回只重新定位最後成功cursor，沒有猜第一項／前進index或新的持久欄位；原生按鈕回呼沿原guard重查，不信任舊enabled狀態。見[契約](docs/ISSUE-RETURN.md)。
