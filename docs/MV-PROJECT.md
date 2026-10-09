# 帶素材的 MV 專案與 Agent 修訂

啟動 `python -X utf8 music_lab_server.py`，開啟 <http://127.0.0.1:8875/>。頁面上方提供一條完整草稿流程：

1. 選擇可播放音檔，填作品名稱與每行一句的歌詞，依播放順序選圖片。
2. 按「建立試播草稿」。歌詞與圖片依音檔總長均分到毫秒；這是人工校時的起點，不是辨識唱詞。原始歌詞、空白與 Unicode 保留，圖片不會被 AI 重製。
3. 試播分鏡，前往波形校時修正各句，編寫鏡頭與歌曲企劃。無圖片時使用文字卡。
4. 下載素材專案，選回實際保存的檔案，先核對摘要與原生解碼，再明確載入。四個工作台、音檔與圖片可一起重開。
5. 在分鏡或波形校時工作台匯出 WebM 草稿影片。試看後下載；畫面包含原圖／文字卡與歌詞，音軌沿原音檔。

重新起稿會替換歌詞、鏡頭與圖片，並接續作品名稱、歌詞原文；其餘歌曲企劃保留。載入素材專案會替換四個工作台與媒體，請先保存目前專案。原磁碟檔案不被覆寫。純文字草稿與草稿庫仍使用 draft3，不包含媒體。

## 容量與格式

素材專案為 `zoe-mv-project`／schema 1，建議副檔名 `.zoemv.json`。內容為 draft3、依列排列的 `shot_ids`、一份可留空的音訊及圖片陣列。每份媒體記錄名稱、MIME、原始大小、SHA-256、canonical base64；圖片使用 `shot_id` 對應，重排鏡頭不靠陣列位置猜測圖片。

企劃最多 1 MiB，媒體合計 64 MiB、最多 64 張圖片；單張最多 12 MiB。匯入／快速起稿的圖片合計最多四千萬像素，JSON 檔最多 92 MiB。瀏覽器匯入會核對所有媒體摘要及原生解碼，通過前不替換；載入後再回讀企劃、ID 與媒體 bytes。途中來源改變或部分寫入不會顯示成功，請核對目前工作台。

素材留在本機，保存與錄製不新增產品 POST 或外部 AI 連線。Repo 預設忽略 `.zoemv.json`、`.plan.json` 和既有媒體格式；私人素材仍請保存在 Repo 外。

## Agent 直接修訂

這是本機檔案橋接，Agent 使用既有終端工具；既有 Agent1／MCP、22 個基本操作及明確啟庫後 29 個操作保持。工具沒有內建生成式模型，創作由你使用的 Agent 提供。

先把素材專案保存到明確位置，使用全新輸出名稱：

```powershell
python -X utf8 scripts/mv_project.py inspect --input outputs/my-mv.zoemv.json --plan-out outputs/my-mv.plan.json
```

回傳原專案 `source_sha256` 及素材摘要，媒體 base64 不印到終端。Agent 修改產生的 `{draft, shot_ids}` 企劃：可以改歌曲核心、編曲段落、歌詞及時間、鏡頭畫面與敘事用途。重排鏡頭時，同步重排 `shot_ids`；同一鏡頭沿用原 ID，新鏡頭使用唯一 ID。已有圖片的鏡頭不可直接刪掉或改 ID，避免圖片失去來源。

修訂後使用剛才回傳的完整摘要，另存新檔：

```powershell
python -X utf8 scripts/mv_project.py revise --input outputs/my-mv.zoemv.json --expect-sha256 <原專案的64位摘要> --plan outputs/my-mv.plan.json --out outputs/my-mv-revised.zoemv.json
```

指令核對來源、完整企劃與所有媒體，保留媒體 bytes，拒絕碰撞、秘密設定檔、symlink／reparse 路徑及來源讀取期間變更。輸出使用 exclusive create，回讀後才回報保存。原檔保持，失敗時保留已存在輸出供核對。再在工作台開啟新檔，預覽並確認載入。

也可由 Agent 的完整 draft3 與明確媒體檔建立新專案：

```powershell
python -X utf8 scripts/mv_project.py create --draft outputs/new-draft.json --audio outputs/my-song.wav --image shot-1=outputs/first-frame.png --out outputs/new-mv.zoemv.json
```

初始鏡頭 ID 為 `shot-1`、`shot-2`，依 draft 的鏡頭順序。只讀取明確指定檔案，不掃描素材資料夾；CLI 的結構核對不表示音檔或圖片已解碼，請在瀏覽器匯入完成原生核對。

## 影片接受

音檔需可定位、有限且最多 600 秒；分鏡依序從 0 秒接到結尾，允許最多 1 ms 的媒體時長取整差異。歌詞時間不可留白、超出範圍、逆序或重疊；無歌詞可輸出。過長歌詞與文字卡會在錄製前拒絕，避免截掉內容。

Chrome／Edge 需支援原生 `captureStream`、canvas 與 MediaRecorder WebM 編碼。使用同一音檔、原速、960×540／540×960／720×720 畫面及目標 30 FPS。錄製依原生事件與播放器秒數，耗時約等於歌曲長度，最多 128 MiB；這是排演草稿，沒有 MP4、精準裁切、音訊混音、轉場或生圖能力。保持頁面可見；換來源、編修企劃／圖片、離開工作台、定位或暫停會取消，自有 frame、track、timer 與 listener 會清理。

原生 streaming WebM 缺少 Duration 時，只對無 SeekHead／Cues 索引的受支援容器補入實際錄製經過時長。音畫 codec payload 保持，遇到未知結構拒絕；錄製事件與編碼延遲可能讓影片略長於音檔。機械核對與草稿匯出不代替實聽、視覺或素材權利接受。

原生 API 參考：[MDN captureStream](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream)、[MDN 錄製媒體元素](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element)。本專案程式獨立實作，依 [PolyForm Noncommercial](../LICENSE) 禁止商用。
