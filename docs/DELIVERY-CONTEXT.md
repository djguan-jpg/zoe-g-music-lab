# 用前後文辨認搜尋結果 v0.47

在交付ZIP預覽展開「分段閱讀完整原文」，輸入搜尋字並尋找。每筆結果會顯示附近文字與【命中字】，例如主歌和末副歌的同一句便能區分；選取一筆後，「命中前後文」顯示唯讀原文片段，原文reader也跳到命中位置。可選ZIP原文或目前保留成果，每批20筆，下一批從第21筆接續。

片段每側最多64 UTF-8 bytes，遇字元中間只縮小側邊摘錄，不拆Unicode、不改命中字位置。清單只為辨認：換行顯示↵、tab顯示⇥、BOM／其他控制碼顯示可讀符號；側邊連續普通空格縮為一個，搜尋字本身空格保持。清單最多120 Unicode字元，以…標示前後或清單省略；EOF不虛構後續。下方片段與DTO保留原文空格、BOM、CRLF／LF／CR、NUL與HTML；textarea換行由瀏覽器顯示處理。不是整份原檔，完整原文與下載來源保持。

```powershell
python music_lab.py delivery-inspect --input outputs/my-delivery/zoe-delivery.zip --out outputs/search --text-file full.txt --find-text "記憶點" --match-context
```

CLI明確輸出delivery-inspection.json，預設拒絕覆寫；沒有原檔輸出，--overwrite才替換指定metadata。--match-context需同時text-file／find-text，不能搭配window-bytes／file-name／comparison-report。Agent／MCP delivery_inspect payload明確：

```json
{"text_search":{"file_name":"full.txt","query":"記憶點","include_context":true}}
```

未指定或false保持原七欄位置DTO；null、數字、字串與未知欄位拒絕，沒有暗中回傳原文。enabled才加context={format:zoe-delivery-match-context,schema_version:1,flank_bytes:64,items:[...]}。每項text、start_byte、end_byte、match_start_byte、match_end_byte與matches依序對應，單項最多1152 UTF8 bytes，Agent最多50項／browser20。前後文schema1獨立於search1、window1、Agent1及draft3，基本12／啟庫17工具保持，需重新discovery。

query仍1–1024 UTF8 bytes，literal／大小寫精確／非重疊、one-lookahead及有界接續保持。每次仍完整ZIP CRC／SHA／canonical核對，包括未選檔；非零start_byte需前次archive_sha256，ZIP或label改變、缺檔或混用模式拒絕。來源只由啟動參數選定，JSON不能選路徑／URL，沒有自動寫檔或網路／模型能力。具明確baseline時仍比較全部來源。

musiclab/delivery_context.py為已找到命中的純bytes側邊裁切；delivery_search.py只在明確要求後組合context，application與CLI／Agent／MCP adapter沿既有分層。web/delivery-context.js為同一UTF8模型、嚴格回覆核對與清單presentation；search KMP與reader共用單8MiB原文buffer，只切最多1152-byte片段，不重新編碼全文。controller重查scalar source key與query，DOM只textContent／readonly textarea；不執行HTML或更改創作表單。query／檔名／兩側／revision／media／busy／取消／套用／撤回或下一批變更清除舊選擇與片段。

context1／產品47、來源明確38–47同步；未知版本拒絕。法律與創辦紀錄保持，完整一致性不代表音樂品質、權利或平台創始接受。正式媒體、實聽、完整視覺與特定Host另驗。
