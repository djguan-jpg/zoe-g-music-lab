# v0.172.0 指定資安掃描與審閱

## 結論與来源

2026-10-09 使用者明確恢復資安工作，並在 AI Security Scanner 桌面按下開始。已核對安裝的 v0.5.0、原 CLI `doctor` 與實際 run；沒有用 plan 或其他工具代替指定掃描。

首次來源固定為 `d1858cc06ff05100d9fcd0a3f426dcfa3ad16819` 的 1097 份 raw Git 檔案；來源 ZIP、每份 SHA-256、工作區與隔離快照均核對。只掃這份本機原始碼，沒有其他專案、Git 歷史、輸出封裝、網站或模型目標。

案件 `1af34c87-b12a-41d0-8d8c-f587eb0ce771`，run `265b7c80-b51f-4fd7-8c1c-2ccde65a1616`，完成時間 `2026-10-09T11:12:21.120037300Z`。101 筆全部核對為這個 run 的 Semgrep 結果：19 high、82 medium；99 low confidence、2 medium confidence。這些是掃描器原始分級，沒有更改或抹除。

逐筆審閱這 101 筆後，66 筆判為誤報，35 筆為已有保護或合理用途的警示；這個集合中沒有確認到可利用漏洞。此判定不等於零漏洞，也不能取代未完成的掃描涵蓋。沒有冒充人在 scanner 內登記處置，畫面的「需要處理」仍保留原始狀態。

## 引擎結果與剩餘問題

Checkov、Gitleaks、Grype、KICS、Syft、Trivy、TruffleHog 的 engine run 完成；沒有這些引擎的 normalized finding。Syft 的 inventory 與漏洞判定分開。

Semgrep 是 `partially_completed`，原 error code `execution_failed`，normalization 警示保持。唯讀核對這個 run 的原 artifact SHA-256 後，發現 Semgrep 1.174.0 的唯一原始 error 為 `PartialParsing`：`web/wave-position.js:26` 的 `?.05:.5` 縮寫條件無法解析。原始報告列出 835 個 scanned paths；這個數目不證明完整解析或全部漏洞類型涵蓋。沒有匯出 raw evidence、改 scanner、改 provider 或自行重跑掃描。

原生 Node 可解析原寫法，既有定位語意是 Shift 時 0.05 秒、一般 0.5 秒。候選只把這個 expression 改為 `modifiers.shift ? 0.05 : 0.5`，其餘 module 原 bytes 保持。原／新 Node syntax 均通過；31 項既有波形與選句定位測試通過。新來源的 Semgrep 解析成功仍需要新的實際桌面 run 證明，不能用這些 Node 測試替代。

首次實際 run 已結束。新的確切候選快照需要另行準備，不能改寫原掃描快照或把旧 run 套用到修改後來源。依[官方 SKILL.md](https://github.com/teddashh/ai-security-scanner/blob/main/.codex/skills/ai-security-scanner/SKILL.md) 的 `You cannot start a scan.`，開始／接續仍由人從桌面操作。沒有完整新 run 前，正式版保持 v171、PR #171 保持 Draft，沒有 v172 release。

## 逐筆判定摘要

每筆 finding ID、原 severity／confidence、rule、精確來源位置與 SHA-256、判定與理由都存在忽略 QA 的 `outputs/v172-qa/scanner-resume-1/finding-triage.json`。沒有把群組數目當成逐筆覆蓋。

| 原規則 | 筆數 | 審閱依據 |
| --- | ---: | --- |
| jQuery insecure selector | 42 | 六檔 lexical `$` 都是原生 `document.getElementById`，逐個呼叫核對；沒有 jQuery selector／HTML 字串建構。 |
| jQuery insecure method | 18 | 原生 DOM append 使用節點／Option，文字沿 `textContent`。 |
| HTML template string | 15 | 外部文字與 ID 先跳脫；其他插值為固定選項或已驗證數字。 |
| insecure innerHTML | 7 | 七個實際輸出點核對完整來源，沿上述跳脫／固定值／數值驗證。 |
| insecure document method | 7 | 重複標記同七個輸出點，原 finding 仍逐筆保留。 |
| unknown value with script tag | 3 | 尋找固定 `application/json` 標記及數值位置，不插入 executable script；資料與完整範本檢查拒絕注入。 |
| dangerous subprocess audit | 5 | 四筆是固定參數陣列的本機工具，預設不啟用 shell；一筆僅建立 `TimeoutExpired` 例外。 |
| SHA-1 audit | 2 | 唯一應用為 Git blob identity，`usedforsecurity=False`；來源／匯出完整性另外使用 SHA-256。 |
| unsafe dynamic method | 2 | 方法只由相同 lexical scope 的固定按鈕字串選擇，沒有外部任意方法 dispatch。 |

19 筆 high 的細分是一筆誤判例外建立、14 筆重複標記的已保護 HTML 輸出、四筆固定本機 subprocess。沒有把可見介面隱藏當成資安修復。

## 驗證與限制

原掃描來源的集中驗證：40 JS、27 Python 通過，1097 份快照沒有改變或產生額外檔案。Python 第一次集中啟動誤把無 package 的 tests 目錄當成 package，三份 module import 失敗；只修正 QA 匯入路徑後通過，原 failure／EOF 保留。產品與正式完整 runner 未改。

另外執行原 app 的實際 renderer function，透過記錄 DOM seam 擷取 32 份 fragment，用非執行 HTMLParser 核對三類惡意文字沒有增加標記／事件屬性；30 個惡意數值字串由原音檔 DTO validator 拒絕。這不是原生瀏覽器 exploit proof。它補充 source flow 審閱，不取代 UI、實聽或完整掃描。

繁體中文標準遮蔽 HTML report 為 375442 bytes，SHA-256 `c76854328359000aab76a58853e69b6c6d44567d99e408c0f45cc1b8b09a744c`，保存於忽略 QA。這是 unsigned integrity-only 匯出；沒有證明著作權、鑑識或全面接受。瀏覽器 URL 政策拒絕本機 file report，只做靜態解析，沒有用 HTTP server 或其他瀏覽器繞過，也沒有宣稱視覺已驗。

原完整接受與成功候選封裝固定在 `b295f09cf88644da7d55babf7952e312f573c7d7`：830 Python／2067 JS、163 syntax／四 Skills；本次集中驗證不是新提交的全套或成功 release manifest。只做一行 parser 相容書寫與審閱文件，沒有新版本、依賴、auth、Agent 操作、外網目標或平台重送。PolyForm Noncommercial、ZOE. G／djguan-jpg 與四份 `submitted_unverified` 保持。
