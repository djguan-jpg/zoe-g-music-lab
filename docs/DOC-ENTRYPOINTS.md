# 目前指南與歷史紀錄的文件分層

## 可重現入口問題

v154 main中README的開始使用在827行，四Skill的核心使用約488行，前面大量歷史產品QA。七份入口合計982110 committed UTF-8 bytes，包含舊工具數、舊private／未提交平台狀態和過時迭代摘要；新使用者／Agent需要讀大量歷史才能找到可用命令。這不是新的產品功能缺失或模型生成能力。

本輪README先說四個工作台輸入／輸出，提供本機啟動、保存與授權；START-HERE給人類流程和可執行合成範例；AGENT區分兩種stdio framing、discovery、schema、明確來源與保存能力；ARCHITECTURE提供目前責任、來源及非同步／容量／所有權；四Skill各自保持YAML並提供領域創作流程、CLI與工具名稱、人工驗證與保存邊界。目前七入口合計25953bytes，無歷史QA prepend；不是整個repo容量或RAM減少。

## 原文、相對位置與可逆

原main source為73b25274dcae919f5d363cbb57702e0555e7140c，restore-v0.154.0-before-v0.155.0鎖定同一commit；新分支codex/iteration-v0.155.0。七份history直接取該commit的Git blob bytes，不取可能由Windows轉換的工作樹換行，不正規化原文。

| 原入口 | 原文保存檔 |
| --- | --- |
| README.md | [README-HISTORY-through-v0.154.0.md](../README-HISTORY-through-v0.154.0.md) |
| docs/AGENT.md | [AGENT-HISTORY-through-v0.154.0.md](AGENT-HISTORY-through-v0.154.0.md) |
| docs/ARCHITECTURE.md | [ARCHITECTURE-HISTORY-through-v0.154.0.md](ARCHITECTURE-HISTORY-through-v0.154.0.md) |
| projects/zoe-music-production/SKILL.md | [歌曲歷史](../projects/zoe-music-production/HISTORY-through-v0.154.0.md) |
| projects/zoe-mv-storyboard/SKILL.md | [分鏡歷史](../projects/zoe-mv-storyboard/HISTORY-through-v0.154.0.md) |
| projects/zoe-lyrics-sync/SKILL.md | [歌詞歷史](../projects/zoe-lyrics-sync/HISTORY-through-v0.154.0.md) |
| projects/zoe-audio-delivery/SKILL.md | [音檔歷史](../projects/zoe-audio-delivery/HISTORY-through-v0.154.0.md) |

每份archive與原入口同目錄，原相對URL的目錄基準保持；原錨點／旧內文仍是歷史，不能作現況或新工具授權。原文SHA／bytes與source映射在忽略outputs/v155-qa/history-source-evidence.json，stage前、Git source與遠端實際ZIP均核對全部七份。沒有保證舊外網URL仍可達，也不改寫既有舊連結。四Skill frontmatter按原bytes保留；歷史檔名不是SKILL.md，不作新的Skill入口。

後續QA／迭代摘要放CHANGELOG、HANDOFF、每輪QA和專項契約；目前指南只更新有實際改變的操作與能力。AGENTS所有既有施工與領域規則保持，這輪只新增文件維護規則，不以精簡指南刪除安全或domain契約。

## 指南實際驗證

在本Repo根目錄執行START-HERE的四個完整命令：music／storyboard／lyrics／storyboard-seed，輸出到原文指定的四個outputs/start-here目錄。首次四命令回傳0且產生完整已驗證成果；seed仍untimed或創作未完成，範例LRC60秒是明確總長及推導句尾，不是實聽同步。重複music命令回傳1、錯誤明示已存在、整個原成果tree SHA保持，沒有overwrite。

首次QA父程序在拒絕輸出後錯用「覆寫」限定錯誤文字，實際訊息為「輸出已存在或為連結」。保留原exit1及五個child identity紀錄；接續QA只再驗拒覆寫與餘下stdio，不重送原四CLI命令。通過紀錄說明首輪錯誤，不回填未捕捉stdout或假造原terminal證據。所有建立的CLI/stdio child透過原communicate EOF及同PID／creation identity稽核；不碰其他程序。

AGENT.md的JSON code blocks直接送給真entrypoint：--describe回22operation／protocol1／product155；Agent lyrics_seed保留兩行原文且status=untimed；MCPinitialize(2025-11-25)→initializednotification(不回覆)→list22→call，返回三份reply、structuredContent與text JSON一致。另以明確--audio合成PCM跑四domain Agent music／storyboard／lyrics／audio，全部ok、有成果、原WAV SHA保持。這是程序與資料交接，不是Host設定、媒體品質、模型呼叫或已保存下載證明。

所有目前入口的Repo相對links核對，未解析外網／歷史的每個URL或自訂Markdown renderer。四Skills用現有validator通過；沒有為文件改動新增鏡像unit tests。原完整755Python（1Windows symlink skip／0expected failures）／1911JS、153syntax通過；468歷史archive與29schema／兩種comparison bytes保持；原v154ZIP3000508bytes／SHA153a6387005a8f3eee7ea479cee43e2aa8fd7b7bf608e2288bcd994469c9ece8還原755／1911，暫存移除。

## 能力、發佈與剩餘接受

唯一policy38–155共118／unknown156拒絕。產品版本變更不改Agent1／draft3／MCP2025-11-25及其domain schemas；22基本／明確選庫29保持。無backend／browser實作／固定asset／新operation、依賴、auth、模型、路徑或外網能力擴張。指南不自動啟庫、傳素材或安裝Host；只說明使用者明確來源選擇。

六法律／發起／平台文件original bytes、PolyForm Noncommercial1.0.0及public保持。四既有投稿仍submitted_unverified，本輪不讀寫平台或重新申請。不宣稱創始核實。exact-source封裝／PR／release與所有current guide及七archive bytes另以實際遠端download核對，精確收據見忽略outputs/v155-qa/goal-turn.json。

保護最新三封裝，strict超七天且完整exact tag／archive可重建才列清理；三partial、unverified77、草稿與媒體保持。所有本輪register程序在原handle EOF後再final audit／seal，未知不冒充已停止；没有server／browser／viewport或媒體工作。保存下載、完整視覺／screen reader、實聽、Host與創始接受仍未驗證，rolling goal active。
