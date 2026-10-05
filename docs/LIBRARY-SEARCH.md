# 保存名稱搜尋 · v0.75

在「本機保存版本」輸入名稱，按「搜尋全庫」或Enter。搜尋保存名稱、歌曲名、分鏡名、歌詞名；大小寫、空白與Unicode字元完全相同才匹配，不搜尋正文。每頁20版，可讀取更早匹配版本。修改查詢時，上一份結果保留但不能續頁；重新搜尋才切換。取消等待保留清單／預覽與目前編修。按「重新整理保存版本」成功後回到全部版本。選定版本仍須預覽後明確載入，不自動替換草稿或音檔。

## 共用服務

純musiclab/library_search.py負責request、完整metadata index、literal matching、排序、來源hash、page及獨立search1 descriptor/input/output schema。query必填1–200 Unicode codepoints、800UTF8 bytes；不trim/normalize/case-fold/regex。limit整數1–100，預設20。cursor null或精確start_index整數1–1000與64lowerhex search_sha256，不能選路徑。未知／額外欄位、bool冒充integer、無效Unicode拒絕。request先驗再I/O。

DraftLibrary.metadata_snapshot只掃描明確啟動選定的庫，最多1000ID，讀原有bounded record metadata，不開草稿正文；原list共享此掃描且保留原cursor/排序語義。純index核對完整九欄record、library1/draft3/bytes/hash/Unicode及16KiB上限、unique且與unreadable ID互斥；保存時間仍依原UTC字串及ID降序比較，沒有改成Date排序。issue只含id/error=unreadable_revision，依ID排序。

來源SHA是canonical JSON [format,search1,原query,所有排序可讀record,所有排序issues] 的SHA256，ensure_ascii、sort_keys及固定separators。來源不限匹配版本；任何可讀metadata、不可讀ID或query變更都使continuation拒絕。cursor index需小於match_count，不接受跳到尾端或空結果續頁。每次請求重掃觀察來源，再核對SHA，並非原子磁碟快照；hash只代表觀察的metadata值，不是draft內容hash或獨立耐久證明。

application.build('draft_search',payload,draft_library=...)服務CLI、Agent、MCP、固定loopback POST /api/drafts/search。未明確啟庫不提供新操作，basic14保持、啟庫21；Host/Origin與既有JSON限制保持。result files={}、meta current/protocol1/needs_review=false；data精確format/schema_version/query/search_sha256/record_count/match_count/start_index/entries/issues/next_cursor/status。沒有正文、archive、media、任意路徑或寫檔能力。I/O錯誤沿選定來源sanitized訊息。

```powershell
python music_lab.py draft search --library outputs/drafts --query "副歌" --limit 20
# 前次next_cursor的兩個值原樣接續；query保持完全相同
python music_lab.py draft search --library outputs/drafts --query "副歌" --cursor "20:前次64字元search_sha256"
```

第二行SHA文字是說明用占位，不是可用cursor；請替換為前次實際值。CLI只輸出JSON，沒有--out或--overwrite；search cursor與既有list保存ID cursor不同。Agent operation=draft_search，MCP tool同名，arguments={payload:{query,limit?,cursor?}}。新工具readOnly=true、destructive=false、openWorld=false。Host需重新discovery；Agent1／draft3／library1／backup1與原操作schema不變。

## 工作台分層

web/library-search.js純checkedRequest/checkedResult核對精確完整envelope、current/protocol1、empty files及false review，search1完整data、原query、hash形狀、counts/頁長、metadata全欄、每列字面匹配、unique/排序、issues與精確nextcursor。續頁核對前次已接受query/SHA/counts/issues/nextcursor與最後metadata邊界。browser沒有完整全庫index，不能獨立重算server的整庫hash；它核對協定一致性，實際draft bytes/hash仍由後端read核對。

注入controller只capture查詢、request、checkReply/onReady/onState/onError，保留目前accepted page、最多1000已顯示ID、generation/pending/stale。async success/error先核對最新generation及查詢，checkedResult後再重查，續頁不能重用任何已顯示ID。current錯誤保留accepted/cursor；healthy retry可沿同cursor。query edit/invalidate及cancel只取消自身token，不清原有效preview／草稿或媒體。app新搜尋先cancelList，all刷新先cancel自身搜尋；只有完整新結果通過才publish literal options與status。search狀態不進draft3、保存checkpoint或Agent wire。

原生200codepoint上限由純模型驗證，沒有用maxlength200把emoji誤限成100字；長文字status以overflow-wrap:anywhere適應窄視窗。DOM幾何與console檢查不等於完整視覺或screen-reader接受。metadata沒有驗收聲音／創作／作者／權利或FreeTWAI創始身分。

## 有界測試

新scripts/check_python_tests.py使用兩個隔離Python程序，按完整discovery的module固定分組，parent再核對每個test ID完整且唯一、各worker count/成功。每次整體期限120秒保持，只有兩個自身子程序可由逾時處理停止；沒有持久服務或新增Agent權限。Git指定source ZIP抽出後使用同runner。原始單程序deadline及profile證據保留，舊ZIP的原碼／測試不改，外部同策略launcher驗证。見QA-v0.75.0.md。
