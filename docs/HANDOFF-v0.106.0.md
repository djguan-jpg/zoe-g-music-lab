# v0.106.0 交接與可逆

修正共用編修焦點來源驗證跳過空洞 ID、接受繼承的數字位置，或被來源自訂 mapper 替換列 ID 的問題。完整自己的 ID 位置才可進入定位與選列；錯誤來源拒絕，正常請求可繼續。原生 UI 本來產生完整 ID 陣列，本輪沒有宣稱瀏覽器內存在惡意回呼或外部漏洞。

editor-focus.checkedSource 純有界 length／own-index／ID 字串及唯一性檢查 → 隔離 dense ID 副本 → 原 index／ID proposal 與兩capture controller → 未改 editor-focus-dom。editor-selection 共用同一來源再沿原三capture／actual-after與DOM；不呼叫 caller map／iterator。固定原 length 控制讀取次數，讀完長度改變拒絕，不因 getter 增長超出上限。產品0.106.0／唯一 policy38–106共69／unknown107拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模型，app／HTML／DOM／domain/application/server/adapters與固定資產清單無diff，沒有新依賴、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

587 Python（99.063秒，兩隔離 workers／120秒整體期限）、1232 JavaScript、119 syntax、四份 Skill 通過；新增六 JS 測試。基線63案例錯誤接受，修正後全部拒絕或正確複製：六list的空洞／首中末缺列／delete slot／inherited index、caller map、index／ID focus及被替換空洞的second capture，另三list繼承來源的選列。正規請求good/bad/good保持；first／second capture拒絕不調focus/select，selection第三capture拒絕不回滾既已發生的外部操作。v105真source ZIP還原587／1226；272歷史ZIP／manifest bytes相同、23組schema相同，相容QA按scope分批，每批約129–130KiB且小於512KiB。57原生快照核對六集合完整原值刪除／還原與同列焦點、三完整來源選列對、三句清空到新增按鈕再完整還原、390×844 Enter原值保持、七busy來源對。七native完整wire、七CLI／Agent／MCP操作及21HTTP good/bad/good全回覆等於application；兩observed draft3 reviews回讀、預設覆寫1保留bytes、invalid1無輸出、diagnostic2保持。全部已选音檔快照保持同blob／paused／0.5秒／8秒及最終原File身份；console0、一tab關閉／viewport reset、一bounded server正常停止、HTTP thread joined與子程序EOF0。

异常metadata僅以純注入回呼測試，普通DOM產生dense自有IDs；不宣稱外部可利用漏洞、通用prototype/Proxy/accessor安全或原子快照。PNG留ignored outputs；完整視覺、screen reader、各OS IME、瀏覽器保存、實聽、正式媒體、Host安裝及平台創始接受未驗證。

分支codex/iteration-v0.106.0；restore-v0.105.0-before-v0.106.0指向c7811871fc7be640b35029c42b605989109e1744。先另存私人草稿／素材，再git switch -c codex/recover-v0.105 restore-v0.105.0-before-v0.106.0開還原分支。v105真source ZIP還原587/1226通過；本輪exact committed ZIP再跑完整檢查。source/tree/SHA依outputs/v106-qa/source-evidence.json、package-evidence.json和manifest。

private PR/prerelease及actual downloaded ZIP/manifest bytes、GitHub digest/refs/clean main依release-remote-evidence.json；本機不冒充遠端CI。PolyForm Noncommercial1.0.0、不另授予AGPL或商用；ZOE. G/djguan-jpg及FreeTWAI not_submitted保持。

只盤點本outputs/direct releasepairs/typed自有程序；latest106/105/104保護。嚴格超七天且exact Git/tag/archive可重建才列候選，無候選不清除。failed36/53、unknown、私人草稿／備份／素材與外部程序保留。一自有bounded server正常停止、一tab關閉、viewport reset；不裸PID終止或全域列舉command line/環境。最終inventory/final-audit-aggregate收據；rolling goal保持active。
