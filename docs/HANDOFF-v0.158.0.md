# v0.158.0 交接

## v0.158.0 Git 來源串流與自有程序收束

實際合成Git tree重現1908來源檔／2257835bytes：舊producer以capture_output完整接收，才由2MiB純source_tree拒絕；沒有ZIP、測試子程序或成功manifest。原metadata bytes／SHA83201c237bf47fddbb2004074bd1f9249ea702050724a9aaed3e9efaef132dc5與暫存移除證據留在忽略outputs。

純release_capture固定40hex commit／兩種tree參數與有限buffer → release_git_fs兩pipe reader／原Popen handle／60秒deadline及5秒cleanup → producer與maintenance source／restore。stdout2MiB、stderr4096bytes各最多保留limit+1 sentinel，單次read65536；超限不截斷冒充完整結果，不傳入domain／Git archive／成功manifest。固定long／name-only讀取共用adapter；legacy原語義／manifest1、modern raw profile與manifest2／journal1及完整blob／CRC／ledger保持。非零／管線錯誤不回傳原文或stderr私人路徑；逾時與拒絕只kill／wait這次自行啟動的child，關閉自身pipe並join兩reader，不能確認cleanup即拒絕。無全域程序列舉／PID signal／環境讀取／持久job，不宣稱全機或產品RAM上限、所有Git呼叫capture上限或外部讀取原子快照。

新增12項集中驗證：真實Git long／name-only原bytes及未提交編修隔離、超限producer先於domain及archive拒絕、純limit／sentinel／未知參數、兩pipe／非零／逾時／I/O錯誤與原handle及reader結束。第一批測試追蹤器漏read()預設size，錯誤攔截了正常subprocess.communicate；修正測試介面後十二項通過，原失敗log／terminal收據保留，該失敗未改產品adapter。795Python（新增18、1既有Windows symlink skip、0expected failures）、1911JS、153syntax及四Skills通過。480四scope歷史文字ZIP／manifest與29input/output schemas、整份／原列comparison bytes不變。原v157 ZIP3056919bytes／SHAa4f58c00b4363ee13487293245b1ef0ea0b6d07a8bc3016bd8097f038f103fee以原120秒launcher還原777Python／1911JS，CRC通過，暫存移除。

還原首批觸及原120秒deadline，原parent回傳1；原failed worker1的PID／creation identity從實際輸出保留，未印出的worker0 identity不補造。第二次以同一原launcher的report-json選項驗證777／1911，取得兩worker的原start身份與EOF0；來源／deadline／兩worker上限未改，原失敗與重試收據保留。

產品158／唯一policy38–158共121、unknown159拒絕；Agent1／draft3／22基本與29啟庫及domain wire不變，無新增依賴／產品網路／auth／模型／JSON路徑或通用命令能力。六法律／發起／平台原檔bytes、PolyForm Noncommercial禁止商用／public與ZOE. G／djguan-jpg保持；登入後唯讀確認Zoe音樂公會長與四公開投稿，逐份展開作者欄均仍自行聲明未核實／NOASSERTION，說明保留禁止商用；不重送或修改。無browser UI程式變更，一個自有查看tab已關閉，使用者分頁保持；無server或媒體／Host／保存檔案接受。

restore-v0.157.0-before-v0.158.0→f2bf14598ed28344dff8d867ecfb07636d2ecedf、codex/iteration-v0.158.0、CHANGELOG／HANDOFF、指定提交封裝／SHA、PR／遠端原bytes與最終程序audit保持。入口只更新目前workflow，七history及四Skills不改。詳見[Git讀取契約](RELEASE-GIT-CAPTURE.md)。goal維持active。


首份v158來源552e8e3d57791d39273fac323f3b1de90b5e0673的封裝測試再由worker1觸及120秒期限，原parent EOF1；ZIP／FAILED及原輸出保留，沒有成功manifest或發布。原worker1自我登記身份保留，未印出的worker0 identity不補造。

純test_schedule用完整獨立discovery的唯一test IDs，將個別方法平均分到兩worker，各組保持原相對順序 → 原launcher每worker獨立發現及執行 → parent再次獨立discovery／完整ID及count／原handle EOF核對。795方法分為398／397；既有120秒整體期限、兩worker與summary1／傳輸容量不變，不略過或重複測試。不假設方法耗時相同或保證速度；class fixture可在兩個隔離程序各自執行。現場共用HTTP fixtures均使用本機動態port0並teardown，個別filesystem fixtures用自身暫存；集中22項（6新增排程、16既有summary／真worker／deadline）通過。

修正後完整Python實測114.062秒、795（1既有skip／0expected failures），兩原worker EOF0，1911JS／153syntax／四Skills通過；最初789批與所有失敗收據保持。分批CLI每次最多32個明確run records，完整清單去重並核對每批terminal後聚合；不增加原維護cap、權限或程序列舉。失敗封裝是第4份partial，保留不清理。

後續保留pure fixed args／limited buffers、Git process adapter及producer／maintenance分層；未知／超限拒絕、原handle清理與legacy bytes不遷移。完整提交、ZIP／SHA、PR／release與最終實際程序紀錄依outputs/v158-qa/goal-turn.json，不預設run數。全域RAM、真實slow disk／OS無法停止、ZIP跨版本、browser保存／視覺／媒體／Host及平台創始接受仍未驗證。
