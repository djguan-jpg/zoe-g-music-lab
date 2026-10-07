# Python 驗收失敗的程序證據

成功驗收仍依 [完整測試契約](PYTHON-TEST-RUN.md)：兩個隔離 worker、120 秒總期限、獨立 discovery、全部 ID 與原 handle EOF／exit0。失敗診斷不能代替成功摘要，也不改分組或略過案例。

`test_run_summary.worker_startup` 是純解析器。只核對原 stdout 第一個完整換行前的 startup JSON，最多 4096 bytes；group、原 Popen PID、run1 的 job／identity 與嚴格 JSON 必須相符。它回傳隔離副本，不讀程序或檔案。後續 result 不完整或超限不會抹掉有效的啟動登記，但仍不能作完整測試接受。

`check_python_tests.disclose_failure` 在兩個原 handle 都完成 communicate 後逐一輸出可用的登記與 parent 觀察的 `worker-eof`。EOF 行含 group、原 PID、exit code、poll 結果及 startup 是否可用。若冷啟動尚未印出登記、內容損壞或來源不符，只保留 handle EOF，不虛構 run1／creation identity。每組診斷文字最多保留最後 16000 字元；communicate 後才截取，這不是 stream 記憶體上限。

成功 stdout／summary1 不變。失敗仍回傳 1，不發成功 release manifest。失敗後的 native／CIM 觀察沿既有同主機 typed record；bare PID 的 EOF 不是 native ownership 證明。控制範圍只含自行啟動的直接 Popen handles，不能宣稱未知 descendants 或全機程序已清除。

Windows junction 測試使用 `tests/windows_fixture.py` 的原生合成 fixture。新 junction 與目標都必須在明確的 `zoe-junction-*` 系統暫存子目錄內，拒絕既有 reparse ancestors，核對實際 target 並關閉自有 native handle。原 junction 安全拒絕與外側檔案 bytes／mtime 測試保留；不靠 PowerShell 啟動建立 fixture，也不授予產品路徑或清除權限。

指定提交封裝的 Node 全套明確使用兩個 file workers，仍收集全部測試檔，原 60 秒期限保持。這只限制檔案並行度，不保證實際 RAM、所有 Node descendants 或完成速度。完整驗收逾時時，保留原失敗輸出與可用身份，不能由集中測試或 source checkpoint 推定正式通過。
