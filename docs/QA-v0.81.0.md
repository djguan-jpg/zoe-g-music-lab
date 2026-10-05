# v0.81.0 驗證

起點main9301049edbcb949fa66efc4a4a6030b3fa7f3464，restore-v0.80.0-before-v0.81.0及codex/iteration-v0.81.0。baseline瀏覽器在沒有音檔時仍選中零秒合成句；改選broken.wav後原生ready0、error=false，舊句及高亮仍存在。證據為outputs/v81-qa/gap-evidence.json；未把baseline的error=false說成已觀察到error。

13項新增模型／controller／DOM測試，加既有cue-stamp、逐句撤回與wave-position共38項通過。涵蓋原列與部分留白、來源／ready／error／時長／位置、空隙／exclusive句尾／重疊原規則、busy、嚴格形狀與容量、雙capture來源／原列核對、同句自然前進／其他編修、刪除前列後ID定位、失敗不虛報、dispose、literal文字、只在變更時更新status及留白提示。

完整553 Python（71.516秒、兩隔離worker、120秒總期限）、933 JS、88 syntax及四Skills通過。172組歷史交付ZIP／manifest（四scope×38–80）與實際v80 producer bytes相同。v80原sourceZIP1541302bytes／SHA2b48c3791cbdec04c77f14d313dc1f3935a72ecca48a9e675c562cb7bff610de，還原553／920通過，temporary restore已移除。

原生瀏覽器26次觀察：空媒體清舊句；未校時原列保持；滑鼠定位正確第二列，136個editor欄位前後完全相同；Enter定位；時間編修變空隙、恢復不搶焦點；literal `<img src=x>後續文字🎵` 原樣显示；刪除／還原前面的留白列後ID及原列序號正確；第三句、音檔尾端、離開與返回工作台正確。換損壞音檔時ready0、清舊句與高亮，回讀仍未觀察到native error=true；error分支由純模型測試驗證，不宣稱已取得原生error事件。換two.wav恢復定位，宣告6秒保留，明確採用2秒後再接續。

实际CLI／Agent／MCP合成歌詞文件逐bytes一致；Agent good/bad/good=true/false/true，额外path沿原契約invalid_input。MCP initialize／tools/list／lyrics_validate核對product81、protocol2025-11-25與14工具，全部自有subprocess EOF exit0。瀏覽器先拒絕與既有6秒宣告衝突的包，原列／音檔／目前句保持；明確確認2秒再預覽、套用後轉為新ID與目前句。整份draft3預覽保留現有音檔，明確載入後音檔清空、目前句等待且無舊高亮。

QA首次草稿fixture用了不支援的`json`選項而被validate_draft拒絕；原failed run與空檔保留，fresh helper使用既有`.json`選項另建通過的fixture，未放寬產品契約。390×844視窗實際Enter定位通過，button x16–112／note x122–359／scrollWidth375；只核對幾何與互動，沒有宣稱完整視覺或screen reader验收。warn／error console為0；viewport reset，兩個自有tab已關閉，兩個bounded server正常返回、context關閉、deadline thread joined且無staging。合成媒體只在忽略的QA目錄，不進Git。

指定source封裝內再跑完整suite與Agent／MCP metadata，結果依package-evidence／manifest。merge、tag、private release及實際下載、SHA、remote ref/tree結果依後續release-remote-evidence.json；本文件不預先宣稱發佈成功。最後outputs與typed jobs盤點以inventory-evidence.json／final-audit-aggregate.json為準；latest81／80／79保留，只有嚴格超七天且exact Git/tag可重建才列候選，failed36/53、草稿／媒體／未知／外部程序保持。legal4/private/not_submitted保持。
