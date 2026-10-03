# v0.22.0 封裝與還原

分支codex/iteration-v0.22.0；起點main f7c3ddbbe7545b2ebc75ed31eb82cc318100bafd，restore-v0.21.0-before-v0.22.0保留起點。產品0.22.0、audio_loudness schema1；既有協定／草稿與保存schema保持。PolyForm Noncommercial1.0.0、ZOE. G及private保持。

scripts/package_release.py只封裝指定commit，解壓該份ZIP再跑全部Python／JS、Agent與MCP metadata；manifest保存SHA-256、bytes與逐檔摘要。不收錄outputs、完整媒體、私人素材、秘密或其他專案。實際PR、合併、tag、private prerelease、GitHub asset digest及遠端下載byte核對以outputs/v22-qa收據為準。

還原前先保留未提交編修；可用git switch -c codex/restore-v0.21.0 restore-v0.21.0-before-v0.22.0，或git archive到新目錄。main透過revert／私人PR回寫，不reset或強推。前版ZIP的SHA、CRC、安全路徑與182Python／237JS已驗證，驗證用解壓目錄已移除。

原始碼還原與使用者草稿／備份／媒體分開，不覆寫輸入或自動遷移。LUFS結果是新增報告schema1，舊無此欄位的報告保持可讀並明示未提供；重新分析才新增量測，不改舊報告。

見HANDOFF.md、QA-v0.22.0.md與LOUDNESS.md。校對不等於完整規範認證或實聽；true peak、特定Host、完整視覺與FreeTWAI核實仍待。
