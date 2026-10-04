# 原文下載 v0.42

## v0.44 原文分段閱讀

text-window1獨立，完整來源核對後讀明確UTF-8邊界，單段4–16KiB、非零位置pin前次ZIP SHA，未指定分段的原契約保持。Browser唯讀reader有界buffer／頁面／history、current source重查；全文下載、Apply／Undo與12／17工具保持，來源明確38–44。見[使用與分層](DELIVERY-TEXT.md)。以下早期章節保留迭代來源。

## v0.43 指定 ZIP 原文

完整核對來源後才能選取明確原檔名，pure selection1／application／CLI／Agent／MCP共用；Browser pending current source唯讀下載沿native bytes。512 KiB選定JSON上限、8 MiB完整來源與原文保持；來源明確38–43，12／17工具與Agent1／draft3及既有交付schemas保持。見[目前契約與使用](DELIVERY-SELECTION.md)。以下早期版本段落保留迭代來源。

選擇「成果檔案」後按「下載目前檔案」，保存的是本輪完整原文。預覽超過 32768 UTF-16 units 時只顯示開頭，提示會明確標示；預覽不會切開 emoji 的 surrogate pair，原文與 ZIP 保留全文。文字框的換行顯示不是原檔位元組。

成果、專案草稿、已保存版本、接受條件草稿與差異報告共用本機文字下載。UTF-8 保留 BOM、CRLF／LF／CR、NUL、非 BMP 字元及空檔；HTML 內容當文字下載，不在工作台執行。接受的完整成果單檔最多 8 MiB；草稿本身 1 MiB、接受條件與報告原有界限保持。未知 Unicode 不以替代字元修復；可攜單層文字檔名，不接受路徑或裝置名稱。

## 分層與狀態

`text-download.js` 純來源／UTF-8 bytes 驗證及注入 select／send／onSent／onError controller。每次提交重新讀取目前來源；成果檢查 busy、dirty、選定檔是否仍在本輪，從 canonical files 取原文，不讀 preview textarea 或 hidden form content。保存版本取已核對的預覽 draft，其他入口保留各自 scope／revision 規則。

`text-download-dom.js` 將原 bytes 放進原生 Blob，用暫時 anchor 的 download 送出。沒有 HTTP body、form 換行轉換或外網呼叫。最多同時保留兩個 object URL；送出後一秒釋放，失敗與 pagehide 清理自有連結及 timer。頁面恢復後可繼續使用，明確 dispose 才關閉 adapter。二進位 ZIP／備份仍走既有有界 HTTP staging；相容的 `/api/export` 及 v41 json-string transport 保持原契約與 2 MiB request 上限。

只有 send 成功返回才更新下載待確認紀錄。接受條件 controller 的可選 send callback 在更新 pending 前執行；失敗保留先前 pending 與後續編修。送出代表交給瀏覽器，使用者仍需核對保存檔後明確確認；程式無法保證作業系統已保存或接受瀏覽器拒絕的下載。後續編修不能因確認舊檔而變成已另存。

## 工具與驗證界限

Agent／CLI／MCP 的 application 與 filesystem 邊界保持，沒有新增下載、寫檔、網路或路徑工具。12 基本／17 啟庫工具；Agent protocol1／draft3／package1／inspection1／comparison1／report1 分別管理。來源工具版本明確支持 0.38–0.42，未知拒絕，Agent inline 512 KiB 與行 2 MiB 保持。

本輪真瀏覽器檔案與來源 ZIP／Python 報告逐 bytes 核對，包含正好 8 MiB、空檔及混合控制字元。測試 Blob download event 觀察曾逾時，但檔案實際已保存且逐 bytes 相同；以落地檔驗證，沒有把事件逾時當下載失敗重送。正式媒體、實聽、完整視覺及特定 Agent Host 仍未驗證。見 [QA](QA-v0.42.0.md)。
