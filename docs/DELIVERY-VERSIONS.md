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
