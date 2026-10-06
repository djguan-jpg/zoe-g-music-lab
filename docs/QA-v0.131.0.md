# v0.131.0 操作與跨工具 QA

流程：保存版本分頁加入41版 → 搜尋甲31版、先載入20 → 移出20留下21 → 手動讀取更多 → 再移出11留下乙10 → 空搜尋保留10 → 固定來源下載、變更搜尋、取消 → 三尺寸鍵盤移出／補回 → 原生選回來源檔核對。

依frontend-testing-debugging技能執行目標flow、identity、nonblank、overlay／console、互動及響應核對。Browser plugin unavailable，專案無Playwright workflow且不新增依賴，使用已提供CUA原生DOM／Playwright locator與viewport。六張截圖保存在忽略outputs/v131-qa，依使用者規則不嵌入對話；完整視覺與screen reader驗收仍未完成。

29完整快照包含四台完整原值、歌曲12個結構與段落stable IDs、分鏡1母題／4鏡及4歌詞句，四成果全文／原下載可用狀態與dirty=true提醒全部相同。前輪v130的row selector未涵蓋article型分鏡；本輪用全部data-history-id讀取，不回寫前輪release/tag或沿用六段ID當全表證明。

三尺寸1280×720／390×844／1280×360：Tab從batch到bulk remove；Enter移出10版後focus add，Enter補回後focus batch。頁面、button、hint與14rem局部清單無水平溢出。busy41／busy10／搜尋變更期間及取消前，bulk add/remove、batch、clear、逐項移出均停用；cancel實際成功，上一份source／note／match保持。

41合成保存版本82 JSON在兩server phase前後SHA相同。三份canonical ZIP entries為41／10／取消10，完整CRC／canonical reader及descriptor SHA／bytes核對；原生選回舊41版match=false、當前10版true。這些來源由QA server額外保留，瀏覽器download event10秒無path，不能冒充瀏覽器已保存落盤。

628 Python（75.422秒）、1627 JS（新16）、143 syntax、四Skills；focused43。原v130指定ZIP2448724 bytes／SHA fd4299bf1f69491699d1e24c71629c48128e76d5b955798b77641b70baf855e5還原628／1611，限定暫存移除。4scope×93共372歷史ZIP／manifest bytes與27組schemas保持。完整inspection application／CLI／Agent／MCP／短命HTTP一致，good-bad-good與200／400／200；10版export完整records／draft bytes保持，CLI預設覆寫拒絕保留原bytes。

runtime_backup第一次失敗源於helper字串替換意外把HTTP200改100；保留helper/run，以runtime_backup2只修正該oracle後通過，產品無變更。兩版server按原handle正常停止、context close、deadline thread join且exec EOF；短命interop server thread join，子程序EOF。IAB本輪頁關閉／viewport reset，warn/error0。

媒體身份、實聽／音畫同步、Host安裝、完整視覺／screen reader、實際保存檔與平台正式創始核實未驗證。GitHub CI未設定。發佈前標準audit131direct entries、129完整＋2partial，無candidate或running/unverified；發佈後最終收據為準。strict>7days／exact tag／Git archive重建／latest3保持，草稿、媒體、unknown、failedQA、v77 alternate及partial36／53保留。
