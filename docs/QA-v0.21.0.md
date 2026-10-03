# v0.21.0 驗證

2026-10-03，本機Windows／Python標準庫／原生JS，IAB背景tab25，http://127.0.0.1:8875/。只用本新工作區合成資料與通用測試指引；沒有外部專案、既有作品、模型或對外網路呼叫。瀏覽器來源請求均為127.0.0.1。

## 重現與修正範圍

v0.20真瀏覽器填歌名「v21尚未另存的原創編修」後reload，沒有提示且回到「樓梯間的回聲」。v0.21上方加入實際草稿內容另存狀態，dirty時才註冊beforeunload；歌曲、分鏡、歌詞、交付條件的編修／新增／刪除／撤回都重查。四秒範例回應期間填入的歌名保留，初始化不以已保存狀態作覆寫許可。

Page.javascriptDialogOpening記錄type beforeunload，原生點擊後reload出現opening，closed result=false，歌名保持。IABgetJsDialog未回傳該dialog物件，由CDP事件及DOM確認結果，沒有聲稱手動點到取消。另一筆只有locator.fill而沒有trusted click的reload沒有dialog並丟失編修，這是瀏覽器互動門檻限制，列為未保障狀況；頁面狀態不代替主動另存。

## 測試

182Python／237JS全部通過，四Skill／19JS語法及diff通過。兩新Python為真HTTP新模組asset／attachment內容與拒絕後仍可操作；17新JS覆蓋semantic內容、snapshot隔離、來源混合、bounded各類最近點、按下快照、未知失敗／重試、真正Undo、scope擷取、listener增減、實際export拒絕與啟動late／failure。既有seed的markDirty VM fixture漏注入新controller，修成實際controller並保留生成／檔案成果dirty斷言；未更動領域期待。

前版v0.20 ZIP455497bytes／SHA256 25a704fc92ad9b9f91cacf15308a85bf82e7a190933c96269de86ccf0c3a547c。核對CRC與受限相對路徑，在本outputs內暫存還原，原版180Python／220JS通過，暫存檢查目錄正常移除。輸入ZIP保留。

## 實際操作證據

29項IAB實際操作；原生downloads先讀本機實檔再點確認。原生draft5891bytes／SHA cc793895a9affd1741b94f79377e2cfe36f60acd5462c9287e2873b7756a4e62，再由原生選檔回讀、預覽／載入／整份撤回。手機draft5854bytes／SHA 0bd20ac8c65faba90857173af9a1ceb0e99811d18cd7992f21dfed4db7a38034，Enter確認；成果brief2103bytes／SHA 4a681869d785744755978e11e3f099801fee3c4d71db2db60b0ef9860b8923fd，Python嚴格讀回通過。下載都在iframe，頁面與未保存提醒保持。

真JSON-lines Agent draft_save／draft_read→所選本輪合成庫→HTTP刷新清單／預覽／明確載入，Agent正常EOF exit0。保存版本是獨立原創「v21Agent新原創版本」，canonical draft5715bytes／SHA a7ad9c80c210335b9a8226b188df17cf5c9d4856136a01d8de0078d57fde253d；目前不同編修在預覽時保持dirty，明確載入才表示匹配已保存內容。沒有特定Host或模型呼叫。

真四秒保存把「v21保存當下版本」保存後，當前「v21保存期間的新編修」仍dirty；手動回到按下版本才解除。四秒500保留後續內容與retry控制，放棄也不解除。legacy v2明確轉換後仍dirty，不能冒充已存在v3檔。PCM真原生選檔／分析通過，沒有把媒體選擇或成果當作草稿另存；原合成音檔保留。

桌面innerWidth1280／documentWidth1265，390px時documentWidth375／noteWidth307，15px為垂直scrollbar；以scrollWidth <= innerWidth判定無頁面橫向溢出，初始要求兩者必須相等的檢查條件已更正，沒有掩蓋產品修正。狀態可換行、Enter可確認；沒有截圖或完整視覺驗收。console warn／error為空，頁名／URL／有意義DOM／無framework overlay確認。

| 編號 | 實際操作 | 結果 |
|---|---|---|
| 1 | startup-late-examples-preserve-edit | 通過 |
| 2 | actual-reload-beforeunload-cancel-preserves-edit | 通過 |
| 3 | native-draft-download-still-unconfirmed | 通過 |
| 4 | confirmed-native-draft-clears-matching-warning | 通過 |
| 5 | edit-after-confirmation-warns-again | 通過 |
| 6 | manual-return-to-retained-content-clears-warning | 通過 |
| 7 | real-four-second-save-keeps-later-edit-unretained | 通過 |
| 8 | return-to-acknowledged-save-clears-warning | 通過 |
| 9 | real-four-second-500-keeps-unconfirmed-edit | 通過 |
| 10 | abandon-unconfirmed-save-does-not-clear-warning | 通過 |
| 11 | real-agent-library-preview-does-not-mark-current-retained | 通過 |
| 12 | real-agent-library-apply-recognizes-persisted-content | 通過 |
| 13 | native-draft-readback-preview-keeps-unsaved-warning | 通過 |
| 14 | native-draft-readback-apply-recognizes-file-content | 通過 |
| 15 | whole-draft-undo-restores-unsaved-content-and-warning | 通過 |
| 16 | storyboard-content-edit-and-return-checkpoint | 通過 |
| 17 | lyrics-duration-edit-and-return-checkpoint | 通過 |
| 18 | cue-add-delete-returns-to-retained-content | 通過 |
| 19 | deletion-undo-is-an-unsaved-content-change | 通過 |
| 20 | delivery-condition-edit-and-return-checkpoint | 通過 |
| 21 | panel-switch-does-not-create-unsaved-edit | 通過 |
| 22 | explicit-legacy-conversion-needs-new-retained-v3 | 通過 |
| 23 | domain-build-does-not-mark-draft-retained | 通過 |
| 24 | native-result-download-keeps-page-and-unsaved-guard | 通過 |
| 25 | 390px-retention-status-wraps-without-page-overflow | 通過 |
| 26 | 390px-enter-confirms-real-draft-download | 通過 |
| 27 | source-media-and-save-label-do-not-change-draft-content | 通過 |
| 28 | pcm-analysis-keeps-retained-draft-status | 通過 |
| 29 | retained-draft-reload-has-no-false-warning | 通過 |

## 分層與限制

純checkpoint→注入controller→DOM，各工作台capturePanel與全draft擷取同源；既有保存I/O與domain規則保持。產品0.21.0；Agent1、MCP2025-11-25、draft3、library1、backup1、兩seed1、lyrics_package1及六／十一工具保持。確認是本頁暫態，不是自動寫檔、磁碟存在監控、或完整音檔／成果保存。每種來源只記最近一份，較早資料可能保守提示需另存；沒有截圖、其他OS／瀏覽器、正式實聽、特定Host、ASR或生成媒體、FreeTWAI審核證據。

本輪合成證據在outputs/v21-qa，不進Git。基線PID117248／新版PID300376經qa-stop正常exit0／server_closed，tab25關閉，390px override清除。最終本輪確認PID／8875監聽、outputs與封裝盤點以inventory-final.json為準；最新三封裝保留，未滿七天與使用者草稿／備份／媒體不列刪除候選。
