# 音檔來源與完整回覆核對（v0.62）

分析前，瀏覽器從所選File讀取全部位元組並計算SHA-256；收到報告時比對報告宣告的SHA、檔名、大小及本次接受條件。錯誤回覆不替換原成果，可重新分析。示範條件與自訂條件草稿都經相同核對。

- `web/audio-file.js`：讀取／hash adapter，原生arrayBuffer與WebCrypto。1 byte–64MiB，尺寸不合或SHA不可用直接拒絕，沒有回退為信任server值。只保留digest；來源buffer在hash完成後不快取。這是單份64MiB輸入上限，不宣稱browser/WebCrypto內部及上傳總heap等於64MiB。
- `web/audio-result.js`：無I/O pure whole-response核對，exact files/data/meta、protocol1、report/meta product與固定頁面current一致、ZOE Audio Delivery tool、needs_review與warnings、limitations固定語意；再核對實際File SHA/name/bytes/profile/有效接受值。JSON從嚴格duplicate/BOM/nonfinite/Unicode/parser讀取並與完整data逐值一致。
- `web/audio-review.js`：先hash；核對current後才傳同一File；收到回覆重查current，再由pure checker及既有PCM/loudness模型建立presentation，最後才onResult。hash/read/request錯誤也重查current，改選同名同大小File仍取消。profile或raw條件草稿變更亦取消；沒有寫入/轉檔/正規化原音檔。
- 既有app run／DOM維持busy、上一份、下載停用及current錯誤回饋。兩模組由fixed routes/index注入，不新增外網、path authority或dependencies；CLI／Agent／MCP／HTTP producer繼續共用Python application與原formatter。

live response是目前頁面服務的回覆，產品必須等於固定current；既有buildReview對舊報告的不可測響度label保持，不能拿legacy view代替live-source guard。產品版本、Agent protocol1、loudness1、acceptance-draft1與project draft3分開，沒有silent migration。

preset exact files是report.json/report.md；帶draft另有audio-acceptance-draft.json（64KiB），data與檔案中的raw draft fingerprint都須相符，即使改字後有效數字相同也拒絕。report JSON及Markdown各8MiB上限且非空有效Unicode；Markdown僅核對存在與文字邊界，沒有重算每句Markdown語義。data欄位為本current producer固定集合，未知欄位拒絕；若後續版本新增欄位需明確更新contract並測試。

所選File位元組對報告宣告SHA的核對不等於獨立重算PCM量測，也不证明producer可信／外部文件系统原子快照、著作權、實聽或收件者接受。仍信任已驗證的本機analyzer計算，sample peak不是true peak、RMS與LUFS分開。

錯誤會顯示「音檔回覆版本、來源或交付檔案不一致，沒有替換目前結果；請重新分析原音檔」。hash缺少時顯示明確原因並保留成果；沒有下載確認或外部保存完成宣告。見[QA](QA-v0.62.0.md)與[交接](HANDOFF-v0.62.0.md)。


## v0.63 音檔完整文字報告

純audio_report.py／audio-report.js canonical render → audio_bundle共用application（CLI/Agent/MCP/HTTP）／audio-result checked逐字MD → 原audio-review PCM/LUFS/current → DOM。取代v62僅非空Unicode的MD檢查；JSON量測、原媒體／schema／protocol保持。固定小數是顯示契約，null明示不可測；全文有效Unicode／8MiB，錯誤／late保留原結果。數字契約見[AUDIO-REPORT](AUDIO-REPORT.md)，非實聽、重測或權利證明。
