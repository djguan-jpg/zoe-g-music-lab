---
name: zoe-music-production
description: 將歌曲需求發展為歌詞、曲風與編曲提示、修改策略和製作交接；適用於 AI 音樂文字創作及製作規劃。
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Music Production

創辦／發起：ZOE. G（GitHub：djguan-jpg）。本技能在此專案新撰寫，AI 協作詳見根目錄 FOUNDER-RECORD.md。

## 使用方式

先讀使用者的需求、已寫歌詞與參考方向，辨識這輪要完成歌詞、生成提示、版本修改或交接。缺少必要資訊時只補問會改變成果的部分。保留使用者已選定的語言、敘事者、曲風與發布對象。

從可感知的情境發展歌詞：角色當下做什麼、看見什麼、有哪些矛盾。副歌聚焦一個能被記住的意象或動作；不要以堆疊情緒形容詞代替敘事。需要押韻時兼顧口語自然和唱句長度。中文、台語等語言的咬字與用字按實際需求處理，不把書面文字當成發音已驗證。

編曲提示描述節奏、樂器角色、人聲質地、段落起伏與避免項目。把歌詞和風格提示分成能單獨複製的區塊。針對使用者選定的工具調整格式；工具規格或服務能力有變動時查官方資料，不假設 API 或不存在的參數。

改版時保留 A／B 的改動紀錄：改了哪個句子、節奏或編曲因素、預期效果、聽感回饋。沒有實際音檔時，結果標為文字／提示草稿；不推定旋律、咬字或混音已通過。

## 交付

按本輪範圍提供可用歌詞、風格提示、段落與時長假設、版本差異及需要聆聽驗證的項目。製作交接還應記錄音檔版本、實際工具、素材來源與可公開範圍。下載、外部發布、模型呼叫及收費操作沿用使用者的具體授權。

## 可重用工具

若已有結構化需求，可在專案根目錄執行：

```powershell
python music_lab.py music --brief examples/first-light-music.json --out outputs/music-run
```

需求含 BPM、每小節拍數、記憶點與 arrangement 時，工具依小節計算段落時間，產生 `music-plan.json`／Markdown、可重新讀入的 `brief.json` 和 `task.md`。能量曲線是設計決策；時間假設固定速度、沒有弱起或自由速度。文字單位不是實測音節。參考範例資料結構，保留使用者指定的記憶點但設計其前後意義改變。

沒有 arrangement 的 v0.1 需求仍只產生任務與 brief。命令不呼叫模型或生成音樂；本機 UI「歌曲設計」提供同樣的可編修流程。

新案例採用自己創作且願意分享的文字，附需求、實際版本差異及回饋。案例範圍和來源應能追溯，不以工具訂閱推定所有素材的使用權。

外部JSON接續採共用嚴格UTF-8／JSON decoder，CLI最多2MiB、最大64層；重複欄位含跳脫同名、無效Unicode與非有限數字拒絕，不能默默取最後一個版本／值。保留原檔，協助另存有效UTF-8後重新預覽；不要把傳輸檢查當創作／媒體驗證。

## 工作台草稿另存（v0.21）

上方狀態核對四個工作台的完整草稿內容。Agent建包／送出下載不表示目前編修已保存；下載後先核對本機檔再明確確認，或明確啟用草稿庫並保存。晚到保存只確認當時的快照，後來編修仍需另存。已驗證現代檔案／庫版本須明確載入，legacy轉換需另存v3。預覽與取消不更改目前狀態，撤回後依內容判定。音檔與成果另存；離頁提醒受瀏覽器互動／裝置限制，不能取代主動保存，沒有自動寫檔或模型呼叫。

## v0.26 跨工具需求核對

保存原始需求。CLI／Agent 的 brief.json 或 mv-brief.json 接回工作台後，先核對本次需求與主要 JSON 成果、再預覽與明確載入；同名不代表相同設計。編修後須重建，核對資料仍需實唱／實聽或審查實際畫面。詳見 ../../docs/PLANNING-SOURCE.md。

## v0.29 工作台段落順序

用「要調整的段落」選定目前列，整列往前或往後移動；同名、原文字、小節與能量保持。限定撤回只還原最近一次順序，保留後續欄位編修；新增／刪除／還原段落或歌曲載入後舊紀錄失效。移動後重建歌曲包及分鏡時間起稿，既有分鏡保持，舊歌曲起稿預覽須重查。Agent／CLI需求與產品協定保持，暫態ID／undo不進草稿或wire。見 ../../docs/MUSIC-ARRANGEMENT.md。

## v0.30 歌曲欄位待辦

