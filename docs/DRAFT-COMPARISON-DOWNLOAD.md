# 目前草稿比較報告下載

在現代draft3檔或保存版本預覽明確完成比較後，選「下載比較 JSON」或「下載摘要 Markdown」。各台篩選、每頁10筆只控制閱讀視圖，下載從controller.read取整份目前report，從不讀DOM摘錄或目前頁。JSON保留producer全部有限details、完整計數與欄位SHA；Markdown摘要為既有固定positions/counts，不附任意原文字段。比較報告不是完整草稿、創作接受、媒體同步、作者或平台創始認證。

web/draft-compare-download.js為純select(report,format)，只接受json／markdown、固定draft-comparison.json／.md。report由既有draft-compare producer及來源已核對controller擁有；selector先用strict JSON sameValue拒絕getter、sparse、非有限數字與非法Unicode，再核對exact12 root keys、format、comparison1及source encoding draft3_canonical_utf8。這不是任意外部report匯入入口，不宣稱重做完整報告語義驗證。JSON indent2＋末尾LF與Compare.markdown共享Python producer完整bundle UTF8 bytes，兩檔合計256KiB；來源不修剪或修補。空白、CRLF、emoji與字面HTML保持。

DOM bind注入既有textDownloader。每次click經controller.read重新核對完整baseline／candidate及gate，再純選取，再共用text-download.prepare建立UTF8 bytes。四台編修、tab、原生File身份、busy、候選版本或清預覽／取消使舊來源拒絕；refresh輕量路徑不capture全部歌詞，click-time仍完整核對。未知schema、容量或sender失敗只顯示下載錯誤；不修改表單、成果、草稿checkpoint、原Apply或undo，current report可重試。

text-download-dom已有shared controller factory、同一sendPrepared與兩pending URLpool。新增兩格式不自行實作sender或URL生命週期；送出後1秒、失敗或pagehide回收自身URL與timer。onSent是click＋schedule已提交，不能宣稱使用者已保存檔案；狀態提醒確認瀏覽器下載，且不會另存工作台草稿。快速第三次送出可被原兩pending上限拒絕，稍後依當前來源重試。pagehide移除自身全部DOMlisteners，後續dispose可重複；不取得未知下載目錄或額外檔案權限。

music_lab_server只新增固定selector asset白名單，app向兩個既有bind傳shared downloader；HTTP operation、application、CLI、Agent、MCP、全部28input-output schemas及21基本／啟庫28工具沒有變更。Agent1／draft3／backup1與comparison1保持；產品137與唯一delivery versions38–137同步，未知138拒絕。沒有新增依賴、模型、認證、session、路徑、外網或自動寫檔能力。

實際验证與限制見QA-v0.137.0.md。瀏覽器「已送出」和落盤成功分開，報告原文與來源SHA不能證明權利或平台認證。
