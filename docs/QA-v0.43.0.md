# v0.43.0 驗證

只使用本工作區的新合成文字、ZIP 與 PCM WAV。四份法律及創辦紀錄保持，沒有新增依賴、模型呼叫、Host 設定或 auth。

## 可重現缺口

v42 完整 8 MiB 來源內有 46-byte 原文，但 `include_files:true` 因全檔 JSON 超過 512 KiB 而拒絕；`file_names` 尚未接受。v43 同一來源可明確選取該原檔，選定 JSON 81 bytes，完整來源與 manifest 保持。瀏覽器從有界預覽改為可明確下載 ZIP 原文，仍需另外載入成果。

## 自動測試

377 Python／572 JavaScript／46 syntax／4 Skill 與 diff check 通過。新增12 Python／7 JS 覆蓋四工作台、8 MiB／64 檔、小檔／空檔／BOM／emoji／CRLF／LF／CR／NUL／literal HTML、排序且不修改來源；512 KiB JSON 正好邊界與加一、escape 膨脹、全部缺檔拒絕、大小寫／路徑／裝置名／重複／未知／null／boolean 選項拒絕，以及未選取檔損壞仍拒絕。

實際 Agent／MCP 從不同 cwd 啟動，讀明確選定 ZIP、回覆等於共用 application，來源 bytes 保持且不自動輸出檔。12 工具 discovery、schema 與 default wire 形狀核對；缺來源的 I/O 提示指向 `--delivery-zip`，不漏私人路徑。實際 CLI 輸出大原文與小檔逐 bytes 一致；預設拒絕覆寫、明確覆寫、metadata 大小寫碰撞及報告混用都測試。

Browser controller／DOM 測試覆蓋 preview 唯讀、empty 與 removed 區分、full 原文大於摘錄、busy／表單／成果／媒體／工作台變化、讀取／取消／套用／撤回後拒絕舊來源；下載錯誤保留預覽可重試。

## 原生瀏覽器與實際檔案

四工作台各下載 small／empty／literal HTML，共12檔，全部同各自 v42 ZIP 原始 bytes／SHA。合計正好 8 MiB 的另份 ZIP，實際全文檔 `v43-full.txt` 為 8388526 bytes，預覽32768 units，實際下載同 ZIP bytes／SHA；總共13份原文。下載後目前成果仍是先前 baseline，後續編修保持；編修停用舊下載、明確套用後停用、撤回還原 baseline、延遲四秒的核對取消後不復活。

保留選定 PCM WAV 後實際分析與下載 report，原檔和 report SHA 均為 `4db8ab9ef4ade05e5640e175431e58dc649bdf06ea31c8b4bf0c7238d8cc2a2b`，96044 bytes；report 版本0.43.0。來源 ZIP 與原 WAV 保持。此合成報告仍 needs_review，不是實聽接受。

390／1024／1800 ×900 DOM geometry 無橫向溢出，原文 button 與 note 在面板內；console error／warning0。自有 tab74 已關閉，viewport reset；原 server handle 正常退出，staging records0／root 清除。完整視覺仍未驗證，沒有嵌入媒體或截圖。

## 還原、封裝與維護

指定前版 v42 ZIP934833 bytes／SHA `9996b556910abb4d76457910f7b53149fdd4adbcb14742cb7e8f18acadd62964` 還原後365 Python／565 JS 通過，限定暫存已移除。當版 exact source ZIP 解包後完整 checks／Agent／MCP，再依本輪收據核實 private PR／Release／actual remote bytes／hash／Git refs／tree／clean main。

latest43／42／41受保護；只盤點本工作區 outputs、direct release pairs 與明確 typed runs。七天以上且 exact Git/tag 與 archive SHA 可重建才可清除；無候選即無刪除，FAILED／素材／草稿／備份／未知項目及其他程序保持。正式媒體與實聽、完整視覺、特定 Agent Host 及 FreeTWAI 平台接受仍未驗證，`not_submitted`，rolling active。
