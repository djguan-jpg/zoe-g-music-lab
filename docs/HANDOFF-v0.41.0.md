# v0.41.0 交接與可逆

ZIP 預覽新增可下載的 JSON／Markdown 差異報告，帶來源 ZIP SHA／bytes、原 manifest、完整變更清單，原成果文字與媒體另存。下載保持目前結果，後續修改停用舊報告；CLI／Agent／MCP 的明確 report opt-in 與 Python／browser 同契約。修正原生 form 換行正規化，真下載逐 bytes 相同；launcher 可完整列印選定 WAV／ZIP 啟動設定。預設 text writer exclusive create 保留 raced-in 同名檔案，多檔可能部分寫出，沒有回滾假設。

見[使用與分層](DELIVERY-REPORT.md)、[QA](QA-v0.41.0.md)。365 Python／554 JS／44 syntax／4 Skill；四scope8份原生報告完整 bytes 相同、原 WAV SHA 保持、鍵盤下載／Apply／Undo／晚 reply 與三寬度 geometry 通過。v40 ZIP349／546還原通過。特定 Host／正式媒體／實聽／完整視覺／FreeTWAI仍待，rolling active。

## Git與恢復

branch `codex/iteration-v0.41.0`；restore `restore-v0.40.0-before-v0.41.0` 指向 main 起點 `7a6bc53ac38deaba3f2f7a249f75335e93d9af3b`。需要恢復時從 restore tag 另建分支，不 hard reset 未提交創作。v0.41.0 tag 與 `outputs/releases/v0.41.0-提交前12碼/manifest.json` 指定 exact source；main merge commit 由 private PR 收據確認。

前版 v40 source `9cb45f72199bf83c88afb8c5c7b586b2deabe345`，ZIP892950bytes／SHA `e16026e09ec495b6cbe88e14c1e32fca0aa13957180e0c2ffb5d9161054214d7`，位於 `outputs/releases/v0.40.0-9cb45f72199b`。源碼包不帶 outputs、原媒體或秘密。

## 發布與維護

白名單 source 與 legal4 核對，指定 commit 封裝完整 tests／Agent／MCP 通過後 private PR merge／private prerelease，核對實際遠端下載 SHA、refs／tree／main clean。確切結果見 `outputs/v41-qa/source-evidence.json`、`package-evidence.json`、`release-remote-evidence.json`，本機收據不進 Git。

自身 server305732／291784 原 handle 正常退出，tabs69／70關閉及 viewport reset；兩 server 自己的 staging records0／root清除。latest3保留41／40／39；只有嚴格七天以上且 exact Git/tag 已驗證可重建封裝才能清除，無合格候選不刪除，舊 FAILED／原媒體／草稿／備份／其他程序保持。最終限定盤點與 typed run 判定見 `outputs/v41-qa/inventory-final.json`／`audit-all-records-final.json`。

保持純 report／application／adapter、跨語言 model／controller／DOM 分層。report schema1 與 comparison1／inspection1／package1／Agent1／draft3 獨立，12／17工具保持。未知來源工具拒絕，升版同步 Python producer／inspector、browser package／archive／import／report 的明確支援表及測試；目前38／39／40／41。form encoding 只傳 JSON 字串，原文在 HTTP decoder 後回復；不要用全域換行正規化處理下載。

PolyForm Noncommercial、不另授 AGPL 或商用許可。創辦署名 ZOE. G／GitHub djguan-jpg，AI 協作披露；平台 `not_submitted`，不能將 private GitHub 發布說成平台創始人審核通過。
