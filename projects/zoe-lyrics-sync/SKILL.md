---
name: zoe-lyrics-sync
description: Manually refine lyric timing with local audio and export validated LRC, SRT or JSON. Use for lyric subtitles, waveform timing or format conversion when source audio and text are available.
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Lyrics Sync

ZOE. G 發起的原創歌詞校時工具。資料與時序驗證規則見 [工具說明](README.md)。

先判斷素材是否已有逐句時間。已有 LRC／SRT／JSON 時匯入；只有純文字時，可先用歌曲設計的「預覽已有歌詞的校時起稿」，或CLI lyrics-seed建立未校時JSON，再匯入校時工作台。先核對原文及影響、明確套用；開始／結束留白，依實際音檔逐句標記，不能把任意配給的時間說成辨識結果。

本機介面由工作區 `python music_lab_server.py` 啟動，選「波形校時」。載入使用者指定的音檔；第一聲道波形用於定位，播放器時間才是實際校時位置。

工作台可分別按「記下開始」與「記下結束」，或「整句移動」保留已有句長。未填時間不能匯出；已校時句子仍可播放顯示。調整開始、結束及文字，再驗證；遇到重疊、空白、負時間或超過音檔時長時先修正。SRT 多行會以 ` / ` 合成一行；要保存原排版時，保留原檔並明確說明這個限制。

交回匯出的檔案與待聆聽核對的句子。LRC 只保留開始時間；SRT／JSON 保留結束時間。沒有完成辨識或校時時，不宣稱歌詞已自動同步。

CLI 範例：

```powershell
python music_lab.py lyrics --input lyrics.lrc --duration 120 --out outputs/lyrics-run
```

只有UTF-8純文字時：

```powershell
python music_lab.py lyrics-seed --text lyrics.txt --title '作品名稱' --out outputs/untimed-lyrics
```

原文最多64 KiB、1000非空白行。lyrics-seed schema1保留重複句、前後空白與來源行號；不是已校時字幕。未知格式／版本／來源不一致拒絕，原檔保留；非空白段落標籤也成為句子，需人工調整。

## 歌詞選檔與預覽（v0.18）

校時工作台選TXT／LRC／SRT／JSON即檢查與預覽，不立即改原文或cue。先確認原文／句數／時間，再明確套用；取消保留音檔與編修。TXT嚴格UTF-8／64KiB／1000行，沿用lyrics_seed1，開始結束留白。帶時間檔最多2MiB，SRT多行合單行／LRC補結束由預覽告知；Agent／CLI JSON沿用同一操作。目標變更或舊回應拒絕替換；未編修的最近套用可撤回。沒有ASR／模型。

完整版本化歌詞包使用zoe-lyrics-package schema1。檢查／回讀保留名稱、總長、句尾及推得來源；不要抽取cues丟掉metadata。未知版本／重複欄位／矛盾來源拒絕。舊完整包只可明確轉換並另存，CLI需--legacy-json；不混入覆蓋欄位。工作台宣告總長與目前時長衝突先請使用者確認，估計值不當已確認。音檔確認總長不能抹去曾補齊句尾的待實聽提示。一般cue JSON仍是建立新包的輸入。

外部JSON接續採共用嚴格UTF-8／JSON decoder，CLI最多2MiB、最大64層；重複欄位含跳脫同名、無效Unicode與非有限數字拒絕，不能默默取最後一個版本／值。保留原檔，協助另存有效UTF-8後重新預覽；不要把傳輸檢查當創作／媒體驗證。
