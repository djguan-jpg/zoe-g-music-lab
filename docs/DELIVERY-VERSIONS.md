# 固定交付版本契約 v1

search-input 純三欄鍵盤 metadata → 三個原 DOM adapter → 既有搜尋 controller。isComposing 或 legacy keyCode229 不 preventDefault、不讀來源／清單或呼叫搜尋；只有有效普通 Enter 才執行原動作。純層無 DOM／事件副作用、timer、網路或持久狀態；固定一 JS asset。控制器、app、application／CLI／Agent／MCP、領域 schemas 與 23 operation input/output schemas不變。產品95／唯一policy38–95共58／unknown96拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。見[契約](SEARCH-INPUT.md)。

v0.94 命中前後文：共享 search-excerpt 純來源／UTF-8 span與query核對，重用既有 delivery-context 的每側64byte邊界模型；2000codepoints原欄位、query≤1024bytes，顯示每側48／命中96codepoints，控制符visible token不能被截斷。shared literal search-excerpt-dom建立span／mark，再由兩個原DOM adapter接到現有current controller；先准备全批view再改DOM。無innerHTML／source寫入／網路／timer，新server僅兩固定JS assets。原prefix caption helper相容保持，live結果使用新view；完整files/data/meta與兩種search1／23舊operation schemas不變。產品94／policy38–94共57／unknown95拒絕，16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。見[契約](SEARCH-EXCERPT.md)。

v0.93 歌詞／分鏡搜尋取消：共用 search-request 純請求 ownership／注入 AbortController factory → 各搜尋 controller generation/source/ID/results current → app 明確傳遞 signal → native fetch；固定 DOM 顯示取消並在仍持有焦點時返回查詢欄。失效先於 abort，旧 finally 不能釋放新 job；顯式取消保留上一批、分頁歷史、原文與成果，換查詢／來源／換台沿原 reset 清除舊定位。idle cancel 不 capture／render／建立 job；pagehide listener 屬於 document。讀取本機 SHA 可晚 settle、後端可完成；搜尋 ownership 立即失效，可明確重試，與共用 operation-gate 等待 local settle 的契約分開。只新增一固定 JS asset，無新 operation／schema／取消 endpoint／路徑／模型／依賴。16基本／23啟庫、Agent1／draft3／23既有 input/output schemas／legal4／private／FreeTWAI not_submitted保持。產品93／交付38–93共56／unknown94拒絕。見[契約](SEARCH-CANCEL.md)。

v0.92 分鏡原文搜尋：pure storyboard_search／原生storyboard-search→application四adapter→注入source/ID/query/generation/results current controller→literal DOM／原欄focus。新獨立search1，只讀八敘事欄位；16基本／23啟庫需重新discovery，Agent1／draft3／既有22 schemas保持。產品92／交付38–92／unknown93，見[契約](STORYBOARD-SEARCH.md)。

v0.91 處理列：operation-presentation純有界known scope/action metadata與gate view一致性→operation-control-dom begin隔離原動作、refresh只取gate與literal DOM→app.run開始前擷取發起button.textContent。main上方單一sticky取消入口；idle清title/note/context，無timer/scroll/source讀寫。既有operation-gate/native signal/source-current/finally與focus保持，server只serve一固定JS；15/22、Agent1/draft3/domain/wire/legal4/private/not_submitted保持。產品91/supported38–91共54/unknown92拒絕。見[契約](OPERATION-PRESENTATION.md)。

v0.90 取消等待：pure operation-gate 注入 AbortController factory，以 job identity/current/cancelled/finish 管理同一共用任務；失效先於 abort，非中斷階段未settle前不釋放。app.run/current.signal → 明確各request callback → api native signal；不讀全域隱含signal。固定 operation-control DOM adapter 只顯示可取消/cancelling並在仍持有cancel焦點時返回可用發起按鈕，後續focus保留。原source/revision/dirty保持，取消不新增synthetic revision或覆蓋編修/歷史/媒體/上一份成果。server只serve兩固定JS；後端可完成，不新增取消endpoint、Agent權限或依賴；15/22、Agent1/draft3保持。獨立控制生命週期保持。見[契約](OPERATION-CANCEL.md)。 產品90/supported38–90共53，unknown91拒絕，legal4/private/not_submitted保持。

