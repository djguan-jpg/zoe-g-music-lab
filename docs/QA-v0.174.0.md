# v0.174.0 剪輯交接候選 QA

基線為已公開的 v0.173.0 預覽版，修改範圍為標準剪輯 ZIP、重新載入空白作品時長的保留與必要操作文件。正式發布需指定 source commit 的完整封裝接受、修改後 AI Security Scanner 人工啟動與逐筆覆核、遠端 asset bytes 接受；本紀錄的集中與 GUI 證據不能代替這些門檻。

## 已完成的來源與操作核對

57 項集中 JS（含純交接、原生 DOM、專案、版本與音檔時長）、4 項新增 Python、164 個 JS 語法與四個既有 Skills 通過。新測試涵蓋標準 ZIP CRC／SHA／原始素材、JS／Python 全 ZIP bytes 一致、非同步輸入 mutation 隔離、拒絕不假成功、來源 SHA、排他輸出與來源碰撞。原載入整份回讀不放寬。

本輪合成四秒 PCM 與一張有效 PNG 的專案，原作品時長空白，舊操作在 metadata 後變成 4.000，原生載入回讀拒絕。修正後同份專案載入與下載成功，空白時長、原音檔、圖片 bytes、鏡頭 ID 與全部原欄位保持；ZIP 六 entries 完整 CRC／SHA，標準 Python writer 逐 bytes 一致。

一件使用者授權的真實作品：原生 Chrome 載入、確認原生解碼、下載實際保存 39,749,792 bytes ZIP；44 句 SRT 的 FFprobe 全部開始／時長及 FFmpeg 重編碼後全部原文逐項一致。原 WAV 為 48 kHz、雙聲道、16-bit PCM，206.88 秒；解出的 bytes／SHA 與原素材保持。原音檔 File 身份、URL、全部原控制值與播放狀態保持。Agent 修改企劃標題後另存專案與新交接 ZIP，原音檔及字幕保持。

桌面與 390×844 佈局核對，新按鈕在可見範圍，client／scroll width 皆 390，舊編輯器隱藏；最終樣本 console／page errors 0。截圖只保存到忽略 QA，未作完整視覺檢查。沒有實聽、CapCut／Kdenlive GUI 接受或創作者省時證據。單次匯出時間只作測試觀察，不推定速度保證。

原三份授權素材的 SHA、大小與 mtime 保持。實際歌名、歌詞、來源路徑、音檔與所有私密測試資料不進 Git、公開文件或 release。

## 失敗保留與程序

先前集中 fixture 的版本欄位／預期句首不符只修正 QA，沒有放寬斷言。合成載入的空白時長問題保留原生原值差異後才修改產品。一次重新命名 QA 不完整造成排他輸出拒絕，修正唯一名稱後保留原失敗；一次真實樣本出現三個 connection-refused console 訊息，後續帶 request-failure 記錄的完整原操作通過，沒有忽略錯誤或宣稱根因已查明。早期獨立測試 server 已結束，後續使用測試生命週期內的原 WorkbenchHandler，原 EOF／server 關閉／thread joined 分層保留。

完整 source ZIP、raw Git blobs／ledger、Python 兩 worker／600 秒、Node 兩 file workers／180 秒、restore 與指定程序 audit 依忽略區成功 manifest 及原生收據判定。沒有成功 manifest 不當作完整接受或正式發布；FAILED／未知／partial 保留，最新三個已發布版與嚴格超七天清理門檻保持。

## 保持的邊界

Agent1、draft3、template1、原 29 組 input/output schemas、22 基本／明確啟庫 29 操作與原 POST routes 保持；只新增一個固定 GET 模組及本機明確 handoff 命令。明確版本 38–174 共 137，全部舊版、256 清單上限與固定 8192 bytes 契約保持，未知 175 拒絕。

PolyForm Noncommercial 1.0.0 禁止商用、ZOE. G／djguan-jpg、已授權公開 Repo、六法律／平台檔、七歷史 snapshot 與四 Skills 原 bytes 保持。四投稿仍 submitted_unverified，不重送或冒稱其他原作的作者。修改後來源須另建 Scanner case，不能以 v173 八引擎結果代替。
