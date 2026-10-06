# v0.135.0 交接與可逆

restore-v0.134.0-before-v0.135.0固定dc4f5e8070cc5510c8d5589561aae81887e37503，分支codex/iteration-v0.135.0。從tag另建codex/restore-*與PR可審閱還原；不rewrite已公開tag，不覆寫原草稿／媒體或撤銷平台投稿。

## v0.135.0 完整草稿原值比較

新增唯讀 draft_compare，比較兩份明確完整 draft3；四台全部欄位與六種集合按原位置逐項比較，metadata 的 tool_version／saved_at／tab 另列。保留空白、換行、Unicode與數字原字串；集合插入、刪除或換序不猜移動及stable IDs。原欄位、新增／移除列與缺值／空字串分開，完整計數不受明細容量影響。

draft_compare 純來源／canonical SHA、原值比較、摘要與有界摘錄 → 共用 application → CLI／Agent／MCP／loopback HTTP。每份canonical草稿1MiB；comparison1獨立，最多前200原位置明細與128KiB明細預算，每側原欄128UTF8 bytes不拆字元，JSON＋Markdown合計256KiB。明細含完整欄位SHA／byte長度，metadata不是作品變化；草稿canonical SHA不是原檔排版bytes、作者或創始認證。沒有合併、Apply、自動保存、來源路徑、外網、模型或依賴。

CLI draft-compare明確--baseline／--current與--out，strict UTF8／重複鍵／schema3／容量完整核對；原檔保持，報告預設拒覆寫，--overwrite只替換指定報告。0為相同、2為有差異但比較完成、1為輸入或I/O錯誤。Agent新唯讀operation與MCP tool需重新discovery；21基本／明確啟庫28工具，舊27組input／output schemas保持。HTTP只新增/api/draft-compare，既有auth／session及草稿保存邊界保持；工作台UI沒有新增自動比較或載入行為。

660 Python（105.563秒，新增15）、1668 JS、143語法與四Skills通過。集中15涵蓋全部四台／原集合、metadata、插入與重複、10000句完整計數、有界control文字／UTF8摘錄、來源損壞與capacity、exclusive CLI輸出、真Agent-MCP good／bad／good及短命HTTP200／400／200。既有兩份合成保存版本由draft_read核對後，五adapter完整data／files／meta一致，原82JSONhash保持。這輪沒有新原生UI操作驗收。

指定v134 ZIP實際還原645／1668，暫存移除；388歷史交付ZIP／manifest原bytes及27schemas保持。原備份完整五adapterinspection、10版export的record／draft原bytes保持，建立時間依實際匯出各自不同。產品135／唯一來源38–135共98版，未知136拒絕；Agent1／draft3／backup1及maintenance schemas保持。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。

第一份QA Agent fixture誤用numeric id，修正為既有protocol要求的字串；第一全套有一處舊len(listed)==20漏更新，修正discovery oracle後全套通過。runtime helper輸入檔名與既有基準收據重名，exclusive create拒絕後以新helper／新檔名完成；失敗腳本與紀錄保持，沒有變更產品validator或覆寫原檔。所有本輪managed helper及test child沿原handle／EOF結束，短命HTTP正常shutdown／context close／deadline join；無新增常駐server或browser。

restore tag、codex分支、指定source ZIP／SHA、PR及實際remote assets提供可逆交付。只盤點本workspace outputs、完整direct封裝及明確typed same-host程序；最新三版與strict>7days且exact tag／Git archive可重建政策保持，無合格候選不刪，保留草稿／媒體、failed QA、v77 alternate及partial36／53。完整視覺／screen reader、瀏覽器保存落盤、media實聽／同步、Host安裝與平台正式founder仍未驗證，rolling goal保持active。

# v0.135.0 比較與交付 QA

660Python／1668JS、143syntax及四Skills；集中新增15Python。比較前後完整raw來源deep equality、canonical source SHA、完整files／data一致，metadata只變與作品改動分開，四台fields／六collections、empty／missing、新增移除、重複句插入原位置與字面Unicode／CRLF／數字拼法通過。10000原句全數計數，前200明細；80鏡含control文字觸發byte cap仍計全部，128byteUTF8prefix不拆emoji。未知／legacy／額外／引用錯誤／invalidUnicode／canonical1MiB拒絕不交部分結果。

真Agent／MCP good-bad-good、相同application完整data／files／meta與MCPtext全部核對；真CLI明確兩檔、0／2／1、單BOM、duplicate／UTF8／讀取容量拒絕、exclusive既有報告保持及overwrite明確替換。短命HTTP200400200全文一致，正常shutdown／context close／deadline join。既有合成保存版本20／21經draft_read核對，再走五adapter，完整report原bytes相同；82JSONhash保持、save／restore未呼叫，所有child EOF0。

actual v134指定source ZIP2538949 bytes／SHA1c0099891ff42694d082a6fa59344091037669c41bd89805cdf99c29a4a32475還原645／1668，暫存移除。388歷史ZIP／manifest bytes與27input-output schemas保持；新draft_compare為唯一新增operation。原五adapterbackup inspection一致、10版export record／draftbytes保持，實際包timestamp不同。產品135／policy38–135，unknown136拒絕；21／28 tools、Agent1／draft3與舊領域契約保持。

QA修復只改fixture與oracle：numeric Agent id、舊discovery count及helper檔名重複；原失敗helper／logs保留，無validator放寬。全套重跑105.563秒通過，owned handles確認EOF後才再執行新script；不因觀察timeout重啟。這輪沒有UI變更／新native操作，不宣稱visual或browser落盤接受；現有完整視覺／screen-reader、media身份／實聽／同步、Host及平台正式founder仍未驗證。公開Release實際assets與exactsource／SHA由manifest及outputs/v135-qa遠端收據核對；沒有GitHub CI配置。


後續可在工作台兩份明確草稿預覽整合此比較；須沿原current／late／scope／File身份與明確Apply保護，不能讓報告替換內容。comparison1不是draft3或quality驗收。source commit、ZIP／SHA、remote merge與assets見manifest及outputs/v135-qa/source-evidence.json與release-remote-evidence.json。每輪只盤點本outputs與typed same-host jobs，最新三版保護、strict>7days可重建候選才清理；草稿／媒體、unknown／failed及partial保持。rolling goal仍active。
