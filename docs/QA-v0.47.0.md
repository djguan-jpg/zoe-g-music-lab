# v0.47.0 驗證紀錄

2026-10-04。起點private main d0acc879ae7b6704c1179b10099189d05217d1e9，先建立restore-v0.46.0-before-v0.47.0與codex/iteration-v0.47.0。前輪是progress：v46 exact-source已發布且遠端核對。legal4保持。

缺口以restore上的搜尋DOM原模板核對：只有第N筆及UTF8 bytes start/end，沒有鄰近文字，重複句無法從選項辨認。本輪增加bounded original context1與清單文字、唯讀片段；預設Agent位置DTO保持。

416 Python／602 JavaScript／51 syntax／4 Skills與diff通過，新增8Python／8JS。涵蓋與實際Python DTO／UTF8位置一致、BOM／emoji／CRLF／LF／CR／NUL／HTML、左右64-byte邊界不拆字、beginning／EOF／empty／no-match、1024-byte query／50上下文／8MiB尾端及跳脫後回覆有界、七欄預設完全保持、include_context嚴格布林在I/O前拒絕、未知schema／位置／尺寸／命中字／排序拒絕、source CRC／SHA及缺檔全份拒絕、四工作台雙側與單buffer共用、清單控制符號／長摘錄／側邊空格縮合但query空格與DTO保持、DOM失效／下一批／literal／Apply／Undo。實際CLI／Agent／MCP從另一cwd回同context，無source或自動寫檔；--match-context缺來源拒絕。

原生IAB：tab79首先驗主歌／末副歌片段、第二批第21筆清除舊片段、8MiB tail8388500到8388510含64個a與尾端🎵，EOF清單沒有虛構尾端…；保留原文同片段。後續改歌名使context清除／Apply停用，Cancel／Undo還原空成果並保留v47 後續編修。HTML字面片段、有效空檔、Enterfocus及跨工作台ZIP拒絕確認。重載bound page保留其他工作台與收合details，唯讀狀態查明後修正，不以selector timeout當成服務終止；最終新tab80再核對四工作台最新清單，側邊空格已整理、readonly片段仍保留原空格與內容。

三寬度390／1024／1800，scrollWidth375／1009／1785，context/select寬271／641.328125／285，readonly；viewport重設、console0，tab79與80關閉。query變更清空／隱藏context、停用matches。

QA server的serve_forever及with context正常關閉；之後收尾取未建立的lazy delivery_downloads屬性出AttributeError，原handle exit1，如實保留。沒有產生下載staging，補核對port8875=0及server返回收據，沒有重啟服務；不冒稱整個helper正常exit0。最新typed records終態後再稽核。

前版v46指定ZIP1009570 bytes、SHA 3ca1f31f8acda2702e8ee3a354ce37a34c2a297ab8014a64fc6ba8b4c8fb1ca3實際還原408 Python／594 JS通過，限定暫存移除。source封裝另對精確commit重跑；private PR／Release、actual遠端ZIP／manifest bytes／digest／CRC／legal4與main tree／refs依本輪收據。latest47／46／45受保護；僅超七天且exact Git／tag／已驗證backup可重建才清，failed v36、未知、媒體、草稿、備份及其他程序保留。

本輪沒有新增瀏覽器全文下載實檔保存確認，v46該次保存事件未確認仍保留。正式媒體／實聽／完整視覺／特定Host及FreeTWAI創始接受未驗證；platform not_submitted、private、ZOE. G／djguan-jpg、PolyForm Noncommercial 1.0.0，rolling active。
