## v0.170.0 完整接受接續診斷 2

原完整120／60秒再次失敗，連續三輪同一接受阻礙。原整合案例及十二個傳輸樣本提供新證據，沒有足夠依據修改產品或 capturing；原1073來源保持。已提出600／180秒必要決策，尚未推定批准；正式版仍v169、PR #169仍Draft，目標未完成。兩個自有暫存已移除，程序／age以最終收據為準。見[診斷2](docs/QA-v0.170.0-ACCEPTANCE-2.md)。以下原紀錄保持。

## v0.170.0 完整接受接續診斷 1

同一候選與原期限接續；原完整 Python／Node 再次失敗，逐項副本只完成40／57項，不能代替全套。原1072來源不變，兩個自有暫存目錄已移除。只更新接受紀錄／交接，標準程序 audit 與另份 exact-PID absent 診斷分層；正式版仍v169，Draft PR #169保持，rolling goal active。見[接續診斷](docs/QA-v0.170.0-ACCEPTANCE-1.md)。以下原紀錄保持。

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

# ZOE. G Music Lab

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


## v0.127.0 單版本備份

本機保存版本新增「下載選定版本備份」，可將選單中一個已保存版本另存ZIP。按下時固定ID，即使下載途中切換選單，也不改本次來源；成功提示明示該ID，整庫備份保持。空選擇／未啟庫／busy時停用；取消只中止自己請求、保留上一份成功備份來源。備份只含已保存版本，未保存編修、音檔與成果仍須另存。

backup-download純request嚴格核對ids、隔離／排序1–1000唯一ID；controller以click-time副本核對descriptor.selection及選定數量，沿原完整串流／SHA與latest／cancel／dispose。DOM共用同一sender、URL cap及verification來源，不增加第二個下載控制器或持久buffer。captureSelected只讀目前已展示records；library選擇事件刷新可用狀態，原预覽取消及後續編修保持。

既有POST /api/drafts/backup/prepare由{}整庫相容接續可選ids，沿共享Python selected_ids／export_library_backup；拒絕路徑、額外欄位、query、重複／空ID及跨Origin。ID不能選檔案路徑；沒有恢復或新增寫入權限。選定健康版本不讀未選定版本，整庫仍完整檢查。有效格式但不存在的ID維持既有HTTP500本機讀寫失敗，不自動重送。descriptor六欄、backup1／draft3／Agent1與27組operation schemas保持，20基本／啟庫27工具不變，沒有新asset、依賴、模型或外網。產品127／唯一policy明確來源38–127共90版，未知128拒絕。

見[契約](docs/BACKUP-SELECTION.md)。下方保留歷史迭代。


## v0.126.0 備份下載檔案核對

草稿庫備份旁新增「核對下載的備份 ZIP」。成功送出後可選回本機檔案，先核對1 byte至32 MiB容量，再以完整檔案SHA-256及大小核對本輪備份。來源只保留bytes／摘要／版本數；不持有完整備份，不恢復、載入、保存版本或确认未保存編修。新的成功送出遞增revision，即使內容相同也使舊讀取失效；下載失敗保留上一份來源。舊ZIP不能確認新ZIP。

純backup-verification嚴格原值模型、注入controller、原生File DOM adapter與原有backup-download sender分層。讀取與hash後重查本輪source／revision／busy、完整ArrayBuffer大小與選檔metadata，latest／cancel／pagehide／dispose保護晚回覆。原始32 MiB可完整核對；超限在arrayBuffer前拒絕。同大小錯bytes、短讀及來源失效保留原工作台、成果、列ID及草稿庫；選檔標為verification view control，不誤觸編修。單獨純verificationAllowed避免availability refresh寫入library訊息。

只新增三個固定GET JS資產；原備份domain／CLI／Agent／MCP／HTTP POST權限及schemas不变。20基本／啟庫27工具、27組schema、Agent1／draft3與backup1保持。產品126與唯一policy明確來源38–126共89版，未知127拒絕。PolyForm Noncommercial 1.0.0、ZOE. G及公開授權保持；四份自由工坊投稿已送出，創始身分仍submitted_unverified。

見[契約](docs/BACKUP-DOWNLOAD-VERIFICATION.md)。下方保留歷史迭代。


## v0.125.0 條件草稿下載核對

接受條件草稿下載旁新增「核對下載的條件草稿」。成功送出後可選回本次完整 JSON，以共享純 UTF-8 位元組核對確認該次保存快照；條件原值、工作台、列ID、媒體及既有報告保持。核對舊送出稿只確認它當時的條件，後來編修仍需另存；新的成功送出即使內容相同也使舊讀取失效。原本「已確認條件草稿檔案」按鈕保留。

既有純 audio-acceptance 保存模型不變；DOM adapter 只在 downloadText 成功後保留完整送出文字／遞增 revision，注入共享 text-verification controller／原生 File adapter，容量64 KiB在 arrayBuffer 前核對，沿 busy／visibility／latest／pagehide／dispose 保護。來源不取預覽或後來編修；失敗下載保留上一份有效來源。核對無需條件數值可解析，但分析仍完整驗證；BOM、重排、缺尾、同長錯文字、未知版本與額外欄位只要 bytes 不同就不確認。核對不是載入來源，不套用外部 JSON，也不改音檔。

原生測試重現核對選檔的 input 被通用 editor listener 視為編修，導致未改條件的報告過期。新 File 控制明確標示 data-view-control="verification"，重用既有唯讀排除；實際條件 input 仍照常標過期。沒有新增固定 asset、operation、POST、依賴、模型、外網或路徑權限。產品125／唯一policy來源38–125共88，未知126拒絕；20／27 tools、27組schemas、Agent1／draft3與獨立domain schemas保持。

見[契約](docs/AUDIO-ACCEPTANCE-DOWNLOAD.md)。以下保留歷史迭代。


## v0.124.0 草稿變更工作台

專案草稿的保存提醒新增變更工作台清單。尚未確認任何保存版本時，比對起始範例；已確認載入檔案、本機保存版本或下載草稿後，比對最近一次完整確認的內容。四個名稱固定依歌曲設計、母題分鏡、波形校時、交付檢查排序。還原一台的原值，該台退出清單；精確符合任何仍保留的完整版本或起始範例時，整份草稿維持既有已確認判定。

draft-retention 既有 checkpoint／注入 guard只新增隔離的 difference DTO（reference＋panels）；獨立 draft-difference 純模型嚴格核對列舉、最多四台、唯一／完整資料屬性後產生固定文字，app只更新提示 textContent／hidden。待確認下載不能替換參考；確認舊送出快照後，後續編修仍dirty。拼接不同保存版本的工作台片段仍需整份另存。原稿、列ID、媒體、成果、下載／本機保存流程與 beforeunload 原判定保持；摘要不帶原文／fingerprint／File／路徑，不進 draft3／Agent wire。新增一個固定GET JS，不新增 operation、依賴、模型、外網、登入或寫檔權限。產品124／唯一policy來源38–124共87，未知125拒絕；20／27 tools、27組schemas與獨立domain schemas保持。另修正根目錄 HANDOFF.md 的過期首頁版號。

見[契約](docs/DRAFT-DIFFERENCE.md)。以下保留歷史迭代。


## v0.123.0 草稿下載完整核對

草稿下載旁新增「核對下載草稿」。只有實際成功送出草稿後才可選檔；沿共享完整 UTF-8 原文位元組核對，比對本次送出的完整 JSON，而非預覽、檔名或 JSON 語義。相同檔案確認既有 click-time 保存快照；後續編修仍需另存，原工作台、時間、列 ID、音檔及成果保持。檔案可重新命名；BOM、重新排版、缺尾、舊送出稿或錯原文拒絕保存確認。原本明確「已確認草稿檔案」按鈕保留。

純 text-verification 模型 → 支援 draft scope／可選容量的注入 controller → 可選 IDs 的原生 File DOM adapter → app 的成功 onSent 與原 draft-retention guard。草稿容量1 MiB，在 arrayBuffer 前核對；既有成果預設8 MiB保持。最新 token、送出 revision、完整 source、busy、離頁及 dispose 防護保持；允許核對舊送出快照與後續 dirty 編修共存。送出時間只提供可見辨識，不是保存成功證據；File／檔案路徑、核對報告及暫態完整 source 不進持久草稿或 Agent wire。產品123／唯一 policy38–123共86，未知124拒絕；20／27 tools、27組 schemas、Agent1／draft3及領域契約保持，沒有新 operation、固定 asset、依賴、模型或外網能力。

見[契約](docs/DRAFT-DOWNLOAD-VERIFICATION.md)。以下保留歷史迭代。


## v0.111 待辦原列ID來源

三個純readiness模型 → 既有 `editor-focus.checkedSource` 的40段／1000鏡、own dense ID／64 UTF16 units／唯一性／固定initial length檢查 → 隔離ID副本與原panel精確列數檢查 → 原readiness-state來源fingerprint／report revision → 未改DOM橋接／原欄位定位。純共享呼叫提供固定visible=true／busy=false，只借用ID來源驗證，不改實際app的busy／visible門檻。來源的some／map／Symbol.iterator不呼叫，不把caller hooks搬入snapshot；沒有新增重複reader或新資產。

缺少自有index、空白ID、非字串、重複、超64units或與原panel列數不符時拒絕；讀取期間長度改變也拒絕。failed check保留上一份report及revision；refresh標stale，舊定位停用，精確恢復原欄值與ID順序後沿guard重新核對。成功重新檢查回第一頁，舊revision callback拒絕。未提供ID的歌曲／創作舊caller介面保持；時間原本要求ID仍保持。

產品0.111.0／唯一runtime policy38–111共74，未知112拒絕；17基本／24啟庫工具與24組既有input/output schemas、Agent1／draft3及領域schema保持。只改三個純JS控制器的ID來源，不改editor-focus本體、DOM／app／HTML／CSS、固定資產、Python domain／producer／application、server／CLI／Agent／MCP或程序政策。沒有新依賴、模型、路徑或網路能力。 見[契約](docs/READINESS-IDS.md)。

## v0.110 歌曲與分鏡待辦分頁

沿既有 `issue-page.js` 純metadata模型／注入controller → `issue-page-dom.js` literal DOM → 新 `readiness-page-dom.js` 報告橋接 → app 的原欄位與stable row IDs。橋接只在DOM層讀已保留報告；純分頁層不持有作品、File、DOM或網路。`readiness-state.js` 每次成功check／clear增加暫態revision，failed check不改上一份；定位同時核對報告revision與實際來源，舊callback拒絕。歌曲與時間沿原ID來源，創作補入鏡頭ID。翻頁只改暫態頁碼，不改原文、時間、媒體、草稿、上一份成果或下載dirty規則。

busy或離開所屬工作台時停用操作；stale可唯讀翻頁但停定位。來源原值與ID順序精確恢復時沿既有guard重新判為current，不要求永久stale；成功重新檢查即使內容相同仍增加revision並回第一頁。零明細隱藏導航。首末頁Enter使原按鈕停用時，焦點回到另一個可用翻頁按鈕；不搶走其他焦點。

產品0.110.0／唯一runtime policy38–110共73，未知111拒絕；17基本／24啟庫工具與24組既有input/output schemas保持，Agent1／draft3及領域schema保持。只新增一個固定GET資產；HTTP POST、application、Python producer、CLI／Agent／MCP、程序政策與授權邊界不變。沒有新依賴、模型、媒體生成或外網能力。 見[契約](docs/READINESS-PAGE.md)。

## v0.109 歌詞待辦分頁

`issue-page.js` 純 metadata 模型與注入 capture controller → `issue-page-dom.js` literal DOM／受控定位 → app 既有完整報告與 stable row IDs。純層只接受 detailCount／totalCount／revision／stale／busy／visible，不持有歌詞、File、DOM或網路；回調核對当前 revision及頁內原明細 index。忙碌或離開歌詞台時停用操作；編修後可唯讀翻閱上一份報告，定位必須重新檢查。翻頁不改原句、時間、音檔、草稿或上一份成果。首末頁按 Enter 後若原按鈕停用，焦點移到另一個可用翻頁按鈕；其他焦點不搶走。

產品0.109.0／唯一 policy38–109共72，未知110拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3及所有領域 schema保持。只新增兩個固定GET資產；HTTP POST、application、Python producer、CLI／Agent／MCP及程序政策沒有變更。沒有新依賴、模型、媒體生成或外網能力。

