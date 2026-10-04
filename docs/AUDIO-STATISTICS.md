# 音檔報告數值一致性（v0.61）

分析先核對所選音檔、接受條件與原始JSON；報告的PCM數值若互相矛盾，會顯示「音檔報告數值互相矛盾，沒有替換目前結果；請重新分析原音檔」。原成果保持，可按分析按鈕重試；不改音檔、不修正數值或自動調整音量。

`web/audio-statistics.js`獨立pure validator → `web/audio-review.js` model／inspect → 既有app result renderer。HTTP固定`/audio-statistics.js`／index依序載入；Node與瀏覽器共用同一實作。Python analyzer/application與CLI／Agent／MCP報告producer保持，實際producer資料跨語言驗證。

- 正整數影格、取樣率、聲道（1–32）、8/16/24/32 bit、positive duration；frames/rate與6位小數duration差≤0.00000051秒。已分析frames不得超過source bytes/block_align上限。
- Sample peak及RMS為finite且≤0 dBFS；RMS≤peak。數位靜音兩者皆null，DC=0且滿刻度樣本=0。null不當成0 dBFS。
- DC為finite且絕對值≤1；滿刻度樣本為整數0..frames，每聲道分别核對。邊界−1與samples=frames可讀，但仍依原報告提醒實聽可能削波。
- 安靜段各自0..duration，ratio在0..1；兩端總和不得大於duration+0.00000151秒（為兩段及總長各6位小數四捨五入保留容差）。全安靜音檔是例外：兩端各等於全長且ratio=1，兩端不相加為作品時長。
- 相關值非null時限兩聲道與finite −1..1。單聲道及多聲道的null表示不可測。

舊報告仍可在既有loudness legacy規則下顯示不可測；實際PCM producer本來就提供frames，未提供或矛盾的fields拒絕。沒有新增report／Agent／草稿schema，也沒有放寬來源guard或late取消規則。新模組不重新分析PCM，不證明所選File的hash、actual音畫同步、收件者接受、授權或聲音品質；RMS／LUFS／sample peak／true peak仍分開。

見[QA](QA-v0.61.0.md)與[交接](HANDOFF-v0.61.0.md)。
