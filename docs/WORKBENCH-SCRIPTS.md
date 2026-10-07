# 工作台腳本的頁面組裝

固定HTTP白名單提供HTML、契約與純模組。每個外部script需有自己的結束標籤、唯一self來源與defer，內文為空；依賴先於controller／DOM adapter與app。外部script存在於原文不代表瀏覽器建立了節點，缺少結束標籤會吞掉下一個模組標記。

備份核對依序為verification-focus、backup-verification、backup-verification-controller、backup-verification-dom、backup-download-dom與app。純policy、controller、native File／SHA adapter、產品下載來源維持原分層；修正只補HTML結束標籤，不替換原解析、增加route或放寬CSP。

tests/test_workbench.py使用HTMLParser解析實際HTTP頁面，核對獨立defer節點、空內文、唯一來源、依賴順序，並GET每個實際腳本核對200／javascript／nosniff與非空內容。這是組裝驗證，另以Chrome原生選檔驗證真實載入與大小／SHA匹配。

備份核對不恢復、不載入或修改草稿庫。不同次export帶各自created_at，不能要求其ZIP整包相同。核對目標為本輪送出的精確ZIP；同大小仍需完整SHA。QA只保存同份伺服器回應供選檔，不代表已驗證Chrome將下載保存到磁碟。

目前版本容量見[版本契約](DELIVERY-VERSIONS.md)；授權、Agent操作與其他作品原值保持。沒有以測試或下載送出取代人類創作、實聽、完整視覺、保存下載、Host或平台作者核實。
