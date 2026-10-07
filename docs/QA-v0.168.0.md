# v0.168.0 QA

原Chrome產品v167重現：末句0.119後新end為3.1189999999999998；末句9007199254740.99合法時仍新增無法匯出的9007199254743.99。新增12項JS回歸，原31項26pass／5fail，修正31pass。再核對新增、既有busy／focus與整批校時共64項全pass；不是只驗純helper。

第一批完整823Python通過／1977JS中1975pass、2fail。兩既有VMfixture未提供新handler沿用的MusicTiming依賴，產品Chrome有實際載入；只補fixture真實依賴，沒有放寬assert、修改產品fallback或縮減cases。原失敗log／typed parent／EOF1保持。修正後完整823Python（1既有skip、0expected failures）／1977JS、149檔通過；Python97.813秒、Node25.375秒。1057份來源前後SHA一致，僅一次性已核對副本compileall quiet2，暫存移除。原Python2worker／120秒與Node2fileworker／60秒維持。

153syntax與四Skills、520份四scope歷史交付ZIP／manifest逐bytes通過。原v167 ZIP3198695bytes／5c96cf1e65d15bab85550bedc592499f335c4f69a695528b2dfbade9a24d2d45完整CRC／1056rawGitblobs／ledger及823Python／1965JS還原通過，前後原bytes相同、暫存移除；不以集中測試取代原全套。

Chromev168原handler：0.119→3.119，精度超限與BOM拒絕時142欄／ID完全保持；修正成3.119後重試→6.119，第三ID仍row-19，前兩列原值保持，舊欄位只cues-order選中新列。HTTP完整歌詞包六檔、格式提醒0、console0；三句emoji／空白原文、ID與空白包住的0020.000宣告保持。完整建立按既有規則將第一句00.000正規化0，其他表單欄位保持。下載按鈕可用，未執行下載或保存驗證。

兩自有tab關閉、兩server原STOP／EOF0／thread joined及native terminal已核對。沒有選音檔／庫或修改產品server；沒有完整視覺／screen reader、實聽或Host接受。六法律／平台、七history、四Skills、禁止商用與ZOE. G／djguan-jpg保持，本輪不查寫四submitted_unverified投稿。

產品168／明確38–168共131，未知169拒絕，清單256／契約8192bytes與全舊版保持。Agent22基本／明確啟庫29、protocol1／draft3／template1與29schemas維持。指定source封裝全套、Agent／MCP、CRC／raw blobs、遠端assets bytes／digest及refs、最終有界run1盤點以outputs/v168-qa獨立成功收據為準。原失敗與partial保留。
