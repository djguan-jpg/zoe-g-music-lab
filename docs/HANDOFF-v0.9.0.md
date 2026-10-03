# v0.9.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接在 docs/HANDOFF-v0.8.0.md。

## 還原與 Git

- 分支 codex/iteration-v0.9.0；起點 55c36efb55aea301410236d315ebe69b608ee66c。
- 開工還原點 restore-v0.8.0-before-v0.9.0；v0.8.0 tag／封裝保留。本輪核對 v0.8 ZIP 摘要、解壓後 62 Python／38 JavaScript 通過。
- 指定提交 ZIP 解壓驗收後以 private PR 合併，v0.9.0 tag／Release 附 ZIP／manifest。精確提交、SHA-256 及合併結果以 manifest／遠端實際狀態為準，本文不是合併證明。

先保存未提交內容；可 git switch -c codex/restore-v0.8.0 restore-v0.8.0-before-v0.9.0，或 git archive --format=zip --prefix=zoe-g-music-lab/ --output=outputs/v0.8.0-restore.zip restore-v0.8.0-before-v0.9.0，解壓至新目錄。回寫 main 使用 revert／PR，保留歷史。

Git restore tag 只保護原始碼，不備份使用者草稿庫。需回到舊程式時先另行備份所選草稿庫，保留 v3 JSON 匯出；舊程式沒有草稿庫操作，不會幫你保存或遷移那些資料。

## 分層與契約

contracts/draft-v3.json 提供共同最新草稿欄位／列容量／選項；draft_contract.py 做 Python 形狀檢查、canonical UTF-8、瀏覽器 asset 與 discovery schema；editor-state.js 使用同一契約。未完成數值字串／多行原文可保存，不代表創作或時間驗證。

draft_library.py 是明確注入的本機保存層；每版為唯一 ID 目錄、draft.json 與 record.json，前者摘要／大小由後者記錄。先驗證再 staged／flush／fsync／rename；同 ID 相同內容與名稱重用，不同內容拒絕。只清理本次暫存的兩檔與空目錄，不提供刪除／覆寫 API。Windows 目錄別名改以 samefile 核對；程序間鎖保護容量及發布，上限 1000 版，每版 1 MiB。read 核對形狀與摘要，list 只讀 metadata，每頁 20、上限 100。

application 接受 optional library；未注入時各 transport 仍只有原有四操作。HTTP、CLI、JSON-lines、MCP 都呼叫同一保存層，JSON 不能提供任意磁碟路徑。MCP draft_save readOnlyHint=false，其他草稿操作為讀取；沒有新依賴／認證／model call。

draft-library.js 處理點擊時的不可變快照、未知結果同 ID 重試、latest list/read、取消；app.js 負責保存清單、預覽／明確套用與下載。未知保存結果不丟掉原內容重試，晚編修保留並提示；放棄只清除頁內重試狀態。預覽保留表單／音檔；明確套用捕捉當下草稿以便撤回，整份載入清除刪除紀錄及音檔選擇。

產品 0.9.0；Agent 1／MCP 2025-11-25／草稿 3 不變，保存紀錄 schema 1 另行管理。未知版本拒絕，不遷移。HTTP 與 Agent 啟動參數為 --draft-library，CLI 為 draft save|list|read --library；不指定目錄不啟用。launcher 只產生可審閱設定，不修改 host 或啟動服務。

## 驗證、授權及接續

77 Python／47 JavaScript／四 Skill、五 JS 語法與 diff 檢查通過。實際保存後回應失敗／重試一版、重啟、Agent 寫入／23 版分頁、JSON 下載往返、未完成字串、毀損保留、桌面／390px DOM 驗證見 docs/QA-v0.9.0.md。指定提交封裝解壓再跑全部測試／Agent metadata／MCP 握手。

維持 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 不變，創辦署名 ZOE. G／GitHub djguan-jpg，AI 協作如實記錄。只讀本次工作區及通用工具指引，沒有其他個人專案／記憶／素材／秘密或第三方程式搬入。

下一輪可優先正式 Agent host 接入、草稿備份／恢復流程、正式作品及完整視覺測試，須保持明確啟用與使用者資料保留。特定 host、POSIX、跨瀏覽器／完整視覺／正式作品、媒體生成／ASR／LUFS／true peak 尚未驗證；不以單輪交付宣稱滾動目標完成。FreeTWAI 公開決策未確認；Repo private，未投稿或取得平台創始人核實，沒有更動 live data。

## 產物與程序

只盤點本工作區 outputs。v09-qa 保存合成草稿庫、受控失敗 helper、下載、前版還原、checks 與 inventory／遠端證據；它們不進 Git／ZIP。實際測試有 24 個合成保存版本，原使用者 outputs/drafts 沒有被建立。使用者草稿庫是不可由 Git 重建的資料，不列入封裝清理；需另下載／備份，不自動刪除。

保留最新三版 v0.7／v0.8／v0.9，其他不足七天產物保留。本輪無已驗證清除候選／素材刪除，最終 inventory 記錄實際數量。只有過七天且可由本專案 tag／已驗證遠端備份重建者才可列清除候選，不清理其他專案或未確認程序。

HTTP exec 63152／23420／81203 已 Ctrl+C 退出（exit 1）；8875 監聽數 0。測試頁 9 關閉、viewport reset。Agent／MCP／測試為 bounded／EOF 結束，未留下持久服務或背景監控。
