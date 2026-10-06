# v0.130.0 操作與跨工具 QA

流程：本機工作台 → 本機保存版本 → 歷史／搜尋的已載入options → 加入目前顯示版本 → 固定ID分批下載。

環境http://127.0.0.1:8875/；CUA in-app browser，1280×720、390×844、1280×360。Browser plugin not available；本專案沒有Playwright workflow且禁止新增依賴，使用已提供CUA的原生DOM／Playwright定位與viewport capability。依frontend-testing-debugging指引完成identity、nonblank、overlay、console、interaction及響應證據；依使用者媒體規則，PNG只留忽略outputs/v130-qa，不嵌入對話。

| 檢查 | 實際證據 |
| --- | --- |
| Page identity／非空／無框架overlay | 原版129与新版130的標題、原生app內容及四成果檔 |
| Console | 本輪IAB warn／error為0 |
| 互動 | 歷史20 → 搜尋31中已載入20，去重共30 → 手動接續31，合計41 → 無結果仍41；清空後batch停用 |
| 跨頁來源 | 第一頁選20，下載期間改選單到ID12，canonical ZIP仍精確12–31共20ID |
| 忙碌／取消 | 編選／whole／batch停用、cancel可用；取消41版保留上一份完整來源 |
| Keyboard／窄視窗 | 三尺寸Tab到bulk、Enter加入後focus batch；移出／補回保持20；頁面／提示／清單無水平溢出 |
| 原值保持 | 26份完整快照比較四台原值、歌曲六段ID、四成果全文／下載旗標与草稿提醒；另查dirty=false |
| 原檔保持 | 41份合成版本82 JSON在兩個phase前後SHA相同，未restore |
| 檔案核對 | 原生返回41版舊檔data-match=false，當前20版來源true；canonical來源不是瀏覽器saved file |

628 Python（76.921秒，兩隔離worker／120秒overall）、1611 JS、143 syntax、4 Skills通過；新增19 JS及focused35。初次完整JS一項版本oracle長度仍92，修正為93後全數通過；Python其後無改，沿同次成功，精確封裝會再測。最初native validator預計25份快照，實際26；failed helper保持，fresh validator完整核對26，沒有刪掉extra或更改產品語義。

原v129指定ZIP2422138 bytes／SHA5ee78350428c823027fa41c36e341d3930390e03e3cd0a2a44fbad7376d35c4f實際還原628／1592且移除限定暫存。4scope×92共368份歷史交付ZIP／manifest bytes保持，27組input／output schemas保持。application／CLI／Agent／MCP／短命HTTP完整inspection回覆相同，good-bad-good與200／400／200；20版export核對完整revision records／draft bytes相同，時間採各次實際值，整包SHA可能不同。CLI預設拒覆寫保持原bytes，subprocess EOF、HTTP thread join。

截圖六份與DOM／console／server／跨adapter／restore收據在忽略QA。兩有界server為版本129基線與版本130操作刻意分開，非逾時重啟；各自正常shutdown、thread join、context close及實際exec EOF。IAB一頁關閉、viewport reset。瀏覽器download event10秒沒取得path，實際保存落盤未驗證；本輪其他兩台初始空值／無媒體，完整視覺與screen reader、非空分鏡／歌詞本輪原生flow、媒體身份、實聽／同步、Host安裝與平台創始核實未驗證。GitHub CI未設定。

標準維護CLI已唯讀盤點發佈前130 direct entries，所有當時明確run原程序terminal，无running／unverified及candidate。發佈後加入本輪ZIP、最新130／129／128與最終audit以成功收據為準；strict>7day、exact tag與Git重建保持。v77 alternate tag不符、partial36／53保持。文件不能冒充remote release已驗證。
