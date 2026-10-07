## v0.170.0 接續接受診斷 2

已完成案例內child／等待分析與有界比較，原完整接受仍未通過。必要期限決策已提出，未批准前不增加期限，正式版仍v169。見[診斷2](docs/QA-v0.170.0-ACCEPTANCE-2.md)。以下原紀錄保持。

## v0.170.0 接續接受診斷 1

已取得逐項與啟動profile證據；完整接受仍未通過，候選保持且正式版仍v169。舊PID的標準觀察仍需收束，不能以另一份absent診斷代替。見[接續證據](docs/QA-v0.170.0-ACCEPTANCE-1.md)。以下先前紀錄保持。

## v0.170.0 選句試聽候選與完整接受待驗

波形校時候選版新增「試聽這一句／停止試聽」，沿選句的原開始與結束秒數定位及播放；手動停止保留播放位置，原文字、時間、作品宣告與已建立成果保留。只由明確按鈕開始，句尾依原生事件暫停，可能超過句尾；適合校時試聽，不能當精準音訊裁切。正式版仍v169，v170完整接受尚未通過，沒有release manifest／release tag或main合併。

純cue-audition範圍模型重用cue-position／wave-position／LyricTime → 注入capture、seek、play、pause controller → 原生DOM adapter → app。寫入前後核對同份原列、來源／時長、busy／visible及實際currentTime／playing；false、無動作、錯定位、play拒絕／延遲、pause失敗或dispose拒絕成功。pending阻止重複啟動，失敗不自動retry／rollback。編修文字／時間（含無效數值）、選句、busy／離台或媒體不可用會停止自有試聽；替代音檔解除原ownership，保留替代播放器。focusin沿原selection handler之後核對。只有兩固定GET JS資產；没有timer、draft欄位、POST、Agent操作、依賴、產品網路或權限擴張。

新增21JS，修正後集中69JS（試聽／定位／標記／速度／版本）、157syntax與四Skills通過；1069份工作來源集中測試前後SHA一致。首批原兩worker／120秒Python完整823（1既有Windows symlink skip、0expected failures，118.25秒）通過；同份JS2013中2012通過、一項既有相鄰refresh oracle失敗。保留原測試，把新refresh移到原兩個call之後；修正後包含該原整合oracle的集中69通過，但不能代替全套接受。

後續Python3.10及本機已安裝3.12的兩份原launcher都達120秒期限；修正後完整151JS檔的兩file workers重驗也達原60秒，只印出751項前段輸出，沒有完整summary或成功收據。原實際worker start、原handle EOF及terminal保留，不補造缺少的count／身份。未增加期限、刪除case、更換provider、改discovery／排程或產品依賴；尚不能判定完整逾時根因。Python3.12一次性來源清理先因WinError32拒絕，後續核對原精確路徑為自有空目錄後只rmdir該目錄成功，沒有recursive清理、全域PID觀察或signal；未知holder未被辨識。

Chrome原WorkbenchHandler、本輪合成四秒PCM：半速0.5–1.5秒、二倍速2.5–3.5秒明確試聽，起點各0.5／2.5，停止回讀各1.507192／3.963361，證明事件停止的非精準性。86具ID欄位、原句ID／全部原值、音檔URL／選檔值、宣告与成果JSON在各自試聽前後保持；六檔HTTP歌詞包／格式提醒0，試聽後仍可下載。手動停止、選單與焦點换句、無效結束欄編修（空白保留）、離台／回台可用均已核對。另選合成檔確認新URL與原句保留；操作延遲使片段先到句尾，不能冒充active clip期間換檔證明，該ownership規則由注入測試覆蓋。首次同檔重選無change与一筆輸入逾時原觀察保留。

390×844時document client／scroll width皆375、試聽群組309px，無水平溢出；console0、viewport reset、一個自有tab關閉，自有server原handle EOF0／thread joined。截圖只存忽略QA。read-only DOM未提供native media property或File身份；原adapter狀態、波形ARIA与成果分層核對，不宣稱獨立property／File身份、實聽、保存下載、完整視覺／screen reader或Host接受。

原v169 ZIP3224266bytes／SHA6acc1e26ba4c9c346e732a9545d29d9d9f0229b2436bc447818d425767664117的CRC、1066raw Git blobs与ledger本輪唯讀核對；沒有本輪原ZIP完整restore測試。528四scope歷史ZIP／manifest逐bytes一致。候選產品170／明確38–170共133，unknown171拒絕；全部舊版、256清單／8192bytes保持。六法律／平台、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg和既有public保持。四投稿仍submitted_unverified，本輪不讀寫平台或重送。

還原restore-v0.169.0-before-v0.170.0→b135efbb407dfd0a5b9d71a893ce6ac8f306c7c5、codex/iteration-v0.170.0保存候選差異。只交出具CRC／raw blobs核對的source checkpoint与Draft PR，不建立成功release manifest，不合併main或打v170 release tag。接續先處理完整接受；若要調整時限，須由使用者明確決定，不能沿256版本清單的同意推定。最新三已發布版169／168／167及嚴格超七天必要門檻保持，未知／partial／FAILED保留，rolling goal active。

見[試聽契約](docs/CUE-AUDITION.md)、[QA](docs/QA-v0.170.0.md)與[交接](docs/HANDOFF-v0.170.0.md)。

## v0.169.0 慢速校時與播放速度

波形校時新增原生「播放速度」選單，提供0.5／0.75／1／1.25／1.5／2倍。慢速聽句尾後仍以音檔實際秒數標記；單純選速度保留原句、宣告、播放位置及已建立成果。速度為本頁播放設定，不進draft3、歌詞JSON、CLI或Agent操作，不自動開始播放或處理音訊。

純playback-rate重用wave-position的來源核對 → 注入capture／setRate controller → literal DOM與原生playbackRate adapter → app。完整來源、busy／visible與目前速度在寫入前重查；明確false、無動作、錯回讀、來源／gate改變或dispose拒絕成功，不自動回滾原生寫入。reentrant write拒絕；自然播放進度可前進。原生ratechange等六事件同步顯示，pagehide移除自身listeners，沒有新timer或持久偏好。兩個固定GET JS資產，原POST、Agent22基本／啟庫29、29組schemas與領域wire保持。

集中55JS（新增15）與完整823Python／1992JS（150檔）、155syntax／四Skills通過。1063份工作來源前後SHA一致，一次性cache移除；Python兩worker／120秒、Node兩file workers／60秒保持。首批完整Python的一項版本範圍fixture漏同步，原failure及兩worker身份保留；修正expected38–169後重驗通過，沒有放寬assert。再跑helper被排他run收據拒絕，未建立新身份；改唯一label接續，原收據不覆寫。

Chrome用本輪合成四秒PCM選0.5／0.75／1／2倍，86具ID控制只改速度選單，原句ID與全部句欄、音檔來源、波形位置／時長與草稿提醒保持。半速在0.5秒記下開始、0.75倍在1.5秒記下結束，完整HTTP歌詞包六檔／格式提醒0／console0；建包後選速度仍可下載。修正切換工作台前刷新導致停用，實際回台可用且新增原app handler回歸。390×844佈局document width與scroll width皆375，控制343px；截圖只存忽略QA，viewport已reset、一tab已關閉、自有server原EOF0／thread joined。只讀DOM wrapper未提供native media properties，回讀由原adapter狀態與實際時間／產物交叉核對；不是獨立property或File身份證明。未實聽、保存下載、完整視覺或Host接受。

原v168 ZIP3208647bytes／SHA0a29a8511cb8659caa68562b82ffee64b9b9b02be046d4ce3fccc625e476ff9c完整CRC／1060raw Git blobs／ledger與823Python／1977JS還原通過。524四scope歷史ZIP及manifest逐bytes保持。產品169／明確38–169共132，unknown170拒絕；清單256／契約8192bytes及全部舊版保持。六法律／平台、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg與已授權public保持；四投稿仍submitted_unverified，本輪不讀寫平台或重送。

還原restore-v0.168.0-before-v0.169.0→8dd50bae5364c24f67fc38c82fce13f780847aab、codex/iteration-v0.169.0保存差異。指定source封裝、遠端asset及main以獨立成功manifest／收據為準；最新三已發布版與嚴格超七天必要門檻保持，未知／partial／FAILED保留，rolling goal active。

見[播放速度契約](docs/PLAYBACK-RATE.md)、[QA](docs/QA-v0.169.0.md)與[交接](docs/HANDOFF-v0.169.0.md)。

## v0.168.0 新增歌詞的完整毫秒候選

Chrome原版0.119秒接續三秒會顯示3.1189999999999998；合法末句9007199254740.99秒仍新增超出領域精度的9007199254743.99。純lyrics-timing新增nextCue，沿共享LyricTime驗原末句、以毫秒加3000並核對可表示秒數，再交給既有DOM新增adapter。完整候選通過後才分配ID、寫入、markDirty及聚焦。空白末句／空表仍0至3起稿，原句字串、文字與ID保持；不裁切至作品宣告，不推定實聽完成。

新增12項JS回歸，原版31項26pass／5fail，修正31pass；補齊兩既有VMfixture的MusicTiming依賴後64集中全pass。完整823Python（1既有Windows symlink skip、0expected failures）／1977JS、149JS檔、153syntax與四Skills通過。首批Python通過／JS1975pass及兩fixture失敗保留，沒有放寬assert或產品規則；修正fixture後重新核對1057份來源前後SHA及完整兩套。只在已核對的一次性副本compileall quiet2，快取與暫存移除；原Python兩worker／120秒、Node兩fileworkers／60秒保持。

Chrome實際產品handler驗0.119→3.119；超限與BOM拒絕時142原欄位／兩列ID完全保持。修正原值後接成3.119→6.119，ID仍row-19，舊欄位只原選列cues-order變更；兩舊句原值保持。完整HTTP歌詞包六檔建立、格式提醒0、emoji／連續空白原文與ID保持；完整建立沿原規則把00.000正規化0，沒有冒充該流程保留時間排版。兩自有tab已關閉，兩server原STOP／EOF0／thread joined與native terminal已驗。未選音檔／庫、未下載保存／實聽／完整視覺／Host接受。

原v167 ZIP3198695bytes／SHA5c96cf1e65d15bab85550bedc592499f335c4f69a695528b2dfbade9a24d2d45完整CRC／1056 rawGitblobs／ledger、823Python／1965JS及前後bytes還原通過；520四scope歷史ZIP與manifest原bytes一致。產品168／明確38–168共131、unknown169拒絕；清單256／固定8192bytes及全部舊版保持，Agent22基本／明確啟庫29、Agent1／draft3／template1與29schemas保持。沒有新module／asset／operation／依賴／auth／路徑／模型／產品網路。

六法律／平台、七history、四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg與已授權public保持，四投稿仍submitted_unverified，本輪不查寫或重送。還原restore-v0.167.0-before-v0.168.0→cac196a40ba92abe3c098ec12c0ea429e5129a03、codex/iteration-v0.168.0保存差異。正式source封裝、PR、遠端assets及最終audit以獨立成功manifest／收據為準；最新三正式版與嚴格超七天必要門檻、未知／partial／FAILED保留，rolling goal active。

見[新增句契約](docs/CUE-ADD-MILLISECONDS.md)、[QA](docs/QA-v0.168.0.md)與[交接](docs/HANDOFF-v0.168.0.md)。

## v0.167.0 整批校時與撤回的實際寫入接受

原校時controller只呼叫寫入器便宣布套用或撤回成功，拒絕／無動作時仍建立或清除撤回紀錄。現在純lyrics-timing捕捉同份before與實際post，核對原列數／順序／ID、目前歌詞與宣告、完整目標時間原字串，再建立或清除紀錄並宣布成功。明確false、部分寫入、例外、期間reset／cancel或來源變更均拒絕；不自動回滾或重送。失敗撤回保留仍存在的紀錄；部分寫入需人工核對並修正回原applied-after才能重試。原void寫入器與正常markDirty／invalidate相容，寫入期間阻擋重入。

新增12項JS回歸涵蓋拒絕／無動作、部分與false-after-full、原值／列／文字／宣告來源變更、前次紀錄、reset／cancel、重試與重入。原版31項20通過／11失敗，修正版31全通過。完整823Python（1既有Windows symlink skip、0expected failures）／1965JS、153語法與四Skills通過；原Python兩worker／120秒、Node兩fileworkers／60秒保持。1053份工作來源前後SHA相同，只在核對過的一次性副本compileall quiet2，暫存移除。

Chrome QA注入false寫入器重現原版假成功，並非原生瀏覽器自行拒絕。修正版拒絕套用不建虛假紀錄、拒絕撤回保留重試；恢復原void寫入器後成功逐字還原01.000／02.000／04.000／05.000。兩次拒絕全部142表單欄位保持，成功重試只有四時間欄改變，後續原文emoji／連續空白、宣告0020.000與兩原ID保持，console0。兩自有tab關閉、兩server原STOP／EOF0／thread joined及native terminal已驗。沒有選音檔或草稿庫，沒有保存下載、實聽、完整視覺／Host接受。

原v166 ZIP3187941bytes／SHAe15e83a745df6d12442f31d01fde5776a0a90b3a640950618bdfdb890ccb3b67完整CRC／1052 raw blobs／ledger、823Python／1953JS與前後來源bytes還原通過；516四scope歷史ZIP／manifest原bytes保持。初次重入fixture遞迴以原exec handle停止，限定native查詢0，缺少child身份不補造；加入fixture guard後才做有界red回歸。初次還原helper誤期待1951而實際1953全通過，wrapper失敗保留；修正QA oracle後以原來源／期限重驗並取得前後bytes收據。沒有放寬產品或期限。

產品167／明確38–167共130，未知168拒絕；依使用者選擇清單容量256、契約仍8192bytes，全部舊版本保留。22基本／明確啟庫29、Agent1／draft3／template1與29既有schemas保持，沒有新operation／asset／依賴／auth／路徑／模型／產品網路。六法律／平台、七history與四Skills原bytes保持；PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg與已授權public保持，四投稿仍submitted_unverified，本輪不查寫平台或重送。

還原restore-v0.166.0-before-v0.167.0→2d774e31048129a266839a11dea2f06624df73ed、codex/iteration-v0.167.0保存差異；指定source封裝、PR與遠端assets各依成功manifest及精確收據。最新三正式版本、嚴格超七天必要門檻、未知／partial／FAILED保留，rolling goal active。

見[寫入接受契約](docs/LYRICS-TIMING-ACCEPTANCE.md)、[QA](docs/QA-v0.167.0.md)與[交接](docs/HANDOFF-v0.167.0.md)。

## v0.166.0 備份核對的實際模組載入

Chrome與HTTP頁面解析重現：verification-focus的script缺少結束標籤，backup-verification標記成為前一段文字，模組未載入；原版保存草稿後顯示snapshot未定義與來源無效，選檔核對停用。補回唯一結束標籤；新增HTTP實際HTMLParser組裝驗證，逐份核對獨立defer script節點、空內文、唯一來源、依賴順序及實際GET。原版20項失敗1項，修正後20項通過。

依使用者明確選擇，純Python與JS版本清單容量由128改為256，固定契約仍8192bytes；目前明確38–166共129項，舊版本全保留，未知167拒絕。新增兩Python／兩JS案例覆蓋129、256、唯一257拒絕、稀疏不推測、原輸入不改、凍結隔離及8192／8193bytes獨立容量；有效256項若本身超8KiB仍拒絕。未新增operation、asset、依賴、auth、路徑或產品外網能力。

完整823 Python（1既有Windows symlink skip、0expected failures）／1953 JS、153語法與四Skills通過，原兩Python worker／120秒、Node兩file workers／60秒保持。第一批只含HTML修正821／1951亦通過；新容量變更後完整重驗。每批只在SHA逐份核對的1049檔一次性副本compileall quiet2，前後來源保持，快取與暫存移除。原v165 ZIP3178147bytes／SHAb4628a6aae053db8766ce07d789b9cb4facf852d82eaf561aeb1b23013f79a3e完整CRC／1049 raw blobs／ledger及原820／1951還原通過，512四scope歷史ZIP／manifest bytes保持。

Chrome合成保存庫的下載送出與原生File chooser：同份伺服器回應3144bytes／SHA7b4ad748a1d510ca1fba6493ad53ec071fb748caabc2b7a48bbbc5e5f9659102匹配true；同大小修改檔匹配false，另一時間匯出的CLI ZIP亦拒絕。136原表單欄位、合成庫原bytes保持，console0。QA handler只複製同份回應，不改產品或來源；不冒充Chrome下載落盤。下載事件逾時與chrome://downloads被瀏覽器政策拒絕保留，未迂迴存取。初次QA誤把不同時間匯出當同SHA，以及容量fixture實際只有7163bytes的失敗均保留；只修正QA假設與有效合成資料，沒有放寬產品規則。

六法律／平台、七history、四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg與已授權public保持。唯讀確認Zoe音樂公會長及四公開投稿，逐份作者欄仍自行聲明未核實；未重送或修改。還原restore-v0.165.0-before-v0.166.0→4bc9ba68baf5ebf63549c48f71901cc219bdff88，分支codex/iteration-v0.166.0；指定source封裝／PR／遠端assets與最終audit各依精確收據。沒有成功manifest不當發布；最新三正式版與嚴格超七天清理門檻保持，未知／partial／FAILED保留，rolling goal active。

見[頁面組裝契約](docs/WORKBENCH-SCRIPTS.md)、[版本容量](docs/DELIVERY-VERSIONS.md)、[QA](docs/QA-v0.166.0.md)與[交接](docs/HANDOFF-v0.166.0.md)。

## v0.165.0 新增鏡頭的原值分類

實際Chrome重現最後一鏡結束欄只有BOM時錯誤新增0–6秒，只有NEL時卻拒絕；Node實際app handler亦重現C0空白誤拒絕。入口現在沿既有planning-values.trim分類，再沿同一nonnegativeNumber取有限非負十進位時間。原時間字串不修剪；最後一鏡留白與空清單保持既有0秒起草，仍需人工完成與檢查整份時間。沒有新module、operation、asset、依賴、權限或產品網路。

四項新增實際handler回歸先在原版14項中失敗3項，修正後通過。涵蓋BOM／零寬／非法十進位／負值下溢拒絕、Python欄位空白、合法數字、修正重試與空清單；拒絕不改來源、IDs、刪除紀錄、成果、媒體、dirty或focus。新增保留原列、展開狀態、人物原文與其他集合，只建立一份新列及指定焦點。

完整820 Python（1既有Windows symlink skip、0expected failures）／1951 JS（新增4）、153 JS語法與四Skills通過。首次直接完整Python達原120秒期限，原EOF1與兩worker身份／native terminal保留；相同1046份工作來源以SHA逐份核對，一次性副本compileall quiet2後仍用原兩worker／120秒及Node兩file workers／60秒完整通過，前後原bytes保持且暫存移除。只屬本次接受，不推定速度保證或全部逾時根因。

原v164 exact-source ZIP3169348bytes／SHAb75d7f905c7856d49b6bcd0199402852ca5028565373def42e0ac7676b1884b0完整CRC／1046 raw Git blobs／ledger及原820 Python／1947 JS隔離還原通過。508四scope歷史ZIP／manifest精確bytes保持；29既有schemas、22基本／明確啟庫29工具、Agent1／draft3／template1保持。產品165／明確policy38–165共128、unknown166拒絕，原128項容量沒有增加；後續版本策略需另行審閱。

Chrome正式工作台以本輪合成文字驗證：BOM-only拒絕及全部DOM原值保持；修正成NEL包住24.25後新增24.25–30.25；NEL-only／C0-only保持既有0–6起草；負值下溢拒絕。原列每鏡12欄及123其他欄位核對，只在成功時選列移至新增鏡頭，總長24及原四鏡時間／文字／IDs／展開保持，console0。兩個自有tab關閉、兩個自有server原STOP／EOF0及native terminal／thread joined核對。未選音檔、保存下載、完整視覺／screen reader、實聽或Host接受。

六法律／平台檔、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg與已授權public保持；四既有投稿仍submitted_unverified，本輪不查寫平台或重送。restore-v0.164.0-before-v0.165.0→bcda5e9bdeeb2dc424d244edbe035a791747d848、codex/iteration-v0.165.0與指定提交封裝／PR／遠端asset核對各依精確收據；沒有成功manifest不能當發布。開始盤點原107份run均terminal；最終outputs／原job audit、嚴格超七天與最新三正式版保護保持，未知／partial／FAILED保留。rolling goal active。

見[新增時間契約](docs/SHOT-ADD-VALUES.md)、[QA](docs/QA-v0.165.0.md)與[交接](docs/HANDOFF-v0.165.0.md)。目前入口只維護操作流程，歷史snapshot保持。

## v0.164.0 指定程序盤點與完整驗收

指定 --runs-only 只查 1–32 份明確 run1；純來源／同份有界 bytes 與 SHA／原 native-CIM／CLI 分層，全部來源先驗證再觀察 PID。一般 audit／prune／restore、最新三封裝、嚴格超七天與 128 份恢復上限保持。39 份前輪紀錄兩批 3.047 秒全部 terminal；這是該批觀察，不推定全機速度或 RAM。

共用 digests 延後載入原標準摘要建構子；十八個應用 module 的實際 hashlib 物件、參數、provider 拒絕與串流保持。全新程序阻止 provider 匯入仍可列原 22 operation／protocol1；沒有替代 provider、全域 patch 或新增依賴／Agent／HTTP 權限。

修正隔離測試副本漏帶 digests 的 ImportError。失敗診斷核對最多 4096 bytes 的完整 startup，再保留兩個原 handle EOF，缺少登記不補造身分。Windows junction 安全測試使用限定自有暫存的原生 fixture；指定提交封裝的 Node 明確兩個 file workers。成功 summary1、完整唯一 coverage、Python 兩 worker／120 秒與 Node 60 秒期限保持。

此前完整測試與 v163 還原曾達原期限，失敗與 source checkpoint 全數保留。接續冷 hashlib 樣本載入約 3ms，原先兩個 CLI profile 的 1.35／1.17 秒只屬當時樣本；沒有確認所有逾時根因或速度保證。首次接續完整 Python 在時限內報兩個過時的版本測試 fixture：oracle 仍停在163，拒絕清單誤把164當未知。改為明確38–164與unknown165，七項集中通過，產品拒絕規則不變。

完整820 Python（新增19、1既有Windows symlink skip、0 expected failures；95.282秒）／1947 JS（147檔、兩file workers；25.922秒）、153 JS語法／四Skills與10 producer集中通過。1046份當時工作來源前後SHA一致。原v163 ZIP完整CRC／1036 raw blobs／ledger、原801 Python／1947 JS隔離還原通過，編譯快取只在一次性副本且1036來源bytes保持，暫存已移除。504四scope歷史ZIP／manifest bytes保持；29 schemas及整份／原列comparison原收據保留。原時限已通過，不需要放寬600／180秒。

產品164／唯一policy38–164共127，unknown165拒絕；22基本／29啟庫、Agent1／draft3／template1保持。六法律／發起／平台紀錄、七history與四Skills原bytes保持；PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg及已授權public保持。依使用者已登入指示唯讀確認Zoe音樂公會長，四既有公開投稿逐份仍自行聲明未核實／NOASSERTION，沒有重送或修改。

restore-v0.163.0-before-v0.164.0→7222fd47ebd0faf7d6891fec8da1d3e4ac1b3910；接續還原點restore-v0.164.0-review-before-acceptance-4→1a2345faa89ddf5c3465cda42ae185993ac44ee9。codex/iteration-v0.164.0與PR #163保留可逆差異。正式發佈必須另對確切source commit完成packager，再核對main／tag／遠端asset bytes；工作區完整測試不代替該接受。實際提交／ZIP SHA與發佈狀態依本輪manifest及outputs/v164-qa/acceptance-4收據，不把舊source checkpoint當release。

每輪唯讀outputs／指定程序盤點，只有完整CRC／Git重建且嚴格超七天的合格封裝才可清理；最新三版與未知／partial／checkpoint保留。接續preflight超七天檔案0，沒有刪除；正式發佈後另核對最後程序EOF與年齡。沒有本輪產品UI、保存下載、實聽、Host或平台創始接受；rolling goal active。

見[指定程序](docs/RUN-AUDIT.md)、[摘要載入](docs/DIGEST-LOADING.md)、[失敗證據](docs/PYTHON-TEST-FAILURE.md)、[QA](docs/QA-v0.164.0.md)與[交接](docs/HANDOFF-v0.164.0.md)。

## v0.163.0 分鏡撤回接受與隔離封裝準備

原controller在撤回寫入器回false或沒有改回總長時仍清除紀錄、顯示已撤回。現在純storyboard-duration保留pending紀錄，寫入後核對同份來源、紀錄身份與原宣告字串，確認全部還原後才清除紀錄及發布同一已核對快照。明確false、無動作、錯原值、來源變更、例外或期間clear拒絕成功；失敗不自動回滾或重試。紀錄保持時，只有原時間來源與實際adopt-after仍一致才可再撤回；來源或部分寫入需先人工核對修正。void原生setter相容，後續創作文字與其他工作台／媒體沿原限定apply保持。

801Python（1新增、1既有Windows symlink skip、0expected failures；原兩worker／120秒）、1947JS（8新增）、153syntax與四Skills通過；集中7Python／51JS。新增controller與實際app handler測試涵蓋拒絕／無動作、安全重試、逐字恢復、FPS／ID／時間／順序／數量變更、例外／損壞快照、同一post來源、clear不復活及false後部分寫入。原v162 ZIP兩次原兩worker／120秒還原達期限，兩份失敗與已印出的原身份保留；集中7Python／1939JS另有收據，不取代全套接受。後續先在一次性來源目錄compileall quiet2，再核對1033個原檔bytes，未修改原來源／launcher／期限；此輪完整800Python／1939JS通過，CRC／ledger及所有暫存移除已驗。這是本次接受，不宣稱快取保證未來速度。500四scope歷史ZIP／manifest、29 input/output schemas與整份／原列comparison bytes保持。

Chrome QA注入拒絕寫入器重現舊版總長仍12卻顯示成功且清除紀錄，新版顯示拒絕並保留撤回；不是宣稱原生Chrome實際拒絕。正式工作台用本輪合成四秒PCM，明確採用24秒、FPS改變停用撤回、修正後逐字還原NEL及空白包住的60.00；後續畫面emoji及連續空白保持。首tab在非同步成果完成前關閉，該次五檔接受未完成；第二tab重新完成完整流程，等五檔清單出現後才核對。85具ID欄位僅成果選單／預覽變更，48分鏡欄位僅明確畫面編修改變；四鏡原時間、其他工作台、音檔URL及選檔值保持。完整五檔分鏡包、下載按鈕可用與console0已驗，未執行下載／驗證保存檔。兩QA自有tab關閉，server原PTY STOP／EOF0及thread joined；native File身份、完整視覺／實聽／Host／創始身分未驗。

產品163／唯一policy38–163共126、unknown164拒絕；Agent1／draft3、22基本／明確啟庫29、template1及領域schemas保持。沒有新operation／asset／依賴／auth／路徑／模型／產品網路。六法律／發起／平台紀錄、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg及已授權public保持。因使用者告知已登入，唯讀確認Zoe／音樂公會長、public Repo及四既有公開投稿；平台仍自行聲明、尚未核實作者身分，未修改或重送。額外唯讀查驗tab已關閉。restore-v0.162.0-before-v0.163.0、codex/iteration-v0.163.0及封裝／PR／遠端／最終audit依收據。

首份指定提交8958babb252f70c3a45a29964d89607b6d0c0d4a封裝同樣達原120秒期限；ZIP／FAILED、原exec EOF1及已印worker0身份保留，沒有成功manifest。release filesystem adapter現在只在已驗ZIP／原Git來源派生的一次性checkout準備Python位元碼快取，quiet2失敗拒絕建立；快取不進原ZIP／manifest／Git，目錄隨原TemporaryDirectory移除。未改source檔、test_schedule、discovery、兩worker／120秒或Agent權限。調整後工作區完整801Python／1947JS、153syntax／四Skills通過；指定新提交仍由精確封裝驗證接受。

舊合成packaging fixture的.py說明改為合法註解，原無效summary拒絕測試保持；新增真實Git來源語法錯誤在runner前拒絕、保留原ZIP／FAILED、不發manifest的測試。該10Python集中驗證與修正後完整801Python／1947JS通過，最初fixture失敗保留。

## v0.162.0 分鏡總長的原值分類

重現總長面板使用JavaScript trim、時間診斷使用Python欄位空白規則的差異：BOM-only顯示尚未宣告卻是invalid_number，NEL／C0 separator-only顯示無效卻是missing_clock。純storyboard-duration現在一次沿共用planning-values.trim判斷空白，再由既有有限數字與時間／影格規則建立候選。只改分類與宣告文字，不修剪或改寫原值；無可用鏡尾仍不可採用，原值／FPS／列來源的offer與undo保護保持。

800Python（1既有Windows symlink skip、0expected failures；原兩worker／120秒）、1939JS（4新增）、153syntax與四Skills通過；集中7Python／43JS。新增測試將同批空白、BOM、不可見字元與數字原值的完整時間報告逐份核對Python application，涵蓋無候選、明確採用／原字串撤回及未重新核對的原值變更。原v161 ZIP完整800Python／1935JS與1030 Git raw blobs隔離還原通過，CRC／ledger及原來源／期限保持，暫存移除。496四scope歷史ZIP／manifest bytes、29input/output schemas與整份／原列comparison bytes保持。

Chrome正式工作台選本輪合成四秒PCM，於母題分鏡分別輸入BOM／NEL／C0 separator，提示與時間待辦一致；明確採用24秒與撤回均保留原字串。採用後編寫的畫面emoji及連續空白保持，85具ID原欄位僅成果選單／預覽改變，48分鏡欄位僅該明確畫面編修改變；四鏡原時間、其他工作台、音檔URL與選檔值保持。完整五檔分鏡包建立、下載按鈕可用、console0；未下載或驗證保存檔。自有tab關閉，自有server原PTY STOP後EOF0／thread joined；DOM wrapper未提供native File物件身份，不冒充該證明、完整視覺、實聽、Host或平台創始接受。

產品162／唯一policy38–162共125、unknown163拒絕；Agent1／draft3、22基本／明確啟庫29、template1及領域schemas保持。沒有新operation／asset／依賴／auth／路徑／模型／產品網路。六法律／發起／平台紀錄、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg及已授權public保持。四既有投稿尚未核實，本輪不修改或重送。restore-v0.161.0-before-v0.162.0、codex/iteration-v0.162.0及精確封裝／PR／remote／最終audit依收據。

## v0.161.0 波形定位的實際回讀

原波形controller呼叫寫入器後直接回報成功；寫入器回false或未移動位置仍會触發onSeek及鍵盤攔截。現在純wave-position先核對來源與時長，寫入後回讀同一原生音檔的可用狀態及實際位置，明確false或超過1ms候選差異拒絕成功。void原生setter仍相容，成功view直接使用核對過的快照，沒有第二次讀取與舊候選混用；失敗刷新目前view，不撤回或重試原生寫入。dispose期間不再寫入或回報成功。

800Python（1既有Windows symlink skip、0expected failures；原兩worker／120秒）、1935JS（9新增）、153syntax與四Skills通過；集中7Python／50JS。原v160 ZIP完整800Python／1926JS及1027 Git raw blobs、原v158 ZIP完整797Python／1911JS及1019 blobs都隔離還原通過，CRC／ledger核對、原來源／兩worker／120秒保持，暫存移除。v158之前的期限失敗紀錄保留；本輪完成此前未完成的原來源接受。492四scope歷史ZIP／manifest bytes、29input/output schemas及整份／原列comparison bytes保持。

Chrome首個自有tab先用QA注入拒絕／無動作寫入器重現restore tag舊版假成功，再核對新版拒絕；這不是聲稱原生瀏覽器實際拒絕。正式工作台用本輪合成四秒PCM，方向鍵0.5／Shift0.55／Home0／End4／滑鼠1.998／句首0，18欄、兩原列含空白emoji、宣告及音檔URL／選檔值保持。前往目前句子到原文字欄；完整歌詞包六檔建立、格式提醒0、console0。原input.files未由DOM唯讀wrapper提供，只核對選檔值及URL，不冒充File身份證明。補強dispose防護後以第二個自有tab重驗兩種拒絕及正式定位、18欄原列保持和六檔完整包；兩自有tab關閉，兩server按原PTY STOP後EOF0、thread joined；未下載或驗證保存檔、實聽、full visual／screen reader、Host或平台創始接受。

產品161／唯一policy38–161共124、unknown162拒絕；Agent1／draft3、22基本／明確啟庫29、template1及domain schemas保持。沒有新operation／asset／依賴／auth／路徑／模型／產品網路。六法律／發起／平台紀錄、七history及四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg及已授權public保持。四既有投稿尚未核實，本輪不修改或重送。restore-v0.160.0-before-v0.161.0、codex/iteration-v0.161.0、精確封裝／PR／remote及最終audit依收據。

## v0.160.0 校時撤回的負時間來源核對

整批提前一秒後，句首為0；後續編修成-1e-999，原領域會拒絕負時間，但撤回只比較轉換數值而接受負零，覆蓋原編修。純lyrics-timing的sameTimes先沿共用LyricTime.normalize(nonnegative=true)驗目前時間，再沿number比較原數值；不是用毫秒捨入值判定相同。無效／後續數值不同拒絕整份撤回，保留編修與原undo供修正重試。真零、合法正值下溢與等值排版保持；文字、列順序、宣告及音檔仍由原限定applyTimes保留。

800Python（1既有Windows symlink skip、0expected failures；兩worker與原120秒）、1926JS（4新增）、153syntax與四Skills通過；集中7Python／36JS。上一版v159 ZIP／SHA／CRC與1024個Git raw blobs核對，原來源隔離完整800Python／1922JS還原通過，未修改排程或期限，暫存移除。488四scope歷史ZIP／manifest bytes與29既有schemas、整份／原列comparison成果保持。v158較早完整還原期限問題仍保留於舊交接，v159的成功不能取代其原來源證據。

Chrome使用一份本輪合成四秒PCM，實際讀取歌詞→預覽／明確套用→負值下溢編修／撤回拒絕→0.0001仍拒絕→修正成-0e-999後重試成功→重建完整歌詞包。原時間／後續原文emoji／宣告及同一音檔保持，拒絕時保留兩列與撤回，成功後停用已用撤回，console0；一個自有tab關閉，自有server原handleEOF0／thread joined。第一個QA server因stdin pipe EOF正常關閉，另用明確PTY原handle接續，無未確認程序或產品server改動。未驗證實聽、保存下載、full visual／screen reader、Host或平台創始接受。

產品160／唯一policy38–160共123、unknown161拒絕；Agent1／draft3、22基本／明確啟庫29、template1及domain schemas保持。沒有新operation／依賴／權限／auth／模型／產品網路。六法律／發起／平台紀錄、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg、public授权不變；平台四既有投稿仍submitted_unverified，本輪不讀寫或重送。restore-v0.159.0-before-v0.160.0與codex/iteration-v0.160.0保留，封裝／PR／remote及最終audit依精確收據。

## v0.159.0 歌詞時間 Unicode 原值保留

重現瀏覽器把時間欄 U+FEFF（BOM）當空白／有效數字：BOM 包住1.5被接受，BOM-only宣告在四秒metadata後被自動改為4.000，Python同來源拒絕。純lyric-time將Python str.strip欄位空白與float數值空白分開，ASCII十進位文法保持；U+0085等合法數值空白可轉換，BOM／零寬／包住數字的C0 separators拒絕。不修剪原值；LRC／SRT文件開頭既有BOM解析不改。

共用trim／number → 媒體時長與整批校時純controller → 歌詞request／完整包Apply／cue stamp → 工作台及固定獨立preview。來源空白接續、明確採用／撤回、current／late與原值／revision防護保持；排序及payload不使用未驗證Number，NEL不變NaN；撤回拒絕BOM後編修且保留重試紀錄。Python／application／CLI／HTTP／Agent／MCP原接受規則不變，無新增operation／asset／依賴／auth／路徑／模型／產品網路。

800Python（3新增、1既有Windows symlink skip、0expected failures；原兩worker／120秒，實測119.609秒）、1922JS（11新增）、153syntax與四Skills通過；集中3Python／109JS。首次Python集中命令使用不可匯入的tests namespace，改標準discover後通過；首次完整JS一項fixture將0.159寫為未知版本，而本版已合法，改固定unknown值後1922全數通過，產品拒絕規則不變。初次失敗logs保留；Python完整成功未因只改JS測試fixture而重跑，指定封裝仍另做完整驗證。

484四scope歷史ZIP／manifest精確bytes與29既有input/output schemas、整份／原列comparison bytes保持。歷史比較helper第一份误將上一版release路徑替換為159，唯讀FileNotFound並保留；只修正helper來源路徑，484比對通過。原v158 ZIP3086957bytes／SHA4fecc8a1b3fa109631ea05c6647a221c7e806b2cd23e97dfbcd19097ab28232d CRC與1019完整Git raw blobs／ledger核對；不改原來源，隔離還原歌詞時間／媒體交接／preview三module共24Python及98JS通過，暫存移除。原兩worker完整launcher兩次碰到不變120秒期限，各parentEOF1與實際worker1身份保留，未印出的worker0不補造；集中還原不是原launcher全套797接受，全套期限問題列為未完成交接。首次集中helper job label帶period被既有驗證拒絕，尚未執行測試或印身份；改有效短label後通過，原log保留。

Chrome工作台及獨立預覽：兩次真File chooser選本輪合成四秒PCM；BOM宣告metadata後保持，採用4.000／撤回原BOM，無效Read／Build保留表格及上一份JSON且停下載；BOM尾句新增拒絕、兩原句保持。NEL宣告及原時間檢查／明確Apply／完整包重試成功；獨立預覽1.2345→1.235、原空白與emoji歌詞保持、metadata四秒一致，console0。第一次read-only DOM觀察誤用player ID，核對實際DOM後接續；pending觀察與完成結果分開，不冒充成功。兩tab已關閉、自有server原handleEOF0／thread joined。沒有viewport override／截圖／full visual／screen-reader／保存下載／實聽接受；独立number input限制與共享domain來源驗證分開。

