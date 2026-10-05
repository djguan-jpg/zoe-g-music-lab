# 欄位快捷移動 v0.100

段落、鏡頭與歌詞的文字或時間欄可按 Alt＋↑／↓ 移動目前列；保留同一欄位、游標選取、原文與時間。沿原順序撤回保留後續文字編修，移動後須重新建立成果。原生選單、一般方向鍵、組字／重複鍵、其他修飾鍵、等待中與首尾邊界保持原行為。

editor-keys 純 gesture／相鄰 ID 提案 → injected controller current metadata／consume／writer／actual-after 核對 → editor-keys-dom 三容器 delegated keydown 與暫態欄位／caret bookmark → app 共用原 music-arrangement／editor-order 完整 raw-source 移動與撤回。keyboard 才回同一欄位，原工具列保持按鈕焦點；沒有新 history、創作 schema 或 Agent operation。兩個固定 JS assets；无新依賴、模型、外網、timer、路徑、auth 或寫檔權限。

產品0.100.0／唯一 policy38–100共63／unknown101拒絕；16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3及 legal4 保持。PolyForm Noncommercial 1.0.0／private，創辦 ZOE. G／GitHub djguan-jpg；FreeTWAI not_submitted。

gesture精確八鍵：key、altKey、ctrlKey、metaKey、shiftKey、repeat、isComposing、keyCode。六bool與safe integer keyCode0–255；只有單獨Alt+ArrowUp/Down產生-1/+1。組字、229、repeat、Ctrl／Meta／Shift或其他按鍵返回0。list metadata沿editor-selection／entry-order容量40段／1000鏡／10000句、ID≤64、dense／unique；提案隔離before／after ID順序，不讀創作全文。首尾、hidden／busy無提案；unknown／disposed／不允許在capture前拒絕。

controller依序capture→proposal→current全ID／visible／busy→consume明確true→再次current→writer明確true→actual-after完全等於預期→onMoved。正常成功四次metadata capture。競態、不能取消的event、writer失敗或after不符不能回報成功／恢复caret；不回滾外部狀態、不新增持久history。rawsource競態另由原music-arrangement／editor-order完整欄位核對，兩層職責分開。

DOM每容器一個keydown。target必須為當前原生activeElement、connected、enabled、非readonly／hidden的text input或textarea，位於直接自有row。select不攔截。先驗gesture／allowed再讀display；bookmark只持有這次target、field index<16、tag、native display≤8MiB units及有效selectionStart／End／Direction。成功後查同ID的新位置、相同field index／tag／display，原焦點仍在原欄或因重建落在body才focus，再setSelectionRange。外部焦點／變動display保留；不發input、不寫raw值、不改字元／時間。finally清bookmark，dispose移除三自有listeners。

app音樂入口新增明確ID與keepEditorFocus選項，共用原controller／markDirty／回覆。editor-order-dom公開move入口共用原完整source驗證與refresh／select／onChanged；toolbar也經此入口再維持原按鈕焦點。最新一次撤回保留後續欄位編修；結構改動按原契約失效。影格／時間完整驗證保持，移動不自動改時間，歌詞正式匯出仍按開始時間排序。快捷鍵非undo新schema、媒體生成、AI呼叫、保存成功或作者／平台身份證明。

HTML兩固定script按純層→DOM→app載入；欄位aria-keyshortcuts與既有說明段落關聯。HTTP只加兩固定GET映射；Host／Origin／CSP、API操作、路徑／寫檔權限保持。驗證及可逆見QA-v0.100.0.md／HANDOFF-v0.100.0.md。
