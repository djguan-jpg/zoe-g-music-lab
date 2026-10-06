# 選定鏡頭待辦（v0.112）

整份分鏡創作待辦仍計算全部1000鏡／30母題，最多保留200明細。新增單鏡檢查可直接查看後面的鏡頭，不需要先修完前200項。工作台選「要調整的鏡頭」，按「檢查選定鏡頭待辦」或「建立這一鏡待辦報告」；所有明細使用當次原始鏡號。

純 storyboard_review._analyze 共用必填欄位、畫面方向與母題引用規則；既有整份報告結果保持。storyboard_shot_review → application → CLI／Agent／MCP／HTTP；原生 storyboard-readiness.inspectRow → storyboard-shot-review 純完整回覆核對與注入 checkpoint → storyboard-shot-review-dom 字面文字與原欄位定位。新兩個固定GET資產與一個唯讀POST，無新依賴、模型、媒體生成、外網、auth／路徑或寫檔權限。

輸入僅 {panel,row}：完整 raw draft3 分鏡 panel 原值；row 為存在於原列表的1起安全整數，JSON的1.0與1同值，布林／字串／小數／越界拒絕。完整來源最多8 MiB、1000鏡、30母題；HTTP／Agent既有2 MiB傳輸與CLI草稿1 MiB保持。未知欄位、無效Unicode、錯來源與版本拒絕，不補寫或丟棄資料。

独立 storyboard_shot_review schema1、format zoe-storyboard-shot-review；JSON／Markdown固定檔名 storyboard-shot-review.json／.md。source只含原fields、全部母題與選定shot；row／total_shots分開，issues只指原鏡號及母題related_row。最多32明細，沒有截斷；報告JSON最多256 KiB，過大明確拒絕，原分鏡保持。data、完整JSON、Markdown、meta產品版本／Agent1／needs_review=true全部核對後才提交成果。零單鏡待辦依然需要整份時間、影格、連戲及實際音畫／權利驗證。

UI暫態 source 保留全部自有dense row IDs、當前選定ID／原鏡號／鏡數與選定context；IDs不進Agent／報告／draft3。其他鏡頭文字改動後，重新選回原鏡頭可沿原來源核對恢復本地待辦；選定鏡頭、全局欄位、母題、選擇或ID順序改變停舊定位。精確恢復原來源可重新定位；重查／clear增加revision，舊callback拒絕。忙碌／隐藏停用操作；完成不自動搶焦點，待辦定位只展開原鏡頭。現有run仍按整份工作台revision守護HTTP：任何分鏡編修都拒絕晚成功／錯誤，保存上一份成果並停下載。原始原生File、播放位置、其他panel與草稿不受檢查／定位影響。

CLI：

```powershell
python music_lab.py storyboard-shot-review --input examples/unfinished-storyboard-shot-review.json --out outputs/selected-shot
python music_lab.py storyboard-shot-review --draft saved-draft.json --row 100 --out outputs/selected-shot-from-draft
```

--draft必須明確--row；--input本身含row，不可另用--row覆蓋。輸出exit2有待辦／0零待辦／1無效或同名拒覆寫；--overwrite才替換指定輸出。Agent操作storyboard_shot_review、MCP同名工具，arguments為{payload:{panel,row}}；HTTP /api/storyboard-shot-review。18基本／明確啟庫25工具，需重新discovery；原24組輸入輸出schemas不變，Agent1／draft3與其他domain schemas保持。

新產品112、唯一delivery policy38–112共75，未知113拒絕。PolyForm Noncommercial 1.0.0／private，創辦ZOE. G／GitHub djguan-jpg；FreeTWAI not_submitted。來源、SHA與待辦不能證明作者權利或平台創始身分。
