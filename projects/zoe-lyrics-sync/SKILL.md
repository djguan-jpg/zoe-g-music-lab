---
name: zoe-lyrics-sync
description: Manually refine lyric timing with local audio and export validated LRC, SRT or JSON. Use for lyric subtitles, waveform timing or format conversion when source audio and text are available.
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Lyrics Sync

保留歌詞原句與順序，按本機音檔實聽人工標記時間，再匯出LRC／SRT／JSON。沒有唱詞辨識、猜時間或自動同步；來源文字與音檔各自保存。

## 執行流程

1. 工作台「波形校時」選原文與音檔。TXT／LRC／SRT／JSON先核對、預覽，明確套用才替換歌詞；完整包與legacy明確轉換分開。不要修剪、去重或默默改字。
2. 播放、看波形並人工標記開始／結束，可定位原句、檢查待辦與限定撤回。音檔時長與作品宣告分開，採用媒體時長需明確動作，不裁切句子。
3. 完整歌詞用Agent `lyrics`／MCP `lyrics_validate`；未完成原值用 `lyrics_review`，原句用 `lyrics_cue_review`，未校時原文用 `lyrics_seed`。診斷零待辦仍須完整驗證與實聽。
4. 完整package用 `lyrics_export_review` 檢查LRC／SRT回讀風險。需要精確保留來源或尚未填完時間時另存JSON／草稿，不讓格式文字取代原檔。

Repo根目錄的合成範例：

```powershell
python -X utf8 music_lab.py lyrics --input examples/lyrics.lrc --duration 60 --out outputs/start-here/lyrics
```

這是明確60秒總長的文字例子，部分句尾由下一句／總長推得，不是實聽證據。完整包最多2MiB、表格最多10000句；untimed seed最多64KiB／1000非空白行。時間half-away-from-zero至毫秒，捨入前拒絕真正負值；原文／Unicode保持，未知版本、損壞或錯來源拒絕，不自動修復。獨立預覽與三格式下載共用驗證；Apply完成與保存成功分開。

## 保存、接口與界線

使用前依[Agent指南](../../docs/AGENT.md)取得當前discovery及schema；目前22基本操作，只有明確啟動草稿庫才有29。CLI／Agent／MCP／工作台共用應用層，沒有第三方依賴、模型金鑰或產品外網能力。外部JSON嚴格UTF-8、傳輸2MiB／64層，重複鍵、非法Unicode、非有限數字與未知版本拒絕；domain上限依schema，不靜默修補／遷移。

完整需求／起稿／成果回讀先核對来源，預覽再明確Apply；保留原檔、後續編修、其他工作台與媒體。草稿另存、成果下載和素材保存分開，送出下載不代表已保存，beforeunload不是自動保存。原文核對不一致可[閱讀差異位置](../../docs/TEXT-VERIFICATION-PAGE.md)；SHA-only備份不提供猜測原文。CLI預設拒絕覆寫，明確 `--overwrite` 只替換指定輸出；多檔I/O可部分完成，錯誤時保留並核對。

創辦／發起 **ZOE. G**，GitHub **djguan-jpg**，協作範圍見[FOUNDER-RECORD](../../FOUNDER-RECORD.md)。**PolyForm Noncommercial1.0.0，禁止商用**，保留[LICENSE](../../LICENSE)／[NOTICE](../../NOTICE)，不授予AGPL或商用許可；平台作者關係仍自行聲明、尚未核實。上手讀[START-HERE](../../docs/START-HERE.md)，歷史原文見[截至v154歷史](HISTORY-through-v0.154.0.md)。本Skill維持目前工作流程，不附每轮QA歷史；舊工具數／狀態不作現況依据。
