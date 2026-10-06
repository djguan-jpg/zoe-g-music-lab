# v0.144.0 QA

流程：完整草稿預覽 → 整份比较 → 選集合與指定原列 → 有界字面閱讀 → current／selection失效與明確重試；所有比較都是唯讀。

| 項目 | 實際結果 |
|---|---|
| 缺口 | 1000句變動的原整份report保留前200，原第501無明細；新operation可取該列，完整來源SHA一致。 |
| Domain與分層 | 新15 Python／20 JS；六集合、四status、缺列與空字串、字面Unicode／CRLF／控制符、UTF8 boundary／完整欄位SHA、整份來源與容量拒絕、隔離／current選列／取消late/retry。 |
| 跨語言 | 19完整DTO／Markdown案例一致，含六集合與原第10000句；原整份比較JSON/MD bytes相同，28舊input/output schemas保持，只有draft_compare_row新增。 |
| 完整回歸 | 736 methods執行，1既有Windows權限1314 skip、0expected failure；1769 JS全部通過，150 syntax／四Skills及157 commands exit0。兩原worker身份與EOF摘要保存，source封裝再檢查。 |
| 原生UI | localhost工作台v144有實質內容；兩預覽入口、六集合、cue501／1000、無效1001／重試、未變更與移除，沒有Apply/save/restore。 |
| 資料保持 | 25 DOM快照，前24份21欄／六列根／1000句與目前成果原文保持。最後明確改歌名只改該欄；新值保留，舊比較隱藏、原列結果清空／停用。四完整成果跨保存版本流程原文相同。 |
| 視窗／鍵盤 | 1280×720、390×844、1280×360各兩入口，實際Tab／Enter查看501；焦點按鈕在viewport且hit，無頁面水平溢出，console warn/error0。 |
| 圖片與界線 | 六JPEG只存ignored QA，未看圖／嵌入，不宣稱完整視覺／screen-reader或browser落盤。row IDs未獨立記錄；audio原生選檔、實聽、Host與平台founder認證仍未驗證。 |
| Browser路由 | Browser plugin not available；使用已提供CUA Playwright API，沒有安裝依賴或另啟外部瀏覽器。 |
| 相容／還原 | 四scope×106版本共424 ZIP與manifest原bytes相同；v143指定source14be4da4fea38a0e23e87172c90390de4888c521，ZIP2754220／SHA cb67e613ae60cbf4bfbf96bf656deafa9b15acecd0d4c733355383f45955acbc，原launcher721/1749後清除暫存。 |
| 舊Agent／保存 | 五adapter舊compare／backup完整wire good/bad/good與HTTP200/400/200相同；10選定保存版本原record/draft bytes保持，82原合成JSONhash保持。 |
| 程序／空間 | QA server正常返回、context close、deadline thread join及原exec EOF0，兩自建頁關閉／viewport reset。唯讀metadata盤點 complete、獨立stat sum一致、exclusive report拒絕覆寫，無超七天檔案；發佈後再盤點latest3及所有typed runs。 |
| 初次失敗 | 1新controller test捕捉invalid來源未發布stale，已修正；完整checks先失敗於舊21/28工具數斷言，明確同步22/29後全通過。helper先遇預期順序／fixture準備／舊count及失敗receipt已有檔的拒覆寫，記錄保留、正常完成；不把helper錯誤當產品功能通過。兩次失敗suite的worker身份未另保存typed records，不補造；原父exec EOF1與有界launcher完成紀錄保留。 |
| 平台／授權 | Zoe登入音樂公會長及四投稿公開頁唯讀核對，署名ZOE. G、djguan-jpg與禁止商用；作者仍未核實。六法律／平台檔原bytes保持，不重送。 |

所有詳細receipt在忽略outputs/v144-qa，不含使用者真實素材。完整視覺、實際保存、歌曲/影片生成或創始核實不得由資料測試代稱通過。
