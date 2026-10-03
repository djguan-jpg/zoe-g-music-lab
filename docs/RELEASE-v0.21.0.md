# v0.21.0 封裝與還原

分支codex/iteration-v0.21.0；起點eddb3fd68a46e503f92f62348c42ccbda62146ef，restore-v0.20.0-before-v0.21.0保留起點。產品版本0.21.0，所有protocol／領域schema保持；PolyForm Noncommercial1.0.0、ZOE. G創辦署名及private保持。

以scripts/package_release.py --ref指定提交，ZIP安全檔名／CRC、解壓原版測試、Agent與MCP metadata皆須通過；manifest記source commit／每檔摘要／ZIP bytes及SHA。私人PR驗證head與base後合併，合併tree與source tree相同才發布；版本tag指向被封裝source提交，main保留merge提交。Release為private repo內prerelease，ZIP＋manifest實際遠端下載與本機逐byte、size、GitHub digest核對；收據outputs/v21-qa/release-remote-evidence.json。

還原先保留未提交編修，再git switch -c codex/restore-v0.20.0 restore-v0.20.0-before-v0.21.0，或git archive至新目錄。main以revert／私人PR回寫，無reset或強推；草稿庫、備份與媒體不隨程式還原或schema遷移。前版ZIP已受限還原180／220測試通過。

見HANDOFF.md與QA-v0.21.0.md。另存提醒不是自動保存，beforeunload可能被browser／OS省略；正式作品、完整視覺與特定Host待驗。FreeTWAI未投稿／創始人狀態未核實。
