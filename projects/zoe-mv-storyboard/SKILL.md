---
name: zoe-mv-storyboard
description: 根據歌曲、歌詞或故事需求設計 MV 敘事、時間分鏡與生成提示，並檢查鏡頭連續性與交付規格。
license: PolyForm-Noncommercial-1.0.0
---

# ZOE MV Storyboard

從歌詞轉折、歌曲段落與母題如何改變，設計可拍攝／生成的鏡頭。確定角色想要什麼、遭遇什麼、結尾如何改變；選敘事、演出、意象或混合形式，以視覺回返串起段落。

## 執行流程

1. 確認作品總長與範圍。有音檔依實聽校準；沒有則標明固定速度或時間估計。
2. 每鏡寫開始／結束、段落、敘事任務、主體動作、環境、構圖、運鏡及結束狀態。母題、人物、方向、道具與光線應可接續，重要動作留足時間。
3. 工作台「母題分鏡」先看創作與時間待辦。完整需求用Agent `storyboard`／MCP `storyboard_plan`；未完成原值用 `storyboard_review`／`storyboard_timing_review`，原鏡號用 `storyboard_shot_review`。
4. 交付可編輯分鏡、逐鏡提示、素材與連戲清單；實際影片完成後才驗證動作、節奏與音畫。模型／素材與發布沿使用者具體授權，不虛構模型支援。

在Repo根目錄可執行：

```powershell
python -X utf8 music_lab.py storyboard --brief examples/first-light-mv.json --out outputs/start-here/storyboard
```

輸出含鏡頭表、提示、`continuity.md` 與 `mv-brief.json`。最多1000鏡，完整時間及exclusive frame覆蓋仍须驗證；連續資料不代表實際音畫同步。歌曲可用 `storyboard_seed` 起草整小節時間，空白創作必須人工完成，不能當完成分鏡。匯入seed先核對來源／設定、預覽再明確套用；保留原檔，不覆蓋後續編修。

## 保存、接口與界線

使用前依[Agent指南](../../docs/AGENT.md)取得當前discovery及schema；目前22基本操作，只有明確啟動草稿庫才有29。CLI／Agent／MCP／工作台共用應用層，沒有第三方依賴、模型金鑰或產品外網能力。外部JSON嚴格UTF-8、傳輸2MiB／64層，重複鍵、非法Unicode、非有限數字與未知版本拒絕；domain上限依schema，不靜默修補／遷移。

完整需求／起稿／成果回讀先核對来源，預覽再明確Apply；保留原檔、後續編修、其他工作台與媒體。草稿另存、成果下載和素材保存分開，送出下載不代表已保存，beforeunload不是自動保存。原文核對不一致可[閱讀差異位置](../../docs/TEXT-VERIFICATION-PAGE.md)；SHA-only備份不提供猜測原文。CLI預設拒絕覆寫，明確 `--overwrite` 只替換指定輸出；多檔I/O可部分完成，錯誤時保留並核對。

創辦／發起 **ZOE. G**，GitHub **djguan-jpg**，協作範圍見[FOUNDER-RECORD](../../FOUNDER-RECORD.md)。**PolyForm Noncommercial1.0.0，禁止商用**，保留[LICENSE](../../LICENSE)／[NOTICE](../../NOTICE)，不授予AGPL或商用許可；平台作者關係仍自行聲明、尚未核實。上手讀[START-HERE](../../docs/START-HERE.md)，歷史原文見[截至v154歷史](HISTORY-through-v0.154.0.md)。本Skill維持目前工作流程，不附每轮QA歷史；舊工具數／狀態不作現況依据。
