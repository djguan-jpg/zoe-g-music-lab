# 回到原句首（v0.82）

逐句表格新增「定位句首」。按鈕或Enter將選定音檔回到該句原開始時間，再沿波形方向鍵細調。結束時間可留白，文字與開始／結束字串保留；定位不建立標記撤回、不保存草稿，也不替代完整歌詞匯出驗證。

## 純模型與來源

`web/cue-position.js` 接受精確 `{id,start,end,text}` 原字串及既有 `wave-position` 完整媒體快照。ID1–64字元、開始／結束最多4096字元；未知／不完整欄位拒絕。開始重用 LyricTime 的嚴格十進位與 half-away-from-zero 毫秒規則，負時間先拒絕；normalized start 必須早於實際音檔結束，等於尾端或超出不裁切。媒體 source/current_source/duration/position/ready/error 沿共用契約；不可定位時回傳null。結束不作完整cue驗證，原留白保留。輸出只含ID與候選秒數。

## 注入操作與原生介面

controller 在allowed=true時讀原列與媒體，提案後第二次讀取完整原列與媒體；stable ID、全部原字串及source/current_source/duration必須一致，可定位且仍allowed。自然播放位置前進可保持。注入writer只能明確返回true才接續，第三次media再確認來源／時長／可用及actual position距提案不超過1毫秒，才回報成功。writer false／throw、來源變更或位置不符不虛報成功；已发生的媒體改動沒有交易式回滾承諾。dispose後停止讀取與操作。

`cue-position-dom.js` 只擁有表格delegated click/input兩個listener。原生button帶本頁stable ID，foreign／disabled目標忽略；literal aria-label及說明由固定頁面提供。refresh先讀媒體與allowed的便宜context，position-only變動不重新掃描所有列。來源／時長／availability／busy／hidden變更，或明確input、render、stamp及undo才重算各列。一次targets回讀原列與button，不按每個button重新搜尋整表。dispose只移除自身listener，沒有新timer、URL或媒體decode。

app沿共同captureLyricPlayer與既有drawWave/tick更新；busy／離開歌詞台停用，新增、刪除、還原與載入新歌詞按原ID重新建立。writer最後核對DOM原欄位及媒體，只指派native currentTime，不呼叫play/pause、不markDirty、不修改文字、時間或既有撤回。成功後更新顯示並明確focus波形供細調；自然refresh不搶焦點。

## 共用負值下溢修正

原本 `-1e-999` 經float／Number變成負零後可能被接受為零秒。Python lyric_timing與原生lyric-time現在在既有嚴格文法／有限數字檢查後，沿原十進位字串mantissa的負號及非零digit辨識負值；nonnegative normalize與timecode在捨入前拒絕。Python lyrics.timecode共用is_negative。真正負零（例如`-0e-999`）、positive underflow與signed shift的既有零捨入保持，沒有任意精度量化或文法放寬。

原字串仍在輸入中才可核對；已轉成numeric0／-0不能重建原字面來源，本輪不宣稱解決任意JSON數值字面underflow。離線預覽沿同一固定producer嵌入更新後共享模組，原template與envelope檢查保持。

## 版本与授權

產品0.82.0／expected tag v0.82.0，交付來源38–82共45項、unknown83拒絕。Agent1／draft3／領域schemas與14基本／啟庫21保持；HTTP只增加兩固定JS資產路由，四adapter操作、CLI退出契約與路徑權限保持，沒有新依賴或模型。ZOE. G、PolyForm Noncommercial 1.0.0、private與FreeTWAI not_submitted保持。可定位或媒體就緒不能證明實聽同步、權利或平台創始接受。
