# v0.89.0 驗證

2026-10-06，本機 127.0.0.1:8875 / Codex In-app Browser。使用現有 CUA browser2，無額外依賴、其他專案或秘密。範例與報告延遲6秒、第二次 music-review HTTP500僅 ignored QA helper；production server 未改。

| 檢查 | 結果 |
| --- | --- |
| Python | 564，69.922秒；原2workers/120秒門檻 |
| JS | 1034，fail0 |
| 新/聚焦測試 | 10項新，134聚焦，fail0 |
| 原生模組語法/Skills | 98 / 4 |
| 原v88 ZIP | SHA/CRC完整核對，原包564Python/1024JS，暫存移除 |
| 歷史producer | 4scope×51versions=204 ZIP及manifest精確相同 |
| CLI/Agent/MCP/HTTP | 三原生完整報告source/data/files/meta共用application相同，預設覆寫拒絕，good/bad/good，EOF0 |

Baseline v88：歌曲改歌名/刪除需求後建立報告，pending仍可載入例子，原歌名回復合成來源、歷史清空；分鏡改片名/刪除鏡2同樣重現，原3鏡變回4鏡。兩回覆變stale，沒有可交付新成果。舊回覆保護仍有效，但範例操作已清除原編修/歷史。

Corrected：native startup兩按鈕disabled；读取期间自写歌名保留，ready後兩按鈕可用。歌曲成功報告pending兩範例disabled，完成後原source/歷史保持，兩入口恢复。第二次500仍保持完整上一份成果/來源/歷史，按鈕釋放。第三次處理期間自寫hook，晚成功被拒絕，hook及歷史保持、上一份成果保留且dirty停下載。分鏡pending同樣停用，成功source/3鏡/刪除紀錄保持；稍後idle明確範例只復原所選工作台，另一台及其歷史保持。390px×844以Enter載入原創範例並取得新範例內容；固定界面與console證據留outputs/v89-qa。

頁名/URL正確，頁面非空，無framework overlay。第二music-review的HTTP500與畫面錯誤是刻意測試，console warn/error零。Screenshot只存ignored QA，未嵌入對話；實際控制/內容/鍵盤結果已觀察，沒有宣稱完整視覺或screen-reader验收。未選完整音檔/影片；正式媒體、特定Agent Host與FreeTWAI提交/創始人核實未驗證。

兩owned tab關閉、viewport reset、兩bounded server以原exec handle正常EOF0，沒有staging。指定commit封裝與privatePR/Release/实际下载SHA/refs/tree依manifest及remote receipts；最後workspace-only audit保護latest89/88/87、failed36/53/unknown/drafts/media/backups，不動其他程序。只有嚴格>7日且可Git精確重建者才列候選，無候選時不清理。
