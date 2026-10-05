# v0.83.0 交接

目前歌詞播放更新使用本頁有界prepared來源，高亮只切換舊／新列，減少長表格的重讀及解析。input/render/stamp及undo/batch apply及undo明確失效；明確focus仍沿原完整fresh雙capture与DOM原欄位核對。整批校時後force更新句首按鈕，短音檔越界停用。詳見[契約](CURRENT-CUE-PLAYBACK.md)與[QA](QA-v0.83.0.md)。

起點main1ebbdc66cf222b2c845b7d1998a5a87ba8dc1cde，restore-v0.82.0-before-v0.83.0與codex/iteration-v0.83.0。還原先另存創作與未提交內容，再從restore tag建立新分支核對。source commit/tree依outputs/v83-qa/source-evidence.json；指定source ZIP／SHA依outputs/releases/v0.83.0-<source12>/manifest.json；private PR／merge／Release與actual下載另依pr-evidence及release-remote-evidence。

554 Python／960 JS／90syntax／四Skills、71focused、180歷史ZIP／manifest、v82原ZIP554／948還原、actual CLI／Agent／MCP文件相同與good/bad/good通過。10000列×120次views一致，row capture120→1；Node單次2267.6433→44.3776ms，不是browser FPS。原生25觀察／1022欄位保持／300列，編修、stamp/undo、batch apply/undo、stable ID／重建DOM、自然播放焦點保持、390px、新source及draft media reset通過。

prepared仍沿O(n)numeric activeCueIndex，未做table virtualization。沒有事件的外部任意value改寫不保證即時display，明確focus仍fresh核對；cache不進持久來源或草稿。完整視覺、screen reader、正式媒體／實聽與平台創始接受未驗證。

產品83／expectedtag83／來源38–83共46／unknown84，14基本／啟庫21、Agent1／draft3與領域schemas保持。沒有新資產／操作／路徑／write／模型／依賴／auth／外網權限。兩自有tab已關閉、viewport reset、兩bounded server正常退出，其他subprocess EOF；最後狀態依inventory／final audit。latest83／82／81保護，只超七天且exact Git/tag可重建才清除，草稿、備份、素材、failed36／53、未知與外部程序保持。ZOE. G、PolyForm Noncommercial、private、FreeTWAI not_submitted與rolling goal active不變。
