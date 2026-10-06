# v0.149.0 交接與可逆

## v0.149.0 原文核對取消與有界讀取

補上成果、專案草稿與接受條件三個原文核對入口的明確取消按鈕。原有共用純controller的latest generation取消 → 注入reader的兩個實際讀取slot → DOM按鈕／狀態呈現 → app與接受條件adapter。每個核對器最多兩個未結束read，取消不假裝中止native File.arrayBuffer；slot只在實際settle後釋放，已滿時先等待，舊成功／錯誤不提交。取消與晚回應不確認草稿／條件已保存，不改原文／成果／後續編修／媒體；取消按鈕僅pending可用，dispose移除自有handler。

755 Python（1既有Windows symlink權限skip、0expected failures）、1821 JS（新增10）、150 syntax／四Skills通過。59相關測試涵蓋30次快速取消仍最多2個reader、失敗與metadata前檢不漏slot、來源變更／pagehide／dispose、legacy無cancel adapter保持，以及兩種保存確認仍需明確成功proof。原v148 exact-source ZIP 2867895bytes、SHA e0f388b928440a29a2f41ca18b8df710cd56283bff6885841b3906e02cd5d9f7還原755 Python／1811 JS；444歷史ZIP／manifest與29原schemas保持，整份／原列比較檔不變。

原生Chrome三次native File選回本輪合成candidate，驗證完整一致、同大小尾端byte2058差異、重試一致；四份wire檔與data保持，47controls前後相同，後續歌名編修清除proof／停picker與下載，console0。三個取消控制存在、aria關聯與idle disabled核對。pending取消／慢reader由注入DOM與保存callback整合測試驗證；未宣稱實際native慢檔取消或完整視覺／screen reader接受。IAB／Chrome兩次download send未取得完成event，candidate不是saved download；下載紀錄頁被瀏覽器安全規則禁止，沒有繞過，磁碟保存仍未驗證。

產品149／唯一policy38–149共112，未知150拒絕；22基本／29啟庫、Agent1／draft3與其他schemas維持，沒有新operation／asset／依賴／auth／path／產品網路權限。PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台原bytes保持；本輪未讀／寫FreeTWAI，既有四投稿仍submitted_unverified。前後測兩個自有server由原handle正常EOF0、两個測試頁關閉、未設viewport。還原tag／codex分支與exact-source封裝保持，rolling goal active。

見[契約](docs/TEXT-VERIFICATION-CANCEL.md)。以下保留歷史迭代。

## v0.148.0 規劃 Markdown 原文字面顯示

修正歌曲 task.md／music-plan.md 與分鏡 prompts.md／continuity.md 的標題、記憶點、交付項、畫面欄位、母題與審查說明含換行或 Markdown／HTML 標點時，形成額外標題、連結或格式的可重現問題。純 markdown_text.inline → 相容的 markdown_table.cell／creative／design → 共用 application → CLI／Agent／MCP／HTTP → 既有 browser source guard；所有現有顯示欄位共用字面呈現。ASCII 標點轉十進位 numeric references，CRLF／CR／LF 只在顯示轉固定 br；JSON、CSV、順序、時間與原創文字保持。來源 JSON 才是原文依據，顯示不是空白／排版 bytes 保存或 AI prompt 安全承諾。

755 Python（新增10、1既有Windows symlink權限skip、0expected failures）、1811 JS、150 syntax／四Skills通過。GitHub實際GFM對四份合成文件修改前後共8次轉譯，固定標題／段落結構與所有顯示原文核對；data及五份非Markdown檔逐bytes不變。原41表格樣本與歌曲表格body原bytes保持。440歷史producer ZIP／manifest與29 input/output schemas保持，舊整份／原列比較檔不變。原v147 exact-source ZIP 2848621 bytes、SHA 349be2e842bdb40f4b9ee72b4c0a137efd4ea30a7f15977c69e817ec7bc05165 還原745 Python／1811 JS成功。

原生工作台核對九份完整wire檔、八份UI全文及一份CSV textarea換行正規化顯示；47歌曲＋63分鏡controls保持，後續分鏡片名編修保留上一份且停用下載，console0。本輪沒有下載click、完整視覺／screen reader／媒體同步／Host安裝或創始身分接受。產品148／唯一policy38–148共111，未知149拒絕；22基本／29啟庫、Agent1／draft3與其餘schemas保持，沒有新operation／依賴／auth／path／產品外網能力。

PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。使用者已登入的Chrome唯讀確認Zoe及音樂公會長，沒有重新投稿／平台mutation，四新專案既有提交紀錄仍原作者自行聲明、創始未核實。本輪自有QA server原handle正常EOF0、一頁關閉；還原tag、codex分支與exact-source封裝保持。rolling goal active。

見[契約](docs/PLANNING-MARKDOWN.md)。以下保留歷史迭代。

## v0.147.0 歌曲交付表格原文顯示

