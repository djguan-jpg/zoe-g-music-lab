---
name: zoe-audio-delivery
description: Analyze a selected PCM WAV against explicit delivery conditions and preserve measurable evidence. Use for sample-rate, bit-depth, peak, RMS, integrated-loudness, quiet-edge or stereo-correlation checks before audio delivery.
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Audio Delivery

## v0.143.0 草稿比較變動類型

草稿檔及保存版本的比較新增「變動類型」：全部、變更、新增、移除，與工作台範圍共同篩選。純draft-compare-view只保存最多200筆scope／status與原明細序號，返回隔離的保留明細計數與每頁10筆位置；DOM先重查完整current來源再換篩選。換類型／範圍回第一頁，跨頁展開位置保留；新比較／取消／來源失效清除。兩個原生select可換行，標籤／aria關聯及空清單保持可操作。比較report1、完整JSON／Markdown下載、原工作台／草稿／媒體不因篩選修改。

721 Python執行（1既有Windows權限skip、0expected failure）、1749 JS全部通過；新增15 JS覆蓋交集／隔離／未知與getter拒絕、原序號跨類型展開、兩DOM來源失效／空清單／全份下载不變。148 syntax／四Skills／155 commands通過。兩原生入口50份DOM快照，21原欄位／六列根含ID與四成果原文保持；1280×720、390×844、1280×360各兩入口實際Home／End／Tab／Enter，焦點可達、頁面無水平溢出，console0。六張JPEG只保存於忽略QA，不嵌入對話；完整視覺與browser落盤仍未驗證。

來源38–143共106版、未知144拒絕；420歷史ZIP／manifest原bytes與28組tool schemas保持，五adapter比較／backup與10版原record／draft匯出、82合成JSONhash保持。v142指定ZIP以原launcher還原721／1734後正常移除暫存。21／28工具、Agent1／draft3／comparison1保持；沒有backend／adapter／controller／download模型變更、依賴、auth或權限擴張。一個有界QA server正常shutdown／context close／deadline thread join且原exec EOF0，自建QA與平台查閱頁已關閉、viewport reset。

ZOE. G／djguan-jpg、public與PolyForm Noncommercial1.0.0保持。此次登入唯讀確認音樂公會長及四個公開投稿，仍是作者自行聲明／尚未核實；沒有重送或平台mutation。restore tag、codex分支、CHANGELOG／HANDOFF、精確source ZIP／SHA可逆；最新三版與嚴格七天／Git重建規則保持，rolling goal active。

見[契約](../../docs/DRAFT-COMPARISON-KIND.md)。以下保留歷史迭代。

## v0.142.0 完整測試與 worker 完成證據

修正成功測試隱藏skip及封裝只有passed字樣的證據缺口。test_run_summary純有界frame／source／counts／original-handle核對 → 原兩worker runner自我登記及communicate → --report-json／預設文字 → packager二次驗證並把獨立schema1摘要保存於manifest.checks.python_run。721 Python執行、1權限skip、0expected failure，1734 JS／148語法／四Skills通過；新增17 Python，原handle成功及deadline失敗實測，損壞摘要即使exit0也不能發manifest。

來源38–142共105版、未知143拒絕；416歷史ZIP／manifest bytes及28 tool schemas保持，五adapter比較／backup與10版原record／draft匯出、82合成JSONhash保持。v141指定ZIP實際還原704／1734，原launcher不改。21／28工具、Agent1／draft3／run1及release manifest1 root保持，無新Agent／HTTP操作、依賴、frontend差異或持久服务。兩worker／120秒cap及outer150秒不變；只控制自有Popen handles，不全域列舉或signal外部程序。

PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg與四份submitted_unverified保持。還原tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA可逆；最新三版與嚴格七天／Git重建規則保持，rolling goal active。

見[契約](../../docs/PYTHON-TEST-RUN.md)。以下保留歷史迭代。

## v0.141.0 草稿比較閱讀進度

草稿檔與保存庫的差異比較，在換頁、篩選後保留展開位置，新增「展開本頁差異／收合本頁差異」。draft-compare-view 純有界序號模型 → 原 current source controller → DOM listener／焦點 adapter；最多200保留明細、每頁10筆，新比較／busy／stale／clear／dispose 清除暫態。舊 detached toggle callback 拒絕，原文、草稿、媒體與成果保持，展開不代表審閱接受。

704 Python／1734 JS、148語法、四Skills通過；新增26 JS、集中66 JS／4 Python。兩個原生入口、28 snapshots 原21欄／六列集合含ID及四份完整成果保持；三尺寸共六次鍵盤觀察，無頁面橫溢且收合焦點可達。下載click有觸發，但5秒observer未取得保存檔；完整視覺與實際落地檔仍未驗證。自有server正常返回、兩個查驗tab關閉、viewport復原。

412歷史ZIP／manifest bytes、28 input-output schemas、五adapter比較／備份與10版record／draft匯出保持，82合成JSONhash相同；指定v140 ZIP實際還原704／1708。產品141／來源38–141共104版、未知142拒絕，21基本／啟庫28工具及Agent1／draft3／comparison1保持。PolyForm Noncommercial1.0.0、public與四份submitted_unverified保持；本次live登入與四投稿已核對，平台明示作者未核實。還原tag、codex分支、CHANGELOG／HANDOFF及exact-source ZIP／SHA可逆，rolling goal active。

封裝補充：首份指定source的外層與Python runner同為120秒，外層timeout後Windows暫存目錄仍被使用，未發成功manifest。保留失敗ZIP與receipt；只移除核對的自有空暫存目錄，未signal外部程序。外層封裝改150秒，runner仍120秒／兩worker，留出正常收集與清理時間；重新從新提交封裝並核對，原失敗不宣稱成功。

見[契約](../../docs/DRAFT-COMPARISON-VIEW.md)。以下保留歷史迭代。

## v0.140.0 明確維護動作與空值

修正空expected-token被忽略及空record-self意外落到一般audit。maintenance_cli純presence／互斥／token／job／批次identity判斷 → argparse保留原path字面、拒絕空path → 原filesystem／process adapter；在workspace／catalog／PID查詢或receipt寫入前拒絕無效控制。validate_job與原run1共用1–80字元grammar，未提供None與已提供空值分開。正常五動作、exact token／default不覆寫／tag重建／latest3／same-host身份保持，沒有新增維護權限。

704 Python／1708 JS、147語法、四Skills通過；新增16 Python全部通過，集中82含原space／prune／restore／catalog回歸。兩個真Windows junction證明descendant跳過、root拒絕及receipt不能穿出root，synthetic target SHA／mtime保持，僅os.rmdir移除核對的自有link。既有真symlink測試仍因權限1314 skip，不把junction當成symlink全覆蓋或atomic sandbox。v139指定ZIP實際CLI兩個空值原exit0，新exit1且無receipt；三empty path exit2；default audit回覆完整相同，正常record-self實際EOF。

