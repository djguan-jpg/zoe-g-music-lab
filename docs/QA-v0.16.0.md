# v0.16.0 驗證紀錄

2026-10-03 · 本機Windows／Python標準函式庫／既有Node／Codex IAB。僅本工作區合成資料及通用工具。精確commitZIP與遠端下載見manifest／outputs/v16-qa/release-remote-evidence.json。

| 檢查 | 實際結果 |
|---|---|
| 基線重現 | v0.15先預覽music brief、歌名改成v16-預覽後編修應保留、載入後變回樓梯間的回聲；modern草稿選檔即載入 |
| Python／assets | 146 tests通過，真正HTTP新增replacement-preview.js bytes等同來源；既有CLI／Agent／MCP／schema測試保持 |
| JS | 146 tests通過，新增25 tests：scope／全panels／原生File身份／clone／鍵序、晚成功／錯誤／取消／最新選擇、真正brief／library adapter、actual draft handler VM讀檔／modern／legacy／BOM／未知schema |
| 修正重現 | 相同步驟拒絕套用、新歌名保持；分鏡需求預覽後改片名亦拒絕並保留 |
| 作用範圍 | music需求預覽後改校時名稱及載入synthetic.wav，套用仍成功且校時／音檔保持；full draft預覽後再選同名synthetic.wav，拒絕載入 |
| 草稿預覽 | modern選檔先顯示檔名、標題、6段／9鏡／0句、完整待載入內容及影響；原表單與音檔未更改，取消保持；BOM可讀／unknown99拒絕 |
| Legacy | v2先顯示明確轉換與新增欄位說明；預覽後改校時名稱拒絕，重新選檔再明確轉換成功，原檔保持 |
| 真正Agent | JSON-lines v1 draft_save→本輪明確QA庫，product0.16.0；瀏覽器HTTP清單看到相同ID／名稱、預覽後改校時拒絕、新預覽明確載入9鏡／全草稿清除音檔、撤回保持原欄位 |
| 晚回應 | 4秒delay／受控500的brief驗證期間改歌名，晚成功不顯示preview，過期錯誤轉為保留內容提醒，新歌名保持；捕捉編修前／後皆為正在檢查狀態 |
| 實檔下載 | 草稿7293 bytes SHA256 4ed1bfc97552cd1ea31ce8d8ed6fd851ea1802b6c11c5c3a80a43eefe6cbfd95，draft3／tool0.16.0，panels等同Agent草稿；輸入SHA保持 |
| 實檔回讀 | 先改歌名v16-實檔回讀前編修、選下載檔後仍保留新歌名，只預覽；Enter明確載入原Agent歌名／9鏡 |
| 手機／焦點 | 390×844，documentWidth375、preview343px、textarea309×169px，無橫溢出；原Enter載入焦點BODY已重現，修正後BUTTON data-tab storyboard；viewport reset |
| Console／指引 | error／warn捕捉空，四Skill／十三JS語法／diff通過 |
| 前版還原 | v0.15 ZIP354392 bytes SHA256 bba16c9ae6138485ca240a514ffed4f67162be86ba082b5aa2b01192a7be78cc，entries／CRC／安全解壓原版146Python／121JS通過 |
| 程序 | 基線99545／291320與新版16556／299772 QA stop正常exit0／server_closed，tab18關閉／viewport reset；最後PID／8875及封裝／發布終態見inventory-final |

沒有截圖／完整視覺評審、其他瀏覽器／OS、正式作品／實聽／音畫與特定Agent host證據。File參照核對不證明外部磁碟原子快照；替換不猜測合併。Repo private、FreeTWAI未投稿／未核實創始人；使用者草稿／備份／媒體不進Git／封裝或Git重建清除候選。
