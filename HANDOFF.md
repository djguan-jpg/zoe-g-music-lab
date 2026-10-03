# v0.20.0 本輪交接

2026-10-03 · ZOE. G發起 · djguan-jpg/zoe-g-music-lab（private）。前輪docs/HANDOFF-v0.19.0.md。

## 還原與封裝

分支codex/iteration-v0.20.0自main 5d4f23ea30d677856843d5d7a736d4a073d07276開始；restore-v0.19.0-before-v0.20.0指向起點。前版v0.19 ZIP436974bytes／SHAd5f6b24535741b67e228b03e86383d61da00774e042d1e22261135350676f228，safe entries／CRC／解壓168Python／206JS通過。

指定commit封裝、private PR合併／v0.20.0 tag／Release與真遠端bytes以manifest及outputs/v20-qa/release-remote-evidence.json為準。先保存未提交改動，再git switch -c codex/restore-v0.19.0 restore-v0.19.0-before-v0.20.0，或git archive到新目錄；main以revert／PR回寫，不reset／強推。草稿／備份／媒體與程式還原分開，無覆寫／自動遷移。

## 功能與分層

基線真Agent／CLI重複欄位成功，IAB無效UTF8被File.text換「�」仍預覽，草稿版本999／3被當3。json_document.py純bytes／str decode，duplicate escaped keys／finite／Unicode／64層有界，iterator traversal額外記憶體隨深度；common只做有界外部檔讀取，application／library_contract／lyrics_package委派，共用HTTP／CLI／stdio／保存與備份。

json-document.js純scan／parse／native decode，arrayBuffer大小與File.size核對、fatal UTF8、入口明確單BOM。planning-import／storyboard-seed／草稿DOMhandler先核對latest／target後decode，保留預覽／cancel／proposal／undo；不呼叫File.text，不把損壞來源自動換字。lyrics-package parse委派共用模組，workbench先載入、offline嵌入同源。domain驗證與可信生成JSONparse保持分開。

discovery增加json_document編碼／深度／重複與finite行為；不是新持久schema。產品0.20.0，Agent1／MCP2025-11-25／draft3／兩seed1／lyrics_package1／library1／backup1與六／十一工具保持。無新依賴、模型或外網呼叫；LICENSE／NOTICE／LICENSING／FOUNDER-RECORD原blobs保持，PolyForm Noncommercial1.0.0不另授AGPL／商用。Repo private、FreeTWAI未投稿／未核實創始人。

## 驗證與限制

180Python／220JS、四Skill／十八JS語法與diff；12新Python／14新JS含跨語言語料、原生File／大小／BOM／Unicode／重複／深度、真CLI另一cwd／覆寫拒絕、HTTP400後200／JSON-lines與MCP壞後好。既有mock換成原生File或實際arrayBuffer，target／latest測試保持。

31項IAB詳細見docs/QA-v0.20.0.md，真正CLI17鏡seed、Agentmusic與MCPstoryboard產物、正常預覽／套用／undo／原音檔、三種入口編碼／重複拒絕、4秒成功與500編修保護、brief2131bytes／draft6341原生下載與Python／瀏覽器讀回、390px DOM／Enter、PCM交付／完整歌詞共用parser。三筆delay第一筆完成後才編修，只當proposal拒絕證據，第二／三筆才為延遲期間。

JSON行為變嚴格，重複／非有限／過深或無效Unicode的外部檔須使用者修正再預覽；不改原檔／偷偷修補。CLIJSON2MiB／原生需求起稿草稿1MiB／歌詞2MiB，BOM按入口規則。沒有截圖／完整視覺、正式實聽、其他OS／瀏覽器、ASR／生成媒體或特定Host。滾動目標active，正式作品／完整視覺／使用者Host與FreeTWAI投稿仍待。

## 產物與程序

outputs/v20-qa記錄合成來源、真正下載、測試／還原／封裝／發布／遠端收據，不進Git。草稿／備份／媒體不是Git可重建候選，最新三封裝v20／v19／v18保留；更舊未滿七天仍保留，無符合條件刪除／0。

基線exec16260／PID296520、新版exec26753／PID304736經qa-stop正常exit0／server_closed，tab24關閉、CDP清除。沒有持久服務／監控或停止其他程序；完整outputs與本輪確認PID終態見inventory-final。只讀此新工作區與通用指引，不參考其他使用者專案／記憶／GitHub。