408歷史ZIP／manifest bytes、28 input-output schemas、五adapter比較／備份與10版原record／draft匯出保持，82合成JSONhash相同。v139指定ZIP實際還原688／1708且暫存移除。產品140／來源38–140共103版，未知141拒絕；21基本／啟庫28工具、Agent1／draft3／audit1／run1／recovery1／space1保持。本輪web不變，沒有新browser或持久workbench；PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg與四份submitted_unverified保持。還原tag、codex分支、CHANGELOG／HANDOFF與exact-source ZIP／SHA可逆，rolling goal active。

見[契約](../../docs/MAINTENANCE-CLI.md)。以下保留歷史迭代。

## v0.139.0 唯讀輸出空間報告

維護 CLI 新增 `--space-report`：固定分類封裝區、標準 vN-qa 區與其他區，列出邏輯 bytes、檔案數、嚴格超七天統計及最大的20個 QA 目錄。純 metadata policy → bounded filesystem reader → 既有 CLI／exclusive receipt；報告 space1 獨立，不改 audit1／run1／recovery1。分類及年齡不是刪除資格，既有 tag／Git archive／最新三版／typed job 核對保持；不開 outputs 檔案內容、不輸出未知名稱或私人路徑、不跟隨 link／reparse point。

688 Python／1708 JS、147語法與四Skills通過；新增24 Python中23通過、1真 symlink 因Windows權限1314跳過，另有注入reparse／特殊entry測試。CLI實際報告與獨立metadata總和一致，receipt拒覆寫，82合成庫原JSONhash保持。404歷史ZIP bytes、28工具schemas、五adapter比較／備份與10版匯出保持；v138指定ZIP實際還原664／1708且暫存移除。

產品139／唯一交付來源38–139共102版，未知140拒絕；21基本／啟庫28工具、Agent1／draft3不變。沒有新增Agent／HTTP維護操作、依賴、模型或持久服務；本輪web未變，不宣稱新增原生視覺驗收。還原tag、codex分支、CHANGELOG／HANDOFF及指定source ZIP／SHA保留可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持；rolling goal active。

見[契約](../../docs/OUTPUTS-SPACE.md)。以下保留歷史迭代。

## v0.138.0 比較取消與重試隔離

修正取消／清除／失效後舊比較回覆使新報告過期的可重現錯誤。無論舊成功或錯誤在新版等待中或完成後抵達，只要已不擁有目前job，就不讀來源、不改狀態、不呼叫完成／錯誤callback。完成報告仍按原stamp與完整來源核對，不依賴已清空的job。現代草稿檔與保存版本的新比較成功後清除上一份下載提示與error樣式；refresh保留同份提示，明確clear也清除。

純controller把job ownership與report current分開 → literal DOM提示生命週期 → 原完整producer／shared downloader分層。664Python／1708JS（新增9）、147語法及四Skills通過；集中4Python＋40JS。測試包含cancel／clear／invalidate、兩種晚回覆與兩種新版狀態、多代不同順序、無額外capture／gate／publish及兩個DOM入口。原完整來源、gate／File身份、失敗重試、busy／dispose與明確Apply／undo保持。

12份落檔原生快照逐一核對全21欄、六集合與stable IDs，兩個入口重新比較後下載提示清空，四份成果全文與82合成庫JSONhash保持。1280×720／390×844／1280×360實際Tab可達JSON→Markdown、Enter重新比較，沒有頁面水平溢出。兩次observer逾時後只重設觀察器並重綁同頁；原server／頁面未重啟，預覽已完成就不重送。舊觀察器未落檔的host資料不當作完整快照證據，重做並逐份落檔。1自有頁關閉／viewport reset，1自有server正常shutdown／deadline join及原handle EOF。

指定v137 ZIP實際還原664／1699且暫存移除；400歷史ZIP／manifest原bytes、28組input-output schemas及21基本／啟庫28工具保持。五adapter比較、備份inspection及10版匯出原record／draft bytes核對。產品138／唯一交付來源38–138共101版，未知139拒絕；Agent1／draft3／backup1及comparison1保持。沒有新增asset、backend operation、依賴、模型或路徑／網路／写檔權限。

還原tag、codex分支、指定source封裝／SHA、CHANGELOG／HANDOFF、PR merge及實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持，本輪不修改或重送平台投稿。只盤點本outputs及typed同host jobs，最新三版保護；strict>7days且exact tag／現場Git archive可重建才可列清除候選。草稿／媒體、未知／failed QA、v77 alternate及partial36／53保留。瀏覽器保存檔、完整視覺／screen reader、實聽／同步、Host安裝與平台正式founder仍未驗證，rolling goal active。

見[契約](../../docs/DRAFT-COMPARISON-LIFECYCLE.md)。以下保留歷史迭代。

## v0.137.0 下載目前草稿比較報告

現代草稿檔與保存版本的比較預覽新增「下載比較 JSON」與「下載摘要 Markdown」。下載目前完整的有界報告，不因畫面篩選或每頁10筆而截斷；JSON含原值摘錄、完整欄位SHA與全部計數，Markdown含位置與計數。下載不另存工作台草稿；「已送出」仍須核對瀏覽器實際保存檔案。

draft-compare-download 純固定格式選取 → injected controller.read 完整來源／gate重查 → 既有 text-download 原生UTF8 bytes sender → DOM字面提示分層。只取本controller擁有且由既有producer建立的報告，不是外部任意report importer或完整語義驗證器；strict Unicode／exact envelope／JSON＋Markdown256KiB保持。編修、頁籤、原生File身份、busy或預覽改變拒絕舊下載；原明確Apply／undo、shared兩pending與1秒URL回收保持。pagehide清除全部自有listener，後續dispose無害。

664 Python／1699 JS（新增10）、147語法及四Skills通過；集中4Python＋31JS核對整份JSON／Markdown的Python-JS逐UTF8 bytes一致、全部計數、容量、來源拒絕、傳送失敗重試與listener回收。17原生快照均全21欄與六集合，比較／篩選／下載保持stable IDs和四份成果全文；後續編修僅改title，取消保留。1280×720／390×844／1280×360實際Tab鍵可達兩下載鈕且頁面無水平溢出。前兩尺寸Enter成功送出，第三次快速下載受shared兩pending限制；之後明確重比仍可送出。這輪未重做Apply或真媒體切換，既有契約測試保持。

實際v136 ZIP還原664／1689且暫存移除；396歷史交付ZIP／manifest原bytes、28組input-output schemas與21／28工具保持。五adapter比較／備份inspection及10版原record／draft匯出核對，82合成庫JSONhash保持。產品137／唯一交付來源38–137共100版，未知138拒絕；Agent1／draft3／backup1保持。只新增一個固定JS asset，無新backend operation、模型、依賴或路徑／網路／寫檔權限。

兩個workbench頁及一個空白診斷頁已關閉、viewport reset，一個自有server原handle正常EOF。瀏覽器已送出狀態可見，但IAB與Chrome下載事件未取得落盤檔；自動審核拒絕開啟Chrome下載紀錄頁，理由是工具只允許HTTP／HTTPS網址，沒有繞過或掃描未知下載位置。实际保存檔仍未驗證；完整視覺／screen reader、實聽音畫同步、Host安裝與正式founder仍未驗證。

restore tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA、PR與實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。本輪恢復既有自由工坊會員登入並唯讀核對四個公開投稿仍含禁止商用與作者未核實，沒有重送申請。只盤點本outputs及typed same-host jobs，最新三版保護，strict>7days且exact tag／Git archive可重建才列候選；草稿／媒體／failed QA／v77 alternate及partial36／53保持。rolling goal保持active。

