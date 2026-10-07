## v0.160.0 校時撤回的負時間來源核對

整批提前一秒後，句首為0；後續編修成-1e-999，原領域會拒絕負時間，但撤回只比較轉換數值而接受負零，覆蓋原編修。純lyrics-timing的sameTimes先沿共用LyricTime.normalize(nonnegative=true)驗目前時間，再沿number比較原數值；不是用毫秒捨入值判定相同。無效／後續數值不同拒絕整份撤回，保留編修與原undo供修正重試。真零、合法正值下溢與等值排版保持；文字、列順序、宣告及音檔仍由原限定applyTimes保留。

800Python（1既有Windows symlink skip、0expected failures；兩worker與原120秒）、1926JS（4新增）、153syntax與四Skills通過；集中7Python／36JS。上一版v159 ZIP／SHA／CRC與1024個Git raw blobs核對，原來源隔離完整800Python／1922JS還原通過，未修改排程或期限，暫存移除。488四scope歷史ZIP／manifest bytes與29既有schemas、整份／原列comparison成果保持。v158較早完整還原期限問題仍保留於舊交接，v159的成功不能取代其原來源證據。

Chrome使用一份本輪合成四秒PCM，實際讀取歌詞→預覽／明確套用→負值下溢編修／撤回拒絕→0.0001仍拒絕→修正成-0e-999後重試成功→重建完整歌詞包。原時間／後續原文emoji／宣告及同一音檔保持，拒絕時保留兩列與撤回，成功後停用已用撤回，console0；一個自有tab關閉，自有server原handleEOF0／thread joined。第一個QA server因stdin pipe EOF正常關閉，另用明確PTY原handle接續，無未確認程序或產品server改動。未驗證實聽、保存下載、full visual／screen reader、Host或平台創始接受。

產品160／唯一policy38–160共123、unknown161拒絕；Agent1／draft3、22基本／明確啟庫29、template1及domain schemas保持。沒有新operation／依賴／權限／auth／模型／產品網路。六法律／發起／平台紀錄、七history與四Skills原bytes保持，PolyForm Noncommercial禁止商用、ZOE. G／djguan-jpg、public授权不變；平台四既有投稿仍submitted_unverified，本輪不讀寫或重送。restore-v0.159.0-before-v0.160.0與codex/iteration-v0.160.0保留，封裝／PR／remote及最終audit依精確收據。

證據：忽略的outputs/v160-qa，指定提交封裝與遠端接受依最終manifest／收據。
