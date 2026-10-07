# v0.170.0 完整接受接續診斷 1

v170 仍是選句試聽候選版；正式版仍 v169。接續同一 `codex/iteration-v0.170.0`，沒有建立 v170 成功 release manifest／release tag，也沒有合併 main。原候選 source `27e2a4fd5da058fbab349a40e4a33b5bd563398e` 的 1072 份來源在所有診斷前後 SHA 相同。

## 原完整流程

已核對的一次性來源副本只準備標準 Python 位元碼快取，再執行原 launcher。Python 3.10 的兩 worker／120 秒流程失敗，parent wall 121.797 秒、原 EOF1；JavaScript 的 151 檔、兩 file workers／60 秒流程也失敗，外層 wall 61.109 秒、原 EOF1。Python 沒有完整 summary；Node 只印出 499 項通過，沒有完整 count／成功 summary。這些前段結果不能代替 823 Python／2013 JavaScript 的全套接受。

`TemporaryDirectory` 清理遇到 WinError32，接續錯誤處理產生遞迴診斷；失敗保留。後續核對原精確目錄屬這次自有、無 reparse 且已空，只 rmdir 該目錄成功；沒有列舉 holder 或 signal 其他程序。新診斷只做一次有界清理，失敗即保存狀態。

## 逐項計時與啟動樣本

只在另一份原來源副本的 `scripts/check_python_tests.py` 注入逐項 start／stop JSONL；其他 1071 份來源 SHA 保持。原 discovery、完整唯一 ID partition、兩 worker 與 120 秒期限保持。這份副本是診斷，不能當正式接受。

兩 worker 各 discovery 約 0.234 秒，分配 408／415 項；在原期限前只完成 40／57 項，已完成案例累計耗時 117.797／116.906 秒。完成案例沒有斷言失敗，兩份正在執行的案例則未完成，不推定其結果。最慢已完成項是包含原 HTTP／Agent／MCP／CLI 音檔統計的 21.422 秒；另有原 CLI 交接 16.047 秒。原 parent EOF1、兩份实际 start 與原 EOF 保留，診斷副本已移除。

兩次空啟動樣本明顯變動：Python 0.531–0.640 秒、Node 0.063–1.422 秒、PowerShell 3.422–4.125 秒；`-S` 僅屬診斷比較，沒有用於正式測試。CLI `--help` 的兩份 cProfile 中，應用程式 `<module>` cumulative 約 0.092–0.093 秒，而各自整個 helper wall 約 1.4 秒；profile 開始以前的時間没有被 cProfile 歸因，不能視為 application 自身耗時。

另兩份自有合成 PCM 的原 audio CLI profile 中，應用程式 `<module>` cumulative 約 0.785／0.155 秒，前份原生 module 建立 cumulative 約 0.639 秒。兩份 report.json／report.md 的完整 UTF-8 bytes 與 application 相同。首個診斷 helper 錯把 bytes 與 text 比較而失敗；只修正結果核對，沒有重跑／替換原 profile 或成果。該 helper 未落檔的 child wall／exit code 不補造，獨立原登記的 terminal 另有核對。這些樣本不證明整套逾時根因、未來速度或全機負載。

Node 前段 499 份 duration 累計約 12.427 秒，整個有界 run 約 61.109 秒；部分 duration 的總和不是完整 wall 或整套結果，不能據此直接指定全部差額的原因。接續應定位真實 child 啟動／等待與案例內成本；不能靠盲目重跑、增加期限、改標準 provider、共用程序取代獨立 CLI、跳過案例或改完整接受契約取得綠燈。

## 程序、還原與能力邊界

一筆舊原登記的 native identity 無法取得，原 5 秒 CIM provider 仍逾時；同一既有 exact-PID CIM command 的另一份有界診斷回覆 absent，但不能把它冒充原 standard audit 成功。兩層證據分開保留；標準收束仍需另核對，不做全域 PID signal，也不宣稱未知後代已驗證。

接續前還原 `restore-v0.170.0-review-before-acceptance-1` 指向上述原候選，原 `restore-v0.169.0-before-v0.170.0` 保持。逐輪受控來源 checkpoint 與 Draft PR #169 保存診斷與交接；來源 checkpoint 有 CRC／raw Git blob 核對，但沒有完整測試接受。

本次沒有產品、Agent、draft、operation、asset、依賴、auth、session、模型、網路或 media 行為變更；只有接受紀錄與交接文件。候選明確 38–170 共 133 版，全部舊版、清單上限 256 與契約最多 8192 bytes 保持；unknown171 拒絕。六法律／平台紀錄、七份 history、四 Skills 原 bytes、PolyForm Noncommercial 1.0.0 禁止商用、ZOE. G／djguan-jpg 及既有 public 授權保持。四投稿仍 submitted_unverified；没有平台讀寫或重送。

最新三已發布版 v169／v168／v167 保護與嚴格超七天必要門檻保持；不以空目錄移除冒充成果 prune，不刪 partial／FAILED。沒有本次瀏覽器／實聽／保存下載／full visual／screen reader／Host 接受。rolling goal active。原結果在忽略的 `outputs/v170-qa/acceptance-1`，逐份排他收據保留。
