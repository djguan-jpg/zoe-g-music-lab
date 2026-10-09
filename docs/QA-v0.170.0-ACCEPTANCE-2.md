# v0.170.0 完整接受接續診斷 2

接續同一候選分支，上一輪屬實際進展：來源／診斷已保存、337 份登記程序當時均 terminal。這輪開始重新核對 remote Draft PR #169、來源與全部原收據 SHA；候選 source `d19712d4ded5f2ee2ae07889bba46e7af7dd9beb`、tree `93393ca05519e3a3d9222c838b10e4c577306724` 保持，main 仍是正式 v169。接續前另建 `restore-v0.170.0-review-before-acceptance-2`。

## 真實整合案例

只在完整核對的來源副本中，對原 `test_audio_statistics.py` 的 subprocess 呼叫加入 local diagnostic wrapper；原參數、requests、完整 bytes／domain／HTTP／Agent／MCP／CLI 與 browser 斷言保持。沒有 global patch、provider 變更或產品修改；額外登記與 cProfile 可能影響本次計時，不能當完整接受。

原最慢音檔統計整合案例這次通過；診斷 parent wall 12.047 秒，原 EOF0。四個原 child 的 wall 各為 Agent 1.609、MCP 2.907、CLI 2.125、Node 2.156 秒，全部原 handle EOF；CLI 原 exit2 對應 full-scale 待實聽提醒。原完整結果與 domain 相同，合成來源保留，原 HTTP server shutdown／thread join 的斷言通過；副本已移除。

cProfile 中該 case cumulative 9.336 秒，local run cumulative 8.794、communicate cumulative 8.765 秒，thread lock acquire cumulative 9.107 秒。這指出該樣本花在等待的時間，不能把等待的記帳位置當成 stdlib 執行緒缺陷或已證明的整套根因。

## 有界傳輸比較

Python／Node 各用三種方式執行兩次：原 pipes communicate、自有 stdout／stderr files communicate，以及先 wait 再讀 pipes。十二個 child 原 EOF0，固定 stdout／stderr 完整 bytes 保持。Python wall 0.094–1.985 秒、Node 0.141–3.406 秒；files 沒有穩定較快，先 wait 也不穩定。六次空 Thread 的 start／join 記錄均為0.0，屬本次計時解析度下的觀察，不能宣稱真實成本為零。

沒有足夠證據支持替換原測試的 capturing、全域 monkeypatch、改 provider 或以共用 process 取代獨立 CLI；本次未採用這些做法。樣本只是來源不變的診斷，不是全機 benchmark、未來速度保證或全套接受。

## 原完整流程再確認

原1073份來源的 SHA 在診斷與完整流程前後一致，只有一次性副本準備標準 compileall cache。原 Python 兩 worker／120秒 launcher 再次失敗，parent wall 122.750秒、原 EOF1，沒有完整 summary；原 Node151檔、兩 file workers／60秒也失敗，parent wall 60.657秒、原 EOF1，僅印出342項前段通過，沒有完整2013 summary。前段零 TAP fail 不代表未執行部分通過。

完整流程的副本清理先遇 WinError32，原失敗收據保留。後續只核對同一精確自有目錄，確認無 reparse 且已空後 rmdir 成功；加上先前 selected-case 副本共兩份自有暫存已移除，沒有全域 holder 列舉或 signal。未知後代仍未驗證，不以空目錄或已登記的 terminal 宣稱全機程序均已收束。

原期限阻礙已連續三個 goal turn 出現；目前沒有具證據的產品修正可解決。已向使用者提出必要決策：本版 Python 完整期限120→600秒、JavaScript60→180秒，全部案例、兩 worker、原斷言與來源核對保持；也可維持原期限待本機狀況改善。該問題送出時仍未得到答覆，本輪不推定批准，不修改任何期限。後續狀態以人類回覆與最終 goal 收據為準，不能重跑未完成 handle 或把候選當正式發布。

## 交接與不變項

本次只更新診斷與交接文件，所有產品原 Git objects、六法律／平台紀錄、七 history、四 Skills 保持。候選明確38–170共133版、全部舊版、清單256／契約8192bytes與 unknown171 拒絕保持。Agent1／draft3、22基本／明確啟庫29 operations及29 schemas不變；没有新增asset、依賴、auth、session、點數、金流、模型、路徑或產品網路能力。

PolyForm Noncommercial 1.0.0 禁止商用、ZOE. G／djguan-jpg 與既有 public 授權保持；四投稿仍 submitted_unverified，本輪不讀寫平台或重送。沒有本次產品 UI、實聽、保存下載、完整視覺／screen reader或Host接受。v170沒有成功 release manifest／release tag或main合併；正式版仍v169。來源 checkpoint只保存經CRC／raw Git blob核對的未接受來源。

最新三已發布版169／168／167與嚴格超七天必要門檻保持，不刪 partial／FAILED；實際最終 age 與 scoped typed-run 狀態以新收據為準。所有逐份排他診斷在忽略的 `outputs/v170-qa/acceptance-2`，先前 sealed 證據不覆寫。目標尚未完成；下一步需明確期限決策或本機啟動狀況改善，再接續相同候選的完整接受。
