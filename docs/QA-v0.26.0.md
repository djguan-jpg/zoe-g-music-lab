# v0.26.0 驗證紀錄

2026-10-04 · 本機 Windows／Python標準庫／原生JavaScript · synthetic only。

## 可重現問題與改變

基線 main54a256b867dc914a8d88e7792d8ac27072cc9e38／v0.25。實際application加Node inspect：同標題但BPM120改80的完整合法回應被接受；同名分鏡的另一份畫面／人物也被接受。有前後空白的歌名則回應被拒絕。IAB35亦確認120的表單顯示80／204秒且可下載，空白歌名無法建立。不同來源回應為明確合成QA注入，不宣稱正常服務曾自行換作品。

Python design以清理後brief.title產生歌曲data與Markdown。獨立planning-source比對完整本次需求、主要JSON與來源推得的設計資料；planning-review checkedResult／checkedBrief及app建立／需求回讀共用。原先只比標題的callback改為全部通過才提交；先前latest／scope保護仍先執行。

## 自動驗證

- 239 Python／321 JS、四Skill／23 JS語法與diff。
- 新5項Python：標題一致／原輸入不變、60組Python→真Node語義核對、真正CLI實檔及覆寫拒絕、JSON-lines／MCP錯誤後正常回復、真HTTP400後200與實際asset順序。
- 新16項JS：完整source、同名不同作品、逐個創作欄位、JSON與data矛盾、來源推得的時間／文字／影格／連戲／提醒、重複含跳脫鍵與非有限數字、鍵順序／空白、原型字樣、型別／null／數字控制字元、8MiB、晚回應、回讀共用及隔離副本。原planning-review測試改用真實完整brief，沒有略過來源核對。
- 60組包含50歌曲與10分鏡，浮點BPM／半毫秒、非ASCII數字／底線、Python空白／多種換行、多行原文、__proto__／數字母題的輸入順序與不同FPS。初始fixture誤把float不接受的U+001C作有效數字、把24秒原分鏡宣告為60秒；修正測試資料，也使純數字空白規則與文字修剪分開。不是把非法資料改成可通過。
- 首次完整JS檢查320／321通過；原影格回復測試只傳title，完整來源核對正確拒絕。改用真application的mv-brief.json，保留錯誤不提交及正常回復的斷言。另實證只查半毫秒界會接受段落邊界增加0.0004秒，補上start／end／總長的毫秒精度核對及回歸案例；精度測試修正後拒絕，同時60組真Python結果仍通過。

## 真實工作台與產物

28項IAB：歌曲／分鏡有空白名稱、同名異源／source不符／JSON矛盾／重複鍵、current500／四秒晚成功與500、回復後新動作保持、九個實際檔案下載、CLI歌曲／MCP分鏡回讀拒絕錯誤及正常預覽／明確載入／限定撤回、同一原生6秒合成音檔保持、真draft3下載、390px／Enter、過期核對提示及重建恢復。IAB36測建立與下載，37測最終回讀路徑，38測最終提示與鍵盤。35–38ownedtabs關閉，尺寸override清除；consoleerror／warn為空。

九個下載檔text與對應原需求application完全一致；CRLF↔LF與rawbytesSHA分開。CSV原本CRLF、DOM表單可能正規化；mv-brief保留UI請求的鍵／欄位順序與原始型別，QA接收器按實際UI request建構核對，沒有改動原檔或生產formatter。四adapter兩種operation的files／data一致，真stdio結果由JS checkedBrief接受，MCP七tools。實際draft0.26／schema3保留限定套用及撤回值，不含sourceChecked／音檔blob／檔名。

## 還原、維護與限制

前版v0.25 ZIP571003bytes，SHAd86324e1d1b0d53fa8aa3ab5988a50702bc1756decf38623eb9cfdf1c80c5be7，真解壓重跑234／305通過；v25-check暫存刪除前確認在本專案QA根下。還原tag restore-v0.25.0-before-v0.26.0保留main起點。

指定commit ZIP／manifest、privatePR合併／Release與遠端真下載核對見outputs/v26-qa本輪收據。只檢查確定PID與本專案outputs；最新三版及過七天資格依inventory-final。不清使用者草稿／備份／媒體或其他專案。

這是DOM幾何與鍵盤驗證，沒有截圖／完整視覺／正式實聽／媒體生成／指定Host驗收。CSV／Markdown沒有瀏覽器逐字重算，只有本輪application／adapter／下載核對。原生file:既有政策阻擋沒有繞過／嘗試；FreeTWAI未投稿／未核實創始身分。各protocol及schema、非商用／private／ZOE. G保持，沒有新依賴。
