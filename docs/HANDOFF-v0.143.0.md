# v0.143.0 交接與可逆

restore-v0.142.0-before-v0.143.0 固定 0541be9663b9c9a3c78f1454ae976ef3d2084791；分支 codex/iteration-v0.143.0。另建codex/restore-*分支從tag經PR還原，不rewrite已公開tag，不覆寫草稿／媒體，不撤銷平台投稿。

## v0.143.0 草稿比較變動類型

草稿檔及保存版本的比較新增「變動類型」：全部、變更、新增、移除，與工作台範圍共同篩選。純draft-compare-view只保存最多200筆scope／status與原明細序號，返回隔離的保留明細計數與每頁10筆位置；DOM先重查完整current來源再換篩選。換類型／範圍回第一頁，跨頁展開位置保留；新比較／取消／來源失效清除。兩個原生select可換行，標籤／aria關聯及空清單保持可操作。比較report1、完整JSON／Markdown下載、原工作台／草稿／媒體不因篩選修改。

721 Python執行（1既有Windows權限skip、0expected failure）、1749 JS全部通過；新增15 JS覆蓋交集／隔離／未知與getter拒絕、原序號跨類型展開、兩DOM來源失效／空清單／全份下载不變。148 syntax／四Skills／155 commands通過。兩原生入口50份DOM快照，21原欄位／六列根含ID與四成果原文保持；1280×720、390×844、1280×360各兩入口實際Home／End／Tab／Enter，焦點可達、頁面無水平溢出，console0。六張JPEG只保存於忽略QA，不嵌入對話；完整視覺與browser落盤仍未驗證。

來源38–143共106版、未知144拒絕；420歷史ZIP／manifest原bytes與28組tool schemas保持，五adapter比較／backup與10版原record／draft匯出、82合成JSONhash保持。v142指定ZIP以原launcher還原721／1734後正常移除暫存。21／28工具、Agent1／draft3／comparison1保持；沒有backend／adapter／controller／download模型變更、依賴、auth或權限擴張。一個有界QA server正常shutdown／context close／deadline thread join且原exec EOF0，自建QA與平台查閱頁已關閉、viewport reset。

ZOE. G／djguan-jpg、public與PolyForm Noncommercial1.0.0保持。此次登入唯讀確認音樂公會長及四個公開投稿，仍是作者自行聲明／尚未核實；沒有重送或平台mutation。restore tag、codex分支、CHANGELOG／HANDOFF、精確source ZIP／SHA可逆；最新三版與嚴格七天／Git重建規則保持，rolling goal active。

# v0.143.0 QA

本輪流程：本機草稿或保存版本預覽 → 比較完整來源 → scope與變動類型共同篩選 → 原序號展開／換頁 → 閱讀與完整報告保持 → 明確取消。

