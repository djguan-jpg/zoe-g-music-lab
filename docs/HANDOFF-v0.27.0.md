# v0.27.0 本輪交接

2026-10-04 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）；前輪docs/HANDOFF-v0.26.0.md。

## 改變與分層

真IAB重現60秒作品宣告在新增鏡頭後被改30秒。新增／刪除保留宣告；刪除仍收合有效剩餘時間並可還原。新增「作品總長與鏡尾」比較、明確採用／限定撤回。storyboard-duration純proposal／compare／注入controller，重用storyboard-frames；app只讀原始欄位／列ID、呈現、限定寫入及dirty。

全時間與影格覆蓋通過才提供候選；保留原始秒數與FPS，不猜時長、不改創作。採用前核對同一顯示來源；撤回核對原始時間／列身份／順序／數量／FPS與實際after，只還原總長，後續畫面與音檔保留。回到完全相同狀態可再撤回。範例／完整草稿／限定分鏡載入清除暫態。刪除還原與總長撤回分開，重新完整建立驗證仍必要。詳見docs/STORYBOARD-DURATION.md。

產品0.27；Agent1／MCP2025-11-25／draft3及領域schema保持，七／十二工具，沒有新增operation／依賴／模型。Agent或CLI仍須明確提供總長；原錯誤宣告拒絕，不由application自動覆蓋。暫態／媒體不進草稿或wire。

## 驗證與還原

241Python／336JS／四Skill／24JS語法及diff通過；2新Python／15新JS、60真Node↔Python與25真IAB，四adapter／五檔native下載、真draft3、原生合成音檔保留／390px Enter、晚回應／回讀載入與撤回。只有DOM幾何，沒有完整視覺或正式實聽；fixture修正詳見QA-v0.27.0.md。

branch codex/iteration-v0.27.0；restore-v0.26.0-before-v0.27.0指main起點a367b9e027d75428ebb4d1f2cf871a3dd8f730a6。前版v0.26 ZIP592135bytes／SHA638602ac270e81edfbd25ed515bf7ae51ea8b22ebe2057e18ee17ac3c14a69ef解壓239／321通過，暫存移除。本版指定commit封裝／manifest、privatePR合併／Release及遠端bytes依outputs/v27-qa收據。

先保存未提交編修，再git switch -c codex/restore-v0.26.0 restore-v0.26.0-before-v0.27.0，或git archive至新目錄；main以revert／PR還原，不reset或強推。Git還原點不保護草稿／備份／素材，這些資料另行保存。

## 未完成與資源

FreeTWAI未投稿／未核實創始資格；正式媒體實聽／成片與完整視覺、特定AgentHost、其他OS／browser、原生file播放仍待。舊file政策阻擋維持，沒有嘗試或繞過。rolling goal active。

PolyForm Noncommercial1.0.0／private／ZOE. G法律署名四檔保持；沒有AGPL／商用許可、production／auth改動。只讀本工作區及通用工具，未參考其他本機／Git／記憶／vault。

owned39／40／41tabs關閉、尺寸override清除，managed QA服務正常shutdown。只查確定PID／8875與本專案outputs；核對最新三封裝SHA。超七天且Git／已驗遠端可重建才列清除候選，草稿／備份／原媒體不清。最終程序／埠／封裝／刪除數見outputs/v27-qa/inventory-final.json。
