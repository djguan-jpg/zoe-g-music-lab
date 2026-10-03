# v0.13.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接保存在 docs/HANDOFF-v0.12.0.md。

## 還原與 Git

- 分支 codex/iteration-v0.13.0；起點 4f5de6f63c784bb08b76a3718d6826b64a189df4。
- restore-v0.12.0-before-v0.13.0 指向起點。前版 v0.12 ZIP 294717 bytes、SHA-256 3e2bf72a6282c6a8a42a1bacd03a38ef6d8f77c6ada82a72e39e480ec387ebc0；核對／解壓原版124 Python／80 JavaScript通過。
- 本輪指定提交ZIP解壓驗收後 private PR合併，建立v0.13.0 tag／Release ZIP／manifest；精確commit／摘要／合併／遠端bytes以manifest與實際收據為準。

先保存未提交內容；用 git switch -c codex/restore-v0.12.0 restore-v0.12.0-before-v0.13.0，或 git archive 至新目錄。回寫main用revert／PR保留歷史。Git tag只保護程式，草稿／備份／素材另存，不隨回退覆寫或遷移。draft3／library1／backup1保持。

## 分層與功能

web/planning-review.js 是純回應模型與注入request／isCurrent／onResult的接收邊界，驗證modern歌曲／分鏡回應所需資料、時間範圍、母題／shot對應、提醒metadata與成果檔；複製本次需求，過期成功在驗證／寫入前捨棄，標題亦核對本次來源。不是新的領域計算或生成器。

app.js 共用run管理busy／編修版本及目前錯誤，過期錯誤不顯示，finally恢復控制；模型接收後才render／setFiles。DOM renderer只呈現已驗證模型，自由文字用textContent，能量值先驗證才進style／ARIA meter。dirty保留上一份設計與停用下載，不把舊摘要當新需求。歌曲可收合時間／小節／能量／任務；分鏡逐鏡提醒與母題使用位置。

短桌面sticky output限制至100dvh減48px並局部overflow，tabindex讓鍵盤可捲動；窄螢幕static流保持。124／93測試、實際DOM／滑鼠／鍵盤／下載驗證。領域／結果schema／草稿無修改，產品0.13.0與Agent1／MCP2025-11-25／draft3／library1／backup1分開，預設四／啟庫九工具保持。

## 驗證與限制

124 Python／93 JavaScript／四Skill／十JS語法／diff通過。新增13JS用真正Python application結果驗模型、來源保留、異常／矛盾回應、晚成功、共用run四工作台過期錯誤／目前錯誤／再試／重入。真正CLI不同cwd四／五檔bytes、HTTP、JSON-lines壞後好、MCP握手／discovery／call與application一致；指定提交封裝再跑全套、Agent metadata／MCP。

IAB實際歌曲／分鏡基線→修正後晚成功／錯誤、現在domain錯誤保留／修正、設計／上一份狀態、歌曲小節／能量、分鏡提醒、文字安全、實檔JSON、1280×720成果面板802px→672px與滑鼠下載、鍵盤PageDown／details、390px兩摘要幾何通過。詳見docs/QA-v0.13.0.md。

完整視覺／跨瀏覽器／其他OS、正式作品實唱實聽／畫面、ASR／LUFS／true peak／媒體生成、實際Agent host仍未驗證。沒有新依賴／模型／host／全域設定、秘密或其他使用者專案參考。ZOE. G／Codex紀錄、LICENSE／NOTICE與PolyForm Noncommercial1.0.0保留。Repo private；FreeTWAI公開決策未確認，未投稿或取得創始人核實。滾動目標保持active。

## 產物與程序

outputs/v13-qa只有本輪合成資料、基線、helper、真正下載／摘要、checks／還原／程序／遠端證據，不進Git。草稿／備份／素材不是Git可重建產物，不列封裝清理；重要資料另存可靠位置。

最新三版v0.13／v0.12／v0.11保留，更舊未滿七天也保留。盤點只限本工作區outputs及本輪確認程序；過七天且tag／已驗證遠端可重建才列候選，不清理其他專案或未確認程序。

基線HTTP exec62353（PID290380）正常QA stop後才啟動新版helper，以載入新增asset，並非逾時重送；新版exec79732（PID294580）QA stop正常停止，兩者exit0／server_closed，8875監聽0，tab15關閉，viewport reset。沒有持久服務／背景worker／監控，不宣稱整台機器程序都已清理。
