# 固定 Git 來源串流

原始碼producer與maintenance從選定commit取得Git tree。這是本機封裝／維護adapter，不是產品Agent、MCP或HTTP的新執行工具；JSON不能提供Git參數、環境、任意命令或路徑。

## 分層與容量

`musiclab.release_capture` 純層只接受40個小寫hex的指定commit及明確bool name-only選擇，產生固定`git ls-tree -r -z --long`或`--name-only`參數。CaptureBuffer每stream最多保存limit+1 sentinel，超限拒絕，不以截斷值冒充完整來源。stdout使用原source_tree2MiB上限，stderr4096bytes；每次read最多65536bytes。

`musiclab.release_git_fs.read_tree` 只有這兩種固定讀取。兩個自有reader同時處理stdout／stderr，避免stderr填滿時互相等待。成功必須stdout完整、兩pipe EOF、process exit0並完成cleanup，才回傳原bytes；不正規化Unicode或行尾。producer仍以source_tree驗證檔數／路徑／blob／size／NUL，maintenance name-only仍沿legacy source規則，modern完整blob檢查仍在後續層。

固定operation deadline60秒，cleanup另有5秒共享期限。容量／read error／timeout只操作這次Popen原handle：仍live才kill，wait原process，關閉自己的pipe並join兩reader。原handle或reader無法確認結束即拒絕，不能宣稱成功。沒有全域程序枚舉、bare PID kill、外部程序／job／server終止或環境讀取；不擴大run／audit／recovery能力。

非零或pipe error回傳固定錯誤，不回傳部分stdout或私人stderr原文。超限在source domain、Git archive、解壓與測試child前拒絕，producer依既有排他FAILED與目的存在拒絕規則保留證據。Git物件、source bytes、profiles及舊manifest不推測或遷移。

## 實際證据與限制

真實合成Git tree有1908檔、2257835bytes，舊capture_output接收全部後才拒絕。本版以相同tree形狀驗證producer與maintenance兩種reader：保留量最多limit+1，實際讀取最多limit+65536，超限不傳入domain；原child／reader都結束。正常Git來源與未提交編修隔離核對原bytes。stdout／stderr overflow、timeout、nonzero及注入pipe I/O錯誤同樣核對原handle。

這只限制此兩pipe的保留量，讀取chunk、成功bytes副本、Git本身及其他來源／測試程序仍各有自身資源需求。不是所有Git呼叫、整個process tree／OS／產品工作台的RAM保證，也不是來源同時改寫的原子快照或完整ZIP規格認證。真實slow disk、無法終止的OS I/O與全域RAM尚未接受。

詳見[QA](QA-v0.158.0.md)、[交接](HANDOFF-v0.158.0.md)及[來源封裝](RELEASE-ARCHIVE.md)。

## 完整測試分配


首份來源552e8e3d57791d39273fac323f3b1de90b5e0673與方法平均版7ae22fa82882c07d3eeb91fcaa46083c22ffdd4c，兩次封裝均由worker1觸及原120秒期限，parent各EOF1；兩份ZIP／FAILED／實際輸出保持，沒有成功manifest或發布。兩次各保留實際worker1自我登記身份，未印出的worker0身份不補造；最初789與平均版795直接完整通過的收據也保持。

在第二份指定來源的隔離副本注入逐方法計時，完整795案例的兩組方法實測94.641／114.827秒，整體117.984秒EOF0，副本刪除；計時只屬診斷，不能代替正式封裝接受。純test_schedule保留64項較昂貴方法的固定近似成本與其餘方法107單位fallback，驗證完整唯一ID／有限positive integer成本、依成本分配，再恢復每組原discovery相對順序。unknown／new方法仍完整執行，提示不能建立不存在的case；成本是近似毫秒，不是benchmark或速度保證。

原launcher的兩worker各自獨立discovery／完整執行 → parent再次獨立discovery／完整IDs與count及原handle EOF核對。兩worker／120秒整體期限、summary1／傳輸與來源容量保持，不略過或重複case。class fixture可以在兩隔離程序各自執行，共用HTTP fixtures用本機動態port0並teardown，filesystem fixtures用自身暫存。集中24項（8新增排程、16既有summary／真worker／deadline）通過。

正式完整797案例分組399／398，實測113.75秒，1既有skip／0expected failures，兩原worker EOF0；1911JS／153syntax／四Skills通過。標準CLI每批最多32個明確run records，完整去重清單按批terminal核對再聚合；沒有增加維護cap或全域程序權限。兩份失敗封裝使partial總數為5，保持不清理。正式指定提交封裝與remote驗證依最終收據，不把診斷計時當發布接受。

## v0.159.0 成本提示更新

首份指定來源158175b17b64cef70328166fee69460c4bc50285封裝觸及原120秒期限，ZIP與FAILED保留，沒有成功manifest或發布。隔離副本的800案例逐方法診斷EOF0／117.75秒，兩組方法104.606／114.407秒；診斷不替代正式接受。純test_schedule依同一份實測更新141項至少0.5秒的方法成本，其餘方法使用56單位平均fallback；算法、完整唯一IDs、相對discovery順序、兩worker／120秒與summary1保持，不增限／不刪除或重複case。按該次資料推算109.591／109.422秒只是分配依據，不是速度保證。24項既有排程／summary集中驗證與調整後完整800Python（分組396／404、109.36秒、1既有skip、0expected failures）通過，原worker身份／EOF核對；指定提交封裝仍另做原完整測試。
