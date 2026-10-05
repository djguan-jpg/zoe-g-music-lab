# v0.80.0 交接

`projects.json.release_version` 現在是預期tag v0.80.0，product與固定policy同步。純release_metadata→strict decoder→selected Git blobs→package交叉核對，見[契約](RELEASE-METADATA.md)及[QA](QA-v0.80.0.md)。static expected tag不冒充已發佈；實際remote狀態另外記錄。

起點main4182cd1fee953064eab39d660c9444ca973b5d73，以restore-v0.79.0-before-v0.80.0可逆。分支codex/iteration-v0.80.0；source commit／tree依outputs/v80-qa/source-evidence.json，指定sourceZIP／SHA依outputs/releases/v0.80.0-<source12>/manifest.json，PR及實際下載依pr-evidence.json／release-remote-evidence.json。

553 Python／920 JS／86 syntax／四Skills、168歷史ZIP比對與v79原ZIP545／920還原通過。8新contract＋7版本focus、實際舊ref拒絕且舊封裝bytes保持、CLI／Agent／MCP文件相同與good/bad/good通過。首輪oracle項數及QA input参数的failed records保留；fresh retries通過，未放寬產品契約。

新packager拒絕不一致歷史metadata，沒有改舊source／ZIP／tag；還原舊版使用其已驗證ZIP或Git archive，原包runner保持。產品80／supported38–80／unknown81；14／啟庫21、Agent1／draft3及領域schemas保持。CLI／Agent／MCP／HTTP／web無diff；無新增依賴、模型、登入或path/write/network權限。

沒有新常駐server／瀏覽器tab；owned QA subprocess已正常EOF。final jobs及outputs以inventory-evidence.json／final-audit-aggregate.json為準。latest80／79／78保留，只超七天且exact tag/Git archive可重建才清除；failed36/53、素材／草稿／未知及其他程序保持。FreeTWAI尚未提交，PolyForm Noncommercial／ZOE. G／private保持，rolling goal active。
