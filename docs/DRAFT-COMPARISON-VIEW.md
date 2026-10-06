# 草稿比較閱讀進度

在「草稿檔預覽」或「保存庫預覽」先執行比較。每頁十筆，原生details可單獨展開；「展開本頁差異」或「收合本頁差異」只影響目前範圍的這一頁。換頁再返回、切換範圍再返回均保留同一份比較的展開位置。提示分開列出本頁與整份已展開數；數字不是已讀、已接受或已套用。

## 純模型與來源

web/draft-compare-view.js僅保存≤200個music／storyboard／lyrics／audio／metadata分類及整數序號Set、範圍與頁數。reset先驗證dense array與固定分類再替換，拒絕getter／稀疏／未知值；toggle必須是目前頁面上的整数與明確bool。輸出的indices是隔離陣列，沒有完整原文、DOM、媒體、網路、路徑或保存操作。序號只在目前report有效，不能當成穩定editor ID或持久狀態。

原draft-compare-controller負責完整capture／gate／latest／source核對。DOM在換頁、篩選、bulk、manual toggle前沿controller.read重新核對來源；不依賴disabled按鈕保護。原bounded comparison同時受明細200筆與報告byte限制，較少明細並不代表全部差異已顯示，完整count提示保持。

## DOM與生命週期

web/draft-compare-dom.js只讀完成report並建立literal text、native details與控制項；單頁最多十個自有toggle listener。重建頁面前移除listener並更換render token；晚到的detached callback、disposed／busy／unavailable動作拒絕。程式設定open且已等於純模型時，不重做完整來源讀取；真正manual toggle才核對與更新。bulk只讀一次完整來源，再改目前details.open，不重建正在操作的按鈕。

成功report reset分類、範圍與展開Set。busy／stale／clear／dispose亦清除；新report的相同序號不能承接舊進度。pagehide移除自有動態與靜態listener。按鈕變disabled時焦點移至可用的相反bulk按鈕、可用翻頁或範圍select；不自動搶創作焦點。aria-controls與status提示使用固定控制ID；狹窄版保持既有flow和局部列表捲動。

沒有變更報告comparison1、草稿draft3、下載原文、保存checkpoint或載入／撤回規則。完整JSON／Markdown報告下載沿原來源guard；展開／收合／翻頁／篩選不會另存或修改作品。server只新增固定靜態asset，不新增HTTP／CLI／Agent／MCP operation、auth、依賴或持久程序。

## 驗證範圍

原生IAB兩個入口實際manual、page／filter、bulk和Enter收合通過，21欄、六個帶ID列集合與四份完整歌曲成果逐值保持。1280×720、390×844、1280×360各入口各一次，焦點控制hit、頁面無橫溢；六JPEG只保存於忽略QA目錄，未以圖片檢視宣稱完整視覺接受。JSONclick提示送出，但browser download observer在5000ms到期，未驗證實際保存路徑或檔案。screen reader、真媒體及平台作者／founder接受仍未驗證。

封裝補充：首份指定source的外層與Python runner同為120秒，外層timeout後Windows暫存目錄仍被使用，未發成功manifest。保留失敗ZIP與receipt；只移除核對的自有空暫存目錄，未signal外部程序。外層封裝改150秒，runner仍120秒／兩worker，留出正常收集與清理時間；重新從新提交封裝並核對，原失敗不宣稱成功。
