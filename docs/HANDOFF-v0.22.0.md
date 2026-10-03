# v0.22.0 本輪交接

2026-10-03 · ZOE. G發起 · djguan-jpg/zoe-g-music-lab（private）。前輪docs/HANDOFF-v0.21.0.md。

## 還原與封裝

分支codex/iteration-v0.22.0自main f7c3ddbbe7545b2ebc75ed31eb82cc318100bafd開始；restore-v0.21.0-before-v0.22.0指向起點。前版v0.21 ZIP475586bytes／SHA3cad5d8d03656495c7f6ba88a162a2b20de1efc3c1fefcedf3b6f6917a47ef27已安全核對／解壓並通過182Python／237JS，暫時解壓目錄移除。

指定commit封裝、private PR合併、v0.22.0 tag／Release及真遠端bytes以manifest與outputs/v22-qa/release-remote-evidence.json確認。先保留未提交編修，再git switch -c codex/restore-v0.21.0 restore-v0.21.0-before-v0.22.0，或git archive至新目錄；main用revert／PR，不reset／強推。使用者草稿／備份／媒體與原始碼還原分開，沒有覆寫或自動遷移。

## 功能與分層

補齊原本只有RMS／sample peak的交付檢查，新增獨立LUFS整合響度。loudness.py純K-weighting兩段biquad、400ms／100ms nearest-sample幀排程、兩道gate與schema1報告；沒有I/O或目標判斷。單聲道／立體聲各自能量相加，反相不混音為靜音。48k係數依ITU-R BS.1770-5 Annex1數值，其他rate由類比極點／增益雙線性轉換，自行實作、無搬入第三方程式碼。

400ms frame energy history有界；loudness_blocks.py自有8-byte區塊ledger在64KiB後轉暫存檔，兩次串流計算門檻，成功與錯誤均close。audio.py在同一次copied_audio的PCM掃描餵入，SHA／RMS／LUFS同份來源，不重新開來源或呼叫FFmpeg。來源不改寫，CLI大小範圍與UI64MiB保持。

至少400ms、8000–192000Hz、已知mono／stereo。短檔、門檻下、未知多聲道位置或響度rate範圍外明確null／不可測，不把它當0／−70或接受通過／失敗；原有PCM警告／needs_review／退出碼保持。報告新增loudness獨立schema1，產品0.22.0；Agent1／MCP2025-11-25／draft3／library1／backup1／兩seed1／lyrics_package1與六／十一工具保持，discovery增加audio_loudness。

純audio-review.js核對版本／有限值／來源幀時長／聲道權重／區塊數與尾幀／gate一致性，未知schema拒絕；舊無loudness報告仍可讀並標未提供。app只顯示獨立摘要，既有File／profile／revision晚到保護保持。未指定平台目標、未正規化，sample peak不是true peak。

## 已驗證範圍

200Python／247JS、四Skill／19JS語法與diff；18新Python／10新JS。參考係數／率域穩定、增益差／頻率權重／反相、gate／短檔邊界、奇數rate／分塊不變、ledger溢存與關閉、原來源替換仍量測副本、真CLI／HTTP／JSON-lines／MCP一致性通過。舊retention測試版本改核對__version__，沒有放寬結果。

20組原創合成WAV與本機既有FFmpeg7.1校對，最大差異0.009464 LU（容差0.02），含噪音、脈衝、50Hz／1kHz／5kHz、門檻、反相、四位元深度與8000–192000Hz代表率。FFmpeg只作驗證oracle，不是執行／自動測試依賴。另5不可測及26份真報告經JS模型通過。30秒48kHz stereo5760044bytes分析5.607秒；單次本機證據不泛化。

24項真IAB：正常／不可測／反相／107尾幀、換檔／profile stale、四秒成功／500改檔後捨棄、目前500與schema999拒絕／有效復原、其他歌曲編修保留音檔報告、Enter及390px DOM、JSON／MD／手機JSON實檔下載與新v0.22標示。JSON1969、MD1663bytes與domain內容相同；手機video報告亦回讀一致。console error／warn空。一次等待selector提前逾時後讀同一完成操作，無重送；busy觀察不算通過。詳細見docs/QA-v0.22.0.md。

## 未完成與維護

不是完整ITU／EBU認證，未驗證所有訊號／rates、true peak／LRA／短期響度、正式歌曲實聽、其他OS／browser、完整視覺或特定Agent host。沒有模型／ASR／媒體生成；DOM幾何不是完整視覺驗收。滾動目標active，下一輪可盤點實際創作工作流、量測限制與正式Host接入，保持分層、來源保留、明確選擇與可逆。

PolyForm Noncommercial1.0.0、LICENSE／NOTICE／LICENSING／FOUNDER-RECORD保持，不另授AGPL／商用。Repo private；FreeTWAI未投稿或取得平台創始人核實，公開／投稿決策未確認，不修改平台live data。

每輪只盤點本工作區outputs與本輪確定PID。保留最新三封裝，其餘未滿七天不列清除；使用者草稿／備份／素材不能Git重建，不清除。自有服務已shutdown正常返回，tab26已關閉／尺寸override清除。最終PID、埠、封裝清單、遠端byte核對及刪除數以outputs/v22-qa/inventory-final.json為準，沒有清理其他專案或未確認程序。
