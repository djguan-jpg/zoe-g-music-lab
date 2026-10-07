---
name: zoe-audio-delivery
description: Analyze a selected PCM WAV against explicit delivery conditions and preserve measurable evidence. Use for sample-rate, bit-depth, peak, RMS, integrated-loudness, quiet-edge or stereo-correlation checks before audio delivery.
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Audio Delivery

保留原整數PCM WAV，整理可核對的交付量測與條件。數值不判定聲音品質、版權或實聽接受；沒有正規化、true peak或完整規範認證。

## 執行流程

1. 明確選定使用者有權處理的PCM WAV與交付用途。工作台「交付檢查」選音檔、填取樣率／位深／聲道條件；未完成原值用 `audio_acceptance_review`，不先讀媒體或補寫條件。
2. 使用Agent `audio`／MCP `audio_report` 前，啟動時以 `--audio` 選同一WAV。JSON不能選路徑。CLI使用 `audio --input` 與新的 `--out`；參數可查 `python -X utf8 music_lab.py audio --help`。
3. 檢查SHA-256、PCM規格、RMS、sample peak、安靜邊緣、立體聲相關性與有條件integrated LUFS。只支援已驗證的格式／量測layout；短檔、門檻下或不支援量測明示status／null。
4. 保留原音檔與報告，逐項處理條件待辦，再人工實聽；來源或條件編修後舊報告停下載，重新分析才恢復。不要以成功回應或檔名推定完成交付。

Hash與量測從同一自有音檔副本取得，不重新開來源混用；不宣稱外部同時改寫的原子快照、完整RIFF conformance或多聲道位置解讀。RMS／LUFS与sample peak／true peak分開，滿刻度樣本只是可能削波訊號。範例音訊若用於開發只放忽略outputs，沒有媒體進Git。

## 保存、接口與界線

使用前依[Agent指南](../../docs/AGENT.md)取得當前discovery及schema；目前22基本操作，只有明確啟動草稿庫才有29。CLI／Agent／MCP／工作台共用應用層，沒有第三方依賴、模型金鑰或產品外網能力。外部JSON嚴格UTF-8、傳輸2MiB／64層，重複鍵、非法Unicode、非有限數字與未知版本拒絕；domain上限依schema，不靜默修補／遷移。

完整需求／起稿／成果回讀先核對来源，預覽再明確Apply；保留原檔、後續編修、其他工作台與媒體。草稿另存、成果下載和素材保存分開，送出下載不代表已保存，beforeunload不是自動保存。原文核對不一致可[閱讀差異位置](../../docs/TEXT-VERIFICATION-PAGE.md)；SHA-only備份不提供猜測原文。CLI預設拒絕覆寫，明確 `--overwrite` 只替換指定輸出；多檔I/O可部分完成，錯誤時保留並核對。

創辦／發起 **ZOE. G**，GitHub **djguan-jpg**，協作範圍見[FOUNDER-RECORD](../../FOUNDER-RECORD.md)。**PolyForm Noncommercial1.0.0，禁止商用**，保留[LICENSE](../../LICENSE)／[NOTICE](../../NOTICE)，不授予AGPL或商用許可；平台作者關係仍自行聲明、尚未核實。上手讀[START-HERE](../../docs/START-HERE.md)，歷史原文見[截至v154歷史](HISTORY-through-v0.154.0.md)。本Skill維持目前工作流程，不附每轮QA歷史；舊工具數／狀態不作現況依据。
