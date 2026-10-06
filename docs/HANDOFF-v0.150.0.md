# v0.150.0 交接

## v0.150.0 取消核對後的鍵盤焦點

原生 Chrome 重現：按取消後 picker 已可用，但 disabled 取消按鈕使焦點落回 BODY。共用純 controller 以完整 scope／revision／原檔名／原文派生暫態 contextRevision → 注入 DOM adapter 的明確取消焦點意圖 → 三個可程式聚焦的 status note 與 scoped focus 樣式。取消後有名額即回 picker；兩個實際 read 未結束時先聚焦提示，僅仍停在原提示、來源未變且 picker 可用才接回。blur、新選檔、來源改變、pagehide／dispose 清除意圖；一般成功／錯誤不移動焦點。原文／成果／草稿保存 proof／條件／媒體與兩個 read 上限保持，epoch 不進 wire 或 draft3。

755 Python（1 既有 Windows symlink 權限 skip、0 expected failures）、1830 JS（新增9）、150 syntax／四 Skills 通過，集中68項取消／焦點／保存 callback 測試。448歷史 ZIP／manifest bytes、29組 input/output schemas 及原整份／原列比較保持。原 v149 ZIP 2888434 bytes、SHA 744321ee85f8fbe1c74a3d92ce8ae8337c306603e9b4dfe675d30afcb2d4f18e 還原755 Python／1821 JS；首次並行稽核觸及原120秒 deadline，保留失敗與原 worker stopped 證據，使用未改 launcher／deadline 的順序重驗通過。

原生 Chrome 10次 File chooser，QA 閘門延後真正原生 arrayBuffer 的完成；實際 Enter 取消、Tab 離開提示、後續編修、來源 revision 改變與成功重試均核對焦點及原文 proof，全部 read settle。正式工作台三個 note 的 tabindex=-1／status／polite／aria 關聯保持，產品 focus outline 2px solid green 經 computed style 核對，console0。QA inline script 初次被既有 CSP 拒絕，改為固定 self-served QA script；QA 起初漏 stylesheet 後補上 link，產品 CSP 未放寬。這不是實際慢磁碟、已保存下載、完整視覺或 screen reader 接受。

產品150／唯一 policy38–150共113，未知151拒絕；22基本／29啟庫、Agent1／draft3及既有 schemas 保持，無新增 operation／asset／依賴／auth／path／產品網路權限。PolyForm Noncommercial、public、ZOE. G／djguan-jpg及六法律／平台文件原 bytes 保留。本轮唯讀確認 Zoe 登入、無待送技能草稿與四公開頁；仍作者自行聲明／創始未核實，禁止商用文字保持，無重複投稿或平台 mutation。三個自有 QA server 原 handle 正常 EOF0、三個 QA 頁及單一投稿查驗臨時頁已關閉，未設 viewport；還原 tag／codex 分支／exact-source 封裝與 rolling goal active 保持。

## 接續

保持 restore-v0.149.0-before-v0.150.0／codex/iteration-v0.150.0、31份可審閱來源文件及完整 source ZIP／manifest。下一輪以可重現使用缺口改善；不可將 gate QA 當作 native slow-disk 或 saved download，也不可繞過已禁止的下載紀錄入口。

四原創專案已公開投稿，名稱ZOE. G、帳號djguan-jpg，仍需平台核實；不再重送。最新三版保護，strict超七天且完整 exact tag/source/archive 可重建才可清理；partial36/53/141、unverified v77、使用者草稿／素材與未知程序保持。沒有進行清除或廣泛 process signal；最終 inventory 依現場紀錄，不把自身尚在執行的 audit 假稱 terminal。rolling goal active。
