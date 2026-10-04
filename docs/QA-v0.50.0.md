# v0.50.0 驗證

428 Python／641 JavaScript／53語法／4 Skills、git diff --check全數通過。十二個新 Python與十二個新 JS：空白／tab／HTML／BOM／Unicode separator 原文 roundtrip，只有相鄰行首tag／獨立last offset／三種換行，單次文首BOM、無效秒數／超界／負位移、5000位數與前導零，actual Python/Node corpus、CLI原檔不變／JSON-lines錯後接續／MCP12工具／HTTPasset與script順序。LRC controller 保留預覽前draft，拒絕 self-consistent 但wrong-source 的文字／開始／結束／句數及單獨LRC／SRT artifact替換；估計／多tag／BOM與retry核對。沒有模型或新依賴。

baseline四案例實測 `[00:01]  原文\t  ` 被strip；句中timestamp新增cue並丟前文；句中offset移位；Unicode分隔符截斷。本輪兩種語言純解析與共享time-normalizer、source-response核對修正。相鄰行首timestamp字面仍有多tag歧義，不誇稱所有LRC字面都可無損；文件／介面提醒用版本1JSON。preview.html只檢查存在與文字型別，未宣稱完整HTML來源語義驗證。

原生tab84 v50：97byte合成LRC先preview，原文／空table／empty output保持；兩cue開始1.125／4.625、結束4.625／10，原空白／inline tags／Unicode全部相同。Space明確Apply，JSON及表格原值一致；raw-fields標示特殊CR／CRLF／tab完整保留，再「讀取歌詞」得到同cue。Undo恢復原文／empty table、保留music title=v50 保留其他工作台；成果保留並標stale、停用下載。最初assert誤以為draft Undo會刪成果，觀察既有策略後更正驗收，不把這當產品故障。錯檔秒60拒絕且保留；多tag preview1.375／2.25、取消不套用；再次匯入與重建保留字面，明確句尾後inferred_count=0。

三寬度390／1024／1800：doc scroll375／1009／1785；import／source right359／973.1640625／1299，提示正常換行，無文件橫向溢出。viewport reset、tab84關閉、warn／error0；server PID341888／原session7304正常exit0，context關閉、lazy staging未建立。三個輸入合成檔SHA保持。未使用實際音檔，不宣稱媒體實聽或完整視覺驗收。

實際點擊下載LRC，頁面顯示已送出原文下載；IAB download event 15000ms逾時，保存檔未觀察，沒有重點擊／重啟。純模型與CLI輸出已核對不等於瀏覽器保存完成。

v49指定ZIP1045492bytes、SHA7ad570e2d7f56501bdcb6254775a2fa93ec506283736788945c4b0b93c1a0d33，還原416／629通過、限定暫存移除。本輪指定source ZIP再全測；private PR／prerelease／actual遠端assets digest／CRC／legal4／source-main tree／refs-clean及latest50／49／48／typed job維護依outputs/v50-qa收據。>7天且exact Git/tag可重建才清除，failed v36／unknown／素材／草稿／backup／其他程序保留。

正式媒體／實聽、完整視覺、特定Agent Host、瀏覽器保存檔及FreeTWAI創始認定未驗證；platform not_submitted，rolling active。
