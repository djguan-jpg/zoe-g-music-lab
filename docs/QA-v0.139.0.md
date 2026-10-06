# v0.139.0 QA

| 檢查 | 實際結果 |
|---|---|
| 完整回歸 | 688 Python／1708 JS、147語法、四Skills及diff check通過。 |
| 新功能 | 新24 Python：23pass，1真symlink因Windows權限1314 skip；reparse／special skip及不讀output內容有獨立注入測試。 |
| 純政策 | 精確七天／未來時間、zero bytes、分類名稱隱私、top20及數字tie、輸入順序／result隔離、metadata／sum overflow／group／entry／file／dir／depth cap拒絕。 |
| 讀取與CLI | 不存在／空outputs、真實檔案分類、hash／mtime保持、讀stat／scandir失敗無partial、directory替換觀察拒絕、receipt新檔／拒覆寫、互斥控制及原default audit保持。 |
| 相容 | 404歷史ZIP／manifest逐bytes一致，28 input/output schemas不變；產品139、來源38–139，未知140拒絕。 |
| 還原 | v138 ZIP 2653177bytes，SHA 8d97559f72d2d30a7fbea4279a48df265c2c7cf1ca4df5fc0c50cedf694adbbc；664／1708原封裝測試通過，暫存移除。 |
| Agent／草稿 | 五adapter完整比較／備份inspection、good/bad/good與10版原record／draft bytes核對；82合成JSONhash保持。沒有restore或save。 |
| UI／程序 | web沒有diff，本輪未新增browser tab或持久workbench。runtime ephemeral HTTP threads正常shutdown並join，subprocesses實際EOF。 |

實際本機CLI metadata觀察：18970檔、675299511logical bytes、0檔嚴格超七天。獨立stat-only總和一致；報告只讀output metadata，不計算刪除資格。

- release_area：278檔／197411935bytes。
- iteration_area：18462檔／457005924bytes。
- other_area：230檔／20881652bytes。

資料夾名稱／age不是cleanup資格，後續正式release audit另行核對最新三版與可重建來源；沒有以space報告刪除資料。瀏覽器保存檔、完整視覺／screen reader、真媒體實聽及音畫同步、Host安裝與平台正式founder仍未驗證。既有四投稿及六法律／平台收據不變。GitHub CI未配置；本輪交付可證明程式、相容與封裝，不代替權利或平台身份接受。