Windows CIM補查可能在既有3秒operation／5秒helper期限內回傳unavailable；沒有證據就保持unverified並拒絕清除。本輪只修正測試，涵蓋limited及unavailable時均保留資料，以及子程序EOF完成與外部補查是否確認的分離；不放寬程序政策或增加重試期限。早期完整測試與舊版還原遇CIM未確認的失败保留，最後現版595與原封裝v108595／1270均實際通過。 見[契約](docs/ISSUE-PAGE.md)。

## v0.108 完整回應值核對

既有 `json-document.sameValue` 純層 → 七個來源／完整回覆核對模組 → 原 current revision／scope controller → 原 DOM 與成果提交。比較原型別、完整自有欄位與 dense 陣列，不轉成 JSON 再比較；字面 Unicode、空白、換行及物件鍵順序獨立保持。有限數字、64層容器與262144對節點上限；不呼叫自有 getter、toJSON 或 caller map。Python producer、application、HTTP／CLI／Agent／MCP、app／HTML與操作權限保持，無新 asset、依賴、模型、媒體生成或外網能力。

產品0.108.0／唯一 policy38–108共71，未知109拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3／所有領域 schema保持。

固定歌詞預覽沿 template1全外框與本安裝模組核對。更新共用模組後，舊v107 HTML所嵌模組不同，現版明確拒絕回讀；同完整package的現版HTML通過，舊檔SHA保持，臨時還原移除。保留舊HTML與完整lyrics.json，需要接續時載入完整JSON並重新建立現版預覽；schema沒有遷移。舊版離線HTML仍保留其原程式，本輪沒有重写或宣稱新修正適用於舊檔。

五個外部JSON非有限數字案例與三個runtime額外undefined案例在基線確實誤判一致；undefined不是可在JSON編碼的欄位值。lyrics-preview只統一共用比較器，未宣稱它有上述基線缺陷。own descriptor／dense檢查不代表通用prototype、Proxy、繼承accessor安全或原子快照；比較器遇throw回傳false但未防止任意caller object的全部副作用。節點上限是比較訪問數，非任意外部物件的記憶體上限。PNG留ignored outputs；實際瀏覽器保存、完整視覺、screen reader、各OS IME、實聽、正式媒體、Host安裝及平台創始接受未驗證。 見[契約](docs/JSON-VALUE.md)。

## v0.107 歌曲段落搜尋

music_search／原生 music-search 純三欄字面與UTF-8位置、schema1／來源SHA → 共用application → CLI／Agent／MCP／HTTP → 注入current source／query／ID／result revision controller → literal excerpt DOM／native field focus。重用現有嚴格JSON、搜尋請求ownership、摘錄、輸入法Enter政策及editor-focus自有dense IDs核對；新三個固定JS assets。新增唯讀 music_search，17基本／24啟庫工具，需重新discovery；原23組input/output schemas保持。Agent1／draft3／既有交付schemas不改，產品107／唯一policy38–107共70，unknown108拒絕。沒有依賴、模型、媒體生成、外網或auth／路徑權限擴張。

搜尋不是歌曲完成、時間校準、實聽或權利接受；只按固定name／focus／texture順序列每段第一個字面命中。大小寫精確，不正規化或regex；開始原列1起，接續需來源SHA。原生下載點擊顯示已送出，但內建瀏覽器10秒未回報download事件，實際保存未驗證。PNG留在ignored outputs；完整視覺、screen reader、各OS IME、正式媒體、Host安裝與平台創始接受未驗證。不宣稱通用prototype／Proxy／accessor安全或外部改寫原子保證。 見[契約](docs/MUSIC-SEARCH.md)。

v0.106 完整焦點來源：editor-focus.checkedSource 純有界 length／own-index／ID 字串及唯一性檢查 → 隔離 dense ID 副本 → 原 index／ID proposal 與兩capture controller → 未改 editor-focus-dom。editor-selection 共用同一來源再沿原三capture／actual-after與DOM；不呼叫 caller map／iterator。固定原 length 控制讀取次數，讀完長度改變拒絕，不因 getter 增長超出上限。產品0.106.0／唯一 policy38–106共69／unknown107拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模型，app／HTML／DOM／domain/application/server/adapters與固定資產清單無diff，沒有新依賴、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-FOCUS-IDS.md)。下方保留歷史迭代。


v0.105 歌曲段落定位：editor-focus 純 byId 完整來源驗證與目前 ID 提案 → injected request controller 兩次 metadata capture 核對列序／visible／busy → 原 editor-focus-dom 依 ID 查實際名稱欄並核對可聚焦狀態 → app 原生 type=button／aria-controls／點擊。新 focusId 與原 index focus 共用 controller，保留原空列 add 行為；ID 查找不回退到新增。沒有新 keyboard listener，Tab／Enter 使用原生按鈕。產品0.105.0／唯一 policy38–105共68／unknown106拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模組及 app／HTML，沒有新增静態 asset、依賴、domain/application/server/adapter operation、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/MUSIC-ROW-LOCATE.md)。下方保留歷史迭代。


v0.104 回呼隔離：editor-position 純五欄來源／排列提案 → injected controller 保留自有 expected → writer 專屬六欄 DTO（before 五欄及 ids、afterIds 另複製）→ 原 raw-source order controller → 原始 expected actual-after → 固定原始位置通知。button／Enter 共用 finish；允許回呼修改自己的副本，不以 freeze 改變回呼介面，保留讀取次數與原 current-before／after-consume／false writer 語義。拒絕不符時不覆蓋或回滾外部編修。產品0.104.0／唯一 policy38–104共67／unknown105拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改一個純控制器，沒有 DOM／app／server／adapter、固定資產清單、依賴、路徑或網路權限變動。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-POSITION-CALLBACK.md)。下方保留歷史迭代。


v0.103 位置欄Enter：editor-position 純 strict gesture／none-hold-move intent → 原五欄metadata proposal／injected current-before-consume + current-after-consume + actual-after → editor-position-dom 自有可編輯INPUT keydown／preventDefault／focus → app 原完整raw-source order controllers。request button與enter共用finish，不新增history。只有自有當前位置input普通Enter消費default；IME／229、修飾鍵、其他鍵與已消費事件保持原生，repeat只消費不移動。純來源visible／busy也核對；失敗不回滾或宣稱成功。九原listeners加三keydown共十二，dispose只移除自身。產品0.103.0／唯一policy38–103共66／unknown104拒絕。16基本／23啟庫工具、23既有input/output schemas、Agent1／draft3保持；沒有新增assets、server／app diff、POST operation、依賴、路徑、模型或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-POSITION-ENTER.md)。下方保留歷史迭代。


v0.102 指定列移動：entry-order 純 arbitrary insertion／dense inverse → editor-position 純 metadata view／proposal／injected current + actual-after controller → editor-position-dom 自有九 listeners／literal ARIA／selected selector focus → app 原完整 raw-source order controllers。editor-order／music-arrangement 的 moveTo 共用原 history；歌曲移動及撤回增加完整來源的寫入前、實際 after 核對，拒絕 sparse sources／forged inverse。position 原字串是暫態 data-view-control，不修改 draft／revision；原操作仍完整驗證創作與時間。產品0.102.0／唯一 policy38–102共65／unknown103拒絕。16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持；只新增兩固定 GET assets，沒有新 POST operation、路徑、模型、依賴或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-POSITION.md)。下方保留歷史迭代。


v0.101 摘要快捷移動：沿 editor-keys 純 gesture／ID 提案與 injected current／consume／writer／actual-after 核對 → editor-keys-dom 自有 native SUMMARY 暫態 target／open bookmark → app 原完整 raw-source order controller。文字欄仍走原 caret 分支；摘要只讀 details.open，不讀或寫 input value／selection、不強制展開。只有同 ID、同 open 狀態、当前自有焦點才恢復 summary focus；沒有新 history、依賴、固定 assets、server diff、schema 或 Agent operation。產品0.101.0／唯一 policy38–101共64／unknown102拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4保持。PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-SUMMARY-KEYS.md)。下方保留歷史迭代。


v0.100 欄位快捷移動：editor-keys 純 gesture／相鄰 ID 提案 → injected controller current metadata／consume／writer／actual-after 核對 → editor-keys-dom 三容器 delegated keydown 與暫態欄位／caret bookmark → app 共用原 music-arrangement／editor-order 完整 raw-source 移動與撤回。keyboard 才回同一欄位，原工具列保持按鈕焦點；沒有新 history、創作 schema 或 Agent operation。兩個固定 JS assets；无新依賴、模型、外網、timer、路徑、auth 或寫檔權限。產品0.100.0／唯一 policy38–100共63／unknown101拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4 保持。PolyForm Noncommercial 1.0.0／private，創辦 ZOE. G／GitHub djguan-jpg；FreeTWAI not_submitted。見[契約](docs/EDITOR-KEYS.md)。下方保留歷史迭代。


v0.99 編修選列：editor-selection 純 metadata／ID 提案重用 editor-focus 與 entry-order → injected controller 三次 current IDs／visible／busy 核對 → 三容器 delegated focusin／refresh DOM → app 原 music selection 或 editor-order.select。只同步原生 selector／行標示／邊界按鈕，不呼叫 focus、讀創作來源、markDirty、改 revision 或建立 history；原動作保持移動按鈕焦點。busy 結束沿既有 collection refresh 核對當前原生焦點；隱藏、外部、已移除及 disabled target 拒絕。鏡頭 caption 使用 raw readValue 的目前 section／purpose，不依賴稍後才更新的 summary；穩定 IDs 時 select 不重建 options 或讀全文。兩個固定 JS assets，無新 operation／schema／依賴／timer／模型／網路／路徑／auth 權限。產品99／唯一 policy38–99共62／unknown100拒絕；16基本／23啟庫、Agent1／draft3、23 operation input/output schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted保持。見[契約](docs/EDITOR-SELECTION.md)。下方保留歷史迭代。


v0.98 列順序：entry-order 純 ID 相鄰排列與逆序核對，供原 music-arrangement 與新 editor-order 共用；editor-copy 原值 source guard → injected controller → editor-order-dom 原生選列／四按鈕 → app 原 readValue／writeEntries／markDirty／editor-focus。只保留最近 ID 順序與來源核對，metadata view 只有可撤回／stale／位置，不帶全文；busy／hidden 先拒絕讀取，提交前完整 source 與提交後隔離 expected 再查。DOM 只更新單列輸入標籤，未變順序不重建 options，原列 stable ID、raw 字串與 shot open 保持。三個固定 JS assets，沒有新依賴、operation、schema、Agent 路徑／寫檔／模型／網路／timer 或 auth。產品98／唯一 policy38–98共61／unknown99；16基本／23啟庫、Agent1／draft3、23 operation schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted 保持。見[契約](docs/EDITOR-ORDER.md)。下方保留歷史迭代。


v0.97 複製創作列：editor-copy 純原值／隔離提案／完整來源與 actual-after 核對 → injected controller → delegated editor-copy-dom → app 原 readValue／writeEntries／markDirty／editor-focus。draft3 契約提供三個列上限與欄位；40段／1000鏡／10000句，不猜時間、不合併同名、不改創作字串。鏡頭 open 僅頁面 metadata；新 row ID 使用同單調序列，完整替換舊列時保留原 IDs／open 狀態。busy／hidden／capacity 在 DOM gate 先拒絕，不讀原值、不分配 ID；full source 於 ID 前及寫入前重查，寫入後依隔離 expected 核對才通知焦點。render／busy／換台刷新按鈕只讀 count／visibility，不讀全部原文。複製只更新自己的 panel、dirty/checkpoint 与既有診斷，不增持久 copy 紀錄或 Agent operation。固定兩 JS assets；沒有新依賴、模型、網路、timer、路徑／寫檔能力或 auth。產品97／唯一 policy38–97共60／unknown98；16基本／23啟庫、Agent1／draft3／領域 schemas／legal4／private／FreeTWAI not_submitted保持。見[契約](docs/EDITOR-COPY.md)。下方保留歷史迭代。


