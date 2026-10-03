# v0.23.0 驗證

2026-10-03。完成分鏡的秒數容差原本可能接受不連續影格，瀏覽器仍顯示成功。本輪以本工作區原創合成案例重現並修正；沒有讀取其他使用者專案、GitHub、作品、記憶或 vault。沒有新依賴或第三方程式／素材。

## 已重現與修正

| 24 FPS 案例 | 原影格範圍／總長 | 新結果 |
|---|---|---|
| 前鏡結束0.06251、後鏡開始0.0616秒 | [0,2)、[1,24) | 拒絕重疊 |
| 前鏡結束0.06249、後鏡開始0.0634秒 | [0,1)、[2,24) | 拒絕空缺 |
| 宣告0.93751、尾鏡0.9366秒 | 尾端22、總長23 | 拒絕尾鏡不符 |
| 宣告0.93749、尾鏡0.9384秒 | 尾端23、總長22 | 拒絕尾鏡不符 |

基準版本真正 IAB 選檔／預覽／載入／建立接受第一項，沒有提醒且下載啟用。原秒數容差保持；剛好1 ms加入1e-12浮點餘量，之後仍須通過精確影格覆蓋。修正有效例0.0625秒半幀取偶數為2，完整[0,24)、每鏡[0,2)及[2,24)；不改秒數、FPS或創作內容。方法見 FRAME-TIMELINE.md。

另從真正下載草稿發現 tool_version 仍為0.21.0。修正為0.23.0，增加實際 captureDraft 函式與 application 版本的回歸核對；保留舊草稿可讀，draft schema3不變。

## 自動驗證與四入口

217 Python／263 JavaScript、四 Skill／20 JS語法與 git diff check通過；17新Python／16新JS。涵蓋四原始錯誤、包含1 ms與超容差、正常同幀秒數保留、四小時尾端容差、零幀、精確半幀／半幀兩側、23.976／29.97／59.94／120 FPS、Python與JS一致、未知schema／宣告／型別／產品版本、legacy有效資料、seed1另一個半幀整數拒絕、過期與失敗恢復、CSV公式保護／提示範圍、草稿版本。

真正CLI、HTTP、JSON-lines、MCP握手／storyboard_plan／EOF涵蓋錯誤後有效恢復；data與files共用 application、沒有部分輸出或原檔改寫、CLI默認拒絕覆寫。另CLI與MCP產生五檔bytes一致，真正MCP mv-brief交入瀏覽器。discovery新增storyboard_frames schema1；Agent1／MCP2025-11-25／draft3／library1／backup1／兩seed1／lyrics_package1／audio_loudness1與六／十一工具保持。

## 真正 IAB 工作台

20項完成後的觀察記於忽略的outputs/v23-qa/browser-evidence.json：

- 初始四鏡顯示576總幀與四個排他範圍。四種錯誤需求選檔皆拒絕，沒有可套用預覽，原表單與成果保留。
- 真MCP需求先預覽、明確載入才更動，修正後顯示24總幀與兩鏡範圍。手動重疊拒絕、舊成果保持且下載停用；修正並Enter建立後恢復。
- schema999與目前500保留上一份成果；四秒晚成功／晚500在編修及切換工作台後捨棄。受控錯誤只存在忽略的QA server，不進產品。
- JSON1973、CSV430、提示稿1258bytes真正下載並讀回。CSV bytes與CLI／MCP一致；JSON／提示稿內容在Windows CRLF正規化後一致，不宣稱原始bytes相同。
- 合成音檔在分鏡操作、草稿預覽／取消後保留。完整草稿明確載入按既有告知清除音檔選擇，需另選；不是預覽時清除。下載草稿4742bytes為tool_version0.23.0／schema3，0.0625秒原值保存；純DTO重建data與CLI／MCP一致，真正載入並重建亦通過。
- 390×844 DOM documentWidth375、影格段落x36／width323，沒有水平溢出；24幀fact、兩鏡範圍及Enter下載可用。手機JSON1973bytes回讀一致。console error／warn空，沒有截圖。

第二鏡details原先收合，fill逾時未完成；讀取狀態後展開再編修。一次summary locator有兩個匹配，改用實際顯示的確切文字。沒有把逾時、busy或未完成操作當通過，沒有重送同一長請求。owned tab28已關閉、尺寸override清除。

## 還原、發布及限制

前版v0.22 ZIP503139bytes、SHAd48fbb1247edf752c39cf186d1c0db9729677335ac918b9d6451f113424c2873，CRC／安全路徑／bytes／SHA核對後，解壓200Python／247JS通過，暫時解壓目錄已移除。restore-v0.22.0-before-v0.23.0指向main起點fe64cecf93599ee2a323ddaec6150049d5b1feab。

指定提交封裝／private PR合併／tag與Release／遠端實際下載bytes以manifest及outputs/v23-qa/release-remote-evidence.json核對；本輪自有PID／埠與最新三封裝以inventory-final.json確認。沒有清理其他專案、未確認程序或使用者素材。

這是資料一致性／DOM驗證。尚未完整視覺驗收、正式歌曲／影片音畫驗證、特定Agent host或其他OS／browser。沒有模型／媒體生成或FreeTWAI投稿，沒有平台創始人核實。PolyForm Noncommercial1.0.0、private與ZOE. G署名保持；滾動目標active。