修正歌曲設計包的段落名稱、敘事任務與聲音配置含換行或管線符號時，Markdown 表格拆列／錯欄的可重現問題。純 markdown_table.cell → design 的三個文字欄 → 既有 application／CLI／Agent／MCP／HTTP 分層。ASCII 標點使用 numeric character references 保持字面，不形成 Markdown／HTML 欄位語法；CRLF／CR／LF 只在顯示表格轉為固定 br。原 JSON 文字、順序、時間與創作內容不變；不把顯示檔當作原文 bytes 保存。其他 Markdown 段落不在本次格式保護範圍。

745 Python（新增9、1既有Windows symlink權限skip、0expected failures）、1811 JS、150 syntax／四Skills通過；Agent／MCP／HTTP與CLI完整四檔一致，CLI仍預設拒覆寫。GitHub官方GFM實際轉譯同一合成來源，修正前七列錯位、修正後六列各六欄，三個文字欄逐列字面核對。此遠端轉譯只在忽略QA，產品與正常測試不新增網路或依賴。原生工作台完整四檔核對及49controls保持，後續歌名編修保留／旧下載停用，console0。沒有本輪瀏覽器下載或完整視覺接受驗證。

436 歷史producer ZIP／manifest逐bytes保持，29組input/output schemas與原整份／原列比較檔保持；原v146精確ZIP2829240bytes、SHA763310a94131f711b0a554b9421db4428bcb283f2c809c3d7ff9acda7492ebcc還原736 Python／1811 JS通過。22基本／29啟庫、Agent1／draft3與其他schemas保持，產品147／唯一policy38–147共110，未知148拒絕。沒有新operation／GET／POST／auth／path／外網產品權限。

PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。唯讀確認使用者Chrome Zoe已登入、GitHub連結與四社群技能存在，仍原作者自行聲明／創始未核實，無重送或平台mutation；原頁返回guilds。自有單QA server以原handle正常EOF0、自建一頁關閉、未設viewport。還原tag／codex分支與exact-source封裝保持；rolling goal active，後續依真使用流程繼續改善。

見[契約](docs/MUSIC-MARKDOWN.md)。以下保留歷史迭代。

## v0.146.0 前後變動原列導覽

草稿檔及保存版本的指定原列新增「上一個變動原列／下一個變動原列」。純 navigation 先完整驗證兩份 draft3、各 1 MiB canonical 來源與 selection，再扫描六集合的全部原位置，逐欄精確比較原字串並略過未變更列。最多 10000 句，超過整份報告前 200 筆仍可導覽；新增／移除及空字串保持，不推定列移動。只回傳位置／總數／變動數／序號及前後候選，沒有原文快取或 wire 變更。

原 current controller 的 checked readPayload → 純模型 → literal DOM 分層；每次完成及明確移動前重查來源，移動後重新比較原列。只改暫態原列選擇，完整原文模式回到摘錄；busy／stale／cancel／clear／dispose 清除並停用。明確鍵盤意圖成功後回到原列欄位，晚回覆不覆蓋重試或搶後續焦點。21 原欄、六集合、1000 stable IDs 及既有成果保留。

736 Python（1 既有 Windows symlink 權限 skip、0 expected failures）、1811 JS（新增22）、150 syntax／四 Skills 通過，集中143 JS。432 歷史 producer ZIP／manifest bytes 及29組 input/output schemas、原整份／原列 JSON／Markdown bytes 保持。22基本／29啟庫、Agent1／draft3／comparison1／row-comparison1保持；無 backend／HTTP／shared controller diff、依賴或權限擴張。產品146／唯一 policy38–146共109，未知147拒絕。

兩原生入口共12集合完整字面核對、24快照、三尺寸各兩入口真 Tab／Enter、console0及無頁面水平溢出；後續歌名編修保留，舊導覽清除。選定 brief.json 原內容與四個檔名保持，其他三檔全文本輪未獨立核對。六PNG只保存在忽略QA，完整視覺／screen reader及browser實際保存檔案未驗證。下載已送出但觀察逾時，原click未重送。自建合成庫兩JSON hash保持；一QA server原handle正常EOF0、兩自建查驗頁關閉及viewport reset，使用者Chrome分頁保留。

原v145精確ZIP2809765bytes、SHA 1f47b5a17150a9ec67e058a09a0833008cf43053bd140670089d8da9f7174845，以原launcher還原736 Python／1789 JS後移除自有暫存。PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。依使用者已登入指示，唯讀確認Chrome Zoe／GitHub連結及四公開投稿；仍原作者自行聲明、尚未核實，無额外創始認證按鈕，沒有重送或平台mutation。還原tag、codex分支、CHANGELOG／HANDOFF及exact-source封裝可逆；rolling goal active。

見[契約](docs/DRAFT-COMPARISON-NAVIGATION.md)。以下保留歷史迭代。

## v0.145.0 指定原列完整原文

草稿檔與保存版本的原列比較新增「閱讀這一列完整原文／回到原文摘錄」。修正兩側前128 bytes相同但末尾不同時無法審閱的缺口；六集合、全部欄位、未變更／空字串／缺列保持。每次明確閱讀以共享controller的readPayload取得同一次完整驗證與current proof核對後的隔離來源，再由純fullValues選取原列，literal DOM顯示全部原字串；不從摘錄拼接、不改或套用草稿。全文只留在暫態DOM；新比較、取消、失效及clear／dispose清除，切換閱讀模式保留按鈕焦點。

