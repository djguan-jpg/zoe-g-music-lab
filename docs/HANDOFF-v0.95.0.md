# v0.95.0 交接與可逆

歌詞、分鏡與 ZIP 原文搜尋在中文輸入法選字時，Enter 不再提前尋找或重設原結果；一般 Enter 與「尋找」按鈕仍可使用。命中摘錄、原欄位定位、取消／重試、前後分頁及私人編修保留。

search-input 純三欄鍵盤 metadata → 三個原 DOM adapter → 既有搜尋 controller。isComposing 或 legacy keyCode229 不 preventDefault、不讀來源／清單或呼叫搜尋；只有有效普通 Enter 才執行原動作。純層無 DOM／事件副作用、timer、網路或持久狀態；固定一 JS asset。控制器、app、application／CLI／Agent／MCP、領域 schemas 與 23 operation input/output schemas不變。產品95／唯一policy38–95共58／unknown96拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。

branch `codex/iteration-v0.95.0`；restore `restore-v0.94.0-before-v0.95.0` → 起點 `8ba4ee34691a880b6d7212e53dcb428d21112477`。先另存私人草稿及素材，再 `git switch -c codex/recover-v0.94 restore-v0.94.0-before-v0.95.0` 開新分支。前版實際ZIP還原572／1094；本輪指定source封裝／SHA、private PR／release、真正下載與main同tree依outputs/v95-qa receipts。見[契約](SEARCH-INPUT.md)、[QA](QA-v0.95.0.md)。

572 Python68.390秒（兩隔離workers／120秒整體期限）／1104JS／108syntax／四Skills；10項新增測試。原v94 exact-source ZIP還原572／1094，228歷史交付ZIP／manifest bytes相同，23 operation schemas相同。40歌詞／分鏡＋10ZIP原生狀態，35合成 KeyboardEvent 選字事件均未被攔截；來源／結果／ZIP選取與分頁保持，一般原生Enter／按鈕／取消／重試／原欄focus與空查詢錯誤接續核對。11真正原生HTTP搜尋請求中2個ERR_ABORTED、9個完成；11後端完整回覆（含取消後完成者）等於application，兩種搜尋實際CLI／Agent／MCP一致，good/bad/good與預設覆寫拒絕bytes保持。3自有tabs關閉／viewport reset／2servers正常停止／console0。合成事件不是Windows實際IME候選面板驗收；截圖與DOM幾何不是完整視覺／screen-reader／保存／正式媒體／Host／平台驗收。

每輪只盤點本workspace outputs及typed same-host jobs；latest95／94／93保護。嚴格超七天且Git／tag／verifiedarchive可重建才清除候選；failed36／53、未知資料、媒體、使用者草稿與備份及其他程序保留。稽核後正常terminal數以final-audit-aggregate為準，不以bare PID推斷ownership，不新增Agent維護權限。授權／私有／not_submitted保持；rolling active，下一輪從可重現缺口繼續。
