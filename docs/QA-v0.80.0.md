# v0.80.0 驗證

起點main4182cd1fee953064eab39d660c9444ca973b5d73，restore-v0.79.0-before-v0.80.0及codex/iteration-v0.80.0。`outputs/v80-qa/gap-evidence.json` 以source 8ed33dd966059a98aa2b5f8a6b065793df82ce7a與實際GitHub release證明：product0.79、marker release_version v0.77，但remote已published v0.79。原packager沒有tag一致性門檻。

8個新增release metadata測試與7個既有版本測試通過：純層不改輸入、frozen identity、stale／missing／malformed tag、product/schema/policy衝突、strict JSON／Unicode／64KiB、真Git選定旧commit而工作metadata更新或損壞、錯來源在archive前拒絕，以及超大blob在show前拒絕。真Repo指定v79 source由新CLI exit1拒絕，既有ZIP／manifest SHA完全不變，無FAILED.txt或新archive。

完整553 Python（69.375秒、兩隔離worker、120秒總期限）、920 JS、86 syntax、四Skills通過。首輪Python553通過、JS919/920，一個歷史oracle長度仍42，加入80版後需43；只更新獨立oracle長度，再以fresh registered helper完整通過。原failed record/log保留，沒有改成從policy自動推算oracle。

實際CLI／Agent／MCP合成歌詞文件逐bytes一致；Agent good/bad/good=true/false/true，額外path按原契約invalid_input。MCP initialize＋tools/list＋lyrics_validate核對product0.80、protocol2025-11-25與14工具，Agent1保持，全部自有subprocess EOF exit0。首輪QA誤用CLI positional input被argparse拒絕，fresh helper改成既有--input後通過，產品CLI未改。

168組歷史交付ZIP／manifest（四scope×38–79）與v79实际producer bytes相同。v79原sourceZIP1530089bytes／SHA0287ef4ccc8a5c5e36a34d1afab5ff2fa74f39d7d8e067ef4be064426f182584，還原545／920通過，temporary restore清除。root web／HTTP／Agent／MCP／application與領域程式均無diff；未另開常駐服務或瀏覽器tab，未重做完整視覺或實聽驗收。

指定source封裝內再跑完整suite及Agent／MCP metadata，結果以package-evidence／manifest為準。merge／tag／release前核對expected tag，實際下載與remote ref/tree核對以發佈後release-remote-evidence.json為準，本文件不宣稱尚未執行的發佈結果。

最後唯讀outputs及typed jobs盤點／清理門檻以inventory-evidence.json、final-audit-aggregate.json為準；latest80／79／78保留，僅超七天且exact Git/tag可重建才列候選，草稿／媒體／未知／failed36與53保留。legal4/private/FreeTWAI not_submitted保持。GitHub發佈、真實下載保存、完整視覺／screen reader／實聽／權利及平台接受必須各以實際證據判定。
