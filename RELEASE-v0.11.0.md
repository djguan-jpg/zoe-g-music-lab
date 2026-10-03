# v0.11.0 — 先預覽，再整批校正歌詞時間

ZOE. G 發起，GitHub djguan-jpg；PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 保留。

「波形校時」新增整批提前／延後的預覽、明確套用及最近一次撤回。預覽檢查全部句子，列出前 20 句；套用只改時間，保留句長、文字、音檔與刪除歷史。撤回保留後來的文字；遇到其他時間改動或句子增刪則整份拒絕，避免蓋掉編修。負時間／重疊／重複／超過指定總長拒絕，不截斷；晚回應不覆蓋。

CLI --shift／--set／--text 與 HTTP／JSON-lines／MCP 共用同一應用操作；句號依原始開始排序，先 shift 再逐句編修，缺失結束最後推得。時間統一至毫秒、半毫秒往遠離零捨入，修正負的不足半毫秒被接受，以及 Python／瀏覽器半毫秒邊界不一致。獨立預覽嵌入同一 JS，編修後重算時間來源／提示，實檔匯出一致；模板符號文字保持為資料。普通驗證排序後保留正確句子 ID。

112 Python／69 JavaScript／四 Skill／八 JS 語法及 diff 檢查通過；實際 CLI／三 transport、Python／Node corpus、IAB 工作台預覽／套用／撤回／晚回應／錯誤保留、JSON／草稿下載、桌面／390px DOM 幾何與鍵盤焦點，以及獨立 JSON／LRC／SRT 真正 Blob 下載／8 秒合成音檔時長更新已驗證。v0.10 ZIP 摘要核對與原版解壓 99／55 通過；見 docs/QA-v0.11.0.md。

產品 0.11.0；Agent 1／MCP 2025-11-25／draft 3／library 1／backup 1 不變。校時控制及撤回不進草稿；重新載入逐句內容／草稿會清除。新增欄位為既有歌詞操作，不增加工具或權限。沒有新依賴／模型／host 安裝。

分支 codex/iteration-v0.11.0；還原點 restore-v0.10.0-before-v0.11.0。指定提交封裝先解壓驗收再 private PR 合併，精確 commit／SHA-256 與遠端位元組以 manifest／實際結果為準。Git 還原只備份程式，草稿與媒體另存。完整視覺、跨瀏覽器、正式歌曲實聽／媒體生成／ASR／LUFS、特定 host 及官方 conformance 未驗證。Repo private；FreeTWAI 未投稿或取得平台創始人核實。
