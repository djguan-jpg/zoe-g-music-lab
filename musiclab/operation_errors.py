# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Sanitized selected-source I/O messages; no exception paths or private content."""
def io_message(operation):
    if operation in ('draft_backup_export','draft_search'):return '選定草稿庫無法讀取；請檢查啟動時的 --draft-library。'
    if operation=='delivery_inspect':return '選定交付ZIP無法讀取；請檢查啟動時的 --delivery-zip。'
    if operation=='audio':return '選定音檔無法讀取；請檢查啟動時的 --audio。'
    if operation in ('draft_backup_inspect','draft_backup_restore'):return '選定草稿庫或備份ZIP無法讀寫；請檢查 --draft-library 與 --draft-backup。'
    if operation in ('draft_read','draft_list','draft_save'):return '選定草稿庫無法讀寫；請檢查啟動時的 --draft-library。'
    return '本機讀寫未完成；請核對明確選定的來源。'
