# v0.32.0 本輪交接

2026-10-04 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）；前輪[交接](HANDOFF-v0.31.0.md)。

## 改變與分層

基線分鏡待辦只有本頁即時定位，Agent無同一診斷且不能交付報告。storyboard_review純原形狀／必填／畫面方向／母題引用、原列／related_row、確定性JSON／Markdown；application、CLI --input／modern --draft、HTTP、JSON-lines、MCP共用。新[STORYBOARD-REVIEW](STORYBOARD-REVIEW.md)記錄契約與容量。

storyboard-readiness沿既有純診斷重算report；readiness-report為歌曲與分鏡共用無DOM核對層，確認完整source／data／嚴格JSON／Markdown、protocol與meta後才交出隔離結果。app只管capture、revision／late guard、busy、定位與成果提交。來源不同／未知版本／晚回應保留原成果、後續編修、音檔與另存狀態。

1000鏡／30母題／全部計數／200明細／20UI；純source8MiB、傳輸2MiB、CLI草稿1MiB。新zoe-storyboard-review schema1／產品0.32／Agent1／MCP2025-11-25／draft3分開；9基本／啟庫14工具，需重新discovery。原ID／鏡號／留白保持；零待辦仍需完整時間／影格／連戲及媒體核對。沒有模型、依賴、auth或路徑權限新增。

## 驗證與可逆

267Python／400JS／四Skill／30語法／diff、64跨語言完整report／Markdown、27IAB、兩native成果／四adapter、實draft3→CLI及Agent、390px Enter、35待辦／20定位、母題原列、不同來源／未知版本／4秒晚回應、完整重疊拒絕及修正後576影格、原音檔與保存確認通過。詳見[QA](QA-v0.32.0.md)，不宣稱完整視覺／實聽。

branch `codex/iteration-v0.32.0`；restore `restore-v0.31.0-before-v0.32.0` 指main起點 e17793339fd23d818bf098d19a4e35982173d9be。前版v0.31 ZIP688945bytes／SHA c62bff251711027c0f1aa680ae6160f45023039d17e2ab9c97be26f6c9ab9b33，258／391解壓通過、限定暫存移除。本版指定commit封裝、manifest、privatePR合併／Release、遠端實際bytes以 outputs/v32-qa 收據為準。

先另存未提交編修，再 `git switch -c codex/restore-v0.31.0 restore-v0.31.0-before-v0.32.0` 或git archive到新目錄；main以revert／privatePR還原，不reset或強推。Git不保護使用者草稿／備份／素材，須另存。

## 待驗與維護

正式實唱／實聽／成片、完整視覺、特定Agent Host、其他OS／browser、原生file播放、FreeTWAI投稿／創始資格仍待；不繞過既有file政策。rolling active。

PolyForm Noncommercial1.0.0／private／ZOE. G及LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保持，不另授AGPL／商用。本輪只讀本工作區與通用指引，未參考其他本機／Git／記憶／vault。

正常結束本輪QA服務與明確程序，關閉tab51／52並恢復viewport。唯讀盤點outputs及封裝，保留最新三版32／31／30；只列超過七天、可由Git或已驗遠端備份重建的本專案清除候選。草稿／備份／素材與其他程序排除，無候選不刪除。最終數字見inventory-final收據。
