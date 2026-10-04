# v0.42.0 交接與可逆

一般原文下載改為共用 native UTF-8 bytes，修正 form 換行改寫與 2 MiB body 阻止完整成果。五種文字入口不再從 hidden fields／textarea 取原文；成果預覽有界，8 MiB 全文保留。見 [使用與分層](TEXT-DOWNLOAD.md)、[QA](QA-v0.42.0.md)。365 Python／565 JS／46 syntax／4 Skill；前版 v41 ZIP365／554還原通過。

## 還原與發布

branch `codex/iteration-v0.42.0`；restore `restore-v0.41.0-before-v0.42.0` 指向 main 起點 `f3a6b30ad917837bcad582127517641a6430bf1b`。需要還原時從 restore tag 另建分支，保留尚未提交創作。v0.42.0 tag 與 `outputs/releases/v0.42.0-提交前12碼/manifest.json` 指定 exact source；main merge commit／PR／Release／remote hashes 由私有發布收據核實。

## 分層契約與維護

保留 pure model／注入 controller／DOM／app current source 分層；object URL 最多兩個，一秒釋放，失敗／pagehide／dispose清理自有 timer與URL。下載只代表 sent，明確核對保存檔後確認；失敗不新增 pending，確認舊檔不把後續編修當已保存。preview32768 units不拆 surrogate，來源／下載／ZIP仍全文。v41 json-string HTTP相容與2MiB cap保持；ZIP／備份沿既有有界 staging。

12／17 tools 與 Agent1／draft3／其他schema獨立保持，明確來源版本38–42，未知拒絕。沒有新增 Agent 路徑／自動寫檔／網路／模型權限。正式媒體、實聽、完整視覺、特定 Host 及 FreeTWAI `not_submitted` 仍待驗證。

每輪限定outputs／direct release pairs／typed records盤點；latest3受保護。只清除七天以上且 exact Git/tag／現場 archive hash可重建的本專案產物；無候選不刪，保留 FAILED／媒體／使用者草稿／備份／未知項目。不掃描或停止其他程序。本輪 server正常退出、自有分頁關閉、staging0；final audit在最後inventory程序返回後執行。

四份法律及創辦紀錄保持。ZOE. G／djguan-jpg，private Repo，PolyForm Noncommercial 1.0.0；無 AGPL／商用許可／平台創始身分宣稱。