產品159／唯一policy38–159共122、unknown160拒絕；Agent1／draft3／22基本與29啟庫及preview template1／domain schemas保持。六法律／發起／平台原檔bytes、PolyForm Noncommercial禁止商用／public、ZOE. G／djguan-jpg保持；本輪不讀寫FreeTWAI，四既有投稿仍submitted_unverified，未重送或宣稱創始核實。開始audit一筆旧PID暫unavailable，指定同PID補查確認absent，其餘完整45筆terminal；原audit失敗與補查保持，無程序signal。

restore-v0.158.0-before-v0.159.0→a9cab7d0dbd6028da89425075e3e13414ca6d117、codex/iteration-v0.159.0、CHANGELOG／HANDOFF、指定提交封裝／SHA、PR與遠端原bytes／blob及最終程序audit保持。入口只維護目前workflow，七history與四Skills不改；詳細規則見[歌詞時間契約](docs/LYRICS-WHITESPACE.md)。rolling goal維持active，封裝／remote與最終盤點以本輪精確收據為準。

首份指定來源158175b17b64cef70328166fee69460c4bc50285封裝觸及原120秒期限，ZIP與FAILED保留，沒有成功manifest或發布。隔離副本的800案例逐方法診斷EOF0／117.75秒，兩組方法104.606／114.407秒；診斷不替代正式接受。純test_schedule依同一份實測更新141項至少0.5秒的方法成本，其餘方法使用56單位平均fallback；算法、完整唯一IDs、相對discovery順序、兩worker／120秒與summary1保持，不增限／不刪除或重複case。按該次資料推算109.591／109.422秒只是分配依據，不是速度保證。24項既有排程／summary集中驗證與調整後完整800Python（分組396／404、109.36秒、1既有skip、0expected failures）通過，原worker身份／EOF核對；指定提交封裝仍另做原完整測試。


## v0.158.0 Git 來源串流與自有程序收束

實際合成Git tree重現1908來源檔／2257835bytes：舊producer以capture_output完整接收，才由2MiB純source_tree拒絕；沒有ZIP、測試子程序或成功manifest。原metadata bytes／SHA83201c237bf47fddbb2004074bd1f9249ea702050724a9aaed3e9efaef132dc5與暫存移除證據留在忽略outputs。

純release_capture固定40hex commit／兩種tree參數與有限buffer → release_git_fs兩pipe reader／原Popen handle／60秒deadline及5秒cleanup → producer與maintenance source／restore。stdout2MiB、stderr4096bytes各最多保留limit+1 sentinel，單次read65536；超限不截斷冒充完整結果，不傳入domain／Git archive／成功manifest。固定long／name-only讀取共用adapter；legacy原語義／manifest1、modern raw profile與manifest2／journal1及完整blob／CRC／ledger保持。非零／管線錯誤不回傳原文或stderr私人路徑；逾時與拒絕只kill／wait這次自行啟動的child，關閉自身pipe並join兩reader，不能確認cleanup即拒絕。無全域程序列舉／PID signal／環境讀取／持久job，不宣稱全機或產品RAM上限、所有Git呼叫capture上限或外部讀取原子快照。

新增12項集中驗證：真實Git long／name-only原bytes及未提交編修隔離、超限producer先於domain及archive拒絕、純limit／sentinel／未知參數、兩pipe／非零／逾時／I/O錯誤與原handle及reader結束。第一批測試追蹤器漏read()預設size，錯誤攔截了正常subprocess.communicate；修正測試介面後十二項通過，原失敗log／terminal收據保留，該失敗未改產品adapter。797Python（新增20、1既有Windows symlink skip、0expected failures）、1911JS、153syntax及四Skills通過。480四scope歷史文字ZIP／manifest與29input/output schemas、整份／原列comparison bytes不變。原v157 ZIP3056919bytes／SHAa4f58c00b4363ee13487293245b1ef0ea0b6d07a8bc3016bd8097f038f103fee以原120秒launcher還原777Python／1911JS，CRC通過，暫存移除。

還原首批觸及原120秒deadline，原parent回傳1；原failed worker1的PID／creation identity從實際輸出保留，未印出的worker0 identity不補造。第二次以同一原launcher的report-json選項驗證777／1911，取得兩worker的原start身份與EOF0；來源／deadline／兩worker上限未改，原失敗與重試收據保留。

產品158／唯一policy38–158共121、unknown159拒絕；Agent1／draft3／22基本與29啟庫及domain wire不變，無新增依賴／產品網路／auth／模型／JSON路徑或通用命令能力。六法律／發起／平台原檔bytes、PolyForm Noncommercial禁止商用／public與ZOE. G／djguan-jpg保持；登入後唯讀確認Zoe音樂公會長與四公開投稿，逐份展開作者欄均仍自行聲明未核實／NOASSERTION，說明保留禁止商用；不重送或修改。無browser UI程式變更，一個自有查看tab已關閉，使用者分頁保持；無server或媒體／Host／保存檔案接受。

restore-v0.157.0-before-v0.158.0→f2bf14598ed28344dff8d867ecfb07636d2ecedf、codex/iteration-v0.158.0、CHANGELOG／HANDOFF、指定提交封裝／SHA、PR／遠端原bytes與最終程序audit保持。入口只更新目前workflow，七history及四Skills不改。詳見[Git讀取契約](docs/RELEASE-GIT-CAPTURE.md)。goal維持active。


首份來源552e8e3d57791d39273fac323f3b1de90b5e0673與方法平均版7ae22fa82882c07d3eeb91fcaa46083c22ffdd4c，兩次封裝均由worker1觸及原120秒期限，parent各EOF1；兩份ZIP／FAILED／實際輸出保持，沒有成功manifest或發布。兩次各保留實際worker1自我登記身份，未印出的worker0身份不補造；最初789與平均版795直接完整通過的收據也保持。

在第二份指定來源的隔離副本注入逐方法計時，完整795案例的兩組方法實測94.641／114.827秒，整體117.984秒EOF0，副本刪除；計時只屬診斷，不能代替正式封裝接受。純test_schedule保留64項較昂貴方法的固定近似成本與其餘方法107單位fallback，驗證完整唯一ID／有限positive integer成本、依成本分配，再恢復每組原discovery相對順序。unknown／new方法仍完整執行，提示不能建立不存在的case；成本是近似毫秒，不是benchmark或速度保證。

原launcher的兩worker各自獨立discovery／完整執行 → parent再次獨立discovery／完整IDs與count及原handle EOF核對。兩worker／120秒整體期限、summary1／傳輸與來源容量保持，不略過或重複case。class fixture可以在兩隔離程序各自執行，共用HTTP fixtures用本機動態port0並teardown，filesystem fixtures用自身暫存。集中24項（8新增排程、16既有summary／真worker／deadline）通過。

正式完整797案例分組399／398，實測113.75秒，1既有skip／0expected failures，兩原worker EOF0；1911JS／153syntax／四Skills通過。標準CLI每批最多32個明確run records，完整去重清單按批terminal核對再聚合；沒有增加維護cap或全域程序權限。兩份失敗封裝使partial總數為5，保持不清理。正式指定提交封裝與remote驗證依最終收據，不把診斷計時當發布接受。

## v0.157.0 原始碼封裝容量共用檢查

以實際合成Git來源重現producer缺少ZIP目錄容量預檢：1408來源檔、5612 ZIP項目、904856bytes，仍到達故意exit97的trap測試階段；maintenance原本先拒絕4096項目外目錄。trap不是測試成功，沒有成功manifest；原ZIP與SHA f3f0bd0cb31efb33f87d101ef04b712b0f7f03d88583394287b5801f237dd2e0保留於忽略outputs。

純release_zip定義archive64MiB、central2MiB／4096項、footer65557bytes與manifest2MiB各獨立容量 → release_zip_fs有限reader／排他writer → package_release與maintenance共用。producer在ZipFile、解壓、CRC、來源逐檔與測試子程序前拒絕超限來源；manifest完整UTF8 JSON加LF先核對容量，再xb建立，原manifest不能覆寫。FAILED亦排他建立，未知診斷保留，診斷寫入失敗不掩蓋原拒絕。一般classic ZIP既有grammar、完整CRC／ledger／raw Git blob核對仍分層，不宣稱完整ZIP conformance、原子來源讀取或整體RAM上限。

12項新增測試包含實際Git5612項在ZipFile與測試子程序前拒絕、64MiB stat先拒絕、4096／實際目錄／多disk／ZIP64／損壞／comment／長name、UTF8容量含LF／非有限數字／非法Unicode與排他manifest／未知FAILED。777Python（新增12、1既有Windows symlink skip、0expected failures）、1911JS、153syntax及四Skills通過。476四scope歷史文字ZIP／manifest、29input/output schemas與整份／原列comparison bytes保持；原v156精確ZIP3040935bytes／SHA70c5ea26c0f60ed15921577b8db2b344fb95bc59a2b3d40a42c53ab7b76629ce用原120秒launcher還原765Python／1911JS，暫存移除。

產品157／唯一policy38–157共120、unknown158拒絕；release manifest2 raw profile與legacy1／journal1原bytes保持，Agent1／draft3／22基本與29啟庫及領域wire不變，無新增依賴／產品網路／auth／模型或JSON路徑能力。LICENSE／NOTICE／LICENSING／FOUNDER與兩平台紀錄六檔bytes保持；PolyForm Noncommercial／禁止商用、public、ZOE. G／djguan-jpg保持。使用者登入後唯讀核對Zoe音樂公會長與四公開投稿，逐份展開作者欄均自行聲明未核實、NOASSERTION；未重送、修改或宣稱創始身分通過。僅有一個自有查看tab已關閉，無server、browser UI程式變更或保存下載／Host／媒體接受。

restore-v0.156.0-before-v0.157.0→fb099d4ca7aa07704766aa6853fe0f5848167e40、codex/iteration-v0.157.0、CHANGELOG／HANDOFF、指定提交封装與SHA／PR／遠端asset核對維持。入口只更新目前流程，不疊加歷史，七份history與四Skills不變。詳見[容量契約](docs/RELEASE-ZIP-BUDGET.md)。goal保持active。

## v0.156.0 指定提交的原始位元組封裝

修正同一提交因core.autocrlf不同而改變封裝內容的實際問題：v155 main的1000檔全部重現。純release_archive固定profile／嚴格Git tree與blob identity → package_release filesystem producer → maintenance manifest／source核對／重建／restore。新release manifest2明確archive_profile=git-raw-blobs-v1，固定autocrlf=false／eol=lf／停用global attributes；每檔大小、原Git blob OID、完整file set及原SHA256 ledger核對後才能交出成功manifest。repo/info attributes若仍export-subst或省略來源則拒絕，不修補原文；普通LF、原CRLF與二進位皆保留。不是跨Git／壓縮器版本的完整ZIP穩定性或作者／權利證明。

manifest1／舊封裝／journal1保持原流程，不推測或遷移profile。舊重建SHA不符保留原檔；modern清除及還原沿固定profile重建、核對完整blob並保留原manifest bytes與時間。未知schema／profile、額外欄位、symlink／submodule／不安全路徑與2000檔／2MiB tree／256MiB來源容量外拒絕。没有擴大run／audit／recovery、Agent／HTTP或JSON路徑能力，不新增依賴、模型、auth或產品外網。

集中10項實際Git測試通過，包含autocrlf／eol切換、global與repo属性、Unicode／binary、完整source拒絕、legacy保留及modern prune→restore精確回復。最初一項測試只匹配Git blob錯誤措辭，實際先由Git tree大小拒絕；措辭修正後十項通過，失敗terminal紀錄保留。現場1000檔全部Git blob核對、兩種autocrlf的整份ZIP一致。765Python（新增10、1既有Windows symlink skip、0expected failures）、1911JS、153syntax／四Skills通過；472四scope歷史producer ZIP／manifest與29組input/output schemas、整份／原列comparison bytes保持。

原v155 ZIP3033163bytes／SHA9a2145820d886cee04bcd044d917a3d9069f04643d0561df39c0576cfd64e6e8以原launcher／120秒deadline還原755Python／1911JS，CRC通過且暫存移除。產品156／唯一policy38–156共119，unknown157拒絕；22／29、Agent1／draft3與交付schemas保持。六法律／平台原bytes、PolyForm Noncommercial／public、ZOE. G／djguan-jpg保持，本輪不讀寫FreeTWAI，既有四submitted_unverified不重送。restore-v0.155.0-before-v0.156.0→34089c98264e2f5cfd7d39b186809f81a39a610d，codex/iteration-v0.156.0、逐輪封裝／PR／遠端hash及goal active保持。

見[原始碼封裝契約](docs/RELEASE-ARCHIVE.md)。目前入口只維護workflow，七份歷史snapshot不修改。本輪無browser UI／server或Host／媒體／保存下載／full visual接受，只有來源封裝與維護驗證。

# 進度：目前 v0.155.0

## v0.155.0 目前入口與歷史分層

README、Agent與架構指引、四Skill先提供目前可用流程，不再把歷史QA摘要排在操作之前。新增START-HERE連接四工作台、CLI範例、保存與結果解讀；Agent區分JSON-lines／MCP handshake／payload、22基本與明確啟庫29操作、來源選擇和能力邊界。七份入口由982110bytes減為25953bytes，全部舊文由v154 main的exact Git blob複製到同目錄HISTORY檔，原bytes／相對連結基準與四Skill frontmatter保持。資料沒有刪除，縮小的是入口讀取量，不是磁碟容量或RAM量測。

四CLI範例實際執行產生成果，重複輸出回傳1且原成果bytes不變。Agent discovery22／範例untimed原文、MCP2025-11-25 initialize→initialized→tools/list→tools/call與structured/text一致、四domain Agent成功及合成PCM原bytes保留。第一次QA腳本在拒絕覆寫後誤限錯誤措辭，保留terminal失敗與五child records；後續只接續拒覆寫／Agent／MCP核對，不重跑或替換原四成果。各CLI/stdio工作EOF；不是Host安裝、模型、媒體創作或保存下載接受。

755Python（1既有Windows symlink skip、0expected failures）、1911JS、153syntax與四Skills通過；468四scope歷史ZIP／manifest及29組operation input/output schemas與整份／原列comparison bytes保持。原v154 exact-source ZIP3000508bytes／SHA153a6387005a8f3eee7ea479cee43e2aa8fd7b7bf608e2288bcd994469c9ece8，以原launcher／120秒deadline順序還原755／1911，CRC通過且暫存移除。

產品155／唯一policy38–155共118、unknown156拒絕；22／29、Agent1／draft3／舊schemas保持，backend／browser implementation及asset／operation／依賴／模型／auth／路徑／外網權限沒有擴張。六法律／平台原bytes、PolyForm Noncommercial／public、ZOE. G／djguan-jpg與四submitted_unverified紀錄保持，本輪不讀寫FreeTWAI。restore-v0.154.0-before-v0.155.0→73b25274dcae919f5d363cbb57702e0555e7140c；codex/iteration-v0.155.0，exact-source封裝与rolling goal active。

見[契約](docs/DOC-ENTRYPOINTS.md)。README／START-HERE／Agent／架構與四Skill只維護目前工作流程；後续輪次將QA與迭代摘要寫在CHANGELOG／HANDOFF／QA或專項契約，不再疊加入口。歷史snapshot不修改；AGENTS既有施工與領域規則保持。

## v0.154.0 完整原文差異閱讀

成果、專案草稿與接受條件核對不一致時，可明確按「閱讀差異位置」，從目前完整原文取最多16 KiB的UTF-8片段，整字標示第一個差異對應字元；提供開頭、下一段、返回已讀上一段、返回差異及關閉。差異在原文結尾明示EOF；控制字元呈現跳脫文字，來源不改寫。純text-verification-page重用text-download驗證與delivery-text有界byte range → 原注入controller及512位置history → literal DOM、manual focus與有界局部捲動。原七欄report／callback、選定File單次讀取及39byte雙側前後文保持。完整原文只在明確操作期間暫時編碼，finally釋放，不新增選定檔案全文cache或自動保存。

755 Python（1既有Windows symlink skip、0expected failures）、1911 JS（新增19）、153syntax、四Skills與集中168通過。464歷史四scope ZIP／manifest逐bytes及29組Agent input/output schemas、整份／原列比較保持；原v153 exact-source ZIP 2976852bytes／SHA 6056d9dd696f04465d5430ee9567937fe234d72b7fb374cb77409007a90d18e8，以原launcher／120秒deadline順序還原755Python／1892JS，CRC通过且暫存移除。

原生Chrome9次實際File選取（before1／after8），第40018byte同大小emoji差異、三入口讀取與匹配清除、開頭／前後段／返回／關閉、Enter焦點、EOF、revision失效及取消晚回覆通過；翻頁不再讀選定File，8/8 reads、gates0、後續編修保留。正式三入口／asset一次／unique IDs與literal DOM及computed pre-wrap／anywhere／局部捲動核對，console0。兩自有server原handle正常EOF0、兩頁關閉；不宣稱已保存下載、真慢磁碟、完整視覺或screen reader接受。

產品154／唯一policy38–154共117、未知155拒絕；22基本／29啟庫、Agent1／draft3與舊schemas保持。一固定GET，無新operation／POST／依賴／auth／路徑／模型／產品外網能力。六法律／平台原bytes、PolyForm Noncommercial、public及ZOE. G／djguan-jpg保持；本輪唯讀確認Zoe與四公開投稿，仍自行聲明、尚未核實創始，不重送。restore-v0.153.0-before-v0.154.0 →9d95687ce4cf2c031441352ffe00d75b5812273f；codex/iteration-v0.154.0、exact-source封裝与rolling goal active保持。

見[契約](docs/TEXT-VERIFICATION-PAGE.md)。以下保留歷史迭代。

## v0.153.0 原文差異前後文

成果、專案草稿與接受條件核對失敗時，並列目前原文與選定檔案的第一個差異附近片段，顯示精確 byte 範圍、EOF、UTF-8跳脫文字與原始十六進位。純 text-byte-context共用完整bytes比較與有界視窗 → 原text-verification新增internal opt-in inspectWithContext → 注入current controller只保留隔離有界DTO → literal DOM與三個可選區塊。原七欄report1／callback保持，完整來源只編碼／複製／掃描一次；片段不是完整檔案或保存證明。每側16bytes，UTF-8邊界最多延伸3bytes，各最多39bytes；無效UTF-8不修補，BOM／換行／NUL／HTML／不可見字元以明示原值與hex辨認。備份仍沿SHA-only proof，不臆造原ZIP內容。

755 Python（1既有Windows symlink skip、0expected failures）、1892 JS（新增23）、152syntax／四Skills、集中148JS通過。460歷史ZIP／manifest與29組input/output schemas、原整份／原列比较保持；原v152 exact-source ZIP 2954468bytes／SHA b0c22af54f9ed3acea5b738b9789cca92f638b17b2b150a90df01133eabbfd5a，以原launcher／120秒deadline順序還原755 Python／1869 JS，提取暫存移除。

原生Chrome共13次File選取（before1／after12），三入口同大小emoji差異、無效UTF-8、空檔EOF、匹配重試、取消、來源revision改變與QA注入read錯誤均核對；12/12 reads、gates0、後續編修保留。正式三區塊／固定asset一次及pre-wrap／anywhere、console0核對；未驗證真慢磁碟／I/O失敗、已保存下載、窄尺寸完整視覺或screen reader。兩自有server原handle正常EOF0、兩測試頁關閉；未設viewport／未嵌入媒體。

產品153／唯一policy38–153共116、未知154拒絕；22基本／29啟庫、Agent1／draft3與舊schemas保持。只新增一固定GET，無新operation／POST／依賴／auth／路徑／產品外網能力。六法律／平台文件原bytes、PolyForm Noncommercial、public及ZOE. G／djguan-jpg保持。本輪唯讀確認Zoe／音樂公會長與四公開投稿頁，仍原作者自行聲明、尚未核實創始；不重送。restore tag、codex分支、exact-source封裝與rolling goal active保持。

見[契約](docs/TEXT-VERIFICATION-CONTEXT.md)。以下保留歷史迭代。

## v0.152.0 選檔核對的狀態焦點

原生 Chrome 在成果、草稿、接受條件與備份四個入口均重現：選定真 File後，核對進行中及完成時焦點落回BODY，結果本身正確。共用純 verification-focus新增明確selected動作 → 兩個注入DOM adapter在實際選檔當下、停用picker前聚焦對應status note。只接受有效來源／available／非pending，空選取與legacy可選cancel入口保持。這個動作不建立非同步焦點意圖；後續成功、差異或錯誤只更新原狀態，晚回覆不搶其他編修焦點。取消的兩slot／同來源note接續及proof callback保持。

755 Python（1既有Windows symlink skip、0expected failures）、1869 JS（新增19）、151syntax／四Skills與集中126 JS通過。456歷史ZIP／manifest逐bytes、29組input/output schemas、原整份／原列比較保持；原v151 exact-source ZIP 2935279bytes／SHA 2ddb54bdd5da74d53b646b8423ccf5269b021026ac6111629c523522b991fe03，以原launcher／120秒deadline順序還原755 Python／1850 JS，暫存移除。

原生共23次File選取（before4／after19），四入口的匹配與同大小差異、兩個QA注入read錯誤及重試、Tab離開、Shift+Tab／Enter取消、後續編修與來源變更均核對。after19/19 reads、4/4真正SHA、gates0，最終四匹配true及編修保留，console0。正式四note／aria、共享asset一次與2px green focus outline以DOM／computed style核對；不是已保存下載、真慢磁碟／I/O錯誤或完整視覺／screen reader接受。兩自有server原handle正常EOF0、兩QA頁關閉，未設viewport／未嵌入媒體。

產品152／唯一policy38–152共115、未知153拒絕；22基本／29啟庫、Agent1／draft3與原schemas保持。無新增operation／asset／backend／依賴／auth／path／產品外網權限；原32MiB備份及兩工作slot保持。六法律／平台文件原bytes、PolyForm Noncommercial、public、ZOE. G／djguan-jpg保持；本輪未讀寫FreeTWAI，既有四submitted_unverified紀錄不重送。restore tag、codex分支、exact-source封裝與rolling goal active保持。

見[契約](docs/VERIFICATION-SELECTION.md)。以下保留歷史迭代。

## v0.151.0 備份讀取與雜湊名額

修正備份核對連續取消仍累积未完成 read／hash 的可重現問題。原生 Chrome 以還原 tag 的原 adapter 重現三份未完成 SHA 與取消後 BODY 焦點；新 controller 每個核對器最多兩個未完成的完整 read→hash 工作，取消／來源改變不提早釋放，只有該工作 finally 才歸還名額。滿額不啟動第三份、不取代目前 proof；舊完成只刷新目前有限 view，不提交舊 report／error。單檔32MiB保持，這不是整個工作台或實際記憶體用量保證。

新 verification-focus 純注入政策由三個原文核對及備份共用，僅保留來源 epoch 的有限取消焦點意圖。名額有空即回 picker；滿額先聚焦 status note，只有來源相同且仍停在原提示才接續。blur、新檔、來源變更、pagehide／dispose清除，晚完成不搶後續編修焦點。四 note／aria／scoped outline、固定 self asset 與 server 白名單分層；沒有新 operation、Agent／路徑權限、依賴或產品外網能力。

755 Python（1既有 Windows symlink skip、0 expected failures）、1850 JS（新增20）、151 syntax／四 Skills與集中105 JS通過。452歷史 ZIP／manifest bytes、29組 input/output schemas及原整份／原列比較保持。原 v150 ZIP 2910329 bytes、SHA 0028a2664dfa977217f7b5ed95bf1fa29657829315099ec3263ae58e9a488b90，以未改 launcher／120秒 deadline順序還原755 Python／1830 JS，暫存已移除。

原生14次 File選取（備份10／文字4），真正 arrayBuffer及WebCrypto SHA經QA完成閘門核對read取消／hash滿額／相同檔／同大小有效ZIP差異／重試、Tab離開提示及來源變更；全部10read／9hash／4text完成、gates0、console0。正式四note與共享asset只載入一次、2px green outline經DOM／computed style核對；不是慢磁碟、hash性能、RAM、已保存下載或完整視覺／screen reader接受。兩個自有 server原handle正常EOF0、兩QA頁及一投稿查驗臨時頁已關閉，未設viewport。

產品151／唯一policy38–151共114、未知152拒絕；22基本／29啟庫、Agent1／draft3及原schemas保持。六法律／平台文件原bytes、PolyForm Noncommercial、public與ZOE. G／djguan-jpg保持。本輪唯讀確認Zoe／音樂公會長及四公開申請，仍作者自行聲明／創始未核實，禁止商用文字保持，無重送或平台mutation。還原tag／codex分支／exact-source封裝與rolling goal active保持。

見[契約](docs/BACKUP-VERIFICATION-CAPACITY.md)。以下保留歷史迭代。

## v0.150.0 取消核對後的鍵盤焦點

原生 Chrome 重現：按取消後 picker 已可用，但 disabled 取消按鈕使焦點落回 BODY。共用純 controller 以完整 scope／revision／原檔名／原文派生暫態 contextRevision → 注入 DOM adapter 的明確取消焦點意圖 → 三個可程式聚焦的 status note 與 scoped focus 樣式。取消後有名額即回 picker；兩個實際 read 未結束時先聚焦提示，僅仍停在原提示、來源未變且 picker 可用才接回。blur、新選檔、來源改變、pagehide／dispose 清除意圖；一般成功／錯誤不移動焦點。原文／成果／草稿保存 proof／條件／媒體與兩個 read 上限保持，epoch 不進 wire 或 draft3。

755 Python（1 既有 Windows symlink 權限 skip、0 expected failures）、1830 JS（新增9）、150 syntax／四 Skills 通過，集中68項取消／焦點／保存 callback 測試。448歷史 ZIP／manifest bytes、29組 input/output schemas 及原整份／原列比較保持。原 v149 ZIP 2888434 bytes、SHA 744321ee85f8fbe1c74a3d92ce8ae8337c306603e9b4dfe675d30afcb2d4f18e 還原755 Python／1821 JS；首次並行稽核觸及原120秒 deadline，保留失敗與原 worker stopped 證據，使用未改 launcher／deadline 的順序重驗通過。

原生 Chrome 10次 File chooser，QA 閘門延後真正原生 arrayBuffer 的完成；實際 Enter 取消、Tab 離開提示、後續編修、來源 revision 改變與成功重試均核對焦點及原文 proof，全部 read settle。正式工作台三個 note 的 tabindex=-1／status／polite／aria 關聯保持，產品 focus outline 2px solid green 經 computed style 核對，console0。QA inline script 初次被既有 CSP 拒絕，改為固定 self-served QA script；QA 起初漏 stylesheet 後補上 link，產品 CSP 未放寬。這不是實際慢磁碟、已保存下載、完整視覺或 screen reader 接受。

產品150／唯一 policy38–150共113，未知151拒絕；22基本／29啟庫、Agent1／draft3及既有 schemas 保持，無新增 operation／asset／依賴／auth／path／產品網路權限。PolyForm Noncommercial、public、ZOE. G／djguan-jpg及六法律／平台文件原 bytes 保留。本轮唯讀確認 Zoe 登入、無待送技能草稿與四公開頁；仍作者自行聲明／創始未核實，禁止商用文字保持，無重複投稿或平台 mutation。三個自有 QA server 原 handle 正常 EOF0、三個 QA 頁及單一投稿查驗臨時頁已關閉，未設 viewport；還原 tag／codex 分支／exact-source 封裝與 rolling goal active 保持。

見[契約](docs/TEXT-VERIFICATION-FOCUS.md)。以下保留歷史迭代。

## v0.149.0 原文核對取消與有界讀取

補上成果、專案草稿與接受條件三個原文核對入口的明確取消按鈕。原有共用純controller的latest generation取消 → 注入reader的兩個實際讀取slot → DOM按鈕／狀態呈現 → app與接受條件adapter。每個核對器最多兩個未結束read，取消不假裝中止native File.arrayBuffer；slot只在實際settle後釋放，已滿時先等待，舊成功／錯誤不提交。取消與晚回應不確認草稿／條件已保存，不改原文／成果／後續編修／媒體；取消按鈕僅pending可用，dispose移除自有handler。

755 Python（1既有Windows symlink權限skip、0expected failures）、1821 JS（新增10）、150 syntax／四Skills通過。59相關測試涵蓋30次快速取消仍最多2個reader、失敗與metadata前檢不漏slot、來源變更／pagehide／dispose、legacy無cancel adapter保持，以及兩種保存確認仍需明確成功proof。原v148 exact-source ZIP 2867895bytes、SHA e0f388b928440a29a2f41ca18b8df710cd56283bff6885841b3906e02cd5d9f7還原755 Python／1811 JS；444歷史ZIP／manifest與29原schemas保持，整份／原列比較檔不變。

原生Chrome三次native File選回本輪合成candidate，驗證完整一致、同大小尾端byte2058差異、重試一致；四份wire檔與data保持，47controls前後相同，後續歌名編修清除proof／停picker與下載，console0。三個取消控制存在、aria關聯與idle disabled核對。pending取消／慢reader由注入DOM與保存callback整合測試驗證；未宣稱實際native慢檔取消或完整視覺／screen reader接受。IAB／Chrome兩次download send未取得完成event，candidate不是saved download；下載紀錄頁被瀏覽器安全規則禁止，沒有繞過，磁碟保存仍未驗證。

產品149／唯一policy38–149共112，未知150拒絕；22基本／29啟庫、Agent1／draft3與其他schemas維持，沒有新operation／asset／依賴／auth／path／產品網路權限。PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台原bytes保持；本輪未讀／寫FreeTWAI，既有四投稿仍submitted_unverified。前後測兩個自有server由原handle正常EOF0、两個測試頁關閉、未設viewport。還原tag／codex分支與exact-source封裝保持，rolling goal active。

見[契約](docs/TEXT-VERIFICATION-CANCEL.md)。以下保留歷史迭代。

## v0.148.0 規劃 Markdown 原文字面顯示

修正歌曲 task.md／music-plan.md 與分鏡 prompts.md／continuity.md 的標題、記憶點、交付項、畫面欄位、母題與審查說明含換行或 Markdown／HTML 標點時，形成額外標題、連結或格式的可重現問題。純 markdown_text.inline → 相容的 markdown_table.cell／creative／design → 共用 application → CLI／Agent／MCP／HTTP → 既有 browser source guard；所有現有顯示欄位共用字面呈現。ASCII 標點轉十進位 numeric references，CRLF／CR／LF 只在顯示轉固定 br；JSON、CSV、順序、時間與原創文字保持。來源 JSON 才是原文依據，顯示不是空白／排版 bytes 保存或 AI prompt 安全承諾。

755 Python（新增10、1既有Windows symlink權限skip、0expected failures）、1811 JS、150 syntax／四Skills通過。GitHub實際GFM對四份合成文件修改前後共8次轉譯，固定標題／段落結構與所有顯示原文核對；data及五份非Markdown檔逐bytes不變。原41表格樣本與歌曲表格body原bytes保持。440歷史producer ZIP／manifest與29 input/output schemas保持，舊整份／原列比較檔不變。原v147 exact-source ZIP 2848621 bytes、SHA 349be2e842bdb40f4b9ee72b4c0a137efd4ea30a7f15977c69e817ec7bc05165 還原745 Python／1811 JS成功。

原生工作台核對九份完整wire檔、八份UI全文及一份CSV textarea換行正規化顯示；47歌曲＋63分鏡controls保持，後續分鏡片名編修保留上一份且停用下載，console0。本輪沒有下載click、完整視覺／screen reader／媒體同步／Host安裝或創始身分接受。產品148／唯一policy38–148共111，未知149拒絕；22基本／29啟庫、Agent1／draft3與其餘schemas保持，沒有新operation／依賴／auth／path／產品外網能力。

PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。使用者已登入的Chrome唯讀確認Zoe及音樂公會長，沒有重新投稿／平台mutation，四新專案既有提交紀錄仍原作者自行聲明、創始未核實。本輪自有QA server原handle正常EOF0、一頁關閉；還原tag、codex分支與exact-source封裝保持。rolling goal active。

見[契約](docs/PLANNING-MARKDOWN.md)。以下保留歷史迭代。

## v0.147.0 歌曲交付表格原文顯示

修正歌曲設計包的段落名稱、敘事任務與聲音配置含換行或管線符號時，Markdown 表格拆列／錯欄的可重現問題。純 markdown_table.cell → design 的三個文字欄 → 既有 application／CLI／Agent／MCP／HTTP 分層。ASCII 標點使用 numeric character references 保持字面，不形成 Markdown／HTML 欄位語法；CRLF／CR／LF 只在顯示表格轉為固定 br。原 JSON 文字、順序、時間與創作內容不變；不把顯示檔當作原文 bytes 保存。其他 Markdown 段落不在本次格式保護範圍。

745 Python（新增9、1既有Windows symlink權限skip、0expected failures）、1811 JS、150 syntax／四Skills通過；Agent／MCP／HTTP與CLI完整四檔一致，CLI仍預設拒覆寫。GitHub官方GFM實際轉譯同一合成來源，修正前七列錯位、修正後六列各六欄，三個文字欄逐列字面核對。此遠端轉譯只在忽略QA，產品與正常測試不新增網路或依賴。原生工作台完整四檔核對及49controls保持，後續歌名編修保留／旧下載停用，console0。沒有本輪瀏覽器下載或完整視覺接受驗證。

436 歷史producer ZIP／manifest逐bytes保持，29組input/output schemas與原整份／原列比較檔保持；原v146精確ZIP2829240bytes、SHA763310a94131f711b0a554b9421db4428bcb283f2c809c3d7ff9acda7492ebcc還原736 Python／1811 JS通過。22基本／29啟庫、Agent1／draft3與其他schemas保持，產品147／唯一policy38–147共110，未知148拒絕。沒有新operation／GET／POST／auth／path／外網產品權限。

PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。唯讀確認使用者Chrome Zoe已登入、GitHub連結與四社群技能存在，仍原作者自行聲明／創始未核實，無重送或平台mutation；原頁返回guilds。自有單QA server以原handle正常EOF0、自建一頁關閉、未設viewport。還原tag／codex分支與exact-source封裝保持；rolling goal active，後續依真使用流程繼續改善。

見[契約](docs/MUSIC-MARKDOWN.md)。以下保留歷史迭代。

## v0.146.0 前後變動原列導覽

草稿檔及保存版本的指定原列新增「上一個變動原列／下一個變動原列」。純 navigation 先完整驗證兩份 draft3、各 1 MiB canonical 來源與 selection，再扫描六集合的全部原位置，逐欄精確比較原字串並略過未變更列。最多 10000 句，超過整份報告前 200 筆仍可導覽；新增／移除及空字串保持，不推定列移動。只回傳位置／總數／變動數／序號及前後候選，沒有原文快取或 wire 變更。

原 current controller 的 checked readPayload → 純模型 → literal DOM 分層；每次完成及明確移動前重查來源，移動後重新比較原列。只改暫態原列選擇，完整原文模式回到摘錄；busy／stale／cancel／clear／dispose 清除並停用。明確鍵盤意圖成功後回到原列欄位，晚回覆不覆蓋重試或搶後續焦點。21 原欄、六集合、1000 stable IDs 及既有成果保留。

736 Python（1 既有 Windows symlink 權限 skip、0 expected failures）、1811 JS（新增23）、150 syntax／四 Skills 通過，集中143 JS。432 歷史 producer ZIP／manifest bytes 及29組 input/output schemas、原整份／原列 JSON／Markdown bytes 保持。22基本／29啟庫、Agent1／draft3／comparison1／row-comparison1保持；無 backend／HTTP／shared controller diff、依賴或權限擴張。產品146／唯一 policy38–146共109，未知147拒絕。

兩原生入口共12集合完整字面核對、24快照、三尺寸各兩入口真 Tab／Enter、console0及無頁面水平溢出；後續歌名編修保留，舊導覽清除。選定 brief.json 原內容與四個檔名保持，其他三檔全文本輪未獨立核對。六PNG只保存在忽略QA，完整視覺／screen reader及browser實際保存檔案未驗證。下載已送出但觀察逾時，原click未重送。自建合成庫兩JSON hash保持；一QA server原handle正常EOF0、兩自建查驗頁關閉及viewport reset，使用者Chrome分頁保留。

原v145精確ZIP2809765bytes、SHA 1f47b5a17150a9ec67e058a09a0833008cf43053bd140670089d8da9f7174845，以原launcher還原736 Python／1789 JS後移除自有暫存。PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。依使用者已登入指示，唯讀確認Chrome Zoe／GitHub連結及四公開投稿；仍原作者自行聲明、尚未核實，無额外創始認證按鈕，沒有重送或平台mutation。還原tag、codex分支、CHANGELOG／HANDOFF及exact-source封裝可逆；rolling goal active。

見[契約](docs/DRAFT-COMPARISON-NAVIGATION.md)。以下保留歷史迭代。

## v0.145.0 指定原列完整原文

草稿檔與保存版本的原列比較新增「閱讀這一列完整原文／回到原文摘錄」。修正兩側前128 bytes相同但末尾不同時無法審閱的缺口；六集合、全部欄位、未變更／空字串／缺列保持。每次明確閱讀以共享controller的readPayload取得同一次完整驗證與current proof核對後的隔離來源，再由純fullValues選取原列，literal DOM顯示全部原字串；不從摘錄拼接、不改或套用草稿。全文只留在暫態DOM；新比較、取消、失效及clear／dispose清除，切換閱讀模式保留按鈕焦點。

共享controller亦修正新run在capture／prepare／gate前置失敗時舊report仍ready的可重現錯誤；有舊報告即發布stale，停舊下載／全文，再允許明確有效重試。原late／ownership隔離保持。29組input/output schemas、原整份及原列JSON／Markdown bytes、22基本／29啟庫、Agent1／draft3／comparison1／row-comparison1保持；本輪backend及HTTP路由沒有diff。產品145／唯一policy38–145共108，未知146拒絕。

