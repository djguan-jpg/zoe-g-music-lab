# v0.108.0 交接與可逆

回應核對改用保留型別的共用值比較器。三個原文搜尋及歌詞診斷會拒絕以 `1e400` 等非有限數值替換 `null` 的回覆；歌曲／分鏡與歌詞匯出診斷也不再忽略額外的 `undefined` 欄位。異常回覆保留原創作、上一份成果與音檔，修正來源後可重新操作。

既有 `json-document.sameValue` 純層 → 七個來源／完整回覆核對模組 → 原 current revision／scope controller → 原 DOM 與成果提交。比較原型別、完整自有欄位與 dense 陣列，不轉成 JSON 再比較；字面 Unicode、空白、換行及物件鍵順序獨立保持。有限數字、64層容器與262144對節點上限；不呼叫自有 getter、toJSON 或 caller map。Python producer、application、HTTP／CLI／Agent／MCP、app／HTML與操作權限保持，無新 asset、依賴、模型、媒體生成或外網能力。

產品0.108.0／唯一 policy38–108共71，未知109拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3／所有領域 schema保持。

595 Python（80.641秒，兩隔離 workers／120秒整體期限）、1270 JavaScript、122 syntax及四份 Skill通過；新增17個JS測試。v107已驗證 source ZIP還原595／1253；四種 scope各70個歷史 producer，共280份ZIP與manifest bytes相同，24組schema相同。48原生快照、44完整來源對、四組異常拒絕／正常重試對；40段兩頁與返回、首末及三工作台原欄位焦點、390×844定位、未完成歌詞診斷及還原後建立／完整JSON格式報告均通過。17 native完整wire、四個單一nullable欄位異常回覆、11 CLI／Agent／MCP操作及33 HTTP good/bad/good核對；兩observed draft3 reviews回讀、診斷exit2、無效exit1不輸出、預設覆寫exit1保留bytes。兩個明確換載區段各保留原File身份、同blob、paused／0.5秒／8秒合成音檔；console0、自有tab關閉／viewport reset、自有bounded server正常停止、HTTP thread joined及子程序EOF0。

固定歌詞預覽沿 template1全外框與本安裝模組核對。更新共用模組後，舊v107 HTML所嵌模組不同，現版明確拒絕回讀；同完整package的現版HTML通過，舊檔SHA保持，臨時還原移除。保留舊HTML與完整lyrics.json，需要接續時載入完整JSON並重新建立現版預覽；schema沒有遷移。舊版離線HTML仍保留其原程式，本輪沒有重写或宣稱新修正適用於舊檔。

五個外部JSON非有限數字案例與三個runtime額外undefined案例在基線確實誤判一致；undefined不是可在JSON編碼的欄位值。lyrics-preview只統一共用比較器，未宣稱它有上述基線缺陷。own descriptor／dense檢查不代表通用prototype、Proxy、繼承accessor安全或原子快照；比較器遇throw回傳false但未防止任意caller object的全部副作用。節點上限是比較訪問數，非任意外部物件的記憶體上限。PNG留ignored outputs；實際瀏覽器保存、完整視覺、screen reader、各OS IME、實聽、正式媒體、Host安裝及平台創始接受未驗證。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。

本輪分支 `codex/iteration-v0.108.0`；基線 main `e1e611f2ea555338db71faf36ffb71b1bcdbe528`；還原tag `restore-v0.107.0-before-v0.108.0`。需要恢復時從還原tag另建 `codex/restore-*` 分支，以private PR回復；保留已發布main與使用者草稿。

指定來源提交由scripts/package_release.py封裝；ZIP及manifest SHA-256寫入manifest與ignored QA收據。private PR合併及prerelease以實際遠端下載逐bytes／digest回讀核對，不把後續工作目錄當成封装source。每輪只稽核本工作區outputs與本輪typed run receipts，最新108／107／106受保護；只有嚴格超七天且exact tag／Git archive可重建的封裝才列清除候選。未知資料、草稿、備份、媒體與失敗封裝保持；未完成程序不以bare PID判定或強制終止。

下一輪先找具體可重現缺口，維持純模型、共用application與來源guards；不以增加工具數、宣稱AI或媒體生成取代實際驗收。
