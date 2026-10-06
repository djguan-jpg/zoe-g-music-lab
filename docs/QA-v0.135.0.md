# v0.135.0 比較與交付 QA

660Python／1668JS、143syntax及四Skills；集中新增15Python。比較前後完整raw來源deep equality、canonical source SHA、完整files／data一致，metadata只變與作品改動分開，四台fields／六collections、empty／missing、新增移除、重複句插入原位置與字面Unicode／CRLF／數字拼法通過。10000原句全數計數，前200明細；80鏡含control文字觸發byte cap仍計全部，128byteUTF8prefix不拆emoji。未知／legacy／額外／引用錯誤／invalidUnicode／canonical1MiB拒絕不交部分結果。

真Agent／MCP good-bad-good、相同application完整data／files／meta與MCPtext全部核對；真CLI明確兩檔、0／2／1、單BOM、duplicate／UTF8／讀取容量拒絕、exclusive既有報告保持及overwrite明確替換。短命HTTP200400200全文一致，正常shutdown／context close／deadline join。既有合成保存版本20／21經draft_read核對，再走五adapter，完整report原bytes相同；82JSONhash保持、save／restore未呼叫，所有child EOF0。

actual v134指定source ZIP2538949 bytes／SHA1c0099891ff42694d082a6fa59344091037669c41bd89805cdf99c29a4a32475還原645／1668，暫存移除。388歷史ZIP／manifest bytes與27input-output schemas保持；新draft_compare為唯一新增operation。原五adapterbackup inspection一致、10版export record／draftbytes保持，實際包timestamp不同。產品135／policy38–135，unknown136拒絕；21／28 tools、Agent1／draft3與舊領域契約保持。

QA修復只改fixture與oracle：numeric Agent id、舊discovery count及helper檔名重複；原失敗helper／logs保留，無validator放寬。全套重跑105.563秒通過，owned handles確認EOF後才再執行新script；不因觀察timeout重啟。這輪沒有UI變更／新native操作，不宣稱visual或browser落盤接受；現有完整視覺／screen-reader、media身份／實聽／同步、Host及平台正式founder仍未驗證。公開Release實際assets與exactsource／SHA由manifest及outputs/v135-qa遠端收據核對；沒有GitHub CI配置。
