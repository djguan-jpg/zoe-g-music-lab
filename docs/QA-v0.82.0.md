# v0.82.0 驗證

起點main b21b77813b31909e81da06396e279939e0f3b7b4，restore-v0.81.0-before-v0.82.0及codex/iteration-v0.82.0。baseline原生只有逐句標記／刪除，無直接回到原1.234秒的操作；gap-evidence.json記錄合成six.wav與開始01.234、結束留白。另numeric-gap-evidence.json實測Python／JS原字串-1e-999被當0，才修正共用時間層。

新增14項cue-position模型／controller／DOM測試與1 Python／1 JS負時間測試；最終focused61項。完整554 Python（68.859秒、2隔離worker、120秒總期限）、948 JS、90 syntax與四Skills通過，依checks-final.json。涵蓋strict row/media、毫秒與exclusive音檔尾端、雙讀原列及媒體、source/duration/ready/error/hidden/busy、自然位置前進、writer失敗與實際寫後核對、dispose、delegated目標、position-only便宜refresh及programmatic stamp refresh。26項Python／JS数值矩陣結果相同：負mantissa下溢拒絕、真正負零與signed shift保持。

176組歷史交付ZIP／manifest（四scope×38–81）與v81實際producer bytes相同，compatibility-final-evidence.json。v81原sourceZIP1555048bytes／SHA24a4677a151cffb89aaa5b33c293963cc19062c7192f28b1790e9c57ac931597，原包還原553 Python／933 JS通過且temp移除。

主介面31次實際觀察：空媒體disabled；有效原開始／結束留白仍可seek1.234；滑鼠及Enter、Shift細調、原136欄位與dirty保持；seek保留stamp undo、undo保留播放位置，blank start stamp／undo同步button；刪除／還原前列依stable ID；原6秒／捨入至6秒／負小數停用、半毫秒定位.001。分開兩次工具的播放樣本未作播放保持證據；改為同一次Space開始播放（paused=false）再seek及讀回paused=false／position1.415267，最後明確Space暫停。broken.wav不可定位、換短音檔目標超時停用、hidden停用／返回恢復、Agent包preview保留原ID／Apply新ID、整份draft3 preview保留media／Apply重置均通過。

另四次最終原生數值觀察：ready4的6秒音檔，-1e-999與帶空白的-0.01e-999停用且原字串保留，-0e-999可Enter定位0，修正1.234可Enter定位1.234；原end3／文字／paused保持。390×844主介面Enter定位與focus波形通過，說明x16–359、表格自身水平捲動；幾何與互動不冒充完整視覺／screen reader／實聽接受。主及數值tab warn/error console均0，三個自有tab關閉、viewport reset。

最終共用CLI／Agent／MCP四份歌詞文件逐UTF8 bytes相同，runtime-final-evidence.json；product82／Agent1／MCP2025-11-25／14工具，path拒絕與good/bad/good正常EOF。實際負時間Agent ok=true/false/true、MCP isError=false/true/false、HTTP200/400/200，正向files一致；CLI --set 1=-1e-999按既有invalid-input退出1，未建輸出。第一數值helper因http同名list遮蔽module失敗，第二helper誤期望CLI2而失敗；產品正確拒絕。保留兩failed records，fresh helper依既有CLI1核對通過，不修改CLI契約。

三個bounded server沿原handle正常返回、context closed、deadline thread joined且無staging；合成媒體及QA records在忽略的outputs，原創素材／草稿不進Git。指定source封裝另跑完整suite及metadata；private PR、merge、tag、Release、actual download／SHA／refs／tree依後續source/package/release-remote-evidence receipts，本文件不預先宣稱發布完成。最後outputs／typed runs以inventory與final-audit-aggregate為準，latest82／81／80保留，嚴格超七天且exact Git/tag可重建才列清除候選；failed36／53、草稿、媒體、未知及外部程序保持。legal4/private/not_submitted保持。
