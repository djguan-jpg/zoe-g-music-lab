# v0.146.0 QA

## v0.146.0 前後變動原列導覽

草稿檔及保存版本的指定原列新增「上一個變動原列／下一個變動原列」。純 navigation 先完整驗證兩份 draft3、各 1 MiB canonical 來源與 selection，再扫描六集合的全部原位置，逐欄精確比較原字串並略過未變更列。最多 10000 句，超過整份報告前 200 筆仍可導覽；新增／移除及空字串保持，不推定列移動。只回傳位置／總數／變動數／序號及前後候選，沒有原文快取或 wire 變更。

原 current controller 的 checked readPayload → 純模型 → literal DOM 分層；每次完成及明確移動前重查來源，移動後重新比較原列。只改暫態原列選擇，完整原文模式回到摘錄；busy／stale／cancel／clear／dispose 清除並停用。明確鍵盤意圖成功後回到原列欄位，晚回覆不覆蓋重試或搶後續焦點。21 原欄、六集合、1000 stable IDs 及既有成果保留。

736 Python（1 既有 Windows symlink 權限 skip、0 expected failures）、1811 JS（新增22）、150 syntax／四 Skills 通過，集中143 JS。432 歷史 producer ZIP／manifest bytes 及29組 input/output schemas、原整份／原列 JSON／Markdown bytes 保持。22基本／29啟庫、Agent1／draft3／comparison1／row-comparison1保持；無 backend／HTTP／shared controller diff、依賴或權限擴張。產品146／唯一 policy38–146共109，未知147拒絕。

兩原生入口共12集合完整字面核對、24快照、三尺寸各兩入口真 Tab／Enter、console0及無頁面水平溢出；後續歌名編修保留，舊導覽清除。選定 brief.json 原內容與四個檔名保持，其他三檔全文本輪未獨立核對。六PNG只保存在忽略QA，完整視覺／screen reader及browser實際保存檔案未驗證。下載已送出但觀察逾時，原click未重送。自建合成庫兩JSON hash保持；一QA server原handle正常EOF0、兩自建查驗頁關閉及viewport reset，使用者Chrome分頁保留。

原v145精確ZIP2809765bytes、SHA 1f47b5a17150a9ec67e058a09a0833008cf43053bd140670089d8da9f7174845，以原launcher還原736 Python／1789 JS後移除自有暫存。PolyForm Noncommercial、public、ZOE. G／djguan-jpg與六法律／平台文件原bytes保持。依使用者已登入指示，唯讀確認Chrome Zoe／GitHub連結及四公開投稿；仍原作者自行聲明、尚未核實，無额外創始認證按鈕，沒有重送或平台mutation。還原tag、codex分支、CHANGELOG／HANDOFF及exact-source封裝可逆；rolling goal active。

## 證據與觀察限制

checks-evidence／python-test-summary及两原worker、focused-final.log、boundary-evidence、compatibility-final-evidence、previous-restore-evidence、native-validation／native-browser-evidence互相核對。包裝／remote assets／終輪盤點以後續goal-turn.json實際證據為準。

新增fixture曾使用未知root label，被domain正確拒絕；改成合法saved_at後143集中全部通過。restore helper誤指歷史資料夾，尚未讀ZIP或測試即失敗；原typed record保留，新retry明確v145原包通過。原生測試先查錯scope ID、空字串顯示及dirty note假設，讀取實際DOM後更正QA斷言，沒有產品修改。下載觀察逾時造成REPL reset，保留原click已送出與保存未核實，重新取得同一原頁來源並保存24快照，不重送下载或重啟server。新增平台查驗頁曾接受viewport設定而非工作台，將兩筆尺寸按實際1280×360記錄並關閉該頁，再核對390×844及1280×720；六組均以actual geometry為證據。

六PNG存 ignored outputs，未查看或嵌入；完整視覺、screen reader、browser落盤、實聽／同步、Host安裝及founder認證未驗證。未核實歷史worker不補身份、不signal。來源限本新workspace及通用工具指引，不參考使用者其他作品。
