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
