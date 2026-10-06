# v0.110.0 驗證紀錄

2026-10-06，本機標準函式庫與原生Chromium；合成資料及完整收據留ignored outputs/v110-qa。

歌曲欄位、分鏡創作與分鏡時間待辦可用上一頁／下一頁閱讀全部已保留明細，每頁20項、最多200項，超過上限明示全部計數與已保留範圍。先前只顯示前20項；現在可定位後續明細的原欄位。另修正兩個內容相同的鏡頭換序後，舊創作待辦仍被當成原位置的問題：來源核對現在包含本頁列ID順序。

595 Python（84.640秒，兩隔離workers／120秒整體期限）、1287 JavaScript、125 syntax及四份Skill通過；新增8項JS測試。v109指定source ZIP原樣還原595／1279；四種scope各72個歷史producer，共288份ZIP與manifest bytes相同，24組schemas相同。72個保存原生快照中66個有效來源觀測、52組完整草稿除saved_at比較；另外核對原欄值、列ID與媒體，details展開旗標另列UI暫態。三清單各十頁200明細，計數200／1320／240、五次原欄位焦點、三次末頁焦點fallback、390×844兩次Enter、busy／stale／exact-source recovery與重新檢查回第一頁通過。六份native完整wire與application一致；六CLI來源、六Agent／MCP good/bad/good、18HTTP回覆、三份有效觀測draft3的CLI回讀全部一致。診斷exit2、零待辦exit0、無效與預設覆寫exit1保留bytes。

第一階段原生UI的同一File身份與blob保持，paused／0.5秒／8秒合成音檔保持；明確單欄編修與還原、同文字列換序與撤回分開核對。第二階段完整來源沒有音檔；有效草稿選檔先預覽保持內容，明確載入才替換，三份本地檢查均零項。兩階段bounded工作台server正常停止；兩個自有tab關閉、viewport reset、console0；独立HTTP thread joined與所有Agent／MCP子程序EOF0。

待辦診斷接受部分填寫資料，不表示它一定能保存為draft3。本輪合成部分分鏡的screen_direction空字串不在draft3選項內，候選有效但目前草稿不符時既有replacement snapshot拒絕預覽，完整原內容與成果保持。未放寬選項或自動修補；改用另一完整有效合成來源，才驗證明確預覽／載入。

早期JS測試fixture缺新分頁globals，補三個明確null後全1287通過；原Python595的實際成功結果保留並與最終JS／syntax分開記錄。初次新測試的fake DOM結構與defer字串不符已修正；app binding初放宣告處，在任何原生重載前移到controller初始化處。原生選項label／tab role定位失敗後依實際button／id修正，沒有來源變更。第二頁面的舊觀測函式仍綁第一頁，保存的59–64六份快照不作第二階段證據；以獨立tab能力與新函式取得65–72並以完整draft／shot count核對。第一次載入後歌曲檢查按鈕因目前仍在分鏡台不可见，明確切台後完成，不把失敗操作當成功。

產品0.110.0／唯一runtime policy38–110共73，未知111拒絕；17基本／24啟庫工具與24組既有input/output schemas保持，Agent1／draft3及領域schema保持。只新增一個固定GET資產；HTTP POST、application、Python producer、CLI／Agent／MCP、程序政策與授權邊界不變。沒有新依賴、模型、媒體生成或外網能力。

只讀已保留的最多200項，不補取被截斷的其餘明細；零待辦不代表完整作品、連戲或實聽接受。PNG只留ignored outputs；本輪沒有完整視覺、screen reader、各OS IME、實際瀏覽器保存、實聽、正式媒體、Host安裝或平台創始接受證據。宣告作品18秒與合成音檔8秒刻意保持，不冒充同步。獨立preview.html及固定預覽嵌入模組沒有加入本工作台分頁。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

本輪分支 `codex/iteration-v0.110.0`；基線main `2868e08531384a0faff7b11ea70184cbe3a031cd`；還原tag `restore-v0.109.0-before-v0.110.0`。從還原tag另建 `codex/restore-*` 分支，以private PR回復，保留已發布main與使用者草稿。

指定來源提交由scripts/package_release.py封裝；ZIP及manifest SHA-256寫入manifest與ignored QA收據。private PR合併／prerelease需以實際下載逐bytes、digest與refs／tree核對。每輪只稽核本工作區outputs與本輪typed run receipts，最新110／109／108受保護；只有嚴格超七天且exact tag／Git archive可重建的本專案封裝才列清除候選。未知資料、草稿、備份、媒體與失敗封裝保持；不以bare PID判定或強制終止。
