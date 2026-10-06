# 版本紀錄

## v0.104.0（2026-10-06）

指定位置移動的成功通知只在實際列順序、選列與原始請求一致時發出。修正注入回呼能修改共用提案、使錯誤排列或選列被判為成功的問題；普通瀏覽器 adapter 並未修改此提案。本輪隔離回呼資料，歌曲、分鏡及歌詞的原按鈕／Enter、原文與時間、逐鏡展開、同列焦點及後續編修撤回保持。

editor-position 純五欄來源／排列提案 → injected controller 保留自有 expected → writer 專屬六欄 DTO（before 五欄及 ids、afterIds 另複製）→ 原 raw-source order controller → 原始 expected actual-after → 固定原始位置通知。button／Enter 共用 finish；允許回呼修改自己的副本，不以 freeze 改變回呼介面，保留讀取次數與原 current-before／after-consume／false writer 語義。拒絕不符時不覆蓋或回滾外部編修。產品0.104.0／唯一 policy38–104共67／unknown105拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改一個純控制器，沒有 DOM／app／server／adapter、固定資產清單、依賴、路徑或網路權限變動。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

587 Python（97.813秒，兩隔離 workers／120秒整體期限）、1218 JavaScript、119 syntax、四份 Skill 通過。四新增 JS 測試逐一涵蓋三列表及 button／Enter：變更或替換預期排列、偽選列、全提案欄位與巢狀陣列改動、舊提案保留至下一次移動、capture 反向修改回呼副本；正確原寫入與通知保持。基線18個回呼案例確實誤判成功，修正後錯誤 actual-after 拒絕，外部資料保留。v103真 source ZIP 還原587／1214；264份歷史交付 ZIP／manifest 完全相同，23組 schema 相同。53原生快照核對六完整 raw-ID 排列／撤回與同 selector 焦點、三後續列編修撤回、三同位置 Enter 的原值／revision／retention 保持、七 busy 控制與完整來源保持。七 native 完整回覆、七 CLI／Agent／MCP 操作及21 HTTP good/bad/good 全回覆等於 application；兩 observed draft3 reviews 回讀、預設覆寫1保留 bytes、invalid1無輸出、diagnostic2保持。原 File 身份與0.5秒paused／8秒合成音檔保持，console0；一個自有 tab 關閉、viewport reset、bounded server 正常停止，子程序 EOF0及 HTTP thread joined。回呼改動是純控制器注入測試，未宣稱瀏覽器內有惡意回呼或外部可利用漏洞。實際瀏覽器只用 native 操作；CDP唯讀，PNG留在 ignored outputs。完整視覺、screen reader、OS IME、保存成功、實聽、正式媒體、Host安裝與平台創始接受仍未驗證。


## v0.103.0（2026-10-06）

修正歌曲「移至第幾列」按 Enter 誤建立歌曲包、沒有移動的問題。歌曲段落、分鏡與歌詞的位置欄現在可輸入最終列號後按 Enter，一次移動同一列。空白、無效或相同位置的普通 Enter 保留原文字、游標與撤回紀錄；原按鈕仍可用。成功後焦點回到同一選列，原文、時間、逐鏡展開及音檔保持；後續編修撤回與舊成果停下載保持。

editor-position 純 strict gesture／none-hold-move intent → 原五欄metadata proposal／injected current-before-consume + current-after-consume + actual-after → editor-position-dom 自有可編輯INPUT keydown／preventDefault／focus → app 原完整raw-source order controllers。request button與enter共用finish，不新增history。只有自有當前位置input普通Enter消費default；IME／229、修飾鍵、其他鍵與已消費事件保持原生，repeat只消費不移動。純來源visible／busy也核對；失敗不回滾或宣稱成功。九原listeners加三keydown共十二，dispose只移除自身。產品0.103.0／唯一policy38–103共66／unknown104拒絕。16基本／23啟庫工具、23既有input/output schemas、Agent1／draft3保持；沒有新增assets、server／app diff、POST operation、依賴、路徑、模型或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

587 Python（92.344秒，兩隔離workers／120秒整體期限）／1214 JS／119 syntax／四Skills通過，新增十JS測試與既有HTTP資產ARIA核對。v102真source ZIP還原587／1204；260歷史ZIP／manifest bytes相同，23既有schemas相同。57最終來源原生快照：12完整raw-ID排列、六同選列selector焦點比較、六忽略Enter完整panel／IDs／revision／retention／focus及caret比較、七busy disabled與完整source比較。三工作台移動後編修再撤回保留新文字；相同位置Enter保留原undo；原按鈕、首列／中間／尾列、390×844 Enter、dirty成果及晚報告保持後來片名通過。前37份只有能力GET與先前已完成的一份回覆，沒有新增建包請求。全部57份保持原音檔blob／paused／0.5秒／8秒，最終同File身份、console0。九native完整HTTP回覆（含gate補強前一份lyrics、最終七operations及一份刻意late timing）、七operations實際CLI／Agent／MCP與21直接HTTP good/bad/good等於application；兩observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保持bytes。兩bounded servers正常停止、兩自有tabs關閉／viewport reset、HTTP thread joined與子程序EOF0；PNG與合成素材留ignored outputs。完整視覺、screen-reader、Windows原生IME、瀏覽器保存成功、實聽、正式媒體、Host安裝及平台創始接受未驗證。原生repeat／composition／修飾Enter的事件政策以純／DOM測試核對，沒有宣稱完整OS输入法驗收。Native證據限本輪Chromium；重新排列不自動修正時間或生成媒體，仍需完整創作驗證。


## v0.102.0（2026-10-06）

歌曲段落、鏡頭及歌詞句新增「移至第幾列」與「移至指定位置」。輸入最終列號，一次移至首列、中間或尾列；其他列保持相對順序，原文、原時間、逐鏡展開狀態與音檔保持。撤回只還原最近順序，保留後續欄位編修；移動後舊成果停下載，重新建立才恢復。

entry-order 純 arbitrary insertion／dense inverse → editor-position 純 metadata view／proposal／injected current + actual-after controller → editor-position-dom 自有九 listeners／literal ARIA／selected selector focus → app 原完整 raw-source order controllers。editor-order／music-arrangement 的 moveTo 共用原 history；歌曲移動及撤回增加完整來源的寫入前、實際 after 核對，拒絕 sparse sources／forged inverse。position 原字串是暫態 data-view-control，不修改 draft／revision；原操作仍完整驗證創作與時間。產品0.102.0／唯一 policy38–102共65／unknown103拒絕。16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持；只新增兩固定 GET assets，沒有新 POST operation、路徑、模型、依賴或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

587 Python（91.250秒，兩隔離 workers／120秒整體期限）／1204 JS／119 syntax／四 Skills通過；新增21 JS與兩Python檢查。v101真source ZIP還原585／1183；256歷史ZIP／manifest bytes相同，23既有schemas相同。51修正版原生快照：14完整raw-ID排列、五selected selector焦點比較、兩原文字欄caret比較、兩摘要stable ID／焦點／逐鏡open比較、八view-only完整panel／IDs／revision／retention比較、七busy disabled與完整source比較。三工作台移動後編修再撤回，保留新文字；零／指數／超範圍位置拒絕，首列／中間／尾列、390×844操作、舊成果dirty與晚報告保持後來片名通過。全部51份保持原音檔blob／paused／0.5秒／8秒，最終同File身份、console0。11 native完整HTTP回覆（含修正前3份、修正版7操作及一份刻意late timing）、七operations實際CLI／Agent／MCP與21直接HTTP good/bad/good等於application；兩observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保持bytes。兩bounded servers正常停止、三自有tabs關閉／viewport reset、HTTP thread joined與子程序EOF0。兩PNG與合成媒體留ignored outputs。完整視覺、screen-reader、Windows原生IME、瀏覽器保存成功、實聽、正式媒體、Host安裝與平台創始接受未驗證。指定位置與快捷鍵證據限本輪Chromium；重新排列不自動修正時間或生成媒體，仍需完整domain驗證。


## v0.101.0（2026-10-06）

在鏡頭摘要按 Alt＋↑／↓ 可直接移動鏡頭，收合或展開皆可。焦點跟著同一鏡頭，逐鏡展開狀態、原文與原時間保持；Enter／Space 繼續展開或收合。移動後原成果停下載，撤回保持後續編修，重新建立才恢復下载。

沿 editor-keys 純 gesture／ID 提案與 injected current／consume／writer／actual-after 核對 → editor-keys-dom 自有 native SUMMARY 暫態 target／open bookmark → app 原完整 raw-source order controller。文字欄仍走原 caret 分支；摘要只讀 details.open，不讀或寫 input value／selection、不強制展開。只有同 ID、同 open 狀態、当前自有焦點才恢復 summary focus；沒有新 history、依賴、固定 assets、server diff、schema 或 Agent operation。產品0.101.0／唯一 policy38–101共64／unknown102拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4保持。PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

585 Python（86.187秒，兩隔離 workers／120秒整體期限）／1183 JS／117 syntax／四 Skills，八新JS測試。v100真source ZIP還原585／1175；252歷史ZIP／manifest bytes相同，23既有schemas相同。39原生快照：14完整 raw-ID 排列、七同摘要ID／焦點／逐鏡open比較、四原欄display／caret比較、五忽略操作的完整panel／IDs／revision比較（含一busy pair）。原生Enter／Space只改展開狀態；後續運鏡編修撤回、四次清理回到完整initial panels、舊五檔成果移動及撤回停下載、晚報告保留後來片名與上一份成果、390×844收合摘要上下移動通過。全部39份保持原生音檔blob／paused／0.5秒／8秒，最終同File身份，console0。八native完整HTTP回覆、七operations實際CLI／Agent／MCP與21直接HTTP good/bad/good等於application；兩observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保持bytes。兩自有bounded servers正常停止、兩tabs關閉／viewport reset、HTTP thread joined與子程序EOF0。兩PNG與合成素材留在ignored outputs。完整視覺、screen-reader、Windows原生IME、瀏覽器保存成功、實聽、正式媒體、Host安裝及平台創始接受未驗證。快捷鍵證據限本輪Chromium；摘要移動只改排列，仍须完整時間／影格與創作驗證。


## v0.100.0（2026-10-06）

段落、鏡頭與歌詞的文字或時間欄可按 Alt＋↑／↓ 移動目前列；保留同一欄位、游標選取、原文與時間。沿原順序撤回保留後續文字編修，移動後須重新建立成果。原生選單、一般方向鍵、組字／重複鍵、其他修飾鍵、等待中與首尾邊界保持原行為。

editor-keys 純 gesture／相鄰 ID 提案 → injected controller current metadata／consume／writer／actual-after 核對 → editor-keys-dom 三容器 delegated keydown 與暫態欄位／caret bookmark → app 共用原 music-arrangement／editor-order 完整 raw-source 移動與撤回。keyboard 才回同一欄位，原工具列保持按鈕焦點；沒有新 history、創作 schema 或 Agent operation。兩個固定 JS assets；无新依賴、模型、外網、timer、路徑、auth 或寫檔權限。產品0.100.0／唯一 policy38–100共63／unknown101拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4 保持。PolyForm Noncommercial 1.0.0／private，創辦 ZOE. G／GitHub djguan-jpg；FreeTWAI not_submitted。

585 Python（86.875秒，兩隔離 workers／120秒整體期限）／1175 JS／117 syntax／四 Skills；18新測試。v99真source ZIP還原583／1159，248歷史 ZIP／manifest bytes相同，23 schemas相同。57原生快照：19完整 raw-ID 排列、15同欄位／native display／caret 比較、8忽略操作的完整 panel／ID／revision 比較（含三 busy pairs）、四原值清理比較及三後續編修撤回。移動後舊成果停下載，撤回原順序仍须重建；晚回覆保留後來 title 與上一份成果。原生音檔 File身份及 blob／paused／0.5秒／8秒在全部57份保持，console0。8 native完整 HTTP回覆與7 operations實際 CLI／Agent／MCP、21直接 HTTP good/bad/good 與application一致；兩個observed draft3 reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1保持bytes。兩bounded servers正常停止、兩tabs關閉／viewport reset、臨時HTTP thread joined／子程序EOF0。兩JPEG及合成音檔留在outputs，不進Git。完整視覺、screen-reader、Windows原生IME、瀏覽器實際保存、實聽、正式媒體、Host安裝與平台創始接受未驗證。native selectionRange證據限本輪Chromium；DOM display與canonical raw欄位分別核對，不能以畫面字串證明原檔bytes。


## v0.99.0（2026-10-06）

段落、鏡頭與歌詞的選列會跟隨正在編修的列。新增、複製、刪除後鄰列、還原及待辦定位也會同步選列；等待中保留焦點，完成後同步目前列。鏡頭段落名稱修改後立即更新選單；單純換焦點保留創作內容與順序撤回。

editor-selection 純 metadata／ID 提案重用 editor-focus 與 entry-order → injected controller 三次 current IDs／visible／busy 核對 → 三容器 delegated focusin／refresh DOM → app 原 music selection 或 editor-order.select。只同步原生 selector／行標示／邊界按鈕，不呼叫 focus、讀創作來源、markDirty、改 revision 或建立 history；原動作保持移動按鈕焦點。busy 結束沿既有 collection refresh 核對當前原生焦點；隱藏、外部、已移除及 disabled target 拒絕。鏡頭 caption 使用 raw readValue 的目前 section／purpose，不依賴稍後才更新的 summary；穩定 IDs 時 select 不重建 options 或讀全文。兩個固定 JS assets，無新 operation／schema／依賴／timer／模型／網路／路徑／auth 權限。產品99／唯一 policy38–99共62／unknown100拒絕；16基本／23啟庫、Agent1／draft3、23 operation input/output schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted保持。

583 Python（89.531秒，兩隔離workers／120秒整體期限）／1159 JS／115 syntax／四Skills；17新測試。v98真source ZIP還原581／1144；244歷史 ZIP／manifest bytes相同，23既有schemas相同。最終45原生觀察及25前期探索；六完整raw panels／revision焦點比較、六ID排列、三刪除還原與三清理前後原值比較，24實際編修列焦點與六動作按鈕選列保持。五busy快照、完成後同步、即時caption、晚回覆保留後續原文與dirty成果通過；原生File身份、blob／paused／0.5秒／8秒在全部最終45觀察保持，console0。六native完整HTTP回覆、七 operations實際CLI／Agent／MCP及21直接HTTP good/bad/good與application相同；两個observed draft3 CLI reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1 bytes保持。三tabs關閉／viewport reset、兩bounded servers正常停止、臨時HTTP thread joined／子程序EOF0。三JPEG與合成素材留在outputs，不進Git。完整視覺／screen-reader／瀏覽器保存／實聽／正式媒體／Host／平台接受未驗證。


## v0.98.0（2026-10-06）

鏡頭與歌詞可選列向前／向後移動、查看選定列，並撤回最近一次移動。順序撤回保留後續文字與時間編修；新增、複製、刪除、還原或載入新內容會取消舊順序撤回。原時間、總長與音檔保持；鏡頭移動後須重新檢查時間覆蓋，已校時歌詞匯出仍依開始時間排序。

entry-order 純 ID 相鄰排列與逆序核對，供原 music-arrangement 與新 editor-order 共用；editor-copy 原值 source guard → injected controller → editor-order-dom 原生選列／四按鈕 → app 原 readValue／writeEntries／markDirty／editor-focus。只保留最近 ID 順序與來源核對，metadata view 只有可撤回／stale／位置，不帶全文；busy／hidden 先拒絕讀取，提交前完整 source 與提交後隔離 expected 再查。DOM 只更新單列輸入標籤，未變順序不重建 options，原列 stable ID、raw 字串與 shot open 保持。三個固定 JS assets，沒有新依賴、operation、schema、Agent 路徑／寫檔／模型／網路／timer 或 auth。產品98／唯一 policy38–98共61／unknown99；16基本／23啟庫、Agent1／draft3、23 operation schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted 保持。

581 Python／1144 JS／113 syntax／四 Skills；21新測試。v97真source ZIP還原579／1125，240歷史 ZIP／manifest bytes相同。33原生觀察、九 exact raw panel／ID 排列比較，三台移動與後續欄位編修撤回、複製句／鏡重新排列、結構變動停撤回、busy／hidden、時間矛盾拒絕／修正建包、歌詞按開始排序、late回覆保留dirty成果與後續編修通過。五native HTTP完整回覆與七 operations CLI／Agent／MCP、21直接HTTP good/bad/good皆與 application相同；兩個actual observed draft CLI reviews回讀，invalid1無輸出／diagnostic2／預設覆寫1原bytes保持。原生File身份、blob、paused與0.5秒在全部33觀察保持，console0。兩bounded servers正常完成、臨時HTTP thread joined、子程序EOF0、两tabs關閉／viewport reset。三JPEG留在outputs，不進Git。完整視覺／screen-reader／瀏覽器保存／實聽／正式媒體／Host／平台接受未驗證。


## v0.97.0（2026-10-06）

段落、鏡頭與歌詞可複製到原列後方。段落保留五個編曲欄位；鏡頭保留創作、母題與畫面方向，歌詞保留原句，兩者的開始／結束留白後人工校時。原列、總長與媒體保持；新列可用既有刪除／還原操作管理，處理中或達上限時停用複製。

