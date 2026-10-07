# v0.164.0 交接：原時限完整驗收通過

本輪分層包含指定run-only盤點、標準摘要延後載入、隔離測試漏帶模組修正、完整失敗程序證據與限定暫存原生junction fixture。產品操作見[開始指南](START-HERE.md)／[Agent](AGENT.md)，開發見[架構](ARCHITECTURE.md)、[指定程序](RUN-AUDIT.md)、[摘要載入](DIGEST-LOADING.md)、[失敗證據](PYTHON-TEST-FAILURE.md)及[QA](QA-v0.164.0.md)。

完整820 Python（新增19、1既有skip、0expected failures）／1947 JS、153 JS語法／四Skills與10 producer集中已通過。原Python120秒／兩worker、Node60秒／兩file workers、完整discovery／coverage與summary1保持。首次接續完整run的兩個版本fixture失敗保留，修正只更新明確38–164 oracle及unknown165。冷載入樣本恢復3ms不證明全部原逾時根因；600／180秒放寬不再是必要決策。

原v163 exact-source ZIP3143966bytes／SHA21e55a4526b07dd360e7359f63b8330be5d9ba7e12d3a99af7deac87470ccb4d，完整CRC／1036 raw blobs／ledger與原801 Python／1947 JS隔離還原通過。compileall快取只在一次性來源目錄，1036原bytes逐份保持且暫存已移除。504四scope歷史ZIP／manifest bytes相同；29 operation schemas、整份／原列comparison既有收據保留。

分支codex/iteration-v0.164.0／PR #163；正式包需由確切source commit產生成功manifest後才能合併及發佈。package-final-evidence、release-remote-evidence、final-audit及manifest分別記實際source／tree／ZIP SHA／遠端refs／兩asset逐bytes結果；沒有成功收據時不能推定發布。先前三份source checkpoint與失敗ZIP／FAILED保持，不能當正式release。

原還原點restore-v0.163.0-before-v0.164.0→7222fd47ebd0faf7d6891fec8da1d3e4ac1b3910。接續前restore-v0.164.0-review-before-acceptance-4→1a2345faa89ddf5c3465cda42ae185993ac44ee9；較早bc07／1b879兩個審閱還原點保持。需要還原時另建codex/restore-*分支與PR審閱，不對現有成果做破壞性reset；Git還原不撤銷外部公開或投稿。

六法律／平台檔、七history與四Skills原bytes保持。PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg、已授權public不變；登入後四既有公開投稿均仍自行聲明未核實／NOASSERTION，不重送或修改。平台身分尚未接受；本輪沒有產品UI、保存下載、實聽或Host驗收。

每輪outputs／已登記程序限定唯讀audit，最新三個正式版本保護、嚴格超七天與完整CRC／Git重建條件保持。接續preflight沒有超七天檔案，未知／partial／checkpoint保留，正式發布後另核對最終年齡和原job EOF。--runs-only不發prune token；不使用bare PID signal或全機清理。rolling goal保持active。
