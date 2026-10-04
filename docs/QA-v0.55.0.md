# v0.55.0 驗證

## 可重現缺口與分層

outputs/v55-qa/gap-evidence.json記錄基線guard接受空HTML／另一完整來源／改動apply程式的三種真實回應；新版完整固定外框与来源核對拒絕。integration-evidence記錄固定共用template生成合成樣本與v54 bytes一致。新template1純層、Python固定asset producer、共用result guard、import注入controller与現有app revision／DOM分别管理；無新依賴／模型／自動寫檔權限。

## 完整檢查

463 Python、704 JavaScript、58語法模組、四Skills與git diff --check通過。六新Python測試涵蓋固定資產／跨語言、提供或推估總長與校時歷史、真CLI完整JSON輸入／no-overwrite／原輸入保持、JSON-lines先錯後正確、真MCP預設13 tools回應、真HTTP契約與載入順序／no-store。十新pure JS測試涵蓋whole-envelope改動、空／wrong-source／wrong-history、strict JSON／duplicate marker／literal字元、不同鍵排序／數字拼法、未知／missing contract、捕捉隔離、escaped大型來源與HTML cap。另兩response controller及一import測試驗證錯HTML保留原列／成果／proposal、late忽略、正常重試。全部共463／704非只新測試。

兩次版本同步helper分別因單／雙引號假設停下，保留失敗record，新的helper完成；不重跑immutable job。第一次focused helper用了不可import的tests模組路徑，改新helper用discover。其後CLI新測試把raw build請求當CLI輸入，產品依原契約正確拒絕；測試改完整package，未放宽CLI，fresh helper与fullchecks通过。失敗log均留在本輪outputs，非產品成功證據。

## 原生瀏覽器

Tab94：完整3句JSON包含ASCII空白／tab、U+0085／U+2028／U+2029、timestamp字面、範本marker與closing-script文字。Read→預覽→明確Apply→六檔建包，fullJSON／原字元／總長／shift／review_notes相符。fixture只換另一完整preview.html或只改runtime code，其他四檔data正確；兩次拒絕保留title／raw／duration／9欄／檔案選擇／上一份內容。normal重試成功；改第3句后重新建立，原note保留，舊shift移除。六份controlledHTTP reports依序normal／normal／wrong-preview／changed-code／normal／normal，fresh Node guard再對實際wire重查通過。

Tab95：只執行自有正確合成offline預覽；title literal且h1無子元素，9欄與來源相符，不改字Apply保留完整來源歷史；改第3句Apply保留原note并移除過時shift。390／1024／1800兩頁document scrollWidth375／1009／1785，主頁提醒按鈕留在頁寬，offline table局部捲動347／660、961／961、1052／1052；這是DOM幾何，非完整截圖視覺驗收。兩頁warn／error logs均0；tab94／95關閉、viewport reset。server原session45748／PID349232正常exit0，lazy staging未建立。

## 還原、封裝與限制

v54 exact ZIP1,123,050 bytes、SHA bf5331ed54a2f821fefcdd2ea371e5b8092df242f06acb35ebbb0343ec87188a還原跑457Python／691JS，暫存restore移除。指定v55 source commit封裝會再跑相同完整checks與ZIP/tree/schema/legal4核對；private PR、Release实际下載bytes／SHA／GitHub digest／CRC／四refs／main clean結果以outputs/v55-qa最終收據為準，封裝不含outputs。

Latest55／54／53保護；只盤點本workspace outputs與本輪明確typed runs。failed36／failed53、unknown／media／draft／backup及外部程序保留；只有>7天且verified exact重建才可清除。沒做瀏覽器保存檔、正式media／實聽、完整視覺、特定Agent Host或FreeTWAI founder接受；平台not_submitted。GitHub CI未設定，rolling goal active。PolyForm Noncommercial1.0.0／ZOE. G／djguan-jpg／private與legal4保持。
