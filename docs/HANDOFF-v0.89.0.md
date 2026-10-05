# v0.89.0 交接

修正歌曲/分鏡報告處理中仍可載入範例，替換原來源並清除刪除紀錄的問題。兩範例入口在讀取完成且共用操作結束後才開放，handler在load/clear/dirty/render之前拒絕未就緒或busy。初始HTML停用，startup與run既有timingControls/finally共用refreshExampleControls DOM adapter；late startup不自動取代處理中的來源，也不覆蓋其進度訊息，後續人工編修沿既有retention保持。明確idle載入只替換所選工作台並清除該台刪除歷史。原欄位編修與revision/current過期保護保持；domain/HTTP/CLI/Agent/MCP未改，無新asset/operation/schema/依賴/權限；15/22、Agent1/draft3保持。564Python69.922秒/1034JS/98syntax/四Skills、134focused（10新actual handler/run/initialize測試）、204歷史ZIP/manifests及原v88 ZIP564/1024還原通過。原生讀取中自寫歌名保留、成功/HTTP500/過期回覆、歷史/上一份成果保持、完成後限定範例載入及390px Enter核對完成；三原生報告與actual CLI/Agent/MCP/HTTP一致，拒覆寫/good-bad-good保持。delay/500只在ignored QA helper，production server未改。兩owned tabs/兩bounded servers正常關閉，viewport reset；HTTP500是刻意測試，console warn/error零。完整視覺/screen-reader/正式媒體未驗證。產品89/來源38–89共52/unknown90，legal4/private/FreeTWAI not_submitted保持，latest89/88/87保護，rolling active。

- 分支 codex/iteration-v0.89.0；restore-v0.88.0-before-v0.89.0 指向 e01028401ec438b63cd913f36cfe04d011b09528。還原可另開分支，不強制覆寫main或私人草稿。
- app DOM availability/handler → startup/shared run；domain/application/CLI/Agent/MCP/HTTP不變。只有app/index初始disabled、版本資料、測試與文件更新，無新asset/operation/permission。
- 版本89、支持38–89、unknown90；Agent1/draft3/原領域schemas；基本15/明確啟庫22。
- 範例載入只在ready/idle明確執行，仍清除該台刪除歷史；不是保存或撤回。busy/讀取期間不可載入，不妨礙原欄位編修。
- outputs/v89-qa：baseline/native、checks/focused、previous restore/compatibility/runtime、source/package/private PR/remote download/ref/tree、inventory/audit receipts。ZIP指定source commit與SHA以manifest為準。
- latest89/88/87保護；草稿/媒體/backup/failed36/53/unknown與其他程序保持。無合格候選時不刪；本輪job原handle正常終止，無常駐helper。
- LICENSE/NOTICE/LICENSING/FOUNDER不變：ZOE. G，GitHub djguan-jpg，PolyForm Noncommercial1.0.0，private，FreeTWAI not_submitted。未宣稱AGPL、商用許可、平台創始核實或正式作品完成。
- 後續先確認可重現需求，保留分層/current/source/restore契約。完整視覺/screen-reader/正式媒體/Host/平台仍未驗證；rolling目標active。