736 Python methods（1既有Windows symlink權限skip、0expected failures）、1789 JS、150 syntax及四Skills通過；新增20 JS，集中121 JS。428歷史producer ZIP／manifest byte cases及29 schemas保持。兩個原生入口各六集合完整before／after字面文字逐字核對，22快照保留21原欄、六列集合、1000句的stable IDs與四完整成果；最後明確改歌名，後續編修保留、舊全文清除及停用。三種viewports各两入口真Tab／Enter、無頁面水平溢出、console0；六PNG僅保存忽略QA，完整視覺／screen reader及browser實際保存檔案未驗證。

v144指定原ZIP2790931bytes／SHA b4d0dabbf0e8e09472b5238cab86810dbc25c51b5266adf58c07ccb7b6311266以原launcher還原736 Python／1769 JS，暫存移除。只使用自建合成草稿庫，兩JSON原hash保持；一個QA server正常shutdown／context close／deadline thread join且原exec EOF0，自建一頁關閉、viewport reset。只唯讀盤點本outputs與explicit typed jobs，嚴格七天及最新三版保護保持，草稿／素材／未知程序不清除。

PolyForm Noncommercial1.0.0、public、創辦ZOE. G／GitHub djguan-jpg及四份submitted_unverified保持，六個法律／平台文件原bytes不變，本輪沒有平台提交或mutation。還原tag、codex分支、CHANGELOG／HANDOFF及指定source ZIP／SHA提供可逆交付；rolling goal active。

見[契約](docs/DRAFT-COMPARISON-FULL.md)。以下保留歷史迭代。

## v0.144.0 查看指定原列

草稿檔及保存版本預覽新增「查看指定原列」：整份比較只保留前200筆時，仍能查看原第501／10000句。六個歌曲、分鏡與歌詞集合按原位置1起比對，包含未變更欄位，空字串與缺列分開；不猜移動或改內容。新Python／JS純row model重用完整draft3來源、canonical SHA與128 UTF-8 bytes摘錄，共享注入comparison controller及literal DOM分層。selection也參與current proof；無效來源發布stale，取消late／retry不覆蓋新工作。

新增唯讀draft_compare_row，经共用application至CLI／Agent／MCP／HTTP；獨立row-comparison1、64 KiB報告。22基本／29明確啟庫，需重新discovery；原28組schemas及整份比較JSON／Markdown bytes保持，Agent1／draft3／comparison1保持。只有兩個固定GET與一個唯讀POST；沒有新依賴、模型、媒體、外網、JSON路徑、auth或session能力。產品144／唯一交付38–144共107，未知145拒絕。

736 Python methods（1既有Windows symlink權限skip、0expected failures）、1769 JS、150 syntax及四Skills通過；新15 Python／20 JS覆蓋完整來源／六集合、字面原文、隔離／晚回應和五adapter回覆。19跨語言cases包含原第10000句；424歷史producer ZIP／manifest原bytes相同。兩原生入口25份DOM快照，1000句／21欄／六列根原值保持，四成果原文跨保存版本流程相同；三種viewports各兩入口Tab／Enter、無頁面水平溢出、console0。後續刻意改歌名保留，舊比較清除及停用。六JPEG僅留忽略QA，完整視覺／screen reader及browser實際保存檔案未驗證；本輪未獨立記錄DOM row IDs。

v143精確ZIP2754220bytes／SHA cb67e613ae60cbf4bfbf96bf656deafa9b15acecd0d4c733355383f45955acbc，以原launcher實際還原721 Python／1749 JS後移除暫存。五adapter舊比較／備份及10個保存版本原record／draft bytes保持，82合成JSON雜湊保持。有界QA server正常shutdown／context close／deadline thread join及原exec EOF0，自建兩分頁關閉、viewport reset。只唯讀盤點本專案metadata，沒有超七天清除候選；素材、草稿與未知程序保持。

創辦ZOE. G／GitHub djguan-jpg、public及PolyForm Noncommercial1.0.0保持。六個法律／平台文件原bytes保持；已唯讀確認登入音樂公會長及四份公開投稿，仍作者自行聲明／尚未核實，未重送。restore tag、codex分支、CHANGELOG／HANDOFF及指定source封裝可逆；rolling goal active。

見[契約](docs/DRAFT-COMPARISON-ROW.md)。以下保留歷史迭代。

## v0.143.0 草稿比較變動類型

草稿檔及保存版本的比較新增「變動類型」：全部、變更、新增、移除，與工作台範圍共同篩選。純draft-compare-view只保存最多200筆scope／status與原明細序號，返回隔離的保留明細計數與每頁10筆位置；DOM先重查完整current來源再換篩選。換類型／範圍回第一頁，跨頁展開位置保留；新比較／取消／來源失效清除。兩個原生select可換行，標籤／aria關聯及空清單保持可操作。比較report1、完整JSON／Markdown下載、原工作台／草稿／媒體不因篩選修改。

721 Python執行（1既有Windows權限skip、0expected failure）、1749 JS全部通過；新增15 JS覆蓋交集／隔離／未知與getter拒絕、原序號跨類型展開、兩DOM來源失效／空清單／全份下载不變。148 syntax／四Skills／155 commands通過。兩原生入口50份DOM快照，21原欄位／六列根含ID與四成果原文保持；1280×720、390×844、1280×360各兩入口實際Home／End／Tab／Enter，焦點可達、頁面無水平溢出，console0。六張JPEG只保存於忽略QA，不嵌入對話；完整視覺與browser落盤仍未驗證。

來源38–143共106版、未知144拒絕；420歷史ZIP／manifest原bytes與28組tool schemas保持，五adapter比較／backup與10版原record／draft匯出、82合成JSONhash保持。v142指定ZIP以原launcher還原721／1734後正常移除暫存。21／28工具、Agent1／draft3／comparison1保持；沒有backend／adapter／controller／download模型變更、依賴、auth或權限擴張。一個有界QA server正常shutdown／context close／deadline thread join且原exec EOF0，自建QA與平台查閱頁已關閉、viewport reset。

ZOE. G／djguan-jpg、public與PolyForm Noncommercial1.0.0保持。此次登入唯讀確認音樂公會長及四個公開投稿，仍是作者自行聲明／尚未核實；沒有重送或平台mutation。restore tag、codex分支、CHANGELOG／HANDOFF、精確source ZIP／SHA可逆；最新三版與嚴格七天／Git重建規則保持，rolling goal active。

見[契約](docs/DRAFT-COMPARISON-KIND.md)。以下保留歷史迭代。

## v0.142.0 完整測試與 worker 完成證據

修正成功測試隱藏skip及封裝只有passed字樣的證據缺口。test_run_summary純有界frame／source／counts／original-handle核對 → 原兩worker runner自我登記及communicate → --report-json／預設文字 → packager二次驗證並把獨立schema1摘要保存於manifest.checks.python_run。721 Python執行、1權限skip、0expected failure，1734 JS／148語法／四Skills通過；新增17 Python，原handle成功及deadline失敗實測，損壞摘要即使exit0也不能發manifest。

來源38–142共105版、未知143拒絕；416歷史ZIP／manifest bytes及28 tool schemas保持，五adapter比較／backup與10版原record／draft匯出、82合成JSONhash保持。v141指定ZIP實際還原704／1734，原launcher不改。21／28工具、Agent1／draft3／run1及release manifest1 root保持，無新Agent／HTTP操作、依賴、frontend差異或持久服务。兩worker／120秒cap及outer150秒不變；只控制自有Popen handles，不全域列舉或signal外部程序。

PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg與四份submitted_unverified保持。還原tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA可逆；最新三版與嚴格七天／Git重建規則保持，rolling goal active。

見[契約](docs/PYTHON-TEST-RUN.md)。以下保留歷史迭代。

## v0.141.0 草稿比較閱讀進度

草稿檔與保存庫的差異比較，在換頁、篩選後保留展開位置，新增「展開本頁差異／收合本頁差異」。draft-compare-view 純有界序號模型 → 原 current source controller → DOM listener／焦點 adapter；最多200保留明細、每頁10筆，新比較／busy／stale／clear／dispose 清除暫態。舊 detached toggle callback 拒絕，原文、草稿、媒體與成果保持，展開不代表審閱接受。

704 Python／1734 JS、148語法、四Skills通過；新增26 JS、集中66 JS／4 Python。兩個原生入口、28 snapshots 原21欄／六列集合含ID及四份完整成果保持；三尺寸共六次鍵盤觀察，無頁面橫溢且收合焦點可達。下載click有觸發，但5秒observer未取得保存檔；完整視覺與實際落地檔仍未驗證。自有server正常返回、兩個查驗tab關閉、viewport復原。

412歷史ZIP／manifest bytes、28 input-output schemas、五adapter比較／備份與10版record／draft匯出保持，82合成JSONhash相同；指定v140 ZIP實際還原704／1708。產品141／來源38–141共104版、未知142拒絕，21基本／啟庫28工具及Agent1／draft3／comparison1保持。PolyForm Noncommercial1.0.0、public與四份submitted_unverified保持；本次live登入與四投稿已核對，平台明示作者未核實。還原tag、codex分支、CHANGELOG／HANDOFF及exact-source ZIP／SHA可逆，rolling goal active。

封裝補充：首份指定source的外層與Python runner同為120秒，外層timeout後Windows暫存目錄仍被使用，未發成功manifest。保留失敗ZIP與receipt；只移除核對的自有空暫存目錄，未signal外部程序。外層封裝改150秒，runner仍120秒／兩worker，留出正常收集與清理時間；重新從新提交封裝並核對，原失敗不宣稱成功。

見[契約](docs/DRAFT-COMPARISON-VIEW.md)。以下保留歷史迭代。

## v0.140.0 明確維護動作與空值

修正空expected-token被忽略及空record-self意外落到一般audit。maintenance_cli純presence／互斥／token／job／批次identity判斷 → argparse保留原path字面、拒絕空path → 原filesystem／process adapter；在workspace／catalog／PID查詢或receipt寫入前拒絕無效控制。validate_job與原run1共用1–80字元grammar，未提供None與已提供空值分開。正常五動作、exact token／default不覆寫／tag重建／latest3／same-host身份保持，沒有新增維護權限。

704 Python／1708 JS、147語法、四Skills通過；新增16 Python全部通過，集中82含原space／prune／restore／catalog回歸。兩個真Windows junction證明descendant跳過、root拒絕及receipt不能穿出root，synthetic target SHA／mtime保持，僅os.rmdir移除核對的自有link。既有真symlink測試仍因權限1314 skip，不把junction當成symlink全覆蓋或atomic sandbox。v139指定ZIP實際CLI兩個空值原exit0，新exit1且無receipt；三empty path exit2；default audit回覆完整相同，正常record-self實際EOF。

408歷史ZIP／manifest bytes、28 input-output schemas、五adapter比較／備份與10版原record／draft匯出保持，82合成JSONhash相同。v139指定ZIP實際還原688／1708且暫存移除。產品140／來源38–140共103版，未知141拒絕；21基本／啟庫28工具、Agent1／draft3／audit1／run1／recovery1／space1保持。本輪web不變，沒有新browser或持久workbench；PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg與四份submitted_unverified保持。還原tag、codex分支、CHANGELOG／HANDOFF與exact-source ZIP／SHA可逆，rolling goal active。

見[契約](docs/MAINTENANCE-CLI.md)。以下保留歷史迭代。

## v0.139.0 唯讀輸出空間報告

維護 CLI 新增 `--space-report`：固定分類封裝區、標準 vN-qa 區與其他區，列出邏輯 bytes、檔案數、嚴格超七天統計及最大的20個 QA 目錄。純 metadata policy → bounded filesystem reader → 既有 CLI／exclusive receipt；報告 space1 獨立，不改 audit1／run1／recovery1。分類及年齡不是刪除資格，既有 tag／Git archive／最新三版／typed job 核對保持；不開 outputs 檔案內容、不輸出未知名稱或私人路徑、不跟隨 link／reparse point。

688 Python／1708 JS、147語法與四Skills通過；新增24 Python中23通過、1真 symlink 因Windows權限1314跳過，另有注入reparse／特殊entry測試。CLI實際報告與獨立metadata總和一致，receipt拒覆寫，82合成庫原JSONhash保持。404歷史ZIP bytes、28工具schemas、五adapter比較／備份與10版匯出保持；v138指定ZIP實際還原664／1708且暫存移除。

產品139／唯一交付來源38–139共102版，未知140拒絕；21基本／啟庫28工具、Agent1／draft3不變。沒有新增Agent／HTTP維護操作、依賴、模型或持久服務；本輪web未變，不宣稱新增原生視覺驗收。還原tag、codex分支、CHANGELOG／HANDOFF及指定source ZIP／SHA保留可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持；rolling goal active。

見[契約](docs/OUTPUTS-SPACE.md)。以下保留歷史迭代。

## v0.138.0 比較取消與重試隔離

修正取消／清除／失效後舊比較回覆使新報告過期的可重現錯誤。無論舊成功或錯誤在新版等待中或完成後抵達，只要已不擁有目前job，就不讀來源、不改狀態、不呼叫完成／錯誤callback。完成報告仍按原stamp與完整來源核對，不依賴已清空的job。現代草稿檔與保存版本的新比較成功後清除上一份下載提示與error樣式；refresh保留同份提示，明確clear也清除。

純controller把job ownership與report current分開 → literal DOM提示生命週期 → 原完整producer／shared downloader分層。664Python／1708JS（新增9）、147語法及四Skills通過；集中4Python＋40JS。測試包含cancel／clear／invalidate、兩種晚回覆與兩種新版狀態、多代不同順序、無額外capture／gate／publish及兩個DOM入口。原完整來源、gate／File身份、失敗重試、busy／dispose與明確Apply／undo保持。

12份落檔原生快照逐一核對全21欄、六集合與stable IDs，兩個入口重新比較後下載提示清空，四份成果全文與82合成庫JSONhash保持。1280×720／390×844／1280×360實際Tab可達JSON→Markdown、Enter重新比較，沒有頁面水平溢出。兩次observer逾時後只重設觀察器並重綁同頁；原server／頁面未重啟，預覽已完成就不重送。舊觀察器未落檔的host資料不當作完整快照證據，重做並逐份落檔。1自有頁關閉／viewport reset，1自有server正常shutdown／deadline join及原handle EOF。

指定v137 ZIP實際還原664／1699且暫存移除；400歷史ZIP／manifest原bytes、28組input-output schemas及21基本／啟庫28工具保持。五adapter比較、備份inspection及10版匯出原record／draft bytes核對。產品138／唯一交付來源38–138共101版，未知139拒絕；Agent1／draft3／backup1及comparison1保持。沒有新增asset、backend operation、依賴、模型或路徑／網路／写檔權限。

還原tag、codex分支、指定source封裝／SHA、CHANGELOG／HANDOFF、PR merge及實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持，本輪不修改或重送平台投稿。只盤點本outputs及typed同host jobs，最新三版保護；strict>7days且exact tag／現場Git archive可重建才可列清除候選。草稿／媒體、未知／failed QA、v77 alternate及partial36／53保留。瀏覽器保存檔、完整視覺／screen reader、實聽／同步、Host安裝與平台正式founder仍未驗證，rolling goal active。

見[契約](docs/DRAFT-COMPARISON-LIFECYCLE.md)。以下保留歷史迭代。

## v0.137.0 下載目前草稿比較報告

現代草稿檔與保存版本的比較預覽新增「下載比較 JSON」與「下載摘要 Markdown」。下載目前完整的有界報告，不因畫面篩選或每頁10筆而截斷；JSON含原值摘錄、完整欄位SHA與全部計數，Markdown含位置與計數。下載不另存工作台草稿；「已送出」仍須核對瀏覽器實際保存檔案。

draft-compare-download 純固定格式選取 → injected controller.read 完整來源／gate重查 → 既有 text-download 原生UTF8 bytes sender → DOM字面提示分層。只取本controller擁有且由既有producer建立的報告，不是外部任意report importer或完整語義驗證器；strict Unicode／exact envelope／JSON＋Markdown256KiB保持。編修、頁籤、原生File身份、busy或預覽改變拒絕舊下載；原明確Apply／undo、shared兩pending與1秒URL回收保持。pagehide清除全部自有listener，後續dispose無害。

664 Python／1699 JS（新增10）、147語法及四Skills通過；集中4Python＋31JS核對整份JSON／Markdown的Python-JS逐UTF8 bytes一致、全部計數、容量、來源拒絕、傳送失敗重試與listener回收。17原生快照均全21欄與六集合，比較／篩選／下載保持stable IDs和四份成果全文；後續編修僅改title，取消保留。1280×720／390×844／1280×360實際Tab鍵可達兩下載鈕且頁面無水平溢出。前兩尺寸Enter成功送出，第三次快速下載受shared兩pending限制；之後明確重比仍可送出。這輪未重做Apply或真媒體切換，既有契約測試保持。

實際v136 ZIP還原664／1689且暫存移除；396歷史交付ZIP／manifest原bytes、28組input-output schemas與21／28工具保持。五adapter比較／備份inspection及10版原record／draft匯出核對，82合成庫JSONhash保持。產品137／唯一交付來源38–137共100版，未知138拒絕；Agent1／draft3／backup1保持。只新增一個固定JS asset，無新backend operation、模型、依賴或路徑／網路／寫檔權限。

兩個workbench頁及一個空白診斷頁已關閉、viewport reset，一個自有server原handle正常EOF。瀏覽器已送出狀態可見，但IAB與Chrome下載事件未取得落盤檔；自動審核拒絕開啟Chrome下載紀錄頁，理由是工具只允許HTTP／HTTPS網址，沒有繞過或掃描未知下載位置。实际保存檔仍未驗證；完整視覺／screen reader、實聽音畫同步、Host安裝與正式founder仍未驗證。

restore tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA、PR與實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。本輪恢復既有自由工坊會員登入並唯讀核對四個公開投稿仍含禁止商用與作者未核實，沒有重送申請。只盤點本outputs及typed same-host jobs，最新三版保護，strict>7days且exact tag／Git archive可重建才列候選；草稿／媒體／failed QA／v77 alternate及partial36／53保持。rolling goal保持active。

見[契約](docs/DRAFT-COMPARISON-DOWNLOAD.md)。以下保留歷史迭代。

## v0.136.0 載入前比較完整草稿

工作台的現代草稿檔與保存版本預覽新增「比較目前與預覽」。先看四台作品及 metadata 差異，再明確載入或取消；比較不修改表單、成果、媒體或保存版本。明細可依台篩選、每頁10筆與鍵盤翻頁；每欄保留原字串的128 UTF8 bytes 摘錄，完整計數與完整 SHA 另列。插入或換序按原位置比較，不猜列移動。

draft-compare 純完整來源／canonical SHA／comparison1 → 注入 controller 的 click-time 完整核對與輕量 refresh → literal DOM → app 原預覽／Apply／undo 分層。Python 與原生 JS 的完整 report／Markdown 跨語言逐值一致；每份完整 draft3 canonical1MiB、前200明細／128KiB明細預算、JSON＋Markdown256KiB。WebCrypto 失敗可重試，來源不剪短。legacy 不自動遷移或比較。

編修、頁籤、原生 File 身份、預覽或保存版本改變使報告失效；晚到成功／錯誤與取消不能覆蓋後續內容。baseline 即時擷取的新 saved_at 排除於 current key，候選 saved_at 仍完整核對與列為 metadata。refresh 不重新擷取全部10000句；比較完成及閱讀報告仍完整重查。頁籤切換立即標示過期，未觀察到的 gate 改變也能結束等待。原明確 Apply 與限定撤回保持。

664 Python（新增4）／1689 JS（新增21）、146語法與四 Skills 通過；25新增測試涵蓋四台原值、完整計數／容量、控制文字／Unicode、Python-JS完整回應、晚回應／身份／取消與鍵盤焦點。原生29快照中28份含全21欄、最後來源25份；比較期間原stable IDs保持，載入後重比作品0、撤回保留先前編修，保存版本比較保留四份成果全文。1280×720／390×844／1280×360以實際鍵盤分頁、字面HTML／CRLF及emoji呈現核對，無頁面水平溢出。兩個自有頁及兩個受控server正常關閉。

實際 v135 指定 ZIP 還原660／1668並移除暫存；392歷史交付ZIP／manifest原bytes、28組input-output schemas及21／28工具保持。五adapter草稿比較／備份inspection及10版原record／draft匯出核對，82合成庫JSONhash保持；備份收據舊版本標籤以獨立更正收據說明。產品136／唯一交付來源38–136共99版，未知137拒絕；Agent1／draft3／backup1保持。只新增三固定JS assets，無新backend operation、依賴、模型或路徑／網路／寫檔權限。

restore tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA、PR與實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。只盤點本outputs及typed same-host jobs；最新三版保護，strict>7days且exact tag／Git archive可重建才可列清除候選，草稿／媒體／failed QA／v77 alternate及partial36／53保持。完整視覺／screen reader、瀏覽器下載落盤、真媒體身份／實聽同步、Host安裝與正式founder仍未驗證；rolling goal保持active。

見[契約](docs/DRAFT-COMPARISON-UI.md)。以下保留歷史迭代。

## v0.135.0 完整草稿原值比較

新增唯讀 draft_compare，比較兩份明確完整 draft3；四台全部欄位與六種集合按原位置逐項比較，metadata 的 tool_version／saved_at／tab 另列。保留空白、換行、Unicode與數字原字串；集合插入、刪除或換序不猜移動及stable IDs。原欄位、新增／移除列與缺值／空字串分開，完整計數不受明細容量影響。

draft_compare 純來源／canonical SHA、原值比較、摘要與有界摘錄 → 共用 application → CLI／Agent／MCP／loopback HTTP。每份canonical草稿1MiB；comparison1獨立，最多前200原位置明細與128KiB明細預算，每側原欄128UTF8 bytes不拆字元，JSON＋Markdown合計256KiB。明細含完整欄位SHA／byte長度，metadata不是作品變化；草稿canonical SHA不是原檔排版bytes、作者或創始認證。沒有合併、Apply、自動保存、來源路徑、外網、模型或依賴。

CLI draft-compare明確--baseline／--current與--out，strict UTF8／重複鍵／schema3／容量完整核對；原檔保持，報告預設拒覆寫，--overwrite只替換指定報告。0為相同、2為有差異但比較完成、1為輸入或I/O錯誤。Agent新唯讀operation與MCP tool需重新discovery；21基本／明確啟庫28工具，舊27組input／output schemas保持。HTTP只新增/api/draft-compare，既有auth／session及草稿保存邊界保持；工作台UI沒有新增自動比較或載入行為。

660 Python（105.563秒，新增15）、1668 JS、143語法與四Skills通過。集中15涵蓋全部四台／原集合、metadata、插入與重複、10000句完整計數、有界control文字／UTF8摘錄、來源損壞與capacity、exclusive CLI輸出、真Agent-MCP good／bad／good及短命HTTP200／400／200。既有兩份合成保存版本由draft_read核對後，五adapter完整data／files／meta一致，原82JSONhash保持。這輪沒有新原生UI操作驗收。

指定v134 ZIP實際還原645／1668，暫存移除；388歷史交付ZIP／manifest原bytes及27schemas保持。原備份完整五adapterinspection、10版export的record／draft原bytes保持，建立時間依實際匯出各自不同。產品135／唯一來源38–135共98版，未知136拒絕；Agent1／draft3／backup1及maintenance schemas保持。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。

第一份QA Agent fixture誤用numeric id，修正為既有protocol要求的字串；第一全套有一處舊len(listed)==20漏更新，修正discovery oracle後全套通過。runtime helper輸入檔名與既有基準收據重名，exclusive create拒絕後以新helper／新檔名完成；失敗腳本與紀錄保持，沒有變更產品validator或覆寫原檔。所有本輪managed helper及test child沿原handle／EOF結束，短命HTTP正常shutdown／context close／deadline join；無新增常駐server或browser。

restore tag、codex分支、指定source ZIP／SHA、PR及實際remote assets提供可逆交付。只盤點本workspace outputs、完整direct封裝及明確typed same-host程序；最新三版與strict>7days且exact tag／Git archive可重建政策保持，無合格候選不刪，保留草稿／媒體、failed QA、v77 alternate及partial36／53。完整視覺／screen reader、瀏覽器保存落盤、media實聽／同步、Host安裝與平台正式founder仍未驗證，rolling goal保持active。

見[契約](docs/DRAFT-COMPARISON.md)。以下保留歷史迭代。

## v0.134.0 撤回最近複製

段落、鏡頭及歌詞各自新增「撤回最近複製」。只移除最近成功複製且原值未再修改的一列；其他原列後續編修保持。三台各存一筆，下一次成功複製替換該台紀錄，撤回消耗紀錄；載入新內容只清除該台。列數、顺序或stable IDs變更、複製列已填新時間／文字時整份拒絕；修回精確原值可重試。沒有更早一步或重做，鏡頭展開狀態不當作創作變更。

editor-copy 純 checkpoint／undoProposal及注入controller → editor-copy-dom字面提示／原生button → app局部writeEntries／dirty及原列焦點。私有紀錄只留目前after IDs、source／copy ID及一份複製值，不保留其他原列全文；三份紀錄沿40段／1000鏡／10000句上限。refresh不capture全部欄位；click-time完整來源、gate與實際after重查。busy／hidden／disposed拒絕，已達copy容量仍可undo，pagehide釋放紀錄；I/O或callback失敗不自動覆蓋後續編修。

645 Python（104.422秒）、1668 JS（新增21）、143語法及四Skills通過；集中36。33完整native快照核對四台全部欄位、完成歌詞匯入後21個原stable IDs；三種複製／撤回、原列編修保留、複製句新創作拒絕／修回重試、三台獨立紀錄及局部載入清除通過。四份歌曲成果前後逐一讀全文相同，dirty下載及未另存提醒保持。1280×720／390×844／1280×360均以Shift+Tab→Tab進入undo、Enter撤回5→4句，焦點回原句且頁面沒有水平溢出。

實際v133指定ZIP還原645／1647；384歷史交付ZIP／manifest原bytes及27組schemas保持。application／CLI／Agent／MCP／短命HTTP完整備份inspection一致，good-bad-good／200400200；10版export保留完整record／draft原bytes，原合成庫hash保持。產品134／唯一來源38–134共97版，未知135拒絕；20／27工具、Agent1／draft3／backup1及maintenance schemas保持。沒有新增backend operation、路徑／網路／寫檔權限、依賴或模型呼叫。

一個受控QA server依原PID／creation identity正常shutdown、context close與deadline thread join，實際exec EOF；一個IAB頁關閉、viewport reset，console warn/error0。三PNG留忽略outputs/v134-qa，依使用者要求未嵌入；完整視覺／screen reader、瀏覽器落盤、media身份／實聽／同步、Host安裝與平台正式founder仍未驗證。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg與四份submitted_unverified投稿保持。

還原tag、codex分支、指定source封裝／SHA、PR與實際remote asset收據提供可逆交付。每輪只盤點本workspace outputs及typed same-host程序；無strict>7days且可重建候選不刪，保留草稿／媒體、failed QA、v77 alternate與partial36／53。rolling goal保持active。

見[契約](docs/EDITOR-COPY-UNDO.md)。以下保留歷史迭代。

## v0.133.0 明確分批維護

開發維護 CLI 新增可重複的 `--package-directory`，由完整候選明確選取1–128份預覽及清理。預設完整 audit1／prune 行為保持；超過128候選仍拒絕整批清理，不自動截取或連續清理。新 batch1 封套內含完整 audit1、選取身份、整份候選 token 與獨立批次 token；未選候選變更也使初次批次 token 失效。每批須重新預覽，再帶相同選取及 exact token。

maintenance 純選取／身份及確定性 token → maintenance_fs 完整來源盤點、即時條件與 recovery1 → iteration_audit CLI。最新三版、嚴格超七天、exact tag／现场 Git archive bytes、same-root 精確移動及 unlink、running／unverified 明確程序拒絕保持。復原日誌仍最多128份／2MiB，restore 拒絕覆寫；I/O 可有部分結果，保留 journal／隔離檔，不能宣稱原子交易。沒有新增 Agent／HTTP／瀏覽器維護權限。

645 Python（107.344秒，新增17）、1647 JS、143語法及四Skills通過；集中17。真132份合成Git／tag／ZIP封裝產生129候選，明確只清理2份，127未選候選、最新三版、未知partial及合成草稿保持；實際v132指定來源工具讀取新recovery1，全部264檔原bytes與mtime復原。第一份QA helper誤讀不存在的package_count欄位，預覽後、清理前失敗並正常結束；保留原腳本，修正的新helper完成全流程，未改產品來配合helper。

原v132指定ZIP還原628／1647，暫存移除。380份歷史交付ZIP／manifest原bytes及27組operation schemas保持；application／CLI／Agent／MCP／短命HTTP完整備份檢查一致，good-bad-good／200400200，明確10版輸出保留完整record／draft原bytes，原合成草稿庫hash保持。產品133／唯一來源38–133共96版，未知134拒絕；20／27工具、Agent1／draft3／backup1、audit1／recovery1／run1保持。本輪無UI改動或新原生瀏覽器操作；既有完整視覺、瀏覽器落盤、媒體實聽／同步、Host及平台創始核實限制保持。

PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg及四份submitted_unverified投稿保持。以還原tag、codex分支、指定source ZIP／SHA、PR／Release實際遠端asset及final same-host程序收據交付。只盤點本workspace outputs；無實際老舊合格候選不刪，保留草稿、媒體、failed QA、v77 alternate及partial36／53。rolling goal仍active。

見[契約](docs/MAINTENANCE-BATCH.md)。以下保留歷史迭代。

## v0.132.0 備份選取撤回

「分批備份選取清單」新增撤回最近一次成功的加入、整批加入、移出、整批移出或清空。清空後鍵盤焦點移到撤回；按鈕明示上次操作與可還原的版數。搜尋或讀取更多不清除紀錄；撤回後沒有更早一步或重做，下一次成功變更替換紀錄，無效／失敗操作保留紀錄。只改本頁選取，保存版本與已送出的備份來源保持。

backup-selection 純原值與完整 before／after metadata Map、順序及目前 capture 核對 → 注入控制器 → backup-selection-dom 字面提示／原生操作／焦點。每份最多1000版，私有最近一筆；完整核對來源、重複與已知版本矛盾後才還原，錯誤可修正重試。busy／disabled／disposed拒絕；pagehide釋放紀錄。只核對已捕捉metadata，不宣稱未載入資料的新鮮度或外部原子快照。

628 Python（75.438秒）、1647 JS（新增20）、143語法與四Skills通過；集中63。43完整DOM快照核對四台全部欄位、21列ID、目前成果全文與下載旗標、未保存提醒；另逐一切換四份成果，前後全文相同。41版清空→搜尋無結果→還原41、單版及整批移出撤回、下載後還原21而來源仍為10版、取消保留來源，以及單版／整批加入撤回通過。三尺寸1280×720／390×844／1280×360的Tab／Enter清空10→0→撤回10與焦點可達，頁面與提示沒有水平溢出。

82份合成草稿JSON hash保持。三份QA來源ZIP完整核對41／10／取消10版，原生選回舊41版不符、目前10版相符；這不是瀏覽器落盤下載檔。application／CLI／Agent／MCP／短命HTTP完整inspection一致，good-bad-good及200／400／200保持；選10版的record／draft原bytes相同，各次建立時間不同。原v131指定ZIP實際還原628／1627、376歷史交付原bytes及27組schemas保持。

產品132／唯一來源38–132共95版，未知133拒絕；20基本／啟庫27工具、Agent1／draft3／backup1與維護schema保持。app.js、下載器、Python domain與HTTP／CLI／Agent權限沒有變更。更正v131十二份概覽的focused51為實際43；已公開v131 tag／ZIP保持原樣。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg及四份submitted_unverified投稿保持。

一個受控QA server按原PID／creation identity正常shutdown、context close及deadline thread join，實際exec EOF；一個IAB頁已關閉、viewport reset，console warn/error0。六張PNG留忽略outputs/v132-qa，不嵌入對話。完整視覺／screen reader、瀏覽器保存檔、媒體身份／實聽／同步、Host安裝與平台正式創始核實仍未驗證。

見[契約](docs/BACKUP-SELECTION-UNDO.md)。以下保留歷史迭代。

## v0.131.0 移出目前顯示版本

備份清單新增「移出目前顯示版本」，按鈕顯示目前已載入版本與清單的交集版數。搜尋31版但只載入20版時，只移出這20版；尚未載入與其他已选版本保留。讀取更多後可再移出剩餘11版。空搜尋或無交集停用，保存版本原檔不刪除；需要補回時仍可使用「加入目前顯示版本」。

backup-selection純metadata核對／共用完整batch提案 → 注入capture controller → backup-selection-dom字面提示／原生按鈕／焦點。remove先核對整份displayed、retained與同批duplicate一致後才delete交集；late conflict、unselected duplicate conflict、getter／sparse／額外欄位全部拒絕且保持原清單。已滿1000版且顯示其他新版本時，加入可因上限拒絕，但合法移出仍可用；add與remove proposal分別派生。舊三欄caller缺displayed不能推定整庫，沒有新fetch、分頁、保存／恢復、Agent operation或持久欄位。

忙碌停用編選；成功移出後若原按鈕持有焦點且停用，回到可用的整批加入，再按Enter可補回。下載沿既有固定ID／完整串流與SHA；取消仍保留上一份來源。app.js沿v130既有libraryRecords注入，無diff；後端、domain、CLI／Agent／MCP及HTTP權限保持。

628 Python（75.422秒）、1627 JS、143 syntax與四Skills通過；新增16 JS，focused43。29完整DOM快照核對四台全部原值、21個stable IDs（歌曲6結構＋6段落／分鏡1母題＋4鏡／歌詞4句）、四份成果全文／下載旗標及dirty=true提醒保持。三尺寸1280×720、390×844、1280×360的Tab／Enter移出10→0→補回10及焦點通過，頁面／提示／清單無水平溢出。41合成版本82 JSON hash保持；三個canonical來源ZIP完整核對，舊41版檔不符目前10版、當前10版相符。

application／CLI／Agent／MCP／短命HTTP inspection完整回覆相同，good-bad-good與200／400／200；10版export完整record／draft bytes保持，各次實際建立時間不同，不宣稱整包bytes相同。第一次inspection輔助脚本廣泛字串替換將HTTP200誤改100，保留失敗helper並以新helper只修正oracle後通過；產品沒有因該錯誤變更。原v130指定ZIP2448724 bytes／SHA fd4299bf1f69491699d1e24c71629c48128e76d5b955798b77641b70baf855e5實際還原628／1611；372歷史交付ZIP／manifest bytes及27組schemas保持。

產品131／唯一來源38–131共94版，未知132拒絕；20基本／啟庫27工具、Agent1／draft3／backup1與維護schemas保持。ZOE. G／djguan-jpg、PolyForm Noncommercial1.0.0、本次既有公開授權與四份平台submitted_unverified保持；不重複投稿或宣稱官方核實創始人。

瀏覽器download event未提供保存path；本輪選回的是QA server同份合成來源ZIP，實際瀏覽器落盤仍未驗證。完整視覺／screen reader、媒體File身份、實聽／音畫同步、Host安裝與平台創始核實仍未驗證。六PNG只留忽略QA。兩個刻意按版本分開的有界server正常shutdown／context close／thread join且實際exec EOF；一個本輪IAB頁關閉並reset viewport。

見[契約](docs/BACKUP-DISPLAYED-REMOVE.md)。以下保留歷史迭代。

## v0.130.0 加入目前顯示版本

分批備份新增「加入目前顯示版本」，一次加入保存版本選單已載入的版本。按鈕標示目前版數，旁邊提示尚未加入的數量；搜尋找到31版但只顯示20版時，只加入20版。需要其他版本時先手動讀取更多，再加入；搜尋無結果保留先前選取。相同ID不重複，資料矛盾或合計超1000版時整批拒絕並保留原清單。

backup-selection純原值metadata／dense array／全批提案 → 注入capture controller → backup-selection-dom字面文字、原生按鈕與焦點 → app只提供目前已載入libraryRecords。原三欄capture保持相容，沒有displayed的舊caller不能推定整庫。原selected的metadata ID getter會先執行問題已重現並修正；新增及原單版都先核對own data descriptors，再沿library-revision檢查，拒絕getter／未知欄位／sparse及custom hooks。這不是通用Proxy安全保證。

下載仍沿既有backup-download固定1–1000唯一排序ID及完整串流／SHA核對；沒有新增fetch、分頁、自動保存／恢復、草稿欄位、server operation或Agent權限。忙碌拒絕編選，取消保留上一份備份來源；原整庫／單版入口保持。Tab可達整批加入，Enter成功後新按鈕停用時焦點回到可用備份下載；搜尋／移出／清空只改本頁選取。

628 Python（76.921秒）、1611 JavaScript、143 syntax、四Skills通過；新增19 JS，focused35。26份完整DOM快照核對四台原值／歌曲六段ID、四份成果原文與下載旗標、草稿提醒保持；三種1280×720／390×844／1280×360尺寸的移出／重新加入和Tab／Enter通過，頁面與清單不水平溢出。41份合成保存版本82檔hash保持，三份canonical來源ZIP完整核對。CLI／Agent／MCP／HTTP inspect完整回覆相同，good-bad-good及200／400／200保持；20版export核對每版record／draft原bytes相同，建立時間為各次實際時間，不宣稱整包bytes相同。

原v129指定source ZIP2422138 bytes、SHA5ee78350428c823027fa41c36e341d3930390e03e3cd0a2a44fbad7376d35c4f實際還原628／1592；368份歷史交付ZIP／manifest bytes與27組schemas保持。產品130／唯一來源38–130共93版，未知131拒絕；20基本／啟庫27工具、Agent1／draft3／backup1及維護schemas保持。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、公開催權及四份投稿submitted_unverified保持，不重複提交。

瀏覽器下載事件未取得本機path；選回檔案為QA server額外保留的同份合成來源，明確不是瀏覽器落盤下載。完整視覺／screen reader、含非空分鏡／歌詞的本輪原生操作、媒體身份、實聽／同步、Host安裝與平台正式創始核實仍未驗證。六份響應截圖只留忽略QA目錄，未嵌入對話。兩個刻意分開的版本server phase按原handle正常shutdown、thread join與context close並觀察exec EOF；本輪IAB頁關閉、viewport reset。

