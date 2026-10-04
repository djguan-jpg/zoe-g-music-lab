# v0.37.0 驗證

本輪新增原接受條件草稿與四入口接續；不是正式作品、聆聽、平台接受或模型生成驗收。

- 完整 312 Python／460 JavaScript、37 JS 語法、四 Skill 與 diff 檢查通過；新增12 Python／17 JS。精確十進位修正後完整套件再通過，最後加入 HTTP 字元邊界及直接小數拒絕後，12 Python／28 JS 聚焦檢查通過；指定提交封裝會再執行完整兩套測試。
- raw shape、未知版本／額外路徑／Unicode／重複 JSON／UTF-8／BOM／bytes、不完整欄位保留、隔離複製、profile／custom、中文逗號／全形數字／小數及指數、safe integer／64值／1024字元與長小數不可捨入。Python／JS parity 比較相同來源，不改寫原文。
- application、實際 CLI 不覆寫與退出碼、JSON-lines、初始化後 MCP、binary HTTP 均沿同一來源。草稿與直接條件互斥，JSON 不授予路徑選擇；原 mode 兩檔，新 mode 三檔；來源報告及草稿 JSON 一致。最長三欄各1024非BMP字元的有效形狀以 custom:false 實際走 HTTP，query 長度在預期界限內且原值完整回交。
- controller 的 read／apply 前後 target／File／token／busy、取消、未通知變更、過期成功／錯誤、明確另存／click-time 下載確認、後續編修及 beforeunload 原值重查。來源文件、report.json／data、檔名或同 profile 的實際接受清單不符都拒絕，保留已有成果。
- IAB 原生選檔／下載：自有1秒48kHz16bit單聲道 WAV 接受1聲道通過、接受2聲道明示不符；空白值拒絕且保留上一份報告。實際 report JSON 下載讀回來源 SHA／大小、0.37版本及接受值；未完成空白及含換行原值草稿下載逐值讀回，原WAV SHA保持。
- 真檔 preview／cancel、未完成原值 apply、未知schema2拒絕、預覽後原文編修取消；限定套用保持後來歌曲編修、校時音檔／時長及交付音檔。專案draft3真下載讀回只包含既有audio-profile，明確預覽載入後custom:false、raw原值保持、媒體按既有全份載入流程清空。
- controlled 同profile不同接受值回覆拒絕；4秒晚成功／晚500保留編修，busy停用操作；重新啟動最終來源服務後，current500保留舊成果、build／條件選檔／另存控制恢復。新服務的直接HTTP長小數拒絕亦確認。
- 390×760及1366×768：client／scrollWidth分別375／375與1351／1351，無整頁水平溢出；窄畫面Tab由聲道欄到條件另存，Enter建立與查看／返回實際聚焦output-heading／audio-delivery-view。重新整理後版本0.37及自訂接受報告正常。console error／warn 0；DOM／焦點／行為接受，不當作完整視覺驗收。
- v0.36 指定 source a22cdb168d508eba1f6c5bfdfc816d6afa770cb9 的794256 bytes ZIP／SHA aa9785e3f38ec852dd82c91f5697f8846c9346ee88aa644e081eeea30abd4138 解壓，300 Python／443 JS通過，限定暫存正常移除。

收據在忽略的 outputs/v37-qa：checks-exact、focused-final、native-downloads、downloaded-*、browser-evidence、fresh-http-exact、previous-restore-evidence；source／package／PR／遠端逐bytes／refs及最終audit／inventory各自記錄。兩個受管理QA服務已按原handle正常退出，owned tab59關閉／viewport復原；發布helpers及最終稽核狀態以相應收據為準。

本輪初次聚焦檢查的一項CLI測試誤把合成立體聲每聲道固定DC的提醒退出碼2預期為0；按既有報告語義修正測試。研究中另修正長小數可能經float捨入當整數的實作邊界，加入Python／JS／HTTP回歸。不覆寫或隱藏已保存的失敗證據。

尚未驗收正式媒體／實聽／完整視覺／特定Agent Host／原生file預覽播放；FreeTWAI remains not_submitted。非商用、ZOE. G／djguan-jpg、AI協作揭露與private保持，legal4不變。
