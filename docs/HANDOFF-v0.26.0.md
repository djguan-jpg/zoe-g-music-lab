# v0.26.0 本輪交接

2026-10-04 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）。前輪docs/HANDOFF-v0.25.0.md。

## 改變與分層

修正只比對標題、可接受同名其他需求，以及合法空白歌名不能建立。Python design只將歌曲標題改用清理後brief，不改原請求／時間算法。planning-source純來源／JSON核對、planning-review checkedResult／checkedBrief與app呈現分層，建立與Agent需求檔回讀共用。全部需求及主要JSON核對後才更新，保留預覽／明確載入／限定撤回、最新token與目標編修保護。

原始型別、文字、陣列順序、時長及影格保持；物件鍵順序／JSON排版可不同。JSON8MiB嚴格解碼；源推導music先核對毫秒精度，再與未捨入值半毫秒界內核對，不替Python猜tie。文字與數字空白分開、母題提示維持輸入順序。CSV／Markdown沒有瀏覽器逐字重算，真下載本輪另驗證。新來源提示編修後明示上一份需求；sourceChecked不進持久草稿／wire。

產品0.26.0；Agent1／MCP2025-11-25／draft3／library1／backup1／兩seed1／lyrics_package1／lyrics_review1／audio_loudness1／storyboard_frames1保持，七預設／啟庫十二tools。無依賴／模型／媒體生成。詳見docs/PLANNING-SOURCE.md。

## 證據與還原

239Python／321JS／四Skill／23JS語法及diff、5新Python／16新JS、60跨語言與28真IAB通過。真正CLI／HTTP／JSON-lines／MCP、九檔下載與真draft3、400回復／晚500／成功、原生音檔保留／390px Enter。完整說明QA-v0.26.0.md，本輪outputs/v26-qa保留實檔及收據。

codex/iteration-v0.26.0自main54a256b867dc914a8d88e7792d8ac27072cc9e38開始；restore-v0.25.0-before-v0.26.0指起點。前版v0.25 ZIP571003bytes／SHAd86324e1d1b0d53fa8aa3ab5988a50702bc1756decf38623eb9cfdf1c80c5be7解壓234／305通過，暫存移除。指定commit封裝／manifest、privatePR合併／Release與遠端bytes依本輪收據。

先保存未提交編修，再git switch -c codex/restore-v0.25.0 restore-v0.25.0-before-v0.26.0，或git archive至新目錄；main以revert／PR還原，不reset／強推。使用者草稿／備份／素材另行保護，Git restore tag不保護這些資料。

## 未完成與資源

正式歌曲實唱／實聽、完整視覺與成片、特定AgentHost、其他OS／browser與FreeTWAI投稿／創始人核實仍待。file:原生離線限制保持，未繞過或嘗試。平台狀態not_submitted，滾動目標active。

法律／署名四檔保持PolyForm Noncommercial1.0.0／private／ZOE. G，不授AGPL／商用；沒有production或auth變更。不參考其他本機／Git／記憶／vault，只用本工作區及通用工具。

managed服務正常shutdown，owned35–38tabs關閉、尺寸override清除。只查確定本輪PID／8875與本專案outputs，最新三封裝SHA核對。超七天且Git／已驗遠端可重建才列清理候選；草稿／備份／原始媒體不清理。最終程序／埠／封裝／刪除數見outputs/v26-qa/inventory-final.json。
