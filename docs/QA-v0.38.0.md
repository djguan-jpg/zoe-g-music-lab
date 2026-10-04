# v0.38.0 QA — 2026-10-04

328項Python、491項JavaScript、4份Skill驗證、39個JS語法檢查及git diff --check通過。新增16Python及31JS：確定性ZIP全檔bytes與逐檔SHA／清單、UTF8與JSON雙budget、無效Unicode／重複欄位／路徑及装置名／case collision、空檔與64檔界限、預設摘要／明確inline及512KiB拒絕、排他CLI與競爭目的檔保留、初始化MCP／Agent一致、HTTP take一次／取消／逾時／tamper／close／未知檔保留及loopback來源拒絕。前端來源、manifest全欄／scope／label／版本／entries順序／hash／大小／extra／外部URL拒絕、hash及HTTP late／失敗／form錯誤取消。

前两次全套檢查有舊MCP工具數量10的斷言失敗，修正為11後完整全套通過；第一次修正文件選錯且第二個程序已載入舊斷言。失敗log與run identity保留，不將其當成功結果。未造成封裝發布或資料覆寫。

## 原生本機瀏覽器

IAB tabs60／61，server PID286280、port8875，以自身run identity記錄。全部使用本次合成範例，選檔是自行建立1秒、48kHz、16bit單聲道WAV。四台ZIP真下載：歌曲4檔、分鏡5、歌詞4（含self-contained preview.html）、音檔3（含接受條件草稿）；每包加DELIVERY-MANIFEST.json。主機讀回CRC／每entry bytes及SHA／完整server descriptor，原WAV SHA保持，未包含WAV或影片。修改歌曲後旧ZIP停用；重建後Enter再次下載含新歌名。

控制server延遲4秒；下載等待時填新歌名，晚回應保留新文字與原成果，dirty仍停用。額外精確取消樣本在回應後23.18秒、60秒TTL前GET舊ID回400，確認取消而非逾時。390×760 viewport，client／scroll均375、ZIP鈕301px；Enter查看成果聚焦output-heading，返回music-delivery-view。1366×768，client／scroll均1351、ZIP鈕285px；文字可換行。console error／warning均0。tabs關閉、viewport復原，QA server以原session正常shutdown，自身staging records0／root清除。

原生歌詞第一次操作停在既有匯入預覽，明確套用後才建立／下載；未把中途畫面當交付。read-only DOM不能讀File物件，改以实际ZIP／原檔SHA及native選檔流程核對。

## 可逆與接受範圍

v0.37.0指定ZIP source084239fe73f4cc24f2706f9991fc808fcfbbcf99，818764bytes／SHA ddb27b522fc8af13f1cfed1a6286b36103a26c562409cff0f8fbcbf53a5f2568，還原到本輪暫存目錄，312Python／460JS通過，暫存移除。restore-v0.37.0-before-v0.38.0指main起點7e1947e99139d58e11560337b64539bf3dd1de46。

本輪指定source封裝再解壓完整tests／Agent metadata／MCP初始化；private PR與Release及遠端下載的bytes／SHA、refs、tree、legal4、main clean依 outputs/v38-qa 與release manifest收據核對。封裝source commit與main merge commit分開記錄，latest3與超七天／可重建條件由既有稽核工具確認。

正式歌曲／影片、實唱實聽、完整視覺審查、特定Agent Host及原生file://歌詞預覽音檔播放尚未驗證。FreeTWAI仍not_submitted，未取得平台創始人接受。PolyForm Noncommercial1.0.0／ZOE. G／djguan-jpg／AI協作及legal4保持；rolling goal active。
