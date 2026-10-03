# v0.14.0：歌曲小節接續分鏡

ZOE. G 發起 · PolyForm Noncommercial 1.0.0 · private 測試版。

歌曲設計可先預覽整小節時間起稿，確認後套用至分鏡。保留既有設定、其他工作台與音檔，畫面／運鏡／轉場／母題及人物狀態留空；需按實際歌曲校準並人工編寫。合成範例 68 小節、136 秒可起 17 鏡，不代表已完成 MV。

修正需求／草稿／保存版本撤回載入會覆蓋後續編修：核對套用後的目標，已有編修則保留內容並拒絕整份撤回。限定載入只核對該工作台，完整草稿核對全部工作台。

分層：Python storyboard_seed 重用歌曲驗證；application 與 CLI／HTTP／JSON-lines／MCP 共用。瀏覽器純模型處理回應契約／來源快照／DTO，draft-undo處理快照核對；DOM 層明確預覽／套用。新 seed schema1 與產品0.14.0分開，Agent1／MCP2025-11-25／draft3／library1／backup1保留，預設五工具／啟庫十工具。原四專案與署名／非商用授權保持。

136 Python／109 JavaScript、四Skill與十二JS語法檢查通過；CLI／HTTP／真正Agent stdio、瀏覽器下載／草稿往返／晚回應／後續編修／音檔保留／390px DOM與鍵盤驗證見docs/QA-v0.14.0.md。前版ZIP解壓124／93通過。精確提交、封裝SHA-256與GitHub私有Release結果見manifest與本輪遠端收據。

固定BPM無弱起／自由速度；起稿不是自動剪接、媒體生成或實際音畫驗證。未完成完整視覺、其他OS／瀏覽器、正式作品、特定Agent host與FreeTWAI投稿／創始人核實。沒有新依賴、模型金鑰、外部網路模型呼叫或其他使用者作品參考。可逆方式見HANDOFF.md。
