# 取消原文核對後的鍵盤焦點

現行焦點政策由純 verification-focus 與備份共用，三個原文 controller 的來源 epoch／兩個 read 上限不變。注入 metadata→純有限意圖→DOM 分層及備份完整 read→hash 上限見[現行契約](BACKUP-VERIFICATION-CAPACITY.md)。下方保留 v150 歷史描述。

## 純來源 view 與 DOM 意圖

原 controller 的 snapshot 隔離完整來源，same 比較 scope、revision、name、content，不把 busy／dirty／visible 當作來源身份。view 在完整來源不同時遞增 contextRevision，未變的來源保持；不從共享回傳 DTO 回寫，不只信 revision 或檔名。它是本頁內部暫態 epoch，不是雜湊、作者／保存 proof 或外部 protocol，不序列化全文。dispose 清除 pin。原 reader 上限2、late generation、metadata容量／來源 bytes 比對及 callbacks 保持。

DOM adapter 只在可選 cancel 控制明確 onclick 後聚焦。controller.cancel 先撤銷該次 proof；有 available slot 時直接 focus picker，失敗則嘗試 note。名額滿時 note 可 tabindex=-1 聚焦，保存當次 contextRevision 的有限 invitation。每次 view 更新先核對同 epoch、activeElement 仍為原 note、沒有 pending 且狀態可接續，才允許 read settle 後回 picker。focus 失敗不建立後续承諾。blur 即清除，回到 note 也不復活原 invitation；新選檔、pagehide、dispose 與來源改變清除。一般 run 完成不建立 invitation、不移動使用者焦點。dispose 移除自有 blur/pagehide/onclick，不碰其他 listener。

三個 status note 在 HTML 明確 tabindex=-1，DOM 僅在未提供 tabindex 時補上，既有值保持。text-verify-note、draft-verify-note、audio-accept-verify-note 的 scoped :focus outline 使用既有 green token、2px／4px offset，未新增 component／asset。原 aria-live=polite、role=status、取消的 controls/describedby 與接受條件 data-view-control 保持。未變更其他表單、音檔、保存 checkpoint、draft3、Agent 或 HTTP 操作。

## 驗證及限制

新增9 JS 行為測試涵蓋單次取消、兩個 pending read、使用者離開／回到 note、scope／revision／name／同 revision 原文改變、一般成功／失敗不搶焦點、pagehide／dispose、focus 失敗 fallback、legacy 可選 cancel／原 tabindex 及隔離 context view。與原保存 callback 整合共68項，完整755 Python／1830 JS及150syntax／四Skills通過，448歷史 ZIP 與29schemas保持。

原生 Chrome before 用同一真 File 及 QA 閘門重現 BODY；after 共10次原生 chooser，原 File 的實際 arrayBuffer 在放行後執行。Enter 取消、Tab 到後續欄位、F8 放行及 F9 修改 QA 來源不直接改 DOM 焦點，核對 current／blur／context 保護與成功 proof。最後 reader pending=0／reports1／errors0，後續欄位值保持。正式工作台三 note 與 aria、2px green outline 的 computed style 核對；沒有 screenshot 或完整視覺／screen reader 接受。閘門是 QA 注入，不能宣稱真實慢磁碟、OS I/O 被取消或保存檔案成功。

第一次 QA inline script 違反既有 CSP，保留 failed-init 證據後改自有固定 external script，不降低產品保護。另補 QA 遺漏的 stylesheet link 後核對正式 CSS，先前 default outline 不冒充產品樣式接受。所有讀取閘門 drain、三個自有 server 原 exec handle 正常 EOF0，三個 QA 頁及投稿查驗臨時頁已關閉，未設 viewport。原下載紀錄安全限制保持，本輪未重試或繞過它。

## 可逆與外部狀態

restore-v0.149.0-before-v0.150.0 指向 f6f482ab67ebcefba853b6f771935a1b0a2e7ca0，施工分支 codex/iteration-v0.150.0。由還原 tag 另建分支審閱；不覆寫草稿／媒體或撤銷外部投稿。原 v149 exact-source ZIP SHA、CRC、755／1821還原已驗證；首次原 launcher deadline 失敗保留，worker creation identity 核對 stopped，順序重驗不提高 deadline。

LICENSE／NOTICE／LICENSING／FOUNDER-RECORD／兩 PLATFORM-STATUS 原 bytes 不變，PolyForm Noncommercial 禁止商用，不另授予 AGPL。使用者登入後唯讀確認四公開頁與無 pending 草稿，仍作者自行聲明／創始未核實；沒有新投稿、版本更新或站外訊息。source／package SHA／PR／release／程序及容量最終核對見本機忽略 outputs/v150-qa/goal-turn.json，不能用 source SHA 取代作者或平台接受。
