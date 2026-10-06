# 備份下載檔案核對 v0.126.0

現行備份核對新增每個 verifier 的兩份未完成 read→hash 工作上限及共用取消焦點政策；取消不能提前歸還工作名額。純備份大小／SHA／report1與保存證明邊界保持，見[現行契約](BACKUP-VERIFICATION-CAPACITY.md)。下方保留歷史描述。

草稿庫備份旁新增「核對下載的備份 ZIP」。成功送出後可選回本機檔案，先核對1 byte至32 MiB容量，再以完整檔案SHA-256及大小核對本輪備份。來源只保留bytes／摘要／版本數；不持有完整備份，不恢復、載入、保存版本或确认未保存編修。新的成功送出遞增revision，即使內容相同也使舊讀取失效；下載失敗保留上一份來源。舊ZIP不能確認新ZIP。

純backup-verification嚴格原值模型、注入controller、原生File DOM adapter與原有backup-download sender分層。讀取與hash後重查本輪source／revision／busy、完整ArrayBuffer大小與選檔metadata，latest／cancel／pagehide／dispose保護晚回覆。原始32 MiB可完整核對；超限在arrayBuffer前拒絕。同大小錯bytes、短讀及來源失效保留原工作台、成果、列ID及草稿庫；選檔標為verification view control，不誤觸編修。單獨純verificationAllowed避免availability refresh寫入library訊息。

只新增三個固定GET JS資產；原備份domain／CLI／Agent／MCP／HTTP POST權限及schemas不变。20基本／啟庫27工具、27組schema、Agent1／draft3與backup1保持。產品126與唯一policy明確來源38–126共89版，未知127拒絕。PolyForm Noncommercial 1.0.0、ZOE. G及公開授權保持；四份自由工坊投稿已送出，創始身分仍submitted_unverified。

分支codex/iteration-v0.126.0；還原tag restore-v0.125.0-before-v0.126.0固定e0d19479cf6b950ba5a032e992ced214ee9e6594。需還原時另建codex分支審閱，不覆寫現有草稿庫；Git不能撤銷外部投稿或公開狀態。採精確source提交封裝、PR審查與合併，公開prerelease連同ZIP／manifest逐byte回讀。

每輪唯讀稽核本工作區outputs、直接完整封裝和明確same-host run記錄。最新三版126／125／124保護；嚴格超七天、exact tag／現場Git archive可重建的完整封裝才列候選。草稿、备份、素材、未知檔／失敗36與53／QA證據保持，不因版本舊直接刪除，無候選不清除。不清理其他專案或未確認程序。本輪實際終態與SHA見outputs/v126-qa成功收據。滾動goal仍active，本輪為進展。
