# 備份來源與恢復確認 · v0.71

工作台選取ZIP後先量測實際File，再核對預覽；明確恢復後，只有完整成功摘要與本次來源一致才顯示完成及更新清單。基線以真備份產生器重現wrong SHA／entry_count與無關restore回應被接受；新層拒絕，不自行更換備份或加入目前編修。

## File與純回覆層

backup-file.inspect為原生File.arrayBuffer／WebCrypto邊界：ZIP副檔名、1 byte–32MiB safe integer size；讀回ArrayBuffer大小須等File.size，digest須32-byte ArrayBuffer。返回隔離的bytes／sha256 proof，雜湊後不快取原buffer。此層量測ZIP原bytes，不解析壓縮內容；abc.zip已知向量只證明hash，不證明合法備份。讀取與digest可注入做失敗測試，production走原生API；不支援WebCrypto則拒絕，無弱雜湊fallback。

backup-result為無I/O／DOM／media／路徑的純checker，checkedInspect／checkedRestore都要求exact files/data/meta，files為空、meta exact current產品／protocol1／needs_review=true。沒有接受舊HTTP producer版本作為現場伺服器回應；備份內既有created_with provenance語義由backend保持，沒有從產品版本推算schema。

inspect exact data保留backup1、SHA／bytes等於File proof、selection all/selected、status backup_validated_not_restored。最多1000 entries；entry_count等實際entries長度；entry exact id／label／stored_at，ID draft-32lowerhex且unique、非空原label最多200 Unicode codepoints、UTC時間有界，Unicode不正規化。new_ids與conflicts各unique且存在entries，兩組不能重疊；new_count等new_ids長度，new+reused+conflicts=total；capacity_ok／can_restore為strict bool，can_restore等容量允許且零衝突。全部metadata返回隔離值，DOM僅預覽前20個名稱／保存時間。

restore exact SHA／added_count／reused_count／entry_count／status restored_drafts_need_creative_validation，SHA與File proof相同、total等原已驗plan，added+reused=total且均有界非負整數。不強制等於preview時new/reused分布；別的合法恢復或失去回覆的前次操作可能已加入版本，retry的added可變0。checkedRestore再次驗原plan；返回隔離摘要。純層不對ZIP entry原文或目標磁碟重做獨立驗證。

## 控制器與明確恢復

backup-transfer必須注入hashFile／checkPlan／checkRestore，缺少就拒絕初始化。inspect讀前清pending並進reading，hash後及request後各核對latest token；換檔／cancel的晚成功或失敗不upload／不preview／不覆蓋新狀態。只有已驗plan進pending，保存原native File identity與proof，callback取得隔離plan。現有focused controller測試明確注入hash fixture但使用真result checker；新的native File與actualHTTP測試另證明production bytes來源。

restore只在非reading／非restoring且plan.can_restore時可送出；同一原File與preview SHA由既有HTTP操作提交。成功回覆先完整checkRestore，才清pending及onRestored；錯成功摘要／wire／來源保持uncertain pending，明確retry沿同File／SHA，沒有自動重送。既有definite4xx拒絕清pending需重新預覽，500／失去回覆保留retry；恢復進行中不能cancel／換檔／重複送出。app backupRequest保留整份wire交checker，不只抽data。

inspect／restore／retry／cancel不載入創作，目前工作台、音檔、刪除紀錄、草稿另存狀態保持。backend仍核對來源ZIP SHA並只新增或重用相同ID／record bytes／draft bytes；真正完成後更新保存版本清單，再由使用者另行預覽及明確載入。已恢復資料不因取消preview或錯回覆而刪除。

## 信任與驗證界限

Python共用read_backup沿原bounded ZIP／CRC／manifest／所有revision bytes/hash，restore沿原capacity/conflict／lock及不可覆寫規則。browser獨立核對選定File總SHA及回覆形狀／來源／計數一致性，不獨立解壓ZIP、重建entries摘要或直接核對目標磁碟。不宣稱原子恢復、耐久寫入、外部同時改寫File的原子快照，或作者／權利／作品驗收。

CLI／Agent／MCP／HTTP backend輸入、wire與schema不變，三項Python實際跨adapter返回可由同純層接受；MCP inspect仍readonly、restore仍新增immutable版本。proof不進持久草稿／Git／Agent wire，無新增path、auth、模型、依賴或常駐服務。Agent1／draft3／library1／backup1、14基本／啟庫19工具、產品71／明確交付38–71保持。legal4 PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、private、FreeTWAI not_submitted保持。

## v0.72 共用原生雜湊

backup-file.sha256接受1–32MiB自有ArrayBuffer、原生WebCrypto及32-byte digest；inspect沿此helper量測選定File並仍核對File.size。下載另經[完整下載契約](BACKUP-DOWNLOAD.md)，File proof／恢復wire checker保持。雜湊不解析ZIP、證明作者或保證保存。
