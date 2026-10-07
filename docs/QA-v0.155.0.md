# v0.155.0 QA

## v0.155.0 目前入口與歷史分層

README、Agent與架構指引、四Skill先提供目前可用流程，不再把歷史QA摘要排在操作之前。新增START-HERE連接四工作台、CLI範例、保存與結果解讀；Agent區分JSON-lines／MCP handshake／payload、22基本與明確啟庫29操作、來源選擇和能力邊界。七份入口由982110bytes減為25953bytes，全部舊文由v154 main的exact Git blob複製到同目錄HISTORY檔，原bytes／相對連結基準與四Skill frontmatter保持。資料沒有刪除，縮小的是入口讀取量，不是磁碟容量或RAM量測。

四CLI範例實際執行產生成果，重複輸出回傳1且原成果bytes不變。Agent discovery22／範例untimed原文、MCP2025-11-25 initialize→initialized→tools/list→tools/call與structured/text一致、四domain Agent成功及合成PCM原bytes保留。第一次QA腳本在拒絕覆寫後誤限錯誤措辭，保留terminal失敗與五child records；後續只接續拒覆寫／Agent／MCP核對，不重跑或替換原四成果。各CLI/stdio工作EOF；不是Host安裝、模型、媒體創作或保存下載接受。

755Python（1既有Windows symlink skip、0expected failures）、1911JS、153syntax與四Skills通過；468四scope歷史ZIP／manifest及29組operation input/output schemas與整份／原列comparison bytes保持。原v154 exact-source ZIP3000508bytes／SHA153a6387005a8f3eee7ea479cee43e2aa8fd7b7bf608e2288bcd994469c9ece8，以原launcher／120秒deadline順序還原755／1911，CRC通過且暫存移除。

產品155／唯一policy38–155共118、unknown156拒絕；22／29、Agent1／draft3／舊schemas保持，backend／browser implementation及asset／operation／依賴／模型／auth／路徑／外網權限沒有擴張。六法律／平台原bytes、PolyForm Noncommercial／public、ZOE. G／djguan-jpg與四submitted_unverified紀錄保持，本輪不讀寫FreeTWAI。restore-v0.154.0-before-v0.155.0→73b25274dcae919f5d363cbb57702e0555e7140c；codex/iteration-v0.155.0，exact-source封裝与rolling goal active。

詳見[文件分層契約](DOC-ENTRYPOINTS.md)；本輪沒有修改UI，無新瀏覽器視覺驗收聲稱。