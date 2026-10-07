# v0.154.0 QA

## v0.154.0 完整原文差異閱讀

成果、專案草稿與接受條件核對不一致時，可明確按「閱讀差異位置」，從目前完整原文取最多16 KiB的UTF-8片段，整字標示第一個差異對應字元；提供開頭、下一段、返回已讀上一段、返回差異及關閉。差異在原文結尾明示EOF；控制字元呈現跳脫文字，來源不改寫。純text-verification-page重用text-download驗證與delivery-text有界byte range → 原注入controller及512位置history → literal DOM、manual focus與有界局部捲動。原七欄report／callback、選定File單次讀取及39byte雙側前後文保持。完整原文只在明確操作期間暫時編碼，finally釋放，不新增選定檔案全文cache或自動保存。

755 Python（1既有Windows symlink skip、0expected failures）、1911 JS（新增19）、153syntax、四Skills與集中168通過。464歷史四scope ZIP／manifest逐bytes及29組Agent input/output schemas、整份／原列比較保持；原v153 exact-source ZIP 2976852bytes／SHA 6056d9dd696f04465d5430ee9567937fe234d72b7fb374cb77409007a90d18e8，以原launcher／120秒deadline順序還原755Python／1892JS，CRC通过且暫存移除。

原生Chrome9次實際File選取（before1／after8），第40018byte同大小emoji差異、三入口讀取與匹配清除、開頭／前後段／返回／關閉、Enter焦點、EOF、revision失效及取消晚回覆通過；翻頁不再讀選定File，8/8 reads、gates0、後續編修保留。正式三入口／asset一次／unique IDs與literal DOM及computed pre-wrap／anywhere／局部捲動核對，console0。兩自有server原handle正常EOF0、兩頁關閉；不宣稱已保存下載、真慢磁碟、完整視覺或screen reader接受。

產品154／唯一policy38–154共117、未知155拒絕；22基本／29啟庫、Agent1／draft3與舊schemas保持。一固定GET，無新operation／POST／依賴／auth／路徑／模型／產品外網能力。六法律／平台原bytes、PolyForm Noncommercial、public及ZOE. G／djguan-jpg保持；本輪唯讀確認Zoe與四公開投稿，仍自行聲明、尚未核實創始，不重送。restore-v0.153.0-before-v0.154.0 →9d95687ce4cf2c031441352ffe00d75b5812273f；codex/iteration-v0.154.0、exact-source封裝与rolling goal active保持。

詳細來源與能力邊界見[契約](TEXT-VERIFICATION-PAGE.md)。