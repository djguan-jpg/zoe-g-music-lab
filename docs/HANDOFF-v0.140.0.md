# v0.140.0 交接與可逆

restore-v0.139.0-before-v0.140.0 固定 e9d59deece9720a8fad8dac97acdb84065d57756；分支 codex/iteration-v0.140.0。從tag另建codex/restore-*經PR還原；不rewrite公開tag、不覆寫草稿／媒體、不撤銷投稿。

## v0.140.0 明確維護動作與空值

修正空expected-token被忽略及空record-self意外落到一般audit。maintenance_cli純presence／互斥／token／job／批次identity判斷 → argparse保留原path字面、拒絕空path → 原filesystem／process adapter；在workspace／catalog／PID查詢或receipt寫入前拒絕無效控制。validate_job與原run1共用1–80字元grammar，未提供None與已提供空值分開。正常五動作、exact token／default不覆寫／tag重建／latest3／same-host身份保持，沒有新增維護權限。

704 Python／1708 JS、147語法、四Skills通過；新增16 Python全部通過，集中82含原space／prune／restore／catalog回歸。兩個真Windows junction證明descendant跳過、root拒絕及receipt不能穿出root，synthetic target SHA／mtime保持，僅os.rmdir移除核對的自有link。既有真symlink測試仍因權限1314 skip，不把junction當成symlink全覆蓋或atomic sandbox。v139指定ZIP實際CLI兩個空值原exit0，新exit1且無receipt；三empty path exit2；default audit回覆完整相同，正常record-self實際EOF。

408歷史ZIP／manifest bytes、28 input-output schemas、五adapter比較／備份與10版原record／draft匯出保持，82合成JSONhash相同。v139指定ZIP實際還原688／1708且暫存移除。產品140／來源38–140共103版，未知141拒絕；21基本／啟庫28工具、Agent1／draft3／audit1／run1／recovery1／space1保持。本輪web不變，沒有新browser或持久workbench；PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg與四份submitted_unverified保持。還原tag、codex分支、CHANGELOG／HANDOFF與exact-source ZIP／SHA可逆，rolling goal active。

# v0.140.0 QA

| 項目 | 證據與範圍 |
|---|---|
| 完整測試 | 704 Python、1708 JS、147語法、四Skills及diff check通過；新增16全部通過，集中82。原真symlink權限1314 skip保持。 |
| 純政策／CLI | None／empty存在性、五action與mutual exclusion、strict token／job邊界、batch形狀／重複／caps、早於全部reader拒絕、原字面path與正常dispatch參數保持。 |
| 真實上一版重現 | 指定v139 ZIP SHA 41c0750000526401f81888dde9542a8de14bb5450cf5b133512db4b50d61d306、2673432bytes；原兩empty cases exit0，current exit1、無receipt；default audit完整reply相同。三empty paths exit2，正常record-self產生run1且child原handle EOF0。 |
| Windows junction | 兩個真junction case通過：descendant skip／root reject／receipt不能穿出root，target SHA／mtime保持；核對exact owned link後os.rmdir，不刪target。 |
| 還原 | 指定v139 ZIP CRC／SHA核對後實際還原688／1708，原packaged launcher不變，暫存source移除。 |
| 相容 | 408歷史ZIP／manifest bytes相同、28 input/output schemas相同；產品140、來源38–140共103版，未知141拒絕。 |
| Agent／資料 | application／CLI／Agent／MCP／HTTP完整比較與backup inspect、good/bad/good；10版原record／draft匯出核對，82合成JSONhash保持。未restore或save。 |
| UI與服務 | web沒有diff，未新增browser tab或持久workbench；兩個runtime ephemeral HTTP threads正常shutdown／join，subprocesses原handle EOF。 |

本輪CLI metadata snapshot 19228檔／681558585logical bytes，超七天0檔；獨立stat-only總和一致。space報告不評估deletion，正式release audit在發佈後另行核對；不能因版本號較舊就刪除。最新三版、草稿／媒體、未知／failed QA、v77 alternate及partial36／53保留。

基線receipt一處歷史敘述誤沿20個run，本輪startup實際核對19個terminal，另存baseline-corrected-evidence保留原receipt；沒有用文字取代PID／creation身份或原handle EOF證據。

仍未驗證：瀏覽器實際保存檔、完整視覺／screen reader、真媒體實聽／音畫同步、Host安裝與平台正式founder。GitHub CI未配置；六法律／平台收據與四投稿不變。本輪沒有重做前端驗收，沒有把unit／junction結果宣稱成完整sandbox或平台身份接受。

指定source commit／tree、ZIP／SHA、PR及實際remote assets見manifest與outputs/v140-qa/source-evidence.json、release-remote-evidence.json、goal-turn.json。原所有managed handles需EOF並核對same-host typed identity，不能只信狀態檔。既有未完成創作／原生browser／平台身份gates保留，rolling goal active，後續继续本工作區的可重現功能與Agent缺口。
