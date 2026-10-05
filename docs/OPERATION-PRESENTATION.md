# 目前處理列契約

窄視窗的成果區位於長表單後方。v90在390×844啟動歌曲報告時，取消button top3618.4375px，超出目前viewport。v91將同一button/提示移到main最前的單一sticky區；處理中可隨捲動找到本次動作與取消入口，idle隱藏。不是第二套取消或全域自動保存。

| 來源 | 呈現 | 能力 |
| --- | --- | --- |
| 四個known scope與發起時button文字 | 工作台：動作 | 只顯示metadata |
| gate running | 處理中、可取消 | 原native abort/current失效 |
| gate cancelling尚未settle | 正在取消等待、取消disabled | 原busy保持 |
| gate idle | bar hidden、title/note/context空 | 原finally恢復控制 |

operation-presentation.js純context/describe，重用本專案strict Unicode checker。四固定scope、action最多128codepoints、僅scope/action鍵，整理metadata空白，不改原button或創作來源。gate view只有busy/cancelling/canCancel三bool且必須一致；未知或矛盾拒絕，不猜可取消狀態。idle不讀過期context。輸出隔離新物件，文字literal，不是領域schema、草稿或Agent wire。

固定operation-control-dom begin隔離擷取metadata，app.run在gate begin前呼叫，錯metadata不能留下owned job。後續refresh只capture原gate，title/textContent與單一bar/cancel/note狀態；busy保持原label，不因後續button文字重取。idle清文字與private context；existing owned focus-return判定保持，後續焦點不搶。沒有來源、媒體、歴史、成果或保存checkpoint讀寫、timer、scroll API、URL或事件擴張。

main上方sticky、桌面top8px/手機6px；minmax文字欄與單一取消button、literal換行及40px最低button高度。不是modal，不自動聚焦。390×844、320×568及1440×900經實際click/Enter/End與DOM位置核對，沒有以geometry單獨當完整視覺驗收。其它browser/zoom/螢幕鍵盤與輔具未驗證。

operation-gate及每request的signal、後端/domain/application/CLI/Agent/MCP不改。取消fetch不代表backend停止；本機不可中斷的讀檔/雜湊仍依原busy直到settle。library/search/backup/file-preview/ZIP-import保持原獨立controller。server只serve一新增固定JS資產，無取消endpoint、kill、權限、依賴、模型或auth変更。15/22、Agent1/draft3及既有schemas保持，product91/supported38–91共54/unknown92拒絕，legal4/private/FreeTWAI not_submitted保持。

八項新test_operation_presentation.js核對四scope、metadata隔離/上限/Unicode、未知矛盾gate/idle不讀舊來源、literal DOM、cancelling/focus、下一動作label及實際run只捕捉一次並保留raw/history/media。v90取消測試增加真presentation注入與固定bar/title mock，原15項回歸意義保持。
