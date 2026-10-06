# 草稿變更工作台 v0.124.0

專案草稿的保存提醒新增變更工作台清單。尚未確認任何保存版本時，比對起始範例；已確認載入檔案、本機保存版本或下載草稿後，比對最近一次完整確認的內容。四個名稱固定依歌曲設計、母題分鏡、波形校時、交付檢查排序。還原一台的原值，該台退出清單；精確符合任何仍保留的完整版本或起始範例時，整份草稿維持既有已確認判定。

draft-retention 既有 checkpoint／注入 guard只新增隔離的 difference DTO（reference＋panels）；獨立 draft-difference 純模型嚴格核對列舉、最多四台、唯一／完整資料屬性後產生固定文字，app只更新提示 textContent／hidden。待確認下載不能替換參考；確認舊送出快照後，後續編修仍dirty。拼接不同保存版本的工作台片段仍需整份另存。原稿、列ID、媒體、成果、下載／本機保存流程與 beforeunload 原判定保持；摘要不帶原文／fingerprint／File／路徑，不進 draft3／Agent wire。新增一個固定GET JS，不新增 operation、依賴、模型、外網、登入或寫檔權限。產品124／唯一policy來源38–124共87，未知125拒絕；20／27 tools、27組schemas與獨立domain schemas保持。另修正根目錄 HANDOFF.md 的過期首頁版號。

分支 codex/iteration-v0.124.0；基線 main e3d30319a28fd6ee5a78354ca6bd33301222f8d9；還原 tag restore-v0.123.0-before-v0.124.0。由tag建立codex/restore-*分支與PR可還原原始碼，不變更私人草稿／素材或外部平台投稿。創辦ZOE. G、GitHub djguan-jpg與PolyForm Noncommercial 1.0.0保持；不授予AGPL或商用許可。Repo已獲明確授權公開；四份FreeTWAI介紹頁先前已建立，作者／創始身分仍submitted_unverified，本輪不重複提交。

本輪一個owned有界QA server經exact recorded身份正常shutdown並確認實際session EOF，CLI／Agent／MCP EOF及短命HTTP thread正常join；一個owned本機瀏覽器tab關閉、viewport reset。發佈後唯讀稽核本workspace outputs、直接封裝及typed runs；保護最新124／123／122三版。只有嚴格超七天且exact tag／現場Git archive可重建的完整封裝才列候選；草稿、備份、素材、未知、失敗36／53及QA保留，不終止外部程序。無候選不清除。source提交、兩個release assets實際下載bytes／SHA及最後稽核以 outputs/v124-qa 成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。本輪為滾動goal的一版進展，goal仍active。
