# v0.28.0 本輪交接

2026-10-04 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）；前輪docs/HANDOFF-v0.27.0.md。

## 改變與分層

基線新增鏡頭建立時，planningBrief先拋泛用母題錯誤，焦點停在建立。新分鏡創作待辦純必填／引用模型及注入快照controller；DOM只呈現、標示及定位，建立先檢查並定位第一項。留白、母題不完整／重複／失效引用、方向選項可查，change_reason保持optional，不補寫或改原時間／FPS／創作／媒體。

全部1000鏡／30母題與8MiB嚴格來源、200明細／前20UI；局部filled不是完整資料接受。定位前重查原始分鏡快照，修改後停舊位置，載入或撤回載入清暫態，其他工作台保持。原時間／影格／連戲與sourceChecked仍由既有完整建立驗證。詳見docs/STORYBOARD-READINESS.md。

產品0.28；Agent1／MCP2025-11-25／draft3及領域schema、七／十二工具保持，沒有新增operation／依賴／模型／路徑權限。真Agent17鏡時間起稿先預覽再套用，102待辦留白保持，可限定撤回；待辦與focus不進草稿、成果或wire。

## 驗證與還原

244Python／353JS／四Skill／25JS語法及diff通過；3新Python／17新JS，59真Node／Python、27IAB、五native成果與draft、四adapter／Agent起稿、390px Enter、原生合成音檔與晚回應保護。只有DOM幾何，未完整視覺或正式實聽。fixture及觀察逾時處理見QA-v0.28.0.md。

branch codex/iteration-v0.28.0；restore-v0.27.0-before-v0.28.0指main起點179be4f214da86c1ae220b1935d8f249b83a0eca。前版v0.27 ZIP609664bytes／SHAa63f7b650852f593e0e72d430e29491420f75dc248b134fed0e33282f276407e，解壓241／336通過，暫存已移除。本版精確commit封裝／manifest、privatePR合併／Release與遠端bytes依outputs/v28-qa收據。

先保存未提交編修，再git switch -c codex/restore-v0.27.0 restore-v0.27.0-before-v0.28.0，或git archive至新目錄；main以revert／PR還原，不reset或強推。Git不能重建使用者草稿／備份／素材，另行保存。

## 未完成及維護

正式媒體實聽／成片、完整視覺、特定AgentHost、其他OS／browser、原生file播放及FreeTWAI投稿／創始資格仍待；舊file政策阻擋未嘗試或繞過，rolling active。

PolyForm Noncommercial1.0.0／private／ZOE. G法律署名四檔保持，無AGPL／商用許可或production／auth改動。只讀本工作區及通用工具，未參考其他本機／Git／記憶／vault。

owned42／43／44tabs關閉、尺寸override清除，三個managed QA服務正常shutdown。每輪只查確定PID／8875及本專案outputs，核對最新三版SHA；過七天且Git／已驗遠端可重建才列清除候選。草稿、備份與原素材不清理，最終程序／埠／封裝／刪除數見outputs/v28-qa/inventory-final.json。
