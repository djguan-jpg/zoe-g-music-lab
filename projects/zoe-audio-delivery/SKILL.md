---
name: zoe-audio-delivery
description: Analyze a selected PCM WAV against explicit delivery conditions and preserve measurable evidence. Use for sample-rate, bit-depth, peak, RMS, quiet-edge or stereo-correlation checks before audio delivery.
---

# ZOE Audio Delivery

ZOE. G 發起的原創交付檢查工具。接受格式與數值定義見 [工具說明](README.md)。

先取得收件方的實際接受條件。工具內的 distribution／video 是示範設定，不代表所有平台的標準。可用 CLI 的 rates／bits／channels 覆寫本次接受條件。

僅分析使用者選定的 PCM WAV，保留原音檔。回報規格、每聲道 sample peak、RMS、DC、滿刻度樣本、頭尾安靜段、整段立體聲相關性與 SHA-256。

技術條件通過不等於音樂品質、授權或法律審核通過。滿刻度樣本、負相關性或安靜段只提供聆聽線索；不擅自裁切、正規化或改寫。數位靜音等情況的不可測相關性以 null 表示。

RMS 不當作 LUFS；sample peak 不當作 true peak。需要這些測量時，說明本版未提供，不用近似值冒充。

CLI 範例：

```powershell
python music_lab.py audio --input selected.wav --profile video --rates 48000 --bits 24 --channels 2 --out outputs/audio-run
```

交回實際 JSON／Markdown 報告及仍需聆聽確認的項目。Exit code 2 表示報告已產生且有提醒；不是程式崩潰。
