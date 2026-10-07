# v0.156.0 QA

## v0.156.0 指定提交的原始位元組封裝

修正同一提交因core.autocrlf不同而改變封裝內容的實際問題：v155 main的1000檔全部重現。純release_archive固定profile／嚴格Git tree與blob identity → package_release filesystem producer → maintenance manifest／source核對／重建／restore。新release manifest2明確archive_profile=git-raw-blobs-v1，固定autocrlf=false／eol=lf／停用global attributes；每檔大小、原Git blob OID、完整file set及原SHA256 ledger核對後才能交出成功manifest。repo/info attributes若仍export-subst或省略來源則拒絕，不修補原文；普通LF、原CRLF與二進位皆保留。不是跨Git／壓縮器版本的完整ZIP穩定性或作者／權利證明。

manifest1／舊封裝／journal1保持原流程，不推測或遷移profile。舊重建SHA不符保留原檔；modern清除及還原沿固定profile重建、核對完整blob並保留原manifest bytes與時間。未知schema／profile、額外欄位、symlink／submodule／不安全路徑與2000檔／2MiB tree／256MiB來源容量外拒絕。没有擴大run／audit／recovery、Agent／HTTP或JSON路徑能力，不新增依賴、模型、auth或產品外網。

集中10項實際Git測試通過，包含autocrlf／eol切換、global與repo属性、Unicode／binary、完整source拒絕、legacy保留及modern prune→restore精確回復。最初一項測試只匹配Git blob錯誤措辭，實際先由Git tree大小拒絕；措辭修正後十項通過，失敗terminal紀錄保留。現場1000檔全部Git blob核對、兩種autocrlf的整份ZIP一致。765Python（新增10、1既有Windows symlink skip、0expected failures）、1911JS、153syntax／四Skills通過；472四scope歷史producer ZIP／manifest與29組input/output schemas、整份／原列comparison bytes保持。

原v155 ZIP3033163bytes／SHA9a2145820d886cee04bcd044d917a3d9069f04643d0561df39c0576cfd64e6e8以原launcher／120秒deadline還原755Python／1911JS，CRC通過且暫存移除。產品156／唯一policy38–156共119，unknown157拒絕；22／29、Agent1／draft3與交付schemas保持。六法律／平台原bytes、PolyForm Noncommercial／public、ZOE. G／djguan-jpg保持，本輪不讀寫FreeTWAI，既有四submitted_unverified不重送。restore-v0.155.0-before-v0.156.0→34089c98264e2f5cfd7d39b186809f81a39a610d，codex/iteration-v0.156.0、逐輪封裝／PR／遠端hash及goal active保持。

見[原始碼封裝契約](RELEASE-ARCHIVE.md)。目前入口只維護workflow，七份歷史snapshot不修改。本輪無browser UI／server或Host／媒體／保存下載／full visual接受，只有來源封裝與維護驗證。

驗證結果取自outputs/v156-qa的before／focused／checks／compatibility／boundary與previous-restore receipts；manifest成功不取代實際遠端asset回讀。原始test措辭失敗保留於first-focused-attempt，未冒充首次全綠。
