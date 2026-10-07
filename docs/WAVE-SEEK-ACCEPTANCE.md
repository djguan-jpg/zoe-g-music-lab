# 波形定位的成功接受

本契約補充[波形定位](WAVE-POSITION.md)的原controller；該文件底部版本／授權／平台文字是v78歷史，現況見[目前入口](START-HERE.md)及[平台紀錄](../PLATFORM-STATUS.md)。

`web/wave-position.js`的pure present／keyboard／pointer產生候選；注入controller透過capture／setPosition接原生audio；既有wave-position-dom只呈現ARIA／文字與處理事件，app仍只指定currentTime，onSeek再繪製。沒有DOM、媒體檔、網路、計時器、草稿或Agent能力進入純層。

套用前兩份隔離快照核對source／current_source／duration及可用狀態，position自然推進允許。setPosition明確false拒絕；void setter仍相容。寫入後第三份快照必須仍是同一音檔與時長、ready且無error、位置有限且在範圍內，與原候選相差不超過0.001秒。成功onView直接收到此核對快照的有限present結果；不再capture另一份view冒充同份證明。未知形狀、未移動、換來源、時長改變、不可用或超差拒絕。

Home在已經為0時，void setter後實際位置仍為0可接受；明確false即使位置等於候選仍拒絕。此1ms界限是本次操作回讀接受条件，不是音畫同步或瀏覽器播放精度保證。進行中的自然播放仍依當下原生位置檢查，沒有延遲重試、timer或採用未核對位置。

失敗試著refresh目前view並onError，ARIA跟隨目前音檔；不以舊目標顯示成功、不觸發DOM的onSeek、焦點移動或成功按鍵preventDefault。已發生的原生寫入不自動回復，來源改變後不再寫舊音檔；使用者可明確重試。dispose在套用前／寫入後拒絕後续寫入或成功。controller不保存操作紀錄，不進draft3／Agent1／領域schema。

工作台原生選音檔、句首定位、目前句子、歌詞來源／文字／時間／宣告與成果流程保持。沒有新增operation、權限、依賴或固定preview模組；22／29工具保持。QA注入拒絕寫入只用於可重現前後差異，原生Chrome另驗成功流程；詳見[本輪QA](QA-v0.161.0.md)。
