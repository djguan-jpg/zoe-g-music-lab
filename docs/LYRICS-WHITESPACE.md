# 歌詞時間原值與空白判定

v0.159.0 修正瀏覽器與 Python 對時間字串的接受差異。U+FEFF（BOM）是欄位原值的一部分，不能當成空白、移除後當有效時間，或因音檔載入而自動覆寫。LRC／SRT 文件開頭依各自解析契約允許的 BOM 處理保持；本契約只涉及已進入時間欄的字串。

純 `lyric-time.js` 提供兩個內部入口：`trim` 依 Python `str.strip` 判斷欄位是否空白，`number` 依既有 ASCII 十進位文法及 Python `float` 數值空白範圍檢查。兩種集合分開：U+001C–U+001F 可形成空白欄位，包住數字時仍拒絕；U+0085 等合法數值空白可包住數字，BOM／零寬字元不可。Unicode 數字、底線、十六進位、非有限數字與負時間拒絕保持；毫秒 half-away-from-zero 與負值下溢規則不變。

匯入、完整包套用、建立、整批校時、撤回、句首標記、新增句子、音檔時長 controller 與固定獨立預覽共用上述判定。排序與 JSON payload 的數值轉換使用已驗證的 `number`，避免 `Number` 對 U+0085 來源產生 NaN。撤回仍按實際數值相等判斷，後續含 BOM 的編修不算相同時間；保留編修與可供修正重試的紀錄。

判定不改寫原欄位。空白宣告只有符合既有音檔來源、revision 和原值條件才自動接續；明確採用／撤回只改時長。完整包匯入不把無效宣告當空白，套用前拒絕；預覽、取消、current／late 防護保持。成功建立時原有時間正規化與表格呈現保持。

Python 接受規則不變。共用 application 服務 HTTP、CLI、JSON-lines Agent、MCP；Agent1、draft3、領域 schemas、22基本／29啟庫操作、容量與 overwrite／路徑權限保持。固定 preview template1 沿本安裝完整 script／外框核對，沒有外部 script、模型、依賴或產品網路能力。

合成測試核對所有 Python strip 空白、BOM／零寬／C0 數值邊界、原值保留、採用／撤回與晚編修、原生音檔 metadata，以及四 adapter good／bad／good 接續。獨立預覽的 number input 自行限制部分文字；完整來源的 BOM 拒絕另由共享 domain／嵌入 script 驗證，不冒充原生數值欄允許任意字串。實聽、保存下載、完整視覺與創始人身分另行驗證。
