# v0.127.0 交接與可逆

本機保存版本新增「下載選定版本備份」，可將選單中一個已保存版本另存ZIP。按下時固定ID，即使下載途中切換選單，也不改本次來源；成功提示明示該ID，整庫備份保持。空選擇／未啟庫／busy時停用；取消只中止自己請求、保留上一份成功備份來源。備份只含已保存版本，未保存編修、音檔與成果仍須另存。

backup-download純request嚴格核對ids、隔離／排序1–1000唯一ID；controller以click-time副本核對descriptor.selection及選定數量，沿原完整串流／SHA與latest／cancel／dispose。DOM共用同一sender、URL cap及verification來源，不增加第二個下載控制器或持久buffer。captureSelected只讀目前已展示records；library選擇事件刷新可用狀態，原预覽取消及後續編修保持。

既有POST /api/drafts/backup/prepare由{}整庫相容接續可選ids，沿共享Python selected_ids／export_library_backup；拒絕路徑、額外欄位、query、重複／空ID及跨Origin。ID不能選檔案路徑；沒有恢復或新增寫入權限。選定健康版本不讀未選定版本，整庫仍完整檢查。有效格式但不存在的ID維持既有HTTP500本機讀寫失敗，不自動重送。descriptor六欄、backup1／draft3／Agent1與27組operation schemas保持，20基本／啟庫27工具不變，沒有新asset、依賴、模型或外網。產品127／唯一policy明確來源38–127共90版，未知128拒絕。

622 Python（92.422秒）、1576 JavaScript、141 syntax及四Skills通過；新增3 Python／8 JS，focus43 JS及3 Python。初次Python兩處oracle不符：既有populate只建兩個版本，缺少的合法ID沿原HTTP500；按實際資料／契約修正，產品錯誤路徑不改。首輪完整JS只有舊selection-event VM缺少新增backupControls回呼；補上並驗其一次刷新後完整1576成功。Python源與測試此後沒有再改，沿同次622成功；所有失敗log與fresh retry收據保持。

v126精確source ZIP（2357756 bytes，SHA 35786baee1e7355b8e4e98b1f189f4e9205cdc72b1c26b63df83c792adb4fd08）實際還原619／1568；四scope×89的356份歷史ZIP／manifest原bytes保持，27組schema及八份whole lyrics Python／JS診斷保持。單版本原生合成source的完整inspection回覆在application／CLI／Agent／MCP／HTTP相同，good-bad-good與200／400／200保持。另實際CLI選ID備份／拒覆寫，application、Agent及MCP完整inline ZIP均核對相同選定ID與保存record／draft原bytes；created_at按實際時間不同，不宣稱整包bytes相同。原三份合成版本六個檔案hash不變，未restore。

一個in-app本機QA頁保留19份完整快照：13份流程中的四台原值／17個row或清單ID／歌曲四個成果與dirty保持；busy時兩下載按鈕、取消與核對控制正確。三秒QA-only prepare延遲驗取消保留整庫source，以及點版本2後切版本1仍交付2；整庫檔不能確認單版2，單版2也不能確認新的單版1，正確檔案成功。四份QA server source分別含[1,2,3]／取消請求[2]／成功[2]／[1]；它們是合成source，不是實際瀏覽器保存檔案。下載事件10秒未取得path，不繞過先前被拒的下載管理頁。

1280×720／390×844／1280×360均以實際DOM尺寸核對完整值，頁面與ID／摘要提示不水平溢出，從整庫按Tab可達單版按鈕。warn/error零，viewport reset，QA tab關閉，原會員tab保持。QA server正常stop／context close／deadline thread join並觀察實際exec EOF；短命HTTP threads正常join，CLI／Agent／MCP EOF。未選媒體，不宣稱native File身份或實聽驗收。PNG留本機忽略QA。

分支codex/iteration-v0.127.0；restore-v0.126.0-before-v0.127.0固定101b76fb0f6ab2a748058d7eb7e0195d84658a4e。由tag另建codex分支審閱還原，不覆寫私人草稿／素材；Git不撤銷外部投稿。精確source封裝、PR合併與公開prerelease，兩個assets逐byte回讀，以outputs/v127-qa成功收據及manifest記錄實際提交／SHA。

唯讀稽核本工作區outputs、完整直接封裝及明確same-host run；最新127／126／125保護，嚴格超七天且exact tag／Git archive可重建才列候選。保存草稿、備份、素材、未知、失敗36／53與QA保持；無候選不清除，不終止外部程序。ZOE. G、GitHub djguan-jpg、PolyForm Noncommercial1.0.0與已授權public保持；四份FreeTWAI已投稿，創始核實仍submitted_unverified。仍未驗證實際瀏覽器落盤、完整視覺／screen reader、實聽／同步、Host安裝與平台正式核實。本輪為滾動goal進展，goal仍active。
