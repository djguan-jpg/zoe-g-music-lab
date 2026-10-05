# 清單處理中控制契約

共用 run 建立報告或工作包時，state.busy 為 true。六清單的新增、指定刪除控制，以及歌曲／分鏡／歌詞的刪除還原選單與按鈕，暫時 disabled。共用 run 成功、失敗或來源過期後，在既有 finally 恢復控制。這個範圍是共用 run；其他獨立選檔預覽沿各自 latest/current 契約。

| 清單 | 新增 | 指定刪除選取 |
| --- | --- | --- |
| arrangement | section-add | data-remove-section |
| music-avoid | avoid-add | 清單內 button |
| music-deliverables | deliverable-add | 清單內 button |
| motifs | motif-add | data-remove-motif |
| shots | shot-add | data-remove-shot |
| cues | cue-add | data-delete-cue |

collections 的固定 add/remove metadata 是共用 DOM adapter 的唯一映射；不接受外部 selector、路徑或 payload。refreshCollectionControls 只寫 disabled 及既有還原按鈕文字，不讀欄位內容、產生 ID、寫入列、重建選单、markDirty、focus 或操作媒體。歌詞的定位句首與標記控制不在刪除 selector 內，各自能力規則保持。

新增段落／鏡頭原有 busy guard 保持；避免事項／交付項目／母題／歌詞句補上相同 guard，在讀來源或產生 ID 之前返回提示。實際 handler guard 与 disabled 控制共同使用；直接呼叫 handler 也不能在 busy 時變更清單。共用刪除與還原原有 guard 保持。容量、原時間、預設新列、stable ID、母題保留 ID、限定歷史與焦點規則仍由既有純 History／Editor 與 adapter 負責。

refreshDeletionButton 与 refreshDeletionHistory 的可用性也核對 busy；共用控制刷新不呼叫 refreshDeletionHistory，因此不把使用者選定的較早紀錄改成最近一筆。只有既有明確新增／刪除／還原歷史動作才沿原流程更新選單。busy 结束後，有紀錄才可還原，沒有紀錄仍 disabled；讀取過程不消耗歷史。

原欄位不是整張表單鎖定。使用者仍能編修文字／時間，revision/current 使舊成功或錯誤不能取代後續資料；上一份成果保持，dirty 下載停用。這個控制不聲稱自動保存、取消請求或資料交易；控制恢復也不代表報告、創作、音畫或權利接受。

沒有新增 asset、timer、route、operation、schema、依賴、模型、路徑或網路權限。application／HTTP／CLI／Agent／MCP／純 domain 与 History 保持。基本15／啟庫22、Agent1／draft3，產品0.88.0、明確來源38–88共51項、未知89拒絕。v87刪除契約的純模組名稱補正為 web/deletion-history.js；行為不變。
