# 指定程序的唯讀核對

一般 `iteration_audit.py` 保持完整封裝／保留政策及指定程序核對。要在同一輪補查另一批原程序，可明確使用：

```powershell
python scripts/iteration_audit.py --runs-only --run-record outputs/maintenance/build-run.json --out outputs/maintenance/runs.json
```

`--run-record` 可重複，必須有1–32份明確、不同的紀錄路徑。路徑位於本專案 outputs，拒絕連結、reparse point、越界、空清單、超限、重複路徑、超過4096bytes、未知run1或損壞JSON。先完整核對全部紀錄，才查詢指定PID；一份無效紀錄不會開始部分程序查詢。

純 `maintenance_runs.py` 管理有限數量、隔離run1及 `zoe-run-audit` schema1；`maintenance_fs._run_audit` 讀取每檔一份有界bytes並派生SHA-256，沿 `run_identity`／既有native與必要CIM觀察；CLI只選擇動作與保存新JSON。一般audit共用同一讀取／判定層，原audit1欄位保持。新報告的 `record_sha256` 與 `runs` 按本次請求順序一一對應，digest是身分核對所用的同份原始bytes。

`running`／`stopped`／`pid_reused`／`unverified` 沿既有creation ticks／image與CIM精度規則。報告僅反映當次指定程序觀察；SHA不證明紀錄作者或全機所有權，不承諾外部同時改寫的原子快照。後續再用紀錄時仍須核對原bytes／原身分；managed job由原handle正常結束，另確認原handle的EOF。

此動作不掃描ZIP、manifest或Git來源，也不回傳封裝候選或prune token。與 `--prune`、`--restore-journal`、`--record-self`、`--space-report`、`--package-directory`、`--expected-token` 混用拒絕。`--out` 僅新增本專案outputs下的receipt，已有檔案拒絕覆寫。

例如37份已完成工作：第一批32份使用一般audit，得到本次完整封裝盤點；後五份使用runs-only，補足指定程序核對。聚合時保存完整去重來源清單與原報告，不將後五份的程序報告冒充新的封裝盤點。真正清除仍沿 `--prune` 重新完整驗證本次候選與明確指定的程序，不能拿runs-only報告授權清除。32份單批上限、128份恢復／清除上限及最新三版本／嚴格超七天規則保持。

這是開發維護CLI的獨立run-audit1，不加入Agent、MCP或HTTP操作。Agent1、draft3、原29組operation schemas及創作資料保持。測試使用合成新工作區；另以原handle建立／關閉的本機子程序驗證running與terminal。
