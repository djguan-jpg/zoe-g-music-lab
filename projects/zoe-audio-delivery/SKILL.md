---
name: zoe-audio-delivery
description: Analyze a selected PCM WAV against explicit delivery conditions and preserve measurable evidence. Use for sample-rate, bit-depth, peak, RMS, integrated-loudness, quiet-edge or stereo-correlation checks before audio delivery.
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Audio Delivery

ZOE. G 發起的原創交付檢查工具。接受格式與數值定義見 [工具說明](README.md)。

先取得收件方的實際接受條件。工具內的 distribution／video 是示範設定，不代表所有平台的標準。工作台可填自訂接受值，或用 CLI 的 rates／bits／channels 指定本次接受條件。

僅分析使用者選定的 PCM WAV，保留原音檔。回報規格、每聲道 sample peak、RMS、DC、滿刻度樣本、頭尾安靜段、整段立體聲相關性、獨立 LUFS 整合響度與 SHA-256。

技術條件通過不等於音樂品質、授權或法律審核通過。滿刻度樣本、負相關性或安靜段只提供聆聽線索；不擅自裁切、正規化或改寫。數位靜音等情況的不可測相關性以 null 表示。

RMS 不當作 LUFS；本版獨立量測 LUFS（單聲道／立體聲、8000–192000 Hz、至少400 ms）。太短、低於門檻或未知聲道位置保留 null／不可測，不以零或 −70 冒充結果。sample peak 不當作 true peak；true peak 尚未提供。沒有響度平台合格線，不擅自正規化。

CLI 範例：

```powershell
python music_lab.py audio --input selected.wav --profile video --rates 48000 --bits 24 --channels 2 --out outputs/audio-run
```

交回實際 JSON／Markdown 報告及仍需聆聽確認的項目。Exit code 2 表示報告已產生且有提醒；不是程式崩潰。

外部JSON接續採共用嚴格UTF-8／JSON decoder，CLI最多2MiB、最大64層；重複欄位含跳脫同名、無效Unicode與非有限數字拒絕，不能默默取最後一個版本／值。保留原檔，協助另存有效UTF-8後重新預覽；不要把傳輸檢查當創作／媒體驗證。

## 工作台草稿另存（v0.21）

上方狀態核對四個工作台的完整草稿內容。Agent建包／送出下載不表示目前編修已保存；下載後先核對本機檔再明確確認，或明確啟用草稿庫並保存。晚到保存只確認當時的快照，後來編修仍需另存。已驗證現代檔案／庫版本須明確載入，legacy轉換需另存v3。預覽與取消不更改目前狀態，撤回後依內容判定。音檔與成果另存；離頁提醒受瀏覽器互動／裝置限制，不能取代主動保存，沒有自動寫檔或模型呼叫。

## 原值條件草稿（v0.37）

工作台另存接受條件schema1，未填完原文可下載並先預覽再載入；自訂欄位不在project draft3中。先核對收件要求，再明確套用；原音檔／其他panel保持。整份專案載入回到示範條件但保留本頁自訂原文。條件下載須核對檔案再確認，後續編修另存。CLI使用 --acceptance-draft selected.json，Agent audio／MCP audio_report嵌入acceptance_draft；與直接profile／rates／bits／channels互斥，JSON不能選路徑。未知／不符／晚回應不替換成果。詳見[完整契約](../../docs/AUDIO-ACCEPTANCE.md)。


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

## 接受條件診斷（v0.64）

未完成條件可先用工作台「檢查自訂條件」定位三欄待辦；或CLI audio-acceptance-review --input條件草稿 --out明確目錄。Agent／MCP audio_acceptance_review payload只含document，回同來源JSON／Markdown，不讀媒體或改原值。零待辦只表示條件可解析，請接續原audio分析與實聽。基本14／啟庫19工具，Host重新discovery；原文、媒體与保存另存狀態保持。見[契約](../../docs/AUDIO-ACCEPTANCE-REVIEW.md)。

## 接續條件報告（v0.65）

在工作台「載入條件草稿或檢查報告」選定draft1或完整review1 JSON，先預覽再明確套用。報告核對全部資料才接續source；未完成原值仍保留，音檔另行分析。CLI audio-acceptance-review --input也接受完整報告，audio --acceptance-draft可使用完整報告的有效來源；預設不覆寫。Agent／MCP payload仍使用原draft1，不接受整份報告或路徑；需自行從已核對檔案提取source。見[契約](../../docs/AUDIO-ACCEPTANCE-INPUT.md)。

## v0.66 撤回條件套用

草稿／完整報告經預覽明確套用後，可按「撤回上次條件套用」。只撤回最近一次的接受條件，音檔與其他台保持；套用後再改動條件會保留編修並拒絕撤回。撤回未保存原值後仍需另存。成功後焦點回取樣率或示範條件選單。沒有新增Agent操作或持久草稿欄位，見[契約](../../docs/AUDIO-ACCEPTANCE-UNDO.md)。

## v0.69 共用草稿保存

工作台保存會回讀同ID並核對完整原稿後才確認。失敗保留原ID與點擊時草稿供明確重試，不把後續編修代入重試；音檔／成果另存。CLI／Agent既有save與readonly read仍共用Python immutable library，沒有新增JSON路徑／寫檔權限。核對不證明作品品質、作者權利或平台創始接受。見[契約](../../docs/LIBRARY-SAVE-RECEIPT.md)。

## v0.70 共用保存版本預覽

選定版本後，預覽須核對同ID與完整版本資料；讀取完成、套用與匯出前重查目前選擇。切換版本請重新預覽，失敗保留目前編修與音檔。明確整份專案載入／撤回沿既有行為需重選媒體，原保存版本不改寫。CLI／Agent／MCP仍使用同一Python readonly read與immutable library，無新增操作或路徑權限。見[契約](../../docs/LIBRARY-REVISION.md)。

## v0.71 共用備份確認

工作台備份預覽先量測選定ZIP的SHA，再核對完整來源與計數。恢復回覆未確認時保留同一File／SHA供明確重試；只加入／重用immutable版本，不自動載入目前工作台，編修與音檔保持。CLI／Agent／MCP沿同一Python完整備份驗證與immutable restore，沒有新增操作／路徑／依賴。見[契約](../../docs/BACKUP-RESULT.md)。