見[契約](docs/BACKUP-DISPLAYED.md)。以下保留歷史迭代。

## v0.129.0 封裝盤點與復原容量

封裝目錄超過128時，原本的標準唯讀稽核會拒絕整輪盤點。現在將目錄上限與復原日誌分開：先完整列舉最多1024個direct entries，再逐份核對；超限在開啟封裝前拒絕，不以部分清單判斷最新三版。每份完整manifest核對後只留下保留政策與identity所需metadata，釋放完整來源ledger。

maintenance純保留／身份政策 → maintenance_fs明確本機root、ZIP／Git核對與有界catalog → iteration_audit既有CLI與新receipt。復原仍最多128份／日誌2MiB，prune候選超128在來源重查、journal及move前拒絕；既有嚴格超七日、最新三版、exact tag／可重建bytes、未知與未核實資料保留，以及active／unverified程序拒絕清除的政策保持。

628 Python、1592 JavaScript、143 syntax與四Skills通過；新增6 Python。真129目錄CLI預覽／清除／復原及partial檔保持、1024／1025邊界、完整manifest釋放與128／129復原限制核對。原v128指定ZIP實際還原622／1592；364份歷史交付bytes與27組operation schemas相同。正式標準CLI已盤點本workspace129目錄，沒有清除候選；v77另一份source與正式tag不符，兩份partial36／53均保留。

產品129／唯一交付來源38–129共92版，未知130拒絕。20基本／啟庫27工具、27組schemas、Agent1／draft3／audit1／recovery1保持。工作台與創作application、HTTP／Agent／MCP執行能力沿原介面；本輪沒有新增瀏覽器操作驗收。PolyForm Noncommercial1.0.0、ZOE. G與public保持；平台仍submitted_unverified。已公開v128及其補查收據保留，新的restore／codex分支提供可逆差異。

見[契約](docs/MAINTENANCE-CATALOG.md)。以下保留歷史迭代。

## v0.128.0 多版本分批備份

工作台新增「分批備份選取清單」：從已保存版本選單加入不同版本，跨搜尋或重新整理保留選取；清單明示名稱、保存時間與ID，可移出／清空後下載這一批。按下時固定1–1000唯一ID，整庫與單版入口保持。清空／移出只改本頁清單，不刪保存版本；重新開啟本頁需重新選取。備份只含已保存版本，未保存編修、音檔與成果另存。

backup-selection純metadata／注入capture controller → backup-selection-dom字面清單與焦點／變更及availability通知 → 原backup-download純request、同一下載controller及完整串流／SHA／sender。來源沿library-revision完整metadata檢查，view只含ID／名稱／保存時間，不持有草稿、File、ZIP或路徑；重複不倍增，矛盾metadata保留原清單。原始request副本與latest／cancel／dispose、32 MiB及URL cap保持。busy拒絕編選與下載，取消保留上一份成功備份。草稿與成果不確認為已保存，不自動恢復或載入。

加入／移出／清空與可下載狀態變更通知既有下載adapter，app.run開始／結束刷新選取狀態；避免最後一版移出後按鈕仍可按。移出後焦點到下一個可用按鈕；搜尋無結果且清空時回可聚焦清單。1000版有界局部捲動，窄視窗名稱／ID換行。新增兩個固定GET JS；backup1／draft3／Agent1、20基本／啟庫27工具及27組schemas保持，既有POST／Python備份domain／CLI／Agent／MCP無diff。產品128／唯一policy來源38–128共91，未知129拒絕。

見[契約](docs/BACKUP-BATCH.md)。下方保留歷史迭代。

622 Python（98.078秒）、1592 JavaScript與143 syntax通過；新增16 JS，Python後續未改，沿同次622成功，指定source封裝另完整驗證。四Skills再驗；v127指定source ZIP（2380239 bytes，SHA 95cde57b5630f53606f9a476834e64d089e640dd440f8e861673ad25a4d4d633）實際還原622／1576。四scope×90的360份歷史ZIP／manifest原bytes保持，27組schemas與八份whole lyrics Python／JS報告保持。

原生27份完整快照：四台原值、17個row IDs、歌曲四檔／完整目前預覽／下载旗標、draft dirty與兩預覽狀態保持；另保留三份早期較窄快照。加入3後搜尋1，再加入1，無結果仍可備份[1,3]；按下載後刷新並選2，本次來源仍[1,3]。三秒QA-only prepare延遲驗取消與busy；整庫檔拒絕確認多版，多版也拒絕確認後來單版，正確合成source成功。清空首次重現按鈕未即時停用，保留失敗快照，補通知後reload四份快照實際通過。1280×720／390×844／1280×360六份前後快照原值保持、頁面與清單不水平溢出，Tab可達批次下載、Enter移出／清空焦點可達，console warn/error零。

多版[1,3]的完整inspection在application／CLI／Agent／MCP／HTTP回覆相同；good-bad-good及200／400／200、路徑拒絕與27工具discovery保持。實際CLI多ID備份與預設拒覆寫，以及application／Agent／MCP完整inline ZIP核對相同ID與record／draft原bytes；created_at為實際時間，不宣稱整包bytes相同。四固定HTTP assets逐byte等於source，短命HTTP threads join，subprocess EOF，兩個有界server按原記錄正常stop並觀察EOF，一個QA tab已關閉及viewport reset。兩組三版合成草稿库各六檔hash保持，未恢復。

QA原生選回四份server合成source ZIP，並非實際瀏覽器保存檔。下載事件10秒未取得path，保存落盤未驗證。保留首次QA report舊版號、CLI把nargs多ID錯接為逗號字串、refine helper全檔count不符及DOM通知測試的失敗；fresh修正後重驗，產品HTTP／CLI語義不因此放寬。工作包測試在外層驗忙碌觀察，避免run錯誤處理吞掉測試內assert。

分支codex/iteration-v0.128.0；restore-v0.127.0-before-v0.128.0固定d182ebfd6db8c0b79a655c002f316326f9ea871f。由tag另建codex/restore-*分支及PR審閱還原，不改私人草稿／素材、不撤銷外部投稿。精確source封裝、合併與已授權公開prerelease；actual提交、ZIP／SHA及兩個asset逐byte回讀以outputs/v128-qa收據／manifest為準，GitHub CI未設定。

每輪只稽核本workspace outputs、完整direct封裝及明確same-host run，保護最新128／127／126三版；嚴格超七日且exact tag／現場Git archive可重建才列清除候選。草稿、備份、媒體、未知、失敗36／53與QA保持，無候選不刪，不終止外部程序。ZOE. G、djguan-jpg、PolyForm Noncommercial1.0.0及public保持，四份FreeTWAI已投稿，platform仍submitted_unverified。本輪是滾動goal進展，仍active；實際瀏覽器落盤、完整視覺／screen reader、實聽／同步、Host安裝與平台正式創始核實未驗證。


## v0.127.0 單版本備份

本機保存版本新增「下載選定版本備份」，可將選單中一個已保存版本另存ZIP。按下時固定ID，即使下載途中切換選單，也不改本次來源；成功提示明示該ID，整庫備份保持。空選擇／未啟庫／busy時停用；取消只中止自己請求、保留上一份成功備份來源。備份只含已保存版本，未保存編修、音檔與成果仍須另存。

backup-download純request嚴格核對ids、隔離／排序1–1000唯一ID；controller以click-time副本核對descriptor.selection及選定數量，沿原完整串流／SHA與latest／cancel／dispose。DOM共用同一sender、URL cap及verification來源，不增加第二個下載控制器或持久buffer。captureSelected只讀目前已展示records；library選擇事件刷新可用狀態，原预覽取消及後續編修保持。

既有POST /api/drafts/backup/prepare由{}整庫相容接續可選ids，沿共享Python selected_ids／export_library_backup；拒絕路徑、額外欄位、query、重複／空ID及跨Origin。ID不能選檔案路徑；沒有恢復或新增寫入權限。選定健康版本不讀未選定版本，整庫仍完整檢查。有效格式但不存在的ID維持既有HTTP500本機讀寫失敗，不自動重送。descriptor六欄、backup1／draft3／Agent1與27組operation schemas保持，20基本／啟庫27工具不變，沒有新asset、依賴、模型或外網。產品127／唯一policy明確來源38–127共90版，未知128拒絕。

見[契約](docs/BACKUP-SELECTION.md)。下方保留歷史迭代。

622 Python（92.422秒）、1576 JavaScript、141 syntax及四Skills通過；新增3 Python／8 JS，focus43 JS及3 Python。初次Python兩處oracle不符：既有populate只建兩個版本，缺少的合法ID沿原HTTP500；按實際資料／契約修正，產品錯誤路徑不改。首輪完整JS只有舊selection-event VM缺少新增backupControls回呼；補上並驗其一次刷新後完整1576成功。Python源與測試此後沒有再改，沿同次622成功；所有失敗log與fresh retry收據保持。

v126精確source ZIP（2357756 bytes，SHA 35786baee1e7355b8e4e98b1f189f4e9205cdc72b1c26b63df83c792adb4fd08）實際還原619／1568；四scope×89的356份歷史ZIP／manifest原bytes保持，27組schema及八份whole lyrics Python／JS診斷保持。單版本原生合成source的完整inspection回覆在application／CLI／Agent／MCP／HTTP相同，good-bad-good與200／400／200保持。另實際CLI選ID備份／拒覆寫，application、Agent及MCP完整inline ZIP均核對相同選定ID與保存record／draft原bytes；created_at按實際時間不同，不宣稱整包bytes相同。原三份合成版本六個檔案hash不變，未restore。

一個in-app本機QA頁保留19份完整快照：13份流程中的四台原值／17個row或清單ID／歌曲四個成果與dirty保持；busy時兩下載按鈕、取消與核對控制正確。三秒QA-only prepare延遲驗取消保留整庫source，以及點版本2後切版本1仍交付2；整庫檔不能確認單版2，單版2也不能確認新的單版1，正確檔案成功。四份QA server source分別含[1,2,3]／取消請求[2]／成功[2]／[1]；它們是合成source，不是實際瀏覽器保存檔案。下載事件10秒未取得path，不繞過先前被拒的下載管理頁。

1280×720／390×844／1280×360均以實際DOM尺寸核對完整值，頁面與ID／摘要提示不水平溢出，從整庫按Tab可達單版按鈕。warn/error零，viewport reset，QA tab關閉，原會員tab保持。QA server正常stop／context close／deadline thread join並觀察實際exec EOF；短命HTTP threads正常join，CLI／Agent／MCP EOF。未選媒體，不宣稱native File身份或實聽驗收。PNG留本機忽略QA。

分支codex/iteration-v0.127.0；restore-v0.126.0-before-v0.127.0固定101b76fb0f6ab2a748058d7eb7e0195d84658a4e。由tag另建codex分支審閱還原，不覆寫私人草稿／素材；Git不撤銷外部投稿。精確source封裝、PR合併與公開prerelease，兩個assets逐byte回讀，以outputs/v127-qa成功收據及manifest記錄實際提交／SHA。

唯讀稽核本工作區outputs、完整直接封裝及明確same-host run；最新127／126／125保護，嚴格超七天且exact tag／Git archive可重建才列候選。保存草稿、備份、素材、未知、失敗36／53與QA保持；無候選不清除，不終止外部程序。ZOE. G、GitHub djguan-jpg、PolyForm Noncommercial1.0.0與已授權public保持；四份FreeTWAI已投稿，創始核實仍submitted_unverified。仍未驗證實際瀏覽器落盤、完整視覺／screen reader、實聽／同步、Host安裝與平台正式核實。本輪為滾動goal進展，goal仍active。


## v0.126.0 備份下載檔案核對

草稿庫備份旁新增「核對下載的備份 ZIP」。成功送出後可選回本機檔案，先核對1 byte至32 MiB容量，再以完整檔案SHA-256及大小核對本輪備份。來源只保留bytes／摘要／版本數；不持有完整備份，不恢復、載入、保存版本或确认未保存編修。新的成功送出遞增revision，即使內容相同也使舊讀取失效；下載失敗保留上一份來源。舊ZIP不能確認新ZIP。

純backup-verification嚴格原值模型、注入controller、原生File DOM adapter與原有backup-download sender分層。讀取與hash後重查本輪source／revision／busy、完整ArrayBuffer大小與選檔metadata，latest／cancel／pagehide／dispose保護晚回覆。原始32 MiB可完整核對；超限在arrayBuffer前拒絕。同大小錯bytes、短讀及來源失效保留原工作台、成果、列ID及草稿庫；選檔標為verification view control，不誤觸編修。單獨純verificationAllowed避免availability refresh寫入library訊息。

只新增三個固定GET JS資產；原備份domain／CLI／Agent／MCP／HTTP POST權限及schemas不变。20基本／啟庫27工具、27組schema、Agent1／draft3與backup1保持。產品126與唯一policy明確來源38–126共89版，未知127拒絕。PolyForm Noncommercial 1.0.0、ZOE. G及公開授權保持；四份自由工坊投稿已送出，創始身分仍submitted_unverified。

見[契約](docs/BACKUP-DOWNLOAD-VERIFICATION.md)。下方保留歷史迭代。

619 Python（90.875秒）、1568 JavaScript、141 syntax與4 Skills通過；新增17個JS測試、focus29項。覆蓋strict descriptor／getter拒絕、未知欄位／符號、Unicode basename、空庫metadata、大小與SHA雙核對、32 MiB最後一byte與預讀超限、無來源／busy／讀取與hash晚回覆／來源revision失效／cancel／dispose／短讀／metadata漂移／失敗retry、成功下載才留來源及availability純callback。沒有新增依賴。

v125精確source ZIP（2331451 bytes，SHA 1a34371e4887a4366708f3b8de0c82a02263f41d388697f76d463eb6774a24a4）實際還原619／1551。四scope×88的352份歷史ZIP／manifest原bytes保持，27組schema保持、八份whole lyrics跨Python／JS診斷保持。既有歌詞request与本輪QA server產生的3680-byte合成備份，在application／CLI／Agent／MCP／短命HTTP完整成功回覆相同，good-bad-good、200／400／200保持。備份僅inspect，未restore，三份合成版本六個原檔hash不變。

Chrome實際核對保留七份完整panels／所有17個row或清單ID／成果／dirty／library快照；六組前後全值相同、原歌曲四個成果下載仍啟用。同大小錯檔、32 MiB+1、舊source對新送出拒絕，兩次最新source成功。Chrome viewport API雖回應成功，DOM仍1920×919；該三次快照未當成三種尺寸驗收。另用in-app本機QA頁實際核對1280×720／390×844／1280×360：完整原值／列ID保持，摘要與Unicode錯檔名在頁寬內，沒有水平溢出，Tab可達備份匯入控制。兩個QA頁warn/error零，兩套暫時viewport均reset；PNG只留忽略QA，不宣稱完整視覺或screen reader驗收。本輪未選音檔，不宣稱native media身份驗證。

第一次原生下載事件等候10秒未取得檔案路徑。瀏覽器安全政策拒絕chrome://downloads/，未繞過；僅關閉本輪建立的空白頁。選回的三份canonical備份為QA server額外保存的同一份合成來源bytes，明確不是瀏覽器落盤下載。第一phase正常停止並觀察exec EOF；第二phase專為記錄合成source，不因延遲重啟或重送。兩個phase均正常停機、thread join／context close／實際exec EOF，三份合成版本原bytes保持。三個本輪QA tabs全關，會員與公開介紹頁保留。

來源提交、封裝器抽出精確source再檢查與遠端asset實際bytes/SHA，以本輪成功收據／manifest為準。仍未驗證實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。

分支codex/iteration-v0.126.0；還原tag restore-v0.125.0-before-v0.126.0固定e0d19479cf6b950ba5a032e992ced214ee9e6594。需還原時另建codex分支審閱，不覆寫現有草稿庫；Git不能撤銷外部投稿或公開狀態。採精確source提交封裝、PR審查與合併，公開prerelease連同ZIP／manifest逐byte回讀。

每輪唯讀稽核本工作區outputs、直接完整封裝和明確same-host run記錄。最新三版126／125／124保護；嚴格超七天、exact tag／現場Git archive可重建的完整封裝才列候選。草稿、备份、素材、未知檔／失敗36與53／QA證據保持，不因版本舊直接刪除，無候選不清除。不清理其他專案或未確認程序。本輪實際終態與SHA見outputs/v126-qa成功收據。滾動goal仍active，本輪為進展。


## v0.125.0 條件草稿下載核對

接受條件草稿下載旁新增「核對下載的條件草稿」。成功送出後可選回本次完整 JSON，以共享純 UTF-8 位元組核對確認該次保存快照；條件原值、工作台、列ID、媒體及既有報告保持。核對舊送出稿只確認它當時的條件，後來編修仍需另存；新的成功送出即使內容相同也使舊讀取失效。原本「已確認條件草稿檔案」按鈕保留。

既有純 audio-acceptance 保存模型不變；DOM adapter 只在 downloadText 成功後保留完整送出文字／遞增 revision，注入共享 text-verification controller／原生 File adapter，容量64 KiB在 arrayBuffer 前核對，沿 busy／visibility／latest／pagehide／dispose 保護。來源不取預覽或後來編修；失敗下載保留上一份有效來源。核對無需條件數值可解析，但分析仍完整驗證；BOM、重排、缺尾、同長錯文字、未知版本與額外欄位只要 bytes 不同就不確認。核對不是載入來源，不套用外部 JSON，也不改音檔。

原生測試重現核對選檔的 input 被通用 editor listener 視為編修，導致未改條件的報告過期。新 File 控制明確標示 data-view-control="verification"，重用既有唯讀排除；實際條件 input 仍照常標過期。沒有新增固定 asset、operation、POST、依賴、模型、外網或路徑權限。產品125／唯一policy來源38–125共88，未知126拒絕；20／27 tools、27組schemas、Agent1／draft3與獨立domain schemas保持。

見[契約](docs/AUDIO-ACCEPTANCE-DOWNLOAD.md)。以下保留歷史迭代。

619 Python（89.157秒）、1551 JavaScript、138 syntax及4 Skills通過；新增19個JS測試。focused65項是新增最後一項之前的實際結果；最後以完整1551為準。覆蓋未送出、未完成條件原文、Unicode／空白、同長錯bytes、BOM／排版／缺尾／未知版本／額外欄位、改檔名、64 KiB預讀拒絕、busy／隱藏／late／新送出／讀取失敗與retry、手動確認、載入checkpoint／預覽／媒體保持、dispose及實際editor input listener不誤標報告。

v124指定source ZIP（2308909 bytes，SHA a398767b3bc28b116715304321de8f62a08c2c37b94dbc3b7db743c6bcbd32d3）實際還原619／1532；四scope×87版的348份歷史ZIP／manifest原bytes相同，27組schemas保持，八份whole lyrics跨Python／JS診斷保持。既有合成歌詞request與本輪原生可見的完整合成條件報告，分別和application／CLI／Agent／MCP／短命HTTP完整回覆相同；good-bad-good及200／400／200通過，CLI2、重覆輸出1保留原bytes、無效資料拒絕且無輸出。四個固定GET JS原bytes相同。指定source封裝器會另驗解出原始碼，結果以manifest為準。

原生先保留兩份失敗快照，修正input排除後另保留18份完整快照及18份報告操作旗標。六組功能前後核對完整panels／條件／成果及旗標：超限與同長錯檔仍可下載原報告、舊送出稿確認後新編修仍需另存、舊檔無法確認新送出、相同JSON語義但不同欄位順序仍拒絕、最新canonical檔成功確認。三組1280×720／390×844／1280×360前後完整值與列ID相同，長錯誤檔名在頁寬內、沒有水平溢出，Tab可達載入條件控制。原生8秒合成WAV的File身份保持；本輪未實聽或檢查播放時刻，console warn/error零。PNG留忽略的本機QA，未作完整視覺／screen reader接受。

瀏覽器下載事件等候10秒沒有回報檔案路徑，選回的232／228 bytes是依可見原值獨立構造的合成probe，不是實際下載。第二份probe因欄位排序和canonical送出bytes不同而正確拒絕，保留它，另建正確canonical檔才取得成功；不把語義相同冒充完整文字相同。原生input錯誤與首輪JS oracle length87失敗均保留；HTML排除修正、oracle改88與最後新增input測試後完整JS1551通過，未再改Python而保留同次619成功結果。

分支 codex/iteration-v0.125.0；基線 main 80e606ec5f73ffc850244ffe562ff18675da6d71；還原 tag restore-v0.124.0-before-v0.125.0。由tag建立codex/restore-*分支與PR可還原原始碼，不變更私人草稿／素材或外部投稿。創辦ZOE. G、GitHub djguan-jpg與PolyForm Noncommercial 1.0.0保持；不授予AGPL或商用許可。Repo已獲明確授權公開；本次登入頁確認GitHub已連結djguan-jpg，四份ZOE. G介紹仍在社群書架；作者身分仍自行聲明、尚未核實，不重複提交。

一個owned有界QA server經exact recorded身份正常shutdown並確認實際session EOF；兩次短命HTTP thread正常join，CLI／Agent／MCP EOF。一個owned本機QA瀏覽器tab關閉、viewport reset；平台查閱使用既有會員tab，不關閉使用者tab。不終止外部程序。發佈後唯讀稽核本workspace outputs、直接封裝及typed runs，保護最新125／124／123三版。只有嚴格超七天且exact tag／現場Git archive可重建的完整封裝才列候選；草稿、備份、素材、未知、失敗36／53及QA保留。無候選不清除。source提交、兩個release assets實際下載bytes／SHA及最後稽核以 outputs/v125-qa 成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。本輪為滾動goal的一版進展，goal仍active。


## v0.124.0 草稿變更工作台

專案草稿的保存提醒新增變更工作台清單。尚未確認任何保存版本時，比對起始範例；已確認載入檔案、本機保存版本或下載草稿後，比對最近一次完整確認的內容。四個名稱固定依歌曲設計、母題分鏡、波形校時、交付檢查排序。還原一台的原值，該台退出清單；精確符合任何仍保留的完整版本或起始範例時，整份草稿維持既有已確認判定。

draft-retention 既有 checkpoint／注入 guard只新增隔離的 difference DTO（reference＋panels）；獨立 draft-difference 純模型嚴格核對列舉、最多四台、唯一／完整資料屬性後產生固定文字，app只更新提示 textContent／hidden。待確認下載不能替換參考；確認舊送出快照後，後續編修仍dirty。拼接不同保存版本的工作台片段仍需整份另存。原稿、列ID、媒體、成果、下載／本機保存流程與 beforeunload 原判定保持；摘要不帶原文／fingerprint／File／路徑，不進 draft3／Agent wire。新增一個固定GET JS，不新增 operation、依賴、模型、外網、登入或寫檔權限。產品124／唯一policy來源38–124共87，未知125拒絕；20／27 tools、27組schemas與獨立domain schemas保持。另修正根目錄 HANDOFF.md 的過期首頁版號。

見[契約](docs/DRAFT-DIFFERENCE.md)。以下保留歷史迭代。

619 Python（89.141秒）、1532 JavaScript、138 syntax及4 Skills通過，新增16個JS測試；focused保存／下載／確認整合59項通過。覆蓋四台與空白／清單順序／空列、三種完整確認來源、待確認下載、後續編修、舊完整版本／起始精確復原、混合版本、最近事件／同kind有界替換、DTO污染隔離、局部capture及beforeunload完整重查、嚴格列舉／額外／隱藏／symbol／accessor拒絕、固定文字DOM與資產順序。

v123指定source ZIP（2287710 bytes，SHA 083784b560fb932236d9889a27fb6dbb8eb7fe446792a72ef2314f3c5da2887f）實際還原619／1516；四scope×86版的344份歷史ZIP／manifest原bytes相同，27組schemas保持，八份whole lyrics跨Python／JS診斷保持。當前合成request的application／CLI／Agent／MCP／短命HTTP完整回覆相同，good-bad-good及200／400／200通過；CLI2、重覆輸出1保留原bytes、無效row拒絕且無輸出，四個固定GET JS原bytes相同。指定source封裝器會再驗證解出的來源，結果以release manifest為準。

原生18份創作快照，後10份另核對historyId；兩組手動確認前後核對完整創作，其中一組包含列ID。三組1280×720／390×844／1280×360排版前後完整值與列ID相同；四台完整提示在頁寬內且沒有頁面水平溢出，Tab可達載入草稿，確認可用Enter。精確復原已確認內容後dirty解除，原生8秒合成靜音WAV的File身份保持、暫停且0秒，console warn/error零。原先較窄觀察未捕獲historyId，後續擴充獨立核對；不宣稱前八份具備列ID證據。短視窗一次滑鼠命中失敗，重新觀察頁面後用原生Enter成功；PNG留忽略本機QA，未作完整視覺／screen reader接受。

本輪原生下載僅驗證成功送出與手動確認流程；手動確認為合成QA操作，不證明實際下載落盤或使用者素材保存。初次runtime2 helper錯把含runtime替換的index.html當固定bytes比較，該assert拒絕；保留失敗產物，以新runtime3只核對固定JS且完整重驗。準備helper的PowerShell嵌入字串曾解析失敗，未建立目標腳本；改以有界保存的Python helper後成功。無失敗結果冒充成功。

分支 codex/iteration-v0.124.0；基線 main e3d30319a28fd6ee5a78354ca6bd33301222f8d9；還原 tag restore-v0.123.0-before-v0.124.0。由tag建立codex/restore-*分支與PR可還原原始碼，不變更私人草稿／素材或外部平台投稿。創辦ZOE. G、GitHub djguan-jpg與PolyForm Noncommercial 1.0.0保持；不授予AGPL或商用許可。Repo已獲明確授權公開；四份FreeTWAI介紹頁先前已建立，作者／創始身分仍submitted_unverified，本輪不重複提交。

本輪一個owned有界QA server經exact recorded身份正常shutdown並確認實際session EOF，CLI／Agent／MCP EOF及短命HTTP thread正常join；一個owned本機瀏覽器tab關閉、viewport reset。發佈後唯讀稽核本workspace outputs、直接封裝及typed runs；保護最新124／123／122三版。只有嚴格超七天且exact tag／現場Git archive可重建的完整封裝才列候選；草稿、備份、素材、未知、失敗36／53及QA保留，不終止外部程序。無候選不清除。source提交、兩個release assets實際下載bytes／SHA及最後稽核以 outputs/v124-qa 成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。本輪為滾動goal的一版進展，goal仍active。


## v0.123.0 草稿下載完整核對

草稿下載旁新增「核對下載草稿」。只有實際成功送出草稿後才可選檔；沿共享完整 UTF-8 原文位元組核對，比對本次送出的完整 JSON，而非預覽、檔名或 JSON 語義。相同檔案確認既有 click-time 保存快照；後續編修仍需另存，原工作台、時間、列 ID、音檔及成果保持。檔案可重新命名；BOM、重新排版、缺尾、舊送出稿或錯原文拒絕保存確認。原本明確「已確認草稿檔案」按鈕保留。

純 text-verification 模型 → 支援 draft scope／可選容量的注入 controller → 可選 IDs 的原生 File DOM adapter → app 的成功 onSent 與原 draft-retention guard。草稿容量1 MiB，在 arrayBuffer 前核對；既有成果預設8 MiB保持。最新 token、送出 revision、完整 source、busy、離頁及 dispose 防護保持；允許核對舊送出快照與後續 dirty 編修共存。送出時間只提供可見辨識，不是保存成功證據；File／檔案路徑、核對報告及暫態完整 source 不進持久草稿或 Agent wire。產品123／唯一 policy38–123共86，未知124拒絕；20／27 tools、27組 schemas、Agent1／draft3及領域契約保持，沒有新 operation、固定 asset、依賴、模型或外網能力。

見[契約](docs/DRAFT-DOWNLOAD-VERIFICATION.md)。以下保留歷史迭代。

619 Python（90.390秒）、1516 JavaScript、137 syntax及4 Skills通過；新增14個JS測試。覆蓋完整 Unicode／原文空白與換行、same-size錯bytes、BOM／排版／缺尾／未知版本、重命名、容量在讀取前拒絕、讀取不完整／File冒充／size drift／I/O、busy／cancel／晚成功或錯誤、新送出失效、manual保存與dispose。Python未再改，沿用同一完整成功結果；修正JS fixture後重跑完整JS與syntax。上一版v122指定source ZIP（2265851 bytes，SHA 67122d24d2140d58be766264ebdab0b851643fe072b85a825ff4c8aa852a97d3）實際還原619／1502；四scope×85版的340份歷史ZIP／manifest原bytes相同，27組schemas保持，八份whole lyrics跨Python／JS診斷保持。指定source封裝器會另跑解出原始碼的完整驗證，成功以manifest為準。

原生14份唯讀快照，首份為較窄欄位觀察，後13份擴為142個創作控制與列ID。兩組功能前後及三組排版前後逐值／順序核對：舊相同檔確認保存但新編修仍dirty、精確復原欄值後dirty解除、舊檔不能確認新送出、最新相同檔確認。合成8秒WAV的原生File身份保持，暫停0秒，不seek。1280×720、390×844及1280×360核對入口在頁面寬度內，沒有頁面水平溢出；console warn/error零。PNG留忽略的本機QA，不宣稱完整視覺或screen reader接受。

Chrome下載事件等待10秒未回報落盤路徑；本輪原生選回的5718／5730／5728 bytes檔案是依創作DOM與可見送出時間獨立構造的合成probe，並非實際瀏覽器下載。它們驗證原生讀檔與完整bytes比較、保存guard及原資料保留；不能作為下載落盤或使用者原稿保存證明。當前合成request的application／CLI／Agent／MCP／短命HTTP完整回覆相同，good-bad-good及200／400／200通過；CLI2、重覆輸出1保留原bytes、無效row拒絕且無輸出，四個固定GET原文相同。此次未宣稱取得原生下載的報告檔。

失敗紀錄保留：版本fixture length／tuple修正；新送出fixture原先誤把prepared bytes當content、舊VM缺adapter，修正fixture後 focused56通過。可見時間新增後一項測試使用JS逗號索引而讀錯node，修正後完整1516全過。唯讀觀察先用不存在player ID與不支援的DOM FileList，改用正確lyrics-player及唯讀CDP原生File引用；初次runtime helper沿舊版寫死metadata與native聲明，保留原紀錄並以獨立runtime2完整重驗且正確標示合成來源。上述未冒充成功。

分支 codex/iteration-v0.123.0；基線 main da8f6f38057d2cfae7960cfee2989f55f4ef6ecb；還原 tag restore-v0.122.0-before-v0.123.0。由tag建立codex/restore-*分支與PR可還原原始碼，不改私人草稿／素材，也不撤銷外部投稿或Repo公開。LICENSE／NOTICE／LICENSING／FOUNDER及PLATFORM收據保持；創辦ZOE. G、GitHub djguan-jpg，PolyForm Noncommercial 1.0.0，沒有AGPL或商用許可。Repo已獲明確授權公開，四份FreeTWAI介紹頁已建立，作者／創始身分未核實，本輪只讀核對不重複提交。

有界owned QA server經exact recorded身份正常shutdown與實際session EOF；CLI／Agent／MCP EOF及短命HTTP thread正常join，兩個owned本機瀏覽器tab結束，viewport reset。不終止外部程序。發佈後唯讀稽核本workspace outputs、直接封裝與typed runs；保護最新123／122／121三版。嚴格超七天且exact tag／現場Git archive可重建才列清除候選；草稿、備份、媒體、未知、失敗36／53及QA保留。沒有候選就不清除。遠端合併、兩個release assets實際下載bytes／SHA、最終稽核以 outputs/v123-qa 的成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。此輪完成一版進展，滾動goal仍active。


## v0.122.0 回到目前待辦

歌曲單段、分鏡單鏡與歌詞單句的工具列新增「回到目前待辦」。檢查並成功定位後，手動查看其他欄位可直接返回最後成功位置；只有一項待辦時，上一項／下一項停用，返回仍可用。共享純 issue-cursor 提供 canReturn／returnCurrent，重用原來源與 revision 核對、onLocate、頁面 reveal 及原欄位 focus；不前進 cursor、不改原文／時間／媒體。未定位、零待辦、來源失效、busy、隱藏或無選列停用；新 report revision 清除位置，精確回復來源可接續舊位置。歌詞手動換頁後返回原 global 明細所在頁，沿全部計數／前200保留明細。三個 DOM adapter 只綁定原生按鈕與狀態；沒有新 asset、operation、POST、模型或路徑權限。產品122／唯一交付 policy38–122共85，未知123拒絕；20／27 tools、原27組 schemas、Agent1／draft3及其他領域契約保持。

Repo已獲使用者當次授權公開，四個FreeTWAI新作品公開介紹頁已建立；平台目前為作者自行聲明、尚未核實，正式收錄仍需另行審核。保留PLATFORM-STATUS.md／json的2026-10-06實際觀察與四個網址，不重複提交、不宣稱取得創始認證。PolyForm Noncommercial 1.0.0、LICENSE／NOTICE、創辦ZOE. G／GitHub djguan-jpg保持。

619 Python（101.640秒）、1502 JavaScript、137 syntax與4個專案 Skills通過；新增18個JS測試、0 Python。單項邊界、任意原index含199、canReturn DTO隔離、stale／busy／hidden／missing selection、revision／count改變、false／throw focus及retry、定位期間來源失效與跨頁返回均覆蓋。上一版v121指定source ZIP（2245849 bytes、SHA a93b23de06079f0e5ca1dfbec3379417f598505358823c6c48c3aec6b859c594）實際還原619／1484，暫存還原移除。四scope×84個歷史producer的336份ZIP／manifest bytes相同，舊27組operation input/output schemas不變；八份既有whole lyrics Python data／files與JS data／Markdown及跨語言診斷相同，只更新產品meta。封裝器另對指定source commit的解出原始碼執行完整檢查，結果與SHA留本機manifest。

原生工作台先重現只有一项待辦時缺少直接返回入口。v122保留47份唯讀快照；10組功能返回加10組排版返回逐組核對完整創作DOM原值、stable row IDs與原生File身份。歌曲第40段的首／末與唯一待辦、鏡頭2的開始／母題引用、歌詞220開始／結束、精確來源復原、歌詞221的21／200跨頁與200／200末項均成功，總計219項只保留前200。Enter與滑鼠均實際定位；來源改動／新revision／零待辦／換台／未定位停返回，建立新報告不自動搶焦點。合成8秒WAV保持暫停0.5秒，返回不seek；其他工作台及原文保持，console warn/error零。未把DOM原值比對宣稱為完整持久草稿bytes驗證。

1280×720、390×844、720×900、1280×360共10組排版返回，活動欄位在viewport內、低於可見sticky工具列；低高度工具列static、頁寬未超過viewport。重用既有幾何與CSS，本輪沒有修改app.js或style.css。PNG留忽略QA目錄；只做原生操作與唯讀幾何，不宣稱完整視覺或screen reader接受。

實際工作台單句報告含219項，完整JSON及Markdown與application相同；CLI完整檔案bytes相同、exit2，重覆輸出exit1且原bytes保持，無效row拒絕／無輸出。Agent與MCP good-bad-good及短命HTTP 200／400／200完整成功回覆一致，四個既有固定JS GET與來源bytes相同。子程序取得EOF，短命HTTP thread正常join；兩個owned有界QA server正常停止、實際session EOF exit0，兩個owned瀏覽器tab關閉與viewport reset。native server沒有延遲注入，busy／無選列返回保護由純controller及三個DOM測試驗證。

首輪完整JS兩項失敗來自既有cue fake DOM未建立新增return按鈕，補齊fixture後1502全過；實際產品沒有因這兩項失敗改動。首次長句合成資料的end0.5沒有重疊，因此下一項停用；保留零待辦失敗觀察，明確改end5後才驗21／200與200／200。草稿原生下載事件等待5秒沒有取得落盤路徑；UI仍顯示「下載已送出，請核對」，沒有按確認、沒有把sent當saved，也沒有用CLI檔案冒充瀏覽器下載。

分支 `codex/iteration-v0.122.0`、基線main `1d428e2103687c92a14918d035e5d329b787d54f`、還原tag `restore-v0.121.0-before-v0.122.0`。由tag建立codex/restore-*分支經PR還原原始碼；不改草稿／素材，不撤銷已公開Repo或已送出的外部申請。指定source commit封裝，merge tree、遠端refs、公開release兩個assets實際下載bytes與SHA另留outputs/v122-qa。GitHub CI未設定，本機與指定source封裝檢查分開記錄。

只唯讀盤點本workspace outputs、直接release封裝與typed owned runs；發佈後最新122／121／120三版保護。嚴格超七天且exact tag／現場Git archive可重建才列清除候選；未知檔、素材、草稿、備份、失敗36／53及失敗QA保持。各session實際EOF後才最終稽核，不終止外部程序。瀏覽器落盤下載、完整視覺／screen reader、實聽／實際音畫同步、Host安裝及平台創始核實仍未驗證。

見[契約](docs/ISSUE-RETURN.md)。以下保留歷史迭代。

2026-10-06：Repo 已依使用者授權公開，四個新專案均已送出自由工坊並建立公開介紹頁；原作者為自行聲明、尚未核實，PolyForm 非商用授權保持。最新實際狀態與網址見 [PLATFORM-STATUS.md](PLATFORM-STATUS.md)；下方版本中的 private／not_submitted 為各次提交當時的歷史快照。

## v0.121.0 目前待辦原因與位置

單鏡、單段與單句工具列現在顯示最後成功定位待辦的原位置、欄位、原因及關聯列，讓長表格編修時也能知道正在處理什麼。純 issue-summary 只格式化有界嚴格 JSON metadata；三個 DOM adapter 共用清單與工具列文字，在來源失效、busy、隱藏、無選列、未定位或新 revision 時清除說明。回復精確來源可恢復上一個成功位置；不因手動焦點改動重寫 cursor。說明換行後由 app 重新量測活動欄位，僅對已活動的原欄位調整捲動，不重新聚焦其他控制。實際窄畫面發現單鏡長待辦按鈕造成31px溢出，改為有界換行；空鏡頭選列也停用清單與 cursor。新增一個固定 GET asset，沒有新 operation。產品121／唯一交付policy38–121共84，未知122拒絕；20／27 tools、旧27組schemas、Agent1／draft3與其他domain保持。

