# v0.104.0 驗證

587 Python（97.813秒，兩隔離 workers／120秒整體期限）、1218 JavaScript、119 syntax、四份 Skill 通過。四新增 JS 測試逐一涵蓋三列表及 button／Enter：變更或替換預期排列、偽選列、全提案欄位與巢狀陣列改動、舊提案保留至下一次移動、capture 反向修改回呼副本；正確原寫入與通知保持。基線18個回呼案例確實誤判成功，修正後錯誤 actual-after 拒絕，外部資料保留。v103真 source ZIP 還原587／1214；264份歷史交付 ZIP／manifest 完全相同，23組 schema 相同。53原生快照核對六完整 raw-ID 排列／撤回與同 selector 焦點、三後續列編修撤回、三同位置 Enter 的原值／revision／retention 保持、七 busy 控制與完整來源保持。七 native 完整回覆、七 CLI／Agent／MCP 操作及21 HTTP good/bad/good 全回覆等於 application；兩 observed draft3 reviews 回讀、預設覆寫1保留 bytes、invalid1無輸出、diagnostic2保持。原 File 身份與0.5秒paused／8秒合成音檔保持，console0；一個自有 tab 關閉、viewport reset、bounded server 正常停止，子程序 EOF0及 HTTP thread joined。

回呼改動是純控制器注入測試，未宣稱瀏覽器內有惡意回呼或外部可利用漏洞。實際瀏覽器只用 native 操作；CDP唯讀，PNG留在 ignored outputs。完整視覺、screen reader、OS IME、保存成功、實聽、正式媒體、Host安裝與平台創始接受仍未驗證。

基線18案例為三 list ×兩 entry ×order／selection／notice；actual reordered rows 或 selected 已與原 plan 不同仍回 true。純層修正只複製 ID metadata，沒有 DOM 注入此異常回呼。四新增測試包含預期排列替換與原陣列反向、selected mutation、list／id／index／from與 before 五欄及 arrays 的正確寫入後改動；後者仍回原成功位置。舊 writer DTO 延後改動不影響第二次 move，capture 以保留 DTO 改 expected 也不能掩蓋錯誤 actual-after。

原生快照使用 captureDraft 的完整原值，以 stable ID 對應 raw rows 核對 permutation，其他 panels 不變；逐鏡open按ID比較。觀察草稿只排除每次新產生saved_at。三份實際輸入後的undo保留新欄位，不只檢查幾何。七busy為disabled controls及完整 source 證據，未假稱送出disabled鍵盤事件。media全部已選音檔快照為同 blob／paused／0.5秒／8秒，另以原 File object核對同身份。

一次驗證script使用不存在的direct details selector而逾時；查看現場 article/details 結構確認已open，接續原頁實際文字欄編修，未重建頁面或重送工作。完整視覺與各OS輸入法未驗證。
