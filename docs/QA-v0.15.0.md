# v0.15.0 驗證紀錄

2026-10-03 · 本機Windows／Python標準函式庫／既有Node測試工具／Codex IAB。資料全部合成，只讀本工作區與通用工具。指定commit封裝與遠端下載見manifest及outputs/v15-qa/release-remote-evidence.json。

| 檢查 | 實際結果 |
|---|---|
| 原版缺口 | v0.14 CLI傳--seed exit2、無輸出目錄；無起稿選檔UI，Agent seed無法直接接續分鏡 |
| 共用Python | 146 tests通過；未知版本／狀態／假設／擴充、布林／非有限值、毫秒／影格／小節／任務篡改拒絕；小數速度與4.0整數語意往返、輸入不變 |
| JavaScript | 121 tests通過；真正Python fixture、1MiB界限／BOM／格式、來源及JSON實檔核對、目標晚回應／套用保護、新選檔／取消／再試、歌曲與設定獨立、actual run／markDirty函式VM測試 |
| 真正入口 | CLI不同cwd／BOM／不可覆寫／互斥設定，HTTP與application檢查相等，JSON-lines錯後好不寫檔，真正MCP stdio握手／五工具discovery／生成與檢查 |
| Agent起稿 | 90BPM、68小節、181.333秒、29.97FPS、每鏡最多8小節，共9鏡；CLI與MCP兩檔UTF8 bytes相同 |
| UI正常 | 外部起稿先預覽且原4鏡保持；明確套用9鏡、focus shot-jump，其他工作台保持；未編修撤回恢復4鏡及原片名 |
| 獨立來源 | 預覽後改歌曲／切頁，仍可套用與下載；4秒讀取期間改歌曲，當前檔案成功仍可見；當前受控500亦可見且選檔恢復 |
| 保護 | 預覽後編修分鏡拒絕套用、新片名與4鏡保持；來源時刻+.001被Python拒絕且預覽隱藏；未知schema／毀損JSON拒絕；取消不改分鏡 |
| 文字／相容 | `<svg onload=alert(1)> 起稿文字`在預覽完整純文字呈現、SVG節點0；v0.14下載schema1起稿136秒／17鏡可讀 |
| 真正JSON下載 | 4527 bytes，SHA256 a8939141ffac3bcc7a7b14dbbef412550a17553c23884ddd2fd835705a3550dc；語意等同真正Agent原檔。瀏覽器正規化數字表示及HTML form CRLF，不宣稱與Python byte相同 |
| 草稿／音檔 | 局部套用與撤回保留synthetic.wav選檔、播放器來源及校時草稿名；draft3下載7299 bytes SHA256 28b9db6ff307882510b20c774f6496a1b7423e68cdd2e9faf37eba4018fa64f2，9鏡創作欄位空且其他panel不變；實檔載入9鏡，全草稿載入按既有契約清除音檔 |
| 手機／鍵盤 | 390×844，documentWidth375，檔案／預覽左右37–338、寬301px，無橫溢出；Enter套用9鏡並focus shot-jump；viewport reset |
| Console | 實際操作後error／warn捕捉空 |
| 指引／語法 | 四原創Skill、十二JS語法、git diff --check通過 |
| 前版還原 | v0.14 ZIP336100 bytes SHA256 35aa2ff80e43dce91ad556a7c22fffb316e0c88fd21222dfeb3ebb8f3887abe5，CRC／安全entries／原版136Python／109JS通過 |
| 程序 | 本輪HTTP exec40819／PID291548 QA stop正常exit0，tab17關閉／viewport reset；監聽／PID及後續封裝／發布終態另記inventory-final收據 |

起稿固定速度／無弱起，創作未完成；保留原檔，未知創作擴充需明確另建完整分鏡需求。檢查不自動推測畫面、修復來源或呼叫AI。

未做截圖／完整視覺評審、其他瀏覽器／OS、正式音樂／影片／實聽／音畫及特定host整合。Repo private、FreeTWAI未投稿／未核實創始人。使用者草稿／備份／媒體不進Git／封裝或Git重建清理候選。
