# v0.31.0 本輪交接

2026-10-04 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）；前輪[交接](HANDOFF-v0.30.0.md)。

## 改變與分層

基線歌曲待辦只在工作台可檢查，Agent沒有同一診斷，沒有可交付報告。新music_review.py以draft3原歌曲panel作純形狀／必填／範圍診斷、保留原字串與原列，確定性JSON／Markdown；application供HTTP、CLI、JSON-lines、MCP同一結果。工作台保留即時定位，新增明確「建立待辦報告」。見[MUSIC-REVIEW](MUSIC-REVIEW.md)。

JS重用music-readiness純模型產生同一report／Markdown，接受回覆前重算完整source／data／JSON／Markdown與protocol／schema。app先捕捉原欄位，既有revision／late guard與busy保護；核對後才替換成果並隱藏舊設計。來源不同、未知版本／JSON矛盾、晚回應都保留原成果與後續編修；其他工作台、音檔、草稿保存狀態保持。

40段／每種清單100、全部計數／200明細／前20UI；純source8MiB、傳輸2MiB／CLI草稿1MiB。新的zoe-music-review schema1與產品0.31、Agent1／MCP2025-11-25／draft3獨立。新增唯讀music_review operation／tool，預設8／啟庫13，需重新discovery；舊完成規劃schema保持。沒有新依賴、模型、auth、production或路徑／寫檔權限。

## 驗證與還原

258Python／391JS／四Skill／29語法／diff，9新Python／9新JS、75真Node↔Python報告／Markdown、18IAB通過。兩native成果／四adapter，真draft3→CLI --draft及Agent、390px Enter／兩控制框、不同來源／未知版本／4秒晚回應、原音檔保持。詳細見[QA](QA-v0.31.0.md)，未完整視覺或實聽。

branch codex/iteration-v0.31.0；restore-v0.30.0-before-v0.31.0指main起點212bf654285d6ff6b47aa7f3df675df778d17c0c。前版v0.30 ZIP666048bytes／SHAaf30de80a13871348a945de27df0f6bd9d9f4e8999fb7d62cf45727ff8481c2c，249／382解壓通過且限定暫存已移除。本版指定commit封裝／manifest、privatePR合併／Release／遠端實際bytes以outputs/v31-qa收據為準。

先另存未提交編修，再git switch -c codex/restore-v0.30.0 restore-v0.30.0-before-v0.31.0，或git archive到新目錄。main用revert／PR還原，不reset或強推。Git不保護使用者草稿／備份／素材，須另存。

## 待驗及維護

正式媒體／實聽／成片、完整視覺、特定Agent Host、其他OS／browser、原生file播放及FreeTWAI投稿／創始資格仍待，舊file政策阻擋未嘗試或繞過；rolling active。

PolyForm Noncommercial1.0.0／private／ZOE. G及四個法律／創辦檔保持，無AGPL／商用許可。本輪只讀本次工作區與通用工具，未參考其他本機／Git／記憶／vault。

owned49／50tabs已關閉、viewport reset，managed QA正常shutdown。限定確定PID／8875與本專案outputs盤點，核對最新三版SHA；過七天且Git tag／已驗遠端可重建才列清除候選，草稿／備份／原素材不清。實際程序與刪除數見outputs/v31-qa/inventory-final.json。
