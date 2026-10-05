# v0.84.0 驗證

## Findings與修正

v83原生tab136：波形校時空表→Enter新增一句，row1預設0/3/空字，active仍cue-add；Enter刪除第1句後row0/active BODY/undo可用。v84新增focus新文字；空表經固定入口恢復focus，還原原stable row。共用六清單，不更改原資料／播放。

## Environment與檢查

Windows本機127.0.0.1:8875、Codex in-app Browser2／Unified Computer Use；使用本次可用的CUA Browser API，未安裝依賴或改用外部瀏覽器。default viewport及390×844。流程：工作台→Enter新增／刪除／還原→目前欄位或新增按鈕；素材僅本工作區合成six.wav。

| 檢查 | 結果與證據 |
| --- | --- |
| Page identity | URL與title正確，v84標記 |
| 非空／載入 | meaningful逐句精修、歌曲與分鏡；固定新模組已載入，無framework overlay或console錯誤觀察 |
| Console | warn/error 0 |
| Interaction | native30觀察、六種清單空表／還原／新增、stable ID及shot details展開 |
| Responsive | 390px Enter新增focus文字，target x139 width220、document375／table343局部scroll755；幾何不代替完整視覺驗收 |
| Screenshot | outputs/v84-qa/narrow-focus.png 35312B保留於session外，依使用者規則未嵌入對話；未聲稱完整視覺通過 |
| Data/media | 九首層歌曲scalar相同；原literal歌詞0/3/<img src=x> 原句🎵、media blob source／6.000宣告／paused position完全相同；native播放false paused狀態下add/delete仍播放，再明確Space暫停 |
| Lifecycle | owned tab136/137已關閉、viewport reset；兩bounded server正常EOF/context關閉/deadline thread joined；無staging |

## 純模型與實際adapter

12新JS測試涵蓋六list／最大數量／ID隔離、未知field/list/mode、非法index、reorder/delete/replacement／visible/busy漂移、dispose、無法確認focus、DOM空表與目標及actual cue-add/delete adapter。focused50通過。legacy已存在的shot-add VM注入改為共用focusEntry，原duration/busy驗證保持。

全套554 Python68.828秒、972JS、92syntax、四Skills通過；Python two workers／120sec原runner保持。actual CLI/Agent/MCP四檔bytes相同、14基本／Agent1／MCP2025-11-25、good/bad/good与EOF。184歷史producer archive／manifest對actual v83原封裝bytes相同；v83原ZIP解包沿原runner通過554／960，temporary restore清除。package前後的manifest／ZIP及actual private remote下載另依本輪receipts；測試不代替發布成功。

首次integrate.py用錯不存在的測試檔名test_delivery_inspection.py，部分源修改已完成；failed record保留，fresh complete_integration.py只完成剩餘內容，未重啟原helper。full checks是修復後實際收據，沒有把首次helper冒充成功。

## Commands與Remaining risk

node --test四個focused檔；scripts/check_python_tests.py；全套node --test、node --check與四Skill validator；runtime.py／compatibility.py／restore_previous.py。Native使用createBrowserTab、scoped locator press/fill、readonly DOM metadata、filechooser setFiles、viewport set/reset與tab.close。只本工作區新作品與通用工具指引，沒有參考其他本機/Git作品。

完整視覺、screen reader、其他browser／viewport、正式素材／實聽與FreeTWAI創始接受未驗證。純focus模型不證明所有computed CSS/fieldset可見可操作；固定目前DOM流程的實際activeElement已核對。legal4/private/not_submitted保持，最後維護看inventory與final audit，latest84/83/82保護，草稿／素材／備份／failed36/53／未知／外部程序保留。