見[契約](../../docs/DRAFT-COMPARISON-DOWNLOAD.md)。以下保留歷史迭代。

## v0.136.0 載入前比較完整草稿

工作台的現代草稿檔與保存版本預覽新增「比較目前與預覽」。先看四台作品及 metadata 差異，再明確載入或取消；比較不修改表單、成果、媒體或保存版本。明細可依台篩選、每頁10筆與鍵盤翻頁；每欄保留原字串的128 UTF8 bytes 摘錄，完整計數與完整 SHA 另列。插入或換序按原位置比較，不猜列移動。

draft-compare 純完整來源／canonical SHA／comparison1 → 注入 controller 的 click-time 完整核對與輕量 refresh → literal DOM → app 原預覽／Apply／undo 分層。Python 與原生 JS 的完整 report／Markdown 跨語言逐值一致；每份完整 draft3 canonical1MiB、前200明細／128KiB明細預算、JSON＋Markdown256KiB。WebCrypto 失敗可重試，來源不剪短。legacy 不自動遷移或比較。

編修、頁籤、原生 File 身份、預覽或保存版本改變使報告失效；晚到成功／錯誤與取消不能覆蓋後續內容。baseline 即時擷取的新 saved_at 排除於 current key，候選 saved_at 仍完整核對與列為 metadata。refresh 不重新擷取全部10000句；比較完成及閱讀報告仍完整重查。頁籤切換立即標示過期，未觀察到的 gate 改變也能結束等待。原明確 Apply 與限定撤回保持。

664 Python（新增4）／1689 JS（新增21）、146語法與四 Skills 通過；25新增測試涵蓋四台原值、完整計數／容量、控制文字／Unicode、Python-JS完整回應、晚回應／身份／取消與鍵盤焦點。原生29快照中28份含全21欄、最後來源25份；比較期間原stable IDs保持，載入後重比作品0、撤回保留先前編修，保存版本比較保留四份成果全文。1280×720／390×844／1280×360以實際鍵盤分頁、字面HTML／CRLF及emoji呈現核對，無頁面水平溢出。兩個自有頁及兩個受控server正常關閉。

實際 v135 指定 ZIP 還原660／1668並移除暫存；392歷史交付ZIP／manifest原bytes、28組input-output schemas及21／28工具保持。五adapter草稿比較／備份inspection及10版原record／draft匯出核對，82合成庫JSONhash保持；備份收據舊版本標籤以獨立更正收據說明。產品136／唯一交付來源38–136共99版，未知137拒絕；Agent1／draft3／backup1保持。只新增三固定JS assets，無新backend operation、依賴、模型或路徑／網路／寫檔權限。

restore tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA、PR與實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。只盤點本outputs及typed same-host jobs；最新三版保護，strict>7days且exact tag／Git archive可重建才可列清除候選，草稿／媒體／failed QA／v77 alternate及partial36／53保持。完整視覺／screen reader、瀏覽器下載落盤、真媒體身份／實聽同步、Host安裝與正式founder仍未驗證；rolling goal保持active。

見[契約](../../docs/DRAFT-COMPARISON-UI.md)。以下保留歷史迭代。

## v0.135.0 完整草稿原值比較

新增唯讀 draft_compare，比較兩份明確完整 draft3；四台全部欄位與六種集合按原位置逐項比較，metadata 的 tool_version／saved_at／tab 另列。保留空白、換行、Unicode與數字原字串；集合插入、刪除或換序不猜移動及stable IDs。原欄位、新增／移除列與缺值／空字串分開，完整計數不受明細容量影響。

draft_compare 純來源／canonical SHA、原值比較、摘要與有界摘錄 → 共用 application → CLI／Agent／MCP／loopback HTTP。每份canonical草稿1MiB；comparison1獨立，最多前200原位置明細與128KiB明細預算，每側原欄128UTF8 bytes不拆字元，JSON＋Markdown合計256KiB。明細含完整欄位SHA／byte長度，metadata不是作品變化；草稿canonical SHA不是原檔排版bytes、作者或創始認證。沒有合併、Apply、自動保存、來源路徑、外網、模型或依賴。

CLI draft-compare明確--baseline／--current與--out，strict UTF8／重複鍵／schema3／容量完整核對；原檔保持，報告預設拒覆寫，--overwrite只替換指定報告。0為相同、2為有差異但比較完成、1為輸入或I/O錯誤。Agent新唯讀operation與MCP tool需重新discovery；21基本／明確啟庫28工具，舊27組input／output schemas保持。HTTP只新增/api/draft-compare，既有auth／session及草稿保存邊界保持；工作台UI沒有新增自動比較或載入行為。

660 Python（105.563秒，新增15）、1668 JS、143語法與四Skills通過。集中15涵蓋全部四台／原集合、metadata、插入與重複、10000句完整計數、有界control文字／UTF8摘錄、來源損壞與capacity、exclusive CLI輸出、真Agent-MCP good／bad／good及短命HTTP200／400／200。既有兩份合成保存版本由draft_read核對後，五adapter完整data／files／meta一致，原82JSONhash保持。這輪沒有新原生UI操作驗收。

指定v134 ZIP實際還原645／1668，暫存移除；388歷史交付ZIP／manifest原bytes及27schemas保持。原備份完整五adapterinspection、10版export的record／draft原bytes保持，建立時間依實際匯出各自不同。產品135／唯一來源38–135共98版，未知136拒絕；Agent1／draft3／backup1及maintenance schemas保持。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。

第一份QA Agent fixture誤用numeric id，修正為既有protocol要求的字串；第一全套有一處舊len(listed)==20漏更新，修正discovery oracle後全套通過。runtime helper輸入檔名與既有基準收據重名，exclusive create拒絕後以新helper／新檔名完成；失敗腳本與紀錄保持，沒有變更產品validator或覆寫原檔。所有本輪managed helper及test child沿原handle／EOF結束，短命HTTP正常shutdown／context close／deadline join；無新增常駐server或browser。

restore tag、codex分支、指定source ZIP／SHA、PR及實際remote assets提供可逆交付。只盤點本workspace outputs、完整direct封裝及明確typed same-host程序；最新三版與strict>7days且exact tag／Git archive可重建政策保持，無合格候選不刪，保留草稿／媒體、failed QA、v77 alternate及partial36／53。完整視覺／screen reader、瀏覽器保存落盤、media實聽／同步、Host安裝與平台正式founder仍未驗證，rolling goal保持active。

見[契約](../../docs/DRAFT-COMPARISON.md)。以下保留歷史迭代。

## v0.134.0 撤回最近複製

段落、鏡頭及歌詞各自新增「撤回最近複製」。只移除最近成功複製且原值未再修改的一列；其他原列後續編修保持。三台各存一筆，下一次成功複製替換該台紀錄，撤回消耗紀錄；載入新內容只清除該台。列數、顺序或stable IDs變更、複製列已填新時間／文字時整份拒絕；修回精確原值可重試。沒有更早一步或重做，鏡頭展開狀態不當作創作變更。