純 editor-copy／來源隔離與 current/actual-after 核對 → injected controller → delegated DOM → app 原 readValue／writeEntries／markDirty／focus。新 ID 沿原單調序列，原列 IDs／open 保持；open／copy 暫態不進 draft3。40段／1000鏡／10000句，DOM busy／hidden／capacity 在原值讀取及 ID 前拒絕，控制刷新只讀 count／visibility。固定兩 assets；没有新增依賴、operation、schema、模型、網路、timer、路徑或 auth。產品97／唯一 policy38–97共60／unknown98；16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。

579 Python89.453秒（兩隔離workers／120秒整體期限）／1125 JS／110 syntax／四Skills；17新測試。v96原ZIP還原577／1110，236歷史ZIP／manifest bytes相同，23原 operation input/output schemas相同。41原生觀察，六 display/source 複製對、三份 exact raw draft 複製前後核對；原生File身份、0.5秒／paused及原媒體保持。桌面／390px滑鼠與Enter、新列 focus、40段上限、busy三台、刪除／還原、empty clock與多行歌詞拒絕、補齊後建立及晚回覆保留通過。7原生HTTP完整回覆等於application；7 operations的實際CLI／Agent／MCP與21直接HTTP good/bad/good一致，原 diagnostic exit2／invalid1無輸出／預設覆寫1且bytes保持；actual observed draft3經Python validate／兩種--draft CLI及Agent／MCP reviews回讀。2tabs關閉／viewport reset／2bounded servers及臨時HTTP thread正常停止／console0。六份JPEG留在outputs。草稿下載click已送出，未確認瀏覽器保存的檔案；完整視覺／screen-reader／實聽／媒體／Host／平台接受仍未驗證。

## v0.96.0 · 2026-10-06

分鏡開始／結束的極小負數字串（例如 -1e-999）會先依原值拒絕，不再因浮點下溢變成零而誤判有效。時間待辦可定位原欄位，建立分鏡包、鏡尾總長提案與新增下一鏡共用此界線；原時間與創作保持。真正負零、Unicode十進位、底線與既有數字空白規則保持。

Python common 與原生 planning-values 的 pure 原符號判定／非負讀取 → complete storyboard 與 partial timing → application 原四 adapters；browser 原 timing／overview／source guard／add-shot adapter。只在既有 finite decimal 驗證後核對負號及非零 mantissa，exponent 不作非零來源。signed number 與歌詞位移保持；frame ties-to-even／seconds tolerance不变。duration controller沿同Timing診斷拒絕提案，原 revision／late／scope／undo保持。無新asset／operation／schema／依賴／timer／模型／權限。產品96／唯一policy38–96共59／unknown97，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。

577 Python85.250秒（兩隔離workers／120秒整體期限）／1110 JS／108 syntax／四Skills；11項新測試。v95原ZIP還原572／1104，232歷史ZIP／manifest bytes相同，23舊operation input/output schemas相同。27原生狀態、22份各599來源欄位核對；桌面／390px滑鼠與Enter定位、拒絕／恢復、總長採用／撤回、負鏡尾新增拒絕、有效新增／刪除及晚回覆保留。7原生完整HTTP回覆等於application；實際CLI／Agent／MCP及6個直接HTTP good/bad/good核對，診斷CLI2／invalid1無輸出／預設覆寫1 bytes保持。2tabs關閉、viewport reset、2bounded servers及臨時HTTP thread正常停止，console0。瀏覽器文字下載click已送出但download事件逾時，未確認保存；完整視覺／screen-reader／正式媒體／Host／平台接受仍未驗證。見[QA](docs/QA-v0.96.0.md)、[交接](docs/HANDOFF-v0.96.0.md)。

## v0.95.0

歌詞、分鏡與 ZIP 原文搜尋在中文輸入法選字時，Enter 不再提前尋找或重設原結果；一般 Enter 與「尋找」按鈕仍可使用。命中摘錄、原欄位定位、取消／重試、前後分頁及私人編修保留。

search-input 純三欄鍵盤 metadata → 三個原 DOM adapter → 既有搜尋 controller。isComposing 或 legacy keyCode229 不 preventDefault、不讀來源／清單或呼叫搜尋；只有有效普通 Enter 才執行原動作。純層無 DOM／事件副作用、timer、網路或持久狀態；固定一 JS asset。控制器、app、application／CLI／Agent／MCP、領域 schemas 與 23 operation input/output schemas不變。產品95／唯一policy38–95共58／unknown96拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。

572 Python68.390秒（兩隔離workers／120秒整體期限）／1104JS／108syntax／四Skills；10項新增測試。原v94 exact-source ZIP還原572／1094，228歷史交付ZIP／manifest bytes相同，23 operation schemas相同。40歌詞／分鏡＋10ZIP原生狀態，35合成 KeyboardEvent 選字事件均未被攔截；來源／結果／ZIP選取與分頁保持，一般原生Enter／按鈕／取消／重試／原欄focus與空查詢錯誤接續核對。11真正原生HTTP搜尋請求中2個ERR_ABORTED、9個完成；11後端完整回覆（含取消後完成者）等於application，兩種搜尋實際CLI／Agent／MCP一致，good/bad/good與預設覆寫拒絕bytes保持。3自有tabs關閉／viewport reset／2servers正常停止／console0。合成事件不是Windows實際IME候選面板驗收；截圖與DOM幾何不是完整視覺／screen-reader／保存／正式媒體／Host／平台驗收。見[QA](docs/QA-v0.95.0.md)、[交接](docs/HANDOFF-v0.95.0.md)。

## v0.94.0

歌詞與分鏡搜尋清單改顯示命中附近前後文，使用literal mark標示命中詞及原句／鏡號與欄位。長段落後半的關鍵字也能辨認，重複開場的結果可由鄰句分辨；長查詢明示「命中已摘錄」。點選與Enter仍回原欄位，完整原文／時間／報告保持；取消與分頁沿原控制。

v0.94 命中前後文：共享 search-excerpt 純來源／UTF-8 span與query核對，重用既有 delivery-context 的每側64byte邊界模型；2000codepoints原欄位、query≤1024bytes，顯示每側48／命中96codepoints，控制符visible token不能被截斷。shared literal search-excerpt-dom建立span／mark，再由兩個原DOM adapter接到現有current controller；先准备全批view再改DOM。無innerHTML／source寫入／網路／timer，新server僅兩固定JS assets。原prefix caption helper相容保持，live結果使用新view；完整files/data/meta與兩種search1／23舊operation schemas不變。產品94／policy38–94共57／unknown95拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。

572 Python67.375秒（兩隔離workers／120秒整體期限）／1094JS／107syntax／四Skills，51focused包含8新excerpt測試。原v93 exact-source ZIP還原572／1086，224歷史ZIP/manifests bytes相同，23既有operation input/output schemas相同。合成45鏡／45句、39原生觀察／320／390／1440px；23個狀態共460個native命中view依完整來源／byte span與純模型逐值相同。16後端完整HTTP回覆（含取消後完成者）等於application，兩種搜尋實際CLI／Agent／MCP一致，good/bad/good與預設覆寫拒絕bytes保持；主tab console0。見[QA](docs/QA-v0.94.0.md)、[交接](docs/HANDOFF-v0.94.0.md)。

## v0.93.0

歌詞與分鏡搜尋等待中可按「取消搜尋」，保留上一批結果與分頁歷史，再次搜尋可立即重試。換查詢、編修原文或換工作台會中止自己的舊瀏覽器請求；晚成功／錯誤不能提交。滑鼠與鍵盤取消後仍持有取消焦點才返回查詢欄，後續焦點保留。共用純 request lifecycle／注入 controller／明確 signal／固定 DOM 分層；原文、時間、媒體、草稿與上一份成果保持，後端可能完成請求。

v0.93 歌詞／分鏡搜尋取消：共用 search-request 純請求 ownership／注入 AbortController factory → 各搜尋 controller generation/source/ID/results current → app 明確傳遞 signal → native fetch；固定 DOM 顯示取消並在仍持有焦點時返回查詢欄。失效先於 abort，旧 finally 不能釋放新 job；顯式取消保留上一批、分頁歷史、原文與成果，換查詢／來源／換台沿原 reset 清除舊定位。idle cancel 不 capture／render／建立 job；pagehide listener 屬於 document。讀取本機 SHA 可晚 settle、後端可完成；搜尋 ownership 立即失效，可明確重試，與共用 operation-gate 等待 local settle 的契約分開。只新增一固定 JS asset，無新 operation／schema／取消 endpoint／路徑／模型／依賴。16基本／23啟庫、Agent1／draft3／23既有 input/output schemas／legal4／private／FreeTWAI not_submitted保持。產品93／交付38–93共56／unknown94拒絕。

572 Python（68.578秒，兩隔離workers／120秒整體期限）／1086 JS／105 syntax／四Skills；17新取消測試。原 v92 exact-source ZIP 還原572／1069；220歷史ZIP/manifests逐bytes相同，23既有operation input/output schemas相同。45鏡／45句合成來源、31原生觀察、320／390／1440px，17原生搜尋請求中10個ERR_ABORTED與7個完成；取消分頁保留20筆、Enter／滑鼠焦點、編修／換台取消、立即重試與原欄focus。19後端完整HTTP回覆（含取消後仍完成者）等於application；兩種搜尋的實際CLI／Agent／MCP同來源一致，bad/good接續、預設覆寫拒絕且bytes保持。見[QA](docs/QA-v0.93.0.md)、[交接](docs/HANDOFF-v0.93.0.md)。

## v0.92.0

新增分鏡原文搜尋：依八個敘事欄位找第一個字面命中，每批20鏡，前後分頁並展開原欄位。Python／原生JS純來源與SHA模型→共用application四adapter→注入current controller→literal DOM及stable ID／原值focus。1000鏡／每欄2000codepoints／compact source1MiB，回覆files/data/meta、JSON與Markdown完整核對；原文／時間／草稿保留，未知或晚回覆拒絕。新增唯讀storyboard_search與CLI／MCP／HTTP，16基本／23啟庫需重新discovery；22個既有operation input/output schemas逐值相同。572Python73.532秒／1069JS／104syntax／四Skills、原v91封裝564／1057還原、216歷史ZIP/manifests byte相同；45鏡原生40觀察／11完整HTTP報告與四adapter一致，三尺寸／八欄focus／Enter分頁／零命中／晚回覆及編修保持。product92／sources38–92共55／unknown93拒絕，Agent1／draft3／legal4／private／FreeTWAI not_submitted保持，rolling active。

## v0.91.0

處理列改在main上方sticky區：390px baseline歌曲報告時取消入口top3618px，現版在390/320/1440px長表單捲動後仍可操作。pure operation-presentation有界驗證四workbench/action及gate三bool一致性→固定DOM adapter隔離擷取一次metadata→app.run開始前hook；refresh只讀gate，不讀創作來源、不新增timer或scroll呼叫。標示處理中/取消中及工作台/動作，idle隱藏並清空context；既有gate/request cancel/current/source/revision/dirty及focus保持。server只新增一固定JS asset，application/CLI/Agent/MCP/domain/wire/權限/依賴不變，15/22、Agent1/draft3保持。564Python63.922秒/1057JS/101syntax/四Skills、142focused（8新presentation/DOM/actualrun）、原v90 ZIP564/1049還原與212歷史ZIP/manifests逐bytes相同。原生390×844、320×568、1440×900，歌曲/分鏡/歌詞標示、捲動可達、mouse/Enter取消、重試、人工編修/歷史/上一份成果及完成清空核對；三原生報告與actual application/CLI/Agent/MCP/HTTP一致。geometry/保存screenshot與實際操作不冒充完整視覺/screen-reader驗收，正式媒體/特定Host/平台未驗證。產品91/supported38–91共54/unknown92，legal4/private/FreeTWAI not_submitted保持；restore/main/指定封裝與SHA、latest91/90/89保護，rolling active。

## v0.90.0

新增共用工作台「取消等待」：本次 gate 在 native abort listener 前失效，只有同一 awaited task 結束才能釋放；取消保留來源、刪除紀錄、媒體與上一份成果，後續人工編修仍沿 dirty/revision 保護。純 operation-gate → 明確 request context signal → 固定 operation-control DOM adapter 分層；原來源核對保持，晚到成功/錯誤不提交。取消 fetch 不表示後端停止；不可中斷的 File.arrayBuffer/WebCrypto 階段保持 cancelling/busy 到結束。獨立 library/search/backup/file preview/ZIP import 保留原生命週期；known delivery ID 原 discard 保持，未知 staging 沿 bounded expiry/server close。server 只新增兩固定 JS assets，application/CLI/Agent/MCP/領域schemas/權限/依賴不變，15/22、Agent1/draft3保持。564Python68.266秒/1049JS/100syntax/四Skills、149focused（15新純模型/實際run/API/DOM/controller測試）、208歷史ZIP/manifests與原v89 ZIP564/1034還原通過。原生歌曲/分鏡/歌詞取消、重試、晚到後端、人工編修/歷史/上一份成果、匯入/匯出及390px Enter焦點核對；三原生報告與actual application/CLI/Agent/MCP/HTTP一致。12秒延遲只在ignored QA，沒有production取消endpoint或kill。完整視覺/screen-reader/正式媒體/特定Host未驗證。產品90/來源38–90共53/unknown91，legal4/private/FreeTWAI not_submitted保持，latest90/89/88保護，rolling active。

## v0.89.0

修正歌曲/分鏡報告處理中仍可載入範例，替換原來源並清除刪除紀錄的問題。兩範例入口在讀取完成且共用操作結束後才開放，handler在load/clear/dirty/render之前拒絕未就緒或busy。初始HTML停用，startup與run既有timingControls/finally共用refreshExampleControls DOM adapter；late startup不自動取代處理中的來源，也不覆蓋其進度訊息，後續人工編修沿既有retention保持。明確idle載入只替換所選工作台並清除該台刪除歷史。原欄位編修與revision/current過期保護保持；domain/HTTP/CLI/Agent/MCP未改，無新asset/operation/schema/依賴/權限；15/22、Agent1/draft3保持。564Python69.922秒/1034JS/98syntax/四Skills、134focused（10新actual handler/run/initialize測試）、204歷史ZIP/manifests及原v88 ZIP564/1024還原通過。原生讀取中自寫歌名保留、成功/HTTP500/過期回覆、歷史/上一份成果保持、完成後限定範例載入及390px Enter核對完成；三原生報告與actual CLI/Agent/MCP/HTTP一致，拒覆寫/good-bad-good保持。delay/500只在ignored QA helper，production server未改。兩owned tabs/兩bounded servers正常關閉，viewport reset；HTTP500是刻意測試，console warn/error零。完整視覺/screen-reader/正式媒體未驗證。產品89/來源38–89共52/unknown90，legal4/private/FreeTWAI not_submitted保持，latest89/88/87保護，rolling active。

## v0.88.0

修正共用run處理中仍可新增避免事項/交付項目/母題/歌詞句、使本次報告失效的缺口。六清單collections固定add/remove metadata→app共用refreshCollectionControls，busy時停用新增/指定刪除/三台還原選單與按鈕；四缺少guard的新增入口在讀來源或產生ID之前拒絕。成功/失敗/來源過期後沿run finally恢復控制，保留較早還原選擇、原值/ID/歷史；不重建選單或讀全文。原欄位仍可編修，revision/current繼續拒絕舊回覆，上一份成果保持且dirty停下載。domain/pure History/HTTP/CLI/Agent/MCP與schema無改動，無新asset/operation/依賴/權限；15/22、Agent1/draft3保持。564Python65.421秒/1024JS/98syntax/四Skills、107focused（10新busy測試）、200歷史ZIP/manifests與v87原包564/1014還原通過。原生三種完整報告source/data與actual CLI/Agent/MCP/HTTP完全一致，CLI拒覆寫與good/bad/good保持。baseline四種新增問題以QA-only6秒延遲重現；corrected native21觀察含全部busy控制、完成後四入口接續新增、較早還原、原欄位編修/過期回覆、390px Enter報告/還原/新增與原句保留，document375≤390、console0。兩owned tab/兩bounded server正常關閉，viewport reset；完整視覺/screen-reader/正式媒體未驗證。補正v87契約的實際deletion-history.js路徑。產品88/來源38–88共51/unknown89，legal4/private/FreeTWAI not_submitted保持，latest88/87/86保護，rolling active。

## v0.87.0

