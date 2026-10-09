# 同一音檔的試播、循環與選句區域

`studio-timeline.js` 提供純範圍、半開區間、手動節拍、注入播放與時間寫入 controller、圖片 URL 所有權。`studio-timeline-dom.js` 接原生事件、pointer、keyboard 與圖片解碼；app 只提供原列、實際音檔來源和寫入器。分鏡、歌詞與節拍線沿同一 `lyrics-player` 秒數，不建立第二個音檔播放器。

分鏡試播使用每鏡本機 PNG／JPEG／WebP；沒有圖片時使用原畫面文字卡。時間空隙、重疊與無效列明確顯示。手動 BPM 20–400 與第一拍秒數最多產生 600 拍，沒有自動節奏偵測。

波形下方選句區域可拖曳開始／結束或整句平移，也可用方向鍵 ±0.1 秒、Shift ±1 秒。預覽不寫原時間；確認套用才更新，Esc 取消。完整來源與實際 post 回讀一致才建立撤回；false、無動作、部分寫入或 stale 來源拒絕成功，不自動回滾。撤回保留原時間字串、文字與其他列。

A–B 循環只由明確按鈕開始。seek、play、pause 都以同份來源與實際回讀核對；pending 拒絕重複啟動，取消後的 late Promise 不復活。離开分鏡／歌詞、busy、範圍變動或媒體不可用會停止自有播放；替代音檔解除舊 ownership，保留新播放器。原生事件可能超過終點，不能用作精準裁切。

圖片在新來源解碼與 gate 核對完成後才替換；無效／過大的圖片保留舊圖。移除鏡頭、替換、取消與 pagehide 清理自身 object URL，late callback 不復活。素材保存與影片匯出另沿 [MV 專案](MV-PROJECT.md) 的獨立契約，不變更 draft3 或 Agent wire。
