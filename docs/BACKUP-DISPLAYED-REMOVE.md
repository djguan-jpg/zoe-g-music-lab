# 移出目前顯示版本

展開「本機保存版本」，可先搜尋、加入需要備份的版本，再按「移出目前顯示版本」。顯示指select已載入options；不是螢幕可見的少數項目或尚未載入的全庫命中。按鈕數字是displayed與retained選取的交集，不是搜尋總數；提示列出已載入數量及交集。手動讀取更多後才增加作用範圍，搜尋輸入改動但尚未送出時仍沿上方原選單。

純checked沿既有own enumerable data descriptors、9欄metadata／3欄titles及dense0–1000 array規則；不取caller iterator／map／toJSON。shared plan(source,removing)先讀完整已核對來源，與retained或seen相同ID的metadata須精確相同。未選取的重複ID若互相矛盾也拒絕整批。完成全來源檢查後才提交pending；remove只delete交集，add仍檢查retained+pending≤1000。同步Map的all-or-none不宣稱filesystem交易、外部並行原子快照或任意Proxy無副作用。

view分別派生canAddDisplayed／canRemoveDisplayed及兩份問題提示。超過加入容量不代表移出無效；滿1000版仍能合法移出。empty／no intersection／busy／disabled／disposed不改Map或通知成功；selected request是隔離的固定IDs，後續移出不改已捕捉下載request。

DOM新增optional button與hint，舊fixture沒有節點仍可bind。文字literal、aria-describedby關聯；有變更才通知原download adapter。若focused移出按鈕成功後disabled，優先到enabled整批加入／batch／clear／single／list，非focused或failed不搶焦點。dispose／pagehide解除自身handler，不影響保存版本原檔。

app.js不修改，沿v130只注入已載入libraryRecords；沒有新網路、分頁、草稿持久欄位、路徑、恢復、刪檔或Agent operation。CLI既有draft backup --ids及Agent／MCP draft_backup_export payload.ids保持，inspection與原整庫／單版入口保持。產品0.131.0／來源38–131、未知132拒絕；20／27 discovery與Agent1／draft3／backup1保持。
