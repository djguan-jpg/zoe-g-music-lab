# ZOE. G Music Lab

由 **ZOE. G** 發起的四個原創專案。GitHub 帳號為 **djguan-jpg**；品牌署名與帳號可以不同。

目前版本 v0.11 提供四個工作台、原創 Skill、本機草稿庫及可預覽的 ZIP 備份／恢復、整批歌詞校時。Python 3.10 以上即可使用，沒有第三方依賴。只讀本次新建工作區，不參考使用者的其他本機或 GitHub 專案。公開第三方 README 僅用於需求比較，來源及自行設計的差異記在 [構思紀錄](CONCEPT.md)。

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

成果不會自動存到磁碟或跨重載保留。請下載需要的檔案；切換工作台只保留本輪已建立的成果。上方「下載專案草稿」保存三個創作工作台的表單／列資料及交付條件，可回讀與撤回最近一次載入；草稿不含音檔或成果。整份草稿回讀後需重新選擇音檔並建立成果。草稿 v3 保存多母題、穩定對應、創作語言及歌曲需求清單，上限 1 MiB。載入舊版 v1／v2 時先顯示轉換摘要，按「轉換並載入舊版草稿」後才取代表單；新增需求沿用舊工作台預設，可撤回，原檔保留。未知 schema 不替換目前內容。

歌曲可編修創作語言、避免事項及交付項目，每份清單最多 100 項；單項可有多行。未完成項目可保存草稿，但建立歌曲設計包時會要求補齊，至少一項交付不可空白。

Agent／CLI 回傳的 `brief.json`（含 BPM／arrangement／記憶點）與 `mv-brief.json`（含 motifs）可由「接續一份歌曲或分鏡需求」回讀。選定類型後上傳本機 JSON，先看經共用應用層檢查的需求與待審查提醒，再按「載入這份需求」；只替換該工作台，其他工作台、後續編修與已選音檔保留。「撤回載入」也只還原這次替換的工作台。需求檔上限 1 MiB；未知欄位、超出工作台可表達的清單或畫幅會拒絕，避免靜默丟資料。分鏡工作台支援 16:9／9:16／1:1／4:3；其他有效需求仍可保留原檔由 CLI 使用。結果 JSON、整包 Agent envelope 與舊版單純需求不會被猜測成可編修的設計需求。

分鏡可新增最多 30 個母題，每鏡自行選擇；改名保留對應，刪除仍使用中的母題會列出鏡頭並拒絕。時間尚未填完的鏡頭可以刪除；只有其他鏡頭時間有效時才重新接續時間。

鏡頭預設展開第一鏡，其餘用時間／段落／母題摘要呈現。可全部收合或展開，並從「鏡頭定位」選擇後前往編修；時間空白或未選母題時會展開對應欄位。收合不刪除欄位，草稿與分鏡成果仍包含所有鏡頭；收合狀態只用於本頁顯示，回讀草稿恢復預設展開方式。

歌詞檔上限 2 MiB，只接受 LRC／SRT／JSON。連續選檔以最後一次選擇為準，成功讀入後同時更新原文與格式；錯誤檔保留既有內容與成果。手動修改原文／格式或載入草稿會取消尚未完成的讀檔。讀入原文後按「讀取歌詞」建立逐句表格。

修改輸入後會停用舊成果下載，重新建立／驗證後才恢復。歌詞播放預覽即時使用目前表格內容；數值計算及資料檢查不能代替實唱、實聽與實際畫面審查。

歌詞 JSON 的 `duration_estimated` 仍表示總時長未明確提供，與尾句結束是否推得分開。新增 `timing` 記錄 duration_source／inferred_end_count／tail_end_inferred；SRT 明確結束時間會保留，提示總時長尚未由音檔確認，避免把它誤說成尾句估計。

「波形校時 → 整批校時」可輸入正數延後、負數提前，先預覽全部句子的檢查結果（表格列出前 20 句），再明確套用。已有結束時間的句長保留；負時間、重疊、重複開始或超出指定總長會整份拒絕，沒有截斷。套用／撤回只改時間，音檔、歌詞文字與刪除歷史保留。若之後改過任何句子的時間或增刪句子，撤回會拒絕整份覆蓋；恢復為套用後的時間後可再撤回。撤回只保留最近一次套用，載入新的逐句內容／草稿會清除；調整量、預覽及撤回紀錄不進草稿。

CLI 的 `--shift`／`--set`／`--text` 與 HTTP、JSON-lines、MCP 共用同一操作。句號以原始開始時間排序後由 1 起算；先整批 shift，再按順序 set 開始（有明確結束時保留句長）、text，最後檢查／排序。原輸入檔與已提供總長保留；缺失結束時間在編修後推得。LRC offset 只讀取一次。

