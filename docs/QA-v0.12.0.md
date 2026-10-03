# v0.12.0 QA — 音檔來源一致性與目前選擇

2026-10-03，Windows／Python 標準函式庫／Node 原生測試；IAB，本機 127.0.0.1:8875，1280×720／390×844。Browser plugin not available；沒有既有 Playwright workflow，且不可新增依賴，採可用 CUA IAB DOM／locator／file chooser／download。依 frontend-testing-debugging 通用指引列出檢查；遵守使用者媒體邊界，沒有擷取或嵌入截圖，不宣稱完整視覺驗收。

目標：交付檢查 → 選合成 WAV → 分析／來源／接受條件 → 換檔／條件 → 舊報告標示 → 晚回應／錯誤保留 → 重分析 → JSON／Markdown 實檔下載。

## Findings 與修正

1. 真正舊 run／音訊事件 adapter 的 VM 基線證明：請求中換檔後仍 setFiles 一次。純 inspect 現在核對編修版本、File 物件身份及條件，過期成功／錯誤不寫結果；實際 IAB 兩秒延遲再次驗證。
2. 受控測試在 hash 後、wave.open 前把同一路徑改為另一份 WAV，舊報告雜湊為 stereo 48 kHz，量測卻 mono 44.1 kHz。現在開一次來源、建立自有副本，hash／量測相同 bytes；測試外部替換保留為測試證據，不是工具改寫來源。沒有宣稱複製中的原子快照。
3. 15 bit／錯 block align／錯 byte rate 先前被當成有效 16-bit 報告。新增 tag／width／channel／rate／block align／byte rate 與 RIFF／fmt 長度預檢，格式錯誤明確拒絕；odd padded metadata 可讀。多聲道樣本量測仍保留，但不解讀角色，另列提醒。
4. 摘要漏尾部安靜段／DC／接受條件，修改後舊摘要看起來仍有效。新模型／DOM 補齊欄位及來源、符合／不符、上一份狀態，數位靜音 −∞／相關性不可測不變成數字零；Markdown 補接受值及來源副本範圍。

PCM 欄位公式參考 Microsoft [WAVEFORMATEX](https://learn.microsoft.com/en-us/windows/win32/api/mmreg/ns-mmreg-waveformatex)，RIFF 長度／chunk padding 參考 [RIFF](https://learn.microsoft.com/en-us/windows/win32/xaudio2/resource-interchange-file-format--riff-)。自行實作 fmt 預檢及既有 wave 的資料檢查；未搬入第三方程式碼，不代表完整 RIFF／speaker mapping conformance。

## 檢查表

| 檢查 | 結果與證據 |
| --- | --- |
| Page identity | 通過；ZOE 工作台、本機 URL、v0.12 |
| Blank-page | 通過；交付表單、檢查摘要與成果存在 |
| Framework overlay | 通過；DOM 沒有錯誤覆蓋 |
| Console health | 最後頁面 error／warn logs 為空；受控 HTTP 拒絕／500 是所測情境 |
| Screenshot evidence | 未執行；使用者媒體邊界，不宣稱完整視覺驗收 |
| Interaction proof | 正常／靜音／條件失敗、來源、上一份、晚回應及實檔下載通過 |
| Responsive／keyboard | desktop client／scroll 1265／1265、mobile 375／375；343px 區域內表格 scroll 352，局部可捲；Tab 到表格再到來源 summary，Enter 展開 |

## 真正瀏覽器與下載

- 合成 stereo：48044 bytes、48 kHz／16 bit／兩聲道、0.25 秒，頭 0.05／尾 0.1 秒，correlation -1、peak -24.288／RMS -28.268／DC 0／滿刻度 0；技術提醒及 SHA 與量測一致。
- 選錯 block align：立即上一份報告、停用下載；分析 400 顯示清楚錯誤，既有摘要保留。有效 mono 重分析後狀態通過、來源替換、恢復下載；改 profile 再度標舊。
- 自有 helper 兩秒延遲成功及錯誤（controlled old failure）；請求中換檔或 profile，既有摘要保留，過期結果不寫、過期錯誤不顯示，按鈕恢復。
- 合成數位靜音：peak／RMS −∞、頭尾 0.1、相關性不可測、warning 明確。8 kHz 檔與接受 44.1／48 kHz 並排「不符」，位元／聲道符合，不標為通過。
- 真正原生 HTTP 下載：stereo JSON 1610 bytes、SHA 928fd1e647f1c5e3b83ae00cf21f7fb3031ff2a3a38b389263ee316effa1836f；rate JSON 1422 bytes、SHA db70bad4cad7130cc8d6ca8e85feb9259db25491f078db4d965d5f8da55e3372；rate Markdown 1193 bytes、SHA 30a20086ae5f0337a2e2053d0801f1bef557e4d062c131eb20c58041af3b7ecd。JSON 的來源 SHA 與保留的合成 WAV 相符，Markdown 的接受條件／來源相符。
- 最初一次 download event 逾時導致 CUA runtime 重設；未以逾時推定下載成敗。重新取得同一分頁／DOM，以 role 取代未匹配的 label 後，後續 download.path 與內容核對成功。只讀事件回傳的本次檔案，沒有掃描其他下載。

## 自動驗證與證據

124 Python／80 JavaScript／四 Skill／九 JS syntax／git diff --check 通過。本輪新增 12 Python／11 JavaScript；實際 CLI 從不同 cwd 產生兩檔與 application 一致（分析完成有提醒，退出 2 是預期）、JSON-lines 壞後好、MCP initialize／壞後好、HTTP 格式錯誤後好及 static asset；來源 bytes 保留、受控替換仍同份 hash／measure、暫存三種出口關閉、1 MiB 以上、四 width／六 fmt 及畸形拒絕、多聲道提醒。JS 測模型／狀態矛盾／非有限／未知大小、File 同名替換、條件／revision、晚成功／錯誤及真正 run adapter。

關鍵命令：python -m unittest discover -s tests；node --test 明確展開 tests/test_*.js；九個 JS 的 node --check；四 Skill quick_validate；git diff --check。前版 v0.11 ZIP 271217 bytes、SHA 876d241317bdf1ee4b06760fefe34828546052ec51a7248d1e8bfceb0ad9762e；受控暫存解壓原版 112 Python／69 JavaScript 通過。

忽略的 outputs/v12-qa 保存 baseline-header-bugs／baseline-source-race／baseline-browser-race、合成 WAV、browser-evidence／實際報告、checks／previous-restore-evidence／server-stopped／remote evidence；不進 Git／原始碼 ZIP。指定提交解壓再驗全套及 Agent metadata／MCP 握手；private PR／Release／遠端 bytes 以 manifest 與實際收據為準。

自有 server PID 282508／exec 76918 經 QA stop 正常停止 exit 0／server_closed，8875 監聽 0、tab 14 關閉、viewport reset；沒有持久監控、沒有停止其他未確認程序。盤點僅本工作區，新版三個封裝保留，其餘未滿七天保留，使用者草稿／備份／素材不清除。

## 未驗證

完整視覺／其他瀏覽器、正式歌曲實聽、ASR／LUFS／true peak／媒體生成、speaker mapping／完整 RIFF conformance、其他 OS、特定 Agent host。分析內部一致不保證外部同時改檔的原子快照；數值／雜湊不是聽感或版權判決。Repo private；FreeTWAI 未公開投稿或取得平台創始人核實。
