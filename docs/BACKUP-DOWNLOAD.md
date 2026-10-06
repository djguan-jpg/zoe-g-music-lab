# 備份下載與取消 · v0.72

## v0.127.0 單版本備份

本機保存版本新增「下載選定版本備份」，可將選單中一個已保存版本另存ZIP。按下時固定ID，即使下載途中切換選單，也不改本次來源；成功提示明示該ID，整庫備份保持。空選擇／未啟庫／busy時停用；取消只中止自己請求、保留上一份成功備份來源。備份只含已保存版本，未保存編修、音檔與成果仍須另存。

backup-download純request嚴格核對ids、隔離／排序1–1000唯一ID；controller以click-time副本核對descriptor.selection及選定數量，沿原完整串流／SHA與latest／cancel／dispose。DOM共用同一sender、URL cap及verification來源，不增加第二個下載控制器或持久buffer。captureSelected只讀目前已展示records；library選擇事件刷新可用狀態，原预覽取消及後續編修保持。

既有POST /api/drafts/backup/prepare由{}整庫相容接續可選ids，沿共享Python selected_ids／export_library_backup；拒絕路徑、額外欄位、query、重複／空ID及跨Origin。ID不能選檔案路徑；沒有恢復或新增寫入權限。選定健康版本不讀未選定版本，整庫仍完整檢查。有效格式但不存在的ID維持既有HTTP500本機讀寫失敗，不自動重送。descriptor六欄、backup1／draft3／Agent1與27組operation schemas保持，20基本／啟庫27工具不變，沒有新asset、依賴、模型或外網。產品127／唯一policy明確來源38–127共90版，未知128拒絕。

見[契約](BACKUP-SELECTION.md)。下方保留歷史迭代。


## v0.126.0 備份下載檔案核對

草稿庫備份旁新增「核對下載的備份 ZIP」。成功送出後可選回本機檔案，先核對1 byte至32 MiB容量，再以完整檔案SHA-256及大小核對本輪備份。來源只保留bytes／摘要／版本數；不持有完整備份，不恢復、載入、保存版本或确认未保存編修。新的成功送出遞增revision，即使內容相同也使舊讀取失效；下載失敗保留上一份來源。舊ZIP不能確認新ZIP。

純backup-verification嚴格原值模型、注入controller、原生File DOM adapter與原有backup-download sender分層。讀取與hash後重查本輪source／revision／busy、完整ArrayBuffer大小與選檔metadata，latest／cancel／pagehide／dispose保護晚回覆。原始32 MiB可完整核對；超限在arrayBuffer前拒絕。同大小錯bytes、短讀及來源失效保留原工作台、成果、列ID及草稿庫；選檔標為verification view control，不誤觸編修。單獨純verificationAllowed避免availability refresh寫入library訊息。

只新增三個固定GET JS資產；原備份domain／CLI／Agent／MCP／HTTP POST權限及schemas不变。20基本／啟庫27工具、27組schema、Agent1／draft3與backup1保持。產品126與唯一policy明確來源38–126共89版，未知127拒絕。PolyForm Noncommercial 1.0.0、ZOE. G及公開授權保持；四份自由工坊投稿已送出，創始身分仍submitted_unverified。

見[契約](BACKUP-DOWNLOAD-VERIFICATION.md)。下方保留歷史迭代。


「下載整個草稿庫」先核對已保存版本，再核對下載摘要、完整串流及SHA，通過才交給瀏覽器。取消備份下載只中止自己的請求；工作台、未保存編修、音檔、保存版本及成果保持。備份不包含目前未保存內容、媒體或成果。

## 純模型與來源

backup-download.checked只接受exact六欄：backup_schema_version=1、64 lowerhex backup_sha256、safe integer bytes1–32MiB、entry_count0–1000、預期selection（工作台all）及已知相對/api/drafts/backup/download/32lowerhex。maximum明確且不能超32MiB；返回隔離descriptor，不接受完整application wire替代這項既有plain descriptor。checkedArchive重驗descriptor、ArrayBuffer長度與獨立量測SHA一致，返回固定zoe-music-lab-backup.zip和已驗buffer；它不解析ZIP或重建entry metadata。

