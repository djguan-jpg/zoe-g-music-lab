# 列順序 v0.98

鏡頭與歌詞可選列向前／向後移動、查看選定列，並撤回最近一次移動。順序撤回保留後續文字與時間編修；新增、複製、刪除、還原或載入新內容會取消舊順序撤回。原時間、總長與音檔保持；鏡頭移動後須重新檢查時間覆蓋，已校時歌詞匯出仍依開始時間排序。

entry-order 純 ID 相鄰排列與逆序核對，供原 music-arrangement 與新 editor-order 共用；editor-copy 原值 source guard → injected controller → editor-order-dom 原生選列／四按鈕 → app 原 readValue／writeEntries／markDirty／editor-focus。只保留最近 ID 順序與來源核對，metadata view 只有可撤回／stale／位置，不帶全文；busy／hidden 先拒絕讀取，提交前完整 source 與提交後隔離 expected 再查。DOM 只更新單列輸入標籤，未變順序不重建 options，原列 stable ID、raw 字串與 shot open 保持。三個固定 JS assets，沒有新依賴、operation、schema、Agent 路徑／寫檔／模型／網路／timer 或 auth。

產品98／唯一 policy38–98共61／unknown99；16基本／23啟庫、Agent1／draft3、23 operation schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted 保持。

核心 checkedIds 僅接受唯一非空字串、最多10000；sparse array／無效形狀／越界／非 ±1 拒絕。restore 核對當前 IDs 與 record.after、同一完整成員、相鄰 from/to/id 及 before 重播得到 after；不信任外部 record 任意置換。原 music-arrangement 的五原字串／40列／controller API 與撤回行為保持。

新 source 只接受 shots／cues，重用 editor-copy exact entries／visible／busy、每列 id／value 與 draft3 原欄位（鏡頭另有 bool open）。提案隔離原值、不猜時間；controller 提交前再核對 full source，expected 在 apply 前另外隔離。actual-after 不符不新增撤回紀錄，不回滾外部編修。undo 重讀當前欄位、只還原 ID 順序；結構改動永久取消舊撤回，之後即使回到相同 IDs 也不復活。每個 list 獨立；clear/dispose 清除自己的暫態。

DOM select 使用 stable ID；caption 是最多24 codepoints 的 literal 顯示摘錄，空白整理不改原值。輸入事件只更新當前 row option，不读全來源或重建 choices。選列／busy／render 才重查 metadata。disabled／hidden／busy gate 在 capture 前拒絕；移到邊界時焦點回選單，其他移動保持動作按鈕，明確查看才沿原 focus helper 展開／定位原列。390px 按鈕換行、歌詞表格沿原局部橫捲；暫態 selection／history 不進草稿。

排序保留時間，所以完成鏡頭可以變成時間不連續；原時間待辦與完整驗證仍拒絕。歌詞起稿順序可編修，已校時建立沿原開始時間排序，來源順序變動會取消此列排序撤回。原音檔與總長保持，排序不等於重新校時、媒體生成、音畫同步、AI呼叫或作者／平台身分證明。

未完成列仍可保存 draft3，CLI／Agent／MCP／HTTP 以原完整 panels 或需求繼續診斷；不新增外部排序權限。來源/世代 late guard、dirty 停下載、既有其他撤回／刪除還原照常。驗證與可逆見 QA-v0.98.0.md／HANDOFF-v0.98.0.md。
