# v0.59.0 驗證

基線main2e3f468848b953f754dbd10b73c0469866fd594a先建restore-v0.58.0-before-v0.59.0，再切codex/iteration-v0.59.0。原五處清單目前相同，本輪修正維護重複與漏改風險，不宣稱基線已掉版。Registry與Python／JS純policy共用，產品與各schema分開；legal4與非商用授權保持。

七個新Python、六個新JS測試：独立22版本oracle、metadata／Agent discovery、immutable隔離、sparse不推測、未知形狀/schema/版本/順序、整數上限、重複/BOM/nonfinite/無效Unicode/8192bytes拒絕、真Python contract在browser VM、module缺contract即拒絕、三browser consumer拒絕v60、HTTP固定路由与原Host／Origin/CSP/no-store/不開任意路徑。全套479Python在原session15088完成99.017秒；原JS735/736是草稿VM未注入新增全域，補用實際policy後session77513全套736通过，62語法／4Skills／diff通過。最初focused85/86則為新測試漏label，補資料後86/86。兩個失敗log及typed終止record保留，未重跑immutable job；Python源未再改，不因JSfixture修正重跑已過Python。

四工作台×22 producer真ZIP manifest／inspection／import／comparison保持明確覆蓋。額外從實際v58封裝讀入舊producer：四工作台×21版本84個archive與manifest逐bytes相同、新reader保留原文，獨立暫存還原後移除。v58 ZIP1185210B、SHA550a211433b01ae78e669bedea38b63a1df55cf12202dd11e57d076e0fefab24、CRC核對後解壓全套472Python／730JS，original51164 exit0／暫存removed。

原生tab103：header v0.59.0；建立實際歌曲4檔；選本輪合成v54 ZIP，UI顯示工具0.54.0與兩原文檔／hash，明確Apply只取代成果并保持歌曲title，Undo比較原title／完整brief文字／四檔列表完全相同。v60實際HTTP400「交付清單版本不支援；沒有遷移」，原成果保留；未擷取當時global錯誤文字，僅HTTP收據與DOM保持證據。v59選檔UI顯示本版並核對兩檔，取消保持原成果。兩次actual good HTTPwire由native importer再核對。實際四檔封裝manifest產品0.59.0，HTTP download送出8801B／SHAee024dce3d6b871f682936b42ea2f4b57032c5a600ad538690e4d031ed5dbe24与prepare一致；UI只宣稱送出，沒有saved-path證據。390px header在寬內，document width375；只是DOM幾何，沒有完整視覺評審。logs0，tab103關閉，viewportreset，server358132／original64420 exit0／staging有建立且contextclose回收。

指定sourceZIP會另獨立執行全套與registry/product/discovery交叉核對；privatePR/Release及遠端實際download bytes/digest/SHA/CRC/legal4/四refs/tree/mainclean依outputs/v59-qa終收據，GitHubCI未配置。最新59/58/57保護，>7天且exact重建才清除；failed36/53、unknown/media/draft/backup与其他程序保持。

創辦ZOE. G／djguan-jpg；PolyForm Noncommercial1.0.0；private／platform not_submitted。正式媒體／實聽、完整視覺、指定Agent Host、瀏覽器保存與FreeTWAI創始認定未驗證，rolling goal active。
