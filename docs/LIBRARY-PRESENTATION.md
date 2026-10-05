# 保存搜尋位置 · v0.76

在「本機保存版本」輸入名稱，按「搜尋全庫」或Enter，再選擇保存版本。下方列出符合查詢的保存名稱、歌曲名、分鏡名、歌詞名，以mark標記字面位置。名稱文字保持原字元與空白；大小寫與Unicode不自動轉換。只顯示已保存的名稱摘要，創作正文與音檔仍需另行核對。選定版本須先預覽，再明確載入。

庫裡有可讀版本而搜尋零命中，提示改查詢或重新整理全部版本；真正沒有版本才顯示空庫。只有不可讀摘要時提示沒有可讀版本、保留原資料並核對原庫或備份。混合可讀／不可讀也明示不可讀數量，不把無法讀取當成不存在。未啟庫仍提示先在啟動時明確選定。

修改查詢會保留上一份結果，標題與mark繼續使用已接受查詢。等待或取消新搜尋也保留前次來源、有效預覽、編修與音檔；成功新搜尋才切換。重新整理成功後回到全部版本並收合命中細節。這些提示是本頁暫態，不是保存版本或備份。

## 分層與來源

musiclab/library_match.py與web/library-match.js共享四欄順序label/titles.music/titles.storyboard/titles.lyrics。先核對完整record、strict Unicode及原query，再作case-sensitive字面匹配。不trim、normalize、casefold、regex或讀正文。query仍1–200 Unicode codepoints/800UTF8 bytes；label最多200、各title最多120。span為Unicode codepoint起點與排他終點；同欄非重疊，由前一match終點接續。返回四欄完整原name/text及spans，Python/JS實際保存record與emoji/combining/CRLF交叉比較。

原library_search使用has_match，原browser search完整reply validator使用同JS model。metadata source hash、query cursor、排序、頁長、issues、search1及原四adapter保持，沒有新回覆欄位或操作。純matching重新核對既有bounded metadata；不新增草稿body I/O。Python metadata仍原library_contract UTC parser、browser仍原checkedMetadata Date字串契約，不宣稱所有非標準UTC拼法一致。

library-presentation.js只接收精確8欄enabled/mode/displayed_count/selected/search/issue_count/stale/pending。search精確原接受query、record_count、match_count、issue_count；counts/selected完整metadata/匹配一致才派生selection/library/search notes、matches、heading、more label與empty kind。app.onReady保留接受query與counts，onList清除search context；controls capture只讀這份context、原選項ID与原selectedmetadata，不讀editedquery重畫舊mark。counts最多1000，原search最新generation/來源核對仍由原controller處理。

library-presentation-dom.js先在detached fragment建立最多4列、最多560個mark，只用createTextNode/textContent、Unicode codepoint slices與固定元素。檢查失敗在提交前回報並保留既有DOM；固定節點缺失或I/O式錯誤不是交易式回滾。不解析名稱為HTML、不中斷焦點、不fetch、讀檔、建立媒體、保存草稿或自行執行模型。HTML字樣的原文測試與native DOM無img/script確認不代表通用外部HTML安全或來源作者證明。

固定index新增3個JS資產，server只列入固定asset表。match list tabindex=0/max-height16rem/overflow:auto，桌面名稱／原文兩欄，≤540px上下排列與原空白保留/anywhere換行。390px原生PageDown focus與scrollTop38.5/height256核對；DOM/鍵盤/console證據不等於完整視覺或screen-reader驗收。

## 版本與限制

產品0.76.0、交付來源38–76共39項，未知77拒絕；152個歷史文字ZIP/manifest與v75實際producer bytes一致。基本14／明確啟庫21工具，Agent1/draft3/library1/backup1/search1及既有交付schemas保持。無新依賴/model/auth/session/token/路徑/寫檔/公開權限。PolyForm Noncommercial1.0.0、ZOE. G/djguan-jpg/private、FreeTWAI not_submitted保持；保存搜尋或Git發布不證明平台創始資格。
