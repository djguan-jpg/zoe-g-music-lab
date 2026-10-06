# 歌曲段落搜尋 schema1

歌曲段落表新增原文搜尋，查找名稱、敘事任務、聲音配置；每批20段，可前後分頁，點命中直接回到目前原欄位。保留重複段落、原文、小節、能量與音檔。文字、列ID或順序改變清除舊定位；數值編修保留命中，但原成果仍依既有規則停用下載。取消等待保留上一批，晚回覆不覆蓋後來編修或成果。

music_search／原生 music-search 純三欄字面與UTF-8位置、schema1／來源SHA → 共用application → CLI／Agent／MCP／HTTP → 注入current source／query／ID／result revision controller → literal excerpt DOM／native field focus。重用現有嚴格JSON、搜尋請求ownership、摘錄、輸入法Enter政策及editor-focus自有dense IDs核對；新三個固定JS assets。新增唯讀 music_search，17基本／24啟庫工具，需重新discovery；原23組input/output schemas保持。Agent1／draft3／既有交付schemas不改，產品107／唯一policy38–107共70，unknown108拒絕。沒有依賴、模型、媒體生成、外網或auth／路徑權限擴張。

CLI：`python music_lab.py music-search --input request.json --out chosen-output`。預設拒絕覆寫；使用者明確加 `--overwrite` 才替換指定成果。Agent operation／MCP tool 為 `music_search`，HTTP 為 `/api/music-search`。

```json
{"sections":[{"name":"副歌","focus":"同一句話轉成自己的回答","texture":"木質鼓與人聲"}],"query":"回答","start_row":1,"max_results":20}
```

只接受 `sections`、`query` 與可選 `start_row`、`max_results`、`source_sha256`。0–40段，三文字欄位各最多2000個Unicode碼點；來源compact UTF-8 JSON最多1 MiB。查詢1–1024 UTF-8 bytes，筆數1–50預設20。原列1–來源長度+1；start_row>1必须帶64小寫十六進位來源SHA，來源變更拒絕續頁。欄位鍵的插入順序不影響來源SHA：固定name／focus／texture排序的compact JSON陣列，加 `zoe-music-texts-v1` 與一個LF後SHA-256。未知欄位、時間／小節／能量／路徑、非法Unicode、過大來源及錯pin拒絕。

回覆 `music-search.json` 與 `music-search.md`，`format=zoe-music-search`／schema1／needs_review=true。全部命中列計數，有限matches含原row／field／UTF-8 start_byte與exclusive end_byte／完整該欄text；每段第一個命中欄與位置，下一批不合併重複段落。Markdown只列metadata與位置，不帶原句或query。搜尋回覆的data／嚴格JSON／Markdown／產品版本與protocol要全部等於本次原來源期望，才提交。

Browser capture只取三文字欄、穩定列ID、visible／busy／resultRevision。IDs重用editor-focus自己的密集位置及唯一性核對；sections各自己的位置、三鍵文字再隔離。編修中的過長文字可以顯示，搜尋時由domain拒絕。原數值或其他panel不參與文字來源pin；既有成果dirty/download規則保持。選命中前兩次重查目前來源，再核對原生列ID、指定0／3／4 input、原值與可聚焦狀態。文字與原媒體不進search controller持久草稿；搜尋輸入是view control。

取消使自己的generation失效並abort owned fetch；後端可能完成，已開始的SHA未必可中断。上一批／history保留供重試，新的query、source或panel状态失效清除舊定位。重用search-excerpt的literal text／mark及search-input的組字Enter政策；沒有innerHTML原文执行、自动填欄、模型或媒體權限。

搜尋不是歌曲完成、時間校準、實聽或權利接受；只按固定name／focus／texture順序列每段第一個字面命中。大小寫精確，不正規化或regex；開始原列1起，接續需來源SHA。原生下載點擊顯示已送出，但內建瀏覽器10秒未回報download事件，實際保存未驗證。PNG留在ignored outputs；完整視覺、screen reader、各OS IME、正式媒體、Host安裝與平台創始接受未驗證。不宣稱通用prototype／Proxy／accessor安全或外部改寫原子保證。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。
