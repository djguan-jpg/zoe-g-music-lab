# v0.132.0 交接與可逆

restore-v0.131.0-before-v0.132.0固定638efd5a39a992e36b43442a3a4154b11f664de1，分支codex/iteration-v0.132.0。由restore tag另建codex/restore-*及PR審閱還原；不rewrite main或已發佈tag，不覆寫私人草稿／素材、不撤銷平台投稿。

## v0.132.0 備份選取撤回

「分批備份選取清單」新增撤回最近一次成功的加入、整批加入、移出、整批移出或清空。清空後鍵盤焦點移到撤回；按鈕明示上次操作與可還原的版數。搜尋或讀取更多不清除紀錄；撤回後沒有更早一步或重做，下一次成功變更替換紀錄，無效／失敗操作保留紀錄。只改本頁選取，保存版本與已送出的備份來源保持。

backup-selection 純原值與完整 before／after metadata Map、順序及目前 capture 核對 → 注入控制器 → backup-selection-dom 字面提示／原生操作／焦點。每份最多1000版，私有最近一筆；完整核對來源、重複與已知版本矛盾後才還原，錯誤可修正重試。busy／disabled／disposed拒絕；pagehide釋放紀錄。只核對已捕捉metadata，不宣稱未載入資料的新鮮度或外部原子快照。

628 Python（75.438秒）、1647 JS（新增20）、143語法與四Skills通過；集中63。43完整DOM快照核對四台全部欄位、21列ID、目前成果全文與下載旗標、未保存提醒；另逐一切換四份成果，前後全文相同。41版清空→搜尋無結果→還原41、單版及整批移出撤回、下載後還原21而來源仍為10版、取消保留來源，以及單版／整批加入撤回通過。三尺寸1280×720／390×844／1280×360的Tab／Enter清空10→0→撤回10與焦點可達，頁面與提示沒有水平溢出。

82份合成草稿JSON hash保持。三份QA來源ZIP完整核對41／10／取消10版，原生選回舊41版不符、目前10版相符；這不是瀏覽器落盤下載檔。application／CLI／Agent／MCP／短命HTTP完整inspection一致，good-bad-good及200／400／200保持；選10版的record／draft原bytes相同，各次建立時間不同。原v131指定ZIP實際還原628／1627、376歷史交付原bytes及27組schemas保持。

產品132／唯一來源38–132共95版，未知133拒絕；20基本／啟庫27工具、Agent1／draft3／backup1與維護schema保持。app.js、下載器、Python domain與HTTP／CLI／Agent權限沒有變更。更正v131十二份概覽的focused51為實際43；已公開v131 tag／ZIP保持原樣。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg及四份submitted_unverified投稿保持。

一個受控QA server按原PID／creation identity正常shutdown、context close及deadline thread join，實際exec EOF；一個IAB頁已關閉、viewport reset，console warn/error0。六張PNG留忽略outputs/v132-qa，不嵌入對話。完整視覺／screen reader、瀏覽器保存檔、媒體身份／實聽／同步、Host安裝與平台正式創始核實仍未驗證。

# v0.132.0 操作 QA

流程：原創歌曲、四鏡分鏡及四句歌詞非空白 → 建立歌曲四成果 → 跨頁加入41保存版本 → 清空後切到無結果並撤回 → 單版／整批移出與撤回 → 固定10版下載期間切搜尋 → 下載後撤回到21但來源仍10 → 取消下一次下載 → 三尺寸Tab／Enter清空及撤回 → 原生選回舊／當前來源檔 → 單版及整批加入撤回。

Browser plugin unavailable，專案沒有Playwright workflow且不新增依賴；依frontend-testing-debugging使用已提供CUA的Playwright locators、唯讀DOM及viewport。URL為http://127.0.0.1:8875/，標題ZOE. G Music Lab · 創作工作台。43快照含四台原欄位與21列ID；四個成果另逐一切換前後讀取全部文字。一次getByLabel「成果檔案」沒有對應label，改用已觀察的#output-file原生select；產品沒有因此修改。

| 檢查 | 證據 |
| --- | --- |
| 頁面身份／非空白／無框架錯誤畫面 | 原生DOM與四台非空白欄位、完整四成果 |
| 互動／鍵盤 | 41清空還原、五種選取變更、busy與cancel、43完整快照 |
| Console | warn/error零 |
| 響應幾何 | 1280×720／390×844／1280×360，實際client width1265／375／1265；提示和清單未水平溢出 |
| 截圖 | 六PNG保存於忽略outputs/v132-qa，依使用者規則未嵌入；完整視覺接受未驗證 |
| 原文／草稿保持 | 四成果全文相同、四台全部值／列ID／dirty提醒相同、82 JSON SHA相同 |

三份canonical來源是QA server額外保留的合成ZIP（41／10／取消10版），完整CRC／canonical reader及descriptor SHA核對；原生選回舊41版match=false、當前10版match=true。瀏覽器download event10秒未提供path，沒有冒充實際保存檔，也未繞過下載管理頁限制。

628 Python（75.438秒）、1647 JS、新20／集中63、143語法／四Skills通過。原v131指定ZIP2473113 bytes、SHA9ce087cdffc9e883a5be7bfae4a3ddc469798c8ab512a0715d5093d901ca8bbf實際還原628／1627，指定暫存已移除。376歷史ZIP／manifest bytes及27 schemas保持；完整inspection五adapter一致、good-bad-good／200400200及CLI預設拒覆寫。20／27 tools保持。

一个受控server正常停止、context close／deadline join及exec EOF；一個IAB頁已關閉、viewport reset；短命HTTP thread join／子程序EOF。完整視覺／screen reader、媒體File身份、實聽／同步、Host安裝、保存落盤與平台正式核實仍未驗證。GitHub CI未設定。指定提交封裝、PR與Release實際asset回讀及final audit以outputs/v132-qa收據為準。


精確source、ZIP／SHA與合併／遠端assets以manifest和outputs/v132-qa/source-evidence.json、release-remote-evidence.json為準。每輪唯讀盤點本workspace outputs／direct封裝與typed same-host runs；strict>7日、exact tag／現場Git archive可重建且latest3外才列清除，沒有候選不刪；保留草稿、媒體、unknown、failed QA、v77 alternate及partial36／53。rolling goal仍active，繼續可重現功能、Agent與直覺／視覺品質的驗證。
