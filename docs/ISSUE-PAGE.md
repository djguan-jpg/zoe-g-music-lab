# 歌詞待辦分頁 v1

歌詞校時診斷與匯出格式診斷各有自己的暫態頁碼。每頁20項、最多200項完整報告明細，保持原報告順序與絕對index。全部240項但報告200項時，畫面明示「全部240項，報告僅保留前200項」；不假裝讀取其餘40項。

## 分層與邊界

純issue-page模型嚴格核對六個metadata欄位與safe integer／boolean；detailCount在0–200、totalCount不小於它、revision非負。沒有報告原文、路徑、File、DOM、網路、保存或Agent能力。present只派生頁面／範圍／可操作狀態，controller在move與locate前後重查metadata。非法來源不改工作台內容。

DOM adapter只用textContent及既有renderItem callback顯示項目。定位帶報告revision及原index，必須屬於目前頁面；舊callback拒絕。app沿已完整核對的報告、原來源revision與stable row IDs映射定位，不因第2頁把第21項錯當第1項。歌詞review仍標示全部已保留問題欄位aria-invalid，翻頁不改草稿。

## 操作

重新檢查成功重設第一頁。busy或非歌詞台停止翻頁／定位；stale可唯讀翻閱舊報告但不定位，提醒重新檢查。零明細隱藏導航；21項的末頁只有第21項。首末頁鍵盤按Enter造成目前翻頁按鈕停用時，焦點移到另一個可用按鈕；普通編修與不相關焦點保持。原輸入、音檔、上一份成果與下載dirty規則沿既有guard。

## 驗證

新增9個JS測試涵蓋0／1／20／21／199／200、全部200項順序、metadata變更、revision／頁內index、stale／busy／hidden、真adapter旧callback、fixed assets與首末焦點。原生瀏覽器實際走完十頁校時與六頁格式報告、明確原欄位定位、單項末頁與零項、390px鍵盤及來源保持；不是只用DOM數量判定通過。

Windows CIM補查可能在既有3秒operation／5秒helper期限內回傳unavailable；沒有證據就保持unverified並拒絕清除。本輪只修正測試，涵蓋limited及unavailable時均保留資料，以及子程序EOF完成與外部補查是否確認的分離；不放寬程序政策或增加重試期限。早期完整測試與舊版還原遇CIM未確認的失败保留，最後現版595與原封裝v108595／1270均實際通過。

產品0.109.0／唯一 policy38–109共72，未知110拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3及所有領域 schema保持。只新增兩個固定GET資產；HTTP POST、application、Python producer、CLI／Agent／MCP及程序政策沒有變更。沒有新依賴、模型、媒體生成或外網能力。

分頁只讀已保留的最多200項，不補取被報告截斷的其餘明細，零待辦不代表全作品或實聽通過。120秒宣告與8秒合成音檔差異刻意保持，不能當成同步驗證。PNG只留ignored outputs；按鈕位置與鍵盤操作已核對，不把幾何視為完整視覺驗收。實際瀏覽器保存、完整視覺、screen reader、各OS IME、實聽、正式媒體、Host安裝及平台創始接受未驗證。獨立preview.html未加入工作台分頁，本輪未改固定預覽嵌入模組。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。
