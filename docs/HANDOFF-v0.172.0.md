# v0.172.0 交接

使用者最新要求是實用性與成熟工具分工，並明確要求不採用的編輯器直接隱藏。一般介面現在只有字幕交付、音檔核對、素材交接；舊編輯 DOM 保留在 `legacy-top`／`legacy-editors` 隱藏容器，不自動載入示範。內部草稿載入與流程切換不能揭露編輯器。成果返回按鈕定位可見匯入面板。

閱讀[實用性門檻](PRODUCT-UTILITY.md)，後續先驗證一件真實作品是否省步驟，不能再以版本數或測試數選功能。不要自行重啟通用剪輯、人工校時或圖片影片產品方向。

原起稿資料覆蓋問題已修，純 core → DOM／app／HTTP → metadata → 文件分層保存，見[契約](MV-SEED.md)及[QA](QA-v0.172.0.md)。沒有新依賴、模型、產品外網、Agent operation 或權限擴張。

還原點 `restore-v0.171.0-before-v0.172.0` 指向 `d483ffb5027550d8f2bc5e232293eb6fad8dbdf4`，候選分支 `codex/iteration-v0.172.0`。完整接受與精確 source package 通過後可建立 Draft PR／候選封裝；指定資安掃描與結果審閱完成後才合併、tag 與 release。精確 commit／ZIP／manifest／remote 狀態以 `outputs/v172-qa/acceptance-3` 收據為準。前兩份完整失敗紀錄保持。

使用者已明確恢復指定 AI Security Scanner，並從桌面開始。既有 v0.5.0 CLI、doctor、d1858cc 的精確 1097 份 raw Git 快照與實際 run 已核對。首輪 101 筆（19 high／82 medium）逐筆審阅，目前 66 誤報、35 已有保護或合理用途，沒有確認到可利用漏洞；原 scanner 分級／結果與人的處置狀態未改。

七個引擎完成，Semgrep 部分完成。唯一 raw error 的 SHA 已核對，為 wave-position.js:26 的 `?.05:.5` 造成 PartialParsing。候選只把此 expression 改為明確 `? 0.05 : 0.5`，原／新 Node syntax 和 31 定位測試通過。見[資安審閱](SECURITY-REVIEW-v0.172.0.md)。必須準備修改後精確 Git 快照，再由人從 desktop 開始新的 source scan；不能改原快照、重啟旧 run、用 plan／集中測試取代，也不自行修 scanner／provider。沒有新來源的完整接受，Draft PR #171 與原封裝保留，正式版保持 v171。

完整接受與成功封裝的固定来源仍是 `b295f09cf88644da7d55babf7952e312f573c7d7`。本次一行解析相容書寫與四份文件需另以 source checkpoint 核對 CRC／raw Git blobs；不能宣稱新提交已重新執行全套或完成 scanner。除明確一行外，程式、測試、契約與其他來源逐份保持。接續還原點 `restore-v0.172.0-before-handoff-deferral` 與 `restore-v0.172.0-before-scanner-review` 保存原候選／原掃描來源。忽略 QA 保存所有 101 筆逐筆判定、標準遮蔽 HTML、原 parser error、集中验证與原 failure。

最新三個已發布版本與未知／partial／FAILED 保留；只有原標準核對通過且嚴格超過七天的合格封裝才能清理。只核對已記錄的自有程序，不能把全機程序當成殭屍刪除。rolling goal 仍 active，本版接受不代表整個產品已完成。
