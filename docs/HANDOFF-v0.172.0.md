# v0.172.0 交接

使用者最新要求是實用性與成熟工具分工，並明確要求不採用的編輯器直接隱藏。一般介面現在只有字幕交付、音檔核對、素材交接；舊編輯 DOM 保留在 `legacy-top`／`legacy-editors` 隱藏容器，不自動載入示範。內部草稿載入與流程切換不能揭露編輯器。成果返回按鈕定位可見匯入面板。

閱讀[實用性門檻](PRODUCT-UTILITY.md)，後續先驗證一件真實作品是否省步驟，不能再以版本數或測試數選功能。不要自行重啟通用剪輯、人工校時或圖片影片產品方向。

原起稿資料覆蓋問題已修，純 core → DOM／app／HTTP → metadata → 文件分層保存，見[契約](MV-SEED.md)及[QA](QA-v0.172.0.md)。沒有新依賴、模型、產品外網、Agent operation 或權限擴張。

還原點 `restore-v0.171.0-before-v0.172.0` 指向 `d483ffb5027550d8f2bc5e232293eb6fad8dbdf4`，候選分支 `codex/iteration-v0.172.0`。完整接受與精確 source package 通過後可建立 Draft PR／候選封裝；指定資安掃描與結果審閱完成後才合併、tag 與 release。精確 commit／ZIP／manifest／remote 狀態以 `outputs/v172-qa/acceptance-3` 收據為準。前兩份完整失敗紀錄保持。

使用者新增指定 AI Security Scanner。已查官方 v0.5.0 與 SKILL，沒有本機安裝 app／CLI；本輪準備官方 Windows 安裝檔，沒有執行安裝或掃描。來源／依賴／秘密與設定檢查都仍 `not_executed`；依[本版 QA](QA-v0.172.0.md) 接續 app readiness 與桌面開始，以確切候選來源作本機掃描，不得把 CLI plan 或其他工具當成此 scanner 的執行。沒有真實 case／run／engine outcomes 不宣稱通過；正式版保持 v171。

最新三個已發布版本與未知／partial／FAILED 保留；只有原標準核對通過且嚴格超過七天的合格封裝才能清理。只核對已記錄的自有程序，不能把全機程序當成殭屍刪除。rolling goal 仍 active，本版接受不代表整個產品已完成。
