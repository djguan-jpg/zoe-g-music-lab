# v0.19.0：歌詞包回讀保留名稱、總長與待核對來源

修正完整歌詞JSON回讀丟原標題、宣告總長與推估來源，以及未知版本被抽cues接受。例如歌詞兩秒結束、音樂十秒，回讀與下載仍保持十秒。獨立zoe-lyrics-package schema1、嚴格UTF-8／重複欄位／非有限數字／來源核對共用CLI／HTTP／JSON-lines／MCP。

工作台與離線預覽共用明確編修契約；確認音檔總長不抹去曾補齊句尾的提示，修改時間／文字加待實聽說明。時長衝突拒絕，估計值不填時長欄；舊完整包須明確轉換並另存，原檔保留。

168Python／206JS、四Skill／十七JS語法通過；26項IAB含adapter實檔、十秒尾奏／推估提示、晚成功／500、未知版／重複欄位、JSON／draft回讀、390px DOM與Enter。前版ZIP安全還原156／189。詳見[QA](QA-v0.19.0.md)及[交接](../HANDOFF.md)；完整視覺、正式作品、特定Host與FreeTWAI未驗證。

產品0.19.0／歌詞包1獨立；Agent1／MCP2025-11-25／draft3／兩seed1／library1／backup1與六／十一tools保持，無新增依賴／模型呼叫。指定commit ZIP與manifest含SHA，private PR合併、tag／Release後真正下載核對；restore-v0.18.0-before-v0.19.0保留起點，以新分支或revert／PR還原，不強推。草稿／備份／媒體另行保留。

ZOE. G發起，GitHub djguan-jpg，Codex協作依FOUNDER-RECORD。PolyForm Noncommercial1.0.0，沒有AGPL或商用授權；Repo private，FreeTWAI未投稿／核實創始人。
