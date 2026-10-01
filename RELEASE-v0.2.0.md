# ZOE. G Music Lab v0.2.0

第一版可操作的四專案套件，創辦／發起人 **ZOE. G**，實際 GitHub 帳號 **djguan-jpg**。Codex 協助規格、原創技能文字、程式與驗證。四個專案共用一個新儲存庫；不參考使用者其他本機或 GitHub 專案。

## 已提供

| 專案 | 可操作功能 | 主要成果 |
|---|---|---|
| Music Production | 記憶點、BPM／小節時間、段落能量與 AI 創作任務 | brief、設計 JSON／Markdown、任務包 |
| MV Storyboard | 母題狀態、鏡頭時間、人物及畫面方向變化理由 | 分鏡 JSON／CSV、鏡頭提示、連貫性報告、mv-brief |
| Lyrics Sync | LRC／SRT／JSON 匯入、音檔波形、播放定位、逐句修改及時間驗證 | LRC／SRT／JSON、獨立播放預覽 |
| Audio Delivery | PCM WAV 規格、peak／RMS／DC、滿刻度樣本、安靜段與立體聲相關性 | 規格與接受條件報告、SHA-256 |

執行 `python music_lab_server.py`，開啟 `http://127.0.0.1:8875/`。Python 3.10 以上，沒有第三方依賴。CLI 與四份原創 Skill 同時提供；使用方式見 README。

## 已完成驗證

- 35 項 Python 測試通過，JavaScript 語法及四份 Skill 格式檢查通過。
- 四工作台已操作原創合成案例，確認內容修改、錯誤輸入與成果預覽；JSON HTTP 下載已保存實檔並核對內容。
- WAV 分析以已知合成 PCM 數據核對；窄螢幕完成 DOM 寬度與互動檢查。
- 詳細條件與未驗證事項記在 PROGRESS.md。

## 第一版限制

音樂及分鏡提供設計與 AI 任務資料，工具沒有直接呼叫模型或生成歌曲／影片。歌詞為人工校時，未提供語音辨識與自動對齊。音訊分析支援整數 PCM WAV，不支援 LUFS、true peak 或 MP3／FLAC；不能判定音樂品質或授權。

成果需手動下載，重載頁面不會恢復資料。尚未以正式作品或完整跨瀏覽器／手機視覺測試驗收。舊獨立 preview.html 的 Blob 下載本輪未重新確認。此版為初期版本，維持 pre-release 標記。

## 身分與投稿

發起紀錄與 AI 協作見 FOUNDER-RECORD.md。GitHub 上傳不會自動取得自由工坊認證。Repo 預設 private，未選定開源授權、未提交平台投稿，也未取得平台作者核實。
