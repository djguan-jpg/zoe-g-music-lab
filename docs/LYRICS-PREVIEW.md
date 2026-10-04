# 完整歌詞預覽核對（v0.55）

v54 對 preview.html 只核對存在與字串。已用真實 application 產生的四檔回應重現：空 HTML、另一完整來源、改動 apply 程式都會被舊 guard 接受，其他檔與 data 正確也不足以證明預覽相符。現在在建立與所有帶時間匯入提交前一併核對。

## 共用範本與分層

musiclab/assets/lyric-preview.html 是既有離線頁面的單一固定範本。musiclab/lyric_preview.py 只讀本安裝的固定模組；preview_contract 提供 format=zoe-lyrics-preview-template、schema_version=1、template、timing_js、package_js 精確五欄。package_js 是 strict JSON／package／media 模組，timing_js 是同一時間模組。render_preview 單次替換 title／JSON／modules，歌詞內 __DATA__／__TITLE__ 原字元保持；HTML title escape，JSON 的 < 與 U+2028／U+2029 安全轉義。NaN 拒絕。

既有 allowed Host／Origin 檢查之後，固定 /lyric-preview-contract.js 回傳 no-store 的 JavaScript；固定 /lyrics-preview.js 是純核對層。契約沒有使用者路徑、金鑰或登入。index 依序載入契約／pure inspector／result guard。CLI／JSON-lines／MCP／HTTP 沿共用 application 產生相同自帶模組的 HTML。沒有新增 tool 或 Agent 權限，13 基本／18 啟庫、Agent1／draft3／export-review1／export-source1保持。範本schema1與產品55分開；交付來源明確38–55，未知拒絕。

## 純核對

web/lyrics-preview.js createInspector 捕捉已驗證的契約字串，不依賴 DOM／網路／應用全域狀態。檢查精確欄位與 schema1、有效Unicode、contract256KiB、非空模組及固定slot數，再隔離捕捉值；呼叫端後來改動原契約不影響既有 inspector。Node／注入測試明確傳契約，browser取本安裝固定script；缺少／未知／損壞契約拒絕。

inspect 對 expected 完整 package 做原 schema 檢查；HTML有效UTF-8且最多16MiB，唯一精確 initial JSON標記。內嵌 JSON 不得含 literal < 或 U+2028／U+2029，strict decoder最多12MiB、禁止重複鍵／錯誤Unicode／非有限數等；解碼後完整package仍最多2MiB。12MiB容納合法2MiB來源在六字元 escape 下的膨脹，不把encoded上限誤作來源上限。

完整 title／cues／duration／estimated／timing／review_notes 與 expected 語義值相等。物件鍵順序與 JSON 空白／1.0 拼法可不同，array順序、原字元、數字值及完整歷史不可不同。沿原 checked raw JSON重新組合固定範本與模組；與整份收到 HTML 逐字相同才接受，因此heading／CSS／模組／runtime／額外script／前後內容改動都拒絕。核對不解析或執行HTML；render 是純原生對照 helper，不在頁面執行回傳內容。

web/lyrics-result.js checkedResult 對原 data／JSON／LRC／SRT核對後用 inspector檢查HTML，再複製回覆；createChecker可綁定一份固定契約。lyrics-import controller接受明確注入previewContract，所有帶時間回應走同一guard，TXT seed規則保持。app沿既有revision先重查，再核對，最後才更新table／files；wrong／corrupt／late／cancel保留原編修與成果。改字後原review_note保留，另記編修並移除過時的applied_shift_seconds，不能冒稱舊來源仍未編修。

## 相容與限制

這是對本安裝固定範本與完整來源的相符檢查，不是數位簽章、通用任意HTML安全掃描、作者／版權／實聽驗收。不同範本或模組的舊HTML不作新lyrics操作回應接受；匯入旧完整JSON會重新產生目前HTML。交付ZIP檢查仍只把HTML當原文檔，不執行它；本輪未更改其策略。離線頁面本身編修UI／runtime內容保持，合成樣本render與v54逐bytes相同；原生只執行自有正確合成預覽，沒有執行被改動的測試回應。

見[實測](QA-v0.55.0.md)及[可逆交接](HANDOFF-v0.55.0.md)。


## v0.56 範本內容更新

固定package_js另嵌入既有LRC文法／export規則及新的離線提示controller／presenter；結構仍為template1精確五欄，來源2MiB／encoded12MiB／HTML16MiB／contract256KiB保持，整份HTML核對包含新程式。v55三模組與bytes相同的說明為歷史證據；本輪範本有明確功能變更。詳見[獨立提示](LYRICS-OFFLINE-EXPORT.md)。


## v0.57 下載模組更新

固定package_js另嵌入lyrics-download純格式準備與既有web/text-download模型／DOM adapter，獨立頁共用有界送出與回收；template1精確五欄与256KiB契約／2MiB來源／12MiBencoded／16MiBHTML上限保持。整份外框核對包含新模組與送出訊息，變造仍拒絕。見[下載契約](LYRICS-DOWNLOAD.md)。


## v0.58 Unicode來源核對

固定共用JSON helper與package validator新增物件來源文字核對，whole-envelope包含新內容，template1與原容量／完整來源核對保持。非法名稱／cue／note在Apply前拒絕，valid文字不修改。見[契約](LYRICS-UNICODE.md)。