先按「檢查歌曲待辦」查看必填、數值範圍與交付清單，點選待辦定位原欄位；建立歌曲與目前歌曲分鏡起稿也先定位第一項。已有歌詞可留白，不補寫內容或改原數字。編修或移動後重查；明確歌曲載入清暫態，其他工作台與音檔保持。有效BPM120.0004可保持精度建立，待辦零仍須完整總長／來源驗證與實唱／實聽。Agent檔案起稿另核對自己的來源再預覽／明確套用，schema／七與十二工具保持。詳見 ../../docs/MUSIC-READINESS.md。

## v0.31 歌曲待辦交接

「檢查歌曲待辦」即時定位；「建立待辦報告」產生music-review.json／Markdown並保留原創作。CLI music-review --input接受panel原字串，或--draft讀modern schema3草稿中的歌曲，兩入口互斥、舊版不靜默轉換。診斷未完成內容也能交付，CLI status2表示報告已寫出且有待修正、0表示欄位零、1為失敗；預設拒絕同名輸出。Agent／MCP新增唯讀music_review，8／13工具需重新discovery，其他protocol／schema保持。原報告帶source與原列，不把零待辦當總長、演唱或素材授權通過；完整歌曲仍要建立與實唱／實聽。編修後重查，其他工作台／音檔／另存狀態保持。見../../docs/MUSIC-REVIEW.md。


## v0.38 完整文字交付

完成本工作台後可下載本輪所有文字成果ZIP與逐檔SHA清單，CLI／Agent／MCP共用 delivery_package。Agent預設摘要，小型ZIP需明確include_archive；不自動寫檔，封裝不等於實聽或實際畫面接受。基本11／啟庫16工具，Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-PACKAGE.md)。

## v0.39 接續文字ZIP

本工作台可選取本工具v38／v39交付ZIP，先核對原清單與逐檔SHA、再明確載入文字成果；表單與已選音檔保留，可限定撤回。跨scope先切換工作台再選檔；讀取中可取消，編修／換台後晚回應不能覆蓋。原文可再下载，但不代表由目前表單重建或正式媒體接受。CLI delivery-inspect／Agent與MCP delivery_inspect共用檢查，啟動時--delivery-zip明確選來源，預設metadata、include_files小型JSON≤512KiB；12／17工具，inspection1／package1／Agent1／draft3獨立。見[共用契約](../../docs/DELIVERY-INSPECTION.md)。

## v0.40 ZIP原文與差異

選ZIP後先審阅目前成果與將載入原文，新增／變更／移除／相同完整摘要；原換行計數與長檔有界預覽，Apply與下載仍保留全文。只替換本工作台成果，表單／音檔／限定Undo保持，不合併。CLI delivery-inspect --compare-input及Agent／MCP delivery_inspect明確baseline同一比較契約，12／17工具保持，comparison1獨立。見[共用契約](../../docs/DELIVERY-COMPARISON.md)。


## v0.41 可保存差異報告

選交付ZIP核對完成後可下載來源SHA與完整變更摘要JSON／Markdown，原成果／表單／音檔保留，載入仍需明確動作。修改後重新核對，不把報告當原文或素材權利驗收。CLI --comparison-report／Agent include_report要求baseline且不能include_files=true，12／17工具保持，report1獨立。launcher可列印明確WAV／ZIP選擇，沒有Host設定或模型呼叫。default text output拒絕raced-in同名檔，多檔可能部分輸出須查看錯誤。見[共用契約](../../docs/DELIVERY-REPORT.md)。


## v0.42 原文下載

成果、草稿、保存版本、接受條件與差異報告共用native UTF-8 bytes，原文與換行保持；長檔只在預覽摘錄，8MiB完整成果下載與ZIP仍全文。編修後舊generated成果停下載，失敗不新增另存確認，明確確認舊檔不覆蓋後續編修。Agent／CLI／MCP既有application／12與17tools／schema與inline cap保持。見[共用契約](../../docs/TEXT-DOWNLOAD.md)。


## v0.43 指定 ZIP 原文

核對完整ZIP後可先下載選定原文，保持目前成果、表單與音檔；empty可下載，removed或來源變動停用。CLI --file-name明確輸出原檔；Agent／MCP file_names需要include_files:true，512 KiB選定JSON cap保持。所有來源檔先完整核對，缺檔整次拒絕；selection1獨立，12／17工具與Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-SELECTION.md)。


## v0.44 原文分段閱讀

