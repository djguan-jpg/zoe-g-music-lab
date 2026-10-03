# 音檔整合響度契約（schema 1）

v0.22 起，音檔 report 新增 `loudness`，格式 `zoe-loudness-measurement`、schema_version 1。產品版本、Agent1、MCP2025-11-25、draft3 與此量測 schema 分別管理；輸入／工具數及既有接受條件不變。未知量測 schema 拒絕顯示。舊版沒有此欄位的報告仍可讀，但明確標示未提供，不能用 RMS 代替。

## 使用與範圍

在工作台選擇 PCM WAV 並分析，或使用既有 `audio` CLI／Agent／MCP。報告把整合響度 LUFS、每聲道 RMS dBFS、sample peak dBFS 分開。請另行核對收件方要求；沒有通用響度合格線、調整音量或覆寫輸入。

整數 PCM format tag 1、8／16／24／32 bit；響度支援單聲道或立體聲，8000–192000 Hz。多聲道的 speaker／LFE 位置未知，保留原有 PCM 數值並回報 `unsupported_channels`。範圍外取樣率回報 `unsupported_sample_rate`；沒有縮小原先 PCM 分析或 CLI 大小範圍。UI 仍最多64 MiB。

## 方法與欄位

依 [ITU-R BS.1770-5 Annex 1](https://www.itu.int/rec/R-REC-BS.1770-5-202311-I/en) 的數值參數獨立實作 K-weighting 兩段 biquad，保留連續狀態。48 kHz 使用表1／2係數；其他取樣率由參考係數反推類比極點與增益，再雙線性轉換。聲道權重為單聲道 `[1]`／立體聲 `[1,1]`，各聲道濾波能量相加，不先混成 mono，反相不會錯算為靜音。

完整400 ms區塊，75%重疊／100 ms步進；以最近整數音訊幀定位，半幀向上。第0區塊末端 `W=floor((4*rate+5)/10)`，第n區塊末端 `W+floor((n*rate+5)/10)`；不補零或累積小數步進誤差。末尾未形成下一完整區塊的樣本記在 `tail_frames`。這些末尾樣本仍計入原有 RMS、peak、DC、時長與SHA。

先只取高於−70 LUFS絕對門檻的區塊，再由其平均能量設定低10 LU的相對門檻，最後同時通過兩門檻的平均能量得到 `−0.691+10log10(energy)`。報告保存 `complete_block_count`、`absolute_gate_block_count`、`gated_block_count`、相對門檻與6位小數LUFS；UI顯示3位。

| status | integrated_lufs | 意義 |
|---|---|---|
| measured | 有限數字 | 至少一個完整區塊通過兩門檻 |
| insufficient_duration | null | 不足一個完整400 ms區塊 |
| below_gate | null | 完整區塊皆未通過絕對門檻，包含數位靜音 |
| unsupported_channels | null | 聲道位置未知 |
| unsupported_sample_rate | null | 響度取樣率範圍外 |

不可測不代表0／−70 LUFS，也不自行改變既有技術提醒、Result.needs_review或CLI退出碼。數字為有限值；不可測的相對門檻為null。數位靜音等原本提醒保持。

## 分層、容量與證據

`loudness.py` 只接受有限的正規化PCM幀與可重讀區塊，無檔案／HTTP／DOM／模型。400 ms能量deque不隨時長增加，最大76800幀；每100 ms只輸出一個區塊能量。`loudness_blocks.py` 保管自有8-byte區塊副本，64 KiB後轉暫存檔，兩次串流讀取做門檻；成功／錯誤均關閉，不公布暫存路徑。磁碟區塊資料隨時長增加，記憶體有界。

`audio.py` 在既有 copied_audio 的同一次PCM掃描餵入量測，雜湊、RMS與LUFS來自同一副本；不重新開來源或使用FFmpeg。application共用CLI／HTTP／Agent／MCP。`audio-review.js` 核對schema、有限值、來源幀／時長、聲道權重、區塊／尾幀／門檻一致性；DOM層只顯示結果。File／profile／revision晚到保護沿用。

本輪20組原創合成WAV與既有FFmpeg7.1 ebur128校對，最大差異0.009464 LU；包含頻率、噪音、脈衝、門檻、反相、四種整數位元深度及8000–192000Hz。FFmpeg只作外部校對，沒有複製其程式碼，未新增執行或測試依賴。另有5種不可測情況、26份真Python報告通過JS模型及四adapter一致性測試。

這是獨立實作與有限交叉校對，不宣稱完整ITU／EBU認證、所有訊號或所有取樣率逐一驗證。尚未量測true peak、LRA或short-term／momentary響度，沒有ASR、正規化、音樂品質、著作權或正式作品實聽結論。
