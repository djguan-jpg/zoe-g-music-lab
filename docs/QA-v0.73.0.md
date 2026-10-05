# v0.73.0 驗證

gap以真CLI draft backup建立兩版canonical ZIP；當時Agent validate_request拒絕draft_backup_export，actual MCP initialize/tools-list19沒有export，明確重現功能缺口。TemporaryDirectory移除，無production資料。

新11Python覆蓋request strict/隔離/讀前拒絕、真all/selected/empty metadata、不回原文、完整ZIP/producer摘要/版本/count/IDs/CRC核對、實際大型ZIP>512KiB metadata與encode前拒絕/邊界、壞版與missing ID/healthy subset、inline還原原bytes/時間/IDs與retry、CLI其他cwd/禁止out、Agent好壞好/disabled/io路徑消毒、actual MCP20/readonly/具體input-output schema、HTTP Origin/disabled/path及舊prepare六欄維持。首focused錯預期missing有效ID為ValueError，修fixture依既有OSError及Agent io_error；產品未放寬、原失敗收據保留。Schema加入後fresh focused11+既有backup22通過。

最終532 Python／853 JS／76語法／四Skills／diff通過，Python120秒cap保持。140歷史四scope ZIP/manifest由v72真producer派生，精確bytes保持；指定v72 ZIP SHA 4e59e421b085a17f48e98a0f6bc458fce0742f318c3eaf2c52ee066bb9c99afa/CRC核對後獨立還原521/853，暫存移除。source封裝從指定commit抽出後另跑全套及Agent/MCP metadata。

integration-verified.json由真CLI stdout、Agent JSONlines、MCP實際handshake/discovery/tools-call、127.0.0.1 ephemeral HTTP export四種返回取得inline bytes。QA helper明確另存各自ZIP，full read_backup/CRC/manifest/全部revision hashes後restore到四個新synthetic targets，actual added數及再次reused數正確，來源與target每份record/draft bytes/ID/時間相同；原source逐bytes保持。Agent default無base64，path拒絕；MCP20工具且readonly。沒有backup/delivery staging或瀏覽器tab；own ephemeral server shutdown/join後停止。

新capabilities/data_schema與MCP具體outputSchema在新增測試的actual MCP回覆核對，schema不能代替ZIP/hash/ID語義關係。每次ZIP created_at可能不同，不能跨兩次export要求SHA相同。沒有新增工具寫檔、media/模型或Host權限。

最終private PR/prerelease、exactsource ZIP/SHA、actual遠端assets bytes/digest/CRC/legal/four refs/tree/cleanmain及全typed jobs/outputs盤點依outputs/v73-qa。latest73/72/71保護，>7天且exact重建才候選；failed36/53、unknown/media/drafts/backups/外部程序保持。沒有全面native visual/screen-reader/瀏覽器保存、特定第三方Agent Host/正式媒體/實聽或平台創始接受驗證。legal4/private/not_submitted、rolling active。