共享controller亦修正新run在capture／prepare／gate前置失敗時舊report仍ready的可重現錯誤；有舊報告即發布stale，停舊下載／全文，再允許明確有效重試。原late／ownership隔離保持。29組input/output schemas、原整份及原列JSON／Markdown bytes、22基本／29啟庫、Agent1／draft3／comparison1／row-comparison1保持；本輪backend及HTTP路由沒有diff。產品145／唯一policy38–145共108，未知146拒絕。

736 Python methods（1既有Windows symlink權限skip、0expected failures）、1789 JS、150 syntax及四Skills通過；新增20 JS，集中121 JS。428歷史producer ZIP／manifest byte cases及29 schemas保持。兩個原生入口各六集合完整before／after字面文字逐字核對，22快照保留21原欄、六列集合、1000句的stable IDs與四完整成果；最後明確改歌名，後續編修保留、舊全文清除及停用。三種viewports各两入口真Tab／Enter、無頁面水平溢出、console0；六PNG僅保存忽略QA，完整視覺／screen reader及browser實際保存檔案未驗證。

v144指定原ZIP2790931bytes／SHA b4d0dabbf0e8e09472b5238cab86810dbc25c51b5266adf58c07ccb7b6311266以原launcher還原736 Python／1769 JS，暫存移除。只使用自建合成草稿庫，兩JSON原hash保持；一個QA server正常shutdown／context close／deadline thread join且原exec EOF0，自建一頁關閉、viewport reset。只唯讀盤點本outputs與explicit typed jobs，嚴格七天及最新三版保護保持，草稿／素材／未知程序不清除。

PolyForm Noncommercial1.0.0、public、創辦ZOE. G／GitHub djguan-jpg及四份submitted_unverified保持，六個法律／平台文件原bytes不變，本輪沒有平台提交或mutation。還原tag、codex分支、CHANGELOG／HANDOFF及指定source ZIP／SHA提供可逆交付；rolling goal active。

見[契約](docs/DRAFT-COMPARISON-FULL.md)。以下保留歷史迭代。

## v0.144.0 查看指定原列

草稿檔及保存版本預覽新增「查看指定原列」：整份比較只保留前200筆時，仍能查看原第501／10000句。六個歌曲、分鏡與歌詞集合按原位置1起比對，包含未變更欄位，空字串與缺列分開；不猜移動或改內容。新Python／JS純row model重用完整draft3來源、canonical SHA與128 UTF-8 bytes摘錄，共享注入comparison controller及literal DOM分層。selection也參與current proof；無效來源發布stale，取消late／retry不覆蓋新工作。

新增唯讀draft_compare_row，经共用application至CLI／Agent／MCP／HTTP；獨立row-comparison1、64 KiB報告。22基本／29明確啟庫，需重新discovery；原28組schemas及整份比較JSON／Markdown bytes保持，Agent1／draft3／comparison1保持。只有兩個固定GET與一個唯讀POST；沒有新依賴、模型、媒體、外網、JSON路徑、auth或session能力。產品144／唯一交付38–144共107，未知145拒絕。

736 Python methods（1既有Windows symlink權限skip、0expected failures）、1769 JS、150 syntax及四Skills通過；新15 Python／20 JS覆蓋完整來源／六集合、字面原文、隔離／晚回應和五adapter回覆。19跨語言cases包含原第10000句；424歷史producer ZIP／manifest原bytes相同。兩原生入口25份DOM快照，1000句／21欄／六列根原值保持，四成果原文跨保存版本流程相同；三種viewports各兩入口Tab／Enter、無頁面水平溢出、console0。後續刻意改歌名保留，舊比較清除及停用。六JPEG僅留忽略QA，完整視覺／screen reader及browser實際保存檔案未驗證；本輪未獨立記錄DOM row IDs。

v143精確ZIP2754220bytes／SHA cb67e613ae60cbf4bfbf96bf656deafa9b15acecd0d4c733355383f45955acbc，以原launcher實際還原721 Python／1749 JS後移除暫存。五adapter舊比較／備份及10個保存版本原record／draft bytes保持，82合成JSON雜湊保持。有界QA server正常shutdown／context close／deadline thread join及原exec EOF0，自建兩分頁關閉、viewport reset。只唯讀盤點本專案metadata，沒有超七天清除候選；素材、草稿與未知程序保持。

創辦ZOE. G／GitHub djguan-jpg、public及PolyForm Noncommercial1.0.0保持。六個法律／平台文件原bytes保持；已唯讀確認登入音樂公會長及四份公開投稿，仍作者自行聲明／尚未核實，未重送。restore tag、codex分支、CHANGELOG／HANDOFF及指定source封裝可逆；rolling goal active。

見[契約](docs/DRAFT-COMPARISON-ROW.md)。以下保留歷史迭代。

## v0.143.0 草稿比較變動類型

草稿檔及保存版本的比較新增「變動類型」：全部、變更、新增、移除，與工作台範圍共同篩選。純draft-compare-view只保存最多200筆scope／status與原明細序號，返回隔離的保留明細計數與每頁10筆位置；DOM先重查完整current來源再換篩選。換類型／範圍回第一頁，跨頁展開位置保留；新比較／取消／來源失效清除。兩個原生select可換行，標籤／aria關聯及空清單保持可操作。比較report1、完整JSON／Markdown下載、原工作台／草稿／媒體不因篩選修改。

