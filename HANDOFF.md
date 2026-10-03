# v0.14.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接保存於 docs/HANDOFF-v0.13.0.md。

## 還原與 Git

分支 codex/iteration-v0.14.0，自 main c955a581c05c3754f59126e53e0bd1210ee4dd98 開始；restore-v0.13.0-before-v0.14.0 指向該起點。v0.13 ZIP 311807 bytes、SHA-256 2d5d261f046bd003a689ab6341f6b5fac92c2f872b59fd02ea5c6a6a3deaa3fb，核對／解壓原版124 Python／93 JavaScript通過。

指定提交ZIP解壓驗收後以private PR合併並建立v0.14.0 tag／Release，精確source commit／tree／ZIP SHA／遠端下載以manifest與outputs/v14-qa/release-remote-evidence.json為準。原始碼Git還原與資料還原分開；先保存未提交改動，以 `git switch -c codex/restore-v0.13.0 restore-v0.13.0-before-v0.14.0` 或 git archive至新目錄還原。回寫main用revert／PR，不reset／強推。tag不保護使用者草稿、備份或素材，另存可靠位置，不隨版本回退覆寫／遷移。

## 分層與行為

musiclab/storyboard_seed.py 重用 music_plan_bundle，按整小節與段落邊界產生slots；不推測畫面，時間假設／來源任務保留，schema1／timing_seed_incomplete／needs_review=true。max1000鏡與至少一影格先拒絕。application／CLI／HTTP／JSON-lines／MCP共用，預設五工具／啟庫十工具，四個原創專案保留。

web/storyboard-seed.js核對結果／來源／影格／小節／JSON實檔，latest token／music與storyboard及設定指紋保護晚成功／錯誤；明確proposal再次核對。app只套用分鏡片名／時長／FPS／全shots，保留原視覺基調／人物／母題清單和其他panel／音檔；新鏡頭creative留空，方向預設中性，收合並定位第一鏡。預覽取消不更改表單，源／目標／設定有改動須重預覽。中間seed JSON不能當mv-brief載入。

web/draft-undo.js複製before／實際after，限定載入只核對該panel，全草稿核對全部panels；後續編修拒絕整份撤回，保留目前內容與record。app成功渲染才清除撤回record；tab／timestamp不是內容變更。整份草稿載入／撤回仍需重選音檔，局部套用保留音檔。

產品0.14.0／seed1新增，Agent1／MCP2025-11-25／draft3／library1／backup1保持；無默默遷移／新依賴／模型呼叫／host或全域設定。LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保留，ZOE. G／Codex如實記錄；Repo private，FreeTWAI未投稿／未取得創始人核實，滾動目標active。

## 驗證與限制

136 Python／109 JavaScript、四Skill／十二JS語法及diff通過。新測試覆蓋真實歌曲136秒／17鏡、部分小節／重複段名／小數速度／非有限值／1000上限／不足影格、來源不變、CLI不同cwd兩檔UTF8 bytes／不可覆寫、HTTP與application、JSON-lines壞後好、五工具MCP實際呼叫、純前端／跨語言draft3往返、晚回應與限定／整份undo核對。精確commitZIP再跑全套與Agent／MCP metadata。

IAB實際重現v13撤回覆蓋歌名→v14拒絕保留；正常起稿／空白母題阻止完成／未編修撤回恢復4鏡24秒／編修畫面拒絕撤回、過期套用拒絕、invalid bars拒絕、晚成功／500保留，JSON及草稿實檔下載／往返、校時音檔與名稱保留、全草稿音訊條件改動阻止撤回、390×844 body375／375與起稿343px／預覽301／301、Enter套用／focus shot-jump、console error／warn空。HTML form實檔使用CRLF，與application內容逐字核對時明確正規化換行並另核對JSON，不虛稱byte相同。見docs/QA-v0.14.0.md。

未完成完整視覺、跨瀏覽器／其他OS、正式作品／實唱實聽／音畫、ASR／LUFS／true peak／媒體生成或特定Agent host。只有本工作區合成資料與通用工具，未參考其他使用者專案／記憶／GitHub。

## 產物與程序

outputs/v14-qa為合成測試／基線／真正下載／helpers／檢查／程序與遠端收據，不進Git。草稿／備份／媒體不是可由Git重建的清理候選。封裝保留最新三版v14／v13／v12；更舊未滿七天亦保留，超過七天且tag／已驗遠端能重建才列候選，本輪沒有符合條件的刪除。

基線HTTP exec9667／PID295500、最新版exec94198／PID262136均QA stop正常exit0／server_closed；8875監聽0，IAB tab16關閉，viewport reset。只處理本輪確認程序，不宣稱整台機器都已清理；沒有持久服務／worker／監控。封裝／發布程序結束與最終outputs盤點另記收據。
