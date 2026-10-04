# v0.43.0 交接與可逆

ZIP 原文可按檔名選取：完整核對後，Agent／MCP 只回指定小檔，CLI 明確輸出指定全文，Browser 在載入前唯讀下載原文。見[使用與分層](DELIVERY-SELECTION.md)、[QA](QA-v0.43.0.md)。377 Python／572 JS／46 syntax／4 Skill；13份實際原文下載逐 bytes 同 ZIP，原 WAV 保持；前版 v42 ZIP365／565還原通過。

## 還原與發布

branch `codex/iteration-v0.43.0`；restore `restore-v0.42.0-before-v0.43.0` 指向 main 起點 `bd6bc61a535fd11d7873a9afea1fbcbcea1dd695`。需要還原時從 restore tag 另建分支，保留未提交創作。`v0.43.0` tag 和 `outputs/releases/v0.43.0-提交前12碼/manifest.json` 指定 exact source；main merge commit／PR／Release／實際遠端 hashes 依本輪收據。

## 分層契約與維護

pure portable name／selection1 → application 全份來源核對與比較 → CLI／Agent／MCP adapter；Browser pending current source controller → DOM選取與既有 native bytes adapter。保留完整 ZIP、目前成果、表單與媒體，沒有隱式部分信任、截斷、替換或寫檔。Agent512 KiB 是選定 files JSON 上限，CLI 明確全文輸出沿8 MiB來源。未知及缺檔整次拒絕。

12／17工具、Agent1／draft3／交付各schema保持，selection1獨立；明確來源38–43，未知拒絕。操作 I/O 提示共用且不漏路徑。正式媒體、實聽、完整視覺、特定 Host 與 FreeTWAI `not_submitted` 仍待。

只盤點本工作區 outputs／direct release pairs／typed runs；latest3保護。超過七天且 exact Git/tag／archive hash 可重建才可清除；無候選不刪。FAILED／素材／草稿／備份／未知項目與其他程序保持。原 QA server 正常退出、自有 tab74關閉、viewport reset、staging0；最後 inventory 返回後再做 final audit。

四份法律及創辦紀錄保持。ZOE. G／djguan-jpg，private Repo，PolyForm Noncommercial 1.0.0；不授 AGPL／商用許可，不宣稱平台已認定創始人。
