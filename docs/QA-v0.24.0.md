# v0.24.0 驗證

2026-10-03 · 合成原創資料 · 本機執行 · ZOE. G。

## 問題與修正

v0.23 真 IAB 將宣告10秒的完整包接上合成4秒 WAV，metadata 無提示覆寫欄位為4.000，source JSON仍10，後續輸出變4秒。獨立頁的實際 Apply 函式在受控 VM 中同樣直接使用 player.duration 覆寫。修正後已有宣告保持；明確採用／撤回只操作時長欄，未裁切或移動 cue。

新增 lyrics-media.js 純比較／注入 controller，共用 lyric-time 毫秒規則。metadata 來源／修訂核對，僅原本空白且未再編修才自動接續。真正下載草稿版本0.24.0／schema3，媒體與撤回暫態不入檔。獨立 HTML Apply 使用明確欄位或沿用來源；曾套用的人工變更保留 review_notes。

初次工作台驗證抓到新增模組未放入實際 defer script，tab31 的 MusicLyricsMedia 未定義；修正載入順序後以全新tab32重驗。新增真HTTP首頁依賴順序回歸，核對 Time→media→app。失敗分頁未計為成功。

## 程式層

221 Python／289 JavaScript、四 Skill／21 JS語法及 git diff --check 通過。四新增 Python測真正共享controller→domain／CLI／HTTP／JSON-lines／MCP；26新增JS測毫秒／非有限／過短媒體、原字串保留、空白接續、pending編修／清空、舊URL／error、撤回／換來源、actual app metadata handler 及 actual獨立Apply／controller。既有獨立Apply測試改為明確宣告欄，仍核對無效短總長不改上次有效data。

同一宣告10秒 request 在CLI／HTTP／JSON-lines／MCP產四檔；採用後與撤回回原宣告、壞短總長後有效請求恢復、no-overwrite／來源保留均通過。真正CLI和MCP四檔bytes一致。工作台原生下載保留10秒／採用6秒 JSON及preview.html，依實際browser package、CRLF→LF後內容一致。原始Python範例以10.0／0.0／2.0序列化、JS以10／0／2；數值語義一致，沒有冒稱原始JSON文字或全部bytes相同。

## 真 IAB：20項

1. 原本空白宣告接續4.000且可撤回。
2. 撤回空白接續保留選定媒體。
3. 匯入10秒包後選6秒媒體，保留宣告／source／cue。
4. 不採用仍建立10秒包。
5. Enter明確採用改6.000、只改宣告並停用舊成果。
6. 新包6秒、cue end2不變，留下時長修改待核對說明。
7. 撤回還原10、保留source／cue／media。
8. 手動5.123後換4秒音檔，宣告保持。
9. controlled current500保留上一份有效output與宣告10。
10. 四秒晚成功在編修為7後丟棄。
11. 四秒晚500在編修為8後丟棄。
12. 損壞WAV無可用時長、停用採用、保留8。
13. 真MCP lyrics.json原生選檔預覽／取消保持資料與音檔。
14. 同檔Enter套用保留來源10與native4秒音檔。
15. 採用後改歌詞文字，撤回時長保留後續文字。
16. 後來手動改時長為9，停用不安全撤回。
17. 真草稿0.24/schema3下載、實檔核對／明確確認。
18. 390×844比較卡left16/right359、兩按鈕left33/right179及left187/right283均未出界。
19. 390px Enter採用／撤回回10。
20. 真本輪草稿原生預覽／取消保持10、後續歌詞和媒體。

tab32最後30則error/warn查詢回空；控制500使用QA helper舊字串v23 controlled lyrics failure，判定仍是本輪真500／四秒延遲，不將字串當產品版本。baseline tab29、failed tab31、final tab32皆關閉，臨時尺寸override清除。合成4／6秒WAV與bad WAV只留outputs，沒有進Git。

## 可還原與邊界

前版v0.23 ZIP523007bytes，SHA a8d16341bb94702dd35ed67cf90dfcabfe8ba285aeaa5e10e776a3930392451f，安全解壓後217Python／263JS通過，臨時還原目錄移除。起點main9c7c2391fbea49468b21330fb12d40289973a089，分支codex/iteration-v0.24.0，restore-v0.23.0-before-v0.24.0指向起點。指定提交ZIP重測／SHA、privatePR／Release、遠端真下載及本輪程序收尾依manifest與outputs/v24-qa收據核對。

file: 離線頁面由browser工具安全政策拒絕，沒有以HTTP／其他browser／CDP繞過。獨立HTML本輪只有共享source及actual函式受控VM驗證；原生離線播放／下載未驗證。DOM幾何不是完整視覺，合成媒體不是正式歌曲實聽。特定AgentHost／其他OS與browser／FreeTWAI投稿和創始人核實未完成。

授權PolyForm Noncommercial1.0.0、private與署名保持，無依賴／模型／網路／auth變更。產品0.24、各既有schema與protocol及六／十一tools保持。維護只盤點本專案outputs／已知PID；保留最新三封裝，未滿七天不清除，使用者草稿／備份／媒體不列Git可重建候選。滾動目標active。
