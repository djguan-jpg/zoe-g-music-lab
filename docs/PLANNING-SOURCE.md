# 歌曲與分鏡的需求核對（v0.26.0）

工作台在提交需求後，先以既有 planning-review 核對回應的資料形狀、狀態、協定及影格連續，再由獨立純 planning-source 核對本次需求與 JSON 成果。全部通過才交給 DOM／成果面板；需求檔回讀經 checkedBrief 走同一層，通過後仍須預覽及明確載入。後續編修／最新讀取／目標工作台保護保持。

## 核對範圍

歌曲：brief.json 必須符合本次需求的清理規則，包括標題、語言、聽眾、核心、曲風、人聲、記憶點、原始歌詞、避免事項、交付清單、BPM／拍數與每一段名稱／小節／能量／任務／聲音配置。固定速度的計算先維持 binary64 運算，每段start／end及總長先確認毫秒精度，再在未捨入值半毫秒範圍內核對，不猜 Python 的二進位小數 tie 方向；毫秒乘積只容許1e-7的浮點運算誤差，不能帶入0.0004秒偏移。段落次序／數量／全部創作文字仍精確比對。傳入 arrangement 時，既有 structure／duration_seconds 是由段落產生的欄位，仍沿既有 domain 規則；example_type 不是創作指令。

music-plan.json 必須與 wire.data 語義相同；資料的段落、文字單位、提醒及尚未生成狀態再對照來源。文字單位仍只是中文字元／ASCII 詞計數，沒有實測音節。Python 歌曲 data.title 與 Markdown 改用已清理的 brief.title，修正前後空白的歌名被工作台拒絕；表單及輸入原檔保持原始文字。

分鏡：mv-brief.json 保持原請求全部欄位、數值／字串型別及陣列順序，不能換成同名的另一份需求。storyboard.json 與 wire.data 語義相同；標題、時長、FPS、畫幅、風格、人物、所有鏡頭文字、原秒數、影格、母題意義、連戲與提醒對照來源。母題提醒維持輸入順序，數字名稱與 __proto__ 都是普通資料；沒有物件 prototype 指令。

JSON 由既有嚴格 json-document 解碼，每份最多8 MiB；拒絕重複鍵含跳脫同名、非有限數字、無效 Unicode 與深度超限，沒有自動修補。比較忽略物件鍵順序及排版空白，保留陣列順序、原文及原始型別。文字修剪與換行對應 Python str.strip／splitlines，FEFF 保留；數字文字另依 Python float 可用空白及十進位／數字／底線處理，不把 bool、null、16進位或非法控制字元當數字。十進位 Unicode 數字表以本機 Python 的 Unicode 類別核對，其他 runtime 仍需驗證。

CSV／Markdown／task 仍來自 application 原有 domain 輸出，不在瀏覽器逐字重新生成或核對。本輪真實九個下載檔、CLI、HTTP、JSON-lines、MCP 全文已與對應需求的 application 比較，換行正規化的比較和原始 bytes SHA 分開。這不代表所有未來文字回應都有逐字的瀏覽器檢查。

## 分層與版本

- Python design 是歌曲規劃輸出；只修正清理後的標題，不改時間算法／原創內容或其他 adapter。
- planning-source 是無 DOM／I/O／網路的純契約；planning-review 的 checkedResult／checkedBrief 共用它。
- 非同步 inspect 的讀取前副本與 isCurrent 仍在核對前，晚回應不觸發 DOM／成果 callback。需求回讀保持既有 latest token／target snapshot／預覽／套用／限定撤回。
- app 只提交、呈現結果及錯誤。核對訊息及 sourceChecked 是暫態，沒有寫入草稿或對外 wire。
- 產品0.26.0；Agent1、MCP2025-11-25、draft3 及全部領域 schema 保持，沒有新增工具／依賴。預設七工具，啟用草稿庫十二工具。

不呼叫 AI／ASR／媒體生成，也不等於實唱、實聽、導演評分或成片驗收。8 MiB 是單份 JSON 回應核對上限，既有 request／草稿限制各自保持。未知或矛盾資料拒絕，舊成果與原編修保留。
