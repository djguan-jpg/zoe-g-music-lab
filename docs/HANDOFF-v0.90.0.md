# v0.90.0 交接

新增共用工作台「取消等待」：本次 gate 在 native abort listener 前失效，只有同一 awaited task 結束才能釋放；取消保留來源、刪除紀錄、媒體與上一份成果，後續人工編修仍沿 dirty/revision 保護。純 operation-gate → 明確 request context signal → 固定 operation-control DOM adapter 分層；原來源核對保持，晚到成功/錯誤不提交。取消 fetch 不表示後端停止；不可中斷的 File.arrayBuffer/WebCrypto 階段保持 cancelling/busy 到結束。獨立 library/search/backup/file preview/ZIP import 保留原生命週期；known delivery ID 原 discard 保持，未知 staging 沿 bounded expiry/server close。server 只新增兩固定 JS assets，application/CLI/Agent/MCP/領域schemas/權限/依賴不變，15/22、Agent1/draft3保持。564Python68.266秒/1049JS/100syntax/四Skills、149focused（15新純模型/實際run/API/DOM/controller測試）、208歷史ZIP/manifests與原v89 ZIP564/1034還原通過。原生歌曲/分鏡/歌詞取消、重試、晚到後端、人工編修/歷史/上一份成果、匯入/匯出及390px Enter焦點核對；三原生報告與actual application/CLI/Agent/MCP/HTTP一致。12秒延遲只在ignored QA，沒有production取消endpoint或kill。完整視覺/screen-reader/正式媒體/特定Host未驗證。產品90/來源38–90共53/unknown91，legal4/private/FreeTWAI not_submitted保持，latest90/89/88保護，rolling active。

- 分支codex/iteration-v0.90.0；restore-v0.89.0-before-v0.90.0 → 3e7a46eed828fa9d32e01e071cb3596bc63dc639。可在還原tag另開分支，不強覆main/草稿。
- pure gate → injected per-request current.signal → fixed DOM availability/focus；取消與source核對分工，native non-abortable階段保留busy。server只serve固定JS，沒有取消backend能力；獨立控制保持。
- product90/supported38–90共53/unknown91；Agent1/draft3、15/22工具及domain/wire保持。
- Cancel waiting不表示保存、後端停止、交易回滾或取消所有工具；known delivery ID仍discard，未知staging依原bounded expiry/contextclose。
- outputs/v90-qa含baseline/native、checks/focused/previous-restore/compatibility/runtime、source/package/private PR/actualdownload及refs/tree、inventory/audit receipts。中途failed helper保留terminal1紀錄，未當成功或重跑同一registered helper。
- exactsource commit/ZIP/SHA依manifest與remote evidence。latest90/89/88保護，只列strict >7day可精確重建候選；草稿/媒體/backup/failed/unknown與其他程序保持。本輪owned job原handle正常終止。
- LICENSE/NOTICE/LICENSING/FOUNDER不變：ZOE. G，djguan-jpg，PolyForm Noncommercial1.0.0，private，FreeTWAI not_submitted。未授AGPL或商用、未認領現有平台手冊作者身分。
- 後續維持可重現需求、分層、source/current/restore與实际封裝驗證。完整視覺/screen-reader/正式媒體/Host/平台仍未驗證；rolling active。
