# 編修選列 v0.99

段落、鏡頭與歌詞的選列會跟隨正在編修的列。新增、複製、刪除後鄰列、還原及待辦定位也會同步選列；等待中保留焦點，完成後同步目前列。鏡頭段落名稱修改後立即更新選單；單純換焦點保留創作內容與順序撤回。

editor-selection 純 metadata／ID 提案重用 editor-focus 與 entry-order → injected controller 三次 current IDs／visible／busy 核對 → 三容器 delegated focusin／refresh DOM → app 原 music selection 或 editor-order.select。只同步原生 selector／行標示／邊界按鈕，不呼叫 focus、讀創作來源、markDirty、改 revision 或建立 history；原動作保持移動按鈕焦點。busy 結束沿既有 collection refresh 核對當前原生焦點；隱藏、外部、已移除及 disabled target 拒絕。鏡頭 caption 使用 raw readValue 的目前 section／purpose，不依賴稍後才更新的 summary；穩定 IDs 時 select 不重建 options 或讀全文。兩個固定 JS assets，無新 operation／schema／依賴／timer／模型／網路／路徑／auth 權限。

產品99／唯一 policy38–99共62／unknown100拒絕；16基本／23啟庫、Agent1／draft3、23 operation input/output schemas、legal4、PolyForm Noncommercial 1.0.0／private、ZOE. G／djguan-jpg及 FreeTWAI not_submitted保持。

純層只接受 arrangement／shots／cues，使用 editor-focus metadata 容量40段／1000鏡／10000句與 ID≤64字元，再沿 entry-order 拒絕 sparse／重複／無效 IDs。提案只含 list／id／index，未知 list 在 capture 前拒絕；hidden／busy 不產生提案。controller 在 allowed 後隔離 metadata，提交前核對全體 ID 順序與 visibility／busy，提交後再核對 current；外部競態或 writer 未明確成功不能冒充選列完成，不回滾外部狀態。

DOM 每容器一個 focusin listener。target 必須等於當前原生 activeElement，仍 connected、非 disabled／hidden、位於直接自有 row；重新核對 row index／id 與 selector 最終值。refresh 只觀察當前焦點，忙碌時不寫選列；busy finish 沿既有 refresh 重新同步，此時不重新 focus 或改輸入。dispose 移除自己的三個listeners。待辦／搜尋／查看等既有 focus helper 可自然接續，不另外攔截其事件或加入計時器。

editor-order.select 在 IDs 穩定時只改 selector value、舊／新兩列的 selected attribute 及邊界／show controls；不讀 raw source、不重建 options、不改完整 order controller/history。原 music selection 也只讀 metadata。若結構不同，先沿原 refresh 重建當前 choices，仍核對 selected ID 存在。名稱／時間／總長、媒體、草稿 checkpoint、revision、dirty成果及撤回範圍保持。

caption 是顯示用空白整理與最多24 codepoints 摘錄。app 注入原 raw readValue；shots 使用目前非空白 section，否則purpose，cues使用目前原句。輸入listener不依賴後續才更新的summary，也不讀DOM摘要作來源。純焦點 select不重新caption；實際input沿原listener更新該option，原文字、Unicode、CRLF與tab留在原值模型。

複製／新增／刪除／還原的原 focus 行為自然選定實際列；移動／撤回仍保持原動作按鈕焦點與目標選列。焦點不等於source change，不能取消可用順序撤回。選列同步不補齊時間／創作、不生成媒體或呼叫AI，不证明作者、版權、平台創始或音畫同步。CLI／Agent／MCP／HTTP繼續用既有完整需求／草稿，沒有新外部選列operation。驗證及可逆見QA-v0.99.0.md／HANDOFF-v0.99.0.md。
