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
