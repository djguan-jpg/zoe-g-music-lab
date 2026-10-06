# v0.110.0 交接與可逆

歌曲欄位、分鏡創作與分鏡時間待辦可用上一頁／下一頁閱讀全部已保留明細，每頁20項、最多200項，超過上限明示全部計數與已保留範圍。先前只顯示前20項；現在可定位後續明細的原欄位。另修正兩個內容相同的鏡頭換序後，舊創作待辦仍被當成原位置的問題：來源核對現在包含本頁列ID順序。

沿既有 `issue-page.js` 純metadata模型／注入controller → `issue-page-dom.js` literal DOM → 新 `readiness-page-dom.js` 報告橋接 → app 的原欄位與stable row IDs。橋接只在DOM層讀已保留報告；純分頁層不持有作品、File、DOM或網路。`readiness-state.js` 每次成功check／clear增加暫態revision，failed check不改上一份；定位同時核對報告revision與實際來源，舊callback拒絕。歌曲與時間沿原ID來源，創作補入鏡頭ID。翻頁只改暫態頁碼，不改原文、時間、媒體、草稿、上一份成果或下載dirty規則。

busy或離開所屬工作台時停用操作；stale可唯讀翻頁但停定位。來源原值與ID順序精確恢復時沿既有guard重新判為current，不要求永久stale；成功重新檢查即使內容相同仍增加revision並回第一頁。零明細隱藏導航。首末頁Enter使原按鈕停用時，焦點回到另一個可用翻頁按鈕；不搶走其他焦點。

產品0.110.0／唯一runtime policy38–110共73，未知111拒絕；17基本／24啟庫工具與24組既有input/output schemas保持，Agent1／draft3及領域schema保持。只新增一個固定GET資產；HTTP POST、application、Python producer、CLI／Agent／MCP、程序政策與授權邊界不變。沒有新依賴、模型、媒體生成或外網能力。

595 Python（84.640秒，兩隔離workers／120秒整體期限）、1287 JavaScript、125 syntax及四份Skill通過；新增8項JS測試。v109指定source ZIP原樣還原595／1279；四種scope各72個歷史producer，共288份ZIP與manifest bytes相同，24組schemas相同。72個保存原生快照中66個有效來源觀測、52組完整草稿除saved_at比較；另外核對原欄值、列ID與媒體，details展開旗標另列UI暫態。三清單各十頁200明細，計數200／1320／240、五次原欄位焦點、三次末頁焦點fallback、390×844兩次Enter、busy／stale／exact-source recovery與重新檢查回第一頁通過。六份native完整wire與application一致；六CLI來源、六Agent／MCP good/bad/good、18HTTP回覆、三份有效觀測draft3的CLI回讀全部一致。診斷exit2、零待辦exit0、無效與預設覆寫exit1保留bytes。

第一階段原生UI的同一File身份與blob保持，paused／0.5秒／8秒合成音檔保持；明確單欄編修與還原、同文字列換序與撤回分開核對。第二階段完整來源沒有音檔；有效草稿選檔先預覽保持內容，明確載入才替換，三份本地檢查均零項。兩階段bounded工作台server正常停止；兩個自有tab關閉、viewport reset、console0；独立HTTP thread joined與所有Agent／MCP子程序EOF0。

待辦診斷接受部分填寫資料，不表示它一定能保存為draft3。本輪合成部分分鏡的screen_direction空字串不在draft3選項內，候選有效但目前草稿不符時既有replacement snapshot拒絕預覽，完整原內容與成果保持。未放寬選項或自動修補；改用另一完整有效合成來源，才驗證明確預覽／載入。

只讀已保留的最多200項，不補取被截斷的其餘明細；零待辦不代表完整作品、連戲或實聽接受。PNG只留ignored outputs；本輪沒有完整視覺、screen reader、各OS IME、實際瀏覽器保存、實聽、正式媒體、Host安裝或平台創始接受證據。宣告作品18秒與合成音檔8秒刻意保持，不冒充同步。獨立preview.html及固定預覽嵌入模組沒有加入本工作台分頁。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

本輪分支 `codex/iteration-v0.110.0`；基線main `2868e08531384a0faff7b11ea70184cbe3a031cd`；還原tag `restore-v0.109.0-before-v0.110.0`。從還原tag另建 `codex/restore-*` 分支，以private PR回復，保留已發布main與使用者草稿。

指定來源提交由scripts/package_release.py封裝；ZIP及manifest SHA-256寫入manifest與ignored QA收據。private PR合併／prerelease需以實際下載逐bytes、digest與refs／tree核對。每輪只稽核本工作區outputs與本輪typed run receipts，最新110／109／108受保護；只有嚴格超七天且exact tag／Git archive可重建的本專案封裝才列清除候選。未知資料、草稿、備份、媒體與失敗封裝保持；不以bare PID判定或強制終止。

下一輪依具體可重現問題擴充。分頁只留DOM暫態與checkpoint metadata，維持診斷／草稿／作品接受的不同契約；不把source ID、媒體或路徑加入Agent wire。
