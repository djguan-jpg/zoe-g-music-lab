# 限定 PID 的程序補查

v0.45 修正每輪收尾曾遇到的缺口：原 Windows handle 查詢無法取得狀態時，已退出的 Python 工作仍被標為 unverified。現在先走原生精確查詢，只有 unavailable 才補查同一個 PID；沒有新增 Agent／HTTP 程序或清除權限。

## 判定與保留

原生 handle 的 creation FILETIME ticks、image basename 與退出狀態仍是第一來源。原生 running 或 absent 不啟動 PowerShell；原生 handle 仍在 finally 關閉。

補查使用本機 Windows PowerShell、無 profile、無互動及隱藏視窗，固定 `Win32_Process`、`ProcessId=<已驗整數>` 篩選，只要求 ProcessId／Name／CreationDate。沒有 ComputerName、CimSession、命令列、執行路徑或環境。一次只查指定 PID，不列舉所有程序，也沒有終止方法。CIM operation deadline 3 秒，整個自有暫時 helper deadline 5 秒；helper 逾時只結束該次自有 helper、等待其退出，原工作與其他程序保留。

成功回覆必須是獨立 probe1 封套：format、schema_version、相同 PID 與一筆 identity 或明確 null。null 才代表查詢時沒有該 PID。空輸出、錯誤、warning、逾時、無工具、超過 2048 UTF-8 bytes、重複欄位、錯 PID／版本／多筆或未知形狀都維持 unavailable，不拿來宣告工作已退出。沒有 profile 或 fallback 安裝流程。

CIM_DATETIME 的小數欄位只有微秒；原 FILETIME 是 100ns ticks。補查的 identity 保留 CIM 原值與固定 ±9 ticks 不確定範圍，不把它改成原紀錄的值。image 相同且原時間落在範圍內時維持 unverified，不能宣告精確 ownership 或 running；範圍明確分離或 image 不同才判為 pid_reused，保留目前外部程序。原生精確相同／不同 ticks 規則保持。

`running`／`unverified` 都阻擋 prune。`stopped`／`pid_reused` 只確認原工作已不在，並不授權終止目前 PID。稽核列的補查 evidence 只含來源、狀態、image basename、ticks 與精度，沒有私人路徑；新狀態 limited 只用於内部觀察，對外稽核 status 保持既有四種。run1／audit1／recovery1、Agent1／draft3及12／17工具保持，probe1單獨管理。

## 分層與還原

- `maintenance.py`：純精確／有限精度身份政策與原保留政策。
- `process_probe.py`：probe1 原始 UTF-8、版本、形狀、PID與 identity 有界解碼。
- `process_probe_windows.py`：固定單 PID 的本機 CIM adapter 與 deadline。
- `run_identity.py`：原生 reader 與 unavailable 時的補查路由。
- `maintenance_fs.py`／`iteration_audit.py`：沿用完整封裝稽核、明確 preview token、journal及還原流程。

每輪 server／build 仍由原 handle 正常退出。查詢是當下觀察，不是防止下一瞬間 PID 重用的鎖，也不取代原 handle 的實際完成證據。補查失敗仍保留資料，不用單一 PID 強制清除程序。

Windows 語义核對來源：[Get-CimInstance 本機、Filter 與 Property](https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance?view=powershell-5.1)、[CIM_DATETIME 微秒欄位](https://learn.microsoft.com/en-us/windows/win32/wmisdk/cim-datetime)。±9 ticks 是本專案保守判定，仍須用實際 native／CIM 父子程序核對。