721 Python執行（1既有Windows權限skip、0expected failure）、1749 JS全部通過；新增15 JS覆蓋交集／隔離／未知與getter拒絕、原序號跨類型展開、兩DOM來源失效／空清單／全份下载不變。148 syntax／四Skills／155 commands通過。兩原生入口50份DOM快照，21原欄位／六列根含ID與四成果原文保持；1280×720、390×844、1280×360各兩入口實際Home／End／Tab／Enter，焦點可達、頁面無水平溢出，console0。六張JPEG只保存於忽略QA，不嵌入對話；完整視覺與browser落盤仍未驗證。

來源38–143共106版、未知144拒絕；420歷史ZIP／manifest原bytes與28組tool schemas保持，五adapter比較／backup與10版原record／draft匯出、82合成JSONhash保持。v142指定ZIP以原launcher還原721／1734後正常移除暫存。21／28工具、Agent1／draft3／comparison1保持；沒有backend／adapter／controller／download模型變更、依賴、auth或權限擴張。一個有界QA server正常shutdown／context close／deadline thread join且原exec EOF0，自建QA與平台查閱頁已關閉、viewport reset。

ZOE. G／djguan-jpg、public與PolyForm Noncommercial1.0.0保持。此次登入唯讀確認音樂公會長及四個公開投稿，仍是作者自行聲明／尚未核實；沒有重送或平台mutation。restore tag、codex分支、CHANGELOG／HANDOFF、精確source ZIP／SHA可逆；最新三版與嚴格七天／Git重建規則保持，rolling goal active。

見[契約](docs/DRAFT-COMPARISON-KIND.md)。以下保留歷史迭代。

## v0.142.0 完整測試與 worker 完成證據

修正成功測試隱藏skip及封裝只有passed字樣的證據缺口。test_run_summary純有界frame／source／counts／original-handle核對 → 原兩worker runner自我登記及communicate → --report-json／預設文字 → packager二次驗證並把獨立schema1摘要保存於manifest.checks.python_run。721 Python執行、1權限skip、0expected failure，1734 JS／148語法／四Skills通過；新增17 Python，原handle成功及deadline失敗實測，損壞摘要即使exit0也不能發manifest。

來源38–142共105版、未知143拒絕；416歷史ZIP／manifest bytes及28 tool schemas保持，五adapter比較／backup與10版原record／draft匯出、82合成JSONhash保持。v141指定ZIP實際還原704／1734，原launcher不改。21／28工具、Agent1／draft3／run1及release manifest1 root保持，無新Agent／HTTP操作、依賴、frontend差異或持久服务。兩worker／120秒cap及outer150秒不變；只控制自有Popen handles，不全域列舉或signal外部程序。

PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg與四份submitted_unverified保持。還原tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA可逆；最新三版與嚴格七天／Git重建規則保持，rolling goal active。

見[契約](docs/PYTHON-TEST-RUN.md)。以下保留歷史迭代。

## v0.141.0 草稿比較閱讀進度

草稿檔與保存庫的差異比較，在換頁、篩選後保留展開位置，新增「展開本頁差異／收合本頁差異」。draft-compare-view 純有界序號模型 → 原 current source controller → DOM listener／焦點 adapter；最多200保留明細、每頁10筆，新比較／busy／stale／clear／dispose 清除暫態。舊 detached toggle callback 拒絕，原文、草稿、媒體與成果保持，展開不代表審閱接受。

704 Python／1734 JS、148語法、四Skills通過；新增26 JS、集中66 JS／4 Python。兩個原生入口、28 snapshots 原21欄／六列集合含ID及四份完整成果保持；三尺寸共六次鍵盤觀察，無頁面橫溢且收合焦點可達。下載click有觸發，但5秒observer未取得保存檔；完整視覺與實際落地檔仍未驗證。自有server正常返回、兩個查驗tab關閉、viewport復原。

412歷史ZIP／manifest bytes、28 input-output schemas、五adapter比較／備份與10版record／draft匯出保持，82合成JSONhash相同；指定v140 ZIP實際還原704／1708。產品141／來源38–141共104版、未知142拒絕，21基本／啟庫28工具及Agent1／draft3／comparison1保持。PolyForm Noncommercial1.0.0、public與四份submitted_unverified保持；本次live登入與四投稿已核對，平台明示作者未核實。還原tag、codex分支、CHANGELOG／HANDOFF及exact-source ZIP／SHA可逆，rolling goal active。

封裝補充：首份指定source的外層與Python runner同為120秒，外層timeout後Windows暫存目錄仍被使用，未發成功manifest。保留失敗ZIP與receipt；只移除核對的自有空暫存目錄，未signal外部程序。外層封裝改150秒，runner仍120秒／兩worker，留出正常收集與清理時間；重新從新提交封裝並核對，原失敗不宣稱成功。

見[契約](docs/DRAFT-COMPARISON-VIEW.md)。以下保留歷史迭代。

## v0.140.0 明確維護動作與空值