619 Python（100.000秒）、1484 JavaScript、137 syntax、4 Skills與diff通過；新增31 JS、0 Python。上一版v120指定source ZIP（2223876 bytes、SHA 8f68ce674539114811517e1faea16460a7b04231cf4150a0c1482e7731194052）實際還原619／1453，暫存還原移除。四scope×83個歷史producer的332份ZIP／manifest bytes保持；舊27組operation input/output schemas與20／27 operations集合相同。八份whole lyrics Python data／files、JS data／Markdown與跨語言診斷相同，只更新產品meta。31新測試含Unicode／首尾空白／literal HTML、exact keys、getter不讀、hidden／symbol拒絕、容量、stale／busy／hidden／empty selector、false／throw focus、新revision／零待辦與exact restore；app原函式VM驗證toolbar增高後只移活動欄位，adapter layout錯誤保留已成功cursor。

原生39份快照，31組完整草稿只排除saved_at比較，加3組刻意換台的完整panels比較。17個清單／mouse／native Enter診斷定位与4個追加排版定位通過。221句合成資料：原句220有2→1→0項，原句221有220關係／200保留明細，20→21跨頁後說明按原global位置一致；無效作品時長定位全局宣告。歌曲第40段的五項待辦與鏡頭2的開始／母題引用／人物狀態均顯示與清單相同的字面說明。busy、未定位、來源編修與換台隱藏清除說明；原值、stable IDs與選列精確回復恢復舊cursor，手動名稱欄焦點及返回導覽按鈕不被搶走。原生File身份、暫停0.5秒／總長8秒合成WAV、其他工作台與原文保持，console warn/error零。

排版補驗6份唯讀快照：390×844原頁寬421，實際溢出者為單鏡母題診斷button；scoped max-width／white-space／overflow-wrap修正後頁寬375，長診斷文字完整換行。390×844、720×900、1280×360再驗母題與人物狀態，沒有橫向溢出、原panels一致；活動欄位在viewport內且低於可見sticky工具列，低高度回static。首輪未修CSS的窄分鏡失敗證據保留，不能作為通過證據。PNG留忽略QA目錄，幾何與實際輸入不代表完整視覺或screen reader接受。

四組CLI input與原draft3句號220／221的exit2／2／0／2，完整files依各自原payload bytes一致；重覆輸出exit1保留原bytes、invalid／missing row／input row override拒絕且不建輸出。Agent／MCP四組good-bad-good與12筆短命HTTP完整回覆一致；native四份回覆count2／1／0／220，五個固定JS GET與原bytes相同。JSON鍵序不作來源證明。所有子程序取得EOF；兩個owned有界QA server正常停止，另HTTP thread正常join；兩個owned瀏覽器tab關閉／viewport reset。

首批31 focused測試7失敗：一個揭露單鏡empty selector尚可移cursor的實際缺陷，已修正；六個為cue合成測試錯用visual而非start的fixture，修正後31全過。首批完整JS的一個歷史版本數量仍寫83，改為84後1484全過。合成草稿首批motif ID不符motif-N，未載入瀏覽器，改為motif-1後validate_draft通過。追加layout helper第一次被JSON字串序列化，Python僅讀到字串，exit0但未建立server身份；改用exclusive raw source的新helper後才啟動第二phase，沒有把空輸出算server完成。唯讀證據彙整曾把3組跨台panels比較併入完整draft計數；另留修正證據，正式採31＋3，不覆蓋原紀錄。

Skills章節更新第一次插在frontmatter第一行之後，提交前quick validator拒絕YAML；沒有建立source commit。以本工作區上一版四份原frontmatter還原，在正式heading之後插入新章節，四份重新驗證通過才提交。

分支 `codex/iteration-v0.121.0`、基線main `670977695ef74f7b835dac6d94a5f65d1ac53180`、還原tag `restore-v0.120.0-before-v0.121.0`。由tag建立codex/restore-*分支經private PR還原，保留main歷史、原素材與草稿。固定source commit建立ZIP／SHA；merge tree、四個遠端refs與實際release兩個asset下載bytes另留outputs/v121-qa。GitHub CI未設定，測試為本機與封裝版實際檢查。

本輪只唯讀盤點本workspace outputs、直接release封裝與typed owned runs；最新121／120／119三版保護。嚴格超七天且exact tag／Git archive可重建才列清除候選，未知檔、素材、草稿、備份、失敗36／53及失敗QA保持。取得各session實際EOF後再做最終稽核，不以bare PID終止外部程序。瀏覽器保存下載、完整視覺／screen reader、實聽／實際音畫同步、Host安裝與FreeTWAI創始接受未驗證。PolyForm Noncommercial 1.0.0／private、創辦ZOE. G／GitHub djguan-jpg保持，FreeTWAI not_submitted。

见[契約](docs/ISSUE-SUMMARY.md)。以下保留歷史迭代。

## v0.120.0 單句逐項導覽

選定歌詞新增「重查這一句／上一項單句待辦／下一項單句待辦」工具列，成功定位後同步目前明細頁；修正長表格需返回上方清單逐項處理的操作缺口。純 issue-cursor 明確 maxDetails 1–200，舊鏡頭／段落預設32保持；純 issue-page.reveal 核對 revision／可定位狀態及兩次metadata後，顯示選定保留項所在頁。單句沿原200明細／20頁內項與全部issue_count，頁面／cursor／焦點不改時間或進draft。可見黏附工具列與既有field-position共用幾何，global作品宣告忽略畫面外工具列；高度≤400px回普通流。產品120／唯一交付policy38–120共83，未知121拒絕；20／27 tools、舊27組schemas與Agent1／draft3保持。

619 Python（100.672秒）、1453 JavaScript、136 syntax、4 Skills及diff通過；新增24 JS、0 Python。原v119指定source ZIP（SHA 9bb573cb7cc9c301dfa9ab8de3b55679678a857b4c008d0b951466ee8a6f89ed、2204492 bytes）還原619／1429；四scope×82個歷史producer的328份ZIP／manifest bytes相同。舊27組operation input/output schemas及operations集合保持，沒有新增operation或靜態asset。八份既有whole lyrics Python data／兩檔bytes、JS data／Markdown及跨語言來源診斷保持。新tests驗證全200項跨10頁再返回、手動翻頁不移cursor、false／throw focus不前進、metadata二次改變／late revision／getter不讀、legacy32與明確200、invalid capacity在capture前拒絕；VM focus helper與實際native驗證分開。

原生37快照／28組完整草稿僅排除saved_at比較，12個mouse／native Enter定位通過。221句合成來源：原句220的2／1／0完整報告；長句221有220關係，只保留200明細，20→21自動切第二頁、previous回20第一頁、手動第二頁cursor仍20，選33後next34跨舊32上限。其他句編修與原生focus改選句使舊定位失效；原值、IDs與選句精確復原後恢復34／200；重查新revision回第一頁與未定位。global無效duration增加為221項，next到作品宣告；画面外工具列不當成覆蓋。busy／hidden／stale停用、selected零提示完整歌詞包與實聽保持。Unicode／首尾空白／其他三台、原生File身份、暫停0.5秒及8秒合成WAV保持，console warn/error零。1280×720、390×844、1280×360都無頁面水平溢出；活動欄位在viewport內且低於可見工具列，低高度CSS static。PNG留忽略QA目錄；幾何與實際mouse／鍵盤不代表完整視覺或screen reader接受。

四組CLI input與draft3原號220／221，exit2／2／0／2、完整files按自己的payload比較；重覆輸出exit1保留bytes、invalid row／missing row／input row override拒絕且不建輸出。Agent／MCP四組good-bad-good、12筆ephemeral HTTP與五個現有固定JS bytes一致，native四份完整回覆count2／1／0／220。JSON鍵序按各自原source輸出，語義data與Markdown相同，不把鍵序當來源證明。所有子程序EOF、HTTP thread正常join與owned QA server正常停止，tab關閉／viewport reset。

見[契約](docs/LYRICS-CUE-NAVIGATION.md)。以下保留歷史迭代。

## v0.119.0 選定歌詞校時待辦

選定歌詞待辦共用 lyrics_review 的完整來源與時間分析，先依原句／作品時長篩選再套200明細上限；全部原句仍參與重複開始與horizon重疊核對。新增獨立 lyrics_cue_review schema1、application／CLI／HTTP／Agent-MCP，20基本／27明確啟庫，舊26組schemas保持。單句report只帶選定cue與title／duration，不帶整份歌詞；source controller核對整份原值、stable IDs與選列，其他句子也可使舊位置失效。檢查／報告不改原文、時間、音檔或草稿；零待辦仍須完整歌詞包與實聽。產品119／唯一交付policy38–119共82，未知120拒絕；Agent1／draft3及其他schemas保持。

619 Python（86.844秒）、1429 JavaScript、136 syntax、4 Skills與diff通過；新增8 Python／16 JS。原v118指定source ZIP還原611／1413；324歷史ZIP／manifest bytes及原26組schemas一致，新增operation只有lyrics_cue_review。八份既有whole lyrics Python data／兩檔bytes、JS data／Markdown及跨語言完整診斷保持。120句留白基線共240待辦，whole前200明細沒有原句120；新單句兩項可直接定位。10000句horizon長重疊，選定句9999關係全部計數，前200明細、256KiB JSON及2MiB wire有界。原生28快照／22組完整草稿僅排除saved_at比較，原句120的2／1／0報告、mouse開始與Tab結束、選列失效／復原、相同文字換序／撤回stable IDs、其他原句重複開始與重疊關聯row1、global時長待辦、busy／hidden／stale停用通過。選定零待辦時，whole仍238項；不能當整表接受。Unicode／首尾空白／其他三台、原生File身份、暫停0.5秒及8秒合成WAV保持，console warn/error零。1280×720及390×844，窄頁面無水平溢出；PNG在忽略QA目錄，未作完整視覺／screen reader接受。CLI input及draft3明確row120的exit2／2／0、重覆輸出exit1保留原bytes、無效input／missing row／input row override拒絕不建輸出；Agent／MCP三組good-bad-good、9筆HTTP及5固定JS bytes一致。draft的JSON鍵序按原source輸出，與native input逐語義data及Markdown相同，自己的完整files按自己的payload核對；不把鍵序當來源證明。

中途錯誤證據保留：初次Python dotted test module路徑、app整合漏右括號、focused DTO fixture、QA草稿options key及snapshot player ID修正後重驗；舊discovery數量／ordered tools／supported length fixtures更新，修正fixture縮排；首次全JS八項由新增controller未加入VM fixture與舊app文字pattern造成，四個fixture同步後剩一個pattern，再修正後1429全過。Python已619通過且其來源未再改，JS重試沿用該成功結果。初次runtime把不同JSON鍵序的draft輸出當native字面bytes比較而失敗；新獨立runtime paths按同一payload核對完整files，再比語義data／Markdown，四adapter通過。失敗紀錄與部分輸出保留，不冒充成功。

見[契約](docs/LYRICS-CUE-REVIEW.md)。以下保留歷史迭代。

## v0.118.0 歌詞診斷完整核對

歌詞校時診斷先以共用strict JSON值核對來源，再讀取欄位與建立隔離副本；getter、稀疏陣列、隱藏／symbol／undefined／無效Unicode拒絕。完整回覆精確核對root data／files／meta、當前唯一產品版本、protocol1及needs_review=true，再核對完整report與JSON／Markdown，checkedResult交付自有data／files副本。舊inspect API保留。Controller將capture放在try內，失敗不送transport，當前pending才釋放；晚回應／錯誤／finally不覆蓋後續工作。原request可省略title／duration，僅report明示既有defaults；時間規則與診斷格式保持。19基本／26啟庫、原26組schemas及Agent1／draft3／review1保持，沒有新operation或GET。產品118／唯一policy38–118共81，未知119拒絕。

611 Python（95.266秒）、1413 JavaScript、134 syntax、4 Skills與diff通過；新增16 JS。v117基線接受未知產品版本及未知root／meta，source getter讀4次、reply getter讀3次，稀疏一列可錯稱timing_checked；新純模型拒絕上述值且測試getter零次讀取。初次完整JS有兩項舊成功fixture缺少version或寫死0.90.0，改為唯一current完整metadata後1413全過，失敗記錄保留；Python已過且來源未再改，不重跑。原v117指定source ZIP還原611／1397，320份歷史ZIP／manifest bytes及原26組schemas一致；八份既有Python report data／兩檔bytes和JS data／Markdown一致，跨語言相同，只有產品meta.version變更。原生22快照／18組完整草稿僅排除saved_at比較，三種錯誤回覆拒絕並保留上一份完整files／report／result revision，busy停用與正常retry恢復通過。四份正常回覆，完整1／4／0診斷；原生滑鼠定位句1開始與Tab到結束，Unicode／首尾空白／literal文字、stable IDs及其他三台保持。1280×720及390×844，窄頁面無水平溢出；PNG在忽略QA目錄，未宣稱完整視覺／screen reader接受。CLI input exit2／2／0、重覆輸出exit1保留原bytes、無效input exit1不建目錄，Agent／MCP三組good-bad-good、9筆HTTP及3固定JS bytes一致。lyrics-review CLI仍只接受input，本輪未新增draft入口。原生File身份、暫停0.5秒及8秒合成WAV保持，console warn/error零。一個bounded QA server、一個ephemeral HTTP thread、實際子程序及owned tab正常結束，viewport reset。瀏覽器保存下載、完整視覺／screen reader、實聽、媒體同步、Host安裝與FreeTWAI創始接受未驗證。

見[契約](docs/LYRICS-REVIEW-GUARD.md)。以下保留歷史迭代。

## v0.117.0 單段逐項定位

歌曲單段待辦新增工具列「上一項／下一項／重查這一段」。共享 issue-cursor 只保留report revision／有界index，明確定位成功才前進；重查重設而不自動搶焦點，來源／stable IDs／選擇／busy／換台拒絕舊定位。共用純 editor-field-position 幾何與既有shot wrapper，明確focus原欄位後核對工具列遮擋；窄視窗維持表格內水平捲動，height≤400px改static流。單段DOM使用注入的literal段落訊息，既有單鏡預設文字與API保持。新增一個固定GET，沒有POST、Agent權限或schema變更；19基本／26啟庫、原26組工具schemas、Agent1／draft3／section-review1／shot-review1保持。產品117／唯一policy38–117共80，未知118拒絕。

611 Python（95.407秒）、1397 JavaScript、134 syntax、4 Skills與diff通過；新增16 JS。原v116指定source ZIP還原611／1381，316份歷史ZIP／manifest bytes及原26組schemas一致；六份既有整首／單段report data與兩檔bytes保持，只有產品meta.version變更。原生34快照／28組完整草稿除saved_at比較、13次實際滑鼠／鍵盤原第40段定位，五欄完整前進／上一項／邊界、list revision單元核對、重查不搶焦點及重設、選擇與同文字換序／精確復原、局部來源編修／全域scope、busy／換台通過。1280×720、390×844、390×500定位欄位在viewport且低於sticky工具列，390×360改static並仍可定位，無頁面水平溢出；PNG保存於忽略的QA目錄，幾何與截圖不冒充完整視覺或screen reader驗收。三份原生完整單段5／4／0 reports均needs_review=true；CLI input／原生draft3 status2／2／0、Agent／MCP三組good-bad-good、9筆HTTP及5固定JS bytes一致。原生File身份、暫停0.5秒及8秒合成WAV保持，console warn/error零。一個bounded QA server、一個ephemeral HTTP thread、實際子程序及一個owned tab正常結束，viewport reset。初次新測試誤讀QA fixture形狀且依賴ignored outputs，改為自建合成raw panel；第二次一項訊息測試用hasReport=false與detailCount=1的不合法metadata，改為正確0／1 transition後41個focused checks及完整檢查通過。初次唯讀觀察helper用message而非status ID，修正後讀取，沒有app變更；失敗紀錄保留。瀏覽器保存下載本輪未重測，完整視覺／screen reader、實聽、媒體同步、Host安裝與FreeTWAI創始接受未驗證。

見[契約](docs/SECTION-ISSUE-NAVIGATION.md)。以下保留歷史迭代。

## v0.116.0 單段報告跨工具

新增「建立單段報告」與唯讀 music_section_review：共用 Python music_review 的 required／numeric 規則，獨立 section-review1 保留原段落1起、總段數與選定五欄原字串；JSON／Markdown 經完整 data／files／meta 核對才提交成果。共享注入 readiness-request 管理來源／晚回覆／取消／重試，既有單鏡 wrapper 沿相同 controller。CLI／Agent／MCP／HTTP 共用 application，19基本／明確啟庫26工具，需重新 discovery；原25組 input/output schemas 不變。產品116／唯一 policy38–116共79，未知117拒絕；Agent1／draft3保持。新增一個固定GET與一個唯讀POST，沒有新路徑、模型、外網或寫入權限。零待辦仍須整首歌曲、總長與實聽驗證。

611 Python（95.657秒）、1381 JavaScript、133 syntax、4 Skills與diff通過；新增8 Python及11 JS。原v115指定source ZIP還原603／1370，312份歷史ZIP／manifest bytes與原25組schemas一致；只新增music_section_review。三份既有整首歌曲報告data及兩檔bytes保持。原生23快照／18組完整草稿除saved_at比較，3次實際滑鼠／鍵盤原第40段focus；5→4→0完整單段報告均needs_review=true，損壞meta拒絕、編修後晚到錯誤保留、取消後成功不提交、當前HTTP錯誤保留再retry、busy／換台保持。原生File身分、暫停0.5秒及8秒合成WAV保持；390×844與390×500欄位在viewport內，工具按鈕換行且無頁面水平溢出。CLI input／原生draft3回读status2／2／0與完整兩檔bytes一致，Agent／MCP三組good-bad-good、9筆HTTP與4固定JS bytes一致。第一次全測的既有MCP subprocess fixture缺新增工具的明確呼叫，更新並完整重測通過；初次短指令把tests當Python package而未執行domain測試，修正discover後通過，兩份失敗證據保留。一個bounded QA server正常結束、ephemeral HTTP thread已join、所有子程序實際EOF，一個owned tab關閉並reset viewport；console warn/error零。瀏覽器保存下載本輪未重測；幾何不是完整視覺／screen reader驗收，實聽、媒體同步、Host安裝及FreeTWAI創始接受未驗證。

見[契約](docs/MUSIC-SECTION-REPORT.md)。以下保留歷史迭代。

## v0.115.0 選定歌曲段落待辦

歌曲工作台新增「檢查選定段落」：即使整份待辦200明細已滿，也能檢查原第40段的五個編曲欄位並定位。既有music-readiness共用規則 → 選定原列／stable IDs的純checkpoint controller → 字面DOM → app原欄位focus分層；不補寫、改原值或提交成果。選擇／順序／選定欄位改變停舊定位，精確復原可接續；其他段落與全域欄位的合法編修不影響這五欄的診斷。零待辦仍需整首歌曲、總長與實聽驗證。產品115／唯一policy38–115共78，未知116拒絕；18基本／25啟庫及原25組schemas、Agent1／draft3保持，新增兩個固定GET。

603 Python（77.235秒）、1370 JavaScript、132 syntax、4 Skills與diff通過；新增15 JS。原v114指定source ZIP還原603／1355，308份歷史ZIP／manifest bytes與25組schemas一致。基線合成40段／209待辦，200明細只到第39段；新純模型與原生第40段五項定位實證通過。28快照／21組完整草稿除saved_at比較，7次實際滑鼠／鍵盤focus；5→4→0選定明細、選擇／同文字換序撤回／編修重查／busy／換台／其他來源編修，原生File身分、暫停0.5秒及8秒合成WAV保持。390×844與390×500欄位在viewport內，表格水平捲動；幾何不冒充完整視覺。兩份原生整首209／204完整報告與共用application一致；CLI input／實際draft3、Agent／MCP good-bad-good、6筆HTTP完整核對及3固定JS bytes一致。第一次全測10個隔離VM fixture缺新controller宣告或包含新增binding，已更新邊界／宣告並完整重測；第一次原生證據helper把選音檔前快照當成媒體保持基線，fresh helper按明確快照／選音檔後範圍核對，原失敗保留。兩個owned bounded server phase正常結束、兩tab關閉。瀏覽器保存下載本輪未重測；完整視覺／screen reader／實聽／媒體同步／Host安裝與FreeTWAI創始接受未驗證。

見[契約](docs/MUSIC-SECTION-REVIEW.md)。以下保留歷史迭代。

## v0.114.0 單鏡待辦逐項定位

單鏡待辦新增固定工具列的上一項／下一項與重查入口；純issue-cursor管理report revision／index與邊界，DOM沿原來源核對定位原欄位。新報告不自動定位，來源／選擇／順序／busy與換台停舊位置。共享focusShot以純shot-field-position計算目前欄位與工具列遮擋後的捲動；短視窗工具列改static。既有25組工具schemas、18基本／25啟庫、Agent1／draft3／shot-review1及POST保持；新增兩個固定GET。產品114／唯一policy38–114共77，未知115拒絕。

603 Python、1355 JavaScript、130 syntax、4 Skills及diff通過；新增24 JS。原v113指定source封裝還原603／1331；304份歷史ZIP／manifest bytes及25組schema一致。原生第100鏡／120鏡驗證直接清單與工具列handoff、鍵盤／滑鼠逐項、首末邊界、選擇與同內容移動撤回、編修後停舊定位與重查、busy停用、10／9／0三份報告，完整草稿／原生File／0.5秒暫停與8秒時長保持。原型camera欄位y912–973超出720px viewport；修正後y463–524在固定工具列下方，另驗390×844／390×500，短視窗static。CLI input與原生draft3、Agent／MCP good-bad-good／9筆HTTP完整一致，5個固定JS bytes一致。第一次全測僅舊76版本fixture失敗、已改77並完整重測；compatibility首次複製腳本指錯來源路徑，fresh attempt通過；原QA頁reload未完成，核實仍舊函式後保留證據、另開頁驗新模組。兩個owned server phase均正常結束，兩個測試tab關閉。瀏覽器保存下載本輪未重測，仍未驗證；幾何與鍵盤操作不冒充完整視覺／screen reader／實聽／音畫同步或平台創始接受。

見[契約](docs/SHOT-ISSUE-NAVIGATION.md)。以下保留歷史迭代。

## v0.113.0 選定鏡頭回覆與請求分層

選定鏡頭報告先核對完整回覆的 JSON 值與來源，再交給獨立注入式 request controller 管理成功、錯誤、來源改變、取消及重試；DOM 僅提交已核對成果。舊請求不能結束新請求的 pending 狀態或覆蓋新成果。原 25 組工具 schemas、18 基本／25 啟庫工具、Agent1／draft3／shot-review1 保持；僅新增一個固定 GET 資產，既有 POST 與授權邊界保持。產品113／唯一 policy38–113共76，未知114拒絕。

603 Python、1331 JavaScript、128 syntax、4 Skills 及 diff 檢查通過；新增15 JS 測試。原 v112 指定來源封裝還原603／1316通過；300份歷史ZIP／manifest bytes及25組工具schema一致。原生第100鏡／120鏡的完整草稿與原生File身分核對，損壞meta回覆拒絕、編修後晚錯誤忽略、成功與錯誤取消後成果保持、当前HTTP錯誤與重試驗證；音檔仍暫停0.5秒／總長8秒。CLI input／原生draft3、Agent／MCP good-bad-good與6筆直接HTTP一致，3個固定JS資產bytes一致。窄390px僅幾何檢查；瀏覽器下載click送出但事件逾時，保存檔案未確認。完整視覺／screen reader／實聽／音畫同步與FreeTWAI創始審核仍未驗證。

見[契約](docs/STORYBOARD-SHOT-REQUEST.md)。以下保留歷史迭代。

## v0.112.0 選定鏡頭待辦

新增選定原鏡號的必填欄位、方向與母題引用檢查，整份分鏡200明細上限保持。可定位後面的鏡頭，舊選擇／順序／來源與晚回覆不能替換新編修。Python／JS共用既有整份診斷規則，controller暫態與字面DOM分層；CLI／Agent／MCP／HTTP共用同一報告，18基本／25啟庫工具，原24組schemas保持。獨立shot-review1，Agent1／draft3保持；無新依賴／模型／媒體／外網或路徑權限。產品112／唯一policy38–112共75，未知113拒絕。

603 Python、1316 JavaScript、127 syntax、4 Skills及diff檢查通過；新增8 Python／15 JS。原v111封裝原樣還原595／1301；296份歷史ZIP／manifest bytes及原24組schema一致。原生第100鏡10項、後續9項及零待辦報告，定位、選擇／編修、同文字移動撤回、晚回覆保護、其他panel／原生File／0.5秒暫停音檔保持；CLI input／有效原生draft3、Agent／MCP good-bad-good與HTTP回覆一致。首次完整測試發現舊工具數量／清單期待，已更新且保留失敗證據；原生發現初次換台新按鈕未刷新，已補刷新並驗證。瀏覽器下載有送出click訊息，但download事件逾時，未取得保存檔案；不宣稱已保存或完整視覺／screen-reader／實聽驗收。

見[契約](docs/STORYBOARD-SHOT-REVIEW.md)。以下保留歷史迭代。

## v0.111.0

歌曲、分鏡創作與分鏡時間待辦的列ID來源統一使用既有有界讀取層。舊三個控制器用來源some／iterator讀ID，缺項可被prototype補出，自訂iterator能掩蓋ID換序，超64字元ID也被接受；本輪改成原始自有index與固定長度副本，再沿原checkpoint／revision判定定位。

595 Python（84.844秒，兩隔離workers／120秒期限）、1301 JavaScript、125 syntax及四份Skill通過；新增14項JS。基線九個注入來源均被接受，其中三個iterator掩蓋換序；現版六個缺項／超長來源拒絕，三個合法自有ID含iterator的來源正常讀自有index，全部三個換序舊定位拒絕，caller方法／iterator呼叫0。另驗證getter增长只讀初始範圍、failed report／revision保持、恢復原值、64-unit邊界、空列、舊無IDcaller與實際asset先後。v110指定source ZIP原樣還原595／1287；四scope各73個歷史producer，共292份ZIP與manifest bytes相同，24schemas相同。

20個連續原生快照、14組完整草稿除saved_at比較；原欄值、列ID及音檔另核對，details展開屬UI暫態。三報告各第二頁21–40保留200明細，總計200／1200／240；歌曲第5段、創作第3鏡、時間第11鏡焦點正確。同文字歌曲段落與鏡頭換序只換ID順序，舊報告stale並停定位，撤回恢复，重查回第一頁；原成果files保持，明確move仍沿原dirty停下載規則。原File身份／blob及paused／0.5秒／8秒合成WAV保持。

三份native完整wire與application相同；三操作CLI／Agent／MCP good/bad/good與九HTTP回覆完整核對。來源screen_direction保留合法neutral，實際未完成表格可通過draft3，三CLI --draft回讀原值與完整報告一致；診斷exit2不代表作品接受。無效或預設覆寫exit1且bytes保持。自有tab關閉／viewport reset／console0；唯一bounded工作台server正常停止，獨立HTTP thread joined，Agent／MCP子程序EOF0。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。 見[QA](docs/QA-v0.111.0.md)。

## v0.110.0

歌曲欄位、分鏡創作與分鏡時間待辦可用上一頁／下一頁閱讀全部已保留明細，每頁20項、最多200項，超過上限明示全部計數與已保留範圍。先前只顯示前20項；現在可定位後續明細的原欄位。另修正兩個內容相同的鏡頭換序後，舊創作待辦仍被當成原位置的問題：來源核對現在包含本頁列ID順序。

595 Python（84.640秒，兩隔離workers／120秒整體期限）、1287 JavaScript、125 syntax及四份Skill通過；新增8項JS測試。v109指定source ZIP原樣還原595／1279；四種scope各72個歷史producer，共288份ZIP與manifest bytes相同，24組schemas相同。72個保存原生快照中66個有效來源觀測、52組完整草稿除saved_at比較；另外核對原欄值、列ID與媒體，details展開旗標另列UI暫態。三清單各十頁200明細，計數200／1320／240、五次原欄位焦點、三次末頁焦點fallback、390×844兩次Enter、busy／stale／exact-source recovery與重新檢查回第一頁通過。六份native完整wire與application一致；六CLI來源、六Agent／MCP good/bad/good、18HTTP回覆、三份有效觀測draft3的CLI回讀全部一致。診斷exit2、零待辦exit0、無效與預設覆寫exit1保留bytes。

待辦診斷接受部分填寫資料，不表示它一定能保存為draft3。本輪合成部分分鏡的screen_direction空字串不在draft3選項內，候選有效但目前草稿不符時既有replacement snapshot拒絕預覽，完整原內容與成果保持。未放寬選項或自動修補；改用另一完整有效合成來源，才驗證明確預覽／載入。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。 見[QA](docs/QA-v0.110.0.md)。

## 目前 v0.109.0

2026-10-06：歌詞校時與匯出格式的待辦可用上一頁／下一頁閱讀全部已保留明細，每頁20項。原本報告已有最多200項，但畫面只顯示前20项；現版可查看後續明細，點選後定位原欄位，重新檢查回到第一頁。總數超200時明示只保留前200項。

`issue-page.js` 純 metadata 模型與注入 capture controller → `issue-page-dom.js` literal DOM／受控定位 → app 既有完整報告與 stable row IDs。純層只接受 detailCount／totalCount／revision／stale／busy／visible，不持有歌詞、File、DOM或網路；回調核對当前 revision及頁內原明細 index。忙碌或離開歌詞台時停用操作；編修後可唯讀翻閱上一份報告，定位必須重新檢查。翻頁不改原句、時間、音檔、草稿或上一份成果。首末頁按 Enter 後若原按鈕停用，焦點移到另一個可用翻頁按鈕；其他焦點不搶走。

產品0.109.0／唯一 policy38–109共72，未知110拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3及所有領域 schema保持。只新增兩個固定GET資產；HTTP POST、application、Python producer、CLI／Agent／MCP及程序政策沒有變更。沒有新依賴、模型、媒體生成或外網能力。

595 Python（87.875秒，兩隔離 workers／120秒整體期限）、1279 JavaScript、124 syntax及四份 Skill通過；新增9項JS測試。v108指定source ZIP原樣還原595／1270；四種 scope各71個歷史 producer，共284份ZIP與manifest bytes相同，24組schemas相同。47連續原生快照及39完整來源對；校時十頁200明細、格式六頁120明細、最後一頁只有一項、零明細隱藏導航、重新檢查回第一頁、stale唯讀／停定位、busy停翻頁、五次正確原欄位焦點與390×844 Enter操作通過。兩個明確換載區段各保留原File身份與同blob、paused／0.5秒／8秒合成音檔；四次明確文字編修只改單欄且可回復。六份native完整wire與application一致；三操作CLI／Agent／MCP及九HTTP good/bad/good，診斷exit2、無效exit1不輸出、預設覆寫exit1保留bytes。兩階段bounded工作台server均正常停止，自有tab關閉／viewport reset／console0；獨立HTTP thread joined及子程序EOF0。

Windows CIM補查可能在既有3秒operation／5秒helper期限內回傳unavailable；沒有證據就保持unverified並拒絕清除。本輪只修正測試，涵蓋limited及unavailable時均保留資料，以及子程序EOF完成與外部補查是否確認的分離；不放寬程序政策或增加重試期限。早期完整測試與舊版還原遇CIM未確認的失败保留，最後現版595與原封裝v108595／1270均實際通過。

分頁只讀已保留的最多200項，不補取被報告截斷的其餘明細，零待辦不代表全作品或實聽通過。120秒宣告與8秒合成音檔差異刻意保持，不能當成同步驗證。PNG只留ignored outputs；按鈕位置與鍵盤操作已核對，不把幾何視為完整視覺驗收。實際瀏覽器保存、完整視覺、screen reader、各OS IME、實聽、正式媒體、Host安裝及平台創始接受未驗證。獨立preview.html未加入工作台分頁，本輪未改固定預覽嵌入模組。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

## v0.108.0

2026-10-06：回應核對改用保留型別的共用值比較器。三個原文搜尋及歌詞診斷會拒絕以 `1e400` 等非有限數值替換 `null` 的回覆；歌曲／分鏡與歌詞匯出診斷也不再忽略額外的 `undefined` 欄位。異常回覆保留原創作、上一份成果與音檔，修正來源後可重新操作。

既有 `json-document.sameValue` 純層 → 七個來源／完整回覆核對模組 → 原 current revision／scope controller → 原 DOM 與成果提交。比較原型別、完整自有欄位與 dense 陣列，不轉成 JSON 再比較；字面 Unicode、空白、換行及物件鍵順序獨立保持。有限數字、64層容器與262144對節點上限；不呼叫自有 getter、toJSON 或 caller map。Python producer、application、HTTP／CLI／Agent／MCP、app／HTML與操作權限保持，無新 asset、依賴、模型、媒體生成或外網能力。

產品0.108.0／唯一 policy38–108共71，未知109拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3／所有領域 schema保持。

595 Python（80.641秒，兩隔離 workers／120秒整體期限）、1270 JavaScript、122 syntax及四份 Skill通過；新增17個JS測試。v107已驗證 source ZIP還原595／1253；四種 scope各70個歷史 producer，共280份ZIP與manifest bytes相同，24組schema相同。48原生快照、44完整來源對、四組異常拒絕／正常重試對；40段兩頁與返回、首末及三工作台原欄位焦點、390×844定位、未完成歌詞診斷及還原後建立／完整JSON格式報告均通過。17 native完整wire、四個單一nullable欄位異常回覆、11 CLI／Agent／MCP操作及33 HTTP good/bad/good核對；兩observed draft3 reviews回讀、診斷exit2、無效exit1不輸出、預設覆寫exit1保留bytes。兩個明確換載區段各保留原File身份、同blob、paused／0.5秒／8秒合成音檔；console0、自有tab關閉／viewport reset、自有bounded server正常停止、HTTP thread joined及子程序EOF0。

固定歌詞預覽沿 template1全外框與本安裝模組核對。更新共用模組後，舊v107 HTML所嵌模組不同，現版明確拒絕回讀；同完整package的現版HTML通過，舊檔SHA保持，臨時還原移除。保留舊HTML與完整lyrics.json，需要接續時載入完整JSON並重新建立現版預覽；schema沒有遷移。舊版離線HTML仍保留其原程式，本輪沒有重写或宣稱新修正適用於舊檔。

五個外部JSON非有限數字案例與三個runtime額外undefined案例在基線確實誤判一致；undefined不是可在JSON編碼的欄位值。lyrics-preview只統一共用比較器，未宣稱它有上述基線缺陷。own descriptor／dense檢查不代表通用prototype、Proxy、繼承accessor安全或原子快照；比較器遇throw回傳false但未防止任意caller object的全部副作用。節點上限是比較訪問數，非任意外部物件的記憶體上限。PNG留ignored outputs；實際瀏覽器保存、完整視覺、screen reader、各OS IME、實聽、正式媒體、Host安裝及平台創始接受未驗證。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

## v0.107.0

2026-10-06：歌曲段落表新增原文搜尋，查找名稱、敘事任務、聲音配置；每批20段，可前後分頁，點命中直接回到目前原欄位。保留重複段落、原文、小節、能量與音檔。文字、列ID或順序改變清除舊定位；數值編修保留命中，但原成果仍依既有規則停用下載。取消等待保留上一批，晚回覆不覆蓋後來編修或成果。

music_search／原生 music-search 純三欄字面與UTF-8位置、schema1／來源SHA → 共用application → CLI／Agent／MCP／HTTP → 注入current source／query／ID／result revision controller → literal excerpt DOM／native field focus。重用現有嚴格JSON、搜尋請求ownership、摘錄、輸入法Enter政策及editor-focus自有dense IDs核對；新三個固定JS assets。新增唯讀 music_search，17基本／24啟庫工具，需重新discovery；原23組input/output schemas保持。Agent1／draft3／既有交付schemas不改，產品107／唯一policy38–107共70，unknown108拒絕。沒有依賴、模型、媒體生成、外網或auth／路徑權限擴張。

595 Python（80.954秒，兩隔離workers／120秒整體期限）、1253 JavaScript、122 syntax及四Skill通過；新增八Python與21JS測試。v106真source ZIP還原587／1232；276歷史ZIP／manifest bytes相同，23組既有schema相同，只新增music_search。54原生快照、41完整來源對核對原panels／IDs／音檔，兩頁首末及三欄focus、原生Enter、數值保持命中、文字／排序／刪除還原失效、取消／重試／no-match／invalid、晚回覆、390×844定位與七busy操作通過。20 native完整wire、八CLI／Agent／MCP操作及24 HTTP good/bad/good全回覆等於application；兩observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保留bytes。两音檔區段各自原File身份及paused／0.5秒／8秒保持；明確換草稿會重置音檔，另選再核對。console0、一自有tab關閉／viewport reset、一bounded server正常停止、HTTP thread joined及子程序EOF0。

搜尋不是歌曲完成、時間校準、實聽或權利接受；只按固定name／focus／texture順序列每段第一個字面命中。大小寫精確，不正規化或regex；開始原列1起，接續需來源SHA。原生下載點擊顯示已送出，但內建瀏覽器10秒未回報download事件，實際保存未驗證。PNG留在ignored outputs；完整視覺、screen reader、各OS IME、正式媒體、Host安裝與平台創始接受未驗證。不宣稱通用prototype／Proxy／accessor安全或外部改寫原子保證。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

## 歷史進度 v0.106.0

## 目前 v0.106.0

