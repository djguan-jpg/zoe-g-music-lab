# 迭代封裝與程序稽核

v0.35 新增開發維護入口 `scripts/iteration_audit.py`。一般執行只稽核本專案，輸出候選與保留原因；清除需要明確 `--prune` 及前次預覽的 token。它不處理歌曲、草稿庫或 Agent 工具呼叫。

## 預覽、清除與還原

在本 checkout 執行；`--workspace` 可明確指定另一個已確認的本專案 checkout，拒絕 drive root、其他專案與連結。以下 JSON receipt 路徑需尚不存在。

```powershell
python scripts/iteration_audit.py --out outputs/maintenance/audit.json
$audit = Get-Content outputs/maintenance/audit.json -Raw | ConvertFrom-Json
python scripts/iteration_audit.py --prune --expected-token $audit.prune_token --out outputs/maintenance/pruned.json
```

token 綁定候選目錄、版本、commit、兩個檔案的 SHA-256／大小／修改時間。清除會重新稽核，候選改變就拒絕；過程再核對最新三版與有記錄的程序。沒有候選時不搬移或刪除檔案，也不建立 recovery journal。

非空清除先建立不可覆寫的 `outputs/maintenance/prune-<id>.json`，保留原 manifest UTF-8 與來源／檔案識別。每個候選重新核對後移入同一專案的專用目錄，再核對兩檔、只刪除指定 ZIP／manifest 及空目錄。沒有遞迴刪除。

```powershell
python scripts/iteration_audit.py --restore-journal outputs/maintenance/prune-<id>.json --out outputs/maintenance/restored.json
```

將 `<id>` 換成實際 receipt 的 journal 名稱。還原先驗證整批 journal、來源 metadata、Git archive SHA-256 與 ZIP ledger，全部準備成功後才發布；已有目錄或檔案拒絕覆寫。保留原始 manifest bytes 及兩檔修改時間。

清除與還原不是跨檔案的原子交易。中途 I/O 失敗可能留下部分結果、隔離目錄或已還原目錄；journal 保留供人工核對，不應直接重送或刪除未知檔案。`--out` 寫入失敗也不能當成前述動作完全未發生。Git objects 與相同的 archive 產生條件仍需存在；重新產生的 bytes 不同就拒絕，不以近似 ZIP 冒充還原。receipt 不取代 Git 備份。

## 封裝保留政策與容量

只接受 `outputs/releases/v<version>-<commit前12碼>` 下完整、標準 manifest1／canonical ZIP 的兩檔目錄；額外檔案、未知 schema、不完整封裝、損壞 ZIP、連結／reparse point 都保留並說明。草稿、備份、原始媒體、其他 outputs 與其他專案不列候選。

保留最新三個已核對的不同版本；兩檔中較新的修改時間必須嚴格超過七天。候選還需核對 `v<version>` tag 指定 commit、projects metadata、所有 ZIP 內容與 ledger，並現場由該 Git commit 重建完全相同的大小及 SHA-256。tag／來源／bytes 無法核對就保留。版本排序依三個整數，不使用字串排序。

最多128個 direct release entries、2000個 manifest source files；manifest／recovery journal 各2 MiB，ZIP64 MiB／展開256 MiB。標準 ZIP 中央目錄最多2 MiB／4096 entries，在 ZipFile 建立 entry objects 前檢查實際數量；ZIP64、多磁碟或非標準 layout 拒絕。超限 journal 在任何搬移前拒絕。Git 單次呼叫有60秒 deadline，離線操作不改 tag、分支或遠端。

## 同主機的程序記錄

PID 會被重用。managed job 必須在實際 Python 程序開始時記錄 PID、Windows creation FILETIME ticks 與執行檔 basename；只記 PID 的舊 receipt 不能證明程序身份。

```python
from pathlib import Path
from musiclab.maintenance_fs import workspace, write_new
from musiclab.run_identity import record_current_run

root = workspace(Path.cwd())
write_new(root, root / 'outputs/maintenance/build-run.json',
          record_current_run('build-check'))
# 由本程序執行實際受管理工作；記錄不會啟動任何工作。
```

`--record-self JOB` 可記錄該短 CLI 程序，但其退出後不能代表另一個 build／server。job label 不放私人路徑或秘密。記錄只能用在同一台本機，不是跨主機或身分驗證憑證。

```powershell
python scripts/iteration_audit.py --run-record outputs/maintenance/build-run.json
```

`--run-record` 可重複，最多32筆。`running` 表示原 creation／basename 都匹配；`stopped` 表示已退出／不存在；`pid_reused` 表示目前 PID 已屬另一個 creation 或 image；`unverified` 表示無權／無法查詢。後兩者分開：重用的外部程序保留，而未知不冒充原工作已終止。清除遇 running／unverified 拒絕。

Windows reader 只開單一指定 PID 的 QUERY_LIMITED_INFORMATION handle，讀 creation／image／exit state，finally 關閉 handle。不枚舉程序、不讀 command line／環境、不終止程序。非 Windows 無法自我登記；觀察明示 unavailable。此工具提供結束證據與清除阻擋，managed server 仍由原 handle 正常停止。

## 分層與版本

`maintenance.py` 是純版本／身份／保留／token 政策；`run_identity.py` 是單程序唯讀 Windows adapter；`maintenance_fs.py` 是明確路徑、ZIP／Git facts、journal／prune／restore adapter；`iteration_audit.py` 只解析 CLI 與輸出 JSON。測試以新建合成 Git repository 驗證實際 archive、清除、還原及原 bytes，不使用使用者其他 Repo。

run／audit／recovery 各 schema1；產品0.35.0、Agent1、MCP2025-11-25、draft3 與創作 report 各自管理。未知版本拒絕，不靜默遷移；基本10／啟庫15工具保持，維護能力沒有新增到 Agent／HTTP。
