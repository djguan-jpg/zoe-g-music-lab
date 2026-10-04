# v0.52.0 驗證

442 Python／672 JavaScript／55語法／4 Skills與git diff --check通過；一個新Python及十八個新JS回歸。真實HTTP asset逐bytes／script順序／API→Node guard與真Python application→JS已核對原文字元、空白cue、排序、時長推估、完整包來源歷史。自洽錯文字／title／time／duration／inference／notes、獨立LRC／SRT／JSON替換、重複key／過大JSON／metadata／files／未知schema拒絕；隔離副本／鍵順序、UI late-before-check／原列ID／不破壞timing preview／retry通過。現有CLI／JSON-lines／MCP測試包含完整套件；沒有新增工具或schema。

基線v51实际app handler：有效的其他歌詞package及不完整data/files都替換原句與成果，兩次重現收據保存。修正以純expectedBuild／checkedResult共用建立與所有timed匯入，不把單純JSON自洽當來源核實。

原生tab87／本機QA server PID338608：JSON array含三句、尾空白／tab／U+0085／U+2028／U+2029／<b>／inline clock及空白cue；先preview、Space Apply、Build保留原字元、排序及5.875 estimated last_cue_end，宣告仍blank。控制HTTP共11回覆：7正常、2錯來源、1損壞SRT、1缺meta／files。錯來源Build及Read、損壞及不完整Build都拒絕，原source／rows／duration／prior output及待套用timing提案保持，原有效download仍可用。正常retry同資料，成功才停用舊timing Apply；舊卡片status文字不是ready的證據。

後續第一句literal編修及明確總長10先停旧download；Space Build後provided10、時間／其他原句／空白cue保持、原source未被改寫，SRT原文字元一致，沒有b元素。完整package選定宣告10／historical shift0.125／一條合成review note，preview／Space Apply／Build後全部語義保持。第一次直接JSON.stringify comparison因object鍵排序差異false，依canonical語義核對true；不是產品資料變更，不把false比較宣稱bug。三寬度390／1024／1800，document scroll375／1009／1785，source右359／973.1640625／1299，build右162／397.8359375／418，無document溢出。warn／error0，tab87關閉，viewport reset。

server原session69143正常exit0，context closed、lazy staging未建立。v51指定ZIP1074104bytes、SHAb9ad8a2ce89e784e55f0c43e392c528981f1af2a8a7a028fd25c0598cbc28c39，還原441／654通過、限定temp移除。本輪指定source ZIP再全測；private PR／prerelease／actual遠端bytes／digest／CRC／legal4／tree／refs／clean及latest52／51／50／typed jobs依outputs/v52-qa收據。只清除>7天且exact Git/tag可重建候選；failed36／unknown／媒體／draft／backup／其他程序保持。

沒有新增模型或媒體生成；未選正式音檔，本輪不重試native download，保存檔未驗證。HTML preview未完整語義驗證；SRT空白句／原排版不無損。正式媒體／實聽／完整視覺／特定Host／瀏覽器保存／FreeTWAI仍待，platform not_submitted，rolling active。
