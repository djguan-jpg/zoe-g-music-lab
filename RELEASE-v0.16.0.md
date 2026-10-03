# v0.16.0：預覽後保留你的編修

ZOE. G 發起 · PolyForm Noncommercial 1.0.0 · private 測試版。

修正歌曲／分鏡需求及保存版本在預覽後仍會覆蓋編修。需求、草稿與保存版本共用替換保護：讀取期間或預覽後修改目標，就保留目前內容並拒絕替換，重新預覽後才可載入。限定需求保留其他工作台與音檔，完整草稿／保存版本另核對音檔來源。

現代草稿改為選檔→檔名／標題／列數／完整內容預覽→明確載入或取消，避免選檔後直接替換四個工作台。舊版仍明確轉換，BOM可讀，未知格式不替換。完整載入需重選音檔，原檔保留，最近一次載入可撤回；載入後鍵盤焦點移到已選工作台。

分層：replacement-preview純模組只管理作用範圍、來源快照及proposal；brief／library transport注入它，DOM層處理明確載入與既有undo。原生媒體身份不離開頁面，預覽不進持久格式。Agent／MCP／draft／seed／library／backup契約及五／十工具保持。

146 Python／146 JavaScript、四Skill／十三JS語法通過；實際Agent保存→HTTP預覽／guard／載入／撤回，瀏覽器下載與草稿讀回、音檔保留、晚成功／錯誤、modern／legacy／BOM／未知版、390px DOM與Enter焦點驗收見docs/QA-v0.16.0.md。前版ZIP解壓146／121通過，本版精確commit與封裝SHA／遠端下載見manifest及本輪收據。

四個原創專案、非商用授權、署名與private保持；沒有依賴、模型呼叫或全域host設定。完整視覺、其他OS／瀏覽器、正式作品與特定Agent host未驗證，FreeTWAI未投稿／未核實創始人。可逆與資料保留方式見HANDOFF.md。
