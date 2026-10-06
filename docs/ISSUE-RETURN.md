# 回到目前待辦

先檢查選定段落、鏡頭或歌詞，使用清單／下一項成功定位原欄位。手動查看另一欄位或歌詞另一頁後，可按「回到目前待辦」，以滑鼠或原生Enter直接返回同一項；不前進待辦序號。若只剩一項，上一項／下一項均停用，返回仍可用。

## 純controller

`web/issue-cursor.js`沿原 capture exact DTO與maxDetails核對，只新增view.canReturn及returnCurrent。canReturn須原報告可用且index非null；returnCurrent先read重查，再呼叫原locate(index,revision)。沒有第一項猜測、重設／前進index或另外保存原文。locate前後均檢查revision／detailCount與availability，onLocate必須嚴格true才提交最後成功位置。false／throw不把cursor改成新位置，可重試。可用性暫停不丟原位置；revision／count改變清除index。

## 原生DOM與application

三個既有adapter讀同一view，更新return按鈕disabled並以attempt(cursor.returnCurrent)綁定onclick。呼叫時仍重查source、stable row IDs、選列、busy、可見狀態，舊handler不能繞过當前guard。三個原生button都是type=button，Enter由瀏覽器處理，沒有額外鍵盤攔截。成功重用原focus與工具列幾何；歌詞沿原pager.reveal顯示保留的global index所在頁，最多200明細而非全部計數。原位置說明與issue-summary保持。沒有修改app.js、CSS、HTTP路由或application領域產出。

## 保存、版本與界線

cursor／canReturn／頁面／焦點不進draft3、Agent wire或成果。來源失效、busy、隱藏、無選列、零待辦、未定位均停返回；精確來源復原可恢復最後成功cursor，新report revision不能借用舊位置。只做欄位定位，不更改歌詞、時間、播放位置、其他工作台或素材。20基本／明確啟庫27工具與原27組schemas、Agent1及原領域schemas保持。產品122／交付唯一policy38–122共85，未知123拒絕。已公開Repo與四個平台自行聲明介紹頁保持；取得創始身分仍需平台核實。

驗證見[QA](QA-v0.122.0.md)，可逆與未驗證事項見[交接](HANDOFF-v0.122.0.md)。
