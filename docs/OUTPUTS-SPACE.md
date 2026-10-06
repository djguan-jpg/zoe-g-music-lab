# outputs 唯讀空間報告

v140補充：明確empty維護option在reader前拒絕；見[CLI契約](MAINTENANCE-CLI.md)。原space1／filesystem reader與下列metadata限制保持。

```powershell
python scripts/iteration_audit.py --space-report
python scripts/iteration_audit.py --space-report --out outputs/space-report.json
```

`--workspace`沿既有明確本專案 marker／containment 驗證，預設此checkout。輸出位置須是outputs內新檔，在掃描前檢查，寫入exclusive；報告的觀察不包含稍後新增的receipt。`--space-report`與prune、restore-journal、record-self互斥，拒絕run-record、package-directory與expected-token。預設不帶此旗標仍是原audit；CLI exit0表示完整報告，1表示拒絕或讀取失敗，argparse互斥錯誤exit2。

## 分層與語義

musiclab/maintenance_space.py為純內部metadata aggregation，沒有檔案／程序I/O；maintenance_space_fs.py負責bounded traversal；iteration_audit.py只路由與receipt。space1獨立於audit1／run1／recovery1，不是外部任意JSON importer。沒有HTTP／Agent／MCP入口、清理權限、程序信號或網路能力。

只對regular files累加st_size，hardlink按每個filename計一次，不是allocated disk bytes。directories不含outputs根；skipped_links／skipped_other分開且不計size或age。`older_than_seven_days`使用本次固定now−mtime嚴格大於604800秒，等於不算，未來時間另計。mtime是metadata，不能證明作品保存時間、ownership或重建安全。

固定categories是release_area（第一層releases目錄下）、iteration_area（第一層canonical vN-qa，N為0或1–6位無前導零ASCII整數）、other_area；同名頂層regular file不算目錄分類。分類不驗證副檔名／內容／身份。非空標準QA群組依bytes降冪、version數字升冪取前20；空目錄只計directories。報告只輸出固定分類與canonical數字QA label，未知文件／目錄名、私人draft名稱及絕對路徑不回傳。missing outputs用outputs_exists=false與zero totals，空目錄為true。

## 有界與失敗

最多50000檔、20000子目錄、75000entries（含跳過的links／special）、64層relative parts、1024非空QA群組；最深可讀regular file為64parts，目錄須小於64以容許遍歷。size為strict integer且sum≤2^63−1，timestamps為有限非bool數值且絕對值≤2^53−1。純模型失敗前不提交該entry。

使用scandir和no-follow entry stat；descendant link／Windows reparse及special entries跳過，outputs根／ancestor link拒絕。每個directory遍歷前後重查containment、no-follow狀態及dev／inode身份；OSError以固定無私人路徑訊息拒絕。超限、不可讀或觀察到替換都拒絕整份，不提供截斷卻complete的報告。這是中繼資料觀察，沒有atomic no-follow directory handles，不是race-proof sandbox；同時快速變動可能無法被偵測，stats未必是同時點。不要把它當成清除token。

既有prune仍要求原完整audit、strict>7days、latest3外、exact tag／source／現場Git archive重建、typed同host job及preview token；本報告不新增任何deletion candidate。草稿、媒體、未知QA及partial packages保留。
