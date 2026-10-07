# 原始碼封裝與指定來源

使用 `python -X utf8 scripts/package_release.py --ref <指定提交>` 封裝已提交的來源。現行producer產生release manifest2；此版本獨立於文字交付ZIP、Agent protocol、草稿及recovery journal。

## 分層與來源

`musiclab.release_archive` 是無I/O純層：固定profile、Git tree解碼與blob digest。`scripts/package_release.py` 讀取指定commit metadata與tree，產生ZIP、逐檔串流核對，對同一ZIP提取後执行完整測試，再產生成功manifest。`musiclab.maintenance_fs` 嚴格讀取manifest，核對實際ZIP、source、tag及age；rebuild／restore沿同profile。

manifest2必須宣告 `archive_profile: "git-raw-blobs-v1"`。固定git archive參數只在此profile使用：`-c core.autocrlf=false -c core.eol=lf -c core.attributesFile=`。JSON不能提供任意git參數或選來源／目的路徑；manifest的restore字串是說明，維護程式不執行它。

每檔核對Git tree的100644／100755普通blob、大小及Git object identity，完整name set不得缺檔；既有SHA256 ledger、整ZIP SHA與CRC保持。Git blob使用SHA1 object identity與原blob header，不是新簽章或作者／版權證明。一般LF、原CRLF、Unicode與二進位保留。global attributes停用；repository／info attributes若仍有export-subst、export-ignore或換行轉換，producer拒絕，不靜默修補，保留FAILED與ZIP供核對。

producer與maintenance共用[封裝容量檢查](RELEASE-ZIP-BUDGET.md)：先stat與有界footer／central，再ZipFile／CRC／來源／解壓與測試；成功manifest完整UTF8加LF限2MiB，排他寫入。詳細限制與拒絕證據依該契約。

producer及maintenance先以[固定Git串流](RELEASE-GIT-CAPTURE.md)讀取long／name-only tree，stdout2MiB／stderr4096bytes，超限與逾時收束原child及兩reader，不能確認cleanup就拒絕。這個gate不改原source tree／profile及完整blob核對。

## 版本與相容

manifest1不允許archive_profile，按原git archive設定核對／重建；不猜最可能設定，也不把舊manifest自動改成2。manifest2只接受以上固定profile；未知schema／profile、profile在1出現、額外欄位或矛盾source拒絕。run1／audit1／recovery1與2000檔／2MiB manifest、64MiB ZIP／256MiB expanded budget保持；新增tree輸入最多2MiB／2000檔／256MiB blobs，symlink／submodule和不安全path拒絕。

歷史ZIP與manifest保留原bytes。若舊Git設定已變或source/tag不足以重建相同ZIP，標示不可重建並保留；不能以文字看起來相同替代SHA。modern恢复先在專用暫存重建與核對全部source，再排他寫入原manifest／ZIP，保留原mtime，目的存在仍拒絕。

固定profile解決換行／global attributes導致的來源改寫；整ZIP仍依Git與其壓縮器版本，若未能重建相同ZIP一律保留，不宣稱跨版本位元組穩定或原子I/O。使用者草稿、備份、媒體和私人素材不屬於Git原始碼封裝或清除範圍。

驗證見[QA](QA-v0.158.0.md)與[交接](HANDOFF-v0.158.0.md)。
