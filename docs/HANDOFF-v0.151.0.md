# v0.151.0 交接

## v0.151.0 備份讀取與雜湊名額

修正備份核對連續取消仍累积未完成 read／hash 的可重現問題。原生 Chrome 以還原 tag 的原 adapter 重現三份未完成 SHA 與取消後 BODY 焦點；新 controller 每個核對器最多兩個未完成的完整 read→hash 工作，取消／來源改變不提早釋放，只有該工作 finally 才歸還名額。滿額不啟動第三份、不取代目前 proof；舊完成只刷新目前有限 view，不提交舊 report／error。單檔32MiB保持，這不是整個工作台或實際記憶體用量保證。

新 verification-focus 純注入政策由三個原文核對及備份共用，僅保留來源 epoch 的有限取消焦點意圖。名額有空即回 picker；滿額先聚焦 status note，只有來源相同且仍停在原提示才接續。blur、新檔、來源變更、pagehide／dispose清除，晚完成不搶後續編修焦點。四 note／aria／scoped outline、固定 self asset 與 server 白名單分層；沒有新 operation、Agent／路徑權限、依賴或產品外網能力。

755 Python（1既有 Windows symlink skip、0 expected failures）、1850 JS（新增20）、151 syntax／四 Skills與集中105 JS通過。452歷史 ZIP／manifest bytes、29組 input/output schemas及原整份／原列比較保持。原 v150 ZIP 2910329 bytes、SHA 0028a2664dfa977217f7b5ed95bf1fa29657829315099ec3263ae58e9a488b90，以未改 launcher／120秒 deadline順序還原755 Python／1830 JS，暫存已移除。

原生14次 File選取（備份10／文字4），真正 arrayBuffer及WebCrypto SHA經QA完成閘門核對read取消／hash滿額／相同檔／同大小有效ZIP差異／重試、Tab離開提示及來源變更；全部10read／9hash／4text完成、gates0、console0。正式四note與共享asset只載入一次、2px green outline經DOM／computed style核對；不是慢磁碟、hash性能、RAM、已保存下載或完整視覺／screen reader接受。兩個自有 server原handle正常EOF0、兩QA頁及一投稿查驗臨時頁已關閉，未設viewport。

產品151／唯一policy38–151共114、未知152拒絕；22基本／29啟庫、Agent1／draft3及原schemas保持。六法律／平台文件原bytes、PolyForm Noncommercial、public與ZOE. G／djguan-jpg保持。本輪唯讀確認Zoe／音樂公會長及四公開申請，仍作者自行聲明／創始未核實，禁止商用文字保持，無重送或平台mutation。還原tag／codex分支／exact-source封裝與rolling goal active保持。

## 接續與維護

保留restore-v0.150.0-before-v0.151.0／codex/iteration-v0.151.0與34份可審閱來源文件，exact-source ZIP／manifest提供指定提交。下一輪可重現驗證普通選檔完成後的鍵盤意圖，但不可無條件把晚完成focus到picker或搶後續編修；本輪只處理明確cancel。不能把QA gate當作native慢磁碟、RAM或saved download。

四申請頁仍自稱原作者、待核實；沒有額外重送或平台mutation。最新三個完整封裝保持，只有strict超七天且完整exact tag/source/archive可重建才可清理；partial36/53/141、unverified v77、使用者草稿／media與未知程序保留。只讀本專案outputs與explicit typed jobs，最終inventory需在自身原handle完成後補核對，不能把尚執行中的audit假稱terminal。兩個QA服務與兩頁、單一平台查驗頁已關閉，沒有全域process enumeration／kill或持續服務。rolling goal active。
