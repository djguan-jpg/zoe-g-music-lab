# v0.35.0 驗證紀錄

2026-10-04，本機 Python標準函式庫／原生瀏覽器API，沒有新增依賴。證據留在忽略的 `outputs/v35-qa`，只使用本工作區及新建合成測試 Repo。

- 300 Python／431 JavaScript tests、4 Skill validation、33 JS syntax modules、git diff check 通過；封裝另從指定 source commit 解壓重跑 Python／JS、Agent discovery 與 MCP initialize，結果依 package receipt。
- 新增19項維護測試，涵蓋 PID 重用／未知／無效記錄、Windows 真 managed child 正常退出、40次 observation handle 無洩漏、最新三版／嚴格七天、未知版本／來源與重建失敗、損壞／多檔／部分目錄、路徑逃逸／reparse、預覽 token drift、活動程序阻擋、ZIP 中央目錄預分配限制，以及過大 journal 在搬移前拒絕。
- 真合成 Git／CLI 流程：四個版本共8個原檔；預覽後清除一個八天舊版，journal 恢復一版，8檔逐 byte／SHA 相同；新 token 不符、已有 restore 目錄都拒絕，草稿／備份／媒體保留，限定暫存 Repo 移除。這項證據是新建合成資料，沒有清除目前工作區的封裝。
- 本工作區既有32封裝全部通過 ledger／CRC／tag／source 稽核，最新三版0.34／0.33／0.32，候選0、excluded0。發布後追加本版，最新三版及最終檔案／程序狀態另見 audit-final／inventory-final／process-final receipt。
- 實際 localhost server 啟動時自我登記，running 與 creation identity 匹配；server 存活時 prune 拒絕，既有ZIP bytes保持。用合成不同 creation ticks 另驗 same PID／image → pid_reused，沒有終止外部程序。原 server 隨後正常退出，實際 run record 稽核為 stopped。
- 原生瀏覽器四工作台切換，版本0.35，原時間待辦狀態正常；原生下載的 draft3 tool_version=0.35.0 通過檔案讀回及確認另存；console error0，owned tab 關閉。這次沒有完整視覺驗收或正式媒體播放驗收。
- 前版v0.34指定ZIP752655bytes／SHA `4ac84fded892ec59e2f5a3d87ba3cfe3d508791d1f0fe073994b788118720bbd` 解壓281Python／431JS通過，限定暫存移除。

首輪15項焦點測試曾因非專案目錄回傳 FileNotFoundError 而非 ValueError 失敗；修正 marker 不存在時的明確拒絕。後續18項與完整298項曾通過；新增 journal 容量檢查及第19項後以300項完整檢查為最終結果，不沿用舊數量。

指定commit ZIP／SHA、private PR／Release、遠端實際下載 bytes／digest、Git refs／tree／restore／法律四檔由本輪 receipt 核對。GitHub CI 尚未配置；本地與封裝實跑不冒充遠端CI。正式作品實聽、完整視覺、特定Agent Host、原生file預覽播放與 FreeTWAI 創始身分仍未驗收，platform_claim=not_submitted；rolling goal持續。
