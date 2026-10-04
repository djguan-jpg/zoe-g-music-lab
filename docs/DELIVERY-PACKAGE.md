# 本輪完整文字交付 ZIP（v0.38.0）

工作台建立成果後，按「下載本輪所有檔案 ZIP（數量）」，一次取得目前工作台的全部文字成果及 DELIVERY-MANIFEST.json。切換工作台保留各自的成果；輸入修改後，上一份成果可以閱讀，需重新建立才可下載。處理中停用下載，成功送出不等於瀏覽器已保存，請核對本機檔案。

ZIP 不自行收集音檔、影片、專案草稿、版本庫或其他私人素材。成果本身會包含你輸入的文字；分享前仍需檢查隱私及權利。清單只核對提供的文字檔案，content_validation=not_performed；封裝不是創作、版權、音畫品質或實聽驗收。

## 共用輸入與版本

```json
{"scope":"music","label":"本輪原創合成交付","files":{"task.md":"原創任務\n","brief.json":"{}\n"}}
```

scope 為 music／storyboard／lyrics／audio。label 可省略，最多200個Unicode字元；files 必須含1–64項、UTF-8合計最多8MiB。JSON封套最多32MiB，含大量控制字元時可能先超過封套上限。檔名為單層ASCII、最多100字元，只接受 json／md／txt／csv／html／js／css／lrc／srt；拒絕路徑、Windows裝置名稱、大小寫衝突、保留清單名稱、重複JSON欄位及無效Unicode。空文字檔保留。

獨立delivery schema1，產品0.38.0；Agent protocol1、MCP2025-11-25、project draft3及其他報告schema保持。manifest包含tool_version、scope、原label、source_type=provided_text_files、file_count、source_bytes及排序後逐檔{name,bytes,sha256}。ZIP固定時間戳、ZIP_STORED、單層檔案，清單置於最後；相同版本與輸入產生相同bytes。外部摘要另含archive_name、ZIP bytes／sha256，ZIP本身不包含循環的自身SHA。

## CLI／Agent／MCP

```powershell
python music_lab.py delivery-package --input examples/delivery-request.json --out outputs/my-delivery
```

CLI 明確讀指定JSON，輸出固定 zoe-delivery.zip，預設拒絕覆寫。--overwrite 才替換指定目錄的該檔；排他發布保留競爭途中出現的目的檔，不搬移來源媒體。

Agent operation／MCP tool `delivery_package` 接受同一payload，預設回傳摘要清單，files={}、meta.needs_review=true，沒有自動寫檔、網路或模型呼叫。明確 include_archive=true 才回傳archive_base64；实际ZIP超過512KiB拒絕，改用CLI或工作台。Agent／MCP既有JSON行2MiB界限保持。重新discovery：基本11、明確啟庫16工具；新工具readOnlyHint=true／openWorldHint=false。

## 分層與本機下載

musiclab/delivery_package.py為純來源檢查、UTF-8雜湊、確定性ZIP及摘要；application共用它，delivery_files.py僅處理CLI明確目的檔。HTTP固定prepare／discard／download adapters重用有界下載staging，每類最多2個、60秒、一次性取得且核對ZIP SHA。discard只移除指定自身暫存檔；逾時及server_close清除自身檔，保留未知檔，無遞迴刪除或背景服務。保留loopback Host／Origin界限。

browser delivery-package.js為純來源／清單／回覆核對與注入controller，delivery-package-dom.js負責按鈕及原生GET下載form。沿共用run的scope／revision／busy及bundle dirty；雜湊前後、HTTP回來後、送出下載前重查完整來源。未知版本、額外欄位、檔數／順序／大小／雜湊／label／scope不符拒絕，有效自身ID會取消；外部或query下載URL不跟隨。後續編修、目前預覽選項與其他工作台保持，導覽及封裝不進draft。

## 重現與限制

`python -X utf8 -m unittest discover -s tests`、`node --test tests/test_*.js`；Windows可用本專案現有逐檔命令列展開。新測試檢查所有檔案bytes／manifest、容量、Unicode、覆寫及競爭、CLI實際程序、Agent／初始化MCP、HTTP take一次／取消／close、過期及錯誤來源。前端測試覆蓋晚回應、所有清單欄位及原生form失敗。

本輪合成QA四工作台原生ZIP下載、逐檔SHA與server摘要讀回、編修後取消與重建、手機尺寸鍵盤及桌面DOM幾何通過。正式音樂／影片、完整視覺審查、特定Agent Host及FreeTWAI創始人審核尚未驗證。


## v0.59 固定交付版本契約

`musiclab/assets/delivery-versions.json` 是產品版本與交付來源版本的唯一執行期資料源；`delivery_versions.py`／`delivery-versions.js` 純驗證後隔離保存，未知schema／缺失／錯序／重複／非標準版本即拒絕。Python package與inspection、browser package/import/report、application Agent／MCP metadata共用；schema和protocol不由產品版本推導。固定GET契約script沿既有本機Host／Origin門檻，無任意路徑或寫入。更新產品只改registry current及明確supported項，projects.json發布metadata需一致；歷史支援不靠range推測。測試保留獨立歷史oracle；封裝必須交叉核對registry／metadata／discovery。見[契約](DELIVERY-VERSIONS.md)。