editor-copy 純 checkpoint／undoProposal及注入controller → editor-copy-dom字面提示／原生button → app局部writeEntries／dirty及原列焦點。私有紀錄只留目前after IDs、source／copy ID及一份複製值，不保留其他原列全文；三份紀錄沿40段／1000鏡／10000句上限。refresh不capture全部欄位；click-time完整來源、gate與實際after重查。busy／hidden／disposed拒絕，已達copy容量仍可undo，pagehide釋放紀錄；I/O或callback失敗不自動覆蓋後續編修。

645 Python（104.422秒）、1668 JS（新增21）、143語法及四Skills通過；集中36。33完整native快照核對四台全部欄位、完成歌詞匯入後21個原stable IDs；三種複製／撤回、原列編修保留、複製句新創作拒絕／修回重試、三台獨立紀錄及局部載入清除通過。四份歌曲成果前後逐一讀全文相同，dirty下載及未另存提醒保持。1280×720／390×844／1280×360均以Shift+Tab→Tab進入undo、Enter撤回5→4句，焦點回原句且頁面沒有水平溢出。

實際v133指定ZIP還原645／1647；384歷史交付ZIP／manifest原bytes及27組schemas保持。application／CLI／Agent／MCP／短命HTTP完整備份inspection一致，good-bad-good／200400200；10版export保留完整record／draft原bytes，原合成庫hash保持。產品134／唯一來源38–134共97版，未知135拒絕；20／27工具、Agent1／draft3／backup1及maintenance schemas保持。沒有新增backend operation、路徑／網路／寫檔權限、依賴或模型呼叫。

一個受控QA server依原PID／creation identity正常shutdown、context close與deadline thread join，實際exec EOF；一個IAB頁關閉、viewport reset，console warn/error0。三PNG留忽略outputs/v134-qa，依使用者要求未嵌入；完整視覺／screen reader、瀏覽器落盤、media身份／實聽／同步、Host安裝與平台正式founder仍未驗證。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg與四份submitted_unverified投稿保持。

還原tag、codex分支、指定source封裝／SHA、PR與實際remote asset收據提供可逆交付。每輪只盤點本workspace outputs及typed same-host程序；無strict>7days且可重建候選不刪，保留草稿／媒體、failed QA、v77 alternate與partial36／53。rolling goal保持active。

見[契約](../../docs/EDITOR-COPY-UNDO.md)。以下保留歷史迭代。

## v0.133.0 明確分批維護

開發維護 CLI 新增可重複的 `--package-directory`，由完整候選明確選取1–128份預覽及清理。預設完整 audit1／prune 行為保持；超過128候選仍拒絕整批清理，不自動截取或連續清理。新 batch1 封套內含完整 audit1、選取身份、整份候選 token 與獨立批次 token；未選候選變更也使初次批次 token 失效。每批須重新預覽，再帶相同選取及 exact token。

maintenance 純選取／身份及確定性 token → maintenance_fs 完整來源盤點、即時條件與 recovery1 → iteration_audit CLI。最新三版、嚴格超七天、exact tag／现场 Git archive bytes、same-root 精確移動及 unlink、running／unverified 明確程序拒絕保持。復原日誌仍最多128份／2MiB，restore 拒絕覆寫；I/O 可有部分結果，保留 journal／隔離檔，不能宣稱原子交易。沒有新增 Agent／HTTP／瀏覽器維護權限。

645 Python（107.344秒，新增17）、1647 JS、143語法及四Skills通過；集中17。真132份合成Git／tag／ZIP封裝產生129候選，明確只清理2份，127未選候選、最新三版、未知partial及合成草稿保持；實際v132指定來源工具讀取新recovery1，全部264檔原bytes與mtime復原。第一份QA helper誤讀不存在的package_count欄位，預覽後、清理前失敗並正常結束；保留原腳本，修正的新helper完成全流程，未改產品來配合helper。

原v132指定ZIP還原628／1647，暫存移除。380份歷史交付ZIP／manifest原bytes及27組operation schemas保持；application／CLI／Agent／MCP／短命HTTP完整備份檢查一致，good-bad-good／200400200，明確10版輸出保留完整record／draft原bytes，原合成草稿庫hash保持。產品133／唯一來源38–133共96版，未知134拒絕；20／27工具、Agent1／draft3／backup1、audit1／recovery1／run1保持。本輪無UI改動或新原生瀏覽器操作；既有完整視覺、瀏覽器落盤、媒體實聽／同步、Host及平台創始核實限制保持。

PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg及四份submitted_unverified投稿保持。以還原tag、codex分支、指定source ZIP／SHA、PR／Release實際遠端asset及final same-host程序收據交付。只盤點本workspace outputs；無實際老舊合格候選不刪，保留草稿、媒體、failed QA、v77 alternate及partial36／53。rolling goal仍active。

見[契約](../../docs/MAINTENANCE-BATCH.md)。以下保留歷史迭代。

## v0.132.0 備份選取撤回

「分批備份選取清單」新增撤回最近一次成功的加入、整批加入、移出、整批移出或清空。清空後鍵盤焦點移到撤回；按鈕明示上次操作與可還原的版數。搜尋或讀取更多不清除紀錄；撤回後沒有更早一步或重做，下一次成功變更替換紀錄，無效／失敗操作保留紀錄。只改本頁選取，保存版本與已送出的備份來源保持。

backup-selection 純原值與完整 before／after metadata Map、順序及目前 capture 核對 → 注入控制器 → backup-selection-dom 字面提示／原生操作／焦點。每份最多1000版，私有最近一筆；完整核對來源、重複與已知版本矛盾後才還原，錯誤可修正重試。busy／disabled／disposed拒絕；pagehide釋放紀錄。只核對已捕捉metadata，不宣稱未載入資料的新鮮度或外部原子快照。

628 Python（75.438秒）、1647 JS（新增20）、143語法與四Skills通過；集中63。43完整DOM快照核對四台全部欄位、21列ID、目前成果全文與下載旗標、未保存提醒；另逐一切換四份成果，前後全文相同。41版清空→搜尋無結果→還原41、單版及整批移出撤回、下載後還原21而來源仍為10版、取消保留來源，以及單版／整批加入撤回通過。三尺寸1280×720／390×844／1280×360的Tab／Enter清空10→0→撤回10與焦點可達，頁面與提示沒有水平溢出。

82份合成草稿JSON hash保持。三份QA來源ZIP完整核對41／10／取消10版，原生選回舊41版不符、目前10版相符；這不是瀏覽器落盤下載檔。application／CLI／Agent／MCP／短命HTTP完整inspection一致，good-bad-good及200／400／200保持；選10版的record／draft原bytes相同，各次建立時間不同。原v131指定ZIP實際還原628／1627、376歷史交付原bytes及27組schemas保持。

產品132／唯一來源38–132共95版，未知133拒絕；20基本／啟庫27工具、Agent1／draft3／backup1與維護schema保持。app.js、下載器、Python domain與HTTP／CLI／Agent權限沒有變更。更正v131十二份概覽的focused51為實際43；已公開v131 tag／ZIP保持原樣。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg及四份submitted_unverified投稿保持。

