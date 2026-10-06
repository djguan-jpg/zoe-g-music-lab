# v0.145.0 QA

前版重現：兩側完整長文字不同但128bytes摘錄相同；完成報告後改成無效selection再run仍留下ready=true。本版新增明確全文查看及前置失敗stale，重現結果和當輪完整檢查存於忽略outputs/v145-qa。

## v0.145.0 指定原列完整原文

草稿檔與保存版本的原列比較新增「閱讀這一列完整原文／回到原文摘錄」。修正兩側前128 bytes相同但末尾不同時無法審閱的缺口；六集合、全部欄位、未變更／空字串／缺列保持。每次明確閱讀以共享controller的readPayload取得同一次完整驗證與current proof核對後的隔離來源，再由純fullValues選取原列，literal DOM顯示全部原字串；不從摘錄拼接、不改或套用草稿。全文只留在暫態DOM；新比較、取消、失效及clear／dispose清除，切換閱讀模式保留按鈕焦點。

共享controller亦修正新run在capture／prepare／gate前置失敗時舊report仍ready的可重現錯誤；有舊報告即發布stale，停舊下載／全文，再允許明確有效重試。原late／ownership隔離保持。29組input/output schemas、原整份及原列JSON／Markdown bytes、22基本／29啟庫、Agent1／draft3／comparison1／row-comparison1保持；本輪backend及HTTP路由沒有diff。產品145／唯一policy38–145共108，未知146拒絕。

736 Python methods（1既有Windows symlink權限skip、0expected failures）、1789 JS、150 syntax及四Skills通過；新增20 JS，集中121 JS。428歷史producer ZIP／manifest byte cases及29 schemas保持。兩個原生入口各六集合完整before／after字面文字逐字核對，22快照保留21原欄、六列集合、1000句的stable IDs與四完整成果；最後明確改歌名，後續編修保留、舊全文清除及停用。三種viewports各两入口真Tab／Enter、無頁面水平溢出、console0；六PNG僅保存忽略QA，完整視覺／screen reader及browser實際保存檔案未驗證。

v144指定原ZIP2790931bytes／SHA b4d0dabbf0e8e09472b5238cab86810dbc25c51b5266adf58c07ccb7b6311266以原launcher還原736 Python／1769 JS，暫存移除。只使用自建合成草稿庫，兩JSON原hash保持；一個QA server正常shutdown／context close／deadline thread join且原exec EOF0，自建一頁關閉、viewport reset。只唯讀盤點本outputs與explicit typed jobs，嚴格七天及最新三版保護保持，草稿／素材／未知程序不清除。

PolyForm Noncommercial1.0.0、public、創辦ZOE. G／GitHub djguan-jpg及四份submitted_unverified保持，六個法律／平台文件原bytes不變，本輪沒有平台提交或mutation。還原tag、codex分支、CHANGELOG／HANDOFF及指定source ZIP／SHA提供可逆交付；rolling goal active。

## 證據與限制

checks-evidence／兩原worker EOF及python-test-summary、focused.log、boundary-evidence、compatibility-final-evidence、previous-restore-evidence、native-validation與native-browser-evidence相互核對。原v144 ZIP、CRC與source明確核對，原launcher未改即通過；只清除本輪驗證的自有temporary目錄。

初始新增測試有三個fixture空集合錯誤，當次其餘36項通過；補上合成原列後集中121全部通過。qa_setup保存回傳是entry而非root id，從實際已保存entry補receipt，兩檔原bytes保持。第一份compatibility helper誤把歷史資料夾版本改為145，原失敗記錄保留，改正明確144資料夾後428 cases通過。原生兩個讀取selector寫錯但選檔已成功，改讀實際DOM aria region；cross-realm array原值相同卻被assert.deepEqual判不同，改用逐JSON字串精確比較，不改產品或既有來源。沒有因觀察錯誤重啟server或重送外部job。

完整視覺／screen reader、browser實際落盘保存、實聽／同步、Host接受與平台創始人認定仍未驗證。原v141失敗封裝worker身份無證據保持unverified，不回填PID或signal未知程序。當輪packaged checks及發布、remote asset下載逐bytes與SHA、最終盤點由後續goal-turn.json記錄，不把尚未執行事項當完成。
