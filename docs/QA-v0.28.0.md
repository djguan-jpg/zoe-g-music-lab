# v0.28.0 驗證紀錄

2026-10-04 · 本機 Windows／Python 標準庫／原生 JavaScript · synthetic only。

## 基線與改變

main 起點179be4f214da86c1ae220b1935d8f249b83a0eca。IAB42：新增第五鏡後建立，狀態「鏡頭請先選擇母題」，焦點停在 mv-build；planningBrief 在 getShots 原位置檢查前拋錯。修正後 IAB43：未選母題的原第三鏡精確定位 select；新增未完成第五鏡定位原歌曲段落並保留總長。分鏡創作待辦提供必填、母題及原位置，時間與完整創作驗證保持原 application／domain。

## 自動及產物

244Python／353JS、四Skill／25JS語法與diff通過，新增3Python／17JS。59組真 Node 與 Python：全部必填留白及 Unicode 空白／歧義母題會定位並由完整 domain 拒絕；原 source 保留。待辦為零的錯誤FPS／總長／秒數／影格仍拒絕，24.0004秒及29.97FPS保持原數值並完整建立。optional change_reason 不改成必填。

新模型測試1000鏡共10000待辦全部計數、200明細截斷、30母題／1000鏡／8MiB／Unicode／未知形狀與ID限制、__proto__、單一快照、後續與靜默編修／定位前保護、限定scope、回復／clear、真 app build handler的前置拒絕及完整建立路徑。實際 loopback asset／defer順序及服務正常停止。

五個 native 下載保留原 bytes／SHA，全文與其實際 mv-brief 的 application／CLI／Agent／MCP比較；CRLF↔LF正規化與raw bytes分開。真正CLI／JSON-lines／MCP子程序EOF正常，七tools與結果一致。實際 Agent storyboard_seed1 為17鏡，工作台先預覽再套用，列出102待辦並保留留白；沒有生成畫面。實際draft下載0.28／schema3保留後續畫面及其他歌曲名稱，不含待辦／焦點／音檔blob與檔名，驗檔後才明確確認保存。

初始1000鏡fixture誤期待11000項；每鏡10個留白欄位，修正為10000。HTTP測試誤把capabilities當build operation，改用既有available_operations；QA Agent誤用op與漏protocol，改依v1格式。生產契約沒有放寬。原生定位依頁面實際按鈕／DOM ID修正；草稿使用實際提交下載及驗檔確認流程。

## 原生操作及頁面

27項 IAB，包含定稿IAB44再次Enter定位原第四鏡、補齊後完整建立。驗證留白／全局欄位定位、收合展開、母題歧義、21項待辦列前20、刪除後位置過期、其他panel scope、原生合成6秒WAV同一blob／選檔保持；真四秒慢回應控制停用及後續編修保留、原成果不覆蓋、正常恢復；Agent起稿預覽／明確載入／限定撤回清除暫態；390px Enter及完整建立、五檔下載與draft確認。

慢回應的一次觀察逾時發生於四秒完成前，接續觀察同一request的終態，沒有重送、取消或重啟服務。這是QA延遲，沒有宣稱production fault。

| 檢查 | 實際結果 |
| --- | --- |
| URL／title | 127.0.0.1:8875／ZOE. G工作台符合 |
| meaningful DOM／overlay | 有分鏡待辦及創作內容；無framework overlay |
| console error／warn | 空；定稿重驗亦空 |
| 操作與鍵盤 | 27項通過 |
| 390×844 | client寬375；面板left16／right359，按鈕right342／228.211，均在範圍內 |
| screenshot／完整視覺 | 未取得；只有DOM幾何，依使用者媒體規則不嵌入影像 |

沿用frontend-testing-debugging，專用Browser skill未列出，使用現有Cua IAB；沒有另安裝Playwright。IAB42／43／44關閉、尺寸override清除，三個managed QA服務正常shutdown。原生file:既有政策阻擋維持，未嘗試或繞過。

## 還原及待驗

前版v0.27 ZIP609664bytes／SHAa63f7b650852f593e0e72d430e29491420f75dc248b134fed0e33282f276407e，解壓241Python／336JS通過；v27-check暫存確認本輪QA根內並移除。restore-v0.27.0-before-v0.28.0保留起點。本版精確commit封裝／privatePR／Release、遠端bytes／refs／legal四檔及最終PID／最新三封裝／清除數，依outputs/v28-qa收據確認。

正式實聽／成片／完整視覺、特定AgentHost、其他OS／browser、原生file播放與FreeTWAI投稿／創始資格仍未完成。PolyForm Noncommercial1.0.0／private／ZOE. G保持；無新依賴、模型、production／auth或schema變更，rolling goal active。
