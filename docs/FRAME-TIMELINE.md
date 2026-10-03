# 分鏡影格契約

v0.23.0 增加完成分鏡的影格覆蓋宣告，schema 與產品／Agent／時間起稿版本分開。自行實作，使用既有 Python round 語義，沒有第三方程式碼或新依賴。

## 映射與覆蓋

`frame = round(seconds * fps)`：以實際浮點乘積取最近整數，正好半幀取偶數。例如 24 FPS 時 0.0625 秒為 1.5，映射到第 2 幀。沒有 epsilon snapping 或進位到下一幀。Python 與 JS 用相同規則；秒數和 FPS 不改寫。這是設計資料的離散化，不能當音畫同步實測。

每鏡 `[start_frame, end_frame_exclusive)` 包含開始、不包含結束；至少一幀。首鏡 start_frame=0，相鄰鏡頭 start_frame 必須等於前鏡 end_frame_exclusive，最後等於按宣告時長映射的 total_frames。沒有一幀影格容差。

秒數仍先核對原本的連續／尾端 1 ms 容差，加入 1e-12 秒浮點餘量處理剛好 1 ms 的二進位差值。相同影格內的原始秒數差異保留；超過秒數容差，即使影格相同也拒絕。時長上限四小時、FPS >0 至120；沿用四小時尾鏡的 1 ms 同幀容差。起稿 FPS 沿用1–120。

## 完成報告

storyboard.json／application data 新增：

```json
"frame_timeline": {
  "format": "zoe-storyboard-frames",
  "schema_version": 1,
  "rounding": "nearest_ties_to_even",
  "end_semantics": "exclusive",
  "total_frames": 24
}
```

每鏡原有 start_frame／end_frame_exclusive 保持。CSV 欄位保持；prompts.md 與摘要增加總影格、每鏡排他範圍及幀數。CLI／HTTP／JSON-lines／MCP 共用 application，在輸出前完成影格檢查。CLI 默認拒絕覆寫。capabilities.storyboard_frames 提供上述四個 descriptor 欄位，沒有 total_frames，因其屬於特定作品。

## 拒絕與相容性

原本 1 ms 內的秒數差異可能跨過半影格：0.06251 秒結束映射2、0.0616秒開始映射1，會重疊一幀；反向則有空缺。尾鏡與宣告時長也可能各自映射到不同幀。現在明確拒絕並提示位置，保留原秒數，沒有靜默修補。

瀏覽器純模型核對所有影格與秒數／FPS、連續覆蓋與宣告。0.23.0及之後報告必須有 schema1 宣告；舊有效報告沒有宣告仍可核對，摘要明示「舊報告未宣告影格版本」。有宣告則必須是精確五欄、已知 format／schema／rounding／end_semantics及匹配整數總幀；未知版本或矛盾拒絕，保留上一份成果。過期回應在核對前捨棄。

分鏡時間 seed1 的 schema、欄位與有效結果保持，Python／JS 重用相同映射。JS 原先容許距離0.500001幀內的另一個整數，現在核對精確映射；例如 8 秒 ×23.9375 FPS=191.5，必須192而不能191。有效 seed1 不遷移，矛盾舊輸入拒絕且原檔保留。

Agent1／MCP2025-11-25／draft3／library1／backup1／lyrics_seed1／lyrics_package1／audio_loudness1、六／十一工具不變。沒有模型呼叫、媒體渲染、重取樣、實際幀率探測或成片驗收。正式素材需另核對歌曲、動作和轉場。
