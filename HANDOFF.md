# v0.17.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪保存於docs/HANDOFF-v0.16.0.md。

## 還原與提交

分支codex/iteration-v0.17.0，自main 7b80d009e8654b3fdb93cb43d4f62a2737979a85開始；restore-v0.16.0-before-v0.17.0指向此起點。前版v0.16 ZIP369560bytes、SHA256 1d46ead284df35ef0468b7325784b45bb71fd51ff6b47cb1b183f51759c0b193，entries／CRC／安全解壓原版146Python／146JS通過。

本版指定commitZIP驗收後以private PR合併、建立v0.17.0 tag／Release，source／tree／ZIP SHA與真正遠端下載以manifest及outputs/v17-qa/release-remote-evidence.json為準。先保存未提交改動，再git switch -c codex/restore-v0.16.0 restore-v0.16.0-before-v0.17.0，或git archive到新目錄；main回寫用revert／PR，不reset／強推。程式與資料還原分開；草稿／備份／媒體不回退覆寫或自動遷移。

## 功能與分層

基線空白cue不能記下播放位置、CLI沒有純歌詞起稿入口。新增musiclab/lyrics_seed.py純domain，保留source_text原文、重複句／前後空白、非空白行及原始行號；獨立schema1／untimed，不猜測時間，64KiB／1000句。生成title/text與檢查seed互斥，未知／矛盾來源或額外start/end拒絕。application共用CLI／HTTP／JSON-lines／MCP六工具，明確啟庫十一工具；Agent不因此寫檔，CLI預設拒絕覆寫。

web/lyrics-seed.js核對domain資料／JSON成果、提出既有draft3的留白cue；scope lyrics重用replacement-preview，生成另核對music來源，外部seed保留其他panel編修。先預覽影響與原文，再明確套用／取消；音檔／目前時長／歌曲／分鏡／交付條件保持。draft-undo記錄實際after，後續時間或文字編修拒絕撤回。來源JSON存在既有lyrics-source／.json，未加草稿格式或靜默轉換。

web/cue-stamp.js純start/end/move提案重用lyric-time毫秒規則。DOM只讀實際播放器currentTime/duration，分開記開始／結束；整句移動保留已有句長，超過音檔結尾不寫入。部分有效cue僅供播放顯示，不放寬全部匯出驗證；起稿時間留白，段落標籤需人工調整，沒有ASR／模型呼叫或實聽驗收。

產品0.17.0，lyrics seed1新契約；Agent1／MCP2025-11-25／draft3／storyboard seed1／library1／backup1保持。沒有依賴、Host安裝／全域設定、對外API或新持久權限。LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保持，PolyForm Noncommercial 1.0.0不另授AGPL／商用，ZOE. G／Codex協作如實記錄。Repo private；FreeTWAI未投稿／未核實創始人。

## 驗證與限制

156Python／168JS、四Skill／十五JS語法／diff通過；新增10Python及22JS含真正四adapter／Unicode來源／BOM／CRLF／另一cwd／拒絕覆寫／clone／互斥版本／guard／undo／毫秒位置。IAB真正預覽／取消／明確套用／撤回、音檔保持、4秒晚成功／500保留、逐句標記／部分highlight／超音檔拒絕、未知版／沒音檔、三格式與draft實檔／讀回、390×844 DOM及Enter焦點，詳見docs/QA-v0.17.0.md。

下載seed843bytes、JSON576、SRT207、LRC109、draft7005。SHA見downloads-evidence.json；Windows CRLF與Python LF有bytes差異，JSON語義及換行正規化文字相符。draft3／tool0.17.0與原文seed／四句時間核對；輸入plain.txt bytes與CLI source_text一致。精確commit封裝另跑全套、Agent/MCPmetadata。沒有截圖／完整視覺、其他OS／瀏覽器、正式作品／實聽／音畫、ASR／LUFS／true peak或特定host證據；這些仍是滾動目標的未完成範圍。

## 產物與程序

outputs/v17-qa存本輪合成原檔、真實下載、檢查／還原／封裝與遠端收據，不進Git。使用者草稿／備份／媒體不是Git可重建清除候選。保留最新三封裝v17／v16／v15，更舊未滿七天仍保留；只列超過七天且tag／已驗遠端可重建的本專案產物，本輪沒有符合條件的刪除。

基線HTTP exec30311/PID283108、新版exec43146/PID212268都QA stop正常exit0／server_closed；tab19關閉、viewport reset。最後8875監聽與確認PID、封裝／發布終態及outputs盤點記inventory-final。只處理本輪確認程序，沒有持久服務／監控。只讀本次新工作區與通用指引，不參考其他使用者專案／記憶／GitHub，滾動目標active。