一個受控QA server按原PID／creation identity正常shutdown、context close及deadline thread join，實際exec EOF；一個IAB頁已關閉、viewport reset，console warn/error0。六張PNG留忽略outputs/v132-qa，不嵌入對話。完整視覺／screen reader、瀏覽器保存檔、媒體身份／實聽／同步、Host安裝與平台正式創始核實仍未驗證。

見[契約](../../docs/BACKUP-SELECTION-UNDO.md)。以下保留歷史迭代。

## v0.131.0 移出目前顯示版本

備份清單新增「移出目前顯示版本」，按鈕顯示目前已載入版本與清單的交集版數。搜尋31版但只載入20版時，只移出這20版；尚未載入與其他已选版本保留。讀取更多後可再移出剩餘11版。空搜尋或無交集停用，保存版本原檔不刪除；需要補回時仍可使用「加入目前顯示版本」。

backup-selection純metadata核對／共用完整batch提案 → 注入capture controller → backup-selection-dom字面提示／原生按鈕／焦點。remove先核對整份displayed、retained與同批duplicate一致後才delete交集；late conflict、unselected duplicate conflict、getter／sparse／額外欄位全部拒絕且保持原清單。已滿1000版且顯示其他新版本時，加入可因上限拒絕，但合法移出仍可用；add與remove proposal分別派生。舊三欄caller缺displayed不能推定整庫，沒有新fetch、分頁、保存／恢復、Agent operation或持久欄位。

忙碌停用編選；成功移出後若原按鈕持有焦點且停用，回到可用的整批加入，再按Enter可補回。下載沿既有固定ID／完整串流與SHA；取消仍保留上一份來源。app.js沿v130既有libraryRecords注入，無diff；後端、domain、CLI／Agent／MCP及HTTP權限保持。

628 Python（75.422秒）、1627 JS、143 syntax與四Skills通過；新增16 JS，focused43。29完整DOM快照核對四台全部原值、21個stable IDs（歌曲6結構＋6段落／分鏡1母題＋4鏡／歌詞4句）、四份成果全文／下載旗標及dirty=true提醒保持。三尺寸1280×720、390×844、1280×360的Tab／Enter移出10→0→補回10及焦點通過，頁面／提示／清單無水平溢出。41合成版本82 JSON hash保持；三個canonical來源ZIP完整核對，舊41版檔不符目前10版、當前10版相符。

application／CLI／Agent／MCP／短命HTTP inspection完整回覆相同，good-bad-good與200／400／200；10版export完整record／draft bytes保持，各次實際建立時間不同，不宣稱整包bytes相同。第一次inspection輔助脚本廣泛字串替換將HTTP200誤改100，保留失敗helper並以新helper只修正oracle後通過；產品沒有因該錯誤變更。原v130指定ZIP2448724 bytes／SHA fd4299bf1f69491699d1e24c71629c48128e76d5b955798b77641b70baf855e5實際還原628／1611；372歷史交付ZIP／manifest bytes及27組schemas保持。

產品131／唯一來源38–131共94版，未知132拒絕；20基本／啟庫27工具、Agent1／draft3／backup1與維護schemas保持。ZOE. G／djguan-jpg、PolyForm Noncommercial1.0.0、本次既有公開授權與四份平台submitted_unverified保持；不重複投稿或宣稱官方核實創始人。

瀏覽器download event未提供保存path；本輪選回的是QA server同份合成來源ZIP，實際瀏覽器落盤仍未驗證。完整視覺／screen reader、媒體File身份、實聽／音畫同步、Host安裝與平台創始核實仍未驗證。六PNG只留忽略QA。兩個刻意按版本分開的有界server正常shutdown／context close／thread join且實際exec EOF；一個本輪IAB頁關閉並reset viewport。

見[契約](../../docs/BACKUP-DISPLAYED-REMOVE.md)。以下保留歷史迭代。

## v0.130.0 加入目前顯示版本

分批備份新增「加入目前顯示版本」，一次加入保存版本選單已載入的版本。按鈕標示目前版數，旁邊提示尚未加入的數量；搜尋找到31版但只顯示20版時，只加入20版。需要其他版本時先手動讀取更多，再加入；搜尋無結果保留先前選取。相同ID不重複，資料矛盾或合計超1000版時整批拒絕並保留原清單。

backup-selection純原值metadata／dense array／全批提案 → 注入capture controller → backup-selection-dom字面文字、原生按鈕與焦點 → app只提供目前已載入libraryRecords。原三欄capture保持相容，沒有displayed的舊caller不能推定整庫。原selected的metadata ID getter會先執行問題已重現並修正；新增及原單版都先核對own data descriptors，再沿library-revision檢查，拒絕getter／未知欄位／sparse及custom hooks。這不是通用Proxy安全保證。

下載仍沿既有backup-download固定1–1000唯一排序ID及完整串流／SHA核對；沒有新增fetch、分頁、自動保存／恢復、草稿欄位、server operation或Agent權限。忙碌拒絕編選，取消保留上一份備份來源；原整庫／單版入口保持。Tab可達整批加入，Enter成功後新按鈕停用時焦點回到可用備份下載；搜尋／移出／清空只改本頁選取。

628 Python（76.921秒）、1611 JavaScript、143 syntax、四Skills通過；新增19 JS，focused35。26份完整DOM快照核對四台原值／歌曲六段ID、四份成果原文與下載旗標、草稿提醒保持；三種1280×720／390×844／1280×360尺寸的移出／重新加入和Tab／Enter通過，頁面與清單不水平溢出。41份合成保存版本82檔hash保持，三份canonical來源ZIP完整核對。CLI／Agent／MCP／HTTP inspect完整回覆相同，good-bad-good及200／400／200保持；20版export核對每版record／draft原bytes相同，建立時間為各次實際時間，不宣稱整包bytes相同。

原v129指定source ZIP2422138 bytes、SHA5ee78350428c823027fa41c36e341d3930390e03e3cd0a2a44fbad7376d35c4f實際還原628／1592；368份歷史交付ZIP／manifest bytes與27組schemas保持。產品130／唯一來源38–130共93版，未知131拒絕；20基本／啟庫27工具、Agent1／draft3／backup1及維護schemas保持。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、公開催權及四份投稿submitted_unverified保持，不重複提交。

瀏覽器下載事件未取得本機path；選回檔案為QA server額外保留的同份合成來源，明確不是瀏覽器落盤下載。完整視覺／screen reader、含非空分鏡／歌詞的本輪原生操作、媒體身份、實聽／同步、Host安裝與平台正式創始核實仍未驗證。六份響應截圖只留忽略QA目錄，未嵌入對話。兩個刻意分開的版本server phase按原handle正常shutdown、thread join與context close並觀察exec EOF；本輪IAB頁關閉、viewport reset。

見[契約](../../docs/BACKUP-DISPLAYED.md)。以下保留歷史迭代。

## v0.129.0 封裝盤點與復原容量

封裝目錄超過128時，原本的標準唯讀稽核會拒絕整輪盤點。現在將目錄上限與復原日誌分開：先完整列舉最多1024個direct entries，再逐份核對；超限在開啟封裝前拒絕，不以部分清單判斷最新三版。每份完整manifest核對後只留下保留政策與identity所需metadata，釋放完整來源ledger。

