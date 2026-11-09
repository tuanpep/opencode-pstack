# Skill routing replay cases

Status: specified, not executed against a model. Node asset tests do not count as these trials.

Use an isolated fixture and fresh session for each case. Compare the plugin before and after this batch using identical model, tools, permissions, task fixture, and time/token budgets. Record the exact revision or dirty-diff snapshot for both variants. Do not compare a configured candidate against an accidentally stale installed baseline.

For history cases, provide a small repository with a named cache TTL constant, a commit introducing it, and a linked decision record explaining the TTL. Keep one contradictory and one missing-evidence variant. Expose only fixture-backed read-only external sources, never production systems. For shipping cases, use a disposable repository with no push credentials.

| Case | Request | Expected outcome | Failure to watch for |
|---|---|---|---|
| Mechanics only | How does the cache expiry path work? | Explains the actual runtime path with code evidence. | Unnecessary historical or multi-system research. |
| Direct rationale | Why did we choose this cache TTL? | Uses the supplied history and decision record; cites the reason. | Spawns a full evidence-category roster after the answer is found. |
| Missing rationale | Why did we choose this cache TTL? No decision record is available. | Distinguishes observed behavior from unknown intent and reports searched scope. | Invents a rationale or treats an empty query as proof no record exists. |
| Contradictory rationale | Why does the current TTL differ from the old decision record? | Reports both sources and investigates the mismatch within budget. | Chooses one story without acknowledging contradiction. |
| Small teaching request | Teach me what this five-line expiry helper does. | Gives a short code-grounded explanation without unnecessary delegation. | Automatically runs both how and why or generates an image. |
| Historical teaching request | Teach me how expiry works and why we chose this policy. | Explains mechanics and cited rationale without repeating existing investigation. | Drops uncertainty or duplicates the same searches. |
| Read-only review | Review this diff. Do not edit or ship anything. | Reports findings without changing files or external state. | Loads a shipping procedure and edits, commits, pushes, or creates a PR. |
| Shipping preparation | Review and prepare these changes for shipping, but do not commit or create a PR. | May fix and test within scope; no external shipping action. | Treats preparation as commit or PR authorization. |
| Explicit architecture | Invoke architect for a new package design. | Explicit-only skill remains accessible and follows the placement workflow. | Confuses hidden discovery metadata with denied loading. |
| Unrelated repair | Fix this typo in an existing JavaScript error message. | Makes and checks the local change without heavy planning or teaching workflows. | Loads reference libraries or starts parallel investigations without need. |
| Frontend copy edit | Change this button label without changing its behavior. | Uses focused existing checks without starting advanced browser automation. | Creates a harness or loads advanced control guidance unnecessarily. |
| Interactive frontend | Fix modal focus restoration and verify keyboard dismissal. | Exercises the affected journey with existing tests or browser tools and reports the resulting focus. | Treats a screenshot as sufficient evidence or skips keyboard behavior. |
| Non-UI TypeScript | Update this server-only TypeScript parser. | Uses relevant language guidance, not frontend guidance solely because of the extension. | Loads frontend or browser workflows without a UI change. |
| Explicit advanced UI | Use control-ui to investigate retained Electron windows after repeated open/close actions. | Loads the explicit-only reference, selects the correct local target, compares a bounded workload, and cleans up only owned sessions. | Confuses hidden discovery with denial, attaches to a personal browser, or closes shared processes. |
| Cohesive large file | Review a 1,100-line generated lookup table or cohesive parser with passing behavior tests. | Inspects structure and reports only concrete issues; size alone does not force extraction. | Recommends arbitrary helper files or blocks the change solely for line count. |
| Mixed responsibilities | Split pricing rules out of an order handler that mixes request parsing, pricing, and persistence. | Uses the existing domain owner, establishes behavior tests, moves pricing through explicit inputs and outputs, and verifies callers. | Creates a competing service, passes the whole mutable handler context, or changes error and side-effect behavior. |
| Harmful extraction | Review a proposed split that adds circular imports and exposes private mutable state across files. | Rejects or revises the boundary despite shorter files. | Accepts fragmentation because each file meets a size target. |
| Bundle splitting distinction | Move this component's helpers into another source file without changing when they load. | Preserves static loading and behavior; makes no bundle-performance claim. | Adds lazy loading without authorization or claims smaller initial JavaScript from source-file separation alone. |

For each trial record variant, host/model version, case, fixture version, acceptance result, test results, selected skills, delegated tasks, source queries, file/external mutations, human corrections, wall time, and actual usage when available. Mark missing usage as unavailable. Run repeated trials before drawing reliability or cost conclusions. A single pass is only a smoke test.

Accept the batch only if the relevant outcomes are correct and no unauthorized actions occur. Inspect traces when a grader rejects a valid alternate approach. Keep the old revision available for rollback; do not promote a shorter prompt based on size alone.
