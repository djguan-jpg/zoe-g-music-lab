# v0.148.0 QA

## v0.148.0 規劃 Markdown 原文字面顯示

修正歌曲 task.md／music-plan.md 與分鏡 prompts.md／continuity.md 的標題、記憶點、交付項、畫面欄位、母題與審查說明含換行或 Markdown／HTML 標點時，形成額外標題、連結或格式的可重現問題。純 markdown_text.inline → 相容的 markdown_table.cell／creative／design → 共用 application → CLI／Agent／MCP／HTTP → 既有 browser source guard；所有現有顯示欄位共用字面呈現。ASCII 標點轉十進位 numeric references，CRLF／CR／LF 只在顯示轉固定 br；JSON、CSV、順序、時間與原創文字保持。來源 JSON 才是原文依據，顯示不是空白／排版 bytes 保存或 AI prompt 安全承諾。

755 Python（新增10、1既有Windows symlink權限skip、0expected failures）、1811 JS、150 syntax／四Skills通過。GitHub實際GFM對四份合成文件修改前後共8次轉譯，固定標題／段落結構與所有顯示原文核對；data及五份非Markdown檔逐bytes不變。原41表格樣本與歌曲表格body原bytes保持。440歷史producer ZIP／manifest與29 input/output schemas保持，舊整份／原列比較檔不變。原v147 exact-source ZIP 2848621 bytes、SHA 349be2e842bdb40f4b9ee72b4c0a137efd4ea30a7f15977c69e817ec7bc05165 還原745 Python／1811 JS成功。

原生工作台核對九份完整wire檔、八份UI全文及一份CSV textarea換行正規化顯示；47歌曲＋63分鏡controls保持，後續分鏡片名編修保留上一份且停用下載，console0。本輪沒有下載click、完整視覺／screen reader／媒體同步／Host安裝或創始身分接受。產品148／唯一policy38–148共111，未知149拒絕；22基本／29啟庫、Agent1／draft3與其餘schemas保持，沒有新operation／依賴／auth／path／產品外網能力。

PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。使用者已登入的Chrome唯讀確認Zoe及音樂公會長，沒有重新投稿／平台mutation，四新專案既有提交紀錄仍原作者自行聲明、創始未核實。本輪自有QA server原handle正常EOF0、一頁關閉；還原tag、codex分支與exact-source封裝保持。rolling goal active。

## 證據與限制

reproduction／before-results記錄改前四份文件額外標題；render-evidence及八HTML保存實際GitHub轉譯。presentation-boundaries核對41原cell及table body，compatibility-final核對440封套，boundary核對29schemas。native-browser-evidence及native-validation保存九wire／八UI／一CSV顯示與110controls，current-server-stopped及原exec EOF確認程序關閉。

原生核對初次使用合成fixture mv-brief.json作期望，發現browser原生數字欄回傳原字串且不帶合成metadata；在未重建或修改產品的情況下，改用实际wire brief經application派生期望，並另核對fixture原創文字、完整data與四Markdown原文。CSV textarea正規化換行明確標示，不宣稱原CSVbytes保存。沒有saved download或完整視覺驗收。
