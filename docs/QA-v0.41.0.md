# v0.41.0 驗證

本輪使用本工作區原創合成文字、PCM WAV 與 ZIP；沒有參考其他本機作品或使用者 GitHub 專案，沒有新增依賴、模型呼叫、Host 設定或網路權限。

## 功能與回歸

完整 365 Python／554 JavaScript 測試、44 JS syntax、4 個 Skill 驗證及 diff check。新增 16 Python／8 JS，涵蓋四 scope 的來源與差異摘要、unsafe label 字面化、128 列與 UTF-8 budget、未知 shape／版本／計數／SHA 拒絕、mutable fixture 隔離、report opt-in／原檔名碰撞拒絕、CLI 實際三檔／拒覆寫／明確覆寫、controller 過期來源與 DOM 下載失敗保持結果。新增 HTTP encoded export 驗證原 LF／CRLF／CR／NUL／Unicode、額外／重複欄位與非字串拒絕；legacy export 保持。

生成的 launcher JSON 使用另一 cwd，選定合成 WAV 與 ZIP，實際 MCP2025-11-25 initialize／initialized／delivery_inspect include_report／audio_report／EOF，structuredContent 與 application 同源且原檔逐 bytes 保持。不存在的選定檔案只列印絕對路徑，不建立檔案；錯誤副檔名及備份未啟庫拒絕。TOML RHS literal 一致已測；特定 Host／完整 TOML parser 接受尚未驗證。

## 原生瀏覽器

四 scope 載入工具0.40的原 ZIP，再預覽0.41新 ZIP，新增1／變更1／移除1／相同2。四台各下載 JSON／Markdown，共8份實際落地檔，均與 Python 契約逐 UTF-8 bytes 相同；ZIP SHA、source／comparison 完整相同，來源 HTML／控制字元字面化。初次真下載重現 HTML form 將 LF 轉成 CRLF，encoded transport 修正後重新下載驗證，未以正規化結果冒充原 bytes。

下載仍保留舊成果與 pending；Enter 下載／Apply／限定 Undo 保留稍後表單；表單編修後 report disabled 且 hidden fields 清空。取消4秒延遲 reply／新的選檔與分析後，舊 reply 不能重開預覽。原生選定的 WAV 在這些操作後仍產生相同 SHA `4db8ab9ef4ade05e5640e175431e58dc649bdf06ea31c8b4bf0c7238d8cc2a2b`，原檔也保持；這是來源保留證據，非音質接受。

DOM geometry：390×900 page375／scroll375，兩框各271px上下；1024×900 page1009／scroll1009，兩框各314.664px並排；1800×900 page1785／scroll1785，窄成果側欄兩框各285px上下。報告按鈕都在面板內，沒有 page 橫向溢出。這是互動／幾何驗證，完整視覺審查尚未完成。本輪 tabs69／70 已關閉，viewport override 已重設；兩個 QA server 原 handle 正常退出，自己的 staging records0／root清除。

## 可重現錯誤與還原

在 restore tag 的 v40 writer 與 v41 writer 使用同一隔離合成競態：預檢後另一 writer 建立 `report.md`。v40 會覆寫；v41 exclusive create 拒絕並保留 interloper。第二檔競態也保留另一 writer，第一個自有新檔可能存在，錯誤明示部分成果；沒有宣稱多檔原子交易或做刪除回滾。

前版指定 v40 ZIP（892950 bytes，SHA `e16026e09ec495b6cbe88e14c1e32fca0aa13957180e0c2ffb5d9161054214d7`）在限定暫存目錄解包，349 Python／546 JS 全通過，暫存已清除。當版封裝使用 exact Git source commit，在解包後再執行完整 checks／Agent／MCP；確切 source、ZIP／manifest hashes、private PR／Release、actual remote assets 及 main／tree／restore refs 由本輪 outputs 收據記錄。

只盤點此 workspace outputs 與本輪 typed run。最新41／40／39封裝受保護；七天以上且可 exact Git/tag 重建才符合清除條件，無候選即無刪除。舊 FAILED、媒體、草稿、備份、未知或其他程序保留。正式媒體／實聽、完整視覺、特定 Agent Host、FreeTWAI 平台創始人狀態仍未驗證；platform `not_submitted`。
