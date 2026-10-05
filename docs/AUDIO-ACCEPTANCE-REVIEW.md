# 音檔接受條件診斷 v1

v0.64 在「自己的收件規格」提供「檢查自訂條件」與「建立條件檢查報告」。前者一次檢查取樣率、位元深度、聲道數，點選待辦會定位原欄位；後者建立同來源 JSON／Markdown。未完成條件仍可另存。診斷不補填、不修剪原文、不選音檔、不改聲音，也不代表實聽、交付或權利接受。

| 層 | 責任 |
| --- | --- |
| audio_acceptance.py／audio-acceptance.js | 原始 draft1 驗證與共享 field_values／fieldValues；prepare 仍完整拒絕無效的啟用條件 |
| audio_acceptance_review.py／audio-acceptance-review.js | 純三欄診斷、固定訊息與 Markdown；JS 從本次原文派生預期報告並核對完整回覆 |
| application／tool_contracts | 相同 readonly operation 與精確 request shape，傳輸不授予音檔或路徑權限 |
| readiness-state／audio-acceptance-review-dom | 原條件快照、定位前重查、stale 提示、文字與焦點呈現 |
| app／CLI／Agent／MCP／HTTP | 明確操作、current／late 保護、輸出及傳輸；保存仍由既有條件草稿流程管理 |

## 原值與結果

輸入只接受 `{ "document": <zoe-audio-acceptance-draft schema1> }`。原草稿最多64 KiB，每欄1024 Unicode字元、64個值，正整數上限9007199254740991；保留中文逗號、字面空白、Unicode數字、順序與重複值。沿用有限十進位文法與精確整數檢查，長小數不因浮點捨入變成整數。過大指數造成的 Decimal InvalidOperation 現在轉為受控正整數錯誤；Python／JS拒絕一致。

啟用自訂時三欄全部診斷，固定 rates→bits→channels 順序，最多三個 issue（missing_value／too_many_values／invalid_value）。任何一欄無效時 effective_acceptance=null、analysis_ready=false。三欄有效才回完整接受值，status=fields_checked。停用自訂時保留所有原值，三欄 status=inactive，不把未使用的留白判為阻擋；effective_acceptance 回示範條件、status=preset_active。

輸出 `zoe-audio-acceptance-review` schema1 含完整原始 source、各欄狀態與value_count、issue_count／issues、analysis_ready、effective_acceptance 與固定 review_notes。回傳兩檔 audio-acceptance-review.json／.md；meta.needs_review 始終true，包括零待辦。analysis_ready 僅代表條件可解析，不是音檔接受。

JS 在 current 核對之後才檢查產品版本、protocol1、精確外框／檔名、嚴格 JSON、全份 data／source 與逐字 Markdown。每檔256 KiB、嚴格Unicode；未知或錯來源回覆保留上一份成果與編修。回覆核對沒有獨立量測 PCM；實際分析仍沿既有 native File SHA、PCM／LUFS 與完整報告 guard。

## 接口與操作

CLI 的 --input 明確選原條件草稿檔（不包 document）；0=條件可解析、2=診斷已完成但有待辦、1=格式／I/O錯誤。預設拒絕覆寫，明確 --overwrite 才取代同名成果。

```powershell
python music_lab.py audio-acceptance-review --input conditions.json --out outputs/conditions-review
```

Agent operation／MCP tool 都是 audio_acceptance_review，payload 用 document；HTTP POST /api/audio-acceptance-review 使用同一 payload。沒有媒體讀取、任意路徑、草稿寫入或模型呼叫。基本14／明確啟庫19工具；Host須重新 discovery。Agent1、draft3、acceptance-draft1 與 PCM／LUFS報告保持；新診斷schema1獨立。

本機定位在原值編修後停用，重新檢查才恢復；busy 時禁止新操作。條件報告建立不動原媒體，自訂原值、原草稿保存提示與未確認下載狀態保持。新增內容是暫態診斷，不進專案草稿。
