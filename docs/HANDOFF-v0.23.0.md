# v0.23.0 本輪交接

2026-10-03 · ZOE. G發起 · djguan-jpg/zoe-g-music-lab（private）。前輪docs/HANDOFF-v0.22.0.md。

## 功能與分層

修正秒數1 ms容差可接受一幀重疊、空缺或尾端不符的問題。storyboard_frames.py純映射／覆蓋／descriptor與storyboard-frames.js純驗證分層；creative完成影格核對後才序列化，seed重用相同最近整數／半幀取偶數映射。沒有自動改秒數、FPS、鏡頭或素材。

完成分鏡新增frame_timeline獨立schema1，JSON／CSV／prompts與摘要使用連續排他範圍；未知宣告／矛盾影格拒絕。舊有效報告核對並明示未宣告版本，seed1結果與未完成語義保持，JS不能接受半幀的另一個整數。原revision／晚到／File保護保持。產品0.23.0；Agent1／MCP2025-11-25／draft3／library1／backup1／兩seed1／lyrics_package1／audio_loudness1與六／十一工具不變。

從真草稿下載發現tool_version0.21.0過期，修正為0.23.0並回歸核對captureDraft與application版本；舊schema3草稿可讀，不改內容或自動遷移。方法見docs/FRAME-TIMELINE.md。

## 驗證與可還原

217Python／263JS、四Skill／20JS語法與diff通過；17新Python／16新JS。真正CLI／HTTP／JSON-lines／MCP錯誤後恢復、輸出與來源保留，CLI／MCP五檔bytes一致。20項IAB涵蓋四錯誤匯入拒絕、精確半幀、手動錯誤與Enter恢復、schema999／目前500／四秒晚成功及晚500、音檔保留、草稿預覽／取消／明確載入、實檔JSON／CSV／提示／草稿及390px DOM與鍵盤。Windows JSON／MD下載以CRLF正規化內容比較，CSV原bytes一致；沒有冒稱全部bytes相同。詳見docs/QA-v0.23.0.md。

分支codex/iteration-v0.23.0自main fe64cecf93599ee2a323ddaec6150049d5b1feab開始；restore-v0.22.0-before-v0.23.0指向起點。前版v0.22 ZIP503139bytes／SHAd48fbb1247edf752c39cf186d1c0db9729677335ac918b9d6451f113424c2873已安全核對／解壓200Python／247JS通過，暫時解壓移除。指定commit封裝、private PR合併、v0.23.0 tag／Release及遠端真下載以manifest與outputs/v23-qa/release-remote-evidence.json確認。

先保存未提交編修，再git switch -c codex/restore-v0.22.0 restore-v0.22.0-before-v0.23.0，或git archive到新目錄；main以revert／PR還原，不reset或強推。使用者草稿／備份／媒體與原始碼還原分開。

## 未完成與維護

影格連續不是正式歌曲／影片音畫同步、動作／轉場或成片驗收。DOM幾何不是完整視覺；特定Agent host、其他OS／browser與FreeTWAI投稿／平台創始人核實仍未完成。沒有模型／ASR／媒體生成。滾動目標active，後續依可重現的創作流程缺口持續，不把單次release當整體目標完成。

PolyForm Noncommercial1.0.0、LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保持，不另授AGPL／商用。Repo private，沒有公開或修改平台live data。只讀本次新工作區、通用工具指引與本輪自有合成資料；沒有其他使用者作品／記憶／vault。

本輪managed服務正常shutdown返回，owned tab27／28關閉、尺寸override清除。只盤點本專案outputs與確定PID，保留最新三封裝；未滿七天不列清除，使用者草稿／備份／素材不可Git重建且不清除。最終PID／埠／封裝／遠端byte核對及刪除數以outputs/v23-qa/inventory-final.json為準。
