# v0.134.0 原生操作 QA

流程：開啟127.0.0.1:8875 → 建立歌曲四成果並逐一讀全文 → copy段落、編修原列、undo → 既有LRC先預覽／Apply接四句 → copy歌詞、編修原句及複製句、拒絕undo／修回retry → copy鏡頭、編修原鏡、undo → 三台各copy一次、局部載入清除 → 三尺寸Tab／Enter undo → 回歌曲逐一讀四成果全文。

Browser plugin not available；專案沒有Playwright依賴或e2e workflow且不新增安裝。使用既有CUA的Playwright locators、唯讀DOM、viewport及本機固定server，依frontend-testing-debugging驗證。33完整快照含所有四台欄位與六種collection原字串／IDs；LRC明確Apply後21個原ID。不是只核對按鈕標題或mock。原有beforeunload未另存提醒與dirty停下載保持。

| 檢查 | 實際證據 |
| --- | --- |
| 頁面身份／非空白／無overlay | 正確title／localhost URL／version134，完整原創合成欄位及四成果 |
| 互動 | 三種copy及undo，原列後續編修保持；已改copy拒絕，修回retry；scope load及獨立紀錄 |
| Console | warn/error零 |
| Keyboard | 1280×720／390×844／1280×360，Shift+Tab到lyrics-search-find、Tab到cue-copy-undo、Enter後4句且原句焦點 |
| 尺寸 | 完整DOM viewport／client／scroll，頁面沒有水平溢出；不是完整視覺接受 |
| 截圖 | 三PNG留outputs/v134-qa，不依賴截圖宣稱全視覺，依使用者規則未嵌入 |
| 來源保持 | target局部剔除copy，其他panels全部exact相同；四歌曲成果全文相同，原合成保存庫hash相同 |

645 Python（104.422秒）、1668 JS，新21／集中36、143 syntax及四Skills通過。actual v133 ZIP2515834bytes／SHA0c4313fe61cda2ed842d5a178bfe7b5291c4e1a8f2d2249fbba1510c6202764e還原645／1647且來源不變、暫存移除。384歷史ZIP／manifestbytes、27schemas保持；備份完整五adapter回覆一致，20／27 tools；CLI預設拒覆寫及good-bad-good／200400200通過。

一個server正常shutdown／context close／deadline join及exec EOF，一個IAB頁close／viewport reset。截圖只保存沒有嵌入，完整視覺／screen reader、媒體File身份、聽音與音畫同步、browser保存落盤、Host安裝及平台正式核實仍未驗證。GitHub CI未設定；指定source封裝與遠端asset回讀以release manifest和本輪outputs收據為準。這輪原生UI未使用實際私人素材、未呼叫模型、未修改保存版本或平台投稿。
