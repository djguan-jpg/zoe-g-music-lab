# v0.152.0 QA

## v0.152.0 選檔核對的狀態焦點

原生 Chrome 在成果、草稿、接受條件與備份四個入口均重現：選定真 File後，核對進行中及完成時焦點落回BODY，結果本身正確。共用純 verification-focus新增明確selected動作 → 兩個注入DOM adapter在實際選檔當下、停用picker前聚焦對應status note。只接受有效來源／available／非pending，空選取與legacy可選cancel入口保持。這個動作不建立非同步焦點意圖；後續成功、差異或錯誤只更新原狀態，晚回覆不搶其他編修焦點。取消的兩slot／同來源note接續及proof callback保持。

755 Python（1既有Windows symlink skip、0expected failures）、1869 JS（新增19）、151syntax／四Skills與集中126 JS通過。456歷史ZIP／manifest逐bytes、29組input/output schemas、原整份／原列比較保持；原v151 exact-source ZIP 2935279bytes／SHA 2ddb54bdd5da74d53b646b8423ccf5269b021026ac6111629c523522b991fe03，以原launcher／120秒deadline順序還原755 Python／1850 JS，暫存移除。

原生共23次File選取（before4／after19），四入口的匹配與同大小差異、兩個QA注入read錯誤及重試、Tab離開、Shift+Tab／Enter取消、後續編修與來源變更均核對。after19/19 reads、4/4真正SHA、gates0，最終四匹配true及編修保留，console0。正式四note／aria、共享asset一次與2px green focus outline以DOM／computed style核對；不是已保存下載、真慢磁碟／I/O錯誤或完整視覺／screen reader接受。兩自有server原handle正常EOF0、兩QA頁關閉，未設viewport／未嵌入媒體。

產品152／唯一policy38–152共115、未知153拒絕；22基本／29啟庫、Agent1／draft3與原schemas保持。無新增operation／asset／backend／依賴／auth／path／產品外網權限；原32MiB備份及兩工作slot保持。六法律／平台文件原bytes、PolyForm Noncommercial、public、ZOE. G／djguan-jpg保持；本輪未讀寫FreeTWAI，既有四submitted_unverified紀錄不重送。restore tag、codex分支、exact-source封裝與rolling goal active保持。

## 本輪驗證範圍

| 項目 | 結果 |
|---|---|
| 四入口before pending／complete | BODY，四個匹配結果正確 |
| 四入口after匹配／同大小差異 | 對應status note保持焦點 |
| Tab／Shift+Tab／Enter、晚回覆與來源變更 | 通過，後續編修保持 |
| 两個明確注入read error及重試 | 通過，不能稱真I/O失敗 |
| 正式工作台identity／非空／asset／aria／console | 通過，console0 |
| 截圖、完整視覺／screen reader、真慢磁碟／保存下載 | 未驗證 |

使用既有CUA與原生File chooser，沒有外部Playwright或新增依賴。合成19byte文字與148byteZIP只留本輪忽略QA，原生讀取及SHA延後完成由明確QA gate控制。未讀其他工作區、歷史作品、Downloads、真草稿库或使用者其他Git。未改CSP／保護。原v151 packaged launcher顺序還原通過；沒有以前輪驗證失敗或歷史handle替代本輪實際結果。
