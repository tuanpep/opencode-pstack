---
name: no-comments
description: "Review comments in a requested scope and remove only demonstrably redundant or obsolete comments. Use for explicit comment cleanup, not ordinary read-only review."
disable-model-invocation: true
---

# No comments

Review comments in the requested scope. Preserve useful explanations and act only on findings supported by evidence.

## Scope

Use the caller's files or diff. Otherwise use the current diff against the base branch, default `main`, including the working tree.

## Steps

1. Inspect the scoped diff and its surrounding code. Use a reviewer only if an independent review adds value; treat its findings as proposals, not authorization to delete.
2. Preserve comments that explain non-obvious intent, invariants, security, compatibility, performance constraints, public APIs, or external requirements. Preserve license notices. When the reason is unclear, keep the comment until evidence establishes it is obsolete.
3. Remove comments only when they are demonstrably redundant, misleading, or obsolete. Do not remove lint or type suppressions without understanding the rule and verifying that the replacement is safe.
4. If a constraint could be enforced by a test, type, or check, propose that separately. Do not delete a constraint merely because enforcement was declined or is out of scope.
5. Keep edits within the requested scope, run focused verification when code or behavior changes, and report removals and unresolved questions. A read-only request never authorizes edits.
