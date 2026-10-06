# v0.139.0 交接與可逆

restore-v0.138.0-before-v0.139.0 固定 4e951e90a06689ff3c2b3bdec197f83fae8023c4；分支 codex/iteration-v0.139.0。從此tag另建codex/restore-*經PR還原；不rewrite公開tag、不覆寫草稿或媒體、不撤銷投稿。

## v0.139.0 唯讀輸出空間報告

維護 CLI 新增 `--space-report`：固定分類封裝區、標準 vN-qa 區與其他區，列出邏輯 bytes、檔案數、嚴格超七天統計及最大的20個 QA 目錄。純 metadata policy → bounded filesystem reader → 既有 CLI／exclusive receipt；報告 space1 獨立，不改 audit1／run1／recovery1。分類及年齡不是刪除資格，既有 tag／Git archive／最新三版／typed job 核對保持；不開 outputs 檔案內容、不輸出未知名稱或私人路徑、不跟隨 link／reparse point。

688 Python／1708 JS、147語法與四Skills通過；新增24 Python中23通過、1真 symlink 因Windows權限1314跳過，另有注入reparse／特殊entry測試。CLI實際報告與獨立metadata總和一致，receipt拒覆寫，82合成庫原JSONhash保持。404歷史ZIP bytes、28工具schemas、五adapter比較／備份與10版匯出保持；v138指定ZIP實際還原664／1708且暫存移除。

產品139／唯一交付來源38–139共102版，未知140拒絕；21基本／啟庫28工具、Agent1／draft3不變。沒有新增Agent／HTTP維護操作、依賴、模型或持久服務；本輪web未變，不宣稱新增原生視覺驗收。還原tag、codex分支、CHANGELOG／HANDOFF及指定source ZIP／SHA保留可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持；rolling goal active。

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

指定source commit／tree、ZIP／SHA、PR與實際remote assets見manifest及outputs/v139-qa/source-evidence.json、release-remote-evidence.json、goal-turn.json。所有typed managed jobs依原handle EOF及同host精確identity核對；裸PID不判ownership。最新三版保護，v77 alternate及partial36／53保留。後續繼續本工作區可重現功能與Agent缺口，rolling goal active。
