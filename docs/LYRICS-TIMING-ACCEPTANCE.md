# 整批校時的實際寫入接受

純lyrics-timing依注入snapshot／applyTimes核對實際表格，API不新增操作。preview核對需求與來源；apply先捕捉隔離before，仍與原proposal完整fingerprint一致才能寫入。寫入後只取一次隔離post，檢查列數、同一順序及ID、目前文字與宣告都保持，全部start／end逐字等於目標，且寫入器未明確回false，再建立undo並宣布成功。

undo原本的非負時間及數值來源核對保持，允許後續合法等值排版、列順序、文字及宣告。寫入後再次核對本次before的順序／ID／文字／宣告，所有原時間字串實際還原才清除紀錄。原void native setter相容；明確false即使已寫完仍拒絕成功。期間reset清除的紀錄不能復活；cancel拒絕當次接受。正常DOM markDirty／invalidate仍相容。

寫入期間阻擋新preview、apply及undo，避免同期重入；完成或例外解除writing。沒有自動回滾、補寫或重送。套用失敗撤銷該預覽，實際表格保留並提示重新核對；仍存在的前次undo保留，之後仍需來源一致。撤回失敗保留仍存在的undo，部分寫入需人工修正回原applied-after時間與身份才可重試；不能以缺少紀錄造出身份或以失敗訊息推定表格完全未動。

測試涵蓋拒絕、無動作、部分與false-after-full、post欄位或原字串異動、reset／cancel及重入。Chrome QA注入拒絕寫入器證明接受行為，另恢復原void寫入器實際套用／撤回；不是宣稱native setter本身拒絕。時間文法與原值規則見[空白契約](LYRICS-WHITESPACE.md)、[原撤回來源契約](LYRICS-TIMING-UNDO.md)。

所有變更沿純controller→原DOM adapter，Python／application／CLI／HTTP／Agent／MCP、operation、schema、依賴、路徑與產品網路能力保持。
