# 獨立歌詞預覽下載（v0.57）

以真實application生成的v56 preview.html抽取runtime重現：click失敗留下Blob與anchor，setTimeout失敗留下Blob；CON作品名稱還會產生Windows保留檔名CON.json。舊訊息「已匯出」只能證明程式走過click，不能證明使用者保存。現在與工作台共用文字下載層，獨立HTML仍自帶全部固定程式。

## 目前來源與內容

按LRC／SRT／JSON下載先檢查已知格式，再執行既有Apply：完整Package.revise與時間排序、render、格式提示更新，然後才準備目前完整來源。無效時間等Apply錯誤保留原valid package及待修正表格，尚未配置下載Blob。成功Apply是目前編修的提交，即使後續送出失敗仍保留已套用內容，可直接重試；不偷偷撤回。

lyrics-download.js純select(source,format)只接受lrc／srt／json，完整package沿現有schema驗證并隔離。沿LyricTime輸出相同LRC與SRT；JSON沿原完整key/value与兩格縮排，仍保持獨立頁原無尾換行規則。application產生的lyrics.json／lrc／srt逐bytes與基線相同，預覽HTML因功能更新而不同。JSON保存title、duration、estimated、cues、timing、review_notes；原Unicode、空格與歷史不靠檔名推測。v57曾容許JSON.stringify逃脫lone surrogate保留JS值，但該JSON不能沿strict讀取器回讀；v58在完整package來源層拒絕這類非法Unicode，三下載格式都不送出，也不靜默取代。合法文字與JSON bytes保持。

三個下載檔名固定lyrics.lrc／lyrics.srt／lyrics.json，與工作台產物名稱一致；避免保留裝置名、路徑／控制字元或長標題成為保存檔名。介面提前明示，作品名稱仍在完整JSON。沒有任意目的路徑、覆寫選項或自動寫檔權限。

## 共享送出與回收

web/text-download.js嚴格兩欄name／content、可攜单層文字檔名、UTF8有效字元及8MiB bytes；prepare產生原bytes。既有controller每次重新select，sendPrepared必須回true才onSent；錯誤走onError，沒有保存宣稱。

text-download-dom.js新增createController(options)，與既有form bind共用同一factory及内部sendPrepared，呼叫端不能用options.send取代transport。既有send(name,content)保持。adapter创建UTF8 Blob、hidden下載anchor、click後移除anchor，最多兩owned pending URL，1000ms排程釋放；URL／append／click／schedule失敗catch回收，無成功訊息，修正可重試。pagehide回收下載URL與timer，恢復頁面仍可送出；dispose移除監聽並拒絕後續送出。只管理自己的下載URL，不觸碰media URL或外部資源。

預覽onSent說「已交給瀏覽器下載 lyrics.*；請確認保存位置」。click+schedule完成是提交，沒有file-system存檔證據；timer失敗可能click已發生，仍報錯而不冒稱保存。快速連點第三次會提示稍候，回收後可重試。

Python固定preview_contract嵌入新formatter與web兩共享原生模組，不讀使用者指定路徑、不載外部script。template1五欄及契約256KiB／package2MiB／encoded12MiB／HTML16MiB保持；whole-envelope純核對包含新模組與runtime／訊息，變造拒絕。主工作台HTTP／CLI／Agent沿原application產生相同HTML，權限不變，13／18工具與Agent1／draft3／review1／source1保持；產品57與交付來源38–57明確，未知仍拒絕。

## 實測範圍

純測試抽取真生成runtime，注入native boundary重現四失敗／重試／有界連點／pagehide／media隔離與bytes；不是將注入失敗冒稱真瀏覽器故障。原生loopback页确认三格式送出訊息、錯時間拒絕、修好重試及字元歷史保持，主工作台完整六檔與兩次實際wire全外框核對通過。download事件等10秒沒有saved path，無保存完成宣稱。無WebCrypto／fetch路徑由純browser VM確認；完整file URL媒體、其他瀏覽器、實聽、作者／版權另驗。見[QA](QA-v0.57.0.md)／[交接](HANDOFF-v0.57.0.md)。


## v0.58 合法來源要求

名稱／每句／history也沿共享Unicode helper驗證；JSON escape不能把非法字元當成有效package。先Apply的失敗保留原valid data與待修正表格，不配置下載；修好再重試。原有bounded transport／pagehide／portable names与保存證據界線保持。見[契約](LYRICS-UNICODE.md)。
