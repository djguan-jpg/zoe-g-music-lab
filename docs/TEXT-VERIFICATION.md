# 完整原文核對契約 v1

現行三文字入口提供有界差異前後文，完整七欄proof與即時選檔焦點保持，晚回覆不搶焦點。見[契約](TEXT-VERIFICATION-CONTEXT.md)。以下保留歷史描述。

現行取消後的鍵盤焦點契約見[焦點分層](TEXT-VERIFICATION-FOCUS.md)。明確意圖只留在 DOM adapter，來源 context epoch 為共用內部 view metadata；原取消及 read 上限保持。以下保留歷史契約。

現行三入口取消與每個核對器最多兩個實際未結束read，見[取消契約](TEXT-VERIFICATION-CANCEL.md)。以下保留原v86契約與版本資料；現行版本支持以唯一policy及DELIVERY-VERSIONS為準。

建立成果並選擇檔案後，以「核對下載的原文」明確選回本機檔。比較目前成果 canonical 字串的完整 UTF-8 bytes 與 native File.arrayBuffer() 返回的完整 bytes；不比較 textarea 預覽／摘錄。相同內容即使檔名不同仍一致，換行、BOM、NUL、Unicode 與結尾不同均會有差異。空成果及空檔可以相同，空檔與非空成果顯示差異。

| 層 | 責任 |
| --- | --- |
| web/text-verification.js | 重用 text-download.prepare 的 canonical 名稱／Unicode／8MiB 規則；純 bytes 比較，第一個0起差異與有限 metadata |
| web/text-verification-controller.js | 注入 capture／describe／readFile／callbacks；讀前上限、latest generation、完整 canonical source 與讀後 metadata/長度核對 |
| web/text-verification-dom.js | 明確 native File 身分、arrayBuffer、literal textContent、aria-live、picker 清空、pagehide cancel |
| web/app.js | state.textVerification；目前 scope／resultRevision／busy／dirty／visible／state.files[selectedName]，不取 preview 或隱藏表單 |
| music_lab_server.py | 只新增三個固定 JS GET 資產；unknown POST 仍404 |

expected 使用 `{name,content}`，沿既有可攜成果檔名與嚴格 Unicode、完整 UTF-8 最多8MiB。selected metadata 僅 `{name,size}`；name 是非空 basename，最多512 codepoints／1024 UTF-8 bytes、無 ASCII controls／斜線，size為0–8MiB safe integer。不要求與 expected 同名；選定名稱只作 literal 顯示，不成為來源或目的路徑。沒有 accept 副檔名限制，因為本功能只比較位元組，不解析、執行或改寫內容。模型只接受 Uint8Array；不接受其他 typed view。明確選檔先檢查 File.size，超過限制不呼叫 arrayBuffer；讀後再次核對 name/size 和實際 bytes 長度。

inspect 複製 candidate bytes、準備 expected 完整 bytes；若相同則核對全部 bytes，否則回報第一個不同的位置，長度差異在共用前綴尾端。回報 `{format:'zoe-text-byte-verification',schema_version:1,expected_name,expected_bytes,selected_bytes,matched,first_difference_byte}`。一致時 first_difference_byte=null。這是本頁 finite view1，不是新的外部 operation／Agent wire／領域 schema；不回傳原文或 bytes，不製造來源 SHA 或作者證明。

capture 嚴格六欄 `{scope,revision,busy,dirty,visible,source}`；scope 為四工作台之一，revision 非負 safe integer，三個 flags 為 bool，source 為 null 或僅 `{name,content}` 的字串副本。只能在 visible、非busy、非dirty且有成果時讀檔。開始讀檔、await後、inspect後及 finally 都以 current capture 檢查 scope/revision/name/完整content與狀態；新 request／cancel／dispose 使舊 generation 失效。晚成功／失敗不提交報告或錯誤，metadata 漂移、錯 bytes 長度、I/O錯誤保留原成果及後續編修，可重新選檔。

refresh 清除失效 proof，只取 canonical 字串與 metadata，沒有再次編碼／copy bytes／File讀取。app 的 say／busy／setFiles／clearOutput／markDirty／output select共用 refresh；controller 位於既有 state，沒有額外 free lexical 依賴。inputIndependent 交付仍沿既有dirty規則。返回另一台或選回舊成果也必須重新核對。picker 在 change 時清空，允許重新選同檔；pagehide取消pending，adapter dispose只移除自己的listener。不新增timer／常駐服務。

成功／失敗都只回報文字。onReport 不會 setFiles、markDirty、confirmDownload、保存草稿或呼叫HTTP；檔案內容、編修、媒體與draft retention checkpoint保持。report、File、原文來源與選檔bytes不进draft3／草稿庫／備份／Git。讀取期間與外部同時改寫檔案不保證原子快照，也不保證檔案稍後仍在磁碟。核對相同僅證明本次讀到的內容與目前成果一致；保存、作者／權利、校時／實聽、媒體成品或平台創始身分須各自驗證。

原下載程式、standalone 歌詞preview、application、CLI、Agent與MCP保持原樣；基本15／明確啟庫22、Agent1／draft3不變。這個 UI 核對不給 Agent 選檔、路徑或寫檔權限。產品86／supported38–86，未知87拒絕；版本支持明確列出，不推算範圍。
