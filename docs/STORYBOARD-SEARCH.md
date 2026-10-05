# 分鏡原文搜尋

母題分鏡的「分鏡原文搜尋」可查找畫面、運鏡及敘事描述。輸入原文字，按尋找或 Enter；每批20鏡，可往後接續與返回上一批。選擇命中會展開原鏡頭並聚焦原欄位，不寫入創作或時間。

固定搜尋順序為 `section / purpose / visual / camera / transition / motif_state / character_state / change_reason`。每鏡只列第一個命中欄位及該欄第一個字面命中。大小寫、Unicode、空白、重複鏡頭與原順序保留；沒有正規式或模糊比對。時間、畫面方向、母題ID／名稱、作品標題與媒體不在來源。時間修改仍可保留原文定位，敘事欄位、ID或順序改變須重新搜尋。

純 Python `musiclab/storyboard_search.py`／原生 `musiclab/assets/storyboard-search.js` → 共用 application → CLI、Agent、MCP、loopback HTTP。Browser 注入 capture/request/focusTarget controller → 完整 files/data/meta、JSON／Markdown核對 → literal DOM → 原生 stable ID／原文字／connected／enabled及activeElement確認。依既有流程作隔離capture，hash後及request後重查來源、generation、visible/busy與成果revision；未知／錯來源／晚成功或錯誤不提交。輸出與view是隔離副本，搜尋與分頁不入draft3／保存／備份。

獨立 `zoe-storyboard-search` schema1；Agent1與draft3、分鏡與交付既有schemas保持。最多1000鏡、每欄2000codepoints、來源compact UTF-8 JSON1MiB、query1–1024 UTF-8 bytes、1–50筆（預設20）。來源鍵與字串嚴格核對、無效Unicode拒絕；不自動截短或丟欄位。完整browser request另沿2MiB傳輸上限。SHA為 `zoe-storyboard-texts-v1` 加LF及依固定欄位順序的compact UTF-8 JSON鏡頭陣列；物件輸入鍵順序不改SHA。`start_row > 1` 必須前次SHA，任何所選來源值改變拒絕接續。

新唯讀工具 `storyboard_search`：基本16／明確啟庫23，需要重新 discovery。JSON只能提供八欄的shots、query與有限分頁選項，不接受路徑、時間、overwrite、媒體或版本覆蓋。固定POST `/api/storyboard-search` 與三個固定JS資產；CLI `storyboard-search --input request.json --out chosen-folder`，預設拒絕覆寫，明確 `--overwrite` 沿共用文字輸出契約。成果為 `storyboard-search.json`／`.md`，`needs_review=true`；搜尋不表示完整分鏡、連戲、媒體或作者權利接受。

例如給Agent的payload：

```json
{"shots":[{"section":"主歌","purpose":"人物猶豫","visual":"她停下來聽風鈴","camera":"固定近景","transition":"聲音延續","motif_state":"風鈴靜止","character_state":"尚未回答","change_reason":""}],"query":"風鈴"}
```

兩欄都有「風鈴」時依順序列畫面動作。報告提供原鏡1、field與UTF-8 byte位置；不改兩欄原文。超出搜尋容量仍可保留／編修原工作台，需縮減搜尋來源後明確重查；不是完整domain容量或接受條件變更。

產品92／交付明確來源38–92共55，未知93拒絕。PolyForm Noncommercial、private、FreeTWAI not_submitted保持。
