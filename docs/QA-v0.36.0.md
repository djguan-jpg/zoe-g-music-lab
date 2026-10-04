# v0.36.0 QA

2026-10-04；本機合成範例與本輪新建1秒48000Hz／16bit／mono PCM WAV。只讀本工作區；沒有使用其他 Repo、正式媒體或私人素材。receipt 位於忽略的 outputs/v36-qa。

## Findings 與修正

390×760 實際建立歌曲後，成功訊息 top=1515.55px、成果區top=1420.36px，建立按鈕仍在視窗內；需向下找成果。新增明確查看／返回與行內訊息後，提示在410.28–454.47px；Enter查看聚焦成果標題約16px，再返回原查看按鈕，沒有改草稿或另存狀態。

補驗發現清空成果後原查看按鈕已停用，返回需 fallback 到建立按鈕。最終真實流程：建立→查看→選本輪合成 draft3→預覽→明確載入→成果清空→返回，focus=music-build且enabled，原歌名保留。新測試涵蓋此情況。

## Environment 與檢查

URL http://127.0.0.1:8875/，CUA IAB；Browser專用skill未提供，依現有CUA能力操作，沒有安裝額外Browser／Playwright套件。測試390×760與1366×768，最終viewport復原、owned tabs57／58關閉，三個本輪QA server正常停止。

| 檢查 | 結果／證據 |
|---|---|
| Page identity／非空頁／overlay | 正確標題與localhost；四工作台內容完整，無錯誤overlay |
| Console | 主要流程、最終來源重載及清空返回均error／warning0 |
| 四工作台Interaction | 歌曲4檔、分鏡5檔、歌詞4檔／4句、音檔2檔；查看與返回均聚焦正確控制 |
| Responsive／鍵盤 | 390px Enter往返；1366px成果區720px高／830px內容可捲動，標題49px可達；document沒有水平溢出 |
| Busy／dirty／失敗／晚回應 | 處理中停用；500保留上一份；改後標示上一份且下載停用；4秒晚回應保留新歌名及music-title焦點 |
| Download／草稿 | 實際report JSON version0.36、合成音檔SHA相符；draft3／tool0.36讀回四panels、新歌名與4句，沒有導覽metadata |
| Screenshot／完整視覺 | 依使用者媒體規則未嵌入截圖；本輪證據為DOM、焦點、互動與下載，不宣稱完整視覺驗收 |

使用流程：四工作台的建立→查看成果→返回；歌詞先讀原創LRC並明確套用，才完整建立。音檔file chooser只選本輪自產合成WAV；分析及往返後原file仍選定，實際下載JSON的SHA與來源一致。資料技術通過不是實聽接受。

## 自動檢查與可逆

300Python、443JavaScript、4Skill、35JS syntax及diff通過；新增12個純policy／controller／DOM行為測試。首輪完整檢查有兩個startup測試因納入新的DOM初始化片段卻無module而失敗；將DOM初始化移到獨立區塊，300／442全套通過。補上清空fallback後443JS及syntax重驗，Python未再變；指定source ZIP另解壓重跑完整Python／JS與Agent／MCP metadata，結果以封裝receipt為準。

前版v0.35指定source 3453224ccfb25defc01298b0c871be0fd936ed1b、ZIP779188bytes／SHA 2eab02130c1bb4c88e9e7bb5bee0de3e10d2026b9076a768ccac03c7b2a9637a 解壓300Python／431JS通過，限定暫存移除。本版source、privatePR／Release、遠端實際下載digest、restore／refs／tree與法律四檔依本輪source/package/release-remote receipts核對；GitHub CI未配置。

正式媒體／實聽、完整視覺、特定Agent Host、其他瀏覽器／螢幕閱讀器與原生file預覽播放仍未驗收；FreeTWAI not_submitted，rolling goal持續。
