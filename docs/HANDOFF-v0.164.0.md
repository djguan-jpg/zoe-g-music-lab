# v0.164.0 交接：完整驗收待完成

本輪含指定 run-only 盤點、摘要延後載入、隔離測試漏帶模組修正、完整失敗程序證據及原生 junction fixture。入口見[架構](ARCHITECTURE.md)、[指定程序](RUN-AUDIT.md)、[摘要載入](DIGEST-LOADING.md)、[失敗證據](PYTHON-TEST-FAILURE.md)與[QA](QA-v0.164.0.md)；產品操作仍見[開始指南](START-HERE.md)／[Agent](AGENT.md)。

codex/iteration-v0.164.0／Draft PR #163 保存差異。還原點 restore-v0.163.0-before-v0.164.0 指向原 main7222fd47ebd0faf7d6891fec8da1d3e4ac1b3910；接續還原點 restore-v0.164.0-review-before-acceptance-repair-1 指向 bc07d44ed782cdf6f6134bcf96b2e4446b11dc58。可另建審閱分支保留現在內容；不用破壞性 reset。指定提交／tree／source ZIP SHA 在 outputs/v164-qa/acceptance-1 新收據，前份 checkpoint 原檔保留。沒有成功 release manifest 或 v164 release tag；正式 main／Release 仍 v163。

19 項新增 Python，完整 discovery820；接續51集中測試通過，前批6版本JS、25Python語法與29 schemas／504歷史 cases／1036原v163 blobs核對收據保留。六法律／平台紀錄、七history、四Skills與非商用授權保持，四投稿仍 submitted_unverified。

完整驗收仍待完成：Python3.12 全套在原兩 worker／120秒停止，當時1045個來源前後SHA不變，兩個worker原登記及native terminal確認；JS147檔／兩file workers也達原60秒；producer集中檢查外層120秒停止，沒有完整方法數。啟動變動與同次原v163逾時只是交叉證據，未確定根因。600／180秒的延長選擇尚待人類回覆；不得由時間經過推定授權。

必要接續：依新證據處理驗收條件；通過完整820Python／1947JS、153JS語法與四Skills，重新核對原v163隔離還原，再對精確 source commit 執行正式 packager／遠端核對，才可合併與發佈。若時限經核准變更，明記實際新條件及原來源還原的方法，不冒充原120秒通過。保留獨立discovery／完整ID／兩workers與每個原handleEOF；沒有登記者不補造native identity。

每輪 outputs／程序盤點唯讀；--runs-only不提供清除token。latest3／嚴格超七天／exact tag與archive復原保持。partial、未知來源、checkpoint、草稿、素材與未知descendants保留；不得以bare PID全域清理。本輪沒有browser UI、保存下載、實聽、Host或創始接受，rolling goal active。

## 冷載入與完整來源計時

接續分層計時以合成8MiB來源完整核對；已預載標準provider的同程序prepare0.140秒、canonical ZIP0.161秒、application搜尋／分段各0.167／0.166秒。兩次cProfile實際CLI（41KiB／8MiB ZIP）原handle EOF0／native terminal與完整成果一致，總wall1.737／2.527秒；冷hashlib載入cumulative1.346／1.174秒。這定位本次兩個CLI樣本的主要耗時，不證明全部逾時根因、未來速度或完整接受。保留標準provider、原discovery／coverage與時限，沒有以fallback或共用程序替換獨立CLI案例。新收據在outputs/v164-qa/acceptance-2；還原點restore-v0.164.0-review-before-profile-2→1b8797927687393f40d6d2c5a6602d39091633bf。600／180秒選擇仍待人類回覆。
