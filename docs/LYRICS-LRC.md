# LRC 原文與來源核對（v0.50）

匯入 UTF-8 LRC 時先預覽，再明確套用；原檔不修改。每行只把相鄰的行首 `[mm:ss]`／`[mm:ss.f]`（小數1至3位，ASCII數字）視為時間標籤，可有行首空格／tab。第一個不是相鄰時間標籤的字元起，全部是歌詞：前後空白、tab、句中的時間標籤／offset、HTML字面、Unicode U+0085／U+2028／U+2029 均保留。只以 CRLF／CR／LF 分行；文首 BOM 只移除一次，第二個 BOM／句中字元不猜測為標籤。

offset 必須單獨一行 `[offset:+125]`；可有前後 ASCII空白／tab、不分大小寫。最後有效獨立行的整數毫秒套用一次，之後明確整批位移仍沿既有 edits。句中的 `[offset:125]` 不移動全曲。未帶行首時間的 metadata／說明行忽略，無效數字行首時間拒絕；未知 metadata 不補寫。時間以整數毫秒計算，超安全整數範圍、轉秒無法保留毫秒或位移後負時間拒絕。重複／重疊與總長邊界仍由既有 validate_cues 驗證，不裁切、不猜測修正。

分層：musiclab/lyrics_lrc.py 只解析 syntax／literal remainder → lyrics 的既有 edits／validate／package → application 共用 HTTP／CLI／Agent／MCP。musiclab/assets/lyrics-lrc.js 是同契約的原生純模型，沿用 lyric-time；lyrics-import 對 LRC 重新從所選原文 normalize，核對回應 cues／duration／estimated／timing、空 review_notes 及 LRC／SRT 輸出，再沿既有 preview／proposal／顯式 Apply。仍核對 lyrics.json 與 data 一致；preview.html 僅存在與文字型別檢查，沒有重建／執行或完整驗證 HTML。SRT 的多行合併及一般 JSON 匯入保持既有契約，本輪不宣稱它們有新增原文解析核對。

多標籤 `[00:01][00:02]字` 仍展開兩句。若歌詞字面本身緊接時間標籤並以另一個 timestamp 開頭，LRC 無法分辨它與多標籤；請以版本1 lyrics.json 保存完整 cues／文字／句尾／總長。沒有自創 escape 格式、添加空白或改寫字面。LRC 只保存開始時間；SRT 多行原排版仍需保留原檔。

原文預覽 textarea 顯示換行受瀏覽器正規化，但編修欄沿既有 raw-fields 保護原值，特殊字元可見表示不替換其底層原文。原生再次「讀取歌詞」已核對 CR／CRLF／tab 等原值仍能得到相同 cue；下載控制送出不等於保存完成。撤回載入只還原目標草稿、保留其他工作台編修，成果原文保留並標上一份、停用下載，需重新建立。

產品0.50、明確交付來源0.38–0.50，Agent1／draft3／歌詞包1／12基本與17啟庫工具、各交付schema保持。未知版本拒絕，沒有模型、依賴、外網呼叫或新寫檔權限。ZOE. G／djguan-jpg、PolyForm Noncommercial 1.0.0／private與FreeTWAI not_submitted保持。
