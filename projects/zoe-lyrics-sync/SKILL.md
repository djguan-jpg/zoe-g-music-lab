---
name: zoe-lyrics-sync
description: Manually refine lyric timing with local audio and export validated LRC, SRT or JSON. Use for lyric subtitles, waveform timing or format conversion when source audio and text are available.
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Lyrics Sync

ZOE. G 發起的原創歌詞校時工具。資料與時序驗證規則見 [工具說明](README.md)。

先判斷素材是否已有逐句時間。已有 LRC／SRT／JSON 時匯入；只有純文字時，可先用歌曲設計的「預覽已有歌詞的校時起稿」，或CLI lyrics-seed建立未校時JSON，再匯入校時工作台。先核對原文及影響、明確套用；開始／結束留白，依實際音檔逐句標記，不能把任意配給的時間說成辨識結果。

本機介面由工作區 `python music_lab_server.py` 啟動，選「波形校時」。載入使用者指定的音檔；第一聲道波形用於定位，播放器時間才是實際校時位置。

工作台可分別按「記下開始」與「記下結束」，或「整句移動」保留已有句長。未填時間不能匯出；已校時句子仍可播放顯示。調整開始、結束及文字，再驗證；遇到重疊、空白、負時間或超過作品宣告時長時先核對；實際音檔與作品宣告分開顯示。SRT 多行會以 ` / ` 合成一行；要保存原排版時，保留原檔並明確說明這個限制。

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

完整版本化歌詞包使用zoe-lyrics-package schema1。檢查／回讀保留名稱、總長、句尾及推得來源；不要抽取cues丟掉metadata。未知版本／重複欄位／矛盾來源拒絕。舊完整包只可明確轉換並另存，CLI需--legacy-json；不混入覆蓋欄位。工作台完整包宣告與目前已填時長衝突拒絕，先核對再明確修改；估計值不當已確認。音檔確認總長不能抹去曾補齊句尾的待實聽提示。一般cue JSON仍是建立新包的輸入。

外部JSON接續採共用嚴格UTF-8／JSON decoder，CLI最多2MiB、最大64層；重複欄位含跳脫同名、無效Unicode與非有限數字拒絕，不能默默取最後一個版本／值。保留原檔，協助另存有效UTF-8後重新預覽；不要把傳輸檢查當創作／媒體驗證。

## 工作台草稿另存（v0.21）

上方狀態核對四個工作台的完整草稿內容。Agent建包／送出下載不表示目前編修已保存；下載後先核對本機檔再明確確認，或明確啟用草稿庫並保存。晚到保存只確認當時的快照，後來編修仍需另存。已驗證現代檔案／庫版本須明確載入，legacy轉換需另存v3。預覽與取消不更改目前狀態，撤回後依內容判定。音檔與成果另存；離頁提醒受瀏覽器互動／裝置限制，不能取代主動保存，沒有自動寫檔或模型呼叫。

## 音檔時長接續（v0.24）

選音檔保留已有宣告，先核對兩個時長；需要採用時才按明確按鈕，再驗證匯出。撤回只還原宣告，保留後續歌詞；後來改時長／換音檔拒絕不安全撤回。原本空白且讀取期間沒有編修才自動接續首個有效時長。不要為短音檔裁切或移動句子；完整包超出總長仍拒絕。獨立預覽採用後須套用或下載才更新。媒體與撤回只在本頁，不存入 Agent／draft；不宣稱播放或時长比較等於實聽同步。

## 校時待辦（v0.25）

未完成表格先「檢查校時進度」或Agent／MCP lyrics_review；CLI lyrics-review --input raw-cues.json --out outputs/review。按問題定位原列開始／結束／文字，保留未標記值、不猜時間或裁切。局部已填數量不表示無重疊；修正後重查並以lyrics正式驗證，報告schema1不能當完成字幕。CLI2表示有待修正的報告已保存，meta.needs_review始終true，仍需實聽。原稿／媒體另存，編修後舊報告與定位停用。


## v0.38 完整文字交付

完成本工作台後可下載本輪所有文字成果ZIP與逐檔SHA清單，CLI／Agent／MCP共用 delivery_package。Agent預設摘要，小型ZIP需明確include_archive；不自動寫檔，封裝不等於實聽或實際畫面接受。基本11／啟庫16工具，Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-PACKAGE.md)。

## v0.39 接續文字ZIP

本工作台可選取本工具v38／v39交付ZIP，先核對原清單與逐檔SHA、再明確載入文字成果；表單與已選音檔保留，可限定撤回。跨scope先切換工作台再選檔；讀取中可取消，編修／換台後晚回應不能覆蓋。原文可再下载，但不代表由目前表單重建或正式媒體接受。CLI delivery-inspect／Agent與MCP delivery_inspect共用檢查，啟動時--delivery-zip明確選來源，預設metadata、include_files小型JSON≤512KiB；12／17工具，inspection1／package1／Agent1／draft3獨立。見[共用契約](../../docs/DELIVERY-INSPECTION.md)。

## v0.40 ZIP原文與差異

選ZIP後先審阅目前成果與將載入原文，新增／變更／移除／相同完整摘要；原換行計數與長檔有界預覽，Apply與下載仍保留全文。只替換本工作台成果，表單／音檔／限定Undo保持，不合併。CLI delivery-inspect --compare-input及Agent／MCP delivery_inspect明確baseline同一比較契約，12／17工具保持，comparison1獨立。見[共用契約](../../docs/DELIVERY-COMPARISON.md)。
