# 逐句標記與最近一次撤回（v0.79）

在波形校時載入可定位音檔，按逐句「記下開始」「記下結束」或「整句移動」，再按「撤回最近逐句標記」可還原最近目標句的原始開始／結束字串。整句移動沿既有長度及毫秒規則；空白時間可逐次標記，不猜測其他句子。

只保留最近一次有變化的成功標記。同值或無效標記不取代有效舊紀錄。撤回保留之後的文字、其他句子、其他刪除、作品宣告、成果及音檔選擇。目標時間一旦修改或目標句刪除，舊紀錄永久停用；改回時間或還原刪句不能復活。下一次成功標記可建立新紀錄。載入新歌詞清除本頁紀錄，檔案預覽不清除。按鈕支援 Enter，撤回後焦點回到目標開始欄位。

`cue-stamp-edit.js` 純模型重用 `cue-stamp.js` 與 `wave-position.js` 的毫秒／readiness 規則。注入 controller 只接收 readRow、writeTimes、captureMedia 及事件 callback。紀錄包含 stable ID、原時間字串、實際 after 及 stale；不持有歷史文字、File、DOM、URL、路徑或全表副本。

標記先擷取完整 row／原生媒體來源與位置，套用前再讀 row 及 source/current_source/duration。自然播放前進不讓已擷取時間失效，來源或時長改變則拒絕。writeTimes 只寫時間，完成後再次讀取实际值才建立紀錄。撤回也先核對 after，保留目前文字，只寫回 before，再核對實際結果。失敗不冒充成功，保留現有表格供核對，不宣稱交易式回滾。

`cue-stamp-edit-dom.js` 以 literal text 顯示句號、動作及失效原因，busy 時阻擋 stamp／undo；dispose 只移除自己的 click listener。app 用既有 stable row ID、markDirty、tick、raw time fields 組合，波形定位及標記共用 `captureLyricPlayer`。新歌詞 render 無 ID 時清除 history；同 ID 編修保留或失效依實際 after 判定。

紀錄是頁面暫態，不進 draft3、Agent1、交付 wire、schema 或成果，刷新後不存在。仍需保存草稿、完整驗證及實聽。固定新增兩個 JS route，無依賴、模型、外網呼叫、path/write 權限或媒體解碼擴張。工具保持14／明確啟庫21；產品0.79.0及交付來源38–79，未知80拒絕。PolyForm Noncommercial／private／FreeTWAI not_submitted保持。