時間以 0.001 秒保存，半毫秒往遠離零的方向捨入，例如 1.2345 → 1.235、-0.0005 → -0.001。開始／結束的原始負值先拒絕，不因捨入成零而接受；非有限值、布林值、空值、非十進位字串或不能保留毫秒精度的數值拒絕。獨立 `preview.html` 使用同一瀏覽器時間模組，套用後重新計算 timing 來源與提示，下載內容和目前表格一致。

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

## 本機保存版本

原有啟動指令不會開啟磁碟保存。停止服務後，明確指定本次草稿庫：

```powershell
python music_lab_server.py --draft-library outputs/drafts
```

打開「本機保存版本」，為這次構思命名，再按「保存目前草稿」。每次保存建立新 ID 與新版本，不覆寫以前的版本。未完成的小節／校時空白、多行文字與母題對應可以保存；保存成功不代表創作或時間已驗證。

選擇版本並按「預覽選定版本」會核對 SHA-256 與草稿 v3，保留目前表單和音檔。按「載入這個保存版本」才替換四個工作台草稿、清除刪除紀錄及音檔選擇；「撤回載入」恢復套用前的草稿欄位，音檔仍需重選。也可單獨下載預覽版本的 JSON。

若保存回應未完成，先按「重試同一筆保存」；同一 ID、名稱與內容只保存一次。重試使用原本按下保存時的內容，之後的編修保留並提示尚未保存。「放棄待重試紀錄」只停止重試，不刪除可能已保存的版本；可重新整理清單確認。關閉頁面後沒有待重試記憶，應先檢查保存清單。

草稿庫每頁預設 20 版，可讀取更早版本；最多 1000 版、每版草稿 1 MiB。達到上限會拒絕新版本並保留現有資料，可另選新庫。草稿庫不含音檔、成果、刪除歷史或臨時預覽；沒有自動保存／刪除接口。它不進 Git 或原始碼 ZIP，也不隨封裝維護清除。重要草稿請使用下方 ZIP 備份並另存可靠的位置；Git 還原點只保護程式。

CLI 可使用同一草稿庫，`save` 輸入為下載的草稿 v3，`read` 回傳的 `data.draft` 才是可匯入的草稿：

```powershell
python music_lab.py draft save --library outputs/drafts --input '專案草稿.json' --label '副歌第二案'
python music_lab.py draft list --library outputs/drafts --limit 20
python music_lab.py draft read --library outputs/drafts --id 'draft-00000000000000000000000000000001'
```

最後一行的 ID 僅示範格式，請改用保存回應的 `data.entry.id`。需要安全重試時，在第一次 `save` 就用 `--id` 指定新 ID，重試保持整份草稿、名稱和 ID 相同；省略 ID 的每次命令都會建立新版本。

## 備份與恢復

啟用草稿庫後，在「本機保存版本 → 備份與恢復」按「下載整個草稿庫」。它只備份已保存版本，保留原 ID、名稱、時間、metadata 與草稿的原始位元組。先保存目前編修；音檔與成果需另存。下載後核對檔案並保留在可靠的位置，同一磁碟上的副本不足以防止磁碟故障。

選擇 ZIP 會檢查整份備份、顯示新版本／重用版本／衝突與 SHA-256；此時不寫入草稿庫。確認後按「將備份加入這個草稿庫」，只新增版本，不載入或更改目前表單、音檔及刪除還原紀錄。相同 ID 的兩個檔案完全一致才重用；不同內容、毀損、未知 schema 或容量不足會拒絕，不覆寫現有版本。

下載 ZIP 上限 32 MiB、展開資料總量 64 MiB；超限會明確失敗，沒有略過部分版本。可由 CLI 用 `--ids` 明確分批，每批另用新檔名。任何來源版本毀損時，完整備份會失敗；保留原資料，可明確選擇其他健康版本另備份。

```powershell
python music_lab.py draft backup --library outputs/drafts --out '構思備份.zip'
python music_lab.py draft inspect --library outputs/restored-drafts --input '構思備份.zip'
python music_lab.py draft restore --library outputs/restored-drafts --input '構思備份.zip' --sha256 '<inspect 回傳的 data.backup_sha256>'
```

恢復前再次核對選定檔案的摘要及整個庫的衝突／容量。已知錯誤在寫入前拒絕；實際磁碟故障可能留下已完成的部分新版本。回應未確認或中途中斷時，保留同一份備份重試：完全一致的版本重用，其餘繼續新增。這不是多目錄交易或斷電保證。CLI 備份輸出永不覆寫，需支援 hard link 的檔案系統；本版已在 Windows 本機驗證。

## Agent 使用

