# v0.22.0 驗證

2026-10-03。本輪補齊原交付檢查只有RMS／sample peak、沒有LUFS整合響度的功能缺口。使用本次原創合成資料，沒有讀取其他使用者專案、作品、GitHub、記憶或vault；未複製第三方程式碼、音檔或規範全文。

## 數值與範圍

20組正式Python實作的量測與本機既有FFmpeg7.1 ebur128最後一份integrated metadata校對，預設容差0.02 LU、實際最大0.009464 LU。校對不是產品或自動測試依賴；參考原理為 [ITU-R BS.1770-5 Annex 1](https://www.itu.int/rec/R-REC-BS.1770-5-202311-I/en)，量測契約見LOUDNESS.md。

| 代表原創案例 | 本工具 LUFS | FFmpeg LUFS | 差異 LU |
|---|---:|---:|---:|
| 48k mono，1kHz、0.1幅度 | −23.003518 | −23.010 | 0.006482 |
| 48k stereo相同聲道／反相 | −19.993218 | −20.000 | 0.006782 |
| 8k mono，1kHz | −22.990536 | −23.000 | 0.009464 |
| 48k mono，50Hz | −27.639167 | −27.644 | 0.004833 |
| 確定種子的噪音 | −21.613269 | −21.619 | 0.005731 |
| 間歇脈衝 | −26.544240 | −26.547 | 0.002760 |
| 192k mono混合頻率 | −28.169816 | −28.176 | 0.006184 |
| 11025Hz、不完整尾幀 | −28.031195 | −28.030 | −0.001195 |

其餘含44.1k／96k／44117Hz、5kHz、相對／絕對gate、不同強度雙聲道與8／24／32-bit；完整fixture SHA、原始oracle log、區塊數及用時在忽略的outputs/v22-qa/loudness-evidence.json。全部原始合成WAV雜湊保持。另5組短檔／靜音／低於門檻／三聲道／範圍外取樣率返回null與明確status。26份真Python報告皆通過JS來源／響度模型。

30秒48kHz立體聲、5760044bytes實際分析5.607秒；此為單次本機測量，不能泛化到所有機器或長音檔。400ms frame history有界，最大76800幀；64KiB ledger在10000筆區塊測試轉磁碟、重讀與關閉通過，沒有以整段音檔／全部區塊放入RAM。暫存磁碟隨音檔增加；無新CLI大小限制。

## 自動驗證與四adapter

200 Python／247 JavaScript、四Skill／19 JS語法與git diff check通過。18新Python／10新JS案例覆蓋參考係數、率域穩定、聲道能量與反相、增益差、頻率權重不冒充RMS、400ms邊界、絕對／相對門檻、奇數取樣率nearest幀／分塊不變、不可測語義、未知schema與矛盾數值、ledger溢存／關閉／失敗、來源替換仍使用原副本。

真正CLI、JSON-lines、MCP握手／audio_report／EOF及HTTP upload使用同一原創8kHz WAV，data／files／meta相同、輸入保留。CLI退出2來自示範接受率，不是響度不可測。短48kHz音檔沒有技術警告，仍technical_checks_passed且loudness insufficient_duration。Agent1／MCP2025-11-25／draft3／library1／backup1／兩seed1／lyrics_package1與六／十一工具保持，新audio_loudness schema1獨立。

初次全套一項失敗為v0.21 retention HTTP測試寫死舊版本，已改成解析JSON並比對當前__version__，保留錯誤後服務恢復的測試目的。沒有放寬斷言或隱藏例外。

## 真IAB工作台

24項已完成檢查，僅記完成後DOM，不把初次busy或等待逾時當通過。

- mono／反相stereo分別顯示−23.004／−19.993 LUFS，反相仍有原本聆聽提醒。短檔、靜音、門檻下、未知layout／rate皆明確不可測；短檔與低音量仍可技術條件通過，數字不冒充0或−70。11025Hz顯示9區塊、107尾幀。
- 換檔／接受profile使上一份結果stale且下載停用。受控四秒成功期間選新音檔，舊成功不取代；四秒500期間再換檔，舊錯誤不冒用目前選擇；沒有重送延遲操作。一次selector等待提前逾時後讀取同一live操作，完成仍正確捨棄。
- 目前500顯示可處理的錯誤，schema999拒絕替換，原報告／輸入保持；有效選擇可再成功。Enter改profile後重建通過。
- 編修歌曲、切回音檔保留報告與File選擇；草稿仍顯示未另存。390px／844px，document375px、響度欄343px；桌面1280px、document1265px，沒有頁面橫向溢出。Enter分析與下載有效。幾何證據不是完整視覺評審。
- 真JSON1969bytes／Markdown1663bytes及手機JSON實際下載；與Python結果語義／換行正規化文字相同。下載不導離頁面。新頁載入顯示本機v0.22，原生草稿提醒保持。console error／warn空，無截圖。

## 還原、發布與保留

前版v0.21 ZIP475586bytes、SHA3cad5d8d03656495c7f6ba88a162a2b20de1efc3c1fefcedf3b6f6917a47ef27經安全路徑／CRC／SHA核對並還原182Python／237JS通過，暫時解壓目錄已移除。restore-v0.21.0-before-v0.22.0指向起點f7c3ddbbe7545b2ebc75ed31eb82cc318100bafd。新版本指定提交封裝、私人PR／Release與真遠端下載以manifest及outputs/v22-qa/release-remote-evidence.json為準，不以預計動作宣稱完成。

完成後只盤點本工作區outputs與本輪確定PID；保留最新三封裝及未滿七天資料，草稿／備份／素材不能用Git重建，不列候選。自有測試服務由shutdown正常返回；實際退出碼、埠與inventory-final.json記錄完成狀態。

未驗證完整ITU／EBU conformance、所有訊號／rates、true peak／LRA／短期響度、正式歌曲實聽、其他OS／瀏覽器、完整視覺或特定Agent host。沒有正規化、模型或媒體生成。PolyForm Noncommercial／ZOE. G／private保持；FreeTWAI未投稿或取得平台創始人核實。滾動目標active。
