# 接續條件檢查報告（v0.65.0）

Agent 產出的 `audio-acceptance-review.json` 可以接續到工作台原始接受條件。選擇「載入條件草稿或檢查報告」，核對完整報告後查看來源預覽，再明確套用。原檔保持；未完成、重複與含特殊空白的原值保持。條件可解析仍須另外分析音檔與實聽。

## 純來源與完整核對

`musiclab/audio_acceptance_input.py`／`web/audio-acceptance-input.js` 是純 input contract1，不讀檔案路徑、DOM、媒體或保存狀態。嚴格UTF-8／JSON與64KiB實際輸入上限沿共用decoder；BOM只允許文首一次，重複鍵、非有限數字、非法Unicode、錯誤大小拒絕。

原 `audio_acceptance.decode`／`audio-acceptance.decode` 仍只接受draft1。新input只接受原draft1或完整review1；完整報告從 `source` 使用原review模型重新派生，核對全部key、型別、順序與語義值，包含field狀態、issues、effective_acceptance與固定notes。來源一致後只回傳隔離draft1與暫態kind。未知版本、額外欄位、自洽但非本契約的固定notes或完整wire envelope拒絕；不自動修補或遷移。JSON數字拼法與物件key排序不作作者證明。

## 工作台

既有controller透過注入decoder選檔，保存read前target fingerprint與原生媒體身份；read後、套用前再次核對latest token、current、busy、File身份。晚到／cancel／變更後的候選不能取代條件。報告預覽明示來源為條件報告，仍只預覽原始draft1；套用只改本台接受條件，其他工作台、所選音檔與上一份成果保持。輸入修改後原音檔成果沿既有dirty／停下載規則，重新分析才更新。

最近明確載入的條件與最近明確確認下載的條件分別保留一個fingerprint；較早下載的確認不覆蓋新載入留點。每類只保留最近一筆，其他後續編修仍顯示需另存，initial checkpoint保持。download sent不是實際保存成功，只有明確確認保留該次click-time條件；沒有自動保存、跨頁持久化或無資料遺失承諾。

## CLI與Agent

`audio-acceptance-review --input <選定JSON> --out <明確目錄>` 接受草稿或完整報告並重新產生目前版本報告；可解析exit0、有待辦exit2，輸入／I/O錯誤exit1。`audio --acceptance-draft <選定JSON>` 同樣提取已核對來源，真正分析前仍驗證有效條件；未完成值不觸發分析。明確profile／直接條件與draft互斥，預設拒絕覆寫。

application descriptor列出檔案input1契約；既有operation、Agent／MCP／HTTP payload仍使用draft1。不能直接以完整報告代替payload.document；沒有JSON路徑選擇或寫檔／媒體權限。基本14／明確啟庫19工具、Agent1、draft3、review1、acceptance-draft1保持，新增固定input JS資產。

產品65／明確交付來源38–65共28項，未知66拒絕。輸入一致與SHA不能證明作者、版權、聲音品質、平台創始人資格或正式交付接受。legal4、PolyForm Noncommercial1.0.0、private與FreeTWAI not_submitted保持。驗證見[QA](QA-v0.65.0.md)，可逆見[交接](HANDOFF-v0.65.0.md)。

## v0.66 限定撤回

明確套用後可使用「撤回上次條件套用」，保留音檔；後續編修會阻止覆蓋。套用前未保存的內容撤回後仍提示另存。input1／review1與原選檔核對保持，見[撤回契約](AUDIO-ACCEPTANCE-UNDO.md)。
