# 指定列移動 v0.102

歌曲段落、鏡頭及歌詞句新增「移至第幾列」與「移至指定位置」。輸入最終列號，一次移至首列、中間或尾列；其他列保持相對順序，原文、原時間、逐鏡展開狀態與音檔保持。撤回只還原最近順序，保留後續欄位編修；移動後舊成果停下載，重新建立才恢復。

entry-order 純 arbitrary insertion／dense inverse → editor-position 純 metadata view／proposal／injected current + actual-after controller → editor-position-dom 自有九 listeners／literal ARIA／selected selector focus → app 原完整 raw-source order controllers。editor-order／music-arrangement 的 moveTo 共用原 history；歌曲移動及撤回增加完整來源的寫入前、實際 after 核對，拒絕 sparse sources／forged inverse。position 原字串是暫態 data-view-control，不修改 draft／revision；原操作仍完整驗證創作與時間。

產品0.102.0／唯一 policy38–102共65／unknown103拒絕。16基本／23啟庫工具、23既有 input/output schemas、Agent1／draft3保持；只新增兩固定 GET assets，沒有新 POST operation、路徑、模型、依賴或網路權限。legal4無diff：PolyForm Noncommercial 1.0.0／private；創辦 ZOE. G、GitHub djguan-jpg；FreeTWAI not_submitted。

最終位置從1起，原文字保留（例如0001），只trim用於驗證後要求ASCII十進位整數；空白、同位置、0、小數、指數、負值、超範圍或超32字元不產生提案。metadata僅五鍵：ids／selected／position／visible／busy；ID容量沿40歌曲段落／1000鏡／10000句、唯一非空ID64字元，未知欄位／holes拒絕。純entry-order.moveTo做一次splice insertion，未選列相對順序保持；same position回null且保留原undo。inverse檢查完整before／after dense唯一排列與from／to重播，非任意可逆排列。

Injected position controller先allowed，再capture與proposal，writer前重查完整五metadata，writer後核對實際expected IDs、selected、position、visibility与busy；失敗不呼叫onMoved、不宣稱成功或交易式回滾。它不取創作全文；原editor-order與music-arrangement各自複製完整raw entries、核對before／actual-after，只有成功才記錄原order undo。editor-copy共享dense source核對，舊adjacent移動也沿同kernel。music undo保留後來五欄原值；寫入前來源核對失敗保留紀錄，寫入後核對失敗不宣稱撤回成功或回滾。

DOM adapter只綁三input input、三selector change、三button click。原生button必須為當前activeElement且connected／enabled，panel visible且非busy才允許寫入。成功後refresh，再核對同selected ID及可用selector；焦點仍為自身button或重建落至body才回selector，foreign focus保持。finally清active，dispose只移除九owned listeners。aria-invalid與提示用literal text；input字串不改寫。窄螢幕flex-wrap，沒有新媒體或持久儲存。

App於selection、collection refresh、music onState、tab visibility切換與editor-order completion刷新view。completion在原adapter恢復selected ID之後執行；移動與undo立即更新位置提示，不依賴後續build或focus。data-view-control使單改位置不markDirty；actual move沿原scope markDirty、busy gate、草稿提醒、後續undo與download禁用。兩固定JS assets為GET，HTTP／CLI／Agent／MCP operation與schema保持。

移動只改順序；原cue秒數、shot秒數／FPS／frame規則保持。指定列不等於時間重排、已保存、AI或媒體生成、版權接受或平台創始人認定。