v0.96 原值非負時間：Python common 與原生 planning-values 的 pure 原符號判定／非負讀取 → complete storyboard 與 partial timing → application 原四 adapters；browser 原 timing／overview／source guard／add-shot adapter。只在既有 finite decimal 驗證後核對負號及非零 mantissa，exponent 不作非零來源。signed number 與歌詞位移保持；frame ties-to-even／seconds tolerance不变。duration controller沿同Timing診斷拒絕提案，原 revision／late／scope／undo保持。無新asset／operation／schema／依賴／timer／模型／權限。產品96／唯一policy38–96共59／unknown97，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。見[契約](docs/NONNEGATIVE-PLANNING.md)。下方保留歷史迭代。

v0.52歌詞來源核對：校時建立從本次送出的 cues／總長或完整 package 派生期望，核對完整回應、時間來源／歷史說明、嚴格JSON及字面LRC／SRT後才替換表格與成果。純 lyrics-result 共用建立及所有帶時間匯入；錯來源／損壞／不完整保留原編修、上一份成果及待套用校時。raw JSON也核對原句，seed保持。HTML只核對存在與字串、不完整語義驗證；wire／schemas／12／17 tools不變。見[契約](docs/LYRICS-RESULT.md)。下方保留歷史迭代。

v0.51 SRT 純解析／原文核對：原各行空白與Unicode保留，物理多行明確 / 合句、原排版保留原檔／空白cue用JSON；Python／JS integer clock與單次文首BOM，application共用各adapter。lyrics-import對LRC／SRT沿共用timed-source guard核對原cues／time／inference與文字exports再preview／Apply；LRC原解析保持。產品51／來源38–51，wire／schema／12／17tools維持。見[契約](docs/LYRICS-SRT.md)。下方保留歷史迭代。

v0.50 LRC 原文保留：獨立 Python／JS 只解析相鄰行首時間、獨立 offset 與單次文首 BOM；literal remainder 保留。瀏覽器以原文核對 cues／time／inference 與 LRC／SRT 輸出，拒絕自洽但錯來源回覆，再 preview／Apply。多標籤歧義以版本1 JSON保存；原檔保持，wire／schema／12／17tools保持，明確來源38–50。見[契約](docs/LYRICS-LRC.md)。下方保留歷史迭代。

v0.49搜尋上一批：controller私有最多512對cursor與command generation，單batch／context保持；返回回讀原位置及序號，前進仍可全文接續。DOM範圍／邊界焦點、來源／query失效及retry分層；wire／schemas與12／17tools保持，明確來源38–49。見[導航契約](docs/DELIVERY-SEARCH-NAVIGATION.md)。下方保留歷史迭代。

## v0.48 輕量來源核對

delivery-source純internal plain bundle隔離容器／精確值比較，current核對原scope／revision／resultRevision／bundle及File身份，不只信任revision或共享object；不JSON序列化／clone全文。delivery-import full status／legacy onState保持，新view／onView／refreshView只含metadata；DOM明確走輕量路徑。單份雙側excerpt32768units／完整line counts快取，換檔／新ZIP／cancel／apply／undo清除。wire與12／17tools不變，產品48／明確來源38–48，未知拒絕。見[分層](docs/DELIVERY-SOURCE.md)。

在此工作區維護四個新專案，功能與狀態以 `projects.json`、`README.md`、`PROGRESS.md` 為準。

- 創辦署名 ZOE. G；GitHub 帳號 djguan-jpg；AI 協作範圍記錄在 FOUNDER-RECORD.md。
- 本機執行，Python 標準函式庫與瀏覽器原生 API；沒有模型金鑰或登入，不對外網路呼叫。本機工作台只綁定 127.0.0.1。
- 使用者已授權將第一版上傳至新 GitHub Repo，並準備自由工坊的原創專案發起資料。Repo 預設 private；公開需當次明確授權。新增依賴不在施工範圍。
- 只登錄本工作區的新作品，不認領既有 FreeTWAI 手冊的原作者身分；平台審核狀態需依實際結果記錄。
- 保留輸入媒體。輸出預設拒絕覆寫；使用者明確選擇 --overwrite 才替換指定輸出。
- 範例皆為合成資料。完整音檔、影片及私人素材不進 Git；測試產物留在忽略的 outputs 或暫存位置。
- 純字面包裝器不能宣稱已呼叫 AI；滿刻度樣本是可能削波訊號，不是聲音品質或版權判決；RMS 與 LUFS 分開。
- 修改後執行相稱測試；報告實際結果與未驗證範圍。
- 每輪採 codex/iteration-* 分支，開始前建立 restore tag，結束時提供 CHANGELOG／HANDOFF、指定提交的封裝與 SHA-256。驗收通過後以 private PR 合併，保留可審閱差異與還原點。
- 共用應用層服務 HTTP、CLI、Agent；產品版本、Agent protocol、草稿、保存紀錄與備份 schema 分別管理，未知版本拒絕，不靜默遷移。草稿庫只在啟動時明確指定目錄後提供保存操作，版本不可覆寫；備份恢復只新增／重用完整版本，保留原 ID／時間／位元組，不能藉 JSON 更換來源或目的路徑。
- 四個新專案目前採 PolyForm Noncommercial 1.0.0。保留 LICENSE／NOTICE；不另授予 AGPL 或商用許可。
- 每輪唯讀盤點本工作區 outputs、封裝及本輪程序。保留最新三個封裝版本；只有超過七天且可由 Git tag／遠端已驗證備份重建的本專案產物才列為清除候選。不得清理其他專案、素材或未確認程序。
- 使用者保存的草稿不是可由 Git 重建的產物，不進 Git／原始碼封裝，不得隨封裝維護清除；另行下載或備份所選草稿庫。
- 本專案採全新構思。只讀本次新建工作區及通用工具指引；不得參考使用者其他本機專案、歷史作品、記憶或 GitHub 專案。公開第三方 Repo 僅作有來源的需求研究；未授權不得搬入程式碼或素材。

- 歌詞校時共用 application、純 Python lyric_timing 及原生 lyric-time.js；half-away-from-zero 至毫秒，負值在捨入前拒絕。整批預覽／一次撤回不進草稿，套用只改時間；後續時間或句子改動拒絕整份撤回，文字／音檔／刪除歷史保留。

- 音檔雜湊與量測使用 audio_source 的同一自有副本，不重新開來源混用。PCM fmt 不一致拒絕；副本關閉，不洩漏臨時路徑。不宣稱外部同時改寫的原子快照、完整 RIFF conformance 或多聲道位置解讀。
- audio-review 純模型／inspect 核對 revision、原生 File 身份及接受條件；晚到成功／錯誤不覆蓋。輸入修改後標示上一份報告並停用下載，重新分析才恢復。

- 歌曲／分鏡成功回應經planning-review純模型與isCurrent才提交DOM／成果；共用run只顯示當前錯誤，過期成功／錯誤保留後續編修。dirty標示上一份設計並停用下載，收合不進草稿。設計能量不是實測音量，資料完成不是媒體生成。
- 寬桌面成果面板維持有界高度及局部捲動／鍵盤可達，窄視窗static流；修正後以實際滑鼠／鍵盤與下載驗證，不把DOM幾何當完整視覺驗收。

- storyboard_seed 為獨立 schema1 時間起稿，共用歌曲驗證與 application／四 adapter；v0.25至v0.30預設七工具／啟庫十二工具。source 的固定速度假設保留；未完成創作欄位留空，不能冒充分鏡／成片。每鏡最多整小節，保留段落邊界，超1000鏡／不足一影格拒絕。
- 起稿 preview／proposal 核對來源、目標與設定，晚回應不提交；局部套用保留其他 panel／音檔。draft-undo 核對實際 after 的限定／全部 panels，後續編修拒絕整份撤回，不覆蓋或丟棄 record；預覽／撤回不進草稿。

- 起稿檔回讀共用timing_slots／validate_seed／seed_files，seed1未知欄位或矛盾時間拒絕；storyboard_seed的music／seed互斥，匯入不能覆蓋FPS／bars設定。保留原檔，無靜默修正／丟棄創作欄位。
- file preview只核對target storyboard與檔案語義，music／settings編修保留；run可指定revision scope。checked file成果inputIndependent保留於頁面切換，生成成果dirty規則保持；上述暫態旗標不進草稿。

- replacement-preview純層共用需求／草稿／保存版本的讀取前與套用前snapshot，scope只核對目標，完整替換核對所有panels及原生File身份；未知／晚回應不覆蓋編修。原生媒體參照與preview payload不進持久草稿／Git／Agent。現代草稿也須明確預覽再載入，legacy維持明確轉換。

- lyrics_seed獨立schema1，純來源／行號／原文檢查共用application及四adapter；64KiB／1000非空白行，不猜時間、不去重／修剪原文。lyrics preview scope保留音檔／目前時長／其他panels，生成核對music來源、檔案核對目標；未知欄位／晚回應不替換，限定套用與實際after undo分層。
- cue-stamp純位置提案重用lyric-time毫秒規則，start／end分開、move保留句長及拒絕超音檔；部分有效cue只用於播放顯示，完整匯出仍拒絕空白時間。預覽／撤回暫態不進draft3，來源起稿JSON可保存於既有lyrics-source。

- 歌詞檔匯入由lyrics-import純request／reply／draft提案與controller分層，原生arrayBuffer嚴格UTF-8；讀取前snapshot、讀取後及HTTP後target scope與最新token檢查。TXT走既有lyrics_seed1／draft3，字幕走lyrics；選檔與Read均先預覽，不直接改原文／cue。apply／cancel與實際after限定undo保留其他panel／audio／duration；未知或晚回應不靜默取代。

- lyrics_package為獨立schema1，完整包root／timing／review_notes嚴格核對，未知版本／重複JSON欄位／矛盾來源拒絕。application三種lyrics輸入互斥，完整包檢查不可覆蓋名稱／時長／編修；legacy須明確轉換、原檔保持。
- 純lyrics-package.js與Python契約共用工作台／離線預覽，未改cue保留來源、確認總長仍提示曾補齊結束；人工編修加待實聽說明。provided時長衝突拒絕、空白才接續，estimated不填；source可保存於draft3既有欄位，不靜默遷移。

- 外部JSON共用json_document.py與json-document.js；嚴格UTF-8／重複鍵含跳脫同名／非有限數字／無效Unicode／64層，有界bytes。原生需求／起稿／草稿使用arrayBuffer及File.size核對，保留latest／target／預覽／proposal。可信生成結果與外部輸入分開，領域schema照常驗證，不做自動修補或版本遷移。

- draft-retention 純完整panel checkpoint／注入事件controller與DOM分層；markDirty只capture目標，離頁重查全部。原始範例與file／library／download各最近一筆完整確認可比較，metadata／File／成果／預覽不進草稿狀態。保存只確認click-time隔離快照，未知保存／放棄／送出下載不解警示；下載須明確核對後確認。現代檔／庫版本明確載入才留點，legacy轉換需另存；範例晚到保留編修。beforeunload受瀏覽器互動／生命週期限制，不宣稱自動保存／無資料遺失。

- audio_loudness獨立schema1；純loudness.py與有界自有loudness_blocks ledger分層，從同一音檔副本一次PCM掃描量測。單聲道／立體聲能量相加，nearest-sample 400ms／100ms；短檔／門檻下／未知layout／響度rate範圍外以null與status表達，不改既有技術接受。未知量測schema拒絕，舊無欄位報告明示未提供；RMS與LUFS／sample peak與true peak分開。FFmpeg僅外部校對，不引入執行或測試依賴，不宣稱完整規範認證、正規化或實聽。
- storyboard_frames 獨立 schema1；純映射與完成分鏡覆蓋層共用於 Python creative／seed 及 JS review／seed。保留最近整數、半幀取偶數；秒數容差不允許影格重疊／空缺或尾端不符，不自動調整原秒數／FPS。舊有效報告明示未宣告，現代缺失或未知版本拒絕；連續覆蓋不代表實際音畫同步。

- lyrics-media 共用純時長比較與注入 controller；選音檔保留已有作品宣告，原本空白且讀取期間未編修才接續首次有效時長。明確採用／撤回只寫 duration、同來源／實際 after 核對，保留後續 cue／原文／媒體。未知媒體與過期事件不能改內容；不裁切句子。比較／撤回不進 draft3／Agent，獨立 Apply 不直接用 player.duration，保留來源歷史提示。

