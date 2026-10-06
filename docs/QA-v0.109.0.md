# v0.109.0 驗證紀錄

2026-10-06，本機Python標準函式庫／Node測試與Chromium原生UI；合成資料與完整QA留ignored outputs/v109-qa。

歌詞校時與匯出格式的待辦可用上一頁／下一頁閱讀全部已保留明細，每頁20項。原本報告已有最多200項，但畫面只顯示前20项；現版可查看後續明細，點選後定位原欄位，重新檢查回到第一頁。總數超200時明示只保留前200項。

595 Python（87.875秒，兩隔離 workers／120秒整體期限）、1279 JavaScript、124 syntax及四份 Skill通過；新增9項JS測試。v108指定source ZIP原樣還原595／1270；四種 scope各71個歷史 producer，共284份ZIP與manifest bytes相同，24組schemas相同。47連續原生快照及39完整來源對；校時十頁200明細、格式六頁120明細、最後一頁只有一項、零明細隱藏導航、重新檢查回第一頁、stale唯讀／停定位、busy停翻頁、五次正確原欄位焦點與390×844 Enter操作通過。兩個明確換載區段各保留原File身份與同blob、paused／0.5秒／8秒合成音檔；四次明確文字編修只改單欄且可回復。六份native完整wire與application一致；三操作CLI／Agent／MCP及九HTTP good/bad/good，診斷exit2、無效exit1不輸出、預設覆寫exit1保留bytes。兩階段bounded工作台server均正常停止，自有tab關閉／viewport reset／console0；獨立HTTP thread joined及子程序EOF0。

Windows CIM補查可能在既有3秒operation／5秒helper期限內回傳unavailable；沒有證據就保持unverified並拒絕清除。本輪只修正測試，涵蓋limited及unavailable時均保留資料，以及子程序EOF完成與外部補查是否確認的分離；不放寬程序政策或增加重試期限。早期完整測試與舊版還原遇CIM未確認的失败保留，最後現版595與原封裝v108595／1270均實際通過。

分頁只讀已保留的最多200項，不補取被報告截斷的其餘明細，零待辦不代表全作品或實聽通過。120秒宣告與8秒合成音檔差異刻意保持，不能當成同步驗證。PNG只留ignored outputs；按鈕位置與鍵盤操作已核對，不把幾何視為完整視覺驗收。實際瀏覽器保存、完整視覺、screen reader、各OS IME、實聽、正式媒體、Host安裝及平台創始接受未驗證。獨立preview.html未加入工作台分頁，本輪未改固定預覽嵌入模組。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

本輪分支 `codex/iteration-v0.109.0`；基線 main `f6effebc2737e653c3876705564d94be4f8e1ee1`；還原tag `restore-v0.108.0-before-v0.109.0`。需要恢復時從還原tag另建 `codex/restore-*` 分支，以private PR回復；保留已發布main與使用者草稿。

指定來源提交由scripts/package_release.py封裝；ZIP及manifest SHA-256寫入manifest與ignored QA收據。private PR合併及prerelease以實際遠端下載逐bytes／digest回讀核對。每輪只稽核本工作區outputs與本輪typed run receipts，最新109／108／107受保護；只有嚴格超七天且exact tag／Git archive可重建的封裝才列清除候選。未知資料、草稿、備份、媒體與失敗封裝保持；未完成程序不以bare PID判定或強制終止。

測試helper初次舊版還原用了錯誤commit literal及一次重用receipt，保留失敗／拒絕紀錄後使用新receipt。原生操作兩次accessible name選擇錯誤，重新讀取UI後修正，未改來源。早期JS fixtures缺新分頁globals，改為實際DOM adapter後40項focused與完整1279項通過。初次原生末頁焦點落到body，增加有界focus fallback後重新載入並以21項首末Enter驗證。最終REPL計數欄誤寫2，但47份連續檔案與labels核對完整，native-proof採實際檔案數；保留原收據不冒充計數正確。

現版Python595結果來自實際checks-final4 session96088（87.875秒）；後續只改JS測試fixtures及文件，最終JS／syntax／Skill另記來源。來源封裝依required policy再次測試所指定commit。六組native started／returned、47快照、39來源對、九HTTP、CLI完整檔案、EOF、兩server停止、tab關閉與File身份均落檔。發版後另記SHA／source／merge／restore refs／private／actual download與程序盤點，不把未觀察到的GitHub CI或平台接受列為通過。
