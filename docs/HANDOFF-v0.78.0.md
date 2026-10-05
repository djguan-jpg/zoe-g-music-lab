# v0.78.0 交接與還原

波形定位純model/controller位於web/wave-position.js，DOM組合位於web/wave-position-dom.js；原app只提供native player來源與setPosition，使用同份view ratio绘製游標。空／錯／換檔狀態清除舊ARIA，新增可見時間及Shift細調。歌詞、宣告與其他表單保持，沒有新持久狀態、operation或媒體作業。見[契約](WAVE-POSITION.md)與[驗證](QA-v0.78.0.md)。

基準main `4ce819cab130006f78cb2d92aa719035b051999e`；restore-v0.77.0-before-v0.78.0指向基準，codex/iteration-v0.78.0保留可審閱差異。還原前另存未提交創作及所選草稿庫，再從restore tag建立新的codex/還原分支，不改寫main。v77指定source ZIP與原碼還原收據保留；source commit封裝、SHA-256、private PR／release及遠端核對依本輪outputs/v78-qa，未把outputs或素材打包進Git。

545/909/84/4、focused26、160歷史文字ZIP、native tab125缺口／126修正16觀察與390px按鍵驗證均有收據。两個自有tab關閉、viewport重設、基準與修正版server按原session正常停止；沒有終止外部程序。保留較早回覆容量檢查失敗紀錄及新retry，產品限制不變。

本輪outputs/direct封裝/typed jobs唯讀盤點，latest78/77/76保護；只對strictly>7天且exact Git/tag可重建的候選做精確維護。failed36/53、unknown/media/草稿/備份/其他程序保持，使用者草稿不能從Git重建，應另行保存或備份。最終所有immutable identities分批最多32核對，程序狀態依現場證據。

基本14／啟庫21、Agent1／draft3與原schemas保持。禁止商用授權PolyForm Noncommercial1.0.0、ZOE. G/djguan-jpg/private及FreeTWAI not_submitted保持。完整visual／screen-reader／連續播放／實聽／savedfiles／正式media／權利／平台接受未驗，不能由暫態定位或SHA冒充。Rolling goal active。
