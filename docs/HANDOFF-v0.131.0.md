# v0.131.0 交接與可逆

restore-v0.130.0-before-v0.131.0固定c3487147af04d46001a393b791784ad66a9ce213，分支codex/iteration-v0.131.0。由restore tag建立codex/restore-*與PR審閱，不rewrite main或已發佈tag，不覆寫私人草稿／素材，不撤銷平台投稿。精確source、ZIP／SHA及GitHub實際asset bytes以manifest及outputs/v131-qa/source-evidence.json、release-remote-evidence.json為準。

## v0.131.0 移出目前顯示版本

備份清單新增「移出目前顯示版本」，按鈕顯示目前已載入版本與清單的交集版數。搜尋31版但只載入20版時，只移出這20版；尚未載入與其他已选版本保留。讀取更多後可再移出剩餘11版。空搜尋或無交集停用，保存版本原檔不刪除；需要補回時仍可使用「加入目前顯示版本」。

backup-selection純metadata核對／共用完整batch提案 → 注入capture controller → backup-selection-dom字面提示／原生按鈕／焦點。remove先核對整份displayed、retained與同批duplicate一致後才delete交集；late conflict、unselected duplicate conflict、getter／sparse／額外欄位全部拒絕且保持原清單。已滿1000版且顯示其他新版本時，加入可因上限拒絕，但合法移出仍可用；add與remove proposal分別派生。舊三欄caller缺displayed不能推定整庫，沒有新fetch、分頁、保存／恢復、Agent operation或持久欄位。

忙碌停用編選；成功移出後若原按鈕持有焦點且停用，回到可用的整批加入，再按Enter可補回。下載沿既有固定ID／完整串流與SHA；取消仍保留上一份來源。app.js沿v130既有libraryRecords注入，無diff；後端、domain、CLI／Agent／MCP及HTTP權限保持。

628 Python（75.422秒）、1627 JS、143 syntax與四Skills通過；新增16 JS，focused43。29完整DOM快照核對四台全部原值、21個stable IDs（歌曲6結構＋6段落／分鏡1母題＋4鏡／歌詞4句）、四份成果全文／下載旗標及dirty=true提醒保持。三尺寸1280×720、390×844、1280×360的Tab／Enter移出10→0→補回10及焦點通過，頁面／提示／清單無水平溢出。41合成版本82 JSON hash保持；三個canonical來源ZIP完整核對，舊41版檔不符目前10版、當前10版相符。

application／CLI／Agent／MCP／短命HTTP inspection完整回覆相同，good-bad-good與200／400／200；10版export完整record／draft bytes保持，各次實際建立時間不同，不宣稱整包bytes相同。第一次inspection輔助脚本廣泛字串替換將HTTP200誤改100，保留失敗helper並以新helper只修正oracle後通過；產品沒有因該錯誤變更。原v130指定ZIP2448724 bytes／SHA fd4299bf1f69491699d1e24c71629c48128e76d5b955798b77641b70baf855e5實際還原628／1611；372歷史交付ZIP／manifest bytes及27組schemas保持。

產品131／唯一來源38–131共94版，未知132拒絕；20基本／啟庫27工具、Agent1／draft3／backup1與維護schemas保持。ZOE. G／djguan-jpg、PolyForm Noncommercial1.0.0、本次既有公開授權與四份平台submitted_unverified保持；不重複投稿或宣稱官方核實創始人。

瀏覽器download event未提供保存path；本輪選回的是QA server同份合成來源ZIP，實際瀏覽器落盤仍未驗證。完整視覺／screen reader、媒體File身份、實聽／音畫同步、Host安裝與平台創始核實仍未驗證。六PNG只留忽略QA。兩個刻意按版本分開的有界server正常shutdown／context close／thread join且實際exec EOF；一個本輪IAB頁關閉並reset viewport。

# v0.131.0 操作與跨工具 QA

流程：保存版本分頁加入41版 → 搜尋甲31版、先載入20 → 移出20留下21 → 手動讀取更多 → 再移出11留下乙10 → 空搜尋保留10 → 固定來源下載、變更搜尋、取消 → 三尺寸鍵盤移出／補回 → 原生選回來源檔核對。

依frontend-testing-debugging技能執行目標flow、identity、nonblank、overlay／console、互動及響應核對。Browser plugin unavailable，專案無Playwright workflow且不新增依賴，使用已提供CUA原生DOM／Playwright locator與viewport。六張截圖保存在忽略outputs/v131-qa，依使用者規則不嵌入對話；完整視覺與screen reader驗收仍未完成。

29完整快照包含四台完整原值、歌曲12個結構與段落stable IDs、分鏡1母題／4鏡及4歌詞句，四成果全文／原下載可用狀態與dirty=true提醒全部相同。前輪v130的row selector未涵蓋article型分鏡；本輪用全部data-history-id讀取，不回寫前輪release/tag或沿用六段ID當全表證明。

三尺寸1280×720／390×844／1280×360：Tab從batch到bulk remove；Enter移出10版後focus add，Enter補回後focus batch。頁面、button、hint與14rem局部清單無水平溢出。busy41／busy10／搜尋變更期間及取消前，bulk add/remove、batch、clear、逐項移出均停用；cancel實際成功，上一份source／note／match保持。

41合成保存版本82 JSON在兩server phase前後SHA相同。三份canonical ZIP entries為41／10／取消10，完整CRC／canonical reader及descriptor SHA／bytes核對；原生選回舊41版match=false、當前10版true。這些來源由QA server額外保留，瀏覽器download event10秒無path，不能冒充瀏覽器已保存落盤。

628 Python（75.422秒）、1627 JS（新16）、143 syntax、四Skills；focused43。原v130指定ZIP2448724 bytes／SHA fd4299bf1f69491699d1e24c71629c48128e76d5b955798b77641b70baf855e5還原628／1611，限定暫存移除。4scope×93共372歷史ZIP／manifest bytes與27組schemas保持。完整inspection application／CLI／Agent／MCP／短命HTTP一致，good-bad-good與200／400／200；10版export完整records／draft bytes保持，CLI預設覆寫拒絕保留原bytes。

runtime_backup第一次失敗源於helper字串替換意外把HTTP200改100；保留helper/run，以runtime_backup2只修正該oracle後通過，產品無變更。兩版server按原handle正常停止、context close、deadline thread join且exec EOF；短命interop server thread join，子程序EOF。IAB本輪頁關閉／viewport reset，warn/error0。

媒體身份、實聽／音畫同步、Host安裝、完整視覺／screen reader、實際保存檔與平台正式創始核實未驗證。GitHub CI未設定。發佈前標準audit131direct entries、129完整＋2partial，無candidate或running/unverified；發佈後最終收據為準。strict>7days／exact tag／Git archive重建／latest3保持，草稿、媒體、unknown、failedQA、v77 alternate及partial36／53保留。


每輪唯讀盘點本workspace outputs／direct封裝與typed same-host runs；strict>7日、exact tag／现场Git archive可重建且latest3外才列清除。無候選不刪除，不終止外部程序。滾動goal仍active，繼續追可重現功能缺失與Agent／直覺／視覺驗證。
