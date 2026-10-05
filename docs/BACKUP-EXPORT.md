# 唯讀草稿庫備份匯出 · v0.73

Agent/MCP現在可以從啟動時明確選定的草稿庫建立備份，預設只取得摘要。需要完整ZIP時，明確include_archive=true，ZIP最多512 KiB，超限需分批選保存ID或用既有CLI draft backup --out另存。本工具不寫檔、不讀其他來源目錄、不納入媒體／成果／未保存編修。

## 使用與發現

Agent以--draft-library選定來源；不需要--draft-backup。重新讀capabilities或MCP tools/list：基本14保持，啟庫20（原19加draft_backup_export）。輸入payload={}匯出全部版本摘要；ids省略表示all，明確ids表示selected。先draft_list取得實際保存ID，再用ids清單，不使用名稱或路徑代替ID。

Agent請求：{"protocol_version":1,"id":"backup-summary","operation":"draft_backup_export","payload":{}}。需要inline時payload改為{"include_archive":true}；MCP tools/call的name=draft_backup_export，arguments={"payload":同一payload}。CLI新增draft backup-export --library已選定目錄，可加--ids保存ID清單及--include-archive，只輸出JSON到stdout；不接受--out/overwrite。既有draft backup --out才明確另存磁碟ZIP，不覆寫。HTTP POST /api/drafts/backup/export使用相同payload及Result wire，仍只在127.0.0.1且維持Host/Origin規則。

回覆files={}，meta為當前產品/Agent protocol1/needs_review=true。data的format=zoe-draft-backup-export、schema_version=1、固定archive_name=zoe-music-lab-backup.zip、status=prepared_not_saved。backup含backup_schema_version1、backup_sha256、bytes、entry_count、selection；revision_ids來自完整ZIP的排序保存ID。explicit且<=512KiB才增加archive_base64；default完全沒有該欄位。摘要不含草稿原文，inline則包含已保存草稿與紀錄，請依明確來源與所選IDs使用。

## 分層與來源

draft_backup.selected_ids為共享純validator，1–1000個不重複draft-32lowerhex IDs，返回排序隔離list；原CLI file producer與新export皆重用。checked_request只接受ids/include_archive，include_archive strict bool，明確ids=null/空清單/重複/未知欄位/來源或目的path皆拒絕，拒絕在library讀取前。來源庫仍為adapter啟動時注入，不由JSON指定。

application沿既有export_library_backup/export_backup建立本次raw。backup_export.prepare是純bytes ZIP codec，以同一次raw的read_backup完整核對bounded central directory、ZIP CRC、strict manifest、所有immutable record/draft bytes/hash/schema。再核對producer五欄摘要的精確type和值、selection及指定IDs與全部ZIP revisions一致。不從外部任意summary或重開來源混搭；庫原版record/draft bytes保持。all包含producer已讀到的版本；不宣稱外部同時改寫時的全庫原子快照。

PreparedBackupExport只保存不可變bytes/sha string/selection string/ID tuple，summary每次產生獨立dict/list；修改返回摘要不改下一次回覆。include_archive再次strict bool，raw ZIP>512KiB在base64 encode前拒絕，metadata仍可取得。ZIP原容量32MiB／展開64MiB／1000版及每稿1MiB保持，不放寬成全inline大回覆。每次export含當次created_at，兩次同IDs export的ZIP/SHA可不同；核對同一次raw，不比較不同建立時間的包。

## schema與傳輸

export schema1是回覆envelope，與內部backup1、draft3/library1、Agent1及產品版號分開。新tool inputSchema只含optional ids和strict bool include_archive、additionalProperties=false。MCP outputSchema只針對此tool具體描述data格式/版本/固定狀態、全部backup欄位、unique bounded IDs及optional base64<=699052字元；files須空、needs_review固定true。其他工具沿原generic outputSchema。capabilities的draft_backup_export.data_schema提供同一純模型，每次返回新物件。schema形狀不能驗證base64對應SHA、CRC或ID計數關係；producer的完整domain驗證才證明本次內容一致。未知payload schema_version/format等欄位不能藉此切換版本。

CLI、JSONlines、MCP structuredContent及HTTP都沿同application Result。MCP readonly/destructive=false/openWorld=false；沒有新來源path、目的path、restore或save權限。有效但不存在的ID沿既有OSError/io_error邊界，Agent/MCP只顯示選定庫無法讀取的訊息，不洩漏私人路徑；錯請求後可以接續下一個好請求。HTTP舊prepare仍只接受{}並回原六欄descriptor；原File備份及inspect/restore保持。

## 狀態與驗證界限

prepared_not_saved表示工具建立並核對備份資料，沒有磁碟保存、備份耐久、作者/權利/創作品質或平台接受。明確QA helper從四adapter返回inline解碼保存到忽略outputs，再以既有read/restore驗證CRC/manifest/所有源與還原record/draft bytes及原ID/時間相同；不把QA另存視為product自動寫檔或瀏覽器保存證明。這輪未改browser assets/UI、沒有新原生下載驗收；v72瀏覽器Blob保存限制保持。

無新依賴、模型、對外網路、auth/session或常駐服務。legal4 PolyForm Noncommercial1.0.0、ZOE. G/djguan-jpg、private、FreeTWAI not_submitted保持。詳見QA-v0.73.0.md及HANDOFF-v0.73.0.md。
