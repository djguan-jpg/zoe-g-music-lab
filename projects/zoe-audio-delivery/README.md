# ZOE Audio Delivery

## 整合響度（v0.22）

新增獨立 LUFS 量測，單聲道／立體聲、8000–192000 Hz、至少400 ms。K-weighting與400 ms／100 ms步進，先−70 LUFS絕對門檻、再−10 LU相對門檻。太短、太安靜或未知聲道位置為null／不可測，保持原本技術接受結果。與RMS／sample peak分開，不調整音量或提供通用平台目標；true peak尚未提供。JSON／Markdown和四adapter同源，區塊暫存有界記憶體且關閉。方法、獨立schema1、校對與限制見[量測契約](../../docs/LOUDNESS.md)。

v0.20接續外部JSON共用嚴格UTF-8與重複欄位檢查；損壞編碼／重複版本拒絕，不修補後替換目前內容。CLI外部JSON最多2MiB，工作台需求／分鏡起稿／草稿仍1MiB、歌詞JSON2MiB；單BOM規則與領域schema分開。見[本輪QA](../../docs/QA-v0.20.0.md)。

創辦：ZOE. G · GitHub：djguan-jpg · v0.37.0 · PolyForm Noncommercial 1.0.0

Python 標準函式庫檢查 RIFF/WAVE 整數 PCM format tag 1，支援 8／16／24／32 bit、1–32 聲道樣本。分析取樣率、位元深度、聲道、時長、每聲道 sample peak／RMS／DC offset／滿刻度樣本、頭尾安靜段與整段立體聲相關性。原音檔保留；不一致的 block align、byte rate 或位元深度拒絕，不靜默猜測格式。

```powershell
python music_lab.py audio --input '自己的歌曲.wav' --profile distribution --out outputs/audio
python music_lab.py audio --input '自己的歌曲.wav' --profile video --out outputs/audio-video
```

`distribution` 示範條件：44.1／48 kHz、16／24 bit、單／雙聲道；`video`：48 kHz、16／24 bit、單／雙聲道。可用 `--rates`、`--bits`、`--channels` 明確指定本次接受值。這些不是所有發行商或平台的通用標準。

輸出 report.json 與 report.md，列出每項實際值／接受值／符合結果、提醒、來源大小與 SHA-256。退出碼 0：本次沒有技術提醒；2：分析完成，有需確認項目；1：輸入或格式錯誤。已有輸出預設拒絕覆寫。

雜湊與量測使用同一次複製的位元組。副本超過 1 MiB 轉入暫存檔，成功與錯誤都關閉，不把暫存路徑寫入報告。這確保報告內部一致，沒有保證外部同時編修的原子快照；SHA-256 不是著作權簽章。fmt 預檢加既有 wave 資料／frame 檢查不等於完整 RIFF conformance。

本機 UI「交付檢查」接受最多 64 MiB，顯示來源、逐項接受條件、頭尾安靜段及每聲道量測；可展開來源範圍、下載 JSON／Markdown。換檔／條件後標為上一份報告並停用下載，重新分析才恢復。晚到成功／錯誤不能覆蓋新選擇。更大檔案可使用 CLI，自訂接受值現在也可於工作台填寫，沒有新增 CLI 大小限制。

安靜段是所有聲道均不高於 -60 dBFS；頭或尾超過 2 秒列聆聽提醒。相關性為去平均值的 Pearson，低於 -0.5 提醒單聲道相消；單聲道／零變異為 null，UI 顯示不可測。數位靜音 peak／RMS 為 null，UI 顯示 −∞。多聲道只量測樣本、不解讀聲道位置，即使自訂條件接受也會提醒。

滿刻度樣本表示可能削波，需實聽；RMS 不是 LUFS，sample peak 不是 true peak。沒有評估音樂品質、著作權或商業適用性。IEEE float、WAVE_FORMAT_EXTENSIBLE、RF64／RIFX、MP3／FLAC 未支援。保留 LICENSE／NOTICE；沒有商用許可。共用應用操作亦提供 HTTP／JSON-lines／MCP，特定 Agent host 尚未整合。

## 接受條件草稿（v0.37）

工作台填自訂Hz／bit／聲道數，原值另存schema1條件JSON，未完成也可保存與先預覽再載入。完整專案draft3只保存profile，載入後回到示範條件、原自訂欄位保留在本頁。CLI --acceptance-draft selected.json 與 Agent／MCP嵌入同一文件；草稿模式回交 report.json／report.md／audio-acceptance-draft.json，並核對實際使用值和來源；直接模式維持兩檔。見[操作與限制](../../docs/AUDIO-ACCEPTANCE.md)。


## v0.38 完整文字交付

完成本工作台後可下載本輪所有文字成果ZIP與逐檔SHA清單，CLI／Agent／MCP共用 delivery_package。Agent預設摘要，小型ZIP需明確include_archive；不自動寫檔，封裝不等於實聽或實際畫面接受。基本11／啟庫16工具，Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-PACKAGE.md)。

## v0.39 接續文字ZIP

本工作台可選取本工具v38／v39交付ZIP，先核對原清單與逐檔SHA、再明確載入文字成果；表單與已選音檔保留，可限定撤回。跨scope先切換工作台再選檔；讀取中可取消，編修／換台後晚回應不能覆蓋。原文可再下载，但不代表由目前表單重建或正式媒體接受。CLI delivery-inspect／Agent與MCP delivery_inspect共用檢查，啟動時--delivery-zip明確選來源，預設metadata、include_files小型JSON≤512KiB；12／17工具，inspection1／package1／Agent1／draft3獨立。見[共用契約](../../docs/DELIVERY-INSPECTION.md)。

## v0.40 ZIP原文與差異

選ZIP後先審阅目前成果與將載入原文，新增／變更／移除／相同完整摘要；原換行計數與長檔有界預覽，Apply與下載仍保留全文。只替換本工作台成果，表單／音檔／限定Undo保持，不合併。CLI delivery-inspect --compare-input及Agent／MCP delivery_inspect明確baseline同一比較契約，12／17工具保持，comparison1獨立。見[共用契約](../../docs/DELIVERY-COMPARISON.md)。


## v0.41 可保存差異報告

選交付ZIP核對完成後可下載來源SHA與完整變更摘要JSON／Markdown，原成果／表單／音檔保留，載入仍需明確動作。修改後重新核對，不把報告當原文或素材權利驗收。CLI --comparison-report／Agent include_report要求baseline且不能include_files=true，12／17工具保持，report1獨立。launcher可列印明確WAV／ZIP選擇，沒有Host設定或模型呼叫。default text output拒絕raced-in同名檔，多檔可能部分輸出須查看錯誤。見[共用契約](../../docs/DELIVERY-REPORT.md)。