- lyrics_review獨立schema1為唯讀未完成表格診斷；Python純layer與共用JS／注入controller／DOM分層。原列1起、global0，全部計數／有限200明細／前20UI，局部timed不表示全表通過。原始空白、文字與順序保持；不補時間／裁切，最終lyrics仍完整驗證。未知report／source不符／晚回應拒絕，報告與focus不進draft3；新tool唯讀、無路徑權限，v0.25至v0.30預設七／啟庫十二tools。

- planning-source 純核對本次完整需求與主要 JSON，planning-review checkedResult／checkedBrief 共用於建立與需求檔回讀；先 isCurrent，再檢查，最後提交 DOM。音樂標題依 Python 已清理 brief；數字與文字空白規則分開，母題提醒保留輸入順序。單份 JSON8MiB、重複鍵拒絕；不逐字重建 CSV／Markdown，sourceChecked 暫態不進草稿／wire。

- storyboard-duration純時間／影格候選與注入controller；新增／刪除保留宣告，明確採用只寫原始鏡尾。撤回核對原始時間／列ID／順序／數量／FPS及實際after，保留後續文字及媒體；載入新分鏡清除暫態，記錄不進draft或wire。仍須完整創作驗證。

- storyboard-readiness為純必填／引用與注入快照controller，定位前重查原分鏡；全部1000鏡／200明細／前20UI，載入清暫態，其他panel與媒體保持。filled不是完整驗證，原時間／影格／連戲照常拒絕，optional change_reason不改成必填，待辦不進draft3／wire。

## v0.29 段落順序

- music-arrangement純order／注入controller與DOM分層；五原字串、最多40列，穩定ID只存在本頁。同名不可合併；限定撤回只還原最近順序並保留後續欄位編修。
- 列或順序變更停舊撤回，歌曲載入清暫態。排序後歌曲及時間起稿重建同序，既有分鏡／其他panel／音檔保持；完整domain仍驗證，暫態不進draft3／wire。

## v0.30 歌曲欄位待辦

- planning-values 重用本專案 Python 文字空白／有限十進位文法，不使用空字串轉零；music-readiness 純欄位／範圍模型、共享 readiness-state 快照 controller、DOM 分層。保留原字串與 optional 歌詞，BPM step=any 仍完整驗證。
- 歌曲全部來源與列ID參與暫態定位；即使同文字列換序也停舊位置，定位前重查。歌曲載入清暫態；其他panel／媒體保持。40段／100清單／8MiB、全部計數／200明細／前20UI，零待辦及filled不是總長或作品接受。schema／wire／七及十二tools保持。

## v0.31 歌曲診斷跨工具報告

- music_review為唯讀原歌曲panel診斷；純Python report／application／四adapter、raw shape schema與JS同模型完整回覆核對／DOM分層。新的report1不替代music brief或完成驗證，原字串與原位置保持；零待辦仍needs_review=true。
- 8基本／明確啟庫13工具，需重新discovery，舊protocol／schema保持。40段／100清單／8MiB純source、傳輸2MiB／CLI草稿1MiB，全部計數／200明細／20UI；CLI0／2／1及預設不覆寫。核對source／完整data／JSON／Markdown後才提交成果，未知版本／來源不符／晚回應保留原成果、後續編修、媒體及草稿另存狀態。

## v0.32 分鏡診斷跨工具報告

- storyboard_review純原形狀／必填／畫面方向／母題引用、原列related_row與確定性report；application／四adapter／raw schema分層。1000鏡／30母題／8MiB純source、傳輸2MiB／modern草稿1MiB、全部計數／200明細／20UI；零待辦仍needs_review=true，不能代替完整時間／影格／連戲／媒體驗證。
- readiness-report純完整回覆核對由歌曲／分鏡共用，schema／protocol／source／data／JSON／Markdown一致才交出隔離結果；app沿revision／late／busy保護後才提交DOM。來源不同／未知／晚回應保留原成果與後續編修、音檔及草稿checkpoint。原字串／鏡號／母題ID保持，暫態不進draft3；9基本／明確啟庫14工具，需重新discovery，v0.31的8／13為歷史。


## v0.35 迭代封裝與程序

- 維護pure policy／Windows唯讀reader／filesystem-Git adapter／CLI分層，run1／audit1／recovery1獨立；不用Agent或HTTP增加清除／程序權限。
- Managed Python job啟動時自我登記PID／creation ticks／image basename，same-host核對；bare PID不判定ownership，重用外部程序保留，unknown不冒充已停止。不枚舉／kill或讀環境、命令列。
- scripts/iteration_audit.py預設稽核，僅完整direct release manifest／ZIP且latest3之外、嚴格超七天、exact tag／source／現場Git archive SHA才可列候選。prune需exact preview token與無running／unverified記錄，journal先保存；只搬移核對的本專案目錄、unlink兩檔／空目錄；restore拒絕覆寫。未知檔／連結／不完整封裝及草稿／備份／媒體保留。
- 讀寫有界manifest／journal與ZIP中央目錄，超限在搬移前拒絕。I/O可有部分結果，保留journal／隔離檔人工核對，不宣稱原子交易；Git objects／archive bytes不足不能冒充復原。每輪管理job依原handle正常停止，最終audit不能取代actual session completion。


## v0.36 成果查看與返回

- delivery-navigation純DTO／注入controller與DOM adapter分層；只讀scope／names／busy／dirty／message／error。導覽不進draft3、成果或Agent wire，完成不自動搶焦點。
- show／back明確操作前重查；busy停用，dirty仍可閱讀上一份且保持原下載停用，換台清舊返回目標。成果清空返回目前可操作build，避免聚焦disabled／hidden控制。literal text、aria關聯與auto捲動；新增asset不擴大Agent／HTTP operation權限。

## v0.37 接受條件草稿

- audio_acceptance獨立schema1原值模型／application／四adapter，64KiB／每欄1024字元／64值／safe integer；精確十進位整數，不因float捨入接受小數。shape可保存未完成欄位，active prepare才驗證數值；未知／額外／互斥拒絕。原profile及直接清單保持，10／15 tools與draft3保持。
- browser純原值／注入capture-read-replace-events controller／DOM；選檔先preview，read及apply重查token／target原文／native audio identity／busy。條件另存checkpoint與下載明確確認獨立，beforeunload不是自動保存。整份project載入deactivate自訂但保留raw，其他panel與媒體限定套用保持。
- inspect先驗有效條件、後revision／File／raw source，再實際acceptance／echo draft／report JSON-data／檔名核對才提交。未知／不符／late保留原成果與編修；dirty停下載。原音檔與legal4保持，未完成原值不冒充接受或實聽通過。


## v0.38 本輪文字交付

以下v38章節為當輪契約；v39新增delivery_inspect後基本12／啟庫17。

- delivery_package純來源／manifest1／確定性ZIP、application、CLI排他filesystem／HTTP有界staging／Agent-MCP及browser controller／DOM分層。1–64檔、8MiB文字、32MiB封套，平面可攜text names；不新增媒體／路徑／模型／自動寫檔能力。
- Agent預設metadata；明確include_archive且ZIP≤512KiB才inline，傳輸行2MiB保持，基本11／啟庫16工具。needs_review=true；封裝不冒充創作／媒體／權利接受，product0.38／交付schema1／protocol1／draft3獨立。
- browser完整source／revision／scope／dirty核對及逐檔摘要，未知／不符／late拒絕並取消自身有效ID；busy停用、原輸入／其他台／媒體保持，清單不進草稿。HTTP每類最多2slot／60秒／take一次／SHA，discard／expire／close只清自身檔且保留未知檔；不新增auth或常駐程序。CLI預設拒覆寫，--overwrite才替換明確目的ZIP。

## v0.39 文字ZIP接續

- delivery_inspect共用pure bounded canonical reader，不解壓／不執行HTML；CLI只寫指定摘要，Agent／MCP啟動時--delivery-zip選來源，JSON不得選路徑。預設metadata，include_files明確選擇且序列化JSON UTF8≤512KiB。
- browser先讀選定ZIP原清單，與自身bytes／SHA及server完整逐檔回覆核對；probe不冒充完整CRC核對。選檔→預覽→明確載入成果，表單／media保留，限定undo不覆蓋後續結果。原label與display note分開。
- inspection1／package1／Agent1／draft3獨立；基本12／啟庫17。只接受明確工具38／39，升產品版本先同步producer／inspector／browser支援表與契約測試，不自動接受未知版本。SHA／清單不驗證作者、權利或平台創始身分。


## v0.40 原文差異審閱

- 以下新規補充v39：delivery_inspect baseline明確scope／files，不可路徑；0–64檔／8MiB，聯集128，原檔名／UTF8精確比較，不合併。application服務CLI／Agent／MCP，HTTP原binary inspection保持，browser同契約經跨語言測試。
- comparison1與inspection1／package1／Agent1／draft3獨立，12／17工具保持。本版明確支持producer／inspector／browser工具38／39／40，未知拒絕；升版同步支持表與測試。
- 比較候選留局部，token與target再核對後才提交；不得讓舊async比較改新摘要。excerpt最多32768 UTF16且不拆surrogate pair；換行計數讀完整原文，textarea顯示不冒充原bytes。預覽與計數不進原wire/files，載入／下载保持全文。
- DOM literal text、readonly與缺檔／空檔分開，container width≥640px才雙欄，窄側欄上下；沿既有scope／revision／result／media／busy及限定undo保護。


## v0.41 可保存報告

- delivery_report純來源metadata／comparison驗證，JSON與Markdown逐UTF8 bytes跨語言相同；comparison1獨立、256KiB合計、最多128列，不帶成果原文／媒體／來源路徑。application從真ZIP與明確baseline派生，不能接受任意報告取代來源。
- include_report strict bool，要求baseline、與include_files=true互斥；default wire、12／17工具及其他schema保持。controller只對current pending來源下載；過期／取消／已apply／reading保護與hidden fields清除。
- HTML form會正規化換行。報告使用encoding=json-string，DOM JSON.stringify全文→HTTP既有嚴格decoder還原字串→下載原UTF8；拒絕未知／額外／重複欄位，勿全域正規化成果原文。
- launcher明確--audio WAV／--delivery-zip ZIP只列印絕對設定，不能改Host／讀媒體或宣稱Host安裝接受。
- filesystem text_outputs預設exclusive create，common保留API；預檢後同名新增也拒絕。多檔可部分輸出，錯誤明示，不宣稱交易式回滾、不刪除interloper。
- 本版producer／inspector／browser package／archive／import／report明確來源工具38／39／40／41，升版同步與測試，未知拒絕。


## v0.42 原文下載

- 五種browser文字入口共用text-download純Unicode／UTF8 bytes／注入controller及native DOM Blob adapter；current canonical source重查busy／dirty／選定名稱，不讀preview或hidden field，不經form正規化。單檔最多8MiB，其他領域原上限保持；未知Unicode／路徑／裝置名拒絕。
- object URL最多2個，送出後1秒、失敗、pagehide／dispose清理自身URL與timer。sent不冒充保存成功，確認舊snapshot保留後續編修；acceptance send callback先完成，失敗不新增pending。
- 結果預覽重用excerpt32768UTF16 units、不拆surrogate，aria提示明示摘錄，download與ZIP仍全文。binary staging與v41 HTTP相容保持，沒有Agent路徑／寫檔／網路權限擴張。
- 明確來源工具38／39／40／41／42，未知拒絕；12／17工具及Agent1／draft3／交付schema保持。v41 browser form段落是歷史實作，現版使用native bytes，HTTP編碼相容仍保留。


## v0.43 指定 ZIP 原文

- 原檔名驗證共用 delivery_package；selection1是已完整核對來源的純選取，不得跳過未選取檔的CRC／hash／canonical核對。明確檔名1–64且大小寫精確，全部存在才回傳。
- application／Agent／MCP選定files JSON限512 KiB；CLI --file-name明確輸出沿8 MiB完整來源，拒絕metadata碰撞、預設覆寫及report混用。沒有JSON路徑或自動寫檔權限。
- Browser originalFile只讀pending current source，重查工作台、表單／成果revision、bundle、busy與media。empty可下載、removed停用，取消／套用後拒絕舊來源；DOM只快取names與可用狀態，沿既有native bytes adapter。
- selection1獨立於Agent1／draft3及交付schemas，12／17工具保持，來源工具明確38–43，未知拒絕；I/O提示共用operation_errors且不漏私人路徑。見[契約](docs/DELIVERY-SELECTION.md)。


