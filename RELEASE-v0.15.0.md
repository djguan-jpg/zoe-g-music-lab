# v0.15.0：接續 Agent／CLI 分鏡起稿

ZOE. G 發起 · PolyForm Noncommercial 1.0.0 · private 測試版。

Agent或CLI產生的storyboard-seed.json可在歌曲工作台選檔、檢查並預覽，再明確套用至分鏡或取消。保留目前歌曲、校時草稿與音檔；只替換分鏡片名、時長、FPS及鏡頭，創作欄位留白，仍需人工編写。源檔、未知欄位及不一致時間不會靜默改寫或丟棄。

同一Python檢查入口供CLI／HTTP／JSON-lines／MCP使用；生成與檢查共用小節計算及輸出。CLI新增互斥的--seed，工具schema明示來源。檔案預覽只核對目標分鏡，其他工作台編修不會讓外部起稿失效；後續分鏡編修仍阻止覆蓋，局部撤回核對保留。

146 Python／121 JavaScript、四Skill／十二JS語法通過，實際MCP→CLI→瀏覽器預覽、JSON下載、draft3下載與讀回、延遲／錯誤／毀損／舊版起稿、局部音檔保留、390px DOM及Enter套用見docs/QA-v0.15.0.md。前版ZIP解壓136／109通過；本版精確commit／封裝SHA與遠端下載以manifest及本輪收據為準。

四個原創專案、非商用授權、創辦署名及private保持；沒有模型呼叫／依賴／全域host設定。固定速度仍需實際音檔校準，起稿不是完整MV。完整視覺、正式作品、其他OS／瀏覽器與特定Agent host未驗證；FreeTWAI未投稿／未核實創始人。還原方式見HANDOFF.md。
