# 校時播放速度契約

載入可定位的本機音檔後，於波形校時選擇0.5、0.75、1、1.25、1.5或2倍。原生播放器決定實際速度；選單與狀態顯示其回讀值。播放器外部選到其他有效正速度時保留該值、顯示「依目前播放器」，不自動調整。未就緒、busy、離開工作台時停用；回到工作台在panel visibility完成後刷新。

時間與速度分開：波形及逐句標記沿currentTime的音檔實際秒數，不乘除倍率。controller不seek、不play、不改source／defaultPlaybackRate／preservesPitch；瀏覽器音高保持與音質需實聽，這裡沒有音訊處理或跨瀏覽器音色保證。選擇速度不改草稿、歌詞包或dirty，不重建成果。

playback-rate.js只接受嚴格四欄metadata及共享wave-position media形狀，固定六個string選項；可用來源與目前速度前後核對。setRate回false、回讀不同、來源／時長／gate改變、dispose拒絕成功；原生已發生的寫入保留並顯示目前狀態，不重送或自動回滾。自然位置前進允許；nested setter期間不能再choose。兩層capture的隔離copy不提供外部媒體身份的原子保證。

playback-rate-dom.js只寫原生playbackRate；change與六個media事件由adapter擁有，pagehide／dispose移除自身listener，其他listener保持。app沿data-view-control排除草稿dirty，以目前visible／busy與media來源注入capture。兩固定GET JS受原asset allowlist控制；沒有POST、Agent操作、偏好存放、timer或新依賴。

本輪核對見[QA](QA-v0.169.0.md)，還原及接续見[交接](HANDOFF-v0.169.0.md)。
