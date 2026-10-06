# v0.122.0 交接與可逆

## v0.123.0 草稿下載完整核對

草稿下載旁新增「核對下載草稿」。只有實際成功送出草稿後才可選檔；沿共享完整 UTF-8 原文位元組核對，比對本次送出的完整 JSON，而非預覽、檔名或 JSON 語義。相同檔案確認既有 click-time 保存快照；後續編修仍需另存，原工作台、時間、列 ID、音檔及成果保持。檔案可重新命名；BOM、重新排版、缺尾、舊送出稿或錯原文拒絕保存確認。原本明確「已確認草稿檔案」按鈕保留。

純 text-verification 模型 → 支援 draft scope／可選容量的注入 controller → 可選 IDs 的原生 File DOM adapter → app 的成功 onSent 與原 draft-retention guard。草稿容量1 MiB，在 arrayBuffer 前核對；既有成果預設8 MiB保持。最新 token、送出 revision、完整 source、busy、離頁及 dispose 防護保持；允許核對舊送出快照與後續 dirty 編修共存。送出時間只提供可見辨識，不是保存成功證據；File／檔案路徑、核對報告及暫態完整 source 不進持久草稿或 Agent wire。產品123／唯一 policy38–123共86，未知124拒絕；20／27 tools、27組 schemas、Agent1／draft3及領域契約保持，沒有新 operation、固定 asset、依賴、模型或外網能力。

見[契約](docs/DRAFT-DOWNLOAD-VERIFICATION.md)。以下保留歷史迭代。

619 Python（90.390秒）、1516 JavaScript、137 syntax及4 Skills通過；新增14個JS測試。覆蓋完整 Unicode／原文空白與換行、same-size錯bytes、BOM／排版／缺尾／未知版本、重命名、容量在讀取前拒絕、讀取不完整／File冒充／size drift／I/O、busy／cancel／晚成功或錯誤、新送出失效、manual保存與dispose。Python未再改，沿用同一完整成功結果；修正JS fixture後重跑完整JS與syntax。上一版v122指定source ZIP（2265851 bytes，SHA 67122d24d2140d58be766264ebdab0b851643fe072b85a825ff4c8aa852a97d3）實際還原619／1502；四scope×85版的340份歷史ZIP／manifest原bytes相同，27組schemas保持，八份whole lyrics跨Python／JS診斷保持。指定source封裝器會另跑解出原始碼的完整驗證，成功以manifest為準。

原生14份唯讀快照，首份為較窄欄位觀察，後13份擴為142個創作控制與列ID。兩組功能前後及三組排版前後逐值／順序核對：舊相同檔確認保存但新編修仍dirty、精確復原欄值後dirty解除、舊檔不能確認新送出、最新相同檔確認。合成8秒WAV的原生File身份保持，暫停0秒，不seek。1280×720、390×844及1280×360核對入口在頁面寬度內，沒有頁面水平溢出；console warn/error零。PNG留忽略的本機QA，不宣稱完整視覺或screen reader接受。

Chrome下載事件等待10秒未回報落盤路徑；本輪原生選回的5718／5730／5728 bytes檔案是依創作DOM與可見送出時間獨立構造的合成probe，並非實際瀏覽器下載。它們驗證原生讀檔與完整bytes比較、保存guard及原資料保留；不能作為下載落盤或使用者原稿保存證明。當前合成request的application／CLI／Agent／MCP／短命HTTP完整回覆相同，good-bad-good及200／400／200通過；CLI2、重覆輸出1保留原bytes、無效row拒絕且無輸出，四個固定GET原文相同。此次未宣稱取得原生下載的報告檔。

失敗紀錄保留：版本fixture length／tuple修正；新送出fixture原先誤把prepared bytes當content、舊VM缺adapter，修正fixture後 focused56通過。可見時間新增後一項測試使用JS逗號索引而讀錯node，修正後完整1516全過。唯讀觀察先用不存在player ID與不支援的DOM FileList，改用正確lyrics-player及唯讀CDP原生File引用；初次runtime helper沿舊版寫死metadata與native聲明，保留原紀錄並以獨立runtime2完整重驗且正確標示合成來源。上述未冒充成功。

分支 codex/iteration-v0.123.0；基線 main da8f6f38057d2cfae7960cfee2989f55f4ef6ecb；還原 tag restore-v0.122.0-before-v0.123.0。由tag建立codex/restore-*分支與PR可還原原始碼，不改私人草稿／素材，也不撤銷外部投稿或Repo公開。LICENSE／NOTICE／LICENSING／FOUNDER及PLATFORM收據保持；創辦ZOE. G、GitHub djguan-jpg，PolyForm Noncommercial 1.0.0，沒有AGPL或商用許可。Repo已獲明確授權公開，四份FreeTWAI介紹頁已建立，作者／創始身分未核實，本輪只讀核對不重複提交。

有界owned QA server經exact recorded身份正常shutdown與實際session EOF；CLI／Agent／MCP EOF及短命HTTP thread正常join，兩個owned本機瀏覽器tab結束，viewport reset。不終止外部程序。發佈後唯讀稽核本workspace outputs、直接封裝與typed runs；保護最新123／122／121三版。嚴格超七天且exact tag／現場Git archive可重建才列清除候選；草稿、備份、媒體、未知、失敗36／53及QA保留。沒有候選就不清除。遠端合併、兩個release assets實際下載bytes／SHA、最終稽核以 outputs/v123-qa 的成功收據為準。

仍未驗證：實際瀏覽器下載落盤、完整視覺／screen reader、實聽／音畫同步、Host安裝，以及平台正式創始核實。此輪完成一版進展，滾動goal仍active。


