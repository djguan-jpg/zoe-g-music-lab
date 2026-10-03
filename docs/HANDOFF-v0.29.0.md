# v0.29.0 本輪交接

2026-10-04 · ZOE. G · djguan-jpg/zoe-g-music-lab（private）；前輪docs/HANDOFF-v0.28.0.md。

## 改變與分層

基線六段只有新增／刪除，無法保留整列內容直接調整副歌順序。新music-arrangement純鄰近move／restore、注入capture／apply／onState controller；DOM選取同一穩定列，控制列在橫向表格外。最大40段、五原字串欄位，同名及未完成列可移動；完整歌曲／起稿驗證仍由共用application/domain與來源核對負責。

限定撤回只保存最近一次順序，重讀目前欄位，保留後續文字／小節／能量。新增、刪除、刪除還原及歌曲載入使舊紀錄失效；其他工作台／原音檔保持。新增段落選取及聚焦，busy停用排序／新增。排序後重建歌曲成果及時間起稿，既有分鏡不改；舊歌曲預覽須重查。詳見MUSIC-ARRANGEMENT.md。

產品0.29；Agent1／MCP2025-11-25／draft3及所有領域schema、七／十二工具保持。暫態ID／選取／移動紀錄不進草稿或wire。沒有新operation／依賴／模型／auth／production。真Agent18鏡檔預覽、明確限定套用與撤回，歌曲順序紀錄保留；明確brief替換清暫態。

## 驗證與還原

246Python／367JS／四Skill／26JS語法／diff通過，2新Python／14新JS、78種40段move／restore、10真Node→Python歌曲／起稿及21IAB。四native成果、實draft3、四adapter／預設不覆寫、4秒晚回應、390px Enter及原生合成音檔保持。只有DOM幾何，未完整視覺／正式實聽；fixture修正及CRLF／LF核對見QA-v0.29.0.md。

branch codex/iteration-v0.29.0；restore-v0.28.0-before-v0.29.0指main起點54dea8f20f72d07cff0da24a8c2434feab70f3b0。前版v0.28ZIP628922bytes／SHA d42c178f1b93b30cd6c9a1e571aff6ef8314b213d4ec36631d560a837ab03dc0，244／353通過並移除限定暫存。本版指定commit封裝／manifest、privatePR合併／Release及遠端bytes以outputs/v29-qa收據為準。

先另存未提交編修，再git switch -c codex/restore-v0.28.0 restore-v0.28.0-before-v0.29.0，或git archive至新目錄；main用revert／PR還原，不reset或強推。Git無法重建使用者草稿／備份／素材，須另存。

## 未完成及維護

正式媒體實聽／成片、完整視覺、特定AgentHost、其他OS／browser、原生file播放及FreeTWAI投稿／創始資格仍待。舊file政策阻擋未嘗試或繞過；rolling active。

PolyForm Noncommercial1.0.0／private／ZOE. G法律署名四檔保持，無AGPL／商用許可。只讀本工作區及通用工具，未參考其他本機／Git／記憶／vault。

owned45／46tabs完成後關閉，尺寸override已reset；managed QA服務正常shutdown。只查確定PID／8875及本專案outputs，核對最新三版SHA；過七天且Git／已驗遠端可重建才列清除候選，草稿／備份／原素材不清。程序／埠／封裝／實際刪除數見outputs/v29-qa/inventory-final.json。
