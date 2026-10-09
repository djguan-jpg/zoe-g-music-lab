# v0.171.0 交接

本輪提供同一音檔的圖片／歌詞試播、手動 BPM、A–B、選句 pointer／keyboard 預覽與回讀撤回，以及含素材專案保存／重開、原生 WebM 草稿、Agent 讀寫同一份企劃。由 [MV 專案流程](MV-PROJECT.md) 開始，底層見 [時間軸](STUDIO-TIMELINE.md)，接受與限制見 [QA](QA-v0.171.0.md)。

## Git 分層與還原

還原 tag `restore-v0.170.0-before-v0.171.0` 指向 main 基準 `db33c434fed5c20b34562db6fc58998517a9c097`；迭代分支 `codex/iteration-v0.171.0`。依序保留 atomic commits：

| 提交 | 可重用範圍 |
| --- | --- |
| `85a138f` | 純時間軸、播放／寫入 controller 與來源／URL 所有權 |
| `dc75654` | 原生 DOM、原工作台試播與區域校時 |
| `a4d0398` | 媒體專案契約、bytes 核對與 exclusive Agent CLI |
| `04a3fe4` | 完整電影時間接受、frame／文字容量、WebM metadata 及錄製 controller |
| `1067fcb` | 起稿、保存／重開、原生音畫錄製與正式下載入口 |
| `ced1772` | 外部匯入後的 live row ID 防碰撞 |
| `650c582` | 次毫秒媒體時長取整與有界 Agent 企劃匯出 |
| `7f874a6` | 原生錄製前核對素材合計容量 |
| `0ed06f2` | 釋放前一支影片及原生定位／暫停的取消 |
| `e3247e2` | 非同步歸零回讀與單一 Web Audio 音軌路由，修正重複錄製空影片 |

後續版本／操作文件獨立提交。整輪可由 tag 建立新分支還原；各層有明確依賴順序，勿在未帶依賴時單獨取 UI。媒體專案 CLI 另存新檔，原始磁碟素材與舊專案不覆寫；工作台替換前先保存完整專案。

正式封裝必須對最後 source commit 跑原始完整接受，再核對 CRC、Git raw blobs、manifest、PR merge、main tree、release tag 及遠端 asset bytes。沒有成功 manifest 不當作 release；ZIP 與 package manifest 可從確切 Git source 重建。整體 rolling goal 不因本輪發佈而完成。

## 下一輪

先確認自己的四份投稿能否更新本輪 release／操作說明，不認領 FreeTWAI 原文件的作者；作者自行聲明仍與平台核實分開。再收集真實歌曲操作回饋，特別是長曲錄製中斷、圖片規模、字幕布局及可視／可聽接受。尚未內建生成式模型、歌曲合成、唱詞辨識、混音、MP4、影片轉場或精準剪輯。

每輪 scoped run 與輸出盤點；最新三個正式版本與未知／partial／FAILED 保留。只有嚴格超七天、CRC／Git 重建確認、recovery journal 可還原的合格封裝才清理；使用原 handle 的 STOP／EOF 確認自己的伺服器，不做全機 PID 刪殺。
