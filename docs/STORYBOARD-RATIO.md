# 分鏡自訂畫幅 · v0.68

後端與Agent早已接受畫幅文字，工作台的四值限制使2.39:1等有效需求無法接續。本版畫幅改成原生text欄位，保留16:9／9:16／1:1／4:3的datalist建議，也可直接輸入3:2／2.39:1等需求。

## 分層

原生input只負責編修與建議；既有raw-fields adapter負責原值／特殊字元顯示；capturePanel、draft3、planning-import與complete planning source核對沿原契約。planningDraft及panelDraft移除額外四值白名單，保持隔離、大小限制、母題ID／引用與方向驗證。需求仍經HTTP及checkedBrief完整來源核對；報告仍重派生全部report1／whole compare後preview。Apply／Undo仍限定所選台並核對target、latest及actual after，其他台／native media保持。沒有新增控制器、DOM副本狀態或持久欄位。

畫幅本來就是文字，未增加比例數字解析、除約、格式強制或外部規格判定。草稿與待辦report保留空白、空白字元、Unicode及CRLF；特殊字元以可見符號呈現，未編修仍保存原值，編修後使用新輸入。完整plan沿Python text規則清理兩端空白且拒絕空白內容，回應來源核對沿同規則；這不把pending report或草稿宣稱完整plan。輸入畫幅不裁切／轉檔／調整媒體或變更FPS／時間／影格。

原生datalist只是建議，不保證各browser／screen reader的popup呈現。標籤、說明aria-describedby及原focus順序由DOM負責；沒有仿製自訂下拉選單。product68／Agent1／draft3／report1／planning-input contract1各自管理，14基本／明確啟庫19工具與1MiB選檔保持。交付producer明確38–68，未知69拒絕。legal4 PolyForm Noncommercial1.0.0／private／not_submitted保持。
