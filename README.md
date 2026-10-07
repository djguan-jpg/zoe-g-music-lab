# ZOE. G Music Lab

把歌曲構想、MV 敘事、歌詞時間與 PCM 音檔規格整理成可編修、可審閱的交付資料。四個原創專案共用本機工作台、CLI、Agent 與 MCP；由 **ZOE. G** 發起，GitHub 帳號 **djguan-jpg**，Codex 協助實作與驗證。

| 想完成什麼 | 工作台／Skill | 得到的資料 |
| --- | --- | --- |
| 整理記憶點、歌曲段落與編曲 | [歌曲設計](projects/zoe-music-production/SKILL.md) | 小節時間、能量設計、需求與 AI 任務文字 |
| 把母題變化寫成可製作鏡頭 | [母題分鏡](projects/zoe-mv-storyboard/SKILL.md) | 分鏡、提示文字、時間／影格與資料連戲檢查 |
| 按音檔人工標記歌詞時間 | [波形校時](projects/zoe-lyrics-sync/SKILL.md) | 原文保留的 LRC、SRT、JSON 與獨立預覽 |
| 在交付前核對 PCM WAV | [交付檢查](projects/zoe-audio-delivery/SKILL.md) | SHA-256、取樣規格、量測與條件報告 |

資料完成仍需創作、實聽及實際畫面驗證。工具不自行呼叫 AI、合成歌曲、辨識唱詞、渲染影片或判定素材權利。

## 先開始一份作品

取得本 Repo，在根目錄開啟終端。需要 Python 3.10 以上及支援原生 File／Blob 的現代瀏覽器；沒有第三方 Python 套件或模型金鑰。

```powershell
python -X utf8 music_lab_server.py
```

開啟 <http://127.0.0.1:8875/>，選擇上表的工作台，從合成範例修改或載入自己的資料。建立文字成果後主動下載、保留原始素材；下載後可選回檔案核對完整原文。結束時在終端按 Ctrl+C。伺服器只綁定 127.0.0.1，音檔、影片和私人素材不進 Git。

下一步讀[開始指南](docs/START-HERE.md)：第一次使用、CLI 可執行範例、檔案接續、草稿與常見結果狀態。Agent 使用者直接讀[目前接口指南](docs/AGENT.md)；先 discovery，再依當前 schema 呼叫工具。

## 保存、版本與授權

草稿下載、成果下載與音檔保存分開。工作台沒有自動保存；離頁警示不能替代保存。要使用本機不可覆寫版本庫，請依開始指南明確指定 `--draft-library`。原檔保留，CLI 預設拒絕覆寫，只有明確 `--overwrite` 才替換指定輸出。

四個專案採 **PolyForm Noncommercial 1.0.0，禁止商用**；保留 [LICENSE](LICENSE)／[NOTICE](NOTICE)。没有另授予 AGPL 或商用許可。AI 協作與發起署名見 [FOUNDER-RECORD.md](FOUNDER-RECORD.md)；既有四份自由工坊投稿仍為作者自行聲明、尚未核實，狀態見 [PLATFORM-STATUS.json](PLATFORM-STATUS.json)。

目前版本 **v0.163.0**；產品與協定分開管理，以 [projects.json](projects.json) 和 [delivery-versions.json](musiclab/assets/delivery-versions.json) 為準。更新與驗收讀 [CHANGELOG](CHANGELOG.md)／[本輪交接](docs/HANDOFF-v0.163.0.md)，開發讀[分層架構](docs/ARCHITECTURE.md)。舊 README 原文保留在[截至 v0.154 的歷史](README-HISTORY-through-v0.154.0.md)；歷史中的舊版本、舊工具數與舊平台狀態不代表現況。
