# 選定句子試聽契約

v170工作來源完整接受已通過；指定提交封裝及發布狀態以成功manifest與遠端release為準。原期限失敗與明確批准的新期限見[接受接續3](QA-v0.170.0-ACCEPTANCE-3.md)。

載入音檔，在「要調整的歌詞」選句，填入0≤開始<結束≤音檔時長，再按「試聽這一句」。開始與結束沿音檔秒數，允許原有六種播放速度；不把倍率套入時間。只在明確按鈕啟動，手動「停止試聽」保留當前位置。原生timeupdate等事件到句尾後pause；事件排程、背景分頁與倍率可讓停止延後，不能當精準裁切。原生播放器與音質、實聽另行核對。

cue-audition.js嚴格接受row／media／playing／visible／busy快照，row與media隔離複製。範圍沿共用LyricTime及定位模型，不修剪或改写原值。seek前後重查同份原列、來源與時長、可用狀態，currentTime需在候選1ms內；原生play開始後需實際playing回讀。false、錯位置、無動作、例外、來源或gate變更拒絕成功；已發生原生位置寫入保留，不自動回滾。

play pending已有單一owned job，重複start拒絕；可明確stop或dispose。停止只pause同份source／current_source／duration，且回讀playing=false才能清除；false或no-op保留可stop狀態供人工核對。停止／來源解除後的late resolve／reject不再回報成功或更新狀態；瀏覽器原生play-pause中斷行為仍由播放器負責。row原字串或ID變動（包括無效時間）、選句、busy、visible或media不可用會停止自有片段；替代音檔解除原ownership，保留替代播放器。來源copy是比對快照，不宣稱atomic外部媒體身份。

cue-audition-dom.js只在確認原來源後設定currentTime／play／pause，擁有按鈕、selection change、表格input／focusin與十個原生media事件。原selection先跟隨焦點，試聽再核對選句。pagehide／dispose移除自身listeners，既有listeners保持；没有timer、儲存播放偏好、草稿／Agent欄位、新operation或外網能力。app在原欄位編修、render、busy及nav visibility完成後刷新，單純試聽不markDirty或重建成果。

原生瀏覽器驗證範圍與已知延遲見[QA](QA-v0.170.0.md)。還原及接續見[交接](HANDOFF-v0.170.0.md)。
