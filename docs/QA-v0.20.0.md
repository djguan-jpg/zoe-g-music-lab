# v0.20.0 驗證紀錄

2026-10-03 · 本機Windows／Python標準函式庫／既有Node／Codex IAB。只讀本次新工作區及通用指引，需求與媒體皆合成資料。收據outputs/v20-qa不進Git；精確commit封裝／遠端bytes以manifest與release-remote-evidence為準。

| 檢查 | 實際結果 |
|---|---|
| 基線重現 | Agent同時protocol_version999／1仍ok；CLI重複title成功。IAB損壞UTF8歌名變「�樓梯間的回聲」仍進預覽，草稿schema999／3當3接受 |
| Python | 180 tests；12新測試含全深度重複／跳脫同名／非有限數字／Unicode／bytes／深度、common／lyrics／library／request共用、真CLI另一cwd／BOM／覆寫拒絕、真HTTP400後200、JSON-lines與MCP壞後好 |
| JavaScript | 220 tests；14新測試含原生File／bytes與metadata、損壞解碼不替換、跨Python語料、BOM／Unicode／深度／重複鍵、真domain seed與瀏覽器模組載入順序／offline嵌入、真app草稿handler拒絕 |
| 語法／Skill | 十八JS語法、四Skill及diff；無新增依賴。既有測試以原生File／實際bytes取代寬鬆text doubles，保護測試保持 |
| 真正adapter | CLI產生17鏡seed／BOM，JSON-lines music回brief.json，MCP握手／六tools／storyboard_plan call／EOF產物；各自由IAB實際選檔預覽／套用 |
| 拒絕與重試 | 歌曲／分鏡需求、分鏡起稿、草稿的無效UTF8與重複版本／title拒絕，不顯示新預覽、不改原文／表格／同一音檔；有效BOM仍可預覽 |
| 操作與音檔 | brief／seed局部套用與undo保留同一10秒合成audio blob；草稿preview／cancel也保持。整份草稿明確載入才依提示清除音檔、原來源檔保留 |
| 晚回應 | 三筆4秒receipt：第一筆回應完成後才編修，只證明proposal拒絕；第二筆成功與第三筆受控500均在延遲期間編修，舊預覽不復活、過期錯誤不顯示、新記憶點保留 |
| 真下載讀回 | brief2131bytes／draft6341，SHA見downloads-evidence。Python嚴格decoder與domain讀回；IAB選真正下載檔先預覽再Enter套用，draft3／tool0.20.0保持 |
| 行動／其他工具 | CDP390×844，innerWidth／documentWidth390、status316px，錯誤提示不橫溢出，Enter正常套用。PCM交付報告仍完成／3提醒；完整歌詞包透過共用parser正常預覽 |
| Console與限制 | tab24 error／warn空，31個實際case；CDP清除／tab關閉。無截圖／完整視覺、正式作品實聽、其他OS／瀏覽器、ASR／生成媒體或特定Host證據 |
| 前版還原 | v0.19原ZIP436974bytes／SHAd5f6b24535741b67e228b03e86383d61da00774e042d1e22261135350676f228；safe entries／CRC／解壓168Python／206JS通過 |

JSON為共用解碼層，不是新schema或創作評分；產品0.20.0，Agent1／MCP2025-11-25／draft3／兩seed1／lyrics_package1／library1／backup1與六／十一工具不變。CLIJSON2MiB、工作台三入口1MiB、歌詞2MiB、64層；BOM規則按入口明示。可信程式生成JSON仍走既有parse，外部輸入才使用嚴格decoder。

基線HTTP exec16260／PID296520、新版exec26753／PID304736只綁127.0.0.1:8875，經qa-stop正常exit0／server_closed；沒有重啟既有工作／持久監控。最終outputs與本輪確認PID見inventory-final，草稿／備份／原始媒體不視為Git可重建清除候選。保留最新三封裝v20／v19／v18，更舊未滿七天仍保留；無符合條件刪除／0。

LICENSE／NOTICE／LICENSING／FOUNDER-RECORD Git blobs保持，非商用與ZOE. G／djguan-jpg署名保留。Repo private；FreeTWAI未投稿／創始人未核實，滾動目標active。
