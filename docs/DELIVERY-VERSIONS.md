# 固定交付版本契約 v1

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
