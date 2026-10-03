# v0.30.0 本輪交接

2026-10-04 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）；前輪 [v0.29 交接](HANDOFF-v0.29.0.md)。

## 改變與分層

基線留白歌曲段落只顯示泛用錯誤，沒有定位；HTML BPM step=0.001 還會攔下完整服務接受的 120.0004。新增歌曲欄位待辦，建立歌曲包及從目前歌曲起稿分鏡先定位原欄位；BPM step=any 保持有限數值與既有完整驗證。沒有補寫創作或修改原字串。

planning-values 從本專案既有 planning-source 提取文字空白及有限十進位規則，需求清單／完整來源核對／兩種待辦重用。music-readiness 純形狀／必填／範圍，readiness-state 注入原始快照控制器由歌曲與分鏡共用，app 只捕捉 DOM、呈現、原位置聚焦及 busy。40 段／每種清單 100／來源 8 MiB；全部計數、200 明細、前 20 UI。見 [歌曲待辦契約](MUSIC-READINESS.md)。

歌曲快照包含穩定列 ID 與原始全部欄位。排序、刪除及修改停用舊定位，定位前重查；歌曲替換清暫態，其他工作台與音檔保持。filledSections 與零待辦均不是完整接受，總長、實唱／實聽仍須驗證。檔案 Agent 起稿維持獨立來源與明確預覽／套用／撤回。

產品 0.30.0；Agent1／MCP2025-11-25／draft3 及領域 schema、七／十二工具保持。暫態 ID／快照／待辦不進草稿或 wire；沒有新 operation、依賴、模型、auth 或 production 變更。

## 驗證與還原

249 Python／382 JS／四 Skill／29 JS 語法及 diff 通過；新增三 Python／15 JS，69 組歌曲欄位 Node→Python、29 組數值對照及 26 IAB。四 native 成果／四 adapter、真 17 鏡 Agent、實 draft3、390px Enter、四秒晚回應及原合成音檔保持通過。只有 DOM 幾何，未完整視覺／正式實聽；詳見 [本輪 QA](QA-v0.30.0.md)。

branch codex/iteration-v0.30.0；restore-v0.29.0-before-v0.30.0 指向 main 起點 21f997299c6576999801fd197a2a7c33a5c84f64。前版 v0.29 ZIP 645099 bytes／SHA 7c826e4fcf7b2f7385822b28a09cd628a2e90c26e066be89fb44c035e680eb63，解壓 246／367 通過並移除限定暫存。本版指定 commit 封裝、private PR 合併／Release／遠端 bytes 以 manifest 與 outputs/v30-qa 收據為準。

先另存未提交編修，再 git switch -c codex/restore-v0.29.0 restore-v0.29.0-before-v0.30.0，或 git archive 到新目錄。main 使用 revert／PR 還原，不 reset 或強推。Git 無法重建使用者草稿、備份或素材，須另存。

## 未完成及維護

正式媒體／實聽／成片、完整視覺、特定 Agent Host、其他 OS／browser、原生 file 播放及 FreeTWAI 投稿／創始資格仍待；舊 file 政策阻擋未嘗試或繞過，rolling active。

PolyForm Noncommercial 1.0.0、private、ZOE. G 及四個法律／創辦檔保持，沒有 AGPL／商用許可。本輪只讀本工作區及通用工具，未參考其他本機／Git／記憶／vault。

owned 47／48 tabs 已關閉、viewport 已 reset，managed QA 服務正常 shutdown。每輪只查確定 PID／8875 及本專案 outputs，核對最新三版；超過七天且由 Git tag／已驗遠端可重建才列清除候選，使用者草稿、備份、素材不清。實際程序、埠、封裝與刪除數見 outputs/v30-qa/inventory-final.json。
