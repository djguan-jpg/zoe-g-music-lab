# v0.167.0 QA

原controller只呼叫寫入器便宣告成功。新增12項JS回歸：false／無動作、部分寫入、false-after-full、時間原字串及post順序／ID／文字／宣告變更、前次undo、reset／cancel、重試與重入。舊版31項20pass／11fail，修正版31全pass。初次fixture沒有重入guard導致遞迴，以原exec84787送Ctrl-C後exit1；限定native命令查詢0，未登記的child身份不補造。加入fixture guard後才做有界原版失敗回歸，原log保留。

完整823Python（1既有Windows symlink skip、0expected failures）／1965JS、148JS檔、153syntax及四Skills通過。Python98.828秒；Node25.266秒。原兩Pythonworker／120秒及Node兩fileworkers／60秒保持；1053份來源前後SHA一致，一次性核對副本compileall quiet2，快取與暫存移除。

Chrome實際HTTP工作台，QA注入false writer重現v166假成功；修正版拒絕套用不建虛假undo，拒絕撤回保留undo。兩次拒絕142表單欄位不變；恢復原voidwriter後成功只變四時間欄，逐字01.000、02.000、04.000、05.000。兩原ID row-17／row-18、後續emoji與連續空白原文及空白包住的0020.000宣告保持，console0。兩自有tab關閉、兩server原STOP／EOF0／thread joined及native terminal已驗。沒有選音檔／草稿庫；沒有保存下載、實聽、完整視覺／screen reader／Host接受。

原v166 ZIP3187941bytes／SHAe15e83a745df6d12442f31d01fde5776a0a90b3a640950618bdfdb890ccb3b67完整CRC／1052rawGitblobs／ledger、原823Python／1953JS及前後來源bytes還原通過，暫存移除。第一個QA wrapper誤期待1951，實際Node1953全pass／EOF0後wrapper失敗；原紀錄保留且不以它推定未執行的postcheck。修正oracle後原來源／原期限再驗通過。516四scope歷史ZIP與manifest逐bytes一致。

產品167／明確38–167共130，unknown168拒絕；使用者選擇清單256上限、契約8192bytes，全部舊版保持。22基本／明確啟庫29、Agent1／draft3／template1與29schemas保持。六法律／平台、七history、四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg與已授權public保持；本輪不讀寫或重送四submitted_unverified平台投稿。

指定source封裝完整測試、CRC／raw blobs、Agent／MCP、遠端兩assets逐bytes及digest、refs／tree與最終明確run1盤點以outputs/v167-qa獨立成功收據為準；失敗logs不覆寫。最新三正式版與嚴格超七天必要門檻保持，未知／partial／FAILED保留。
