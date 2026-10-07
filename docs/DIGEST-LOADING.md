# 摘要建構子的延後載入

`musiclab/digests.py` 提供固定的 `sha256` 與 `sha1` 建構入口。只有實際要求計算摘要時，才匯入 Python 標準函式庫的對應建構子，傳入原參數並回傳原物件。工具能力清單與不需要摘要的請求形狀檢查因此不必預先載入摘要 provider。

使用者輸入的原位元組、摘要演算法、`usedforsecurity` 參數及 provider 的拒絕行為保持。回傳物件的 `update`、`copy`、`digest`、`hexdigest` 與大型音檔串流仍由原標準函式庫處理。沒有替代演算法、provider 選擇、自訂緩衝、私有擴充、全域 module 修改或新增依賴。Python 的介面定義見[官方 hashlib 文件](https://docs.python.org/3.10/library/hashlib.html)。

應用層的十八個原使用者只更換匯入入口，原呼叫位置保持；封裝腳本仍直接使用標準函式庫。既有測試可以沿各 module 的 `hashlib.sha256` 欄位注入失敗；這個欄位現在指向共用延後載入入口。

五項集中測試確認：

- 全新 Python 程序明確拒絕匯入 `hashlib`／`_hashlib` 時，仍可取得二十二個 operation 與 protocol1 的工具能力清單。
- 已知 SHA 向量與大型原位元組輸入回傳標準 provider 的相同摘要及原物件型別。
- bytearray／memoryview 的串流與 copy 分支保持相同結果。
- 不合法建構參數沿標準函式庫拋出相同例外型別。
- provider 拒絕時只呼叫一次，傳出原失敗。

啟動量測是特定本機、當次程序的觀察，不保證未來延遲。工具清單逐位元組一致及未載入 provider 可獨立核對；啟動改善不能代替完整產品測試、封裝還原或真實媒體／平台接受。產品與 wire 的既有版本契約保持，這個内部入口沒有 Agent／HTTP 的新 operation 或路徑權限。
