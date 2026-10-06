# v0.126.0 交接與可逆

草稿庫備份旁新增「核對下載的備份 ZIP」。成功送出後可選回本機檔案，先核對1 byte至32 MiB容量，再以完整檔案SHA-256及大小核對本輪備份。來源只保留bytes／摘要／版本數；不持有完整備份，不恢復、載入、保存版本或确认未保存編修。新的成功送出遞增revision，即使內容相同也使舊讀取失效；下載失敗保留上一份來源。舊ZIP不能確認新ZIP。

純backup-verification嚴格原值模型、注入controller、原生File DOM adapter與原有backup-download sender分層。讀取與hash後重查本輪source／revision／busy、完整ArrayBuffer大小與選檔metadata，latest／cancel／pagehide／dispose保護晚回覆。原始32 MiB可完整核對；超限在arrayBuffer前拒絕。同大小錯bytes、短讀及來源失效保留原工作台、成果、列ID及草稿庫；選檔標為verification view control，不誤觸編修。單獨純verificationAllowed避免availability refresh寫入library訊息。

只新增三個固定GET JS資產；原備份domain／CLI／Agent／MCP／HTTP POST權限及schemas不变。20基本／啟庫27工具、27組schema、Agent1／draft3與backup1保持。產品126與唯一policy明確來源38–126共89版，未知127拒絕。PolyForm Noncommercial 1.0.0、ZOE. G及公開授權保持；四份自由工坊投稿已送出，創始身分仍submitted_unverified。

619 Python（90.875秒）、1568 JavaScript、141 syntax與4 Skills通過；新增17個JS測試、focus29項。覆蓋strict descriptor／getter拒絕、未知欄位／符號、Unicode basename、空庫metadata、大小與SHA雙核對、32 MiB最後一byte與預讀超限、無來源／busy／讀取與hash晚回覆／來源revision失效／cancel／dispose／短讀／metadata漂移／失敗retry、成功下載才留來源及availability純callback。沒有新增依賴。

v125精確source ZIP（2331451 bytes，SHA 1a34371e4887a4366708f3b8de0c82a02263f41d388697f76d463eb6774a24a4）實際還原619／1551。四scope×88的352份歷史ZIP／manifest原bytes保持，27組schema保持、八份whole lyrics跨Python／JS診斷保持。既有歌詞request与本輪QA server產生的3680-byte合成備份，在application／CLI／Agent／MCP／短命HTTP完整成功回覆相同，good-bad-good、200／400／200保持。備份僅inspect，未restore，三份合成版本六個原檔hash不變。

Chrome實際核對保留七份完整panels／所有17個row或清單ID／成果／dirty／library快照；六組前後全值相同、原歌曲四個成果下載仍啟用。同大小錯檔、32 MiB+1、舊source對新送出拒絕，兩次最新source成功。Chrome viewport API雖回應成功，DOM仍1920×919；該三次快照未當成三種尺寸驗收。另用in-app本機QA頁實際核對1280×720／390×844／1280×360：完整原值／列ID保持，摘要與Unicode錯檔名在頁寬內，沒有水平溢出，Tab可達備份匯入控制。兩個QA頁warn/error零，兩套暫時viewport均reset；PNG只留忽略QA，不宣稱完整視覺或screen reader驗收。本輪未選音檔，不宣稱native media身份驗證。

第一次原生下載事件等候10秒未取得檔案路徑。瀏覽器安全政策拒絕chrome://downloads/，未繞過；僅關閉本輪建立的空白頁。選回的三份canonical備份為QA server額外保存的同一份合成來源bytes，明確不是瀏覽器落盤下載。第一phase正常停止並觀察exec EOF；第二phase專為記錄合成source，不因延遲重啟或重送。兩個phase均正常停機、thread join／context close／實際exec EOF，三份合成版本原bytes保持。三個本輪QA tabs全關，會員與公開介紹頁保留。

來源提交、封裝器抽出精確source再檢查與遠端asset實際bytes/SHA，以本輪成功收據／manifest為準。仍未驗證實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。

分支codex/iteration-v0.126.0；還原tag restore-v0.125.0-before-v0.126.0固定e0d19479cf6b950ba5a032e992ced214ee9e6594。需還原時另建codex分支審閱，不覆寫現有草稿庫；Git不能撤銷外部投稿或公開狀態。採精確source提交封裝、PR審查與合併，公開prerelease連同ZIP／manifest逐byte回讀。

每輪唯讀稽核本工作區outputs、直接完整封裝和明確same-host run記錄。最新三版126／125／124保護；嚴格超七天、exact tag／現場Git archive可重建的完整封裝才列候選。草稿、备份、素材、未知檔／失敗36與53／QA證據保持，不因版本舊直接刪除，無候選不清除。不清理其他專案或未確認程序。本輪實際終態與SHA見outputs/v126-qa成功收據。滾動goal仍active，本輪為進展。
