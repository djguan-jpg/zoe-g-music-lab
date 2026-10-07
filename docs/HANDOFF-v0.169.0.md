# v0.169.0 交接

操作見[開始指南](START-HERE.md)及[播放速度契約](PLAYBACK-RATE.md)。

波形校時新增原生「播放速度」選單，提供0.5／0.75／1／1.25／1.5／2倍。慢速聽句尾後仍以音檔實際秒數標記；單純選速度保留原句、宣告、播放位置及已建立成果。速度為本頁播放設定，不進draft3、歌詞JSON、CLI或Agent操作，不自動開始播放或處理音訊。

純playback-rate重用wave-position的來源核對 → 注入capture／setRate controller → literal DOM與原生playbackRate adapter → app。完整來源、busy／visible與目前速度在寫入前重查；明確false、無動作、錯回讀、來源／gate改變或dispose拒絕成功，不自動回滾原生寫入。reentrant write拒絕；自然播放進度可前進。原生ratechange等六事件同步顯示，pagehide移除自身listeners，沒有新timer或持久偏好。兩個固定GET JS資產，原POST、Agent22基本／啟庫29、29組schemas與領域wire保持。

集中55JS（新增15）與完整823Python／1992JS（150檔）、155syntax／四Skills通過。1063份工作來源前後SHA一致，一次性cache移除；Python兩worker／120秒、Node兩file workers／60秒保持。首批完整Python的一項版本範圍fixture漏同步，原failure及兩worker身份保留；修正expected38–169後重驗通過，沒有放寬assert。再跑helper被排他run收據拒絕，未建立新身份；改唯一label接續，原收據不覆寫。

Chrome用本輪合成四秒PCM選0.5／0.75／1／2倍，86具ID控制只改速度選單，原句ID與全部句欄、音檔來源、波形位置／時長與草稿提醒保持。半速在0.5秒記下開始、0.75倍在1.5秒記下結束，完整HTTP歌詞包六檔／格式提醒0／console0；建包後選速度仍可下載。修正切換工作台前刷新導致停用，實際回台可用且新增原app handler回歸。390×844佈局document width與scroll width皆375，控制343px；截圖只存忽略QA，viewport已reset、一tab已關閉、自有server原EOF0／thread joined。只讀DOM wrapper未提供native media properties，回讀由原adapter狀態與實際時間／產物交叉核對；不是獨立property或File身份證明。未實聽、保存下載、完整視覺或Host接受。

原v168 ZIP3208647bytes／SHA0a29a8511cb8659caa68562b82ffee64b9b9b02be046d4ce3fccc625e476ff9c完整CRC／1060raw Git blobs／ledger與823Python／1977JS還原通過。524四scope歷史ZIP及manifest逐bytes保持。產品169／明確38–169共132，unknown170拒絕；清單256／契約8192bytes及全部舊版保持。六法律／平台、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg與已授權public保持；四投稿仍submitted_unverified，本輪不讀寫平台或重送。

還原restore-v0.168.0-before-v0.169.0→8dd50bae5364c24f67fc38c82fce13f780847aab、codex/iteration-v0.169.0保存差異。指定source封裝、遠端asset及main以獨立成功manifest／收據為準；最新三已發布版與嚴格超七天必要門檻保持，未知／partial／FAILED保留，rolling goal active。

若需還原，另建codex/restore-*分支與PR，保留目前成果。Git還原不撤销已公開資料或平台投稿。
