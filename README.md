# ZOE. G Music Lab

由 **ZOE. G** 發起的四個原創專案。GitHub 帳號為 **djguan-jpg**；品牌署名與帳號可以不同。

目前版本 v0.5 提供四個工作台與原創 Skill。Python 3.10 以上即可使用，沒有第三方依賴。只讀本次新建工作區，不參考使用者的其他本機或 GitHub 專案。公開第三方 README 僅用於需求比較，來源及自行設計的差異記在 [構思紀錄](CONCEPT.md)。

授權為 **PolyForm Noncommercial 1.0.0**，商業使用沒有由本版授權。可查看、修改及分發的範圍以 [LICENSE](LICENSE) 為準，保留 [NOTICE](NOTICE)。這是非商用原始碼授權；不標成 AGPL。使用者匯入的素材授權各自保留，詳見 [授權說明](LICENSING.md)。

| 專案 | 已提供的第一版 | 入口 |
|---|---|---|
| ZOE Music Production | 記憶點設計、BPM／小節時間計算、段落能量、AI 任務包 | [技能](projects/zoe-music-production/SKILL.md) |
| ZOE MV Storyboard | 多母題與逐鏡選擇、人物／方向變化理由、分鏡時間、CSV 與鏡頭提示 | [技能](projects/zoe-mv-storyboard/SKILL.md) |
| ZOE Lyrics Sync | LRC／SRT／JSON、波形定位、播放校時、時間與文字編修、匯出 | [工具](projects/zoe-lyrics-sync/README.md) |
| ZOE Audio Delivery | PCM WAV、規格／峰值／RMS、安靜段、相關性、SHA-256 報告 | [工具](projects/zoe-audio-delivery/README.md) |

## 開始使用

在此目錄開啟 PowerShell：

```powershell
python music_lab_server.py
```

用瀏覽器開啟 `http://127.0.0.1:8875/`。四個工作台皆可編修輸入、建立工作包、預覽成果並下載。按 Ctrl+C 停止。僅綁定本機；不自動開機啟動、不對外部署。

初始「樓梯間的回聲」是本次原創合成案例，可以直接改寫。歌曲與分鏡成果為設計資料；選擇 AI 後再創作／生成媒體。歌詞音檔由瀏覽器本機播放；交付檢查只把選定 WAV 傳入同一台電腦的分析器（最多 64 MiB），臨時分析檔於完成後清除，原音檔保留。

成果不會自動存到磁碟或跨重載保留。請下載需要的檔案；切換工作台只保留本輪已建立的成果。上方「下載專案草稿」保存三個創作工作台的表單／列資料及交付條件，可回讀與撤回最近一次載入；草稿不含音檔或成果。回讀後需重新選擇音檔並建立成果。草稿 v2 保存多母題與穩定對應，上限 1 MiB。載入舊版 v1 時先顯示轉換摘要，按「轉換並載入舊版草稿」後才取代表單；可撤回，原檔保留。未知 schema 不替換目前內容。

分鏡可新增最多 30 個母題，每鏡自行選擇；改名保留對應，刪除仍使用中的母題會列出鏡頭並拒絕。時間尚未填完的鏡頭可以刪除；只有其他鏡頭時間有效時才重新接續時間。

鏡頭預設展開第一鏡，其餘用時間／段落／母題摘要呈現。可全部收合或展開，並從「鏡頭定位」選擇後前往編修；時間空白或未選母題時會展開對應欄位。收合不刪除欄位，草稿與分鏡成果仍包含所有鏡頭；收合狀態只用於本頁顯示，回讀草稿恢復預設展開方式。

歌詞檔上限 2 MiB，只接受 LRC／SRT／JSON。連續選檔以最後一次選擇為準，成功讀入後同時更新原文與格式；錯誤檔保留既有內容與成果。手動修改原文／格式或載入草稿會取消尚未完成的讀檔。讀入原文後按「讀取歌詞」建立逐句表格。

修改輸入後會停用舊成果下載，重新建立／驗證後才恢復。歌詞播放預覽即時使用目前表格內容；數值計算及資料檢查不能代替實唱、實聽與實際畫面審查。

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

## Agent 使用

四種操作可用 JSON-lines v1 或 MCP stdio adapter。MCP 明確支援 `2025-11-25`；只接受該版初始化，不自動轉換未知版本。使用 `python scripts/agent_launch.py` 產生本版 Python／入口的完整路徑設定；加 `--format codex` 可產生 Codex TOML 片段。指令只顯示設定，不安裝或啟動 Agent，移動解壓目錄後需重新產生。已驗證設定從不同目錄啟動 MCP 及實際工具輸出；Codex CLI 只做設定解析，尚未驗證 host 連線／實際 Agent 工具呼叫。操作、錯誤及音檔選擇見 [Agent 文件](docs/AGENT.md)。

## 專案紀錄

- [創辦與協作紀錄](FOUNDER-RECORD.md)：ZOE. G 發起方向；Codex 協助規格、文字、程式與驗證。
- [專案清單](projects.json)：四個獨立 ID、版本與功能範圍。
- [本輪進度](PROGRESS.md)：實跑驗證與後續工作。
- [本版說明](RELEASE-v0.5.0.md)：功能、版本契約、驗證與限制。
- [四個專案的投稿資料](SUBMISSION-PACKET.md)：來源連結、用途、使用方式與作者關係。
- [分層與分支架構](docs/ARCHITECTURE.md)、[Agent 與 MCP 接口](docs/AGENT.md)、[迭代說明](CHANGELOG.md)、[本輪交接](HANDOFF.md)。

GitHub 儲存庫為 [djguan-jpg/zoe-g-music-lab](https://github.com/djguan-jpg/zoe-g-music-lab)，目前 private。四個專案共用此儲存庫，各有獨立 ID 與 Skill 入口；創辦／發起署名皆為 ZOE. G，AI 協作如實揭露。這是專案的發起紀錄，平台尚未核實作者或創始人身分。

自由工坊「手動登錄作品」要求公開 GitHub 網址。目前未公開、未送出投稿，也未授權平台 App 存取此 Repo。自 v0.3.0 採用 PolyForm Noncommercial 1.0.0 非商用授權。程式未部署為公開網站。

## 驗證

```powershell
python -m unittest discover -s tests -v
node --check web/app.js
node --test tests/test_editor_state.js
git diff --check
```

開發／封裝驗證需要 Node.js；一般使用工作台與 CLI 只需要 Python。從指定 Git 版本建立可驗證的原始碼 ZIP：

```powershell
python scripts/package_release.py --ref v0.5.0
```

封裝保存 commit、SHA-256、每檔摘要及檢查結果；解壓後重跑 Python／JavaScript 測試、Agent 能力查詢與 MCP 握手。輸出留在忽略的 outputs/releases，重複封裝同一提交會拒絕覆寫。
