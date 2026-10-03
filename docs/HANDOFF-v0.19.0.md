# v0.19.0 本輪交接

2026-10-03 · ZOE. G發起 · djguan-jpg/zoe-g-music-lab（private）。前輪保存於docs/HANDOFF-v0.18.0.md。

## 還原與封裝

分支codex/iteration-v0.19.0自main e051042b36e744830c1e0940cbf6529c4aa52c01開始；restore-v0.18.0-before-v0.19.0指向起點。前版v0.18 ZIP411169bytes／SHA058127e3574ccceb2f78905a7ffb31ae2524a5d28fc4e5b45d3e2d9b707c956b，safe entries／CRC／解壓156Python／189JS通過。

本版指定commit封裝後private PR合併、v0.19.0 tag／Release；source／tree／ZIP SHA與真正遠端下載以manifest及outputs/v19-qa/release-remote-evidence.json為準。先保存未提交變更，再git switch -c codex/restore-v0.18.0 restore-v0.18.0-before-v0.19.0，或git archive到新目錄。main回寫用revert／PR，不reset／強推。程式與使用者草稿／備份／媒體分開，不覆寫或自動遷移資料。

## 功能與分層

基線application與真CLI完整包回讀丟title／10秒總長，未知schema仍抽cues接受。lyrics_package純decode／validate／files／review、application互斥cues／content／package及CLI有界讀取；lyrics-package.js同源JSON掃描／validate／legacy／revise／notice供工作台與offlineHTML。重複鍵含跳脫同名、非有限數字、未知／extra／精度／矛盾來源拒絕，不靜默修正。

完整包保持title、duration、句尾／推估／shift／review_notes。未改cue下載不重算來源，確認音檔total仍提示曾補句尾，人工編修加實聽說明。provided時長衝突拒絕、空白才接續；estimated不填。legacy明確按轉換或CLI --legacy-json／Agent allow_legacy，不改原檔。普通cue JSON與字幕仍使用目前表單生成。

lyrics-import沿用選檔前target snapshot／latest序列／讀取與HTTP後核對，回應metadata與JSON成果一致；app管理DOM／apply／限定undo。canonical來源存在draft3既有lyrics-source，沒有新持久欄位／音檔嵌入／模型／網路呼叫。

產品0.19.0、lyrics_package schema1；Agent1／MCP2025-11-25／draft3／兩seed1／library1／backup1與六／十一工具保持。LICENSE／NOTICE／LICENSING／FOUNDER-RECORD Git blobs保持，PolyForm Noncommercial1.0.0不另授AGPL或商用。Repo private；ZOE. G／djguan-jpg及Codex協作照實，FreeTWAI未投稿或核實創始人。

## 驗證與限制

168Python／206JS、四Skill／十七JS語法與diff通過；真正四adapter、另一cwd／BOM／覆寫拒絕、JSON-lines壞後好及MCP握手／call／EOF。26項IAB含preview／cancel／apply／undo、同一音檔、時長衝突／未知schema、兩筆4秒晚成功／500、新提示／重複欄位、實檔JSON／draft3回讀與390px／Enter。七份原生下載與SHA見downloads-evidence，詳見docs/QA-v0.19.0.md。

offline Blob事件超時但精確已知檔名／時間／bytes核實，沒有重送；JSON語義與CLI一致，Windows CRLF不宣稱和Python LF原bytes相同。browser viewport未改桌面1280，tab23 CDP實際390×844檢查，override已清除。沒有截圖／完整視覺、正式作品實聽、其他OS、ASR／生成媒體或特定Host證據。

backup競爭測試初次暫態.write-lock bytes不穩，僅排除此協調檔，完整版本／manifest／重用／資料一致性保持，生產鎖未改。精確封裝另跑全套與Agent／MCPmetadata。滾動目標active；正式作品、完整視覺、使用者Host選擇與FreeTWAI投稿仍待完成。

## 產物與程序

outputs/v19-qa記錄合成來源、真正下載、測試／還原／封裝／發布／遠端收據，不進Git。草稿／備份／原始媒體不是Git可重建候選。最新三封裝v19／v18／v17保留，更舊未滿七天也保留；無符合條件的刪除／0。

QA HTTP exec76753／PID303484經qa-stop正常exit0／server_closed；tab21/22/23關閉，viewport與CDP清除。只處理本輪已確認PID／process ID，沒有持久服務或監控；封裝／發布終態、8875與outputs完整盤點在inventory-final。只讀本次新工作區及通用指引，不參考其他使用者專案／記憶／GitHub。
