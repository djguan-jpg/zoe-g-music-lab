# 規劃 Markdown 原文字面顯示

## 範圍與分層

musiclab/markdown_text.py 的 inline 是純顯示層，只接受已通過領域驗證的文字。ASCII punctuation 全部轉為十進位 numeric character references，Unicode原字元保持；原entity的ampersand也編碼，原HTML／code／強調／刪線／連結／圖片／管線不作Markdown語法。來源CRLF／CR先轉LF，顯示LF用固定<br>，不新增實體Markdown標題或清單列。既有markdown_table.cell保留型別錯誤訊息，委派同一helper，41原樣本bytes及原表格body相同。

creative的歌曲標題／交付項與分鏡標題、敘事用途、人物設定、風格、畫面、鏡頭、轉場、畫幅；design的歌曲標題／四個記憶點引用與說明、母題標題／名稱／意義／狀態及含名稱的審查訊息均使用此層。原始JSON fenced block仍完整JSON，其他固定結構不變。JSON／CSV／data保留來源、段落順序及時間；不把显示Markdown當作完整原bytes保存。GFM可能摺疊空白與控制字元，這不是任意Markdown／HTML安全器或AI prompt防護。母題與分鏡資料完成不代表媒體生成或實際同步。

共用application維持CLI／Agent／MCP／HTTP相同files，browser依現有revision／source／晚回應／dirty護欄提交成果。沒有新operation、asset、schema、媒體、路徑或模型權限。版本policy為38–148，歷史封套與schema不靜默升級。

格式依據為[GitHub Flavored Markdown numeric references](https://github.github.com/gfm/#entity-and-numeric-character-references)。[GitHub Markdown API](https://docs.github.com/en/rest/markdown/markdown)只用合成QA做实际顯示校對，沒有產品網路依賴或公開投稿。

## 驗證與可逆

十項新Python測試涵蓋四文件完整顯示欄位、固定標題／清單、所有ASCII標點、Unicode／換行、重名交付項、JSON原文／輸入不變、四adapter／browser guard、九CLI檔UTF8與拒覆寫、非文字拒絕。755 Python／1811 JS及150 syntax／四Skills通過；1既有Windows symlink skip，0expected failures。四scope×110歷史版本共440 ZIP／manifest bytes相同，29 schemas不變。

GitHub实际轉譯四文件前後8次，修正後只保留固定段落且逐欄原字面核對；五非Markdown檔及data保持。原生UI完整九wire檔與source data核對，八UI檔逐字相同，一CSV textarea只顯示正規化LF；47歌曲／63分鏡controls保持，後續片名修改保留前份成果並停下載。瀏覽器由數字原字串組裝brief、略去合成metadata，native期望由實際brief派生並另核對完整來源欄位，不把原fixture brief bytes冒充瀏覽器原始輸入。

restore-v0.147.0-before-v0.148.0 指向1294a4c7ddd737c792942d32a9c24a1b94ef394f；還原使用新codex分支審閱，勿覆蓋使用者草稿。精確source、ZIP／SHA、PR／release及收尾以outputs/v148-qa/goal-turn.json实际證據為準。完整視覺、saved download、screen reader、Host安裝與平台創始認定仍未驗證。
