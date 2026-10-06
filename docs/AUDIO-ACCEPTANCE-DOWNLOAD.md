# 條件草稿下載核對 v0.125.0

接受條件草稿下載旁新增「核對下載的條件草稿」。成功送出後可選回本次完整 JSON，以共享純 UTF-8 位元組核對確認該次保存快照；條件原值、工作台、列ID、媒體及既有報告保持。核對舊送出稿只確認它當時的條件，後來編修仍需另存；新的成功送出即使內容相同也使舊讀取失效。原本「已確認條件草稿檔案」按鈕保留。

既有純 audio-acceptance 保存模型不變；DOM adapter 只在 downloadText 成功後保留完整送出文字／遞增 revision，注入共享 text-verification controller／原生 File adapter，容量64 KiB在 arrayBuffer 前核對，沿 busy／visibility／latest／pagehide／dispose 保護。來源不取預覽或後來編修；失敗下載保留上一份有效來源。核對無需條件數值可解析，但分析仍完整驗證；BOM、重排、缺尾、同長錯文字、未知版本與額外欄位只要 bytes 不同就不確認。核對不是載入來源，不套用外部 JSON，也不改音檔。

原生測試重現核對選檔的 input 被通用 editor listener 視為編修，導致未改條件的報告過期。新 File 控制明確標示 data-view-control="verification"，重用既有唯讀排除；實際條件 input 仍照常標過期。沒有新增固定 asset、operation、POST、依賴、模型、外網或路徑權限。產品125／唯一policy來源38–125共88，未知126拒絕；20／27 tools、27組schemas、Agent1／draft3與獨立domain schemas保持。

分支 codex/iteration-v0.125.0；基線 main 80e606ec5f73ffc850244ffe562ff18675da6d71；還原 tag restore-v0.124.0-before-v0.125.0。由tag建立codex/restore-*分支與PR可還原原始碼，不變更私人草稿／素材或外部投稿。創辦ZOE. G、GitHub djguan-jpg與PolyForm Noncommercial 1.0.0保持；不授予AGPL或商用許可。Repo已獲明確授權公開；本次登入頁確認GitHub已連結djguan-jpg，四份ZOE. G介紹仍在社群書架；作者身分仍自行聲明、尚未核實，不重複提交。

一個owned有界QA server經exact recorded身份正常shutdown並確認實際session EOF；兩次短命HTTP thread正常join，CLI／Agent／MCP EOF。一個owned本機QA瀏覽器tab關閉、viewport reset；平台查閱使用既有會員tab，不關閉使用者tab。不終止外部程序。發佈後唯讀稽核本workspace outputs、直接封裝及typed runs，保護最新125／124／123三版。只有嚴格超七天且exact tag／現場Git archive可重建的完整封裝才列候選；草稿、備份、素材、未知、失敗36／53及QA保留。無候選不清除。source提交、兩個release assets實際下載bytes／SHA及最後稽核以 outputs/v125-qa 成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。本輪為滾動goal的一版進展，goal仍active。
