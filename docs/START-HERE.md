# 第一次使用 ZOE. G Music Lab

頁面上方的 [MV 完整流程](MV-PROJECT.md) 可以從自己的音檔、歌詞與圖片建立試播草稿，保存含素材專案、重開、匯出 WebM；Agent 也能修訂同一份企劃並另存。原純文字工作台與下列指令仍可使用。

先選一個工作台，完成一份可審閱的資料，再接續其他方向。工具在本機整理資料，沒有模型服務或生成媒體。

## 工作台流程

於 Repo 根目錄執行 `python -X utf8 music_lab_server.py`，開啟 <http://127.0.0.1:8875/>。

1. **歌曲設計**：先寫記憶點與故事核心，再填 BPM、每小節拍數及段落。查看待辦、建立成果；小節時間假設固定速度，能量是設計值。
2. **母題分鏡**：寫母題如何改變，逐鏡填敘事任務、畫面、人物狀態、運鏡與時間。歌曲可先產生時間起稿；空白創作欄仍須完成，起稿不是完成分鏡。
3. **波形校時**：選自己的歌詞與本機音檔。匯入先預覽，明確套用後按實聽標記開始／結束。原文不修剪或去重；表格待辦與完整匯出驗證分開。
4. **交付檢查**：選整數 PCM WAV，核對取樣率、位深與聲道條件後分析。保留來源音檔；報告是量測證據，不是音質、版權或實聽判決。

載入檔案、起稿、保存版本與成果 ZIP 前先檢查預覽，明確套用才替換指定內容。後续編修可能使舊成果失效，重新建立再下載；取消等待會保留內容，後端或原讀取仍可能完成。

歌詞時間若貼入不可見字元而無法建立，請核對原欄位再手動修正；工具會保留無效原值。已有宣告不會被音檔覆寫，明確採用後仍可撤回。詳見[時間空白規則](LYRICS-WHITESPACE.md)。

分鏡總長面板與時間待辦共用原值分類；不可見字元的無效原值保留，需手動修正或明確採用鏡尾。採用只改宣告，撤回保留後續創作文字。見[總長原值](STORYBOARD-DURATION-VALUES.md)。

撤回總長接續需確認原字串實際還原；拒絕寫入時顯示錯誤，保留可核對的撤回紀錄。部分寫入或時間來源改動需人工修正後才可重試。見[撤回接受](STORYBOARD-DURATION-UNDO.md)。

新增鏡頭會接續最後一鏡的有效結束時間；最後一鏡留白或尚無鏡頭時從0秒起草。原時間與作品總長保留，時間仍需人工完成並檢查整份分鏡。無效原值請先修正再重試，見[新增時間規則](SHOT-ADD-VALUES.md)。

整批校時與撤回只有回讀完整實際時間後才顯示成功。拒絕或部分寫入時保留目前表格；撤回紀錄仍存在時，先核對並修正回套用後時間再重試，工具不自動回滾。見[寫入接受規則](LYRICS-TIMING-ACCEPTANCE.md)。

新增一句先按有效末句結束接續三秒，時間沿毫秒模型起稿；無效或超出精度時保留表格，先修正末句再重試。末句留白仍從0秒起草，時間需人工完成並核對作品宣告。見[新增句規則](CUE-ADD-MILLISECONDS.md)。

載入校時音檔後，可選「播放速度」慢速聽句尾；標記時間仍是音檔實際秒數。改速度保留時間與成果，無法設定時依播放器目前狀態再試。見[播放速度](PLAYBACK-RATE.md)。

v170候選版可在「要調整的歌詞」選句，按「試聽這一句」從原句首播放；「停止試聽」保留當前位置。先填有效開始與結束，倍率不改音檔秒數。句尾停止可能延後，需實聽核對；原時間與成果保留。完整接受待驗，正式版仍v169。見[單句試聽](CUE-AUDITION.md)。

## 用合成範例執行 CLI

下列命令都在 Repo 根目錄執行，範例是本專案合成文字。首次執行使用不同輸出資料夾；已有同名成果時預設拒絕覆寫，請先保留舊檔。

```powershell
python -X utf8 music_lab.py music --brief examples/first-light-music.json --out outputs/start-here/music
python -X utf8 music_lab.py storyboard --brief examples/first-light-mv.json --out outputs/start-here/storyboard
python -X utf8 music_lab.py lyrics --input examples/lyrics.lrc --duration 60 --out outputs/start-here/lyrics
python -X utf8 music_lab.py storyboard-seed --brief examples/first-light-music.json --fps 24 --bars-per-shot 4 --out outputs/start-here/storyboard-seed
```

歌曲輸出包含 `music-plan.json`、`brief.json` 與任務文字；分鏡有鏡頭表、`mv-brief.json` 與 `continuity.md`；歌詞有 `lyrics.lrc`／`lyrics.srt`／`lyrics.json` 與獨立預覽。`storyboard-seed.json` 只起草時間，創作仍未完成。LRC 範例的 60 秒是明確提供的總長，部分句尾由下一句或總長推得，不代表實際聽音校時。

音檔沒有打包進範例。要檢查自己的 WAV，使用 `audio --input` 明確指定檔案，並以 `--out` 指定新輸出目錄；其完整參數可執行 `python -X utf8 music_lab.py audio --help`。多檔輸出可能有部分完成，錯誤時查看訊息並保留所有已存在檔案。

CLI 回傳 **0** 表示本次命令完成，**2** 表示診斷／比較已完成且仍有待確認或差異，**1** 表示輸入或 I/O 錯誤；0 也不是創作、媒體或權利接受。

## 素材專案與原文字保存

預設工作台不寫草稿庫。使用者明確選定目錄後才啟用保存操作，例如在 Repo 根目錄執行：

```powershell
python -X utf8 music_lab_server.py --draft-library outputs/my-draft-library
```

這會使用指定本機目錄，保存新版本而不覆寫舊版本。草稿庫不是可由 Git 重建的測試產物，另行下載或備份。素材可另行保存，或使用上方素材專案一起打包；草稿庫仍只有文字。現代草稿先預覽再明確載入，舊格式需明確轉換。完整來源 Unicode、未知版本、矛盾時間或損壞檔案會拒絕，不自動修復。

送出瀏覽器下載不等於已保存成功。三文字入口可選回檔案核對全部原文；不一致時閱讀 byte 差異附近的目前原文、前後翻段或關閉。備份核對使用 SHA 與大小，不冒充原 ZIP 文字。詳見[原文核對](TEXT-VERIFICATION.md)、[差異閱讀](TEXT-VERIFICATION-PAGE.md)及[草稿保存核對](DRAFT-DOWNLOAD-VERIFICATION.md)。

## 找到下一步

[歌曲 Skill](../projects/zoe-music-production/SKILL.md)、[分鏡 Skill](../projects/zoe-mv-storyboard/SKILL.md)、[歌詞 Skill](../projects/zoe-lyrics-sync/SKILL.md)、[音檔 Skill](../projects/zoe-audio-delivery/SKILL.md)各有一份目前工作流程。Agent／MCP 讀[接口指南](AGENT.md)；開發與回復讀[架構](ARCHITECTURE.md)、[交接](HANDOFF-v0.171.0.md)。授權依 [LICENSE](../LICENSE)／[NOTICE](../NOTICE)，禁止商用；平台收錄不代表創始人核實。
