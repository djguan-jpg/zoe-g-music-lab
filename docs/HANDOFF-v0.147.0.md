# v0.147.0 交接

## v0.147.0 歌曲交付表格原文顯示

修正歌曲設計包的段落名稱、敘事任務與聲音配置含換行或管線符號時，Markdown 表格拆列／錯欄的可重現問題。純 markdown_table.cell → design 的三個文字欄 → 既有 application／CLI／Agent／MCP／HTTP 分層。ASCII 標點使用 numeric character references 保持字面，不形成 Markdown／HTML 欄位語法；CRLF／CR／LF 只在顯示表格轉為固定 br。原 JSON 文字、順序、時間與創作內容不變；不把顯示檔當作原文 bytes 保存。其他 Markdown 段落不在本次格式保護範圍。

745 Python（新增9、1既有Windows symlink權限skip、0expected failures）、1811 JS、150 syntax／四Skills通過；Agent／MCP／HTTP與CLI完整四檔一致，CLI仍預設拒覆寫。GitHub官方GFM實際轉譯同一合成來源，修正前七列錯位、修正後六列各六欄，三個文字欄逐列字面核對。此遠端轉譯只在忽略QA，產品與正常測試不新增網路或依賴。原生工作台完整四檔核對及49controls保持，後續歌名編修保留／旧下載停用，console0。沒有本輪瀏覽器下載或完整視覺接受驗證。

436 歷史producer ZIP／manifest逐bytes保持，29組input/output schemas與原整份／原列比較檔保持；原v146精確ZIP2829240bytes、SHA763310a94131f711b0a554b9421db4428bcb283f2c809c3d7ff9acda7492ebcc還原736 Python／1811 JS通過。22基本／29啟庫、Agent1／draft3與其他schemas保持，產品147／唯一policy38–147共110，未知148拒絕。沒有新operation／GET／POST／auth／path／外網產品權限。

PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。唯讀確認使用者Chrome Zoe已登入、GitHub連結與四社群技能存在，仍原作者自行聲明／創始未核實，無重送或平台mutation；原頁返回guilds。自有單QA server以原handle正常EOF0、自建一頁關閉、未設viewport。還原tag／codex分支與exact-source封裝保持；rolling goal active，後續依真使用流程繼續改善。

## 還原與接續

codex/iteration-v0.147.0；restore-v0.146.0-before-v0.147.0指向312306f38468884d102e8cd628199e2776a9e1f4。保留branch/tag、CHANGELOG與exact-source ZIP/manifest/SHA；PR與remote main同tree後才release。Git還原不會撤销外部投稿；四FreeTWAI頁不重送，平台核實需實際結果。

本輪只修正歌曲表格三欄的Markdown顯示。可再依真交付流程檢查其他Markdown段落或文字下載/保存實際接受，需先重現再分層修改。最新三個版本保護；只有strict超七天且現場exact Git/tag/archive可重建資料才可清除，partial36/53/141、未核實v77、草稿、媒體及未知程序保留。任務仍active。