## v0.44 原文分段閱讀

- text-window1純請求／UTF-8 byte boundary model → application全份ZIP核對與SHA pin → CLI／Agent／MCP。起點字元中間拒絕、不自動調整；max4–16384，非零需archive_sha256，未選取檔損壞仍拒絕。明示片段不是完整檔案，files保持空、不能混用include_files／file_names／include_report。
- Browser純UTF-8模型／注入reader／DOM → current pending source；source key隔離原值、讀後重查。單buffer最多8MiB，頁面16KiB，history最多512；換檔／失效／cancel／apply／undo清除，不進status／草稿／wire。empty與missing分開，原下載全文及限定撤回保持。
- 12／17工具與Agent1／draft3及交付schemas保持，text-window1獨立；來源明確38–44，未知拒絕。只新增兩靜態JS，沒有路徑／寫檔／模型權限擴張。見[契約](docs/DELIVERY-TEXT.md)。

## v0.45 程序唯讀補查

- 原 Windows native unavailable 才補查同一明確 PID 的本機 CIM，三欄 ProcessId／Name／CreationDate、hidden／no-profile／no-interactive，operation3秒／自有helper5秒。無全域列舉／command line／環境／remote／原工作或外部程序終止。
- process-probe1純嚴格有界解碼／Windows adapter／原生路由／maintenance純政策分層；成功明確null才absent，未知／錯誤／warning／逾時保持unavailable。CIM時間±9 ticks內保持unverified，不假造精確ownership；明確分離／不同image才pid_reused並保留外部程序。
- run1／audit1／recovery1及12／17工具／Agent1／draft3保持；補查evidence只有basename／ticks／精度。產品45與交付來源明確38–45同步，未知拒絕；沒有新增Agent／HTTP維護權限。見[契約](docs/PROCESS-PROBE.md)。


## v0.46 原文搜尋與定位

完整核對 ZIP 後，text-search1 精確比對原文並回傳有限筆 UTF-8 命中位置；非零接續需前次 ZIP SHA。瀏覽器在「分段閱讀完整原文」輸入搜尋字，按尋找或 Enter，再選擇命中位置直接跳到原文；可搜尋 ZIP 或目前保留成果。每批20筆，原文、表單與媒體保留，來源變更清除舊結果。12／17工具、Agent1／draft3及既有交付 schemas 保持；交付來源明確38–46，未知拒絕。見[搜尋契約](docs/DELIVERY-SEARCH.md)。以下較早章節保留歷史迭代。


## v0.47 命中前後文

搜尋清單改以原文鄰近文字辨認重複句，選擇後顯示唯讀片段並定位原文。context1每側最多64 UTF-8 bytes、不拆字元，單項最多1152 bytes；清單標示換行／控制符號、整理側邊連續空格及120字元摘錄，原文DTO與片段仍保留原值。Agent／MCP明確include_context=true、CLI --match-context才提供；預設位置回覆與12／17工具保持，source SHA與current source失效保護沿既有搜尋。產品47、來源明確38–47，未知拒絕。見[前後文契約](docs/DELIVERY-CONTEXT.md)。下方保留較早迭代。


## v0.53 匯出格式檢查分層

純 Python／原生 JS export-review1與 integer-ms export-source1 SHA → 共用 application → CLI／Agent／MCP／HTTP；browser 注入 controller → current capture／完整回應核對 → DOM。新 operation 唯讀13／18；Agent1／draft3保持，row ID只在頁面，report不帶完整cues。LRC共享既有grammar，不修改解析語義；SRT ASCII空白／tab精確規則。全部10000句計數／前200明細／畫面前20，有界報告。wire package句號與當前表格句號分開，stable IDs定位；編修／late／cancel保留原資料。legal4與private保持，FreeTWAI未提交。見docs/LYRICS-EXPORT-REVIEW.md。

## v0.54 完整歌詞與精簡報告分層

純 export-review 驗證一次並複製完整來源 → 精簡 report + opt-in JSON → application → CLI／Agent／MCP／HTTP。JS純 files／完整 inspect → injected controller current capture／scope → DOM；完整附檔精確鍵、strict JSON、2MiB及語義值核對，report維持256KiB。default兩檔保持；browser明確三檔／建包六檔，row IDs仍只在頁面。來源排版bytes非保存承諾；無新路徑／寫檔權限／模型／依賴。窄螢幕提醒換行限寬，table自己捲動。產品54／來源38–54、13／18工具及Agent1／draft3／review1／source1保持，legal4／private／平台not_submitted保持。見docs/LYRICS-EXPORT-BUNDLE.md。


## v0.55 完整歌詞預覽核對

Python fixed assets/lyric-preview.html + 同一套 timing／strict JSON／package／media模組 → render_preview／公開固定template1 script → application既有HTTP／CLI／Agent／MCP。JS lyrics-preview純有界來源與整份HTML核對 → lyrics-result共用guard → injected import／app current revision → DOM與成果提交。範本與模組不取使用者路徑；回傳HTML不執行。完整來源2MiB、encoded JSON12MiB、HTML16MiB、contract256KiB；未知schema拒絕，物件key排序與數字拼法不作來源證明。固定HTML外框逐字比較；只接受本安裝的共用範本與模組，非通用HTML安全或作者／版權證明。产品55／明確交付來源38–55、13／18tools、Agent1／draft3／review1／source1保持。見[契約](docs/LYRICS-PREVIEW.md)。下方較早HTML僅存在的描述保留歷史，以此輪為準。


## v0.56 獨立預覽格式保留

既有shared export-review同步analyzeSource／public analyze → async完整report來源SHA（原wire）或offline controller有界view → literal DOM presenter／revision定位 →固定preview範本。Controller只保留counts／前20issues／固定notes／stale及revision，沒有歌詞全文／media／DOM／網路；current edit／delete／add／stamp／duration及media adoption／undo均invalidate，成功Apply才accept按已排序rows定位。DOM只文字與焦點，舊callback帶revision拒絕。同步提示不依賴WebCrypto，完整Agent report仍沿原SHA功能。Python固定producer嵌入LRC grammar／export rules／controller／presenter，template1 whole-envelope核對包含這些程式。產品56／來源明確38–56、13／18、Agent1／draft3／review1／source1／template1保持；HTTP與授權邊界無diff。詳見[契約](docs/LYRICS-OFFLINE-EXPORT.md)。


## v0.57 獨立歌詞下載分層

純lyrics-download.select驗證完整package／明確三格式後回傳固定name+content；不取DOM／media或保存狀態。共享text-download模型嚴格準備UTF8 bytes，text-download-dom新增createController factory沿同internal sendPrepared，既有form bind也沿該factory。預覽select先驗格式、執行既有Apply，再取完整目前data；adapter只建Blob與暫存anchor，兩pending上限／排程或離頁回收，失敗不留ownedURL。onSent是已提交click+schedule，與實際saved file區分；成功Apply已提交的編修不因下載失敗撤回。Python固定producer另嵌入formatter與web兩共享原生模組，無外部script URL；whole-envelope template1檢查包含新內容。產品57／來源明確38–57、13／18、Agent1／draft3／review1／source1／template1保持。見[契約](docs/LYRICS-DOWNLOAD.md)。


## v0.58 完整來源Unicode邊界

json_document.utf8_bytes與json-document.assertUnicode共享既有嚴格Unicode規則，Python decoder亦沿同helper而不重複編碼；native parser保留既有private呼叫。完整lyrics_package／lyrics-package在schema與時間檢查後，逐一核對title／cues.text／review_notes，再容量與隔離回傳。valid原字元不正規化或替換；非法UTF16/Unicode不能以JSON escape繞過package驗證。revise／legacy／download／offline診斷／application／固定preview共用domain；原生runtime右值validate失敗不提交data或render／transport，修好可retry。Agent raw JSON早拒絕invalid_request原行為保持，連續good/bad/good不影響後續。產品58／來源38–58、13／18、Agent1／draft3／review1／source1／template1保持。見[契約](docs/LYRICS-UNICODE.md)。


## v0.59 固定交付版本契約

`musiclab/assets/delivery-versions.json` 是產品版本與交付來源版本的唯一執行期資料源；`delivery_versions.py`／`delivery-versions.js` 純驗證後隔離保存，未知schema／缺失／錯序／重複／非標準版本即拒絕。Python package與inspection、browser package/import/report、application Agent／MCP metadata共用；schema和protocol不由產品版本推導。固定GET契約script沿既有本機Host／Origin門檻，無任意路徑或寫入。更新產品只改registry current及明確supported項，projects.json發布metadata需一致；歷史支援不靠range推測。測試保留獨立歷史oracle；封裝必須交叉核對registry／metadata／discovery。見[契約](docs/DELIVERY-VERSIONS.md)。


## v0.60 ZIP核對的本地失敗狀態

`delivery-import` controller持有scope/latest job失敗；view/status加隔離nullable failure `{code,message,truncated}`，message最多240 Unicode字元加ellipsis。只屬本地UI metadata，原HTTP/Agent/MCP wire與schemas不變。early invalid/busy與讀取／完整核對拒絕皆保持原成果；onError原error callback不改寫。新選檔／cancel／apply／undo清除，scope refresh清除，old/cancelled promise不恢復錯誤。DOM literal text保持local role=status，失敗可清除／重選，clear只走既有cancel，不取消scoped undo。相同note不重寫，減少普通refresh重複live通知；未做真人screen-reader驗收。見[契約](docs/DELIVERY-FEEDBACK.md)。


## v0.61 音檔報告数值核對

`audio-statistics.js`是無I/O、無UI的整數PCM bounds validator；`audio-review`在組成presentation／onResult之前呼叫。固定HTTP asset／index dependency提供同一模組；CLI、Agent、MCP、HTTP依原共用Python application產生報告，跨語言實際producer matrix確認可讀。影格／時長／bytes、peak/RMS/null/DC/full-scale、安靜邊界与mono/multichannel correlation互相核對；只驗證報告自洽，不重算PCM／響度、不證明實聽、授權或SHA對所選瀏覽器File的獨立核對。原report schema、loudness1／acceptance-draft1、Agent1／project draft3保持。見[數值契約](docs/AUDIO-STATISTICS.md)。


## v0.62 音檔回覆與所選File來源

`audio-file` native File.arrayBuffer/WebCrypto SHA-256 → `audio-result`純exact envelope/current product/protocol/raw JSON/file-set/source-echo核對 → `audio-review`既有PCM/loudness presentation/inspect → app DOM。兩async邊界重新核對原File identity/revision/profile/rawdraft，過期hash/error不upload/回寫；只保留64字元digest，read buffer不持久快取，64MiB既有選檔上限保持。preset與draft都走完整來源guard；live response須與固定頁面current product相同，legacy buildReview label保持另行使用。report.md只核對非空有界有效Unicode文字，不宣稱語義重算。見[AUDIO-RESULT](docs/AUDIO-RESULT.md)。


## v0.63 音檔完整文字報告

純audio_report.py／audio-report.js canonical render → audio_bundle共用application（CLI/Agent/MCP/HTTP）／audio-result checked逐字MD → 原audio-review PCM/LUFS/current → DOM。取代v62僅非空Unicode的MD檢查；JSON量測、原媒體／schema／protocol保持。固定小數是顯示契約，null明示不可測；全文有效Unicode／8MiB，錯誤／late保留原結果。數字契約見[AUDIO-REPORT](docs/AUDIO-REPORT.md)，非實聽、重測或權利證明。


## v0.64 自訂接受條件診斷

pure field_values／fieldValues沿原精確正整數文法→review1全部三欄→application readonly與四adapter；JS whole source／JSON／MD／current產品核對→readiness-state快照→獨立DOM定位。custom false保留未用原值不阻擋，zero issue始終needs_review；不冒充音檔接受。極大零指數Decimal InvalidOperation轉受控正整數錯誤，原小數不捨入。基本14／啟庫19、Agent1／draft3與legal4／private／not_submitted保持；產品64／明確交付38–64。見[契約](docs/AUDIO-ACCEPTANCE-REVIEW.md)。


## v0.65 條件報告接續

