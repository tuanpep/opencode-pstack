### Feature

**You own the design, the diff, and verification.** Work in this session by default.

1. Ground the affected files yourself. Load `how` only when the subsystem is unfamiliar and spans multiple modules. If you already traced it this session, skip. `how skipped: already grounded` or `how skipped: local and obvious`.
2. Name the data shape and its organizing structure per **principle-model-the-domain**. Run `architect` only for a one-way-door or unknown shape with two or more structurally distinct viable designs. Skipping stays as `architect skipped: <reason>`. Do not fold a real design fork silently into implementation, and do not run arena "just in case".
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target (the **separate-before-serializing-shared-state** principle skill). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one owner is best, name why. One owner in this session is the default.
4. Implement here. Delegate a unit to `worker` only when it is independent, would flood this context, or needs a different model. Give that unit file paths, the named data shape, and success criteria; review its diff yourself. Use `research` only for bulk evidence this session should not keep. Use `expert` only when a one-way-door design or high-risk boundary needs it. Workers and experts are leaves; they do not spawn. Do not insert a research → expert → worker chain. Arena for implementation only when the user asked or the remaining fork is a one-way door. Comments per **Comments**. Surgical edits, re-ground against the source for upstream-derived files. Port shared-primitive improvements to all consumers and verify each. Commit liberally.
5. Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass; flag it.
6. Rebase into small, ordered commits; stack follow-ups.
   Use the **sequence-verifiable-units** principle skill, building, verifying, and committing each small unit before the next.
7. If the design is contested, `interrogate` before shipping.
8. Run **Opening a PR**.

Code-coupled work (one feature, one migration) stays with one owner in this session. Fan out leaf workers only after the blocking phase, and only for slices that produce independent artifacts. Parent-level fan-out is for audits, cross-subsystem investigations, and competing experiments. Rewrite the checkpoint at phase boundaries; spawn a fresh owner rather than chaining interrupts.

**Reply:** what you built, what you chose and why, open decisions. Tables for design alternatives.
