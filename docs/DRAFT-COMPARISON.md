# 完整草稿原值比較

draft_compare接受精確baseline／current兩份完整schema3；缺欄、額外欄、未知schema或母題引用損壞拒絕，未完成的創作字串依既有draft3形狀仍可比较。比較來源先共用draft_contract.draft_bytes完整驗證及canonical1MiB限制，再strict JSON／Unicode檢查並隔離資料；不修剪、正規化、去重或轉換數字。tool_version作為既有草稿文字metadata，不推定對應產品版本或搬移schema。輸入、原檔及保存版本保持；純層不讀路徑或DOM。

原music／storyboard／lyrics／audio fields按contract宣告順序；sections／shots／cues按原1起位置，avoid／deliverables按原位置比較value，motifs按原位置比較id／name／meaning。追加／移除列明確區分missing null與empty string view；空列仍是新增列。插入／移除／換序可能導致後續多列changed；報告不猜moves、不建立stable ID或引用修補。metadata tool_version／saved_at／tab另列，creative_changed只來自四panels；status identical要求完整原值一致。change_count按變更scalar或集合列計一次，而不是該列每個變更欄位計一次；各collection提供完整baseline／current總列與changed／added／removed計數。

source含兩份完整draft3 canonical UTF8 bytes長度与SHA（sort_keys／indent2／末尾LF）；它核對語義來源而不是原檔排版、BOM或key序，更不證明作者／權利。details依metadata→四台fields／collections的固定順序，最多前200筆；每筆包含全數變更欄位，各before／after view提供完整原欄位UTF8長度／SHA與最多128bytes合法字元前綴。失去的欄位為null，空字串則bytes0、空excerpt及其SHA；摘錄不代表完整文字。JSON欄位literal原值，呼叫者需以文字呈現，不能執行摘錄。

明細序列化及外層縮排計入128KiB預算；下一整列不適合時停止收明細，仍扫描其餘所有來源以保留完整計數，details_truncated明示。JSON＋固定Markdown總上限256KiB；Markdown只列固定位置／欄名與summary，不內插原文HTML或Markdown，原文摘錄在JSON。兩份輸入各限1MiB canonical；Agent／MCP／HTTP request仍2MiB包含封套，因此接近上限的兩份外部JSON可能先觸發傳輸上限。CLI每原檔只讀1MiB＋單次BOM上限＋1byte偵測，strict UTF8、duplicate keys與64層decoder；canonical仍1MiB。不把剪短來源冒充完整比較。

共用application.build('draft_compare',payload)回files draft-comparison.json／md、完整data与當前meta，needs_review始終true：有差異或零差異都不等於創作完成、媒體同步或接受。Agent protocol1／draft3、library寫入與既有27schemas不變；新增comparison1、21基本／28明確啟庫工具，MCP annotations readonly、idempotent、closed world，需重新discovery。JSON不能指定source／output路徑。

HTTP POST /api/draft-compare沿Workbench原strict request與loopback／Origin限制，不需草稿庫、不寫保存版本；原端點保持。工作台載入／預覽、dirty與草稿保存流程未改，現版没有在UI自動或手動呼叫此比較操作。CLI命令只讀兩個明確路徑並寫指定報告；--overwrite只授權替換指定輸出報告。多檔I/O仍可能部分輸出，不宣稱原子交易或刪除外部同名檔。

```powershell
python music_lab.py draft-compare --baseline examples/draft-comparison-baseline.json --current examples/draft-comparison-current.json --out outputs/my-comparison
```

範例均為原創合成未完成草稿；command返回2表示找到差異且已完成比較，0表示相同，1表示輸入／I/O錯誤。原字串8→08.0也算差異。Agent request格式為protocol_version1、字串id、operation draft_compare及payload.baseline／current完整draft；可先由明確草稿庫draft_read取得兩份已核對草稿，再比較，不需要修改、restore或save。原文與媒體不進report完整值，只有有界摘錄及雜湊；本工具没有模型／網路／素材生成或平台認證功能。
