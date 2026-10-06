# v0.129.0 交接與可逆

還原點restore-v0.128.0-before-v0.129.0固定e73694429c8260defb528a817092b43cc4d212fc；施工codex/iteration-v0.129.0。需要還原時從restore另建codex/restore-*與PR審閱，不追改已發佈tag、不改私人草稿／媒體、不撤銷四份平台投稿。v128 final補查與失敗標準audit收據保持。

本輪將filesystem唯讀catalog1024與recovery128／2MiB分開，並讓audit只留必要metadata，詳見MAINTENANCE-CATALOG.md。existing pure retention／process identity／token、CLI flags、audit1／recovery1及Agent權限保持。129清除候選安全拒絕，沒有靜默分批。

628 Python（75.016秒，原兩隔離workers／120秒overall deadline）、1592 JavaScript、143 syntax與四Skills通過。新增6 Python；維護focused25通過。基線真129目錄標準CLI確實exit1，且完整manifest逐份釋放及129候選guard新測試確實不通過；修正後通過。第一次baseline helper因測試fixture import失敗的log保留，修正測試import後才取得capacity基線證據。

真129 entry包含四份由合成Git提交建立的完整封裝與125個partial診斷；從其他cwd走實際CLI預覽，原值保持，再沿既有exact token清除一份舊封裝／journal／restore，原ZIP和manifest bytes完整復原，所有125診斷保持。1024項完整唯讀、1025整輪拒絕且package_facts未呼叫；129候選在日誌／move前拒絕。restore的128 count gate通過後仍拒絕損壞entry，129在來源讀取前拒絕。

weakref合成完整ledger只驗證audit不逐份持有完整manifest，沒有聲稱總程序峰值RAM／並行外部寫入原子性。原剪枝／復原錯token、來源／mtime／tag／CRC／rebuild、額外檔案、oversized journal、active／unverified及reparse等測試保持。

v128指定source ZIP2404475 bytes、SHA43f2402a1d1daf337138aab19679a4d071c06eb8ebf69cebcc36a316dca6659e，實際還原622 Python／1592 JS，限定暫存移除。四scope×91共364份歷史交付ZIP與manifest bytes相同，27組operation input/output schemas保持。產品129／來源38–129、未知130拒絕，20／27tools與Agent1／draft3保持。

本輪UI／原生DOM／server／creative application／Agent adapters無diff，沒有建立native browser tab或常駐server，也沒有宣稱本輪新的視覺／實際瀏覽器落盤驗收。GitHub CI未設定。實聽／音畫同步、Host安裝、平台正式創始核實仍未驗證；PolyForm Noncommercial1.0.0與submitted_unverified保持。public PR、exact-source封裝、公開asset逐bytes核對與最終標準maintenance結果以發佈後outputs/v129-qa收據為準，不能把文件當成已發佈證明。

每輪最後只查本workspace outputs／direct release pairs／明確same-host run，最新三版保護、嚴格超七天且exact tag與Git archive重建才列候選。unknown／partial36／53及v77 alternate來源不符封裝保留。無候選不刪；草稿／備份／素材／其他專案與外部程序不清。驗收、指定commit ZIP／SHA、public PR／prerelease與實際remote receipts由outputs/v129-qa存證。

下一輪持續從可重現需求推進功能與直覺／視覺；若清除候選超128，先設計有明確preview與可復原journal的分批維護，不能放寬日誌／identity／age門檻。滾動goal仍active，不將本輪進展說成全部完成。
