# 搜尋命中前後文（v0.94）

清單以前只列原文前100字，關鍵字在長段落後半時，20筆結果都可能沒有顯示命中詞。現在列原句／鏡號與原欄位、命中附近前後文及literal mark；點選回完整原欄位，原文、時間、成果、媒體與草稿保持。

## 分層與容量

`search-excerpt.js` 只接明確text／start_byte／end_byte和原query，拒絕未知shape、非法Unicode、矛盾或非字元邊界位置、錯query及超界來源。原欄位最多2000codepoints；重用既有 `delivery-context` 的64 UTF-8 bytes雙側邊界與strict query核對，命中最多1024bytes；不把TextEncoder的替換字當來源。

顯示前後各48codepoints，保留最近原鄰句；命中最多96個可見codepoints，超長用前71／省略號／後24並明示「命中已摘錄」。CR／LF／tab／BOM與其他控制符各自有可見token，不拆token或surrogate；完整query空白保持。codepoint邊界不代表grapheme／字詞邊界，不正規化原文。leading／trailing省略號分別依原byte範圍或顯示截短產生；view只含有界字串／bool，不保留全文。

`search-excerpt-dom.js` 驗證view後以textContent／原生span／mark建立metadata与摘錄。兩個既有DOM adapter先準備全批view，再按現有current batch／query渲染；onclick仍使用原controller stable IDs／原值focus。mark不是HTML解析；前後文保留空白與換行符可見意義，CSS pre-wrap／anywhere維持窄寬換行與原有局部scroll。取消或pending仍依原canFocus／pager，顯式取消保留前批摘錄與報告。舊caption export共用prefix helper保持歷史契約，live結果走新的present。

## 版本與邊界

server只新增兩固定JS assets，app／request lifecycle／兩controller／domain／application／CLI／Agent／MCP／23operation schemas不變。沒有新增搜尋資料欄位、路徑、模型、網路、timer、寫檔或依賴。摘錄與mark不進draft3／備份／Agent wire；完整JSON／Markdown与完整files/data/meta仍保留原text与byte spans。兩種search1／Agent1／draft3／16基本23啟庫保持。

產品0.94.0與唯一policy明確38–94共57版本，未知95拒絕。legal4／ZOE. G／djguan-jpg／PolyForm Noncommercial／private／FreeTWAI not_submitted保持；呈現與來源核對不證明作者、版權、實聽／媒體或平台始創身分。

## 驗證與限制

見[本輪QA](QA-v0.94.0.md)。原生前後對比、完整source／byte span、literal DOM／computed mark色、鍵盤／滑鼠與分頁取消已核對。保存screenshot和幾何、DOM原生操作不冒充完整視覺或screen-reader驗收；browser檔案保存、正式媒體／模型／Host／平台仍未驗證。獨立lyrics preview與其他ZIP／library搜尋保持各自契約。
