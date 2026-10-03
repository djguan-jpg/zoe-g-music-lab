# v0.11.0 QA — 整批校時與一致的毫秒時間

2026-10-03，Windows／Python 標準函式庫／Node 原生測試；IAB，127.0.0.1:8875，桌面 1280×720／窄螢幕 390×844。Browser plugin not available；本專案沒有既有 Playwright workflow、不可新增依賴，採可用的 CUA IAB DOM／locator／file chooser／download 操作。使用 frontend-testing-debugging 通用指引；依使用者媒體邊界沒有擷取／嵌入截圖，不宣稱完整視覺驗收。

目標流程：波形校時 → 載入合成 SRT／8 秒 WAV → 校時預覽 → 明確套用 → 編修文字／時間 → 安全撤回 → 驗證／下載；獨立 preview.html → 微調毫秒 → 套用音檔總長 → JSON／LRC／SRT 實檔下載。

## Findings 與修正

1. 同一 payload 的 shift_seconds 原先被 Agent 忽略，而 CLI 已校時：共用 application 編修，真正 CLI／三 transport 與領域結果一致。
2. Python 原先接受 start=-0.0001 捨入成零，且 1.2345 得 1.234；採有限十進位／half-away-from-zero 至毫秒，負值先拒絕，Python／原生 JS corpus 一致。
3. 舊獨立 SRT preview 保留 end=2.5、tail_end_inferred=false，頁腳卻說尾句估計：實際 DOM 重現後改為依目前 timing 動態提示；套用重算 provenance，8 秒音檔更新總長。
4. 普通驗證排序結果後沿用未排序 ID：先排序來源／ID，實際行 row-18 對應第二句 4–5、row-17 對應後改的文字 6–7，時間／身份沒有交換。既有晚回應 adapter 測試補接新模組依賴並加入真正事件排序檢查。
5. 模板串接 replace 會重新解讀輸入中模板符號：一次替換，hostile HTML 與字面模板文字的 JSON roundtrip 測試通過。

## 檢查表

| 檢查 | 結果與證據 |
| --- | --- |
| Page identity | 通過；主工作台／獨立 fixture URL、ZOE 標題正確 |
| Blank-page | 通過；工作台／歌詞表格／校時控制／獨立逐句資料存在 |
| Framework overlay | 通過；DOM 未見錯誤覆蓋 |
| Console health | 主頁 error／warn 空；獨立 fixture 正確重載後空 |
| Screenshot evidence | 未執行，遵守使用者媒體邊界；不作完整視覺宣稱 |
| Interaction proof | 預覽／套用／撤回／拒絕／晚回應／實檔匯出通過 |
| Responsive／keyboard | 主頁 1265／1265、375／375 client／scroll，按鈕在寬度內且不重疊，Tab 取得 timing-preview |

第一次用 production 的 script-src self 政策服務離線 inline HTML fixture，導致測試頁 inline CSS／JS 被擋、表格空。僅修正忽略的 QA helper 兩條 fixture route，允許其自有 inline script／style 與 blob audio，其餘網路禁止；production policy／Host／Origin 防護保持。重載後表格及互動恢復，只統計該時間之後 console，歷史 fixture CSP 訊息有解釋。這不是 production 缺陷或降低正式保護。

## 實際互動

- 空 cue 無法預覽；明確 SRT 兩句 1–2／4–5、合成 8 秒音檔、一次刪除歷史。
- +0.5 預覽兩句 1.5–2.5／4.5–5.5，原表格未改；套用後改文字，再撤回回到 1–2／4–5，新文字／音檔／歷史保留。
- 再套用後手動把第一句 end 改 2.6；撤回整份拒絕、兩句全保留。改回 2.5 後可撤回。-2 的負時間、+4 超過 8 秒均拒絕，沒有截斷。
- 自有 helper 對 +0.75 延遲 2 秒；請求中改文字，候選取消，晚回應不覆蓋，文字仍為「晚回應不得覆蓋的文字」。核對 DOM 的目前 value，未把初始 attribute 當成目前輸入。
- 第一列移至 6–7、第二列 4–5；驗證重畫的 row ID／文字與排序相符。真正 JSON 檔下載確認 4–5 第二句／6–7 後修文字。
- 草稿真正下載：產品 0.11.0、schema 3，沒有 shift 控制／候選／撤回／音檔。既有刪除紀錄仍 1。
- 獨立頁輸入 1.2345／2.0005，套用後 1.235／2.001；載入合成 WAV 後 duration=8、estimated=false、provided、inferred_end_count=0、tail_end_inferred=false。JSON／LRC／SRT 實檔一致，原 fixture 與合成 WAV 保留。最後 renderer 產生與已測正常 fixture 完全相同的 HTML。
- IAB 沒有回報 Blob download event，不能以事件逾時判定失敗。先核對精確唯一檔名不存在，點本頁下載後只讀這三個已知檔名，375／48／91 bytes 存在且內容／SHA 驗證；沒有掃描其他下載。原生 HTTP JSON／草稿下載事件與實檔也已核對。

## 證據與自動驗證

忽略的 outputs/v11-qa 保存 baseline-bugs／baseline-data／HTML、browser-main-evidence、browser-standalone-evidence、實際 JSON／草稿／三格式下載、checks、previous-restore-evidence 及程序收據，不進 Git／原始碼 ZIP。各 SHA-256 在該證據中，例：獨立 JSON abffcedb56fae77758fa6d48308e2a07dd8cbdf6b684b2d8c1e5ffcce692ad50；主頁 JSON 4be04566e0866ffcc805afc37922c7dea31529f06eb3b17a992bbb88846245e6。

112 Python／69 JavaScript／四 Skill／八 JS syntax／git diff --check 通過。新增 13 Python／14 JavaScript 測跨語言精度、同結果 CLI／HTTP／JSON-lines／MCP、source 保留、錯誤後可再呼叫、sorted index／ID、回應篡改／晚到／取消、全份撤回保護、HTML 安全與 timing。v0.10 ZIP 244400 bytes、SHA f97b691d0f7467fef62f5d9b2af32e0dba68a206cb20aedb607bdb04f702e0b4；受控暫存解壓原版 99 Python／55 JavaScript 通過。

關鍵命令：python -m unittest discover -s tests；node --test tests/test_*.js（helper 以明確 argv 展開）；八 JS 的 node --check；四 Skill quick_validate；git diff --check。瀏覽器使用同一 IAB／自有頁、domSnapshot／read-only evaluate 的 value／geometry、locator.fill／click、filechooser.setFiles、download.path；沒有讀其他專案或秘密。

指定提交 ZIP 解壓後再跑全套、Agent metadata 與 MCP initialize；private PR／Release／遠端實際 bytes 核對以封裝 manifest 與遠端證據為準。三個自有 HTTP exec 73630／72326／99643 正常停止 exit 0，server_closed 收據，8875 監聽 0，tab 12／13 關閉，viewport reset。未停止未確認程序或建立背景監控。

## 未驗證

完整視覺／其他瀏覽器／直接 file:// 的瀏覽器差異、正式歌曲實聽、ASR／LUFS／true peak／媒體生成、特定 Agent host、官方 conformance、其他 OS／檔案系統。數值通過不是聽感／版權判決，source hash 不是著作權簽章。Repo private；未公開、未投稿 FreeTWAI，也未取得平台創始人核實。