ZIP核對後可切目前成果／ZIP原文逐段閱讀，原文下載仍是全文，保持表單與媒體。CLI text-file／Agent-MCP text_window明確讀16KiB原文，後續位置pin前次archive SHA；完整來源先核對，UTF-8字元中間或來源變動拒絕。text-window1獨立、12／17工具與Agent1／draft3保持。見[共用契約](../../docs/DELIVERY-TEXT.md)。

## v0.67 接續歌曲待辦報告

完整 music-review.json 可從工作台「接續歌曲／分鏡需求或待辦報告」選檔。純模型核對全部 source 與 report1，先預覽、再明確載入原始歌曲欄位；留白與未完成數值保持，其他工作台與音檔保留。最近一次載入沿既有限定撤回，後續編修拒絕覆蓋。1MiB 入口、Agent1／draft3／14／19工具保持；報告不表示創作、實聽、權利或平台接受。見[契約](../../docs/PLANNING-REPORT-INPUT.md)。

## v0.69 共用草稿保存

工作台保存會回讀同ID並核對完整原稿後才確認。失敗保留原ID與點擊時草稿供明確重試，不把後續編修代入重試；音檔／成果另存。CLI／Agent既有save與readonly read仍共用Python immutable library，沒有新增JSON路徑／寫檔權限。核對不證明作品品質、作者權利或平台創始接受。見[契約](../../docs/LIBRARY-SAVE-RECEIPT.md)。

## v0.70 共用保存版本預覽

選定版本後，預覽須核對同ID與完整版本資料；讀取完成、套用與匯出前重查目前選擇。切換版本請重新預覽，失敗保留目前編修與音檔。明確整份專案載入／撤回沿既有行為需重選媒體，原保存版本不改寫。CLI／Agent／MCP仍使用同一Python readonly read與immutable library，無新增操作或路徑權限。見[契約](../../docs/LIBRARY-REVISION.md)。

## v0.71 共用備份確認

工作台備份預覽先量測選定ZIP的SHA，再核對完整來源與計數。恢復回覆未確認時保留同一File／SHA供明確重試；只加入／重用immutable版本，不自動載入目前工作台，編修與音檔保持。CLI／Agent／MCP沿同一Python完整備份驗證與immutable restore，沒有新增操作／路徑／依賴。見[契約](../../docs/BACKUP-RESULT.md)。

## v0.72 共用備份下載

草稿庫ZIP完整摘要、實際串流長度與SHA核對後才原生下載交接；可取消自身請求，晚回覆保留編修與媒體。送出提示不是保存成功，音檔／成果／未保存草稿另存。CLI／Agent／MCP維持原完整備份驗證、路徑與immutable規則；無新操作／依賴。見[契約](../../docs/BACKUP-DOWNLOAD.md)。

## v0.73 Agent備份匯出

啟動時--draft-library明確選定來源後重新discovery（20工具；未啟庫14）。可呼叫draft_backup_export，payload={}取得已保存版本的備份摘要；先draft_list取得真ID，再payload={"ids":[已保存ID],"include_archive":true}只取<=512KiB完整ZIP base64。無媒體／未保存編修或成果，自動寫檔不在工具內；需要磁碟ZIP則用既有CLI draft backup --out明確另存。匯出status=prepared_not_saved，不是保存／權利／平台驗收。見[契約](../../docs/BACKUP-EXPORT.md)。

## v0.74 保存清單與回覆

接續工作台保存版本時，先核對完整回覆與分頁資料；錯誤保留清單、預覽及目前內容。未確認保存使用同一 ID 與點擊時草稿重試，後續修改另存；清單只有metadata，版本bytes／SHA由讀取核對，不能當成創作／權利接受。Agent1／draft3／library1與14基本／20啟庫工具保持，見[契約](../../docs/LIBRARY-RESULT.md)。

## v0.75 保存名稱搜尋

選定草稿庫後，可用draft_search搜尋保存名稱及歌曲／分鏡／歌詞名。字面且保留大小寫／空白，不搜尋正文；接續需相同query與前次cursor，來源變更重新搜尋。回覆只有metadata，選定版本仍先預覽／bytes+SHA檢查，再明確Apply；不推定創作或權利接受。基本14／啟庫21需重新discovery，search1獨立、原schema保持，見[契約](../../docs/LIBRARY-SEARCH.md)。

## v0.76 保存搜尋位置

工作台選定搜尋版本時可看保存名稱及歌曲／分鏡／歌詞名的原文命中。零命中與空庫不同，不可讀摘要提示原資料保留；查詢改動仍標示上一份接受query。這些提示不進Agent wire或草稿，draft_search與原schema/14基本/21啟庫工具保持，選定版本仍需核對預覽再明確載入。見[分層](../../docs/LIBRARY-PRESENTATION.md)。
