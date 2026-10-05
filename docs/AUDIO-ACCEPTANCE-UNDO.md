# 接受條件套用撤回（v0.66.0）

在「載入條件草稿或檢查報告」預覽並明確套用後，可按「撤回上次條件套用」。只保留最近一次套用，恢復原始profile、custom與三欄原值。選定音檔與其他工作台保持，已產生成果沿既有dirty／重新驗證規則。

## 純狀態、controller、DOM

`draft-undo.createValueUndo(validate, message)` 純函式庫注入領域validator；record先完整驗證並隔離before／after，proposal核對目前完整內容與實際after，回傳隔離before。驗證失敗不取代舊record；後續編修拒絕proposal但保留record，不丟棄目前內容。原createUndo與三工作台draft scope契約保持。接受條件validator沿draft1／每欄1024字元／64KiB邊界；一筆record只含兩份條件，不含媒體、DOM、成果、路徑或保存操作。

audio controller在成功Apply後讀回實際capture作為after，並保存當時loaded指紋。loaded仍只指向已核對檔案原document，不能把adapter的額外改寫值標成已有來源。Undo重新核對完整條件，profile／custom／原字串皆須相同；值看似數字相等但原字串不同也拒絕。最近套用B覆蓋A的Undo後，只能回到B之前，不成為無限history。

成功Undo只替換條件；不以媒體身份作撤回條件，因為不恢復或更換媒體。撤回後確認實際接收值與before相同，恢復以前loaded，保留獨立confirmed及pending下載，清除本次record與preview並增加latest token。晚到選檔不能重建已取消的預覽。before本來未保存仍顯示需另存；before為已載入來源則恢復該留點。後續已確認的下載保留其click-time來源。

busy時拒絕撤回；錯檔／取消預覽與一般編修不清舊record，整份projectLoaded與dispose清除暫態。未完整接收或adapter例外不宣稱成功／保存，也不做交易式回滾；保留實際內容與record並提示核對，可能已有部分欄位寫入。這不是自動保存或無資料遺失承諾。

DOM只提供明確button、literal提示、enabled與focus。成功後custom=true聚焦取樣率，否則聚焦接受條件選單；不把焦點留在剛停用的Undo。拒絕後保留當前條件並顯示原因。

## 版本與權限

這是本頁暫態歷史，不進draft3、input1、review1、Agent1或任何保存schema。原完整報告核對與明確選檔保持；沒有新CLI／Agent／MCP／HTTP操作，基本14／啟庫19工具。純模型與注入控制器可單獨測試，browser在app初始化時才解析既有draft-undo依賴，原載入順序保持。

產品66，明確交付來源38–66共29項；未知67拒絕。legal4／PolyForm Noncommercial1.0.0、private及FreeTWAI not_submitted保持。驗證見[QA](QA-v0.66.0.md)，還原見[交接](HANDOFF-v0.66.0.md)。
