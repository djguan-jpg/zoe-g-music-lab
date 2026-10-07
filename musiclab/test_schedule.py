# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Pure complete test-ID partition; no discovery, timing or process control."""
from .test_run_summary import MAX_TESTS, WORKERS, identifiers

# Approximate local diagnostic costs, not a benchmark or deadline guarantee.
# Unlisted/new methods retain a positive fallback; all discovered IDs still run.
DEFAULT_COST = 107
COST_HINTS = {
    "test_audio_acceptance_input.AcceptanceInputTests.test_actual_cli_report_handoff_and_exclusive_outputs_preserve_inputs": 860,
    "test_audio_acceptance_review.AcceptanceReviewTests.test_cli_status_and_exclusive_outputs": 673,
    "test_audio_result.AudioResultTests.test_actual_cli_agent_mcp_http_after_invalid_requests_share_source_bound_current_reports": 985,
    "test_audio_statistics.AudioStatisticsTests.test_fixed_native_asset_and_real_http_agent_mcp_cli_reports_keep_same_domain_data": 970,
    "test_backup_download.BackupDownloadTests.test_actual_loopback_single_use_stream_and_fixed_assets_use_the_same_contract": 673,
    "test_backup_export.BackupExportTests.test_http_actual_origin_library_boundaries_and_existing_prepare_wire_remain": 625,
    "test_backup_result.BackupResultTests.test_native_file_hash_actual_http_full_wire_and_fixed_asset_order": 625,
    "test_delivery_search.SearchTests.test_actual_cli_search_only_metadata_overwrite_and_mixed_flags": 1094,
    "test_delivery_search.SearchTests.test_four_scopes_full_large_original_tail_positions_and_followup_window": 1908,
    "test_delivery_selection.SelectionTests.test_cli_explicit_outputs_include_full_large_text_and_refuse_default_overwrite": 955,
    "test_delivery_selection.SelectionTests.test_real_agent_and_mcp_from_other_cwd_share_selected_result_and_leave_source_unchanged": 656,
    "test_delivery_text.TextWindowTests.test_cli_explicit_window_metadata_refuses_overwrite_and_invalid_mixed_settings": 1516,
    "test_delivery_text.TextWindowTests.test_four_scopes_large_64_file_archive_returns_labeled_bounded_original_with_full_metadata": 1563,
    "test_delivery_text.TextWindowTests.test_real_agent_and_mcp_two_windows_from_different_cwd_do_not_write_or_change_source": 1032,
    "test_delivery_text.TextWindowTests.test_windows_reconstruct_original_bom_emoji_mixed_newlines_controls_and_literal_html": 1188,
    "test_draft_compare_browser.BrowserDraftComparisonTests.test_large_cues_complete_counts_and_detail_limit_match_python": 923,
    "test_draft_compare_row.DraftCompareRowTests.test_browser_full_report_and_markdown_match_python_for_all_collections_and_statuses": 735,
    "test_library_result.LibraryResultTests.test_real_loopback_asset_pages_and_read_wires_preserve_source_and_host_origin_gates": 750,
    "test_library_search.LibrarySearchTests.test_actual_four_adapters_share_full_source_search_cursor_and_browser_validator": 1735,
    "test_loudness.LoudnessTests.test_real_cli_agent_mcp_and_http_share_the_measured_result": 1000,
    "test_lyrics_media_handoff.LyricsMediaHandoffTests.test_real_cli_exports_all_three_choices_without_changing_source_or_overwriting": 1033,
    "test_lyrics_package.LyricsPackageTests.test_actual_cli_roundtrip_bom_other_cwd_no_override_and_no_overwrite": 1110,
    "test_lyrics_search.LyricsSearchTests.test_actual_cli_agent_mcp_good_bad_good_and_exclusive_outputs": 641,
    "test_maintenance.MaintenanceFilesystemTests.test_changed_token_bytes_age_or_tag_refuse_without_deletion": 2875,
    "test_maintenance.MaintenanceFilesystemTests.test_corrupt_archive_or_extra_user_files_never_become_candidates": 1906,
    "test_maintenance.MaintenanceFilesystemTests.test_drafts_backups_media_other_outputs_and_partial_packages_preserved": 2656,
    "test_maintenance.MaintenanceFilesystemTests.test_oversized_recovery_journal_refuses_before_any_move": 2033,
    "test_maintenance.MaintenanceFilesystemTests.test_path_escape_normalization_output_refusal_and_unknown_record": 1642,
    "test_maintenance.MaintenanceFilesystemTests.test_real_cli_another_cwd_preview_prune_and_restore_and_invalid_flags": 3703,
    "test_maintenance.MaintenanceFilesystemTests.test_real_git_preview_prune_journal_restore_exact_and_no_overwrite": 3172,
    "test_maintenance.MaintenanceFilesystemTests.test_recorded_active_or_unavailable_process_blocks_pruning": 2455,
    "test_maintenance.MaintenanceFilesystemTests.test_reparse_guard_and_changed_receipt_destination_refuse": 1860,
    "test_maintenance.MaintenanceFilesystemTests.test_source_reproduction_failure_prevents_pruning": 2203,
    "test_maintenance.MaintenanceFilesystemTests.test_tampered_recovery_identity_or_unknown_version_refuse_all_publishing": 2720,
    "test_maintenance.MaintenanceFilesystemTests.test_zip_central_budget_refuses_before_entry_object_allocation": 1000,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_changed_unselected_identity_invalidates_the_complete_preview": 2813,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_default_preview_shape_and_restore_record_actions_are_not_expanded": 2094,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_existing_cli_receipt_refuses_before_any_preview_or_prune": 1313,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_full_or_other_batch_tokens_cannot_authorize_this_selection": 4266,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_invalid_selection_refuses_before_audit_and_default_129_limit_remains": 1328,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_latest_versions_changed_before_move_leave_journal_and_original_files": 2658,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_protected_unknown_and_noncanonical_selection_preserve_all_files": 2814,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_real_cli_two_package_batch_restore_and_remaining_candidate": 6000,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_recorded_running_or_unverified_job_blocks_selected_pruning": 3922,
    "test_maintenance_batch.PruneBatchFilesystemTests.test_selected_batch_still_obeys_the_unchanged_journal_byte_budget": 2985,
    "test_maintenance_catalog.MaintenanceCatalogTests.test_full_catalog_boundary_and_overflow_refuse_before_package_io": 1984,
    "test_maintenance_catalog.MaintenanceCatalogTests.test_real_129_entry_cli_preview_prune_restore_preserves_partial_files": 3970,
    "test_music_lab.IntegrationTests.test_cli_all_four_outputs_and_collision_refusal": 1110,
    "test_music_search.MusicSearchTests.test_actual_cli_agent_mcp_good_bad_good_and_exclusive_outputs": 656,
    "test_planning_markdown.PlanningMarkdownTests.test_cli_preserves_all_nine_file_bytes_and_refuses_replacing_each_output": 798,
    "test_process_probe.ProcessProbeTests.test_real_cim_parent_never_declares_live_original_terminal": 6641,
    "test_process_probe.ProcessProbeTests.test_real_cli_fallback_from_other_cwd_blocks_live_then_accepts_original_exit": 10017,
    "test_process_probe.ProcessProbeTests.test_real_managed_child_cim_live_then_original_eof_and_empty_query": 6453,
    "test_release_archive.GitArchiveTests.test_legacy_reconstruction_mismatch_is_retained_without_profile_inference": 689,
    "test_release_archive.GitArchiveTests.test_modern_prune_restore_reproduces_original_manifest_and_zip_after_config_change": 4250,
    "test_release_archive.GitArchiveTests.test_self_consistent_modern_manifest_cannot_hide_wrong_source_bytes": 860,
    "test_release_capture.ReleaseCaptureTests.test_real_git_overbudget_producer_and_names_reader_refuse_before_domain_or_archive": 1110,
    "test_release_metadata.CommittedReleaseTests.test_real_stale_commits_refuse_before_archive_or_destination_creation": 1298,
    "test_release_metadata.CommittedReleaseTests.test_successful_process_with_invalid_test_summary_cannot_issue_manifest": 766,
    "test_release_zip.ReleaseZipTests.test_real_git_producer_refuses_many_directories_before_zipfile_and_test_children": 5766,
    "test_storyboard_duration.StoryboardDurationTests.test_real_four_adapters_reject_old_total_then_accept_adopted_request_without_overwriting_source": 1172,
    "test_storyboard_ratio.StoryboardRatioTests.test_actual_agent_completed_custom_ratio_matches_browser_full_source_checks": 673,
    "test_storyboard_search.StoryboardSearchTests.test_actual_cli_agent_mcp_good_bad_good_and_exclusive_outputs": 704,
    "test_test_run_summary.NativeTestRunnerTests.test_actual_deadline_collects_owned_worker_and_refuses_success": 1345
}


def partition(ids, weights=None):
    """Balance estimated work, then preserve each worker's discovery order."""
    source = identifiers(ids, MAX_TESTS, 512)
    if not source or len(set(source)) != len(source):
        raise ValueError('Independent discovery must be nonempty and unique')
    hints = COST_HINTS if weights is None else weights
    if not isinstance(hints, dict) or len(hints) > MAX_TESTS:
        raise ValueError('Invalid test cost hints')
    identifiers(list(hints), MAX_TESTS, 512)
    if any(type(cost) is not int or not 1 <= cost <= 120000 for cost in hints.values()):
        raise ValueError('Invalid test cost estimate')
    loads = [0] * WORKERS; counts = [0] * WORKERS; assignments = {}
    ranked = sorted(enumerate(source), key=lambda row: (-hints.get(row[1], DEFAULT_COST), row[0]))
    for index, identifier in ranked:
        group = min(range(WORKERS), key=lambda item: (loads[item], counts[item], item))
        assignments[identifier] = group
        loads[group] += hints.get(identifier, DEFAULT_COST); counts[group] += 1
    return [[identifier for identifier in source if assignments[identifier] == group] for group in range(WORKERS)]