預設四種操作可用 JSON-lines v1 或 MCP stdio adapter。明確選定 `--draft-library` 後共九種工具；備份檢查／恢復另需啟動時選定 `--draft-backup '構思備份.zip'`，JSON 不能更換路徑。ZIP 匯出使用 CLI 或工作台。MCP 明確支援 `2025-11-25`；只接受該版初始化，不自動轉換未知版本。使用 `python scripts/agent_launch.py` 產生本版 Python／入口的完整路徑設定；加 `--format codex` 可產生 Codex TOML 片段。指令只顯示設定，不安裝或啟動 Agent，移動解壓目錄後需重新產生。已驗證設定從不同目錄啟動 MCP 及實際工具輸出；Codex CLI 只做設定解析，尚未驗證 host 連線／實際 Agent 工具呼叫。操作、錯誤及音檔選擇見 [Agent 文件](docs/AGENT.md)。

## 專案紀錄

- [創辦與協作紀錄](FOUNDER-RECORD.md)：ZOE. G 發起方向；Codex 協助規格、文字、程式與驗證。
- [專案清單](projects.json)：四個獨立 ID、版本與功能範圍。
- [本輪進度](PROGRESS.md)：實跑驗證與後續工作。
- [本版說明](RELEASE-v0.11.0.md)：功能、版本契約、驗證與限制。
- [四個專案的投稿資料](SUBMISSION-PACKET.md)：來源連結、用途、使用方式與作者關係。
- [分層與分支架構](docs/ARCHITECTURE.md)、[Agent 與 MCP 接口](docs/AGENT.md)、[迭代說明](CHANGELOG.md)、[本輪交接](HANDOFF.md)。

GitHub 儲存庫為 [djguan-jpg/zoe-g-music-lab](https://github.com/djguan-jpg/zoe-g-music-lab)，目前 private。四個專案共用此儲存庫，各有獨立 ID 與 Skill 入口；創辦／發起署名皆為 ZOE. G，AI 協作如實揭露。這是專案的發起紀錄，平台尚未核實作者或創始人身分。

自由工坊「手動登錄作品」要求公開 GitHub 網址。目前未公開、未送出投稿，也未授權平台 App 存取此 Repo。自 v0.3.0 採用 PolyForm Noncommercial 1.0.0 非商用授權。程式未部署為公開網站。

## 驗證

```powershell
python -m unittest discover -s tests -v
node --check web/app.js
node --test tests/test_*.js
git diff --check
```

開發／封裝驗證需要 Node.js；一般使用工作台與 CLI 只需要 Python。從指定 Git 版本建立可驗證的原始碼 ZIP：

```powershell
python scripts/package_release.py --ref v0.11.0
```

封裝保存 commit、SHA-256、每檔摘要及檢查結果；解壓後重跑 Python／JavaScript 測試、Agent 能力查詢與 MCP 握手。輸出留在忽略的 outputs/releases，重複封裝同一提交會拒絕覆寫。

## v0.7 的輸入與錯誤提示

歌曲清單的空白項目會顯示欄位旁提示並取得焦點，修正或重新載入後清除舊標示；交付清單全空時定位到新增按鈕。標示不是驗證成果，修改後仍需重建。

MCP tools/list 與本機 capabilities 提供完整輸入欄位及 files/data/meta 成果 schema。現代與舊版歌曲／分鏡都有明確條件。schema 描述資料形狀，領域層檢查時間、數字文字、連戲與 PCM；沒有新增 schema engine 或模型呼叫。歌詞請求的 cues 與 content／suffix 不可同時提供，以免原文被忽略。音檔接受條件需為正整數清單，拒絕布林值與小數；1.0 這類整數值會正規化為 1。詳見 [Agent 契約](docs/AGENT.md)。


## v0.8 的刪除還原

歌曲段落、避免事項、交付項目、未使用的母題、鏡頭及歌詞句可由工作台上方選擇刪除紀錄再還原。每個創作工作台保留最近 20 筆，摘要協助辨識；可選擇較早的一筆。其他欄位、後續新增／編修及已選音檔保留。還原後需重建成果才可下載。

分鏡刪除的自動時間接續只有目前值仍與刪除後相同才撤回；手動改過的時間／總長保留並提示重新檢查。可能需要人工修正空白或重疊，既有分鏡檢查仍必須通過。刪除紀錄中的母題 ID 暫時保留，新母題不會重用它。

紀錄只在本頁，不存進草稿或跨重載保留；請另存草稿。載入新範例／需求／草稿會清除被取代工作台的紀錄，成功重新讀取歌詞也清除歌詞紀錄，驗證逐句表格則保留。容量已滿時不還原也不丟掉紀錄；先保存草稿、刪除另一列，再選原紀錄還原。歌曲／鏡頭／歌詞列上限分別為 40／1000／10000，需求清單 100、母題 30。

歌詞匯入或驗證期間仍可修改本工作台；有修改時會捨棄舊回應，保留表格與原文，提示重新建立成果。
