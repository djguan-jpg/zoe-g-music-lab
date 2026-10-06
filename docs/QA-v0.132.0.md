# v0.132.0 操作 QA

流程：原創歌曲、四鏡分鏡及四句歌詞非空白 → 建立歌曲四成果 → 跨頁加入41保存版本 → 清空後切到無結果並撤回 → 單版／整批移出與撤回 → 固定10版下載期間切搜尋 → 下載後撤回到21但來源仍10 → 取消下一次下載 → 三尺寸Tab／Enter清空及撤回 → 原生選回舊／當前來源檔 → 單版及整批加入撤回。

Browser plugin unavailable，專案沒有Playwright workflow且不新增依賴；依frontend-testing-debugging使用已提供CUA的Playwright locators、唯讀DOM及viewport。URL為http://127.0.0.1:8875/，標題ZOE. G Music Lab · 創作工作台。43快照含四台原欄位與21列ID；四個成果另逐一切換前後讀取全部文字。一次getByLabel「成果檔案」沒有對應label，改用已觀察的#output-file原生select；產品沒有因此修改。

| 檢查 | 證據 |
| --- | --- |
| 頁面身份／非空白／無框架錯誤畫面 | 原生DOM與四台非空白欄位、完整四成果 |
| 互動／鍵盤 | 41清空還原、五種選取變更、busy與cancel、43完整快照 |
| Console | warn/error零 |
| 響應幾何 | 1280×720／390×844／1280×360，實際client width1265／375／1265；提示和清單未水平溢出 |
| 截圖 | 六PNG保存於忽略outputs/v132-qa，依使用者規則未嵌入；完整視覺接受未驗證 |
| 原文／草稿保持 | 四成果全文相同、四台全部值／列ID／dirty提醒相同、82 JSON SHA相同 |

三份canonical來源是QA server額外保留的合成ZIP（41／10／取消10版），完整CRC／canonical reader及descriptor SHA核對；原生選回舊41版match=false、當前10版match=true。瀏覽器download event10秒未提供path，沒有冒充實際保存檔，也未繞過下載管理頁限制。

628 Python（75.438秒）、1647 JS、新20／集中63、143語法／四Skills通過。原v131指定ZIP2473113 bytes、SHA9ce087cdffc9e883a5be7bfae4a3ddc469798c8ab512a0715d5093d901ca8bbf實際還原628／1627，指定暫存已移除。376歷史ZIP／manifest bytes及27 schemas保持；完整inspection五adapter一致、good-bad-good／200400200及CLI預設拒覆寫。20／27 tools保持。

一个受控server正常停止、context close／deadline join及exec EOF；一個IAB頁已關閉、viewport reset；短命HTTP thread join／子程序EOF。完整視覺／screen reader、媒體File身份、實聽／同步、Host安裝、保存落盤與平台正式核實仍未驗證。GitHub CI未設定。指定提交封裝、PR與Release實際asset回讀及final audit以outputs/v132-qa收據為準。
