# 工作台載入前草稿比較

在現代 v3 草稿檔或保存版本的完整載入預覽，按「比較目前與預覽」。原 readonly 完整 JSON 與明確載入、取消、限定撤回仍可使用；比較不是載入的必經步驟。legacy 預覽沿既有明確轉換，不把它當完整 v3 比較；無自動 Apply、合併或保存。

web/draft-compare.js 以既有 draft-v3 contract、editor validation 與 strict Unicode／完整 JSON 原值規則驗兩份完整來源。每份 canonical1MiB，sort ASCII contract keys／indent2／末尾LF，以 WebCrypto SHA-256核對完整來源、原欄位UTF8長度與完整hash。原排版bytes／BOM／key序不屬canonical來源證明，保存時間不是作者或權利證明。numeric 原字串、CRLF、空白與Unicode保持；非法getter／sparse array／unknown欄位／無效Unicode拒絕。哈希失敗不交部分report，可明確重試。

完整四台fields與六collections，依原1起位置比較；metadata tool_version／saved_at／tab分列。重複、插入、移除及換序不猜 moves、stable ID或修补引用。新增／移除列的missing view是null，空字串view含bytes0與空excerpt，不能合併。每項 changed scalar或集合列計一次，changed／added／removed按原位置與全數來源計數。完整計數不受最多前200明細、整列128KiB預算或每側128 UTF8 bytes前綴限制；prefix不拆字元，details_truncated明示。完整JSON與固定Markdown合計256KiB，不在Markdown插入任意原文標記。與Python draft_compare 完整report與Markdown逐值／UTF8一致，comparison1獨立，不變更原Agent1或draft3。

controller 以注入capture、gate、generate及狀態callback隔離DOM。gate只讀候選identity、各台revision、原生File身份、tab、allowed／visible；refresh與markDirty不capture全文。使用者按比較時擷取完整當前baseline及已核對候選，hash完成後完整重查，再提交隔離report。baseline capture每次建立的新 saved_at僅於current key排除，報告source SHA與metadata仍含比較那一刻的完整值；候選 saved_at從不排除。閱讀report也重新核對完整source。一次job／latest token防護、cancel／clear／dispose只清自身暫態；晚回應不碰表單或成果，gate未經事件改變時也能結束busy並發佈stale。僅變更tab也失效，重新按比較才建立新metadata報告。

DOM adapter共用draft／library兩prefix，textContent與固定控件呈現原值；原文含<img>仍是文字。各台／metadata可篩選，10項／頁，全部保留明細可達；按details查看before／after及完整bytes／SHA。desktop bounded局部scroll／雙欄，390px單欄、長字斷行不撐大頁面。邊界翻頁若目前button將disabled，焦點移至另一個可用翻頁button或filter；取消返回可用比較button。所有原文pre可聚焦，提示摘錄而非完整文字；pagehide／dispose釋放自身listeners，不變更持久草稿。

app將報告綁定原draftPreview／libraryPreview已完整核對的proposal。換選版本、取消或清預覽清自身比較；四台任一編修、busy、tab或媒體身份改變使舊report失效。載入仍沿既有完整 snapshot／File scope保護；來源被編修後先重新預覽，不能因舊比較通過而跳過Apply guard。限定undo核對實際after，不丟棄後續編修。元資料與報告不進draft3、來源ZIP或持久庫。

本版只在music_lab_server的固定assets白名單加入三個原生JS，工作台比較完全在瀏覽器；既有 v135 /api/draft-compare、application、CLI、Agent、MCP、21基本／28啟庫工具及全部28input-output schemas沒有變更。無新HTTP operation、auth／session、點數、外網、模型、依賴或JSON選路徑能力。

驗證與未驗證範圍見QA-v0.136.0.md；needs_review仍true。比較一致不等於創作完成、媒體同步、作品接受、作者或平台創始認證。
