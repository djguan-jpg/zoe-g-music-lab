# v0.173.0 交接

從已發布 v172 接續，restore-v0.172.0-before-v0.173.0 → 58a6e8eed4c03a03ff05d8630369eac4261b2963，候選 codex/iteration-v0.173.0。只補真實作品卡住的必要設定，編輯器保持隱藏。

字幕交付可先填已知總長，再匯入及套用；改總長要重匯入，不自動改原句。素材交接可填名稱、選原音檔，把目前字幕保存成新 .zoemv.json，也能開既有素材專案。兩移出文字欄的 input 仍更新原領域與成果失效，確認／原生 File／SHA／同份回讀規則保持。

本輪實際字幕下載、整首 WAV 保存報告、包含原音檔的素材保存重開與 Agent 企劃下載可完成；三原檔 SHA／大小／mtime 保持。參見[QA](QA-v0.173.0.md)及[實用性門檻](PRODUCT-UTILITY.md)。公開記錄不帶歌名、歌詞、原路徑或含媒體的專案；私密 QA 位於本機 Temp 指定子目錄，精確路徑只列在忽略交接。

所有版本與原接口相容；256／8192、法律禁止商用、四 Skills、平台作者自行聲明保持。沒有依賴、模型、auth、權限、Agent operation 或產品網路擴張。分層提交保存 DOM／app、metadata／fixture、文件差異；完整 package 與遠端狀態以本輪成功收據為準，不能拿舊封裝或舊 scanner run 當接受。

指定 AI Security Scanner 的修改後精確 raw Git 快照與候選 package 準備完成後，由人從桌面確認範圍並 Start。官方 SKILL 限制代理不能 start；不透過 CLI plan／provider 執行、改 scanner 或動原 scan case。取得 exact terminal run、確認引擎覆盖及逐筆結果後才完成 PR／main／tag／release，所需桌面操作不代表已開始掃描。

候選未發布時，最新三正式版 v172／v171／v170 與未知／partial／FAILED 保留；嚴格超過七天、完整 CRC／Git 可重建且原標準核對通過才可清理。只查已記錄自有程序，不能以全機 PID 猜殭屍。原私人素材絕不覆寫或清理。

下一步優先完成指定資安複掃與發布核對；實用性仍需要創作者省時對照、原剪輯工具接受與實聽。完整視覺／藝術／Host／平台作者核實未完成，不能宣稱整體產品完成或市場價值。
