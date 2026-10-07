# 新增歌詞的毫秒候選

工作台按「新增一句」，既有adapter先拒絕busy與10000列上限，再把最後一列的原end交給純lyrics-timing.nextCue。末列end缺少或Python欄位空白則從0秒起草；有值沿共享LyricTime.normalize(nonnegative=true)核對十進位、負值、有限與毫秒精度。原值不修剪／改寫。

純候選以毫秒整數加3000，再沿LyricTime.seconds核對安全整數及毫秒可回讀的秒數，最後生成start／end字串及空白歌詞。0.119接成3.119，不暴露浮點加法的3.1189999999999998；候選超限整份拒絕。沒有只驗start便使用未驗end的路徑。

只有完整候選通過，DOM才分配row ID、追加原entries、render、markDirty與聚焦新文字。拒絕保留所有原列／ID／原值、作品宣告、音檔、其他工作台與ID序列。busy、列數、Unicode／負下溢拒絕維持原行為；不新增模組／route／operation／schema或權限。

新增仍是三秒起稿，末列留白仍從0起草，沒有替使用者補完校時或裁切到宣告。完整歌詞包建立另沿原Python／application驗所有句子、正規化時間並排序；後續原文保留，不以新增成功冒充完整包、保存下載或實聽。

tests/test_cue_add.js既驗純候選10001個毫秒來源，也執行真app.js adapter：一般／精度邊界、來源拒絕、ID與busy／10000列、不覆寫原文、焦點及原領域接受。原VM busy／focus測試補上產品原本已載入的MusicTiming，原assert保持。Chrome使用原WorkbenchHandler，沒有QA覆寫器或mock writer。
