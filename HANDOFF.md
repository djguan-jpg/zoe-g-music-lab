# 目前交接 v0.89.0

見[本輪可逆與未驗證範圍](docs/HANDOFF-v0.89.0.md)。

# v0.51.0 交接與可逆

SRT syntax／physical lyric lines 純模型 → lyrics edits／validate／package → application HTTP／CLI／Agent／MCP；原生JS SRT＋共享timed-source guard → preview／explicit Apply／scope Undo／raw-fields。尾空白與Unicode改字、direct BOM／wrong-source回應修正；真多行 / 保持、原排版原檔／空白cue JSON、HTML preview未完整語義驗證。441 Python／654 JS／54 syntax／4 Skills及原生／v50還原通過。見[契約](docs/LYRICS-SRT.md)、[QA](docs/QA-v0.51.0.md)。

branch codex/iteration-v0.51.0，restore-v0.50.0-before-v0.51.0指向起點d79b5303fd6a60e25e1f60571668031946aa8921。還原前另存未提交創作，再 git switch -c recover-v0.50 restore-v0.50.0-before-v0.51.0 開新分支；v50 ZIP428／641還原通過。指定source ZIP／SHA、private PR／Release／actual遠端及main tree依outputs/v51-qa收據。

產品51、明確來源38–51、12／17tools、Agent1／draft3及schemas保持；legal4保持ZOE. G／djguan-jpg／PolyForm Noncommercial1.0.0、private，platform not_submitted。LRC Unicode候選未重現，原LRC程式／測試無diff；額外candidate helper失敗已更正收據，未重跑同record。不新增模型／依賴／外網或寫檔權限。

tab85／86關閉、viewport reset、server原handle exit0／lazy staging未建立；本輪未再嘗試瀏覽器下載，保存仍未確認。latest51／50／49保護，只盤點本outputs與typed owned jobs，>7天且exact Git／tag可重建才清除；failed v36／unknown／media／draft／backup及其他程序保持。正式媒體／實聽／完整視覺／Host／瀏覽器保存／FreeTWAI仍待，依可重現缺口繼續rolling active。
