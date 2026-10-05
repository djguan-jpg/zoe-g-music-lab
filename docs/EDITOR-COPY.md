# 複製創作列 v0.97

段落、鏡頭與歌詞可複製到原列後方。段落保留五個編曲欄位；鏡頭保留創作、母題與畫面方向，歌詞保留原句，兩者的開始／結束留白後人工校時。原列、總長與媒體保持；新列可用既有刪除／還原操作管理，處理中或達上限時停用複製。

## 分層與來源

editor-copy 純原值／隔離提案／完整來源與 actual-after 核對 → injected controller → delegated editor-copy-dom → app 原 readValue／writeEntries／markDirty／editor-focus。draft3 契約提供三個列上限與欄位；40段／1000鏡／10000句，不猜時間、不合併同名、不改創作字串。鏡頭 open 僅頁面 metadata；新 row ID 使用同單調序列，完整替換舊列時保留原 IDs／open 狀態。busy／hidden／capacity 在 DOM gate 先拒絕，不讀原值、不分配 ID；full source 於 ID 前及寫入前重查，寫入後依隔離 expected 核對才通知焦點。render／busy／換台刷新按鈕只讀 count／visibility，不讀全部原文。複製只更新自己的 panel、dirty/checkpoint 与既有診斷，不增持久 copy 紀錄或 Agent operation。固定兩 JS assets；沒有新依賴、模型、網路、timer、路徑／寫檔能力或 auth。產品97／唯一 policy38–97共60／unknown98；16基本／23啟庫、Agent1／draft3／領域 schemas／legal4／private／FreeTWAI not_submitted保持。

純模型只接受 arrangement／shots／cues，source 精確為 entries／visible／busy，entry 精確為 id／value。id 非空、≤64 units、唯一；value 依現代草稿欄位 exact key／原字串，shots 另有布林 open。字串保持原值，包括空白、CRLF、重複句、Unicode、未完成數字；domain 輸出驗證仍另行執行。unknown shape／重複 ID／過量／不存在原列／撞號的新 ID 拒絕。

proposal 複製隔離 entries，不改輸入；新列緊接來源。鏡頭／歌詞清空 start、end，鏡頭展開以便編修。原列 ID、原值、原鏡時間與作品宣告保持。controller 在來源讀取前查 available；容量／缺列於 newId 前拒絕；完整來源於 ID 前與 apply 前核對。注入 apply 可以只寫指定 list；expected 在 apply 前另隔離，actual-after 不符不宣告成功，也不回滾後續編修。

app 使用原 raw-fields 讀寫，apply 後 markDirty 自己 scope；onCopied 才刷新控制、focus 新列、文字提示。render 的來源核對與原 asynchronous request revision／late guard 保持。原史料刪除記錄不因複製而清除；capacity 會拒絕還原，紀錄保留待騰出空間。段落移動撤回沿原 current order 保護，不新增整份 panel undo。

## DOM 與操作

delegated listener 各 container 一個；事件由實際 button 的直接 row 取得 stable ID，不用顯示序號作來源。disabled／detached／foreign／hidden／busy／full gate 拒絕後不讀欄位。按鈕 aria-label 指定段落／鏡頭／歌詞列；aria-describedby 說明時間留白。窄畫面 action group 可換行，表格沿原局部橫向捲動。新歌詞 focus 文字，新鏡頭展開並 focus 母題，新段落 focus 名稱；完成沒有自動切換其他工作台。

## 草稿、工具與限制

沿現代 draft3 保存原五欄段落、十二欄鏡頭、三欄歌詞；新 stable ID／open／copy controller 狀態不進草稿。未校時複製列是草稿，complete storyboard／lyrics 仍拒絕空白時間；原 review operation 可診斷未完成來源。原 CLI／Agent／MCP／HTTP 應用層與16／23 tools 不變，不新增 copy 網路操作、檔案路徑或模型能力。

原音檔／播放位置／pause 狀態保持；media 不進原始碼、成果或 Agent。多行原句在草稿與複製中保留，歌詞建立仍沿既有單行契約拒絕；必須由使用者明確編修。複製創作資料不代表新作品、實聽／音畫同步、版權接受、AI 呼叫或平台創始身分。

PolyForm Noncommercial 1.0.0、ZOE. G／djguan-jpg、private 與平台 not_submitted 保持。驗證與可逆見 QA-v0.97.0.md／HANDOFF-v0.97.0.md。
