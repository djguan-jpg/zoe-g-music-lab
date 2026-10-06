# 比較請求與報告生命週期

重現：啟動A→取消A→啟動B→B完成→A晚到。原controller在A的成功或失敗分支無條件寫全域stale，導致B報告無法read；若A在B等待中抵達，B完成後也保持stale。傳回false與沒有onReady不代表沒有修改後續狀態。

web/draft-compare-controller.js新增私有ownsJob，須同時未dispose、job精確同一selected物件、token仍為目前sequence。成功回覆先核對ownership再讀gate／完整來源；catch也先核對ownership。被cancel／clear／invalidate／dispose或較新run取代的工作不變更任何report、stamp、stale或callback，finally只清理自己仍擁有的job。它不終止WebCrypto或宣稱取消底層promise，僅隔離其晚到回覆。

current(stamp)仍負責完成報告讀取：sequence、tab、gate identity、revision與原生media identity精確核對，再完整canonical來源核對；不可把job ownership併入它，因正常完成後job已為null。當仍擁有的job遇到未觀察到的gate改變，仍標示stale並結束busy；普通error仍可重試，未宣告來源編修仍拒絕。refresh保持輕量，不重讀10000句全文；read和成功完成時仍完整重查。

web/draft-compare-dom.js在當前報告onReady才清除download-status文字與error class；開始等待時不提前清掉舊提示，ignored late callback不能清掉新版提示。一般refresh保留同份提示，明確clear清掉它。此提示只是目前報告下載已送出，不是保存或草稿checkpoint；新比較不能冒用舊送出確認。

不改producer、selector、UTF8 sender、兩pending URLpool、原Apply／undo、HTTP／CLI／Agent／MCP或28組schemas。新增9JS adversarial/controller/DOM回歸測試，沒有新增資產或操作權限。產品138／來源38–138、未知139拒絕。完整native與回復／封裝證據見QA-v0.138.0.md與本輪manifest。
