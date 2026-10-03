# v0.27.0 驗證紀錄

2026-10-04 · 本機Windows／Python標準庫／原生JavaScript · synthetic only。

## 可重現問題

基線main a367b9e027d75428ebb4d1f2cf871a3dd8f730a6。IAB39：原四鏡0–24秒，明確把總長設60，新增第五鏡後總長變30；焦點到第五鏡母題。修正後IAB40總長仍60，另顯示30秒／720幀候選。新增及刪除均保留宣告；原時間收合與還原保持。新純proposal／compare／controller與DOM分層，使用既有影格驗證，明確接續／限定撤回。

## 自動與產物驗證

241Python／336JS、四Skill／24JS語法及diff通過。新2Python與15JS：實際app新增／刪除handler、來源／實際after保護、相同快照及隔離副本、1000鏡上限、非法數字／空白／秒數與影格衝突、半幀取偶數／fractional FPS、原小數秒不捨入、限定撤回、晚來源與回復。

60組真Node採用／撤回與Python完整分鏡交叉核對，六種FPS／十種小數秒偏移，原請求不變。真CLI／HTTP／JSON-lines／MCP在錯誤60秒宣告後接受明確24秒版本，再拒絕撤回的錯誤宣告後正常回復；同五成果，CLI拒絕覆寫，原JSON SHA保持。HTTP實際資產與defer順序核對、服務正常shutdown。

初始fixture將8FPS的0.0625秒當有效首鏡；取偶數應為0幀，正確拒絕，改用可見的0.1875秒，零幀拒絕仍測。收合結果是字串12，改正型別斷言。CLI fixture誤用--input、Agent誤用整數id，依實際--brief及Agent v1字串id修正；沒有放寬生產契約。

## 真實操作與下載

25項IAB：新增／刪除／還原保留60秒、明確接續與限定撤回、後續畫面及同一6秒合成音檔保持、原空白還原、總長／FPS／時間／列來源變更保護、未填或影格衝突拒絕、回復後正常建立、五個native下載、真四秒慢回應期間控制停用及編修後丟棄、真正CLI需求回讀預覽／明確載入／限定撤回清除暫態、390px Enter、29.97FPS與24.0004秒完整建立及真draft3下載。第25項由定稿程式重新完成新增／刪除／Enter接續／限定撤回，console仍空。

五個下載raw bytes與SHA另記；全文與當時實際UI請求的application／CLI／Agent／MCP比較，CRLF↔LF正規化與raw bytes分開。MCP七tools。真draft0.27／schema3保留24.0004原總長及鏡尾／29.97FPS／後續畫面，不含controller／撤回／candidate／音檔blob與檔名。

| 頁面檢查 | 結果 |
| --- | --- |
| URL／title | 127.0.0.1:8875與ZOE. G工作台符合 |
| meaningful DOM／framework overlay | 有創作內容；無overlay |
| console error／warn | 空 |
| 鍵盤及操作 | 25項通過 |
| 390×844 override | client寬375；面板left16／right359，兩按鈕right165／269，均在範圍內 |
| screenshot／完整視覺 | 未取得；只有DOM幾何，依使用者媒體規則不嵌入影像 |

使用frontend-testing-debugging的目標流程與檢查，專用Browser skill未列出，透過現有Cua IAB驗證；沒有另安裝Playwright。IAB39／40／41關閉，尺寸override清除。原生file:既有政策阻擋維持，未嘗試或繞過。

## 還原與維護

前版v0.26 ZIP592135bytes／SHA638602ac270e81edfbd25ed515bf7ae51ea8b22ebe2057e18ee17ac3c14a69ef，解壓239Python／321JS通過，v26-check暫存確認在本輪QA根下且已移除。restore-v0.26.0-before-v0.27.0保留起點。

本版指定commit ZIP／manifest、privatePR／Release／遠端實際下載及Git refs核對見outputs/v27-qa收據。只盤點本專案outputs與確定本輪PID，最新三版SHA、過七天資格及刪除數見inventory-final。素材／使用者草稿／備份不清理。

正式實聽／完整視覺與成片、指定AgentHost、其他OS／browser、原生file播放及FreeTWAI投稿／創始資格仍未完成。PolyForm Noncommercial1.0.0／private／ZOE. G與各schema保持，沒有依賴／模型／production或auth變更；滾動目標active。