修正刪除鏡頭時自動改寫其餘時間：只移除所選鏡頭，其他鏡頭原字串、穩定ID、創作與作品總長保留；負值、留白與短於一影格也不靜默修正。既有時間待辦列出缺口，完整分鏡仍拒絕未修正時間。共用純History.remove/restore→app原生欄位adapter→限定dirty與焦點；新刪除record不含時間patch，還原保留後續時間/文字/總長。固定操作提示與aria-describedby，無新asset/operation/schema；15/22、Agent1/draft3保持。564Python67.047秒/1014JS/98syntax/四Skills、68focused、196歷史ZIP/manifests與v86原包564/1002還原通過；actual CLI/Agent/MCP/HTTP三種時間問題的原source/files一致，good/bad/good與CLI拒覆寫通過。native22觀察含普通缺口/負值/極短時間/尾鏡、待辦定位/報告/完整建立拒絕、上一份成果保留且dirty停下載、還原原值與後續編修、390px Enter刪除/還原且document375≤390。首次focused只有舊測試期待自動前移時間，改以保留原值核對後fresh全測通過，失敗紀錄保留。兩owned tab/兩bounded server正常關閉，viewport reset；未選媒體，完整視覺/screen reader/正式素材未驗證。產品87/來源38–87共50/unknown88，legal4/private/FreeTWAI not_submitted保持，latest87/86/85保護，rolling active。

## v0.86.0

新增「核對下載的原文」：明確選回本機檔案，逐 byte 比較目前選定成果的完整 canonical UTF-8 bytes，顯示一致／第一個0起差異與雙方大小；改名不影響核對。pure text-verification→注入 capture/native File read/latest/current controller→literal DOM，8MiB讀前上限、讀後大小與來源核對；切檔/成果/換台/dirty/busy清除過期證明，晚成功/失敗不改後續狀態。不讀textarea摘錄、不改成果/編修/媒體、不解草稿另存警示、不保存核對報告。三固定JS資產；沒有新operation或領域schema，15/22、Agent1/draft3與既有下載保持。564Python67.640秒/1002JS/98syntax/四Skills、2Python+16JS focused、60共用流程回歸、192歷史ZIP/manifests與v85原包562/986還原、actual CLI/Agent/MCP good/bad/good通過。native18觀察含相同/改名/單byte差異/空檔、切檔/編修/換台失效、原值/成果/草稿提示保持、390px Enter選檔與无document橫向超宽。baseline與本輪Page下載事件各確認brief.json 2040bytes completed；回選檔是明示合成fixture，沒有取得實際下載保存路徑/bytes，不混淆兩種證據。初次全測17JS失敗源自共用run的新增free lexical依賴，改用state.textVerification後fresh全通過，失敗紀錄保留；unknown POST測試400誤判修正為原404，native QA比對依目前canonical檔名修正。兩owned tab/兩bounded server正常關閉、viewport reset；完整視覺/screen reader/正式素材實聽未驗證。產品86/來源38–86共49/unknown87、legal4/private/not_submitted與latest86/85/84保持，rolling active。

## v0.85.0

新增唯讀原句搜尋：保留原順序、重複句、Unicode與空白，每句列第一個字面命中；時間未完成亦可查找。Python/JS純search1原文字陣列與UTF-8 SHA→application→CLI/Agent/MCP/HTTP；browser注入latest/source/query/results核對controller→literal DOM→穩定ID文字欄定位。每批20、上一批/下一批，原句或ID變更失效，晚成功/失敗保留後續編修；只定位、不seek。source SHA不含時間或媒體，完整搜尋请求與傳輸沿2MiB上限。產品85／明確來源38–85共48／unknown86；新增lyrics_search，基本15／啟庫22，Agent1/draft3與既有領域schemas保持。562 Python68.797秒／986 JS／95syntax／四Skills、8Python+14JS focused、188歷史ZIP/manifests與v84原包554/972還原；actual CLI/Agent/MCP與新搜尋四adapter good/bad/good/預設拒覆寫通過。native12觀察：300句分頁與第21句focus、空表/零命中、未完成時間、query/text/delete失效、音檔/時長/paused position保持、自然播放繼續、390px Enter/literal HTML無執行。download click已送出但10秒未取得保存檔案，另存驗收未完成；完整視覺/screen-reader/實聽未驗證。兩測試helper失敗源自MCP舊清單及JS位置regex，失敗紀錄保留，fresh checks全通過。三tab/兩bounded servers正常結束；無新依賴/模型/網路/path權限。legal4/private/not_submitted保持，latest85/84/83與rolling active。

## v0.84.0

新增歌詞句後明確聚焦新文字欄；刪除最後一列後接回對應新增按鈕，還原接回原列。共用於歌曲段落、避免事項、交付項目、母題、鏡頭及歌詞六種清單；新增鏡頭展開並聚焦母題，還原鏡頭聚焦摘要。editor-focus純有界ID來源／proposal→注入雙capture controller→固定DOM adapter→app分層，busy/hidden/source drift與無效目標拒絕focus，確認native activeElement才成功；不讀原欄位、不改資料／草稿／播放。554 Python68.828秒／972 JS／92syntax／四Skills、50focused、184歷史ZIP／manifest、v83原包554／960還原、CLI/Agent/MCP bytes相同與good/bad/good、native30觀察／六種清單／九歌曲scalar保持／合成音檔與paused position保持／自然播放不中止／390px鍵盤通過。QA整合helper誤用不存在的test_delivery_inspection.py，保留失敗run；fresh recovery只完成剩餘修改，全部測試通過。兩tab與兩bounded server正常結束。兩fixed JS路由；沒有新operation/schema/依賴/模型/權限，14/21／Agent1/draft3/legal4/private/not_submitted保持。latest84/83/82與rolling active。

## v0.83.0

目前歌詞播放熱路徑新增pure prepared rows／injected playback controller／owned DOM marker／app分層。input、render、stamp/undo及batch apply/undo明確失效；position-only更新保留全部media/context檢查，不再重讀／解析整表，原activeCueIndex最後重疊命中規則保持。明確focus沿原完整fresh雙capture，不信任顯示cache。高亮只移除舊列及加入新列，同ID原node保持、重建後重新解析。實測10000列×120更新，row capture120→1、raw copies1200000→10000，全部120views一致；單次Node基準2267.6433→44.3776ms，不冒充browser FPS。另重現v82actual batch adapter在短media下保留過期enabled，programmatic apply/undo force刷新句首button已修正。554 Python67.953秒／960 JS／90syntax／四Skills、71focus、180歷史ZIP／manifest、v82原包554／948還原、CLI/Agent/MCP bytes與good/bad/good、native25觀察／1022欄位保持／300列／390px鍵盤通過。兩自有tab與bounded servers完成，無新資產/HTTP/Agent操作/timer/依賴/模型；14/21／Agent1/draft3／領域schemas/legal4/private/not_submitted保持，latest83/82/81與rolling active。

## v0.82.0

新增逐句「定位句首」：滑鼠或Enter回到原開始時間，結束留白仍可定位，再沿波形鍵盤細調。pure cue-position／injected controller／delegated DOM／app分層，穩定ID、完整原列與媒體來源／時長重查，寫後核對實際位置；只seek，播放／暫停、原欄位、草稿與標記撤回保持。位置自然更新不逐列重掃，無新timer。另修正共用Python／JS原十進位字串的負值下溢：-1e-999先拒絕，再捨入；真正負零與signed shift保持。554 Python68.859秒／948 JS／90syntax／四Skills、61focus、176歷史ZIP、v81原包553／933還原、最終CLI／Agent／MCP bytes一致、26跨語言數值及Agent／MCP／HTTP good/bad/good／CLI1無輸出、原生31+4觀察／136欄位保持／390px鍵盤通過。兩次數值QA helper失敗為module shadow及CLI oracle寫錯，失敗紀錄保留、fresh helper通過，未改CLI退出契約。三個自有tab／bounded server完成；14/21／Agent1/draft3／領域schemas/legal4/private/not_submitted保持，latest82/81/80與rolling active。

## v0.81.0

目前歌詞與列高亮共用媒體就緒／來源核對；無音檔或換檔時清舊句，新增「前往目前這句」以滑鼠或Enter明確focus原列文字。pure current-cue／injected controller／literal DOM／app共同capture分層，穩定ID與雙snapshot、原欄位及媒體核對；自然播放／其他編修保持，部分有效句不冒充完整匯出。553 Python71.516秒／933 JS／88syntax／四Skills、38focus、172歷史ZIP、v80原包553／920還原、actual CLI/Agent/MCP bytes與good/bad/good、原生26觀察／136欄位不變／390px Enter／新歌詞包與draft媒體reset通過。native broken.wav ready0清舊句，但error=true未觀察，error純分支已測；QA錯選項failed fixture保留、fresh .json fixture通過。兩個自有tab／bounded server完成，無新timer／依賴／模型或HTTP operation，14/21／Agent1/draft3/legal4/private/not_submitted保持；latest81/80/79與rolling active。

## v0.80.0

修正projects.release_version停在v77但product/remote已v79的缺口，明確expected tag v0.80.0；靜態宣告不冒充發佈成功。pure release_metadata→strict JSON→selected immutable Git blob size/show→package前及archive metadata/policy核對；64KiB marker/8192B policy、錯／stale／duplicate／unknown在mkdir前拒絕，working files不能換來源。manifest1只增加checks.release_metadata，原schema/Agent1/draft3/14/21保持。553 Python69.375秒／920 JS／86 syntax／四Skills，8新contract/7版本focus、168歷史ZIP、v79原包545／920還原、actual CLI/Agent/MCP bytes與good/bad/good通過。首輪oracle42漏改43及QA漏--input的failed records保留，fresh retries通過，產品CLI不改。web/HTTP/領域無diff、無新常駐server/tab，latest80/79/78、legal4/private/not_submitted保持，rolling active。

## v0.79.0

逐句開始／結束／整句移動新增最近一次撤回，精確還原原時間字串並保留後續文字、其他句／刪除與音檔。目標時間改動或刪除永久停舊撤回；改回／還原刪句不復活，新成功標記可建立新紀錄。同值／無效標記保留有效舊紀錄，載入新歌詞清除。pure cue-stamp-edit→注入來源／實際after重查controller→literal DOM／app，沿同一native media capture與既有毫秒規則，暫態不進draft3／wire／Agent。545 Python67.437秒／920 JS／86 syntax／四Skills、164歷史文字ZIP與v78原封裝545／909還原通過；native tab127缺口／128修正22觀察、390px Enter、133欄位僅目標開始還原、console0，兩server原handles正常exit0／thread joined、tabclosed／viewportreset／no staging。首輪16 JS失敗為四個VM測試未注入新controller，補null fixture後fresh全套通過；Agent QA首輪誤期望invalid_request，依既有domain的invalid_input修正QA後good/bad/good通過，產品契約未改。兩失敗record保留。latest79／78／77、legal4/private/not_submitted保持，rolling active。

## v0.78.0

波形校時顯示播放位置與總長；方向鍵0.5秒、Shift細調0.05秒，Home／End到起尾。空音檔、換檔或錯誤時歸零停用，原歌詞與宣告保持。pure wave-position→注入來源重查controller→native DOM／app，無新wire/schema/工具。545 Python67.235秒／909 JS／84 syntax／四Skills、160歷史文字ZIP與v77原封裝545／901還原通過；native tab125缺口／126修正16觀察、390px按鍵與60欄位保持、console0，兩server原handles正常exit0／thread joined、tabclosed／viewportreset／no staging。QA回覆304321B超舊300000內部門檻的失敗record保留，fresh retry512KiB有界完成，產品容量不變。latest78／77／76、legal4/private/not_submitted保持，rolling active。

保存紀錄與備份共用純 UTC 日期驗證，拒絕不存在曆日與時間溢位；移除瀏覽器自動轉日期，接受合法 Z／小時及單字元分隔的原時間，排序與保存 bytes 保持。545 Python／901 JavaScript／82語法／四份Skill、156歷史ZIP及v76原封裝541／892還原通過；14／21工具與原schema保持。

保存時間與備份計畫原依runtime Date.parse，會接受被捨換的曆日。新純UTC年月日/閏年/時分秒/零offset/Unicode grammar跨Python與JS，完全返回原文；保存record與備份created_at、browser revision/list/search/receipt及backup plan共用。秒小數固定3或6位，explicit Z/±00:00與零秒offset支援，與native Python版本解析範圍分開。未知格式拒絕，不補日／換timezone／rewrite或migrate。原工具/operation/wire/schema/controller/write/path/model/依賴保持；產品77/來源38–77共40項、unknown78拒絕。見[契約](docs/UTC-TIMESTAMP.md)、[QA](docs/QA-v0.77.0.md)、[交接](docs/HANDOFF-v0.77.0.md)。

# v0.76.0 · 2026-10-05

保存清單分清空庫、搜尋零命中與摘要不可讀；選定版本顯示四種名稱的字面命中位置。查詢編修／等待／取消後仍標示原接受查詢，原稿、預覽、音檔保持。541 Python／892 JavaScript／81語法／四份Skill、152歷史ZIP及v75原封裝539／879還原通過；14／21工具與原schema保持。

修正搜尋零命中誤報空庫；摘要不可讀單獨警示原資料保留。新共享library_match與library-match.js只處理四種原名稱、query與非重疊Unicode codepoint spans；presentation純狀態→DOM只建文字/mark，四欄、最多560命中，有界局部捲動及鍵盤焦點。原HTTP搜尋結果不增欄位，app只記錄接受查詢及counts供顯示，編修查詢不改舊mark。沒有新增operation／wire／schema／依賴／模型／寫檔／path權限。產品76／來源38–76共39项，未知77拒絕，見[契約](docs/LIBRARY-PRESENTATION.md)、[QA](docs/QA-v0.76.0.md)、[交接](docs/HANDOFF-v0.76.0.md)。

# v0.75.0 · 2026-10-05

全庫字面搜尋保存名稱及歌曲／分鏡／歌詞名；分頁核對完整觀察摘要，來源變更需重新搜尋。錯誤或晚回覆保留清單、預覽、編修與音檔。539 Python／879 JavaScript／78語法／四份Skill及148歷史ZIP通過；基本14／明確啟庫21工具，新search1獨立。

保存版本原只能逐頁挑選。新增唯讀draft_search，literal case-sensitive匹配label及三種title，不讀正文／media；query與全庫可讀metadata／不可讀ID派生SHA，cursor pin拒絕來源或query變更。browser精確wire／data／全metadata／頁長／邊界核對，controller核對latest及所有已顯示ID才發布；查詢改動／cancel保留上一份清單及有效preview，重新整理切回全部版本。CLI／Agent／MCP／HTTP共用application，MCP需重新discovery。

全套測試已超過原单程序120秒，保留timeout/profile收據；驗證launcher採固定2隔離程序，120秒整體期限保持，獨立完整discovery逐ID檢查不漏／不重複。Git指定source封裝使用同launcher。無新依賴／模型／外網／auth／path或write權限，Agent1／draft3／library1／backup1保持；產品75支持38–75，unknown76拒絕。見[契約](docs/LIBRARY-SEARCH.md)、[QA](docs/QA-v0.75.0.md)、[交接](docs/HANDOFF-v0.75.0.md)。

# v0.74.0 · 2026-10-05

保存、清單與回讀先核對完整產品／協定回覆，清單再核對所有版本資料、排序與分頁來源。錯誤或晚回覆保留目前清單、預覽、編修與音檔；未確認保存沿同一 ID 及原稿重試。534 Python／867 JavaScript／77語法／四份Skill及144歷史ZIP通過，基本14／啟庫20工具保持。

原工作台把 HTTP 回覆剝成 data，保存／回讀的內容核對看不到產品版本與協定；清單也能接受未知格式、重複ID或錯接續位置。新增纯 library-result 核對三種完整 envelope，從 library-revision 抽出共享完整 metadata 檢查；required checkList 在最新回覆核對後才交付DOM。排序依後端原時間字串與ID，不改成 Date 排序。錯回覆保留原清單及 pending save；同 ID 回讀確認後，後續修改仍提示尚未保存。無新 wire/schema/tool/依賴／權限。見[契約](docs/LIBRARY-RESULT.md)、[QA](docs/QA-v0.74.0.md)、[交接](docs/HANDOFF-v0.74.0.md)。

# v0.73.0 · 2026-10-05

新增唯讀草稿庫備份匯出；Agent／MCP預設摘要，明確選擇才內嵌不超過512KiB的ZIP，亦可指定保存ID。完整ZIP與來源核對，CLI／HTTP沿共用application。532 Python／853 JavaScript／76語法／四份Skill及140歷史ZIP通過；啟庫20工具，基本14保持。

補齊CLI/工作台已有備份而Agent/MCP只能inspect/restore的流程缺口。新增draft_backup_export、CLI draft backup-export及loopback POST /api/drafts/backup/export。metadata含完整ZIP hash/bytes/count/selection及實際revision IDs；explicit include_archive只回<=512KiB base64，不寫檔。pure codec重查本次原bytes完整CRC/manifest/revision hashes與producer摘要及selected IDs。獨立export1、可發現的strict輸入／輸出schema；MCP新工具readonly。原backup1/prepare/file backup、Agent1/draft3/library1維持。見[契約](docs/BACKUP-EXPORT.md)、[QA](docs/QA-v0.73.0.md)、[交接](docs/HANDOFF-v0.73.0.md)。

# v0.72.0 · 2026-10-05

備份下載先核對完整摘要、串流位元組與 SHA-256，再交給瀏覽器；新增取消下載，晚回覆保留編修與音檔，已斷線回應只結束該連線。521 Python／853 JavaScript／76語法／四份Skill及136歷史ZIP通過。瀏覽器保存檔案仍未驗證。

