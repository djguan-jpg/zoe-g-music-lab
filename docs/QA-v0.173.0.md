# v0.173.0 必要設定與真實作品核對

使用者授權指定資料夾的素材供這輪使用，並禁止覆寫。本輪只讀一件作品的 WAV／SRT／LRC；原檔 SHA-256、大小及修改時間前後保持。所有原音檔、歌詞、含素材的專案與私密 QA 存在 Git 外。公開記錄只列行為和數量，不包含作品名稱、原文或來源路徑。

## 發現與修改

LRC 缺少句尾，原流程留白總長時末句沿原規則加三秒估算；總長欄藏在隱藏校時區，無法提供已知秒數。素材交接的「下載素材專案」要求選音檔，但選擇欄也藏在舊 MV 編輯器，無法由目前字幕起一份新專案。

移動三個原有欄位：lyrics-duration 到字幕交付；mv-title、lyrics-audio 到素材交接。保留唯一 ID、原 type／accept／step／預設值，原讀取、保存、重開與 SHA 保護重用。LRC 提示明確說明先填總長再匯入，改總長需重匯入，並非自動校時或精確詞尾。

移出後另重現 input 不抵達舊 editor listener，修改總長仍可下載舊成果、修改名稱不更新草稿狀態。listener 改由 main 接收，只有兩個移出的文字欄明確對應原 lyrics／storyboard scope；其餘原 panel 規則與 view-control／lyrics-file 排除保持。修改總長現在使成果失效，改名稱更新其原草稿範圍。沒有編輯器重新顯示、原文自動重寫或自動保存。

沒有新 module、產品資產、依賴、模型、Agent operation、schema、POST、產品外網、auth 或權限改動。只在既有領域與 DOM adapter 上修入口。

## 本機實際流程

- Chrome 與原 WorkbenchHandler：實際 SRT／LRC 匯入、套用與原生字幕下載；已知 206.88 秒提供在 LRC 匯入前，44 句的末句結束依宣告總長建立。這是宣告推得的句尾，未實聽確認。
- 選真實 WAV，原生播放器讀回 206.88 秒；下載 52,986,164 bytes 素材專案。解碼其中音檔的 SHA 與原 39,734,812 bytes WAV 相同，重新選回保存檔、預覽及確認載入後，全部歌詞 input 原值保持；Agent 企劃實際另存。
- 同一整首 WAV 的 report.json 經原生下載保存，來源 SHA 及取樣率、位深、聲道、幀數、時長與獨立 WAV header 核對一致，technical_checks_passed、warning 0。這不是實聽或收件人的接受。
- 新增實際 input handler 回歸；集中兩檔 33 JS 通過。原生 UI 修正前下載未失效、名稱狀態未變，修正後下載停用／標註需重建、草稿差異範圍更新，console／page error 0。
- 最後修正後再完成真實 LRC → 原音檔 → 保存 → 重開 → Agent 企劃流程，console／page error 0。390×844 的 document／scroll width 都為 390，兩隱藏容器維持不可見。桌面與行動截圖只保存，未進對話或 Git，未聲明完整視覺接受。

音檔分析的首份 QA 只有 30 秒等待而逾時，沒有證明產品失敗。接續 QA 完成報告下載與來源 assert 後，因 QA 查找不存在的 audio-review selector 而 EOF 1；保留兩次失敗，另以已保存的同份報告做完整來源／header 核對，不再為此重送音檔分析。不冒稱整個音檔 QA harness 成功，也沒有調整產品分析實作或效能上限。

原管理 server 收到 STOP，原 handle EOF 0、thread joined；所有自有瀏覽器關閉。原始媒體與其他程序不動。

## 指定來源接受與發布

候選明確支援 38–173 共 136 版，全部舊版、清單容量 256／契約 8192 bytes 保留，未知 174 拒絕；Agent1／draft3／template1、原 schemas 與 22 基本／29 啟庫操作保持。法律、平台、七歷史與四 Skills 的原 bytes 保持，PolyForm Noncommercial 禁止商用、ZOE. G／djguan-jpg 及原 public 授權保持。

還原點 restore-v0.172.0-before-v0.173.0 指向 58a6e8eed4c03a03ff05d8630369eac4261b2963；候選分支 codex/iteration-v0.173.0。v172 原指定來源 d0e62bf66a0d883719ba22a2cfca4230aa5c4a0d 已完成八引擎與逐筆結果審閱並發布，修改後 v173 不能沿用該 run。

完整接受必須對確切 Git commit 封裝，以成功 manifest／CRC／raw Git ledger 與原 EOF 為準；兩 Python workers／600 秒、兩 Node file workers／180 秒保持。工作來源集中通過與真實流程不能替代完整封裝測試。候選 ZIP、完整收據與標準自有程序／超七天盤點放在忽略 QA，未完成指定新來源 desktop scan 及結果審閱前維持 Draft PR，不合併 main 或建立 v173 release tag。

尚未完成創作者省時對照、第三方工具開啟、實聽、完整視覺／藝術、Host 或平台作者身分接受。四投稿仍 submitted_unverified，不重送或認領他人原作；本輪改善不能代替整個產品目標完成。
