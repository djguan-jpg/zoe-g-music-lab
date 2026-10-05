# v0.95.0 QA

功能：歌詞、分鏡與 ZIP 原文搜尋在中文輸入法選字時，Enter 不再提前尋找或重設原結果；一般 Enter 與「尋找」按鈕仍可使用。命中摘錄、原欄位定位、取消／重試、前後分頁及私人編修保留。

| 項目 | 實際結果 |
| --- | --- |
| 之前缺口 | v94兩原搜尋 adapter把modern組字Enter及legacy229共4事件攔截，真正HTTP搜尋4次；舊ZIP adapter已忽略modern，但229仍尋找 |
| 完整測試 | 572Python68.390秒／1104JS／108syntax／四Skills；10新測試；最終用fresh checks-final identity |
| 前版可逆 | 實際v94 ZIP SHA／CRC核對後解壓，原測試572／1094，暫存正常移除 |
| 相容性 | 228歷史交付ZIP／manifest bytes相同，23既有operation schemas相同 |
| 頁面 | 127.0.0.1:8875，IAB；title／heading／非空／無overlay／console0；320／390／1280／1440px無頁面橫溢 |
| 輸入事件 | 50原生頁面狀態／35合成IME KeyboardEvent；未preventDefault，閒置／pending／已完成／分頁／empty／literal保持；普通Enter及按鈕真正操作 |
| 來源與定位 | 45鏡／45句原值與ID保持；鏡頭1歌曲段落／歌詞21文字回原欄；ZIP第23筆選取、context、原文reader、before與成果保持 |
| 完整回覆 | 11 HTTP後端回覆等於application；兩種搜尋實際CLI／Agent／MCP相同，good/bad/good及覆寫exit1 bytes不變 |
| 取消 | 11原生HTTP搜尋請求；2 actual ERR_ABORTED、9finished；後端仍可完成，取消與重試不因IME多建job |
| 清理 | 3owned tabs閉／viewport reset；2servers原handle正常exit0／thread joined／no staging；final run與old-package稽核另以outputs收據 |

證據在outputs/v95-qa：baseline-events／delivery-baseline-events、native-observations／delivery-native-observations、native-ime-events／delivery-native-ime-events、native-network、native-evidence、runtime-final-evidence、checks-final、previous-restore-evidence、compatibility-final-evidence、boundary-evidence。JPEG截圖為storyboard-ime-390.jpg／lyrics-ime-320.jpg／delivery-ime-390.jpg，只保存本機未嵌入；DOM及幾何不代表完整視覺或screen-reader。

第一份checks-current對兩搜尋入口的572／1102已通過；發現第三ZIP入口的229缺口後保留它，新增兩測試並以fresh checks-final跑完整572／1104。baseline一個selector觀察逾時，原server保持，重讀確認已完成，未重送。native_verify首次只在截圖PNG signature假設失敗；CUA實際回JPEG，保存原misnamed PNG與失敗record，另存原bytes JPEG，以fresh native_verify_checked全部核對通過，未改產品程式。

沒有OS中文輸入法候選面板驗收；合成事件也不表示所有平台事件順序。沒有生成／實聽媒體、驗證Host、browser保存或FreeTWAI創始認定。legal4／PolyForm Noncommercial／private／ZOE. G保持；本輪GitHub與指定commit封裝／SHA依實際PR／release／download receipts。
