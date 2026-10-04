# 接續文字交付 ZIP（v0.39）

## v0.44 原文分段閱讀

text-window1獨立，完整來源核對後讀明確UTF-8邊界，單段4–16KiB、非零位置pin前次ZIP SHA，未指定分段的原契約保持。Browser唯讀reader有界buffer／頁面／history、current source重查；全文下載、Apply／Undo與12／17工具保持，來源明確38–44。見[使用與分層](DELIVERY-TEXT.md)。以下早期章節保留迭代來源。

## v0.43 指定 ZIP 原文

完整核對來源後才能選取明確原檔名，pure selection1／application／CLI／Agent／MCP共用；Browser pending current source唯讀下載沿native bytes。512 KiB選定JSON上限、8 MiB完整來源與原文保持；來源明確38–43，12／17工具與Agent1／draft3及既有交付schemas保持。見[目前契約與使用](DELIVERY-SELECTION.md)。以下早期版本段落保留迭代來源。

v0.42成果預覽有界但原文下載與ZIP保持全文，browser共用native bytes；來源工具明確38–42，未知拒絕，Agent契約及上限保持。見[目前下載契約](TEXT-DOWNLOAD.md)。

v0.41 include_report明確要求baseline、互斥include_files；CLI與browser可保存差異報告，launcher可帶--delivery-zip／--audio。來源工具明確支援38／39／40／41。見[報告契約](DELIVERY-REPORT.md)。

v0.40新增載入前原文／精確差異審閱與CLI／Agent／MCP明確baseline，工具支援38／39／40。見[目前比較契約](DELIVERY-COMPARISON.md)；下方保留v39初次回讀契約。

在「本輪成果」選取本工具產生的文字交付 ZIP，先看工作台、工具版本、原說明、檔案大小與 SHA-256，再按「載入這份ZIP成果」。只替換目前工作台的文字成果；表單、後續編修、草稿保存狀態及已選音檔保持。這能接續上一輪下載或CLI／Agent交付的成果，並重新下載全部原文。

先切換到ZIP所屬工作台再選檔，跨工作台不自動切換。讀取中或預覽中可取消；修改欄位、換台、建立新成果或更換媒體後，舊回應不能覆蓋目前內容。成功預覽清除先前錯誤訊息，但尚未載入。

「撤回成果匯入」只還原匯入前的本工作台成果，保留後續欄位與音檔編修。原成果依賴的表單已變更時，撤回後會標示需重建並停用下載。換工作台或產生其他成果後舊撤回失效。匯入成果作為外部原文，可再封裝，不冒充由目前表單重新產生。原清單說明與畫面提示分開保存，200字說明可原值再下載。ZIP不保存可編修表單；需要表單時另用專案草稿或需求JSON。

## CLI 與選定來源

```powershell
python music_lab.py delivery-inspect --input outputs/my-delivery/zoe-delivery.zip --out outputs/inspection
python music_lab_agent.py --delivery-zip outputs/my-delivery/zoe-delivery.zip
python music_lab_mcp.py --delivery-zip outputs/my-delivery/zoe-delivery.zip
```

CLI只輸出delivery-inspection.json摘要，預設拒絕覆寫；明確--overwrite才替換指定輸出。Agent operation／MCP tool `delivery_inspect` 預設payload `{}`、files={}，回傳摘要及meta.needs_review=true；明確 `{ "include_files": true }` 才回傳小型原文字檔。檔案集合序列化JSON的UTF-8大小上限512KiB，包含跳脫後大小；超限改用工作台。既有2MiB傳輸行上限保持。

ZIP來源只能由啟動參數明確選定，JSON不能傳路徑、URL或ZIP base64。未選來源時檢查拒絕；discovery描述source_selected。基本12／明確啟庫17工具，需重新discovery。Agent1／MCP2025-11-25／draft3保持，新增inspection schema1，交付package schema1分別管理。工具不自動寫檔、不呼叫模型或外網，不解壓到磁碟。

## 接受格式與界限

只接受本工具v0.38.0／v0.39.0的標準確定性文字ZIP及package schema1；未知版本拒絕，沒有靜默轉換。1–64文字檔、文字總量8MiB、ZIP最多8MiB+65536 bytes、清單最多32KiB、中央目錄最多32KiB。單層安全檔名、UTF-8、ZIP_STORED、固定時間與檔案屬性、清單置於最後。拒絕重新壓縮／改寫清單、註解／尾附資料／隱藏記錄、媒體路徑、未知欄位、CRC／SHA不符。

完整SHA與逐檔清單證明封裝內容一致，不能證明作者、平台創始身分、權利、創作品質或媒體接受。有人重新製作合法封裝並填自己的說明，仍可能通過一致性檢查；清單沒有數位簽章。HTML成果只在文字預覽中顯示，不執行。正式歌曲／影片與實唱實聽另驗。

## 分層與核對

`musiclab/delivery_inspect.py` 先限制讀入量與中央目錄，才使用ZipFile，在記憶體中讀文字；用原工具版本的共用producer重建，核對整包bytes。application共用metadata／小型原文回覆，CLI／JSON-lines／MCP固定來源與HTTP二進位上傳為adapter。HTTP `/api/delivery-inspect` 沿loopback Host／Origin界限，檢查不建立下載staging；重新封裝沿既有有界下載。

browser `delivery-archive.js` 只讀所選ZIP的有界原清單，不取代server完整CRC／canonical核對。`delivery-import.js` 為純回覆核對與注入controller；`delivery-import-dom.js` 只渲染literal文字／按鈕，app接既有bundle／revision／media。實際所選ZIP大小、SHA、原清單與server回覆逐檔摘要一起核對，防止只改回覆scope／label卻沿用原ZIP SHA。雜湊前後與套用前都重查來源；取消後晚回應不生效。撤回保存必要舊成果，生效後只追蹤scope／result revision，避免反覆複製大型成果。

未來產品版本調整時，須同步明確更新producer／inspector／browser支援版本表與契約測試，再改__version__；不得因產品升版自動接受未知package版本。詳見[QA](QA-v0.39.0.md)及[交接](HANDOFF-v0.39.0.md)。

## v0.45

v0.45明確接受來源工具38–45，純inspection／selection／text-window／report與Agent／draft schemas保持；未知工具版本仍拒絕。此輪的限定PID程序補查與交付檢查權限分開。
