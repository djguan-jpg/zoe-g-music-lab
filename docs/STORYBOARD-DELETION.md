# 刪除鏡頭與原時間契約

刪除只移除選定鏡頭。其餘鏡頭的 start/end 原字串、創作欄位、穩定 ID、展開狀態与順序保持；作品總長及 FPS 保持。刪除中間鏡頭會留下時間缺口，刪除尾鏡也不自動縮短宣告。負值、留白、無效或極短的時間不會因刪除其他鏡頭而變成有效時間。

| 層 | 責任 |
| --- | --- |
| web/history.js | 純 remove/restore；隔離原值與 record，以 stable ID／鄰居定位還原，容量与重複 ID 防護 |
| web/app.js | 原生 entriesFor/writeEntries；只提交 remove 的 remaining/record，限定工作台 dirty 與既有焦點接續 |
| web/index.html | 固定說明；刪除控制以 aria-describedby 引用提示 |
| 共用 storyboard-timing-review 與 controller | 原秒數／FPS／秒與影格覆蓋診斷，定位現有原列，唯讀報告不補時間 |
| application→HTTP／CLI／Agent／MCP | 既有完整報告、strict source 與傳輸契約保持；完成分鏡仍由 domain 完整驗證 |

新鏡頭刪除 record 沒有其他列的時間 patch 或總長 effects。History.remove 的原 record 保存被刪鏡頭的原欄位和展開狀態，還原時放回它；現存列的後續時間、文字、總長、媒體與其他工作台保持。已超容量、busy、無效索引、重複 ID 等既有拒絕規則保持，失敗不消耗還原紀錄。20筆歷史上限及指定較早刪除的還原沿既有 History controller。

原純 MusicEditor.compactShotTimes 及 History.effects 保留作既有工具／測試相容；app 刪除路徑不再呼叫它們。沒有新增「自動補缺口」入口，也沒有把秒數重排或四捨五入後當成使用者原文。

刪除或還原會使目前創作成果 dirty：可以閱讀上一份成果，下載仍停用，直到重新建立與核對目前來源。完整分鏡建立會拒絕時間空缺、負值、短於一影格等問題；「檢查時間待辦」和「建立時間報告」保留來源並提供待修改位置。零待辦仍不代表實際音畫同步或完整創作接受。

沒有新 JS 資產、HTTP route、operation、domain schema、依賴或權限。歌曲／歌詞共用刪除及焦點流程維持；15基本／22啟庫、Agent1、draft3、各領域獨立 schema 與原下載流程保持。產品0.87.0，交付來源明確38–87共50項；未知88拒絕。作者／權利及平台創始接受不由時間報告或 Git SHA 證明。
