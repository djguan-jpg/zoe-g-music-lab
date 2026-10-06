# v0.111.0 交接與可逆

歌曲、分鏡創作與分鏡時間待辦的列ID來源統一使用既有有界讀取層。舊三個控制器用來源some／iterator讀ID，缺項可被prototype補出，自訂iterator能掩蓋ID換序，超64字元ID也被接受；本輪改成原始自有index與固定長度副本，再沿原checkpoint／revision判定定位。

三個純readiness模型 → 既有 `editor-focus.checkedSource` 的40段／1000鏡、own dense ID／64 UTF16 units／唯一性／固定initial length檢查 → 隔離ID副本與原panel精確列數檢查 → 原readiness-state來源fingerprint／report revision → 未改DOM橋接／原欄位定位。純共享呼叫提供固定visible=true／busy=false，只借用ID來源驗證，不改實際app的busy／visible門檻。來源的some／map／Symbol.iterator不呼叫，不把caller hooks搬入snapshot；沒有新增重複reader或新資產。

缺少自有index、空白ID、非字串、重複、超64units或與原panel列數不符時拒絕；讀取期間長度改變也拒絕。failed check保留上一份report及revision；refresh標stale，舊定位停用，精確恢復原欄值與ID順序後沿guard重新核對。成功重新檢查回第一頁，舊revision callback拒絕。未提供ID的歌曲／創作舊caller介面保持；時間原本要求ID仍保持。

產品0.111.0／唯一runtime policy38–111共74，未知112拒絕；17基本／24啟庫工具與24組既有input/output schemas、Agent1／draft3及領域schema保持。只改三個純JS控制器的ID來源，不改editor-focus本體、DOM／app／HTML／CSS、固定資產、Python domain／producer／application、server／CLI／Agent／MCP或程序政策。沒有新依賴、模型、路徑或網路能力。

595 Python（84.844秒，兩隔離workers／120秒期限）、1301 JavaScript、125 syntax及四份Skill通過；新增14項JS。基線九個注入來源均被接受，其中三個iterator掩蓋換序；現版六個缺項／超長來源拒絕，三個合法自有ID含iterator的來源正常讀自有index，全部三個換序舊定位拒絕，caller方法／iterator呼叫0。另驗證getter增长只讀初始範圍、failed report／revision保持、恢復原值、64-unit邊界、空列、舊無IDcaller與實際asset先後。v110指定source ZIP原樣還原595／1287；四scope各73個歷史producer，共292份ZIP與manifest bytes相同，24schemas相同。

20個連續原生快照、14組完整草稿除saved_at比較；原欄值、列ID及音檔另核對，details展開屬UI暫態。三報告各第二頁21–40保留200明細，總計200／1200／240；歌曲第5段、創作第3鏡、時間第11鏡焦點正確。同文字歌曲段落與鏡頭換序只換ID順序，舊報告stale並停定位，撤回恢复，重查回第一頁；原成果files保持，明確move仍沿原dirty停下載規則。原File身份／blob及paused／0.5秒／8秒合成WAV保持。

三份native完整wire與application相同；三操作CLI／Agent／MCP good/bad/good與九HTTP回覆完整核對。來源screen_direction保留合法neutral，實際未完成表格可通過draft3，三CLI --draft回讀原值與完整報告一致；診斷exit2不代表作品接受。無效或預設覆寫exit1且bytes保持。自有tab關閉／viewport reset／console0；唯一bounded工作台server正常停止，獨立HTTP thread joined，Agent／MCP子程序EOF0。

自訂iterator／prototype／getter案例是注入式JS控制器邊界，未宣稱HTTP JSON能攜帶這些方法或已發現遠端安全漏洞。共享reader仍可讀caller getter，不是通用Proxy／accessor副作用防護或原子快照；caller自行改動的ID陣列不回滾。ID是本頁暫態識別，不代表素材作者。分頁只讀已保留前200項；零待辦與診斷通過均不是作品／實聽接受。PNG只留ignored outputs；本輪未做完整視覺、screen reader、OS IME、實際瀏覽器保存、實聽、正式媒體、Host安裝及平台創始接受。固定離線預覽未修改。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

本輪分支 `codex/iteration-v0.111.0`；基線main `0c44669ad75299e2687d01f9f0d82084c6625599`；還原tag `restore-v0.110.0-before-v0.111.0`。從還原tag另建 `codex/restore-*` 分支，以private PR回復，保留已發布main與使用者草稿。

指定source commit由scripts/package_release.py封裝，ZIP／manifest SHA-256留ignored QA收據；private PR／prerelease需下載核對完整bytes／digest及refs／tree。只稽核本工作區outputs與本輪typed receipts，最新111／110／109受保護；嚴格超七天且exact tag／Git archive可重建才列候選。未知資料、素材、私人草稿／備份與失敗封裝保持；不以bare PID判定或強制終止。

下一輪依實際可重現缺口擴充；原欄位與ID來源核對繼續共用純層，UI暫態不進草稿或Agent wire。
