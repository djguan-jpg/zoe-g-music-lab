# v0.61.0 QA

基線578e55da80ae114080a23e91e2e955dbb580db45。先建restore-v0.60.0-before-v0.61.0與codex/iteration-v0.61.0；只用本workspace與通用工具。合成PCM與輸出留忽略outputs／temporary，不進Git。

基線gap：真application report，data與report.json一起變更（原條件草稿相符），positive peak／RMS>peak／full-scale>frames／quiet past end／mono correlation五個回覆原inspect皆accepted且status technical_checks_passed。收據outputs/v61-qa/gap-evidence.json。

新增3 Python、8 JS；focused3／46與第一次完整484 Python／751 JS／63 syntax／4 Skills／diff通過。83真producer matrix（四位元寬、四取樣率、五訊號模式，含1/2/3聲道、1-frame、odd-rate及整合響度区塊）全部inspect可讀且報告／音檔不修改。另五種matching raw/echo篡改拒絕且onResult=0。真CLI full-scale exit2、Agent1／MCP stdio／HTTP值與共用application相同；固定asset實際GET bytes核對。legacy／null/DC／frame/byte／quiet rounding與full-silence／瀏覽器依序載入、current拒絕／late取消保持均測試。

原生tab105：正常HTTP結果三檔；QA server第二回覆受控full-scale481>480（matching report.json），HTTP200但browser拒絕，原可見JSON、量測摘要、檔名清單及選檔input value相同，build回enabled。390px提示width301、height59.59375、document375，均在viewport。按Enter再次實際合法分析，JSON／visual／filenames與第一份相同；warn/error logs0。兩次read-only DOM嘗試失敗（不支援FileList/options、後續未宣告binding），均在動作前；改用DOM支援的值後成功，原失敗如實記錄。未嵌入媒體。tab關閉／viewportreset，server PID332128原handle11071 exit0，lazy staging未建立。三wire200/200/200標明production／controlled_QA_contradiction／production，不宣稱正式producer曾吐矛盾報告。

實際v60指定封裝SHA核對／獨立還原跑481 Python／743 JS後temp清除；92歷史ZIP（4scope×23producer）與前版產生逐bytes相同。本輪exact-source封裝會獨立解壓完整重跑、CRC／metadata；私有PR/release後actual遠端下載與本機bytes/hash/GitHub digest、legal4、四refs、main/source tree及清潔狀態依outputs/v61-qa終收據確認。

CI未配置。沒有真人screen-reader／完整視覺／正式音檔／實聽／特定Agent Host／瀏覽器saved-file／FreeTWAI創始人驗收；本輪未點下載。程序清除只限typed same-host本輪run；封裝latest61/60/59保護，>7天且exact Git/tag重建才清除，failed36/53及未知／素材／草稿／backup／其他程序保持。
