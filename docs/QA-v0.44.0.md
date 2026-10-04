# v0.44.0 驗證

範圍只有本工作區的新合成文字、ZIP、PCM WAV與通用工具；四份法律／創辦紀錄保持。沒有新增依賴、模型、Host設定或auth。

v43 的8 MiB來源可選小檔，但完整8388526-byte原檔仍超過512 KiB Agent files JSON cap，且未知分段欄位拒絕；Browser只有開頭摘錄。v44先完整核對，再讀明確有界原文範圍；接續必須pin前次archive SHA。預览摘錄與全文下載保持，新增獨立閱讀入口。

387 Python／582 JS／48 syntax／4 Skill與diff通過；新增10 Python／10 JS。覆蓋BOM／emoji／混合換行／NUL／literal HTML／empty／EOF、UTF-8中間起點拒絕、4–16384邊界／未知／null／boolean／互斥欄位、來源改label仍拒絕接續、未選取檔CRC破壞仍拒絕與完整baseline比較。四scope8 MiB／64檔，原文首／中／尾端有限回覆；escape膨脹回覆仍有界。實際CLI覆寫拒絕及明確覆寫、不同cwd的Agent／MCP兩段原文與application一致、12工具／schema與無自動寫檔。

JS prepared buffer 的整份8 MiB Unicode來源以最多513段拼回逐字一致，buffer不外露。reader讀取前隔離key，途中key變更拒絕；重試錯誤保留頁面、未知回覆／位置／容量拒絕。快取一次一份最多8 MiB，取消／新選檔／編修／套用撤回失效；切換缺檔來源也明確釋放。獨立測試核對同來源跨段只編碼一次，返回原檔重新編碼；history512及16 KiB固定頁面有界。

原生四scope，每份incoming3段與baseline2段到EOF，共20段，逐段DOM正規化換行後的UTF16長度／FNV32指紋與Python window相同。44個分段／empty／missing／literal／清除狀態核對，加large與後續編修／延遲取消共50次觀察。FNV只是顯示核對，不是密碼學完整性證明；四份實際全文下載則與原ZIP逐bytes及SHA完全相同。Unicode強制跨段位置16383，次段完整emoji；missing與empty提示、前／後／回開頭、明確Apply／Undo與保持baseline通過。

Browser原生8 MiB來源的首三段均16384 units，舊baseline與後續作品名稱保持。原WAV和實際技術report SHA均為 `4db8ab9ef4ade05e5640e175431e58dc649bdf06ea31c8b4bf0c7238d8cc2a2b`、96044 bytes，report0.44.0／needs_review；所有原ZIP與WAV保持。

Tab從readonly原文到下一段，Enter讀後段；Shift+Tab到前一段，Enter回首段，實際focus ID核對。390／1024／1800×900 DOM geometry無橫向溢出，reader與三個按鈕在面板內；console0、自有tab75關閉、viewport reset、原server handle正常退出、staging0／root清除。沒有把DOM幾何稱作完整視覺驗收。

指定前版v43 ZIP952799 bytes／SHA `6999f304f9546a431f18201fc91e31849561db97b2e4bb2feea31224f69ed171` 還原後377Python／572JS通過，限定暫存已移除。當版exact source解包完整checks／Agent／MCP，private PR／Release／actual remote asset bytes與hash／refs／tree／clean main依收據。latest44／43／42保護；超7天且Git/tag／archive SHA可重建才清，無候選不刪、FAILED／素材／草稿／備份／未知及其他程序保持。

最終快取修正後另開自有tab76，核對首／次段、缺檔清空、返回原檔首／次段、切舊來源與取消七個狀態；唯讀保持、console0、tab正常關閉、smoke server正常退出、staging0。原生DOM確認導覽與清空，buffer釋放由獨立JS測試確認。

正式媒體與實聽、完整視覺、特定Agent Host、FreeTWAI創始人接受仍未驗證；not_submitted，rolling active。
