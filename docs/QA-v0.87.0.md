# v0.87.0 驗證

| 項目 | 實際結果 |
| --- | --- |
| baseline | 原v86 native三種重現：中間刪除前移後續秒數；刪首將其他負值-6–0改成0–6；0.0001–0.0004壓成0–0 |
| 完整測試 | 564 Python／67.047秒、1014 JS、98語法、四Skills通過；原兩worker／120秒deadline |
| focused | 68 JS通過，新增12實際deleteEntry／undo模型測試；四位置、原字串／ID／展開狀態、極短／無效／巨大值、後續編修、較早／連續還原、busy／空列／容量／無效／重複ID、歌曲／歌詞共享流程 |
| 四adapter | 中間缺口、負值、極短三案例：actual CLI／Agent／MCP／HTTP與application完整source/data/files/meta相同；good/bad/good、CLI問題exit2、預設拒覆寫exit1且bytes保持；子程序正常EOF |
| 原流程 | actual歌詞CLI／Agent／MCP UTF-8 files相同、15工具／Agent1／MCP2025-11-25與good/bad/good保持 |
| 歷史／還原 | 196（四scope×49來源38–86）ZIP／manifest與actualv86producer bytes相同；v86原包564Python／1002JS完整還原，臨時目錄已回收 |
| native | 22觀察：正常／負值／极短／尾鏡刪除保留其他時間；時間待辦定位原開始欄位，report source不變；有效分鏡建包成功，再刪除留下缺口時完整建立拒絕，上一份成果保持且dirty停下載；還原原值及後續時間／画面／總長編修；其他工作台保持 |
| 390px | Enter刪除与還原可操作，hint width343、document375≤viewport390；截圖留在outputs/v87-qa/narrow-shot-deletion.png |
| 程序 | baseline143／corrected144頁面關閉，viewport reset；兩bounded server正常關閉／context closed／deadline thread joined，無staging；console warn/error0 |

首次focused只有舊storyboard-duration測試仍期待刪除自動將尾鏡18改成12，與本輪原值保留契約矛盾。更新為逐列原值核對和無時間patch後，68focused及fresh完整測試通過；失敗run及diagnostic log保留，未放寬時間domain。

本輪未選音檔／影片，未聲稱媒體生成或正式音畫接受；完整視覺與screen-reader未驗證。窄畫面只證明本輪操作、文字與幾何檢查，沒有把它當成完整視覺驗收。原下載流程未修改，本輪不另聲稱取得實際保存檔。

restore-v0.86.0-before-v0.87.0=d1913eda4f3c8113c4ed23cd8237e0969f7c9594。source/tree／private PR／ZIP与manifest SHA／actual remote下載／refs／本輪盤點以outputs/v87-qa發布後收據為準；本文本身不證明尚未執行的發布。legal4、PolyForm Noncommercial1.0.0、ZOE. G、djguan-jpg、private与FreeTWAI not_submitted保持。latest87/86/85保護；只對嚴格超七天且exact Git/tag可重建產物列候選，草稿／媒體／備份／failed／unknown與其他程序保持。rolling active。
