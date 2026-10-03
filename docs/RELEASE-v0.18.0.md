# v0.18.0：歌詞選檔先預覽，再套用

選TXT／LRC／SRT／JSON或讀取手動原文時，先檢查並顯示原文、句數與時間，確認後才替換校時表格。取消保留目前內容；最近一次未編修套用可撤回。修正慢讀取覆蓋新原文、讀取字幕立即替換表格的可重現問題。

TXT保留原文、空白與重複句，接成時間留白的起稿；SRT多行轉單行、LRC補結束或沒音檔時的估計都顯示說明。目標編修／舊回應拒絕覆蓋，音檔、時長及其他工作台保持。起稿與Agent／CLI JSON沿用現有schema，不新增模型或依賴。

156Python／189JS、四Skill／十六JS語法通過；IAB實際預覽／取消／套用／撤回、延遲／500／最新檔／未知版／UTF8、三格式與draft下載／讀回、390px DOM及Enter通過。前版ZIP安全還原156／168通過。詳見[QA](QA-v0.18.0.md)及[交接](../HANDOFF.md)；完整視覺、正式作品、特定Agent host與FreeTWAI尚未驗證。

精確source commit ZIP與manifest包含SHA-256，private PR合併及tag/release後真正下載逐byte核對。restore-v0.17.0-before-v0.18.0保留main起點；以新分支或revert/PR還原，不強推。草稿／備份／媒體不進封裝，也不隨程式還原覆寫。

ZOE. G發起，GitHub djguan-jpg，Codex協作如FOUNDER-RECORD。PolyForm Noncommercial 1.0.0，沒有AGPL或商用授權；repo private，FreeTWAI未投稿或確認創始人身分。
