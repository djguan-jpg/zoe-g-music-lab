# 音檔完整文字報告（v0.63）

收到音檔報告後，先核對所選File的SHA、完整JSON及接受条件，再從宣告的report data建立預期Markdown；逐字相同才交出成果。錯誤保留原報告、音檔與編修，可重新分析。這補足v62僅檢查Markdown存在、大小及Unicode的邊界；v62章節保留歷史。

| 層 | 責任 |
|---|---|
| musiclab/audio_report.py | 純canonical render／數字文字、無PCM掃描或I/O |
| musiclab/audio.py audio_bundle | 組装原JSON與renderer文字 |
| application／CLI／Agent／MCP／HTTP | 共用bundle，沒有第二套文字producer |
| web/audio-report.js | 同一文字契約的獨立原生JSrenderer，無DOM／File／網路 |
| web/audio-result.js | 所選來源／JSON後比對整份MD，未知或不一致拒絕 |
| audio-review／app | 原PCM／LUFS檢查、current／late保護、presentation與DOM |

數字顯示採binary64乘10^places，絕對值加0.5後floor為整數單位，再以整數商與餘數排版；負值半值離零，負零及捨入零不顯示負號。scale結果不得超過safe integer上限減1。peak／RMS固定3位、DC8位、時長／頭尾安靜段／LUFS／相關性6位；既有JSON量測值不改寫。這些位數只用於穩定文字顯示，不表示增加量測精度。少於400ms／門檻下／未知多聲道位置／響度取樣率不支持的原因沿原量測狀態。null響度門檻或相關性明示不可測；PCM數位靜音的peak/RMS仍顯示-∞（靜音）。

檔名／提醒保留有效Unicode、原空白及換行，作純文字成果；沒有HTML執行。整份MD與report JSON各8MiB／Unicode邊界沿既有guard。MD包括標題、規格、每聲道數值、響度值／區塊／門檻／尾幀、接受條件、提醒、限制、SHA、副本資訊及安靜段；任何字元不同拒絕。JSONkey順序與空白仍可不同但必須嚴格解析後逐值等於data。MD逐字契約不接受自由加筆；若要撰寫額外評論，另存獨立文件。

原audio-statistics／buildLoudness仍負責數值自洽，renderer不取代它們。MD與已核對的data一致不等於從PCM獨立重測、可信analyzer證明、true peak／規範認證、實聽、版權或外部收件接受。錯誤與late依原controller保持資料，沒有新路徑／寫檔／模型／授權權限；Agent1／draft3／13或18 tools與schemas保持。

歷史ZIP保持原文，無靜默轉換。current固定產品0.63.0及explicit supported38–63由原registry管理。見[QA](QA-v0.63.0.md)、[可逆交接](HANDOFF-v0.63.0.md)。
