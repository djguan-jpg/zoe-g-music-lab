# 目前待辦原因與位置

歌曲段落、分鏡單鏡與歌詞單句的逐項工具列保留待辦序號，另顯示原位置、欄位、原因及關聯列。此說明為最後成功定位的診斷；手動編修另一欄不把cursor假造為新待辦。修正來源後隱藏，重新檢查或精確復原後才可繼續。

## 純格式與controller

`web/issue-summary.js`只公開format／present。format exact DTO為location／field／message／relation，位置與欄位1–64 UTF16 units、原因1–1024、relation null或1–64；沿shared嚴格JSON同值檢查拒絕getter、hidden／symbol keys、未知欄位、invalid Unicode。字面保留空白與Unicode，不正規化或產生HTML。統一字串為「位置 · 欄位：原因（關聯列）」；relation為null不加括號。

present exact DTO為current bool、index null或0–199、detail；未current或未定位必須detail=null，回空字串。當前成功位置回「 目前定位：」加同一format；無來源／report快取、DOM／網路／timer。此200只是歌詞既有明細上限，單鏡／單段仍用原cursor容量；format不改domain issue message。

三個DOM adapter從已核對report映射fixed labels，再與原cursor progress相接。report存在、非stale、revision等於cursor revision、visible、非busy、有selected row與已定位才送current detail；清單沿同format建立textContent。清單與工具列不是兩份自行推導的診斷。未定位、新revision、無report、零待辦、hidden／busy／missing selection清空說明；false／throw focus保持上一個成功cursor與說明。精確來源復原可恢復舊診斷，controller原source／IDs／selected ID核對保持。

單鏡capture visible另外核對shots-order非空，清單blocked同規則，補齊其原重查按鈕已具有的gate。歌詞全200保留detail的cross-page進度與全部issue_count保持；清單render頁面與cursor進度不同，不能以頁內index冒充原global index。

## DOM與幾何

各adapter增加optional onReveal；textContent更新後再通知app。layout error經onError，不能把已成功focus當成失敗再倒退cursor或改source。app.revealActiveIssue先核對target connected／enabled且document.activeElement就是target，再量toolbar與欄位rect，沿shared editor-field-position計算instant scrollOffset。畫面外toolbar不作覆蓋；沒有重新focus、寫表單或seek音檔。返回tab或精確恢復时若活動控制不同，只恢復說明，不移動另一控制。

原toolbar live status與wrap保持，height≤400px回static。單鏡readiness長button修正僅scope #shot-review-issues button，max-width100%、white-space normal、overflow-wrap anywhere與left text；其他按鈕與資料不變。實際390px問題從421px頁寬降至375px，其他native結果見QA。

## 入口與版本

只增加固定GET `/issue-summary.js` allowlist，index在三adapter前載入；不新增POST、operation、domain、依賴、模型、auth、media、JSON路徑或寫檔權限。application／CLI／HTTP／Agent-MCP既有domain回覆保持，UI暫態說明不進draft3、report files或Agent wire。產品121、交付policy38–121共84，未知122拒絕；20基本／27明確啟庫、旧27組schemas與Agent1保持。

零待辦不代表完整創作、時間、影格、實聽、权利或平台創始接受。前後關係說明是診斷引用，不提供媒體內容。來源檢查與原生File身份保護沿既有controller，PolyForm Noncommercial1.0.0與private保持。

見[本輪QA](QA-v0.121.0.md)、[交接](HANDOFF-v0.121.0.md)與[既有單句導覽](LYRICS-CUE-NAVIGATION.md)。
