# v0.171.0 接受紀錄

本輪從 main `db33c434fed5c20b34562db6fc58998517a9c097`、正式 v170 接續。建立並推送 `restore-v0.170.0-before-v0.171.0`，使用 `codex/iteration-v0.171.0`。舊 v170 ZIP 3257251 bytes／SHA-256 `873dd5dc4f3f50dcaefb731f696101677d4cf958b0191f9aaa766593ee047b32` 已核對 CRC、ledger 及 1075 Git raw blobs；本輪沒有重跑該舊 ZIP 的全部 runtime 測試。

## 工作來源

第一批試播／循環／選句完整接受的初次 Python 失敗來自 `projects.release_version` 仍為 v170；原失敗保留，修正為 v171 後完整 823 Python／2035 JS 通過。完整流程加入後，1085 份不可變來源副本前後 SHA 一致，完整 830 Python／2046 JS（153 檔）通過，Python 97.157 秒；1 個既有 Windows symlink skip、0 expected failures。兩 Python worker／600 秒、兩 Node file worker／180 秒保持，一次性來源與 cache 已移除。

後續將專案與 renderer 測試分層，補共享空白、匯入 ID 分配、次毫秒媒體時長三個回歸。新專案／renderer 集中 14 項通過。候選 b81aade 的封裝完整 830 Python／2049 JS、1090 raw blobs 與 CRC 通過，但後續瀏覽器重複匯出失敗，該候選未發佈。再補歸零等待及單一可重用音軌路由兩個回歸，集中 16 項通過。最終指定提交的完整 830 Python／2051 JS（154 檔）、語法、四 Skills、封裝 CRC 與 raw blobs 以該 commit 的成功 release manifest 為接受依據；工作來源結果不能代替此收據。

## 真實瀏覽器與落盤

使用正式 WorkbenchHandler、Chrome、本輪四秒 PCM 與自製 PNG，沒有使用私人作品。原第一批的原生選句 pointer／keyboard、明確套用與逐字撤回、Esc、手動 BPM、A–B、同一音檔的分鏡／歌詞 seek、1 ms cue、替代音檔與離台停止均有 DOM／adapter 證據。既有六檔歌詞包仍能建立。

完整流程實際建立均分試播草稿；兩句中文、emoji、連續空白保留。瀏覽器素材下載已落盤，89104 bytes／SHA `b8356eca085c3915493d4096ce557df1ede4b329d51e515248516588657c5f91`；音檔 64044 bytes 與 PNG 516 bytes 逐 bytes 相同，保存專案可再開啟，明確載入後回讀四個工作台、ID 與素材摘要。

Agent 使用本機 inspect／revise 實際修改歌曲核心、鏡頭用途與第二句，另存 89103 bytes／SHA `befd60a867a388aadbb2e78e47a1f7e8e75cc517fc784d9546572b8c2d64f011`，原專案與素材保持。重開後第二句為 `第二段  Agent 修訂 🎵`，可再匯出影片，後續瀏覽器保存 89103 bytes／SHA `ceb775dcb3af384d5f46e949bbb695ba7c07b2622f83352ff18230f8df086a2c`。保存時間 metadata 改變，不把它當作原專案 byte 相同。

正式下載按鈕保存的影片為 231712 bytes，ffprobe 核對 VP9 960×540 與 Opus 單聲道 48 kHz，容器時長 4.0885 秒。第一支未補 Duration 的原生 streaming 影片保留，音訊解碼 4.08 秒且非零；現行容器只補 Duration，codec payload 保持。不是精準四秒裁切或實聽接受。

最終生命週期 QA 發現原生 media-element captureStream 第二次匯出沒有有效 WebM；單純等待 seeked 或保留原 track 仍重現，失敗觀察保留。改為每個播放器一個 Web Audio source／destination，保留原揚聲器輸出，每次錄製只持有音軌副本，離頁釋放 context；歸零回讀與自然句尾接受也保留。修正後同一份專案連續兩次完成，手動 End 取消沒有成果，再啟動完成並下載 223649 bytes／SHA `bcffefd3131886bb461acac90db7a9048be2ca1dc5f5c74067db06f2db42fe9c`。VP9 960×540／Opus、解碼音訊 3.96 秒／RMS 0.021559 非零；仍為事件錄製，沒有承諾樣本精準完整音訊。18 個原歌詞／分鏡欄位前後保持；損壞 SHA 的本地提示、拒絕預覽與全部原欄保持，console 0。沒有確認所有瀏覽器 captureStream 內部根因。

主動取消匯出沒有下載成果；損壞素材 SHA 在替換前拒絕，全部歌詞／分鏡原欄位保持。手機 390×844 的 document client／scroll width 同為 375，沒有水平溢出；console error／warning 為 0。截圖與媒體只存忽略 QA 目錄，未嵌入對話。下載事件／downloadMedia 兩次回報逾時保留；改由原正式按鈕下載，核對實際落盤檔案與 UI SHA，不宣稱工具逾時為成功。

原生 File／currentTime 不由唯讀 DOM wrapper 獨立提供；媒體回讀依產品 adapter、實際保存檔、codec 及摘要交叉核對。沒有完整藝術視覺、實聽、screen reader 或 Host 接受，也沒有真實長曲／64 MiB／600 秒壓力接受。

## 邊界與外部狀態

原 22 基本／29 啟庫操作、29 input/output schemas、Agent1、draft3、template1、全部舊版與 256 清單／8192 bytes 保持。v171 明確版本 38–171 共 134，unknown172 拒絕。沒有產品依賴、模型、auth、session、權限或外網擴張；新增固定 GET 資產，local image 使用 blob CSP。

PolyForm Noncommercial 禁止商用、原法律／歷史紀錄與四 Skills 保持。原技能書只有文件，不把原作者身分認領到我們身上。四份自己的既有投稿仍需平台確認；本輪成果應更新自己的投稿，以功能與交付為內容，不重送或宣稱創始核實。平台、main、tag、遠端 asset 與清理的最終狀態另以精確收據為準。
