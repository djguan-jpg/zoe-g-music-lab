# v0.65.0 驗證與限制

本輪先重現實際Agent review JSON被原draft decoder拒絕，再加入完整來源核對檔案入口。另重現確認較早下載讓新載入條件無改動卻變dirty，改為loaded／confirmed分開的有限checkpoint。原始失敗與修正後收據在outputs/v65-qa，原版未通過不冒充完成。

## 自動驗證

最終目前來源：503 Python測試通過；保存修正後785 JavaScript測試通過；69原生JS語法、四份Skill與diff通過。封裝器另從指定commit還原並重驗完整測試及Agent／MCP metadata，結果以manifest為準。

六項新Python／六項新JS涵蓋50份跨語言輸入（25來源×草稿／報告）、有效／未完成／停用原值、CRLF／Unicode／重複值、整份報告變造、未知版本、額外欄位／函式欄位、bool數字混用、嚴格UTF-8／JSON／容量、隔離、actual CLI0／2／1及排他輸出、實際Agent／MCP拒絕report payload而接受draft、HTTP固定資產／400到200、decoder注入、preview／Apply／cancel／busy／late／媒體／target與留點。另一項JS回歸核對較早確認後新載入仍retained、原確認留點仍可回讀，後續未知編修需另存。

108歷史ZIP（四scope×27舊producer）完整bytes／manifest相同。指定v64 ZIP SHA-256為6a8322c93eddb3b752d5c844650fd2fa7a995427f119c99923e3f7c2357a8ccf，CRC及來源核對通過。其完整497 Python回測有一項本機CIM查詢cim_query_failed，496項通過；原封裝11項程序測試單獨重驗全通過，778 JS通過。沒有宣稱該次完整497一遍全綠，沒有修改程序查詢或跳測試。

首次目前來源與舊版完整測試同時執行，各碰到120秒timeout，舊版暫存清理遇Windows file lock後RecursionError。已保留原exit1及typed records，後續完整測試分開執行，保持原上限；唯讀核對先前暫存僅兩個空目錄與已驗證archive後移除空目錄，未終止外部程序。當前完整retry503通過，舊版497結果及程序焦點retry分別如上。

## 原生瀏覽器

owned tab109選合成PCM，實際一次分析回一項DC offset提醒，未將它描述為音檔全通過。由實際Agent產出報告選檔；變造固定note與schema2均拒絕，保留條件、native WAV與上一份報告。有效report先預覽不修改；編修取消舊預覽，Enter取消／重新選檔／Enter套用保持音檔與舊成果。建立新條件報告，HTTP完整wire與Agent產物逐值／files相同，CRLF／全形／底線／前後空白／重複原值保持，未完成bits16.5待辦1項。

原draft選檔預覽沒有report來源標示，取消保留內容；其他三工作台的完整欄位與初始快照相同。390px override下document寬／scroll寬375px，preview左右33／342px、提示換行與Enter取消可達，console warn/error0。DOM幾何只是一項佈局檢查，不當完整視覺或螢幕閱讀器驗收。錯誤DOM probe選到不存在的selector，改用已觀察status重讀；未重選檔或重分析。

tab已閉合、viewport reset，QA server392200／原handle12055正常exit0，lazy staging未建立。保存checkpoint修正由注入controller回歸驗證；原生頁在修正前已載入，沒有把舊頁宣稱已測新checkpoint。沒有再次點browser下載，沒有保存路徑／實際saved bytes證據。正式媒體、實聽、完整視覺／螢幕閱讀器、特定Host與FreeTWAI創始資格仍未驗證。

legal4／private／not_submitted保持；指定source封裝、private PR／release與遠端bytes／digest／CRC／四refs／同tree／clean main的最終收據在outputs/v65-qa。只盤點本outputs與typed owned jobs，最新65／64／63保護；超七天且可現場exact重建才可清除完整release pair，失敗／未知／草稿／備份／媒體與外部程序保留。