修正空expected-token被忽略及空record-self意外落到一般audit。maintenance_cli純presence／互斥／token／job／批次identity判斷 → argparse保留原path字面、拒絕空path → 原filesystem／process adapter；在workspace／catalog／PID查詢或receipt寫入前拒絕無效控制。validate_job與原run1共用1–80字元grammar，未提供None與已提供空值分開。正常五動作、exact token／default不覆寫／tag重建／latest3／same-host身份保持，沒有新增維護權限。

704 Python／1708 JS、147語法、四Skills通過；新增16 Python全部通過，集中82含原space／prune／restore／catalog回歸。兩個真Windows junction證明descendant跳過、root拒絕及receipt不能穿出root，synthetic target SHA／mtime保持，僅os.rmdir移除核對的自有link。既有真symlink測試仍因權限1314 skip，不把junction當成symlink全覆蓋或atomic sandbox。v139指定ZIP實際CLI兩個空值原exit0，新exit1且無receipt；三empty path exit2；default audit回覆完整相同，正常record-self實際EOF。

408歷史ZIP／manifest bytes、28 input-output schemas、五adapter比較／備份與10版原record／draft匯出保持，82合成JSONhash相同。v139指定ZIP實際還原688／1708且暫存移除。產品140／來源38–140共103版，未知141拒絕；21基本／啟庫28工具、Agent1／draft3／audit1／run1／recovery1／space1保持。本輪web不變，沒有新browser或持久workbench；PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg與四份submitted_unverified保持。還原tag、codex分支、CHANGELOG／HANDOFF與exact-source ZIP／SHA可逆，rolling goal active。

見[契約](docs/MAINTENANCE-CLI.md)。以下保留歷史迭代。

## v0.139.0 唯讀輸出空間報告

維護 CLI 新增 `--space-report`：固定分類封裝區、標準 vN-qa 區與其他區，列出邏輯 bytes、檔案數、嚴格超七天統計及最大的20個 QA 目錄。純 metadata policy → bounded filesystem reader → 既有 CLI／exclusive receipt；報告 space1 獨立，不改 audit1／run1／recovery1。分類及年齡不是刪除資格，既有 tag／Git archive／最新三版／typed job 核對保持；不開 outputs 檔案內容、不輸出未知名稱或私人路徑、不跟隨 link／reparse point。

688 Python／1708 JS、147語法與四Skills通過；新增24 Python中23通過、1真 symlink 因Windows權限1314跳過，另有注入reparse／特殊entry測試。CLI實際報告與獨立metadata總和一致，receipt拒覆寫，82合成庫原JSONhash保持。404歷史ZIP bytes、28工具schemas、五adapter比較／備份與10版匯出保持；v138指定ZIP實際還原664／1708且暫存移除。

產品139／唯一交付來源38–139共102版，未知140拒絕；21基本／啟庫28工具、Agent1／draft3不變。沒有新增Agent／HTTP維護操作、依賴、模型或持久服務；本輪web未變，不宣稱新增原生視覺驗收。還原tag、codex分支、CHANGELOG／HANDOFF及指定source ZIP／SHA保留可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持；rolling goal active。

見[契約](docs/OUTPUTS-SPACE.md)。以下保留歷史迭代。

## v0.138.0 比較取消與重試隔離

修正取消／清除／失效後舊比較回覆使新報告過期的可重現錯誤。無論舊成功或錯誤在新版等待中或完成後抵達，只要已不擁有目前job，就不讀來源、不改狀態、不呼叫完成／錯誤callback。完成報告仍按原stamp與完整來源核對，不依賴已清空的job。現代草稿檔與保存版本的新比較成功後清除上一份下載提示與error樣式；refresh保留同份提示，明確clear也清除。

純controller把job ownership與report current分開 → literal DOM提示生命週期 → 原完整producer／shared downloader分層。664Python／1708JS（新增9）、147語法及四Skills通過；集中4Python＋40JS。測試包含cancel／clear／invalidate、兩種晚回覆與兩種新版狀態、多代不同順序、無額外capture／gate／publish及兩個DOM入口。原完整來源、gate／File身份、失敗重試、busy／dispose與明確Apply／undo保持。

12份落檔原生快照逐一核對全21欄、六集合與stable IDs，兩個入口重新比較後下載提示清空，四份成果全文與82合成庫JSONhash保持。1280×720／390×844／1280×360實際Tab可達JSON→Markdown、Enter重新比較，沒有頁面水平溢出。兩次observer逾時後只重設觀察器並重綁同頁；原server／頁面未重啟，預覽已完成就不重送。舊觀察器未落檔的host資料不當作完整快照證據，重做並逐份落檔。1自有頁關閉／viewport reset，1自有server正常shutdown／deadline join及原handle EOF。

指定v137 ZIP實際還原664／1699且暫存移除；400歷史ZIP／manifest原bytes、28組input-output schemas及21基本／啟庫28工具保持。五adapter比較、備份inspection及10版匯出原record／draft bytes核對。產品138／唯一交付來源38–138共101版，未知139拒絕；Agent1／draft3／backup1及comparison1保持。沒有新增asset、backend operation、依賴、模型或路徑／網路／写檔權限。

