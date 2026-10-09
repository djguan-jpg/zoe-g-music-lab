# 標準剪輯交接包

素材交接頁按「下載剪輯交接包」，保存並解開 ZIP；把 `audio-source` 原音檔與 `image-XXXX` 圖片匯入原剪輯工具，在字幕匯入入口選 `subtitles.srt`。圖片沒有自動排列，檔名依原鏡頭位置編號，清單另記錄鏡頭 ID。要回本工具接續，另存 `.zoemv.json`。

| 檔案 | 用途 |
| --- | --- |
| `subtitles.srt` | 目前明確句首／句尾，按開始時間排列；需要在原工具預覽並實聽。 |
| `audio-source.<副檔名>` | 原音檔 bytes；未辨識副檔名使用 `.bin`，先核對格式。 |
| `image-XXXX.png/jpg/webp` | 已有圖片原 bytes；沒有創作或生成新圖。 |
| `music-video.plan.json` | 完整原企劃及鏡頭 ID，供 Agent 接續；不是剪輯工具原生專案。 |
| `HANDOFF-MANIFEST.json` | 檔案大小／SHA-256／角色／原素材名稱／鏡頭對應，不包含自身摘要。 |
| `README.md` | 解開、匯入與核對方法。 |

這是一般 ZIP，沒有處理 CapCut／Kdenlive 原生專案。官方文件提供 [CapCut 字幕匯入](https://www.capcut.com/help/how-to-import-subtitles)與 [Kdenlive 字幕格式](https://docs.kdenlive.org/en/effects_and_filters/subtitles.html)；本輪實際外部接受僅到 FFmpeg／FFprobe 解析。第三方 GUI、實聽及藝術接受仍未驗證。

## 來源與拒絕

每句需要明確開始與結束、非空原文及有效時間；缺少句尾、重疊、超出宣告或控制字元會拒絕，不推測、修剪原字串或自動校時。SRT 時間沿既有共享毫秒規則，保留企劃中的原時間字串、原文與列順序。含樣式標記的字幕可能由剪輯工具解讀，企劃 JSON 仍保存原文。

原素材合計最多 64 MiB、64 張圖片，單圖最多 12 MiB；文字合計最多 4 MiB。ZIP 為 stored、最多 69 entries、68 MiB 加 64 KiB，固定 1980 時間與普通檔案權限。檔名只有固定 ASCII 平面名稱，原素材名稱只作 metadata；不當作輸出路徑、URL 或 HTML。

瀏覽器先選定同一 File 並讀取自有 bytes；純層在第一次非同步摘要前複製全部素材。派生後再核對原文、鏡頭 ID、File 身份、播放器來源／可用狀態、所在流程與 dispose。等待期間來源改變不送出下載，沒有自動重試或回滾。sender 明確接受才顯示「已送出」，不能當作已保存證明；保存後仍需核對 ZIP 及來源。

重新載入 `.zoemv.json` 保留原作品時長，包含空白字串；沒有用 metadata 改寫原宣告或放寬整份回讀。一般新選音檔仍沿原空白接續規則。

## Agent 使用本機命令

來源檔案由使用者明確指定，先執行 inspect 取得完整 SHA，再另存新 ZIP：

```powershell
python -B -X utf8 scripts/mv_project.py inspect --input my-project.zoemv.json --plan-out my-new-plan.json
python -B -X utf8 scripts/mv_project.py handoff --input my-project.zoemv.json --expect-sha256 <完整SHA256> --out my-new-handoff.zip
```

`<完整SHA256>` 是需替換的值。CLI 沿同份來源讀取、摘要核對、既有 reparse／秘密路徑拒絕與 `xb` 排他輸出；已有檔案或來源碰撞會拒絕，不覆寫原檔。與既有 revise 指令配合時，只使用明確選定的來源與新輸出；沒有新增 Agent／MCP operation 或權限。

純層 `web/mv-handoff.js`／`musiclab/mv_handoff.py`、DOM adapter 及 CLI I/O 分開；相同已核對來源在 JS 與 Python 產生逐 bytes 相同 ZIP。這個一致性與標準解析可驗證檔案交接，不能代替創作或市場實用性接受。
