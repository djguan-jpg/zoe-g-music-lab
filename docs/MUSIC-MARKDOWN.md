# 歌曲設計表格原文顯示

## 範圍與分層

musiclab/markdown_table.py 的 cell 是純 presentation helper，只取已通過既有domain驗證的三個表格文字欄，不讀路徑／DOM／網路。ASCII punctuation逐字轉為十進位numeric references，保留Unicode文字；使用者原有entity字樣的&亦編碼，避免二次解碼。原文HTML、Markdown強調／刪線／連結／圖片／code／管線不形成欄位語法。三種line endings顯示為固定<br>，不新增物理Markdown列；來源的<br>字樣保持字面。

design只套用段落名稱、敘事任務及聲音配置。歌曲data、brief.json、music-plan.json與task.md保持原來源／原bytes（版本meta獨立更新）。本次不保證其他Markdown段落的字面格式，也不是任意HTML安全器、AI prompt防護或字元／空白bytes保存。GFM顯示可能摺疊空白，來源JSON才是完整編修依據。正常CLI／Agent／MCP／HTTP與browser均共用application，無新operation、asset或schema。

格式依據為[GitHub Flavored Markdown numeric references](https://github.github.com/gfm/#entity-and-numeric-character-references)與[表格規則](https://github.github.com/gfm/#tables-extension-)。實際GitHub[Markdown轉譯API](https://docs.github.com/en/rest/markdown/markdown)只用合成QA資料，不建立公開投稿，也不加入產品或測試執行依賴。

## 驗證與可逆

九項Python涵蓋實際六欄表格結構、逐欄文字、原HTML／entity／Markdown字面、CRLF／CR／LF、Unicode／combining／emoji、40重名原列順序、Agent與MCP完整files、CLI四份UTF8原文／拒覆寫、真HTTP及browser planning source guard、非文字拒絕。完整745 Python／1811 JS通過，1既有symlink skip及0expected failures。全scope436歷史ZIP／manifest與29原schemas保持。

合成同一來源由GitHub GFM轉譯：前七rows錯位，後六rows各六cols；三欄逐列核對。原生本機工作台四份完整files核對，49controls前後相同，後續歌名編修不更動舊成果且停用下載；無本輪saved download／完整visual／screen reader／媒體實聽或平台founder接受。

從restore-v0.146.0-before-v0.147.0建立新codex分支審閱還原，不覆蓋main或使用者草稿。source commit／ZIP／SHA／PR／release與終輪盤點以outputs/v147-qa/goal-turn.json實際核對為準。
