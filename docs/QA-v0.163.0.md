## v0.163.0 分鏡總長撤回的實際回讀

原controller在撤回寫入器回false或沒有改回總長時仍清除紀錄、顯示已撤回。現在純storyboard-duration保留pending紀錄，寫入後核對同份來源、紀錄身份與原宣告字串，確認全部還原後才清除紀錄及發布同一已核對快照。明確false、無動作、錯原值、來源變更、例外或期間clear拒絕成功；失敗不自動回滾或重試。紀錄保持時，只有原時間來源與實際adopt-after仍一致才可再撤回；來源或部分寫入需先人工核對修正。void原生setter相容，後續創作文字與其他工作台／媒體沿原限定apply保持。

800Python（1既有Windows symlink skip、0expected failures；原兩worker／120秒）、1947JS（8新增）、153syntax與四Skills通過；集中7Python／51JS。新增controller與實際app handler測試涵蓋拒絕／無動作、安全重試、逐字恢復、FPS／ID／時間／順序／數量變更、例外／損壞快照、同一post來源、clear不復活及false後部分寫入。原v162 ZIP兩次完整Python還原都達原兩worker／120秒期限，首輪worker0／重試worker1實際印出的身份與失敗收據保留，未印出的另一worker身份不補造。原ZIP CRC／ledger及1033 raw Git blobs核對，另隔離集中7Python／完整1939JS通過；三次暫存均移除。集中還原不是800Python完整接受，原全套還原仍未完成。500四scope歷史ZIP／manifest、29 input/output schemas與整份／原列comparison bytes保持。

Chrome QA注入拒絕寫入器重現舊版總長仍12卻顯示成功且清除紀錄，新版顯示拒絕並保留撤回；不是宣稱原生Chrome實際拒絕。正式工作台用本輪合成四秒PCM，明確採用24秒、FPS改變停用撤回、修正後逐字還原NEL及空白包住的60.00；後續畫面emoji及連續空白保持。首tab在非同步成果完成前關閉，該次五檔接受未完成；第二tab重新完成完整流程，等五檔清單出現後才核對。85具ID欄位僅成果選單／預覽變更，48分鏡欄位僅明確畫面編修改變；四鏡原時間、其他工作台、音檔URL及選檔值保持。完整五檔分鏡包、下載按鈕可用與console0已驗，未執行下載／驗證保存檔。兩QA自有tab關閉，server原PTY STOP／EOF0及thread joined；native File身份、完整視覺／實聽／Host／創始身分未驗。

產品163／唯一policy38–163共126、unknown164拒絕；Agent1／draft3、22基本／明確啟庫29、template1及領域schemas保持。沒有新operation／asset／依賴／auth／路徑／模型／產品網路。六法律／發起／平台紀錄、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg及已授權public保持。因使用者告知已登入，唯讀確認Zoe／音樂公會長、public Repo及四既有公開投稿；平台仍自行聲明、尚未核實作者身分，未修改或重送。額外唯讀查驗tab已關閉。restore-v0.162.0-before-v0.163.0、codex/iteration-v0.163.0及封裝／PR／遠端／最終audit依收據。

## 本輪互動與限制

|查驗|實際結果|
|---|---|
|拒絕寫入|QA注入器中，舊版假成功且清紀錄，新版拒絕並保留紀錄|
|來源防護|正式FPS25停用撤回，修正24後可明確撤回|
|原值恢復|NEL、空白與60.00逐字恢復；後續emoji和連續空白保留|
|來源保持|85具ID／48分鏡欄位，僅成果預覽／選單及明確畫面編修改變|
|完成等待|第二tab等mv-brief.json附加後核對全部五檔與可用下載|
|Chrome console|warn／error 0|
|保存／媒體／視覺|未驗證實際下載保存、native File身份、實聽或完整視覺|
|程序|自有server原PTY EOF0／thread joined，三自有tab關閉|

集中7Python／51JS、完整800Python／1947JS、153syntax／四Skills通過。指定來源封裝與遠端發佈由後續收據證明，本文件不把尚未执行的发布写成已完成。
