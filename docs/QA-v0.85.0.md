# v0.85.0 驗證

| 項目 | 實際結果 |
| --- | --- |
| 完整驗證 | 562 Python／68.797秒、986 JS、95語法、四Skill，全部通過；Python兩worker、120秒deadline |
| 新搜尋focused | 8 Python／14 JS；raw Unicode/CRLF/NUL/combining/string hash、byte位置、來源pin與邊界、complete reply、隔離、late/error/retry通過 |
| 四adapter | CLI/Agent/MCP/HTTP沿application相同，新operation good/bad/good與no-path；CLI原位元組／拒覆寫／--overwrite驗證 |
| 歷史與可逆 | 188（四scope×47版本38–84）ZIP／manifest與actual v84源位元組一致；v84原封裝554Python／972JS完整還原，臨時目錄已回收 |
| 原生瀏覽器 | 12觀察；300句20筆分頁/上一批/第21句穩定IDfocus、空表與零命中提示、未完成時間亦可查、query/text/delete失效、literal script無執行 |
| 音檔與窄畫面 | 合成6秒WAV；同blob source／宣告6／paused位置0.5保持、自然播放false paused繼續；390px Enter focus，document無横向超宽 |
| 下載 | button sent且UI提示，10秒event未取得本機保存檔；不宣稱browser保存驗收。CLI報告bytes已核對 |
| 程序 | baseline tab138／corrected139+140均關閉，viewport reset；baseline/corrected bounded servers正常關閉thread joined、無staging；console warnings/errors0 |

兩個checks helper失敗（第一輪MCP舊明確工具清單；第二輪JS regex要求cueStamp緊接markDirty入口），失敗run/log保留。新增MCP搜尋case，原cueStamp入口保留先後顺序後，fresh checks-valid全通過。跨語言測試先修正測試的U+2028 splitlines與Agent integer id，沒有放寬production規則。其餘private refs/tag/source/tree與actual release下載在發布後以 outputs/v85-qa/release-remote-evidence.json 記錄；本文不能單獨作為已發佈證明。

環境：Windows本機Python standard library與Node、Codex IAB loopback；只合成資料，无模型或外網產品呼叫。新純模型／injected controller／DOM與adapters分層。截圖保留 outputs/v85-qa/narrow-search.png，依使用者規則不嵌入對話。完整視覺、screen-reader、正式素材實聽及browser實際保存仍未驗證。

還原標籤 restore-v0.84.0-before-v0.85.0 指向627b14446fb40e7e809f752db431334a37e6f5eb。最新85/84/83保護；維護只審本專案且嚴格超七天/exact tag可重建的release pairs與本輪明確run records，草稿／媒體／備份／failed/unknown及外部程序保持。實際清除候選與job終態依本輪final audit收據。
