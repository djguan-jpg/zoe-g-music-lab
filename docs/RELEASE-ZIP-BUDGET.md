# 原始碼 ZIP 容量檢查

`python -X utf8 scripts/package_release.py --ref <指定commit>` 只對本次新提交來源產生封裝。來源ZIP與文字交付ZIP是不同契約；本規則不增加產品Agent／MCP／HTTP操作或JSON路徑能力。

## 三層責任

`musiclab.release_zip` 是無I/O純規則，先核對嚴格整數archive大小、classic footer layout、實際central header數量／變長欄位邊界，以及完整manifest UTF8 JSON+LF容量。四個上限分別是archive64MiB、central2MiB／4096項、footer65557bytes及manifest2MiB，沒有提高原維護上限。

`musiclab.release_zip_fs.inspect_archive` 先stat拒絕超過64MiB，再只讀末65557bytes與經核對最多2MiB central。這層不配置ZipInfo、不解壓、不執行子程序。producer與maintenance的既有_zip_budget wrapper共用此gate；目錄也算ZIP項目，不能只以來源檔數2000代替目錄4096項。

`scripts/package_release.py` 在Git archive完成後、ZipFile建構前使用gate。通過仍須完整raw Git tree／blob、file set、CRC、metadata及提取來源完整測試。gate不证明local header／壓縮資料完整、全部ZIP conformance、外部同時改寫的原子快照、作者／權利或跨Git／壓縮器的ZIP稳定性。錯來源、損壞、未知schema/profile依原後續契約拒絕。

## Manifest 與失敗

producer完整序列化ensure_ascii=false／indent2／有限數字JSON與單一尾LF，逐段UTF8累計最多2MiB；非法Unicode／超限在建立manifest前拒絕。`release_zip_fs.write_manifest` 僅以xb建立，既有檔案保持。多個步驟不構成交易式回滾，I/O失敗可能留下部分檔案；維護工具保留未知／partial，不冒充成功。

失敗保留已產生來源ZIP，FAILED.txt亦排他建立；未知既有診斷不覆寫。診斷寫入若失敗，原封裝錯誤仍向caller回報，不能保證每種I/O故障都有FAILED。重跑相同commit目的已存在即拒絕，需核對失敗資料或使用新的指定提交。

本版不重寫舊manifest／ZIP或推測profile，release manifest2／raw profile及legacy1／recovery journal1保持。[來源契約](RELEASE-ARCHIVE.md)仍負責完整blob及清除／重建／還原。使用者草稿與素材不屬於Git可重建封裝。

驗證見[QA](QA-v0.157.0.md)及[交接](HANDOFF-v0.157.0.md)。
