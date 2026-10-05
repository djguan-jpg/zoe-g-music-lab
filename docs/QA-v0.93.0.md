# v0.93.0 驗證

572 Python（68.578秒，兩隔離workers／120秒整體期限）／1086 JS／105 syntax／四Skills；17新取消測試。原 v92 exact-source ZIP 還原572／1069；220歷史ZIP/manifests逐bytes相同，23既有operation input/output schemas相同。45鏡／45句合成來源、31原生觀察、320／390／1440px，17原生搜尋請求中10個ERR_ABORTED與7個完成；取消分頁保留20筆、Enter／滑鼠焦點、編修／換台取消、立即重試與原欄focus。19後端完整HTTP回覆（含取消後仍完成者）等於application；兩種搜尋的實際CLI／Agent／MCP同來源一致，bad/good接續、預設覆寫拒絕且bytes保持。

| 核對 | 實際結果 |
| --- | --- |
| 完整來源 | 572 Python／1086 JS／105 syntax／四Skills，新增17取消測試 |
| 舊版／相容 | v92 ZIP SHA/CRC後還原572／1069，暫存移除；220歷史ZIP/manifests byte相同，23operation schemas相同 |
| 原生操作 | 合成45鏡／45句，31觀察；320／390／1440px，鼠鍵取消、20筆保留與前後分頁重試、原欄focus |
| 真正HTTP取消 | 主tab17請求，10個loadingFailed canceled=true ERR_ABORTED，7個loadingFinished；換查詢／來源／換台後新請求仍可完成 |
| 完整回覆 | 19個後端HTTP完整files/data/meta與application相同，含已取消等待的計算；兩種搜尋CLI／Agent／MCP一致 |
| 保留與恢復 | 原shots/cues/output完全比較、取消焦點返回query；手動編修與dirty保留，預設覆寫拒絕，good/bad/good恢復 |

QA-only loopback server用合成來源與3秒延遲；production POST沒有delay或fixture差異。19 started/returned pairs，兩owned servers由原handle正常結束，三owned tabs關閉、CDP Network停用、viewport reset；沒有staging。

原生pending頁面離開／返回後是新document，沒有再收到該請求的獨立loadingFailed事件；不聲稱由原生CDP證明pagehide handler中止或BFCache。注入DOM測試覆蓋pagehide abort／外部焦點保留。一次read-only DOM觀察使用不可用checkVisibility API後改用getClientRects；一次hidden wait工具回報逾時但診斷已hidden，隨後新狀態確認正常完成，沒有重送請求。關tab後多讀一次dialog回報tab已關閉，後續inventory確認三tabs均無。這些是工具觀察限制，沒有將錯誤當成功。

source期望由本輪原fixture與exact baseline display比較派生，未編修的raw CRLF仍由完整HTTP sourceSHA核對，不把raw-fields顯示跳脫當原文。console主tab錯誤／warning0；pagehide新tab未列入此console承諾。不宣稱browser下載保存、完整視覺／screen-reader、實聽／模型／媒體、Host或FreeTWAI接受。精確提交封裝／遠端download與最終維護結果依outputs/v93-qa收據，不在source commit虛構尚未產生的SHA。

第一次source preflight把歌詞起稿API也納入搜尋Network request計數而guard停止，沒有commit。fresh identity改以兩個明確search endpoint核對17請求／10取消／7完成，保留原失敗收據；產品來源與測試結果未因此修改。
