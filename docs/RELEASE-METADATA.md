# 發佈資料與預期標籤（v0.80）

`musiclab/assets/delivery-versions.json` 的 current 仍是唯一執行期產品版本來源。`projects.json.version` 必須相同，既有 `release_version` 明確定義為該來源預期的 GitHub tag：`v` 加產品版本。兩者不是發佈成功、Repo 公開或平台創始身分證明；GitHub 實際狀態仍由獨立遠端回覆及下載 receipts 記錄。

| 層 | 責任 |
| --- | --- |
| release_metadata 純層 | 驗證完整明確 policy、metadata.version、delivery_versions_schema_version1、精確 expected tag；回傳 frozen version/tag |
| 嚴格 JSON | projects metadata最多64KiB、原policy8192bytes；UTF8／Unicode、duplicate keys及非有限值拒絕 |
| Git adapter | 對已解析 immutable commit 的兩個固定 blob 先 cat-file size，再 show及核對bytes；不讀工作檔來替代指定來源 |
| package adapter | 建立目錄前核對 metadata；archive內metadata及policy再次核對，沿原ZIP／完整test／Agent／MCP驗證 |
| publication QA | merge／tag／release前與selected source expected tag核對；實際remote receipt另外記錄 |

純層接受已解析 metadata 及 policy descriptor，不讀路徑、不發送網路、不改輸入、不推測標籤。產品版本文法及遞增support規則共用delivery policy，不複製另一份版本文法。未涉及的project欄位保留，不假裝完整project schema或license驗證。

`scripts/package_release.py --ref <commit>` 只取指定commit的 projects.json 及固定policy；工作目錄檔案更動不影響選定版本。過期tag、錯product、未知schema、重複JSON及超大blob在建立outputs/releases目錄／archive之前拒絕。source Zip內完整metadata還須與selected Git值相同，不靜默改寫過期metadata。manifest1只增加checks.release_metadata=passed，其餘既有格式／retention／schema保持。

舊v0.79 source的release_version為v0.77.0，新packager會明確拒絕重新封裝這份不一致metadata。已驗證的舊ZIP、Git tag及原packager保持，可用原source Git archive或原ZIP還原；不追改歷史作品。這輪驗證新guard拒絕時舊manifest／ZIP SHA完全不變。舊封裝仍沿原maintenance判定，不將新增檢查倒推為歷史已通過。

產品0.80.0、明確交付38–80共43項、unknown81拒絕。Agent1、draft3、14基本／明確啟庫21工具、HTTP／工作台／領域wire及schemas保持，沒有新增模型、依賴、Agent路徑／写入／網路權限。PolyForm Noncommercial、private及FreeTWAI not_submitted保持。
