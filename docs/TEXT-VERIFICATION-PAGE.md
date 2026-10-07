# 完整原文中的差異閱讀

## 問題、來源與分層

v153的39byte雙側前後文可辨認字元，但長原文超出32768單位成果預覽時，缺少完整來源閱讀入口。從restore tag鎖定三個v153原模組的native前測，第40018byte同大小emoji差異只提供前後文，閱讀按鈕保持停用。本輪不以片段取代完整核對；完整七欄report1、保存確認callback及原選定File arrayBuffer流程保持。

純text-verification-page.prepare以text-download.prepare檢查目前完整原名／Unicode／8MiB上限並單次編碼，重用delivery-text.sliceBytes與原range的UTF-8邊界、16KiB限制和六欄DTO。原文起點取差異前8192bytes並最多往前退3bytes至字元邊界；range終點退至完整字元，仍最多16384bytes。presentation先用checked驗六欄與精確長度，再定位該byte所屬完整Unicode字元，emoji不拆surrogate pair；EOF只有明示結尾，其他分段不假造mark。

Controller只在已完成不一致核對、同scope／revision／完整原名与文字且visible／非busy／非dirty時接受明確read動作。read前準備、原reader讀後再次核對來源與sequence，finally清除preparedOriginal。原before快照沿既有核對保留；新增狀態只保存一頁與最多512個已讀位置，沒有完整rawbytes常駐cache，不重新讀取或保存選定File全文。每次明確翻頁需重新編碼目前原文；不宣稱實測RAM或效能認證。

原delivery-text reader共用first／seek／next／previous；previous是返回實際讀過的上一位置，不是猜測前一物理段。open再次seek差異，first／seek清除舊history，closed導航拒絕。matching、新read、cancel、來源變更、busy／dirty／hidden、pagehide及dispose清空頁與history；callback失敗不能曝光原文閱讀。view頁面隔離clone，不把page／mark／history送入草稿、Agent wire或保存callback。

## DOM、焦點與邊界

三文字入口各有八個可選固定節點；legacy或不完整reader DOM保持原核對流程。新增按鈕明確閱讀差異、從原文開頭、下一段、返回已讀上一段、關閉。reading區塊初始hidden，匹配或失效時清空文字；缺少完整節點不接管新按鈕。dispose移除自有handler並停用reader按鈕。沒有新timer或object URL。

呈現以createTextNode／textContent／replaceChildren建literal文字及單一mark；不執行HTML、不讀hidden form或DOM preview作來源。raw page.text保留CRLF／BOM／NUL／bidi；顯示將CR／tab與ASCII控制、BOM／指定零寬／bidi轉跳脫符號，LF仍換行，不是原bytes檢視或重寫。最壞16KiB的NUL頁為98304顯示單位；metadata明說片段、half-open byte range与控制跳脫。既有39byte雙側原hex仍保留。

只有成功manual action才focus mark或本頁pre；close回到可用open或原status。完成File核對不新增搶焦點動作。普通refresh對同contextRevision／start／page.text／差異位置保留DOM mark身份，避免替換已聚焦節點。pre tabindex=0、描述關聯與polite狀態，max-height=min(40vh,300px)、overflow:auto、pre-wrap／anywhere；未做完整窄尺寸視覺與screen reader接受。

## 驗證及可逆

19新增案例：byte range type／capacity／UTF8邊界、5MiB尾端差異、每個多byte字元位置、控制字元原文與escape上限、EOF／空來源／page外、unknown fields／Unicode、opt-in與單次File讀取、隔離DTO、closed導航、current callback失敗、三literal DOM入口、manual焦點／refresh保留、source invalidation／matching／pagehide／cancel／dispose、pending late與partial optional DOM。最初測試誤認40003差異的center起點必須超32768；實際起點因前8192bytes而為31811，改驗完整字元在頁內，保留首輪失敗，不作產品缺陷或綠燈證明。

完整755Python（1既有Windows symlink skip、0expected failures）／1911JS、153syntax、四Skills、168focused通過。464四scope歷史producer ZIP与manifest逐bytes、29Agent輸入／輸出schemas、原整份／原列comparison bytes保持。前版exact-source v153ZIP2976852bytes／SHA6056d9dd696f04465d5430ee9567937fe234d72b7fb374cb77409007a90d18e8，原launcher／120秒deadline順序還原755／1892与CRC，暫存移除。

Native9次真File chooser（前1後8），synthetic64020bytes，第40018byte差異對應🎵。後8次為三個mismatch、三個match、extra尾端EOF及取消late；8/8reads／gates0／七欄callback計數保持。明確Enter／滑鼠閱讀、next／visitedprevious／first／返回差異／close焦點、source revision清除及後續文字保留通過。正式頁三入口、unique IDs及新asset一次、console0。兩自有server原session78785／99249均正常EOF0、deadline joined，兩test tabs關閉，無viewport／screenshot／media嵌入。完成閘門是QA控制真File.arrayBuffer執行，不冒充慢磁碟；未驗證保存下載、真I/O失敗、完整視覺、實聽、Host或創始認證。

restore-v0.153.0-before-v0.154.0指向9d95687ce4cf2c031441352ffe00d75b5812273f，codex/iteration-v0.154.0。產品154／policy38–154共117、未知155拒絕，22基本／29啟庫／Agent1／draft3／舊schemas保持。僅一固定GET新資產，沒有新operation、POST、模型、依賴、auth、任意路徑或產品外網能力。六法律／平台文件原bytes与PolyForm Noncommercial、public、ZOE. G／djguan-jpg保持；四投稿已存在且自行聲明未核實，不重送。保護最新三版，strict超七天且exact tag／archive可重建才清理；草稿／素材／partial36/53/141及unverified77保留。rolling goal active。
