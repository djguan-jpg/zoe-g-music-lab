# 草稿比較：變動類型與保留明細

在草稿檔或保存版本的預覽中，按「比較目前工作台與這份草稿」。選擇「差異範圍」及「變動類型」共同縮小閱讀清單；全部變動、只看變更、只看新增、只看移除為固定四選項。這不套用、合併或保存草稿。兩個預覽互斥；預覽另一來源會關閉上一份比較，不可操作已失效的舊入口。

## 分層與原位置

既有draft-compare-controller核對完整current來源與gate，再由DOM adapter傳入已驗證report.details的scope／status給純draft-compare-view。純view不取得report原文、DOM、File、filesystem、網路或下載器；reset只接受最多200項dense own資料descriptor，精確兩欄與已知enum，未知／額外／getter拒絕且保留原view。先建立隔離copy再替換；回覆indices、expandedIndices與kindCounts均隔離，不能透過輸入或回覆修改內部狀態。

保留原report明細順序，scope與kind為AND，換任一篩選回到第一頁，每頁最多10筆，空清單仍有一頁。kindCounts計算目前scope內的全部保留明細，不隨已選kind或頁碼縮小。它不重建完整change_count，也不代表未保留的細節數；畫面明示「保留明細」，原report若截斷，另提示完整計數見摘要。版本與頁籤metadata的status沿原changed資料，不能據此推論作者或作品權利。

展開Set只保存本份report原明細ordinal，跨kind／scope／頁碼保持；bulk只改目前十筆。這些ordinal不是編修器stable row ID，集合仍按原位置比較，插入或換序可能改變後續多列。新report／clear／取消／來源過期清除scope、kind、page與展開，沒有持久閱讀紀錄。

## DOM、來源與下載

兩入口共用同一adapter。每次change先controller.read再套用filter，沿既有source／revision／native媒體identity／busy檢查；來源不符不提交篩選或成果，後續編修保留。busy／stale時停用兩個select並清空本份note。新kind listener與既有listeners由dispose正常移除，晚到已detach的toggle不能改新頁面。

原生select有可見label；新kind以aria-controls指向明細、aria-describedby連結保留明細計數。flex-wrap及min-width:0讓兩個select隨容器寬度排列，窄時上下；不是新增全域捲動或以幾何代替完整視覺驗收。Home／End／Tab／Enter沿原生keyboard行為，bulk成功後焦點沿原enabled控制。

完整JSON／Markdown下載仍從controller.read交給既有draft-compare-download，不讀篩選DTO或十筆DOM；下載全份有界report、原完整change_count與欄位SHA／bytes。沒有新的下載格式、report schema、Agent operation、JSON路徑、File保存、媒體或網路能力。原工作台、結果、草稿另存狀態及媒體保持。

產品143／唯一交付來源38–143共106版，未知144拒絕；comparison1、Agent1／draft3與21／28 tools保持。六個法律／平台文件保持原bytes；本輪只唯讀確認登入及四份投稿，仍submitted_unverified，不把source SHA或公開投稿當正式founder認證。
