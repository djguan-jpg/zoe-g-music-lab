# ZIP 原文與差異審閱（v0.40）

v0.41可保存來源ZIP SHA及完整差異JSON／Markdown，CLI／Agent明確report選項，來源工具支援38／39／40／41。見[目前報告契約](DELIVERY-REPORT.md)；以下保留v0.40初版比較說明。

選取文字交付ZIP後，「先看原文與差異」會列出目前保留成果與選定ZIP的新增、變更、移除、相同檔案。先看變更檔，沒有變更時看新增，再看移除；選擇其他檔案可查看兩份原文字。這能在載入前發現舊成果會被替換或移除。按「載入這份ZIP成果」才取代本工作台全部成果；比較不合併、不補寫或修改表單。

檔名與UTF-8位元組精確比較，不修剪空白或統一換行。改名／大小寫不同列為移除及新增；空白檔案與不存在分開。文字框會統一顯示換行，因此另顯示原文CRLF／LF／CR計數，避免相同畫面被誤認為相同原檔。HTML只顯示字面文字，不執行。比較的是目前保留成果；表單編修後請重建再比較。

每個文字框最多預覽32768個UTF-16單位，切點保留完整surrogate pair；長檔案明示只顯示開頭。載入、逐檔下載及ZIP仍保留全文，不把預覽片段當交付檔案。讀取中取消、後續編修、換台、媒體與新成果保護沿用v39；慢的舊比較也不能替換較新選檔的摘要。撤回只還原原成果，後續表單／音檔保持。

排版依實際成果面板寬度：不足640px上下對照，至少640px才左右並排。寬桌面側欄維持上下顯示，避免兩個135px文字框；較寬的完整成果面板可以並排。預覽控制與來源皆可用鍵盤操作，預覽選項不進草稿或下載成果。

## CLI／Agent／MCP

```powershell
python music_lab.py delivery-package --input examples/delivery-request.json --out outputs/my-delivery
python music_lab.py delivery-inspect --input outputs/my-delivery/zoe-delivery.zip --compare-input examples/delivery-baseline.json --out outputs/comparison
python music_lab_agent.py --delivery-zip outputs/my-delivery/zoe-delivery.zip
```

`--compare-input` 是明確指定的基準JSON，只含 `{ "scope": "music", "files": { "task.md": "舊原文" } }`；空files表示沒有原成果。CLI只寫delivery-inspection.json，內含comparison摘要，預設拒覆寫；原基準與ZIP保持。--overwrite才替換指定報告。沒有解壓或自動載入。

JSON-lines operation／MCP tool仍為 `delivery_inspect`，在payload加入baseline：

```json
{"protocol_version":1,"id":"comparison","operation":"delivery_inspect","payload":{"baseline":{"scope":"music","files":{"task.md":"舊原文"}}}}
```

ZIP仍由啟動時--delivery-zip明確選定，JSON不能指定路徑；MCP使用相同payload包在arguments.payload。預設files={}，data.comparison包含每檔狀態、兩側bytes／SHA與計數；include_files=true才回傳不超512KiB的序列化原文字集合。未提供baseline時既有inspection回覆形狀保持，沒有comparison欄位。基本12／啟庫17工具，不增權限／模型／網路／依賴，needs_review=true。

## 契約與分層

比較schema1為 `zoe-delivery-comparison`，與inspection1／package1／Agent1／draft3分開。基準最多64檔／8MiB，沿既有可攜檔名、Unicode與JSON界限；兩份聯集最多128檔，全數呈現。相同scope才比較，未知欄位／版本拒絕；標準ZIP明確支援工具38／39／40，沒有靜默遷移。差異不是作者、權利或媒體品質驗證。

純 `musiclab/delivery_review.py` 重用delivery來源驗證、精確文字比較與逐檔SHA；application接已驗證ZIP及明確baseline，供CLI／JSON-lines／MCP。HTTP二進位inspection沿既有application核對；browser `delivery-review.js` 本機比較既有bundle與已核對incoming，Python／JS共用契約以跨語言fixture驗證。controller在非同步比較前後核對scope／revision／result epoch／media／最新token，採用局部候選後才發布摘要。DOM只顯示文字、換行計數與有界摘錄；不修改原wire／files。

見[QA](QA-v0.40.0.md)與[交接](HANDOFF-v0.40.0.md)。正式媒體、完整視覺審查、特定Agent Host及FreeTWAI平台創始人仍待驗證。
