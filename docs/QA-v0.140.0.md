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
