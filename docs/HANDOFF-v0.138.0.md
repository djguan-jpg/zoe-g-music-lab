# v0.138.0 交接與可逆

restore-v0.137.0-before-v0.138.0 固定 ecf234f55129b81f8bd76fc919055e9c6c4c82ca；分支 codex/iteration-v0.138.0。還原時從此tag另建codex/restore-*，經PR核對合併；不rewrite公開tag，不覆寫草稿／媒體、不撤銷投稿。

## v0.138.0 比較取消與重試隔離

修正取消／清除／失效後舊比較回覆使新報告過期的可重現錯誤。無論舊成功或錯誤在新版等待中或完成後抵達，只要已不擁有目前job，就不讀來源、不改狀態、不呼叫完成／錯誤callback。完成報告仍按原stamp與完整來源核對，不依賴已清空的job。現代草稿檔與保存版本的新比較成功後清除上一份下載提示與error樣式；refresh保留同份提示，明確clear也清除。

純controller把job ownership與report current分開 → literal DOM提示生命週期 → 原完整producer／shared downloader分層。664Python／1708JS（新增9）、147語法及四Skills通過；集中4Python＋40JS。測試包含cancel／clear／invalidate、兩種晚回覆與兩種新版狀態、多代不同順序、無額外capture／gate／publish及兩個DOM入口。原完整來源、gate／File身份、失敗重試、busy／dispose與明確Apply／undo保持。

12份落檔原生快照逐一核對全21欄、六集合與stable IDs，兩個入口重新比較後下載提示清空，四份成果全文與82合成庫JSONhash保持。1280×720／390×844／1280×360實際Tab可達JSON→Markdown、Enter重新比較，沒有頁面水平溢出。兩次observer逾時後只重設觀察器並重綁同頁；原server／頁面未重啟，預覽已完成就不重送。舊觀察器未落檔的host資料不當作完整快照證據，重做並逐份落檔。1自有頁關閉／viewport reset，1自有server正常shutdown／deadline join及原handle EOF。

指定v137 ZIP實際還原664／1699且暫存移除；400歷史ZIP／manifest原bytes、28組input-output schemas及21基本／啟庫28工具保持。五adapter比較、備份inspection及10版匯出原record／draft bytes核對。產品138／唯一交付來源38–138共101版，未知139拒絕；Agent1／draft3／backup1及comparison1保持。沒有新增asset、backend operation、依賴、模型或路徑／網路／写檔權限。

還原tag、codex分支、指定source封裝／SHA、CHANGELOG／HANDOFF、PR merge及實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持，本輪不修改或重送平台投稿。只盤點本outputs及typed同host jobs，最新三版保護；strict>7days且exact tag／現場Git archive可重建才可列清除候選。草稿／媒體、未知／failed QA、v77 alternate及partial36／53保留。瀏覽器保存檔、完整視覺／screen reader、實聽／同步、Host安裝與平台正式founder仍未驗證，rolling goal active。

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


指定source commit／tree、ZIP／SHA、PR與實際remote兩assets見manifest及outputs/v138-qa/source-evidence.json、release-remote-evidence.json、goal-turn.json。本輪所有managed run依PID／creation identity及原handleEOF核對，不能只信狀態檔；每輪最新三版保護與strict>7days exact tag／archive可重建政策保持。下載保存檔只讀使用者明確提供的本輪測試檔，未取得路徑維持未驗證。後續继续盤點其他可重現缺口，rolling goal仍active。
