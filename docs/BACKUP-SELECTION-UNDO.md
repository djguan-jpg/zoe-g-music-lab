# 備份選取撤回

展開本機保存版本，把版本加入備份清單。最近一次有效加入、整批加入、逐项移出、整批移出或清空後，可按撤回。提示顯示變更前的版數；搜尋與分頁改變目前展示，不改先前選取或撤回來源。只撤回最近一次成功操作；撤回後消耗紀錄，沒有更早一步或重做。失敗、無變化操作與下載不替換紀錄；新的成功選取操作替換上一筆。

純 model 保存私有 before／after Map 及固定 kind，每份最多1000個已核對metadata。值沿既有own data descriptors／dense array／library-revision隔離，沒有DOM、File、ZIP、完整草稿或路徑。view只提供操作kind、還原版數、可用狀態及字面錯誤；checkpoint不進持久draft3、備份、Agent wire或download request。

undo先重查enabled／busy，再核對完整實際after的順序、ID與metadata。完整目前displayed和selected若與before／after內的已知版本矛盾，或同批重複ID metadata互相矛盾，整份拒絕並保留選取及紀錄。unknown／getter／sparse來源沿既有checked拒絕，不執行getter。無矛盾才把before整份還原；不能以來源JSON選路徑或更換草稿庫。它不重新讀取未載入版本，也不保證外部同步改寫的原子快照或通用Proxy安全。

DOM optional undo button及aria-describedby hint讓旧fixture相容。clear由鍵盤操作成功時聚焦可用undo；undo消耗後若焦點按鈕已停用，改聚焦可用bulk add／batch download／clear／single add／list。失敗與手動refresh不搶焦點。變更沿原onChange通知下載可用狀態；pagehide／dispose移除自身handler並釋放checkpoint。

下載capture仍只保留固定IDs。busy不得撤回；完成後撤回不修改已送出ZIP的來源或確認狀態。CLI及Agent明確ids輸出仍驗證原保存版本，由使用者選擇的operation執行；undo不新增HTTP或Agent操作、網路／模型、寫檔、保存、恢復或刪除權限。20／27 tools、Agent1／draft3／backup1保持，產品132／來源38–132及未知133拒絕。
