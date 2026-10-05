# v0.97.0 驗證

段落、鏡頭與歌詞可複製到原列後方。段落保留五個編曲欄位；鏡頭保留創作、母題與畫面方向，歌詞保留原句，兩者的開始／結束留白後人工校時。原列、總長與媒體保持；新列可用既有刪除／還原操作管理，處理中或達上限時停用複製。

純 editor-copy／來源隔離與 current/actual-after 核對 → injected controller → delegated DOM → app 原 readValue／writeEntries／markDirty／focus。新 ID 沿原單調序列，原列 IDs／open 保持；open／copy 暫態不進 draft3。40段／1000鏡／10000句，DOM busy／hidden／capacity 在原值讀取及 ID 前拒絕，控制刷新只讀 count／visibility。固定兩 assets；没有新增依賴、operation、schema、模型、網路、timer、路徑或 auth。產品97／唯一 policy38–97共60／unknown98；16基本／23啟庫、Agent1／draft3／legal4／private／FreeTWAI not_submitted保持。

579 Python89.453秒（兩隔離workers／120秒整體期限）／1125 JS／110 syntax／四Skills；17新測試。v96原ZIP還原577／1110，236歷史ZIP／manifest bytes相同，23原 operation input/output schemas相同。41原生觀察，六 display/source 複製對、三份 exact raw draft 複製前後核對；原生File身份、0.5秒／paused及原媒體保持。桌面／390px滑鼠與Enter、新列 focus、40段上限、busy三台、刪除／還原、empty clock與多行歌詞拒絕、補齊後建立及晚回覆保留通過。7原生HTTP完整回覆等於application；7 operations的實際CLI／Agent／MCP與21直接HTTP good/bad/good一致，原 diagnostic exit2／invalid1無輸出／預設覆寫1且bytes保持；actual observed draft3經Python validate／兩種--draft CLI及Agent／MCP reviews回讀。2tabs關閉／viewport reset／2bounded servers及臨時HTTP thread正常停止／console0。六份JPEG留在outputs。草稿下載click已送出，未確認瀏覽器保存的檔案；完整視覺／screen-reader／實聽／媒體／Host／平台接受仍未驗證。

| 核對 | 實際結果 |
|---|---|
| 本機頁面身份／非空白／無framework overlay | 127.0.0.1:8875、v0.97.0、原四台及成果 |
| 原值與來源 | 六完整 display/source 對；三次 raw captureDraft 精確 panel 比較，其他三台與原列保持 |
| 媒體 | CDP僅唯讀觀察；原生File相等、blob來源、paused與0.5秒不變 |
| 上限／busy | 40段實際達上限停用；39段可複製，原刪除紀錄保留；三台實際等待中複製停用，pure三種上限及無讀取／ID／write gate |
| 匯出與草稿 | 未校時新列／多行原句仍被既有完整驗證拒絕，人工修正後正常建立；未完成內容可保存draft3 |
| 舊來源／工具 | v96真ZIP577／1110；236歷史 ZIP／manifest bytes相同，23 schemas保持 |
| Console／程序 | warn/error0；兩tabs、viewport、兩bounded原handles及臨時HTTP thread正常收尾；子程序EOF0 |
| 下載保存 | 原生草稿click已送出，但沒有保存檔確認；未按草稿確認按鈕 |

CLI與Agent核對涵蓋music／storyboard／lyrics／storyboard_timing_review／lyrics_review／music_review／storyboard_review；兩個工作台review另外讀同一actual observed draft。成功檔案逐UTF8 bytes一致，完整Agent／MCP／HTTP回覆包括data/files/meta皆與application一致。CLI music/storyboard --brief；review --input或指定--draft；歌詞CLI以完整現代歌詞包回讀，時間／原句／歷史及完整files相同。沒有新增copy Agent操作。

多行歌詞原文在複製／草稿中保留，既有歌詞包要求單行。原生測試先確認拒絕，再明確人工整理三句及時間後建立；不以自動正規化取代原文。原生晚lyrics review返回時保留開始時間新編修、上一份dirty成果及停下載。

初次新pure測試抓到apply共用object可改expected，已在apply前隔離expected並通過回歸。其餘QA錯誤是未知emptyDraft測試helper、DOM files不在readonly鏡像、disabled按鈕無法press、舊fixture arrangement命名、shot handler文字匹配、snapshot glob含response，以及CLI未知brief額外欄位不是有效invalid oracle；以fresh helper／namespace修正，原失敗紀錄保留。未改既有CLI契約或重送已啟動工作。多行來源的建立拒絕是既有領域契約，非缺陷。

使用frontend-testing-debugging技能，依CUA原生locator click/fill/Enter／filechooser與read-only DOM／CDP觀察；沒有Playwright shell fallback／新套件。390px頁面沒有橫向溢出，表格自行橫捲；幾何與本機截圖不作完整視覺或screen-reader驗收。六JPEG、本轮來源與程序收據皆在outputs/v97-qa，不進原始碼ZIP。完整視覺／瀏覽器保存／正式媒體／Host／平台接受未驗證。
