# v0.150.0 QA

## v0.150.0 取消核對後的鍵盤焦點

原生 Chrome 重現：按取消後 picker 已可用，但 disabled 取消按鈕使焦點落回 BODY。共用純 controller 以完整 scope／revision／原檔名／原文派生暫態 contextRevision → 注入 DOM adapter 的明確取消焦點意圖 → 三個可程式聚焦的 status note 與 scoped focus 樣式。取消後有名額即回 picker；兩個實際 read 未結束時先聚焦提示，僅仍停在原提示、來源未變且 picker 可用才接回。blur、新選檔、來源改變、pagehide／dispose 清除意圖；一般成功／錯誤不移動焦點。原文／成果／草稿保存 proof／條件／媒體與兩個 read 上限保持，epoch 不進 wire 或 draft3。

755 Python（1 既有 Windows symlink 權限 skip、0 expected failures）、1830 JS（新增9）、150 syntax／四 Skills 通過，集中68項取消／焦點／保存 callback 測試。448歷史 ZIP／manifest bytes、29組 input/output schemas 及原整份／原列比較保持。原 v149 ZIP 2888434 bytes、SHA 744321ee85f8fbe1c74a3d92ce8ae8337c306603e9b4dfe675d30afcb2d4f18e 還原755 Python／1821 JS；首次並行稽核觸及原120秒 deadline，保留失敗與原 worker stopped 證據，使用未改 launcher／deadline 的順序重驗通過。

原生 Chrome 10次 File chooser，QA 閘門延後真正原生 arrayBuffer 的完成；實際 Enter 取消、Tab 離開提示、後續編修、來源 revision 改變與成功重試均核對焦點及原文 proof，全部 read settle。正式工作台三個 note 的 tabindex=-1／status／polite／aria 關聯保持，產品 focus outline 2px solid green 經 computed style 核對，console0。QA inline script 初次被既有 CSP 拒絕，改為固定 self-served QA script；QA 起初漏 stylesheet 後補上 link，產品 CSP 未放寬。這不是實際慢磁碟、已保存下載、完整視覺或 screen reader 接受。

產品150／唯一 policy38–150共113，未知151拒絕；22基本／29啟庫、Agent1／draft3及既有 schemas 保持，無新增 operation／asset／依賴／auth／path／產品網路權限。PolyForm Noncommercial、public、ZOE. G／djguan-jpg及六法律／平台文件原 bytes 保留。本轮唯讀確認 Zoe 登入、無待送技能草稿與四公開頁；仍作者自行聲明／創始未核實，禁止商用文字保持，無重複投稿或平台 mutation。三個自有 QA server 原 handle 正常 EOF0、三個 QA 頁及單一投稿查驗臨時頁已關閉，未設 viewport；還原 tag／codex 分支／exact-source 封裝與 rolling goal active 保持。

## 原生驗證範圍

| 檢查 | 結果 |
|---|---|
| before 取消落 BODY | 真 File＋QA completion gate 已重現 |
| after Enter 取消及 cap note／current resume | 通過 |
| Tab 離開提示、後續編修、來源改變不搶焦點 | 通過 |
| 原生匹配重試與10次 chooser | 通過，全部讀取 drain |
| 三正式 status note／aria、green outline、console | 通過，console0 |
| 真慢磁碟、保存下載、完整視覺／screen reader | 未驗證 |

使用已提供 CUA 原生 API，沒有外部 Playwright 或新依賴。依使用者媒體規則沒有截圖或媒體嵌入；computed style／DOM／鍵盤證據不等同完整視覺接受。使用本輪獨立19-byte合成文字，不讀其他本機專案、歷史作品、Downloads或使用者Git。首次並行還原到原120秒deadline屬驗證失敗，保留來源及 stopped worker 證據，未以失敗冒充通過；順序原 launcher 還原通過才製作封裝。
