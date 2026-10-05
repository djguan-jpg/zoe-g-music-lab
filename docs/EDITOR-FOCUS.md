# 新增、刪除與還原後的編修接續（v0.84）

新增歌詞句原本仍停在新增按鈕，鍵盤使用者要重新找新欄位。共用focusEntry在最後一列刪除後找不到row而返回，焦點落到BODY。現在明確新增歌詞後focus新文字欄；六種清單刪除至空表時focus各自新增按鈕，還原後focus原列。只處理明確操作，播放、內容載入及來源變更不新增自動focus。

## 純模型

`web/editor-focus.js`只接受六個固定list：arrangement40、music-avoid100、music-deliverables100、motifs30、shots1000、cues10000列。來源恰為ids/visible/busy，ID為1–64字元、不重複；布林旗標精確，不含編修值、DOM、媒體、路徑或保存資料。checkedSource隔離ids。proposal驗證安全非負integer index及entry/new模式；非空來源需實際index，空來源只接受index0並選add。hidden或busy回null。

## 注入controller

capture(list)與focusTarget(target)為注入邊界。先檢查固定list，讀取來源並派生候選，focus前再次檢查visible/busy及全部原ID順序／數量。變更時拒絕候選，不把同一位置的新列當舊目標。已隔離的IDs可避免capture端共用array改寫來源。不需要比較欄位原文，因定位不寫或替換資料；沒有async等待、timer、快取或永久history。focusTarget只有明確true才成功，錯誤沿onError，dispose停讀及副作用。

## 固定DOM adapter與應用

`web/editor-focus-dom.js`固定list→panel/add映射，不接受外部selector或路徑。每次capture僅讀container.children的data-history-id；panel/container需connected且panel未hidden。目標需仍存在、connected、未disabled/hidden且屬於目前row或固定panel，再呼叫native focus並核對activeElement。shots沿原行為開details，entry選summary、new選motif_id；cues new選lyric-field，其餘entry/new選原首個input/textarea。未做通用computed-style、fieldset或整頁可及性證明。

app共用focusEntry，刪除選剩餘同位置／最後一列；空表傳index0。undo沿實際restore index及stable ID，新requirements／motifs／shots沿既有新增資料之後明確focus，新cues另提示填寫歌詞。原deletion history、時間compaction、markDirty、草稿checkpoint與原始欄位寫入路徑保持；focus adapter不调用writer、markDirty、play/pause/currentTime或網路，也不獨立註冊listener。

## 資產與版本

HTTP仅新增兩固定JS asset，index先載pure/DOM再app，POST操作、CLI、Agent/MCP、schema與權限無變更。產品84／交付來源38–84共47／unknown85拒絕、Agent1/draft3／14基本與啟庫21保持。PolyForm Noncommercial、private與FreeTWAI not_submitted保持。完整visual、screen reader、正式素材實聽未驗證。
