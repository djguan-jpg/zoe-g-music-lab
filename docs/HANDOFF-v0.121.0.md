# v0.121.0 交接與可逆

單鏡、單段與單句工具列現在顯示最後成功定位待辦的原位置、欄位、原因及關聯列，讓長表格編修時也能知道正在處理什麼。純 issue-summary 只格式化有界嚴格 JSON metadata；三個 DOM adapter 共用清單與工具列文字，在來源失效、busy、隱藏、無選列、未定位或新 revision 時清除說明。回復精確來源可恢復上一個成功位置；不因手動焦點改動重寫 cursor。說明換行後由 app 重新量測活動欄位，僅對已活動的原欄位調整捲動，不重新聚焦其他控制。實際窄畫面發現單鏡長待辦按鈕造成31px溢出，改為有界換行；空鏡頭選列也停用清單與 cursor。新增一個固定 GET asset，沒有新 operation。產品121／唯一交付policy38–121共84，未知122拒絕；20／27 tools、旧27組schemas、Agent1／draft3與其他domain保持。

619 Python（100.000秒）、1484 JavaScript、137 syntax、4 Skills與diff通過；新增31 JS、0 Python。上一版v120指定source ZIP（2223876 bytes、SHA 8f68ce674539114811517e1faea16460a7b04231cf4150a0c1482e7731194052）實際還原619／1453，暫存還原移除。四scope×83個歷史producer的332份ZIP／manifest bytes保持；舊27組operation input/output schemas與20／27 operations集合相同。八份whole lyrics Python data／files、JS data／Markdown與跨語言診斷相同，只更新產品meta。31新測試含Unicode／首尾空白／literal HTML、exact keys、getter不讀、hidden／symbol拒絕、容量、stale／busy／hidden／empty selector、false／throw focus、新revision／零待辦與exact restore；app原函式VM驗證toolbar增高後只移活動欄位，adapter layout錯誤保留已成功cursor。

原生39份快照，31組完整草稿只排除saved_at比較，加3組刻意換台的完整panels比較。17個清單／mouse／native Enter診斷定位与4個追加排版定位通過。221句合成資料：原句220有2→1→0項，原句221有220關係／200保留明細，20→21跨頁後說明按原global位置一致；無效作品時長定位全局宣告。歌曲第40段的五項待辦與鏡頭2的開始／母題引用／人物狀態均顯示與清單相同的字面說明。busy、未定位、來源編修與換台隱藏清除說明；原值、stable IDs與選列精確回復恢復舊cursor，手動名稱欄焦點及返回導覽按鈕不被搶走。原生File身份、暫停0.5秒／總長8秒合成WAV、其他工作台與原文保持，console warn/error零。

排版補驗6份唯讀快照：390×844原頁寬421，實際溢出者為單鏡母題診斷button；scoped max-width／white-space／overflow-wrap修正後頁寬375，長診斷文字完整換行。390×844、720×900、1280×360再驗母題與人物狀態，沒有橫向溢出、原panels一致；活動欄位在viewport內且低於可見sticky工具列，低高度回static。首輪未修CSS的窄分鏡失敗證據保留，不能作為通過證據。PNG留忽略QA目錄，幾何與實際輸入不代表完整視覺或screen reader接受。

四組CLI input與原draft3句號220／221的exit2／2／0／2，完整files依各自原payload bytes一致；重覆輸出exit1保留原bytes、invalid／missing row／input row override拒絕且不建輸出。Agent／MCP四組good-bad-good與12筆短命HTTP完整回覆一致；native四份回覆count2／1／0／220，五個固定JS GET與原bytes相同。JSON鍵序不作來源證明。所有子程序取得EOF；兩個owned有界QA server正常停止，另HTTP thread正常join；兩個owned瀏覽器tab關閉／viewport reset。

首批31 focused測試7失敗：一個揭露單鏡empty selector尚可移cursor的實際缺陷，已修正；六個為cue合成測試錯用visual而非start的fixture，修正後31全過。首批完整JS的一個歷史版本數量仍寫83，改為84後1484全過。合成草稿首批motif ID不符motif-N，未載入瀏覽器，改為motif-1後validate_draft通過。追加layout helper第一次被JSON字串序列化，Python僅讀到字串，exit0但未建立server身份；改用exclusive raw source的新helper後才啟動第二phase，沒有把空輸出算server完成。唯讀證據彙整曾把3組跨台panels比較併入完整draft計數；另留修正證據，正式採31＋3，不覆蓋原紀錄。

Skills章節更新第一次插在frontmatter第一行之後，提交前quick validator拒絕YAML；沒有建立source commit。以本工作區上一版四份原frontmatter還原，在正式heading之後插入新章節，四份重新驗證通過才提交。

分支 `codex/iteration-v0.121.0`、基線main `670977695ef74f7b835dac6d94a5f65d1ac53180`、還原tag `restore-v0.120.0-before-v0.121.0`。由tag建立codex/restore-*分支經private PR還原，保留main歷史、原素材與草稿。固定source commit建立ZIP／SHA；merge tree、四個遠端refs與實際release兩個asset下載bytes另留outputs/v121-qa。GitHub CI未設定，測試為本機與封裝版實際檢查。

本輪只唯讀盤點本workspace outputs、直接release封裝與typed owned runs；最新121／120／119三版保護。嚴格超七天且exact tag／Git archive可重建才列清除候選，未知檔、素材、草稿、備份、失敗36／53及失敗QA保持。取得各session實際EOF後再做最終稽核，不以bare PID終止外部程序。瀏覽器保存下載、完整視覺／screen reader、實聽／實際音畫同步、Host安裝與FreeTWAI創始接受未驗證。PolyForm Noncommercial 1.0.0／private、創辦ZOE. G／GitHub djguan-jpg保持，FreeTWAI not_submitted。

見[契約](ISSUE-SUMMARY.md)。