原下載只檢查URL等少數欄位便提交原生form；現在exact backup1 descriptor及1–32MiB界限、已知single-use相對URL、HTTP headers、逐chunk累積及完整bytes／SHA全部一致才原生Blob handoff。備份與文字下載共用有限URL ledger；新取消控制abort自身請求、late成功／失敗不改新狀態。取消後已斷線headers/body只關該回應，其他I/O錯誤仍保留。無新route／Agent操作／schema／依賴。見[契約](docs/BACKUP-DOWNLOAD.md)、[QA](docs/QA-v0.72.0.md)、[交接](docs/HANDOFF-v0.72.0.md)。

# v0.71.0 · 2026-10-05

備份預覽先量測選定 ZIP 的 SHA-256，完整核對來源、版本與恢復計數；未確認恢復回覆保留同一備份供明確重試，後續編修與音檔保持。517 Python／841 JavaScript／74語法／四份Skill及132歷史ZIP通過。

之前backup controller只做部分plan shape檢查，未量測選定ZIP，任何恢復回覆都能onRestored。新增backup-file原生File／WebCrypto來源層與backup-result純完整wire核對，controller必須注入三個驗證callback。雜湊後及inspect後重查latest；preview全部ID分組／計數／狀態一致，restore核對原SHA／總數與added+reused。錯成功回覆保持uncertain pending及同File供明確重試；原4xx definite拒絕規則保持，無自動重送。見[契約](docs/BACKUP-RESULT.md)、[QA](docs/QA-v0.71.0.md)、[交接](docs/HANDOFF-v0.71.0.md)。

# v0.70.0 · 2026-10-05

保存版本預覽核對選定 ID 與完整 metadata；讀取完成、套用與匯出前重查目前選擇。不符時保留編修與音檔，切換版本提示重新預覽。514 Python／829 JavaScript／72語法／四份Skill、128歷史ZIP及指定v69還原511／816通過。

先前read controller只驗draft格式，完整合法的另一版本也能成為預覽。抽出library-revision純完整entry/read契約，save receipt重用而保留完整click-time draft比較。controller必須注入checkRead，讀前隔離selected metadata；app在read完成、Apply及原案匯出各重查active selection。原latest token／目標快照／native File保護保持。切換版本清preview並明示重新預覽，晚回覆不得恢復舊提示。無新增schema／operation／任意路徑／依賴。見[契約](docs/LIBRARY-REVISION.md)、[QA](docs/QA-v0.70.0.md)、[交接](docs/HANDOFF-v0.70.0.md)。

# v0.69.0 · 2026-10-05

草稿保存後先回讀同一 ID，完整核對點擊時草稿與保存回應，才標示已保存。回讀失敗保留原 ID／原稿供重試，後續編修與音檔保持。511 Python／816 JavaScript／71語法／四份Skill、124歷史ZIP及指定v68還原508／804通過。

先前保存controller只相信回應而未回讀，wrong ID／內容仍可解除提醒。新增純library-receipt核對完整data ACK及同ID回讀，必須注入confirmSave。保存ACK後的核對失敗或任何讀取錯誤（含4xx）都保持uncertain pending；原保存4xx拒絕仍沿舊行為釋放pending。確認後才retain點擊時原稿，後續編修保持dirty。見[契約](docs/LIBRARY-SAVE-RECEIPT.md)、[QA](docs/QA-v0.69.0.md)、[交接](docs/HANDOFF-v0.69.0.md)。

# v0.68.0 · 2026-10-05

分鏡畫幅可直接輸入，保留四個常用建議；自訂畫幅從完成需求、完整待辦報告或草稿接續時保持原值，沿既有來源核對及限定撤回。空白仍列待辦，不自動補值；素材保持。508 Python／804 JavaScript／70語法／四份Skill與120歷史ZIP核對通過。

後端與Agent原本接受自訂畫幅文字，工作台卻用四值白名單拒絕需求／報告且無法直接輸入。改成原生文字欄位搭配四個datalist建議，移除匯入額外畫幅限制。共用raw-fields保留原始字串，draft3、純report及完整plan各自驗證；不新增數值比值解析、格式強制、裁切或媒體變更。見[契約](docs/STORYBOARD-RATIO.md)、[QA](docs/QA-v0.68.0.md)、[交接](docs/HANDOFF-v0.68.0.md)。

# v0.67.0 · 2026-10-05

歌曲／分鏡完整待辦報告可接續原始欄位；先核對整份報告，再預覽、明確載入選定工作台。保留原始留白、文字、母題ID與音檔，沿既有限定撤回；不能表示的來源拒絕載入，原檔保留。506 Python／800 JavaScript／70語法／四份Skill與116歷史ZIP核對通過。

既有需求選檔只接受完成的brief，無法接續Agent完整待辦報告。新增planning-report-input純檢查，重派生全部來源診斷並精確比較完整report1；planning-import隔離限定panel proposal，DOM沿既有current preview／明確Apply／actual after Undo。未知欄位含function／undefined不能被序列化忽略；一致來源不代表作者或權利證明。無新Agent／HTTP operation、依賴、模型或持久schema。見[契約](docs/PLANNING-REPORT-INPUT.md)、[驗證](docs/QA-v0.67.0.md)、[可逆交接](docs/HANDOFF-v0.67.0.md)。

# v0.66.0 · 2026-10-05

條件草稿／報告明確套用後，可撤回最近一次條件套用；完整核對實際套用後的條件，後續編修拒絕覆蓋。恢復原始未完成值與之前的載入留點，保留下載確認、音檔及其他工作台。成功撤回把鍵盤焦點接回可編修欄位。503 Python／794 JavaScript／69語法／四份Skill與112歷史ZIP核對通過。

原條件Apply沒有撤回入口。既有draft-undo新增注入validator的純value history；controller記錄before／實際after，scope僅完整接受條件，不保存媒體。Undo成功恢復此前loaded指紋，獨立confirmed保持，清單一次一份；拒絕後記錄保留供精確回原after再核對。DOM明確操作與焦點保持分層。見[契約](docs/AUDIO-ACCEPTANCE-UNDO.md)、[驗證](docs/QA-v0.66.0.md)、[可逆交接](docs/HANDOFF-v0.66.0.md)。

# v0.65.0 · 2026-10-05

完整條件檢查報告可接續原始條件；Python／JS先核對整份報告，再由CLI選定檔案或工作台預覽／明確套用。保留未完成原文與音檔，錯誤／未知／晚到檔案拒絕。已載入條件與已確認下載分別留點，確認較早下載不再誤標新條件。503 Python／785 JavaScript／69語法／四份Skill，50份跨語言輸入與108歷史ZIP核對通過。

原Agent報告已含完整來源，但原草稿decoder拒絕直接接續。新增純input契約，不放寬原draft decoder或Agent payload；完整review1從source重新派生，逐欄核對後只取隔離draft1。工作台保留原生File／current快照、預覽與明確套用；CLI沿原排他輸出。保存留點拆為最近載入與最近確認下載兩個有限指紋；後續編修仍需另存。見[契約](docs/AUDIO-ACCEPTANCE-INPUT.md)、[驗證與限制](docs/QA-v0.65.0.md)、[還原與交接](docs/HANDOFF-v0.65.0.md)。

# v0.64.0 · 2026-10-05

自訂接受條件一次檢查三欄、點選定位並輸出共用來源核對報告；未完成原文與音檔保留，錯／晚回覆不覆蓋。CLI／Agent／MCP／HTTP同readonly操作，基本14／啟庫19工具。修正有界極大指數的Decimal例外。497 Python／778 JavaScript／68語法／四份Skill、85份跨語言來源与104歷史ZIP通過。

原prepare只回第一欄；抽出既有field解析，純Python／JS review一次診斷全部，full reply checker与通用readiness-state／獨立DOM分層。新CLI／Agent／MCP／HTTP readonly operation與精確schema，保留原音檔分析／草稿／保存與法律邊界。極大零指數InvalidOperation轉受控ValueError，不捨入小數。原生錯MD／late拒絕與音檔接續已驗證；本輪沒有browser saved-path證據。還原點、驗證與交接見[本輪QA](docs/QA-v0.64.0.md)、[交接](docs/HANDOFF-v0.64.0.md)。

# v0.63.0 · 2026-10-05

音檔 Markdown 改由獨立 Python／JS 純排版產生並逐字核對；錯作品、錯 SHA、改規格／數值／提醒或新增宣稱均拒絕，原成果及音檔保留，合法重試正常。不可測值明示「不可測」，數字固定顯示位數，JSON 量測保持。490 Python／772 JavaScript／66 語法／四份 Skill 通過，83份真 File PCM 與100個歷史 ZIP bytes保持。

基線六個受控MD變更（preset／draft各wrong作品、wronghash、extra claim）皆被接受；新增audio_report.py／audio-report.js純canonical文字層，audio_bundle僅組裝JSON及文字，audio-result逐字比對後才走原PCM／LUFS及presentation。固定asset/index加入依賴。新數字排版採binary64 scale／半值離零至safe integer單位，負零顯示零；peak/RMS3、DC8、時長／LUFS／correlation6位。顯示位數不代表新量測精度，JSON與量測演算法保持。

新增4 Python／5 JS：2057跨語言數字vectors、六種actual PCM涵蓋五響度狀態、逐UTF8 bytes、原數值／Unicode／提醒保持、有界invalid、12完整MD拒絕與2合法重試、current／late、fixed browser formatter。原83 PCM矩陣經新完整guard；PCM矛盾測試同步生成canonical MD後仍必須由數值層拒絕，保留分層coverage。CLI真正MD檔bytes、Agent／MCP／HTTP完整wire及asset核對。首focused錯誤來自測試資料，失敗log保持，fresh retry通過；本輪產品沒有因此改寬界限。

## v0.62.0 · 2026-10-04

音檔報告 SHA-256 綁定實際選定 File 位元組，拒絕同名同大小錯來源；示範條件與條件草稿都核對完整回覆、產品／協定版本與嚴格報告 JSON。原成果保持，雜湊期間改選取消上傳，合法重試及自訂規格提醒正常。486 Python／767 JavaScript／65 語法／四份 Skill 通過，83 份真 File PCM 與96個歷史ZIP bytes保持。

基線七個真application／native File缺口：unknown protocol、unknown product、wrong tool、missing Markdown、preset bad raw JSON、preset wrong name、same name/size wrong actual source均被接受。新增audio-file native byte hash與audio-result pure whole-reply checker，再走audio-review既有PCM／loudness與presentation。hash後/current request後各核對identity／revision／raw條件，error也走原current guard。fixed assets/index依序注入，沒有取代Python analyzer、application、CLI/Agent/MCP／formatters或允許未知schema。

新增2 Python transport/source整合與16 JS（7 File／9 Result）；83原有matrix改用真正File bytes/default WebCrypto；known abc vector、64MiB真File、invalid尺寸/reader/digest/no crypto、精確metadata/files/data、strict Unicode/JSON/rawdraft/current/late及pre-upload取消核對。單元控制器fixture可注入hash callback；公開app走default native SHA，並以原生及真跨adapter資料獨立證明。首輪focused1 JS檔在未到request前拒絕假的late promise，修正fixture等待hash phase而不改產品取消；原failed record/log保持，新retry3／62、transport2、第一次full486／767通過。

## v0.61.0 · 2026-10-04

音檔報告新增獨立 PCM 數值核對：拒絕正值 sample peak、RMS 高於 peak、滿刻度樣本超過影格、安靜段超過時長及非立體聲相關值等矛盾回覆。原報告、表單與音檔保留，可重新分析；全安靜音檔兩端全長與四捨五入保持有效。484 Python／751 JavaScript／63 語法／四份 Skill 通過，83 份實際合成音檔與92個歷史ZIP bytes保持。

實際application產生的report，在data及report.json一起變更且原條件草稿完全相符時，五種矛盾值仍被browser inspect當成technical_checks_passed。新增純audio-statistics validator，audio-review在presentation與onResult之前核對；固定server asset與index依序載入。既有measurement、響度schema、application與CLI/Agent/MCP producer不改；產品61，明確producer38–61共24項，protocol/schema保持。

新增3 Python整合與8 JS測試。83實際PCM涵蓋8/16/24/32 bit、8000/11025/48000/192000 Hz、mono/stereo/多聲道、全安靜／正負滿刻度／安靜邊界、1-frame及量測區塊；真CLI警告exit2、Agent/MCP/HTTP wire與來源bytes核對。拒絕匹配原文的五種篡改、late取消、legacy量測缺席、純模型不修改輸入與browser腳本次序確認。兩舊測試fixture補齊實際producer本來就提供的frames；靜音fixture修正矛盾非零DC。

## v0.60.0 · 2026-10-04

ZIP核對失敗原因保留在選檔區，可清除訊息或重新選檔；編修表單保持提示，清除不取消既有撤回。純控制器的有界失敗metadata、DOM literal狀態與介面樣式分層，舊回應不能恢復已取消的錯誤。481 Python／743 JavaScript／62語法／四份Skill通過，88個歷史ZIP bytes保持。

基線DOM失敗流程的global onError已報原因，但finally／refresh立即把本地note變回一般選檔說明，clear button也停用。Controller現在保留scope及latest job的failure，view/status只回code、最多240 Unicode字元加ellipsis、truncated；onError原物件callback保持。early invalid/busy與read/verification failure都可本地提示；新inspect／cancel／apply／undo清除，scope refresh清除，late fail不回寫。DOM在選檔區保持role=status、error樣式與clear action，只更新改變的live文字；不寫HTML、不擴張來源／網路／檔案權限。既有Undo保持。

新增兩個真Agent/MCP stdio失敗後接續合法operation測試與七JS lifecycle／DOM／Unicode／8MiB原成果測試。MCP fixture首次誤加zoe_前綴，已按實際公開name修正，原失敗record/log保留。產品60／明確來源38–60，protocol與schema不升版；server、Agent/MCP、domain驗證、來源guard與原文producer保持。

## v0.59.0 · 2026-10-04

交付版本改由一份固定白名單管理，Python、瀏覽器封裝／回讀／差異報告及 Agent 使用同一規則；產品版本、草稿標示也取自同一契約。未知版本明確拒絕，不猜測範圍或靜默遷移。479 Python／736 JavaScript／62 語法／四份 Skill 通過，84 個歷史 ZIP bytes 保持。

原五處支援版本清單集中到 musiclab/assets/delivery-versions.json；純 Python／JS 驗證形狀、schema1、三段版本、整數上限、嚴格遞增／不重複、1–128項與current最後一版。稀疏清單只接受所列版本；固定載入失敗即拒絕，沒有推測或回退。產品59与明確來源38–59、Agent1／draft3／package1／inspection1／comparison1及13／18工具保持。

固定唯讀契約script與module沿原Host／Origin／CSP／no-store門檻，封裝驗證交叉核對 registry、product metadata、Agent discovery。新測試最初漏label、既有草稿VM未注入新共用模組，兩個fixture已修正并保留原失敗記錄；Python479已通過，JS改fixture後全套736及語法／Skill通過。無新增依賴、模型、auth或寫檔權限。

## v0.58.0 · 2026-10-04

完整歌詞包共用Unicode文字邊界，名稱、每句文字與歷史說明在套用或匯出前一致驗證，拒絕不完整字元，避免產生無法再載入的JSON；原有效內容與待修正編修保持，修好可重試。Python／原生JS／application／Agent与固定預覽分層，合法emoji與原Unicode／控制字元不正規化。472 Python／730 JavaScript／61語法／4 Skills及原生驗收通過。

基線同一真application完整來源，六個高／低單獨surrogate分別放名稱、cue、note：原native驗證與JSON下載接受，strict reimport全部拒絕；Python原domain只在最末encode冒出UnicodeEncodeError。JSON共享層公開assertUnicode／utf8_bytes，decoder沿同原規則；完整package在來源文字欄位檢查後才做大小核對與提交。revise／legacy轉換／格式提示／三下載格式沿同package層，未知schemas与容量／時間規則保持。

有效JSON／LRC／SRT application bytes保持，固定preview內嵌更新後helper／validator，whole-envelope涵蓋變更。v57測試容許JSON stringify逃脫非法Unicode的斷言已改為提交前拒絕；歷史證據保留。無依賴／模型／外網／HTTP/auth/media或Agent權限擴張。

## v0.57.0 · 2026-10-04

獨立歌詞預覽共用文字下載處理，點擊或排程失敗可回收資源並重試；快速連點有界，離頁只回收下載。三格式用 lyrics.* 可攜檔名，作品名称與完整歷史保存在 JSON；訊息明確表示交給瀏覽器，保存位置另確認。純格式準備／共享控制器／原生傳輸分層，舊 LRC／SRT／JSON 內容保持。467 Python／723 JavaScript／61語法／4 Skills、原生驗收與v56 ZIP465／713還原通過。

基線真生成HTML抽取runtime重現：click失敗留下URL與anchor，timer失敗留下URL，CON標題產生CON.json。固定pure lyrics-download驗證完整source後只準備三種文字；既有text-download模型核對單層檔名／UTF8／8MiB，DOM adapter新增共享controller factory，原form bind改沿同factory。預覽沿既有Apply與格式提醒後送出，錯誤目前時間不配置資源；成功套用不因後续送出失敗自動撤回。兩個待送URL上限／1000ms回收／pagehide沿既有adapter，音檔URL分開。初次UI會說明檔名與保存位置，送出不冒稱保存。