v0.89 範例載入保護：app refreshExampleControls DOM adapter只讀state.busy/examples與兩固定button；exampleAllowed在load/clear/dirty/render之前拒絕busy或null。初始HTML disabled、startup首/finally與共用run的timingControls沿既有成功/失敗/過期釋放；不新增獨立timer。晚到startup只有idle且retention.atInitial才套用，busy不重寫進度；後續編修保持。明確idle範例仍只替換對應panel及清除其history，不冒充保存/撤回。15/22、Agent1/draft3及domain保持，無新asset/route/operation/schema/依賴/權限。產品89/来源38–89共52/unknown90，legal4/private/not_submitted保持，見[契約](EXAMPLE-AVAILABILITY.md)。

v0.88 共用清單busy：collections固定add/remove metadata→app refreshCollectionControls DOM adapter；四新增入口在capture/ID/write/dirty/focus前以既有state.busy拒絕。六add/指定remove/三台還原select與button沿run timingControls/finally切換；不讀來源或重建選單，較早選擇與歷史保持。原欄位編修沿revision/current及dirty保護；纯domain/History/controller保持，無新asset/HTTP/CLI/Agent/MCP operation/schema/權限。15/22、Agent1/draft3保持；產品88/來源38–88共51/unknown89，legal4/private/not_submitted保持。見[契約](COLLECTION-BUSY.md)。

v0.87 刪除鏡頭保留原時間：共用純History.remove/restore保留stable ID與原值→app原生entriesFor/writeEntries→限定markDirty與editor-focus。刪除只取remaining/record，不呼叫compactShotTimes或生成effects；保留既有純工具與歷史格式相容。原缺口/負值/極短秒數交由現有純時間診斷與完整domain驗證；CLI/Agent/MCP/HTTP皆共用application，無新operation/schema/asset/權限。15/22、Agent1/draft3保持；產品87/明確来源38–87共50/unknown88，legal4/private/not_submitted保持。見[契約](STORYBOARD-DELETION.md)。

v0.86 完整原文核對：text-verification.js純原文UTF-8與選定bytes模型（8MiB、本機view1）→text-verification-controller.js注入capture/describe/readFile與latest/current/大小保護→text-verification-dom.js原生File/arrayBuffer/literal status→app state.textVerification與canonical state.files。refresh只取字串/metadata，不編碼全文；明確選檔才有界讀取。三固定靜態JS，沒有POST或CLI/Agent/MCP操作，沒有新增領域schema/路徑/網路/寫檔權限。15/22、Agent1/draft3與既有schema保持；核對不解草稿另存提示，不進保存/備份。產品86/明確來源38–86共49/unknown87，legal4/private/not_submitted保持。見[契約](TEXT-VERIFICATION.md)。

v0.85 原句搜尋：獨立search1，texts原順序/Unicode/重複句、10000列/每句2000codepoints/compact UTF8 array2MiB/query1024bytes/1–50結果。prefix+array SHA只pin文字，start_row>1必須前次SHA。Python/JS純層→application四adapter；browser injected generation/current完整texts+IDs/query/results revision→complete reply data/JSON/MD/meta核對→literal DOM→原生穩定ID文字欄focus。query/results/pager不進draft3，不因播放tick掃整表；時間編修與音檔保持。新增CLI lyrics-search、Agent/MCP lyrics_search、POST /api/lyrics-search及三固定JS資產；基本15/啟庫22需重新discovery。Agent1/draft3與既有schemas、legal4/private/not_submitted保持，產品85/來源38–85共48/unknown86。見[契約](LYRICS-SEARCH.md)。

