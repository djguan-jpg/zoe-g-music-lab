# v0.46.0 驗證紀錄

2026-10-04。本輪先核對private main起點038408977e93957e17485654e14f88728ea20309，建立restore-v0.45.0-before-v0.46.0與codex/iteration-v0.46.0。legal4不變。

實際缺口：8388358-byte合成原文，原UI第一段0–16384，尾端8388328不在有界預覽；沒有搜尋輸入，只能逐段翻頁。本輪加入完整原文字面搜尋並直接定位。

408 Python／594 JavaScript／50 syntax／4 Skills與diff通過。新增10 Python與12 JavaScript，涵蓋Unicode／BOM／CRLF／LF／CR／NUL／HTML、大小寫與不正規化、非重疊分批、empty／EOF／no-match、query1024-byte與1–50上限、字元中間起點／未知欄位／互斥模式在I/O前拒絕、變更label拒絕前次SHA、未選檔損壞完整拒絕、完整baseline、四工作台長文尾端與有界回覆、CLI覆寫及混用flags、另一cwd實際Agent／MCP兩批及命中後分段、12工具／獨立schemas與來源不變。JS另核對實際Python UTF8位置，8MiB／1024-byte反覆前綴KMP、單encoded buffer共用、source alias／query變更／retry／seek、current source失效與Apply／Undo。

實際IAB tab78：8MiB原文在8388328–8388344命中，選擇後顯示尾端原文到8388358；沒有修改歌曲欄位或載入成果，Apply仍可用。第二批第21筆接續；套用後再核對目前保留原文，命中相同位置，取消與Undo還原空成果、原歌名保持。分鏡／歌詞／音檔三工作台40KiB全文尾端40010直接定位，HTML只字面顯示，HIT沒有命中hit。empty／missing分開，歌詞Enter後focus仍在搜尋欄位；下一批第21筆。取消清除reader與停用搜尋。

390／1024／1800 DOM幾何：scrollWidth375／1009／1785，搜尋欄位／下拉／按鈕均在寬度內，reader readonly；viewport重設、console error／warn0、tab78關閉。兩個本輪server由原handle正常退出，loopback8875無保留listener；staging records0／root removed按本輪收據核對。

全文下載UI送出，但10秒內沒有download保存事件；本輪未核對該次保存的實檔。此事件不足以證明下載失敗或成功，不能冒充已保存。原始bytes與下載來源保留由模型／controller及既有測試核對。未做正式作品、實聽、完整視覺或新WAV實檔流程；特定Agent Host與FreeTWAI創始接受仍未驗證，platform not_submitted。

前版v45指定ZIP988854 bytes、SHA ad819f69011c1de8d63b93c7e0f4e9ce23899492061342bdab5e54666e1b0e15實際還原398 Python／582 JS通過，限定暫存移除。gap_fixture.py錯用不存在export與integrate.py括號syntax在任務執行前失敗；保留真實錯誤，以新helper名稱修正，沒有補造PID。

本輪exact source ZIP／SHA／manifest、private PR／Release與實際遠端assets核對依outputs/v46-qa收據；封裝再次檢查精確Git source。latest3保護與typed runs terminal後做唯讀稽核；超七天且可重建才可清，沒有候選不刪，failed v36、未知、媒體、草稿、備份與其他程序保留。rolling goal active。
