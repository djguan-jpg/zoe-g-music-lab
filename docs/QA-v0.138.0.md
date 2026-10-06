# v0.138.0 QA

| 檢查 | 結果與證據 |
|---|---|
| 重現與修正 | 原成功／錯誤A晚到均使已完成B不可讀；新9JS測試核對新版pending／completed、cancel／clear／invalidate、多代順序及完整JSON／Markdown保持。 |
| 完整測試 | 664Python、1708JS、147語法、四Skills、diff檢查；集中4Python＋40JS。 |
| 頁面身分／空白／overlay | 本機127.0.0.1:8875工作台、v138與實際comparison操作可見；不是空shell，無框架error overlay。 |
| Console | warn/error 0。 |
| 原生互動 | draft3檔預覽→比較→JSON已送出→重新比較清提示→取消；保存版本預覽→比較→Markdown已送出→重新比較清提示→三尺寸鍵盤→取消。 |
| 完整保留 | 12落檔快照全部21欄／六集合／stable IDs精確；四個成果全文前後相同，82合成庫JSONhash相同。沒有Apply／保存／restore。 |
| 響應式 | 1280×720、390×844、1280×360以ShiftTab／Tab聚焦JSON→Markdown、Enter重新比較；buttons在viewport，頁面無水平溢出，三JPEG有bytes／SHA。未宣稱完整視覺或screen reader接受。 |
| 還原與相容 | 實際v137指定ZIP2634288 bytes、SHA d25b4cf38f17e3b8b4098c190de142916fa955b57eaef9f29b2721d6f13aa1fc還原664／1699，暫存移除；400歷史ZIP／manifest逐bytes一致，28schemas及21／28工具保持。 |
| Agent／資料 | application／CLI／Agent／MCP／HTTP完整比較與備份inspection一致、good/bad/good；10版匯出record／draft原bytes保持，匯出時刻依實際建立不同。 |

最初兩次瀏覽器觀察tool call逾時；確認原serverhandle仍live後只reset觀察器，重綁同一tab，UI已顯示保存版本預覽完成，因此沒有重送。reset前host-only快照沒有落檔，未當作全份驗收資料；恢復後重新建立合成成果、12份新快照逐份落檔。没有新增server或tab。1自有tab關閉／viewport reset，1自有server正常shutdown／context close／deadline join及原handleEOF0。

競態的先後順序由注入deferred的純controller測試證明；原生UI核對實際一般流程與提示清理，沒有修改瀏覽器私有state或偽造網路／Crypto時序。報告「已送出」可見，瀏覽器保存檔仍未取得核對；不重試已拒絕的Chrome內部頁、不掃描未知下載位置。來源原值／全文JSONMD跨語言bytes測試仍保持。

剩餘未驗證：瀏覽器落盤檔、完整視覺／screen reader、真媒體File切換與實聽／音畫同步、Host安裝、平台正式founder。GitHub CI未配置；本輪不修改四份平台投稿／法律收據。原始碼與封裝／遠端asset驗證可證明本次程式與交付，不能替代創作、權利或平台身份接受。三截圖留在ignored本工作區outputs，不嵌入對話。
