# v0.113.0 交接與可逆

選定鏡頭報告先核對完整回覆的 JSON 值與來源，再交給獨立注入式 request controller 管理成功、錯誤、來源改變、取消及重試；DOM 僅提交已核對成果。舊請求不能結束新請求的 pending 狀態或覆蓋新成果。原 25 組工具 schemas、18 基本／25 啟庫工具、Agent1／draft3／shot-review1 保持；僅新增一個固定 GET 資產，既有 POST 與授權邊界保持。產品113／唯一 policy38–113共76，未知114拒絕。

603 Python、1331 JavaScript、128 syntax、4 Skills 及 diff 檢查通過；新增15 JS 測試。原 v112 指定來源封裝還原603／1316通過；300份歷史ZIP／manifest bytes及25組工具schema一致。原生第100鏡／120鏡的完整草稿與原生File身分核對，損壞meta回覆拒絕、編修後晚錯誤忽略、成功與錯誤取消後成果保持、当前HTTP錯誤與重試驗證；音檔仍暫停0.5秒／總長8秒。CLI input／原生draft3、Agent／MCP good-bad-good與6筆直接HTTP一致，3個固定JS資產bytes一致。窄390px僅幾何檢查；瀏覽器下載click送出但事件逾時，保存檔案未確認。完整視覺／screen reader／實聽／音畫同步與FreeTWAI創始審核仍未驗證。

分支 `codex/iteration-v0.113.0`，基線 main `1aa64dbb823c247c0ae8fb9326050bcdcbe542fd`，還原tag `restore-v0.112.0-before-v0.113.0`。還原從tag建立codex/restore-*再經private PR；保留main歷史與使用者草稿。指定source commit封裝並核對ZIP／manifest／SHA與遠端實際bytes。

只盤點本workspace outputs與明確typed owned jobs；最新三版保護，嚴格超七天且可由tag／Git archive重建才列清除候選。失敗36／53、未知檔、素材、草稿、備份與失敗QA證據保留；實際程序結束後才最終稽核。遠端證據與inventory留在忽略的outputs/v113-qa。

見[契約](STORYBOARD-SHOT-REQUEST.md)。
