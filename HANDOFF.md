# v0.21.0 本輪交接

2026-10-03 · ZOE. G發起 · djguan-jpg/zoe-g-music-lab（private）。前輪docs/HANDOFF-v0.20.0.md。

## 還原與封裝

分支codex/iteration-v0.21.0自main eddb3fd68a46e503f92f62348c42ccbda62146ef開始；restore-v0.20.0-before-v0.21.0指向起點。前版v0.20 ZIP455497bytes／SHA25a704fc92ad9b9f91cacf15308a85bf82e7a190933c96269de86ccf0c3a547c，安全路徑／CRC／180Python／220JS還原通過。

指定commit封裝、private PR合併、v0.21.0 tag／Release及真遠端bytes以manifest與outputs/v21-qa/release-remote-evidence.json確認。先保留未提交改動，再git switch -c codex/restore-v0.20.0 restore-v0.20.0-before-v0.21.0，或git archive至新目錄；main用revert／PR，不reset／強推。草稿／備份／媒體與原始碼還原分開，無覆寫或自動遷移。

## 功能、分層與可逆

基線真IAB編修歌名後reload直接丟失。draft-retention.js純checkpoint重用既有MusicLibrary panel fingerprint，範例與file／library／download各最近一份完整確認作比較；key順序與metadata不算編修，文字空白／列順序／空列有意義，不混合來源冒充已存版本。純狀態不保存File／路徑／binary，不進draft3或Agent。

注入createGuard管理scope擷取、全草稿重查、listener增減與DOM callback；app capturePanel／captureDraft同源，markDirty只擷取被改工作台，離頁重查全草稿。保存callback新增隔離click-time draft，晚到回應不能確認後來編修；未知保存／重試／放棄不解提醒。下載先驗證與記snapshot，再明確核對本機檔後確認；原生檔／庫版本明確載入才留比較點，legacy轉換需另存。撤回／刪除還原後依實際內容判定。

fetch前建立初始點，範例回應晚到只有當前仍等於初始內容才載入，否則保留編修；即使編修已保存也不能冒充可覆寫。三個export表單共用同源iframe，不卸載工作台。還原本輪原始碼或撤回載入可逆；新另存狀態無持久欄位或自動資料遷移。

產品0.21.0，Agent1／MCP2025-11-25／draft3／library1／backup1／兩seed1／lyrics_package1、六／十一工具保持。無新依賴、auth、Host設定、模型或網路呼叫；LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保持，PolyForm Noncommercial1.0.0不另授AGPL／商用。private、FreeTWAI未投稿／未核實創始人。

## 驗證與限制

182Python／237JS，四Skill／19JS語法與diff；兩新Python／17新JS。seed markDirty VM fixture補注入實際retention controller，既有生成成果dirty斷言保持。29項IAB詳細在docs/QA-v0.21.0.md：真Agent保存／讀取／EOF→瀏覽器預覽／載入、四秒保存／500後新編修、原生draft5891／手機draft5854／brief2103bytes及Python讀回、明確確認／下載後編修／整份撤回、四工作台／列增刪、legacy、PCM與390px Enter。console空，桌面1280／1265與手機390／375無頁面橫向溢出。

beforeunload原生點擊後實際opening／closed(false)且編修保留；沒有trusted activation時IAB省略提醒並reload，列為瀏覽器限制。不是自動保存／磁碟監控／當機恢復，音檔／成果／刪除歷史另存；每種來源只記本頁最近一份。沒有截圖／完整視覺、其他OS／browser、正式實聽、特定Host、ASR／生成媒體或FreeTWAI投稿。滾動目標active，這些驗收仍待，不能把DOM幾何當完整視覺。

## 本輪程序與產物

合成來源、真下載、Agent／保存庫、測試／還原／封裝／發布收據在outputs/v21-qa，不進Git。原生下載僅讀工具回傳的指定檔；沒有掃描或刪除其他Downloads。最新三封裝v21／v20／v19保留，更舊未滿七天仍保留；使用者草稿／備份／原媒體不是Git重建候選。

baseline exec56298／PID117248與current exec70388／PID300376經qa-stop正常exit0／server_closed，tab25關閉，CDP override清除。前版檢查exec43368正常完成／暫存目錄移除，源測試exec44287正常完成。最終確認PID／8875 listener與本輪outputs清理以inventory-final.json為準。沒有持久服務／監控或停止其他程序；只讀本新工作區及通用指引，未參考其他使用者專案／記憶／GitHub。
