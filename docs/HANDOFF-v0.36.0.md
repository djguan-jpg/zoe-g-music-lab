# v0.36.0 交接與可逆

四工作台建立旁新增本輪狀態與查看／返回，解決窄螢幕需往下找成果。純presentation／controller／DOM分層，app只同步既有bundle／busy／status；無Agent權限、無draft／wire改動。處理中停用、舊檔可閱讀且下載保持停用；晚回應保留新內容與焦點，清空則返回build，換台清舊返回目標。見[契約](DELIVERY-NAVIGATION.md)。

300Python／443JS／4Skill／35syntax、12新測試；390px／1366px四工作台完整建立及焦點往返，實際report／draft3下載讀回，busy／500／4秒晚回應、原音檔保留，真draft載入清空返回build。詳見[QA](QA-v0.36.0.md)。owned tabs57／58關閉、viewport復原，三個QA server正常停止；正式媒體／實聽／完整視覺／特定Host／FreeTWAI與原生file播放仍待，rolling active。

## 分支與還原

branch codex/iteration-v0.36.0；restore-v0.35.0-before-v0.36.0指main起點98dbbaf1264bd4f1df088d7a0fdc1624a00f2ca5。前版source3453224ccfb25defc01298b0c871be0fd936ed1b、ZIP779188bytes／SHA2eab02130c1bb4c88e9e7bb5bee0de3e10d2026b9076a768ccac03c7b2a9637a解壓300／431通過，限定暫存移除。

本輪指定source／tree／changed files在outputs/v36-qa/source-evidence.json；ZIP／SHA／manifest、privatePR／Release／遠端bytes與refs在package-evidence、pr-evidence及release-remote-evidence。封裝只含指定Git commit；不包含outputs／秘密／原媒體，不覆寫同名封裝，GitHub CI未配置。

先另存未提交編修，再git switch -c codex/restore-v0.35.0 restore-v0.35.0-before-v0.36.0，或archive到新目錄。main用revert／privatePR保留歷史；草稿／素材／備份另存，Git不能代替。

## 維護與續做

發布後latest3為v0.36／v0.35／v0.34。用v35維護工具唯讀稽核本輪actual run1記錄／source tags／ZIP ledger；只超七天且可重建的完整封裝為候選，草稿／備份／媒體與未知程序保留。最終audit／process／inventory記錄實際服務結束、8875listener與刪除數量；沒有未知kill。若無候選，沒有搬移／刪除或journal。

下輪先建分支與restore，依可重現使用證據調整目標，繼續四工作台功能及正式媒體／完整視覺接受。保持產品與資料版本分離、非商用／private／作者揭露；沒有公開、平台投稿、auth或新增依賴授權。
