# v0.69.0 驗證

基準wrong-id／wrong-source ACK實際觸發onSaved，只有save request而沒有read，pending清空；gap-evidence.json保存重現。新12項JS測試覆蓋ACK exact／未知版本／ID／label／titles／strict bool／SHA與bytes形狀、non-BMP 120字元截取、全draft metadata／內容／列順序／額外欄位、async input isolation、pending直到read、後續編修、read404同ID重試、mismatch保留dirty、不自動重試／不刪除、原save400與required injection。三項Python用真immutable library、HTTP及Agent／MCP跨語言readback，核對實際磁碟bytes／SHA、同ID重用與固定asset依賴順序。

集中3 Python／71 JS通過。首次Pythonfixture把庫根內的metadata檔也算成保存版本而失敗；修成實際版本目錄精確只一個ID，fresh retry通過，未改實作或保存契約，失敗收據保留。全套511 Python（111.290秒）、816 JS、71語法、四份Skill與diff通過，Python120秒上限保持。指定v68 ZIP先SHA／CRC核對，再獨立還原508 Python／804 JS；暫存目錄移除。124份四scope歷史ZIP由真v68 producer派生，current ZIP及manifest逐bytes相同。

native tab114，明確fresh synthetic library，真save/read HTTP。第一次read僅response副本改歌名、原磁碟／producer回覆保持。UI不標已保存、保存停用且retry啟用、dirty提醒保持。編修後續歌名，再390px以Enter重試；第二次save payload／ID與第一筆精確相同、backend reused=true、read匹配，磁碟只一版本且bytes／SHA一致。UI原稿確認但後續編修仍未另存；preview顯示原案而目前歌名與WAV保持。回原標題才與保存checkpoint一致。其他三台主要欄位與native WAV保持，沒有套用整份庫稿或清media。

390px長錯誤提示width／scroll均313px，retry108px鍵盤可用，console warn/error0。tab關閉、viewport reset、owned PID385964原session62174正常exit0、context closed、staging未建立。未點擊下載；瀏覽器實際下載保存、全面視覺／真人screen reader、正式媒體／實聽／特定Host／平台創始接受仍未驗證。backend磁碟SHA與browser全值核對有明確邊界，不宣稱browser獨立重算磁碟bytes。exact-source／remote／cleanup收據在outputs/v69-qa；rolling active。