maintenance純保留／身份政策 → maintenance_fs明確本機root、ZIP／Git核對與有界catalog → iteration_audit既有CLI與新receipt。復原仍最多128份／日誌2MiB，prune候選超128在來源重查、journal及move前拒絕；既有嚴格超七日、最新三版、exact tag／可重建bytes、未知與未核實資料保留，以及active／unverified程序拒絕清除的政策保持。

628 Python、1592 JavaScript、143 syntax與四Skills通過；新增6 Python。真129目錄CLI預覽／清除／復原及partial檔保持、1024／1025邊界、完整manifest釋放與128／129復原限制核對。原v128指定ZIP實際還原622／1592；364份歷史交付bytes與27組operation schemas相同。正式標準CLI已盤點本workspace129目錄，沒有清除候選；v77另一份source與正式tag不符，兩份partial36／53均保留。

產品129／唯一交付來源38–129共92版，未知130拒絕。20基本／啟庫27工具、27組schemas、Agent1／draft3／audit1／recovery1保持。工作台與創作application、HTTP／Agent／MCP執行能力沿原介面；本輪沒有新增瀏覽器操作驗收。PolyForm Noncommercial1.0.0、ZOE. G與public保持；平台仍submitted_unverified。已公開v128及其補查收據保留，新的restore／codex分支提供可逆差異。

見[契約](../../docs/MAINTENANCE-CATALOG.md)。以下保留歷史迭代。

## v0.128.0 多版本分批備份

工作台新增「分批備份選取清單」：從已保存版本選單加入不同版本，跨搜尋或重新整理保留選取；清單明示名稱、保存時間與ID，可移出／清空後下載這一批。按下時固定1–1000唯一ID，整庫與單版入口保持。清空／移出只改本頁清單，不刪保存版本；重新開啟本頁需重新選取。備份只含已保存版本，未保存編修、音檔與成果另存。

backup-selection純metadata／注入capture controller → backup-selection-dom字面清單與焦點／變更及availability通知 → 原backup-download純request、同一下載controller及完整串流／SHA／sender。來源沿library-revision完整metadata檢查，view只含ID／名稱／保存時間，不持有草稿、File、ZIP或路徑；重複不倍增，矛盾metadata保留原清單。原始request副本與latest／cancel／dispose、32 MiB及URL cap保持。busy拒絕編選與下載，取消保留上一份成功備份。草稿與成果不確認為已保存，不自動恢復或載入。

加入／移出／清空與可下載狀態變更通知既有下載adapter，app.run開始／結束刷新選取狀態；避免最後一版移出後按鈕仍可按。移出後焦點到下一個可用按鈕；搜尋無結果且清空時回可聚焦清單。1000版有界局部捲動，窄視窗名稱／ID換行。新增兩個固定GET JS；backup1／draft3／Agent1、20基本／啟庫27工具及27組schemas保持，既有POST／Python備份domain／CLI／Agent／MCP無diff。產品128／唯一policy來源38–128共91，未知129拒絕。

見[契約](../../docs/BACKUP-BATCH.md)。下方保留歷史迭代。


## v0.127.0 單版本備份

本機保存版本新增「下載選定版本備份」，可將選單中一個已保存版本另存ZIP。按下時固定ID，即使下載途中切換選單，也不改本次來源；成功提示明示該ID，整庫備份保持。空選擇／未啟庫／busy時停用；取消只中止自己請求、保留上一份成功備份來源。備份只含已保存版本，未保存編修、音檔與成果仍須另存。

backup-download純request嚴格核對ids、隔離／排序1–1000唯一ID；controller以click-time副本核對descriptor.selection及選定數量，沿原完整串流／SHA與latest／cancel／dispose。DOM共用同一sender、URL cap及verification來源，不增加第二個下載控制器或持久buffer。captureSelected只讀目前已展示records；library選擇事件刷新可用狀態，原预覽取消及後續編修保持。

既有POST /api/drafts/backup/prepare由{}整庫相容接續可選ids，沿共享Python selected_ids／export_library_backup；拒絕路徑、額外欄位、query、重複／空ID及跨Origin。ID不能選檔案路徑；沒有恢復或新增寫入權限。選定健康版本不讀未選定版本，整庫仍完整檢查。有效格式但不存在的ID維持既有HTTP500本機讀寫失敗，不自動重送。descriptor六欄、backup1／draft3／Agent1與27組operation schemas保持，20基本／啟庫27工具不變，沒有新asset、依賴、模型或外網。產品127／唯一policy明確來源38–127共90版，未知128拒絕。

見[契約](../../docs/BACKUP-SELECTION.md)。下方保留歷史迭代。


## v0.126.0 備份下載檔案核對

草稿庫備份旁新增「核對下載的備份 ZIP」。成功送出後可選回本機檔案，先核對1 byte至32 MiB容量，再以完整檔案SHA-256及大小核對本輪備份。來源只保留bytes／摘要／版本數；不持有完整備份，不恢復、載入、保存版本或确认未保存編修。新的成功送出遞增revision，即使內容相同也使舊讀取失效；下載失敗保留上一份來源。舊ZIP不能確認新ZIP。

純backup-verification嚴格原值模型、注入controller、原生File DOM adapter與原有backup-download sender分層。讀取與hash後重查本輪source／revision／busy、完整ArrayBuffer大小與選檔metadata，latest／cancel／pagehide／dispose保護晚回覆。原始32 MiB可完整核對；超限在arrayBuffer前拒絕。同大小錯bytes、短讀及來源失效保留原工作台、成果、列ID及草稿庫；選檔標為verification view control，不誤觸編修。單獨純verificationAllowed避免availability refresh寫入library訊息。

只新增三個固定GET JS資產；原備份domain／CLI／Agent／MCP／HTTP POST權限及schemas不变。20基本／啟庫27工具、27組schema、Agent1／draft3與backup1保持。產品126與唯一policy明確來源38–126共89版，未知127拒絕。PolyForm Noncommercial 1.0.0、ZOE. G及公開授權保持；四份自由工坊投稿已送出，創始身分仍submitted_unverified。

見[契約](../../docs/BACKUP-DOWNLOAD-VERIFICATION.md)。下方保留歷史迭代。


## v0.125.0 條件草稿下載核對

接受條件草稿下載旁新增「核對下載的條件草稿」。成功送出後可選回本次完整 JSON，以共享純 UTF-8 位元組核對確認該次保存快照；條件原值、工作台、列ID、媒體及既有報告保持。核對舊送出稿只確認它當時的條件，後來編修仍需另存；新的成功送出即使內容相同也使舊讀取失效。原本「已確認條件草稿檔案」按鈕保留。

既有純 audio-acceptance 保存模型不變；DOM adapter 只在 downloadText 成功後保留完整送出文字／遞增 revision，注入共享 text-verification controller／原生 File adapter，容量64 KiB在 arrayBuffer 前核對，沿 busy／visibility／latest／pagehide／dispose 保護。來源不取預覽或後來編修；失敗下載保留上一份有效來源。核對無需條件數值可解析，但分析仍完整驗證；BOM、重排、缺尾、同長錯文字、未知版本與額外欄位只要 bytes 不同就不確認。核對不是載入來源，不套用外部 JSON，也不改音檔。

