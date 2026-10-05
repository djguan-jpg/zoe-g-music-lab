# 接受條件草稿（v0.37）

交付檢查新增「使用自訂接受值」，取樣率使用 Hz，位元深度使用 bit，聲道數使用正整數。每欄以英文或中文逗號分隔，最多 64 個值、1024 個字元。全形數字、十進位小數與指數可用，但數值必須是精確正整數且不超過 9007199254740991；不捨入小數、不猜單位。示範條件仍可使用，實際要求由收件方決定。

「下載接受條件草稿」保留未完成原文，選檔先預覽，再明確套用或取消。未知版本、額外欄位、損壞編碼或重複 JSON 欄位拒絕。預覽後改條件或換音檔須重新選檔；其他工作台編修不妨礙限定套用。套用保留原音檔及其他工作台。

草稿是獨立 `zoe-audio-acceptance-draft` schema1：

```json
{
  "format": "zoe-audio-acceptance-draft",
  "schema_version": 1,
  "profile": "video",
  "custom": true,
  "fields": {"rates": "48000", "bits": "16, 24", "channels": "1, 2"}
}
```

`custom: false` 使用 profile 的示範值，仍保留 fields 原文。`custom: true` 必須補齊三欄才可分析；未完成值可先下載，不表示格式已通過。檔案最多 64 KiB，嚴格 UTF-8／JSON／64 層；不含音檔或任何檔案選擇權限。

專案草稿 schema3 只保留原有 profile。自訂值須另存上述條件 JSON；載入／撤回整份專案會回到其示範條件，本頁自訂原值保持，可再明確啟用。兩份另存狀態分開核對：下載送出後須核對檔案並按確認，後來編修仍未另存。離頁提醒受瀏覽器互動與生命週期限制，不能取代主動保存；沒有自動保存。

## 四個入口

```powershell
python music_lab.py audio --input selected.wav --acceptance-draft audio-acceptance-draft.json --out outputs/audio-new
```

CLI 只讀明確選定的條件檔及音檔，不覆寫輸出。條件檔不能與 `--profile`、`--rates`、`--bits`、`--channels` 混用。原直接整數清單入口保持，不增加 CLI 音檔大小限制。退出碼 0 為沒有技術提醒，2 為已建立且有提醒，1 為拒絕輸入。

JSON-lines 的 `audio` payload 使用 `{"acceptance_draft": 上述物件}`；MCP 的 `audio_report` arguments 使用 `{"payload": {"acceptance_draft": 上述物件}}`。音檔仍須以啟動參數 `--audio selected.wav` 選定，不能藉 JSON 指定路徑。CLI／HTTP／Agent／MCP 共用 application；discovery 提供新草稿契約，基本10／明確啟庫15工具及 Agent1／MCP版本保持。

HTTP 保留 `/api/audio` 原生 WAV body，query 的 `acceptance_draft` 為 URL 編碼 JSON；與 `profile` 互斥，query 重複／未知欄位拒絕。每欄1024字元也限制 URL 編碼後的請求長度。僅固定兩個新 JS asset，沒有新操作或網路／登入權限。

使用條件草稿時，除了 report.json／report.md，另交回原 `audio-acceptance-draft.json`，report.data 的 `acceptance_draft` 保留同一原文；acceptance 清單是本次實際使用值。原 profile／直接清單分析仍輸出兩檔。分析不轉檔、裁切或調整聲音。

## 分層與回覆核對

`musiclab/audio_acceptance.py` 提供 shape、decode、prepare 與既有直接清單 normalize；audio 只用有效條件量測。application 處理互斥、來源回交及 bundle，adapter 負責明確檔案／傳輸。Python 精確 Decimal 判定整數；JS 先共用有限十進位文法，再核對係數小數位與指數，拒絕浮點捨入造成的假整數。

`web/audio-acceptance.js` 提供純原值模型及注入 capture／read／replace／events controller；DOM adapter 只做控制／文字與表單下載。preview token、原條件 fingerprint、原生音檔身份及 busy 於讀取後和套用前重查。保存 checkpoint 使用隔離 click-time 原值，未知／送出下載不冒充另存。

`audio-review.inspect` 先驗證有效條件，再上傳；收到回覆先查 revision、File 身份、profile 與完整原條件，後核對實際 acceptance、來源草稿、report.json／data 與顯示檔名，最後才提交成果。晚回應與未知或不符來源保留上一份成果和後續編修。改條件標為上一份且停下載。這些暫態與媒體不進 draft3 或 Agent wire。

接受值只比較格式；不代表音樂品質、素材授權、平台通用標準或實聽通過。響度 LUFS 與 RMS 仍分開，沒有 true peak、正規化或模型呼叫。


## v0.61 音檔報告数值核對

`audio-statistics.js`是無I/O、無UI的整數PCM bounds validator；`audio-review`在組成presentation／onResult之前呼叫。固定HTTP asset／index dependency提供同一模組；CLI、Agent、MCP、HTTP依原共用Python application產生報告，跨語言實際producer matrix確認可讀。影格／時長／bytes、peak/RMS/null/DC/full-scale、安靜邊界与mono/multichannel correlation互相核對；只驗證報告自洽，不重算PCM／響度、不證明實聽、授權或SHA對所選瀏覽器File的獨立核對。原report schema、loudness1／acceptance-draft1、Agent1／project draft3保持。見[數值契約](AUDIO-STATISTICS.md)。


## v0.62 音檔回覆與所選File來源

`audio-file` native File.arrayBuffer/WebCrypto SHA-256 → `audio-result`純exact envelope/current product/protocol/raw JSON/file-set/source-echo核對 → `audio-review`既有PCM/loudness presentation/inspect → app DOM。兩async邊界重新核對原File identity/revision/profile/rawdraft，過期hash/error不upload/回寫；只保留64字元digest，read buffer不持久快取，64MiB既有選檔上限保持。preset與draft都走完整來源guard；live response須與固定頁面current product相同，legacy buildReview label保持另行使用。report.md只核對非空有界有效Unicode文字，不宣稱語義重算。見[AUDIO-RESULT](AUDIO-RESULT.md)。
