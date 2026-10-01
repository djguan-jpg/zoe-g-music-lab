# ZOE. G Music Lab

由 **ZOE. G** 發起的四個原創專案。GitHub 帳號為 **djguan-jpg**；品牌署名與帳號可以不同。

本機 v0.1 提供兩份 AI Skill、兩個實際可執行的工具。Python 3.10 以上即可使用，沒有第三方依賴。內容及程式在此工作區新建；自由工坊既有手冊是討論背景，沒有複製其內容，也沒有代替平台審核。

| 專案 | 已提供的第一版 | 入口 |
|---|---|---|
| ZOE Music Production | 音樂創作 AI Skill、需求檢查、AI 任務包匯出 | [技能](projects/zoe-music-production/SKILL.md) |
| ZOE MV Storyboard | MV 敘事 AI Skill、分鏡時間驗證、CSV 與鏡頭提示匯出 | [技能](projects/zoe-mv-storyboard/SKILL.md) |
| ZOE Lyrics Sync | LRC／SRT／JSON 讀取、時間與文字編修、離線播放預覽、格式匯出 | [工具](projects/zoe-lyrics-sync/README.md) |
| ZOE Audio Delivery | PCM WAV 串流檢查、峰值／RMS／DC、滿刻度樣本、規格判斷 | [工具](projects/zoe-audio-delivery/README.md) |

## 開始使用

在此目錄開啟 PowerShell：

```powershell
python music_lab.py music --brief examples/music-brief.json --out outputs/music
python music_lab.py storyboard --brief examples/mv-brief.json --out outputs/mv
python music_lab.py lyrics --input examples/lyrics.lrc --duration 60 --out outputs/lyrics
python music_lab.py audio --input '自己的歌曲.wav' --profile distribution --out outputs/audio
```

前三條命令使用明確標記為合成案例的範例。音檔命令需要提供你自己的 PCM WAV。

歌詞命令會產生 `preview.html`，用瀏覽器開啟即可選擇本機音檔播放、修改逐句時間和文字、匯出 LRC／SRT。音檔僅在瀏覽器本機讀取。

音樂及 MV 任務包是交給你選擇的 AI 的指令與已知需求；工具本身沒有呼叫模型、生成音樂或渲染影片。使用 Skill 時，AI 可根據需求創作文字與分鏡，實際媒體另外製作。

輸出路徑已有同名檔案時會拒絕覆蓋。確認要替換該輪輸出才加 `--overwrite`。技能沒有安裝到全域；可讓你的 AI 讀取本目錄的 `SKILL.md`。

## 專案紀錄

- [創辦與協作紀錄](FOUNDER-RECORD.md)：ZOE. G 發起方向；Codex 協助規格、文字、程式與驗證。
- [專案清單](projects.json)：四個獨立 ID、版本與功能範圍。
- [本輪進度](PROGRESS.md)：實跑驗證與後續工作。

目前保留在本機 Git 工作區，沒有對外建立 Repo、發佈網站或送出自由工坊認領。平台認領、GitHub 權限與授權條款由後續發佈決策另行處理。

## 驗證

```powershell
python -m unittest discover -s tests -v
git diff --check
```
