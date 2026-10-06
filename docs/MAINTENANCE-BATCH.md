# 明確分批封裝維護

完整盤點最多1024個direct entries，最新三個已核實版本受保護；只把嚴格超七天、exact tag與immutable source及現場Git archive可重建原ZIP的封裝列為候選。草稿、備份、媒體、其他outputs、reparse、不完整、unknown及來源不符維持保留。default audit1不變；default prune仍需要完整候選token，129份以上在recheck／journal前拒絕。

先執行 `python scripts/iteration_audit.py` 查看候選。由回覆的 `candidates[].directory` 精確複製選取身份，重複指定 `--package-directory`，輸出batch預覽；確認後以相同選取搭配 `--prune --expected-token`。下面字串是候選欄位的示意，須以真實候選值替換；不使用任意路徑或自行猜測封裝身份：

```text
python scripts/iteration_audit.py --package-directory <candidate-directory-1> --package-directory <candidate-directory-2> --out outputs/batch-preview.json
python scripts/iteration_audit.py --package-directory <candidate-directory-1> --package-directory <candidate-directory-2> --prune --expected-token <batch-prune-token> --out outputs/batch-result.json
python scripts/iteration_audit.py --restore-journal <result-journal>
```

selector只接受1–128個唯一canonical字串 `outputs/releases/vMAJOR.MINOR.PATCH-12hex`；大小寫、slash及完整source前綴須與候選身份完全一致，不正規化、不接受absolute／parent路徑、iterator、Path或重複。每個版本數字段1–6位。不能混用restore／record-self。receipt預設exclusive create且須位於本workspace outputs；已存在輸出在盤點或清理前拒絕。

純maintenance.prune_batch_plan先驗完整候選catalog的每項identity，再選取subset；最多1024候選，不忽略未選來源的損壞。回傳format=zoe-iteration-prune-batch、schema_version=1、eligible_prune_token及排序selected；獨立prune_token從format／schema／整份候選token／selected的canonical JSON SHA派生。batch與full token互不替代，選取或任何候選身份變更使初次確認拒絕。maintenance_fs.audit_batch另嵌入完整audit1及mutation=none；prune回傳同batch封套及removed／journal。schema1獨立於product133／Agent1，不新增operation schema。

prune先重新完整盤點、核對批次token及明確same-host run records，再完整recheck selected來源，限制128份與2MiB原recovery1日誌。每份move前沿既有完整audit、latest3與source identity／重建能力／running條件重查；精確same-root move後核對两檔再unlink。初始token核對後逐項即時重查不把所有未選來源綁成原子鎖；檔案系統I/O失敗可能有部分結果，journal及quarantine供人工核對／復原。禁止以此宣稱原子交易、通用filesystem安全或固定RAM上限。

每次成功批次後須重新盤點／預覽下一批；沒有自動截取、分頁清除、批次迴圈、process enumeration／kill、Agent或HTTP維護權限。restore沿原recovery1嚴格shape、source bytes及mtime重建，拒絕覆寫現有目錄。本輪實際v132工具可復原v133批次日誌；舊版不支援新selector或batch預覽。