一份 `musiclab/assets/delivery-versions.json` 明確記錄 format、schema_version、current、supported。v0.59 支援所列 0.38.0 到 0.59.0 共22項；不是執行期生成範圍。稀疏清單允許，但缺項不可接受。版本為三段ASCII無前置零整數，每段最多2147483647；清單1–128項、嚴格數值遞增且不重複，current必须是最後一項。固定文件最多8192 bytes，嚴格UTF8／重複欄位／非有限JSON與未知schema拒絕。沒有外部網址、任意路徑、環境變數選擇或失敗回退。

| 層 | 責任 |
| --- | --- |
| 固定JSON | 明確產品版本與交付支援列表 |
| Python純policy | 固定有界讀取、驗證、immutable tuple、隔離descriptor |
| JS純policy | Node固定有界讀取／browser固定契約、凍結隔離列表與exact membership |
| domain | package prepare、inspection；manifest／import／comparison report拒絕非支援版本 |
| application／adapters | Python init／Agent／MCP product metadata、browser草稿與版本標示；schema／protocol分開 |
| HTTP | 固定唯讀script／module，Host／Origin／CSP／no-store沿原門檻 |
| release | exact source ZIP內registry／product metadata／discovery交叉核對 |

未知Producer不改寫或遷移；現有來源原檔保持。這只管理版本與封裝接受，沒有創作、媒體或商用授權判定。產品59不變更Agent1／draft3／package1／inspection1／comparison1，13基本／18啟庫工具保持。

下一次發版：明確加入一項supported並更新current、projects.json發布版本；先建立restore tag及iteration branch，再更新獨立歷史oracle與跨語言cases、實際舊ZIPbytes、UI及封裝核對。不能把歷史oracle改成只讀同一policy，否則掉版也會被測試掩蓋。字面registry與驗證器不得引用其他本機或私人專案。


## v0.60

產品current更新0.60.0，明確加入supported 0.60.0共23項；未知仍拒絕。producer與版本驗證器未修改；四工作台歷史bytes及獨立oracle保持。


## v0.61

產品current更新0.61.0，明確加入supported 0.61.0共24項；未知仍拒絕。producer及固定policy validator保持。實際v60來源封裝四scope×23producer共92歷史ZIP逐bytes相同。


## v0.62

產品current更新0.62.0，明確supported加入0.62.0共25項；未知仍拒絕。audio-result live回覆須與固定頁面current相同，並非用ZIP历史producer清單代替protocol契約。policy validator與文字producer保持；实际v61封裝4scope×24歷史producer共96ZIP逐bytes相同。


## v0.63

current與metadata0.63.0，supported明確38–63共26項；validator不變。actual v62 ZIP派生4scope×25歷史producer共100份ZIP在本版逐bytes／manifest保持。歷史ZIP原文不按新MD格式重写；當前live report使用頁面current及本安裝canonical文字契約。

## v0.64

固定唯一current=0.64.0，supported明確38–64共27項，未知65拒絕；四scope×26舊producer的104份ZIP位元組与manifest保持。

## v0.65

固定唯一current=0.65.0；supported明確38–65共28項，未知66拒絕。四scope×27舊producer的108份ZIP位元組與manifest保持。

## v0.66

唯一current=0.66.0，明確supported38–66共29項，未知67拒絕。四scope×28舊producer的112份ZIP位元組與manifest保持。

## v0.67

唯一current=0.67.0，明確supported38–67共30項，未知68拒絕。四scope×29舊producer的116份ZIP位元組與manifest保持。

## v0.68

唯一current=0.68.0，明確supported38–68共31項，未知69拒絕。四scope×30舊producer的120份ZIP位元組與manifest保持。

## v0.69

唯一current=0.69.0，明確supported38–69共32項，未知70拒絕。四scope×31舊producer的124份ZIP位元組與manifest保持。保存回讀不新增交付schema／Agent operation。

## v0.70

唯一current=0.70.0，明確supported38–70共33項，未知71拒絕。四scope×32舊producer的128份ZIP位元組與manifest保持。保存預覽來源核對不新增交付schema或Agent operation。

## v0.71

唯一current=0.71.0，明確supported38–71共34項，未知72拒絕。四scope×33舊producer的132份ZIP位元組與manifest保持。備份來源／回覆核對未新增交付或backup schema、Agent operation。

