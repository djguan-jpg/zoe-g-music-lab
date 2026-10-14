# 實用性與成熟工具的分工

公開文件、Issue、PR 與發佈說明只使用通用產品情境及本專案自有合成資料。私人測試權限不代表公開權限；不得公開個人作法、工具偏好、素材、原文、來源資訊或私人測試過程與指標。


## 目前的取捨

| 任務 | 已有成熟能力 | 本專案的決定 |
| --- | --- | --- |
| 自動字幕、歌詞影片與文字動畫 | [CapCut 自動字幕](https://www.capcut.com/help/how-to-recognise-subtitles)、[歌詞影片流程](https://www.capcut.com/resource/ai-lyric-video-maker) | 不再把均分時間、人工校時或圖片影片當主要產品；一般介面隱藏編輯區。 |
| 剪輯與自動字幕 | [Kdenlive Speech to Text](https://docs.kdenlive.org/en/effects_and_filters/speech_to_text.html) 支援 Whisper／Vosk，需安裝與設定模型 | 接收完成校時的標準字幕；不新增剪輯引擎或模型。 |
| 聲音處理與分析 | [Audacity Normalize](https://www.audacityteam.org/manual/effects/volume-and-compression/normalize/)、[分析工具](https://manual.audacityteam.org/man/analyze_menu.html) | 保留原檔的規格與量測報告；需要修音時回原工具處理。 |

以上以官方文件為功能證據，不代表本輪實際安裝或測試這些軟體，也不代表所有版本、地區、語言、音樂辨識或費用條件相同。沒有宣稱本專案的交接功能獨有。

## 一般介面只保留三條流程

1. **字幕交付**：先填已知總長（可留白），匯入 SRT／LRC／本工具歌詞 JSON，預覽後套用，核對時間並建立標準字幕、文字 JSON 與格式報告。改總長後需重匯入，不會自動改句尾；有問題時在原工具修正後重匯入。
2. **音檔核對**：選擇 PCM WAV 與示範收件條件，讀取規格、音量與削波風險，下載報告。不能修音或轉檔；尚未量測 true peak。
3. **素材交接**：從目前字幕與選定原音檔新建素材專案，或開啟本工具 `.zoemv.json`，核對原音檔、圖片與文字，再保存或下載 Agent 純文字企劃。不是 CapCut、Kdenlive 或 DAW 原生專案匯入器；Agent 修訂仍需要文件中的明確本機指令。

舊編輯元件與契約保留在隱藏容器，沒有一般介面的重新啟用按鈕。載入舊專案或切換流程不能讓編輯區重新出現。頁面不再自動填入示範企劃。

## 後續功能的實用性門檻

新增工作先寫清楚「通用使用情境、公開或合成輸入、既有工具的限制與預期輸出」，再比較成熟工具的現有做法。沒有具體工作與輸出，就先做研究或小型驗證，不建立另一套通用編輯器。
