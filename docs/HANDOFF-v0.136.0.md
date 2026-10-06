# v0.136.0 交接與可逆

restore-v0.135.0-before-v0.136.0固定 e72101259da740ef31a5d1fcbb50fb3e292db621，分支 codex/iteration-v0.136.0。從restore tag另建codex/restore-*分支與PR可審閱還原；不rewrite公開tags，不覆寫原草稿／媒體或撤銷平台投稿。

## v0.136.0 載入前比較完整草稿

工作台的現代草稿檔與保存版本預覽新增「比較目前與預覽」。先看四台作品及 metadata 差異，再明確載入或取消；比較不修改表單、成果、媒體或保存版本。明細可依台篩選、每頁10筆與鍵盤翻頁；每欄保留原字串的128 UTF8 bytes 摘錄，完整計數與完整 SHA 另列。插入或換序按原位置比較，不猜列移動。

draft-compare 純完整來源／canonical SHA／comparison1 → 注入 controller 的 click-time 完整核對與輕量 refresh → literal DOM → app 原預覽／Apply／undo 分層。Python 與原生 JS 的完整 report／Markdown 跨語言逐值一致；每份完整 draft3 canonical1MiB、前200明細／128KiB明細預算、JSON＋Markdown256KiB。WebCrypto 失敗可重試，來源不剪短。legacy 不自動遷移或比較。

編修、頁籤、原生 File 身份、預覽或保存版本改變使報告失效；晚到成功／錯誤與取消不能覆蓋後續內容。baseline 即時擷取的新 saved_at 排除於 current key，候選 saved_at 仍完整核對與列為 metadata。refresh 不重新擷取全部10000句；比較完成及閱讀報告仍完整重查。頁籤切換立即標示過期，未觀察到的 gate 改變也能結束等待。原明確 Apply 與限定撤回保持。

664 Python（新增4）／1689 JS（新增21）、146語法與四 Skills 通過；25新增測試涵蓋四台原值、完整計數／容量、控制文字／Unicode、Python-JS完整回應、晚回應／身份／取消與鍵盤焦點。原生29快照中28份含全21欄、最後來源25份；比較期間原stable IDs保持，載入後重比作品0、撤回保留先前編修，保存版本比較保留四份成果全文。1280×720／390×844／1280×360以實際鍵盤分頁、字面HTML／CRLF及emoji呈現核對，無頁面水平溢出。兩個自有頁及兩個受控server正常關閉。

實際 v135 指定 ZIP 還原660／1668並移除暫存；392歷史交付ZIP／manifest原bytes、28組input-output schemas及21／28工具保持。五adapter草稿比較／備份inspection及10版原record／draft匯出核對，82合成庫JSONhash保持；備份收據舊版本標籤以獨立更正收據說明。產品136／唯一交付來源38–136共99版，未知137拒絕；Agent1／draft3／backup1保持。只新增三固定JS assets，無新backend operation、依賴、模型或路徑／網路／寫檔權限。

restore tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA、PR與實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。只盤點本outputs及typed same-host jobs；最新三版保護，strict>7days且exact tag／Git archive可重建才可列清除候選，草稿／媒體／failed QA／v77 alternate及partial36／53保持。完整視覺／screen reader、瀏覽器下載落盤、真媒體身份／實聽同步、Host安裝與正式founder仍未驗證；rolling goal保持active。

# v0.136.0 草稿比較 QA

完整本機664Python／1689JS，146原生JS syntax、四Skills與git diff --check通過；新增4Python／21JS。跨語言完整report與Markdown、四台字面Unicode／CRLF／數字拼法／empty missing、10000句全部計數／前200項及control-heavy完整列byte預算通過。controller完整source、nativeFile注入身份、gate、latest、晚成功／錯誤、取消、retry、dispose與單job均核對；unobserved gate成功／錯誤不留busy，read拒絕也發佈stale。FakeDOM原文注入不執行、篩選／翻頁／listeners與邊界焦點通過。

29原生快照中28份全21欄；早期一份涵蓋44DOM欄，最終來源25份分組完整核對。比較、篩選、翻頁與responsive操作保持四台欄位和原stable IDs；編修僅改title，舊Apply拒絕、取消保留編修。明確file Apply加入25合成句，再比較作品0與metadata1，證明raw BPM 0120.0及原CRLF仍在來源。undo保留先前編修；loader重新建立列IDs，驗證全部列原值而非假稱載入後IDs不變。

保存版本比較／改選／取消期間全21欄與stable IDs保持；35作品差異／2metadata、全四份成果文字before與after精確相同。明確Apply等於預覽target完整21欄與六空集合；undo回完整原編修。新頁後tab切換立即hidden/stale，明確重比28作品與2metadata，表單／列IDs保持。

1280×720／390×844／1280×360实际鍵盤到最後頁後focus previous，再Enter回第二頁；頁面無水平溢出。三尺寸完整raw CRLF／emoji／HTML文字視圖相同，0新增img nodes，雙欄／單欄與局部scroll；desktop／mobile實際視覺檢閱，兩页console warn/error0。兩owned IAB頁關閉、viewport reset，兩managed Python server原handle正常EOF、shutdown／context close／deadline thread join；listener8875由最終audit核對。三張圖留忽略outputs：API回傳實際image/jpeg，歷史檔名為.png，沒有改寫或轉檔；validation receipt明記實際mime／hash。第一validation誤假設PNG header而拒絕，確認JPEG magic後新helper完成，原失敗收據保持。

v135實際ZIP2572985bytes／SHA7eea1125a0142501d07ed6f6558c5ac032a40a32293ad437b64580e19e9e50db還原660／1668，暫存移除。四scope×98歷史版本=392 archive／manifest原bytes保持；28schemas／21或28工具保持。兩verified合成保存版本經draft_read後五adapter完整比較report一致；backup inspection五adapter good-bad-good／HTTP200400200，原10version export record／draft bytes一致；82JSONhash保持，沒有save／restore。backup runtime helper實際assert meta0.136通過，receipt inherited product_version0.135以獨立更正文件明示，原receipt未覆寫。

QA harness早期partial integration count、nested library copy、missing canonical ZIP、舊版本oracle、缺prehash收據、restore helper替換污染SHA、CUA closure指向已關頁等錯誤均在原handleEOF後用新helper／新檔名修正；失敗logs保持，沒有放寬產品validator或重送server。產品發現的翻頁focus與tab失效問題已修改並以完整suite及native操作驗證。政策38–136共99版，unknown137拒絕。精確source ZIP及remote兩assets實際bytes見manifest與本輪remote receipt。

仍未驗證：完整視覺與screen reader接受、瀏覽器下載實際保存落盤、真音檔File切換／實聽音畫同步、Host安裝及平台正式founder。合成資料未冒充私人素材或成片。PolyForm Noncommercial1.0.0與submitted_unverified保持，GitHub CI未配置；rolling goal仍active。


精確source commit、tree、ZIP／SHA、merge及兩remote asset bytes見manifest與outputs/v136-qa/source-evidence.json、release-remote-evidence.json及goal-turn.json。工作台三module與application既有層保持獨立；後續改善不得用比較報告取代原Apply／source guards。每輪typed jobs最多32、等待最多60秒，不枚舉或kill其他程序；沒有合格strict>7days可重建候選就保留，不隨封裝維護清草稿。
