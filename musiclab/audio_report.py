# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Canonical human-readable audio text; no measurement or I/O."""
import math
from .json_document import utf8_bytes

MAX_TEXT_BYTES = 8 * 1024 * 1024
MAX_INTEGER = 9007199254740991
REASONS = {
    'below_gate': '沒有高於 -70 LUFS 絕對門檻的完整區塊',
    'insufficient_duration': '音檔不足 400 ms，沒有完整量測區塊',
    'unsupported_channels': '聲道位置未知；只支援單聲道與立體聲',
    'unsupported_sample_rate': '響度取樣率範圍為 8000–192000 Hz',
}


def decimal(value, places):
    """Binary64 scale, half away from zero, then integer decimal formatting."""
    if type(places) is not int or not 0 <= places <= 8:
        raise ValueError('音檔文字報告精度不支援')
    if type(value) not in (int, float) or abs(value) > MAX_INTEGER - 1 or not math.isfinite(value):
        raise ValueError('音檔文字報告數字無效')
    scale = 10 ** places
    scaled = abs(value) * scale
    if scaled > MAX_INTEGER - 1:
        raise ValueError('音檔文字報告數字超過界限')
    units = math.floor(scaled + 0.5)
    sign = '-' if value < 0 and units else ''
    return sign + str(units // scale) + ('.' + str(units % scale).zfill(places) if places else '')


def _integer(value):
    if type(value) is not int or not 0 <= value <= MAX_INTEGER:
        raise ValueError('音檔文字報告整數無效')
    return str(value)


def _text(value):
    if len(utf8_bytes(value, label='音檔文字報告')) > MAX_TEXT_BYTES:
        raise ValueError('音檔文字報告超過界限')
    return value


def render(report):
    """Render declared report values without changing their JSON precision."""
    try:
        lines = [f"# {_text(report['file'])}：音檔交付檢查\n", f"結果：{_text(report['status'])}\n",
                 f"{_integer(report['sample_rate'])} Hz · {_integer(report['bit_depth'])}-bit · {_integer(report['channels'])} 聲道 · {decimal(report['duration_seconds'], 6)} 秒\n",
                 '\n| 聲道 | Sample peak dBFS | RMS dBFS | DC offset | 滿刻度樣本 |\n|---|---|---|---|---|\n']
        if type(report['per_channel']) is not list or len(report['per_channel']) > 32:
            raise ValueError('音檔文字報告聲道無效')
        for state in report['per_channel']:
            peak = '-∞（靜音）' if state['peak_dbfs'] is None else decimal(state['peak_dbfs'], 3)
            rms = '-∞（靜音）' if state['rms_dbfs'] is None else decimal(state['rms_dbfs'], 3)
            lines.append(f"| {_integer(state['channel'])} | {peak} | {rms} | {decimal(state['dc_offset'], 8)} | {_integer(state['full_scale_samples'])} |\n")
        loudness = report['loudness']
        value = f"{decimal(loudness['integrated_lufs'], 6)} LUFS" if loudness['status'] == 'measured' else f"不可測：{REASONS[loudness['status']]}"
        relative = '不可測' if loudness['relative_gate_lufs'] is None else f"{decimal(loudness['relative_gate_lufs'], 6)} LUFS"
        lines.append(f'\n## 整合響度\n\n{value}。\n')
        lines.append(f"\n400 ms 區塊／100 ms 步進；完整區塊 {_integer(loudness['complete_block_count'])}，絕對門檻後 {_integer(loudness['absolute_gate_block_count'])}，相對門檻後 {_integer(loudness['gated_block_count'])}。相對門檻 {relative}；末尾 {_integer(loudness['tail_frames'])} 幀未形成下一完整區塊。\n")
        lines.append('\n獨立實作 ITU-R BS.1770-5 Annex 1 K-weighting 與 -70 LUFS／-10 LU 門檻；未指定平台響度目標、未正規化、未量測 true peak，尚非完整規範認證。響度不可測不更改既有技術接受結果。\n')
        lines.append('\n## 本次接受條件\n\n| 項目 | 實際值 | 接受值 | 結果 |\n|---|---|---|---|\n')
        for key, accept, unit in [('sample_rate', 'rates', 'Hz'), ('bit_depth', 'bits', 'bit'), ('channels', 'channels', '聲道')]:
            if type(report['checks'][key]) is not bool or type(report['acceptance'][accept]) is not list:
                raise ValueError('音檔文字報告接受條件無效')
            accepted = ', '.join(_integer(v) for v in report['acceptance'][accept])
            lines.append(f"| {key} | {_integer(report[key])} {unit} | {accepted} {unit} | {'符合' if report['checks'][key] else '不符'} |\n")
        lines.append('\n## 需確認項目\n\n')
        if type(report['warnings']) is not list:
            raise ValueError('音檔文字報告提醒無效')
        lines.extend(f'- {_text(item)}\n' for item in report['warnings'])
        if not report['warnings']:
            lines.append('本次技術條件沒有提醒項目。\n')
        lines.append('\n本工具預設不是平台通用交付標準。RMS 不是 LUFS，sample peak 不是 true peak。滿刻度樣本需聆聽確認；沒有評估音樂品質或授權。\n')
        lines.append(f"\n來源 SHA-256：`{_text(report['sha256'])}`\n")
        if 'source_evidence' in report:
            source = report['source_evidence']
            lines.append(f"\n分析副本：{_integer(source['bytes'])} bytes；PCM format tag {_integer(source['wave_format_tag'])}；block align {_integer(source['block_align'])} bytes；byte rate {_integer(source['average_bytes_per_second'])} bytes/s。\n")
            lines.append('\n雜湊與量測使用同一次複製的位元組；不代表檔案系統的原子快照或著作權證明。\n')
        if 'quiet_regions' in report:
            quiet = report['quiet_regions']
            lines.append(f"\n安靜段（門檻 {decimal(quiet['threshold_dbfs'], 0)} dBFS）：頭 {decimal(quiet['leading_seconds'], 6)} 秒，尾 {decimal(quiet['trailing_seconds'], 6)} 秒。\n")
            correlation = '不可測' if report['stereo_correlation'] is None else decimal(report['stereo_correlation'], 6)
            lines.append(f'\n立體聲相關性：{correlation}（不是音樂品質評分）。\n')
        return _text(''.join(lines))
    except (KeyError, TypeError, IndexError) as error:
        raise ValueError('音檔文字報告不完整') from error
