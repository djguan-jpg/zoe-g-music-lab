# 備份核對的讀取與雜湊名額

## 工作槽與來源

原 backup-verification 純 proof／snapshot／metadata／inspect 保持；單檔上限32MiB、report1只確認選定檔案大小與SHA是否等於本輪已送出的ZIP。它不確認瀏覽器保存、ZIP內容語義、作者、權利或可恢復草稿库。無自動解壓／恢復或覆寫。

backup-verification-controller 在 metadata檢查成功後、呼叫注入 reader前持有一個 work slot，涵蓋讀取與雜湊直到其 finally，每個實例最多兩個。metadata前檢失敗不消耗名額；read拒絕、損壞bytes、hash拒絕與晚回覆都只歸還自己的名額。cancel／refresh來源失效／dispose改變generation及proof，不提早扣除 activeWork，也不宣稱中止native I/O或WebCrypto。滿額時 verify拒絕第三份、保留目前pending／report。旧工作finally在尚未dispose時refresh當前有限view，不能把舊 report／error提交給新來源。

內部view新增 waitingForWork及contextRevision；context pin隔離snapshot的revision、proof bytes／SHA／entry_count，任何身份變更增加本頁epoch。busy不取代來源身份；無效capture回epoch0，不接受焦點接續。dispose清pin。沒有新增wire或保存schema，不序列化原檔案／ArrayBuffer。兩工作槽只是計數保護，不能推算實際RAM、WebCrypto內部copy、全工作台或OS資源上限。

## 共用有限焦點意圖

verification-focus.createController 注入capture、noteFocused、focusPicker、focusNote；只讀嚴格 available／pending／waiting布林與正safe-integer contextRevision，不持有DOM、File、原文、雜湊、网络或持久狀態。明確cancelled先清意圖；有名額嘗試picker，失敗fallback note但不留下接續承諾。滿額且確實聚焦note才保留該epoch。refresh要求仍同epoch、note仍聚焦、沒有新pending且狀態可等待／接續；有空位才移向picker並先清意圖。失效capture、blur、新選檔、來源变更、pagehide／dispose清除。離開又返回note不復活原意圖；一般完成沒有新意圖。

text-verification-dom 與 backup-verification-dom各自把已核對controller view正規化成這四欄。三個原文核對保留原兩read上限及來源／保存callback。備份status note增加tabindex=-1、cancel controls／describedby，同既有role=status與aria-live=polite；green 2px outline只覆蓋四個note的focus。DOM handlers仍只管理自己的listener、選檔與暫態note，不改表單、草稿庫、原文、成果或media。

music_lab_server只新增一個固定靜態verification-focus.js白名單，HTML在兩adapter前只載入一次。沒有新POST／operation、任意路徑、Agent/MCP能力或外網產品呼叫。22基本／29啟庫、Agent1／draft3、其餘schemas保持。唯一交付policy明確38–151共114，未知152拒絕。

## 驗證

新增20 JS（共用focus8、備份capacity12）驗證讀取／hash兩階段快速取消最多兩slot、current不被第三份取代、错误／metadata與dispose、同revision不同proof、blur／epoch／focus失敗和共用DOM。集中105 JS與完整755 Python／1850 JS、151syntax／四Skills通過。452歷史producer ZIP／manifest逐bytes、29 input/output schemas與既有整份／原列比較保持。

Chrome before用restore tag鎖定的三個原備份／文字adapter，而非冒充整個舊版本app；真File讀取及WebCrypto經QA外部固定script閘門，重現三份未完成hash、取消焦點BODY。after14個native chooser（備份10／文字4）：單次read取消回picker、兩hash滿額focus note、当前來源完成才接回；Tab從備份note離開到文字picker，再明確編修另一欄，晚完成保留焦點和編修。F9只改QA來源並refresh，來源變更拒絕接續。真正SHA辨認兩個148byte／CRC有效／同單entry的合成ZIP差異，重試相同檔匹配。這些ZIP只是合成容器，沒有驗證使用者庫備份或實際恢復。

最终10/10 reads、9/9 hashes、4/4 text、gates0、兩匹配true與後續文字保留；正式四status note／aria、共享asset一次、2px solid rgb(49,91,75) focus outline與console0核對。兩原server以原exec handle正常EOF0／context close／deadline join，兩QA頁及一平台查驗臨時頁已關閉；未設viewport、未截圖或嵌入媒體。QA延後完成不是實際慢磁碟／hash性能，DOM及computed style不是完整視覺或screen reader接受。本輪沒有browser download send，也沒有saved-file證明；v149禁止下載歷史入口的安全限制仍遵守，未重試或绕過。

## 可逆及外部狀態

restore-v0.150.0-before-v0.151.0 指向3f6fdff69b278857a569350bec0c9d7460a63973，分支codex/iteration-v0.151.0。由還原tag另建分支審閱，不覆寫草稿／素材或撤銷外部申請。原v150 exact-source ZIP 2910329bytes／SHA 0028a2664dfa977217f7b5ed95bf1fa29657829315099ec3263ae58e9a488b90，CRC與未改launcher／120秒deadline的顺序755 Python／1830 JS還原通過，臨時提取已移除。

六法律／平台文件原bytes保持，PolyForm Noncommercial禁止商用，不另授予AGPL。ZOE. G／djguan-jpg及public保持。使用者登入後唯讀確認四已提交公開頁，仍作者自行聲明／作者身分尚未核實，平台detected license仍NOASSERTION，但公開描述明示禁止商用；不重送、不更新平台內容。來源、封裝SHA、PR、release、程序及容量最終證據留在本機忽略outputs/v151-qa/goal-turn.json，SHA不能替代平台創始身分接受。rolling goal保持active，普通選檔完成後焦點意圖屬後續待評估範圍。
