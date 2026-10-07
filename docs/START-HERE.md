# 第一次使用 ZOE. G Music Lab

先選一個工作台，完成一份可審閱的資料，再接續其他方向。工具在本機整理資料，沒有模型服務或生成媒體。

## 工作台流程

於 Repo 根目錄執行 `python -X utf8 music_lab_server.py`，開啟 <http://127.0.0.1:8875/>。

1. **歌曲設計**：先寫記憶點與故事核心，再填 BPM、每小節拍數及段落。查看待辦、建立成果；小節時間假設固定速度，能量是設計值。
2. **母題分鏡**：寫母題如何改變，逐鏡填敘事任務、畫面、人物狀態、運鏡與時間。歌曲可先產生時間起稿；空白創作欄仍須完成，起稿不是完成分鏡。
3. **波形校時**：選自己的歌詞與本機音檔。匯入先預覽，明確套用後按實聽標記開始／結束。原文不修剪或去重；表格待辦與完整匯出驗證分開。
4. **交付檢查**：選整數 PCM WAV，核對取樣率、位深與聲道條件後分析。保留來源音檔；報告是量測證據，不是音質、版權或實聽判決。

載入檔案、起稿、保存版本與成果 ZIP 前先檢查預覽，明確套用才替換指定內容。後续編修可能使舊成果失效，重新建立再下載；取消等待會保留內容，後端或原讀取仍可能完成。

歌詞時間若貼入不可見字元而無法建立，請核對原欄位再手動修正；工具會保留無效原值。已有宣告不會被音檔覆寫，明確採用後仍可撤回。詳見[時間空白規則](LYRICS-WHITESPACE.md)。

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

## 草稿、成果與素材各自保存

預設工作台不寫草稿庫。使用者明確選定目錄後才啟用保存操作，例如在 Repo 根目錄執行：

```powershell
python -X utf8 music_lab_server.py --draft-library outputs/my-draft-library
```

這會使用指定本機目錄，保存新版本而不覆寫舊版本。草稿庫不是可由 Git 重建的測試產物，另行下載或備份；媒體也要另外保留。現代草稿先預覽再明確載入，舊格式需明確轉換。完整來源 Unicode、未知版本、矛盾時間或損壞檔案會拒絕，不自動修復。

送出瀏覽器下載不等於已保存成功。三文字入口可選回檔案核對全部原文；不一致時閱讀 byte 差異附近的目前原文、前後翻段或關閉。備份核對使用 SHA 與大小，不冒充原 ZIP 文字。詳見[原文核對](TEXT-VERIFICATION.md)、[差異閱讀](TEXT-VERIFICATION-PAGE.md)及[草稿保存核對](DRAFT-DOWNLOAD-VERIFICATION.md)。

## 找到下一步

[歌曲 Skill](../projects/zoe-music-production/SKILL.md)、[分鏡 Skill](../projects/zoe-mv-storyboard/SKILL.md)、[歌詞 Skill](../projects/zoe-lyrics-sync/SKILL.md)、[音檔 Skill](../projects/zoe-audio-delivery/SKILL.md)各有一份目前工作流程。Agent／MCP 讀[接口指南](AGENT.md)；開發與回復讀[架構](ARCHITECTURE.md)、[交接](HANDOFF-v0.160.0.md)。授權依 [LICENSE](../LICENSE)／[NOTICE](../NOTICE)，禁止商用；平台收錄不代表創始人核實。
