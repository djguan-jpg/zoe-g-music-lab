# v0.164.0 交接：完整驗收待完成

本輪已完成指定程序唯讀盤點與標準摘要建構子的延後載入。入口見[架構](ARCHITECTURE.md)、[指定程序契約](RUN-AUDIT.md)、[摘要載入契約](DIGEST-LOADING.md)；驗證見[QA](QA-v0.164.0.md)。產品／Agent工作流程仍見[開始指南](START-HERE.md)／[Agent](AGENT.md)。

還原點 restore-v0.163.0-before-v0.164.0 是原main7222fd47ebd0faf7d6891fec8da1d3e4ac1b3910；codex/iteration-v0.164.0保存差異。可從還原tag另外建立審閱分支，保留當前分支與輸入；不使用破壞性reset。審閱PR與精確source checkpoint的提交／tree／SHA記於outputs/v164-qa收據。它不是正式Release，沒有成功release manifest或v164 release tag，main／正式發佈仍v163。

集中32Python／6版本契約JS與25本輪Python語法通過，新增16Python；29 schemas、504歷史ZIP／manifest与1036原v163 raw blobs保持。六固定紀錄／七history／四Skills、PolyForm非商用與四既有投稿保持，平台仍submitted_unverified。

必要接續：根據已保留的逐項trace查明完整測試期限失敗，先驗證環境負載與產品回歸；同次原v163也在原120秒失敗，只能作为交叉證據。未經新證據不重複提交相同工作，不擴大worker／期限或跳過測試。通過完整817Python／1947JS、153語法與四Skills後，重新核對原v163隔離還原，才由明確source commit執行正式packager與遠端Release核對。每一步保存原handle／typed run／EOF，不回填未取得的identity。

一般audit完整核對封裝；--runs-only只補查1–32份明確程序，沒有清除token。保存同份原bytes SHA／原PID／creation ticks，真正清除仍重查完整候選與程序。最新三個正式封裝／嚴格超七天／128份恢復保持，來源不明、partial、草稿、素材與未知程序保留。

本輪沒有browser UI、保存下載、實聽、Host或創始接受；rolling goal維持active。最後程序／outputs盤點見本機final收據；完整驗收的未完成狀態不能由checkpoint ZIP取代。
