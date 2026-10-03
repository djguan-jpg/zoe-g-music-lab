# v0.33.0 驗證紀錄

2026-10-04，本機測試；全部範例與校時音檔為本工作區合成資料，沒有讀其他專案或使用者既有作品。證據留在忽略的 `outputs/v33-qa`。

## 重現與修正

`baseline-browser.json`：合法 draft3 經真 file chooser／明確載入後，12 個原值被number／select清空，卻顯示載入完成。值包括全形 BPM、未完成數字、underscores、前後留白、未知畫幅；baseline服務已正常結束、tab53已關閉。

新版本另加8個含CR／LF／NUL的全域、段落、需求、母題、鏡頭與歌詞欄位。`native-roundtrip.json`、`native-raw-draft.json`、`special-draft.json`核對全部四個panel相等，非只抽查display。8個特殊欄位有保留提示，未知畫幅有literal待核對選項。

## 自動化與實際操作

- `checks.json`：267 Python、413 JS（新增13個原值／adapter／實際事件回歸）、4個Skill、32個JS語法、git diff --check。
- `browser-evidence.json`列24 IAB項目：草稿原生另存；原值歌曲與分鏡報告；無效歌曲2項定位原拍數、分鏡完整FPS拒絕、歌詞4項拒絕；歌曲移動／撤回、歌曲／分鏡／歌詞刪除還原；同escaped display明確編修後變literal新來源；修正後歌曲136秒、分鏡24秒576影格、歌詞1句6秒完整建立。
- 真下載檔：`native-history-draft.json`／`native-all-undo-draft.json`與原panels相等；`native-explicit-edit-draft.json`只改明確編修的hook。`native-final-draft.json`為本輪最後保存的合成編修，確認後重新整理；新頁識別v0.33、兩raw模組及文字數值欄位。
- `native-music-review.json`／`native-board-review.json`與載入原值panel相等，特殊字元原樣在source。`adapter-evidence.json`以真下載draft3完成application／HTTP／CLI／JSON-lines／MCP相同data與檔案核對；CLI0／2／1、預設拒絕覆寫且原產物不變、未知draft4拒絕不產檔，Agent／MCP EOF結束，基本9工具。
- 4秒pending report中編修hook，回覆未覆蓋新文字／原成果；foreign source同樣拒絕。6秒合成音檔仍同blob、原bytes SHA一致，最後確認另存狀態吻合。
- 390×844：Enter啟動歌曲待辦；body375px不溢出390px、特殊提示寬度不超過父層。沒有error／warning console；tab54已關閉、viewport已reset。這是DOM／幾何／鍵盤驗證，沒有完整視覺或實聽驗收。
- `previous-restore-evidence.json`：v0.32 ZIP712132bytes、SHA `8f844fb6f1d4bec06697cd628d91697791d39b2700914934eae8f5f9f7ab1a5b`核對CRC、解壓267Python／400JS通過，限定暫存已移除。

指定source commit封裝及內部驗證、private PR合併／Release、遠端實際下載與Git／SHA核對、限定程序與最新三版盤點見package／pr／release-remote／inventory-final收據。收據與程序不進Git；manifest記錄不可變commit與archive SHA。

## 實際限制

分鏡field-zero報告不代表完整時間有效；本輪實際證明二十四FPS仍被完整服務拒絕。保留提示是顯示替代，不自動解碼使用者新輸入。沒有增加AI模型呼叫、外網、依賴或格式遷移。

正式音樂／影片、實聽、完整視覺驗收、特定Agent host、原生file下載預覽播放與FreeTWAI提交／創始人核准尚未驗證。GitHub無設定CI；上述為本機及release遠端檔案驗證。
