# v0.149.0 QA

## v0.149.0 原文核對取消與有界讀取

補上成果、專案草稿與接受條件三個原文核對入口的明確取消按鈕。原有共用純controller的latest generation取消 → 注入reader的兩個實際讀取slot → DOM按鈕／狀態呈現 → app與接受條件adapter。每個核對器最多兩個未結束read，取消不假裝中止native File.arrayBuffer；slot只在實際settle後釋放，已滿時先等待，舊成功／錯誤不提交。取消與晚回應不確認草稿／條件已保存，不改原文／成果／後續編修／媒體；取消按鈕僅pending可用，dispose移除自有handler。

755 Python（1既有Windows symlink權限skip、0expected failures）、1821 JS（新增10）、150 syntax／四Skills通過。59相關測試涵蓋30次快速取消仍最多2個reader、失敗與metadata前檢不漏slot、來源變更／pagehide／dispose、legacy無cancel adapter保持，以及兩種保存確認仍需明確成功proof。原v148 exact-source ZIP 2867895bytes、SHA e0f388b928440a29a2f41ca18b8df710cd56283bff6885841b3906e02cd5d9f7還原755 Python／1811 JS；444歷史ZIP／manifest與29原schemas保持，整份／原列比較檔不變。

原生Chrome三次native File選回本輪合成candidate，驗證完整一致、同大小尾端byte2058差異、重試一致；四份wire檔與data保持，47controls前後相同，後續歌名編修清除proof／停picker與下載，console0。三個取消控制存在、aria關聯與idle disabled核對。pending取消／慢reader由注入DOM與保存callback整合測試驗證；未宣稱實際native慢檔取消或完整視覺／screen reader接受。IAB／Chrome兩次download send未取得完成event，candidate不是saved download；下載紀錄頁被瀏覽器安全規則禁止，沒有繞過，磁碟保存仍未驗證。

產品149／唯一policy38–149共112，未知150拒絕；22基本／29啟庫、Agent1／draft3與其他schemas維持，沒有新operation／asset／依賴／auth／path／產品網路權限。PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台原bytes保持；本輪未讀／寫FreeTWAI，既有四投稿仍submitted_unverified。前後測兩個自有server由原handle正常EOF0、两個測試頁關閉、未設viewport。還原tag／codex分支與exact-source封裝保持，rolling goal active。

## 原生流程與接受邊界

流程：localhost歌曲建立 → task.md送出下載 → 選回本輪合成一致檔 → 同大小差異檔 → 一致重試 → 歌名編修 → 舊proof清除與下載停用。另切交付檢查看到條件取消控制。頁面識別／非空／無framework overlay／console0／互動通過；screenshots未擷取，依使用者媒體規則不嵌入或宣稱完整視覺接受。Browser skill未提供，使用已提供CUA原生API，沒有外部Playwright或新依賴。

| 檢查 | 結果 |
|---|---|
| 頁面識別、非空、overlay、console | 通過 |
| 原生三次選檔與編修保護 | 通過 |
| 三個取消控制及aria關聯 | 通過 |
| 延遲取消、slot上限與保存callbacks | 59相關測試通過 |
| native慢讀取消、磁碟保存、visual／screen reader | 未驗證 |

native-before保存取消入口缺失及IAB送出證據；reproduction保存3個注入reader，native-browser與native-validation保存Chrome原生File比對、source controls與idle按鈕。read-completion取消由注入DOM測試而非虛构慢檔驗證。瀏覽器拒絕下載紀錄頁後未使用其他surface、CDP或磁碟掃描繞過；candidate由本輪實際wire派生，明示synthetic，不冒充瀏覽器保存結果。
