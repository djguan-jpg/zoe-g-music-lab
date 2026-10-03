# ZOE Lyrics Sync

創辦：ZOE. G · GitHub：djguan-jpg · v0.11

離線歌詞時間編修與匯出。可讀 LRC、SRT 和 JSON；LRC 多重時間標籤、offset 與小數時間會轉成逐句時間軸。純文字檔尚不會自動辨識歌曲咬字。

```powershell
python music_lab.py lyrics --input examples/lyrics.lrc --duration 60 --out outputs/lyrics
python music_lab.py lyrics --input examples/lyrics.lrc --shift 1.25 --set '2=14.5' --text '2=新的第二句歌詞' --duration 60 --out outputs/lyrics-edited
```

`--set`／`--text` 的句號從 1 起算，基於讀入並排序的逐句順序。先整體 shift，再套用個別 set／text，最後重排。負時間、重複時間、倒置 SRT 及超過歌曲結束的時間會回報錯誤。

每輪輸出 `lyrics.json`、`lyrics.lrc`、`lyrics.srt`、`preview.html`。SRT 保留原有結束時間；多行字幕合為單行，以 ` / ` 分隔。LRC／JSON 未指定結束時，使用下一句開始作結束。最後一句使用提供的 `--duration`，未提供且尾句也沒有結束時暫取最後開始加 3 秒；尾句有明確結束則保留。duration_estimated 表示總長未明確提供，timing 另記錄缺失結束的推得，兩者不混為同一判斷。

開啟 `preview.html`，選自己的本機音檔，播放並修改表格。按「使用播放位置」記下某句開始時間；按「套用編修」後才更新播放預覽與匯出內容。瀏覽器讀取音檔不會上傳。匯出 LRC 時只保留開始時間；SRT／JSON 保留開始和結束。

本機工作台：在專案根目錄執行 `python music_lab_server.py`，開啟本機介面的「波形校時」。可匯入歌詞、載入本機音檔、查看第一聲道波形、點擊定位或左右鍵微調 0.5 秒，再按「記下時間」填入某句。修改後驗證，成果在右側預覽並下載。

波形解碼上限 64 MiB，超過時保留播放功能、略過波形；音訊格式以瀏覽器支援為準。較細的逐字時間、拖曳及音訊辨識尚未實作。工作台的 HTTP 下載已驗證實際 JSON 檔案；v0.11 已確認獨立 preview.html 的 JSON／LRC／SRT 真正 Blob 下載、毫秒精度及音檔總長更新。完整視覺、其他瀏覽器與正式歌曲實聽尚未驗證。


「整批校時」先預覽再套用，正數延後、負數提前；有明確結束的句長保留。撤回只改時間，後來的歌詞文字、音檔與刪除紀錄保留；任何後續時間改動或句子增刪會拒絕整份撤回，避免蓋掉編修。最近一次校時撤回與調整量只存在本頁，不存進草稿；重新載入逐句內容／草稿會清除。修改後仍需驗證並建立歌詞包。

時間統一至毫秒，半毫秒往遠離零方向捨入；1.2345 秒變成 1.235。負值在捨入前拒絕；重複／重疊／超過指定歌曲總長整份拒絕，沒有自動截斷。--set 保留已有的明確句長，--shift 不改指定 duration。原始來源需為非負時間；shift 後仍以最終校時結果驗證。Agent 同一 payload 可用 shift_seconds、time_changes、text_changes，見根目錄 docs/AGENT.md。
