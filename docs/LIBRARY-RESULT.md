# 保存回覆與清單 · v0.74

工作台保存、重新整理／讀取更早版本、預覽保存版本時，先核對完整 HTTP 回覆。清單有未知格式、重複版本或接續位置不符時，原清單與目前編修保持。可明確重試；保存結果未確認時使用原來的 ID 與點擊時草稿，不將後续修改塞進同一個保存版本。

## 分層

library-revision.checkedMetadata 是共享純資料 validator；完整 record 精確九欄，library1／draft3、完整38字元ID、64字元lowerhex hash、有界bytes／label／producer／三種title、有效UTC時間與Unicode。title以Unicode codepoint最多120，歷史created_with與原始空白保持。checkedEntry再以完整draft核對三種title；checkedRead／receipt原完整內容檢查保持。JS正規式的末端換行不能繞過ID/hash/UTC時間邊界。

library-result.checkedEnvelope 只接受 save/list/read；精確 files/data/meta 外框，files={}，meta只含目前固定頁面產品版本／protocol1／needs_review。list需false，save/read需true。不是從 data 的 schema 或 created_with 推導產品版本。它返回 data 供後續領域檢查；不能單獨代表完整內容通過。app request及receipt的readback均走同一層，沒有漏過保存確認的第二次讀取。

純 checkedList 接受明確 limit1–100、cursor null或完整ID、完整 data四欄 entries/next_cursor/issues/status。entries最多limit，全數 metadata檢查及unique ID；issues精確ID+unreadable_revision，unique且不能與目前page重複，合計最多1000。status必須metadata_only_checksum_verified_on_read。next_cursor存在時，page需滿limit且指向最後一列；空page不能聲稱接續ID。

排序重用後端契約：原stored_at字串、再ID，降序比較，不改成Date.parse的時間排序。cursor非空時，adapter提供目前清單內同ID的完整 metadata作邊界；所有新列須嚴格在它之後，錯ID／缺失／錯序／重複邊界拒絕。checkedList回傳隔離metadata與issues，不保存全文draft／File／DOM，也不讀磁碟、fetch或推定全庫原子快照。它無法證明server漏列或全部庫版本身分；每頁實際檔案仍需read。

draft-library controller新增必須注入的checkList。request payload與本地check payload隔離，收到回覆先核對最新list token，再純檢查，最後onList才更新選項。錯或late page不更新cursor／清單，不取消原preview；app只顯示本次錯誤。重新整理可換頁，讀更早版本才append。既有read token／replacement preview／selected metadata與explicit Apply／Undo保持。

## 保存與回讀

保存wire不符是結果尚未確認，不新增偽400去釋放pending。保存可能已寫入；明確retry仍帶原ID、名稱與完整click-time draft。若ACK通過但readback envelope／內容不符，同樣保留pending。既有確定save 4xx拒絕規則保持；save readback 4xx仍是uncertain。確認後才更新retention；之後的編修仍dirty。

Backend讀取仍以原immutable record/draft bytes核對SHA；browser只核對回覆版本、領域資料與選定來源的一致性，不獨立重算磁碟bytes，不證明耐久／作者／權利或創作品質。清單明示metadata_only，不能因hash欄位形狀正確就宣稱draft checksum已檢查。沒有新Agent/MCP輸出schema、protocol或tool；CLI／Agent／MCP／HTTP原producer保留，基本14／明確啟庫20。

## 驗證

兩個新Python跨語言／實際adapter測試與14個新JS測試，原生tab120的21版本庫分頁、錯meta與重複ID拒絕、same cursor retry、錯ACK與錯readback原ID三次保存只新增一版、原21版bytes保持、後續編修／WAV／dirty、取消late及健康預覽皆通過。390px提示313px與console0只證明該次幾何／console；沒有完整視覺、screen-reader、瀏覽器實際保存或第三方Host驗收。無新依賴／模型／網路／常駐程序，legal4／private／not_submitted保持，詳見QA-v0.74.0.md。
