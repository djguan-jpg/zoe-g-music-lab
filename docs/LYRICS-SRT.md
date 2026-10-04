# SRT 原文與來源核對（v0.51）

UTF-8 SRT 先預覽，再明確套用，原檔不修改。段落可有ASCII數字索引；時碼使用至少兩位小時、兩位分／秒及三位毫秒，逗號或點皆可，箭頭前後有空格／tab。只以 CRLF／CR／LF 分實際行，以只有 ASCII空格／tab 的空白行分段；其他 Unicode 字元不是結構換行或空白行。文首BOM只移除一次，句中BOM保留；CLI／browser不先再次去除，direct Agent／MCP與同原文一致。

時碼後各行文字的前後空白、tab、Unicode U+0085／U+2028／U+2029、HTML／timestamp／offset字面均保留；實際多行仍沿既有 ` / ` 合成一個cue，不是完整原排版。要保留換行排版，保存原SRT檔或包含原文的draft3；版本1lyrics.json只保存已合成的單行cue。ASCII空白行是段落結構，空字串／僅ASCII空白的cue不從SRT猜測，缺文字拒絕；需要空白cue請用版本1JSON。沒有自創escape、補字、猜時間或改寫Unicode。

musiclab/lyrics_srt.py 純SRT syntax／文字行 → 既有 lyrics edits／validate_cues／package → application 共用HTTP／CLI／Agent／MCP。musiclab/assets/lyrics-srt.js 是同契約的原生純模型，依既有 lyric-time；整數毫秒計算，超安全範圍／轉秒無法保留毫秒拒絕。5000位hours先縮前導零再轉整數；非零超界拒絕。純解析不處理cue排序／倒置／重疊／總長裁切，這些沿共用驗證。

lyrics-import 由所選 `.lrc`／`.srt` 原文以純模型＋time-normalizer重建預期cues／duration／estimated／timing，核對回應及空review_notes、JSON self-consistency、LRC／SRT原文輸出，再沿既有preview／proposal／explicit Apply。拒絕有效但wrong-source的文字／開始／結束／句數／推得標記、單獨artifact替換及晚到回應，保留原編修。preview.html僅存在／文字型別檢查，沒有執行或完整HTML語義核對；一般JSON匯入保持既有契約，本輪不宣稱新增一般JSON原cue-source核對。

未宣告總長的SRT以末cue原結束推得總長，duration_estimated=true／last_cue_end／inferred_end_count=0；不把原句尾當已確認音檔總長，也不填入作品宣告欄。明確宣告後保留原句尾並檢查超界。工作台特殊原值沿raw-fields完整保護，顯示符號不替換原文；再次讀取已核對同cue。撤回只還原目標draft、保留其他工作台編修與成果原文，成果標stale並停用下載，需重新建立。

產品0.51、明確交付來源0.38–0.51、Agent1／draft3／歌詞包1／12基本與17啟庫工具、各交付schemas維持；未知版本拒絕，沒有模型／依賴／外網或新寫檔權限。ZOE. G／djguan-jpg、PolyForm Noncommercial1.0.0、private及FreeTWAI not_submitted保持。LRC沿[原契約](LYRICS-LRC.md)，未聲稱消除多tag字面歧義。
