# v0.79.0 交接

本輪新增最近一次逐句標記撤回，操作與分層見[CUE-STAMP-EDIT](CUE-STAMP-EDIT.md)，實際驗證见[QA](QA-v0.79.0.md)。history不進草稿、wire或Agent，不自動保存；刷新後清除。

原main 8526de2d44edd242c3d7661f70f0ad7f8243610e，以restore-v0.78.0-before-v0.79.0可逆。分支codex/iteration-v0.79.0；source commit由 `outputs/v79-qa/source-evidence.json` 記錄，指定commit封裝／SHA由 `outputs/releases/v0.79.0-<source12>/manifest.json` 記錄，最後merge main可與source tree精確比較。PR與release及實際下載證據在 `outputs/v79-qa/pr-evidence.json`、`release-remote-evidence.json`。

已通過545 Python／920 JS／86 syntax／四Skills、164組歷史ZIP和v78原封裝545／909還原；native22觀察、Agent good/bad/good→文件預覽／套用、390px Enter、133欄位限定還原、console0。首輪JS模擬環境缺controller及Agent QA錯誤期待值的failed records保留；相應fresh retries通過，無產品契約放寬。

兩個自有測試server／分頁已正常停止／關閉，viewport reset，無staging。final process與outputs維護以 `inventory-evidence.json`、`final-audit-aggregate.json` 為準。latest79／78／77保留；嚴格超七天且exact tag/Git archive可重建才能列候選，不清除草稿／媒體／未知檔／failed36與53或其他程序。

下一輪仍應從clean main建立restore tag及codex/iteration-*。14／啟庫21工具、Agent1／draft3／既有schema與legal4/private/not_submitted保持。連續播放、真實下載保存、screen reader／完整視覺、實聽及平台審核仍未驗證。rolling goal保持active。
