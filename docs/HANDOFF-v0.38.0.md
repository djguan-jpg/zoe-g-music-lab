# v0.38.0 交接與可逆

四工作台「下載本輪所有檔案ZIP」包含目前全部文字成果及逐檔SHA清單，修改後需重新建立。CLI／Agent／MCP共用純封裝；Agent預設摘要、小型inline需明確選擇，基本11／啟庫16。封裝不判斷創作或媒體品質，原音檔保留。見[使用／契約／分層](DELIVERY-PACKAGE.md)及[QA](QA-v0.38.0.md)。

328Python／491JS／4Skill／39syntax及diff通過，原生四工作台5次真ZIP下載／全部SHA／CRC／server摘要、4秒late與TTL前取消、390px鍵盤及1366pxDOM幾何核對。v37指定ZIP312／460還原通過。正式媒體／實聽／完整視覺／特定Host／FreeTWAI待驗證，rolling active。

## 分支與恢復

branch `codex/iteration-v0.38.0`；`restore-v0.37.0-before-v0.38.0`指main起點 `7e1947e99139d58e11560337b64539bf3dd1de46`。恢復舊功能可從restore tag另建分支，勿hard reset帶有未提交創作的工作區。指定本輪source由v0.38.0 tag及outputs/releases/v0.38.0-提交前12碼/manifest.json確認；main merge commit另由私有PR收據確認。

前版v37來源084239fe73f4cc24f2706f9991fc808fcfbbcf99／818764bytes／SHA ddb27b522fc8af13f1cfed1a6286b36103a26c562409cff0f8fbcbf53a5f2568，位於outputs/releases/v0.37.0-084239fe73f4。還原不帶outputs、私人素材或秘密，原媒體另存。

## 每輪接受與維護

本輪source由明確檔案白名單提交，legal4維持；指定commit Git archive解壓完整Python／JS、Agent discovery／MCP初始化，接受後private PR merge／private prerelease及遠端實際下載核對SHA、Git refs／tree／main clean。發布結果與確切commit／ZIP hash見outputs/v38-qa/source-evidence.json、package-evidence.json、release-remote-evidence.json；這些收據不進Git或公開產物。

QA server286280以原handle正常停止、tabs60／61已關閉且viewportreset；下載staging自身slot及root清除，合成媒體及測試ZIP保留。每輪唯讀盤點outputs及明確run identity，latest3保留；只有超七天且exact Git archive／tag可重建的完整本專案封裝才可清除。unknown／舊FAILED封裝、媒體、草稿、備份及非本輪程序保留。不設heartbeat，不用Agent擴權清理。

下一輪由本輪main／source tag開始另建iteration branch與restore；選可重現缺口持續改善，保留共享application／pure controller／DOM及各schema界限。不要將文字manifest雜湊核對當音畫接受或平台創始人認定。
