# v0.14.0 驗證紀錄

2026-10-03 · 本機Windows／Python標準函式庫／Node既有測試工具／Codex IAB。資料全部合成；無模型／正式作品／其他使用者專案。可驗證的指定commit封裝與遠端bytes見manifest及outputs/v14-qa/release-remote-evidence.json。

| 檢查 | 實際結果 |
|---|---|
| 原版問題 | v0.13 載入歌曲需求後將歌名改為v14-後續編修必須保留，按撤回變回樓梯間的回聲；重現覆蓋後續編修 |
| 修正 | 相同步驟v0.14拒絕整份撤回，新歌名保留；起稿後編寫第一鏡畫面，撤回亦拒絕且新畫面與17鏡保留 |
| 共用Python | 136 tests通過，包括部分小節／重複段名／小數速度、布林與非有限拒絕、未知輸入、1000鏡上限／不足影格、來源保持與來源規劃一致 |
| JavaScript | 109 tests通過，使用真正Python結果；版本／來源／影格／小節／meta與JSON實檔核對，晚回應、取消／再試／並行最新任務、source／target／settings改動，scope／全panels撤回與clone／鍵序 |
| 同源入口 | 真正CLI不同cwd輸出兩檔UTF8 bytes等同application；重跑拒絕且原檔不變。HTTP與application相等、錯誤400及assets實byte；JSON-lines壞後好／無寫檔，MCP握手／discovery五工具實際呼叫等同application |
| 跨語言 | Python seed→JS draft3，創作空欄保留；合成手動補欄後JS brief→Python完整17鏡五檔，136秒覆蓋 |
| 正常UI | 68小節／136秒／17鏡；預覽不改分鏡。明確套用後17鏡收合、第一鏡0–8秒、任務來源保持，畫面／母題／人物空白，方向neutral；未填母題按建立被拒絕 |
| 可逆 | 未編修撤回恢復4鏡24秒；音檔synthetic.wav、播放器blob來源／1.000秒與校時名稱保持。整份實檔草稿載入17鏡／新畫面；改交付條件後拒絕全表單撤回 |
| 過期／錯誤 | 預覽後改歌名，套用拒絕且4鏡保留；bars=0領域拒絕。QA延遲4秒的晚成功與500在輸入改動後捨棄，沒有新預覽／分鏡覆蓋，按鈕恢復 |
| 真正下載 | storyboard-seed.json 6648 bytes SHA256 63f58944ad37f647fb06c69ca734314cd30fa43726803d9f20f1f59c9d2ec937；與application JSON相同，HTML form CRLF263行明確正規化後文字相同。草稿10530 bytes SHA256 994b239e4c1bbf07d1f6999acaada5ce76b4d7f5129305c5f459e53492d27a5f，draft3通過、新畫面和17鏡保持 |
| 390px／鍵盤 | 390×844 body client375／scroll375，seed343px、preview301／301；Enter套用，focus shot-jump，17鏡無橫溢出，viewport reset |
| Console | 實際操作後捕捉error／warn空，不宣稱所有瀏覽器／視覺通過 |
| 指引／語法 | 四份原創Skill格式、十二JS模組語法、git diff --check通過 |
| 前版還原 | v0.13 ZIP311807 bytes SHA256 2d5d261f046bd003a689ab6341f6b5fac92c2f872b59fd02ea5c6a6a3deaa3fb，安全entries／CRC／解壓原版124Python／93JS通過 |
| 程序 | 基線9667／295500與新版94198／262136 QA stop、exit0／server_closed，8875監聽0、tab16關閉；無持久服務 |

撤回按鈕只能還原最近一次替換，衝突不局部猜測合併；可先下載草稿保留編修。起稿不是mv-brief，沒有創作完成、AI或媒體生成宣稱；固定速度需實際音檔校準。

測試未做截圖／完整視覺評審、其他瀏覽器／OS、正式音樂／影片與特定host整合。平台公開未獲授權，Repo private、FreeTWAI未投稿／未核實創始人。腳本及輸出存outputs/v14-qa，使用者草稿／備份／素材不進Git／封裝或清理候選。