backup-file.sha256為共用原生WebCrypto／自有ArrayBuffer邊界，最多32MiB，digest必須32-byte ArrayBuffer。File.inspect仍核對原File大小／副檔名／讀回bytes後沿此helper。無弱hash fallback；雜湊相同不證明作者、權利、完整ZIP語義或保存耐久。

## 控制器與原生讀取

純controller必須注入prepare/read/hash/send，缺少即拒絕。busy拒絕重複操作；preparing→reading→hashing→idle各階段，以及send前重查token/disposed。cancel或dispose換token；晚成功／錯誤不能交接或改目前提示。descriptor先隔離；buffer只在本次操作持有，finally釋放controller引用。send必須同步返回true才onSent；onSent不是保存確認。

backup-download-dom沿現有POST prepare的AbortSignal，再fetch已知single-use GET：redirect=error、cache=no-store、同一signal。response須ok，Content-Length為正十進位且等descriptor bytes，Content-Type為application/octet-stream，reader可用。只分配宣告界內buffer，最多65536個非空Uint8Array chunks；不許超量、空chunk、短讀或未知類型，EOF後長度精確。讀前／讀後／每chunk核對current；失敗或失效cancel自己的reader及releaseLock。完整buffer以原生SHA檢查，不從摘要、Content-Length或UI文字推算內容。

prepare/read/hash均可注入供失敗測試；production沿原生fetch/WebCrypto。GET本來就是single-use；拒絕的下載可能已消耗該token，下一次須明確重新建立。未讀的prepare由原server60秒expire及close清除，沒有新增discard路由、背景程序、自動重送或自動取消timer。

## 共用下載交接與取消

text-download-dom.createByteSender抽出原生Blob/application-octet-stream、temporary anchor、object URL與timer ledger，備份及文字入口共用。generic sender信任上游已驗的prepared name／bytes，本身不授予path或做ZIP/name/Unicode domain驗證；原文字8MiB、Unicode／檔名／current規則保持，備份32MiB則沿上述checker。

每adapter最多2個owned URLs；anchor append/click/remove，1秒排程revoke。append/click/schedule失敗只清自己的URL/timer；pagehide/dispose同樣只釋放自己的資源。schedule失敗可能已點anchor，所以不能推論瀏覽器絕未下載。callback sent表示click與schedule已完成；不是保存位置、檔案bytes或耐久確認。pagehide cancel請求並釋放URL；BFCache回來仍需新明確操作，dispose才永久停用adapter。

「取消備份下載」只在busy可用，AbortController中止自己的fetch。onState清忙碌、onSent/onError沿current；取消提示不能被晚回覆蓋掉。取消網路可能在server寫headers/body時斷線，WorkbenchHandler.reply只捕捉ConnectionError並close_connection，不在同socket重送500；其他OSError仍沿原錯誤處理。此變更不改Origin/Host、auth/session或library寫入權限。

## 驗證與信任界限

Python read_backup保持有界完整ZIP／CRC／manifest／revision bytes/hash及immutable版本規則。工作台獨立量測完整傳輸buffer的SHA與descriptor一致；不獨立解壓、重建entry_count或revision摘要。這輪native成功提示與server已送原bytes成立，但內建瀏覽器download event20秒逾時，未取得saved path／落盤檔案；明確列為未驗證。不能把success UI、native anchor測試或server ZIP當實際保存證明。

12新JS覆蓋exact descriptor、headers／full stream、overflow/short/空chunk/current、真WebCrypto、late prepare/read/hash、required injection、duplicate/cancel/dispose、shared URL cap、click/schedule失敗、pagehide/BFCache及實際app abortable transport。四新Python覆蓋真all/selected/empty ZIP、loopback single-use及fixed assets、CLI→Agent完整備份、headers/body斷線三種ConnectionError與其他OSError保持。詳見QA-v0.72.0.md。

Agent1／draft3／library1／backup1與14基本／明確啟庫19工具、原routes/schemas/CLI/MCP保持。產品72／明確交付38–72；未知73拒絕。無依賴、模型、對外呼叫、路徑授權或持久服務擴張。legal4 PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、private、FreeTWAI not_submitted保持。