audio_acceptance_input／audio-acceptance-input獨立純contract1：64KiB嚴格decoder→整份review1重新派生並核對→隔離source draft1。CLI兩個既有明確選檔入口與browser注入decodeSelection支援；原draft decoder與Agent／MCP／HTTP payload保持draft-only，無新operation。previewKind暫態不入草稿，current／native File／busy／late與明確Apply保持。條件保存以最近loaded與confirmed兩個指紋留點，較早download確認不能取消新loaded；非保存成功或自動保存承諾。產品65／明確來源38–65，14／19 tools／Agent1／draft3／legal4／private／not_submitted保持。見[契約](docs/AUDIO-ACCEPTANCE-INPUT.md)。


## v0.66 條件套用撤回

draft-undo.createValueUndo純注入validator／隔離before與after／精確proposal→audio controller→DOM。history只一筆完整接受條件，Apply記actual capture after；載入checkpoint仍只確認檔案原document，adapter改寫值不可冒充保留原檔。Undo核對當前全部profile／custom／fields，再只改條件並復原以前loaded，confirmed／媒體／其他台保持；編修拒絕且record保留，success清preview／late token／record，projectLoaded／dispose清暫態。DOM成功focus可編修rates或profile，不聚焦停用Undo。無新schema／wire／Agent operation；產品66／明確來源38–66、14／19工具、Agent1／draft3／legal4／private／not_submitted保持。見[契約](docs/AUDIO-ACCEPTANCE-UNDO.md)。


## v0.67 歌曲／分鏡報告接續

planning-report-input純strict decode／全部來源診斷→readiness-report精確完整document比較→隔離raw panel；planning-import.panelDraft驗draft3與UI可表示畫幅／引用／方向→既有latest target preview→DOM明確Apply／actual after scopedUndo。1MiB入口保持，report1／Agent1／draft3／14／19 tools無新權限；kind與報告暫態不入草稿。原文／未完成數值／母題ID保持；未知或不符拒絕，來源一致不證明作者／權利。產品67／交付來源38–67，legal4／private／not_submitted保持。見[契約](docs/PLANNING-REPORT-INPUT.md)。


## v0.68 分鏡自訂畫幅

原生text／datalist四建議→共用raw-fields→既有draft3／planning-import／target preview／explicit Apply／actual after scopedUndo。Python／Agent原文字契約保持，移除額外四值匯入拒絕；原文／空白／Unicode保持，不解析比例、補值、裁切或改素材。完整plan仍驗非空文字及所有創作／時間／影格。其他unsupported引用／方向拒絕保持；無新schema／工具／權限／依賴。產品68／交付來源38–68、14／19 tools、Agent1／draft3／report1／legal4／private／not_submitted保持，見[契約](docs/STORYBOARD-RATIO.md)。


## v0.69 保存回讀核對

pure library-receipt完整data ACK／同ID metadata／全部draft3→注入readonly read→required confirmSave→既有pending controller→DOM／retention。保存ACK後任何回讀錯誤（含4xx）／不符保持原ID與click-time原稿供重試；原save4xx拒絕規則保持。確認前saving仍阻擋放棄／重試，確認後才retain原稿、後續編修保持dirty。backend read核對磁碟bytes／SHA，browser不獨立重算保存bytes或承諾原子／耐久交易。產品69／來源明確38–69、14／19 tools、Agent1／draft3／library1／legal4／private／not_submitted保持，見[契約](docs/LIBRARY-SAVE-RECEIPT.md)。


## v0.70 保存版本預覽來源

pure library-revision共享完整entry／read data與save receipt→讀前clone selected metadata→required checkRead→原latest token／replacement snapshot→DOM current ID／完整metadata在read完成、Apply與export重查。wrong ID／metadata／late拒絕且保留編修／media；切換取消preview並提示重新預覽。checkedSelection只比較已驗entry，不冒充獨立完整record validator。backend read核對磁碟bytes／SHA，browser不獨立重算磁碟bytes；純data層未新增HTTP meta/files核對。全案load／Undo原media重選邊界保持。產品70／明確來源38–70、14／19 tools、Agent1／draft3／library1／legal4／private／not_submitted保持，見[契約](docs/LIBRARY-REVISION.md)。


## v0.71 備份來源及恢復確認

native backup-file最多32MiB File.arrayBuffer／大小核對／WebCrypto SHA→pure backup-result exact files/data/meta及current product／protocol1／needs_review=true→required hashFile/checkPlan/checkRestore controller→DOM。雜湊後與request後latest重查；plan核對同SHA／bytes、全部unique IDs與new/reused/conflict分組／計數及can_restore一致。restore核對同SHA／總數與added+reused，允許retry後分布改變；不符成功回覆保留same File／SHA供明確retry，原4xx拒絕規則保持。backend原ZIP CRC／manifest／revision bytes／hash及immutable restore保持，browser不獨立解析ZIP或承諾目標耐久／原子恢復。proof暫態不入draft／Agent。產品71／來源38–71、14／19 tools、Agent1／draft3／library1／backup1／legal4／private／not_submitted保持，見[契約](docs/BACKUP-RESULT.md)。


## v0.72 備份下載及取消

pure backup-download exact backup1 descriptor／knownrelative token URL／counts／32MiB bytes → required injected prepare/read/hash/send latest controller → native bounded stream及WebCrypto backup-file.sha256 → shared text-download-dom createByteSender有限URL ledger →DOM。text domain的8MiB／Unicode／name規則保持，generic sender只接受domain已驗prepared，不自作path／ZIP驗證。讀後、hash後及handoff前current重查；cancel/pagehide abort自身request，late success/error不覆蓋，dispose清自身URLs/timers/listeners，BFCache新明確下載可用。取消headers/body的ConnectionError只關回應，其他I/O錯誤保持。sent是click+schedule，保存未驗證；沒有獨立ZIP語義parse或作者／權利證明。產品72／來源38–72、14／19、Agent1／draft3／library1／backup1／legal4／private／not_submitted保持。見[契約](docs/BACKUP-DOWNLOAD.md)。


## v0.73 唯讀備份匯出

純backup_export checked_request／shared selected_ids→原immutable export_backup→同一次raw完整read_backup／CRC／manifest／revision hashes與producer摘要/selection/IDs核對→不可變bytes/hash/selection/IDs PreparedBackupExport→共用application→CLI stdout／Agent JSONlines／MCP strict outputSchema／HTTP readonly export。metadata預設，explicit include_archive=true且ZIP<=512KiB才base64；超限在encode前拒絕。JSON不可選來源/目的路徑、overwrite、media或未保存draft；來源由啟動時明確草稿庫。export1與backup1/draft3/library1/Agent1分開，未知輸入欄位拒絕；schema形狀不代替ZIP/來源核對。新工具readonly，基本14/啟庫20需重新discovery；原backup/prepare/inspect/restore語義保持。沒有自動寫檔、耐久或全庫原子快照承諾。產品73/來源38–73/unknown74、legal4/private/not_submitted保持，見[契約](docs/BACKUP-EXPORT.md)。


## v0.74 保存回覆與清單

shared library-revision.checkedMetadata→pure library-result exact save/list/read envelope／bounded list/source→required injected checkList／latest→DOM。current產品／protocol1／empty files／operation needs_review精確，save確認回讀也沿同門檻；原receipt／完整revision檢查保持。不符ACK保留pending同ID及原稿，錯readback保持uncertain；不假造status400釋放ID。list metadata全部欄位／Unicode／unique IDs及issues／原stored_at+ID排序／next cursor與完整page／current cursor metadata核對，before onList；未知／late不覆蓋編修、清單、預覽、media及dirty。metadata不驗實際draft SHA，read仍由backend核對bytes/hash。固定asset只新增原生JS，無新wire／schema／權限／工具／依賴。產品74／明確來源38–74／unknown75、14/20／Agent1／draft3／library1／legal4／private／not_submitted保持。見[契約](docs/LIBRARY-RESULT.md)。


## v0.75 全庫保存名稱搜尋

pure library_search strict query/metadata index/canonical observed SHA/page/schema→DraftLibrary.metadata_snapshot→application四adapter；新唯讀draft_search僅明確啟庫，14基本/21啟庫需重新discovery。1–200codepoints/800UTF8/limit1–100/最多1000版本，literal case-sensitive保留Unicode/空白；只label與三title，不body/media。cursor pin query+全部可讀metadata及排序unreadable IDs，變更／end越界拒絕；不是disk bytes或原子snapshot/作者證明。browser pure envelope/data/current/search1/metadata/每列匹配/頁長/原stored_at+ID排序/cursor及前次boundary→latest/query/已顯示ID/controller→literal DOM；query改動、cancel、unknown/late保留清單/preview/edit/media；all refresh取消自身搜尋，明確成功才切all。search不進draft或新增write/path/model/依賴。新scripts/check_python_tests.py固定2隔離程序且120s整體期限，parent完整discovery逐ID核對coverage；package使用同runner，不提高期限。產品75／來源38–75／unknown76、Agent1/draft3/library1/backup1/legal4/private/not_submitted保持。見[契約](docs/LIBRARY-SEARCH.md)。


## v0.76 保存搜尋呈現

pure library_match/原生library-match：完整metadata/strict Unicode/query→四欄字面匹配與nonoverlap codepoint spans，原search重用，不增wire。pure library-presentation完整DTO/acceptedquery/selectedmetadata/零命中/空庫/unreadable/disabled→library-presentation-dom detached literal text/mark→原app controls；不讀目前editedquery冒充舊來源、不進draft/checkpoint/Agent。4欄/最多560marks、256px局部scroll/tabindex/窄版換行；未知或不符capture拒絕並保留既有DOM，非transactional DOM或通用HTML安全/作者/權利接受。原latest/cancel/selection preview/edit/media保持，14/21/Agent1/draft3/library1/backup1/search1/legal4/private/platform not_submitted保持。產品76/來源38–76/unknown77，見[契約](docs/LIBRARY-PRESENTATION.md)。


## v0.77 可攜 UTC 時間

pure utc_timestamp與shared native utc-timestamp strict Unicode/最多128codepoints/extended YYYY-MM-DD/任一單codepoint separator/HH可選:MM可選:SS與3或6位秒小數/Z或±00:00可選:00與3或6零小數；year1–9999/Gregorian leap/day/HH0–23/MMSS0–59，unknown/invalid拒絕且不改原字串。library_contract及backup created_at、browser revision/list/search/receipt及backup-result plan共用，無Date.parse/fromisoformat runtime寬鬆接受；producer正常UTC isoformat不變、raw stored_at+ID lexical排序與restore bytes保持，不做timezoneconversion/migration。前版browser-only Z現同Python接受，native3.11額外格式不自動開放。oneUnicode separator沿既有Python契約，controls只以原文展示不執行；不是任意ISO8601/RFC3339或人類時間信任證明。新固定asset1、不增wire/schema/operation/tools/path/write/model/依賴；產品77/來源38–77/unknown78、14/21/Agent1/draft3/library1/backup1/search1/legal4/private/not_submitted保持，見[契約](docs/UTC-TIMESTAMP.md)。


v0.77追加：UTC.compare以原始Unicode codepoint比較，list/search沿Python stored_at+ASCII ID排序；不以UTF16比較、Date或locale替代原source順序。完整timestamp驗證與原字串保持，matched tuple/continuation/原schema保持，見UTC-TIMESTAMP契約與QA final收據。


## v0.78 波形定位

pure wave-position完整source/current_source/duration/position/ready/error快照→顯示／鍵盤／滑鼠候選→注入controller套用前重查來源/時長→wave-position-dom literal text/ARIA/owned listeners→原native player/app同view比例畫游標。空／未知／錯／source不符歸零停用、tabindex-1，不攔截不可用鍵；顯示毫秒不改原秒數。方向鍵0.5秒／Shift0.05秒／HomeEnd，組合快捷鍵保持，無timer/URL/新媒體decode。定位不進draft3/wire，原waveTask/時長採用/手動stamp/草稿保持；2fixed assets/產品78/來源38–78/unknown79，14/21及原schema/legal4/private/not_submitted保持。見docs/WAVE-POSITION.md。


## v0.79 逐句標記撤回