| 項目 | 結果及直接證據 |
|---|---|
| 原缺口 | 從還原tag精確git show回讀舊view，selectKind為undefined，兩原生kind控制不存在。 |
| 純模型 | 五個新增tests：scope AND kind、scope保留計數與metadata、输入與回覆隔離、未知／getter／額外拒絕原狀保持、200序號跨類型／頁碼、reset／clear。 |
| DOM | 兩入口各五個新增tests：四類交集与空清單、manual展開及detach晚回覆、filtered bulk與來源單次核對、source變更拒絕且保留原文、各kind完整JSON／Markdown bytes不變及新report清除。 |
| 完整回歸 | 721 Python methods執行，1既有Windows symlink權限1314 skip、0expected failures；1749 JS全部通過，148 syntax、四Skills與155 commands exit0。full run兩原worker typed identity／EOF0摘要保存，封裝再以同一source完整檢查。 |
| 原生頁面 | http://127.0.0.1:8875/，標題ZOE. G Music Lab · 創作工作台，v0.143.0；有實質內容，無framework overlay，console warn/error0。 |
| 互動 | 檔案來源34保留明細（changed5／added26／removed3）；保存版本37（changed20／added0／removed17）。四選項、audio空交集、manual展開換kind返回、每頁bulk／換頁返回、新report與cancel實際操作。 |
| 響應式／keyboard | 1280×720、390×844、1280×360各兩入口；真Home／End選只看移除，Tab到expand，Enter後collapse可操作並在viewport內，Enter收合焦點回expand；頁面及兩select／計數無水平溢出。DOM幾何＋elementFromPoint佐證焦點可達，不代替完整視覺或screen reader驗收。 |
| 原資料 | 50份DOM快照完整比較21原欄、六列根／stableIDs、目前成果全文；四份完整成果逐一選取前後原文相同。82合成保存JSON hash保持，沒有save／restore／Apply。 |
| 截圖 | 六JPEG只留ignored outputs/v143-qa，核對bytes／SHA；遵守使用者不嵌入媒體，未看圖或宣稱完整視覺接受。 |
| 相容／Agent | 420歷史producer ZIP／manifest原bytes與28組schemas保持；五adapter比較／backup good-bad-good／HTTP200400200，明確10版本record／draft bytes與82原JSON保持。 |
| 還原 | v142 ZIP2734297bytes，SHA9822913189ed8f5db8a78ea0ee690c1eb9a3b7196e4ddaed1851be5d017f0353，指定source484eb6c475e14abda6972fb8fbf05c42cd9ffb3e；CRC、原launcher實際721／1734，暫存正常移除。 |
| 程序／頁面 | 單一有界loopback QA server自我typed登記，正常shutdown／context close／deadline join、原exec EOF0；自建QA頁與平台查閱頁各一關閉，viewport reset，使用者原分頁保持。 |
| 平台 | 已登入Zoe為音樂公會長；四份原創公開頁確認ZOE. G／djguan-jpg與禁止商用，author仍尚未核實，沒有重送或外部mutation。 |

Browser skill未列出，使用本次提供的unified-computer-use Playwright API與既有IAB；沒有安裝fallback依賴。API順序：原生chooser選自己的合成草稿 → compare-start → selectOption／Home／End／Tab／Enter → 每步DOM來源快照 → 六viewport screenshot落在本機忽略QA → close／reset。Skill要求的完整visual圖檢查未執行；使用者要求不嵌入媒體优先。

初次新增fixture誤用object交付項目而非既有string list，10個新DOM tests被既有shape guard拒絕，改正合成fixture後81重点JS通過；產品契約未改。首次focused helper把tests視為Python package而import失敗，改用同目錄unittest discovery後四既有browser契約通過。響應式helper首次操作已因另一來源預覽而隱藏的file入口，被UI automation拒絕；helper依真互斥流程逐入口重新preview，六項成功，沒有修改產品互斥或隱藏UI繞過。

space metadata完整snapshot 20236檔／705135851logical bytes，strict>7days 0檔；獨立stat sum一致、exclusive receipt拒覆寫。此報告不直接判斷清除，發佈後另核對direct pairs、exact tags／Git archive與same-host typed runs；最新143／142／141保護，原partial36／53／failed141、v77 alternate、草稿／媒體／未知保持。

未驗證：browser下載實際落盤、完整視覺／screen reader、媒體File／實聽／同步、Host安裝與平台正式founder。比較download模型沒有diff，完整下載bytes由focused測試核對，不以已送出取代saved file。CI未配置；direct handles不能宣稱整機外部工作或舊failed packaging child不存在。

指定source commit／tree、ZIP／SHA、PR與兩個remote assets實際bytes以manifest及outputs/v143-qa/source-evidence.json、release-remote-evidence.json、goal-turn.json為準。full及package direct worker摘要與typed run各保存，原handleEOF0需實際觀察；barePID／舊紀錄不提供kill權限。pure view新增scope/status descriptor為internal runtime契約，不是對外wire；未保存類型篩選或閱讀進度。rolling goal保持active，下一轮繼續本工作區可重現產品、Agent、browser缺口。
