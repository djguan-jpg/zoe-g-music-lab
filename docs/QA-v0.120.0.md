# v0.120.0 QA

619 Python（100.672秒）、1453 JavaScript、136 syntax、4 Skills及diff通過；新增24 JS、0 Python。原v119指定source ZIP（SHA 9bb573cb7cc9c301dfa9ab8de3b55679678a857b4c008d0b951466ee8a6f89ed、2204492 bytes）還原619／1429；四scope×82個歷史producer的328份ZIP／manifest bytes相同。舊27組operation input/output schemas及operations集合保持，沒有新增operation或靜態asset。八份既有whole lyrics Python data／兩檔bytes、JS data／Markdown及跨語言來源診斷保持。新tests驗證全200項跨10頁再返回、手動翻頁不移cursor、false／throw focus不前進、metadata二次改變／late revision／getter不讀、legacy32與明確200、invalid capacity在capture前拒絕；VM focus helper與實際native驗證分開。

原生37快照／28組完整草稿僅排除saved_at比較，12個mouse／native Enter定位通過。221句合成來源：原句220的2／1／0完整報告；長句221有220關係，只保留200明細，20→21自動切第二頁、previous回20第一頁、手動第二頁cursor仍20，選33後next34跨舊32上限。其他句編修與原生focus改選句使舊定位失效；原值、IDs與選句精確復原後恢復34／200；重查新revision回第一頁與未定位。global無效duration增加為221項，next到作品宣告；画面外工具列不當成覆蓋。busy／hidden／stale停用、selected零提示完整歌詞包與實聽保持。Unicode／首尾空白／其他三台、原生File身份、暫停0.5秒及8秒合成WAV保持，console warn/error零。1280×720、390×844、1280×360都無頁面水平溢出；活動欄位在viewport內且低於可見工具列，低高度CSS static。PNG留忽略QA目錄；幾何與實際mouse／鍵盤不代表完整視覺或screen reader接受。

四組CLI input與draft3原號220／221，exit2／2／0／2、完整files按自己的payload比較；重覆輸出exit1保留bytes、invalid row／missing row／input row override拒絕且不建輸出。Agent／MCP四組good-bad-good、12筆ephemeral HTTP與五個現有固定JS bytes一致，native四份完整回覆count2／1／0／220。JSON鍵序按各自原source輸出，語義data與Markdown相同，不把鍵序當來源證明。所有子程序EOF、HTTP thread正常join與owned QA server正常停止，tab關閉／viewport reset。

本輪QA唯讀snapshot初次錯把state.bundles寫為bundles，Runtime.evaluate回ReferenceError，未成功保存或改動頁面；修正為state後取得37份有效快照。第一次回復其他句原值時原生focus已選句1，因此仍stale；同時復原選句221後才核對恢復，沒有把原值單獨復原當成完整source復原。

本輪僅盤點本workspace outputs、封裝及typed owned jobs；最新120／119／118三版保護。嚴格超七天且可從exact tag／Git archive重建才列候選；未知檔、素材、草稿、備份、失敗36／53及失敗QA保持。實際session完成後再做最終稽核，沒有bare PID終止。瀏覽器保存下載、完整視覺／screen reader、實聽／實際音畫同步、Host安裝與FreeTWAI創始接受未驗證。PolyForm Noncommercial 1.0.0／private、創辦ZOE. G／GitHub djguan-jpg保持，FreeTWAI not_submitted。

分支 `codex/iteration-v0.120.0`、基線main `e3fac742ac7a35d07d9b6c43e819b9f7d80fede0`、還原tag `restore-v0.119.0-before-v0.120.0`。由tag建立codex/restore-*分支經private PR還原，保留main歷史、原素材及草稿；指定source commit封裝、SHA與實際遠端bytes另留outputs/v120-qa。
