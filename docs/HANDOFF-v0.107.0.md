# v0.107.0 交接與可逆

歌曲段落表新增原文搜尋，查找名稱、敘事任務、聲音配置；每批20段，可前後分頁，點命中直接回到目前原欄位。保留重複段落、原文、小節、能量與音檔。文字、列ID或順序改變清除舊定位；數值編修保留命中，但原成果仍依既有規則停用下載。取消等待保留上一批，晚回覆不覆蓋後來編修或成果。

music_search／原生 music-search 純三欄字面與UTF-8位置、schema1／來源SHA → 共用application → CLI／Agent／MCP／HTTP → 注入current source／query／ID／result revision controller → literal excerpt DOM／native field focus。重用現有嚴格JSON、搜尋請求ownership、摘錄、輸入法Enter政策及editor-focus自有dense IDs核對；新三個固定JS assets。新增唯讀 music_search，17基本／24啟庫工具，需重新discovery；原23組input/output schemas保持。Agent1／draft3／既有交付schemas不改，產品107／唯一policy38–107共70，unknown108拒絕。沒有依賴、模型、媒體生成、外網或auth／路徑權限擴張。

595 Python（80.954秒，兩隔離workers／120秒整體期限）、1253 JavaScript、122 syntax及四Skill通過；新增八Python與21JS測試。v106真source ZIP還原587／1232；276歷史ZIP／manifest bytes相同，23組既有schema相同，只新增music_search。54原生快照、41完整來源對核對原panels／IDs／音檔，兩頁首末及三欄focus、原生Enter、數值保持命中、文字／排序／刪除還原失效、取消／重試／no-match／invalid、晚回覆、390×844定位與七busy操作通過。20 native完整wire、八CLI／Agent／MCP操作及24 HTTP good/bad/good全回覆等於application；兩observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保留bytes。两音檔區段各自原File身份及paused／0.5秒／8秒保持；明確換草稿會重置音檔，另選再核對。console0、一自有tab關閉／viewport reset、一bounded server正常停止、HTTP thread joined及子程序EOF0。

搜尋不是歌曲完成、時間校準、實聽或權利接受；只按固定name／focus／texture順序列每段第一個字面命中。大小寫精確，不正規化或regex；開始原列1起，接續需來源SHA。原生下載點擊顯示已送出，但內建瀏覽器10秒未回報download事件，實際保存未驗證。PNG留在ignored outputs；完整視覺、screen reader、各OS IME、正式媒體、Host安裝與平台創始接受未驗證。不宣稱通用prototype／Proxy／accessor安全或外部改寫原子保證。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

本輪分支 `codex/iteration-v0.107.0`；基線 main `3ed7d6e19a923047af01e23351769c90c4afa471`；還原tag `restore-v0.106.0-before-v0.107.0`。先審閱差異，需恢復時從還原tag另建 `codex/restore-*` 分支，再以private PR回復；不要reset已發布main或移除使用者草稿。

來源提交後由scripts/package_release.py封裝指定commit，ZIP及manifest SHA-256記在ignored QA與manifest，不以後續工作目錄冒充指定source。private PR合併與prerelease的實際遠端回讀在QA收據核對，平台身分仍not_submitted。只對本工作區outputs與本輪typed run receipts唯讀盤點，保護最新107／106／105；超七天且exact tag／archive可重建才可列清除候選，未知、草稿、媒體及失敗封裝保持。

下一輪可評估需求清單搜尋或大型來源閱讀，但須先證明具體缺失；保持共用domain／application與current source guards，不把本輪簡單字面搜尋稱為AI判斷。
