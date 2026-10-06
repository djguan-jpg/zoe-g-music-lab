# 選定歌曲段落待辦（v0.115）

整首歌曲仍計算全部待辦，但明細上限保持200。40個未完成段落加基本欄位待辦時，後段可能沒有明細可定位。選擇「要調整的段落」並按「檢查選定段落」，列出該原始列的名稱、敘事任務、聲音配置、小節與能量問題；每段最多五項，原段落號1起。選定檢查不自動搶焦點，明確點選或Enter才沿原musicIssueTarget定位。零項只表示這五欄沒有待辦，不是整首歌曲、時長、創作、實聽或權利接受。

music-readiness.inspectSource新增內部selectedRow分支，重用同required與numeric規則；未指定原whole inspect／report結果保持。inspectRow先核對完整JSON值與既有full source形狀、40段／兩個100清單／8MiB及Unicode，再核對1–實際段數的safe integer。只診斷選定段落五欄，不把歌曲全域或其他段落問題算進來；回傳隔離原列、總段數、五欄原字串、計數與明細，沒有files或新的持久schema。

music-section-review.createController注入capture與onState，重用editor-focus.checkedSource取得自有dense、唯一且64-unit以內的完整stable IDs；ID列數必須與panel相同。只以完整ID順序、selectedId／原列／總段數／選定五欄與派生診斷作checkpoint，不以另一段的文字或全域BPM作該五欄的來源。選擇、換序、增刪或本段改值讓舊定位stale；精確恢復可接續。成功重查增加report revision，舊callback拒絕；檢查失敗保留上一份report與revision。新內容載入沿原clearDeletionHistory明確清除；暫態不進draft3、保存庫、成果或Agent wire。

music-section-review-dom只寫literal text、disabled與status，清單callback在操作時重查visible／busy／選擇／stale／revision。app再核對目前原來源及原生field，focus成功才返回true；沒有讀取preview作輸入、沒有改原文或音檔。編修全局仍沿原markDirty停舊成果下載；本地重查不能使舊整首成果變成新成果。原生input.focus保持表格內的水平捲動，窄390px與短500px實際滑鼠／鍵盤定位測得欄位在viewport中；這不是完整視覺或screen reader驗收。

新增兩個固定GET assets；Python domain／application／CLI／Agent／MCP／既有HTTP POST和25組input/output schemas保持。新功能只在本機browser做五欄唯讀診斷，沒有宣稱新增Agent選定段落operation；Agent既有music_review仍可診斷整份來源並回讀完整來源。18基本／明確啟庫25；Agent1／draft3獨立。唯一版本policy明確38–115共78，未知116拒絕。

PolyForm Noncommercial 1.0.0／private；創辦ZOE. G，GitHub djguan-jpg。FreeTWAI not_submitted，沒有取得或認領既有手冊原作者身分。
