# v0.8.0 本輪交接

2026-10-03 · ZOE. G 發起 · djguan-jpg/zoe-g-music-lab（private）。前輪交接保存於 docs/HANDOFF-v0.7.0.md。

## 還原與 Git

- 分支 codex/iteration-v0.8.0；起點 dc0663dd151456b8532ae4d3462f24667bc15f86。
- 開工還原點 restore-v0.7.0-before-v0.8.0；v0.7.0 tag／封裝保留。
- 指定提交封裝解壓驗收後，以 private PR 合併，v0.8.0 tag／Release 附 ZIP／manifest。精確提交、SHA-256 與合併狀態以 manifest／GitHub 實際結果為準，本文不是合併證明。

取前版到新分支：git switch -c codex/restore-v0.7.0 restore-v0.7.0-before-v0.8.0；先保存未提交內容。或 git archive --format=zip --prefix=zoe-g-music-lab/ --output=outputs/v0.7.0-restore.zip restore-v0.7.0-before-v0.8.0，解壓至新目錄。保留歷史，需要回寫 main 時以 revert／PR 處理。

本輪重新核對 v0.7 ZIP 摘要並解壓，原版 62 Python／24 JavaScript 通過。

## 分層與契約

deletion-history.js 提供與 DOM 分離的列刪除／選擇還原、錨點插入、自動副作用反向比對及各工作台 bounded 紀錄。app.js 的集合 adapter 保持原始數值字串與頁內 ID，維持標籤／焦點／dirty／母題 ID 保留與清除界線。六種列支援還原，最多 20 筆，可選較早紀錄；容量滿則拒絕並保留紀錄。

還原不套用全 panel 快照、不重設音檔。分鏡自動時間只在目前值仍相同時撤回，手動改過的值保留並提示重新檢查。載入內容清除被取代的工作台紀錄；完整草稿清除三個創作紀錄；歌詞驗證保留，成功讀取原文清除。

run 將請求時 revision 判定提供給歌詞 adapter；匯入／驗證在套用回應前檢查，晚回應不覆蓋後續編修。其他工作台修改不影響有效回應。領域計算仍在既有 application／domain，HTTP 僅增加明確的新 JS allowlist asset。

產品 0.8.0；Agent protocol 1、MCP 2025-11-25、草稿 schema 3 不變。頁內 ID／刪除紀錄／展開狀態不序列化，不自動遷移。未知版本拒絕。

## 授權、驗證與接續

維持 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 未變；創辦署名 ZOE. G／GitHub djguan-jpg，AI 協作如實記錄。只使用本次工作區新作品與通用指引，沒有其他個人專案、記憶、秘密或第三方程式搬入。沒有新增依賴。

62 Python／38 JavaScript／四 Skill、瀏覽器下載／回讀、六種還原、音檔保留、容量／20 筆界限、受控延遲與桌面／窄螢幕 DOM 驗證見 docs/QA-v0.8.0.md。封裝在精確解壓目錄再跑所有測試、Agent metadata／MCP 握手。

沒有特定 Agent host 安裝或模型執行、完整官方 conformance／完整視覺與跨瀏覽器／正式作品／媒體生成／ASR／LUFS／true peak。下一輪優先實際 Agent host 的接入、正式作品評測、使用者創作的長期保存與完整視覺驗收；不以單輪交付宣稱整個滾動目標完成。

FreeTWAI 公開決策仍未確認；Repo private，未投稿或取得平台創始人核實，沒有更動 live data。

## 產物與程序

只盤點本工作區 outputs；inventory-start.json／inventory-final.json、合成延遲與前版驗證證據在 outputs/v08-qa。最新三版 v0.6／v0.7／v0.8 保留；其他產物未超過七天也保留。只清除超過七天且已驗證可由本專案 Git／遠端備份重建的產物，本輪無候選／素材刪除。

本輪臨時 HTTP exec 88364／21455／21684 已 Ctrl+C 退出（exit 1），8875 監聽數 0；測試頁 8 關閉、viewport reset。MCP／測試 bounded／EOF 退出，不清理其他程序，不保留持久服務或背景監控。
