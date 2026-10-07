# 分鏡總長撤回的實際接受

補充[作品總長與鏡尾](STORYBOARD-DURATION.md)及[原值分類](STORYBOARD-DURATION-VALUES.md)。目前入口見[開始指南](START-HERE.md)，驗證見[本輪 QA](QA-v0.163.0.md)。

純 `web/storyboard-duration.js` controller 的 undo 先保存 pending 紀錄身份，capture 原值後核對紀錄未變、FPS、鏡頭 ID／時間／順序／數量及實際採用後宣告。只有 current 來源完全一致才呼叫原注入 apply，寫回 pending.before；既有 app 限定修改總長，保留後續創作文字、其他工作台及媒體。

寫入器明確回 false 即拒絕成功。void setter 仍相容，但必須 capture post，重新核對同份紀錄、時間來源與逐字原宣告。數值相等不代表原字串恢復，NEL、連續空白與原數字排版均精確比較。成功才清除紀錄，發布同一已核對的 post，不另 capture 混入不同來源。

無動作、錯原值、來源變更、例外、損壞快照或 clear 期間均不能顯示撤回成功。catch 清掉舊成功 notice，嘗試呈現目前狀態後重新拋出原錯誤；不自動回滾、重試或補寫。如果 pending 仍存在就保持；clear 已清除則不復活。canUndo 仍要求原時間來源和實際 adopt-after 原字串；部分寫入或來源變更需人工核對修正後才能重試，保留紀錄不等於當下按鈕可用。明確 false 即使已部分寫回原值，也不能藉回讀冒充接受。

publish 的可選 snapshot 只供內部已核對來源使用，預設仍 capture current。controller、注入 adapter、DOM 呈現與 application／Agent 資料驗證分層保持；無新增 operation、asset、路徑、寫檔、網路、模型、auth 或依賴，22基本／明確啟庫29、Agent1／draft3／template1及領域 schema 不變。

QA注入 writer 拒絕只證明 controller 處理拒絕，不宣稱實際瀏覽器發生原生拒絕。完成分鏡文字包仍需人工創作、影格／連戲和實際音畫接受；不等於影片生成、下載保存、完整視覺、實聽、Host 或平台創始審核。
