# v0.20.0：JSON 接續拒絕損壞文字與重複欄位

修正需求檔無效UTF-8被換成「�」仍接受，以及CLI／Agent／草稿重複title／version被默默採用最後一個值。共用純Python與原生JS JSON層，拒絕重複欄位／跳脫同名、非有限數字、無效Unicode與超64層，不修補後替換原內容。

CLI／HTTP／JSON-lines／MCP、草稿保存／備份及歌詞包使用同層；需求／起稿／草稿原生選檔改arrayBuffer並核對大小。有效單BOM仍可預覽，取消／明確套用／限定undo與晚回應保護保持；原檔與媒體保留。discovery提供解碼限制，domain schema仍另行驗證。

180Python／220JS、四Skill／十八JS語法，31項IAB含真正adapter產物、UTF8／重複拒絕、同一音檔、延遲／500、下載／讀回、390px DOM／Enter。前版ZIP安全還原168／206。見[QA](QA-v0.20.0.md)與[交接](../HANDOFF.md)；完整視覺、正式作品、特定Host與FreeTWAI未驗證。

指定commit ZIP與manifest含SHA，private PR合併／tag／Release後真正下載逐byte核對；restore-v0.19.0-before-v0.20.0保留起點，用新分支／revert／PR還原、不強推。產品0.20.0，所有protocol／領域schema及六／十一工具保持，沒有依賴／模型呼叫。ZOE. G發起，GitHub djguan-jpg，Codex協作依FOUNDER-RECORD；PolyForm Noncommercial1.0.0，沒有AGPL或商用授權，Repo private。
