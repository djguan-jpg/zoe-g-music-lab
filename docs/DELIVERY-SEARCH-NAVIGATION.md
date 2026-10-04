# v0.49 搜尋批次往返

在「分段閱讀完整原文」輸入搜尋字，按尋找後以每批20筆查看；下一批／上一批只改搜尋清單，選擇結果才讓reader跳到原文。note顯示本批序號範圍，沒有虛構全文總命中數。第一批Previous／最後批Next停用；成功操作後若原按鈕停用，焦點接到另一個仍可用按鈕，正常中間批次不搬焦點。

純literal UTF8 search／strict DTO保持 → 注入search controller持有一個batch及私有cursor history／generation → DOM列表／range／focus分層。每個歷史只存start byte與offset兩個整數，最多512對，沒有歷史原文／context；超限丟最舊cursor但前進可繼續，historyLimited提示重新尋找回全文開頭。Previous回讀原cursor，依原序號重建，成功才pop；失敗保留當前batch、selected及history供重試。Find成功回起點並清歷史；來源／query／不可讀失效清空。history不進status、草稿、Agent或wire；status只額外給canPrevious／historyLimited。

command generation在read／select前建立，讀後核對source key／query／generation，再checked DTO與再核對；select還核對同一batch identity。注入callback若more／query改回原值／nested find，晚結果或錯誤不能覆蓋新batch／選取。真ZIP與current source保護保持，不信任JSON提供來源路徑；源SHA接續、單8MiB buffer、metadata-only view／單份preview cache保持。

產品0.49與明確來源工具0.38–0.49同步，未知版本拒絕。12／17 tools、Agent1／draft3與所有交付schema保持，沒有新依賴／模型／網路或寫檔權限。正式媒體／實聽、完整視覺／Host、瀏覽器全文保存／FreeTWAI創始接受仍待驗證。
