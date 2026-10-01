# v0.3.0 本輪交接

日期：2026-10-01 · 發起人 ZOE. G · Repo djguan-jpg/zoe-g-music-lab（private）。

## 分支與還原

- 本輪分支：`codex/iteration-v0.3.0`。
- 起點：`55aa613358d66f3b8911733d0305fcc1b1d118b1`（v0.2.0）。
- 開工還原點：`restore-v0.2.0-before-v0.3.0`。既有 `v0.2.0` tag 保留。
- 本輪成果以 `v0.3.0` tag、private PR、原始碼 ZIP 和 manifest 交付。包內驗收通過後以 private PR 合併至 main，保留合併與還原紀錄。

取得另一份 v0.2 程式而不改動目前檔案：

```powershell
git archive --format=zip --prefix=zoe-g-music-lab/ --output=outputs/v0.2.0-restore.zip v0.2.0
```

先解壓到新目錄，再執行該版。若只需要另一個分支，可使用 `git switch -c codex/restore-v0.2.0 v0.2.0`，事前先保存未提交內容。不要使用強推或清除 Git 歷史。

## 已修正與新功能

詳見 CHANGELOG.md。HTTP、CLI、Agent 共用 application 層；Agent 採 JSON-lines v1，四種操作皆可呼叫，不自動呼叫模型或寫檔。草稿保存編修欄位並可回讀、撤回表單；音檔與成果另存。歌詞播放跟隨即時編修，最新音檔選擇可使舊解碼結果失效，關閉頁面會釋放 Blob URL／AudioContext。

## 授權決策

使用者明確選擇 PolyForm Noncommercial 1.0.0，取代 AGPL v3。LICENSE 為官方原文，來源與比對見 LICENSING.md。四個 Skill、程式、文件與合成範例共用此授權。一般商用未獲此版授權；匯入素材的許可各自保留。

## 驗證與下一輪

本輪驗證證據見 docs/QA-v0.3.0.md。封裝腳本以指定提交產生 ZIP，檢查完整性及每檔摘要，於暫存目錄解壓並執行測試。manifest 對應確切提交；不得以工作區測試取代包內測試。

下一輪仍需正式歌曲評測、完整視覺／跨瀏覽器驗收、Agent 平台實際接入，以及 UI 多母題與其他創作缺口的盤點。此輪已提供可回讀草稿，未加入跨重載自動保存、ASR、媒體生成、LUFS 或 true peak。

自由工坊投稿未送出，Repo 未公開。公開授權問題仍待使用者回答；非商用作品是否符合平台入選規則仍待核實。平台作者／創始人核實不能以自行聲明代替。

## 產物與程序保留規則

本輪以新命名目錄保存驗證／封裝，音檔與其他私人物料不進 Git。每輪保留最新三個封裝版本，過七天且有可讀可還原證據的舊封裝才可清除。本輪沒有超出保留規則的舊版本，不能為了顯示清理而刪除目前素材。

本輪三個臨時測試程序已停止，8875 的監聽數為 0；測試頁已關閉。盤點 outputs 共 24 檔、11,660,413 bytes，沒有超過七天的產物或超出保留數的封裝；本輪無清除候選。盤點明細在忽略的 outputs/v03-qa/maintenance.json。

不動其他程序、不建立背景監控。下次驗證由 `python music_lab_server.py` 明確啟動，Ctrl+C 停止。
