# 變動原列前後導覽

## 純模型與 current source

draft-compare-row.navigation 先沿 prepare 完整驗證兩份草稿3、全部 panels、原生 grammar／Unicode／getter／sparse／容量及 selection，再扫描選定集合所有原位置。sections／shots／motifs／cues 按契約全部欄位，avoid／deliverables 按原字串比較；存在性差異為新增／移除。沒有修剪、正規化、時間數值等價或移動推定。

DTO 只含 selection、rows、changes、ordinal、previous、next。未變更原列的 ordinal 為 null，候選是原位置嚴格前／後最近變動列；邊界 null、零變動停用。各完整來源最多1MiB及10000cues；只一次有界扫描，無持久全文快取。整份 report 前200筆不限制導覽。

注入 current controller 沿完整 canonical source／selection、revision／File identity／preview gate 核對 readPayload。DOM完成原列比較或明確移動前重新拿 checked payload，保存 scalar navigation；移動只設定暫態 row-number 並重新 run。來源失效／busy／cancel／clear／dispose 清除候選與 note；後續創作、成果、草稿 checkpoint、媒體保持。完整原文先回摘錄，既有 fullValues 行為與下載報告不變。

明確移動 intent 編號，成功且仍目前意圖、焦點仍原按鈕／body時，focus 原列 number 並 preventScroll；使用者已換焦點則保留。取消或舊成功／錯誤不能覆盖新run或搶焦點。原生buttons／aria-controls／live note，owned listeners在dispose移除。無新增shared controller或backend能力。

## 相容、驗收與限制

29 schemas及整份／原列四種JSON／Markdown bytes與v145相同。22／29tools及各schema獨立保持。產品0.146.0、policy38–146共109，未知147拒絕；四scope×108歷史版本432封套與manifest逐bytes保持。無新依賴／外網／模型／path／媒體／auth權限。

新增22 JS包括10000cues、超200界限、原225→9901→10000、精確空白／CRLF／Unicode／時間字面、metadata-only零變動、empty／missing、getter／未知／整份容量拒絕、六集合、兩DOM方向與邊界、來源／File gate、busy duplicate、late cancel/retry焦點及clear/dispose。完整736 Python／1811 JS通過。

原生1000句為合成資料；兩入口原225→501→997→1000／返回、六集合全文及三尺寸鍵盤核對。24快照保存完整21欄／六列集合與1000 row IDs；成果只有選定brief.json全文與四個選項本輪逐字核對。最後只有music-title編修，成果note明示未重新驗證，舊候選與全文清除。DOM／幾何及六PNG未查看不能代表完整視覺或screen reader接受；已送出下載不等於保存成功。沒有創作生成、實聽／同步或平台founder認證。
