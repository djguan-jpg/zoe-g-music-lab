## v0.161.0 波形定位的實際回讀

原波形controller呼叫寫入器後直接回報成功；寫入器回false或未移動位置仍會触發onSeek及鍵盤攔截。現在純wave-position先核對來源與時長，寫入後回讀同一原生音檔的可用狀態及實際位置，明確false或超過1ms候選差異拒絕成功。void原生setter仍相容，成功view直接使用核對過的快照，沒有第二次讀取與舊候選混用；失敗刷新目前view，不撤回或重試原生寫入。dispose期間不再寫入或回報成功。

800Python（1既有Windows symlink skip、0expected failures；原兩worker／120秒）、1935JS（9新增）、153syntax與四Skills通過；集中7Python／50JS。原v160 ZIP完整800Python／1926JS及1027 Git raw blobs、原v158 ZIP完整797Python／1911JS及1019 blobs都隔離還原通過，CRC／ledger核對、原來源／兩worker／120秒保持，暫存移除。v158之前的期限失敗紀錄保留；本輪完成此前未完成的原來源接受。492四scope歷史ZIP／manifest bytes、29input/output schemas及整份／原列comparison bytes保持。

Chrome首個自有tab先用QA注入拒絕／無動作寫入器重現restore tag舊版假成功，再核對新版拒絕；這不是聲稱原生瀏覽器實際拒絕。正式工作台用本輪合成四秒PCM，方向鍵0.5／Shift0.55／Home0／End4／滑鼠1.998／句首0，18欄、兩原列含空白emoji、宣告及音檔URL／選檔值保持。前往目前句子到原文字欄；完整歌詞包六檔建立、格式提醒0、console0。原input.files未由DOM唯讀wrapper提供，只核對選檔值及URL，不冒充File身份證明。補強dispose防護後以第二個自有tab重驗兩種拒絕及正式定位、18欄原列保持和六檔完整包；兩自有tab關閉，兩server按原PTY STOP後EOF0、thread joined；未下載或驗證保存檔、實聽、full visual／screen reader、Host或平台創始接受。

產品161／唯一policy38–161共124、unknown162拒絕；Agent1／draft3、22基本／明確啟庫29、template1及domain schemas保持。沒有新operation／asset／依賴／auth／路徑／模型／產品網路。六法律／發起／平台紀錄、七history及四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg及已授權public保持。四既有投稿尚未核實，本輪不修改或重送。restore-v0.160.0-before-v0.161.0、codex/iteration-v0.161.0、精確封裝／PR／remote及最終audit依收據。

## 本輪互動驗收

流程：正式波形校時→選合成PCM→LRC預覽及明確套用→鍵盤／滑鼠定位→目前原句定位→完整歌詞包。另在QA頁以還原tag原模組與新模組核對拒絕／無動作寫入，不改產品server路由。

| 查驗 | 實際結果 |
|---|---|
|頁面身分／非空白／框架錯誤|正確工作台標題及v161內容，無錯誤overlay|
|Chrome console|warn／error 0|
|拒絕／未移動|舊版success 1／2，新版0，实际位置0|
|正式定位|鍵盤、滑鼠、句首／目前句子通過，18欄及兩原列保持|
|完整歌詞包|六檔、格式提醒0；保存檔未驗證|
|截圖／完整視覺|未執行，不以DOM當完整視覺驗收|
|資源收束|兩自有tab關閉，兩原server STOP及EOF0、thread joined|

標準語法／四Skills及全部測試通過，實際完整Python用時依checks-weighted-evidence.json。無新媒體／Host／模型或Agent權限。精確來源封裝與遠端接受尚需後續封裝收據，不能用此文宣稱已完成未執行的發佈。
