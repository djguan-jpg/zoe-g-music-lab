# v0.35.0 交接與可逆

本輪新增獨立開發維護入口：原 managed job 以 creation time／image 核對，預設稽核封裝／本輪記錄，exact preview token 清除舊版並先保存 recovery journal。純政策、Windows唯讀reader、filesystem-Git adapter與CLI分層；創作HTTP／CLI／Agent／MCP及10／15工具保持。操作、容量與部分I/O限制見[維護契約](ITERATION-MAINTENANCE.md)。

## 驗證與位置

300Python／431JS／4Skill／33syntax／diff通過；19新測試、真合成CLI清除一版並8檔逐bytes復原、受管理server live阻擋／正常退出／handle關閉、原生四工作台／draft3下載讀回、v34指定ZIP281／431還原。詳見[QA](QA-v0.35.0.md)。原生tab已關、QAserver正常停止。正式媒體／實聽／完整視覺／特定Host／FreeTWAI／原生file播放仍待；rolling active。

## 分支與原始碼還原

branch `codex/iteration-v0.35.0`；restore `restore-v0.34.0-before-v0.35.0` 指main起點 `26dd3031b3a30a34fd63214ff2a181e5e490992f`。前版指定source `c6f8b6f356febebe2478f6e2f4ba850d87e5fdcd`，ZIP752655bytes／SHA `4ac84fded892ec59e2f5a3d87ba3cfe3d508791d1f0fe073994b788118720bbd`；解壓281／431實測通過，限定暫存移除。

指定source commit、tree、changed files在 `outputs/v35-qa/source-evidence.json`；ZIP／SHA／manifest及privatePR／Release／遠端bytes在 `package-evidence.json`、`pr-evidence.json`、`release-remote-evidence.json`。封裝只含指定Git commit，不包含outputs／原媒體／秘密；封裝後不重寫同名產物。GitHub CI未配置，本機及封裝另實跑。

先另存未提交編修，再 `git switch -c codex/restore-v0.34.0 restore-v0.34.0-before-v0.35.0` 或archive到新目錄。main用revert／privatePR恢復，保留分支差異；使用者草稿、備份、素材由各自備份恢復。

## 本輪維護與續做

發布後latest3為v0.35／v0.34／v0.33。只核對本輪實際自我登記的run1記錄，PID重用保留目前程序，不枚舉或kill；unknown不能冒充已停止。最終audit／process／inventory記錄實際存活、8875listener與封裝候選；未超七天不刪除，草稿／備份／媒體排除。合成測試與restore暫存限明確自有目錄正常回收。

續做先讀projects／README／PROGRESS及本輪QA，建下一分支與restore。優先可重現使用錯誤及正式媒體／完整視覺證據；本輪維護能力不可替代媒體驗收。保持schema拒絕未知版本與原素材，無新依賴、auth、公開或平台投稿授權。
