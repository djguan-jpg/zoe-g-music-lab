# v0.83.0 驗證

起點main1ebbdc66cf222b2c845b7d1998a5a87ba8dc1cde，restore-v0.82.0-before-v0.83.0及codex/iteration-v0.83.0。v82原controller的合成10000列×120更新實測row capture120、raw copies1200000、elapsed2267.6433ms，依baseline-performance-evidence.json。原生baseline300句成功seek1.5秒／原第151句與stable row-167，tab134已關閉；這是功能基準，不是browser performance trace。

修正後同一組120views逐值相同，capture1、raw copies10000、elapsed44.3776ms；單次本機Node測量，不以此推論browser FPS或通用提速倍數。另以restore tag的actual v82 applyCueTimes函式在合成VM與原cue-position adapter重現：media2秒，原start1.5被batch寫為2.5後仍enabled；現版force刷新後disabled，既有target仍拒絕越界。證據performance-evidence.json。

12項新增playback模型／controller／DOM／actual batch adapter測試；focused共71项。包括原順序、partial、exclusive end、last overlap、10000列120次只讀一次、來源隔離與invalidations、hidden／ready／error／busy／未知context、準備中失效、錯rows避免反覆解析、fresh focus繞過顯示cache與雙source重查、失敗不虛報、dispose、same-ID高亮／detached replacement、literal文字及owned listeners。完整554 Python67.953秒（2隔離worker／120秒總期限）、960 JS、90syntax及四Skills通過，checks-release.json；版本oracle46同步在JS全套執行前完成。

180組歷史交付ZIP／manifest（四scope×38–82）與v82實際producer bytes相同，來源歷史保持，compatibility-final-evidence.json。v82原source ZIP1570734bytes／SHA361ed79e5c34da971ea3132125335e568abb3ea2cb90bd43600a3053362ffca9，原包554 Python／948 JS還原通過且temp移除。CLI／Agent／MCP歌詞四檔逐UTF8 bytes相同，actual describe為product0.83.0／Agent1／MCP2025-11-25／14 tools；path拒絕及good/bad/good正常EOF，runtime-final-evidence.json。

原生tab135共25次觀察、300列／1022個editor欄位於seek+focus前後完全相同；literal文字編修即時、時間改壞清gap／valid retry、刪除／還原前列sameID／新DOM高亮、stamp及undo切換目前句、自然播放paused=false位置2.316764且focus仍歌詞151文字。media2秒下batch apply顯示原51、停用原151seek，undo恢復literal151與button；hidden清高亮／return不搶focus；新歌詞preview保留row-167、Apply改row-467；390px Enter定位原151。broken WAV ready0清顯示／marker、有效換檔恢復；全案draft3 preview保留media／300列，明確Apply後新一列、media ready0且無舊marker。console warn/error0。

390px button96px／document375px／table client343px、scroll765px；局部水平捲動及keyboard通過，不宣稱完整視覺／screen reader／實聽。兩自有tabs關閉、viewport reset；兩bounded servers沿原handle正常返回、context closed、deadline threads joined且無staging。合成資料、media及QA receipts只在忽略的outputs。

指定source封裝另驗suite及metadata；private PR、merge、tag、Release、actual download／SHA／refs／tree依後續source/package/release-remote-evidence，未預先宣稱發布完成。最後outputs／typed jobs依inventory及final-audit-aggregate；latest83／82／81保留，嚴格超七天且exact Git/tag可重建才列清除候選；草稿、媒體、failed36／53、未知及外部程序保持。legal4/private/not_submitted不變。