還原tag、codex分支、指定source封裝／SHA、CHANGELOG／HANDOFF、PR merge及實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持，本輪不修改或重送平台投稿。只盤點本outputs及typed同host jobs，最新三版保護；strict>7days且exact tag／現場Git archive可重建才可列清除候選。草稿／媒體、未知／failed QA、v77 alternate及partial36／53保留。瀏覽器保存檔、完整視覺／screen reader、實聽／同步、Host安裝與平台正式founder仍未驗證，rolling goal active。

見[契約](docs/DRAFT-COMPARISON-LIFECYCLE.md)。以下保留歷史迭代。

## v0.137.0 下載目前草稿比較報告

現代草稿檔與保存版本的比較預覽新增「下載比較 JSON」與「下載摘要 Markdown」。下載目前完整的有界報告，不因畫面篩選或每頁10筆而截斷；JSON含原值摘錄、完整欄位SHA與全部計數，Markdown含位置與計數。下載不另存工作台草稿；「已送出」仍須核對瀏覽器實際保存檔案。

draft-compare-download 純固定格式選取 → injected controller.read 完整來源／gate重查 → 既有 text-download 原生UTF8 bytes sender → DOM字面提示分層。只取本controller擁有且由既有producer建立的報告，不是外部任意report importer或完整語義驗證器；strict Unicode／exact envelope／JSON＋Markdown256KiB保持。編修、頁籤、原生File身份、busy或預覽改變拒絕舊下載；原明確Apply／undo、shared兩pending與1秒URL回收保持。pagehide清除全部自有listener，後續dispose無害。

664 Python／1699 JS（新增10）、147語法及四Skills通過；集中4Python＋31JS核對整份JSON／Markdown的Python-JS逐UTF8 bytes一致、全部計數、容量、來源拒絕、傳送失敗重試與listener回收。17原生快照均全21欄與六集合，比較／篩選／下載保持stable IDs和四份成果全文；後續編修僅改title，取消保留。1280×720／390×844／1280×360實際Tab鍵可達兩下載鈕且頁面無水平溢出。前兩尺寸Enter成功送出，第三次快速下載受shared兩pending限制；之後明確重比仍可送出。這輪未重做Apply或真媒體切換，既有契約測試保持。

實際v136 ZIP還原664／1689且暫存移除；396歷史交付ZIP／manifest原bytes、28組input-output schemas與21／28工具保持。五adapter比較／備份inspection及10版原record／draft匯出核對，82合成庫JSONhash保持。產品137／唯一交付來源38–137共100版，未知138拒絕；Agent1／draft3／backup1保持。只新增一個固定JS asset，無新backend operation、模型、依賴或路徑／網路／寫檔權限。

兩個workbench頁及一個空白診斷頁已關閉、viewport reset，一個自有server原handle正常EOF。瀏覽器已送出狀態可見，但IAB與Chrome下載事件未取得落盤檔；自動審核拒絕開啟Chrome下載紀錄頁，理由是工具只允許HTTP／HTTPS網址，沒有繞過或掃描未知下載位置。实际保存檔仍未驗證；完整視覺／screen reader、實聽音畫同步、Host安裝與正式founder仍未驗證。

restore tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA、PR與實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。本輪恢復既有自由工坊會員登入並唯讀核對四個公開投稿仍含禁止商用與作者未核實，沒有重送申請。只盤點本outputs及typed same-host jobs，最新三版保護，strict>7days且exact tag／Git archive可重建才列候選；草稿／媒體／failed QA／v77 alternate及partial36／53保持。rolling goal保持active。

見[契約](docs/DRAFT-COMPARISON-DOWNLOAD.md)。以下保留歷史迭代。

## v0.136.0 載入前比較完整草稿

工作台的現代草稿檔與保存版本預覽新增「比較目前與預覽」。先看四台作品及 metadata 差異，再明確載入或取消；比較不修改表單、成果、媒體或保存版本。明細可依台篩選、每頁10筆與鍵盤翻頁；每欄保留原字串的128 UTF8 bytes 摘錄，完整計數與完整 SHA 另列。插入或換序按原位置比較，不猜列移動。

draft-compare 純完整來源／canonical SHA／comparison1 → 注入 controller 的 click-time 完整核對與輕量 refresh → literal DOM → app 原預覽／Apply／undo 分層。Python 與原生 JS 的完整 report／Markdown 跨語言逐值一致；每份完整 draft3 canonical1MiB、前200明細／128KiB明細預算、JSON＋Markdown256KiB。WebCrypto 失敗可重試，來源不剪短。legacy 不自動遷移或比較。

編修、頁籤、原生 File 身份、預覽或保存版本改變使報告失效；晚到成功／錯誤與取消不能覆蓋後續內容。baseline 即時擷取的新 saved_at 排除於 current key，候選 saved_at 仍完整核對與列為 metadata。refresh 不重新擷取全部10000句；比較完成及閱讀報告仍完整重查。頁籤切換立即標示過期，未觀察到的 gate 改變也能結束等待。原明確 Apply 與限定撤回保持。

