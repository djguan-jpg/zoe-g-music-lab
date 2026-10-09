# v0.172.0 交接

使用者最新要求是實用性與成熟工具分工，並明確要求不採用的編輯器直接隱藏。一般介面現在只有字幕交付、音檔核對、素材交接；舊編輯 DOM 保留在 `legacy-top`／`legacy-editors` 隱藏容器，不自動載入示範。內部草稿載入與流程切換不能揭露編輯器。成果返回按鈕定位可見匯入面板。

閱讀[實用性門檻](PRODUCT-UTILITY.md)，後續先驗證一件真實作品是否省步驟，不能再以版本數或測試數選功能。不要自行重啟通用剪輯、人工校時或圖片影片產品方向。

原起稿資料覆蓋問題已修，純 core → DOM／app／HTTP → metadata → 文件分層保存，見[契約](MV-SEED.md)及[QA](QA-v0.172.0.md)。沒有新依賴、模型、產品外網、Agent operation 或權限擴張。

還原點 `restore-v0.171.0-before-v0.172.0` 指向 `d483ffb5027550d8f2bc5e232293eb6fad8dbdf4`，候選分支 `codex/iteration-v0.172.0`。完整接受與精確 source package 通過後可建立 Draft PR／候選封裝；指定資安掃描與結果審閱完成後才合併、tag 與 release。精確 commit／ZIP／manifest／remote 狀態以 `outputs/v172-qa/acceptance-3` 收據為準。前兩份完整失敗紀錄保持。

使用者指定 AI Security Scanner。前次在 PATH 與已知位置未找到 app／CLI；之後使用者回覆已經安裝，並明確要求此次掃描稍後再做、先處理其他專案。這是使用者提供的最新狀態，尚未獨立核對安裝或執行 `doctor`。官方 v0.5.0 Windows 安裝檔已下載並核對同 release 的 SHA-256，但本輪沒有執行安裝或掃描；不要再次安裝、啟動 app 或恢復掃描。

待使用者明確恢復此次掃描後，先定位既有 CLI 並核對 app readiness，再由支援的桌面控制啟動本機 source scan。使用確切候選來源，不得把 CLI plan 或其他工具當成此 scanner 的執行。來源／依賴／秘密與設定檢查仍 `not_executed`；沒有真實 case／run／engine outcomes 不宣稱通過。Draft PR #171 與已驗證封裝保留，正式版保持 v171。

此次接續只修正三份交接／接受／施工文件，沒有新產品版本或功能。完整接受與成功封裝的固定来源是 `b295f09cf88644da7d55babf7952e312f573c7d7`；後續文件提交另以 source checkpoint 核對 CRC／raw Git blobs，不能宣稱整個新提交已重新執行全套。程式、測試、契約與其他來源須逐份與該已接受提交相同。接續還原點 `restore-v0.172.0-before-handoff-deferral` 保留原候選。

最新三個已發布版本與未知／partial／FAILED 保留；只有原標準核對通過且嚴格超過七天的合格封裝才能清理。只核對已記錄的自有程序，不能把全機程序當成殭屍刪除。rolling goal 仍 active，本版接受不代表整個產品已完成。
