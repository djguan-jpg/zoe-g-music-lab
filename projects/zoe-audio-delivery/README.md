# ZOE Audio Delivery

創辦：ZOE. G · GitHub：djguan-jpg · v0.2

以 Python 標準函式庫串流檢查未壓縮 PCM WAV，支援 8／16／24／32 位元。分析取樣率、位元深度、聲道、時長、每聲道峰值與 RMS／DC、滿刻度樣本、頭尾安靜段、整段立體聲相關性。保留原檔。

```powershell
python music_lab.py audio --input '自己的歌曲.wav' --profile distribution --out outputs/audio
python music_lab.py audio --input '自己的歌曲.wav' --profile video --out outputs/audio-video
```

`distribution` 是本專案可調整的預設：44.1／48 kHz、16／24-bit、單聲道或雙聲道。`video` 預設 48 kHz、16／24-bit、單／雙聲道。這些是工具預設，並非聲稱適合所有發行商或平台。

輸出 `report.json` 與 `report.md`。規格不符合預設或有滿刻度樣本會列需確認項目。可透過 `--rates`、`--bits`、`--channels` 明確覆寫本次接受條件。

退出碼 0 表示報告沒有技術提醒；2 表示已完成分析但有需確認項目；1 表示輸入或格式錯誤。滿刻度樣本表示可能削波，不代表聲音一定失真。RMS 不是 LUFS；本版不分析 true peak、LUFS、音樂風格、著作權或商業適用性。IEEE float、WAVE_FORMAT_EXTENSIBLE、MP3／FLAC 尚未支援；會清楚回報而不捏造測量值。

安靜段以所有聲道均不高於 -60 dBFS 為門檻；頭或尾超過 2 秒列聆聽提醒。立體聲相關性是整段 PCM 去除各聲道平均值後的 Pearson 相關性，低於 -0.5 提醒聆聽單聲道相消。單聲道／零變異等情況為 null，無法藉此判定音樂品質。

本機 UI「交付檢查」提供選檔、示範接受條件、測量摘要與報告下載，最大 64 MiB。更大的檔案或自訂條件使用 CLI。輸出 SHA-256 供核對選定檔案；分析器不改寫來源。
