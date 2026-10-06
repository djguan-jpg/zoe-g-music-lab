# v0.142.0 交接與可逆

restore-v0.141.0-before-v0.142.0 固定 1973198007715e6f75bbd83b893d7b60e9b221fe；分支 codex/iteration-v0.142.0。另建codex/restore-*從tag經PR還原，不rewrite已公開tag、不覆寫草稿／媒體、不撤銷投稿。

## v0.142.0 完整測試與 worker 完成證據

修正成功測試隱藏skip及封裝只有passed字樣的證據缺口。test_run_summary純有界frame／source／counts／original-handle核對 → 原兩worker runner自我登記及communicate → --report-json／預設文字 → packager二次驗證並把獨立schema1摘要保存於manifest.checks.python_run。721 Python執行、1權限skip、0expected failure，1734 JS／148語法／四Skills通過；新增17 Python，原handle成功及deadline失敗實測，損壞摘要即使exit0也不能發manifest。

來源38–142共105版、未知143拒絕；416歷史ZIP／manifest bytes及28 tool schemas保持，五adapter比較／backup與10版原record／draft匯出、82合成JSONhash保持。v141指定ZIP實際還原704／1734，原launcher不改。21／28工具、Agent1／draft3／run1及release manifest1 root保持，無新Agent／HTTP操作、依賴、frontend差異或持久服务。兩worker／120秒cap及outer150秒不變；只控制自有Popen handles，不全域列舉或signal外部程序。

PolyForm Noncommercial1.0.0、public、ZOE. G／djguan-jpg與四份submitted_unverified保持。還原tag、codex分支、CHANGELOG／HANDOFF、指定source ZIP／SHA可逆；最新三版與嚴格七天／Git重建規則保持，rolling goal active。

# v0.142.0 QA

| 項目 | 直接證據與範圍 |
|---|---|
| 上版重現 | 原v141 runner執行兩個synthetic methods、其中一skip，stdout只有Ran 2 tests／OK，沒有skip數／worker摘要。 |
| 純層 | 11項：source groups／順序／duplicates、strict bool／counts、two frames／duplicate JSON／Unicode／bytes、typed identity／different PID／EOF0、unknown schema、skip subTests／事件counts／detail双cap、good-bad-good與隔離。 |
| 實際runner | 5項：正常JSON與預設文字、4 methods含2 skip events／1expected failure，Windows自有worker原PID＋creation證據及EOF後reader核對；failed test無success report、group／parentflag互斥、1.2秒synthetic deadline只處理自有slow worker且原handle EOF。 |
| packager | release metadata9項，其中新增1項：實際Git archive含synthetic source，process exit0／錯誤summary仍拒絕manifest，保留FAILED／ZIP並停止後續node檢查。 |
| 完整回歸 | 721 Python執行、1真symlink因權限1314 skip、0expected failure，1734 JS全部通過；148 syntax／四Skills及diff check，155 commands exit0。 |
| 原worker | 本次full run實際group0 330 methods／group1 391 methods；兩個typed run在startup自我登記、原Popen handle EOF0，JSON摘要與完整父端discovery相符。 |
| 還原 | 指定v141 source9436ce4479efa85a56b4d4c52e867d78dc9bdd53，ZIP2713758bytes／SHA9811dbc89ffe92fdabf8eaf2467de986dba85ef6fca96b090a77687233bf061c；CRC／source核對、實際704 Python／1734 JS，原launcher不改、暫存移除。 |
| 相容 | 四scope×104歷史producer＝416個ZIP／manifest bytes相同；28 input/output schemas完整相同，來源38–142／105版、未知143拒絕。 |
| Agent／資料 | 五adapter完整比較／backup inspect、good/bad/good，10版record／draft bytes相同，82合成JSONhash保持；實際匯出ZIP timestamps不同，不宣稱整包bytes相同，未save／restore。 |
| UI／服務 | web及server／CLI／Agent／MCP adapters沒有diff，沒有browser或持久workbench；兩個runtime ephemeral HTTP正常shutdown／join及subprocess EOF。 |

唯一full-run skip ID：test_maintenance_space.SpaceFilesystemTests.test_external_symlink_is_skipped_without_following。摘要只列ID、無理由文字；本機測試既有1314 skip已知，沒有把skip當成執行通過。

本輪space metadata snapshot 19868檔／697917417logical bytes，strict>7days 0檔；獨立stat-only總和一致，exclusive receipt拒覆寫。space不是deletion policy，發佈後另核對全部release及typed jobs；保留最新142／141／140、v77 alternate與partial36／53／v141失敗封裝、草稿／媒體／未知與失敗QA。

startup helper初次預期版本常數誤沿較早值而exit1，實際audit／space完整觀察已保存；corrected helper只核對原資料，25個上輪typed parents均terminal，無重查或假造狀態。上輪初次失敗封裝child未取得個別handles仍未驗證，本輪typed摘要不能回填歷史缺口。

仍未驗證：browser實際保存檔、完整視覺／screen reader、真媒體實聽／音畫同步、Host安裝、平台正式founder。GitHub CI未配置，六法律／平台收據與四份投稿不變；本輪沒有重送或平台mutation。程序證據只限自有direct handles，不能宣稱整機沒有其他工作或任何descendant無殘留。

指定source commit／tree、ZIP／SHA、PR與remote asset bytes見manifest及outputs/v142-qa/source-evidence.json、release-remote-evidence.json、goal-turn.json。最新摘要與兩worker native run分别保存；package manifest.checks.python_run须重新decode核對。managed parents和direct worker要actual EOF＋same-host typed身份，unknown保留，不用裸PID清理。rolling goal active，繼續本工作區的可重現產品／Agent及browser接受缺口。