原工作台四檔application bytes保持，完整JSON來源／Unicode／review note原值保持；新範本固定嵌入格式模組與原兩下載模組，template1全外框核對覆蓋新程式。無模型／依賴／外網／Agent權限或HTTP/auth/media核心變動。

## v0.56.0 · 2026-10-04

獨立 preview.html 現在沿用工作台的格式保留規則，提醒 LRC 句首時間標籤與 SRT 空白句風險，按提醒可定位目前歌詞。編修、刪除、新增、播放位置及總長調整會停用舊定位；套用後重新檢查。全部句子計數、畫面前20項明示截斷，零提醒也建議保存完整 JSON。同步純規則／控制器／DOM分層，沒有網路或WebCrypto依賴。修正差異報告漏接受v54來源；四工作台真ZIP覆蓋明確來源38–56。465 Python／713 JavaScript／60語法／4 Skills、原生驗收與v55 ZIP463／704還原通過。

新增共享同步 analyze、獨立提示控制器與字面 DOM presenter；固定共用範本嵌入既有 LRC grammar／export規則和兩模組，完整預覽核對沿現有template1。定位帶本輪revision，舊按鈕回呼在新檢查後也拒絕。原完整來源、LRC／SRT／JSON匯出語義保持，沒有強制修改或取消匯出；完整報告default／include source合成樣本與上一版data／files bytes相同。主工作台六檔與歷史保留實測。

## v0.55.0 · 2026-10-04

歌詞建立與帶時間匯入現在核對完整 preview.html：內嵌來源、标题、樣式、共用模組及執行程式必須符合本次完整歌詞與目前安裝的固定範本。錯來源／空預覽／程式改動拒絕，保留原表格與成果，正常重試可完成。Python 與瀏覽器共用同一範本，合成樣本輸出與 v54 逐 bytes 相同。463 Python／704 JavaScript／58 語法／4 Skills、原生三寬度與 v54 ZIP457／691還原通過。產品55／明確交付來源38–55，13／18工具、Agent1／draft3／review1／source1保持；內部 preview-template1 獨立。

完整來源以嚴格 JSON 與語義值核對，再以原 checked JSON 重組固定 HTML 外框逐字比較；不執行回傳的 HTML。未知範本版本、空值、字元／容量或模組不符拒絕。單一替換不把歌詞中的範本標籤當指令。原離線編修行為保持；範本版本與產品及資料版本分開。CLI／JSON-lines／MCP／HTTP 實際回應、跨語言、取消／late／故障保留與重試都有測試；兩個自有原生頁面及上一版封裝還原通過。

## v0.54.0 · 2026-10-04

格式報告可明確附帶對應的完整 lyrics.json，保留目前歌詞包全部值與校時歷史；預設 API／Agent 仍只有兩個精簡報告。瀏覽器單獨檢查產生三檔，建立歌詞包產生六檔，核對完整來源後才替換成果；錯來源／漏檔保留原編修。修正窄螢幕格式提醒按鈕溢出。457 Python／691 JavaScript／57 語法／4 Skills、原生三寬度與 v53 ZIP451／683還原通過。產品54／明確交付來源38–54，13／18工具、Agent1／draft3／review1／source1保持。

新增 strict boolean include_package 與 CLI --include-package；true 從同一份已驗證來源加入完整歌詞 JSON，report／來源 SHA 保持。完整 JSON 保存資料值，不保證原 JSON 排版 bytes。格式提醒按鈕限寬換行；表格保留自身水平捲動。編修後重建依既有規則保留原 review note、加入改稿說明並移除舊 shift 主張，不把舊來源歷史說成目前校時證據。詳見本輪 QA／HANDOFF。

# v0.53.0 · 2026-10-04

新增歌詞匯出格式保留檢查：句首時間標籤的 LRC 歧義與 ASCII 空白／tab 句的 SRT 遺失可定位原表格；完整 JSON 保存句尾、作品總長與校時歷史。唯讀報告用完整 package 的 SHA-256 核對來源，錯回應保留編修與成果；建立歌詞包會自動顯示提醒。新 review1 與 Agent1／draft3 分開，基本13／啟庫18工具；產品53與明確交付來源38–53同步。451 Python／683 JavaScript／57語法／4 Skills、原生三寬度及 v52 ZIP442／672還原通過。

修正提醒句號與未排序表格不一致：wire 保持按時間排序的 package 句號，介面以穩定 row ID 顯示及定位目前表格句號。沒有改寫、跳脫、抑制匯出或猜測時間；提醒為零仍不代表完整 metadata、實聽或他人播放器驗證。詳見 docs/QA-v0.53.0.md 與 docs/HANDOFF-v0.53.0.md。

# v0.52.0 · 2026-10-04

校時建立從本次送出的 cues／總長或完整 package 派生期望，核對完整回應、時間來源／歷史說明、嚴格JSON及字面LRC／SRT後才替換表格與成果。純 lyrics-result 共用建立及所有帶時間匯入；錯來源／損壞／不完整保留原編修、上一份成果及待套用校時。raw JSON也核對原句，seed保持。HTML只核對存在與字串、不完整語義驗證；wire／schemas／12／17 tools不變。442／672／55 syntax／4 Skills與v51指定ZIP還原通過。見docs/QA-v0.52.0.md及docs/HANDOFF-v0.52.0.md；封裝／private遠端依本輪收據。

指定提交9f62537第一次封裝451測試中，external Origin POST讀403之前遇到WinError10054。獨立loopback重現：帶2-byte body的200次199個403／1個reset，無body的200次全部403；未出現允許外部來源。早期拒絕不讀body，而HTTP client分開送headers／body，Windows可能reset。既有Origin測試改成無body以驗證相同403 guard且仍先於body-size／application驗證；沒有改產品handler、Host／Origin規則或接受範圍。重新全套與exact新source封裝驗證；失敗v0.53.0-9f6253783bed及其收據保留，未發布。

# 迭代說明

## v0.51.0 — 2026-10-04

- 修正 SRT 匯入尾端空白刪除與 Unicode U+0085／U+2028／U+2029 被當換行改為 /；原文各行文字、tab及前後空白保留，真正多行仍沿既有 / 合為單句。ASCII空白行分段，原排版／空白cue限制於介面與文件告知。
- 新增 Python lyrics_srt／原生 JS lyrics-srt 純解析層；CRLF／CR／LF、可選ASCII索引、逗號／點時碼與空白／tab箭頭，checked integer milliseconds、單次文首BOM。超界／缺文字／無效時鐘拒絕；倒置／重疊由共用validate拒絕，不裁切。
- LRC與SRT沿同一timed-source回應核對，從所選原文核對cues／time／inference與JSON／LRC／SRT輸出，拒絕自洽但wrong-source回應。LRC原解析／測試維持；一項Unicode候選未重現。HTML preview僅存在／型別檢查，不宣稱完整語義核對。
- 441 Python／654 JS／54 syntax／4 Skills及原生／三寬度／v50還原通過。產品51與來源38–51、各wire／schema／12／17tools／legal4維持；private exact-source與maintenance依收據。

## v0.50.0 — 2026-10-04

- 修正 LRC 去除歌詞前後空白、將句中 timestamp 視為額外 cue、句中 offset 移動全曲、Unicode 分隔符截斷文字。只解析相鄰行首時間標籤；標籤後全文原值保留，offset 僅獨立行最後值生效，換行只分 CRLF／CR／LF。
- 獨立 Python lyrics_lrc 與原生 JS lyrics-lrc 純模型，整數毫秒與既有精度驗證；單次文首 BOM，CLI／browser／Agent 不重複去除。超界／負時間／無效行首時間拒絕；巨大前導零先縮小再轉整數。
- 瀏覽器 LRC 回應核對原文推得的 cues、duration、estimated、timing／review_notes 及 LRC／SRT 原文輸出。JSON self-consistency 仍保持；完整 preview.html 只核對存在與文字型別，沒有宣稱完整 HTML 語義驗證。
- 428 Python／641 JS／53 syntax／4 Skills、原生預覽／Space套用／重新讀原文／錯誤拒絕／取消／撤回及三寬度／前版還原通過。句首字面 timestamp 與多標籤歧義保留並告知，JSON 作完整保存。產品50／來源38–50；wire／schema／12／17tools／legal4保持。

## v0.49.0 — 2026-10-04

- 新增搜尋「上一批」，回讀同來源cursor重建20筆結果與原序號；每次換批清選取與context，原文reader不自動跳。顯示範圍，最後／第一批停用相應按鈕並讓鍵盤焦點接到另一可用控制。
- controller只保留最近512個start／offset，超出丟最舊返回位置，前進可繼續；提示重新尋找回開頭。query／source／availability變更與重新find清除；失敗保留當前批次、選取、cursor，可重試。
- 修正注入回呼換批／query-change-back／nested read後，舊操作仍提交選取或錯誤的重現；generation／來源／query／batch再次核對。實際DOM callback未重現換批，不誇稱普遍UI故障。
- 十個新JS回歸，416／629／52 syntax／4 Skill及四台原生、三寬度／前版還原通過。產品49／明確來源38–49，wire／schema／12／17tools／legal4保持；private exact-source與maintenance依收據。

## v0.48.0 — 2026-10-04

- 把內部成果來源的隔離snapshot／精確比對移到純delivery-source層，複製容器、保留不可變字串值；每次current仍核對全部原值及原生media身份，不能只依revision或object identity。
- 新增metadata-only view／refreshView／onView；工作台畫面不用完整proposal，完整status／legacy onState／refresh仍提供隔離資料。單份32768-unit雙側excerpt及全文換行計數快取，換檔／新ZIP／cancel／apply／undo釋放。
- 約8MiB原文30次Node讀取／刷新：14,060.47ms→0.99ms，JSON序列化2,516,606,400 chars→0；不是瀏覽器延遲／heap／所有搜尋速度保證。新增17個有意義回歸案例，416 Python／619 JS／52 syntax／4 Skill與四台原生操作通過。
- 產品48與明確來源38–48同步；沒有新wire/schema／tool／依賴／Agent權限，legal4保持。v47指定ZIP還原416／602通過；本輪private exact-source、actual remote及latest3維護依收據。

## v0.47.0 — 2026-10-04

- 用有界原文前後文區分重複搜尋字，選擇後顯示readonly片段並定位。清單標示控制符號、側邊空格縮合／120字元省略；原文與query空格不變。
- context1純bytes裁切／嚴格DTO／presentation、search opt-in／完整ZIP application／CLI／Agent／MCP及DOM分層；每側64／單項1152 bytes，單8MiB buffer共用。預設七欄位置及12／17工具保持。
- strict include_context、來源／query／下一批／Apply／Undo失效；產品47及來源38–47、legal4保持。416 Python／602 JS／51 syntax／4 Skill及四台原生UI、8MiB EOF、後續編修／Undo、三寬度DOM與v46 ZIP408／594還原通過。
- server正常關閉後QA取未建立lazy staging屬性exit1；原handle及錯誤保留，補核對port0／staging未建立，沒有重啟。正式媒體、完整視覺／Host／FreeTWAI與瀏覽器全文保存仍待。

## v0.46.0 — 2026-10-04

- 搜尋完整原文並跳到命中位置，解決長文只能逐段翻頁的缺口。browser ZIP／保留成果每批20筆，Enter／下拉與下一批；來源或query改變清除舊結果。
- text-search1純UTF8 literal位置、完整ZIP／SHA pin application與CLI／Agent／MCP分層；純KMP／controller／DOM與reader共用單8MiB cache，不重新編碼全文；16KiB頁面與原文下載保持。
- query最多1024 UTF8 bytes／Agent1–50，非重疊、one-lookahead、非零起點必須SHA；未知、字元中間、source改變、未選CRC或混用模式拒絕。產品46／明確來源38–46；12／17工具與legal4保持。
- 408 Python／594 JS／50 syntax／4 Skills；四台真瀏覽器、8MiB尾端、保留來源、空／缺／literal、Enterfocus、三寬度DOM、Apply／Undo與前v45 ZIP398／582還原通過。本輪下載保存事件未確認，正式媒體／實聽／完整視覺／Host／FreeTWAI仍待。

## v0.45.0

- 修正 Windows 原生 identity unavailable 導致已退出工作留在未確認狀態；只補查同一PID的本機三欄CIM。
- probe1嚴格有界解碼、單PIDWindows adapter及原生路由分層；純政策保留±9 ticks精度範圍，近似身份不能宣告ownership。
- 失敗／warning／空／錯PID／未知／逾時保持未知；live／unknown阻擋prune，重用的外部程序保持。operation3秒、helper5秒，沒有新維護權限。
- 產品45、來源工具明確38–45；法律／創辦紀錄及12／17 tools／既有schemas保持。398 Python／582 JavaScript／48 syntax／4 Skill與diff通過。

## v0.44.0 — 2026-10-04

- 完整核對ZIP後明確原文分段，Agent／MCP／CLI讀長檔不擴大512KiB files cap。非零起點pin前次archive SHA，變更來源、UTF-8字元中間與缺檔拒絕；片段明示位置與來源，不冒充完整原檔。
- Browser獨立唯讀reader可選目前成果／ZIP原文、前後段與回開頭，empty／missing分開，原下載及Apply／Undo保持。單buffer最多8MiB、頁面16KiB、history512，失效清除，不重複編碼全文。
- 純text-window1／application／adapter與純JS模型／隔離source key的controller／DOM分層；12／17與Agent1／draft3保持，來源38–44，新增兩靜態JS。
- 387Python／582JS／48syntax／4Skill；新增10Python／10JS、8MiB全模型拼回、實際CLI／Agent／MCP，四台20段顯示與4檔完整下載同來源、保留原WAV／後續編修、鍵盤／取消晚回應／三寬度及前版v43 ZIP377／572還原通過。私有發布與維護依收據。

## v0.43.0 — 2026-10-04

- 先完整核對 ZIP，再按明確原檔名選取，解決大封裝無法只取小檔。Agent／MCP維持512 KiB files JSON上限，CLI明確輸出沿8 MiB來源，缺檔與未選取檔損壞都拒絕。
- 四工作台在載入前下載完整 ZIP 原文，empty可下載、removed停用；重查來源與revision，保持目前成果、表單、媒體及限定撤回。DOM只快取檔名與可用狀態，避免切換時再複製大原文。
- 新增pure selection1與共用 sanitized I/O提示，沿原portable檔名、application與native UTF-8 adapter分層。12／17工具與Agent1／draft3保持，來源版本明確38–43。
- 377Python／572JS／46syntax／4Skill；新增12Python／7JS、實際CLI／Agent／MCP，四台13份原文同ZIP bytes／SHA與保留原WAV，三寬度DOM、晚回應取消及v42 ZIP365／565還原通過。exact-source私有發布與維護依收據。

## v0.42.0 — 2026-10-04

- 五種文字下載共用原生UTF-8 bytes，修正form換行正規化及body上限；保持BOM／CRLF／LF／CR／NUL／emoji／空檔。每次取current canonical source，dirty／busy拒絕，下載失敗不新增保存確認。
- pure text-download／注入controller／DOM與app分層，最多2個object URL、一秒／失敗／pagehide釋放自有timer與連結；ZIP／備份staging、相容HTTP、12／17工具及schema不變，來源版本明確38–42。
- 重現8MiB全文textarea拖慢操作，成果預覽重用有界excerpt與aria提示，不拆emoji，下載與ZIP仍全文。
- 365Python／565JS／46syntax／4Skill；新增11JS，四台13份實際原文與ZIP相同、正好8MiB原文重下載、2份報告／三種保存檔回讀、原WAV SHA／後續編修／三寬度geometry及v41 ZIP365／554還原通過。private封裝／PR／Release／actual remote bytes及latest3維護依本輪收據。

## v0.41.0 — 2026-10-04

- ZIP預覽可保存完整差異JSON／Markdown，來源ZIP SHA／bytes、manifest與兩側檔案摘要；下載不套用，編修／取消／晚回應保護沿用，報告schema1獨立。CLI --comparison-report／Agent include_report要求baseline、拒絕include_files碰撞，12／17工具保持。
- Python與browser純報告層、application／adapter分層；原生form明確JSON字串編碼還原原LF／CRLF bytes，未知／重複欄位拒絕；不改legacy export。
- launcher列印絕對WAV／ZIP選擇，不修改Host；default text writer exclusive create修正另一writer預檢後建立檔案被覆蓋的race，多檔可能部分輸出明示，不刪除回滾。
- 365Python／554JS／44syntax／4Skill，新增16Python／8JS；原生四scope8報告逐bytes同契約、原WAV SHA／Enter與三寬度geometry、v40 ZIP349／546還原通過。private exact-source封裝／PR／Release、actual remote hashes與latest3／typed run維護依收據。

## v0.40.0 — 2026-10-04