2026-10-06：修正共用編修焦點來源驗證跳過空洞 ID、接受繼承的數字位置，或被來源自訂 mapper 替換列 ID 的問題。完整自己的 ID 位置才可進入定位與選列；錯誤來源拒絕，正常請求可繼續。原生 UI 本來產生完整 ID 陣列，本輪沒有宣稱瀏覽器內存在惡意回呼或外部漏洞。editor-focus.checkedSource 純有界 length／own-index／ID 字串及唯一性檢查 → 隔離 dense ID 副本 → 原 index／ID proposal 與兩capture controller → 未改 editor-focus-dom。editor-selection 共用同一來源再沿原三capture／actual-after與DOM；不呼叫 caller map／iterator。固定原 length 控制讀取次數，讀完長度改變拒絕，不因 getter 增長超出上限。產品0.106.0／唯一 policy38–106共69／unknown107拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模型，app／HTML／DOM／domain/application/server/adapters與固定資產清單無diff，沒有新依賴、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

587 Python（99.063秒，兩隔離 workers／120秒整體期限）、1232 JavaScript、119 syntax、四份 Skill 通過；新增六 JS 測試。基線63案例錯誤接受，修正後全部拒絕或正確複製：六list的空洞／首中末缺列／delete slot／inherited index、caller map、index／ID focus及被替換空洞的second capture，另三list繼承來源的選列。正規請求good/bad/good保持；first／second capture拒絕不調focus/select，selection第三capture拒絕不回滾既已發生的外部操作。v105真source ZIP還原587／1226；272歷史ZIP／manifest bytes相同、23組schema相同，相容QA按scope分批，每批約129–130KiB且小於512KiB。57原生快照核對六集合完整原值刪除／還原與同列焦點、三完整來源選列對、三句清空到新增按鈕再完整還原、390×844 Enter原值保持、七busy來源對。七native完整wire、七CLI／Agent／MCP操作及21HTTP good/bad/good全回覆等於application；兩observed draft3 reviews回讀、預設覆寫1保留bytes、invalid1無輸出、diagnostic2保持。全部已选音檔快照保持同blob／paused／0.5秒／8秒及最終原File身份；console0、一tab關閉／viewport reset、一bounded server正常停止、HTTP thread joined與子程序EOF0。异常metadata僅以純注入回呼測試，普通DOM產生dense自有IDs；不宣稱外部可利用漏洞、通用prototype/Proxy/accessor安全或原子快照。PNG留ignored outputs；完整視覺、screen reader、各OS IME、瀏覽器保存、實聽、正式媒體、Host安裝及平台創始接受未驗證。


## v0.105.0

2026-10-06：歌曲段落選單新增「查看選定段落」，按一下或以原生 Enter 將焦點移到目前選定段落的名稱欄。首、中、末段與排序、複製、刪除還原後均按目前列 ID 定位；空清單或等待中停用。查看保留創作原文、順序、撤回紀錄、成果下載與音檔。editor-focus 純 byId 完整來源驗證與目前 ID 提案 → injected request controller 兩次 metadata capture 核對列序／visible／busy → 原 editor-focus-dom 依 ID 查實際名稱欄並核對可聚焦狀態 → app 原生 type=button／aria-controls／點擊。新 focusId 與原 index focus 共用 controller，保留原空列 add 行為；ID 查找不回退到新增。沒有新 keyboard listener，Tab／Enter 使用原生按鈕。產品0.105.0／唯一 policy38–105共68／unknown106拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模組及 app／HTML，沒有新增静態 asset、依賴、domain/application/server/adapter operation、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

587 Python（97.329秒，兩隔離 workers／120秒整體期限）、1226 JavaScript、119 syntax、四份 Skill 通過；新增八 JS 測試。v104 真 source ZIP 還原587／1218；268份歷史交付 ZIP／manifest 完全相同、23組 schema 相同。65原生快照包含15完整來源不變與同 ID 名稱欄焦點對、七 busy／完整來源對；排序後定位及編修後撤回、複製／刪除還原、40段首中末、空清單停用、原生Tab與Enter、390×844定位均通過。查看已建歌曲包後成果及下載保持。七 native 完整回覆、七 CLI／Agent／MCP 操作及21 HTTP good/bad/good 等於 application；兩 observed draft3 reviews 回讀、預設覆寫1保留bytes、invalid1無輸出、diagnostic2保持。兩選音檔測試區段各保留自身原 File 身份與0.5秒paused／8秒合成來源；草稿明確換載會重置音檔，最後另選再核對。console0、兩自有 tabs關閉／viewport reset、兩bounded servers正常停止；HTTP thread joined與子程序EOF0。Native驗證限本輪Chromium；截圖留在ignored outputs，焦點幾何不是完整視覺驗收。screen reader、各OS IME、瀏覽器實際保存、實聽、正式媒體、Host安裝與平台創始接受仍未驗證。沒有新增AI或媒體生成。本輪不宣稱通用metadata安全補強或外部同時改寫的原子保證。


## v0.104.0

2026-10-06：指定位置移動的成功通知只在實際列順序、選列與原始請求一致時發出。修正注入回呼能修改共用提案、使錯誤排列或選列被判為成功的問題；普通瀏覽器 adapter 並未修改此提案。本輪隔離回呼資料，歌曲、分鏡及歌詞的原按鈕／Enter、原文與時間、逐鏡展開、同列焦點及後續編修撤回保持。editor-position 純五欄來源／排列提案 → injected controller 保留自有 expected → writer 專屬六欄 DTO（before 五欄及 ids、afterIds 另複製）→ 原 raw-source order controller → 原始 expected actual-after → 固定原始位置通知。button／Enter 共用 finish；允許回呼修改自己的副本，不以 freeze 改變回呼介面，保留讀取次數與原 current-before／after-consume／false writer 語義。拒絕不符時不覆蓋或回滾外部編修。產品0.104.0／唯一 policy38–104共67／unknown105拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改一個純控制器，沒有 DOM／app／server／adapter、固定資產清單、依賴、路徑或網路權限變動。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

587 Python（97.813秒，兩隔離 workers／120秒整體期限）、1218 JavaScript、119 syntax、四份 Skill 通過。四新增 JS 測試逐一涵蓋三列表及 button／Enter：變更或替換預期排列、偽選列、全提案欄位與巢狀陣列改動、舊提案保留至下一次移動、capture 反向修改回呼副本；正確原寫入與通知保持。基線18個回呼案例確實誤判成功，修正後錯誤 actual-after 拒絕，外部資料保留。v103真 source ZIP 還原587／1214；264份歷史交付 ZIP／manifest 完全相同，23組 schema 相同。53原生快照核對六完整 raw-ID 排列／撤回與同 selector 焦點、三後續列編修撤回、三同位置 Enter 的原值／revision／retention 保持、七 busy 控制與完整來源保持。七 native 完整回覆、七 CLI／Agent／MCP 操作及21 HTTP good/bad/good 全回覆等於 application；兩 observed draft3 reviews 回讀、預設覆寫1保留 bytes、invalid1無輸出、diagnostic2保持。原 File 身份與0.5秒paused／8秒合成音檔保持，console0；一個自有 tab 關閉、viewport reset、bounded server 正常停止，子程序 EOF0及 HTTP thread joined。回呼改動是純控制器注入測試，未宣稱瀏覽器內有惡意回呼或外部可利用漏洞。實際瀏覽器只用 native 操作；CDP唯讀，PNG留在 ignored outputs。完整視覺、screen reader、OS IME、保存成功、實聽、正式媒體、Host安裝與平台創始接受仍未驗證。


## v0.103.0

2026-10-06：修正歌曲「移至第幾列」按 Enter 誤建立歌曲包、沒有移動的問題。歌曲段落、分鏡與歌詞的位置欄現在可輸入最終列號後按 Enter，一次移動同一列。空白、無效或相同位置的普通 Enter 保留原文字、游標與撤回紀錄；原按鈕仍可用。成功後焦點回到同一選列，原文、時間、逐鏡展開及音檔保持；後續編修撤回與舊成果停下載保持。editor-position 純 strict gesture／none-hold-move intent → 原五欄metadata proposal／injected current-before-consume + current-after-consume + actual-after → editor-position-dom 自有可編輯INPUT keydown／preventDefault／focus → app 原完整raw-source order controllers。request button與enter共用finish，不新增history。只有自有當前位置input普通Enter消費default；IME／229、修飾鍵、其他鍵與已消費事件保持原生，repeat只消費不移動。純來源visible／busy也核對；失敗不回滾或宣稱成功。九原listeners加三keydown共十二，dispose只移除自身。產品0.103.0／唯一policy38–103共66／unknown104拒絕。16基本／23啟庫工具、23既有input/output schemas、Agent1／draft3保持；沒有新增assets、server／app diff、POST operation、依賴、路徑、模型或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。587 Python（92.344秒，兩隔離workers／120秒整體期限）／1214 JS／119 syntax／四Skills通過，新增十JS測試與既有HTTP資產ARIA核對。v102真source ZIP還原587／1204；260歷史ZIP／manifest bytes相同，23既有schemas相同。57最終來源原生快照：12完整raw-ID排列、六同選列selector焦點比較、六忽略Enter完整panel／IDs／revision／retention／focus及caret比較、七busy disabled與完整source比較。三工作台移動後編修再撤回保留新文字；相同位置Enter保留原undo；原按鈕、首列／中間／尾列、390×844 Enter、dirty成果及晚報告保持後來片名通過。前37份只有能力GET與先前已完成的一份回覆，沒有新增建包請求。全部57份保持原音檔blob／paused／0.5秒／8秒，最終同File身份、console0。九native完整HTTP回覆（含gate補強前一份lyrics、最終七operations及一份刻意late timing）、七operations實際CLI／Agent／MCP與21直接HTTP good/bad/good等於application；兩observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保持bytes。兩bounded servers正常停止、兩自有tabs關閉／viewport reset、HTTP thread joined與子程序EOF0；PNG與合成素材留ignored outputs。完整視覺、screen-reader、Windows原生IME、瀏覽器保存成功、實聽、正式媒體、Host安裝及平台創始接受未驗證。原生repeat／composition／修飾Enter的事件政策以純／DOM測試核對，沒有宣稱完整OS输入法驗收。Native證據限本輪Chromium；重新排列不自動修正時間或生成媒體，仍需完整創作驗證。最終盤點依本輪收據；latest103／102／101保護，rolling active。


## v0.102.0

2026-10-06：歌曲段落、鏡頭及歌詞句新增「移至第幾列」與「移至指定位置」。輸入最終列號，一次移至首列、中間或尾列；其他列保持相對順序，原文、原時間、逐鏡展開狀態與音檔保持。撤回只還原最近順序，保留後續欄位編修；移動後舊成果停下載，重新建立才恢復。entry-order 純 arbitrary insertion／dense inverse → editor-position 純 metadata view／proposal／injected current + actual-after controller → editor-position-dom 自有九 listeners／literal ARIA／selected selector focus → app 原完整 raw-source order controllers。editor-order／music-arrangement 的 moveTo 共用原 history；歌曲移動及撤回增加完整來源的寫入前、實際 after 核對，拒絕 sparse sources／forged inverse。position 原字串是暫態 data-view-control，不修改 draft／revision；原操作仍完整驗證創作與時間。產品0.102.0／唯一 policy38–102共65／unknown103拒絕。16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持；只新增兩固定 GET assets，沒有新 POST operation、路徑、模型、依賴或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。587 Python（91.250秒，兩隔離 workers／120秒整體期限）／1204 JS／119 syntax／四 Skills通過；新增21 JS與兩Python檢查。v101真source ZIP還原585／1183；256歷史ZIP／manifest bytes相同，23既有schemas相同。51修正版原生快照：14完整raw-ID排列、五selected selector焦點比較、兩原文字欄caret比較、兩摘要stable ID／焦點／逐鏡open比較、八view-only完整panel／IDs／revision／retention比較、七busy disabled與完整source比較。三工作台移動後編修再撤回，保留新文字；零／指數／超範圍位置拒絕，首列／中間／尾列、390×844操作、舊成果dirty與晚報告保持後來片名通過。全部51份保持原音檔blob／paused／0.5秒／8秒，最終同File身份、console0。11 native完整HTTP回覆（含修正前3份、修正版7操作及一份刻意late timing）、七operations實際CLI／Agent／MCP與21直接HTTP good/bad/good等於application；兩observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保持bytes。兩bounded servers正常停止、三自有tabs關閉／viewport reset、HTTP thread joined與子程序EOF0。兩PNG與合成媒體留ignored outputs。完整視覺、screen-reader、Windows原生IME、瀏覽器保存成功、實聽、正式媒體、Host安裝與平台創始接受未驗證。指定位置與快捷鍵證據限本輪Chromium；重新排列不自動修正時間或生成媒體，仍需完整domain驗證。最終盤點依本輪收據；latest102／101／100保護，rolling active。


## v0.101.0

2026-10-06：在鏡頭摘要按 Alt＋↑／↓ 可直接移動鏡頭，收合或展開皆可。焦點跟著同一鏡頭，逐鏡展開狀態、原文與原時間保持；Enter／Space 繼續展開或收合。移動後原成果停下載，撤回保持後續編修，重新建立才恢復下载。沿 editor-keys 純 gesture／ID 提案與 injected current／consume／writer／actual-after 核對 → editor-keys-dom 自有 native SUMMARY 暫態 target／open bookmark → app 原完整 raw-source order controller。文字欄仍走原 caret 分支；摘要只讀 details.open，不讀或寫 input value／selection、不強制展開。只有同 ID、同 open 狀態、当前自有焦點才恢復 summary focus；沒有新 history、依賴、固定 assets、server diff、schema 或 Agent operation。產品0.101.0／唯一 policy38–101共64／unknown102拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4保持。PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。585 Python（86.187秒，兩隔離 workers／120秒整體期限）／1183 JS／117 syntax／四 Skills，八新JS測試。v100真source ZIP還原585／1175；252歷史ZIP／manifest bytes相同，23既有schemas相同。39原生快照：14完整 raw-ID 排列、七同摘要ID／焦點／逐鏡open比較、四原欄display／caret比較、五忽略操作的完整panel／IDs／revision比較（含一busy pair）。原生Enter／Space只改展開狀態；後續運鏡編修撤回、四次清理回到完整initial panels、舊五檔成果移動及撤回停下載、晚報告保留後來片名與上一份成果、390×844收合摘要上下移動通過。全部39份保持原生音檔blob／paused／0.5秒／8秒，最終同File身份，console0。八native完整HTTP回覆、七operations實際CLI／Agent／MCP與21直接HTTP good/bad/good等於application；兩observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保持bytes。兩自有bounded servers正常停止、兩tabs關閉／viewport reset、HTTP thread joined與子程序EOF0。兩PNG與合成素材留在ignored outputs。完整視覺、screen-reader、Windows原生IME、瀏覽器保存成功、實聽、正式媒體、Host安裝及平台創始接受未驗證。快捷鍵證據限本輪Chromium；摘要移動只改排列，仍须完整時間／影格與創作驗證。最終盤點依本輪收據；latest101／100／99保護，rolling active。


## v0.100.0

2026-10-06：段落、鏡頭與歌詞的文字或時間欄可按 Alt＋↑／↓ 移動目前列；保留同一欄位、游標選取、原文與時間。沿原順序撤回保留後續文字編修，移動後須重新建立成果。原生選單、一般方向鍵、組字／重複鍵、其他修飾鍵、等待中與首尾邊界保持原行為。editor-keys 純 gesture／相鄰 ID 提案 → injected controller current metadata／consume／writer／actual-after 核對 → editor-keys-dom 三容器 delegated keydown 與暫態欄位／caret bookmark → app 共用原 music-arrangement／editor-order 完整 raw-source 移動與撤回。keyboard 才回同一欄位，原工具列保持按鈕焦點；沒有新 history、創作 schema 或 Agent operation。兩個固定 JS assets；无新依賴、模型、外網、timer、路徑、auth 或寫檔權限。產品0.100.0／唯一 policy38–100共63／unknown101拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4 保持。PolyForm Noncommercial 1.0.0／private，創辦 ZOE. G／GitHub djguan-jpg；FreeTWAI not_submitted。585 Python（86.875秒，兩隔離 workers／120秒整體期限）／1175 JS／117 syntax／四 Skills；18新測試。v99真source ZIP還原583／1159，248歷史 ZIP／manifest bytes相同，23 schemas相同。57原生快照：19完整 raw-ID 排列、15同欄位／native display／caret 比較、8忽略操作的完整 panel／ID／revision 比較（含三 busy pairs）、四原值清理比較及三後續編修撤回。移動後舊成果停下載，撤回原順序仍须重建；晚回覆保留後來 title 與上一份成果。原生音檔 File身份及 blob／paused／0.5秒／8秒在全部57份保持，console0。8 native完整 HTTP回覆與7 operations實際 CLI／Agent／MCP、21直接 HTTP good/bad/good 與application一致；兩個observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保持bytes。兩bounded servers正常停止、兩tabs關閉／viewport reset、臨時HTTP thread joined／子程序EOF0。兩JPEG及合成音檔留在outputs，不進Git。完整視覺、screen-reader、Windows原生IME、瀏覽器實際保存、實聽、正式媒體、Host安裝與平台創始接受未驗證。native selectionRange證據限本輪Chromium；DOM display與canonical raw欄位分別核對，不能以畫面字串證明原檔bytes。最終盤點依本輪收據，latest100／99／98保護；rolling active。


## v0.99.0

2026-10-06：段落、鏡頭與歌詞的選列會跟隨正在編修的列。新增、複製、刪除後鄰列、還原及待辦定位也會同步選列；等待中保留焦點，完成後同步目前列。鏡頭段落名稱修改後立即更新選單；單純換焦點保留創作內容與順序撤回。editor-selection 純 metadata／ID 提案重用 editor-focus 與 entry-order → injected controller 三次 current IDs／visible／busy 核對 → 三容器 delegated focusin／refresh DOM → app 原 music selection 或 editor-order.select。只同步原生 selector／行標示／邊界按鈕，不呼叫 focus、讀創作來源、markDirty、改 revision 或建立 history；原動作保持移動按鈕焦點。busy 結束沿既有 collection refresh 核對當前原生焦點；隱藏、外部、已移除及 disabled target 拒絕。鏡頭 caption 使用 raw readValue 的目前 section／purpose，不依賴稍後才更新的 summary；穩定 IDs 時 select 不重建 options 或讀全文。兩個固定 JS assets，無新 operation／schema／依賴／timer／模型／網路／路徑／auth 權限。產品99／唯一 policy38–99共62／unknown100拒絕；16基本／23啟庫、Agent1／draft3、23 operation input/output schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted保持。583 Python（89.531秒，兩隔離workers／120秒整體期限）／1159 JS／115 syntax／四Skills；17新測試。v98真source ZIP還原581／1144；244歷史 ZIP／manifest bytes相同，23既有schemas相同。最終45原生觀察及25前期探索；六完整raw panels／revision焦點比較、六ID排列、三刪除還原與三清理前後原值比較，24實際編修列焦點與六動作按鈕選列保持。五busy快照、完成後同步、即時caption、晚回覆保留後續原文與dirty成果通過；原生File身份、blob／paused／0.5秒／8秒在全部最終45觀察保持，console0。六native完整HTTP回覆、七 operations實際CLI／Agent／MCP及21直接HTTP good/bad/good與application相同；两個observed draft3 CLI reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1 bytes保持。三tabs關閉／viewport reset、兩bounded servers正常停止、臨時HTTP thread joined／子程序EOF0。三JPEG與合成素材留在outputs，不進Git。完整視覺／screen-reader／瀏覽器保存／實聽／正式媒體／Host／平台接受未驗證。最終稽核依本輪收據；latest99／98／97保護，rolling active。


## v0.98.0

2026-10-06：鏡頭與歌詞可選列向前／向後移動、查看選定列，並撤回最近一次移動。順序撤回保留後續文字與時間編修；新增、複製、刪除、還原或載入新內容會取消舊順序撤回。原時間、總長與音檔保持；鏡頭移動後須重新檢查時間覆蓋，已校時歌詞匯出仍依開始時間排序。entry-order 純 ID 相鄰排列與逆序核對，供原 music-arrangement 與新 editor-order 共用；editor-copy 原值 source guard → injected controller → editor-order-dom 原生選列／四按鈕 → app 原 readValue／writeEntries／markDirty／editor-focus。只保留最近 ID 順序與來源核對，metadata view 只有可撤回／stale／位置，不帶全文；busy／hidden 先拒絕讀取，提交前完整 source 與提交後隔離 expected 再查。DOM 只更新單列輸入標籤，未變順序不重建 options，原列 stable ID、raw 字串與 shot open 保持。三個固定 JS assets，沒有新依賴、operation、schema、Agent 路徑／寫檔／模型／網路／timer 或 auth。產品98／唯一 policy38–98共61／unknown99；16基本／23啟庫、Agent1／draft3、23 operation schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted 保持。581 Python／1144 JS／113 syntax／四 Skills；21新測試。v97真source ZIP還原579／1125，240歷史 ZIP／manifest bytes相同。33原生觀察、九 exact raw panel／ID 排列比較，三台移動與後續欄位編修撤回、複製句／鏡重新排列、結構變動停撤回、busy／hidden、時間矛盾拒絕／修正建包、歌詞按開始排序、late回覆保留dirty成果與後續編修通過。五native HTTP完整回覆與七 operations CLI／Agent／MCP、21直接HTTP good/bad/good皆與 application相同；兩個actual observed draft CLI reviews回讀，invalid1無輸出／diagnostic2／預設覆寫1原bytes保持。原生File身份、blob、paused與0.5秒在全部33觀察保持，console0。兩bounded servers正常完成、臨時HTTP thread joined、子程序EOF0、两tabs關閉／viewport reset。三JPEG留在outputs，不進Git。完整視覺／screen-reader／瀏覽器保存／實聽／正式媒體／Host／平台接受未驗證。最終稽核依本輪收據，latest98／97／96保護；rolling active。


## v0.97.0

2026-10-06：段落、鏡頭與歌詞可複製到原列後方。段落保留五個編曲欄位；鏡頭保留創作、母題與畫面方向，歌詞保留原句，兩者的開始／結束留白後人工校時。原列、總長與媒體保持；新列可用既有刪除／還原操作管理，處理中或達上限時停用複製。純 editor-copy／來源隔離與 current/actual-after 核對 → injected controller → delegated DOM → app 原 readValue／writeEntries／markDirty／focus。新 ID 沿原單調序列，原列 IDs／open 保持；open／copy 暫態不進 draft3。40段／1000鏡／10000句，DOM busy／hidden／capacity 在原值讀取及 ID 前拒絕，控制刷新只讀 count／visibility。固定兩 assets；没有新增依賴、operation、schema、模型、網路、timer、路徑或 auth。產品97／唯一 policy38–97共60／unknown98；16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。579 Python89.453秒（兩隔離workers／120秒整體期限）／1125 JS／110 syntax／四Skills；17新測試。v96原ZIP還原577／1110，236歷史ZIP／manifest bytes相同，23原 operation input/output schemas相同。41原生觀察，六 display/source 複製對、三份 exact raw draft 複製前後核對；原生File身份、0.5秒／paused及原媒體保持。桌面／390px滑鼠與Enter、新列 focus、40段上限、busy三台、刪除／還原、empty clock與多行歌詞拒絕、補齊後建立及晚回覆保留通過。7原生HTTP完整回覆等於application；7 operations的實際CLI／Agent／MCP與21直接HTTP good/bad/good一致，原 diagnostic exit2／invalid1無輸出／預設覆寫1且bytes保持；actual observed draft3經Python validate／兩種--draft CLI及Agent／MCP reviews回讀。2tabs關閉／viewport reset／2bounded servers及臨時HTTP thread正常停止／console0。六份JPEG留在outputs。草稿下載click已送出，未確認瀏覽器保存的檔案；完整視覺／screen-reader／實聽／媒體／Host／平台接受仍未驗證。最終outputs／typed owned runs依本輪收據，latest97／96／95保護；rolling active。

## v0.96.0

2026-10-06：分鏡開始／結束的極小負數字串（例如 -1e-999）會先依原值拒絕，不再因浮點下溢變成零而誤判有效。時間待辦可定位原欄位，建立分鏡包、鏡尾總長提案與新增下一鏡共用此界線；原時間與創作保持。真正負零、Unicode十進位、底線與既有數字空白規則保持。Python common 與原生 planning-values 的 pure 原符號判定／非負讀取 → complete storyboard 與 partial timing → application 原四 adapters；browser 原 timing／overview／source guard／add-shot adapter。只在既有 finite decimal 驗證後核對負號及非零 mantissa，exponent 不作非零來源。signed number 與歌詞位移保持；frame ties-to-even／seconds tolerance不变。duration controller沿同Timing診斷拒絕提案，原 revision／late／scope／undo保持。無新asset／operation／schema／依賴／timer／模型／權限。產品96／唯一policy38–96共59／unknown97，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。577 Python85.250秒（兩隔離workers／120秒整體期限）／1110 JS／108 syntax／四Skills；11項新測試。v95原ZIP還原572／1104，232歷史ZIP／manifest bytes相同，23舊operation input/output schemas相同。27原生狀態、22份各599來源欄位核對；桌面／390px滑鼠與Enter定位、拒絕／恢復、總長採用／撤回、負鏡尾新增拒絕、有效新增／刪除及晚回覆保留。7原生完整HTTP回覆等於application；實際CLI／Agent／MCP及6個直接HTTP good/bad/good核對，診斷CLI2／invalid1無輸出／預設覆寫1 bytes保持。2tabs關閉、viewport reset、2bounded servers及臨時HTTP thread正常停止，console0。瀏覽器文字下載click已送出但download事件逾時，未確認保存；完整視覺／screen-reader／正式媒體／Host／平台接受仍未驗證。最終本outputs及typed owned runs依本輪收據，latest96／95／94保護，rolling active。

## v0.95.0

2026-10-06：歌詞、分鏡與 ZIP 原文搜尋在中文輸入法選字時，Enter 不再提前尋找或重設原結果；一般 Enter 與「尋找」按鈕仍可使用。命中摘錄、原欄位定位、取消／重試、前後分頁及私人編修保留。search-input 純三欄鍵盤 metadata → 三個原 DOM adapter → 既有搜尋 controller。isComposing 或 legacy keyCode229 不 preventDefault、不讀來源／清單或呼叫搜尋；只有有效普通 Enter 才執行原動作。純層無 DOM／事件副作用、timer、網路或持久狀態；固定一 JS asset。控制器、app、application／CLI／Agent／MCP、領域 schemas 與 23 operation input/output schemas不變。產品95／唯一policy38–95共58／unknown96拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。572 Python68.390秒（兩隔離workers／120秒整體期限）／1104JS／108syntax／四Skills；10項新增測試。原v94 exact-source ZIP還原572／1094，228歷史交付ZIP／manifest bytes相同，23 operation schemas相同。40歌詞／分鏡＋10ZIP原生狀態，35合成 KeyboardEvent 選字事件均未被攔截；來源／結果／ZIP選取與分頁保持，一般原生Enter／按鈕／取消／重試／原欄focus與空查詢錯誤接續核對。11真正原生HTTP搜尋請求中2個ERR_ABORTED、9個完成；11後端完整回覆（含取消後完成者）等於application，兩種搜尋實際CLI／Agent／MCP一致，good/bad/good與預設覆寫拒絕bytes保持。3自有tabs關閉／viewport reset／2servers正常停止／console0。合成事件不是Windows實際IME候選面板驗收；截圖與DOM幾何不是完整視覺／screen-reader／保存／正式媒體／Host／平台驗收。最新95／94／93保護；最終本outputs及明確owned runs盤點依本輪收據，rolling active。

## v0.94.0

2026-10-06：歌詞與分鏡搜尋清單改顯示命中附近前後文，使用literal mark標示命中詞及原句／鏡號與欄位。長段落後半的關鍵字也能辨認，重複開場的結果可由鄰句分辨；長查詢明示「命中已摘錄」。點選與Enter仍回原欄位，完整原文／時間／報告保持；取消與分頁沿原控制。v0.94 命中前後文：共享 search-excerpt 純來源／UTF-8 span與query核對，重用既有 delivery-context 的每側64byte邊界模型；2000codepoints原欄位、query≤1024bytes，顯示每側48／命中96codepoints，控制符visible token不能被截斷。shared literal search-excerpt-dom建立span／mark，再由兩個原DOM adapter接到現有current controller；先准备全批view再改DOM。無innerHTML／source寫入／網路／timer，新server僅兩固定JS assets。原prefix caption helper相容保持，live結果使用新view；完整files/data/meta與兩種search1／23舊operation schemas不變。產品94／policy38–94共57／unknown95拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。572 Python67.375秒（兩隔離workers／120秒整體期限）／1094JS／107syntax／四Skills，51focused包含8新excerpt測試。原v93 exact-source ZIP還原572／1086，224歷史ZIP/manifests bytes相同，23既有operation input/output schemas相同。合成45鏡／45句、39原生觀察／320／390／1440px；23個狀態共460個native命中view依完整來源／byte span與純模型逐值相同。16後端完整HTTP回覆（含取消後完成者）等於application，兩種搜尋實際CLI／Agent／MCP一致，good/bad/good與預設覆寫拒絕bytes保持；主tab console0。最新94／93／92保護，最終本outputs與owned runs盤點依本輪收據；rolling active。

## v0.93.0

2026-10-06：歌詞與分鏡搜尋等待中可按「取消搜尋」，保留上一批結果與分頁歷史，再次搜尋可立即重試。換查詢、編修原文或換工作台會中止自己的舊瀏覽器請求；晚成功／錯誤不能提交。滑鼠與鍵盤取消後仍持有取消焦點才返回查詢欄，後續焦點保留。共用純 request lifecycle／注入 controller／明確 signal／固定 DOM 分層；原文、時間、媒體、草稿與上一份成果保持，後端可能完成請求。v0.93 歌詞／分鏡搜尋取消：共用 search-request 純請求 ownership／注入 AbortController factory → 各搜尋 controller generation/source/ID/results current → app 明確傳遞 signal → native fetch；固定 DOM 顯示取消並在仍持有焦點時返回查詢欄。失效先於 abort，旧 finally 不能釋放新 job；顯式取消保留上一批、分頁歷史、原文與成果，換查詢／來源／換台沿原 reset 清除舊定位。idle cancel 不 capture／render／建立 job；pagehide listener 屬於 document。讀取本機 SHA 可晚 settle、後端可完成；搜尋 ownership 立即失效，可明確重試，與共用 operation-gate 等待 local settle 的契約分開。只新增一固定 JS asset，無新 operation／schema／取消 endpoint／路徑／模型／依賴。16基本／23啟庫、Agent1／draft3／23既有 input/output schemas／legal4／private／FreeTWAI not_submitted保持。產品93／交付38–93共56／unknown94拒絕。572 Python（68.578秒，兩隔離workers／120秒整體期限）／1086 JS／105 syntax／四Skills；17新取消測試。原 v92 exact-source ZIP 還原572／1069；220歷史ZIP/manifests逐bytes相同，23既有operation input/output schemas相同。45鏡／45句合成來源、31原生觀察、320／390／1440px，17原生搜尋請求中10個ERR_ABORTED與7個完成；取消分頁保留20筆、Enter／滑鼠焦點、編修／換台取消、立即重試與原欄focus。19後端完整HTTP回覆（含取消後仍完成者）等於application；兩種搜尋的實際CLI／Agent／MCP同來源一致，bad/good接續、預設覆寫拒絕且bytes保持。最新93／92／91封裝保護；嚴格超七天且可重建才列清除候選，本輪維護收據另存outputs/v93-qa；rolling active。

## v0.92.0

2026-10-06：新增分鏡原文搜尋：依八個敘事欄位找第一個字面命中，每批20鏡，前後分頁並展開原欄位。Python／原生JS純來源與SHA模型→共用application四adapter→注入current controller→literal DOM及stable ID／原值focus。1000鏡／每欄2000codepoints／compact source1MiB，回覆files/data/meta、JSON與Markdown完整核對；原文／時間／草稿保留，未知或晚回覆拒絕。新增唯讀storyboard_search與CLI／MCP／HTTP，16基本／23啟庫需重新discovery；22個既有operation input/output schemas逐值相同。572Python73.532秒／1069JS／104syntax／四Skills、原v91封裝564／1057還原、216歷史ZIP/manifests byte相同；45鏡原生40觀察／11完整HTTP報告與四adapter一致，三尺寸／八欄focus／Enter分頁／零命中／晚回覆及編修保持。product92／sources38–92共55／unknown93拒絕，Agent1／draft3／legal4／private／FreeTWAI not_submitted保持，rolling active。

## v0.91.0

2026-10-06：處理列改在main上方sticky區：390px baseline歌曲報告時取消入口top3618px，現版在390/320/1440px長表單捲動後仍可操作。pure operation-presentation有界驗證四workbench/action及gate三bool一致性→固定DOM adapter隔離擷取一次metadata→app.run開始前hook；refresh只讀gate，不讀創作來源、不新增timer或scroll呼叫。標示處理中/取消中及工作台/動作，idle隱藏並清空context；既有gate/request cancel/current/source/revision/dirty及focus保持。server只新增一固定JS asset，application/CLI/Agent/MCP/domain/wire/權限/依賴不變，15/22、Agent1/draft3保持。564Python63.922秒/1057JS/101syntax/四Skills、142focused（8新presentation/DOM/actualrun）、原v90 ZIP564/1049還原與212歷史ZIP/manifests逐bytes相同。原生390×844、320×568、1440×900，歌曲/分鏡/歌詞標示、捲動可達、mouse/Enter取消、重試、人工編修/歷史/上一份成果及完成清空核對；三原生報告與actual application/CLI/Agent/MCP/HTTP一致。geometry/保存screenshot與實際操作不冒充完整視覺/screen-reader驗收，正式媒體/特定Host/平台未驗證。產品91/supported38–91共54/unknown92，legal4/private/FreeTWAI not_submitted保持；restore/main/指定封裝與SHA、latest91/90/89保護，rolling active。

## v0.90.0

2026-10-06：新增共用工作台「取消等待」：本次 gate 在 native abort listener 前失效，只有同一 awaited task 結束才能釋放；取消保留來源、刪除紀錄、媒體與上一份成果，後續人工編修仍沿 dirty/revision 保護。純 operation-gate → 明確 request context signal → 固定 operation-control DOM adapter 分層；原來源核對保持，晚到成功/錯誤不提交。取消 fetch 不表示後端停止；不可中斷的 File.arrayBuffer/WebCrypto 階段保持 cancelling/busy 到結束。獨立 library/search/backup/file preview/ZIP import 保留原生命週期；known delivery ID 原 discard 保持，未知 staging 沿 bounded expiry/server close。server 只新增兩固定 JS assets，application/CLI/Agent/MCP/領域schemas/權限/依賴不變，15/22、Agent1/draft3保持。564Python68.266秒/1049JS/100syntax/四Skills、149focused（15新純模型/實際run/API/DOM/controller測試）、208歷史ZIP/manifests與原v89 ZIP564/1034還原通過。原生歌曲/分鏡/歌詞取消、重試、晚到後端、人工編修/歷史/上一份成果、匯入/匯出及390px Enter焦點核對；三原生報告與actual application/CLI/Agent/MCP/HTTP一致。12秒延遲只在ignored QA，沒有production取消endpoint或kill。完整視覺/screen-reader/正式媒體/特定Host未驗證。產品90/來源38–90共53/unknown91，legal4/private/FreeTWAI not_submitted保持，latest90/89/88保護，rolling active。

## v0.89.0

2026-10-06：修正歌曲/分鏡報告處理中仍可載入範例，替換原來源並清除刪除紀錄的問題。兩範例入口在讀取完成且共用操作結束後才開放，handler在load/clear/dirty/render之前拒絕未就緒或busy。初始HTML停用，startup與run既有timingControls/finally共用refreshExampleControls DOM adapter；late startup不自動取代處理中的來源，也不覆蓋其進度訊息，後續人工編修沿既有retention保持。明確idle載入只替換所選工作台並清除該台刪除歷史。原欄位編修與revision/current過期保護保持；domain/HTTP/CLI/Agent/MCP未改，無新asset/operation/schema/依賴/權限；15/22、Agent1/draft3保持。564Python69.922秒/1034JS/98syntax/四Skills、134focused（10新actual handler/run/initialize測試）、204歷史ZIP/manifests及原v88 ZIP564/1024還原通過。原生讀取中自寫歌名保留、成功/HTTP500/過期回覆、歷史/上一份成果保持、完成後限定範例載入及390px Enter核對完成；三原生報告與actual CLI/Agent/MCP/HTTP一致，拒覆寫/good-bad-good保持。delay/500只在ignored QA helper，production server未改。兩owned tabs/兩bounded servers正常關閉，viewport reset；HTTP500是刻意測試，console warn/error零。完整視覺/screen-reader/正式媒體未驗證。產品89/來源38–89共52/unknown90，legal4/private/FreeTWAI not_submitted保持，latest89/88/87保護，rolling active。

## v0.88.0

2026-10-06：修正共用run處理中仍可新增避免事項/交付項目/母題/歌詞句、使本次報告失效的缺口。六清單collections固定add/remove metadata→app共用refreshCollectionControls，busy時停用新增/指定刪除/三台還原選單與按鈕；四缺少guard的新增入口在讀來源或產生ID之前拒絕。成功/失敗/來源過期後沿run finally恢復控制，保留較早還原選擇、原值/ID/歷史；不重建選單或讀全文。原欄位仍可編修，revision/current繼續拒絕舊回覆，上一份成果保持且dirty停下載。domain/pure History/HTTP/CLI/Agent/MCP與schema無改動，無新asset/operation/依賴/權限；15/22、Agent1/draft3保持。564Python65.421秒/1024JS/98syntax/四Skills、107focused（10新busy測試）、200歷史ZIP/manifests與v87原包564/1014還原通過。原生三種完整報告source/data與actual CLI/Agent/MCP/HTTP完全一致，CLI拒覆寫與good/bad/good保持。baseline四種新增問題以QA-only6秒延遲重現；corrected native21觀察含全部busy控制、完成後四入口接續新增、較早還原、原欄位編修/過期回覆、390px Enter報告/還原/新增與原句保留，document375≤390、console0。兩owned tab/兩bounded server正常關閉，viewport reset；完整視覺/screen-reader/正式媒體未驗證。補正v87契約的實際deletion-history.js路徑。產品88/來源38–88共51/unknown89，legal4/private/FreeTWAI not_submitted保持，latest88/87/86保護，rolling active。

