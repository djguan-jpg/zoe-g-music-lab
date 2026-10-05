# v0.79.0 驗證

原版 native tab127 證明逐句標記立即改時，但沒有逐句撤回；保留 `outputs/v79-qa/gap-evidence.json`。restore-v0.78.0-before-v0.79.0 指向原 main 8526de2d44edd242c3d7661f70f0ad7f8243610e。

完整檢查545 Python（67.437秒、兩隔離worker、120秒總期限）、920 JS、86 syntax、四個Skills通過。新增11個狀態／失敗／DOM測試，重點39項通過。首輪16個JS失敗因四個截取app函式的VM fixture未提供新cueStampEdit變數；補null注入後fresh完整檢查通過。產品初始化未缺變數，無放寬來源或late保護。原始失敗record／log保留。

Agent 實際stdio good/bad/good回應true/false/true；bad額外path由既有domain回報invalid_input，兩份成功結果一致。首輪QA誤期望invalid_request，修正QA期待值後以fresh helper完成，未改Agent。實際成功的lyrics.json（480bytes）經native chooser→預覽→明確套用，預覽保留標記history，套用新row ID清除history，原音檔／宣告保留。無模型呼叫。

native tab128完成22次觀察，見 `outputs/v79-qa/browser-observation.json`：

- 開始／結束／整句移動及精確原時間撤回；後續文字、其他句時間及刪除保持。
- 同值、invalid end保留舊撤回；target time編修、改回及刪除／還原不復活。
- 更換兩秒合成WAV後撤回保留新音檔及六秒作品宣告。
- Agent文件預覽／套用如上述。
- 390px Enter撤回，焦點歌詞1開始；133個editor欄位只有目標start從0.5還原00.200，其餘132保持。button33–153px、note33–345px在viewport內。
- console error/warn為0，兩個自有分頁已關閉，viewport已reset。兩個bounded server由原handles正常exit0、context關閉／thread joined，無staging。

v78原封裝1517182bytes／SHA 67658fda666e219ae95b6cb31090e6293cd3bc060d2cac26de25cba5296bad37，還原原碼545／909通過並清除自有temp。164組歷史ZIP／manifest（四scope×38–78）與v78實際producer bytes相同，原文檢查通過。

原始封裝、remote download及final maintenance證據在發佈後另寫ignored receipts；此文件不自我宣稱尚未執行的發佈結果。原有legal4、private、founder ZOE. G、平台not_submitted及14／21工具保持。

未驗證連續播放競態、實際保存至使用者下載目錄、完整screen reader或完整視覺接受、實聽／音畫同步／權利／FreeTWAI審核。DOM幾何及合成資料不代表上述驗收。
