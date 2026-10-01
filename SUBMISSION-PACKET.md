# 自由工坊投稿資料：四個新專案

發起／創辦署名：**ZOE. G** · GitHub 帳號：**djguan-jpg** · 日期：2026-10-01。

儲存庫：<https://github.com/djguan-jpg/zoe-g-music-lab>（目前 private）。四個專案共用一個儲存庫，各有獨立 ID、Skill 與可操作成果。不可將這份資料用來認領既有 FreeTWAI 手冊的原作者。

本次由 ZOE. G 提出四個方向與創办意願，與 Codex 共同完成第一版；Codex 協助範圍為規格、文字、程式和驗證。沒有使用其其他本機專案、GitHub Repo 或作品。第三方公開 README 只作需求比較，具體來源見 CONCEPT.md，未搬入第三方程式或素材。

## 可直接使用的套件介紹

作品名稱：**ZOE. G Music Lab｜四個音樂與 MV 原創工作台**

這個作品可以做什麼：在本機整理歌曲記憶點、BPM 與段落能量，建立 MV 母題分鏡與連貫性檢查，透過波形人工編修歌詞時間，並產生 PCM WAV 的規格及交付證據。四個工具有各自的原創 Skill、可編修資料與匯出成果。創辦／發起人 ZOE. G，Codex 協助實作及驗證；沒有宣稱工具已自動生成歌曲、影片或取得作者認證。

如何開始使用：需要 Python 3.10 以上。取得本儲存庫後，在根目錄執行 `python music_lab_server.py`，瀏覽器開啟 `http://127.0.0.1:8875/`，選擇四個工作台之一。可使用原創範例、修改內容、預覽並下載成果。也提供 CLI 與四份 SKILL.md；沒有第三方套件或模型金鑰。音檔留在本機，原檔不改寫。完整說明與限制見 README.md。

作者關係：本作品由本人 ZOE. G 發起，與 AI 協作完成；GitHub 使用帳號 djguan-jpg。這是本次新作的來源聲明，平台是否核實另依其審查。

## 四個專案的個別資料

| 專案 ID | 原創方向與第一版 | Skill 入口 |
|---|---|---|
| zoe-music-production | 以記憶點串接歌詞、敘事任務、BPM／小節時間與能量曲線，匯出 AI 任務包 | [Music Production](https://github.com/djguan-jpg/zoe-g-music-lab/blob/main/projects/zoe-music-production/SKILL.md) |
| zoe-mv-storyboard | 記錄母題狀態如何改變，檢查鏡頭時間、人物狀態與方向變化理由，匯出分鏡和提示詞 | [MV Storyboard](https://github.com/djguan-jpg/zoe-g-music-lab/blob/main/projects/zoe-mv-storyboard/SKILL.md) |
| zoe-lyrics-sync | 以本機波形與播放位置協助人工校時，驗證重疊／負值／時長，匯出 LRC、SRT、JSON | [Lyrics Sync](https://github.com/djguan-jpg/zoe-g-music-lab/blob/main/projects/zoe-lyrics-sync/SKILL.md) |
| zoe-audio-delivery | 保留原音檔，以規格、SHA-256、安靜段、相關性及接受條件產生可核對的交付報告 | [Audio Delivery](https://github.com/djguan-jpg/zoe-g-music-lab/blob/main/projects/zoe-audio-delivery/SKILL.md) |

版本證據：[首次四專案提交 b3c2c59](https://github.com/djguan-jpg/zoe-g-music-lab/commit/b3c2c59)、[工作台實作 b6f7e70](https://github.com/djguan-jpg/zoe-g-music-lab/commit/b6f7e70)。發起及 AI 協作紀錄見 FOUNDER-RECORD.md，驗證見 PROGRESS.md。

## 目前流程狀態

已建立 private GitHub Repo，尚未公開或送出自由工坊投稿。自由工坊表單要求公開 GitHub 網址，作品關係列為自行聲明，並明示不以登錄驗證作者或擁有權。自 v0.3.0 採用 PolyForm Noncommercial 1.0.0 非商用授權。需取得公開授權後才可按表單流程登錄；不能把自行聲明寫成平台已認證。