歌曲單段、分鏡單鏡與歌詞單句的工具列新增「回到目前待辦」。檢查並成功定位後，手動查看其他欄位可直接返回最後成功位置；只有一項待辦時，上一項／下一項停用，返回仍可用。共享純 issue-cursor 提供 canReturn／returnCurrent，重用原來源與 revision 核對、onLocate、頁面 reveal 及原欄位 focus；不前進 cursor、不改原文／時間／媒體。未定位、零待辦、來源失效、busy、隱藏或無選列停用；新 report revision 清除位置，精確回復來源可接續舊位置。歌詞手動換頁後返回原 global 明細所在頁，沿全部計數／前200保留明細。三個 DOM adapter 只綁定原生按鈕與狀態；沒有新 asset、operation、POST、模型或路徑權限。產品122／唯一交付 policy38–122共85，未知123拒絕；20／27 tools、原27組 schemas、Agent1／draft3及其他領域契約保持。

Repo已獲使用者當次授權公開，四個FreeTWAI新作品公開介紹頁已建立；平台目前為作者自行聲明、尚未核實，正式收錄仍需另行審核。保留PLATFORM-STATUS.md／json的2026-10-06實際觀察與四個網址，不重複提交、不宣稱取得創始認證。PolyForm Noncommercial 1.0.0、LICENSE／NOTICE、創辦ZOE. G／GitHub djguan-jpg保持。

619 Python（101.640秒）、1502 JavaScript、137 syntax與4個專案 Skills通過；新增18個JS測試、0 Python。單項邊界、任意原index含199、canReturn DTO隔離、stale／busy／hidden／missing selection、revision／count改變、false／throw focus及retry、定位期間來源失效與跨頁返回均覆蓋。上一版v121指定source ZIP（2245849 bytes、SHA a93b23de06079f0e5ca1dfbec3379417f598505358823c6c48c3aec6b859c594）實際還原619／1484，暫存還原移除。四scope×84個歷史producer的336份ZIP／manifest bytes相同，舊27組operation input/output schemas不變；八份既有whole lyrics Python data／files與JS data／Markdown及跨語言診斷相同，只更新產品meta。封裝器另對指定source commit的解出原始碼執行完整檢查，結果與SHA留本機manifest。

原生工作台先重現只有一项待辦時缺少直接返回入口。v122保留47份唯讀快照；10組功能返回加10組排版返回逐組核對完整創作DOM原值、stable row IDs與原生File身份。歌曲第40段的首／末與唯一待辦、鏡頭2的開始／母題引用、歌詞220開始／結束、精確來源復原、歌詞221的21／200跨頁與200／200末項均成功，總計219項只保留前200。Enter與滑鼠均實際定位；來源改動／新revision／零待辦／換台／未定位停返回，建立新報告不自動搶焦點。合成8秒WAV保持暫停0.5秒，返回不seek；其他工作台及原文保持，console warn/error零。未把DOM原值比對宣稱為完整持久草稿bytes驗證。

1280×720、390×844、720×900、1280×360共10組排版返回，活動欄位在viewport內、低於可見sticky工具列；低高度工具列static、頁寬未超過viewport。重用既有幾何與CSS，本輪沒有修改app.js或style.css。PNG留忽略QA目錄；只做原生操作與唯讀幾何，不宣稱完整視覺或screen reader接受。

實際工作台單句報告含219項，完整JSON及Markdown與application相同；CLI完整檔案bytes相同、exit2，重覆輸出exit1且原bytes保持，無效row拒絕／無輸出。Agent與MCP good-bad-good及短命HTTP 200／400／200完整成功回覆一致，四個既有固定JS GET與來源bytes相同。子程序取得EOF，短命HTTP thread正常join；兩個owned有界QA server正常停止、實際session EOF exit0，兩個owned瀏覽器tab關閉與viewport reset。native server沒有延遲注入，busy／無選列返回保護由純controller及三個DOM測試驗證。

首輪完整JS兩項失敗來自既有cue fake DOM未建立新增return按鈕，補齊fixture後1502全過；實際產品沒有因這兩項失敗改動。首次長句合成資料的end0.5沒有重疊，因此下一項停用；保留零待辦失敗觀察，明確改end5後才驗21／200與200／200。草稿原生下載事件等待5秒沒有取得落盤路徑；UI仍顯示「下載已送出，請核對」，沒有按確認、沒有把sent當saved，也沒有用CLI檔案冒充瀏覽器下載。

分支 `codex/iteration-v0.122.0`、基線main `1d428e2103687c92a14918d035e5d329b787d54f`、還原tag `restore-v0.121.0-before-v0.122.0`。由tag建立codex/restore-*分支經PR還原原始碼；不改草稿／素材，不撤銷已公開Repo或已送出的外部申請。指定source commit封裝，merge tree、遠端refs、公開release兩個assets實際下載bytes與SHA另留outputs/v122-qa。GitHub CI未設定，本機與指定source封裝檢查分開記錄。

只唯讀盤點本workspace outputs、直接release封裝與typed owned runs；發佈後最新122／121／120三版保護。嚴格超七天且exact tag／現場Git archive可重建才列清除候選；未知檔、素材、草稿、備份、失敗36／53及失敗QA保持。各session實際EOF後才最終稽核，不終止外部程序。瀏覽器落盤下載、完整視覺／screen reader、實聽／實際音畫同步、Host安裝及平台創始核實仍未驗證。

見[契約](docs/ISSUE-RETURN.md)，平台實際狀態見[PLATFORM-STATUS.md](PLATFORM-STATUS.md)。
