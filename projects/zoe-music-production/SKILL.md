---
name: zoe-music-production
description: 將歌曲需求發展為歌詞、曲風與編曲提示、修改策略和製作交接；適用於 AI 音樂文字創作及製作規劃。
license: PolyForm-Noncommercial-1.0.0
---

# ZOE Music Production

把歌曲需求發展為記憶點、敘事、歌詞與編曲任務。先辨識本輪要完成文字、提示、修改或製作交接，保留使用者的語言、敘事者、曲風與發布對象；只補問會改變結果的必要資訊。

從人物的具體動作、景物和矛盾發展歌詞，副歌聚焦可記住的意象／動作。押韻兼顧口語與唱句長度；中文或台語咬字仍需實唱。編曲提示分開描述節奏、樂器角色、人聲、段落起伏和避免項目，不假設模型能力或參數。

## 執行流程

1. 固定記憶點與故事核心，寫段落在故事中的作用，再安排小節／能量／聲音質地。
2. 工作台「歌曲設計」查看原值待辦並編修。完整需求用Agent `music`／MCP `music_plan`；未完成草稿用 `music_review`，指定原列用 `music_section_review`。列診斷不能當整首歌曲接受。
3. 建立歌曲包、保留 `brief.json` 與 `music-plan.json`，人工完成並實唱／實聽。沒有音檔則交付文字與提示草稿，不推定旋律、咬字或混音通過。
4. 改版記錄變動句子、節奏／編曲因素、預期效果與實際聽感；依使用者明確授權才呼叫模型或外部發布。

在Repo根目錄可執行：

```powershell
python -X utf8 music_lab.py music --brief examples/first-light-music.json --out outputs/start-here/music
```

範例是合成資料，命令不呼叫AI。BPM／小節時間假設固定速度，沒有弱起或自由速度；能量不是實測音量，文字單位不是實測音節。歌曲最多40段，同名不合併；順序／複製／刪除沿原stable ID與限定撤回，重新建立歌曲後才能依新順序產生時間起稿。創作與實際媒體接受另行驗證。

## 保存、接口與界線

使用前依[Agent指南](../../docs/AGENT.md)取得當前discovery及schema；目前22基本操作，只有明確啟動草稿庫才有29。CLI／Agent／MCP／工作台共用應用層，沒有第三方依賴、模型金鑰或產品外網能力。外部JSON嚴格UTF-8、傳輸2MiB／64層，重複鍵、非法Unicode、非有限數字與未知版本拒絕；domain上限依schema，不靜默修補／遷移。

完整需求／起稿／成果回讀先核對来源，預覽再明確Apply；保留原檔、後續編修、其他工作台與媒體。草稿另存、成果下載和素材保存分開，送出下載不代表已保存，beforeunload不是自動保存。原文核對不一致可[閱讀差異位置](../../docs/TEXT-VERIFICATION-PAGE.md)；SHA-only備份不提供猜測原文。CLI預設拒絕覆寫，明確 `--overwrite` 只替換指定輸出；多檔I/O可部分完成，錯誤時保留並核對。

創辦／發起 **ZOE. G**，GitHub **djguan-jpg**，協作範圍見[FOUNDER-RECORD](../../FOUNDER-RECORD.md)。**PolyForm Noncommercial1.0.0，禁止商用**，保留[LICENSE](../../LICENSE)／[NOTICE](../../NOTICE)，不授予AGPL或商用許可；平台作者關係仍自行聲明、尚未核實。上手讀[START-HERE](../../docs/START-HERE.md)，歷史原文見[截至v154歷史](HISTORY-through-v0.154.0.md)。本Skill維持目前工作流程，不附每轮QA歷史；舊工具數／狀態不作現況依据。