- ZIP替換前新增精確文字差異／新增變更移除相同／兩份原文與原換行計數；長檔有界摘錄但載入下載全文，按實際面板寬度排版，表單與音檔保持。
- pure Python比較／application／CLI、JSON-lines與MCP；browser同契約model／最新候選controller／literal DOM，HTTP既有inspection核對保持。baseline明確提供scope／files，0–64檔／8MiB、聯集128；comparison1與inspection1／package1／Agent1／draft3獨立，12／17工具保持。
- 349Python／546JS／43syntax／4Skill及diff，新增9Python／15JS；四scope真fixture／Agent／MCP、原生五包下载逐bytes相同、原WAV SHA／40000字全文／Enter撤回與390／1024／1800px通過。v39指定ZIP340／531還原；private PR／指定source封裝／Release／遠端bytes與latest3／typed run維護依收據。

## v0.39.0 — 2026-10-04

- 補齊下載ZIP後無法接回工作台的缺口：四scope原文字ZIP核對／预覽／明確載入／限定撤回，表單與已選音檔保持。讀取中取消、晚回應與跨scope保護，200字原說明再封裝。
- 純有界inspector／canonical producer／application／CLI、HTTP、JSON-lines與MCP分層；browser原二進位清單anchor／純controller／DOM防回覆label沿用ZIP SHA。只接受標準工具38／39，未知拒絕、不解壓。metadata預設、明確files JSON≤512KiB；12／17tools，inspection1／package1／Agent1／draft3獨立。
- 340Python／531JS／4Skill／42syntax及diff，新增12Python／40JS；四scope原生舊ZIP→載入→重下載逐檔相同，長label另包、原WAV SHA／表單保持、4秒late／取消／錯誤来源／390px Enter及1366px可見清單無橫溢。前版v38 ZIP328／491還原通過。指定source封裝／private PR／Release／遠端bytes與限定run／latest3依本輪收據；診斷失敗不當作接受。

## v0.38.0 — 2026-10-04

- 補齊逐檔下載容易漏掉附檔的交付流程：目前工作台所有文字成果ZIP及完整逐檔SHA清單，修改後停用、重建後再下載；不自行收集音檔、草稿或其他素材。
- 純來源／manifest1／確定性ZIP、application、CLI排他寫檔及HTTP有界staging、Agent／MCP adapter、browser純controller／DOM分層。1–64檔／8MiB文字／32MiB封套；Agent預設摘要、明確小型inline上限512KiB，11／16工具及Agent1／draft3保持。
- 完整來源／scope／revision及逐檔清單回覆核對，未知／不符／晚回應取消自身暫存。328Python／491JS／4Skill／39syntax，16新Python／31新JS；四台5次原生下載及全部bytes／SHA讀回、4秒晚回應未逾時取消、390px鍵盤／1366px無頁面橫溢、原合成WAV保留。v37指定ZIP312／460還原通過；private PR／指定commit封裝／Release及遠端bytes／latest3維護依本輪收據。兩次舊工具數量斷言失敗的診斷留在outputs，本輪最終完整檢查通過。

## v0.37.0 — 2026-10-04

- 補齊工作台與CLI／Agent之間的自訂接受值差異：Hz／bit／聲道數，原值獨立schema1條件草稿，未完成可另存，preview／apply／cancel與自己的另存checkpoint。
- 純shape／精確整數／既有直接清單normalize、application、四adapter與browser model／controller／DOM分層。長小數不因float捨入接受；原值、限定target及media身份／busy／late保護，回覆實際清單／來源／report JSON-data核對後才提交。原draft3保持、整份project載入deactivate自訂且保留raw；10／15 tools保持。
- 312Python／460JS／4Skill／37syntax與diff、12新Python／17新JS；四入口實際來源一致、長Unicode HTTP界限、native report／未完成／換行原值及project3下載回讀、390px鍵盤／1366px／500／4秒late／其他panel及media保持。v36 ZIP300／443還原通過；指定commit封裝／privatePR／Release及遠端bytes、latest3／限定程序／維護依收據。PolyForm非商用／legal4／署名保持，平台not_submitted。

## v0.36.0 — 2026-10-04

- 修正窄螢幕建立後成功訊息與成果在視窗下方難尋找：四工作台建立旁狀態及明確查看／返回，聚焦成果標題再返回原控制。清空成果則返回可操作的build，換台清舊目標。
- 純presentation／注入controller／DOM分層；完成不搶焦點，busy停用、dirty明示上一份並保持下載停用，晚回應保留新內容與舊成果。literal文字／鍵盤／auto捲動，導航不進draft或wire；HTTP只新增固定JS assets，10／15工具保持。
- 300Python／443JS／4Skill／35syntax及diff，12新測試；390px／1366px四工作台往返、busy／500／4秒晚回應、原音檔及實際report／draft3下載讀回、真draft載入清空返回build；v35ZIP300／431還原通過。指定commit封裝／privatePR／Release／遠端bytes依本輪收據。PolyForm非商用、署名保持，FreeTWAI not_submitted。

## v0.35.0 — 2026-10-04

- 新增獨立開發維護CLI，預設唯讀稽核／exact preview token清除／recovery journal還原。pure policy、Windows identity reader、filesystem-Git adapter分層，未知schema拒絕；創作10／15工具與既有protocol／draft保持。
- 受管理程序記錄PID／啟動creation／image，重用／已退出／未知分別呈現；read-only單handlefinally關閉，不讀環境、不kill未知或其他程序。
- 封裝限定本專案完整manifest／ZIP兩檔，最新三版／嚴格七天／exact tag與來源、ledger／CRC／現場Git archive SHA；journal先保存、限定搬移與兩檔刪除、restore不覆寫。草稿／備份／媒體與不完整／未知封裝保留。ZIP中央目錄預分配與journal大小有界，I/O部分結果保留journal，不宣稱原子交易。
- 300Python／431JS／4Skill／33syntax；19新增測試、真合成CLI清除／8檔bytes還原、Windows live／handle、原生四工作台／draft3下載讀回、前版v34ZIP281／431還原；指定commit封裝與privatePR／Release／遠端bytes依收據。PolyForm非商用／署名保持，FreeTWAI not_submitted。

## v0.34.0 — 2026-10-04

- 分鏡創作欄位為零仍可能有無效原時間；新增獨立時間待辦，可定位 FPS、秒數、影格缺口／重疊、短於一幀及尾端覆蓋，建立完整包先定位時間問題。
- 新唯讀 storyboard_timing_review、CLI storyboard-timing-review、HTTP 與 JSON-lines／MCP 共用 application；最小原時間來源與 report1 獨立，舊創作 report1／Agent1／draft3保持。基本10／明確啟庫15工具。
- 純部分時間診斷、版本報告、共享影格映射與秒數容差、adapter／DOM 分層；總長接續重用診斷與有限十進位規則，全形數字可明確採用原鏡尾並撤回原總長。原字串、原鏡號／順序、創作及媒體保留。
- 281 Python／431 JS／4 Skill／33語法及diff；103跨語言完整report／Markdown與完成分鏡時鐘接受一致，1000列／2000待辦只截明細。11組 IAB 行為、三份原生報告與四adapter、四panel原值往返、390px DOM／Enter、晚成功／500／不同來源／未知版本保護、原音檔保持及24影格完整包通過。
- 前版v0.33指定ZIP267／413解壓還原通過；本版指定commit封裝、private PR／Release與遠端bytes／SHA、restore及限定維護依本輪收據。PolyForm非商用、署名保持，FreeTWAI not_submitted。

## v0.33.0 — 2026-10-04

- 修正合法 draft3 的原字串被 number／select／單行控制項清空或改寫：12 個數值／畫幅重現值與 8 個特殊欄位經真實瀏覽器下載，四個 panel 與載入來源相等。
- 新增純 raw-fields 控制器與 raw-fields-dom adapter；數值文字欄位保留未完成值，未知畫幅有「原值需核對」選項，特殊字元以可見符號與描述提示。明確編修使用新文字，不自動解碼或轉換。
- 草稿、排序／刪除還原、時長撤回與歌曲／分鏡待辦共用原值；完整分鏡保留時間字串交給 domain，歌詞及鏡頭摘要／新增／刪除壓縮不再將十六進位當十進位。
- 267 Python／413 JS／四 Skill／32 語法與 diff；24 IAB 項目、原生草稿與兩份報告、四 adapter、390px Enter、4 秒晚回應、來源不符保護、原音檔及確認保存；修正後歌曲136秒／分鏡576影格／歌詞6秒完整建立。前版v0.32 ZIP267／400解壓還原通過。
- 指定commit封裝、SHA、private PR／Release與遠端bytes、restore tag及限定維護依HANDOFF與本輪收據。PolyForm非商用、署名、9／14工具及各schema保持；FreeTWAI尚未提交或核准。

## v0.32.0 — 2026-10-04

- 分鏡原欄位診斷／JSON與Markdown報告接通CLI、HTTP、JSON-lines及MCP；原鏡號／母題ID與引用保持，明確--draft只取modern草稿分鏡工作台。
- 歌曲與分鏡抽取共享純回覆核對層；完整來源／data／JSON／Markdown與protocol／schema核對後才提交，未知或晚回應保留編修／成果／媒體／另存狀態。
- 新唯讀工具，9／14 discovery；原協定和schema保持，零待辦不是完整時間／影格／連戲或媒體驗收。
- 267Python／400JS／四Skill／30語法、64跨語言、27IAB／兩native／四adapter／真draft CLI及Agent、390px Enter／母題原列／35待辦20定位／4秒晚回應／完整重疊拒絕及576影格通過；前版v0.31 ZIP258／391還原通過。
- 本輪分支、restore tag、指定commit封裝與SHA、privatePR／Release、遠端檔案與限定維護收據；使用者草稿／素材不清除。見HANDOFF與QA-v0.32.0。

## v0.31.0 — 2026-10-04

- 基線真Agent無music_review、IAB歌曲待辦沒有可交付報告。新增唯讀歌曲原欄位診斷與獨立zoe-music-review schema1，JSON／Markdown；原字串／留白／原列保持，不補創作，零待辦仍須完整歌曲建立。
- music_review.py純形狀／範圍／必填及report，application供HTTP、CLI、JSON-lines、MCP；discovery精確原panel／允許空字串與空列。CLI --input／--draft互斥、modern草稿不遷移、0／2／1狀態與預設不覆寫。8基本／啟庫13工具，舊schema／protocol保持。
- music-readiness重用純模型重算source／完整data／JSON／Markdown及protocol／schema；app明確報告動作、revision／late guard與busy，核對後才替換成果／隱藏舊設計。錯誤、來源不符／未知版本／晚回應保留原成果及後續文字；其他panel／音檔／另存狀態保持。
- 258Python／391JS／四Skill／29語法、9新Python／9新JS、75真Node↔Python報告／Markdown及18IAB，兩native／四adapter、實draft3→CLI及Agent、390px Enter／雙控制／4秒晚回應通過。前版v0.30 ZIP249／382解壓還原；restore-v0.30.0-before-v0.31.0保留main起點。
- 產品0.31.0，無新依賴／模型／auth／production／路徑權限。ZOE. G／PolyForm Noncommercial1.0.0／private保持；指定commit封裝／privatePR合併／Release／遠端bytes、最新三版SHA與確定PID／outputs盤點依收據。完整視覺／正式媒體／Host／FreeTWAI／原生file仍待，rolling active。

## v0.30.0 — 2026-10-04

- 基線 IAB 重現空白段落只顯示泛用錯誤、有效 BPM120.0004 被 HTML 步長攔下。新增歌曲欄位待辦及建立／歌曲分鏡起稿前原欄位定位；BPM step=any，完整數值範圍與 domain 保持。
- planning-values 提取本專案既有文字／有限十進位規則，需求清單與 planning-source／兩種待辦重用。music-readiness 純診斷、readiness-state 注入快照控制器由歌曲／分鏡共用、app 只呈現／聚焦／busy。40 段、每種清單100、8 MiB、全部計數／200明細／前20UI。
- 原始全部歌曲與穩定列 ID 快照，修改／排序／刪除停舊定位、定位前重查、歌曲載入清暫態；其他工作台／音檔保持。待辦零仍可能總長超限，完整歌曲／起稿驗證及來源核對照常執行；Agent檔案起稿獨立。
- 249 Python／382 JS／四 Skill／29 JS 語法、3新Python／15新JS、69歌曲欄位及29數值跨語言、26 IAB通過。四adapter／四native／實draft3、真17鏡Agent接續／撤回、390px Enter、4秒晚回應及CLI預設不覆寫通過；前版v0.29 ZIP246／367還原，restore-v0.29.0-before-v0.30.0保留起點。
- 產品0.30.0，各protocol／schema及七／十二工具保持，無新operation／依賴／模型／auth／production。非商用／private／ZOE. G保持。指定提交封裝／privatePR／Release／遠端bytes與最新三版SHA／確定PID盤點依收據；正式媒體／完整視覺／Host／FreeTWAI及原生file仍待，rolling active。

## v0.29.0 — 2026-10-04

- 真IAB確認段落只能新增／刪除。新增歌曲段落前移／後移，同名、五原字串及穩定列識別保持；控制在橫向表格外，新增選取並聚焦新列。
- music-arrangement純move／restore、注入controller與DOM分層，最多40段。限定撤回只還原最近順序，保留後續文字／小節／能量；列或順序變更及歌曲載入後舊紀錄失效，busy停用排序／新增。
- 歌曲成果需重建，新的歌曲與分鏡時間起稿同序；既有分鏡／其他panel／音檔保持，舊歌曲起稿預覽拒絕套用。真Agent18鏡檔明確限定接續及撤回，需求載入清暫態。
- 246Python／367JS／四Skill／26JS語法、2新Python／14新JS、78種40段移動／反向恢復、10真Node→Python歌曲／起稿及21IAB；四adapter、四native下載／實draft3、390px Enter、4秒晚回應及預設不覆寫通過。前版v0.28ZIP244／353還原，restore-v0.28.0-before-v0.29.0保留起點；指定commit封裝／privatePR／Release／遠端bytes依收據。
- 產品0.29，各protocol／schema及七／十二tools保持，無新operation／依賴／模型／auth／production。非商用／private／ZOE. G保持。最新三版SHA與確定PID／outputs盤點，合格舊產物才清理；正式媒體／完整視覺／Host／FreeTWAI及原生file仍待，rolling active。

## v0.28.0 — 2026-10-04

- 真IAB重現未選母題先停在泛用錯誤、焦點留建立。新分鏡創作待辦列必填與母題引用，建立先定位第一項，留白與原創作保持。
- storyboard-readiness純模型／注入快照controller／DOM分層，1000鏡／30母題／8MiB、200明細／前20UI，定位前重查、修改後停舊位置、載入清暫態；其他panel／音檔保留，optional理由不改必填，待辦零仍須完整時間／影格／連戲驗證。
- 244Python／353JS／四Skill／25JS語法、3新Python／17新JS、59真Node／Python與27IAB、四adapter／五native下載／真draft3、Agent17鏡102待辦／390px Enter與晚回應保護通過。前版v0.27 ZIP241／336還原，restore-v0.27.0-before-v0.28.0保留起點；精確commit封裝／privatePR／Release／遠端bytes依收據。
- 產品0.28，protocol／schema及七／十二工具保持，無新operation／依賴／模型／production／auth。非商用／private／ZOE. G保持；最新三版與確定PID／outputs盤點，合格舊產物才清理。正式媒體／完整視覺／Host／FreeTWAI及原生file仍待，rolling active。

## v0.27.0 — 2026-10-04

- 真IAB重現60秒宣告新增鏡頭後被改30秒；新增／刪除鏡頭保留宣告，原有有效時間收合與刪除還原保持。
- 新storyboard-duration純proposal／compare／注入controller與DOM分層，重用影格層；完整時間與影格覆蓋才提供候選，明確接續／只撤回總長，不捨入原秒數、不更改創作或音檔。
- 採用前核對同一顯示來源，撤回核對原始時間／列身份／順序／數量／FPS與實際after；後續文字保留，載入新內容清除暫態。處理中停用操作，晚回應保留編修。
- 241Python／336JS／四Skill／24JS語法、2新Python／15新JS、60跨語言與25真IAB、四adapter／五檔native下載／真draft3／390px Enter通過；v0.26 ZIP239／321還原，restore-v0.26.0-before-v0.27.0保留起點，精確commit ZIP／privatePR／Release與遠端bytes依收據。
- 產品0.27；各protocol／schema與七／十二tools、ZOE. G／PolyForm非商用／private保持。沒有依賴／模型／auth／production。每輪盤點確定PID及outputs，最新三版SHA核對，合格舊產物才清理。正式媒體／完整視覺／Host／FreeTWAI／原生file仍待，rolling active。

## v0.26.0 — 2026-10-04

