# 原值非負時間

`number` 原有有限十進位語法保持；`nonnegative_number`／`nonnegativeNumber` 額外在轉換後核對轉換前的負號與非零 mantissa。`-1e-999`、`-１_２e-９９９`、阿拉伯與數學十進位數字的非零負值拒絕；`-0e-999` 的 exponent 非零不是負值證據。真正負零及正下溢保持。

Python 以原 float 驗證與 Unicode Nd 非零位判定；JS沿同既有 digit map／底線／numeric whitespace grammar，再核對ASCII mantissa。一般 signed number reader保持；非負 reader沒有DOM／網路／狀態。非數／非有限值仍走原錯誤路徑，合法負數診斷沿原 invalid_range，原 row／field／source保持。

完整 legacy／modern storyboard共用creative；局部timing report共用Python／JS診斷。原duration controller採同timing檢查，因此負時間不可提供鏡尾提案。overview／既有compaction reader及source guard也用非負讀取；新增鏡頭先驗最後鏡尾再push／render，拒絕時原列保持。無新增schema／operation／asset／權限；時間起稿僅接受數值的原契約保持。

本判定保留可取得的原十進位字串。已由JSON parser或外部程式轉成numeric -0 的值，沒有非零 mantissa來源可復原；不宣稱可回推失去的字面值。正下溢仍沿binary64及既有容差，不增加任意精度、裁切或自動校時。

frame ties-to-even、exclusive尾端、seconds tolerance、原partial有效列、complete覆蓋／連戲檢查保持。建立資料仍不能代替實際音畫驗證。Agent1／draft3／report1與領域版本保持，16基本／23啟庫；產品0.96.0／交付來源38–96由唯一policy管理，unknown97拒絕。
