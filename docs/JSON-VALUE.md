# 完整 JSON 值核對 v1

來源與回覆必須保留型別及完整欄位。`JSON.stringify` 會把 NaN／Infinity 變成 null，丟棄物件的 undefined 欄位，並把陣列 hole 變成 null，不能作為來源一致的判斷。

## 純比較模型

`musiclab/assets/json-document.js` 的 `sameValue(left,right)` 回傳 boolean，不寫來源、不序列化、不 clone。兩側必須是可比較的 JSON 值：null、boolean、合法 Unicode 原字串、有限 number、完整自有 dense array或 enumerable data property的 record。數字0與−0依JSON語義相等，型別不能互換；物件鍵插入順序可不同，但鍵集合、每個原值及完整巢狀結構必須相同。

自有 Symbol／hidden／accessor欄位、undefined／function／BigInt、hole、額外array屬性、非有限數字、Date／Map／Set／typed array等不接受。支援null-prototype與cross-realm普通record，`__proto__`、constructor作原鍵讀取，不寫prototype。不採物件身份的快速通過；same reference仍完整檢查。循環、深度超64層容器、比較超262144對節點或觀察throw回傳false。這是DTO值核對，不是任意caller object的沙箱、總配置容量界限或prototype／Proxy／繼承getter安全承諾。

## 呼叫與分層

七個既有核對模組共用sameValue：三個music／storyboard／lyrics-search、lyrics-review、lyrics-export-review、web/planning-source與web/lyrics-preview。來源schema、完整files／metadata、原wire、current revision／query／scope／File身份與DOM提交的既有次序保持。本輪沒有新增HTTP或Agent操作，也没有讓比較器代替domain驗證。

## 可重現範圍

v107基線的五個真JSON案例：三種search的data.next_row:null、lyrics_review的source.duration:null及issue.related_row:null，改成1e400後 native JSON.parse產生Infinity；舊序列化比較與原附檔一起錯誤通過。三個純runtime案例：music／storyboard結果首列extra:undefined及lyrics_export_review.data.extra:undefined被舊比較丟棄。undefined不能直接以JSON傳輸；本輪不宣稱遠端利用或真外部回覆已有此問題。

新17項JS測試涵蓋上述good／bad／good、字面原值、key order、無效Unicode、own getter不呼叫、dense／extra／symbol／hidden、循環／64層／節點邊界及跨realmrecord。實際瀏覽器四個1e400回覆只改data內一nullable欄位，完整files／meta原樣；異常保留原panels／IDs／音檔與上一份bundle／result revision，正常重試一次提交。lyrics-preview已沿strict parser，這次只統一比較器，不宣稱它有同一基線錯誤。

## 固定預覽接續

固定歌詞預覽沿 template1全外框與本安裝模組核對。更新共用模組後，舊v107 HTML所嵌模組不同，現版明確拒絕回讀；同完整package的現版HTML通過，舊檔SHA保持，臨時還原移除。保留舊HTML與完整lyrics.json，需要接續時載入完整JSON並重新建立現版預覽；schema沒有遷移。舊版離線HTML仍保留其原程式，本輪沒有重写或宣稱新修正適用於舊檔。

產品0.108.0／唯一 policy38–108共71，未知109拒絕；17基本／24啟庫工具與24組既有 input/output schemas保持，Agent1／draft3／所有領域 schema保持。

LICENSE／NOTICE／LICENSING.md／FOUNDER-RECORD.md保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted，不認領既有手冊原作者。
