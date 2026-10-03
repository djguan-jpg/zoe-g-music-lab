# v0.25.0 本輪交接

2026-10-04 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）。前輪docs/HANDOFF-v0.24.0.md。

## 改變與分層

修正未完成校時建立只報泛用數字錯誤、停在建立按鈕且無原句／欄位定位。新增「檢查校時進度」和問題跳轉；建立前定位第一問題，保留原文、未標記值與音檔。欄位aria-invalid與文字待辦一起呈現，編修後舊報告標過期並停用下載／跳轉。

lyrics_review.py純原表格診斷／原列號／有限明細與Markdown；shared lyrics-review.js純重算、reply核對／注入controller；app只管理DOM、focus及原revision保護。暫排序檢查、最遠end可找跨句重疊，不改source順序、裁切／移動或猜時間。局部timed_rows不是全表通過；空表格明示no_cues。10000列完整count，report最多200明細、DOM前20與明確截斷。

application新lyrics_review，四adapter同層；CLI0是檢查無問題但需實聽、2是有待修正的報告已保存、1是request／I/O／覆寫拒絕。產品0.25／review schema1獨立，預設七tools／啟庫十二tools，新tool唯讀且無路徑權限。Agent1／MCP2025-11-25／draft3／library1／backup1／兩seed1／lyrics_package1／audio_loudness1／storyboard_frames1保持。詳見docs/LYRICS-REVIEW.md。

## 證據與還原

234Python／305JS／四Skill／22JS語法與diff、13新Python／16新JS及21項真IAB通過。50組Python／Node報告與Markdown一致、10000句全計數／明細有界；CLI／HTTP／JSON-lines／MCP與真實兩報告及草稿下載、晚500／成功／schema999、390px／Enter通過。完整lyrics仍驗證及排序匯出，診斷不能當字幕匯入，source／media保留。前版v0.24 ZIP543968bytes／SHA44ebe9fa6fb5ceb70464e7c83be75fea0bcc3b680cf2f4d46c0b2ea269637f14還原221／289，暫時解壓目錄移除。

codex/iteration-v0.25.0自main8121524cd9c3f832ffd59b54fff54cb2893e813d開始；restore-v0.24.0-before-v0.25.0指起點。指定commit封裝／manifest、privatePR合併／v0.25.0Release與遠端真下載依outputs/v25-qa收據確認。

先保存未提交編修，再git switch -c codex/restore-v0.24.0 restore-v0.24.0-before-v0.25.0，或git archive至新目錄；main以revert／PR還原，不reset／強推。使用者草稿／備份／素材與source還原分開。

## 未完成與資源

沒有ASR、模型或媒體生成。DOM幾何不是完整視覺；正式歌曲實聽、特定AgentHost、其他OS／browser與FreeTWAI投稿／創始人核實仍待。獨立HTML維持v0.24規則，本輪尊重既有file:政策阻擋，未嘗試或繞過，原生播放／下載未驗證。滾動目標active。

法律／署名四檔保持PolyForm Noncommercial1.0.0、private及ZOE. G，不授AGPL／商用；無production資料或auth變更。不參考其他本機／Git／記憶／vault，只使用本新工作區與通用工具。

managed服務正常shutdown，ownedtab33／34關閉、尺寸override清除。只查本輪確定PID／port與本專案outputs；最新三封裝SHA核對，超七天且Git／已驗遠端可重建才列候選，不清除使用者草稿／備份／媒體。最終程序／埠／封裝／刪除數依outputs/v25-qa/inventory-final.json。
