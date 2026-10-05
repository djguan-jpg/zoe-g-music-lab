# v0.98.0 交接與可逆

鏡頭與歌詞可選列向前／向後移動、查看選定列，並撤回最近一次移動。順序撤回保留後續文字與時間編修；新增、複製、刪除、還原或載入新內容會取消舊順序撤回。原時間、總長與音檔保持；鏡頭移動後須重新檢查時間覆蓋，已校時歌詞匯出仍依開始時間排序。

entry-order 純 ID 相鄰排列與逆序核對，供原 music-arrangement 與新 editor-order 共用；editor-copy 原值 source guard → injected controller → editor-order-dom 原生選列／四按鈕 → app 原 readValue／writeEntries／markDirty／editor-focus。只保留最近 ID 順序與來源核對，metadata view 只有可撤回／stale／位置，不帶全文；busy／hidden 先拒絕讀取，提交前完整 source 與提交後隔離 expected 再查。DOM 只更新單列輸入標籤，未變順序不重建 options，原列 stable ID、raw 字串與 shot open 保持。三個固定 JS assets，沒有新依賴、operation、schema、Agent 路徑／寫檔／模型／網路／timer 或 auth。產品98／唯一 policy38–98共61／unknown99；16基本／23啟庫、Agent1／draft3、23 operation schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted 保持。

581 Python／1144 JS／113 syntax／四 Skills；21新測試。v97真source ZIP還原579／1125，240歷史 ZIP／manifest bytes相同。33原生觀察、九 exact raw panel／ID 排列比較，三台移動與後續欄位編修撤回、複製句／鏡重新排列、結構變動停撤回、busy／hidden、時間矛盾拒絕／修正建包、歌詞按開始排序、late回覆保留dirty成果與後續編修通過。五native HTTP完整回覆與七 operations CLI／Agent／MCP、21直接HTTP good/bad/good皆與 application相同；兩個actual observed draft CLI reviews回讀，invalid1無輸出／diagnostic2／預設覆寫1原bytes保持。原生File身份、blob、paused與0.5秒在全部33觀察保持，console0。兩bounded servers正常完成、臨時HTTP thread joined、子程序EOF0、两tabs關閉／viewport reset。三JPEG留在outputs，不進Git。完整視覺／screen-reader／瀏覽器保存／實聽／正式媒體／Host／平台接受未驗證。

分支codex/iteration-v0.98.0；restore-v0.97.0-before-v0.98.0指向6bee7d523389942e7e7579217d70b51ed08026bd。先另存私人草稿／媒體，再 git switch -c codex/recover-v0.97 restore-v0.97.0-before-v0.98.0 另開還原分支。本輪實際還原v97 source ZIP並通過579／1125；最新exact-source ZIP由指定提交重新跑完整檢查，tree／SHA依本輪source/package/remote收據。

private PR／prerelease實際下載、GitHub asset digest、本機ZIP／manifest bytes與clean main依outputs/v98-qa/release-remote-evidence.json。無遠端CI配置，不把本機檢查當遠端CI。未提交FreeTWAI；不宣稱平台創始身分。

只唯讀盤點本outputs與明確typed owned jobs；latest98／97／96保護，嚴格超七天且exact Git／tag／archive可重建才列清除候選。實際資料／程序終態見maintenance-evidence.json及final-audit-aggregate.json。未知／failed36／53／私人草稿／備份／素材／外部程序保留；bounded服務正常停止，不依裸PID終止外部程序、不建heartbeat。

本輪只原生編修暫時合成草稿，媒體與未另存草稿不進原始碼ZIP。完整視覺／screen-reader／瀏覽器保存／實聽／Host／媒體與平台接受未驗證，rolling goal保持active，依可重現缺口續迭代。