## v0.87.0

2026-10-06：修正刪除鏡頭時自動改寫其餘時間：只移除所選鏡頭，其他鏡頭原字串、穩定ID、創作與作品總長保留；負值、留白與短於一影格也不靜默修正。既有時間待辦列出缺口，完整分鏡仍拒絕未修正時間。共用純History.remove/restore→app原生欄位adapter→限定dirty與焦點；新刪除record不含時間patch，還原保留後續時間/文字/總長。固定操作提示與aria-describedby，無新asset/operation/schema；15/22、Agent1/draft3保持。564Python67.047秒/1014JS/98syntax/四Skills、68focused、196歷史ZIP/manifests與v86原包564/1002還原通過；actual CLI/Agent/MCP/HTTP三種時間問題的原source/files一致，good/bad/good與CLI拒覆寫通過。native22觀察含普通缺口/負值/極短時間/尾鏡、待辦定位/報告/完整建立拒絕、上一份成果保留且dirty停下載、還原原值與後續編修、390px Enter刪除/還原且document375≤390。首次focused只有舊測試期待自動前移時間，改以保留原值核對後fresh全測通過，失敗紀錄保留。兩owned tab/兩bounded server正常關閉，viewport reset；未選媒體，完整視覺/screen reader/正式素材未驗證。產品87/來源38–87共50/unknown88，legal4/private/FreeTWAI not_submitted保持，latest87/86/85保護，rolling active。

## v0.86.0

2026-10-06：新增「核對下載的原文」：明確選回本機檔案，逐 byte 比較目前選定成果的完整 canonical UTF-8 bytes，顯示一致／第一個0起差異與雙方大小；改名不影響核對。pure text-verification→注入 capture/native File read/latest/current controller→literal DOM，8MiB讀前上限、讀後大小與來源核對；切檔/成果/換台/dirty/busy清除過期證明，晚成功/失敗不改後續狀態。不讀textarea摘錄、不改成果/編修/媒體、不解草稿另存警示、不保存核對報告。三固定JS資產；沒有新operation或領域schema，15/22、Agent1/draft3與既有下載保持。564Python67.640秒/1002JS/98syntax/四Skills、2Python+16JS focused、60共用流程回歸、192歷史ZIP/manifests與v85原包562/986還原、actual CLI/Agent/MCP good/bad/good通過。native18觀察含相同/改名/單byte差異/空檔、切檔/編修/換台失效、原值/成果/草稿提示保持、390px Enter選檔與无document橫向超宽。baseline與本輪Page下載事件各確認brief.json 2040bytes completed；回選檔是明示合成fixture，沒有取得實際下載保存路徑/bytes，不混淆兩種證據。初次全測17JS失敗源自共用run的新增free lexical依賴，改用state.textVerification後fresh全通過，失敗紀錄保留；unknown POST測試400誤判修正為原404，native QA比對依目前canonical檔名修正。兩owned tab/兩bounded server正常關閉、viewport reset；完整視覺/screen reader/正式素材實聽未驗證。產品86/來源38–86共49/unknown87、legal4/private/not_submitted與latest86/85/84保持，rolling active。

## v0.85.0

2026-10-05：新增唯讀原句搜尋：保留原順序、重複句、Unicode與空白，每句列第一個字面命中；時間未完成亦可查找。Python/JS純search1原文字陣列與UTF-8 SHA→application→CLI/Agent/MCP/HTTP；browser注入latest/source/query/results核對controller→literal DOM→穩定ID文字欄定位。每批20、上一批/下一批，原句或ID變更失效，晚成功/失敗保留後續編修；只定位、不seek。source SHA不含時間或媒體，完整搜尋请求與傳輸沿2MiB上限。產品85／明確來源38–85共48／unknown86；新增lyrics_search，基本15／啟庫22，Agent1/draft3與既有領域schemas保持。562 Python68.797秒／986 JS／95syntax／四Skills、8Python+14JS focused、188歷史ZIP/manifests與v84原包554/972還原；actual CLI/Agent/MCP與新搜尋四adapter good/bad/good/預設拒覆寫通過。native12觀察：300句分頁與第21句focus、空表/零命中、未完成時間、query/text/delete失效、音檔/時長/paused position保持、自然播放繼續、390px Enter/literal HTML無執行。download click已送出但10秒未取得保存檔案，另存驗收未完成；完整視覺/screen-reader/實聽未驗證。兩測試helper失敗源自MCP舊清單及JS位置regex，失敗紀錄保留，fresh checks全通過。三tab/兩bounded servers正常結束；無新依賴/模型/網路/path權限。legal4/private/not_submitted保持，latest85/84/83與rolling active。

## v0.84.0

2026-10-05：新增歌詞句後明確聚焦新文字欄；刪除最後一列後接回對應新增按鈕，還原接回原列。共用於歌曲段落、避免事項、交付項目、母題、鏡頭及歌詞六種清單；新增鏡頭展開並聚焦母題，還原鏡頭聚焦摘要。editor-focus純有界ID來源／proposal→注入雙capture controller→固定DOM adapter→app分層，busy/hidden/source drift與無效目標拒絕focus，確認native activeElement才成功；不讀原欄位、不改資料／草稿／播放。554 Python68.828秒／972 JS／92syntax／四Skills、50focused、184歷史ZIP／manifest、v83原包554／960還原、CLI/Agent/MCP bytes相同與good/bad/good、native30觀察／六種清單／九歌曲scalar保持／合成音檔與paused position保持／自然播放不中止／390px鍵盤通過。QA整合helper誤用不存在的test_delivery_inspection.py，保留失敗run；fresh recovery只完成剩餘修改，全部測試通過。兩tab與兩bounded server正常結束。兩fixed JS路由；沒有新operation/schema/依賴/模型/權限，14/21／Agent1/draft3/legal4/private/not_submitted保持。latest84/83/82與rolling active。

## v0.83.0

2026-10-05：目前歌詞播放熱路徑新增pure prepared rows／injected playback controller／owned DOM marker／app分層。input、render、stamp/undo及batch apply/undo明確失效；position-only更新保留全部media/context檢查，不再重讀／解析整表，原activeCueIndex最後重疊命中規則保持。明確focus沿原完整fresh雙capture，不信任顯示cache。高亮只移除舊列及加入新列，同ID原node保持、重建後重新解析。實測10000列×120更新，row capture120→1、raw copies1200000→10000，全部120views一致；單次Node基準2267.6433→44.3776ms，不冒充browser FPS。另重現v82actual batch adapter在短media下保留過期enabled，programmatic apply/undo force刷新句首button已修正。554 Python67.953秒／960 JS／90syntax／四Skills、71focus、180歷史ZIP／manifest、v82原包554／948還原、CLI/Agent/MCP bytes與good/bad/good、native25觀察／1022欄位保持／300列／390px鍵盤通過。兩自有tab與bounded servers完成，無新資產/HTTP/Agent操作/timer/依賴/模型；14/21／Agent1/draft3／領域schemas/legal4/private/not_submitted保持，latest83/82/81與rolling active。

## v0.82.0

2026-10-05：新增逐句「定位句首」：滑鼠或Enter回到原開始時間，結束留白仍可定位，再沿波形鍵盤細調。pure cue-position／injected controller／delegated DOM／app分層，穩定ID、完整原列與媒體來源／時長重查，寫後核對實際位置；只seek，播放／暫停、原欄位、草稿與標記撤回保持。位置自然更新不逐列重掃，無新timer。另修正共用Python／JS原十進位字串的負值下溢：-1e-999先拒絕，再捨入；真正負零與signed shift保持。554 Python68.859秒／948 JS／90syntax／四Skills、61focus、176歷史ZIP、v81原包553／933還原、最終CLI／Agent／MCP bytes一致、26跨語言數值及Agent／MCP／HTTP good/bad/good／CLI1無輸出、原生31+4觀察／136欄位保持／390px鍵盤通過。兩次數值QA helper失敗為module shadow及CLI oracle寫錯，失敗紀錄保留、fresh helper通過，未改CLI退出契約。三個自有tab／bounded server完成；14/21／Agent1/draft3／領域schemas/legal4/private/not_submitted保持，latest82/81/80與rolling active。

## v0.81.0

2026-10-05：目前歌詞與列高亮共用媒體就緒／來源核對；無音檔或換檔時清舊句，新增「前往目前這句」以滑鼠或Enter明確focus原列文字。pure current-cue／injected controller／literal DOM／app共同capture分層，穩定ID與雙snapshot、原欄位及媒體核對；自然播放／其他編修保持，部分有效句不冒充完整匯出。553 Python71.516秒／933 JS／88syntax／四Skills、38focus、172歷史ZIP、v80原包553／920還原、actual CLI/Agent/MCP bytes與good/bad/good、原生26觀察／136欄位不變／390px Enter／新歌詞包與draft媒體reset通過。native broken.wav ready0清舊句，但error=true未觀察，error純分支已測；QA錯選項failed fixture保留、fresh .json fixture通過。兩個自有tab／bounded server完成，無新timer／依賴／模型或HTTP operation，14/21／Agent1/draft3/legal4/private/not_submitted保持；latest81/80/79與rolling active。

## v0.80.0

2026-10-05：修正projects.release_version停在v77但product/remote已v79的缺口，明確expected tag v0.80.0；靜態宣告不冒充發佈成功。pure release_metadata→strict JSON→selected immutable Git blob size/show→package前及archive metadata/policy核對；64KiB marker/8192B policy、錯／stale／duplicate／unknown在mkdir前拒絕，working files不能換來源。manifest1只增加checks.release_metadata，原schema/Agent1/draft3/14/21保持。553 Python69.375秒／920 JS／86 syntax／四Skills，8新contract/7版本focus、168歷史ZIP、v79原包545／920還原、actual CLI/Agent/MCP bytes與good/bad/good通過。首輪oracle42漏改43及QA漏--input的failed records保留，fresh retries通過，產品CLI不改。web/HTTP/領域無diff、無新常駐server/tab，latest80/79/78、legal4/private/not_submitted保持，rolling active。

## v0.79.0

2026-10-05：逐句開始／結束／整句移動新增最近一次撤回，精確還原原時間字串並保留後續文字、其他句／刪除與音檔。目標時間改動或刪除永久停舊撤回；改回／還原刪句不復活，新成功標記可建立新紀錄。同值／無效標記保留有效舊紀錄，載入新歌詞清除。pure cue-stamp-edit→注入來源／實際after重查controller→literal DOM／app，沿同一native media capture與既有毫秒規則，暫態不進draft3／wire／Agent。545 Python67.437秒／920 JS／86 syntax／四Skills、164歷史文字ZIP與v78原封裝545／909還原通過；native tab127缺口／128修正22觀察、390px Enter、133欄位僅目標開始還原、console0，兩server原handles正常exit0／thread joined、tabclosed／viewportreset／no staging。首輪16 JS失敗為四個VM測試未注入新controller，補null fixture後fresh全套通過；Agent QA首輪誤期望invalid_request，依既有domain的invalid_input修正QA後good/bad/good通過，產品契約未改。兩失敗record保留。latest79／78／77、legal4/private/not_submitted保持，rolling active。

## v0.78.0

2026-10-05：波形校時顯示播放位置與總長；方向鍵0.5秒、Shift細調0.05秒，Home／End到起尾。空音檔、換檔或錯誤時歸零停用，原歌詞與宣告保持。pure wave-position→注入來源重查controller→native DOM／app，無新wire/schema/工具。545 Python67.235秒／909 JS／84 syntax／四Skills、160歷史文字ZIP與v77原封裝545／901還原通過；native tab125缺口／126修正16觀察、390px按鍵與60欄位保持、console0，兩server原handles正常exit0／thread joined、tabclosed／viewportreset／no staging。QA回覆304321B超舊300000內部門檻的失敗record保留，fresh retry512KiB有界完成，產品容量不變。latest78／77／76、legal4/private/not_submitted保持，rolling active。

## v0.77.0

2026-10-05：保存紀錄與備份共用純 UTC 日期驗證，拒絕不存在曆日與時間溢位；移除瀏覽器自動轉日期，接受合法 Z／小時及單字元分隔的原時間，排序與保存 bytes 保持。545 Python／901 JavaScript／82語法／四份Skill、156歷史ZIP及v76原封裝541／892還原通過；14／21工具與原schema保持。 原browser Date.parse把2月30/4月31/24:00/1900閏日轉成有效日期，Python拒絕，原14-case matrix確認。pure utc_timestamp/utc-timestamp.js→library_contract/backup created_at与browser revision/backup plan→原app/controller；822-case Python/JS matrix含792個曆日native oracle比較。Native tab123共3list/3search/1read/2inspect與9觀察，三種不可能時間reply-copy拒絕，原清單/有效Z預覽/編修/WAV/dirty保持，healthy retry與同backup再次預覽；390px keyboard Home原emoji小時timestamp313px/console0。原3revision bytes保持，server原session10957正常exit0/thread joined/tabclosed/viewportreset/無staging，未執行browser restore。真CLI2/Agent4/MCP4讀取Z及emoji小時原文，unknown path good/bad/good與21工具保持。全套68.281秒固定2worker/120s；v76還原第一次helper替換測試數誤改source SHA、嚴格guard在解壓前拒絕，修正helper新record還原成功。误用v76 stop helper被immutable record擋下且HTTP未執行，改本輪record正常stop。latest77/76/75/legal4/private/not_submitted保持，rolling active。

## v0.76.0

2026-10-05：保存清單分清空庫、搜尋零命中與摘要不可讀；選定版本顯示四種名稱的字面命中位置。查詢編修／等待／取消後仍標示原接受查詢，原稿、預覽、音檔保持。541 Python／892 JavaScript／81語法／四份Skill、152歷史ZIP及v75原封裝539／879還原通過；14／21工具與原schema保持。 原2版可讀／0命中被實際app誤寫成尚無保存版本已重現。pure Python／JS library-match共享字面語義與codepoint spans；純presentation→literal detached DOM，接受query留在暫態context，未知或不符拒絕。原生tab122共6search／3list／1read與13觀察：四欄/HTML字面、stale/pending/cancel/late、checked preview、空庫/不可讀、390px list279px/max256/鍵盤捲動38.5，console0；原3版及不可讀fixture bytes、編修/WAV/dirty保持。server原session76788正常exit0且deadline thread joined、tab關閉/viewport reset/無staging。Python70.032秒固定2workers/120s、v75原ZIP還原65.906秒；helper複製遺留舊顯示版本，corrected receipt依實際v75 SHA/commit記錄。latest76/75/74與legal4/private/not_submitted保持，rolling active。

## v0.75.0

2026-10-05：全庫字面搜尋保存名稱及歌曲／分鏡／歌詞名；分頁核對完整觀察摘要，來源變更需重新搜尋。錯誤或晚回覆保留清單、預覽、編修與音檔。539 Python／879 JavaScript／78語法／四份Skill及148歷史ZIP通過；基本14／明確啟庫21工具，新search1獨立。 真CLI／Agent／MCP及工作台缺少搜尋已重現。純library_search request/index/hash/page/schema→metadata_snapshot→application四adapter，browser純result→latest/controller→literal DOM，固定/api/drafts/search。原生tab121實際15search／2list／1read，錯頁／unknown、same cursor retry、合成新增一版後舊來源拒絕、fresh24版、Case/body邊界、較早版預覽、cancel/late與healthy retry；原23版bytes／編修／WAV／dirty保持。390px提示313px、console0、tab關閉／viewport reset／server原handle93630 exit0。單程序全套碰到120s上限，profile保留；新固定兩隔離程序仍120s整體期限，完整discovery逐ID核對539測試各一次，71.812秒通過。v74指定ZIP原碼未改，外部launcher還原534／867；148歷史文字ZIP bytes相同。latest75／74／73、legal4／private／not_submitted保持，rolling active。

## v0.74.0

2026-10-05：保存、清單與回讀先核對完整產品／協定回覆，清單再核對所有版本資料、排序與分頁來源。錯誤或晚回覆保留目前清單、預覽、編修與音檔；未確認保存沿同一 ID 及原稿重試。534 Python／867 JavaScript／77語法／四份Skill及144歷史ZIP通過，基本14／啟庫20工具保持。 真 Python 清單回覆經原 app adapter 丟棄 meta，未知產品／protocol、未知 library schema／status 與重複ID均被 controller 發布，缺口已重現。共享 checkedMetadata→純 library-result envelope／page→注入 required checkList、latest→DOM；保存與確認回讀同 envelope 門檻。實際 tab120 七次 list／六次 read／三次 save，回覆副本故障拒絕、同cursor健康重試、同ID僅新增一版且原21版bytes保持；錯ACK及錯readback保留pending，後續編修／WAV／dirty及取消late保持。390px提示313px／console0，tab關閉、viewport reset、server原handle51440 exit0／無staging。上一版指定ZIP532／853還原及144歷史ZIPbytes相同。latest74／73／72、legal4／private／not_submitted保持，rolling active。

## v0.73.0

2026-10-05：新增唯讀草稿庫備份匯出；Agent／MCP預設摘要，明確選擇才內嵌不超過512KiB的ZIP，亦可指定保存ID。完整ZIP與來源核對，CLI／HTTP沿共用application。532 Python／853 JavaScript／76語法／四份Skill及140歷史ZIP通過；啟庫20工具，基本14保持。 baseline真CLI已能備份，但Agent validate與MCP實際19工具缺export。純selected_ids／checked_request→原immutable producer→同次raw完整read_backup／摘要／ID核對→immutable PreparedBackupExport／export1→共用application→CLI stdout／Agent JSONlines／MCP strict outputSchema／HTTP readonly route。四adapter真inline bytes由明確QA helper另存／還原／重用，record/draft／ID／時間與來源逐bytes同，原source保持；沒有新增browser UI／保存驗收。metadata不含原文、預設無base64；large實際ZIP超512KiB仍可摘要，要求inline在base64前拒絕。invalid/missingID後好請求可繼續，io_error不漏路徑。原路徑／保存規則保持。latest73/72/71保護，legal4/private/not_submitted、rolling active。

## v0.72.0

2026-10-05：備份下載先核對完整摘要、串流位元組與 SHA-256，再交給瀏覽器；新增取消下載，晚回覆保留編修與音檔，已斷線回應只結束該連線。521 Python／853 JavaScript／76語法／四份Skill及136歷史ZIP通過。瀏覽器保存檔案仍未驗證。 真備份producer重現未知schema／缺SHA／矛盾版數仍走form.submit；改純descriptor／archive checker→注入prepare-read-hash-send latest controller→有界原生串流／共用Blob sender→DOM。native tab118 wrong descriptor與同長度改bytes拒絕，Enter健康下載交接顯示已核對2版，download event20秒逾時，無saved proof；取消／晚成功保留編修、WAV及dirty。390px提示313px、console0。取消導致Windows10053、第二次500回覆的缺口另補reply ConnectionError處理；新tab119 Enter取消、late reply close_connection=true且沒有第二次write，console0、server原handle56716 exit0。tab118原server4869 exit0帶原trace保留，兩server staging清零／關閉、兩tab關閉／viewport reset。指定v71 ZIP還原517／841及136歷史byte相同，latest72／71／70保護，legal4／private／not_submitted保持，rolling active。

## v0.71.0

2026-10-05：備份預覽先量測選定 ZIP 的 SHA-256，完整核對來源、版本與恢復計數；未確認恢復回覆保留同一備份供明確重試，後續編修與音檔保持。517 Python／841 JavaScript／74語法／四份Skill及132歷史ZIP通過。 真備份producer重現wrong SHA／矛盾版數／無關restore摘要被接受。native backup-file→pure backup-result full wire／data一致性→required injected hash／plan／restore checks→原latest controller→DOM分層。native tab117，四次inspect／兩次restore；response副本故障保留原ZIP與磁碟。第一次恢復已加入兩版但錯計數不確認，Enter沿同File／SHA重試回added0／reused2，磁碟兩版record／draft逐bytes相同。恢復版本可預覽，後續歌名／WAV／dirty保持；390px提示313px、console0、tab關閉／viewport reset／server原session17368 exit0／staging未建立。最新71／70／69保護，legal4／private／not_submitted保持，rolling active。

## v0.70.0

2026-10-05：保存版本預覽核對選定 ID 與完整 metadata；讀取完成、套用與匯出前重查目前選擇。不符時保留編修與音檔，切換版本提示重新預覽。514 Python／829 JavaScript／72語法／四份Skill、128歷史ZIP及指定v69還原511／816通過。 真immutable library重現要求A卻接受B的缺口。pure library-revision共享save/read metadata與完整draft核對→注入checkRead／初始選擇隔離→既有latest／replacement preview→DOM active selection重查。native tabs115／116、6讀／1存／5清單，僅response副本故障注入；wrong ID／metadata及套用／匯出選擇不符拒絕，原編修／WAV保持。明確全案Apply／Undo沿既有行為清media且提示重選；另存原案回讀確認與新版本預覽正常。首次切換仍顯示舊「已預覽」提示，補明確重新預覽訊息後用新tab／晚回覆測試再驗證。390px提示313px、console0、兩tab關閉／viewport reset／server原session82907 exit0／staging未建立。最新70／69／68保護，legal4／private／not_submitted保持，rolling active。

## v0.69.0

2026-10-05：草稿保存後先回讀同一 ID，完整核對點擊時草稿與保存回應，才標示已保存。回讀失敗保留原 ID／原稿供重試，後續編修與音檔保持。511 Python／816 JavaScript／71語法／四份Skill、124歷史ZIP及指定v68還原508／804通過。 基準controller接受wrong-id回應就onSaved，已重現並修正。pure receipt→注入readonly reader→原pending controller→DOM／retention分層，既有HTTP draft_save／draft_read及Agent工具保持。native tab114首次回讀僅回應副本被改，UI拒絕確認、保留待重試。鍵盤Enter重試沿同ID與完整payload，backend reused=true、磁碟只有一版且SHA／bytes一致；後續歌名編修保持未另存提醒，原案預覽不改目前台／media，回原標題才與保存留點一致。390px錯誤提示313px無局部overflow；console0、tab關閉／viewport reset／server62174 exit0／staging未建立。legal4／private／not_submitted保持，最新69／68／67保護，rolling active。

## v0.68.0

2026-10-05：分鏡畫幅可直接輸入，保留四個常用建議；自訂畫幅從完成需求、完整待辦報告或草稿接續時保持原值，沿既有來源核對及限定撤回。空白仍列待辦，不自動補值；素材保持。508 Python／804 JavaScript／70語法／四份Skill與120歷史ZIP核對通過。 指定v67 ZIP506／800獨立還原通過。實際Agent接受2.39:1，但前版需求匯入拒絕，已移除工作台額外四值限制。native tab113直接輸入1.85:1、需求raw 2.39:1及報告raw 3:2 CRLF；四次完成HTTP完整wire／files與明確來源相符，報告HTTP與Agent完全相同。後續畫幅編修阻止Undo／Apply、原after可撤回；空白產生一項待辦，完整建立在HTTP前停止。其他台與native WAV保持；390px input／note16–359、document375無overflow、Tab到mv-style、console0。tab關閉／viewport reset／server31268 exit0／staging未建立。Agent1／draft3／report1／14／19 tools及legal4／private／not_submitted保持，latest68／67／66保護，exact-source及實際遠端驗證依收據，rolling active。

## v0.67.0

2026-10-05：歌曲／分鏡完整待辦報告可接續原始欄位；先核對整份報告，再預覽、明確載入選定工作台。保留原始留白、文字、母題ID與音檔，沿既有限定撤回；不能表示的來源拒絕載入，原檔保留。506 Python／800 JavaScript／70語法／四份Skill與116歷史ZIP核對通過。 指定v66 ZIP503／794獨立還原通過。native tab112使用實際Agent music_review／storyboard_review檔案，preview未修改，Apply後HTTP完整wire／files與Agent相同，原CRLF、未知BPM、空白小節／時間與motif-7保持。後續編修阻止Undo／Apply；錯scope、notes、schema2與未支援方向拒絕且原成果保留。原完成需求仍經HTTP核對；390px Enter載入聚焦storyboard、note有界、console0，tab關閉／viewport reset／server90815 exit0。legal4／private／not_submitted、Agent1／draft3／14／19 tools保持，latest67／66／65受保護，exact-source／private PR／release／遠端驗證依收據，rolling active。

## v0.66.0

2026-10-05：條件草稿／報告明確套用後，可撤回最近一次條件套用；完整核對實際套用後的條件，後續編修拒絕覆蓋。恢復原始未完成值與之前的載入留點，保留下載確認、音檔及其他工作台。成功撤回把鍵盤焦點接回可編修欄位。503 Python／794 JavaScript／69語法／四份Skill與112歷史ZIP核對通過。 指定v65 ZIP503／785獨立還原通過。native tab110重現後續bits32拒絕、回原after24可撤回、換第二音檔仍保留、CRLF原條件重建報告完全相同、最近loaded留點恢復及錯檔保留；成功後焦點丟失已修正，fresh tab111實測preset／custom焦點、390px及console0。兩tab已關閉、viewport reset、server97795 exit0、staging未建立。原Agent1／draft3／14／19工具、legal4／private／not_submitted保持；exact-source封裝、private PR／Release及實際遠端依收據，latest66／65／64保護。rolling active。

## v0.65.0

2026-10-05：完整條件檢查報告可接續原始條件；Python／JS先核對整份報告，再由CLI選定檔案或工作台預覽／明確套用。保留未完成原文與音檔，錯誤／未知／晚到檔案拒絕。已載入條件與已確認下載分別留點，確認較早下載不再誤標新條件。503 Python／785 JavaScript／69語法／四份Skill，50份跨語言輸入與108歷史ZIP核對通過。 原生tab109以實際Agent報告選檔，驗證錯／未知拒絕、preview不修改、編修改動失效、Enter取消／套用、CRLF原值回送、native WAV及其他三台保留；390px幾何與console0，tab關閉／viewport reset／server12055正常exit0。舊v64指定ZIP完整497項回測有一項CIM查詢失敗，原封裝11項程序測試單獨重驗通過，778 JS通過；沒有把首次失敗宣稱全綠。原失敗與新run收據保留。legal4／private／not_submitted、14／19 tools與Agent1／draft3保持；exact-source封裝、private PR／release、實際遠端及latest65／64／63以收據為準，rolling active。

## v0.64.0

2026-10-05：自訂接受條件一次檢查三欄、點選定位並輸出共用來源核對報告；未完成原文與音檔保留，錯／晚回覆不覆蓋。CLI／Agent／MCP／HTTP同readonly操作，基本14／啟庫19工具。修正有界極大指數的Decimal例外。497 Python／778 JavaScript／68語法／四份Skill、85份跨語言來源与104歷史ZIP通過。 原生tab108已觀察三待辦／Enter定位、受控錯MD與晚回覆保留、zero-issue重試、native PCM一項DC提醒及停用原值，390px幾何與console0；owned tab閉合、viewport reset、server70761 exit0、staging未建。原失敗收據保留，最終新run與exact-source/private PR/release/actual remote/latest64/63/62依收據。legal4/private/not_submitted与Agent1/draft3保持，rolling active。

## v0.63.0

2026-10-05：音檔 Markdown 改由獨立 Python／JS 純排版產生並逐字核對；錯作品、錯 SHA、改規格／數值／提醒或新增宣稱均拒絕，原成果及音檔保留，合法重試正常。不可測值明示「不可測」，數字固定顯示位數，JSON 量測保持。490 Python／772 JavaScript／66 語法／四份 Skill 通過，83份真 File PCM 與100個歷史 ZIP bytes保持。 tab107實際四次HTTP200：正常、受控外來MD、受控MD錯hash、鍵盤正常重試；兩錯誤保留visible MD／摘要／三檔名／原音檔input value。390px幾何／console0／owned tab及viewport清理，server20346 exit0／staging未建立。下載僅一次click，UI明示已送出需確認保存；download事件10秒未取得path，不宣稱browser實檔已存。首focused兩測試資料錯誤（Windows檔名< >／超格式範圍vector）修正且保留失敗record/log；新retry33／57、首次full490／772／66／4通過。exact source/private PR/Release/actual remote/latest63/62/61依收據，legal4/private/not_submitted、13/18 tools/Agent1/draft3保持，rolling active。

## v0.62.0

2026-10-04：音檔報告 SHA-256 綁定實際選定 File 位元組，拒絕同名同大小錯來源；示範條件與條件草稿都核對完整回覆、產品／協定版本與嚴格報告 JSON。原成果保持，雜湊期間改選取消上傳，合法重試及自訂規格提醒正常。486 Python／767 JavaScript／65 語法／四份 Skill 通過，83 份真 File PCM 與96個歷史ZIP bytes保持。 原生tab106以default File SHA／真HTTP正常、受控protocol999、受控同名同大小錯WAV、兩次正常重試、自訂24接受實際16六回覆200；錯誤保持原visible report/visual/filenames/selected input value。完成狀態再核對Enter重試exact及下載enabled，custom warning需確認／原SHA保持；390px幾何、logs0、tab關閉/viewportreset/server58244 exit0/staging未建立。第一focused舊late fixture未等hash phase造成未觀察promise拒絕，修正測試時序且保留失敗log/run，fresh focused3／62與transport2通過。exact v61還原及本輪指定source/private PR/Release/actual remote/latest62/61/60依收據；legal4/private/not_submitted與13/18 tools/Agent1/draft3保持，rolling active。

## v0.61.0

2026-10-04：音檔報告新增獨立 PCM 數值核對：拒絕正值 sample peak、RMS 高於 peak、滿刻度樣本超過影格、安靜段超過時長及非立體聲相關值等矛盾回覆。原報告、表單與音檔保留，可重新分析；全安靜音檔兩端全長與四捨五入保持有效。484 Python／751 JavaScript／63 語法／四份 Skill 通過，83 份實際合成音檔與92個歷史ZIP bytes保持。 原生tab105真HTTP正常／QA受控矛盾／正常三回覆200，矛盾時原可見report／visual／檔名清單與selected input value保持；390px錯誤提示幾何通過，Enter重試完全一致。logs0、tab關閉／viewportreset／server11071 exit0／lazy staging未建立。前版v60指定ZIP還原及本輪exact-source/private PR/Release/actual remote/latest61／60／59依收據。Agent1／draft3／13／18工具與legal4/private/not_submitted保持；rolling active。

## v0.60.0

2026-10-04：ZIP核對失敗原因保留在選檔區，可清除訊息或重新選檔；編修表單保持提示，清除不取消既有撤回。純控制器的有界失敗metadata、DOM literal狀態與介面樣式分層，舊回應不能恢復已取消的錯誤。481 Python／743 JavaScript／62語法／四份Skill通過，88個歷史ZIP bytes保持。 原生tab104確認unknown99理由、BPM編修／clear／undo保持、依表單變更停用舊下載、直接重新選檔清除錯誤、成功預覽cancel保持重建成果；五actualHTTPwire200/400/200/400/200，logs0／390px提示幾何通過。tab關閉／viewportreset／server19483 exit0／staging未建立。v59ZIP還原479／736、指定source封裝／privatePR／Release／遠端與latest60／59／58依終收據；Agent1／draft3與13／18工具、legal4/private/not_submitted保持，rolling active。

## v0.59.0

2026-10-04：交付版本改由一份固定白名單管理，Python、瀏覽器封裝／回讀／差異報告及 Agent 使用同一規則；產品版本、草稿標示也取自同一契約。未知版本明確拒絕，不猜測範圍或靜默遷移。479 Python／736 JavaScript／62 語法／四份 Skill 通過，84 個歷史 ZIP bytes 保持。 原生 tab103 實際 v54 ZIP 預覽／載入／撤回保持表單与原成果，v60 HTTP400拒絕，v59 ZIP可核對；本版四檔ZIP真正HTTP送出8801 bytes，保存位置未驗。頁面v0.59.0與390px文字幾何通過、logs0，tab關閉／viewport reset／server64420 exit0／staging回收。指定source封裝、private PR／Release／遠端與latest59／58／57盤點依最終收據；平台not_submitted，rolling active。

## v0.58.0

2026-10-04：完整歌詞包共用Unicode文字邊界，名稱、每句文字與歷史說明在套用或匯出前一致驗證，拒絕不完整字元，避免產生無法再載入的JSON；原有效內容與待修正編修保持，修好可重試。Python／原生JS／application／Agent与固定預覽分層，合法emoji與原Unicode／控制字元不正規化。472 Python／730 JavaScript／61語法／4 Skills及原生驗收通過。 產品58／來源明確38–58、13／18工具、Agent1／draft3／review1／source1／template1保持。tab101／102關閉、viewport reset、server原handle exit0，staging未建立；四次實際合法HTTPwire通過完整新HTML核對。v57 ZIP還原、指定source封裝與private PR／遠端核對／latest58／57／56依收據；savedfiles／正式media／實聽／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.57.0

2026-10-04：獨立歌詞預覽共用文字下載處理，點擊或排程失敗可回收資源並重試；快速連點有界，離頁只回收下載。三格式用 lyrics.* 可攜檔名，作品名称與完整歷史保存在 JSON；訊息明確表示交給瀏覽器，保存位置另確認。純格式準備／共享控制器／原生傳輸分層，舊 LRC／SRT／JSON 內容保持。467 Python／723 JavaScript／61語法／4 Skills、原生驗收與v56 ZIP465／713還原通過。 產品57／來源明確38–57、13／18工具、Agent1／draft3／review1／source1／template1保持。原生tab99／100關閉、viewport reset、server原handle正常exit0；新HTML仍走完整外框核對。private exact-source發布／遠端核對／latest57／56／55依收據；瀏覽器download事件10秒逾時，保存檔未驗證。正式媒體／實聽／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.56.0

2026-10-04：獨立 preview.html 現在沿用工作台的格式保留規則，提醒 LRC 句首時間標籤與 SRT 空白句風險，按提醒可定位目前歌詞。編修、刪除、新增、播放位置及總長調整會停用舊定位；套用後重新檢查。全部句子計數、畫面前20項明示截斷，零提醒也建議保存完整 JSON。同步純規則／控制器／DOM分層，沒有網路或WebCrypto依賴。修正差異報告漏接受v54來源；四工作台真ZIP覆蓋明確來源38–56。465 Python／713 JavaScript／60語法／4 Skills、原生驗收與v55 ZIP463／704還原通過。 產品56／來源38–56、13／18工具、Agent1／draft3／review1／source1／template1保持。tab96／97／98已關閉、viewport reset、server原handle exit0／lazy staging未建立。private exact-source發布／遠端核對／latest56／55／54依收據；正式媒體、實聽、完整視覺、特定Host、瀏覽器保存與FreeTWAI仍待，rolling active。

## v0.55.0

2026-10-04：歌詞建立與帶時間匯入現在核對完整 preview.html：內嵌來源、标题、樣式、共用模組及執行程式必須符合本次完整歌詞與目前安裝的固定範本。錯來源／空預覽／程式改動拒絕，保留原表格與成果，正常重試可完成。Python 與瀏覽器共用同一範本，合成樣本輸出與 v54 逐 bytes 相同。463 Python／704 JavaScript／58 語法／4 Skills、原生三寬度與 v54 ZIP457／691還原通過。產品55／明確交付來源38–55，13／18工具、Agent1／draft3／review1／source1保持；內部 preview-template1 獨立。 tab94／95關閉、viewport reset、server原handle exit0／lazy staging未建立。private exact-source封裝／遠端／latest55／54／53依收據；正式媒體、實聽、完整視覺、特定Host、瀏覽器保存及FreeTWAI仍待，rolling active。

## v0.54.0

2026-10-04：格式報告可明確附帶對應的完整 lyrics.json，保留目前歌詞包全部值與校時歷史；預設 API／Agent 仍只有兩個精簡報告。瀏覽器單獨檢查產生三檔，建立歌詞包產生六檔，核對完整來源後才替換成果；錯來源／漏檔保留原編修。修正窄螢幕格式提醒按鈕溢出。457 Python／691 JavaScript／57 語法／4 Skills、原生三寬度與 v53 ZIP451／683還原通過。產品54／明確交付來源38–54，13／18工具、Agent1／draft3／review1／source1保持。 tab90–93關閉、viewport reset、server原handle exit0、lazy staging未建立。private exact-source封裝／遠端／latest54／53／52依收據；正式媒體、實聽、完整視覺、特定Host、瀏覽器保存及FreeTWAI仍待，rolling active。

## v0.53.0

2026-10-04：新增歌詞匯出格式保留檢查：句首時間標籤的 LRC 歧義與 ASCII 空白／tab 句的 SRT 遺失可定位原表格；完整 JSON 保存句尾、作品總長與校時歷史。唯讀報告用完整 package 的 SHA-256 核對來源，錯回應保留編修與成果；建立歌詞包會自動顯示提醒。新 review1 與 Agent1／draft3 分開，基本13／啟庫18工具；產品53與明確交付來源38–53同步。451 Python／683 JavaScript／57語法／4 Skills、原生三寬度及 v52 ZIP442／672還原通過。 tab88／89關閉、viewport reset、server原handle exit0／lazy staging未建立。private exact-source發布／遠端／latest53／52／51依收據。正式媒體／實聽／完整視覺／Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.52.0

2026-10-04：校時建立從本次送出的 cues／總長或完整 package 派生期望，核對完整回應、時間來源／歷史說明、嚴格JSON及字面LRC／SRT後才替換表格與成果。純 lyrics-result 共用建立及所有帶時間匯入；錯來源／損壞／不完整保留原編修、上一份成果及待套用校時。raw JSON也核對原句，seed保持。HTML只核對存在與字串、不完整語義驗證；wire／schemas／12／17 tools不變。442／672／55 syntax／4 Skills，一新Python＋十八新JS／HTTP／application跨語言／原生tab87故障保留及重試／完整package歷史／三寬度、v51 ZIP441／654還原通過。tab87關閉、server原handle exit0、lazy staging未建立。指定private發布／實際遠端／latest52／51／50及typed jobs依收據。正式媒體／完整視覺／Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.51.0

