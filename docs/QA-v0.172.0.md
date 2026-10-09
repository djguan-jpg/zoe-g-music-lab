# v0.172.0 接受紀錄

## 目的與範圍

依使用者最新指示，成熟工具已有更強編輯能力；一般介面隱藏歌曲、分鏡、人工校時及簡易 MV 編輯器，改為字幕交付、音檔核對、素材交接。原 DOM／契約保留，沒有重新啟用按鈕；初始化不填入示範企劃。這是取捨與修正，不宣稱已有市場競爭力。

原本素材專案載入後再起稿會清掉修改與圖片的問題，已以分層純控制器／DOM／app 修正，但編輯功能同樣隱藏。見[契約](MV-SEED.md)。

## 驗證來源

本機 `outputs/v172-qa` 保存原問題、預覽／取消／失效、實際下載、重開、字幕與精簡介面證據。原 workbench HTTP handler、原生 Chrome、只用本輪及前輪自有合成資料；媒體與截圖均在忽略 QA。

首次專案下載事件等候逾時，但原生 Downloads 中精確檔案為 89044 bytes，SHA-256 `c5e7c78224e71672accdff7b709e3590270ddec8e5b5f4d09ebde533a8d34510`，與瀏覽器送出回讀一致。初始篩選未涵蓋原生括號檔名的失敗保留；沒有改寫或刪除 Downloads。選回此原檔，名稱、原句、原鏡頭 ID 與圖片回讀通過。

編輯器隱藏前，原自有錄製工作在第一次可見性等待期限後完成，沒有重送。實際保存 WebM 141579 bytes，ffprobe 回讀 VP9 960×540、Opus 48 kHz 雙聲道、4.0085 秒。這是舊元件相容驗證；不是現在一般介面的主要流程，也不是實聽或逐樣本同步接受。

完整 Python／Node、語法、四 Skills、精確 source package／restore、歷史保護與 scoped 程序盤點以本輪成功收據為準。授權完整期限仍 Python 600 秒、Node 180 秒，兩個 worker 保持；不能用集中測試代替完整接受。

## 精簡介面與回歸

原生 Chrome 已驗字幕匯入／確認／六檔建立與原文下載，PCM WAV 三檔報告與 8 kHz 不符合示範取樣率的提醒；沒有把 `needs_review` 宣稱為音質接受。素材交接的實際保存檔為 89044 bytes，SHA-256 `c4a67b0e4933ffda43af2fc3cbeb42d70441d2713cdddd048c38574054606528`；Agent 企劃 2529 bytes，SHA-256 `da9efb2f3464dadc5ebd22372593468d19553ce1abe6c60eb7dc080ada5bf69f`。音檔、圖片、鏡頭 ID 與全部創作值沿原保存檔逐份相同；另核對新保存檔的重開與回讀提示。

舊素材專案的工具版本為 171，現頁捕捉為 172，原比較造成假性載入失敗。只把目標草稿的工具版本正規化為目前版本，輸入原檔及素材 bytes 不改；實際 DOM 回歸與原生重開通過。確認載入後回到素材交接，避免原專案的其他工作台選擇隱藏載入結果。

390×844 下三個交付入口的 document client／scroll width 都是 375，沒有水平溢出；切換與素材載入後 `legacy-top`／`legacy-editors` 仍 hidden。console error／warn 0；截圖只存忽略 QA，viewport 已 reset。這是操作與佈局證據，沒有宣稱完整視覺或 screen reader 接受。

第一份全套因舊 release metadata 與自動填範例的測試預期失敗，已沿新版行為修正，原失敗保留。第二份 Python 830 通過；Node 2067 中 2066 通過，一份新 DOM fixture 的 100 次 `setImmediate` 等候先於原生雜湊完成而拒絕。fixture 改為兩秒有界等候同一成功條件，不改產品或完整 600／180 秒期限、不放寬值核對；修正後集中 31 項通過。最終完整與精確提交封裝另依 `outputs/v172-qa/acceptance-3` 的成功收據，不能沿前兩次失敗推定接受。

第三份完整工作來源接受：830 Python（1 既有 Windows symlink skip、0 expected failures）／2067 JS（156 檔）、163 語法與四 Skills 通過，1097 份來源前後 SHA 相同，一次性副本移除。後續只有文件記錄與 metadata 換行回復原風格；確切 Git 提交仍由封裝全套另行核對。

## 指定資安掃描仍未執行

使用者指定 [AI Security Scanner](https://teddashh.github.io/ai-security-scanner/)。本輪在 PATH、其已知安裝位置及 Windows 解除安裝登錄找不到 app／CLI；`doctor`、掃描與報告尚未執行。官方 v0.5.0 Windows 安裝檔正在本機忽略 QA 準備，只有逐 bytes 與同 release `SHA256SUMS.txt` 核對後才可使用。沒有安裝、啟動、改 WSL／系統權限、傳送程式或使用其他 scanner 冒充。

[官方 SKILL.md](https://github.com/teddashh/ai-security-scanner/blob/main/.codex/skills/ai-security-scanner/SKILL.md) 說明 `You cannot start a scan.`，開始／暫停／接續須由桌面控制，CLI 計畫不執行掃描。本版需完成這項掃描、審閱結果後才合併或建立正式 release；暫以分支／Draft PR／候選封裝交付。下一步是安裝官方 app、`doctor` readiness，再以本輪精確來源作本機 source scan。未取得實際 case／run／engine outcomes／報告前，資安狀態保持 `not_executed`。

## 限制

只驗自有合成檔案；沒有實際安裝或操作 CapCut、Kdenlive、Audacity，沒有真實作品成效、實聽、完整 screen reader 或 Host 接受。市場文件只證明已有成熟能力。平台四投稿仍未核實，這輪不重送或更改作者聲明。

版本 0.172.0、明確歷史清單 38–172 共 135 項，未知 173 拒絕；清單容量 256／契約 8192 bytes、舊版本、Agent 1、draft 3、template 1、29 schemas／22 基本／明確啟庫 29 操作保持。PolyForm Noncommercial、ZOE. G／djguan-jpg、既有 public 授權與原法律／平台紀錄保持。
