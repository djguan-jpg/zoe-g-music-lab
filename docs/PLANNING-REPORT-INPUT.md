# 歌曲／分鏡待辦報告接續 · v0.68

既有歌曲／分鏡需求入口現在接受原本完成的brief與完整music-review.json／storyboard-review.json。先預覽再明確載入，不因選檔立即替換。報告保留原始source，未完成欄位仍需人工填寫及完整建立驗證。

## 分層與契約

- music-readiness／storyboard-readiness既有純模型從完整source重新派生report1；readiness-report.checkedDocument逐型別、完整key set、array順序、值與固定notes核對整份報告，再隔離回傳。物件key順序不影響語義；未知version、額外欄位、錯明細／counts／status／notes拒絕。既有HTTP whole reply checker共用精確比較，未知function／undefined欄位不能被JSON序列化忽略。
- 新planning-report-input只取明確music或storyboard。沒有format走既有brief路徑；有format需精確對應zoe-music-review或zoe-storyboard-review。decode沿共享strict UTF8／JSON／Unicode、實際bytes及既有1MiB上限。回傳kind、隔離panel、issueCount、固定notes，不保存整份診斷或媒體。
- planning-import.panelDraft驗證隔離完整draft3，只替換selected panel並驗證完整候選；storyboard畫幅為原始文字；原生text搭配四個datalist建議，不以四值限制來源。引用及screen_direction沿draft3既有規則。未知引用／空白或未知方向即使可診斷也不能冒充可載入草稿；拒絕保留原檔，不抹除或遷移。
- createBriefImport／replacement-preview保持讀檔前snapshot、native File、latest token、讀後及驗證後target核對；其他panels編修可保留，selected target有變則拒絕。新分支不發完成brief HTTP請求，舊完成brief仍先驗表單映射，再HTTP及完整來源回應核對。
- DOM顯示raw來源預覽、待辦數及固定提醒；Apply前再核對scope／current candidate，沿raw-fields adapter寫入所選panel，再記實際capture after供既有scoped Undo。CRLF／原空白／未完成數字／opaque motif IDs保持；特殊字元可能以可見符號呈現，未編修時仍保留原值。Undo核對actual after，後續編修拒絕覆蓋。沒有自動保存或部分失敗的原子回滾承諾。

## 邊界

完整診斷source是此檔宣告的來源。一份自洽且改名的報告仍可成立；核對不能證明作者、原始檔身份、素材權利或平台創始人身份。零待辦不代表完成時間／影格／連戲、實聽、媒體生成或權利審核。沒有從Markdown推回來源，沒有新模型／依賴／外網／路徑選擇／保存權限。

kind／panel proposal／report preview為暫態，不進Agent wire、draft3或保存庫。產品0.68.0與純輸入contract1分開；report1、Agent1、draft3及14基本／明確啟庫19工具保持。交付producer明確38–68，未知69拒絕；PolyForm Noncommercial1.0.0與private／not_submitted保持。

## v0.68 畫幅接續

v0.67的四值畫幅拒絕屬歷史限制，本版已移除。自訂畫幅保持原字串、空白及Unicode，沿raw-fields與draft3；完整plan仍需非空文字。這是畫面需求紀錄，不證明符合任何外部規格、不解析比例或裁切素材。見[契約](STORYBOARD-RATIO.md)。
