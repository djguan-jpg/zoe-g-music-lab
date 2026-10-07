# v0.157.0 QA

## v0.157.0 原始碼封裝容量共用檢查

以實際合成Git來源重現producer缺少ZIP目錄容量預檢：1408來源檔、5612 ZIP項目、904856bytes，仍到達故意exit97的trap測試階段；maintenance原本先拒絕4096項目外目錄。trap不是測試成功，沒有成功manifest；原ZIP與SHA f3f0bd0cb31efb33f87d101ef04b712b0f7f03d88583394287b5801f237dd2e0保留於忽略outputs。

純release_zip定義archive64MiB、central2MiB／4096項、footer65557bytes與manifest2MiB各獨立容量 → release_zip_fs有限reader／排他writer → package_release與maintenance共用。producer在ZipFile、解壓、CRC、來源逐檔與測試子程序前拒絕超限來源；manifest完整UTF8 JSON加LF先核對容量，再xb建立，原manifest不能覆寫。FAILED亦排他建立，未知診斷保留，診斷寫入失敗不掩蓋原拒絕。一般classic ZIP既有grammar、完整CRC／ledger／raw Git blob核對仍分層，不宣稱完整ZIP conformance、原子來源讀取或整體RAM上限。

12項新增測試包含實際Git5612項在ZipFile與測試子程序前拒絕、64MiB stat先拒絕、4096／實際目錄／多disk／ZIP64／損壞／comment／長name、UTF8容量含LF／非有限數字／非法Unicode與排他manifest／未知FAILED。777Python（新增12、1既有Windows symlink skip、0expected failures）、1911JS、153syntax及四Skills通過。476四scope歷史文字ZIP／manifest、29input/output schemas與整份／原列comparison bytes保持；原v156精確ZIP3040935bytes／SHA70c5ea26c0f60ed15921577b8db2b344fb95bc59a2b3d40a42c53ab7b76629ce用原120秒launcher還原765Python／1911JS，暫存移除。

產品157／唯一policy38–157共120、unknown158拒絕；release manifest2 raw profile與legacy1／journal1原bytes保持，Agent1／draft3／22基本與29啟庫及領域wire不變，無新增依賴／產品網路／auth／模型或JSON路徑能力。LICENSE／NOTICE／LICENSING／FOUNDER與兩平台紀錄六檔bytes保持；PolyForm Noncommercial／禁止商用、public、ZOE. G／djguan-jpg保持。使用者登入後唯讀核對Zoe音樂公會長與四公開投稿，逐份展開作者欄均自行聲明未核實、NOASSERTION；未重送、修改或宣稱創始身分通過。僅有一個自有查看tab已關閉，無server、browser UI程式變更或保存下載／Host／媒體接受。

restore-v0.156.0-before-v0.157.0→fb099d4ca7aa07704766aa6853fe0f5848167e40、codex/iteration-v0.157.0、CHANGELOG／HANDOFF、指定提交封装與SHA／PR／遠端asset核對維持。入口只更新目前流程，不疊加歷史，七份history與四Skills不變。詳見[容量契約](RELEASE-ZIP-BUDGET.md)。goal保持active。

原trap exit97只證明舊producer到達測試階段，不是全測試通過。before／focused／checks／compatibility／boundary／previous-restore及平台唯讀證據保存在outputs/v157-qa；最終asset／SHA與程序terminal依goal-turn.json。
