# 歌詞音檔時長與作品宣告

作品宣告是歌詞包資料；選定音檔時長是目前播放器的觀測值。選另一份音檔不等於修改作品。兩者在毫秒精度內比較，共用 lyric-time 的 half-away-from-zero 規則；只接受有限、正數及捨入後至少 1 ms 的媒體時長。這個比較不證明音畫同步、音質或版權。

| 動作 | 作品宣告 | 其他內容 |
|---|---|---|
| 選音檔，宣告已有值 | 保留原字串 | 原文、句子及時間保持 |
| 原本空白，讀取期間沒有再編修 | 接續首個有效時長，可撤回 | 只寫時長欄 |
| 讀取期間手動編修／清空 | 保留後續編修 | 不自動補入 |
| 採用選定音檔時長 | 明確改為選定時長 | 不移句、不裁切、不重選媒體 |
| 撤回時長接續 | 核對同來源與實際 after 值後恢復 before | 後續歌詞編修保留 |
| 後來改時長／換音檔／未知時長 | 拒絕不安全撤回／停用採用 | 不蓋掉新內容 |

原生 currentSrc 與目前 object URL 相符才接受 metadata／error。controller 的來源、修訂、快照與一次撤回記錄只存在本頁；不進 draft3、Agent payload 或歌詞包。更換來源清除上一份時長撤回。readonly refresh 不增加編修修訂；真正歌詞編修保護待讀取的自動接續。

musiclab/assets/lyrics-media.js 分開純 compare／mediaTime 與注入 capture／apply／onState 的 controller，不做 DOM、I/O、網路或播放。工作台 app adapter 只操作時長欄與安全文字顯示，沿用 busy／dirty／晚回應保護。HTTP asset allowlist 與實際 defer script 順序明確載入；回歸檢查 Time → media → app。

獨立 preview.html 嵌入同一份模組。已宣告來源初始填入宣告欄；估計來源保留摘要而欄位留白。Apply 只使用明確欄位值或沿用來源，不直接採 player.duration。採用／撤回後仍須 Apply 或下載才更新資料。曾套用的時長／人工時間修改留下歷史待核對說明，撤回總長不能抹除它。較短總長不自動裁切，超出句尾仍由完整 package 驗證拒絕。

工作台及 CLI／HTTP／JSON-lines／MCP 仍共用 application／lyrics_package；schema1 與來源保留不變。音檔本身、比較時長與撤回記錄不傳給 Agent；同一明確 package request 的四種成果一致。產品0.24.0；Agent1／MCP2025-11-25／draft3、各既有 domain schema 與六／十一工具保持。

本輪 native 工作台、合成音檔 metadata、實檔下載與回讀已驗證。browser 工具拒絕 file: 離線頁面；獨立 HTML 只驗證共享模組與抽取實際 Apply／controller 的受控 VM，未宣稱原生離線播放／下載通過，也未繞過限制。DOM 幾何不是完整視覺或正式歌曲實聽。
