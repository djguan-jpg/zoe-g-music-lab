# 保存版本預覽來源 · v0.70

選定保存版本後，先唯讀回讀與預覽，再明確套用或匯出原案。基線會接受要求A卻返回B的完整合法草稿；新版本以requested ID及讀取開始時的完整選定metadata核對來源，並在讀取完成、Apply與export重查目前選擇。

## 純層與共用保存

library-revision.js無DOM／media／I/O／路徑。checkedRead exact entry／draft／status，status只接受draft_only_not_validated；完整draft由既有validateDraft核對與隔離。checkedEntry只接受library1／draft3、requested draft-32lowerhex ID、非空且最多200 Unicode codepoints原label、UTC保存時間（Z／±00:00）、SHA64lowerhex、有界safe integer bytes1–1MiB、created_with最多64 codepoints及exact三項titles。titles與已驗draft的原music-title／mv-title／lyrics-title前120 codepoints精確一致，Unicode不正規化。checkedEntry要求呼叫者先驗draft。

checkedSelection只比較已驗entry與選定metadata的同ID及全部值，不是獨立完整record validator。整份來源須先經checkedRead／checkedEntry建立。物件鍵順序不是來源證明；回傳隔離值。library-receipt的ACK重用checkedEntry，readback重用checkedRead，仍額外核對完整click-time draft（含全部panels／metadata／列順序）與payload.label。保存回讀與uncertain pending語義見LIBRARY-SAVE-RECEIPT.md。

## 控制器與工作台

draft-library required checkRead，缺少時拒絕初始化。read(id,expectedEntry)在await前clone選定entry，依既有latest token取消過期成功／錯誤，再核對完整read與原replacement preview目標snapshot。Production注入完整library-revision checker，再核對當前DOM選定ID與清單record全部metadata；沒有selected entry須重新選定並預覽。部分既有controller-focused tests明確注入generic callback以隔離原生命週期測試，不能作來源核對證據；新專用測試與actual app callback覆蓋production checker。

Apply與export都重新核對pending entry與active selection。Apply另沿既有target全部panels與native File identity檢查，後續編修拒絕整份替換；export取已驗保存原稿，不取目前編修或顯示摘錄。修改selection清preview及取消read，顯示「選定版本已變更，請重新預覽；目前工作台與音檔保留。」；晚回應不能覆蓋提示。list auto-selection變動也清preview。相同ID但完整metadata改動會拒絕完成／套用／匯出，不自行載入另一版本。

讀取、清單、預覽、失敗與被拒絕Apply／export保留目前工作台、native音檔與另存提醒。明確整份project Apply與Undo沿既有loadDraft行為清媒體參照並提示重選；原媒體檔與immutable保存版本不刪／不改。僅讀取不解除未保存提醒，明確載入才沿原retention checkpoint。

## 實際證據與界限

Python DraftLibrary.read沿原record／draft／磁碟bytes與SHA驗證；browser比較完整回讀原值及metadata，未獨立取得磁碟canonical bytes重算SHA。純checker只核對data，沒有新增整個HTTP meta／files envelope核對。不證明作者、權利、作品接受、耐久保存或原子快照。

三項Python整合使用真immutable library、HTTP固定asset及CLI／Agent／MCP readonly read；13項新JS覆蓋來源與active selection／latest／target／media／save共享及切換提示。原生故障僅修改server response副本，原磁碟及producer回覆保留。完整backend bytes／SHA與wire來源比較已核對；原生DOM預覽只核對識別欄位／原值標記／列數，未聲稱逐欄或逐bytes完整DOM驗收。guarded export有實際點擊但在來源不符時拒絕，未點擊成功下載，saved file未驗證。

產品70／明確來源38–70共33項／未知71拒絕；Agent1／draft3／library1、14基本／明確啟庫19工具保持。沒有新增schema／operation／模型／依賴／任意路徑／網路權限。legal4 PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、private、FreeTWAI not_submitted保持。
