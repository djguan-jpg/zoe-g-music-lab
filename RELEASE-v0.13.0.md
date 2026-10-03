# v0.13.0 — 讓設計成果對應目前的編修

ZOE. G 發起，GitHub djguan-jpg；PolyForm Noncommercial 1.0.0，LICENSE／NOTICE 保留。

歌曲／分鏡原先在請求等待期間編修後，仍把舊需求成果放入預覽。現在由純 planning-review 驗證回應及當前編修版本，再交 DOM／成果層；共用 run 忽略過期錯誤，保持目前錯誤可修正。輸入修改時現有摘要標為上一份設計並停用下載，新建後才恢復。

歌曲摘要提供總小節／BPM／拍數／記憶點及可收合的時間、能量、敘事任務與聲音配置。分鏡摘要提供鏡數／FPS／畫幅、逐鏡母題狀態／用途／提醒及母題使用位置。狀態是設計資料已建立，沒有宣稱已生成音樂或渲染影片。自由文字保持為文字，沒有 HTML 注入。

另修正短桌面高度的固定成果面板：1280×720 原高度802、按鈕中心超出畫面；現在最大672，可局部捲到下載控制，實際滑鼠／鍵盤下載通過。390px 恢復 static、沒有整頁橫向溢出。這是 DOM／幾何驗證，不是完整視覺驗收。

124 Python／93 JavaScript／四 Skill／十 JS 語法與 diff 通過。真正 CLI 從不同 cwd 四／五檔逐 bytes 與 application 一致，HTTP／JSON-lines 壞後好／MCP 握手與呼叫同源；Node 模型亦取真正 application 結果。IAB 兩個工作台晚成功／錯誤、目前錯誤保留／修正、提醒、文字安全、JSON 實檔、鍵盤／窄螢幕通過；v0.12 ZIP 294717 bytes、SHA 3e2bf72a6282c6a8a42a1bacd03a38ef6d8f77c6ada82a72e39e480ec387ebc0，解壓124／80通過。見 docs/QA-v0.13.0.md。

產品0.13.0；Agent1／MCP2025-11-25／draft3／library1／backup1保持，領域與成果檔格式不變。沒有工具／模型／依賴／host 安裝新增。分支 codex/iteration-v0.13.0，還原點 restore-v0.12.0-before-v0.13.0；指定提交封裝解壓後 private PR 合併，精確提交／ZIP摘要／Release遠端位元組以 manifest／實際收據為準。

Git還原只保護程式，使用者草稿／備份／素材另存。完整視覺／跨瀏覽器／其他OS、正式實唱實聽／實際畫面、ASR／LUFS／true peak／媒體生成、特定Agent host未驗證。Repo private；FreeTWAI未投稿或取得平台創始人核實。
