# 明確維護動作與參數存在性

未提供option和明確提供空值必須分開。v139的truthiness guard會忽略空expected-token，空record-self則讓實際command走default audit；這不是pruning safety bypass，但會執行未選的reader並返回成功。

```powershell
python scripts/iteration_audit.py --space-report --expected-token=
python scripts/iteration_audit.py --record-self=
```

兩者在v140 exit1，沒有workspace／catalog／PID query／receipt寫入。四個path options（workspace、restore-journal、run-record、out）明確empty在argparse階段exit2；不先讓Path('')轉成'.'。非空path保持原拼法，不strip或Unicode normalize；明確'.'仍是字面路徑，後續原containment及目的檔案規則照常驗證。raw外部option文字只走本地CLI，沒有Agent JSON入口。

## 分層

musiclab/maintenance_cli.choose_action純選取audit／prune／restore／record／space，四個action控制與has_records必須是真bool，record_job是否提供用is not None；多action拒絕。它不讀檔案、程序、網路或Git，只回傳固定action name。

expected_token只允許prune，哪怕值empty或非string也不能在其他command被忽略；prune仍要求64個小寫hex字元、不trim／coerce。run-record與package-directory只允許audit／prune；package identities在I/O前沿原prune_batch_directories檢查1–128、canonical名稱、唯一性，原完整eligible catalog及exact token核對仍留在filesystem層。此提前shape檢查不能证明selected package可刪。

validate_job從原validate_run抽成同一純helper，保留[a-z0-9][a-z0-9-]{0,79}及原error文字；不修改run1 shape或原PID／creation ticks／image比較。CLI先檢查job才呼叫record_current_run，其他API的原行為不在本輪擴張。合法動作經workspace驗證後沿原路由，receipt位置在執行前核對、新檔exclusive寫入保持。

預設audit與五種合法action的DTO不變；沒有HTTP／Agent／MCP maintenance operation、auth/session變更、依賴或程序信號。space1仍是metadata觀察、不開outputs內容；分類／age不是ownership或deletion eligibility。保留latest3、strict>7days、exact tag／現場Git archive重建、typed same-host job與完整preview token。

## Windows連結驗證

tests/test_maintenance_cli.py在自有synthetic temp fixture建立真正junction，target在同一自有base內但在selected workspace外。descendant metadata被skip；outputs根junction拒絕；--out穿過descendant／root junction都拒絕，target沒有receipt且原檔SHA／mtime相同。清理只核對精確link位置、target及reparse attribute後os.rmdir(link)，沒有recursive target deletion。真symlink另有既有测试，当前OS權限不足仍skip；junction證據不代表symlink全覆蓋。

readonly metadata的before／after path／dev-inode checks不是atomic no-follow handles，不能宣稱race-proof。外部同時快速替換的限制沿原OUTPUTS-SPACE契約，這輪不改filesystem traversal。
