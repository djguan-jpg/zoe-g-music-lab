# 完整歌詞包的Unicode來源（v0.58）

以真application完整來源重現六個案例：把單獨high／low surrogate放入名稱／cue.text／review_note，v57 native package驗證和JSON文字下載接受，但同一strict JSON reader全部拒絕再次載入；Python direct object只在最後JSON編碼時拋UnicodeEncodeError。這是物件來源與外部文字邊界不一致。非法字元不應靠escape變成可交付package，也不應被替換或刪掉。

## 分層與提交

musiclab/json_document.py的utf8_bytes(text,label)將valid Unicode精確編碼，非法Unicode轉明確ValueError、不replace；非文字明確拒絕。decode_json原字串容量檢查與解碼後每個key／value沿同helper，各處只編碼一次，既有重複鍵、depth64、finite、BOM及容量規則保持。musiclab/assets/json-document.js公開既有assertUnicode純檢查，完整UTF16 pair是有效scalar，單獨surrogate拒絕；private parser沿同規則，無DOM／network／crypto。

Python validate_package及native validate沿既有完整root／timing／notes schema及時間規則，對title、全部cues.text、review_notes每項使用共享helper，才做原2MiB預算與isolated return。欄位訊息區分歌詞包名稱／歌詞／待確認說明；原文字、順序、空格與來源歷史不normalize、不trim、不repair。有效U+FFFD也保留，不把它當成需要自動修補的錯誤。

fromLegacy／revise／buildRequest／同步export提示／offline boundedcontroller／三下載格式共用完整package驗證；未知schema、時間／容量／句數等原拒絕規則保持。Apply在右值revise完成後才assign data與render；非法待修正文字不覆蓋valid package，表格仍保留待修正值，提醒維持stale，transport沒有呼叫。修正成valid文字再Apply／download可重試，原note保持、舊shift依既有編修規則移除。下載先Apply的既有語義与boundedURL回收保持。

Python application的lyrics與lyrics_export_review沿同domain，避免晚encoder錯誤；raw外部Agent JSON本來就沿strict decoder拒絕非法escape，仍為invalid_request，不更改v1 wire。實際good/bad/good JSON-lines不中斷後續合法request。HTTP／CLI／MCP繼續沿共享application與raw JSON邊界，沒有新增工具／登入／path／自動寫檔權限。

## 相容

valid title200emoji／note400emoji codepoint上限、literal tabs／U+0085／U+2028／U+2029／BOM／NUL／<b>／非BMP保留；有效JSON parse→package→下載→reimport同值，LRC／SRT文字沿同原timecode。這是source內容驗證，不表示所有字幕播放器能保存control chars或完整metadata，仍推薦完整JSON與原素材。

合成有效來源application JSON／LRC／SRT與v57逐bytes相同；preview HTML內固定helper與validator有明確變更，template1 whole-envelope核對含新內容。五欄contract256KiB／package2MiB／encoded12MiB／HTML16MiB、Agent1／draft3／review1／source1、13／18工具保持；產品58、交付来源38–58明確，未知拒絕。非法物件不是可支持的舊有效package，不作遷移或修补。

物件非法Unicode的Apply／download前拒絕由真生成runtime的注入VM測試確認；原生UI測試使用實際含合法control／emoji來源與JSON非法escape，沒有注入application globals或聲稱原生輸入了單獨surrogate。來源驗證不是實聽、作者／版權或所有Host／播放器驗收。見[QA](QA-v0.58.0.md)／[交接](HANDOFF-v0.58.0.md)。
