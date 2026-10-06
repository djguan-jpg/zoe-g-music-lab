# v0.153.0 QA

## v0.153.0 原文差異前後文

成果、專案草稿與接受條件核對失敗時，並列目前原文與選定檔案的第一個差異附近片段，顯示精確 byte 範圍、EOF、UTF-8跳脫文字與原始十六進位。純 text-byte-context共用完整bytes比較與有界視窗 → 原text-verification新增internal opt-in inspectWithContext → 注入current controller只保留隔離有界DTO → literal DOM與三個可選區塊。原七欄report1／callback保持，完整來源只編碼／複製／掃描一次；片段不是完整檔案或保存證明。每側16bytes，UTF-8邊界最多延伸3bytes，各最多39bytes；無效UTF-8不修補，BOM／換行／NUL／HTML／不可見字元以明示原值與hex辨認。備份仍沿SHA-only proof，不臆造原ZIP內容。

755 Python（1既有Windows symlink skip、0expected failures）、1892 JS（新增23）、152syntax／四Skills、集中148JS通過。460歷史ZIP／manifest與29組input/output schemas、原整份／原列比较保持；原v152 exact-source ZIP 2954468bytes／SHA b0c22af54f9ed3acea5b738b9789cca92f638b17b2b150a90df01133eabbfd5a，以原launcher／120秒deadline順序還原755 Python／1869 JS，提取暫存移除。

原生Chrome共13次File選取（before1／after12），三入口同大小emoji差異、無效UTF-8、空檔EOF、匹配重試、取消、來源revision改變與QA注入read錯誤均核對；12/12 reads、gates0、後續編修保留。正式三區塊／固定asset一次及pre-wrap／anywhere、console0核對；未驗證真慢磁碟／I/O失敗、已保存下載、窄尺寸完整視覺或screen reader。兩自有server原handle正常EOF0、兩測試頁關閉；未設viewport／未嵌入媒體。

產品153／唯一policy38–153共116、未知154拒絕；22基本／29啟庫、Agent1／draft3與舊schemas保持。只新增一固定GET，無新operation／POST／依賴／auth／路徑／產品外網能力。六法律／平台文件原bytes、PolyForm Noncommercial、public及ZOE. G／djguan-jpg保持。本輪唯讀確認Zoe／音樂公會長與四公開投稿頁，仍原作者自行聲明、尚未核實創始；不重送。restore tag、codex分支、exact-source封裝與rolling goal active保持。


完整範圍與QA首輪失敗／重驗證據見[契約](TEXT-VERIFICATION-CONTEXT.md)。
最後補查保存確認onReport回呼錯誤：保留原七欄report／callback契約，只清除差異片段並沿原onError提示。新增一項回呼失敗測試、完整755Python／1892JS與集中149JS重驗。此條件在原生13次選檔後以注入controller驗證；沒有將它冒充native回呼失敗或磁碟错误。
