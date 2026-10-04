# 獨立預覽的格式保留（v0.56）

另存 preview.html 後仍可人工編修，但 v55 未顯示工作台已有的格式提醒。以真實 application 合成來源重現：LRC句首時間標籤與SRT空白句已由格式報告提示，獨立頁仍無提醒；兩格式回讀會改变原句或拒絕。現在獨立頁顯示同一規則，使用者可以按提醒定位目前歌詞，再自行決定編修／格式。

## 使用與分層

初次顯示及成功「套用編修」後，依完整已驗證 package 檢查；全部10000句計數，共用規則最多200明細，獨立view只前20項並明示截斷。ASCII空格／tab（含空字串）是SRT此項規則，Unicode行分隔符不是該空白判定；LRC使用既有startsWithTimestamp grammar。zero也提醒LRC缺句尾、兩格式缺作品名稱／總長／歷史，完整JSON保存全部值。既有下載會先apply，因此提示會更新；提示不改字、不猜時間、不自動禁用匯出。

lyrics-export-review.js private analyzeSource接已驗證來源，public analyze嚴格驗證同一payload，回傳純同步formats／count／issues／固定notes；async review繼續加來源SHA與原report欄位，無第二套規則。原預設與include_package合成樣本的data與files bytes與v55相同；來源／草稿／報告schemas及13／18工具保持。同步提示不呼叫crypto／網路／HTTP，缺少WebCrypto仍可用；主工作台與Agent完整SHA報告功能保持。

lyrics-offline-export.js純controller注入onView／focus。只保存有限diagnostic DTO，不留歌詞全文／歷史／media或DOM。accept嚴格驗證完整package，隔離結果；invalidate把舊提示標stale並增加revision。編修文字／時間、刪除、新增、播放位置、總長、media時長採用或撤回均沿範本adapter invalidate；成功Apply先用既有Package.revise與排序，再render rows及accept。無效Apply保留原valid package及待修正表格，舊定位保持停用。

locate只接受範圍內整數index與目前revision，stale、未知或舊revision拒絕；即使舊button回呼在fresh檢查後執行也不能定位新來源。lyrics-offline-export-dom.js注入document／locate，只用textContent、disabled及focus，限寬換行的提醒panel與table局部捲動。每次view重建明細，不插入歌詞HTML；按鈕依成功Apply已排序表格的row定位文字欄。

Python固定preview_contract嵌入既有LRC grammar／export規則與兩新模組，無外部script URL，產生自帶完整程式的HTML。v55完整來源与固定外框guard沿template1核對新模組；未知／被改動的HTML仍拒絕。Template內容更新，schema五欄形狀保持；產品56、交付來源明確38–56且四scope真ZIP來源都有回歸，修正差異報告原漏接受54。HTTP／CLI／Agent權限與auth／media處理保持。

## 範圍

獨立區是当前格式提示，没有SHA来源报告下載功能；完整可保存report沿工作台／CLI／Agent原入口。模型／實聽同步、任意播放器、作者與版權、瀏覽器實際saved files另驗。合成fixture原生在loopback執行自有HTML；無WebCrypto能力由純browser VM驗證，未宣稱每種瀏覽器的file URL媒體／下載驗收。見[QA](QA-v0.56.0.md)／[交接](HANDOFF-v0.56.0.md)。


## v0.57 下載接續

下載仍先套用目前編修並更新格式提醒，接著沿共享文字下載模型及DOM adapter送出；不改原格式風險規則或強制阻擋提醒。三格式固定lyrics.*檔名，完整JSON保留作品名稱與歷史；native送出與saved file分開。詳見[契約](LYRICS-DOWNLOAD.md)。
