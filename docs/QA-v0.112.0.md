# v0.112.0 QA

603 Python、1316 JavaScript、127 syntax、4 Skills及diff檢查通過；新增8 Python／15 JS。原v111封裝原樣還原595／1301；296份歷史ZIP／manifest bytes及原24組schema一致。原生第100鏡10項、後續9項及零待辦報告，定位、選擇／編修、同文字移動撤回、晚回覆保護、其他panel／原生File／0.5秒暫停音檔保持；CLI input／有效原生draft3、Agent／MCP good-bad-good與HTTP回覆一致。首次完整測試發現舊工具數量／清單期待，已更新且保留失敗證據；原生發現初次換台新按鈕未刷新，已補刷新並驗證。瀏覽器下載有送出click訊息，但download事件逾時，未取得保存檔案；不宣稱已保存或完整視覺／screen-reader／實聽驗收。

新增選定原鏡號的必填欄位、方向與母題引用檢查，整份分鏡200明細上限保持。可定位後面的鏡頭，舊選擇／順序／來源與晚回覆不能替換新編修。Python／JS共用既有整份診斷規則，controller暫態與字面DOM分層；CLI／Agent／MCP／HTTP共用同一報告，18基本／25啟庫工具，原24組schemas保持。獨立shot-review1，Agent1／draft3保持；無新依賴／模型／媒體／外網或路徑權限。產品112／唯一policy38–112共75，未知113拒絕。

本輪分支 `codex/iteration-v0.112.0`；基線main `df41cafd5e652f6977b688f76a3838271e6b3db9`；還原tag `restore-v0.111.0-before-v0.112.0`。需要還原時從tag建立codex/restore-*，經private PR回復，保留已發布main及使用者草稿。封裝只含指定source commit，ZIP／manifest／SHA與遠端實際bytes須核對；平台not_submitted不能改寫為accepted。