pure cue-stamp-edit重用既有stamp毫秒及wave-position readiness→注入readRow/writeTimes/captureMedia controller→literal cue-stamp-edit-dom／app。單筆stable ID＋原start/end字串＋actual after，文字不留歷史；套用前核對完整row與source/current_source/duration，natural position前進可保持本次capture。undo先核對target actual after，只寫時間並再核對實際值；目標改時／刪除永久stale，改回／刪句還原不復活，文字／其他row／media改動可保留。同值／錯誤保留原有效record，new lyrics render無ID清除。history不進draft3/wire/Agent/results；busy阻擋、owned click listener dispose，無timer/URL/媒體decode。共用captureLyricPlayer維持原波形路徑。2fixed assets/產品79/來源38–79/unknown80，14/21及原schema/legal4/private/not_submitted保持。見docs/CUE-STAMP-EDIT.md。


## v0.80 發佈預期標籤

projects.version及release_version精確等於selected commit policy.current及v+current，schema1 strict；release_version僅預期tag，不是remote publication或創始接受。pure release_metadata frozen identity／原policy grammar→strict marker64KiB/policy8192B→Git cat-file size前檢查/show同blob bytes→package mkdir前guard與archive完整metadata/policy再核對，working files不換来源、不靜默修復。manifest1只新增checks.release_metadata=passed，歷史ZIP/tag/原packager與maintenance判定保持。產品80／supported38–80／unknown81，14/21／Agent1/draft3/領域schemas/legal4/private/not_submitted保持，web/HTTP/Agent/CLI無diff，無新依賴/模型/路徑或網路權限。見docs/RELEASE-METADATA.md。


## v0.81 目前歌詞原列定位

current-cue純media/rows/visible/busy→既有wave-position/CueStamp/activeCueIndex→注入capture/focus controller→literal DOM與app。最多10000列、ID64、time4096；未知／不可定位媒體清舊句與高亮，busy只讀停focus、hidden等待、gap/exclusive end沿舊規則，部分可播放不等於完整匯出。明確focus雙capture同ID／原目標欄位／media source/current_source/duration，再DOM核對enabled/connected/raw fields並確認activeElement；同句自然前進／其他列編修保持，不自動focus，不改草稿／media／歷史。status只變更時寫入，dispose只清自有listener，沿原drawWave/tick/reset/loadstart/error/tab/busy/render更新、不新增timer。server僅兩固定JS路由，產品81／來源38–81／unknown82／expectedtag81，14/21／Agent1/draft3／領域schemas/legal4/private/not_submitted保持。見docs/CURRENT-CUE.md。


## v0.82 原句首播放定位

cue-position純原row／wave-position完整media／LyricTime毫秒→注入readRow/captureMedia/isAllowed/setPosition controller→delegated DOM→app。stable ID／完整raw start/end/text與source/current_source/duration雙讀前核對，寫後第三media核對實際位置±1ms；natural progression可保持，失敗不虛報或承諾media回滾。只currentTime、明確成功focus波形，play/pause／表單／草稿／撤回保持；結束留白可定位不代表完整cue接受。input/render/stamp undo強制refresh，position-only tick沿便宜context不重掃rows，busy/hidden停用，dispose清自身兩listeners，無新timer/URL/decode。共用lyric_timing/lyric-time沿strict decimal原mantissa拒絕負值下溢字串（-1e-999），真正負零與signed shift保持；已轉numeric0無法恢復原字面，不宣稱任意JSON數值精度。server只兩固定JS路由，產品82／來源38–82共45／unknown83／expectedtag82，14/21／Agent1/draft3／領域schemas/legal4/private/not_submitted保持。見docs/CUE-POSITION.md。


## v0.83 目前歌詞播放資料

current-cue checkedRows／checkedContext／原playableCues與activeCueIndex→private單份prepared rows→注入playback controller→owned DOM高亮／app。input/render/stamp與undo/batch apply與undo明確invalidate，token拒絕讀取中失效；錯rows只嘗試一次，下一次失效或明確fresh focus可重查。position-only只context，hidden/unready初次不讀rows，busy維持唯讀但停focus；media每次核對，原exclusive／last overlap保持，仍O(n)numeric scan。focus沿原createController完整fresh來源雙讀及DOM原欄位核對，顯示cache不替代來源。未發送事件的外部任意value改寫不保證即時display，明確focus仍fresh；single prepared copy有界10000列，invalidate/dispose釋放。高亮僅owned old/new，same connected ID不重resolve或write、detached同ID新node重resolve，dispose清owned listeners/class。無新timer、asset、schema或操作；product83／來源38–83共46／unknown84／expectedtag83，14/21／Agent1/draft3／legal4/private/not_submitted保持。見docs/CURRENT-CUE-PLAYBACK.md。


## v0.84 編修焦點接續

editor-focus純六清單metadata（IDs／visible／busy）與entry/new/add候選→注入capture/focusTarget雙來源核對controller→editor-focus-dom固定入口/目標/原生activeElement確認→app。ID不入草稿；最多40/100/100/30/1000/10000列、ID64，未知list/field/mode/超界/重複ID拒絕；dispose停讀與副作用。新增歌詞focus文字、空表focus新增、還原row與shot摘要；只明確add/delete/undo時執行，不因播放/載入自動搶焦點。focus本身不寫編修值、markDirty或media；shot details.open沿原暫態行為。兩固定JS路由，不增加POST/Agent/CLI操作或路徑權限。產品84／來源38–84共47／unknown85／expectedtag84，14/21／Agent1/draft3/legal4/private/not_submitted保持。見docs/EDITOR-FOCUS.md。


## v0.85 原句搜尋

v0.85 原句搜尋：獨立search1，texts原順序/Unicode/重複句、10000列/每句2000codepoints/compact UTF8 array2MiB/query1024bytes/1–50結果。prefix+array SHA只pin文字，start_row>1必須前次SHA。Python/JS純層→application四adapter；browser injected generation/current完整texts+IDs/query/results revision→complete reply data/JSON/MD/meta核對→literal DOM→原生穩定ID文字欄focus。query/results/pager不進draft3，不因播放tick掃整表；時間編修與音檔保持。新增CLI lyrics-search、Agent/MCP lyrics_search、POST /api/lyrics-search及三固定JS資產；基本15/啟庫22需重新discovery。Agent1/draft3與既有schemas、legal4/private/not_submitted保持，產品85/來源38–85共48/unknown86。見[契約](docs/LYRICS-SEARCH.md)。


## v0.86 完整原文核對

v0.86 完整原文核對：text-verification.js純原文UTF-8與選定bytes模型（8MiB、本機view1）→text-verification-controller.js注入capture/describe/readFile與latest/current/大小保護→text-verification-dom.js原生File/arrayBuffer/literal status→app state.textVerification與canonical state.files。refresh只取字串/metadata，不編碼全文；明確選檔才有界讀取。三固定靜態JS，沒有POST或CLI/Agent/MCP操作，沒有新增領域schema/路徑/網路/寫檔權限。15/22、Agent1/draft3與既有schema保持；核對不解草稿另存提示，不進保存/備份。產品86/明確來源38–86共49/unknown87，legal4/private/not_submitted保持。見[契約](docs/TEXT-VERIFICATION.md)。


## v0.87 刪除鏡頭保留原時間

v0.87 刪除鏡頭保留原時間：共用純History.remove/restore保留stable ID與原值→app原生entriesFor/writeEntries→限定markDirty與editor-focus。刪除只取remaining/record，不呼叫compactShotTimes或生成effects；保留既有純工具與歷史格式相容。原缺口/負值/極短秒數交由現有純時間診斷與完整domain驗證；CLI/Agent/MCP/HTTP皆共用application，無新operation/schema/asset/權限。15/22、Agent1/draft3保持；產品87/明確来源38–87共50/unknown88，legal4/private/not_submitted保持。見[契約](docs/STORYBOARD-DELETION.md)。


## v0.88 共用清單busy

v0.88 共用清單busy：collections固定add/remove metadata→app refreshCollectionControls DOM adapter；四新增入口在capture/ID/write/dirty/focus前以既有state.busy拒絕。六add/指定remove/三台還原select與button沿run timingControls/finally切換；不讀來源或重建選單，較早選擇與歷史保持。原欄位編修沿revision/current及dirty保護；纯domain/History/controller保持，無新asset/HTTP/CLI/Agent/MCP operation/schema/權限。15/22、Agent1/draft3保持；產品88/來源38–88共51/unknown89，legal4/private/not_submitted保持。見[契約](docs/COLLECTION-BUSY.md)。


## v0.89 範例載入保護

v0.89 範例載入保護：app refreshExampleControls DOM adapter只讀state.busy/examples與兩固定button；exampleAllowed在load/clear/dirty/render之前拒絕busy或null。初始HTML disabled、startup首/finally與共用run的timingControls沿既有成功/失敗/過期釋放；不新增獨立timer。晚到startup只有idle且retention.atInitial才套用，busy不重寫進度；後續編修保持。明確idle範例仍只替換對應panel及清除其history，不冒充保存/撤回。15/22、Agent1/draft3及domain保持，無新asset/route/operation/schema/依賴/權限。產品89/来源38–89共52/unknown90，legal4/private/not_submitted保持，見[契約](docs/EXAMPLE-AVAILABILITY.md)。


## v0.90 取消等待

v0.90 取消等待：pure operation-gate 注入 AbortController factory，以 job identity/current/cancelled/finish 管理同一共用任務；失效先於 abort，非中斷階段未settle前不釋放。app.run/current.signal → 明確各request callback → api native signal；不讀全域隱含signal。固定 operation-control DOM adapter 只顯示可取消/cancelling並在仍持有cancel焦點時返回可用發起按鈕，後續focus保留。原source/revision/dirty保持，取消不新增synthetic revision或覆蓋編修/歷史/媒體/上一份成果。server只serve兩固定JS；後端可完成，不新增取消endpoint、Agent權限或依賴；15/22、Agent1/draft3保持。獨立控制生命週期保持。見[契約](docs/OPERATION-CANCEL.md)。


## v0.91 處理列

v0.91 處理列：operation-presentation純有界known scope/action metadata與gate view一致性→operation-control-dom begin隔離原動作、refresh只取gate與literal DOM→app.run開始前擷取發起button.textContent。main上方單一sticky取消入口；idle清title/note/context，無timer/scroll/source讀寫。既有operation-gate/native signal/source-current/finally與focus保持，server只serve一固定JS；15/22、Agent1/draft3/domain/wire/legal4/private/not_submitted保持。產品91/supported38–91共54/unknown92拒絕。見[契約](docs/OPERATION-PRESENTATION.md)。


## v0.92 分鏡原文搜尋

v0.92 分鏡原文搜尋：pure storyboard_search／原生storyboard-search→application四adapter→注入source/ID/query/generation/results current controller→literal DOM／原欄focus。新獨立search1，只讀八敘事欄位；16基本／23啟庫需重新discovery，Agent1／draft3／既有22 schemas保持。產品92／交付38–92／unknown93，見[契約](docs/STORYBOARD-SEARCH.md)。


## v0.93 歌詞與分鏡搜尋取消

v0.93 歌詞／分鏡搜尋取消：共用 search-request 純請求 ownership／注入 AbortController factory → 各搜尋 controller generation/source/ID/results current → app 明確傳遞 signal → native fetch；固定 DOM 顯示取消並在仍持有焦點時返回查詢欄。失效先於 abort，旧 finally 不能釋放新 job；顯式取消保留上一批、分頁歷史、原文與成果，換查詢／來源／換台沿原 reset 清除舊定位。idle cancel 不 capture／render／建立 job；pagehide listener 屬於 document。讀取本機 SHA 可晚 settle、後端可完成；搜尋 ownership 立即失效，可明確重試，與共用 operation-gate 等待 local settle 的契約分開。只新增一固定 JS asset，無新 operation／schema／取消 endpoint／路徑／模型／依賴。16基本／23啟庫、Agent1／draft3／23既有 input/output schemas／legal4／private／FreeTWAI not_submitted保持。產品93／交付38–93共56／unknown94拒絕。見[契約](docs/SEARCH-CANCEL.md)。


## v0.94 搜尋命中前後文

v0.94 命中前後文：共享 search-excerpt 純來源／UTF-8 span與query核對，重用既有 delivery-context 的每側64byte邊界模型；2000codepoints原欄位、query≤1024bytes，顯示每側48／命中96codepoints，控制符visible token不能被截斷。shared literal search-excerpt-dom建立span／mark，再由兩個原DOM adapter接到現有current controller；先准备全批view再改DOM。無innerHTML／source寫入／網路／timer，新server僅兩固定JS assets。原prefix caption helper相容保持，live結果使用新view；完整files/data/meta與兩種search1／23舊operation schemas不變。產品94／policy38–94共57／unknown95拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。見[契約](docs/SEARCH-EXCERPT.md)。


