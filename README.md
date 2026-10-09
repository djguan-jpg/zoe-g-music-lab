# ZOE. G Music Lab

把歌曲構想、MV 敘事、歌詞時間與 PCM 音檔規格整理成可編修、可審閱的交付資料。四個原創專案共用本機工作台、CLI、Agent 與 MCP；由 **ZOE. G** 發起，GitHub 帳號 **djguan-jpg**，Codex 協助實作與驗證。

| 想完成什麼 | 工作台／Skill | 得到的資料 |
| --- | --- | --- |
| 整理記憶點、歌曲段落與編曲 | [歌曲設計](projects/zoe-music-production/SKILL.md) | 小節時間、能量設計、需求與 AI 任務文字 |
| 把母題變化寫成可製作鏡頭 | [母題分鏡](projects/zoe-mv-storyboard/SKILL.md) | 分鏡、提示文字、時間／影格與資料連戲檢查 |
| 按音檔人工標記歌詞時間 | [波形校時](projects/zoe-lyrics-sync/SKILL.md) | 原文保留的 LRC、SRT、JSON 與獨立預覽 |
| 在交付前核對 PCM WAV | [交付檢查](projects/zoe-audio-delivery/SKILL.md) | SHA-256、取樣規格、量測與條件報告 |

資料完成仍需創作、實聽及實際畫面驗證。工具不自行呼叫 AI、合成歌曲、辨識唱詞、渲染影片或判定素材權利。

載入校時音檔後，可選「播放速度」慢速聽句尾；標記時間仍是音檔實際秒數。改速度保留時間與成果，無法設定時依播放器目前狀態再試。見[播放速度](docs/PLAYBACK-RATE.md)。

v170可在「要調整的歌詞」選句，按「試聽這一句」從原句首播放；「停止試聽」保留當前位置。先填有效開始與結束，倍率不改音檔秒數。句尾停止可能延後，需實聽核對；原時間與成果保留。工作來源完整驗收已通過，指定提交封裝與發布狀態以成功manifest及遠端release為準。見[單句試聽](docs/CUE-AUDITION.md)與[完整接受](docs/QA-v0.170.0-ACCEPTANCE-3.md)。

## 先開始一份作品

取得本 Repo，在根目錄開啟終端。需要 Python 3.10 以上及支援原生 File／Blob 的現代瀏覽器；沒有第三方 Python 套件或模型金鑰。

```powershell
python -X utf8 music_lab_server.py
```

開啟 <http://127.0.0.1:8875/>，選擇上表的工作台，從合成範例修改或載入自己的資料。建立文字成果後主動下載、保留原始素材；下載後可選回檔案核對完整原文。結束時在終端按 Ctrl+C。伺服器只綁定 127.0.0.1，音檔、影片和私人素材不進 Git。

下一步讀[開始指南](docs/START-HERE.md)：第一次使用、CLI 可執行範例、檔案接續、草稿與常見結果狀態。Agent 使用者直接讀[目前接口指南](docs/AGENT.md)；先 discovery，再依當前 schema 呼叫工具。

整批校時與撤回只有回讀完整實際時間後才顯示成功。拒絕或部分寫入時保留目前表格；撤回紀錄仍存在時，先核對並修正回套用後時間再重試，工具不自動回滾。見[寫入接受規則](docs/LYRICS-TIMING-ACCEPTANCE.md)。

## 保存、版本與授權

草稿下載、成果下載與音檔保存分開。工作台沒有自動保存；離頁警示不能替代保存。要使用本機不可覆寫版本庫，請依開始指南明確指定 `--draft-library`。原檔保留，CLI 預設拒絕覆寫，只有明確 `--overwrite` 才替換指定輸出。

四個專案採 **PolyForm Noncommercial 1.0.0，禁止商用**；保留 [LICENSE](LICENSE)／[NOTICE](NOTICE)。没有另授予 AGPL 或商用許可。AI 協作與發起署名見 [FOUNDER-RECORD.md](FOUNDER-RECORD.md)；既有四份自由工坊投稿仍為作者自行聲明、尚未核實，狀態見 [PLATFORM-STATUS.json](PLATFORM-STATUS.json)。

目前版本 **v0.168.0**；來源完整驗收通過，正式封裝與遠端發佈另依本輪 manifest／收據確認；產品與協定分開管理，以 [projects.json](projects.json) 和 [delivery-versions.json](musiclab/assets/delivery-versions.json) 為準。更新與驗收讀 [CHANGELOG](CHANGELOG.md)／[本輪交接](docs/HANDOFF-v0.168.0.md)，開發讀[分層架構](docs/ARCHITECTURE.md)。舊 README 原文保留在[截至 v0.154 的歷史](README-HISTORY-through-v0.154.0.md)；歷史中的舊版本、舊工具數與舊平台狀態不代表現況。
