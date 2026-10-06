# 歌曲段落定位 v0.105

歌曲段落選單新增「查看選定段落」，按一下或以原生 Enter 將焦點移到目前選定段落的名稱欄。首、中、末段與排序、複製、刪除還原後均按目前列 ID 定位；空清單或等待中停用。查看保留創作原文、順序、撤回紀錄、成果下載與音檔。

editor-focus 純 byId 完整來源驗證與目前 ID 提案 → injected request controller 兩次 metadata capture 核對列序／visible／busy → 原 editor-focus-dom 依 ID 查實際名稱欄並核對可聚焦狀態 → app 原生 type=button／aria-controls／點擊。新 focusId 與原 index focus 共用 controller，保留原空列 add 行為；ID 查找不回退到新增。沒有新 keyboard listener，Tab／Enter 使用原生按鈕。

產品0.105.0／唯一 policy38–105共68／unknown106拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持。只改既有純焦點模組及 app／HTML，沒有新增静態 asset、依賴、domain/application/server/adapter operation、路徑、模型或網路權限。legal4保持 PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

純 byId(list, source, id, mode) 沿既有 checkedSource 的 ids／visible／busy 契約，驗證 ID 字串及 entry/new mode；同 ID 不存在時拒絕，不採用舊 index 或空列 add。先查本次來源，再沿原 proposal 的目標 DTO。新 controller.focusId 與既有 focus(index) 共用 request：前次 metadata→提案→第二次完整 metadata→相同列序及可用狀態→focusTarget===true。沒有內容寫入、順序、保存、history或媒體參照。

DOM adapter 未改；歌曲 entry 取目前實際 row 的第一個 input，即名稱欄。Focus 前核對 panel／container／row及目標 connected、disabled、hidden與busy，最後檢查 activeElement。app 明確查看按鈕的可用狀態，並按當前 selector.value 交 focusId。refreshMusicSelection 同步沒有選列或等待中 disabled；選單選擇本身不自動定位，按鈕有 type=button 防止表單提交與 aria-controls 指向 arrangement。

原 index focus 的新增／刪除／還原定位保持原空列表 add 分支；新 ID 入口不允許空清單回退。既有 selection DOM 可能在取得同列焦點時更新選列顯示，但查看後完整草稿、IDs、revisions、history及成果不變。未知／失效／等待中不聚焦別列。Tab／Enter 沿原生按鈕，不新增 shortcut 或鍵盤 listener。

名稱欄位保留原字符串，無新增清理或自動填值。原生source/async變更仍沿既有guards，不宣稱外部任意回呼原子交易。原HTTP／CLI／Agent／MCP不增加「定位」operation；此動作是本機視圖操作，不進draft3或wire。