## v0.72

唯一current=0.72.0，明確supported38–72共35項，未知73拒絕。四scope×34舊producer的136份ZIP及manifest bytes相同；新備份下載及取消不新增交付／backup schema或Agent operation。

## v0.73

唯一current=0.73.0，明確supported38–73共36項，未知74拒絕。四scope×35舊producer的140份ZIP/manifest bytes相同。新備份export1獨立，交付schemas/backup1/Agent1保持；14基本/20明確啟庫工具。

## v0.74

唯一 current=0.74.0，明確 supported38–74 共37項；未知75拒絕。四scope×36舊producer共144份 ZIP/manifest bytes相同。library-result僅新增browser核對層；交付schemas、Agent1／draft3／library1／backup1與14／20工具保持。

## v0.75

current=0.75.0、明確supported38–75共38項，unknown76拒絕。四scope×37共148份v74實際producer ZIP/manifest bytes保持。search1獨立，既有交付schemas／Agent1／draft3／library1／backup1保持；14／21工具。

## v0.76

current=0.76.0、明確supported38–76共39項，unknown77拒絕。四scope×38共152份v75實際producer ZIP/manifest bytes保持。搜尋名稱呈現只在browser暫態與共用純model；search1、既有交付schemas/Agent1/draft3/library1/backup1及14/21工具保持。

## v0.77

current0.77.0、明確supported38–77共40項，unknown78拒絕；156個歷史文字ZIP/manifest與v76實際producer bytes一致。新共用UTC validator不增加wire/schema/操作或工具，Agent1/draft3/library1/backup1/search1與14/21保持。


## v0.78

current0.78.0、明確supported38–78共41項，unknown79拒絕；160歷史文字ZIP/manifest與v77實際producer bytes一致。波形暫態定位不增加wire/schema/操作或工具，14/21及Agent1/draft3保持。


## v0.79

current0.79.0、明確supported38–79共42項，unknown80拒絕；164歷史文字ZIP/manifest與v78實際producer bytes一致。逐句標記暫態撤回不增加wire/schema/操作或工具，14/21及Agent1/draft3保持。


## v0.80

current0.80.0、supported38–80共43項、unknown81拒絕；168歷史ZIP/manifest與v79實際producer bytes一致。每輪projects.version=current、release_version=v+current為預期tag；封裝前從selected commit兩個固定blob核對，不從working metadata推測；實際發佈另記remote evidence。manifest1新增checks.release_metadata，Agent1/draft3/14/21保持。見[發佈契約](RELEASE-METADATA.md)。


## v0.81

current0.81.0、supported38–81共44項、unknown82拒絕；172歷史ZIP/manifest與v80實際producer bytes一致。projects.version=current、release_version=v+current為預期tag，封裝與實際publication仍各核對。新增目前句導航不改領域wire／Agent1/draft3／14/21，見[分層契約](CURRENT-CUE.md)。


## v0.82

current0.82.0、supported38–82共45項、unknown83拒絕；176歷史ZIP／manifest與v81實際producer bytes一致。projects.version=current及release_version=v+current為預期tag，封裝與actual publication各核對。句首定位及共用負時間邊界修正不改領域wire／Agent1/draft3／14/21，見[分層契約](CUE-POSITION.md)。


## v0.83

current0.83.0、supported38–83共46項、unknown84拒絕；180歷史ZIP／manifest與v82實際producer bytes一致。projects.version=current及release_version=v+current仍為預期tag，各自核對selected-source封裝與actual publication。播放快取及高亮不進draft3／Agent1／領域wire；14/21保持。見[契約](CURRENT-CUE-PLAYBACK.md)。


## v0.84

current0.84.0、supported38–84共47項、unknown85拒絕；184歷史ZIP／manifest与v83 actual producer bytes相同。expectedtag v0.84.0保持selected-source核對，實際發布另看remote receipt。編修定位只在本頁，Agent1/draft3/14/21及領域schema保持。見[契約](EDITOR-FOCUS.md)。
