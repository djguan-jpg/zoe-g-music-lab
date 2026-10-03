# v0.15.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接保存於 docs/HANDOFF-v0.14.0.md。

## 還原與 Git

分支 codex/iteration-v0.15.0，自 main f33800394a1bdbfd9410a9bb7105a1fbc1e0648b 開始；restore-v0.14.0-before-v0.15.0 指向該起點。前版 v0.14 ZIP 336100 bytes、SHA-256 35aa2ff80e43dce91ad556a7c22fffb316e0c88fd21222dfeb3ebb8f3887abe5，核對／安全解壓原版136 Python／109 JavaScript通過。

指定提交ZIP解壓驗收後以private PR合併並建立v0.15.0 tag／Release，source commit／tree／ZIP SHA／遠端下載以manifest與outputs/v15-qa/release-remote-evidence.json為準。先另存未提交改動，再用 `git switch -c codex/restore-v0.14.0 restore-v0.14.0-before-v0.15.0` 或git archive至新目錄；回寫main用revert／PR，不reset／強推。Git tag不保護草稿、備份或素材，資料另存可靠位置，不隨版本回退覆寫／遷移。

## 分層與行為

musiclab/storyboard_seed.py 將生成／檢查共用 timing_slots 與 seed_files。生成仍重用歌曲驗證；檢查只接受seed，與music／fps／bars_per_shot互斥。validate_seed 核對固定速度來源、整小節、毫秒時刻、影格及任務；未知版本／狀態／假設、未知欄位與不一致資料拒絕，沒有靜默修復或丟棄創作擴充。原檔不改寫，不捏造完整歌曲brief。

application／CLI／HTTP／JSON-lines／MCP共用檢查；CLI `storyboard-seed --seed FILE --out NEW_DIR`，保留BOM讀取與不可覆寫。工具schema明示二種互斥來源，預設五工具／啟庫十工具保持，產品0.15.0與Agent1／seed1／draft3／MCP2025-11-25／library1／backup1分開。

web/storyboard-seed.js 處理最多1MiB JSON、來源／metadata／真正JSON檔核對、最新任務與目標指紋。檔案起稿只依賴分鏡，讀取期間與預覽後修改其他工作台或起稿設定仍保留；目標分鏡修改則拒絕晚回應／套用。歌曲生成仍核對歌曲／分鏡／設定。app.run明示storyboard scope；inputIndependent只管理成果過期狀態，不進草稿契約。已檢查檔案成果跨頁與歌曲編修後仍可下載。

局部套用／撤回只替換分鏡片名／時長／FPS／全部shots；保留視覺基調／人物設定／母題清單／其他工作台與音檔。畫面、運鏡、轉場、母題與人物狀態留白；不是已完成MV。全草稿載入仍需另選音檔。文字安全呈現，不執行標題中的HTML。瀏覽器JSON會正規化數字表示與換行，核對語意相等，原輸入保留。

## 驗證與限制

146 Python／121 JavaScript、四Skill／十二JS語法／diff通過。CLI不同cwd與BOM、原檔不變、不可覆寫、真正HTTP、JSON-lines錯後好／無寫檔、MCP stdio握手／discovery／生成與檢查均有測試。真正Agent起稿90BPM／68小節／181.333秒／29.97FPS／9鏡，CLI與MCP兩檔UTF8 bytes相同。

IAB驗證檔案預覽不改分鏡、歌曲／校時草稿及synthetic.wav在局部套用／撤回保持、目標編修拒絕、來源不一致與未知版本／毀損拒絕、4秒延遲期間歌曲編修保留及當前500錯誤可見、取消／重試、純文字HTML標題、上一版schema1起稿可讀。實際JSON下載4527 bytes SHA256 a8939141ffac3bcc7a7b14dbbef412550a17553c23884ddd2fd835705a3550dc；draft3下載7299 bytes SHA256 28b9db6ff307882510b20c774f6496a1b7423e68cdd2e9faf37eba4018fa64f2，實檔讀回9鏡及其他草稿保持。390×844 DOM檔案／預覽301px，無橫溢出，Enter套用／focus shot-jump，console error／warn空。細節見 docs/QA-v0.15.0.md。

精確commitZIP另跑全套／Agent／MCP metadata。未完成截圖／完整視覺、其他OS／瀏覽器、正式作品／音畫／實聽、ASR／LUFS／true peak／媒體生成或特定Agent host。LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保持，PolyForm Noncommercial 1.0.0不另授AGPL／商用。Repo private；FreeTWAI未投稿／未核實創始人。僅讀本次新工作區與通用指引，沒有其他使用者專案／記憶／GitHub參考。

## 產物與程序

outputs/v15-qa保存合成資料／真正下載／檢查／封裝與遠端收據，不進Git。草稿／備份／媒體不是Git可重建清除候選。封裝保留最新三版v15／v14／v13；更舊未滿七天仍保留，僅超過七天且tag／已驗遠端可重建的本專案產物列候選，本輪沒有符合條件刪除。

本輪HTTP exec40819／PID291548，QA stop正常exit0；tab17關閉，viewport reset。僅處理本輪確認程序，8875監聽／PID結束、封裝／發布終態與最終outputs盤點記收據。沒有持久服務／新依賴／worker／監控，滾動目標active。
