# v0.134.0 交接與可逆

restore-v0.133.0-before-v0.134.0固定5d2a5e5a6018e330048da1438a2e13c239f1860d，分支codex/iteration-v0.134.0。由tag另建codex/restore-*及PR審閱還原，不rewrite main或已發佈tag，不覆寫草稿／媒體、不撤銷投稿。

## v0.134.0 撤回最近複製

段落、鏡頭及歌詞各自新增「撤回最近複製」。只移除最近成功複製且原值未再修改的一列；其他原列後續編修保持。三台各存一筆，下一次成功複製替換該台紀錄，撤回消耗紀錄；載入新內容只清除該台。列數、顺序或stable IDs變更、複製列已填新時間／文字時整份拒絕；修回精確原值可重試。沒有更早一步或重做，鏡頭展開狀態不當作創作變更。

editor-copy 純 checkpoint／undoProposal及注入controller → editor-copy-dom字面提示／原生button → app局部writeEntries／dirty及原列焦點。私有紀錄只留目前after IDs、source／copy ID及一份複製值，不保留其他原列全文；三份紀錄沿40段／1000鏡／10000句上限。refresh不capture全部欄位；click-time完整來源、gate與實際after重查。busy／hidden／disposed拒絕，已達copy容量仍可undo，pagehide釋放紀錄；I/O或callback失敗不自動覆蓋後續編修。

645 Python（104.422秒）、1668 JS（新增21）、143語法及四Skills通過；集中36。33完整native快照核對四台全部欄位、完成歌詞匯入後21個原stable IDs；三種複製／撤回、原列編修保留、複製句新創作拒絕／修回重試、三台獨立紀錄及局部載入清除通過。四份歌曲成果前後逐一讀全文相同，dirty下載及未另存提醒保持。1280×720／390×844／1280×360均以Shift+Tab→Tab進入undo、Enter撤回5→4句，焦點回原句且頁面沒有水平溢出。

實際v133指定ZIP還原645／1647；384歷史交付ZIP／manifest原bytes及27組schemas保持。application／CLI／Agent／MCP／短命HTTP完整備份inspection一致，good-bad-good／200400200；10版export保留完整record／draft原bytes，原合成庫hash保持。產品134／唯一來源38–134共97版，未知135拒絕；20／27工具、Agent1／draft3／backup1及maintenance schemas保持。沒有新增backend operation、路徑／網路／寫檔權限、依賴或模型呼叫。

一個受控QA server依原PID／creation identity正常shutdown、context close與deadline thread join，實際exec EOF；一個IAB頁關閉、viewport reset，console warn/error0。三PNG留忽略outputs/v134-qa，依使用者要求未嵌入；完整視覺／screen reader、瀏覽器落盤、media身份／實聽／同步、Host安裝與平台正式founder仍未驗證。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg與四份submitted_unverified投稿保持。

還原tag、codex分支、指定source封裝／SHA、PR與實際remote asset收據提供可逆交付。每輪只盤點本workspace outputs及typed same-host程序；無strict>7days且可重建候選不刪，保留草稿／媒體、failed QA、v77 alternate與partial36／53。rolling goal保持active。

# v0.134.0 原生操作 QA

流程：開啟127.0.0.1:8875 → 建立歌曲四成果並逐一讀全文 → copy段落、編修原列、undo → 既有LRC先預覽／Apply接四句 → copy歌詞、編修原句及複製句、拒絕undo／修回retry → copy鏡頭、編修原鏡、undo → 三台各copy一次、局部載入清除 → 三尺寸Tab／Enter undo → 回歌曲逐一讀四成果全文。

Browser plugin not available；專案沒有Playwright依賴或e2e workflow且不新增安裝。使用既有CUA的Playwright locators、唯讀DOM、viewport及本機固定server，依frontend-testing-debugging驗證。33完整快照含所有四台欄位與六種collection原字串／IDs；LRC明確Apply後21個原ID。不是只核對按鈕標題或mock。原有beforeunload未另存提醒與dirty停下載保持。

| 檢查 | 實際證據 |
| --- | --- |
| 頁面身份／非空白／無overlay | 正確title／localhost URL／version134，完整原創合成欄位及四成果 |
| 互動 | 三種copy及undo，原列後續編修保持；已改copy拒絕，修回retry；scope load及獨立紀錄 |
| Console | warn/error零 |
| Keyboard | 1280×720／390×844／1280×360，Shift+Tab到lyrics-search-find、Tab到cue-copy-undo、Enter後4句且原句焦點 |
| 尺寸 | 完整DOM viewport／client／scroll，頁面沒有水平溢出；不是完整視覺接受 |
| 截圖 | 三PNG留outputs/v134-qa，不依賴截圖宣稱全視覺，依使用者規則未嵌入 |
| 來源保持 | target局部剔除copy，其他panels全部exact相同；四歌曲成果全文相同，原合成保存庫hash相同 |

645 Python（104.422秒）、1668 JS，新21／集中36、143 syntax及四Skills通過。actual v133 ZIP2515834bytes／SHA0c4313fe61cda2ed842d5a178bfe7b5291c4e1a8f2d2249fbba1510c6202764e還原645／1647且來源不變、暫存移除。384歷史ZIP／manifestbytes、27schemas保持；備份完整五adapter回覆一致，20／27 tools；CLI預設拒覆寫及good-bad-good／200400200通過。

一個server正常shutdown／context close／deadline join及exec EOF，一個IAB頁close／viewport reset。截圖只保存沒有嵌入，完整視覺／screen reader、媒體File身份、聽音與音畫同步、browser保存落盤、Host安裝及平台正式核實仍未驗證。GitHub CI未設定；指定source封裝與遠端asset回讀以release manifest和本輪outputs收據為準。這輪原生UI未使用實際私人素材、未呼叫模型、未修改保存版本或平台投稿。


精確source、ZIP／SHA與GitHub merge／asset見manifest及outputs/v134-qa/source-evidence.json、release-remote-evidence.json。每輪只盤點本workspace outputs／direct封裝及明確typed same-host程序；strict>7days且latest3之外、exact tag／現場Git archivebytes可重建才清除。無候選不刪，保留草稿、媒體、failed QA、v77 alternate與partial36／53。rolling goal保持active，繼續可重現功能與Agent、直覺及視覺品質驗證。
