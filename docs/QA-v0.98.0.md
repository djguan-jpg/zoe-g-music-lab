# v0.98.0 驗證

鏡頭與歌詞可選列向前／向後移動、查看選定列，並撤回最近一次移動。順序撤回保留後續文字與時間編修；新增、複製、刪除、還原或載入新內容會取消舊順序撤回。原時間、總長與音檔保持；鏡頭移動後須重新檢查時間覆蓋，已校時歌詞匯出仍依開始時間排序。

entry-order 純 ID 相鄰排列與逆序核對，供原 music-arrangement 與新 editor-order 共用；editor-copy 原值 source guard → injected controller → editor-order-dom 原生選列／四按鈕 → app 原 readValue／writeEntries／markDirty／editor-focus。只保留最近 ID 順序與來源核對，metadata view 只有可撤回／stale／位置，不帶全文；busy／hidden 先拒絕讀取，提交前完整 source 與提交後隔離 expected 再查。DOM 只更新單列輸入標籤，未變順序不重建 options，原列 stable ID、raw 字串與 shot open 保持。三個固定 JS assets，沒有新依賴、operation、schema、Agent 路徑／寫檔／模型／網路／timer 或 auth。產品98／唯一 policy38–98共61／unknown99；16基本／23啟庫、Agent1／draft3、23 operation schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted 保持。

581 Python／1144 JS／113 syntax／四 Skills；21新測試。v97真source ZIP還原579／1125，240歷史 ZIP／manifest bytes相同。33原生觀察、九 exact raw panel／ID 排列比較，三台移動與後續欄位編修撤回、複製句／鏡重新排列、結構變動停撤回、busy／hidden、時間矛盾拒絕／修正建包、歌詞按開始排序、late回覆保留dirty成果與後續編修通過。五native HTTP完整回覆與七 operations CLI／Agent／MCP、21直接HTTP good/bad/good皆與 application相同；兩個actual observed draft CLI reviews回讀，invalid1無輸出／diagnostic2／預設覆寫1原bytes保持。原生File身份、blob、paused與0.5秒在全部33觀察保持，console0。兩bounded servers正常完成、臨時HTTP thread joined、子程序EOF0、两tabs關閉／viewport reset。三JPEG留在outputs，不進Git。完整視覺／screen-reader／瀏覽器保存／實聽／正式媒體／Host／平台接受未驗證。

CUA使用原生 click／fill／Enter／filechooser；CDP僅唯讀 captureDraft 與原生File身份核對。比較原始草稿，不把 DOM 特殊字元顯示當原文；九組比較用 stable ID 映射全部原欄位，其他 panels 精確相同。歌詞撤回保留後來改過的2.250秒與文字，鏡頭／歌曲也保留後來的敘事／名稱。既有校時歌詞建立仍排序並正規化時鐘，這不是移動時自動修正。

原生分鏡先確認重排原時間造成待辦並拒絕建包，再恢复正確順序成功建立。late時間報告保留後來歌名、上一份dirty成果與停下載。處理中兩新list所有動作停用；hidden另一台停用。純測試覆蓋1000／10000容量、未知來源、稀疏／重複 IDs、來源競態、expected alias、latest-only、獨立 histories、14 owned listeners dispose。

本輪初次focused Python以tests模組名稱呼叫失敗，因tests不是package；改沿原discover後通過，失敗收據保留。瀏覽器早期觀察誤用status元素名稱，改用實際id後完成；沒有頁面注入或內容修改。review補上sparse-ID拒絕後另跑完整檢查；既有kernel與原music tests保持。三份JPEG與原值/程序收據在outputs/v98-qa，原生幾何／截圖不能冒充完整視覺／screen-reader接受。

CLI檢查music／storyboard／lyrics／storyboard_timing_review／lyrics_review／music_review／storyboard_review。modern歌詞CLI回讀完整包，完整files／data／meta一致；兩review讀實際observed draft3。沒有新增工具。各入口invalid／good／invalid／good recovery和預設不覆寫沿原契約。
