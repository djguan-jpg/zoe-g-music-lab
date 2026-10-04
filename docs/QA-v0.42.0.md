# v0.42.0 驗證

範圍只有本工作區的原創合成文字、ZIP、PCM WAV 與草稿。沒有新增依賴、模型呼叫、Host 設定、auth、外網操作或其他本機作品參考；四份法律與創辦紀錄保持。

## 可重現錯誤

原本一般文字下載走 HTML form：55-byte 原文包含 BOM、emoji、CRLF／LF／CR、NUL 與 literal HTML，原生下載變成 57 bytes；同一原文的 Blob 下載是原始 55 bytes。超過 2 MiB 的 form body 實際回 HTTP 413，不能完整交付既有接受上限 8 MiB。HTTP 舊契約保留，新的 browser 文字入口共用 native bytes 層。

完整 8 MiB ZIP 載入把全部文字放入 textarea，原生 click 觀察逾時但 DOM 證實已套用。修正重用純 excerpt，最多 32768 UTF-16 units；同一 ZIP 重新預覽、Enter 明確套用完成，actual textarea 32070 units，下載仍是原始 8388608 bytes。沒有縮小可接受來源，沒有以顯示摘錄冒充完整交付。

## 自動與原生驗證

365 Python／565 JavaScript／46 syntax／4 Skill 及 diff check。新增 11 JS 測試覆蓋精確 UTF-8、BOM／控制字元／empty／emoji、8 MiB ASCII／NUL／emoji 與超界、lone surrogate／路徑／裝置名拒絕；URL／append／click／timer 失敗釋放、最大兩個 URL、pagehide／dispose、actual app 原文選取與 busy／dirty／absent 拒絕、保存版本與完整來源、bounded excerpt 不拆 emoji、失敗下載不產生新的保存確認。

四工作台各三個實際下載（原文、空檔、literal HTML），加正好 8 MiB 原文，共13檔與各自原 ZIP bytes／SHA 一致。修正預覽後又下載一份 8 MiB 全文並逐 bytes 一致；兩份差異 JSON／Markdown 與 Python application 同源 bytes 完全一致。三種保存入口完成原生送出：draft3 逐 bytes 與 serialized snapshot 同源、immutable 保存版本與 stored draft bytes／SHA 一致、acceptance1 原值 bytes 一致。草稿／條件回讀均先預覽，取消保留後續欄位；確認先前下載仍提醒後續編修尚未另存。

原生 WAV 分析的 report SHA 與原檔都為 `4db8ab9ef4ade05e5640e175431e58dc649bdf06ea31c8b4bf0c7238d8cc2a2b`，技術報告仍有待確認，不是實聽或音質接受。下載以實際檔案核對；IAB Blob 事件觀察逾時不表示檔案未保存，沒有盲目重送。

390／1024／1800 ×900 DOM geometry：page／scroll 分別375／375、1009／1009、1785／1785，download button 與 preview note 都在成果面板內；沒有頁面橫向溢出。原生 Enter／click 操作及有界預覽通過，完整視覺仍未驗證。自有 tabs71／72／73 已關閉，viewport reset、console error／warning0；兩 QA server 原 handle 正常退出，自己的 staging records0／root清除。

## 還原、封裝與維護

前版指定 v41 ZIP（919948 bytes，SHA `d7f1c3707a46d189babf8e82cc4b08a8fddf7df51451d23ce85e306a4b5b266f`）在限定暫存目錄解包，365 Python／554 JS 通過，暫存已移除。當版使用 exact source Git commit 封裝，解包後完整 checks／Agent／MCP 驗證；source／tree／restore／private PR／Release／actual remote bytes 依本輪 outputs 收據。

只盤點此工作區 outputs、direct release pairs 與明確 same-host typed runs。最新42／41／40受保護，七天以上且 exact Git/tag 可重建才可清除；無候選即無刪除。既有 FAILED、素材、草稿、備份、未知及其他程序保留。正式媒體／實聽、完整視覺、特定 Agent Host、FreeTWAI 平台創始人接受仍未驗證；`not_submitted`，rolling active。
