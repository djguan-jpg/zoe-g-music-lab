# 完整 Python 測試與 worker 證據

```powershell
python -X utf8 scripts/check_python_tests.py
python -X utf8 scripts/check_python_tests.py --report-json
```

預設文字保留Ran N tests及原OK行，另外列出skip事件與expected failure數。JSON提供独立zoe-python-test-run schema1，含完整method計數、skip／expected failure事件數、最多20個skip IDs與truncated旗標、兩個worker分組／PID／typed run／原handle EOF／exit0。unittest subTest可產生多個skip事件，因此不能拿tests減skipped宣稱一般pass數。原因／failure traceback／本機路徑／命令列／環境不進摘要，skip只列本專案source test ID。

## 分層與來源

musiclab/test_run_summary.py是純模型，無discovery／filesystem／process／network。每worker須兩個完整startup／result JSON frame，合計≤1MiB；嚴格UTF8、duplicate keys、非有限數字與未知欄位拒絕。expected groups由parent重新discovery建立，順序／數量／完整IDs必須逐一相同且聯集不空、唯一、≤10000。group／count／PID不接受bool，兩個original PID須不同；failed／errors／unexpectedSuccesses不能作pass，所有identity／EOF／exit0需一致。

worker在discovery前對自己的PID登記既有run1：Windows原生creation ticks／image basename，固定python-tests-0或1；原身份reader沒有新增權限。非Windows明確run=null與worker_identities_verified=false，不假造Windows證據。parent只控制自己啟動的Popen objects，communicate收集並確認兩者returncode及poll後才把eof傳給純模型；任意外部stdout、bare PID或worker聲稱pass不能取代原handle完成。

runner仍兩worker、120秒總執行deadline；分組按原module規則，不加並行或記憶體cap。timeout只沿原Popen handle kill及communicate；parent啟動失敗亦只處理已啟動的自有handles。這不是全域程序／descendant／外部工作清理能力；上輪未取得的失敗child handles不回填為已驗證。1MiB檢查在communicate讀完之後，不宣稱stream硬限制或程序sandbox。

## 摘要與封裝

純摘要回覆≤16KiB，原skip events完整計數保持，IDs受20項及byte預算雙限，不改原ID。unknown schema拒絕；回傳與checked_summary重新建立隔離rows／run identity／skip lists，不修改輸入或提供持久狀態。省略的細節不代表沒有skip。

scripts/package_release.py沿原immutable source extraction執行同一runner的--report-json，再以decode_summary核對。合法摘要保存在原release manifest1的checks.python_run，原六個passed欄位與root shape保持，ZIP／manifest仍只有兩個release files。錯誤／不完整／未知summary即使子程序exit0也會停止後續檢查並只留FAILED.txt，不能發成功manifest。舊manifest無python_run只能明示未提供，不推論worker身份或skip數、不靜默遷移。

外層150秒給原120秒runner結束與清理時間，兩個上限都保持。JSON摘要證明本次自有direct worker與測試coverage，不證明作者／版權、平台founder、Host安裝、全機殭屍程序不存在、真媒體實聽或完整browser視覺接受。跨輪維護仍沿same-host typed record、原handle及既有strict>7days／latest3／exact tag／Git archive政策。

失敗時保留兩個原 handle 的 EOF 與實際可用的 startup；最多4096bytes的純解析與未取得身份的限制見[失敗診斷契約](PYTHON-TEST-FAILURE.md)。成功摘要與上述完整接受條件保持。
