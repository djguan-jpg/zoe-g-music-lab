# 備份下載與取消 · v0.72

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
