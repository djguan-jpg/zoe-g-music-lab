# v0.91.0 驗證

2026-10-06，本機127.0.0.1:8875/Codex In-app Browser2，原生CUA；frontend-testing-debugging驗證要點按可用原生工具執行，沒有另裝Playwright依賴。只本工作區/通用指引，合成資料，12秒delay僅ignored QA helper。

| 檢查 | 實際證據 |
| --- | --- |
| Python | 564，63.922秒；原2worker/120秒deadline |
| JS / syntax / Skills | 1057 / 101 / 4，fail0 |
| focused / new | 142 / 8，fail0 |
| 原v90指定ZIP | SHA/CRC及原包564/1049，暫存移除 |
| 歷史包 | 四scope×53版本=212 ZIP/manifest逐bytes一致 |
| actual application/CLI/Agent/MCP/HTTP | 三份原生完整report source/data/files/meta相同，覆寫拒絕不改bytes、good/bad/good及EOF正常 |

390×844 baseline：從歌曲建立報告按鈕發起，starter top405px，但cancel top3618px，bar不存在；原報告正常完成。Corrected同流程bar top6px/cancel25px，可直接按取消。正常報告→取消下一次→明確retry，source/歷史/上一份完整report相同；pending自寫hook後Enter取消，人工內容及dirty停用下載保持。完成/取消bar hidden、title空。

1440×900分鏡改片名/刪鏡2後pending顯示母題分鏡：建立待辦報告。End實際scroll1554→4481，bar仍top8px，mouse取消保留原3鏡/時間/歷史；retry成功。320×568歌詞讀取pending顯示波形校時：讀取歌詞，End scroll1956→6189，bar top6px/cancel35px且document305≤viewport320，Enter取消未套用；retry先preview再明確Apply。刪句2後校時報告取消/retry，表格/歷史/上一份成果保持；標示檢查校時進度。第一個探索性cancel嘗試前正常請求已完成，按鈕已隱藏，未當取消證據；另一次已確認pending操作完成驗證。

頁名/URL、nonblank/no-overlay、console warn/error零；原生完整snapshots/report fixtures與三尺寸screenshot保存在outputs/v91-qa，未嵌入對話。native操作與geometry可達性不表示完整visual/screen-reader/全browser或zoom接受。沒有正式音檔/影片/實聽/媒體生成；第四工作台metadata由純model與共享run測試涵蓋，沒有冒稱正式音檔pending原生驗證。特定Agent Host/FreeTWAI提交與創始核實仍未驗證。

兩owned tab关闭、viewport reset，兩bounded server依原exec正常EOF0，context/deadline thread關閉、無staging。exactsource封裝/private PR merge/release/實際download SHA/refs/tree依receipts；最新91/90/89保護，workspace-only audit不碰其它程序。strict >7day且可Git精確重建才列候選，無候選時不刪；failed36/53、unknown、draft/media/backup保持。
