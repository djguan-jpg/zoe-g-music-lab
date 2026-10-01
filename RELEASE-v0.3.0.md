# ZOE. G Music Lab v0.3.0

歌詞編修後的播放預覽現在即時跟隨表格內容，舊音檔的非同步解碼結果不再覆寫新選擇的波形。加入可下載、回讀與撤回的專案草稿，方便分輪保存構思。

HTTP、CLI 與新本機 Agent JSON-lines v1 共用應用層。Agent 支援歌曲、分鏡、歌詞與選定 WAV 分析，回傳 id、結果及結構化錯誤；不自動呼叫模型、傳送素材或寫檔。產品、Agent 與草稿 schema 分別管理版本，保持既有 CLI 需求相容。

四個專案依使用者最新選擇採 **PolyForm Noncommercial 1.0.0**，一般商業使用沒有由本版授權。LICENSE 保留官方原文，NOTICE 揭露 ZOE. G 發起與 Codex 協作；不是 AGPL 授權。版本不改變匯入素材的許可，也不代表平台核實作者／創始人。

驗證：44 項 Python、4 項 JavaScript 測試；實際瀏覽器核對歌詞刪改、草稿下載／回讀／撤回／錯誤版本拒絕，以及四個工作台的原創合成案例。封裝從指定提交建立，解壓後重跑測試、JavaScript 語法及 Agent metadata，manifest 記錄 commit、SHA-256、每檔摘要。

保留 v0.2.0 與 restore-v0.2.0-before-v0.3.0 還原標記；分層、迭代與交接文件隨包交付。

限制：草稿不含音檔及成果，回讀後需重新選擇音檔並建立成果。未做正式作品評測、完整視覺／跨瀏覽器驗收或特定 Agent 平台接入；不提供 ASR、歌曲／影片生成、LUFS、true peak 或 MP3／FLAC 分析。手機寬度為 DOM 幾何驗證，沒有截圖視覺評審。此版仍屬 pre-release。
