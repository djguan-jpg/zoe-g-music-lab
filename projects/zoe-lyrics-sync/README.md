# ZOE Lyrics Sync

創辦：ZOE. G · GitHub：djguan-jpg · v0.1

離線歌詞時間編修與匯出。可讀 LRC、SRT 和 JSON；LRC 多重時間標籤、offset 與小數時間會轉成逐句時間軸。純文字檔尚不會自動辨識歌曲咬字。

```powershell
python music_lab.py lyrics --input examples/lyrics.lrc --duration 60 --out outputs/lyrics
python music_lab.py lyrics --input examples/lyrics.lrc --shift 1.25 --set '2=14.5' --text '2=新的第二句歌詞' --duration 60 --out outputs/lyrics-edited
```

`--set`／`--text` 的句號從 1 起算，基於讀入並排序的逐句順序。先整體 shift，再套用個別 set／text，最後重排。負時間、重複時間、倒置 SRT 及超過歌曲結束的時間會回報錯誤。

每輪輸出 `lyrics.json`、`lyrics.lrc`、`lyrics.srt`、`preview.html`。SRT 保留原有結束時間；多行字幕合為單行，以 ` / ` 分隔。LRC／JSON 未指定結束時，使用下一句開始作結束。最後一句使用提供的 `--duration`，未提供則暫取 3 秒並在輸出資料中標記為估計。

開啟 `preview.html`，選自己的本機音檔，播放並修改表格。按「使用播放位置」記下某句開始時間；按「套用編修」後才更新播放預覽與匯出內容。瀏覽器讀取音檔不會上傳。匯出 LRC 時只保留開始時間；SRT／JSON 保留開始和結束。

下一階段可加入更細的逐字時間、波形與拖曳、音訊辨識。這些尚未實作。
