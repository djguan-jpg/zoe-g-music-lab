# 單句逐項導覽（v0.120）

選擇「要調整的歌詞」，檢查選定歌詞後，以表格旁「上一項單句待辦／下一項單句待辦」逐一定位原欄位；修改後用「重查這一句」。工具列在長表格捲動時保留，原時間、文字、作品宣告與音檔由使用者編修，導覽只改焦點與頁面。

## 共用純控制器

issue-cursor.createController新增maxDetails選項；只接受safe integer 1–200，在capture前檢查，bool／string／非有限值／範圍外拒絕。預設32與原段落／鏡頭訊息、狀態、成功focus後核對來源的行為保持；本單句adapter明確選200，不將報告的完整issue_count冒充保留detailCount。own JSON guard沿原cursor實作，getter／額外欄位拒絕不讀。來源revision或detailCount變更重設cursor；stale／busy／hidden拒絕定位；false或throw focus不前進。

issue-page.reveal(index,revision)先capture與present判定canLocate，確認保留範圍與revision，再次capture核對全部metadata相同才選floor(index/20)頁。只在頁改變時發布；已在本頁返回true而不發布。不focus、不改資料、不依全部計數定位未保留項，舊view／refresh／reset／move／locate保持。pager沿既有metadata guard，本次不宣稱增加一般化own JSON安全驗證。readiness-page-dom只額外暴露reveal，原20項/頁保持。

## DOM與原欄位

lyrics-cue-review-dom以report.issues.length最多200作cursor，full issue_count只做literal容量提醒；external onLocate成功後才pager.reveal，再依cursor原成功後檢查提交進度。list click經pager current page／revision到cursor.locate，工具列move可以跨頁，手動分頁只讀清單不改cursor，點清單才指定原global index。資料檢查與報告仍沿原cue-review完整source／stable IDs／selection proof與shared application。

toolbar重查按鈕使用原onCheck，visible／busy／選句存在才啟用；前後按鈕沿cursor gates。更新DOM先render pager再refresh cursor，報告新revision回頁0與尚未定位。原source精確復原可恢復舊純診斷，但必須同時核對原值、IDs與選句，其他句原生focus改選句也參與來源。

app.focusCueReviewIssue只定位原selected issue的connected／enabled欄位並確認activeElement；全局row0指向作品宣告。以既有MusicEditorFieldPosition.scrollOffset核對活動欄位rect、viewport及可見toolbar bottom；畫面外toolbar不當成覆蓋，instant window.scrollBy只改捲動。不增自訂快捷鍵、不寫時間、不改media playback。

## 排版與容量

cue-issue-tools使用sticky top8px、literal live status、wrap buttons與anywhere note，最大寬度100%。高度≤400px回static，使工具列不佔滿低高度viewport。CSS及app幾何分層；這只驗證本轮三組viewport及mouse／native Enter，不是完整視覺或assistive technology認證。

全部220項、保留前200項與每頁20項清楚區分，導覽最多200項。零單句待辦不代表whole lyrics、匯出格式、實聽、權利或平台接受。cursor／page／focus／toolbar都不進draft3、Agent wire或成果report。

## 邊界與驗證

没有新增domain、operation、route、固定asset、依賴、模型、auth、path／寫檔權限或媒體生成。20基本／27明確啟庫、旧27組schemas、Agent1／draft3及cue-review1保持；產品120與policy38–120共83，未知121拒絕。詳見[QA](QA-v0.120.0.md)與[交接](HANDOFF-v0.120.0.md)，上一輪[單句報告契約](LYRICS-CUE-REVIEW.md)继续適用。