664 Python（新增4）／1689 JS（新增21）、146語法與四 Skills 通過；25新增測試涵蓋四台原值、完整計數／容量、控制文字／Unicode、Python-JS完整回應、晚回應／身份／取消與鍵盤焦點。原生29快照中28份含全21欄、最後來源25份；比較期間原stable IDs保持，載入後重比作品0、撤回保留先前編修，保存版本比較保留四份成果全文。1280×720／390×844／1280×360以實際鍵盤分頁、字面HTML／CRLF及emoji呈現核對，無頁面水平溢出。兩個自有頁及兩個受控server正常關閉。

實際 v135 指定 ZIP 還原660／1668並移除暫存；392歷史交付ZIP／manifest原bytes、28組input-output schemas及21／28工具保持。五adapter草稿比較／備份inspection及10版原record／draft匯出核對，82合成庫JSONhash保持；備份收據舊版本標籤以獨立更正收據說明。產品136／唯一交付來源38–136共99版，未知137拒絕；Agent1／draft3／backup1保持。只新增三固定JS assets，無新backend operation、依賴、模型或路徑／網路／寫檔權限。

restore tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA、PR與實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。只盤點本outputs及typed same-host jobs；最新三版保護，strict>7days且exact tag／Git archive可重建才可列清除候選，草稿／媒體／failed QA／v77 alternate及partial36／53保持。完整視覺／screen reader、瀏覽器下載落盤、真媒體身份／實聽同步、Host安裝與正式founder仍未驗證；rolling goal保持active。

見[契約](docs/DRAFT-COMPARISON-UI.md)。以下保留歷史迭代。

## v0.135.0 完整草稿原值比較

新增唯讀 draft_compare，比較兩份明確完整 draft3；四台全部欄位與六種集合按原位置逐項比較，metadata 的 tool_version／saved_at／tab 另列。保留空白、換行、Unicode與數字原字串；集合插入、刪除或換序不猜移動及stable IDs。原欄位、新增／移除列與缺值／空字串分開，完整計數不受明細容量影響。

draft_compare 純來源／canonical SHA、原值比較、摘要與有界摘錄 → 共用 application → CLI／Agent／MCP／loopback HTTP。每份canonical草稿1MiB；comparison1獨立，最多前200原位置明細與128KiB明細預算，每側原欄128UTF8 bytes不拆字元，JSON＋Markdown合計256KiB。明細含完整欄位SHA／byte長度，metadata不是作品變化；草稿canonical SHA不是原檔排版bytes、作者或創始認證。沒有合併、Apply、自動保存、來源路徑、外網、模型或依賴。

CLI draft-compare明確--baseline／--current與--out，strict UTF8／重複鍵／schema3／容量完整核對；原檔保持，報告預設拒覆寫，--overwrite只替換指定報告。0為相同、2為有差異但比較完成、1為輸入或I/O錯誤。Agent新唯讀operation與MCP tool需重新discovery；21基本／明確啟庫28工具，舊27組input／output schemas保持。HTTP只新增/api/draft-compare，既有auth／session及草稿保存邊界保持；工作台UI沒有新增自動比較或載入行為。

660 Python（105.563秒，新增15）、1668 JS、143語法與四Skills通過。集中15涵蓋全部四台／原集合、metadata、插入與重複、10000句完整計數、有界control文字／UTF8摘錄、來源損壞與capacity、exclusive CLI輸出、真Agent-MCP good／bad／good及短命HTTP200／400／200。既有兩份合成保存版本由draft_read核對後，五adapter完整data／files／meta一致，原82JSONhash保持。這輪沒有新原生UI操作驗收。

指定v134 ZIP實際還原645／1668，暫存移除；388歷史交付ZIP／manifest原bytes及27schemas保持。原備份完整五adapterinspection、10版export的record／draft原bytes保持，建立時間依實際匯出各自不同。產品135／唯一來源38–135共98版，未知136拒絕；Agent1／draft3／backup1及maintenance schemas保持。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。

第一份QA Agent fixture誤用numeric id，修正為既有protocol要求的字串；第一全套有一處舊len(listed)==20漏更新，修正discovery oracle後全套通過。runtime helper輸入檔名與既有基準收據重名，exclusive create拒絕後以新helper／新檔名完成；失敗腳本與紀錄保持，沒有變更產品validator或覆寫原檔。所有本輪managed helper及test child沿原handle／EOF結束，短命HTTP正常shutdown／context close／deadline join；無新增常駐server或browser。

restore tag、codex分支、指定source ZIP／SHA、PR及實際remote assets提供可逆交付。只盤點本workspace outputs、完整direct封裝及明確typed same-host程序；最新三版與strict>7days且exact tag／Git archive可重建政策保持，無合格候選不刪，保留草稿／媒體、failed QA、v77 alternate及partial36／53。完整視覺／screen reader、瀏覽器保存落盤、media實聽／同步、Host安裝與平台正式founder仍未驗證，rolling goal保持active。

見[契約](docs/DRAFT-COMPARISON.md)。以下保留歷史迭代。

## v0.134.0 撤回最近複製

