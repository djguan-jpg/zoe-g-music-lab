# 位置欄 Enter v0.103

修正歌曲「移至第幾列」按 Enter 誤建立歌曲包、沒有移動的問題。歌曲段落、分鏡與歌詞的位置欄現在可輸入最終列號後按 Enter，一次移動同一列。空白、無效或相同位置的普通 Enter 保留原文字、游標與撤回紀錄；原按鈕仍可用。成功後焦點回到同一選列，原文、時間、逐鏡展開及音檔保持；後續編修撤回與舊成果停下載保持。

editor-position 純 strict gesture／none-hold-move intent → 原五欄metadata proposal／injected current-before-consume + current-after-consume + actual-after → editor-position-dom 自有可編輯INPUT keydown／preventDefault／focus → app 原完整raw-source order controllers。request button與enter共用finish，不新增history。只有自有當前位置input普通Enter消費default；IME／229、修飾鍵、其他鍵與已消費事件保持原生，repeat只消費不移動。純來源visible／busy也核對；失敗不回滾或宣稱成功。九原listeners加三keydown共十二，dispose只移除自身。

產品0.103.0／唯一policy38–103共66／unknown104拒絕。16基本／23啟庫工具、23既有input/output schemas、Agent1／draft3保持；沒有新增assets、server／app diff、POST operation、依賴、路徑、模型或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

gesture是精確八鍵 key／altKey／ctrlKey／metaKey／shiftKey／repeat／isComposing／keyCode；key文字、六布林與keyCode safe integer0–255，未知或損壞拒絕。普通Enter、沒有修飾、非composition／229才是move；repeat同組合為hold，其他none。不使用DOM keyup、事件合成或新history。Numpad使用瀏覽器標準event.key=Enter時同普通Enter；非標準key=NumpadEnter不接受。

Injected enter先intent與known list／allowed，再完整五欄source／proposal；before必須visible且非busy。consume前完整current核對；consume必須回true，之後重查allowed與ids／selected／position／visible／busy。空白、無效、same position或repeat此時回handled=true，只有防止原生提交，不寫source或通知focus。有效move才沿共用finish呼叫原writer，actual-after精確排列與selected／rawposition及visibility／busy保持才通知。handled不等於保存或媒體生成；default已消費但晚改source／失敗writer仍不宣稱移動成功。Button request API與原讀取次數／no-op語義保持。

DOM僅三已存在位置INPUT增加keydown，與原九listeners合計十二。target必須等於自有input及document.activeElement，connected、非hidden／disabled／readOnly，panel visible且非busy；已defaultPrevented直接保持。不將事件本體送純層，只取八原值。consume再次核對ownership，呼叫preventDefault且檢查defaultPrevented=true，不stopPropagation，不修改表單onsubmit或其他欄位Enter。Keyboard及button只在同active target且实际成功後回同selected selector；無效／same／repeat保持原input焦點及caret，foreign focus保持。finally清active、refresh文字提示；dispose只移除自有listeners。

input維持data-view-control=true、原32字元文字與數字輸入提示；新增aria-keyshortcuts=Enter，既有literal note說明Enter及按鈕。單改位置仍不markDirty、修改cue、播音或進draft3。原source guards／latest undo／dirty下載／時間與frame完整驗證保持。普通Enter只適用位置欄；composition和修飾Enter的原生行為沿瀏覽器，沒有攔截整份頁面或保證所有原生組合均不提交。
