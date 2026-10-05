# v0.99.0 驗證

段落、鏡頭與歌詞的選列會跟隨正在編修的列。新增、複製、刪除後鄰列、還原及待辦定位也會同步選列；等待中保留焦點，完成後同步目前列。鏡頭段落名稱修改後立即更新選單；單純換焦點保留創作內容與順序撤回。

editor-selection 純 metadata／ID 提案重用 editor-focus 與 entry-order → injected controller 三次 current IDs／visible／busy 核對 → 三容器 delegated focusin／refresh DOM → app 原 music selection 或 editor-order.select。只同步原生 selector／行標示／邊界按鈕，不呼叫 focus、讀創作來源、markDirty、改 revision 或建立 history；原動作保持移動按鈕焦點。busy 結束沿既有 collection refresh 核對當前原生焦點；隱藏、外部、已移除及 disabled target 拒絕。鏡頭 caption 使用 raw readValue 的目前 section／purpose，不依賴稍後才更新的 summary；穩定 IDs 時 select 不重建 options 或讀全文。兩個固定 JS assets，無新 operation／schema／依賴／timer／模型／網路／路徑／auth 權限。產品99／唯一 policy38–99共62／unknown100拒絕；16基本／23啟庫、Agent1／draft3、23 operation input/output schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted保持。

583 Python（89.531秒，兩隔離workers／120秒整體期限）／1159 JS／115 syntax／四Skills；17新測試。v98真source ZIP還原581／1144；244歷史 ZIP／manifest bytes相同，23既有schemas相同。最終45原生觀察及25前期探索；六完整raw panels／revision焦點比較、六ID排列、三刪除還原與三清理前後原值比較，24實際編修列焦點與六動作按鈕選列保持。五busy快照、完成後同步、即時caption、晚回覆保留後續原文與dirty成果通過；原生File身份、blob／paused／0.5秒／8秒在全部最終45觀察保持，console0。六native完整HTTP回覆、七 operations實際CLI／Agent／MCP及21直接HTTP good/bad/good與application相同；两個observed draft3 CLI reviews回讀，diagnostic2／invalid1無輸出／預設覆寫1 bytes保持。三tabs關閉／viewport reset、兩bounded servers正常停止、臨時HTTP thread joined／子程序EOF0。三JPEG與合成素材留在outputs，不進Git。完整視覺／screen-reader／瀏覽器保存／實聽／正式媒體／Host／平台接受未驗證。

原v98 native重現：複製歌曲段落4後focus新列5但selector仍指第一列；修改鏡頭section後摘要改變而選單名稱仍舊。v99前期探索另找到busy期間待辦focus已改、finish後selector未同步；增加原collection refresh接續與busy completion測試，再跑完整583／1159。純測試包含容量、稀疏／重複／未知IDs、capture前gate、兩次current race及actual-after、native targetownership、dispose與實際app state-only callback。

CUA原生滑鼠／Enter／fill／filechooser；CDP只唯讀captureDraft和原生File身份。最終45觀察逐份保留canonical原始panel，不把DOM換行顯示當bytes。焦點六pairs核對完整panels與revisions；六排列pairs使用stable ID映射全部原欄位，三restore核對全部panels／IDs，三clean核對原值。24編修列觀察selected等於active row；另外六move／undo的焦點在動作按鈕，selected仍是目標列。

歌曲／鏡頭／歌詞新增、複製、刪除邻列、還原接續及原legacy shot jump核對。lyrics review忙碌時focus另一原句，selector保留，成功finish才同步當前句；source與revision保持。鏡頭section名稱立即更新。晚timing reply保留後來title、五原成果與dirty停下載；編修事件的revision可繼續增加，這不代表late覆蓋。歌詞六檔／鏡頭五檔／歌曲四檔完整建包由application回覆核對。

本輪initial focused fixture有物件語法錯誤，修正後以新record通過。早期瀏覽器快照錯用已關閉tab的closure，改用新的具名CDP handle，沒有頁面注入。最初native verifier誤將move按鈕焦點當row焦點且把六檔歌詞包寫成四檔；下一次也誤要求input／change期間late快照revision完全相同。新final verifier分開檢查24真rowfocus與六buttonfocus、完整原值和revision單調性後通過，兩份failed收據保留，未重跑相同record。

六native HTTP（包含前期一份成功分鏡）與七operations CLI／Agent／MCP、21直接HTTP逐值核對完整files／data／meta。music／storyboard／lyrics／lyrics_review／storyboard_timing_review／music_review／storyboard_review；兩review讀最終observed draft3。invalid拒絕無輸出，diagnostic exit2、overwrite exit1保留原bytes。23舊schemas與core adapters沒有diff。合成八秒WAV與三JPEG在outputs/v99-qa；截圖／幾何／console不是完整視覺、screen-reader、瀏覽器保存或正式媒體驗收。
