# v0.39.0 QA — 2026-10-04

340項Python、531項JavaScript、4份Skill驗證、42個JS語法檢查及git diff --check通過；相對v38新增12Python／40JS。檢查四scope、兩個明確工具版本、標準ZIP／原文／manifest核對、有界中央目錄與清單、CRC／SHA／path／UTF8／BOM／壓縮／額外資料／未知版本拒絕、JSON跳脫後512KiB界限、metadata與原文明確選擇、CLI覆寫保護、實際Agent選定來源與MCP初始化工具呼叫、HTTP四scope／loopback與無inspect staging。

前端檢查所選ZIP二進位清單anchor、回覆完整來源與逐檔摘要、scope／revision／media／busy、最新選擇／取消／晚回應、預覽／明確套用／撤回、後續編修與新成果、literal DOM及成功訊息。原清單probe刻意不能核對原檔CRC，全包驗證由server進行，沒有將probe宣稱為完整解碼。

## 原生瀏覽器與實際下載

IAB tabs62／63／64及自身記錄server PID327412、port8875，僅使用本工作區合成資料。v38四工作台ZIP選檔→預覽→明確載入→原生ZIP重下載，歌曲4檔、分鏡5、歌詞4、音檔3；CRC／每檔原文字／SHA／scope／原說明相同，新封裝工具版本0.39。長說明200字另下載1包，原文及label保持。共5份實際下載，由主機讀回核對並保存於忽略的本輪QA目錄。

載入與撤回保留原表單，撤回保留後續編修；依賴舊表單的成果下載停用。已選1秒48kHz／16bit／mono合成WAV，在音檔ZIP載入後重新量測，report SHA與原檔一致：4db8ab9ef4ade05e5640e175431e58dc649bdf06ea31c8b4bf0c7238d8cc2a2b。這驗證選檔保持，不代表正式聲音品質接受。

只改server回覆清單label且保留原ZIP SHA時拒絕；跨scope拒絕且保留目前工作台。控制4秒延遲，編修後晚回應忽略；讀取中取消按鈕可用，取消後不出現預覽。全新文件64確認跨scope錯誤後成功預覽清除舊error。390×760 Enter載入／撤回，visible preview page client／scroll375／375，原清單271／271；1366×768 page1351／1351、清單255／255。最終tab console error／warning0；沒有完整視覺審查。

所有自身tabs已關閉、viewport reset。QA server以原session正常shutdown，delivery records0／root清除。合成ZIP／原WAV保留。

## 診斷與可逆

首次Pythonfocused測試有ZipInfo fixture在讀來源前修改，以及把合法重新封裝scope誤當篡改的斷言；fixture與預期修正。JS測試找到實際回覆label可沿用ZIP SHA的缺口，新增原二進位清單anchor後通過。首次native主機helper有錯誤函式名及JSON helper接bytes，修正為read與排他binary保存後5包核對通過；未提交或發布失敗結果。診斷及實際run records保留。

tab63在dirty文件reload後仍顯示先前script行為；關閉後以全新tab64核對最終成功提示。一次readonly DOM使用錯誤id導致觀察失敗，改用既有output-file；未重送套用。舊錯誤觀察不當作本版native接受。

v38指定ZIP來源2981bae474ce54a46b90a54bbdfcbd1eecceb593／843992bytes／SHA fb50781d32debe15f0fcf7d437482c410ab25ac1e8cde8e76921fa955734e327，解壓328Python／491JS通過、暫存移除。restore-v0.38.0-before-v0.39.0指main起點98873c9e20ec71f55c0e141ed102229754a883ad。

指定source封裝再解壓完整測試及Agent metadata／MCP初始化，private PR／Release、遠端實際下載bytes／SHA／CRC、legal4、refs／tree／main clean依outputs/v39-qa及release manifest收據。每輪latest3／嚴格七天／可重建／自身run維護保持。

正式歌曲／影片、實唱實聽、完整視覺、特定Agent Host、原生file://預覽音檔播放尚未驗證。FreeTWAI仍not_submitted，未取得平台創始人接受。PolyForm Noncommercial1.0.0／ZOE. G／djguan-jpg／AI協作及legal4保持，rolling goal active。
