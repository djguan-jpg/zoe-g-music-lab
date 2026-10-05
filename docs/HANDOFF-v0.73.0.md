# v0.73.0 交接與還原

新draft_backup_export：純request/shared ID validator→既有immutable producer→同次bytes完整ZIP/摘要/IDs核對→不可變PreparedBackupExport→application→CLI/Agent/MCP/HTTP。預設metadata，explicit<=512KiB inline，不寫檔、不選JSON path。MCP具體輸出schema與capabilities data_schema；14基本/啟庫20需重新discovery。export1/backup1/draft3/library1/Agent1分開；原backup/prepare/inspect/restore保持，參考BACKUP-EXPORT.md。

基準main cc4fd8185605d528362533188115123f883c32f6；restore-v0.72.0-before-v0.73.0指向基準、codex/iteration-v0.73.0保留diff。先另存未提交創作與所選草稿庫，再從restore tag另建codex/還原分支，不改寫main。指定v72 ZIP SHA/CRC與521/853獨立還原通過；private PR/prerelease、指定source ZIP/SHA/manifest及actual遠端download/refs/tree/cleanmain依outputs/v73-qa收據。

532/853/76/4、140歷史ZIP、四adapter實際返回inline bytes與source/restore同bytes、ephemeral server joined及無staging見QA-v0.73.0.md。沒有browser UI/media變更或保存驗證；準備傳輸不是磁碟耐久/權利/平台接受。11新測試與原fixture OSError修正、完整schema均有收據。

synthetic source/四targets/ZIP留ignored outputs，不進Git/source封裝、不隨清理使用者草稿。全本輪typed jobs最終稽核，最新73/72/71保護；只有嚴格超七天且exact Git/tag可重建才候選。failed36/53、unknown、素材、草稿/備份/外部程序保持。legal4 ZOE. G/djguan-jpg/PolyForm Noncommercial1.0.0/private/FreeTWAI not_submitted保持。後續先restore/branch再追可重現缺口，rolling active。
