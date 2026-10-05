# 範例載入保護契約

歌曲及分鏡的「載入原創範例」會替換所選工作台的原內容、清除該台刪除還原紀錄。明確 idle 載入保留其他工作台、媒體與上一份成果；markDirty 沿既有規則將受影響成果標示為上一份、停用下載。載入範例不是保存、撤回或作品接受。

| 範例狀態 | 共用處理 | 兩入口 |
| --- | --- | --- |
| 尚未讀取（examples 為 null） | idle 或 busy | disabled |
| 已讀取 | busy | disabled |
| 已讀取 | idle | enabled |

固定 DOM adapter `refreshExampleControls` 只讀 busy、examples 的可用狀態，寫兩個固定按鈕 disabled；不讀取或替換表單、歷史、媒體、成果、焦點或保存紀錄。`exampleAllowed` 是 handler 入口防線，在 loadMusic/loadMv、clearDeletionHistory、markDirty 或 render 之前拒絕未就緒或 busy。即使控制狀態尚未刷新，直接 handler 仍保留原值。

初始 HTML 先 disabled，startup 首次及 finally 刷新；成功後依目前 busy 恢復，網路/HTTP/JSON 失敗且 examples 仍 null 時保持停用。現有手動 reload 可重試。共用 run 的既有 timingControls 在開始及 finally 刷新，不增加 timer 或第二套請求管理。

晚到 startup 只有 idle 且 draftRetention.atInitial 才自動套用。busy 時保存讀到的 examples，但不替換當前來源或進度；操作結束後可明確載入。載入期間的後續編修沿既有 retention 判定保留。這不是任意外部 examples schema 驗證器；固定 /api/examples、application 和 server 未改。

原欄位仍可在共用操作期間編修，原 revision/current guard 保留 later edit 與上一份成果並拒絕過期回覆。範例 controls 不改 domain、wire、Agent 或草稿 schema，也不增加路徑、寫檔、網路、登入、模型或第三方依賴。15/22 工具、Agent1/draft3 維持；product89、supported38–89共52明確版本，unknown90拒絕。

測試：test_example_availability.js 10項執行實際 app handler/run/initialize 片段，涵蓋 busy/not-ready zero mutation、idle限定替換、成功/失敗/過期 finally、延遲 startup、三種失敗與 busy late source。既有 retention 測試只隔離新 DOM availability callback，retention 真實行為不變；新測試獨立執行實際 callback。原生重現與修正證據見 QA-v0.89.0.md。
