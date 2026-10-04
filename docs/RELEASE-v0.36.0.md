# ZOE. G Music Lab v0.36.0

窄螢幕建立成果後，訊息與檔案區在長編輯內容下方。本版在四個建立按鈕旁提供本輪狀態及「查看本輪成果」，明確聚焦成果標題，再返回原工作台控制；清空成果則返回可操作的建立按鈕。

非同步完成不搶焦點；處理中暫停導覽，修改後明示上一份成果並保持下載停用，失敗／晚回應保留原成果與新輸入。切換工作台清舊返回目標，純presentation／controller／DOM與既有app分層，導覽不進draft3或Agent wire。詳見[使用與分層](DELIVERY-NAVIGATION.md)。

300Python／443JS／4Skill／35syntax，390px及1366px四工作台查看／返回、busy／500／晚回應、原音檔及實際report／draft3下載讀回、真draft載入清空返回、v35ZIP還原通過；指定source封裝另解壓驗證。詳見[QA](QA-v0.36.0.md)與[交接](HANDOFF-v0.36.0.md)。完整視覺、正式媒體／實聽及特定Host仍待驗。

產品0.36、Agent1、MCP2025-11-25、draft3與其他schema保持；10基本／啟庫15工具，無新增依賴。private Repo／private prerelease；創辦ZOE. G、GitHub djguan-jpg、Codex協作揭露與PolyForm Noncommercial1.0.0維持，FreeTWAI尚未投稿／核實創始人。


封裝首個source commit 57e17624a6989ce76014c16d77fdd5cedbbfd699的完整Python測試超過舊60秒deadline，流程終止、未發成功manifest；失敗ZIP／FAILED.txt保留在對應outputs/releases目錄。修正封裝command可明確指定timeout，完整Python套件使用120秒 execution deadline，其餘60秒；caller每次bounded wait仍最多60秒。發布採修正後新commit的獨立目錄，不覆寫失敗證據。解壓驗證暫存先核對絕對parent為系統temp，再由原context正常回收。
