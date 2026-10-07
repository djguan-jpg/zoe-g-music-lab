# v0.158.0 交接

## v0.158.0 Git 來源串流與自有程序收束

實際合成Git tree重現1908來源檔／2257835bytes：舊producer以capture_output完整接收，才由2MiB純source_tree拒絕；沒有ZIP、測試子程序或成功manifest。原metadata bytes／SHA83201c237bf47fddbb2004074bd1f9249ea702050724a9aaed3e9efaef132dc5與暫存移除證據留在忽略outputs。

純release_capture固定40hex commit／兩種tree參數與有限buffer → release_git_fs兩pipe reader／原Popen handle／60秒deadline及5秒cleanup → producer與maintenance source／restore。stdout2MiB、stderr4096bytes各最多保留limit+1 sentinel，單次read65536；超限不截斷冒充完整結果，不傳入domain／Git archive／成功manifest。固定long／name-only讀取共用adapter；legacy原語義／manifest1、modern raw profile與manifest2／journal1及完整blob／CRC／ledger保持。非零／管線錯誤不回傳原文或stderr私人路徑；逾時與拒絕只kill／wait這次自行啟動的child，關閉自身pipe並join兩reader，不能確認cleanup即拒絕。無全域程序列舉／PID signal／環境讀取／持久job，不宣稱全機或產品RAM上限、所有Git呼叫capture上限或外部讀取原子快照。

新增12項集中驗證：真實Git long／name-only原bytes及未提交編修隔離、超限producer先於domain及archive拒絕、純limit／sentinel／未知參數、兩pipe／非零／逾時／I/O錯誤與原handle及reader結束。第一批測試追蹤器漏read()預設size，錯誤攔截了正常subprocess.communicate；修正測試介面後十二項通過，原失敗log／terminal收據保留，該失敗未改產品adapter。789Python（新增12、1既有Windows symlink skip、0expected failures）、1911JS、153syntax及四Skills通過。480四scope歷史文字ZIP／manifest與29input/output schemas、整份／原列comparison bytes不變。原v157 ZIP3056919bytes／SHAa4f58c00b4363ee13487293245b1ef0ea0b6d07a8bc3016bd8097f038f103fee以原120秒launcher還原777Python／1911JS，CRC通過，暫存移除。

還原首批觸及原120秒deadline，原parent回傳1；原failed worker1的PID／creation identity從實際輸出保留，未印出的worker0 identity不補造。第二次以同一原launcher的report-json選項驗證777／1911，取得兩worker的原start身份與EOF0；來源／deadline／兩worker上限未改，原失敗與重試收據保留。

產品158／唯一policy38–158共121、unknown159拒絕；Agent1／draft3／22基本與29啟庫及domain wire不變，無新增依賴／產品網路／auth／模型／JSON路徑或通用命令能力。六法律／發起／平台原檔bytes、PolyForm Noncommercial禁止商用／public與ZOE. G／djguan-jpg保持；本輪不讀寫FreeTWAI，四既有作者自行聲明未核實投稿不重送。沒有browser UI變更、tab／server或媒體／Host／保存檔案接受。

restore-v0.157.0-before-v0.158.0→f2bf14598ed28344dff8d867ecfb07636d2ecedf、codex/iteration-v0.158.0、CHANGELOG／HANDOFF、指定提交封裝／SHA、PR／遠端原bytes與最終程序audit保持。入口只更新目前workflow，七history及四Skills不改。詳見[Git讀取契約](RELEASE-GIT-CAPTURE.md)。goal維持active。

後續保留pure fixed args／limited buffers、Git process adapter及producer／maintenance分層；未知／超限拒絕、原handle清理與legacy bytes不遷移。完整提交、ZIP／SHA、PR／release與最終實際程序紀錄依outputs/v158-qa/goal-turn.json，不預設run數。全域RAM、真實slow disk／OS無法停止、ZIP跨版本、browser保存／視覺／媒體／Host及平台創始接受仍未驗證。
