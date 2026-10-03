# v0.31.0 驗證紀錄

2026-10-04，本機 Python 標準函式庫、Node 與 Codex IAB。本輪只讀本次工作區及通用工具，未參考其他本機／GitHub／歷史作品、記憶或 vault；資料全為本專案原創合成案例。

## 基線與檢查

main 基線212bf654285d6ff6b47aa7f3df675df778d17c0c；restore-v0.30.0-before-v0.31.0保留該提交。實際 Agent discovery 缺少music_review，同一operation真stdio拒絕並正常EOF退出。IAB49第三段留白可定位，但無報告按鈕或成果可交付。這輪補上共用純診斷、四adapter、schema與工作台明確報告動作。

258 Python／391 JS、四份Skill、29 JS語法及diff通過。新增9 Python／9 JS；包括原列、原始Unicode／底線／空白數值、來源副本隔離、8 MiB精確邊界、最大400待辦／200明細、CLI兩種來源／0及2及1狀態／未知草稿拒絕／預設不覆寫、真HTTP／JSON-lines／MCP錯誤後恢復與EOF、8／13 discovery與唯讀無路徑schema。

75組真Node與Python完整報告／Markdown逐值一致；v0.30既有69欄位與29數值對照仍在完整回歸內。欄位零待辦卻推得總長超限仍由完整music拒絕。初次三個fixture匯入把tests當package，依既有unittest discover模組路徑修正，產品未放寬。

## 原生瀏覽器與交接

IAB50共18項assertion通過，console warning／error為零，詳細見outputs/v31-qa/browser-evidence.json。

- 三項未完成歌曲先即時定位原第三段任務，原值保持；報告接受空白任務、2.5小節及空白交付項目的診斷，JSON保持原BPM字串120.0004、原列及其他工作台／音檔。
- 兩份成果由原生下載表單下載，定位按鈕仍可聚焦原欄位；後續編修停舊定位與下載。實際一致但不同source的報告、report JSON版本999都拒絕，前次成果字串保持。
- 真四秒延遲報告停用兩個檢查控制與待辦；期間仍編修原任務。晚回應保留原成果及後續文字，下載停用，重建後為兩項目前待辦。無重送、重啟或重複job。
- 修復原小節及交付欄位後為fields_checked／零待辦，仍明示完整建立與實唱／實聽；既有歌曲完整建立獨立通過、136秒與120.0004精度及source核對保持。
- 390×844下Enter建立報告／定位原任務。頁面內容375px，待辦框left16／right359／width343；check右邊254.9765625、report右邊232.9765625，兩控制均在可用寬度內。只做DOM幾何與互動，未完整視覺；viewport已reset。
- 20段報告全數28項、UI前20項有明示；移除新增的14個留白段後，原六段、後續任務及音檔保持。原四鏡保持。

實際native JSON3098bytes／SHA82c90decf87ac1ff27b23f952e3c24666ab36912b7a3320b034b1f57493ad0a0，Markdown436bytes／SHAebca83fea106b733ea02040a710afee0763457ba4f3c14538cb3b1a6ebc94ca3；與application／HTTP／CLI／JSON-lines／MCP核對。native CRLF對wire LF只在文字比較時規範化，原bytes／SHA另存，沒有宣稱raw bytes相同。CLI待辦輸出status2、再次相同輸出status1且bytes保持；兩stdio正常EOF，沒有模型或隱藏寫檔。

真native草稿5891bytes／SHA16208dff5ee6a493cd63d67b4d3d7460a1347c26d05f0743b4aa0290daa6329a，tool0.31／schema3，原六段、原四鏡、BPM字串及晚回應期間任務保持，沒有ID／待辦／report／media。共用草稿驗證後，實CLI --draft與Agent產生同一零待辦結果，原檔不變；確認實檔後才按「已確認草稿檔案」。之後重建報告不改已另存狀態或原合成六秒音檔。

## 封裝與維護

前版v0.30 ZIP666048bytes／SHAaf30de80a13871348a945de27df0f6bd9d9f4e8999fb7d62cf45727ff8481c2c；解壓249Python／382JS通過，限定暫存正常移除。本版指定commit封裝重跑完整測試與Agent／MCP metadata，privatePR／合併／Release／遠端bytes／Git refs以manifest及outputs/v31-qa收據核實；GitHub無配置CI，不把本機檢查當遠端CI。

LICENSE／NOTICE／LICENSING／FOUNDER-RECORD四個Git blobs保持。owned49／50tabs關閉，兩managed服務正常shutdown；只查本輪確定PID、8875及本專案outputs，最新三版ZIP核SHA。超過七天且可由Git tag／已驗遠端重建才列清除候選；草稿／備份／原素材保留。實際程序／埠／刪除數見inventory-final.json。

完整視覺、正式媒體／實聽、特定Agent Host、其他OS／browser、原生file播放與FreeTWAI投稿／創始資格仍未完成；舊file政策阻擋未嘗試或繞過。rolling active。
