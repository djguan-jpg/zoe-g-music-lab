# v0.141.0 QA

| 項目 | 實際證據與範圍 |
|---|---|
| 重現 | 原v140兩個入口，manual展開→換頁→返回即關閉；prechange-evidence兩項均重現。 |
| 完整測試 | 704 Python、1734 JS、148 syntax、四Skills；155個check commands全exit0。既有Windows真symlink權限1314 skip保持。 |
| 集中 | 66 JS／4 Python，其中26新增JS：bounds／隔離、page／scope、bulk焦點／一次source讀取、late detached toggle、新report／busy／stale／clear／dispose、empty／truncated、原下載bytes保持。 |
| 原生 | 两入口28 snapshots，21欄及六列集合含ID、原成果逐值相同；四份完整output files逐字相同、82合成庫JSON SHA保持。 |
| 三尺寸 | 六組實際Enter展開／收合，焦點在可用控制、element hit、page無橫溢，六JPEG hash保存於QA，不冒充完整圖片視覺驗收。 |
| 還原 | v140指定ZIP 2692306bytes／SHA d38a3b5f4862d4fc47e5512610d684e06e90020cb5f8e7734821f20cbae028d6；CRC／source核對、實際704 Python／1708 JS、原launcher不變、暫存移除。 |
| 相容 | 四scope×103歷史producer＝412個ZIP／manifest bytes相同；28 input-output schemas完整相同，來源38–141共104，未知142拒絕。 |
| Agent／資料 | application／CLI／Agent／MCP／ephemeral HTTP完整比較及backup inspect相同、good/bad/good；10版本匯出原record／draft bytes相同，ZIP時間不同不宣稱整包bytes相同；82合成JSON保持、CLI拒覆寫。 |
| 清理 | 自有native server context正常關閉、deadline thread join、原handle EOF0；一QA與一platform查驗tab關閉、viewport reset，用戶原登入tab保留。 |

集中helper原先用不可匯入的tests.test_draft_compare_browser命令，JS66已通過而Python import失敗；改用unittest discover後四項通過，原失敗receipt保留。最初三個FakeDOM缺新固定control、兩個新test誤假設byte-limited明細必有200，測試夾具與期待已按真實契約修正；未用修測試掩蓋product邏輯失敗。

CLI metadata snapshot 19598檔／688481144logical bytes，超七天0檔；獨立stat-only總和一致，exclusive receipt拒覆寫。space不評估刪除資格；發佈後另執行完整release audit。最新三版141／140／139、未知v77 alternate及partial36／53、草稿／媒體／failed QA保留，不能依版本號刪除。

本次live核對四份投稿PUBLIC頁、ZOE. G／djguan-jpg、PolyForm Noncommercial 1.0.0與已登入。平台明示作者自行聲明未核實，收錄不代表官方採用；自動license欄NOASSERTION不當成另授權。六法律／平台收據保持，未重送投稿。

未驗證：browser真正保存檔（observer 5000ms timeout）、完整視覺／screen reader、真媒體實聽／音畫同步、Host安裝、平台正式founder。GitHub CI未配置。原生幾何／焦點、source測試與remote ZIP核對分開記錄，不互相替代。
