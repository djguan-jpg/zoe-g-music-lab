# 指定原列完整原文

## 分層與 current 核對

`draft-compare-controller.checkedCurrent`在同一次capture中完成model.prepare、完整canonical來源／selection與stamp.key比較，再交付readPayload的隔離副本。baseline.saved_at每次capture的生成時間沿既有契約忽略，其他metadata、全部panels、原生File身份、revision、tab、preview identity及allowed／visible仍核對。未完成、新run等待、stale、cancel、clear或dispose不可讀來源；不新增持久payload快取。

`draft-compare-row.fullValues`是純內部模型：先validate兩份完整draft3及各1 MiB canonical來源，再依原scope／collection／row選取全部欄位原字串。輸出只含selection和fields的before／after，缺列null與空字串分開，不正規化或裁切Unicode／CRLF／空白。六集合及原位置1起與row model共用，沒有推定移動。全文最大受兩份完整來源容量約束，UI不另截斷，已有局部pre捲動保持。這是瀏覽器內部暫態資料，不是新的wire schema或外部report importer。

`draft-compare-row-dom`只在使用者按「閱讀這一列完整原文」時取checked payload並純選列，textContent呈現全部文字；不依賴128bytes摘錄，也不讀private應用state。回到摘錄重新核對current report並重畫原有摘錄，不改報告、表單、草稿checkpoint、媒體或下載。静態button維持焦點及aria-pressed／aria-controls，全文欄位以aria標示完整原文。模式只存在adapter閉包／DOM，busy、來源／selector失效、新比較、cancel、clear、dispose移除。

共享controller前置失敗若有舊report，先stale及publish，再顯示錯誤；不讓舊report保持ready。未持有目前job的晚成功／錯誤不讀來源或發布狀態，明確有效run才恢復。原read API與預設whole model保持。

## 相容與驗證

29組工具schemas、整份及原列兩種JSON／Markdown原bytes保持。22基本／29明確啟庫、Agent1／draft3與各comparison1保持；無新增operation、asset、POST、依賴、模型、媒體、網路、path或auth能力。產品0.145.0，交付明確38–145共108版；未知146拒絕。

新增20 JS：六集合長字串末尾／CRLF／Unicode／字面HTML、完整來源與容量、getter不執行、null與empty、900000字元不裁切；checked payload隔離／saved_at／source與selector失效、whole及row的三類前置失敗重試；兩個DOM入口全文切換、原值與報告保持、未觀測編修與File/gate、clear／cancel／新report／dispose。集中121 JS與完整736 Python／1789 JS通過。

兩原生入口各六集合的全部pre.textContent逐字核對來源，22份DOM快照以全21欄及六集合完整值／identity摘要比對，不只抽樣第501句。1000cue historyId非空且唯一，四個textarea.value成果全文前後相同。1280×720、390×844、1280×360各兩入口實際Tab／Enter，focus保持、控制可達及page無水平溢出；字面HTML沒有img/b元素。後續歌名修改保留並清舊全文，合成庫兩JSONhash保持。

六PNG留在忽略QA，未查看／嵌入；DOM及幾何不冒充完整視覺、screen reader或瀏覽器實際保存檔案驗收。此輪沒有媒體生成／實聽／同步、Host安裝或平台founder認證。PolyForm Noncommercial與法律／平台記錄保持。
