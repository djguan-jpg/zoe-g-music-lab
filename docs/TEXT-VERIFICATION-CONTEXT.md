# 原文差異的有限前後文

## 分層與來源

原有核對失敗只列第一個byte位置；實際native前測在第18byte的emoji差異無法直接辨認來源。新的text-byte-context只讀兩份有界Uint8Array，找第一個不同byte或共用前綴的結尾；明確includeContext布林才派生片段。原text-verification以同一次text-download.prepare及原候選自有副本服務inspect與inspectWithContext，完整來源掃描一次，七欄report1的键、值與輸出保持。片段來自這兩份原始bytes，不從DOM preview、隱藏form、檔名或hash推測。

Controller沿同scope／revision／完整原名與原文、visible／busy／dirty、latest token、選定File metadata與讀取bytes長度核對，再提交report與有限difference。返回view隔離兩個nested側邊值；onReport仍只給原七欄report與原File metadata，草稿／接受條件保存確認不接收片段。原備份proof只有SHA與大小，無原ZIP bytes，因此維持既有結果與能力。

## 邊界与字面顯示

單檔原8MiB保持，各側以差異index的前16bytes至後16bytes（包含該byte）作半開窗口，兩端UTF-8 continuation最多各延伸3bytes，因此最多39bytes。EOF可能没有該byte，以null及明確檔案結尾顯示；空檔仍為有效原始bytes。range／total與原始hex精確，UTF-8以fatal decoder且ignoreBOM=true保留BOM。invalid片段只有hex，不以替換字元假裝有效；不自動修復或正規化。

顯示字串為帶引號的JSON跳脫文字，ASCII控制沿JSON逃脫，BOM、bidi、零寬及其他指定不可見控制顯為\uXXXX。這是呈現，完整bytes與Unicode不變；39byte窗口也不宣稱逐字、行號或完整語义解析。片段只用textContent，HTML如<script>顯為原文，不執行或載入。新來源／read開始／匹配／取消／失效／錯誤／pagehide／dispose清空兩側字串與hide；缺少可選區塊的legacy DOM沿原行為。選檔與取消焦點沿v152原政策，沒有新完成焦點動作。

三區塊接在現有note之後，note仍polite／tabindex=-1且只列簡短結果；片段有目前原文／選定檔案標籤及「非完整檔案」說明。pre-wrap／overflow-wrap:anywhere與容器min-width:0保持有限文字可換行；沒有固定雙欄、非同步捲動或自動保存。

## 接口及验证

僅一固定GET與固定script依賴次序：text-byte-context在text-verification前；主工作台script一次。没有新POST、operation、domain/wire schema、模型、路徑、權限、外網或依賴。22基本／29啟庫、Agent1／draft3、舊29組input/output schemas保持。唯一執行期policy38–153共116；未知154拒絕。

23新增測試涵蓋舊七鍵report逐序列值、8MiB尾端差異與匹配、strict option／type／capacity、BOM／CRLF／NUL／HTML／bidi、emoji視窗邊界、invalid／truncated UTF8／EOF／空檔、隔離DTO、取消／失效／late／讀取錯誤及三literal DOM入口／legacy。集中148、完整755Python／1892JS、152syntax與四Skills通過。

Native13次實際File選取；before由restore tag的三原模組鎖定，第18byte同大小差異只列位置。after12次選取：三入口同大小差異文字與hex、所有scriptChildren=0、invalid UTF8、emptyEOF、三匹配重試、取消舊read、來源F9清除與後續編修、QA注入讀取拒絕及重試。讀取完成閘門只延後真正File.arrayBuffer結果，不是慢磁碟；部分早期snapshot處於pending，驗證使用其後仍保留的實際settled DOM，不補寫原證據。12/12settled、gates0、console0；正式三區塊、asset一次及CSScomputed文字換行核對。兩自有server原handle63043／83175均EOF0、context closed及deadline joined，兩頁關閉。沒有saved download、完整窄尺寸視覺／screen reader、實聽／媒體／Host接受。

QA preparation第一次固定asset文字anchor不符，版本／HTML／CSS已寫；只修原tuple，不重跑部分mutations。首次native validator將pending snapshot當作final，focused helper regex誤認檔名；保留原terminal失敗record，改讀已完成的真DOM並以正確九舊檔加新測試重驗。早期cleanup先寫未確認EOF的receipt被標記premature並保留，兩個original EOF確認後才建立有效cleanup；不回填舊證據。

## 可逆、授權與外部狀態

restore-v0.152.0-before-v0.153.0 →392655b2cf64ee0689608fafc437615cb1f32920；codex/iteration-v0.153.0。原v152封裝2954468bytes／SHA b0c22af54f9ed3acea5b738b9789cca92f638b17b2b150a90df01133eabbfd5a，原launcher／deadline順序755Python／1869JS還原與CRC通過，暫存移除。四scope460歷史ZIP／manifest逐bytes與29舊schemas／原整份／原列比較保持。

六法律／平台文件原bytes保留；PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg，無AGPL／商用追加。本輪唯讀登入與四公開投稿核對；會員清單同Repo只列一項，四個公開submission頁各自存在，原作者自行聲明／未核實，不能宣稱創始認證。不改平台、不重送。最新三封裝保護、strict超七天可重建才清理，partial36/53/141／unverified77／草稿／素材保持；rolling goal active。

最後補查保存確認onReport回呼錯誤：保留原七欄report／callback契約，只清除差異片段並沿原onError提示。新增一項回呼失敗測試、完整755Python／1892JS與集中149JS重驗。此條件在原生13次選檔後以注入controller驗證；沒有將它冒充native回呼失敗或磁碟错误。
