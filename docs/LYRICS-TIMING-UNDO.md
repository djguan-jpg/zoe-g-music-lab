# 整批校時撤回來源

`web/lyrics-timing.js` 是純表格時間判定與注入controller；沒有DOM、媒體讀取、網路或草稿保存。`sameTimes` 核對完整列數、唯一原ID及每列開始／結束：目前原值先經共用 `LyricTime.normalize(value, label, true)` 的非負、有限ASCII十進位、負值下溢及毫秒精度規則，再用共用 `number` 按未捨入數值比較已套用時間。

例如套用後開始是0，後續-1e-999即使Number轉成負零仍不可撤回。0.0001可合法捨入為0，但原數值不同，同樣拒絕；不能用normalize後的毫秒值取代數值比較。真正的-0e-999、合法正值下溢或0.000與0數值相同仍可撤回。判定不修剪或改寫原欄位；一列不符合即拒絕全部，不部分還原。

拒絕時保留undo與後續編修。修正成原等值有效時間後可明確重試；成功沿原applyTimes只還原時間，文字、目前列順序、其他工作台、宣告與音檔保持。記錄只存在本頁，不進draft3、保存庫、Agent1或任何領域schema。既有preview／latest／fingerprint與cancel／reset規則保持。

此檢查不代替完整歌曲時長、句子範圍、排序、媒體同步、實聽或保存驗收。Python／application／CLI／HTTP／Agent／MCP領域接受與22／29操作不變。參見[時間空白規則](LYRICS-WHITESPACE.md)及[本轮QA](QA-v0.160.0.md)。
