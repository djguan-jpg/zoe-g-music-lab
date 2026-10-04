# 原文搜尋與直接定位 v0.46

## v0.47 命中前後文

搜尋清單改以原文鄰近文字辨認重複句，選擇後顯示唯讀片段並定位原文。context1每側最多64 UTF-8 bytes、不拆字元，單項最多1152 bytes；清單標示換行／控制符號、整理側邊連續空格及120字元摘錄，原文DTO與片段仍保留原值。Agent／MCP明確include_context=true、CLI --match-context才提供；預設位置回覆與12／17工具保持，source SHA與current source失效保護沿既有搜尋。產品47、來源明確38–47，未知拒絕。見[前後文契約](DELIVERY-CONTEXT.md)。下方保留較早迭代。

在文字 ZIP 核對預覽中，展開「分段閱讀完整原文」，選擇 ZIP 原文或目前保留成果。輸入搜尋字後按「尋找」或 Enter；「搜尋結果」選擇一筆，就直接顯示從命中處開始的原文。每批最多20筆；「下一批結果」接續，「尋找」重新從開頭開始。字面、大小寫精確，不用正規表示式，也不忽略空白或換行。

搜尋不修改創作表單、原文或媒體，不執行 HTML。修改搜尋字只清除命中位置；換檔／換來源／表單或成果修改／媒體變更／忙碌／取消／套用／撤回時清除舊結果。空檔、缺檔與沒有命中分別顯示。Unicode無效或UTF-8字元中間的起點會拒絕，不自動修補。文字框換行由瀏覽器顯示；下載保持完整原文。

```powershell
python music_lab.py delivery-inspect --input outputs/my-delivery/zoe-delivery.zip --out outputs/search --text-file full.txt --find-text "尾端🎵"
```

CLI明確輸出delivery-inspection.json，沒有輸出原文；預設拒絕覆寫，--overwrite才替換指定檔案。不能混用window-bytes／file-name／comparison-report。max-matches與find-text需明確text-file。

Agent／MCP在啟動參數--delivery-zip選定來源，delivery_inspect payload可傳：

```json
{"text_search":{"file_name":"full.txt","query":"尾端🎵","max_matches":20}}
```

非零start_byte必須帶前次archive_sha256；query為1–1024 UTF-8 bytes，max_matches為1–50整數（預設20）。每次都先完整核對 ZIP，包括未選檔CRC／SHA／canonical；檔案缺少或ZIP改變（即使只改label）拒絕接續。可帶baseline做完整比較，但不能混用text_window、include_files=true、file_names或include_report=true。

data.text_search標示format=zoe-delivery-text-search、schema_version=1、file_name、archive_sha256、file_sha256、query、query_bytes、start_byte、source_bytes、max_matches、matches和next_byte；files仍空。每筆只含start_byte／end_byte，精確UTF-8 bytes，非重疊。最多回要求筆數，加一次lookahead；有更多時next_byte是最後回傳命中的end_byte，否則null，不虛構全文命中總數。取得命中後，可另以text_window與同archive_sha256讀該位置，單段仍最多16 KiB。

musiclab/delivery_search.py純搜尋／選取與請求驗證；application先完整ZIP核對，再產生DTO；CLI／Agent／MCP為adapter。Python使用bytes.find；JavaScript delivery-search.js使用線性KMP，模式最多1024 bytes，failure table最多4096 bytes。delivery-text.js prepared原文持有單一8MiB有界buffer，分段與搜尋共用，不重新編碼全文，不暴露buffer到status／wire／草稿。searcher保留本批最多20位置與scalar接續，source key與query讀後重查；delivery-search-dom.js只處理文字／選擇／按鍵，delivery-import controller沿既有current source核對。直接定位清除分段的返回紀錄；前後段與回到開頭保持。

產品46與支援來源38–46同步。text-search1／text-window1／Agent1／draft3分別管理，12／17工具保持；沒有新依賴、模型、路徑或自動寫檔權限。完整一致性仍不代表創作品質、版權或平台創始接受。
