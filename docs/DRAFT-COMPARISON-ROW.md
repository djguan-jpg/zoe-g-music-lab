# 查看指定原列

在草稿檔或保存版本的預覽中，先按「比較目前工作台與這份草稿」，再展開「查看指定原列」。選集合、輸入集合內原位置1起整數，按「查看這一原列」。例如兩份歌詞有1000句變動，整份報告只保留前200筆，仍能查看原第501或1000句。未變更欄位也顯示；空字串與不存在的列分開。這些操作不載入、合併或另存草稿。

## 來源與分層

`musiclab/draft_compare_row.py` 重用既有完整草稿驗證、canonical source與128 UTF-8 bytes `value_view`。新純`web/draft-compare-row.js`沿相同draft3來源與Unicode規則；兩側完整來源先隔離，再雜湊及查看選列。Python／JS完整DTO與Markdown經19組跨語言案例核對，含六集合、相同／新增／移除及原第10000句。整份`draft_compare`原report1與JSON／Markdown bytes保持。

共享`draft-compare-controller`預設model與原API保持；明確注入row model時，current key包含selection，並重查兩份完整來源、原生media identity、revision、preview identity、tab與allowed／visible。每次capture產生的baseline.saved_at沿原契約忽略於current key；真正報告SHA仍包含該次完整canonical草稿。來源或selector驗證失敗也發布stale，不能讓舊ready狀態繼續下載或顯示。舊成功／錯誤／finally不得釋放新job；clear／cancel／dispose立即使舊token失效。

新literal DOM adapter透過父比較controller.read核對，只有目前整份比較ready才可開始；不是從保留前200筆反推原文。換集合或原列清除舊結果，整份比較重查、clear、busy或來源過期同步清除；輸入的集合與原列保留以供明確重查。選擇與報告不進draft3或草稿另存checkpoint。只用textContent、pre與原生focus，不執行來源HTML。

## 獨立報告與界線

新`draft_compare_row`唯讀operation接收baseline、current兩份完整draft3物件及selection；selection欄的例子：

```json
{
  "scope":"lyrics",
  "collection":"cues",
  "row":501
}
```

完整請求只有baseline／current／selection三欄；selection只有scope／collection／row，不接受路徑或額外欄位。支持music.sections／avoid／deliverables、storyboard.shots／motifs、lyrics.cues六集合；audio原scalar欄位仍由整份比較提供。布林、浮點或文字row、未知scope／集合配對及兩側都不存在的原列拒絕；未完成創作可比較，但完整shape、選項、母題引用、Unicode及每份canonical1 MiB上限仍驗證。

獨立`zoe-draft-row-comparison` schema1有selection、unchanged／changed／added／removed、兩側完整集合列數、完整來源SHA／bytes及全部1–12欄。每欄包含changed、before／after；缺列為null，空字串為bytes0及完整空字串SHA。欄位原文摘錄最多128 UTF-8 bytes，不切斷字元；原完整欄位SHA與bytes保留。JSON／Markdown合計64 KiB。SHA是canonical來源，不能證明原檔排版、作者、權利、移動或穩定row ID。

application共享CLI／Agent／MCP／HTTP：新增`/api/draft-compare-row`，兩個明確固定GET JS；22基本／29明確啟庫工具，需重新discovery。原28組input/output schemas byte-value保持；Agent1、draft3、comparison1及其他領域schema不變。既有2 MiB傳輸界線保持，兩份來源即使各自有效，也可能因封套總容量而拒絕。沒有新的JSON路徑、filesystem保存、model、media、網路、依賴、auth或session能力。

CLI明確指定來源與報告目錄：

```powershell
python music_lab.py draft-compare-row --baseline before.json --current after.json --scope lyrics --collection cues --row 501 --out reports
```

成功比較有差異exit2、未變更exit0；完成參數解析後，來源／集合／位置無效或輸出已存在exit1。參數語法錯誤沿argparse exit2，不能當作比較完成。只寫兩份新報告，預設exclusive create；明確--overwrite才替換指定報告，來源保持。Agent回傳文字data/files而非落盤；UI提供有界原列閱讀，原整份比較下載仍是原全份有界report，不把新查看結果混入它。

## 驗證與未驗證

15新Python methods／20新JS tests覆蓋原第501／10000、六集合、全來源拒絕、字面Unicode／CRLF／控制符、來源／selection失效、隔離、取消late／retry及五adapter完整回覆。實際兩入口共25份DOM資料快照，1000句、21原欄位及六列根的原值保持；後續刻意改歌名仍保留、舊報告清除並停用。四份成果完整原文在保存版本流程前後相同。三種viewports各兩入口Tab／Enter焦點可達，無頁面水平溢出、console warn/error0。

六JPEG留在忽略QA，未嵌入或查看。DOM／焦點與幾何不冒充完整視覺、screen reader、browser實際保存檔案或有音檔選定的原生流程接受；本輪未独立記錄DOM row IDs。沒有歌曲生成、實聽、媒體校時、Host安裝或平台founder認證。使用者登入及四份公開投稿已唯讀核對，仍作者自行聲明／尚未核實，未重送。

產品144／唯一交付來源38–144共107版，未知145拒絕。public與PolyForm Noncommercial1.0.0及六個法律／平台文件原bytes保持。還原tag為`restore-v0.143.0-before-v0.144.0`，Git還原不能撤銷既有平台投稿或改變Repo可見性。
