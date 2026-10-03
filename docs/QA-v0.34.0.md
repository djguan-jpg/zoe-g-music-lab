# v0.34.0 驗證

本機合成資料；只讀本次新工作區與通用工具。新功能是原分鏡時間待辦，不變更完整媒體或創作的接受聲明。

## 自動檢查

281項Python、431項JavaScript、四Skill、33個JS語法及git diff --check通過。新增14Python／18JS覆蓋原字串、未知shape／版本／路徑、Unicode有限十進位、空白與0、秒數／影格邊界、1000列／2000待辦與200明細、無效前列、時鐘零不接受不完整創作、report來源／data／JSON／Markdown矛盾、列ID替換／排序過期、晚回應、實際CLI／HTTP／stdio及10／15discovery。舊MCP EOF測試改用2+len(cases)，新增唯讀工具不冒充通知回覆。

103樣本由真正Node產生完整report／Markdown與Python逐值相等，並用完整storyboard domain驗證clock接受一致：六種FPS、半幀附近、容差、尾端、高值／子幀、全形／底線／錯誤數值。精確案例見tests/test_storyboard_timing.py的跨語言測試。既有創作report1保持，未改寫成時間report。

## 真瀏覽器與原檔

IAB分頁55完成11組行為：原稿創作0但時間2待辦，完整建立定位FPS；修正後定位第三鏡12e；不到1ms的影格重疊定位第二鏡開始／前鏡1；全形原鏡尾明確採用並撤回原9；修正後完整建立24影格／五檔；四秒晚成功和500後編修保留；不同來源／未知JSON版本拒絕；390px Enter定位尾影格；創作單獨編修保持時間快照；20列40待辦只顯示20定位並明示全數。

原生draft3下載與載入來源的四panel相等（原數值／未知畫幅和特殊字元保留）；raw／frame／valid三份時間JSON與共用application、實際HTTP、CLI --draft、JSON-lines Agent、MCP相等，原生Markdown也相等。CLI待辦退出2／時間零退出0，重複輸出退出1且bytes保持；未知draft4拒絕且無輸出。實際啟庫MCP15工具、Agent describe15，基本10，唯讀呼叫沒有寫入庫；臨時庫移除，stdio EOF正常。

原合成音檔6秒，診斷／報告／完整建立期間同blob與metadata保持，來源SHA-256 `2555a613adb120e97254d51e67841193f7481d5058450ef9e77b86d6088b5323`。只驗媒體選擇／metadata與來源bytes，沒有實聽或同步驗收。

390x844 DOM幾何：頁面scrollWidth375，時間區left16／right359，各按鈕在界內；Enter可展開定位、aria-invalid標原欄位。沒有截圖或完整視覺接受。最後原生另存bulk草稿與來源相等並確認保存，viewport復原、刷新版本0.34無console error、owned分頁關閉，本輪服務正常停止。

## 還原與發佈證據

前版指定v0.33 ZIP725772bytes／SHA `6f32258d04dd9450eb4ca2e5f91d6e68871569fbd57201e8c9323d0d5d16fa27` 核對與解壓267Python／413JS通過，限定臨時目錄移除。新source commit封裝獨立解壓再跑完整測試／Agent與MCP版本；只有manifest成功才發private PR／Release，遠端下載bytes／SHA與Git refs另驗。

實跑收據在本輪 `outputs/v34-qa`：baseline.json、checks.json、browser-evidence.json、adapter-evidence.json、previous-restore-evidence.json；來源／封裝／PR／遠端結果分別source-evidence.json、package-evidence.json、pr-evidence.json、release-remote-evidence.json。`inventory-final.json`與`process-final.json`列限定outputs、已知PID及8875，終端完成以session-evidence.json為準。outputs不進Git／ZIP。

第一輪whole check因舊MCP工具清單與固定通知計數漏更新失敗，focused JS空白fixture起點原為0造成預期六待辦誤差；修正測試fixture／數量後上述完整checks通過。沒有把失敗輪標成成功。

正式媒體、實聽、完整視覺、特定Agent Host、FreeTWAI提交／創始人核准及原生file預覽播放仍未驗證。rolling目標保持active。
