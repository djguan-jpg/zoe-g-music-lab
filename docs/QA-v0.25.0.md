# v0.25.0 驗證

2026-10-04 · 本機 · 原創合成資料 · ZOE. G。

## 重現與功能

真IAB v0.24載入三句草稿：第一句開始／結束留白，第二句0–2已填，第三句3開始但缺結束。按建立只顯示「歌詞開始時間 必須是數字」，focus停在lyrics-build，九欄無aria-invalid；沒有指句號或欄位。

v0.25新增唯讀校時進度／待辦，建立前也檢查並定位第一項。純Python及JS用原列1起／global0，重用毫秒契約，暫排序檢查但source順序保持。缺失、無效、顛倒、重複開始、最遠占用end跨句重疊、宣告界線／單行文字均可列出；不補值／移動／裁切。局部timed_rows不是全表可匯出，所有報告仍meta.needs_review=true。

新lyrics_review schema1與七基本／啟庫十二tools，CLI／HTTP／JSON-lines／MCP共用application。其他protocol與schema保持；無依賴、模型、auth或路徑權限增加。當前report／定位／aria標示暫態，後續編修清除舊標示、停用舊定位及下載，重查才恢復。

## 程式證據

234Python／305JS、四Skill／22JS語法及diff通過；13新Python／16新JS。真七工具MCP測試加入實際新call與同application比對，草稿庫／備份十二工具斷言保持讀寫annotations；沒有以更鬆的工具數量斷言取代真發現。

50組正常／對抗表格由真正Node模組核對Python報告與Markdown，含45組固定seed隨機表格、空值、布林、負小數、半毫秒、BOM與Unicode空白、重複／重疊／單行界線、Unicode原文。空表格不假通過；10000未完成句count20000、blocking10000、明細200且截斷明示。直接來源深複製與界線、未知欄位／版本／路徑／非有限／物件／超量拒絕，controller晚成功／錯誤／目標改動／新請求勝出／report矛盾拒絕均通過。

跨語言測試抓到Python無效宣告仍留下total0，造成額外越界診斷，已resetNone後重驗。完整測試的舊6／11發現斷言與sandbox缺實際新模組已更新；既有晚歌詞回應保護繼續驗證，沒有改成空殼檢查。

真正CLI診斷保存exit2（存在待修正，不是字幕匯出成功），有效表格exit0；no-overwrite exit1與原檔保持。真JSON-lines／MCP壞request後有效與EOF，HTTP400後200／實際asset／defer依賴順序通過。browser真下載lyrics-review.json／md以CRLF→LF比較完整內容；CLI／MCP同payload兩檔bytes一致，JSON-lineswire同application，source時間留白與原順序保持。

## 真IAB 21項

1. 三句未完成建立標示三欄並focus第一句開始，不猜值。
2. Enter待辦定位原第三句結束。
3. 真HTTP檢查產schema1、全部source空白保持。
4. 後續編修過期舊報告、停下載／定位並清舊標示。
5. 有效但未排序的5／0／3開始仍保持原列順序。
6. 合成6秒音檔與10秒宣告分開，診斷不改時長。
7. 最終lyrics正常完整驗證，匯出排序0／3／5且保留總長10。
8. 重複開始列出雙方原句並focus第一開始。
9. 長句0–10跨到第三短句，4重疊項／全部3句受影響。
10. 宣告改5時focus原句結束，不裁切。
11. controlled current500保留最後有效report／source／media。
12. 四秒晚成功不蓋後續歌詞。
13. 四秒晚500不蓋後續start5.2。
14. 真schema999拒絕，保留上一份output及媒體。
15. 真有效check恢復、後續文字保持。
16. MCP診斷JSON不能當字幕匯入；原表格／report／media保持。
17. 390×844卡left16/right359、檢查按鈕224–342、問題按鈕53–225.2109375未出界，Enter建立focus原欄位。
18. 390px Enter待辦到原未標記欄。
19. 真0.25草稿schema3下載／實檔核對／明確確認，保留空白開始和後續文字，不存media／report暫態。
20. 121句count242、明細200／UI20按鈕，明示全部已檢查與截斷。
21. 空表格明示需修正、建立focus cue-add，不假通過。

最後error／warn查詢回空；ownedtab33／34關閉、override清除，managed兩服務正常shutdown／EOF。沒有截圖或完整視覺驗收；原創6秒WAV只留outputs，不進Git。

## 可還原與限制

起點main8121524cd9c3f832ffd59b54fff54cb2893e813d；codex/iteration-v0.25.0、restore-v0.24.0-before-v0.25.0。前版v0.24 ZIP543968bytes／SHA44ebe9fa6fb5ceb70464e7c83be75fea0bcc3b680cf2f4d46c0b2ea269637f14安全解壓後221Python／289JS通過、臨時目錄移除。指定commit ZIP重驗／SHA、privatePR合併／Release與遠端真下載由manifest和outputs/v25-qa收據核對。

Report schema不是完整歌詞包，timing_checked不是實聽通過；source有defaulttitle／null的明確預設，已填原值不改寫。UTF-8／JSON request2MiB，欄位budget2MiB與明細上限規格見LYRICS-REVIEW.md。獨立preview.html未改，本輪尊重file:工具政策、不嘗試或繞過；其原生播放／下載、正式歌曲實聽／完整視覺／AgentHost／其他OS與browser仍未完成。FreeTWAI未投稿或創始人核實。

非商用／private／ZOE. G署名與legal四檔保持，無其他本機／Git／記憶／vault參考。本輪只盤點本專案outputs／確定PID，最新三封裝SHA核對；未滿七天與使用者草稿／備份／媒體不清除。維護結果見inventory-final.json，滾動目標active。