- 真IAB與實際 application 重現同名80 BPM回應可覆蓋120 BPM需求，以及有前後空白的歌名被拒絕；Python歌曲標題改用清理後brief，原檔／表單保留。
- 新planning-source純需求／主要JSON核對與planning-review checkedResult／checkedBrief分層，建立及Agent需求回讀共用。歌曲段落／原歌詞／清單／提醒及分鏡所有鏡頭／母題／影格／連戲核對，單份JSON8MiB嚴格解碼。
- 物件鍵順序可不同，原始型別／陣列順序保持；Python文字／數字空白分開，numeric bool／null不猜預設，數字母題與__proto__保持資料。歌曲時間先查毫秒精度再查半毫秒界，拒絕0.0004秒偏移。CSV／Markdown未在瀏覽器逐字重建，本輪九個真實檔案全文與四adapter核對。
- 新核對提示在編修後明示上一份需求，停用舊成果下載；晚成功／500保護、原生音檔、預覽／明確限定載入／撤回及草稿保持。產品0.26，各protocol／schema與七／十二tools不變。
- 239Python／321JS／四Skill／23JS語法、5新Python／16新JS、60組跨語言、28真IAB／九個下載與draft3／390px Enter通過。v0.25 ZIP234／305還原，restore-v0.25.0-before-v0.26.0保留起點；精確commit封裝、privatePR／Release及遠端bytes以manifest收據核對。
- 不新增依賴、模型、auth或production變更。非商用／ZOE. G／private保持；完整視覺／正式媒體／指定AgentHost／FreeTWAI與原生file:離線仍未驗，滾動目標active。每輪只盤點自有PID與outputs、保留最新三版，合格舊產物才清理。

## v0.25.0 — 2026-10-04

- 真IAB重現未完成表格只有泛用數字錯誤，focus停在建立；新增可定位校時進度／待辦與建立前標示，原句號／欄位保持。
- lyrics_review.py純diagnostics與sharedJS／reply核對／注入controller／DOM分層；暫排序與最遠end跨句檢查、不改source／空白／文字／音檔。局部timed_rows不是全表通過，空表明示no_cues。
- 新唯讀lyrics_review schema1／四adapter，七基本與啟庫十二tools、無路徑權限。CLI0／2／1區分無問題、待修正報告已保存與request／I/O失敗；完整lyrics另驗證，所有diagnostics needs_review=true。
- 10000列全計數、report前200／DOM前20與截斷，變更後舊report過期／停定位與下載。產品0.25、其他protocol／schema保持，真草稿保存空白及後續編修，不存報告暫態。
- 234Python／305JS／四Skill／22JS語法、13新Python／16新JS、50組跨語言與21真IAB、四adapter／真下載／晚成功／500／schema999／390px與Enter通過。v0.24 ZIP221／289還原，restore-v0.24.0-before-v0.25.0保留起點；指定commit封裝／privatePR／Release與遠端bytes依manifest收據確認。
- 非商用／private／ZOE. G與來源保持；無新依賴、模型或auth。file:既有政策阻擋未繞過，本輪獨立頁未變更；原生離線播放／正式媒體／完整視覺／AgentHost／平台創始人核實仍待，滾動目標active。

## v0.24.0 — 2026-10-03

- 真IAB重現已有10秒歌詞包選4秒WAV後被metadata覆寫；修正為兩時長分開顯示，明確採用／撤回只改宣告，原本空白且未編修才接續首次有效時長。
- 共用lyrics-media純compare／mediaTime與注入controller；原native來源、修訂與actual after核對，換來源或後續時長編修拒絕不安全撤回，後續歌詞文字保持。
- 獨立HTML嵌入同模組，Apply只取明確欄位或沿用來源、不直接用player.duration；較短總長不裁切cue，review_notes歷史保持。媒體與undo不進draft3／Agent。
- 初次nativeUI發現defer模組遺漏，修正實際script與HTTP順序回歸後全新tab20項驗證。221Python／289JS／四Skill／21JS語法與diff通過；真正四adapter與實檔、current500／晚成功／晚500、草稿回讀、390px／Enter通過。
- v0.23 ZIP217／263還原通過；restore-v0.23.0-before-v0.24.0保留起點，指定提交封裝／privatePR／Release與遠端下載以manifest收據確認。產品0.24、protocol／schema／六與十一工具保持。
- file:離線原生驗證被browser工具安全政策拒絕，只有source受控VM，本輪離線播放／下載與完整視覺未驗證；無繞過／新依賴。非商用／署名／private與使用者來源保持，滾動目標active。

## v0.23.0 — 2026-10-03

- 重現1 ms內秒數容差跨半幀而接受重疊、空缺、尾端不符；完成分鏡在輸出前核對由0到總長的精確排他影格覆蓋，不改原秒數或FPS。
- 純Python／JS影格映射與完成報告驗證分層，共用seed；保留最近整數／半幀取偶數，JS拒絕先前半幀容差內的另一個整數。
- frame_timeline獨立schema1與discovery descriptor；摘要、每鏡範圍與提示稿增加幀數。舊有效報告明示未宣告，現代缺失／未知schema／矛盾資料拒絕且保留上一份成果。
- 真下載重現草稿tool_version仍為0.21.0，修正為0.23.0並核對實際captureDraft與application版本，draft3與舊有效草稿保持。
- 217Python／263JS、四Skill／20JS語法及diff、20項IAB／四入口／實檔／390px與Enter通過；17新Python／16新JS。v0.22 ZIP還原200／247通過，指定提交封裝／private PR／Release與遠端下載由manifest及收據確認。
- restore-v0.22.0-before-v0.23.0保留起點。Agent／MCP／各既有schema與六／十一工具不變；非商用、署名、private及使用者來源保持。影格覆蓋不代表實際媒體／視覺驗收，目標active。

## v0.22.0 — 2026-10-03

- 交付檢查新增獨立LUFS整合響度。純loudness.py負責K-weighting、400ms／100ms nearest-sample幀與−70 LUFS／−10 LU gate；loudness_blocks.py有界64KiB後轉暫存，成功／失敗均關閉。audio.py在同一音檔副本的一次PCM掃描整合，無FFmpeg執行或新依賴。
- mono／stereo、8000–192000Hz、至少400ms；反相聲道能量相加。短檔／門檻下／未知layout／範圍外rate為null及明確status，不改PCM技術接受／警告／退出碼。
- report與discovery新增獨立audio_loudness schema1，產品0.22.0；既有protocol／草稿／保存schema與六／十一工具保持。純JS核對未知版本、數值、來源幀／時長／聲道權重／區塊／尾幀／門檻，舊無量測報告明示未提供。DOM分開RMS／peak／LUFS，保持late File／profile保護與keyboard。
- 200Python／247JS、四Skill／19JS語法及diff通過；18新Python／10新JS，舊HTTP retention版本斷言改比對實際產品。四adapter一致、ledger溢存／close、來源替換／gate／邊界／奇數rate測試通過。
- 20組合成WAV與既有FFmpeg7.1校對最大0.009464 LU（容差0.02）；26真報告JS模型，30秒stereo實際5.607秒。24項IAB含不可測、反相、四秒晚成功／500、schema999、有效復原、實檔JSON／MD、390px與Enter。有限校對不宣稱完整ITU／EBU認證或正式實聽。
- 前版v0.21 ZIP182／237還原通過，restore-v0.21.0-before-v0.22.0保留起點。指定提交封裝／private PR／Release與遠端bytes以manifest／收據確認；授權／署名／private與使用者素材保持。

## v0.21.0 — 2026-10-03

- 真瀏覽器重現重新整理直接丟失歌名編修。新增上方另存狀態及有未另存草稿時才註冊的 beforeunload；原生點擊後實際觸發提醒／closed(false)，編修保留。沒有互動時 IAB 省略提醒並重新整理，明確列為瀏覽器限制。
- draft-retention.js 純 checkpoint 與注入事件 controller 分層，共用既有 panel fingerprint；比較原始範例與各來源最近一次確認的完整內容。逐字編修只 capturePanel，離頁重查全草稿；時間戳、頁面、收合、媒體及成果不進狀態或持久 schema。
- 保存 callback 提供隔離的按下當時 draft，不冒用晚到期間的編修。未知保存、放棄、送出下載不能解除提醒；下載須明確確認本機檔。已驗證現代草稿／保存版本在明確載入後記錄，legacy 轉換仍需另存。
- 範例啟動回應晚到保留既有編修；三種草稿／成果表單改同源 hidden iframe，下載不導離編修頁。狀態可換行、色彩與文字共同提示，確認按鈕可 Enter 操作。
- 182 Python／237 JS、四 Skill／19 JS 語法與 diff 通過；兩新 Python／17 新 JS，舊 seed fixture 注入實際 retention controller，原來成果 dirty 規則保持。29 項 IAB 包含真 Agent 保存／讀取／載入、四秒成功／500、原生下載／讀回／確認、撤回、四工作台、PCM 與 390px。
- 前版 v0.20 ZIP 還原 180／220 通過；restore-v0.20.0-before-v0.21.0 保留 main 起點。產品0.21.0，所有 protocol／領域 schema 與六／十一工具保持；無新依賴或模型、授權／署名／private 保持。

## v0.20.0 — 2026-10-03

- 重現需求無效UTF-8被File.text替換「�」後仍接受，以及Agent／CLI／草稿重複版本或title被默默採用最後一個值。改為嚴格UTF-8與重複JSON欄位拒絕，原檔與工作台保持。
- 新增純json_document.py與原生json-document.js。統一重複鍵、跳脫同名、非有限數字、Unicode、bytes與64層；Python iterator traversal額外記憶體只隨深度增加，沒有第三方依賴。
- 外部CLI／HTTP／JSON-lines／MCP、草稿庫／備份、歌詞包共用Python decoder；需求／分鏡起稿／草稿選檔改原生arrayBuffer、核對File.size，保留讀取前snapshot／latest／晚回應與明確預覽。工作台與離線歌詞共用同一JS模組，discovery提供JSON讀取限制。
- 180Python／220JS、四Skill／十八JS語法及diff；12新Python／14新JS測試包含跨語言語料、原生File、真CLI另一cwd／BOM／覆寫拒絕、真HTTP與stdio壞後好。31項IAB含真正Agent／MCP／CLI產物、音檔保持、損壞資料拒絕、4秒成功／500、下載／讀回與390px／Enter。
- 前版v0.19 ZIP安全還原168／206；restore-v0.19.0-before-v0.20.0保留main起點。產品0.20.0，Agent1／MCP2025-11-25／draft3／兩seed1／lyrics_package1／library1／backup1及六／十一工具保持。ZOE. G／非商用／private保持。

## v0.19.0 — 2026-10-03

- 修正完整歌詞 JSON 回讀丟失名稱、總長及推估來源；兩秒歌詞後的十秒音樂尾奏保持，未知包版本不再被抽取 cues 後默默接受。
- 新增純 Python lyrics_package 與共用原生 lyrics-package.js；schema 1、嚴格 UTF-8／重複欄位／有限數字／毫秒／來源一致性／2 MiB。application 與 CLI／HTTP／JSON-lines／MCP 使用同一檢查；完整包、一般字幕與 cues 互斥。
- 工作台及離線預覽共享明確編修提案，保留未改動的推估／校時來源，音檔更新總長後仍提示曾補齊的結束；編修加待核對說明。舊完整包須明確轉換，時長衝突拒絕，估計值不寫入時長欄。
- 168 Python／206 JavaScript、四 Skill／十七 JS 語法及 diff；26 項 IAB 操作、真正四 adapter、實檔 JSON／草稿回讀、4秒晚成功／500、390px DOM／Enter。測試的備份競爭斷言僅排除暫態 .write-lock bytes，版本與完整資料核對保持，生產鎖未修改。
- 前版 v0.18 精確 ZIP 安全還原156／189；restore-v0.18.0-before-v0.19.0保留main起點。產品0.19.0／歌詞包1獨立，Agent1／MCP2025-11-25／draft3／兩seed1／library1／backup1與六／十一工具保持。沒有新依賴或host安裝，ZOE. G／非商用／private保持。

## v0.18.0 — 2026-10-03

- 修正歌詞檔慢讀取完成後覆蓋手動原文；帶時間歌詞不再一按讀取就替換表格。TXT／LRC／SRT／JSON統一先檢查／預覽，再明確套用／取消與限定撤回。
- 新增純前端lyrics-import層，原生arrayBuffer與嚴格UTF-8解碼、BOM／大小檢查、目標snapshot／最新序列、回應與JSON成果一致性；原文、時長、音檔及其他工作台保護。取代舊File.text adapter；HTTP只新增靜態模組，既有application與四adapter共用。
- TXT接既有lyrics_seed1，原文／重複句／空白保留、時間留白，草稿仍schema3／.json。SRT多行與LRC推測結束告知，預覽前六句但套用不截短。
- 156 Python／189 JavaScript、四Skill／十六JS語法通過；26新增JS覆蓋舊五項adapter測試並擴充實際DOM handler／慢讀取／晚成功錯誤／最新檔／取消／clone／回應矛盾／限定undo。真正CLI／JSON-lines／MCP產物、IAB選檔／三格式下載／草稿及手機DOM驗證見QA。
- 前版v0.17 ZIP安全還原156／168通過；restore-v0.17.0-before-v0.18.0保留main起點。產品0.18.0，Agent1／MCP2025-11-25／draft3／lyrics seed1／storyboard seed1／library1／backup1保持，六／十一工具，無新依賴或host安裝。ZOE. G、非商用授權與private保持。

## v0.17.0 — 2026-10-03

- 新增未校時歌詞起稿／JSON檢查：共用Python domain與application、CLI／HTTP／JSON-lines／MCP；原文、重複句、前後空白及來源行號保留，不猜測時間。獨立lyrics seed schema1，未知／矛盾資料拒絕。
- 新增純lyrics-seed preview／proposal：來源與目標核對、晚成功／錯誤保護、取消／明確限定套用及撤回；音檔、時長與其他工作台保留，草稿仍schema3。
- 修正空白句子不能記下播放位置：分別記下開始／結束、保留句長的整句移動及超音檔拒絕；已校時句子可播放顯示，未完成時間禁止匯出。
- 156 Python／168 JavaScript、四Skill／十五JS語法；真正CLI／HTTP／JSON-lines／MCP、IAB預覽／guard／校時／三格式實檔／草稿往返／390px DOM與Enter焦點。前版ZIP安全還原146／146通過。
- 產品0.17.0，Agent1／MCP2025-11-25／draft3／storyboard seed1／library1／backup1保持，六／十一工具。ZOE. G、非商用授權與private保持；restore-v0.16.0-before-v0.17.0提供還原點。

## v0.16.0 — 2026-10-03

- 重現並修正需求／保存版本預覽後覆蓋編修；新格式草稿由選檔即載入改為明確預覽／載入／取消，舊版維持明確轉換。
- replacement-preview純模組共用scope／全panels內容指紋、原生File身份及最新任務／payload複製。需求只核對目標，完整草稿／保存版另核對音檔選擇；晚成功／錯誤及proposal都保護目前編修。
- brief及library transport可注入同一preview；app只管理DOM、明確操作及既有undo，沒有新後端寫入能力／依賴／Host設定。草稿加入BOM／副檔名／1 byte–1 MiB界限及讀取狀態，正常預覽使用中性色與有界文字區。
- 146 Python／146 JavaScript、四Skill／十三JS語法通過；真實Agent保存、HTTP assets、瀏覽器載入／撤回／音檔／延遲／錯誤及封裝見QA／HANDOFF。前版ZIP146／121通過。
- 產品0.16.0；Agent1／seed1／MCP2025-11-25／draft3／library1／backup1保留。ZOE. G、PolyForm Noncommercial 1.0.0與private保持；restore-v0.15.0-before-v0.16.0提供還原點。

## v0.15.0 — 2026-10-03

- 補齊Agent／CLI的storyboard-seed.json回讀入口；先檢查／預覽／取消，再明確套用至分鏡。匯入與目前歌曲分開，套用保留其他工作台、音檔與目前歌曲，新鏡頭仍需人工創作。
- 共用timing_slots與validate_seed；完整schema1形狀、固定BPM來源毫秒／影格／小節／任務一致，未知版本與延伸欄位拒絕，不靜默丟失已加的畫面或修正時間。CLI --seed與--brief互斥，匯入不接受FPS／每鏡小節覆蓋。
- 原storyboard_seed operation新增互斥seed payload，HTTP／JSON-lines／MCP共用，discovery公布完整schema；預設五／啟庫十工具保持。
- 純前端file read／request／proposal共享latest token，匯入核對目標分鏡與檔案語義相等；共用run可指定revision scope，歌曲編修不使外部起稿失效。已檢查檔案成果標為inputIndependent，切換頁面保持；生成型成果仍須輸入修改後重新驗證。
- 146 Python／121 JavaScript／四Skill／十二JS語法與diff、真正CLI／HTTP／JSON-lines／MCP、實際起稿讀回／檔案下載／未覆蓋編修／取消與錯誤、前版ZIP136／109通過，詳見docs/QA-v0.15.0.md。
- 產品0.15.0；seed1／Agent1／MCP2025-11-25／draft3／library1／backup1保留。private／ZOE. G／PolyForm Noncommercial1.0.0保持；沒有模型、依賴、host或其他使用者專案參考。restore-v0.14.0-before-v0.15.0及封裝／private PR／Release見HANDOFF／manifest。

## v0.14.0 — 2026-10-03

