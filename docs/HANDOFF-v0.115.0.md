# v0.115.0 交接與可逆

歌曲工作台新增「檢查選定段落」：即使整份待辦200明細已滿，也能檢查原第40段的五個編曲欄位並定位。既有music-readiness共用規則 → 選定原列／stable IDs的純checkpoint controller → 字面DOM → app原欄位focus分層；不補寫、改原值或提交成果。選擇／順序／選定欄位改變停舊定位，精確復原可接續；其他段落與全域欄位的合法編修不影響這五欄的診斷。零待辦仍需整首歌曲、總長與實聽驗證。產品115／唯一policy38–115共78，未知116拒絕；18基本／25啟庫及原25組schemas、Agent1／draft3保持，新增兩個固定GET。

603 Python（77.235秒）、1370 JavaScript、132 syntax、4 Skills與diff通過；新增15 JS。原v114指定source ZIP還原603／1355，308份歷史ZIP／manifest bytes與25組schemas一致。基線合成40段／209待辦，200明細只到第39段；新純模型与原生第40段五項定位實證通過。28快照／21組完整草稿除saved_at比較，7次實際滑鼠／鍵盤focus；5→4→0選定明細、選擇／同文字换序撤回／編修重查／busy／換台／其他來源編修，原生File身分、暫停0.5秒及8秒合成WAV保持。390×844與390×500欄位在viewport內，表格水平捲動；幾何不冒充完整視覺。兩份原生整首209／204完整報告與共用application一致；CLI input／實際draft3、Agent／MCP good-bad-good、6筆HTTP完整核對及3固定JS bytes一致。第一次全測10個隔離VM fixture缺新controller宣告或包含新增binding，已更新邊界／宣告並完整重測；第一次原生證據helper把選音檔前快照當成媒體保持基線，fresh helper按明確快照／選音檔後範圍核對，原失敗保留。兩個owned bounded server phase正常結束、兩tab關閉。瀏覽器保存下載本輪未重測；完整視覺／screen reader／實聽／媒體同步／Host安裝與FreeTWAI創始接受未驗證。

分支 `codex/iteration-v0.115.0`、基線main `246cd3b93dde558e3da532bc368265696496dd63`、還原tag `restore-v0.114.0-before-v0.115.0`。由tag建立codex/restore-*分支經private PR還原，保留main歷史與草稿；指定source commit封裝、SHA及遠端bytes另留outputs/v115-qa。

只盤點本workspace outputs與明確typed owned jobs；最新三版保護，嚴格超七天且可由tag／Git archive重建才列清除候選。未知檔、素材、草稿、備份及失敗36／53與本輪失敗QA證據保留，actual process completion後才最終稽核。

見[契約](MUSIC-SECTION-REVIEW.md)。
