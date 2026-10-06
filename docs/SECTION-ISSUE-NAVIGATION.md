# 歌曲單段逐項定位（v0.117）

選擇原段落並檢查後，「下一項待辦」從第一項開始，點清單某一項可接續其前後項。最後一項停用下一項，第一項停用上一項；不循環、不改原文字或列順序。按「重查這一段」重設游標但不自動搶焦點。五欄零待辦仍需整首歌曲、總長、編曲、實唱／實聽及素材權利驗證；原單段報告與完整來源保護沿用[契約](MUSIC-SECTION-REPORT.md)。

## 共用游標與來源

issue-cursor共用既有嚴格 metadata：report revision、0–32明細計數及hasReport／stale／busy／visible。只保存revision／count／index；focus回傳true後再捕獲狀態，來源仍有效且revision／count一致才提交index。失敗、例外、舊revision、source變更、hidden或busy不前進；新report／count重設index。refresh不定位，回傳metadata副本不能改內部cursor。單段DOM只有最多五項，來源仍由既有section controller核對原row、selected identity、完整stable ID順序與五欄原值，來源核對失敗不能由游標繞過。

新增可選注入messages，精確empty／missing／progress／stale四鍵、自有嚴格JSON值、有效Unicode與各1–1024 UTF16 units；建構時隔離copy，不接受getter、未知或隱藏欄位。既有shot caller未傳入時預設文字逐字保持。literal DOM只用textContent呈現；可注入文字不是HTML。單段的零項及stale訊息明確提到歌曲與段落，不使用單鏡文案。

music-section-review-dom把原清單點擊與新工具列交給相同cursor；每次操作重新捕獲busy／visible／selection與來源controller的revision。原來源精確復原可接續既有cursor，明確重查建立新revision而從頭開始。局部五欄的合法全域或其他段落編修不改局部診斷，但app既有dirty與完整報告request revision仍保持；重查不能把舊成果標為新成果。UI metadata、IDs、focus、report與cursor不進draft3、保存庫或Agent wire。

## 共用欄位幾何

editor-field-position.scrollOffset抽出既有四欄純geometry契約：top／bottom／height／coverBottom，自有有限JSON數字、絕對值≤10000000、height≥24及bottom≥top。輸出只為捲動offset，保留12px邊界；已可見回0，過高欄位只顯示開頭，不宣稱全欄可見。shot-field-position包裝同一函式，公開API保持；既有單鏡DOM與focus保持。

app的focusMusicSectionIssue先核對原欄位存在／connected／enabled，原生focus保持表格水平捲動，再讀取欄位和section toolbar rect，明確以共用pure model計算window.scrollBy；只有activeElement為原欄位才回true。沒有寫內容、播放狀態或持久資料。工具列sticky top8px、按鈕換行、literal status，height≤400px用static頁面流。13次原生定位在桌面、窄與短視窗核對原row40、欄位低於工具列且在viewport內；這是已測幾何與操作，未宣稱完整視覺或screen reader接受。

## adapter、版本與權限

新增固定GET `/editor-field-position.js`；Python domain／application／CLI／Agent／MCP／HTTP POST與原26組input/output schemas保持。19基本／明確啟庫26，Agent1／draft3／section-review1／shot-review1與交付schema獨立；唯一delivery-versions policy38–117共80，未知118拒絕。沒有依賴、模型、媒體生成、登入、金鑰、外網或路徑／寫入權限擴張。

PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg，FreeTWAI not_submitted。Git／SHA與報告不證明作者權利或平台創始接受。見[QA](QA-v0.117.0.md)與[交接](HANDOFF-v0.117.0.md)。
