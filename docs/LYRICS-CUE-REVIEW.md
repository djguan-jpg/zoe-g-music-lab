# 選定歌詞校時待辦（v0.119）

在「要調整的歌詞」選擇原列，按「檢查選定歌詞」取得唯讀待辦；點选開始／結束／文字或作品宣告項定位原欄位。「建立單句報告」核對成功後提供 lyrics-cue-review.json 與 lyrics-cue-review.md。沒有猜測或修改時間；資料零待辦仍須建立完整歌詞包並實聽。

## 共用時間規則與原列

whole lyrics_review 的 _source 驗證與 _analyze 時間演算法供整表和單句共用；原小數／毫秒、missing／invalid、end、multiline、duration、duplicate及horizon overlap順序保持。JS同層以private analyze供review與cueReview使用，v118 strict-own JSON guard、default omissions與old inspect保持。只在add前按selected original row或global row0篩選，計數與200明細上限後置；不能從whole已截斷明細再篩选。全部原句都參與duplicate／長重疊關係，因此選定句可有9999關係，report只列前200明細但保留全部issue_count。

新payload精確{lyrics,row}，lyrics沿原title／duration可省略、cues必要、每列精確start／end／text；最多10000句、每句2000 codepoints、title200、欄位2MiB。row是1起原表順序的整數，bool／空表／範圍外／額外欄位或來源版本覆蓋拒絕。source只輸出title、duration及選定原cue，保留文字／時間原值，total_rows及related_row保留原號。其他句子的自身待辦由整表報告处理；零單句待辦不代表其他句子、匯出格式、完整歌詞、權利或實聽通過。

## Application與四入口

獨立cue-review schema1，固定兩文字檔與needs_review=true；JSON最多256KiB，issues最多200。application共用CLI／HTTP／Agent／MCP，新的只讀operation lyrics_cue_review，沒有模型、登入、媒體生成、路徑或寫入權限。CLI lyrics-cue-review --input明確JSON，或--draft schema3 --row明確原號；input已有row不可override，draft最多1MiB且必須明確row。exit2表示有待辦，0表示所選句無待辦，1表示輸入／I/O失敗；輸出沿既有預設拒覆寫，只有明確--overwrite替換指定輸出。

POST /api/lyrics-cue-review 使用既有loopback／Host／Origin／容量邊界；兩個固定GET只提供本安裝web/lyrics-cue-review.js及DOM.js。Agent1／draft3保持，20基本／明確啟库27工具，需重新discovery；舊26組input/output schemas保持。JSON鍵順序或數字拼法不作來源證明，完整semantic data與固定Markdown仍嚴格核對；不承諾不同來源排版產生相同JSON bytes。

## Browser分層與時效

純cueReview與cueMarkdown重用原生lyrics-review時間分析；checkedResult先核對整份own JSON，再精確root data/files/meta、本次唯一current版本、protocol1／needs_review=true、完整data與兩檔。256KiB JSON嚴格parser與逐值比較，Markdown逐字核對；回傳自有DTO，不直接發布server物件。Unknown／getter／稀疏／隱藏／symbol／undefined／Unicode／非有限值拒絕。

Controller source是整份raw lyrics、唯一stable IDs、selectedId及派生row。即使其他句子的時間、原句順序或IDs改變，也停用舊定位；原值與IDs精確復原可恢復舊純診斷。payload WeakMap保留click-time完整proof，copied／mutated payload、晚回應與source變動拒絕。共享readiness-state與readiness-request將source/current完整核對放在提交之前，pending／error／finally只處理自己的工作。

DOM只讀status、literal文字与分页，最多200明細、每頁20；busy、hidden、stale位置停用，選列不存在時check／report停用。focus原selected issue與revision再查，目標connected／enabled才定位；global row0到作品宣告。報告／選列／IDs／分页不進draft3，下載停用沿原dirty规则。共有草稿、音檔、其他工作台及原输入保持，獨立歌詞HTML預覽不嵌入本模組。

## 版本與驗證

產品119、唯一delivery policy38–119共82，未知120拒絕；新cue-review1與其他schema分开。實際證據见[QA](QA-v0.119.0.md)，可逆说明见[交接](HANDOFF-v0.119.0.md)。授權、private與平台not_submitted保持。
