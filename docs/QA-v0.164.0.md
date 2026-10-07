# v0.164.0 驗證紀錄：審閱中

## v0.164.0 指定程序盤點與摘要載入分層（審閱中）

新增明確 --runs-only，只查1–32份指定run1，避免每批重新核對全部歷史封裝。純maintenance_runs／同份有界原JSON與SHA／原native-CIM adapter／CLI分層；全部來源先驗證才查PID，順序與摘要一一對應。原一般audit／prune／restore、最新三封裝／嚴格超七天及128份恢復上限保持。新run-audit1沒有清除token或Agent／HTTP維護權限。合成37筆由兩次完整catalog改為一次，兩entry讀取由四次減為兩次；39份前輪原紀錄的真實唯讀補查全部terminal，兩批3.047秒，原bytes保持。這是本次讀取與觀察證據，不保證全機速度或RAM。

新增共用digests延後載入入口，十八個應用module只更換import；實際SHA-256／Git SHA-1仍回傳原hashlib物件，參數、provider拒絕、update／copy與大型音檔串流保持。全新程序明確阻止hashlib／_hashlib匯入仍可取得22 operation／protocol1；能力清單原bytes相同，本次正常查詢0.25秒，沒有未來延遲保證。沒有替代provider、私有擴充、全域patch、依賴或新operation。

新增16Python測試；最終集中32Python／6版本契約JS及25份本輪Python語法通過。29組operation schemas與整份／原列comparison artifacts保持，504四scope歷史ZIP／manifest bytes及原v163的1036 raw blobs保持。產品164／唯一policy38–164共127、unknown165拒絕；22基本／29明確啟庫、Agent1／draft3／template1保持。六法律／發起／平台紀錄、七history與四Skills保留，PolyForm禁止商用、ZOE. G／djguan-jpg與已授權public不變，四既有投稿仍submitted_unverified。

完整Python測試三次達原兩worker／120秒期限（最初兩次812、摘要分層後817）；兩份180秒診斷與一份120秒逐项trace均不作正式接受。最新trace完成98／77方法，耗時集中既有CLI／瀏覽器整合，沒有證明故障原因。原v163 ZIP完整CRC／ledger／1036 bytes核對及一次性快取準備後，也達原120秒；暫存已移除。JavaScript原全套達60秒期限。這些結果不能區分環境負載與產品回歸；未放寬期限、worker或覆蓋要求，未合併／發佈v164。

restore-v0.163.0-before-v0.164.0指向7222fd47ebd0faf7d6891fec8da1d3e4ac1b3910；codex/iteration-v0.164.0保存審閱差異。只有原始碼checkpoint可供審閱；它不是已通過正式封裝的Release，不發成功release manifest或v164 tag。正式版仍v163。完整驗收及正式封裝為待辦，rolling goal維持active。沒有本輪產品UI、下載保存、實聽、Host或平台創始接受驗證。

契約見[指定程序盤點](RUN-AUDIT.md)、[摘要載入](DIGEST-LOADING.md)；實際證據及接續見[QA](QA-v0.164.0.md)／[交接](HANDOFF-v0.164.0.md)。

## 收據與限制

本機收據保留於忽略的 outputs/v164-qa：before-reproduction.json、native-runs-evidence.json、checkpoint-retry-evidence.json、startup-after-evidence.json、boundary-digests-evidence.json、compatibility-digests-evidence.json。最後一份集中測試是在十八個module延後載入及CLI錯誤文字整理後重驗；最初QA工作目錄造成三份test import錯誤，記錄在checkpoint-checks-first-failure.json，未冒充產品測試失敗或成功。

checks-release-final-failed.json、checks-warm-final-failed.json、digest-full-failure-evidence.json、diagnostic-timeout-evidence.json、diagnostic-trace-timeout-evidence.json、diagnostic-current-trace-timeout-evidence.json、restore-163-warm-evidence.json與nonpython-first-failure.json保留原期限失敗。trace只保存已完成方法的計時，不是完整測試coverage；未印出的worker或native child身份不回填。原helper handles均按實際EOF记录，再沿明確typed run核對；不能宣稱全機沒有程序或未知descendant已停止。

初始QA錯收據key在Git變更前拒絕，合成fixture最初把兩entry誤期待一entry，既有Windows junction一次達原10秒後在原條件17項通過；原失敗證據保持。來源、測試排程、獨立discovery、兩worker／120秒與正式packager保持。

沒有v164正式封裝或遠端Release接受。原始碼checkpoint只證明指定Git提交、ZIP原bytes／SHA與完整raw blob核對，不證明完整功能或正式測試通過。未做browser產品UI、實際下載保存、實聽或Host驗證，本輪沒有平台寫入。最後outputs／程序唯讀盤點以同目錄final收據為準，不因過往紀錄推定當前清除資格。
