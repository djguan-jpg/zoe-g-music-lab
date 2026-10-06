# v0.125.0 交接與可逆

接受條件草稿下載旁新增「核對下載的條件草稿」。成功送出後可選回本次完整 JSON，以共享純 UTF-8 位元組核對確認該次保存快照；條件原值、工作台、列ID、媒體及既有報告保持。核對舊送出稿只確認它當時的條件，後來編修仍需另存；新的成功送出即使內容相同也使舊讀取失效。原本「已確認條件草稿檔案」按鈕保留。

既有純 audio-acceptance 保存模型不變；DOM adapter 只在 downloadText 成功後保留完整送出文字／遞增 revision，注入共享 text-verification controller／原生 File adapter，容量64 KiB在 arrayBuffer 前核對，沿 busy／visibility／latest／pagehide／dispose 保護。來源不取預覽或後來編修；失敗下載保留上一份有效來源。核對無需條件數值可解析，但分析仍完整驗證；BOM、重排、缺尾、同長錯文字、未知版本與額外欄位只要 bytes 不同就不確認。核對不是載入來源，不套用外部 JSON，也不改音檔。

原生測試重現核對選檔的 input 被通用 editor listener 視為編修，導致未改條件的報告過期。新 File 控制明確標示 data-view-control="verification"，重用既有唯讀排除；實際條件 input 仍照常標過期。沒有新增固定 asset、operation、POST、依賴、模型、外網或路徑權限。產品125／唯一policy來源38–125共88，未知126拒絕；20／27 tools、27組schemas、Agent1／draft3與獨立domain schemas保持。

619 Python（89.157秒）、1551 JavaScript、138 syntax及4 Skills通過；新增19個JS測試。focused65項是新增最後一項之前的實際結果；最後以完整1551為準。覆蓋未送出、未完成條件原文、Unicode／空白、同長錯bytes、BOM／排版／缺尾／未知版本／額外欄位、改檔名、64 KiB預讀拒絕、busy／隱藏／late／新送出／讀取失敗與retry、手動確認、載入checkpoint／預覽／媒體保持、dispose及實際editor input listener不誤標報告。

v124指定source ZIP（2308909 bytes，SHA a398767b3bc28b116715304321de8f62a08c2c37b94dbc3b7db743c6bcbd32d3）實際還原619／1532；四scope×87版的348份歷史ZIP／manifest原bytes相同，27組schemas保持，八份whole lyrics跨Python／JS診斷保持。既有合成歌詞request與本輪原生可見的完整合成條件報告，分別和application／CLI／Agent／MCP／短命HTTP完整回覆相同；good-bad-good及200／400／200通過，CLI2、重覆輸出1保留原bytes、無效資料拒絕且無輸出。四個固定GET JS原bytes相同。指定source封裝器會另驗解出原始碼，結果以manifest為準。

原生先保留兩份失敗快照，修正input排除後另保留18份完整快照及18份報告操作旗標。六組功能前後核對完整panels／條件／成果及旗標：超限與同長錯檔仍可下載原報告、舊送出稿確認後新編修仍需另存、舊檔無法確認新送出、相同JSON語義但不同欄位順序仍拒絕、最新canonical檔成功確認。三組1280×720／390×844／1280×360前後完整值與列ID相同，長錯誤檔名在頁寬內、沒有水平溢出，Tab可達載入條件控制。原生8秒合成WAV的File身份保持；本輪未實聽或檢查播放時刻，console warn/error零。PNG留忽略的本機QA，未作完整視覺／screen reader接受。

瀏覽器下載事件等候10秒沒有回報檔案路徑，選回的232／228 bytes是依可見原值獨立構造的合成probe，不是實際下載。第二份probe因欄位排序和canonical送出bytes不同而正確拒絕，保留它，另建正確canonical檔才取得成功；不把語義相同冒充完整文字相同。原生input錯誤與首輪JS oracle length87失敗均保留；HTML排除修正、oracle改88與最後新增input測試後完整JS1551通過，未再改Python而保留同次619成功結果。

分支 codex/iteration-v0.125.0；基線 main 80e606ec5f73ffc850244ffe562ff18675da6d71；還原 tag restore-v0.124.0-before-v0.125.0。由tag建立codex/restore-*分支與PR可還原原始碼，不變更私人草稿／素材或外部投稿。創辦ZOE. G、GitHub djguan-jpg與PolyForm Noncommercial 1.0.0保持；不授予AGPL或商用許可。Repo已獲明確授權公開；本次登入頁確認GitHub已連結djguan-jpg，四份ZOE. G介紹仍在社群書架；作者身分仍自行聲明、尚未核實，不重複提交。

一個owned有界QA server經exact recorded身份正常shutdown並確認實際session EOF；兩次短命HTTP thread正常join，CLI／Agent／MCP EOF。一個owned本機QA瀏覽器tab關閉、viewport reset；平台查閱使用既有會員tab，不關閉使用者tab。不終止外部程序。發佈後唯讀稽核本workspace outputs、直接封裝及typed runs，保護最新125／124／123三版。只有嚴格超七天且exact tag／現場Git archive可重建的完整封裝才列候選；草稿、備份、素材、未知、失敗36／53及QA保留。無候選不清除。source提交、兩個release assets實際下載bytes／SHA及最後稽核以 outputs/v125-qa 成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。本輪為滾動goal的一版進展，goal仍active。
