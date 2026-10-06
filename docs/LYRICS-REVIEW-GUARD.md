# 歌詞校時診斷來源與回覆（v0.118）

按「檢查校時進度」仍只建立唯讀待辦，保留原句、原時間與順序。未填時間不猜測，零待辦仍需建立完整歌詞包並實聽。此輪修正純JS與controller的JSON／回覆邊界，Python domain、application與四adapter規則保持。

## 來源與隔離

checkedSource先用共用json-document.sameValue核對整個來源為自有JSON值，再讀取title／duration／cues或structuredClone。getter／accessor、稀疏陣列、非JSON／隱藏／symbol／undefined／無效Unicode與非有限數字不能在驗證前被讀取或遺失；不是通用Proxy或任意JavaScript執行安全保證。來源只接受原三鍵，cues必要且每列精確start／end／text；原10000句、每句2000codepoints、title200及欄位2MiB保持。default title「歌詞校時檢查」、duration null只進隔離report source，不把可省略欄位注入原request。有效Unicode／空白與值不正規化。

review重用checkedSource，原時間十進位／毫秒與missing、end、multiline、duration、duplicate／horizon overlap順序、全部計數／200明細上限與notes保持。稀疏陣列在map前拒絕，不能從跳過的列得出timing_checked。checkedSource及review回傳副本，呼叫者不能更改原輸入。

## 完整回覆

checkedResult(payload,reply)先建立本次來源期望，再核對reply整份自有JSON與精確root data／files／meta。meta必須逐值等於當前delivery-versions policy current、protocol_version=1、needs_review=true；缺欄位／未知root或meta／歷史或未知product version拒絕。歷史交付ZIP仍按既有supported表讀取，不能把ZIP來源版本政策當成本次即時診斷版本。

data逐語義值等於期望；files只有lyrics-review.json及lyrics-review.md。完整JSON經原嚴格parser、8MiB上限與來源語義核對，Markdown逐字等於既有formatter。核對後回傳自有data與兩個不可變字串的files map，不把server map／data直接交給DOM。JSON key順序或數字拼法不作來源證明；有效語義JSON仍接受。inspect(reply,payload)保留原呼叫順序與data返回，內部改走完整checkedResult。

## Controller與DOM

check先建立最新token／pending，capture與來源驗證在try內；capture／getter／clone失敗經原onError回報，不呼叫transport，當前工作在finally釋放pending。送出前再核對token與outer isCurrent；response返回先核對current，再核對此時capture等於click-time raw request，最後完整checkedResult才onReport。晚到成功／錯誤／finally不能替換成果或結束較新pending；invalidate維持原機制。

app既有onError會把上一份待辦標為stale並停用舊位置，但保留原files／report／result revision與草稿；正常retry核對後才建立新report revision。原操作gate的busy、來源編修、媒體File及draft checkpoint沿用。沒有新的DOM adapter、HTML、CSS或應用權限。獨立歌詞HTML預覽不嵌入此lyrics-review模組，本輪不改其診斷或template契約。

## 版本與證據

產品118、交付來源38–118共81，未知119拒絕。19基本／明確啟庫26、26組input/output schemas、Agent1／draft3／lyrics-review1保持；沒有新route、static asset、operation、依賴、模型、登入、外網或路徑／寫入權限。lyrics-review CLI仍只提供明確input。

16新JS案例、原v117完整還原、八份跨語言／原版診斷、320歷史交付及原生三類fault／正常retry證據見[QA](QA-v0.118.0.md)。report與SHA不證明實聽同步、作品權利或創始身分。PolyForm Noncommercial 1.0.0／private、創辦ZOE. G／GitHub djguan-jpg保持，FreeTWAI not_submitted。見[交接](HANDOFF-v0.118.0.md)。