段落、鏡頭及歌詞各自新增「撤回最近複製」。只移除最近成功複製且原值未再修改的一列；其他原列後續編修保持。三台各存一筆，下一次成功複製替換該台紀錄，撤回消耗紀錄；載入新內容只清除該台。列數、顺序或stable IDs變更、複製列已填新時間／文字時整份拒絕；修回精確原值可重試。沒有更早一步或重做，鏡頭展開狀態不當作創作變更。

editor-copy 純 checkpoint／undoProposal及注入controller → editor-copy-dom字面提示／原生button → app局部writeEntries／dirty及原列焦點。私有紀錄只留目前after IDs、source／copy ID及一份複製值，不保留其他原列全文；三份紀錄沿40段／1000鏡／10000句上限。refresh不capture全部欄位；click-time完整來源、gate與實際after重查。busy／hidden／disposed拒絕，已達copy容量仍可undo，pagehide釋放紀錄；I/O或callback失敗不自動覆蓋後續編修。

645 Python（104.422秒）、1668 JS（新增21）、143語法及四Skills通過；集中36。33完整native快照核對四台全部欄位、完成歌詞匯入後21個原stable IDs；三種複製／撤回、原列編修保留、複製句新創作拒絕／修回重試、三台獨立紀錄及局部載入清除通過。四份歌曲成果前後逐一讀全文相同，dirty下載及未另存提醒保持。1280×720／390×844／1280×360均以Shift+Tab→Tab進入undo、Enter撤回5→4句，焦點回原句且頁面沒有水平溢出。

實際v133指定ZIP還原645／1647；384歷史交付ZIP／manifest原bytes及27組schemas保持。application／CLI／Agent／MCP／短命HTTP完整備份inspection一致，good-bad-good／200400200；10版export保留完整record／draft原bytes，原合成庫hash保持。產品134／唯一來源38–134共97版，未知135拒絕；20／27工具、Agent1／draft3／backup1及maintenance schemas保持。沒有新增backend operation、路徑／網路／寫檔權限、依賴或模型呼叫。

一個受控QA server依原PID／creation identity正常shutdown、context close與deadline thread join，實際exec EOF；一個IAB頁關閉、viewport reset，console warn/error0。三PNG留忽略outputs/v134-qa，依使用者要求未嵌入；完整視覺／screen reader、瀏覽器落盤、media身份／實聽／同步、Host安裝與平台正式founder仍未驗證。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg與四份submitted_unverified投稿保持。

還原tag、codex分支、指定source封裝／SHA、PR與實際remote asset收據提供可逆交付。每輪只盤點本workspace outputs及typed same-host程序；無strict>7days且可重建候選不刪，保留草稿／媒體、failed QA、v77 alternate與partial36／53。rolling goal保持active。

見[契約](docs/EDITOR-COPY-UNDO.md)。以下保留歷史迭代。

## v0.133.0 明確分批維護

開發維護 CLI 新增可重複的 `--package-directory`，由完整候選明確選取1–128份預覽及清理。預設完整 audit1／prune 行為保持；超過128候選仍拒絕整批清理，不自動截取或連續清理。新 batch1 封套內含完整 audit1、選取身份、整份候選 token 與獨立批次 token；未選候選變更也使初次批次 token 失效。每批須重新預覽，再帶相同選取及 exact token。

maintenance 純選取／身份及確定性 token → maintenance_fs 完整來源盤點、即時條件與 recovery1 → iteration_audit CLI。最新三版、嚴格超七天、exact tag／现场 Git archive bytes、same-root 精確移動及 unlink、running／unverified 明確程序拒絕保持。復原日誌仍最多128份／2MiB，restore 拒絕覆寫；I/O 可有部分結果，保留 journal／隔離檔，不能宣稱原子交易。沒有新增 Agent／HTTP／瀏覽器維護權限。

645 Python（107.344秒，新增17）、1647 JS、143語法及四Skills通過；集中17。真132份合成Git／tag／ZIP封裝產生129候選，明確只清理2份，127未選候選、最新三版、未知partial及合成草稿保持；實際v132指定來源工具讀取新recovery1，全部264檔原bytes與mtime復原。第一份QA helper誤讀不存在的package_count欄位，預覽後、清理前失敗並正常結束；保留原腳本，修正的新helper完成全流程，未改產品來配合helper。

原v132指定ZIP還原628／1647，暫存移除。380份歷史交付ZIP／manifest原bytes及27組operation schemas保持；application／CLI／Agent／MCP／短命HTTP完整備份檢查一致，good-bad-good／200400200，明確10版輸出保留完整record／draft原bytes，原合成草稿庫hash保持。產品133／唯一來源38–133共96版，未知134拒絕；20／27工具、Agent1／draft3／backup1、audit1／recovery1／run1保持。本輪無UI改動或新原生瀏覽器操作；既有完整視覺、瀏覽器落盤、媒體實聽／同步、Host及平台創始核實限制保持。

PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg及四份submitted_unverified投稿保持。以還原tag、codex分支、指定source ZIP／SHA、PR／Release實際遠端asset及final same-host程序收據交付。只盤點本workspace outputs；無實際老舊合格候選不刪，保留草稿、媒體、failed QA、v77 alternate及partial36／53。rolling goal仍active。

見[契約](docs/MAINTENANCE-BATCH.md)。以下保留歷史迭代。

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
