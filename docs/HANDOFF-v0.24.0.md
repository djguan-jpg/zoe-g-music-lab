# v0.24.0 本輪交接

2026-10-03 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）。前輪docs/HANDOFF-v0.23.0.md。

## 功能與架構

修正原生選音檔metadata將已有作品宣告默默改寫。已有10秒、選6秒仍保持10；明確採用才改6，撤回只還原時長、保留後續歌詞。原本空白且pending期間未編修才接續首個有效時長。未知媒體／舊來源不改內容，較短宣告不裁切cue。

musiclab/assets/lyrics-media.js純compare／mediaTime與注入controller分層，app與獨立HTML只接DOM／播放器。source URL／revision／snapshot／一次undo不進draft3或payload；actual after／source不符拒絕撤回。獨立Apply不直接使用player.duration，沿用來源或明確欄位，保留歷史review_notes。真HTTP script依賴順序回歸防止初次遺漏defer載入的bug。方法見docs/LYRICS-MEDIA-DURATION.md。

產品0.24.0；Agent1／MCP2025-11-25／draft3／library1／backup1／兩seed1／lyrics_package1／audio_loudness1／storyboard_frames1與六／十一工具保持。沒有新依賴、模型、ASR或持久schema遷移。

## 驗證與還原

221Python／289JS、四Skill／21JS語法與diff通過；四新Python／26新JS。真正四adapter、原生合成4／6秒媒體／壞音檔、20項IAB、明確採用／撤回／後續編修、current500／四秒晚成功與晚500保留、實檔三成果及草稿、MCP回讀、390px DOM與Enter通過。下載使用實際browser package的CRLF正規化文字比對；Pythonfloat與JSinteger JSON語義相同，不宣稱所有bytes相同。CLI／MCP同payload四檔bytes一致。

分支codex/iteration-v0.24.0起點main9c7c2391fbea49468b21330fb12d40289973a089；restore-v0.23.0-before-v0.24.0保留起點。前版v0.23 ZIP523007bytes／SHA a8d16341bb94702dd35ed67cf90dfcabfe8ba285aeaa5e10e776a3930392451f已安全解壓，217／263通過，臨時目錄移除。指定提交封裝／privatePR合併／Release與遠端bytes以manifest和outputs/v24-qa/release-remote-evidence.json確認。

先保存未提交編修，再git switch -c codex/restore-v0.23.0 restore-v0.23.0-before-v0.24.0，或git archive到新目錄；main用revert／PR，不能reset／強推。使用者草稿／媒體／備份與原始碼還原分開。

## 未驗證與維護

browser工具file:安全政策擋下獨立預覽，本輪只做實際source函式受控VM；原生離線播放／下載未驗證，沒有繞過。DOM幾何不是完整視覺；正式歌曲實聽、AgentHost、其他OS／browser、FreeTWAI投稿／創始人核實仍待。滾動目標active，下一輪依可重現創作流程缺口進行，不以單次release當整體完成。

LICENSE／NOTICE／LICENSING／FOUNDER-RECORD、PolyForm Noncommercial1.0.0與private保持，無AGPL或商用許可／平台live data變更。只讀本新工作區與通用工具指引，沒有其他使用者作品／Git／記憶／vault。

managed QAservice正常shutdown／EOF，ownedtabs29／31／32關閉、尺寸override清除。每輪僅盤點本專案outputs及確定PID，最新三封裝SHA核對；超七天且Git／已驗遠端可重建才列清除。使用者草稿／備份／素材不可清除；最終程序、埠、封裝與刪除數見outputs/v24-qa/inventory-final.json。
