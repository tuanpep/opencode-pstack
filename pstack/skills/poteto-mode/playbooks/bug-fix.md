### Bug fix

**You own this task. Plan, review, verify.** Work in this session by default. Delegate only a bounded investigation or a bounded patch when isolation or a different model pays.

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix; it does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more. Same discipline for Perf, where the evidence is the trace.

1. Reproduce it yourself on the matching surface via the control skill (Non-negotiables). Don't hand the repro to the user. A debug or instrumentation protocol that says to ask the user does not override this; you drive the instrumented runtime. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. Won't reproduce directly, force it: synthesize the trigger, tighten conditions, or instrument until it fires. A bug you can't reproduce, you can't prove fixed.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Ground the affected files yourself. Load `how` only when the subsystem is unfamiliar. Use the **why** skill for regression history only when the current code does not explain the break. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. Drive a long or stubborn hunt with an OpenCode-compatible watcher or fixed-interval recheck. Confirm the surviving *mechanism* with runtime evidence before any design fan-out; a design grounded on a plausible-but-unconfirmed cause can be unanimously wrong while the real cause sits one subsystem over.
3. Plan the fix. Sketch the change here. Run `architect` only if the fix is a one-way-door shape change with two or more viable designs. Implement here unless isolation or a different model is needed. Use `research` only for bulk evidence this session should not keep. Delegate a bounded mechanical patch to `worker`. Escalate to `expert` only if the normal implementation tier cannot resolve a narrowed cause or the fix crosses a security, concurrency, or data-loss boundary. Leaves do not spawn. Review the diff.
4. Verify on the same surface; the original repro now passes. "Inconclusive" or wrong-surface is not a pass; flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history; the diff tells the story. See the **tdd** skill for the failing-test-first cadence when the bug has a cheap local test path; skip it when the test would be expensive, integration-heavy, or unclear.
   This is the canonical **sequence-verifiable-units** principle skill, the failing test first and the fix on top.
6. Run **Opening a PR**.

Fan out `how` + `why` as parallel leaf researchers only when both are actually needed and the history hunt is large. Otherwise stay in this session.

**Reply:** what was broken, root cause, fix, how you verified. Paste failing-then-passing repro output verbatim.
