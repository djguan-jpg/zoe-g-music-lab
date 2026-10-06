# 選定歌曲段落報告（v0.116）

在歌曲工作台選擇「要調整的段落」，按「檢查選定段落」可在本頁定位五欄待辦；按「建立單段報告」則明確建立 JSON 與 Markdown 成果。後者也可由 CLI、Agent、MCP、HTTP 呼叫。診斷原第1–40段，不受整首200明細上限影響；不改原欄位、順序、媒體或其他工作台。零待辦仍 needs_review=true，不是整首總長、編曲、實唱／實聽、素材權利或成片接受。

## 共用領域與來源

music_review.source 先核對完整 raw draft3 music panel，包括40段、兩個100清單、嚴格JSON值／Unicode及8MiB來源上限，再核對原row。music_review._analyze 共用既有 required／numeric 診斷；整份 report 的 keys、data 及檔案bytes保持，選定分支只計算名稱、小節、能量、敘事任務與聲音配置。其他段落、全域 BPM／拍數等未在此報告驗證。原字串、列號、順序保持；row不可bool、非整數或超實際段數，wire schema要求integer。

獨立 zoe-music-section-review schema1 保留 status、row、total_sections、source.section五欄、issue_count、最多5 issues、details_truncated=false 與固定兩則review_notes。JSON最多256KiB，超限拒絕，不截斷原來源；未選定大欄位不搬入報告，但仍須符合完整來源上限。兩檔固定music-section-review.json／music-section-review.md；Python／JS完整語義與Markdown bytes跨語言核對。domain不讀路徑、媒體、模型或網路。

## 完整回覆與請求

web/music-section-review.checkedResult先核對完整自有JSON值、root data/files/meta精確鍵、product version／Agent protocol／needs_review，再派生本次來源的完整report並核對兩檔名、嚴格JSON語義與字面Markdown。損壞meta、未知版本、缺檔、錯來源、非JSON值或超限拒絕；不執行回覆文字。來源proof保留原row／total_sections、選定五欄、完整stable ID順序與selected identity；不能修改proof payload以同文字另一段繞過原列核對。

readiness-request.createController是注入source／checkedResult／request／onReport／onError／onStale／onState的共用純請求層。序號、外層current、source proof隔離成功／錯誤／pending；cancel／invalidate與舊finally不能結束新請求。storyboard-shot-request只包裝既有單鏡checkedResult，公開API保持。controller沒有DOM、timer、實際transport、持久狀態或權限；app注入既有loopback API並在成功核對後提交literal DOM與成果。

本頁的五欄待辦只核對選定內容，其他段落或全域欄位合法編修可保留定位；明確報告請求仍沿app整個music revision，處理期間任何歌曲編修都拒絕晚回覆。編修把上一份成果標dirty並停下載；重新本地檢查不能把舊成果變成新成果。busy／hidden在DOM操作時重查；換台與返回保留raw draft、File和成果。兩個按鈕在窄editor內換行。暫態proof／pending／IDs／report不進draft3或保存庫。

## 四個adapter

application新增唯讀 music_section_review，payload精確 `{panel,row}`。CLI `music-section-review --input INPUT --out DIR` 讀完整來源；或 `--draft DRAFT --row 40 --out DIR`，原draft3保留。--input不得另覆蓋row，--draft必須明確row。待辦exit2、零待辦exit0、錯誤exit1；輸出預設exclusive create，原檔不覆寫。Agent／MCP回完整兩檔且needs_review=true；有明細不改wire為錯誤。HTTP新增 `/api/music-section-review`，仍沿既有有界請求／來源限制；固定GET `/readiness-request.js`，其餘assets既有。

19基本／明確啟庫26工具，新增工具需重新discovery；原25組input/output schemas逐組保持。section-review1、shot-review1、Agent1、draft3與交付schemas獨立；唯一delivery-versions policy38–116共79，未知117拒絕。沒有新依賴、登入、金鑰、模型、媒體生成、外網、任意路徑或寫入權限。

PolyForm Noncommercial 1.0.0／private，創辦ZOE. G、GitHub djguan-jpg。FreeTWAI not_submitted；SHA、Git提交與報告不能證明作者權利或平台創始接受。驗證與還原見[QA](QA-v0.116.0.md)與[交接](HANDOFF-v0.116.0.md)。
