# ZIP核對失敗回饋

選ZIP失敗後，原因持續顯示在「接續交付ZIP」選檔區。表單與原成果保持；可以修正後直接重選檔，或按「清除核對訊息」。清除只移除失敗與未完成核對，不撤回已載入成果；原「撤回成果匯入」仍依既有scope/result revision規則操作。

| 層 | 責任 |
| --- | --- |
| 原封裝驗證 | 完整CRC／manifest／SHA／producer／canonical核對，不變 |
| controller | scope/latest job失敗、取消與重試；原bundle與media保持 |
| view/status | 隔離nullable failure code/message/truncated；不含原文 |
| DOM | literal local status／clear按鈕／不重寫相同live文字 |
| CSS | 局部error色彩、邊線、換行與窄螢幕長字串換行 |
| Agent/MCP/HTTP | 原錯誤與schemas保持，沒有新錯誤wire或權限 |

failure.message最多240 Unicode codepoints，截斷加單一ellipsis及truncated=true，不拆合法emoji。error callback仍收原error；本地metadata有界不表示全域callback或外部錯誤文字被截斷。status()原完整proposal仍是明確選擇，view()仍只提供小metadata。原文和創作資料不正規化、也不放入failure。

讀取前檔案無效／busy可提示；read/checked/comparison被拒絕後保持failure。新inspect立即清除舊原因，再顯示reading，核對通過仍須明確Apply。cancel清除failure；scope refresh清除舊scope提示；取消或更新選檔後的late成功／失敗不能復活。普通表單編修不清除失敗，讓原因仍可參考。Apply/Undo沿原限定修改路徑。

沒有failed auto retry、補寫內容、自動切台、任意路徑、模型、登入或新的寫權限。role=status與重複文字写入測試完成；完整視覺／真人assistive technology／正式作品仍未驗收。
