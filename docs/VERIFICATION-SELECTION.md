# 選定檔案後的核對狀態

現行三文字入口提供有界差異前後文，完整七欄proof與即時選檔焦點保持，晚回覆不搶焦點。見[契約](TEXT-VERIFICATION-CONTEXT.md)。以下保留歷史描述。

## 觸發及分層

成果原文、專案草稿、接受條件與備份ZIP的四個原生選檔器在讀取時停用。原Chrome選取真File後，焦點因停用而落回BODY；四個入口核對完成後仍BODY。來源核對本身正確，問題是鍵盤使用者難以接續狀態與動作。

共用verification-focus的selected()是即時明確動作：先clear既有取消invitation，嚴格讀取注入capture的available／pending／waiting布林與正safe-integer contextRevision，只有來源有效且available／非pending才嘗試focusNote。未知或不可用capture與focus失敗不拋出焦點錯誤，不fallback picker，不留下任何稍後接續的承諾。它只持有既有取消的primitive epoch，不讀DOM、File、原文、雜湊或持久狀態。

text-verification-dom及backup-verification-dom在onchange取回實際File、重設input value後，先呼叫selected，再啟動原controller.verify。此時picker尚未被核對停用，所以status note可以取得真焦點。空檔案列表只清舊invitation、不啟動reader或移焦；選定空檔案仍可依原metadata／完整bytes規則核對。原文legacy可選cancel入口不額外添加焦點handler，原行為保持；四個正式入口均有既有cancel控制。

## 晚回覆與取消

selected沒有非同步意圖：一般pending→成功／差異／錯誤僅由原controller提交原報告和literal狀態，無任何完成後focus callback。使用者Tab離开、編修其他欄位、report callback接續流程或來源改變，都不因晚完成而移焦。原generation／完整來源／selected File metadata核對及report callbacks不改，選檔focus不能證明匹配或保存。

取消仍沿既有cancelled政策：未滿額回picker，兩份實際read或read→hash未完成時先focus note，同來源且仍停在提示才於名額釋放接回。selected會清除舊取消意圖，無法以重選／不可用新選取復活它。pagehide／dispose移除自有listener及取消意圖；無OS I/O中止、RAM上限或自動保存宣稱。

## 接口及來源保持

本輪只變更三個原生JS模組、獨立行為測試及產品version oracle。backend／固定asset表／HTML／CSS、text／backup純proof與controller、HTTP／CLI／Agent／MCP操作、保存checkpoint與媒體能力沒有diff。無新operation／dependency／任意路徑或產品網路權限。22基本／29啟庫、Agent1／draft3、report及其餘schemas保持；唯一policy38–152共115，未知153拒絕。

## 實際驗證

19新JS行為涵蓋即時note focus、invalid／pending／unavailable來源、focus失敗、舊取消意圖清除、dispose，以及三文字入口的真來源／metadata保持、同大小差異、讀取失敗與重試、空chooser、後續編修／來源改變／report callback焦點、legacy、backup SHA差異／read及hash錯誤與取消。與保存callback及既有capacity整合共126JS，完整755 Python／1869JS、151syntax／四Skills通過。456歷史ZIP／manifest與29 input/output schemas、原整份／原列報告保持。

before使用restore tag鎖定的三個原模組，四次native File chooser均重現pending／complete為BODY。after19次native chooser：四入口皆驗證匹配及同大小差異，備份實際WebCrypto SHA確認CRC有效／同148byte合成ZIP內容不同；兩個read错误是QA明確注入，不能稱實際磁碟失敗。實際Tab從成果note到草稿picker，後續編修保留；Shift+Tab從草稿note到cancel、Enter回picker，取消的舊read不提交。F9只改QA來源revision，晚回覆保留後續欄位，四入口重新核對均匹配。

after19/19 read嘗試settle（2個QA拒絕）、4/4 SHA、gates0，最終四matched=true，後續編修文字與qa-other焦點保持。正式工作台標題／主要heading、四status note／polite／tabindex=-1／aria關聯、共享asset只載入一次、2px solid rgb(49,91,75)焦點outline及console0核對。兩自有服務以原handle正常EOF0／context close／deadline join，兩自建頁關閉，無viewport override。按照使用者媒體規則未截圖／嵌入媒體；DOM、computed style與鍵盤證據不代表完整視覺／screen reader接受。QA完成gate不是慢磁碟，合成ZIP不是使用者草稿庫備份，沒有browser下載或saved-file證明。

## 可逆及外部狀態

restore-v0.151.0-before-v0.152.0 → f13e2f1541be926f6095c33d680eb3dab362b32a；分支codex/iteration-v0.152.0。由還原tag另建分支審閱，保留使用者草稿與媒體。原v151 exact-source ZIP 2935279bytes、SHA 2ddb54bdd5da74d53b646b8423ccf5269b021026ac6111629c523522b991fe03，CRC核對及未改launcher／120秒deadline的順序755 Python／1850 JS還原通過，提取暫存移除。

六法律／平台文件原bytes保持，public、PolyForm Noncommercial1.0.0與ZOE. G／djguan-jpg保持；不另授AGPL或商用許可。本輪未讀写FreeTWAI或重送四份既有申請，submitted_unverified紀錄不是平台創始認證。v149禁止下載歷史入口的安全限制遵守，未重試或繞過。最终source、package、PR、release与程序／容量核對在本機忽略outputs/v152-qa/goal-turn.json，rolling goal保持active。
