# v0.33.0 本輪交接

本輪修正草稿原值遺失：合法shape3未完成數字、全形／underscores／留白、未知畫幅，以及瀏覽器會改寫的CR／LF／NUL都可原樣保存。新增純raw控制器與DOM adapter，來源與顯示分開；明確編修採新文字。排序、刪除還原、時長撤回、草稿另存與歌曲／分鏡報告共用capture。完整建立仍檢查既有資料與時間契約。

原始來源保持ZOE. G署名／djguan-jpg帳號、PolyForm Noncommercial1.0.0、private與FreeTWAI not_submitted；四份法律／創辦紀錄Git blobs保持。基本9／明確啟庫14工具、Agent protocol1／draft3／各report1未改。只讀本工作區，不參考其他本機或本人GitHub作品，不增依賴、外網或模型呼叫。

## 驗收與範圍

267Python／413JS／4Skill／32語法／diff通過；24IAB項目、原生草稿四panel逐值相等、12數值與畫幅／8特殊欄位、排序及三工作台刪除還原、明確編修、兩原值report／四adapter、390px Enter／原音檔／晚回應及來源不同保護、修正後三完整成果建立。詳見[QA](QA-v0.33.0.md)與[分層](RAW-FIELDS.md)。沒有宣稱完整視覺／實聽。

## Git、封裝與還原

branch `codex/iteration-v0.33.0`；restore `restore-v0.32.0-before-v0.33.0` 指main起點 `bf93ef8cf6e77ceb8211edeb8eba1cc6f1044780`。前版指定v0.32 ZIP712132bytes／SHA `8f844fb6f1d4bec06697cd628d91697791d39b2700914934eae8f5f9f7ab1a5b`解壓267／400通過、限定暫存已移除。指定source commit封裝與manifest、private PR／Release及遠端實際bytes依 `outputs/v33-qa/source-evidence.json`、`package-evidence.json`、`pr-evidence.json`、`release-remote-evidence.json`；ZIP只含Git指定commit，排除outputs／素材／秘密。

先另存未提交編修，再 `git switch -c codex/restore-v0.32.0 restore-v0.32.0-before-v0.33.0` 或archive到新目錄。main以revert／private PR恢復，避免reset或強推。Git不保護使用者草稿、備份與素材，須另存。

每輪限定盤點outputs與本輪已確認正整數PID，保留最新v0.33／v0.32／v0.31封裝。僅超過7天且遠端或Git可重建才列清除候選；草稿／備份／素材排除，未授權不清其他專案或程序。本輪服務已正常停止、owned tabs關閉／viewport復原，最終檔案數、SHA、PID及port8875依inventory-final／process-final／session-evidence收據。

正式媒體、實聽、完整視覺、特定Agent host、FreeTWAI提交／核准及原生file播放仍待。下一輪從具體可重現問題開始，保持restore／branch／驗證與指定commit封裝；rolling goal active，沒有把這輪交付當成無限目標完成。
