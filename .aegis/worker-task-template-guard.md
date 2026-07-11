# Worker Task Template Guard: commit_sha Required

**Ticket:** 27b5a53f-7861-4e16-a43c-62bd13b0b312
**Severity:** critical
**Added:** 2026-07-11

## Rule

All `component` and `page` deliverable registrations MUST include `commit_sha` in the `metadata` field.

## Why

The code-approval gate in `review_deliverable` checks for `commit_sha` in metadata before approving any component or page deliverable. If `commit_sha` is absent, the gate blocks approval with:

```
no commit_sha in metadata. Marked 'failed'; not approved.
```

This stalls the pipeline at the "engineering" step and requires a manual fix run.

## Required metadata shape

```json
{
  "commit_sha": "<full 40-char SHA of the commit containing the delivered files>",
  "files": ["<list of files changed>"],
  "task_title": "<task title>",
  "repo_url": "https://github.com/AEGIS-OSX/<repo>"
}
```

## How to get the commit SHA

After committing via `github_commit_as_bot`, the tool returns a `sha` field in its response. Use that value as `commit_sha` in the subsequent `register_deliverable` call.

Example:

```
// 1. Commit the file
const result = await github_commit_as_bot({ ... });
const commitSha = result.sha;

// 2. Register the deliverable with commit_sha
await register_deliverable({
  project_id: "...",
  deliverable_type: "component",
  status: "ready_for_review",
  metadata: {
    commit_sha: commitSha,   // <-- REQUIRED
    files: ["app/components/MyComponent.tsx"],
    task_title: "My Component",
    repo_url: "https://github.com/AEGIS-OSX/my-repo"
  }
});
```

## Enforcement

- Sterling reviews all component/page deliverables before approval.
- Any deliverable missing `commit_sha` will be rejected at the gate.
- Workers must not report "complete" until `register_deliverable` has been called with `commit_sha` in metadata.

## Root cause (ticket 27b5a53f)

Deliverable `19f27e3d-c768-4e38-992c-2230ac18b73a` (project `65bcc89c-4656-4c5f-b4bd-5edda9a8abe2`) was registered after 3+2 review cycles without `commit_sha` in metadata. The underlying code was committed to main (verify-scope-a) but the metadata field was omitted in the final `register_deliverable` call. The approval gate blocked, stalling the pipeline at the "engineering" step.

The correct `commit_sha` for the globals.css fix on verify-scope-a main is: `ad0553d50d81a2b0abe08fff1cb8e14131da9bf3`
