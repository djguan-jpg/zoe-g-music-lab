# 原分鏡時間檢查

v0.34新增獨立時間檢查。創作欄位與母題待辦為零時，`二十四` FPS 或 `12e` 秒仍可能無法建立分鏡；這裡先列出原位置，保留未完成稿，不推估或修改值。

## 工作台

在母題分鏡按「檢查時間待辦」，點待辦會展開並定位原鏡欄位；FPS／總長定位原控制項。開始、結束、FPS、總長或鏡頭來源修改後，上一份定位停用，須重查；創作文字單獨編修不讓時間快照過期。鏡頭穩定暫態 ID 防止相同秒數的列換位後錯指原列；不將 ID、診斷或移動狀態寫入草稿。

檢查秒數與影格各自的空缺／重疊、非正鏡長、超過宣告、短於一影格及尾端不符。FPS「24」、鏡頭1結束`.06251`、鏡頭2開始`.0616`，雖相差不到1ms，映射已重疊一影格，仍列第二鏡開始與前鏡1。局部有效秒數列只代表兩端有限、範圍／正鏡長及已知宣告界內；相鄰、影格或全份驗證可能仍有待辦。

「建立時間報告」提供原來源 JSON／Markdown，頁面最多定位20項、報告最多200明細，全部1000列仍計數；明示截斷。建立完整分鏡先創作欄位、再時間待辦、最後既有完整 domain／連戲。時間零待辦不表示已生成或校準媒體。

「採用鏡尾為總長」重用同一時間診斷及有限十進位規則，明確採用原鏡尾字串；「撤回總長接續」只還原原總長。全形數值、底線格式依 Python 與 JS 共同數值規則；中文數字、十六進位或不完整指數列待辦，不偷偷轉換。

## 四個介面

```powershell
python music_lab.py storyboard-timing-review --input examples/unfinished-storyboard-timing-review.json --out outputs/timing-review-run
python music_lab.py storyboard-timing-review --draft 已另存的草稿.json --out outputs/timing-draft-run
```

--input／--draft互斥。--draft只接受完整已驗證 modern schema3，再明確投影時間；未知版本拒絕，不靜默遷移。CLI退出0為時間零待辦、2為成功產生待修正報告、1為失敗；輸出預設拒絕覆寫，--overwrite才替換指定輸出。

HTTP POST `/api/storyboard-timing-review`、JSON-lines operation及MCP tool `storyboard_timing_review` 的 payload相同：

```json
{"panel":{"fields":{"mv-duration":"1","mv-fps":"24"},"shots":[{"start":"0","end":".06251"},{"start":".0616","end":"1"}]}}
```

欄位精確，不接收創作、媒體、路徑或版本覆蓋。fields與shots只收原字串，原順序與鏡號保留；來源最多1000鏡／8MiB，傳輸另受2MiB、CLI完整草稿1MiB限制。未知欄位、無效Unicode及容量超限拒絕。Agent protocol1、MCP2025-11-25、draft3和既有報告版本不變；基本10／明確啟庫15工具，重新 discovery。

## 報告與邊界

`storyboard-timing-review.json` 格式 `zoe-storyboard-timing-review`、schema_version1；status為needs_correction或timing_checked。source保留精確最小來源；total_shots／timed_shots／total_frames／issue_count／issues／details_truncated／review_notes。無效或缺少全域時鐘時total_frames為null；合法但短於一影格宣告可為0並列待辦，沒有用0冒充未知值。

issues含scope、原row（global0／鏡頭1起）、field、code、message及related_row（無則null，相鄰前鏡才提供）。固定code：missing_clock、invalid_number、invalid_range、short_declaration、no_shots、nonpositive_duration、beyond_declaration、seconds_gap、seconds_overlap、short_frame、frames_gap、frames_overlap、tail_seconds、tail_frames。無效列停止依賴它端點的接點檢查，其他列繼續，不猜上一鏡尾。

秒數容差與完整planner共用0.001+1e-12秒；影格沿用最近整數、半幀取偶數、結束不含。完整JSON／Markdown與Python／JS資料逐值核對後才提交。meta.needs_review始終true；未通過全創作／連戲、實際畫面與音檔、權利驗證。報告不進draft3，不接收舊或未知版本當完整成果。

## 分層與回復

Python `storyboard_timing.py`只做部分時鐘診斷，`storyboard_timing_review.py`負責來源shape、獨立版本與JSON／Markdown，application提供同一服務，CLI／HTTP／Agent／MCP負責I/O。已有完整creative planner保持接受路徑，103跨語言樣本核對時間零待辦和完整時鐘接受一致；不以文字包裝宣稱AI生成。

前端 `storyboard-timing.js`為純數值／報告核對／readiness-state控制器；app只捕捉原欄位、渲染定位與請求。總長接續共用純診斷，不各自維護不同的數值接受規則；raw-fields仍保留原值。版本、protocol和schema獨立管理。還原見[本輪交接](HANDOFF-v0.34.0.md)。
