# 加入目前顯示版本

操作：展開「本機保存版本」，可先搜尋，再按「加入目前顯示版本」。此處的「顯示」是保存版本select目前已載入的所有options，不是視窗中正好看得到的幾個，也不是全庫或尚未讀取的搜尋結果。按鈕顯示完整已載入筆數，提示另標示新加入筆數；重複版本不倍增。讀取更多由使用者明確操作，bulk add沒有網路、分頁或保存能力。搜尋輸入改動但尚未送出時，上方原選單仍是目前來源。

純模型checked接受原enabled／busy／selected三欄，或加displayed的四欄；未知欄位及accessor拒絕。selected及displayed每筆9欄metadata與titles三欄先取own enumerable data descriptors，再交原library-revision domain檢查並隔離。displayed為0–1000的dense array，無自訂own hooks、symbol或額外index；不使用caller iterator／map／toJSON。沒有持有完整草稿、File、ZIP或路径。Proxy可以截攔反射操作，本契約不宣稱任意Proxy無副作用。

controller的Map保存隔離metadata，view只公開ID／名稱／保存時間與版數／固定提示。一次addDisplayed取得click-time capture，先建立所有新ID的pending Map；與retained或pending同ID的metadata須精確一致。完成全批資料核對及retained+pending≤1000後才逐項加入；衝突／上限拒絕前完全不寫Map。此為同步模型的all-or-none邏輯，沒有宣稱filesystem交易或外部並行原子快照。empty／全數已加入不產生變更，legacy無displayed維持bulk停用。

DOM只新增一個button與scope hint，既有兩個固定JS仍同路由；舊DOM沒有新增節點仍可bind。render literal text、aria-describedby關聯；有變更才通知原download adapter。成功按鈕變disabled後，若它原本持有焦點，優先到仍可用的bulk／batch／clear／add／list；非focused或failed action不搶焦點。dispose解除自身handler及pagehide，清空暫態metadata。

app只注入libraryRecords，不取已保存草稿正文。列表／搜尋本來的完整來源與最新回覆核對保持；載入更多後刷新bulk提示，尚未讀回的版本不會自動加入。原selection across search、selected copy、backup-download request排序／固定IDs／latest／cancel／busy、32MiB串流與完整SHA核對保持。ID列表仍可交給CLI `python music_lab.py draft backup --library <明確目錄> --ids <ID1> <ID2> --out <指定ZIP>`，Agent／MCP沿draft_backup_export payload.ids；沒有新的operation、JSON路徑或恢復權限。

產品0.130.0、來源38–130；backup1／draft3／Agent1及20／27 discovery保持。unknown131拒絕。LICENSE／NOTICE、禁止商用及平台submitted_unverified保持。