2026-10-04：SRT 尾空白／Unicode原文遺失、direct BOM差異與browser wrong-source回應已重現並修正；Python／JS SRT純層、shared timed-source guard完成。441／654／54 syntax／4 Skills，十三個新Python＋十三個新JS、CLI／JSON-lines／MCP／HTTP／cross-language、原生校時兩種總長／撤回／重讀／export、v50 ZIP428／641還原通過。LRC Unicode候選未重現，原LRC維持。tab85／86關閉、viewport reset、server原handle exit0／lazy staging未建立。private exact-source／actual遠端／latest51／50／49及typed jobs依收據。正式媒體／實聽／完整視覺／特定Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.50.0

2026-10-04：四種 LRC 原文遺失重現並修正；Python／JS 純解析分層、瀏覽器 source-response 核對完成。428／641／53 syntax／4 Skills，十二個新 Python＋十二個新 JS、CLI／JSON-lines／MCP／HTTP／cross-language／原生校時及 v49 ZIP416／629還原通過。tab84關閉、viewport reset、server原handle exit0、lazy staging未建立。private exact-source／actual遠端／最新50／49／48與typed jobs依收據。瀏覽器下載事件15秒逾時，保存檔未確認，未再點擊；正式媒體／實聽／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.49.0

2026-10-04：搜尋上一批與有界cursor history／command generation／DOM焦點完成；只留512對數字，不保留歷史全文或context，前進不限批數。416 Python／629 JS／52 syntax／4 Skill；十個新回歸、四台原生鍵盤往返／前後來源／編修失效／Undo與三寬度DOM、v48 ZIP416／619還原通過。tab82／83關閉、viewport reset、server原handle exit0及staging未建立。private exact-source發布／actual遠端與latest3／typed jobs依收據；正式媒體／完整視覺／Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.48.0

2026-10-04：大檔 current／讀取／refresh 不再複製及JSON序列化全文；純plain source snapshot／精確比較、controller full status與metadata view、DOM及單份preview cache分層。合成Node約8MiB／30次14,060.47ms→0.99ms、序列化2,516,606,400 chars→0，非瀏覽器速度或heap保證。416 Python／619 JS／52 syntax／4 Skill；原生四台、雙大檔來源各10次Next／尾端／明確Apply／後續編修失效與Undo保留編修、v47 ZIP416／602還原通過。tab81關閉、QA server原handle exit0及staging未建立；exact private發布／actual遠端SHA與latest3／typed jobs依收據。正式媒體／完整視覺／Host／瀏覽器保存／FreeTWAI仍待，rolling active。

## v0.47.0

2026-10-04：context1命中前後文完成，純UTF8／presentation／search opt-in／全份ZIP application／adapter及DOM分層；64-byte兩側／1152單項、單buffer共用，預設位置回覆保持。416 Python／602 JS／51 syntax／4 Skill，四台新頁面原生UI、8MiB尾端／保留來源／失效／Undo保留編修／三寬度DOM與v46 ZIP408／594還原通過。QA server正常關閉後metrics錯取未建立staging，原handle exit1與補證port0如實保留。exact private發布／actual遠端SHA及latest3／typed jobs依本輪收據。正式媒體／完整視覺／Host／瀏覽器全文保存／FreeTWAI仍待，rolling active。

## v0.46.0

2026-10-04：原文搜尋／直接定位完成，text-search1／完整ZIP application／CLI／Agent／MCP及Browser KMP／searcher／DOM分層，單buffer8MiB與reader共用、20筆有界結果，SHA pin接續及current source失效保護。408 Python／594 JS／50 syntax／4 Skill；四台原生UI、8MiB尾端與保留來源、empty／missing／literal、Enterfocus、三寬度DOM、Apply／Undo及v45 ZIP398／582還原通過。本輪下載送出但保存事件未核實；正式媒體／完整視覺／特定Host／FreeTWAI仍待。private exact-source與實際遠端SHA、latest3／typed jobs依本輪收據，rolling active。

## v0.45.0

2026-10-04：新增限定PID本機CIM補查；嚴格probe1、±9 ticks不確定範圍、清除保護與原handle退出保持。398 Python／582 JavaScript／48 syntax／4 Skill與diff通過。 原生父／子程序、6 ticks差值與正常退出核對通過；v44 ZIP387／582還原。指定source／privatePR／Release／actual remote SHA與latest3／typed run依本輪收據。正式媒體／實聽／完整視覺／Host／FreeTWAI仍待，rolling active。

2026-10-04：完整ZIP核對後可按UTF-8 byte boundary分段閱讀，text-window1／application／CLI／Agent／MCP及Browser純模型／controller／DOM分層。非零位置pin前次ZIP SHA，來源變更拒絕；原文4–16KiB有界，Browser單buffer8MiB／history512，前後段／回開頭與兩來源保持baseline。387Python／582JS／48syntax／4Skill；四台20段到EOF顯示核對，4份全文下載同ZIP bytes／SHA，原WAV、後續編修、晚回應取消、鍵盤focus及三寬度DOM通過。v43 ZIP377／572還原，private exact-source發布／actual remote bytes與latest3／typed run維護依收據。正式媒體／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.43.0

2026-10-04：完成全份 ZIP 核對後的明確原檔選取，pure selection1／共用 application／CLI／Agent／MCP 及唯讀 browser 原文下載分層。8 MiB／64檔可選小檔，512 KiB序列化 JSON cap保持；缺檔或未選取檔損壞整次拒絕。377Python／572JS／46syntax／4Skill；四台12檔加8388526-byte全文共13份實際下載同 ZIP bytes／SHA，baseline／後續編修／原WAV保持。取消晚回應、套用撤回、三寬度DOM與前版 v42 ZIP365／565還原通過。private exact-source／遠端核對／latest3與typed run維護依本輪收據；正式媒體／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.42.0

2026-10-04：完成共用原文 UTF-8 bytes／注入 controller／native Blob DOM，修正 form 換行與2MiB body截斷交付。五種文字入口 current source 重查，失敗不新增待確認，URL最多2個且1秒釋放；長文 preview32768units不拆emoji、完整來源與ZIP保持。365Python／565JS／46syntax／4Skill；四台13檔與原ZIP逐bytes一致、正好8MiB重下載、2份Python報告／draft3／stored版本／acceptance1真下載回讀通過，後續編修／原WAV SHA保持。三寬度DOM與v41 ZIP365／554還原通過；private exact-source發布／遠端hash及latest3／typed run維護依收據。正式媒體／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.41.0

2026-10-04：完成可保存的交付差異JSON／Markdown與來源ZIP SHA，controller過期來源拒絕；原生form encoded文字回復原bytes，四scope8份真下載與Python相同。launcher明確WAV／ZIP完整設定，在另一cwd實際MCP兩工具接受；default text output exclusive create修正race，同名新檔保持，多檔部分輸出明示。365Python／554JS／44syntax／4Skill；原WAV SHA、鍵盤Apply／Undo／取消晚回應、390／1024／1800geometry通過；v40 ZIP349／546還原通過。private exact-source PR／Release與遠端byte及latest3／typed-run維護依收據；正式媒體／完整視覺／Host／FreeTWAI仍待，rolling active。

## v0.40.0

2026-10-04：完成ZIP替換前精確原文差異／新增變更移除相同／換行計數／有界預覽及面板寬度排版；pure domain／application／adapter與跨語言model／controller／DOM分層。局部比較候選再查token／target，晚到不覆蓋新摘要，表單／媒體／全文保持；comparison1與其他schema獨立，12／17保持。349Python／546JS／43syntax／4Skill，四台原生對照／Enter載入撤回、5包真下載逐bytes同源、40000字全文／原WAV SHA與390／1024／1800px通過；v39 ZIP340／531還原。private發布／exact source／remote bytes及latest3／typed run維護依收據；正式媒體／完整視覺／Host／FreeTWAI仍待，rolling active。

## v0.39.0

2026-10-04：完成四台文字交付ZIP接續、原清單與SHA核對、預覽／明確載入／限定撤回；純domain／application／四adapter／controller／DOM分層。表單／媒體保持、原label再封裝，取消／late／跨scope拒絕；12／17工具，inspection1／package1／Agent1／draft3獨立。340Python／531JS／4Skill／42syntax及diff，原生5包下載讀回逐檔相同、原WAV SHA、390px Enter／1366px清單寬度及新文件成功提示通過；v38 ZIP328／491還原。private發布、source／remote bytes與latest3／typed run維護依本輪收據；正式媒體／完整視覺／Host／FreeTWAI仍待，rolling active。

## v0.38.0

2026-10-04：完成本輪全部文字成果ZIP／manifest1及四入口分層；基本11／啟庫16，Agent1／draft3保持。328Python／491JS／4Skill／39syntax，原生四工作台5次下載／逐檔SHA及未逾時取消／重建、390px鍵盤與1366pxDOM幾何通過；合成WAV原檔保留。v37 ZIP312／460還原通過。私有發布及限定run／latest3維護以本輪收據核實，正式媒體／實聽／完整視覺／特定Host／FreeTWAI仍待，rolling active。

## v0.37.0

2026-10-04：音檔自訂接受值與獨立原值條件草稿完成，model／controller／DOM及共用application／四adapter分層；shape保存未完成原文、active精確正整數，未知／來源不符／late拒絕。原音檔及限定套用其他panel保持，條件另存與draft3／下載確認分開，整份project載入回示範而raw仍在。312Python／460JS／4Skill／37syntax、四入口與HTTPUnicode界限／精確小數，原生download回讀、4秒late／500、390px Enter及1366px接受；v36 ZIP300／443解壓還原通過。指定source／privatePR／Release／遠端bytes／restore及latest3限定run收據跟進；兩QA server正常停止、tab59關閉／viewport reset。正式媒體／實聽／完整視覺／特定Host／FreeTWAI尚待，rolling active。

## v0.36.0


2026-10-04：四工作台建立旁狀態／查看成果／返回、清空後build fallback，純presentation／controller／DOM分層；沿既有bundle／busy／dirty及revision來源保護，不進draft3／wire。300Python／443JS／4Skill／35syntax、12新測試；390px／1366px四工作台原生成果及焦點往返，busy／500／4秒晚回應／原音檔保持、實際report／draft3下載讀回、真draft載入清空返回build。v35指定ZIP300／431還原通過；指定source封裝／privatePR／Release／遠端bytes、restore／限定run與latest3依收據。三QA server正常停止、tabs57／58關閉與viewport復原；正式媒體／實聽／完整視覺／Host／FreeTWAI仍待，rolling active。

## v0.35.0

2026-10-04：完成可重用維護工具，pure policy／Windows單handle唯讀／filesystem-Git／CLI分層；run1／audit1／recovery1分開，10／15工具與Agent1／draft3保持。creation identity排除PID重用、活動／未知阻擋；封裝latest3／嚴格七天／exact tag及Git bytes／preview token／journal先保存與無覆寫還原。300Python／431JS／4Skill／33syntax，19新增維護測試及合成真CLI清除一版、8檔bytes恢復、Windows handle與live server正常退出、原生四工作台／draft3讀回、v34 ZIP281／431還原通過。指定commit封裝／private PR與Release／遠端bytes／restore與最終限定維護依本輪收據；正式媒體／實聽／完整視覺／Host／FreeTWAI／原生file播放仍待，rolling active。

## v0.34.0

2026-10-04：完成原分鏡時間診斷及四adapter／工作台定位，與創作欄位／完整建立分層；秒數和影格各自核對，原值、順序、媒體及保存狀態保持。281Python／431JS／4Skill／33語法／diff；103跨語言及完成時鐘接受、11組IAB、三原生report／CLI草稿3／Agent與10／15工具、390px Enter、晚回應／500／來源／版本不符保護、1000列／2000待辦計數、24影格完整包。前版v0.33 ZIP267／413還原與暫存移除通過；指定commit封裝／privatePR／Release／遠端bytes／restore及限定PID、latest3依本輪收據。正式媒體／實聽／完整視覺／特定Host／FreeTWAI／原生file播放仍待；rolling active。

## v0.33.0

2026-10-04：完成真實瀏覽器原值遺失修正：數值／未知畫幅12值與特殊欄位8值，草稿四panel逐值相等；純raw-fields／DOM adapter／既有domain分層，排序與三工作台刪除還原、明確編修、原值報告及四adapter一致。267Python／413JS／四Skill／32語法／diff、24IAB、原生草稿／兩報告、390px Enter／4秒晚回應／foreign來源／原音檔6秒／確認另存；修正後歌曲136秒、分鏡576影格及歌詞6秒完整建立。前版v0.32指定ZIP267／400解壓還原通過。指定commit封裝／privatePR及Release／遠端實際bytes／restore與限定PID、latest3盤點依本輪收據。正式媒體、實聽、完整視覺、特定Host、FreeTWAI及原生file播放仍待；rolling active。

## v0.32.0

2026-10-04：分鏡唯讀storyboard_review、CLI原欄位／modern草稿、HTTP／JSON-lines／MCP與工作台報告完成；pure domain／application／四adapter、raw schema、共享readiness-report回覆核對與DOM分層。9／14工具、report1與舊protocol／schema分開；原鏡號／母題ID／原字串／音檔／另存確認保持。267Python／400JS／四Skill／30語法、64跨語言report／Markdown、27IAB／兩native／四adapter／真draft3→CLI及Agent、390px Enter／母題相關原列／35待辦20定位／4秒晚回應／完整時間重疊拒絕與576影格通過。前版v0.31 ZIP258／391還原；指定commit封裝、privatePR／Release／遠端bytes／PID與最新三版盤點依收據。正式媒體／完整視覺／特定Host／FreeTWAI／原生file仍待，rolling active。

## v0.31.0

2026-10-04：共用唯讀 music_review、CLI原欄位／modern草稿、HTTP／JSON-lines／MCP及工作台明確待辦報告完成；純診斷／report、application／四adapter、schema／JS完整回覆核對與DOM分層。8／13工具，protocol與舊schema保持，原值／原列／音檔／另存狀態保持；來源不同／未知版本／晚回應保留。258Python／391JS／四Skill／29語法、75報告／Markdown跨語言、18IAB／兩native／四adapter／實draft3→CLI及Agent、390px Enter／4秒晚回應通過。前版v0.30 ZIP249／382還原；指定commit封裝／privatePR／Release／遠端bytes與最新三版／PID依收據。正式媒體、完整視覺、Host、FreeTWAI及原生file仍待，rolling active。

## v0.30.0

2026-10-04：歌曲欄位待辦與建立／起稿前原位置定位，修正有效 BPM 120.0004 被 HTML 步長拒絕。純數值與文字規則、歌曲診斷、共享歌曲／分鏡快照控制器及 DOM 分層；40 段／200 明細／20 UI，修改或排序停舊位置、載入清暫態。249 Python／382 JS／四 Skill／29 JS 語法、69 欄位與 29 數值跨語言、26 IAB／四 adapter／四 native／實 draft3、Agent17鏡套用／撤回／390px Enter／晚回應通過。前版 v0.29 ZIP246／367還原；指定提交封裝／private PR／Release／遠端 bytes 及最新三版／PID 依收據。正式媒體、完整視覺、Host、FreeTWAI 及原生 file 仍待，rolling active。

## v0.29.0

2026-10-04：歌曲段落前移／後移與限定撤回，純順序／注入controller／DOM分層；同名與原欄位保持，後續文字／小節保留，結構變更或歌曲載入清舊紀錄。歌曲／起稿重建同序、既有分鏡／音檔保持；246Python／367JS／四Skill／26JS語法、10跨語言與21IAB、四adapter／四native／真draft3、Agent18鏡限定接續／撤回／390px Enter／晚回應通過。前版v0.28ZIP244／353還原；指定commit封裝／privatePR／Release／遠端bytes及最新三版／PID依收據。正式媒體／完整視覺／Host／FreeTWAI／原生file仍待，rolling active。

## v0.28.0

2026-10-04：分鏡創作待辦與建立前精確定位，純必填／引用、注入原始快照controller、DOM分層；其他panel／音檔保留，修改停舊位置、載入清暫態，待辦零仍須完整驗證。244Python／353JS／四Skill／25JS語法、59真Node／Python與27IAB、五native／draft3／四adapter、實際Agent17鏡102待辦與390px Enter通過。前版v0.27 ZIP241／336還原，指定commit封裝／privatePR／Release／遠端bytes和PID／最新三版依收據。非商用／private／schema保持；正式媒體／完整視覺／Host／FreeTWAI與原生file仍待，rolling active。

## v0.27.0

2026-10-04：修正新增／刪除鏡頭覆寫作品宣告，純時間／影格候選、注入controller及DOM分層，明確接續／限定撤回與實際after保護。241Python／336JS／四Skill／24JS語法、60跨語言及25真IAB，四adapter／五個native下載／真draft3／390px Enter與原生音檔保持；前版v0.26 ZIP239／321還原。指定commit封裝／privatePR／Release及遠端bytes依收據確認，最新三版與確定PID盤點。各schema／七與十二tools、非商用／private保持；完整視覺／正式媒體／Host／FreeTWAI與原生file仍待，rolling active。

## v0.26.0

2026-10-04：同名不同需求與JSON矛盾拒絕，建立／需求回讀共用純來源核對，修正歌名空白，原文／秒數／音檔及後續編修保持。239Python／321JS／四Skill／23JS語法、60跨語言與28真IAB、九個下載及draft3／四adapter／390px／Enter通過；前版v0.25 ZIP234／305還原。指定commit封裝、privatePR／Release／遠端bytes和PID依manifest收據確認。CSV／MD沒有瀏覽器逐字重算；正式媒體／完整視覺／Host／FreeTWAI及file:原生仍待，滾動目標active。

## v0.25.0

2026-10-04：可定位校時待辦與唯讀lyrics_review schema1，純Python／sharedJS／controller／DOM分層，原列／空白／source／media保持，沒有猜時間／裁切。七基本／啟庫十二tools；234Python／305JS／四Skill／22JS語法、50組跨語言／10000句邊界、21真IAB／四adapter／實檔／390px與Enter通過，前版v0.24 ZIP221／289還原。指定commit封裝、privatePR／Release／遠端bytes和確定PID以manifest收據核對。完整視覺／正式媒體／Host／FreeTWAI與獨立file:原生仍待，滾動目標active。

## v0.24.0

2026-10-03：修正選音檔默默改宣告總長，純共用時長比較／注入controller與DOM adapter分層；明確採用／撤回只改時長，原本空白且未編修才接續，source／cue／媒體保持。221Python／289JS／四Skill／21JS語法、20真IAB、四adapter／實檔／390px／Enter通過，前版v0.23 ZIP217／263還原。指定提交封裝、privatePR／Release／遠端bytes與確定PID以manifest和收據核對。file:原生離線驗證被工具政策阻擋，仅驗source VM；完整視覺／正式媒體／Host／FreeTWAI仍待，滾動目標active。

## v0.23.0

2026-10-03：修正分鏡1 ms內重疊／空缺／尾鏡影格不符；純共用映射／完成覆蓋及schema1宣告，JSON／CSV／提示稿／摘要同範圍，原秒數與FPS保持。另修正真下載草稿工具版本過期。217Python／263JS／四Skill／20JS語法、20項IAB、四入口／實檔／390px／Enter通過，前版v0.22 ZIP還原200／247。指定提交封裝、private PR／Release／遠端bytes與本輪PID以manifest及收據確認。非商用／private保持；正式媒體／Host／完整視覺／FreeTWAI仍待，滾動目標active。

## v0.22.0

2026-10-03：補齊獨立LUFS整合響度，純K-weighting／兩道gate、nearest-sample串流量測與有界自有ledger分層，同份SHA／PCM／RMS來源。不可測保持null與原技術接受結果，audio_loudness schema1與產品／協定分離。200Python／247JS／四Skill／19JS語法，20組原創WAV與FFmpeg最大差0.009464LU、26真報告JS核對；24項IAB、四adapter／實檔下載／錯誤與晚到／390px／Enter通過。前版v0.21 ZIP182／237可還原。指定提交封裝、私人PR／Release／遠端bytes與本輪PID以manifest及收據確認。非商用／private保持；完整規範／true peak／正式實聽／Host／視覺／FreeTWAI仍待，滾動目標active。

## v0.21.0

2026-10-03：修正編修離頁缺少提醒，純草稿內容 checkpoint、注入事件 controller、DOM adapter 分層；晚到保存只確認當時版本，下載需明確確認，現代檔案／保存版本明確載入才作比較。範例晚到保留編修，下載在同源框架中完成。182 Python／237 JS／四 Skill／19 JS 語法與29項 IAB，真 Agent 保存接續、四秒成功／500、下載／回讀／撤回／390px Enter及PCM通過。前版v0.20 ZIP180／220可還原。指定提交封裝、私人 PR／Release與遠端 bytes 以manifest和收據確認。離頁提示受瀏覽器互動與生命週期限制，完整視覺、正式作品、特定Host與FreeTWAI仍未完成；滾動目標active。

## v0.20.0

2026-10-03：共用嚴格JSON／UTF-8層修正需求損壞文字與重複版本被接受，外部CLI／HTTP／stdio／草稿保存與三個原生選檔入口共用，領域schema及六／十一工具保持。180Python／220JS／四Skill／十八JS語法，31項IAB含正常adapter接續、編碼／重複拒絕、音檔／晚回應保護、實檔下載／讀回與390px DOM。前版v0.19 ZIP168／206可還原。精確提交ZIP／private PR／Release與SHA以manifest與遠端收據為準；完整視覺、正式作品、特定host與FreeTWAI仍未完成，滾動目標active。

## v0.19.0

2026-10-03：完整歌詞包schema1保留名稱、宣告總長與待核對來源，嚴格JSON／未知版本拒絕、舊完整包明確轉換，工作台與離線編修共享契約。168 Python／206 JS／四Skill／十七JS語法；26項IAB含四adapter實檔、十秒音樂尾奏、推估提示、時長衝突、延遲／500、草稿讀回及390px／Enter。前版v0.18 ZIP156／189可還原。精確提交ZIP／private PR／Release及SHA以manifest、遠端下載收據為準。完整視覺、正式作品、特定host與FreeTWAI未完成，滾動目標active。

## v0.18.0

2026-10-03：歌詞TXT／LRC／SRT／JSON統一預覽後明確套用、取消與限定撤回；嚴格UTF-8／BOM、原文與留白起稿保持，修正慢讀取覆蓋與立即替換表格。156 Python／189 JS／四Skill／十六JS語法通過，CLI／JSON-lines／MCP真實產物接續，IAB延遲／取消／重選／下載及手機DOM證據見QA-v0.18.0。v0.17 ZIP156／168可還原。精確提交ZIP／private PR／Release以manifest及遠端收據為準。完整視覺、正式作品、特定host與FreeTWAI仍未完成，滾動目標active。

## v0.17.0

2026-10-03：完成已有歌詞→未校時起稿、Agent／CLI起稿讀回、預覽／取消／限定套用／撤回；保留原文與重複句，開始／結束留白。修正空白句不能記下播放位置，分別標記及整句移動、部分已校時播放；空白匯出拒絕。156 Python／168 JS／四Skill／十五JS語法，真正四adapter、三格式與草稿下載／讀回、音檔保留、晚回應／500保護及390px DOM／Enter通過；v0.16 ZIP146／146通過。精確提交ZIP／private PR／Release以manifest及遠端收據為準。完整視覺、正式作品、特定host與FreeTWAI仍未完成，滾動目標active。

## v0.16.0

2026-10-03：修正需求／保存版本預覽後覆蓋編修，現代草稿加入明確預覽／載入／取消；共用純replacement-preview、scope／全panels及原生File身份核對，讀取／預覽後改動保留內容。146 Python／146 JavaScript、四Skill／十三JS語法；真正Agent保存→HTTP清單／預覽／拒絕／載入／撤回、實檔草稿下載／讀回、音檔／延遲／錯誤／legacy／BOM／未知版、390px DOM及Enter焦點通過，v0.15 ZIP146／121通過。見docs/QA-v0.16.0.md；精確提交ZIP／private PR／Release以manifest及遠端收據為準。署名及非商用授權保持；完整視覺、正式作品、特定host與FreeTWAI未完成，滾動目標active。

## v0.15.0

2026-10-03：完成Agent／CLI分鏡時間起稿讀回、互斥檢查入口、1MiB預覽／取消／限定套用／撤回、來源毫秒／影格核對及目標編修保護。146 Python／121 JavaScript／四Skill／十二JS語法與diff、真正CLI／HTTP／JSON-lines／MCP、瀏覽器實檔JSON與draft3下載／讀回、音檔與其他草稿保持、延遲／錯誤／毀損／舊版相容、390px DOM與Enter通過。v0.14 ZIP解壓136／109通過。見docs/QA-v0.15.0.md；精確提交ZIP／private PR／Release以manifest／遠端收據為準。非商用與署名保持；完整視覺、正式作品、特定host及FreeTWAI未完成，滾動目標active。

## v0.14.0

2026-10-03：完成歌曲小節→分鏡時間起稿、預覽／取消／限定套用／撤回、來源與目標晚回應保護；修正需求／草稿撤回覆蓋後續編修。136 Python／109 JavaScript／四 Skill／十二 JS 語法與 diff、真正 CLI／HTTP／JSON-lines／五工具 MCP、瀏覽器起稿／空白拒絕／下載與草稿往返／音檔保留／晚成功與錯誤／390px DOM 與鍵盤通過。v0.13 ZIP 解壓124／93通過。見 docs/QA-v0.14.0.md；指定提交 ZIP／private PR／Release 以 manifest／遠端收據為準。完整視覺、正式作品、特定 host 與 FreeTWAI 投稿未完成，滾動目標 active。

## v0.13.0

2026-10-03：歌曲／分鏡晚成功不覆蓋，共用操作過期錯誤保護、純設計摘要／上一份狀態、歌曲小節／能量／任務、逐鏡提醒／母題位置及短桌面高度成果面板修正完成。124 Python／93 JavaScript／四 Skill／十 JS 語法與 diff，真正 CLI／HTTP／JSON-lines／MCP 四／五檔一致、IAB 延遲／錯誤保留／文字安全／JSON實檔／滑鼠與鍵盤下載／390px DOM 通過；v0.12 ZIP 核對／解壓124／80通過。見 docs/QA-v0.13.0.md。指定提交封裝／private PR／Release 以 manifest／遠端證據為準。署名與非商用授權保持；完整視覺、正式作品、特定 host 及 FreeTWAI 未完成。

## v0.12.0

2026-10-03：音檔單次複製／同份 SHA 與量測、PCM fmt 拒絕不一致、來源／接受條件／尾部安靜段／DC 摘要、換檔後上一份狀態與晚成功／錯誤保護完成。124 Python／80 JavaScript／四 Skill／九 JS 語法與 diff、真正 CLI／HTTP／JSON-lines／MCP、IAB 實際操作／JSON與Markdown下載／桌面與390px DOM／鍵盤通過；前版 v0.11 ZIP 核對／解壓112／69通過。詳細見 docs/QA-v0.12.0.md。指定提交封裝／private PR／Release 以 manifest／遠端證據為準。署名與非商用授權保持；完整視覺／正式實聽、特定 host 及 FreeTWAI 投稿未完成。

## v0.11.0

2026-10-03：整批歌詞校時預覽／套用／一次撤回、共用 CLI／HTTP／JSON-lines／MCP 校時、跨語言毫秒精度、離線 timing 提示及排序後 ID 修正完成。112 Python／69 JavaScript／四 Skill／八 JS 語法、實際瀏覽器錯誤／晚回應保留、音檔／文字／刪除歷史保留、JSON／草稿／獨立三格式實檔匯出及桌面／390px DOM 通過；前版 v0.10 ZIP 核對／解壓 99／55 通過，見 docs/QA-v0.11.0.md。指定提交封裝／private PR／Release 以 manifest／遠端證據為準。授權非商用保持；正式 host、完整視覺／正式作品及 FreeTWAI 投稿尚未完成。

## v0.10 歷史紀錄


2026-10-03：新增有界可攜 ZIP 備份、整份預覽與不可覆寫恢復；共用純版本契約／保存層及 HTTP／CLI／Agent，原 ID／時間／原始 bytes 保留。99 Python／55 JavaScript／四 Skill、真實瀏覽器下載／摘要、提交後 500 同備份重試、衝突／毀損保留、重啟與 390px DOM 檢查通過；v0.9 ZIP 解壓 77／47 通過。細節見 docs/QA-v0.10.0.md，指定提交封裝／private PR／Release 以 manifest 與遠端實際證據為準。重要草稿另存可靠備份；正式 Agent host、完整視覺／其他平台／正式作品與 FreeTWAI 投稿仍未完成。

## v0.9 歷史紀錄

2026-10-03：加入明確啟用的本機草稿庫，HTTP／CLI／Agent／MCP 共用不可覆寫版本保存、讀取摘要核對及分頁；瀏覽器有預覽／明確載入／撤回、未知結果同 ID 重試。77 Python／47 JavaScript、實際瀏覽器保存、受控回應失敗、Agent 寫入／23 版分頁、重啟持續保存、JSON 下載往返、毀損拒絕與桌面／窄螢幕 DOM 檢查通過；詳見 docs/QA-v0.9.0.md。v0.8 封裝解壓 62／38 通過。指定提交封裝與 private PR／Release 狀態以 manifest／遠端實際結果為準。授權、署名保持；特定 Agent host、完整視覺／正式作品及平台投稿未完成。

## v0.8 歷史紀錄

2026-10-03：六種列的局部刪除還原、選擇歷史、20 筆上限、容量保護、原始空白保留與歌詞晚回應保護完成。62 Python／38 JavaScript／四 Skill、瀏覽器真正下載回讀、音檔保留、容量／紀錄界限與延遲回應、390px DOM 幾何通過；前版 v0.7 ZIP 解壓 62／24 通過，詳見 docs/QA-v0.8.0.md。GitHub 提交／封裝／合併以 manifest、PR／Release 實際狀態為準；特定 host、完整視覺／正式作品與平台投稿仍未完成。

## v0.7 歷史紀錄

2026-10-03：四工具 discovery schema 分層共用、互斥歌詞來源／音訊正整數／MCP envelope 錯誤修正，清單項目旁提示與焦點完成。62 Python／24 JavaScript／四 Skill 通過；八 schema meta-schema 與七次真實 stdio 呼叫符合契約，瀏覽器實際修正／下載／回讀／撤回及 390px DOM 幾何通過。前版 v0.6 封裝核對、原版 56／24 通過。詳見 docs/QA-v0.7.0.md。特定 host、完整視覺／正式作品仍未完成，FreeTWAI 未投稿，GitHub 結果以實際 PR／Release／manifest 為準。

## v0.6 歷史紀錄


2026-10-03：歌曲語言／需求清單可編修，Agent／CLI brief 可經預覽回讀指定工作台並限定撤回；草稿 v3 保存新資料，v1／v2 明確轉換／取消／撤回通過。SRT 提示修正並新增 timing 來源。56 Python／24 JavaScript／四 Skill、實際 MCP → 瀏覽器 → 下載往返及 390 像素 DOM 幾何通過，詳見 docs/QA-v0.6.0.md。沒有宣稱實際 host 或完整視覺完成；前版封裝解壓 53／13 通過。授權不變，本輪 GitHub／封裝證據以實際 PR／Release／manifest 為準。

## v0.5 歷史紀錄

2026-10-03：本輪修正歌詞檔晚完成覆蓋與失敗選檔停用成果，加入分鏡概要／收合／定位／錯誤欄位展開，以及本版 Agent 啟動設定產生器。53 Python／13 JavaScript／四 Skill 通過；實際草稿、分鏡、歌詞下載與回讀、390 像素 DOM 幾何見 docs/QA-v0.5.0.md。Codex CLI 只驗證設定解析，未完成實際 host 工具呼叫。授權不變，前版封裝還原通過 52／8 測試。本輪封裝／GitHub 結果以 manifest、PR／Release 實際狀態為準。

## v0.4 歷史紀錄

2026-10-03：本輪完成多母題 UI、草稿 v2 明確轉換／取消／撤回、MCP stdio 2025-11-25 四工具，以及過深 JSON／空白時間鏡頭刪除修正。52 Python／8 JavaScript 及瀏覽器實際往返／下載驗證，詳見 docs/QA-v0.4.0.md。授權保持 PolyForm Noncommercial 1.0.0。前版封裝摘要重新核對，解壓後 44 項原版測試通過。指定提交封裝與 GitHub 狀態以 manifest／Release 為準。

## v0.3 歷史紀錄

2026-10-01：本輪完成共用 application 層、Agent JSON-lines v1、歌詞即時預覽與音檔競態修正、草稿下載／回讀／撤回，以及 PolyForm Noncommercial 1.0.0 授權。44 項 Python、4 項 JavaScript 與四份 Skill 格式檢查通過；具體瀏覽器證據見 docs/QA-v0.3.0.md，迭代／還原／交接見 CHANGELOG.md、HANDOFF.md。

下方保留 v0.3／v0.2 的歷史驗證，不表示本輪完整視覺、正式作品或 Agent 平台整合已完成。公開投稿與平台作者核實仍未完成。

## v0.2 歷史紀錄

2026-10-01（Asia/Taipei）· 創辦署名 ZOE. G · GitHub 帳號 djguan-jpg。

此輪採全新構思，只讀本次新建工作區與通用工具指引。未取用使用者其他本機專案、GitHub Repo、歷史作品或素材。公開第三方 README 的比較來源及自行設計差異見 CONCEPT.md；沒有 clone 或複製第三方程式／素材。

## 已提供

- 歌曲設計：BPM、小節、記憶點、敘事任務與能量曲線；四個可編修／交接的成果檔。brief 可重新讀入。
- 母題分鏡：時間覆蓋、母題狀態、人物與左右方向變化理由；五個成果檔，包含可重新讀入的 mv-brief。
- 波形校時：LRC／SRT／JSON 匯入、第一聲道波形、點擊與鍵盤定位、播放時間填入、逐句文字／時間驗證、匯出。
- 交付檢查：PCM WAV 規格、每聲道 peak／RMS／DC／滿刻度樣本、-60 dBFS 安靜段、整段立體聲相關性、SHA-256。
- 本機四工作台介面；修改輸入後標示成果尚未重新驗證，暫停舊成果下載；重建後恢復。
- 四份原創 SKILL.md。既有 v0.1 CLI 需求仍支援。

## 實際驗證

- Python unittest：35 項通過（21 項原有、14 項新增）。涵蓋各 CLI、規格／時間、PCM 數值、頭尾安靜段、反相聲道、規劃匯出往返、本機 HTTP 操作、錯誤輸入、接受來源、只開放指定頁面、真正 UTF-8 attachment 回應。
- Node 語法檢查通過；四份 Skill 皆通過 quick_validate.py。
- CLI 實跑原創範例：outputs/v02/music 4 檔，outputs/v02/mv 5 檔。
- IAB 實際網址與標題正確，內容非空，未見框架錯誤覆蓋；最後檢查沒有捕捉到 error／warn。
- 歌曲：120 BPM 為 136 秒；改 90 為 181.333 秒。JSON 真正下載至本機，檔案內容已核對。最後版本再確認 100 BPM 為 163.2 秒；修改後禁止舊下載，切換工作台仍保留提示，重建後才恢復。
- 分鏡：4 鏡、24 秒，檢查通過；移除鏡頭 3 的變化理由會出現待審查提醒。最終匯出包含 mv-brief。
- 歌詞：4 句匯入，60 秒合成 WAV 載入，波形完成，播放／暫停、點擊定位及 0.5 秒键盤微調、填入第四句時間與修改文字後驗證；新時間與文字出現在實際成果。故意重疊被拒絕。
- 音檔：合成 60 秒、48 kHz、16 bit、雙聲道，兩聲道 peak -20.002 dBFS／RMS -23.013 dBFS、無滿刻度樣本；相關性 1、SHA-256 與來源一致。
- 390×844 窄螢幕設定：歌曲工作台頁面沒有橫向溢出，四個導覽與成果區均在可用寬度內；已重設 viewport。只做 DOM 幾何與互動核對，沒有截圖視覺評審。
- 臨時 HTTP 測試伺服器已停止，沒有保留背景服務。

## 實際限制

尚未生成歌曲或影片、做語音辨識／自動對齊、使用正式作品評測、量測 LUFS／true peak，或完成其他瀏覽器及完整手機視覺驗收。原音檔保留；WAV 檢查不代表音樂品質或授權核實。

本機工作台的 HTTP 下載已確認 JSON 實檔及 UTF-8 attachment 回應；舊獨立 preview.html 的 Blob 下載本輪未重新確認。

## GitHub 與投稿狀態

已建立新的 private Repo：<https://github.com/djguan-jpg/zoe-g-music-lab>。第一版上傳保留本次四專案的 Git 歷史，創辦署名 ZOE. G，實際帳號 djguan-jpg，Codex 協作範圍如實記錄。

自由工坊新作品登錄表單要求「公開專案網址」；關係可選原作者，但頁面明示為自行聲明，平台不以此驗證作者或擁有權。Repo 仍 private，尚未送出；投稿資料已整理在 SUBMISSION-PACKET.md。沒有宣稱已取得平台創始人核實，也沒有認領既有手冊的原作者。


本輪發布前追加：任意Unicode分隔帶出Python codepoint與JS UTF16 raw order差異。首次source e79b41826f71a5b6b5c53e5607ba3baea88e1e12與通過的ZIP保留，尚未發布。共用UTC.compare先核對兩原stamp，再逐codepoint比較；list/search兩純validator共享，ASCII ID tie-break不變。新增actual保存Unicode pair/list/search continuation bridge與JS order/continuation，Python/JS原始字串同序、不改timestamp為曆時或normalize。第一次gap helper在修正後才執行，已corrected模型使assert失敗；新record讀first source的原L validator重現，兩次紀錄保留。第二次完整suite與封裝以final收據為準。


Final驗證：545Python68.281秒／901JS／82syntax／4Skills通過，維持2worker/120s。保留最初544/899/65.578秒收據及first package；新增tab124 actual list1/search1原三ID順序emoji/PUA/ASCII，source bytes/後續編修/dirty保持、console0、tabclosed、second owned server session22548/PID398704正常exit0/threadjoined/no staging。兩個native server都正常停止，共2個自有tab關閉；沒有擴大Agent或process能力。本輪helper共32個immutable identities，以既有單次32上限盤點，不取消較早失敗紀錄。
