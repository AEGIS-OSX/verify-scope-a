# Worker Task Template Guard: Mandatory `commit_sha` in Deliverable Metadata

**Ticket:** 27b5a53f-7861-4e16-a43c-62bd13b0b312  
**Severity:** Critical  
**Date:** 2026-07-11  

## Rule

All `component` and `page` deliverable registrations MUST include `commit_sha` in the `metadata` field when calling `register_deliverable`.

## Why

The `review_deliverable` approval gate checks for `commit_sha` in metadata before approving any component or page deliverable. If `commit_sha` is absent, the gate blocks approval with:

```
"no commit_sha in metadata. Marked 'failed'; not approved."
```

This stalls the pipeline at the `engineering` step and requires a manual fix run to recover.

## Required Pattern

```typescript
// CORRECT: always include commit_sha
await register_deliverable({
  project_id: "<project-id>",
  deliverable_type: "component",  // or "page"
  status: "ready_for_review",
  metadata: {
    commit_sha: "<full-40-char-sha-from-github_commit_as_bot-response>",
    branch: "<branch-name>",
    // ...other metadata
  },
  // ...other fields
});
```

## How to Get the SHA

The `github_commit_as_bot` tool returns `{ sha, url, files_changed, ... }` on success. Capture the `sha` field and pass it directly into `metadata.commit_sha`.

```
// After committing:
const result = await github_commit_as_bot({ ... });
const commitSha = result.sha;  // use this
```

## Enforcement

- Workers MUST NOT call `register_deliverable` for component/page types without `commit_sha` in metadata.
- If a commit has not yet been made (e.g., draft registration), set `status: 'draft'` and update metadata with `commit_sha` before transitioning to `ready_for_review`.
- Sterling reviews all component/page deliverables; any missing `commit_sha` will be caught at the approval gate and returned to the worker.

## Recovery Procedure (if commit_sha is missing)

1. Find the correct commit SHA: search `github_list_commits` on the target repo for the commit touching the relevant file.
2. Update the deliverable metadata via `supabase_execute_sql`:
   ```sql
   UPDATE project_deliverables
   SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('commit_sha', '<SHA>')
   WHERE id = '<deliverable-id>';
   ```
3. Have a reviewer bot (not the producing bot) call `review_deliverable` with `verdict='approved'`.
4. File a ticket if the pipeline step is stalled.

## Affected Deliverable (Historical)

- **Deliverable ID:** `19f27e3d-c768-4e38-992c-2230ac18b73a`
- **Project:** `65bcc89c-4656-4c5f-b4bd-5edda9a8abe2`
- **Correct commit SHA:** `ab633f3eb79011c070702d3ab46d8edca292b64f` (most recent globals.css fix on verify-scope-a main, 2026-07-04)
- **Pipeline run stalled:** `f24fa3c8-1090-4578-9aca-44dffebdc891`
