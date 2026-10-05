# 長歌詞播放資料（v0.83）

原本每次timeupdate／定位／畫面刷新都會重讀全部逐句DOM、檢查原形狀與重新解析時間，並對每列呼叫classList.toggle。現在播放位置更新使用單份已檢查的原列與可播放時間；歌詞內容變更後明確失效重建，高亮只切換舊列與新列。操作意義及原句序保持，沒有自動寫入或保存。

## 共用模型與準備

`current-cue.js` 拆開checkedRows與checkedContext；舊present／createController保留原完整source入口，未知欄位、重複ID、10000列、ID64與time4096界限保持。新createPlaybackController注入captureRows與captureContext，私有保存一份隔離原列及playableCues時間。prepare只在首次可用媒體或invalidate後執行；原半毫秒／negative-before-rounding規則沿shared LyricTime，不另解析文法。

每次refresh仍驗證完整media與visible/busy，並沿activeCueIndex掃描純numeric cues：exclusive ends、空隙、partial rows與最後重疊命中規則保持，沒有排序或合併。仍為O(n)numeric scan，本輪移除DOM回讀與重複解析，不宣稱O(1)查找、表格虛擬化或browser FPS改善倍數。

invalidate清空prepared並遞增generation；準備期間generation改變不提交舊來源。準備後再讀目前context，媒體或工作台改變沿新的可用旗標顯示。錯誤rows只嘗試一次直到下一次invalidate，避免每次播放更新重複解析錯誤來源。context錯誤清顯示、有效context可再使用原準備內容。初始hidden／unready不讀rows；busy可唯讀顯示但停focus。

## 明確操作仍沿完整来源

focus先核對目前context，再使用原createController讀最新完整來源两次；目前stable ID、全部原目標欄位及media source/current_source/duration必須相符，DOM adapter再核對原欄位並確認actual focus。成功、拒絕或失敗後的fresh view不借舊prepared；下一次refresh重新準備。自然播放前進及其他列編修沿原規則，不自動focus。显示cache不能代替來源核對、保存或完整歌詞接受。

app的renderCues、逐句stamp／undo、整批apply／undo明確invalidate。新的DOM bindPlayback擁有表格input listener，先invalidate再refresh；文字、時間、載入與刪除／還原即時更新。未發送事件的外部任意value改寫不保證即時顯示，明確focus仍讀最新原欄位。prepared只在本頁，invalidate／dispose釋放；沒有新草稿、成果、Agent欄位或持久保存。

## 高亮與整批同步

DOM createHighlight只持有一個自有row reference。同ID且原node仍connected時不重新resolve或寫class；切換只移除舊列的playing與加入新列。render重建同ID的nodes時，detached reference觸發重新resolve；清除與dispose只清自身高亮。bindPlayback只擁有button click與tbody input兩個listener，literal文字／status只在變更時更新，沒有新增timer或URL。

原v82整批applyCueTimes只refresh便宜context，可能讓新的句首已超過短音檔但button仍enabled。現在programmatic apply／undo在寫入時間後force刷新句首目標；target與writer的原來源重查保持，不裁切時間、不更換宣告或音檔。

## 版本與限制

產品0.83.0／expectedtag v0.83.0，交付來源38–83共46項／unknown84。沒有新資產路由、HTTP／CLI／Agent／MCP操作、依賴、模型、path/write/auth或外網權限；14基本／啟庫21、Agent1／draft3與所有領域schemas保持。ZOE. G、PolyForm Noncommercial、private及FreeTWAI not_submitted保持。合成基準與局部互動不能證明實聽同步、完整視覺、權利或平台創始接受。
