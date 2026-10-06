# v0.119.0 交接與可逆

選定歌詞待辦共用 lyrics_review 的完整來源與時間分析，先依原句／作品時長篩選再套200明細上限；全部原句仍參與重複開始與horizon重疊核對。新增獨立 lyrics_cue_review schema1、application／CLI／HTTP／Agent-MCP，20基本／27明確啟庫，舊26組schemas保持。單句report只帶選定cue與title／duration，不帶整份歌詞；source controller核對整份原值、stable IDs與選列，其他句子也可使舊位置失效。檢查／報告不改原文、時間、音檔或草稿；零待辦仍須完整歌詞包與實聽。產品119／唯一交付policy38–119共82，未知120拒絕；Agent1／draft3及其他schemas保持。

619 Python（86.844秒）、1429 JavaScript、136 syntax、4 Skills與diff通過；新增8 Python／16 JS。原v118指定source ZIP還原611／1413；324歷史ZIP／manifest bytes及原26組schemas一致，新增operation只有lyrics_cue_review。八份既有whole lyrics Python data／兩檔bytes、JS data／Markdown及跨語言完整診斷保持。120句留白基線共240待辦，whole前200明細沒有原句120；新單句兩項可直接定位。10000句horizon長重疊，選定句9999關係全部計數，前200明細、256KiB JSON及2MiB wire有界。原生28快照／22組完整草稿僅排除saved_at比較，原句120的2／1／0報告、mouse開始與Tab結束、選列失效／復原、相同文字換序／撤回stable IDs、其他原句重複開始與重疊關聯row1、global時長待辦、busy／hidden／stale停用通過。選定零待辦時，whole仍238項；不能當整表接受。Unicode／首尾空白／其他三台、原生File身份、暫停0.5秒及8秒合成WAV保持，console warn/error零。1280×720及390×844，窄頁面無水平溢出；PNG在忽略QA目錄，未作完整視覺／screen reader接受。CLI input及draft3明確row120的exit2／2／0、重覆輸出exit1保留原bytes、無效input／missing row／input row override拒絕不建輸出；Agent／MCP三組good-bad-good、9筆HTTP及5固定JS bytes一致。draft的JSON鍵序按原source輸出，與native input逐語義data及Markdown相同，自己的完整files按自己的payload核對；不把鍵序當來源證明。

中途錯誤證據保留：初次Python dotted test module路徑、app整合漏右括號、focused DTO fixture、QA草稿options key及snapshot player ID修正後重驗；舊discovery數量／ordered tools／supported length fixtures更新，修正fixture縮排；首次全JS八項由新增controller未加入VM fixture與舊app文字pattern造成，四個fixture同步後剩一個pattern，再修正後1429全過。Python已619通過且其來源未再改，JS重試沿用該成功結果。初次runtime把不同JSON鍵序的draft輸出當native字面bytes比較而失敗；新獨立runtime paths按同一payload核對完整files，再比語義data／Markdown，四adapter通過。失敗紀錄與部分輸出保留，不冒充成功。

分支 `codex/iteration-v0.119.0`、基線main `e8449502f8177456ec41b1f148d60f4cfd24c523`、還原tag `restore-v0.118.0-before-v0.119.0`。由tag建立codex/restore-*分支經private PR還原，保留main歷史、原素材及草稿；指定source commit封裝、SHA及實際遠端bytes另留outputs/v119-qa。

一個bounded loopback QA server與一個ephemeral HTTP thread已正常停止；實際子程序EOF、owned tab關閉及viewport reset已核對。只盤點本workspace outputs及typed owned jobs，最新三版保護；嚴格超七天且可從tag／Git archive重建才列清除候選。未知檔、素材、草稿、備份、失敗36／53及本輪失敗QA保留，actual session completion後才最終稽核。瀏覽器保存下載、完整視覺／screen reader、實聽／實際媒體同步、Host安裝與FreeTWAI創始接受未驗證。PolyForm Noncommercial 1.0.0／private，創辦ZOE. G／GitHub djguan-jpg保持，FreeTWAI not_submitted。

見[契約](LYRICS-CUE-REVIEW.md)。
