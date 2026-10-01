# ZOE. G Music Lab

由 **ZOE. G** 發起的四個原創專案。GitHub 帳號為 **djguan-jpg**；品牌署名與帳號可以不同。

本機 v0.2 提供四個工作台與原創 Skill。Python 3.10 以上即可使用，沒有第三方依賴。此輪只讀本次新建工作區，不參考你的其他本機或 GitHub 專案。公開第三方 README 僅用於需求比較，來源及自行設計的差異記在 [構思紀錄](CONCEPT.md)。

| 專案 | 已提供的第一版 | 入口 |
|---|---|---|
| ZOE Music Production | 記憶點設計、BPM／小節時間計算、段落能量、AI 任務包 | [技能](projects/zoe-music-production/SKILL.md) |
| ZOE MV Storyboard | 母題狀態、人物／方向變化理由、分鏡時間、CSV 與鏡頭提示 | [技能](projects/zoe-mv-storyboard/SKILL.md) |
| ZOE Lyrics Sync | LRC／SRT／JSON、波形定位、播放校時、時間與文字編修、匯出 | [工具](projects/zoe-lyrics-sync/README.md) |
| ZOE Audio Delivery | PCM WAV、規格／峰值／RMS、安靜段、相關性、SHA-256 報告 | [工具](projects/zoe-audio-delivery/README.md) |

## 開始使用

在此目錄開啟 PowerShell：

```powershell
python music_lab_server.py
```

用瀏覽器開啟 `http://127.0.0.1:8875/`。四個工作台皆可編修輸入、建立工作包、預覽成果並下載。按 Ctrl+C 停止。僅綁定本機；不自動開機啟動、不對外部署。

初始「樓梯間的回聲」是本次原創合成案例，可以直接改寫。歌曲與分鏡成果為設計資料；選擇 AI 後再創作／生成媒體。歌詞音檔由瀏覽器本機播放；交付檢查只把選定 WAV 傳入同一台電腦的分析器（最多 64 MiB），臨時分析檔於完成後清除，原音檔保留。

成果不會自動存到磁碟或跨重載保留。請下載需要的檔案；切換工作台只保留本輪已建立的成果。修改輸入後會停用舊成果下載，重新建立／驗證後才恢復。數值計算及資料檢查不能代替實唱、實聽與實際畫面審查。

命令列同樣可用：

```powershell
python music_lab.py music --brief examples/first-light-music.json --out outputs/v02/music
python music_lab.py storyboard --brief examples/first-light-mv.json --out outputs/v02/mv
python music_lab.py lyrics --input examples/lyrics.lrc --duration 60 --out outputs/v02/lyrics
python music_lab.py audio --input '自己的歌曲.wav' --profile distribution --out outputs/v02/audio
```

歌曲需求含 `arrangement` 時啟用設計台，分鏡需求含 `motifs` 時啟用母題檢查。v0.1 需求格式仍支援。

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
node --check web/app.js
git diff --check
```
