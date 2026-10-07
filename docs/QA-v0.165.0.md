# v0.165.0 QA

本輪只修正新增鏡頭入口的空白判定，沿既有純planning-values解析與有限非負數字；產品、CLI、HTTP、Agent與MCP領域wire保持。

原版實際handler／Chrome重現BOM-only錯誤追加0–6、NEL-only拒絕；Node亦重現C0-only拒絕。四個新增回歸在原版14項中失敗3項；修正後集中20項與完整1951 JS／147檔通過。測試直接執行app handler，覆蓋原列／IDs／展開／其他集合、結果、媒體、歷史與拒絕後重試。

首次直接完整Python原120秒deadline失敗，原parent EOF1及兩worker原登記／native terminal保留。QA觀察helper最初只讀stdout，未取得stderr內worker登記，故停止在核對門檻，未開始隔離測試；改核對實際完整log並保留原失敗run後接續，沒有補造身份或修改產品。

相同1046份工作來源逐份SHA核對，一次性副本compileall quiet2後用原launcher／兩worker／120秒完整820 Python，1既有Windows symlink skip、0expected failures；實測101.062秒。JS原兩file workers／60秒完整1951，25.984秒。副本前後bytes相同，原來源保持，快取與暫存移除。不是跨環境速度保證或全部deadline根因判定。

153 JS語法、四Skills通過，508歷史四scope原ZIP／manifest逐bytes一致。原v164 ZIP3169348bytes／SHAb75d7f905c7856d49b6bcd0199402852ca5028565373def42e0ac7676b1884b0完整CRC／1046原Git blobs／ledger與原820 Python／1947 JS完整還原通過，原時限與一次性快取範圍保持。

Chrome正式workbench：BOM-only拒絕且全部DOM來源保持；NEL包住24.25重試新增24.25–30.25；NEL-only及C0-only各新增0–6；負值下溢拒絕並保留原值。原四鏡12欄／IDs／展開與123其他欄位核對，成功時僅選列切至新鏡，總長24及其他工作台保持。console0，兩自有tab關閉、server STOP／原EOF0／thread joined及native terminal已驗；沒有音檔、保存下載、完整視覺／screen reader、實聽、Host或創始身分接受。

產品165、policy38–165共128且unknown166拒絕，原128項上限保持。六法律／平台、七history與四Skills原bytes保持；PolyForm非商用及公開授權保持。本輪不讀寫平台，既有四投稿仍submitted_unverified。

指定提交封裝、兩遠端asset逐bytes／GitHub digest、tag／branch／main tree與最終outputs／原run核對分別記於 `outputs/v165-qa` 的package-final、release-remote、goal-turn收據與正式manifest；沒有成功收據不能推定完成。首次deadline／診斷失敗及原來源保持，不以後續成功覆寫。
