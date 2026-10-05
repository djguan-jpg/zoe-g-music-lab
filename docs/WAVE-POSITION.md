# 波形定位與播放時間

在「波形校時」選擇音檔後，波形下方顯示目前播放位置及音檔總長。點擊波形可定位；方向鍵移動 0.5 秒，Shift＋方向鍵移動 0.05 秒，Home／End 到起點／終點。位置限制在目前音檔範圍，仍須另外按逐句標記或編修歌詞時間。

沒有音檔、正在更換來源、時長未知、來源不一致或播放錯誤時，顯示「尚無可定位音檔」。滑桿的值和最大值歸零、aria-disabled=true、離開 Tab 順序；不可操作的方向鍵不攔截。新音檔就緒後恢復定位。載入專案草稿原有的清除音檔行為保持。

| 操作 | 定位效果 |
|---|---|
| 點擊波形 | 依目前波形矩形比例定位 |
| 右／上方向鍵 | 前進 0.5 秒 |
| 左／下方向鍵 | 後退 0.5 秒 |
| Shift＋方向鍵 | 改為 0.05 秒細調 |
| Home／End | 起點／終點 |
| Alt／Ctrl／Meta 組合或其他按鍵 | 留給瀏覽器處理 |

`web/wave-position.js` 純模型接受明確 source/current_source、duration/position、ready/error 快照，不讀 DOM、媒體、時鐘、網路或持久草稿。有限正時長及可安全表示的毫秒範圍、有限且在範圍內的位置才可定位；其他原生媒體狀態得到不可用顯示，不以零假冒有效時長。未知快照形狀拒絕。

純顯示產生範圍、值、比例與時間文字；純鍵盤／滑鼠函式產生候選位置。時間文字四捨五入至毫秒，ARIA 數值及原生 currentTime 保留實際秒數，顯示捨入不修改歌詞或作品宣告。極短音檔的文字可能顯示零毫秒，滑桿仍依實際有限時長定位。

注入 controller 只透過 capture/setPosition/onView/onError 工作。套用候選前再次讀取來源及時長；換檔、未就緒或錯誤拒絕舊候選。播放自然推進不因 position 改變而被當成換檔。失敗不冒充成功，dispose 後不再讀取或定位。

`web/wave-position-dom.js` 將模型輸出以原文寫入時間文字與 ARIA，綁定本滑桿的 click/keydown。只有成功處理的定位按鍵才 preventDefault，點擊後焦點留在滑桿；dispose 只清自己的 listener。沒有新 timer、URL、音檔副本或媒體解碼工作。

原 app 組合原生 audio 的 readyState/currentSrc/error 與本頁選定 URL；drawWave 重用同一顯示模型的比例繪製游標。loadedmetadata/timeupdate/seeked 及 loadstart/emptied/durationchange/error 更新定位。原波形來源任務、AudioContext、URL 回收、時長採用／撤回及手動 cue-stamp 保持。

本功能是工作台播放定位，不是自動校時、實聽同步、播放精度保證或響度量測。獨立歌詞預覽沒有這個波形滑桿，固定 HTML 範本未修改。定位狀態不進 draft3、Agent wire、成果或保存庫；沒有新增 Agent operation、依賴、模型、路徑／寫檔或 auth 權限。

產品0.78.0／明確交付來源38–78／unknown79拒絕；基本14／明確啟庫21工具、Agent1／draft3 及其他 schemas 保持。PolyForm Noncommercial1.0.0、private、ZOE. G、FreeTWAI not_submitted 保持。
