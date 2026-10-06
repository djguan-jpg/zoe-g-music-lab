# v0.149.0 交接

## v0.149.0 原文核對取消與有界讀取

補上成果、專案草稿與接受條件三個原文核對入口的明確取消按鈕。原有共用純controller的latest generation取消 → 注入reader的兩個實際讀取slot → DOM按鈕／狀態呈現 → app與接受條件adapter。每個核對器最多兩個未結束read，取消不假裝中止native File.arrayBuffer；slot只在實際settle後釋放，已滿時先等待，舊成功／錯誤不提交。取消與晚回應不確認草稿／條件已保存，不改原文／成果／後續編修／媒體；取消按鈕僅pending可用，dispose移除自有handler。

755 Python（1既有Windows symlink權限skip、0expected failures）、1821 JS（新增10）、150 syntax／四Skills通過。59相關測試涵蓋30次快速取消仍最多2個reader、失敗與metadata前檢不漏slot、來源變更／pagehide／dispose、legacy無cancel adapter保持，以及兩種保存確認仍需明確成功proof。原v148 exact-source ZIP 2867895bytes、SHA e0f388b928440a29a2f41ca18b8df710cd56283bff6885841b3906e02cd5d9f7還原755 Python／1811 JS；444歷史ZIP／manifest與29原schemas保持，整份／原列比較檔不變。

原生Chrome三次native File選回本輪合成candidate，驗證完整一致、同大小尾端byte2058差異、重試一致；四份wire檔與data保持，47controls前後相同，後續歌名編修清除proof／停picker與下載，console0。三個取消控制存在、aria關聯與idle disabled核對。pending取消／慢reader由注入DOM與保存callback整合測試驗證；未宣稱實際native慢檔取消或完整視覺／screen reader接受。IAB／Chrome兩次download send未取得完成event，candidate不是saved download；下載紀錄頁被瀏覽器安全規則禁止，沒有繞過，磁碟保存仍未驗證。

產品149／唯一policy38–149共112，未知150拒絕；22基本／29啟庫、Agent1／draft3與其他schemas維持，沒有新operation／asset／依賴／auth／path／產品網路權限。PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台原bytes保持；本輪未讀／寫FreeTWAI，既有四投稿仍submitted_unverified。前後測兩個自有server由原handle正常EOF0、两個測試頁關閉、未設viewport。還原tag／codex分支與exact-source封裝保持，rolling goal active。

## 接續

codex/iteration-v0.149.0／restore-v0.148.0-before-v0.149.0保留，exact-source ZIP與manifest／SHA伴隨PR及public prerelease。Git還原不撤銷外部投稿；六法律／平台檔不變，不重送四專案。

接續以真正native保存／重新選回證據或其他可重現完整使用缺口為準；不得繞過瀏覽器下載紀錄安全限制或把合成candidate說成saved download。明確取消只撤銷proof等待，不能聲稱取消native I/O。最新三版保護；strict超七天且exact Git/tag/archive可重建才可清除，partial36/53/141、未核實v77、草稿／媒體與未知程序保留。rolling goal active。
