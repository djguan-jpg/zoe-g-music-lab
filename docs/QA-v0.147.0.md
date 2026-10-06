# v0.147.0 QA

## v0.147.0 歌曲交付表格原文顯示

修正歌曲設計包的段落名稱、敘事任務與聲音配置含換行或管線符號時，Markdown 表格拆列／錯欄的可重現問題。純 markdown_table.cell → design 的三個文字欄 → 既有 application／CLI／Agent／MCP／HTTP 分層。ASCII 標點使用 numeric character references 保持字面，不形成 Markdown／HTML 欄位語法；CRLF／CR／LF 只在顯示表格轉為固定 br。原 JSON 文字、順序、時間與創作內容不變；不把顯示檔當作原文 bytes 保存。其他 Markdown 段落不在本次格式保護範圍。

745 Python（新增9、1既有Windows symlink權限skip、0expected failures）、1811 JS、150 syntax／四Skills通過；Agent／MCP／HTTP與CLI完整四檔一致，CLI仍預設拒覆寫。GitHub官方GFM實際轉譯同一合成來源，修正前七列錯位、修正後六列各六欄，三個文字欄逐列字面核對。此遠端轉譯只在忽略QA，產品與正常測試不新增網路或依賴。原生工作台完整四檔核對及49controls保持，後續歌名編修保留／旧下載停用，console0。沒有本輪瀏覽器下載或完整視覺接受驗證。

436 歷史producer ZIP／manifest逐bytes保持，29組input/output schemas與原整份／原列比較檔保持；原v146精確ZIP2829240bytes、SHA763310a94131f711b0a554b9421db4428bcb283f2c809c3d7ff9acda7492ebcc還原736 Python／1811 JS通過。22基本／29啟庫、Agent1／draft3與其他schemas保持，產品147／唯一policy38–147共110，未知148拒絕。沒有新operation／GET／POST／auth／path／外網產品權限。

PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。唯讀確認使用者Chrome Zoe已登入、GitHub連結與四社群技能存在，仍原作者自行聲明／創始未核實，無重送或平台mutation；原頁返回guilds。自有單QA server以原handle正常EOF0、自建一頁關閉、未設viewport。還原tag／codex分支與exact-source封裝保持；rolling goal active，後續依真使用流程繼續改善。

## 證據與限制

reproduction.json保存修改前實際錯位與完整回應；after-result／render-evidence核對data及其餘三檔，before／after-gfm.html保存實際官方轉譯。native-browser-evidence保存四份全文與49controls，native-browser-cleanup／current-server-stopped保存收尾；沒有下載click或媒體。

初次reproduction斷言假設管線均在第一個物理行，但CRLF已拆列；改以總列數與任一欄分隔異常核對後重現。新增測試曾誤用planning-review參數順序，改成既有operation／brief／result及完整files核對後九項通過。helper複製先替換版本导致舊包路徑後綴不符，在任何解壓／測試前失敗，保留原record；重查精確v146來源後436 cases通過。原生selector曾因label未關聯而無匹配，從已觀察的原ID取得控制後完整驗證，無產品修改。

normal suite沒有GitHubAPI或新增依賴。包裝/遠端asset與原handle收尾後才寫成功證據。完整视觉／saved download／實聽同步／Host安裝及創始身分仍未驗證；不補歷史缺失證明。