- 新增 `storyboard_seed` 共用領域與應用入口：驗證現代歌曲需求，按整小節與段落邊界分鏡；最多 1000 鏡，不足一影格拒絕。獨立起稿 schema 1／兩份中間檔，固定速度估算與創作未完成清楚標示，不捏造畫面。
- CLI `storyboard-seed`、HTTP `/api/storyboard-seed`、JSON-lines／MCP `storyboard_seed` 共用結果與 discovery schema；預設五工具／啟庫十工具，四個專案保留。
- 純前端模型驗版本／來源／時間／影格／小節與成果一致；preview token、來源／目標／設定快照保護晚回應與套用。明確套用只替換分鏡標題／時長／FPS／鏡頭，其他資料與音檔保留，創作欄位留空。
- 修正需求、完整草稿與保存版本「撤回載入」覆蓋後續編修；純 undo 快照核對目標 panel／全部 panels，衝突保留內容與撤回紀錄。不把 transient tab／timestamp 當內容改動。
- 136 Python／109 JavaScript／四 Skill／十二 JS 語法及 diff；實際瀏覽器起稿／取消／錯誤／過期回應／撤回保護／下載／草稿往返／校時音檔保留／390px DOM／鍵盤通過。前版 v0.13 ZIP 124／93通過，細節見 docs/QA-v0.14.0.md。
- 產品 0.14.0；Agent1／MCP2025-11-25／draft3／library1／backup1保留。PolyForm Noncommercial1.0.0／ZOE. G／Codex、private／未投稿保持；沒有新依賴、模型、host、秘密或其他使用者專案參考。restore-v0.13.0-before-v0.14.0與本輪交接見HANDOFF／manifest。

## v0.13.0 — 2026-10-03

- 歌曲與分鏡透過純 planning-review 接收當前回應，編修後晚成功不替換；共用 run 捨棄過期錯誤並恢復控制。目前錯誤仍顯示，修正後可再建立。
- 摘要明確呈現設計資料與上一份狀態；歌曲總小節、BPM／拍數、記憶點與可收合能量／任務，分鏡逐鏡提醒／母題位置，沒有媒體生成宣稱。自由文字用 textContent。
- 修正 1280×720 sticky 成果面板高於畫面、下載按鈕在畫面外；桌面高度限制與局部捲動，Tab／PageDown 可操作，窄螢幕保持 static 流。
- 產品 0.13.0；Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 保持，沒有領域、輸出 schema、工具、模型、依賴或 host 新增。PolyForm Noncommercial 1.0.0 與 ZOE. G／Codex 紀錄保留。
- 124 Python／93 JavaScript／四 Skill／十 JS 語法與 diff、真正 CLI／三 transport、IAB 兩個工作台延遲成功／錯誤、目前錯誤保留／修正、提醒／文字安全、實檔下載、短高度滑鼠／鍵盤及390px DOM通過；v0.12 ZIP 解壓124／80通過。詳見 docs/QA-v0.13.0.md。
- restore-v0.12.0-before-v0.13.0、指定提交封裝／private PR／Release 見 HANDOFF／manifest；前輪交接存 docs/HANDOFF-v0.12.0.md。完整視覺／實唱實聽／特定 host／平台創始人未驗證。

## v0.12.0 — 2026-10-03

- 開檔一次的自有音檔副本，SHA-256 與量測使用同份 bytes；新增 source_evidence，所有出口關閉暫存。不代表外部改檔原子快照。
- 拒絕不一致 PCM fmt／截斷標頭，多聲道不解讀位置並列提醒。Markdown 補接受條件／副本範圍。
- 純 audio-review 模型與非同步選擇保護，晚到成功／錯誤不覆蓋；上一份報告與停用下載清楚呈現。補來源、逐項條件、尾安靜段／DC／−∞及不可測。
- 產品 0.12.0；Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 保持。沒有新依賴／工具／模型／host；署名及 PolyForm Noncommercial 1.0.0 保留。
- 124 Python／80 JavaScript／四 Skill／九 JS 語法與 diff、真正 CLI／三 transport、IAB 正常／錯誤／晚回應／實檔下載／桌面與390px DOM／鍵盤通過；v0.11 ZIP 解壓112／69通過。詳見 docs/QA-v0.12.0.md。
- restore-v0.11.0-before-v0.12.0、指定提交封裝與 private PR／Release 見 HANDOFF／manifest；前輪交接存 docs/HANDOFF-v0.11.0.md。完整視覺／實聽／特定 host／平台創始人未驗證。

## v0.11.0 — 2026-10-03

- 加入整批歌詞校時的預覽／明確套用／一次撤回；只改 start／end，音檔、後續文字與刪除歷史保留。其他時間改動／增刪句子阻止整份撤回；過期候選／晚回應不寫入。
- 共用 application 的 shift_seconds／time_changes／text_changes，CLI 不另編修。sorted original 1-based index、先 shift 再 set（保留明確句長）／text，再推缺失結束／完整驗證；非法結果不截斷，原來源與指定總長保留。
- 分離 Python lyric_timing、原生 lyric-time.js、離線 lyric_preview 及前端 lyrics-timing controller。half-away-from-zero 至毫秒；修正負的不足半毫秒被接受／跨語言捨入不一致、離線提示／timing 過期與結果排序後句子 ID 錯配。模板標記只替換一次，輸入標記文字保持原樣。
- Agent discovery 同源新增欄位；非零校時／非空編修標 needs_review。產品 0.11.0，預設四工具／啟庫九工具、Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 不變，暫態控制／撤回不進草稿。
- 112 Python／69 JavaScript／四 Skill／八 JS 語法／diff、實際 transport／CLI、IAB 工作台與獨立實檔下載、桌面／390px DOM 檢查通過；v0.10 ZIP 摘要核對／原版 99／55 通過。詳見 docs/QA-v0.11.0.md。
- PolyForm Noncommercial 1.0.0／LICENSE／NOTICE 保留，沒有依賴／host／模型新增。restore-v0.10.0-before-v0.11.0、指定提交封裝與 private PR／Release 見 HANDOFF.md／manifest。




## v0.10.0 — 2026-10-03

- 加入整庫／明確選 ID 的可攜 ZIP 備份、整份檢查／衝突預覽／恢復。保留原 ID、metadata、名稱、時間與草稿原始 bytes，只新增／重用完整相同版本，既有版本不覆寫。
- 分離 library_contract、draft_backup、CLI backup_files、HTTP backup_downloads 及前端 backup-transfer；HTTP／CLI／Agent 共用 application 與純驗證／保存層。backup schema 1／library 1／draft 3 分別管理，未知版拒絕。
- 限制 ZIP 32 MiB／展開 64 MiB／1000 版，核對中央目錄、檔名、型態、索引、大小與 SHA；不 extractall，整份有錯不略過。恢復前、鎖內重查衝突／容量；磁碟故障可能留下完整部分版本，同一 ZIP 重試補完，不宣稱多目錄交易。
- 工作台加入下載、選 ZIP、唯讀預覽與明確恢復；保留未保存編修、音檔及刪除紀錄。回應未知時保持同一 File／SHA 重試；已知失敗要求重選。Agent 啟動明確 --draft-backup，JSON 不能改來源路徑；明確啟庫共九工具，預設仍四工具。
- 修正可重現的損壞 DEFLATE 未處理例外，HTTP 回 400 且工作台保留。下載先驗證再原生 attachment，錯誤不導離主頁。最多兩份／60 秒的下載暫存，取完即清除自有檔與空目錄，不依賴終端強制停止時的 finally。
- 99 Python／55 JavaScript／四 Skill／六 JS 語法與實際瀏覽器備份、已提交後 500 再試、衝突／毀損保留、重啟、原始 bytes 往返、桌面／390px DOM 檢查通過。v0.9 ZIP 核對／解壓原版 77／47 通過。詳細見 docs/QA-v0.10.0.md。
- 產品 0.10.0，Agent 1／MCP 2025-11-25／草稿 3 不變。PolyForm Noncommercial 1.0.0／LICENSE／NOTICE 保留；無新依賴／host 安裝／模型呼叫。分支 codex/iteration-v0.10.0，還原點 restore-v0.9.0-before-v0.10.0，指定提交封裝與 private PR／Release 見 HANDOFF.md／manifest。


## v0.9.0 — 2026-10-03

- 新增明確啟用的本機草稿庫，選定目錄後 HTTP／CLI／JSON-lines／MCP 共用 application 與不可覆寫版本保存；預設接口仍無草稿寫入。分頁與摘要核對、1 MiB／1000 版上限、失敗 staged 檔清理及程序間短時鎖獨立於領域計算。
- 草稿 v3 結構改由 contracts/draft-v3.json 共用，Python／瀏覽器／Agent schema 同源，允許未完成的原始字串；保存紀錄 schema 1 另行管理，未知版本拒絕。
- 加入命名保存、保存版本清單、預覽／下載／明確載入／撤回；保存或預覽不重設音檔。未知保存結果保留點擊時的 ID／內容重試，晚編修保留並提示未保存，放棄重試不刪除磁碟版本。
- 修正 Windows 目錄別名使同 ID 並行保存遭誤拒絕；改比對實際檔案系統身分。程序間鎖使容量檢查與發布在同一界線，四程序競爭一版容量的測試通過。
- 草稿 CLI 明確輸出 UTF-8 JSON，避免終端編碼無法表示原創名稱／表情符號時，檔案已保存但回應失敗；以強制 ASCII 終端的實際子程序驗證。
- 77 Python／47 JavaScript、真實三種 transport／CLI、瀏覽器回應失敗重試、重啟、Agent 保存／23 版分頁、實檔下載與毀損保留測試；v0.8 封裝核對／解壓 62／38 通過。詳細 QA、四 Skill 與封裝結果見 docs/QA-v0.9.0.md／manifest。
- 產品 0.9.0，Agent 1／MCP 2025-11-25／草稿 3 不變；授權保持 PolyForm Noncommercial 1.0.0，沒有依賴或 host 安裝。還原點 restore-v0.8.0-before-v0.9.0，交接及 private PR／Release 見 HANDOFF.md。

## v0.8.0 — 2026-10-03

- 加入獨立 deletion-history 層與集合 adapter，六種列可選擇刪除紀錄還原，每工作台最多 20 筆；穩定頁內 ID、插入錨點、原始字串及分鏡自動時間副作用分開，不覆蓋後續其他編修／音檔。
- 母題 ID 在可還原期間保留；容量拒絕不丟紀錄，可刪除另一列後選原紀錄。刪除／還原重新編號及定位，未完成歌曲／歌詞可新增並保存原始空白。
- 修正歌詞匯入／驗證晚回應覆蓋後續表格編修；revision 在替換前檢查，其他工作台修改不受影響。
- 62 Python／38 JavaScript／四 Skill、實際下載回讀、音檔保留、滿容量／20 筆上限、延遲回應及窄螢幕 DOM 驗證通過。前版 v0.7 解壓 62／24 通過。
- 產品 0.8.0，Agent 1／MCP 2025-11-25／草稿 3 不變；授權保持 PolyForm Noncommercial 1.0.0，沒有新依賴／host 安裝／模型呼叫。
- 還原點 restore-v0.7.0-before-v0.8.0；指定提交封裝、private PR／Release，見 HANDOFF.md、docs/QA-v0.8.0.md。

## v0.7.0 — 2026-10-03

- 四工具完整的輸入／成功成果 schema 移至獨立 tool_contracts 層，MCP 與共用 capabilities 使用相同契約，明確描述現代／舊版條件、創作語言、需求清單與母題欄位。
- 修正歌詞同時傳 cues 與 content／suffix 時原文被忽略；改成明確拒絕，保留單一來源的流程。
- 修正音訊接受條件把 true 當 1、接受非整數及錯誤型態進入開檔的問題；開檔前驗證，JSON 整數值 1.0 正規化為 1。
- MCP 非物件 arguments 回協定錯誤；領域／payload 錯誤保留可重試工具結果。後續呼叫仍正常。
- 清單錯誤在項目旁顯示，定位焦點與讀屏關聯；空交付清單定位新增按鈕，修正／回讀／撤回後清除舊標示。
- 62 Python／24 JavaScript／四 Skill、八 schema meta-schema／七次 stdio 四工具核對、實際下載／窄螢幕／前版解壓還原通過。沒有新依賴／特定 host 安裝／模型呼叫；授權保留。
- 還原點 restore-v0.6.0-before-v0.7.0，指定提交封裝、private PR／Release；詳見 HANDOFF.md、docs/QA-v0.7.0.md。

## v0.6.0 — 2026-10-03

- 歌曲語言、避免事項與交付項目改成可編修清單；多行項目完整保存。草稿 schema 升為 3，v1／v2 需先看摘要、明確轉換，可撤回，原檔保留。
- 工作台回讀 Agent／CLI 的設計 brief：指定歌曲或分鏡、共用應用層檢查、完整預覽／創作待審查提醒、明確載入，只替換選定工作台；限定撤回保留其他工作台後續編修與已選音檔。
- 新增 planning-import.js 純轉換／讀取控制層；未知欄位、不可保存的畫幅／清單拒絕，過期讀取或驗證結果不改預覽。業務檢查仍由 application.build 執行。
- 修正 SRT 明確結束時間被提示為尾句估計；新增 timing 來源 metadata，duration_estimated 仍表示總時長未提供，Agent／MCP 協定不變。
- 封裝發現所有 test_*.js 並檢查新 JS 模組；新增跨 Python／生產 JS 往返、v3／舊版轉換、讀取競態與需求保存測試。
- v0.5 封裝核對 SHA-256、解壓通過原版 53 Python／13 JavaScript。LICENSE／NOTICE 不變，沒有新增 runtime 依賴或參考其他個人專案。

## v0.5.0 — 2026-10-03

- 修正歌詞檔非同步覆蓋：最後一次選檔才提交原文／格式，過期結果及錯誤忽略；手動修改／草稿回讀／離開頁面取消待完成讀取。限制 2 MiB 與 LRC／SRT／JSON。
- 修正失敗選檔使有效成果失效的 input 事件冒泡；只有成功讀入新內容才標記須重建。
- 分鏡加入逐鏡收合、時間／段落／母題摘要與固定定位列，預設只展開第一鏡；編修資料完整保留，缺時間／母題自動展開定位。顯示控制不影響成果有效性。
- 新增無依賴啟動設定產生器，輸出當前 Python 與本版入口的 JSON／Codex TOML；不同目錄的實際 MCP 子程序測試及 Codex 設定解析通過，未安裝或宣稱實際 Agent host 接入。
- 保留產品／Agent／MCP／草稿版本分層，本輪僅產品升為 0.5.0；前輪交接另存，v0.4 封裝核對摘要並還原通過原版 52 Python／8 JavaScript 測試。
- 授權維持 PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 不變；沒有新增依賴或使用其他個人作品。

## v0.4.0 — 2026-10-03

- 分鏡介面支援最多 30 個母題與逐鏡選擇；穩定 ID 避免改名破壞對應，仍被鏡頭使用時拒絕刪除。
- 草稿 schema 升為 v2。v1 經格式檢查後展示轉換摘要，按明確按鈕才轉換／載入；未知版本拒絕，原檔保留，最近一次載入可撤回。
- 修正時間空白時無法刪除問題鏡頭；只在剩餘鏡頭時間有效時重新接續。
- 加入無依賴 MCP stdio adapter，明確支援 2025-11-25、四個工具、文字／結構化成果及兩類錯誤。保留 Agent JSON-lines v1，全部共用 application 層。
- 修正過深 JSON 導致 HTTP 連線被關閉；回傳 400，正常下一次請求仍可使用。
- 封裝增加 MCP 檔案及包內握手／版本一致性驗證；保留 v0.3 交接及還原點。
- 授權仍為 PolyForm Noncommercial 1.0.0；沒有新增依賴、讀取其他作品或對外部署。

## v0.3.0 — 2026-10-01

- HTTP、CLI 與 Agent 共用 application 層；保留 v0.1／v0.2 需求相容。
- 加入 Agent JSON-lines v1：四種 operation、能力查詢、id、結構化錯誤；明確選定音檔，不自動寫檔。
- 修正刪除／修改歌詞後播放預覽使用舊資料，以及舊音檔解碼覆寫最新波形的競態。
- 加入專案草稿 v1 的實際下載、回讀與表單撤回。未知／錯誤版本不替換目前內容；回讀後需重新建立成果。
- 草稿操作列、授權條文與來源通知可由介面查看。
- 依使用者最新選擇加入 PolyForm Noncommercial 1.0.0，取代先前提出的 AGPL；未改寫 v0.2.0 tag。
- 加入指定 commit 封裝、ZIP 完整性／SHA-256 與解壓後驗證腳本；分支與還原方式見 docs/ARCHITECTURE.md。

## v0.2.0 — 2026-10-01

第一版四工作台、原創 Skill、35 項 Python 測試與 private GitHub 上傳。Release tag 保留首次發起與 AI 協作紀錄；未附開源授權、未送出自由工坊投稿。


### v0.36 封裝驗證修復

完整Python套件含Git／Windows實體fixture，舊60秒deadline於指定commit封裝實跑不足。只將封裝Python套件deadline明確設為120秒，其他command保留60秒；caller bounded wait仍最多60秒。失敗artifact保留，新commit另建不可覆寫封裝；暫存解壓位置先驗證系統temp parent。
