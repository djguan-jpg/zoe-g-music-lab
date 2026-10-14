# v0.173.0 必要設定核對

公開文件、Issue、PR 與發佈說明只使用通用產品情境及本專案自有合成資料。私人測試權限不代表公開權限；不得公開個人作法、工具偏好、素材、原文、來源資訊或私人測試過程與指標。

## 發現與修改

LRC 缺少句尾，原流程留白總長時末句沿原規則加三秒估算；總長欄藏在隱藏校時區，無法提供已知秒數。素材交接的「下載素材專案」要求選音檔，但選擇欄也藏在舊 MV 編輯器，無法由目前字幕起一份新專案。

移動三個原有欄位：lyrics-duration 到字幕交付；mv-title、lyrics-audio 到素材交接。保留唯一 ID、原 type／accept／step／預設值，原讀取、保存、重開與 SHA 保護重用。LRC 提示明確說明先填總長再匯入，改總長需重匯入，並非自動校時或精確詞尾。

移出後另重現 input 不抵達舊 editor listener，修改總長仍可下載舊成果、修改名稱不更新草稿狀態。listener 改由 main 接收，只有兩個移出的文字欄明確對應原 lyrics／storyboard scope；其餘原 panel 規則與 view-control／lyrics-file 排除保持。修改總長現在使成果失效，改名稱更新其原草稿範圍。沒有編輯器重新顯示、原文自動重寫或自動保存。

沒有新 module、產品資產、依賴、模型、Agent operation、schema、POST、產品外網、auth 或權限改動。只在既有領域與 DOM adapter 上修入口。

## 公開驗證範圍

集中兩檔 33 JS 的 input handler 回歸通過。公開紀錄不包含個人測試資料、作法、作品規格或操作過程；此摘要不能代替指定 source 的完整接受。

## 指定來源接受與發布

候選明確支援 38–173 共 136 版，全部舊版、清單容量 256／契約 8192 bytes 保留，未知 174 拒絕；Agent1／draft3／template1、原 schemas 與 22 基本／29 啟庫操作保持。法律、平台、七歷史與四 Skills 的原 bytes 保持，PolyForm Noncommercial 禁止商用、ZOE. G／djguan-jpg 及原 public 授權保持。

還原點 restore-v0.172.0-before-v0.173.0 指向 58a6e8eed4c03a03ff05d8630369eac4261b2963；候選分支 codex/iteration-v0.173.0。v172 原指定來源 d0e62bf66a0d883719ba22a2cfca4230aa5c4a0d 已完成八引擎與逐筆結果審閱並發布，修改後 v173 不能沿用該 run。

完整接受必須對確切 Git commit 封裝，以成功 manifest／CRC／raw Git ledger 與原 EOF 為準；兩 Python workers／600 秒、兩 Node file workers／180 秒保持。工作來源集中通過與真實流程不能替代完整封裝測試。候選 ZIP、完整收據與標準自有程序／超七天盤點放在忽略 QA，未完成指定新來源 desktop scan 及結果審閱前維持 Draft PR，不合併 main 或建立 v173 release tag。

尚未完成創作者省時對照、第三方工具開啟、實聽、完整視覺／藝術、Host 或平台作者身分接受。四投稿仍 submitted_unverified，不重送或認領他人原作；本輪改善不能代替整個產品目標完成。