原生測試重現核對選檔的 input 被通用 editor listener 視為編修，導致未改條件的報告過期。新 File 控制明確標示 data-view-control="verification"，重用既有唯讀排除；實際條件 input 仍照常標過期。沒有新增固定 asset、operation、POST、依賴、模型、外網或路徑權限。產品125／唯一policy來源38–125共88，未知126拒絕；20／27 tools、27組schemas、Agent1／draft3與獨立domain schemas保持。

見[契約](../../docs/AUDIO-ACCEPTANCE-DOWNLOAD.md)。以下保留歷史迭代。


## v0.124.0 草稿變更工作台

專案草稿的保存提醒新增變更工作台清單。尚未確認任何保存版本時，比對起始範例；已確認載入檔案、本機保存版本或下載草稿後，比對最近一次完整確認的內容。四個名稱固定依歌曲設計、母題分鏡、波形校時、交付檢查排序。還原一台的原值，該台退出清單；精確符合任何仍保留的完整版本或起始範例時，整份草稿維持既有已確認判定。

draft-retention 既有 checkpoint／注入 guard只新增隔離的 difference DTO（reference＋panels）；獨立 draft-difference 純模型嚴格核對列舉、最多四台、唯一／完整資料屬性後產生固定文字，app只更新提示 textContent／hidden。待確認下載不能替換參考；確認舊送出快照後，後續編修仍dirty。拼接不同保存版本的工作台片段仍需整份另存。原稿、列ID、媒體、成果、下載／本機保存流程與 beforeunload 原判定保持；摘要不帶原文／fingerprint／File／路徑，不進 draft3／Agent wire。新增一個固定GET JS，不新增 operation、依賴、模型、外網、登入或寫檔權限。產品124／唯一policy來源38–124共87，未知125拒絕；20／27 tools、27組schemas與獨立domain schemas保持。另修正根目錄 HANDOFF.md 的過期首頁版號。

見[契約](../../docs/DRAFT-DIFFERENCE.md)。以下保留歷史迭代。


## v0.123.0 草稿下載完整核對

草稿下載旁新增「核對下載草稿」。只有實際成功送出草稿後才可選檔；沿共享完整 UTF-8 原文位元組核對，比對本次送出的完整 JSON，而非預覽、檔名或 JSON 語義。相同檔案確認既有 click-time 保存快照；後續編修仍需另存，原工作台、時間、列 ID、音檔及成果保持。檔案可重新命名；BOM、重新排版、缺尾、舊送出稿或錯原文拒絕保存確認。原本明確「已確認草稿檔案」按鈕保留。

純 text-verification 模型 → 支援 draft scope／可選容量的注入 controller → 可選 IDs 的原生 File DOM adapter → app 的成功 onSent 與原 draft-retention guard。草稿容量1 MiB，在 arrayBuffer 前核對；既有成果預設8 MiB保持。最新 token、送出 revision、完整 source、busy、離頁及 dispose 防護保持；允許核對舊送出快照與後續 dirty 編修共存。送出時間只提供可見辨識，不是保存成功證據；File／檔案路徑、核對報告及暫態完整 source 不進持久草稿或 Agent wire。產品123／唯一 policy38–123共86，未知124拒絕；20／27 tools、27組 schemas、Agent1／draft3及領域契約保持，沒有新 operation、固定 asset、依賴、模型或外網能力。

見[契約](../../docs/DRAFT-DOWNLOAD-VERIFICATION.md)。以下保留歷史迭代。


## v0.122 回到目前待辦

歌曲單段、分鏡單鏡與歌詞單句的工具列新增「回到目前待辦」。檢查並成功定位後，手動查看其他欄位可直接返回最後成功位置；只有一項待辦時，上一項／下一項停用，返回仍可用。共享純 issue-cursor 提供 canReturn／returnCurrent，重用原來源與 revision 核對、onLocate、頁面 reveal 及原欄位 focus；不前進 cursor、不改原文／時間／媒體。未定位、零待辦、來源失效、busy、隱藏或無選列停用；新 report revision 清除位置，精確回復來源可接續舊位置。歌詞手動換頁後返回原 global 明細所在頁，沿全部計數／前200保留明細。三個 DOM adapter 只綁定原生按鈕與狀態；沒有新 asset、operation、POST、模型或路徑權限。產品122／唯一交付 policy38–122共85，未知123拒絕；20／27 tools、原27組 schemas、Agent1／draft3及其他領域契約保持。

見[契約](../../docs/ISSUE-RETURN.md)。以下保留歷史迭代。


## v0.121 目前待辦原因與位置

單鏡、單段與單句工具列現在顯示最後成功定位待辦的原位置、欄位、原因及關聯列，讓長表格編修時也能知道正在處理什麼。純 issue-summary 只格式化有界嚴格 JSON metadata；三個 DOM adapter 共用清單與工具列文字，在來源失效、busy、隱藏、無選列、未定位或新 revision 時清除說明。回復精確來源可恢復上一個成功位置；不因手動焦點改動重寫 cursor。說明換行後由 app 重新量測活動欄位，僅對已活動的原欄位調整捲動，不重新聚焦其他控制。實際窄畫面發現單鏡長待辦按鈕造成31px溢出，改為有界換行；空鏡頭選列也停用清單與 cursor。新增一個固定 GET asset，沒有新 operation。產品121／唯一交付policy38–121共84，未知122拒絕；20／27 tools、旧27組schemas、Agent1／draft3與其他domain保持。

見[契約](../../docs/ISSUE-SUMMARY.md)。以下保留歷史迭代。

## v0.120 單句逐項導覽

選定歌詞新增「重查這一句／上一項單句待辦／下一項單句待辦」工具列，成功定位後同步目前明細頁；修正長表格需返回上方清單逐項處理的操作缺口。純 issue-cursor 明確 maxDetails 1–200，舊鏡頭／段落預設32保持；純 issue-page.reveal 核對 revision／可定位狀態及兩次metadata後，顯示選定保留項所在頁。單句沿原200明細／20頁內項與全部issue_count，頁面／cursor／焦點不改時間或進draft。可見黏附工具列與既有field-position共用幾何，global作品宣告忽略畫面外工具列；高度≤400px回普通流。產品120／唯一交付policy38–120共83，未知121拒絕；20／27 tools、舊27組schemas與Agent1／draft3保持。 見[契約](../../docs/LYRICS-CUE-NAVIGATION.md)。

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

ZOE. G 發起的原創交付檢查工具。接受格式與數值定義見 [工具說明](README.md)。

先取得收件方的實際接受條件。工具內的 distribution／video 是示範設定，不代表所有平台的標準。工作台可填自訂接受值，或用 CLI 的 rates／bits／channels 指定本次接受條件。

僅分析使用者選定的 PCM WAV，保留原音檔。回報規格、每聲道 sample peak、RMS、DC、滿刻度樣本、頭尾安靜段、整段立體聲相關性、獨立 LUFS 整合響度與 SHA-256。

技術條件通過不等於音樂品質、授權或法律審核通過。滿刻度樣本、負相關性或安靜段只提供聆聽線索；不擅自裁切、正規化或改寫。數位靜音等情況的不可測相關性以 null 表示。

