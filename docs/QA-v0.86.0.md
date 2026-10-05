# v0.86.0 驗證

| 項目 | 實際結果 |
| --- | --- |
| 完整驗證 | 564 Python／67.640秒、1002 JS、98語法、四Skills全部通過；Python兩worker／120秒deadline |
| focused與回歸 | 2 Python／16 JS新核對；60共用run/音檔/歌詞/規劃/起稿回歸通過；empty/BOM/CRLF/NUL/emoji/Unicode normalization差異、8MiB完整尾端、metadata與late/current/retry/隔離、native File及pagehide |
| 原流程 | actual CLI／Agent／MCP相同UTF-8 files，good/bad/good與正常EOF；15基本工具／Agent1／MCP2025-11-25 |
| 歷史與還原 | 192（四scope×48版本38–85）ZIP／manifest與actual v85 producer bytes一致；v85原封裝562Python／986JS完整還原，臨時目錄已回收 |
| 原生介面 | 修正後18觀察：相同2040bytes、改名同內容、單byte與空檔差異、切檔/dirty/重建/換台清過期proof，原表單／成果／草稿提示保持、picker清空、literal DOM |
| 窄畫面 | 390px Enter開native filechooser、回選合成檔成功；documentWidth375≤viewport390；截圖留在outputs/v86-qa/narrow-verification.png |
| 下載事件 | baseline與v86各自Page.downloadWillBegin→同GUID Page.downloadProgress completed；brief.json 2040 received/total bytes，不只是UI sent |
| 程序 | baseline141與corrected142關閉、viewport reset；兩bounded server正常關閉/context closed/thread joined、無staging；console warn/error0 |

選回的 brief.json／renamed 檔由基線可見合成範例成果產生，provenance明記不是實際瀏覽器下載檔。CDP事件證明瀏覽器下載完成，但工具沒有提供保存檔路徑，沒有對那個下載檔做磁碟bytes回讀；兩項證據不可混稱。早期high-level download event timeout不是產品下載失敗。Network.disable診斷不受工具支持，已關閉相應owned tab，沒有留下觀測狀態。完整視覺、screen-reader及正式素材實聽仍未驗證。

首次全測Python通過、17 JS失敗：新增lexical textVerification讓單獨擷取共用run的分層測試缺少依賴。改用既有state.textVerification後60focused回歸與fresh完整測試通過；失敗run/log保留。新HTTP測試先錯誤期待unknown POST400，修正為既有404，沒有放寬production。native QA首次把brief檔對task成果的刻意差異混入match集合，依目前canonical檔名修正，原完整觀察保留。

還原 restore-v0.85.0-before-v0.86.0=8707f99e5cd2114a3e890e1aebc35722438d236c；本版source/tree、private PR、ZIP/manifest、actual remote download hashes/ref與本輪outputs/program audit在發布後記錄於outputs/v86-qa收據。本文不單獨證明已發佈。legal4／ZOE. G／djguan-jpg／PolyForm Noncommercial／private／FreeTWAI not_submitted保持。最新86/85/84保護；嚴格超七天、exact Git/tag可重建才可列清理，草稿／媒體／備份／failed/unknown與外部程序保持，rolling active。
