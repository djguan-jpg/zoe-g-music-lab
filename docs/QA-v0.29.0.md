# v0.29.0 驗證紀錄

2026-10-04，本機Python標準函式庫、Node與Codex IAB。只讀本次新建工作區和通用工具指引，沒有參考其他本機作品、GitHub專案、記憶或vault。資料全為本工作區原創合成資料。

## 基線與分層驗證

真IAB45確認v0.28六段，每列只有刪除，沒有排序控制；本輪保留restore-v0.28.0-before-v0.29.0，基線main為54dea8f20f72d07cff0da24a8c2434feab70f3b0。新增純順序模型／注入controller與DOM adapter，見MUSIC-ARRANGEMENT.md。

246項Python、367項JavaScript、四Skill、26個JS語法與git diff檢查通過。新增2Python／14JS，包括40段全部78種鄰近移動與反向恢復、同名／空白原字串、無效ID／方向／紀錄、靜默結構改動、刪除還原交互、狀態隔離及實際busy／新增handler。原music markDirty VM fixture補注入新controller，核對兩次refresh。

真Node模型產生六段全部10種鄰近移動，Python共用完整歌曲與起稿驗證各自核對同序、總長136秒、各段時間及規範化需求。保留原始輸入；空白小節仍由完整domain拒絕，不把排序成功當作品接受。

## 真瀏覽器與接續

IAB46共21項assertion通過（outputs/v29-qa/browser-evidence.json），沒有console warning／error。副歌4→3及限定撤回保留後續敘事任務與小節9；同名副歌仍使用原列ID。新成果138秒，起稿18鏡連續；排序後舊歌曲起稿不能套用，原分鏡保持。空白新段可移動，完整建立拒絕空白任務；新增聚焦第7列，刪除及刪除還原保留原識別並停舊撤回；範例載入清暫態。

真4秒延遲建立停用五個排序／新增控制，期間原欄位仍可編修。同一晚回應保留後續文字及先前成果字串，停用舊下載；新建立恢復。沒有逾時重送、重啟或重複job。

真JSON-lines產生18鏡Agent檔，以原生chooser讀入、核對預覽、明確限定套用與撤回，歌曲移動紀錄及原音檔保持。明確歌曲brief載入清移動紀錄，限定撤回恢復前一順序及文字，不復活舊排序紀錄。

390×844手機Enter移動／撤回通過：client375px，控制框left16／right359／width343，三按鈕right105／185／289，控制框在橫向表格外。只是DOM幾何及互動證據，未做完整視覺驗收。暫時viewport已reset。

四份實際native歌曲下載與application／CLI／JSON-lines／MCP完整文字核對；nativeCRLF與wireLF另做換行規範化，原始bytes／SHA保留，沒有宣稱原bytes相同。CLI預設再次寫同輸出拒絕，既有bytes保持；Agent及MCP真正EOF正常退出，七tools不變。實際草稿5878bytes／SHA7046eb54de1e287615a8d3bc13e30cca9cf56149c435f8cac8e2d234da747774，產品0.29／draft3，保留新順序、晚回應期間編修及原4鏡，沒有暫態ID／undo／media。實檔核對後才明確「已確認草稿檔案」。

原生選定自有合成6秒PCM音檔，排序／限定接續前後同一blob來源及選檔保持。沒有聽覺、正式作品或原生file:播放接受。

## 測試假設修正

初始fixture把已驗證brief數字預期為原始字串，又將needs_review固定預期true；依既有完整domain契約改為數字規範化及實際review_notes狀態，未放寬domain。隔離VM缺新controller已補stub及refresh斷言。native空白欄位錯誤沒有列號，改查同一請求實際空白錯誤；没有重送。CUA包裹select的label locator不支援，依實際DOM用ID；没有改產品或繞過政策。

## 封裝、還原及維護

前版v0.28ZIP628922bytes，SHA d42c178f1b93b30cd6c9a1e571aff6ef8314b213d4ec36631d560a837ab03dc0，解壓244Python／353JS通過，限定暫存正常移除。本版指定commit封裝重跑完整測試；privatePR／Release／遠端下載bytes及Git refs以本輪manifest和outputs/v29-qa收據為準。GitHub無配置CI，不能把本機檢查當遠端CI。

原有四個法律／創办記錄Git blobs保持。僅盤點自有程序／8875及本專案outputs，最新三版SHA核對；過七天且Git或已驗遠端可重建才清理，使用者草稿／備份／素材不清。未驗完整視覺、正式媒體、特定AgentHost、其他OS／browser、原生file播放或FreeTWAI投稿／創始資格；rolling active。
