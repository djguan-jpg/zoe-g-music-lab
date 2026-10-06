# v0.137.0 交接與可逆

restore-v0.136.0-before-v0.137.0固定 dea1526d73ac6921feb931d4517cf92c836e3f8e；分支 codex/iteration-v0.137.0。可從restore tag另建codex/restore-*與PR核對還原，不rewrite公開tags，不覆寫草稿／媒體或撤销平台投稿。

## v0.137.0 下載目前草稿比較報告

現代草稿檔與保存版本的比較預覽新增「下載比較 JSON」與「下載摘要 Markdown」。下載目前完整的有界報告，不因畫面篩選或每頁10筆而截斷；JSON含原值摘錄、完整欄位SHA與全部計數，Markdown含位置與計數。下載不另存工作台草稿；「已送出」仍須核對瀏覽器實際保存檔案。

draft-compare-download 純固定格式選取 → injected controller.read 完整來源／gate重查 → 既有 text-download 原生UTF8 bytes sender → DOM字面提示分層。只取本controller擁有且由既有producer建立的報告，不是外部任意report importer或完整語義驗證器；strict Unicode／exact envelope／JSON＋Markdown256KiB保持。編修、頁籤、原生File身份、busy或預覽改變拒絕舊下載；原明確Apply／undo、shared兩pending與1秒URL回收保持。pagehide清除全部自有listener，後續dispose無害。

664 Python／1699 JS（新增10）、147語法及四Skills通過；集中4Python＋31JS核對整份JSON／Markdown的Python-JS逐UTF8 bytes一致、全部計數、容量、來源拒絕、傳送失敗重試與listener回收。17原生快照均全21欄與六集合，比較／篩選／下載保持stable IDs和四份成果全文；後續編修僅改title，取消保留。1280×720／390×844／1280×360實際Tab鍵可達兩下載鈕且頁面無水平溢出。前兩尺寸Enter成功送出，第三次快速下載受shared兩pending限制；之後明確重比仍可送出。這輪未重做Apply或真媒體切換，既有契約測試保持。

實際v136 ZIP還原664／1689且暫存移除；396歷史交付ZIP／manifest原bytes、28組input-output schemas與21／28工具保持。五adapter比較／備份inspection及10版原record／draft匯出核對，82合成庫JSONhash保持。產品137／唯一交付來源38–137共100版，未知138拒絕；Agent1／draft3／backup1保持。只新增一個固定JS asset，無新backend operation、模型、依賴或路徑／網路／寫檔權限。

兩個workbench頁及一個空白診斷頁已關閉、viewport reset，一個自有server原handle正常EOF。瀏覽器已送出狀態可見，但IAB與Chrome下載事件未取得落盤檔；自動審核拒絕開啟Chrome下載紀錄頁，理由是工具只允許HTTP／HTTPS網址，沒有繞過或掃描未知下載位置。实际保存檔仍未驗證；完整視覺／screen reader、實聽音畫同步、Host安裝與正式founder仍未驗證。

restore tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA、PR與實際remote assets提供可逆交付。PolyForm Noncommercial1.0.0、ZOE. G／djguan-jpg、public與四份submitted_unverified保持。本輪恢復既有自由工坊會員登入並唯讀核對四個公開投稿仍含禁止商用與作者未核實，沒有重送申請。只盤點本outputs及typed same-host jobs，最新三版保護，strict>7days且exact tag／Git archive可重建才列候選；草稿／媒體／failed QA／v77 alternate及partial36／53保持。rolling goal保持active。

# v0.137.0 比較報告下載 QA

完整664Python／1699JS、147語法、四Skills與diff檢查通過；新增10JS，Python4個既有跨語言案例擴充為兩格式整份UTF8 bytes相同。集中4Python＋31JS。完整計數250與所有producer有限明細獨立畫面分頁；128KiB整列預算導致此合成案例130筆，不假稱必有200筆。未知envelope／schema／Unicode／getter／容量、未觀察到的source／gate／File改變、失敗重試、cancel／clear／pagehide／dispose均核對。新DOM操作沿shared原生UTF8 sender，沒有放寬domain驗證。

17原生快照均含全21欄與六集合及stable identities。file報告28作品／1metadata，library35／2，切MV後重比metadata3；篩選與下載均保留原欄／IDs。只有明確title編修改一欄，舊下載停用，取消保留後續編修。四份完整歌曲成果before／after file／after library逐值相同；切MV頁空成果區不表示清除歌曲成果，返回music完整四檔保持。82合成庫JSON SHA保持，沒有保存或恢复操作。本輪沒有Apply，原Apply／undo沿既有完整測試。

1280×720、390×844、1280×360實際ShiftTab／Tab焦點依次JSON→Markdown，按Enter前兩尺寸送出。第三次快速送出被原兩pending上限拒絕；稍後library重比後Markdown Enter已送出。三尺寸無頁面水平溢出、button bounds在viewport；幾何／鍵盤不等於完整視覺或screen reader接受。三張JPEG保存ignored outputs，magic／bytes／SHA核對。console warn/error0，兩workbench頁與一個空白诊斷頁關閉，viewport reset。一个自有loopback server正常shutdown／context close／deadline join，原handle actual EOF0。

IAB waitForEvent下載逾時造成observer reset，頁面與server未重送；Chrome5秒下載事件也逾時，UI仍顯示已送出。自動審核拒絕Chrome下載紀錄頁，理由只允許HTTP／HTTPS協定；未繞過、未讀未知Downloads位置。已詢問可選的實際測試檔完整路徑，尚未取得；因此瀏覽器落盤檔未驗證。產品onSent沒有宣稱已保存，兩檔producer內容已逐UTF8 bytes測試。失敗harness／舊版本oracle logs保留，修正計數與訊息預期後測試通過，不放寬產品validator。

實際v136 ZIP2609959 bytes／SHA69d10bb623366e9da8f86221a32af0fe94b882e316432ddb1c6dd76deb5fdd57還原664／1689，暫存移除。4scope×99歷史版本=396ZIP／manifest bytes精確，28schemas保持。比较／canonical backup inspection与10版export五adapter完整回复與原record／draft bytes核對；匯出時間各自不同，原82JSON SHA保持。唯一版本來源38–137共100版、unknown138拒絕；21／28工具無變。實際source封裝與remote兩assets bytes見manifest及本輪receipt。

恢復FreeTWAI既有會員登入，GitHub @djguan-jpg已連結；四個公開投稿逐一仍含禁止商用及尚未核實作者身分，未重送或更改投稿。此工作區四個新作品沿PolyForm Noncommercial1.0.0、署名ZOE. G與submitted_unverified。仍未驗證瀏覽器实际保存、完整視覺／screen reader、真媒體File切換與實聽同步、Host安裝、平台正式founder；GitHub CI未配置，rolling goal active。


精確source commit／tree／ZIP／SHA／PR merge與兩remote assets见manifest及outputs/v137-qa/source-evidence.json、release-remote-evidence.json、goal-turn.json。後續核對實際下載僅讀使用者明確提供的本輪測試檔，不繞過browser URL policy。每輪最多32 typed jobs／bounded wait60秒；strict>7days且outside latest3、exact tag／Git archive可重建才可清除，草稿不是重建產物。
