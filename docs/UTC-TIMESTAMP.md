# 可攜保存與備份時間 · v0.77

保存紀錄、保存清單與備份使用同一套純UTC時間規則。不存在的曆日、24:00、小時／分／秒溢位與非零時差會被拒絕；錯誤回覆不能更新清單、搜尋結果或備份恢復預覽。原稿與音檔保留，換成合法資料後可以重新預覽。

驗證只檢查原值。保存stored_at、備份created_at、SHA來源與恢復bytes保持，不自動補日期、轉時區、改分隔字元、改小數或覆寫原版本。保存排序仍依原stored_at字串、再ID降序，不使用時間戳或Date排序；相同時刻的不同拼法也各自保留，不能推定曆時順序。

## 原始字串規則

YYYY-MM-DD，年份0001–9999，月01–12，日依Gregorian月份與閏年。年份可被4整除且不可被100整除，或可被400整除為閏年。時間前保留任何單一有效Unicode codepoint分隔，沿既有Python extended格式；不合併或忽略分隔字元。HH必填兩位0–23，可接:MM兩位0–59，再可接:SS兩位0–59；只有秒欄可接小數，精確3或6位ASCII數字，不捨入／補齊。

必須明示零時差：Z、+00:00或-00:00。後兩種可接:00及可選.000/.000000；非零offset秒或小數拒絕。Z原已被browser接受、Python3.10未接受，本輪明確增加同值alias；不是改寫成+00:00。例：2000-02-29T12:34:56Z、2026-10-05 01:02:03.123+00:00、2026-10-05🎵01+00:00都原字串通過。控制字元只作literal顯示，不執行。格式最多128codepoints，strict Unicode；額外尾空白／newline、多個分隔、basic日期、非零offset、comma及1/2/4/5/7位秒小數、未知格式拒絕。

這是可攜的本產品UTC子集，不是通用ISO8601/RFC3339 parser。extended calendar、單字元分隔及hours/minutes/seconds/milliseconds/microseconds參照[Python3.10官方datetime格式](https://docs.python.org/3.10/library/datetime.html#datetime.datetime.fromisoformat)，本產品另外明確允許Z、零秒offset與3位零offset小數。Python不同版本的額外寬鬆格式不再決定產品接受範圍。正常producer datetime.now(timezone.utc).isoformat()產物保持；舊合法本產品bytes不重寫，未知格式保持原檔並拒絕，沒有隱藏轉換。

## 分層

musiclab/utc_timestamp.py與musiclab/assets/utc-timestamp.js只檢查primitive string/Unicode/精確ASCII數字grammar/曆日與clock bounds，回傳同原string，無I/O/Date/fromisoformat/locale/timezone依賴。JS使用u regex讓一個emoji為一個分隔；exact whole-match拒絕$的末newline寬鬆行為。Python fullmatch同契約。兩端不解析timestamp為浮點秒、不排序或校準鐘。

library_contract.validate_record在完整metadata形狀後核對stored_at；共用保存回讀、metadata scan、search、backup全revision及CLI/Agent/MCP/HTTP服務。draft_backup完整manifest版本形狀後核對created_at，仍先驗完整ZIP/CRC/bytes/hash/revisions，再給出恢復計畫或寫入不可變版本。無效record或manifest時間不能藉正確CRC或重新計算record SHA繞過。原artifact或草稿檔不因此刪除。

browser library-revision及backup-result.plan在原完整metadata/source/counts核對內使用共用validator；list/search/receipt/preview沿既有revision服務重用。移除兩處Date.parse接受語義，沒有新app/controller行為或Agent工具。原latest/token/query/cursor/selection/explicit Apply/write權限保持。index只新增一個固定script，先strict JSON/Unicode，再UTC module，再兩消費者；server固定asset表新增一項。

## 驗證與界線

822個Python/JS跨語言值含792個calendar matrix與Python3.10 native有效曆日oracle，閏世紀/年界/月尾/Unicode/格式/clock/offset拒絕。actual保存record的Z來源與備份created_at原Z可讀/inspect/恢復，record與draft bytes精確保持；無效record/manifest在restore寫入前拒絕。Actual CLI/Agent/MCP只讀已選合成庫，原Z/Unicode小時、unknown field good/bad/good及21工具核對。

Native3list/3search/1read/2inspect，三份fault只改reply副本：無效2月日期、24時及1900假閏日均拒絕，清單/有效preview/edit/WAV/dirty保持；healthy retry及同backup再次預覽成功。390px鍵盤選到原emoji小時格式，note313px/anywhere/console0。這不是完整visual/screen-reader、正式媒體、timestamp真實可信、作者/權利或browser實際恢復/保存檔案接受。

產品0.77.0/來源38–77共40項/unknown78拒絕，156份歷史文字ZIP/manifest與v76producer bytes一致。14基本/21啟庫、Agent1/draft3/library1/backup1/search1與原wire/schema保持；無新依賴/model/auth/session/token/任意路徑/寫入/公開權限。PolyForm Noncommercial1.0.0、ZOE. G/djguan-jpg/private、FreeTWAI not_submitted保持。


本輪發布前追加：任意Unicode分隔帶出Python codepoint與JS UTF16 raw order差異。首次source e79b41826f71a5b6b5c53e5607ba3baea88e1e12與通過的ZIP保留，尚未發布。共用UTC.compare先核對兩原stamp，再逐codepoint比較；list/search兩純validator共享，ASCII ID tie-break不變。新增actual保存Unicode pair/list/search continuation bridge與JS order/continuation，Python/JS原始字串同序、不改timestamp為曆時或normalize。第一次gap helper在修正後才執行，已corrected模型使assert失敗；新record讀first source的原L validator重現，兩次紀錄保留。第二次完整suite與封裝以final收據為準。
