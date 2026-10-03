# v0.13.0 QA — 設計回應、摘要與短高度成果面板

2026-10-03，Windows／Python標準函式庫／Node原生測試；IAB，本機127.0.0.1:8875、1280×720／390×844。Browser plugin not available；無既有Playwright workflow且不可新增依賴，採可用CUA IAB DOM／locator／download。依frontend-testing-debugging指引列出檢查；遵守使用者媒體邊界，沒有截圖／嵌入媒體，不宣稱完整視覺。

目標：歌曲／分鏡 → 建立 → 等待中編修 → 捨棄晚成功／錯誤 → 重新建立／提醒 → 收合摘要 → 真正JSON下載；短桌面成果面板 → 滑鼠與鍵盤取得下載。

## Findings 與修正

1. 真正IAB四秒延遲基線：歌曲新輸入「編修後應保留的歌曲」旁預覽title仍是v13-delay-music-baseline；分鏡同樣寫入舊title。雖下載停用，但舊摘要未標示。planning-review現在先核對isCurrent再模型驗證／提交，dirty明確上一份設計。
2. 真正IAB過期500基線：輸入已是後續需求，status仍顯示controlled old planning failure。共用run現在只顯示目前錯誤，finally保留輸入並恢復控制；四個工作台由同一run保護。現在能量超界／分鏡時間空缺的400仍明確顯示，修正後可再建立。
3. 摘要缺小節／能量數值／任務，分鏡只有連續文字。新純模型與DOM呈現來源標題、手動審查與可收合段落／逐鏡／母題，對應提醒；沒有把設計當生成媒體。輸入含SVG字面標題，DOM svg元素0，下載保留原文。
4. 1280×720成果面板sticky top24但height802.039，download top703.258／bottom744.852，中心超出畫面。指標點擊失敗，鍵盤Enter仍下載。桌面output改max-height:calc(100dvh - 48px)／overflow:auto，實際height672／bottom696，scroll130後download573.258–614.852；滑鼠下載成功。tabindex／PageDown可捲動；390px保持static流。

## 檢查表

| 檢查 | 結果與證據 |
| --- | --- |
| Page identity | 通過；ZOE工作台、本機URL、v0.13 |
| Blank-page | 通過；歌曲／分鏡表單、模型摘要、成果與收合資料存在 |
| Framework overlay | 通過；DOM沒有框架錯誤覆蓋 |
| Console health | 最後重載頁error／warn空；受控500／domain400是已測情境 |
| Screenshot evidence | 未執行，使用者媒體邊界；不作完整視覺宣稱 |
| Interaction proof | 晚成功／錯誤、目前錯誤／修正、設計／上一份、提醒、實檔下載通過 |
| Responsive／keyboard | 390px client／scroll375／375，兩摘要寬343、段落／鏡卡323／323；Tab到summary、Enter展開，output PageDown scroll130 |

## 實際互動與下載

- 歌曲正常136秒／68小節／120BPM／每小節4拍，六段時間、能量1→5、敘事任務與聲音配置；狀態設計資料已建立、仍需實唱實聽。
- 在四秒回應中換歌名／片名，舊成功不替換原有JSON與摘要、輸入保留、上一份／下載停用、按鈕恢復。兩操作的四秒舊500同樣忽略。對應helper receipt確認請求真的延遲。
- 歌曲能量6：目前domain錯誤顯示，既有摘要／輸出保留為上一份；改回1再建立恢復。草稿不含記憶點會顯示一項提醒；字面SVGtitle保持為文字。
- 分鏡人物狀態改變、理由空白：一項鏡頭2提醒，總覽及對應逐鏡區同時可讀，另有母題使用鏡號。先清空理由但沒有狀態變化時沒有提醒，是正確領域規則，未假稱測過警告。第一鏡start1：空缺400、上一份保留；改回0後成功。
- 真正download.path及保存bytes：歌曲music-plan JSON1996 bytes，SHA d464ab5c82fd0b5ce79c15ec356e65a049c0e2a5c222c8978ddeabbf85e36cb7；分鏡正常3035 bytes，SHA15a8caa23025480ab3afe19b4f41cfbf5cf53284e684aa014a6f5e95affba8b0；帶鏡頭2提醒3158 bytes，SHA b76187fd301f843784063da7768440427cfd75fcc1d99f68e6345d8fe4b65878；修正成果面板後滑鼠下載brief2115 bytes，SHA609808f08cfc0fc9f3ccb193456b0a6cf427bea78701ac9fdcf0aac0e2fdc07e。內容與當時已建立的摘要／提醒相符，只讀事件給出的本次檔案。
- 新stale role=status使原generic locator有兩匹配；改用已觀測status ID，未重送請求。指標下載失敗後檢查幾何與dialog，確認短高度缺陷；一次鍵盤下載驗證，修正後重新載入並驗證指標下載，不以失敗或逾時猜測成功。

## 自動與transport驗證

124Python／93JavaScript／四Skill／十JS語法／git diff --check通過。新增13JS，真正application結果→純review，模型不改來源；測時間／非有限／檔案／metadata矛盾、母題／shot對應／提醒範圍、來源title、晚成功、共用run四工作台晚錯誤、目前錯誤／再次操作、無關panel修改與busy重入。

真正CLI不同cwd產生歌曲四／分鏡五檔，UTF-8 bytes與application相同；分鏡CSV保留CRLF，以bytes核對而非read_text的換行正規化。JSON-lines未知操作後正常請求、MCP initialize／四工具discovery／兩個call、HTTP與application全部一致；來源例檔摘要未改。GET新planning-review asset相符。沒有特定Agent host或模型呼叫。

v0.12 ZIP294717 bytes、SHA3e2bf72a6282c6a8a42a1bacd03a38ef6d8f77c6ada82a72e39e480ec387ebc0，核對／受控暫存解壓124Python／80JS通過。指定提交ZIP再解壓全套、Agentmetadata／MCP握手；private PR／Release遠端bytes以manifest／實際收據為準。

outputs/v13-qa保存baseline-browser、兩版helper／延遲／停止收據、browser-evidence與四下載、transport-evidence、checks／previous-restore／remote證據，不進Git／原始碼ZIP。關鍵命令：Pythonunittest、Node test明確argv、十JS的node --check、四Skill quick_validate、diff；瀏覽器用同一IAB、DOMread-only value／geometry、locator fill／click／press、download.path。

基線server62353／PID290380正常stop後才因新asset啟動新版79732／PID294580；兩者exit0／server_closed、8875監聽0、tab15關閉、viewport reset。只盤點本工作區outputs與本輪owned程序，新三版保留、其餘未滿七天保留，不刪草稿／備份／素材或未確認程序。

## 未驗證

完整視覺／跨瀏覽器／其他OS、正式實唱實聽／畫面、ASR／LUFS／true peak／生成媒體、實際Agent host。設計能量不是實測音量，固定速度估時不含弱起／自由速度；資料連戲不能保證實際畫面。Repo private；FreeTWAI未投稿或取得平台創始人核實。
