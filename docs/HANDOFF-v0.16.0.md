# v0.16.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪保存於 docs/HANDOFF-v0.15.0.md。

## 還原與 Git

分支 codex/iteration-v0.16.0，自 main af48dc1814fc0460c7e091949d3698a4094efb32 開始；restore-v0.15.0-before-v0.16.0 指向該起點。前版v0.15 ZIP354392 bytes、SHA256 bba16c9ae6138485ca240a514ffed4f67162be86ba082b5aa2b01192a7be78cc，安全entries／CRC／解壓原版146 Python／121 JavaScript通過。

指定commitZIP驗收後以private PR合併並建立v0.16.0 tag／Release，source／tree／封裝SHA／真正遠端下載以manifest及outputs/v16-qa/release-remote-evidence.json為準。先保存未提交改動，再 `git switch -c codex/restore-v0.15.0 restore-v0.15.0-before-v0.16.0` 或git archive到新目錄；main回寫用revert／PR，不reset／強推。Git與資料還原分開，草稿／備份／媒體不隨版本回退覆寫或遷移。

## 分層與修正

原版IAB重現：需求先預覽、歌名改為v16-預覽後編修應保留、按載入，變回樓梯間的回聲；現代草稿選檔即替換且清除音檔。v0.16三種入口（需求檔、草稿檔、保存版本）共用web/replacement-preview.js，純begin／check／accept／proposal／cancel。不做檔案／HTTP／DOM；scope限定music或storyboard，null為全部panels。內容指紋重用draft-undo；tab／saved_at／鍵序不視為編修，payload／proposal複製。

完整替換另核對原生File身份，兩個音檔控制項即使選同名同metadata新File仍阻止被清除；限定需求忽略其他panels／媒體。原生File只在此頁比較參照，不進JSON／草稿／Git／Agent。planning-import與draft-library transport注入同一preview；讀取前snapshot用於晚成功／錯誤與套用核對，目標改動保留內容並提示重新預覽，舊token不回復暫態。

app保持三個獨立preview；跨入口明確取消，DOM只呈現與執行確認操作。現代草稿改成先顯示檔名／標題／列數／完整待載入內容，再明確載入或取消；legacy仍需明確轉換，未知版本拒絕。UTF8 BOM、.json、副檔名／1byte–1MiB界限、讀取狀態保持原檔。正常預覽採中性色與有界textarea，標題純文字。套用仍用既有限定／整份undo，後續編修阻止撤回；全草稿載入清除音檔需重選，限定載入保持。修正載入後鍵盤焦點落到BODY，改到已載入工作台的導覽button；起稿的shot-jump焦點保留。

產品0.16.0，Agent1／MCP2025-11-25／draft3／seed1／library1／backup1不變；預設五工具／啟庫十工具、四個原創專案保留。沒有新後端寫入權限／模型呼叫／依賴／host或全域設定。LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保持，PolyForm Noncommercial 1.0.0不另授AGPL／商用；ZOE. G與Codex協作如實記錄。Repo private；FreeTWAI未投稿／未核實創始人，滾動目標active。

## 驗證與限制

146 Python／146 JavaScript、四Skill／十三JS語法／diff通過。新增25 JS測試包含作用範圍／全panels／File身份／payload複製、晚成功／錯誤／取消／新選擇，真實brief／library adapter及actual app draft handler VM、modern／legacy／BOM／未知版；真實HTTP新asset bytes核對。指定提交封裝另跑全套與Agent／MCP metadata。

真正JSON-lines v1 draft_save保存本輪合成草稿到明確QA庫，HTTP工作台看到同ID／名稱並預覽／guard／載入／撤回。IAB覆蓋歌名重現→拒絕、限定需求保留校時草稿及synthetic.wav、現代草稿只預覽／取消、同名音檔重選拒絕、保存版後續校時編修拒絕、legacy2編修拒絕與明確轉換、BOM／未知版、4秒晚成功／500保留新歌名、分鏡需求編修拒絕。

實際草稿下載7293 bytes、SHA256 4ed1bfc97552cd1ea31ce8d8ed6fd851ea1802b6c11c5c3a80a43eefe6cbfd95，draft3／tool0.16.0與Agent panels一致、輸入SHA保持，真實讀回先保留目前歌名再明確載入9鏡。390×844 documentWidth375、preview343px／textarea309×169px無橫溢出，Enter／focus BUTTON data-tab storyboard，console error／warn空。見docs/QA-v0.16.0.md。

未做截圖／完整視覺評審、其他OS／瀏覽器、正式作品／實聽／音畫、ASR／LUFS／true peak／媒體生成或特定Agent host。File身份是目前頁面來源核對，不證明外部磁碟原子快照；替換保護不自動合併構思。只讀本次新工作區與通用指引，不參考其他使用者專案／記憶／GitHub。

## 產物與程序

outputs/v16-qa含合成原檔、真正Agent保存QA庫、真正下載、檢查／程序／封裝與遠端收據，不進Git。使用者草稿／備份／媒體不是Git可重建清除候選。保留最新三封裝v16／v15／v14，更舊未滿七天仍保留；僅超過七天且tag／已驗遠端可重建的本專案產物列候選，本輪沒有符合條件的刪除。

基線HTTP exec99545／PID291320、新版exec16556／PID299772都QA stop正常exit0／server_closed；tab18關閉／viewport reset。8875監聽與確認PID結束、封裝／發布終態與最後outputs盤點另記inventory-final收據；僅處理本輪確認程序，沒有持久服務／worker／監控。
