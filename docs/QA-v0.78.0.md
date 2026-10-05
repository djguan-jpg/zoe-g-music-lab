# v0.78.0 驗證

基準 main `4ce819cab130006f78cb2d92aa719035b051999e` 的實際 tab125：六秒合成 WAV、方向鍵到0.5秒，再明確預覽／載入schema3草稿。原音檔已移除及隱藏，波形ARIA仍保留max6.000/now0.500，aria-disabled缺失且tabindex0。缺口與基準收據留在本輪 outputs/v78-qa；原tab已關閉、基準server原handle92912正常exit0並完成context與deadline thread清理。

修正版純定位模型→注入來源重查controller→DOM與原生player組合。八項新測試涵蓋未知shape、空／錯／非有限媒體、分秒小時進位但原值保持、普通／細調／邊界／組合按鍵、無效滑鼠幾何、來源與時長改變、writer failure、dispose、DOM歸零與事件移除、固定asset與生命週期組合。Focused26通過。

完整545 Python在原固定兩隔離worker／120秒整體期限內67.235秒通過；909 JavaScript、84語法模組、四份Skill及diff check通過。原Python application／CLI／Agent／MCP、工具、wire與領域schema無改動；產品registry current78／明確38–78共41項／unknown79的測試同步。

實際tab126共16觀察，以原生filechooser選six.wav、broken.wav、two.wav及現代草稿。半秒0.5、Shift0.55、上鍵1.05、下鍵／細調0.5、Home／左0、End／右6、Shift左5.95、滑鼠中心3.005231；ARIA與可見時間同步。原句0.2/1.2/保留原句🎵、歌名、宣告6.000與dirty保持。損壞音檔顯示播放錯誤且滑桿歸零停用，兩秒新音檔可到1.95秒而作品宣告仍6.000。

390px實際Shift定位0.05秒、焦點waveform；waveform/readout/hint均left16/right359/width343，無局部水平overflow。明確載入草稿後音檔清除，ARIA max/now0、disabled=true、tabindex-1；重新選六秒WAV後0.05秒定位恢復，全部四台60個表單欄位前後相同。console warnings/errors0，viewport重設、tab關閉；修正版server原handle9495正常exit0、context/deadline thread清理且兩server皆未建立備份／交付staging。

160個四scope×40歷史版本的文字ZIP與manifest，由實際v77指定source封裝的producer生成，再與現版逐bytes比較及完整回讀，原文保持。首次QA helper沿用300000B內部回覆門檻，新增歷史版本使回覆304321B被門檻拒絕；失敗record保留，fresh retry限定512KiB內部回覆且不輸出base64，160份全通過、temporary restore清除。產品容量門檻未改。

v77指定source ZIP/SHA/CRC、原碼545/901與原包bounded launcher還原通過，temporary restore清除；結果見previous-restore-evidence.json。指定source封裝再獨立跑完整suite、Agent及MCP metadata；private PR/prerelease、實際遠端下載／digest／CRC／legal4／四refs／tree／clean main與最終盤點以本輪外部收據為準，避免原碼封裝自指。

僅盤點本outputs、direct release pairs及明確same-host run identities。最新78/77/76保護，strictly>7天且exact Git/tag現場可重建才可候選；failed36/53、unknown/media/草稿/備份/其他程序保留。所有helper含失敗record保留，每批最多32個，不擴大核心程序上限或列舉／終止其他程序。

未驗證完整視覺、screen-reader、連續播放、人工實聽、瀏覽器保存檔案、正式媒體、作者／權利或平台創始人接受。本輪測試為合成來源與暫態播放定位；14/21／Agent1／draft3／legal4／private／not_submitted保持，rolling goal active。