RMS 不當作 LUFS；本版獨立量測 LUFS（單聲道／立體聲、8000–192000 Hz、至少400 ms）。太短、低於門檻或未知聲道位置保留 null／不可測，不以零或 −70 冒充結果。sample peak 不當作 true peak；true peak 尚未提供。沒有響度平台合格線，不擅自正規化。

CLI 範例：

```powershell
python music_lab.py audio --input selected.wav --profile video --rates 48000 --bits 24 --channels 2 --out outputs/audio-run
```

交回實際 JSON／Markdown 報告及仍需聆聽確認的項目。Exit code 2 表示報告已產生且有提醒；不是程式崩潰。

外部JSON接續採共用嚴格UTF-8／JSON decoder，CLI最多2MiB、最大64層；重複欄位含跳脫同名、無效Unicode與非有限數字拒絕，不能默默取最後一個版本／值。保留原檔，協助另存有效UTF-8後重新預覽；不要把傳輸檢查當創作／媒體驗證。

## 工作台草稿另存（v0.21）

上方狀態核對四個工作台的完整草稿內容。Agent建包／送出下載不表示目前編修已保存；下載後先核對本機檔再明確確認，或明確啟用草稿庫並保存。晚到保存只確認當時的快照，後來編修仍需另存。已驗證現代檔案／庫版本須明確載入，legacy轉換需另存v3。預覽與取消不更改目前狀態，撤回後依內容判定。音檔與成果另存；離頁提醒受瀏覽器互動／裝置限制，不能取代主動保存，沒有自動寫檔或模型呼叫。

## 原值條件草稿（v0.37）

工作台另存接受條件schema1，未填完原文可下載並先預覽再載入；自訂欄位不在project draft3中。先核對收件要求，再明確套用；原音檔／其他panel保持。整份專案載入回到示範條件但保留本頁自訂原文。條件下載須核對檔案再確認，後續編修另存。CLI使用 --acceptance-draft selected.json，Agent audio／MCP audio_report嵌入acceptance_draft；與直接profile／rates／bits／channels互斥，JSON不能選路徑。未知／不符／晚回應不替換成果。詳見[完整契約](../../docs/AUDIO-ACCEPTANCE.md)。


## v0.38 完整文字交付

完成本工作台後可下載本輪所有文字成果ZIP與逐檔SHA清單，CLI／Agent／MCP共用 delivery_package。Agent預設摘要，小型ZIP需明確include_archive；不自動寫檔，封裝不等於實聽或實際畫面接受。基本11／啟庫16工具，Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-PACKAGE.md)。

## v0.39 接續文字ZIP

本工作台可選取本工具v38／v39交付ZIP，先核對原清單與逐檔SHA、再明確載入文字成果；表單與已選音檔保留，可限定撤回。跨scope先切換工作台再選檔；讀取中可取消，編修／換台後晚回應不能覆蓋。原文可再下载，但不代表由目前表單重建或正式媒體接受。CLI delivery-inspect／Agent與MCP delivery_inspect共用檢查，啟動時--delivery-zip明確選來源，預設metadata、include_files小型JSON≤512KiB；12／17工具，inspection1／package1／Agent1／draft3獨立。見[共用契約](../../docs/DELIVERY-INSPECTION.md)。

## v0.40 ZIP原文與差異

選ZIP後先審阅目前成果與將載入原文，新增／變更／移除／相同完整摘要；原換行計數與長檔有界預覽，Apply與下載仍保留全文。只替換本工作台成果，表單／音檔／限定Undo保持，不合併。CLI delivery-inspect --compare-input及Agent／MCP delivery_inspect明確baseline同一比較契約，12／17工具保持，comparison1獨立。見[共用契約](../../docs/DELIVERY-COMPARISON.md)。


## v0.41 可保存差異報告

選交付ZIP核對完成後可下載來源SHA與完整變更摘要JSON／Markdown，原成果／表單／音檔保留，載入仍需明確動作。修改後重新核對，不把報告當原文或素材權利驗收。CLI --comparison-report／Agent include_report要求baseline且不能include_files=true，12／17工具保持，comparison1獨立。launcher可列印明確WAV／ZIP選擇，沒有Host設定或模型呼叫。default text output拒絕raced-in同名檔，多檔可能部分輸出須查看錯誤。見[共用契約](../../docs/DELIVERY-REPORT.md)。


## v0.42 原文下載

成果、草稿、保存版本、接受條件與差異報告共用native UTF-8 bytes，原文與換行保持；長檔只在預覽摘錄，8MiB完整成果下載與ZIP仍全文。編修後舊generated成果停下載，失敗不新增另存確認，明確確認舊檔不覆蓋後續編修。Agent／CLI／MCP既有application／12與17tools／schema與inline cap保持。見[共用契約](../../docs/TEXT-DOWNLOAD.md)。


## v0.43 指定 ZIP 原文

核對完整ZIP後可先下載選定原文，保持目前成果、表單與音檔；empty可下載，removed或來源變動停用。CLI --file-name明確輸出原檔；Agent／MCP file_names需要include_files:true，512 KiB選定JSON cap保持。所有來源檔先完整核對，缺檔整次拒絕；selection1獨立，12／17工具與Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-SELECTION.md)。


## v0.44 原文分段閱讀

ZIP核對後可切目前成果／ZIP原文逐段閱讀，原文下載仍是全文，保持表單與媒體。CLI text-file／Agent-MCP text_window明確讀16KiB原文，後續位置pin前次archive SHA；完整來源先核對，UTF-8字元中間或來源變動拒絕。text-window1獨立、12／17工具與Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-TEXT.md)。

## 接受條件診斷（v0.64）

未完成條件可先用工作台「檢查自訂條件」定位三欄待辦；或CLI audio-acceptance-review --input條件草稿 --out明確目錄。Agent／MCP audio_acceptance_review payload只含document，回同來源JSON／Markdown，不讀媒體或改原值。零待辦只表示條件可解析，請接續原audio分析與實聽。基本14／啟庫19工具，Host重新discovery；原文、媒體与保存另存狀態保持。見[契約](../../docs/AUDIO-ACCEPTANCE-REVIEW.md)。

## 接續條件報告（v0.65）

在工作台「載入條件草稿或檢查報告」選定draft1或完整review1 JSON，先預覽再明確套用。報告核對全部資料才接續source；未完成原值仍保留，音檔另行分析。CLI audio-acceptance-review --input也接受完整報告，audio --acceptance-draft可使用完整報告的有效來源；預設不覆寫。Agent／MCP payload仍使用原draft1，不接受整份報告或路徑；需自行從已核對檔案提取source。見[契約](../../docs/AUDIO-ACCEPTANCE-INPUT.md)。

## v0.66 撤回條件套用

草稿／完整報告經預覽明確套用後，可按「撤回上次條件套用」。只撤回最近一次的接受條件，音檔與其他台保持；套用後再改動條件會保留編修並拒絕撤回。撤回未保存原值後仍需另存。成功後焦點回取樣率或示範條件選單。沒有新增Agent操作或持久草稿欄位，見[契約](../../docs/AUDIO-ACCEPTANCE-UNDO.md)。

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
