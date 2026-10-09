## v0.170.0 明確期限批准與完整接受

使用者已批准Python600／JavaScript180秒。完整823Python（1既有skip、0expected failures）／2013JS、157syntax／四Skills通過；兩worker、原案例／斷言、來源與全部舊版保持。指定提交封裝、PR／main／tag／遠端asset與清理各以本輪成功manifest及最終收據為準；先前候選失敗屬下列歷史紀錄。見[接續接受3](QA-v0.170.0-ACCEPTANCE-3.md)。

# v0.170.0 接續 QA 2

最新證據見[接受診斷2](QA-v0.170.0-ACCEPTANCE-2.md)，原完整接受仍失敗，必要期限決策未推定批准。以下原QA完整保留。

# v0.170.0 接續 QA

最新證據見[完整接受診斷 1](QA-v0.170.0-ACCEPTANCE-1.md)。以下原候選QA完整保留，不將其集中通過或第一次快照通過當成本次完整接受。

# v0.170.0 候選 QA

波形校時候選版新增「試聽這一句／停止試聽」，沿選句的原開始與結束秒數定位及播放；手動停止保留播放位置，原文字、時間、作品宣告與已建立成果保留。只由明確按鈕開始，句尾依原生事件暫停，可能超過句尾；適合校時試聽，不能當精準音訊裁切。正式版仍v169，v170完整接受尚未通過，沒有release manifest／release tag或main合併。

純cue-audition範圍模型重用cue-position／wave-position／LyricTime → 注入capture、seek、play、pause controller → 原生DOM adapter → app。寫入前後核對同份原列、來源／時長、busy／visible及實際currentTime／playing；false、無動作、錯定位、play拒絕／延遲、pause失敗或dispose拒絕成功。pending阻止重複啟動，失敗不自動retry／rollback。編修文字／時間（含無效數值）、選句、busy／離台或媒體不可用會停止自有試聽；替代音檔解除原ownership，保留替代播放器。focusin沿原selection handler之後核對。只有兩固定GET JS資產；没有timer、draft欄位、POST、Agent操作、依賴、產品網路或權限擴張。

新增21JS，修正後集中69JS（試聽／定位／標記／速度／版本）、157syntax與四Skills通過；1069份工作來源集中測試前後SHA一致。首批原兩worker／120秒Python完整823（1既有Windows symlink skip、0expected failures，118.25秒）通過；同份JS2013中2012通過、一項既有相鄰refresh oracle失敗。保留原測試，把新refresh移到原兩個call之後；修正後包含該原整合oracle的集中69通過，但不能代替全套接受。

後續Python3.10及本機已安裝3.12的兩份原launcher都達120秒期限；修正後完整151JS檔的兩file workers重驗也達原60秒，只印出751項前段輸出，沒有完整summary或成功收據。原實際worker start、原handle EOF及terminal保留，不補造缺少的count／身份。未增加期限、刪除case、更換provider、改discovery／排程或產品依賴；尚不能判定完整逾時根因。Python3.12一次性來源清理先因WinError32拒絕，後續核對原精確路徑為自有空目錄後只rmdir該目錄成功，沒有recursive清理、全域PID觀察或signal；未知holder未被辨識。

Chrome原WorkbenchHandler、本輪合成四秒PCM：半速0.5–1.5秒、二倍速2.5–3.5秒明確試聽，起點各0.5／2.5，停止回讀各1.507192／3.963361，證明事件停止的非精準性。86具ID欄位、原句ID／全部原值、音檔URL／選檔值、宣告与成果JSON在各自試聽前後保持；六檔HTTP歌詞包／格式提醒0，試聽後仍可下載。手動停止、選單與焦點换句、無效結束欄編修（空白保留）、離台／回台可用均已核對。另選合成檔確認新URL與原句保留；操作延遲使片段先到句尾，不能冒充active clip期間換檔證明，該ownership規則由注入測試覆蓋。首次同檔重選無change与一筆輸入逾時原觀察保留。

390×844時document client／scroll width皆375、試聽群組309px，無水平溢出；console0、viewport reset、一個自有tab關閉，自有server原handle EOF0／thread joined。截圖只存忽略QA。read-only DOM未提供native media property或File身份；原adapter狀態、波形ARIA与成果分層核對，不宣稱獨立property／File身份、實聽、保存下載、完整視覺／screen reader或Host接受。

原v169 ZIP3224266bytes／SHA6acc1e26ba4c9c346e732a9545d29d9d9f0229b2436bc447818d425767664117的CRC、1066raw Git blobs与ledger本輪唯讀核對；沒有本輪原ZIP完整restore測試。528四scope歷史ZIP／manifest逐bytes一致。候選產品170／明確38–170共133，unknown171拒絕；全部舊版、256清單／8192bytes保持。六法律／平台、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg和既有public保持。四投稿仍submitted_unverified，本輪不讀寫平台或重送。

還原restore-v0.169.0-before-v0.170.0→b135efbb407dfd0a5b9d71a893ce6ac8f306c7c5、codex/iteration-v0.170.0保存候選差異。只交出具CRC／raw blobs核對的source checkpoint与Draft PR，不建立成功release manifest，不合併main或打v170 release tag。接續先處理完整接受；若要調整時限，須由使用者明確決定，不能沿256版本清單的同意推定。最新三已發布版169／168／167及嚴格超七天必要門檻保持，未知／partial／FAILED保留，rolling goal active。
