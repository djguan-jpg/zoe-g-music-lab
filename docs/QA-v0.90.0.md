# v0.90.0 驗證

2026-10-06，本機127.0.0.1:8875，沿現有CUA browser2。只使用本工作區及通用工具指引；範例合成、無媒體/金鑰/第三方依賴。12秒response延遲僅ignored QA helper，production server新增兩固定JS路由。

| 檢查 | 實際結果 |
| --- | --- |
| Python | 564，68.266秒；原2workers/120秒門檻 |
| JavaScript | 1049，fail0 |
| 聚焦/新增 | 149 / 15，fail0 |
| syntax / Skills | 100 / 4 |
| 原v89 ZIP | SHA/CRC後原包564Python/1034JS；暫存還原移除 |
| 歷史producer | 4scope×52versions=208 ZIP/manifest逐bytes相同 |
| actual application/CLI/Agent/MCP/HTTP | 三份原生完整報告source/data/files/meta相同，CLI預設覆寫拒絕/bytes保持，good-bad-good/EOF正常 |

Baseline v89 pending report時新增/範例/報告disabled、没有Cancel waiting按鈕，需等待回覆。Corrected music：正常報告建立後取消第二次等待，觀察到294ms後run釋放；來源/歷史/上一份完整報告相同且下載保持可用。QA後端old request returned後頁面相同，顯示取消不是停止後端。明確retry成功；pending期間自寫hook後取消，人工內容與歷史保留、旧報告及dirty下載停用保持。

分鏡改片名/刪除鏡2後取消，原3鏡/時間/歷史保持，retry建立完整原source報告。歌詞讀取取消未套用，retry只出preview，再明確Apply；刪除句2後lyrics_review取消，原表格/歷史/上一份成果保持，retry報告成功。格式報告取消與retry，390×844 Enter取消及發起按鈕焦點返回已核對。完整觀察、report fixtures、頁名/URL/console與screenshot保存outputs/v90-qa；screenshot未嵌入對話。

late後端receipt的每組started/returned已配對，沒有舊UI提交；native console warn/error零，頁面非空、沒有framework overlay。不可中斷本機讀檔/雜湊的busy/settle與late-error以純/實際run測試驗證，未宣稱大檔原生取消時延。未選正式音檔/影片，沒有實聽或媒體生成；完整視覺、screen-reader、特定Agent Host與平台創始接受未驗證。

兩owned tabs關閉、viewport reset、兩20分鐘bounded QA server經原handle正常EOF0；server context/deadline thread關閉，未建立backup/delivery staging。指定source ZIP/manifest、privatePR merge/release與實際asset下载/refs/tree evidence按本輪receipts；latest90/89/88保護。workspace-only audit保留failed36/53、unknown、草稿、媒體、備份與其他程序；只有嚴格超七天且可精確重建者列候選，沒有合格候選時不清除。
