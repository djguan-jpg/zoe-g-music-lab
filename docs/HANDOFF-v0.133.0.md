# v0.133.0 交接與可逆

restore-v0.132.0-before-v0.133.0固定e5957ace21d30b1e3f56b15c9fbed9098f56a560，分支codex/iteration-v0.133.0。需要程式還原時從此tag另建codex/restore-*與PR，不rewrite main或已發佈tag，不覆寫草稿／媒體、不撤銷投稿。

## v0.133.0 明確分批維護

開發維護 CLI 新增可重複的 `--package-directory`，由完整候選明確選取1–128份預覽及清理。預設完整 audit1／prune 行為保持；超過128候選仍拒絕整批清理，不自動截取或連續清理。新 batch1 封套內含完整 audit1、選取身份、整份候選 token 與獨立批次 token；未選候選變更也使初次批次 token 失效。每批須重新預覽，再帶相同選取及 exact token。

maintenance 純選取／身份及確定性 token → maintenance_fs 完整來源盤點、即時條件與 recovery1 → iteration_audit CLI。最新三版、嚴格超七天、exact tag／现场 Git archive bytes、same-root 精確移動及 unlink、running／unverified 明確程序拒絕保持。復原日誌仍最多128份／2MiB，restore 拒絕覆寫；I/O 可有部分結果，保留 journal／隔離檔，不能宣稱原子交易。沒有新增 Agent／HTTP／瀏覽器維護權限。

645 Python（107.344秒，新增17）、1647 JS、143語法及四Skills通過；集中17。真132份合成Git／tag／ZIP封裝產生129候選，明確只清理2份，127未選候選、最新三版、未知partial及合成草稿保持；實際v132指定來源工具讀取新recovery1，全部264檔原bytes與mtime復原。第一份QA helper誤讀不存在的package_count欄位，預覽後、清理前失敗並正常結束；保留原腳本，修正的新helper完成全流程，未改產品來配合helper。

原v132指定ZIP還原628／1647，暫存移除。380份歷史交付ZIP／manifest原bytes及27組operation schemas保持；application／CLI／Agent／MCP／短命HTTP完整備份檢查一致，good-bad-good／200400200，明確10版輸出保留完整record／draft原bytes，原合成草稿庫hash保持。產品133／唯一來源38–133共96版，未知134拒絕；20／27工具、Agent1／draft3／backup1、audit1／recovery1／run1保持。本輪無UI改動或新原生瀏覽器操作；既有完整視覺、瀏覽器落盤、媒體實聽／同步、Host及平台創始核實限制保持。

PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg及四份submitted_unverified投稿保持。以還原tag、codex分支、指定source ZIP／SHA、PR／Release實際遠端asset及final same-host程序收據交付。只盤點本workspace outputs；無實際老舊合格候選不刪，保留草稿、媒體、failed QA、v77 alternate及partial36／53。rolling goal仍active。

# v0.133.0 分批維護 QA

| 檢查 | 實際結果 |
| --- | --- |
| baseline | 129完整候選整批拒絕，未讀recheck或寫journal；當時沒有batch API |
| 完整測試 | 645 Python／1647 JS／143 syntax／四Skills；新增及集中17 Python |
| 真大型catalog CLI | 132合成Git／tag／ZIP pairs＋1未知partial；129eligible選2、127未選及latest3保持 |
| 舊版復原 | 實際v132來源ZIP的CLI讀新journal，264檔原bytes／mtime完整復原；未知partial／合成草稿保持 |
| token／容量 | 選取與未選身份改變拒絕；full／other batch token拒絕；128／129選取、1024／1025catalog、2MiBjournal與running／unverified邊界 |
| 相容 | 實際v132ZIP還原628／1647；380歷史交付原bytes及27組schemas相同；20基本／27啟庫tools |
| adapters | 完整備份inspection五adapter一致，good-bad-good／200400200；10版export完整record／draft原bytes保持 |
| 生命週期 | managed job PID／creation identity記錄，子程序實際EOF；短命HTTP shutdown／join，合成暫存移除 |

第一份large_batch helper用package_count讀取audit1，而原契約是packages／excluded arrays，造成KeyError；實際exec exit1，尚未開始清理。原腳本及run record保留，新large_batch2只修正QA欄位，重新建立獨立合成fixture並完成清理／復原；未重送同一running工作。所有fixture位於忽略outputs/v133-qa，刪除前核對resolved parent，沒有清理實際使用者封裝。

本輪沒有UI檔案變更，也未新增CUA頁／常駐server。原合成保存庫只讀且hash不變；備份来源仍是QA server canonical bytes，不能當作瀏覽器實際saved download。本輪不聲稱原生UI／完整視覺／screen reader／媒體身份或音畫同步驗收。GitHub CI未設定，指定source封裝測試及實際remote assets另存於release manifest／outputs/v133-qa收據。平台投稿及正式founder未核實狀態保持。


批次維護復原沿輸出journal，在same workspace使用--restore-journal；不能混用selector，現有目的拒絕覆寫。精確source／ZIP／SHA、merge與remote asset見manifest及outputs/v133-qa/source-evidence.json、release-remote-evidence.json。每輪audit只盤點本workspace，strict>7days且latest3外、exact tag及现场Git archivebytes可重建才清理；無候選不刪。保留草稿／媒體／未知及失敗QA、v77 alternate與partial36／53。rolling goal保持active，繼續可重現功能與Agent／直覺性改善。
