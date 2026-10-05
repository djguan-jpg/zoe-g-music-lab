# v0.88.0 驗證

| 項目 | 實際結果 |
| --- | --- |
| baseline | native四入口重現：歌曲報告等待時仍加避免事項与交付項目、分鏡報告仍加母題、歌詞診斷仍加句子；回覆後來源過期，無本輪成果 |
| 完整測試 | 564Python／65.421秒、1024JS、98語法、四Skills通過；既有兩worker／120秒deadline |
| focused | 107JS通過，10新實際handler/control/run測試；六入口busy零讀/write/ID/dirty/focus、idle retry、容量、保留母題ID、選定較早刪除、成功/失敗/過期finally與原欄位編修；原刪除／焦點／歌曲順序／時間／規劃／起稿／歌詞／音檔回歸 |
| 四adapter | 原生完整歌曲／分鏡／歌詞報告的source/data與actual CLI／Agent／MCP／HTTP／application相同；原UTF-8 files完全一致、CLI0或2、預設拒覆寫1且bytes保持、good/bad/good與正常EOF |
| 原流程 | 歌詞CLI／Agent／MCP files一致、15工具／Agent1／MCP2025-11-25保持 |
| 歷史与還原 | 200（四scope×50來源38–87）ZIP／manifest與actualv87producer bytes相同；v87原包564Python／1014JS完整還原，臨時目錄回收 |
| corrected native | 21觀察：全部六新增／指定刪除／三台還原busy disabled；三種報告完成後來源保持；四原缺少guard的入口恢復可新增、選定較早還原且新增值保持；原欄位編修仍使舊回覆失效、上一份成果保持且dirty停下載 |
| 窄畫面 | 390px Enter建立報告、處理中還原停用、完成後Enter還原/新增與原句保持；新句聚焦「歌詞 2 文字」，document375≤390；截圖outputs/v88-qa/narrow-busy-controls.png |
| 程序 | baseline145／corrected146關閉、viewport reset；兩bounded server正常關閉/context closed/deadline thread joined，無staging；console warn/error0 |

為穩定重現等待期間，outputs/v88-qa的合成QA server僅在三個report POST加入6秒延遲，原domain回覆保持；production music_lab_server.py沒有變更。失敗／finally釋放以實際run的受控Promise測試證明；本輪沒有另製native網路失敗。原生資料來自本工作台合成範例的完整可見報告，不是使用者素材或實際保存檔。

本輪首次focused與完整測試均通過。v87契約已補正實際web/deletion-history.js名稱。未選正式音檔或影片；完整視覺／screen-reader／實聽音畫接受未驗證。原下載流程未修改，也未另聲稱本輪取得保存檔。

restore-v0.87.0-before-v0.88.0=c09b61c4b5b0bd0b3bbcd2e3adf899890ae42fdd。source/tree／private PR／ZIP與manifest SHA／actual remote下載／refs／本輪outputs和程序盤點依outputs/v88-qa發布後收據；本文不單獨證明尚未完成的發布。legal4／PolyForm Noncommercial1.0.0／ZOE. G／djguan-jpg／private／FreeTWAI not_submitted保持。latest88/87/86保護；嚴格超七天且exact Git/tag可重建才列候選，草稿／媒體／備份／failed／unknown及其他程序保持。rolling active。
