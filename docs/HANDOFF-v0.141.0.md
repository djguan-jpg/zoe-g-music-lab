# v0.141.0 交接與可逆

restore-v0.140.0-before-v0.141.0 固定 706058b23fe27473d908dbc7698a9dac771f9bac；分支 codex/iteration-v0.141.0。從tag另建codex/restore-*經PR還原，不rewrite公開tag、不覆寫草稿／媒體、不撤銷投稿。

## v0.141.0 草稿比較閱讀進度

草稿檔與保存庫的差異比較，在換頁、篩選後保留展開位置，新增「展開本頁差異／收合本頁差異」。draft-compare-view 純有界序號模型 → 原 current source controller → DOM listener／焦點 adapter；最多200保留明細、每頁10筆，新比較／busy／stale／clear／dispose 清除暫態。舊 detached toggle callback 拒絕，原文、草稿、媒體與成果保持，展開不代表審閱接受。

704 Python／1734 JS、148語法、四Skills通過；新增26 JS、集中66 JS／4 Python。兩個原生入口、28 snapshots 原21欄／六列集合含ID及四份完整成果保持；三尺寸共六次鍵盤觀察，無頁面橫溢且收合焦點可達。下載click有觸發，但5秒observer未取得保存檔；完整視覺與實際落地檔仍未驗證。自有server正常返回、兩個查驗tab關閉、viewport復原。

412歷史ZIP／manifest bytes、28 input-output schemas、五adapter比較／備份與10版record／draft匯出保持，82合成JSONhash相同；指定v140 ZIP實際還原704／1708。產品141／來源38–141共104版、未知142拒絕，21基本／啟庫28工具及Agent1／draft3／comparison1保持。PolyForm Noncommercial1.0.0、public與四份submitted_unverified保持；本次live登入與四投稿已核對，平台明示作者未核實。還原tag、codex分支、CHANGELOG／HANDOFF及exact-source ZIP／SHA可逆，rolling goal active。

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

指定source commit／tree、ZIP／SHA、PR與remote asset bytes見manifest及outputs/v141-qa/source-evidence.json、release-remote-evidence.json、goal-turn.json。managed jobs須same-host typed身份及原handle EOF，不能只信狀態檔；無外部程序signal。rolling goal active，後續只延續本新工作區的可重現功能／Agent缺口；保留真媒體／平台作者接受gate。

封裝補充：首份指定source的外層與Python runner同為120秒，外層timeout後Windows暫存目錄仍被使用，未發成功manifest。保留失敗ZIP與receipt；只移除核對的自有空暫存目錄，未signal外部程序。外層封裝改150秒，runner仍120秒／兩worker，留出正常收集與清理時間；重新從新提交封裝並核對，原失敗不宣稱成功。