## v0.95 搜尋選字保護

search-input 純三欄鍵盤 metadata → 三個原 DOM adapter → 既有搜尋 controller。isComposing 或 legacy keyCode229 不 preventDefault、不讀來源／清單或呼叫搜尋；只有有效普通 Enter 才執行原動作。純層無 DOM／事件副作用、timer、網路或持久狀態；固定一 JS asset。控制器、app、application／CLI／Agent／MCP、領域 schemas 與 23 operation input/output schemas不變。產品95／唯一policy38–95共58／unknown96拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。見[契約](docs/SEARCH-INPUT.md)。


## v0.112 選定鏡頭待辦

新增選定原鏡號的必填欄位、方向與母題引用檢查，整份分鏡200明細上限保持。可定位後面的鏡頭，舊選擇／順序／來源與晚回覆不能替換新編修。Python／JS共用既有整份診斷規則，controller暫態與字面DOM分層；CLI／Agent／MCP／HTTP共用同一報告，18基本／25啟庫工具，原24組schemas保持。獨立shot-review1，Agent1／draft3保持；無新依賴／模型／媒體／外網或路徑權限。產品112／唯一policy38–112共75，未知113拒絕。

純共用shot診斷及完整回覆核對→注入current IDs／selected context checkpoint→literal DOM；IDs、report與preview不進draft3。單鏡JSON最多256 KiB、完整source8 MiB；CLI --draft必須--row，--input不可覆蓋原row。零待辦不代表完整時間／影格／连戏或媒體接受；舊選擇、source／revision及晚回覆保護原編修。見[契約](docs/STORYBOARD-SHOT-REVIEW.md)。


## v0.113 選定鏡頭請求

選定鏡頭報告先核對完整回覆的 JSON 值與來源，再交給獨立注入式 request controller 管理成功、錯誤、來源改變、取消及重試；DOM 僅提交已核對成果。舊請求不能結束新請求的 pending 狀態或覆蓋新成果。原 25 組工具 schemas、18 基本／25 啟庫工具、Agent1／draft3／shot-review1 保持；僅新增一個固定 GET 資產，既有 POST 與授權邊界保持。產品113／唯一 policy38–113共76，未知114拒絕。

完整DTO先核對自有JSON值、再來源；request序號／外層current／selected proof控制成功與錯誤；取消／invalidate不讓舊finally終止新pending。無新HTTP／Agent權限。見[契約](docs/STORYBOARD-SHOT-REQUEST.md)。


## v0.114 單鏡逐項定位

單鏡待辦新增固定工具列的上一項／下一項與重查入口；純issue-cursor管理report revision／index與邊界，DOM沿原來源核對定位原欄位。新報告不自動定位，來源／選擇／順序／busy與換台停舊位置。共享focusShot以純shot-field-position計算目前欄位與工具列遮擋後的捲動；短視窗工具列改static。既有25組工具schemas、18基本／25啟庫、Agent1／draft3／shot-review1及POST保持；新增兩個固定GET。產品114／唯一policy38–114共77，未知115拒絕。

游標只保留有界metadata與report revision；定位成功才前進。共享欄位位置純模型與DOM讀取分層，來源改變不能舊定位；短視窗工具列static，來源、File及草稿保持。無新HTTP／Agent權限。見[契約](docs/SHOT-ISSUE-NAVIGATION.md)。


## v0.115 選定歌曲段落待辦

歌曲工作台新增「檢查選定段落」：即使整份待辦200明細已滿，也能檢查原第40段的五個編曲欄位並定位。既有music-readiness共用規則 → 選定原列／stable IDs的純checkpoint controller → 字面DOM → app原欄位focus分層；不補寫、改原值或提交成果。選擇／順序／選定欄位改變停舊定位，精確復原可接續；其他段落與全域欄位的合法編修不影響這五欄的診斷。零待辦仍需整首歌曲、總長與實聽驗證。產品115／唯一policy38–115共78，未知116拒絕；18基本／25啟庫及原25組schemas、Agent1／draft3保持，新增兩個固定GET。

選定診斷只保留五欄原值、完整stable IDs與原列；沒有新Agent operation，整首報告與dirty規則保持。來源改變拒絕舊定位，暫態不進draft3；literal DOM與current capture分層。見[契約](docs/MUSIC-SECTION-REVIEW.md)。


## v0.116 單段報告跨工具

新增「建立單段報告」與唯讀 music_section_review：共用 Python music_review 的 required／numeric 規則，獨立 section-review1 保留原段落1起、總段數與選定五欄原字串；JSON／Markdown 經完整 data／files／meta 核對才提交成果。共享注入 readiness-request 管理來源／晚回覆／取消／重試，既有單鏡 wrapper 沿相同 controller。CLI／Agent／MCP／HTTP 共用 application，19基本／明確啟庫26工具，需重新 discovery；原25組 input/output schemas 不變。產品116／唯一 policy38–116共79，未知117拒絕；Agent1／draft3保持。新增一個固定GET與一個唯讀POST，沒有新路徑、模型、外網或寫入權限。零待辦仍須整首歌曲、總長與實聽驗證。

共享領域／完整來源與回覆guard → 注入純request → literal DOM／成果，late／cancel／retry不覆蓋後續編修。既有單鏡wrapper API保持，25 schemas保持；selected local context與app完整revision明確分開。見[契約](docs/MUSIC-SECTION-REPORT.md)。


## v0.117 單段逐項定位

歌曲單段待辦新增工具列「上一項／下一項／重查這一段」。共享 issue-cursor 只保留report revision／有界index，明確定位成功才前進；重查重設而不自動搶焦點，來源／stable IDs／選擇／busy／換台拒絕舊定位。共用純 editor-field-position 幾何與既有shot wrapper，明確focus原欄位後核對工具列遮擋；窄視窗維持表格內水平捲動，height≤400px改static流。單段DOM使用注入的literal段落訊息，既有單鏡預設文字與API保持。新增一個固定GET，沒有POST、Agent權限或schema變更；19基本／26啟庫、原26組工具schemas、Agent1／draft3／section-review1／shot-review1保持。產品117／唯一policy38–117共80，未知118拒絕。

cursor只保留有界metadata與report revision，定位成功且來源仍有效才前進；新report重設。共用純geometry與DOM讀取分層，stable IDs及原生focus不進草稿。見[契約](docs/SECTION-ISSUE-NAVIGATION.md)。


## v0.118 歌詞診斷完整核對

歌詞校時診斷先以共用strict JSON值核對來源，再讀取欄位與建立隔離副本；getter、稀疏陣列、隱藏／symbol／undefined／無效Unicode拒絕。完整回覆精確核對root data／files／meta、當前唯一產品版本、protocol1及needs_review=true，再核對完整report與JSON／Markdown，checkedResult交付自有data／files副本。舊inspect API保留。Controller將capture放在try內，失敗不送transport，當前pending才釋放；晚回應／錯誤／finally不覆蓋後續工作。原request可省略title／duration，僅report明示既有defaults；時間規則與診斷格式保持。19基本／26啟庫、原26組schemas及Agent1／draft3／review1保持，沒有新operation或GET。產品118／唯一policy38–118共81，未知119拒絕。

嚴格來源驗證先於欄位讀取／clone，完整當前meta與兩檔核對後才交隔離結果。capture錯誤與晚回應按token歸屬保留後續工作。見[契約](docs/LYRICS-REVIEW-GUARD.md)。


## v0.119 選定歌詞校時待辦

選定歌詞待辦共用 lyrics_review 的完整來源與時間分析，先依原句／作品時長篩選再套200明細上限；全部原句仍參與重複開始與horizon重疊核對。新增獨立 lyrics_cue_review schema1、application／CLI／HTTP／Agent-MCP，20基本／27明確啟庫，舊26組schemas保持。單句report只帶選定cue與title／duration，不帶整份歌詞；source controller核對整份原值、stable IDs與選列，其他句子也可使舊位置失效。檢查／報告不改原文、時間、音檔或草稿；零待辦仍須完整歌詞包與實聽。產品119／唯一交付policy38–119共82，未知120拒絕；Agent1／draft3及其他schemas保持。

先篩原句／global row再套detail cap，全部原句關係仍驗證；browser完整source／IDs／selection proof核對成功後才提交隔離DTO。見[契約](docs/LYRICS-CUE-REVIEW.md)。


## v0.120 單句逐項導覽

選定歌詞新增「重查這一句／上一項單句待辦／下一項單句待辦」工具列，成功定位後同步目前明細頁；修正長表格需返回上方清單逐項處理的操作缺口。純 issue-cursor 明確 maxDetails 1–200，舊鏡頭／段落預設32保持；純 issue-page.reveal 核對 revision／可定位狀態及兩次metadata後，顯示選定保留項所在頁。單句沿原200明細／20頁內項與全部issue_count，頁面／cursor／焦點不改時間或進draft。可見黏附工具列與既有field-position共用幾何，global作品宣告忽略畫面外工具列；高度≤400px回普通流。產品120／唯一交付policy38–120共83，未知121拒絕；20／27 tools、舊27組schemas與Agent1／draft3保持。

source／IDs／selection先核對再定位；cursor成功後保留來源檢查，pager reveal只走retained前200項，完整issue_count不得充當detailCount。見[契約](docs/LYRICS-CUE-NAVIGATION.md)。


## v0.121 目前待辦原因與位置

單鏡、單段與單句工具列現在顯示最後成功定位待辦的原位置、欄位、原因及關聯列，讓長表格編修時也能知道正在處理什麼。純 issue-summary 只格式化有界嚴格 JSON metadata；三個 DOM adapter 共用清單與工具列文字，在來源失效、busy、隱藏、無選列、未定位或新 revision 時清除說明。回復精確來源可恢復上一個成功位置；不因手動焦點改動重寫 cursor。說明換行後由 app 重新量測活動欄位，僅對已活動的原欄位調整捲動，不重新聚焦其他控制。實際窄畫面發現單鏡長待辦按鈕造成31px溢出，改為有界換行；空鏡頭選列也停用清單與 cursor。新增一個固定 GET asset，沒有新 operation。產品121／唯一交付policy38–121共84，未知122拒絕；20／27 tools、旧27組schemas、Agent1／draft3與其他domain保持。

目前說明為最後成功cursor診斷，不能冒充手動activeElement始終與cursor一致；post-caption reveal只作用於相同原活動欄位。單鏡長待辦按鈕有界換行；不做資料補寫、不擴大API。見[契約](docs/ISSUE-SUMMARY.md)。


## v0.122 回到目前待辦

歌曲單段、分鏡單鏡與歌詞單句的工具列新增「回到目前待辦」。檢查並成功定位後，手動查看其他欄位可直接返回最後成功位置；只有一項待辦時，上一項／下一項停用，返回仍可用。共享純 issue-cursor 提供 canReturn／returnCurrent，重用原來源與 revision 核對、onLocate、頁面 reveal 及原欄位 focus；不前進 cursor、不改原文／時間／媒體。未定位、零待辦、來源失效、busy、隱藏或無選列停用；新 report revision 清除位置，精確回復來源可接續舊位置。歌詞手動換頁後返回原 global 明細所在頁，沿全部計數／前200保留明細。三個 DOM adapter 只綁定原生按鈕與狀態；沒有新 asset、operation、POST、模型或路徑權限。產品122／唯一交付 policy38–122共85，未知123拒絕；20／27 tools、原27組 schemas、Agent1／draft3及其他領域契約保持。

Repo已獲使用者當次授權公開，四個FreeTWAI新作品公開介紹頁已建立；平台目前為作者自行聲明、尚未核實，正式收錄仍需另行審核。保留PLATFORM-STATUS.md／json的2026-10-06實際觀察與四個網址，不重複提交、不宣稱取得創始認證。PolyForm Noncommercial 1.0.0、LICENSE／NOTICE、創辦ZOE. G／GitHub djguan-jpg保持。

返回只重新定位最後成功cursor，沒有猜第一項／前進index或新的持久欄位；原生按鈕回呼沿原guard重查，不信任舊enabled狀態。見[契約](docs/ISSUE-RETURN.md)。
