# Skill review, 2026-11-09

## Recommendation

Simplify routing before deleting capabilities. The bundle contains 59 skills: 54 in pstack, 3 in thermos, and 2 in opencode-workflow. Of pstack's skills, 22 are `principle-*` references. A smaller automatically advertised set is useful, but source-file count alone does not measure request cost. Some skills already disable model invocation.

The first behavior change narrows `why` research. It previously required full parallel investigation across available evidence categories, allowed more investigators than the workflow's two-research ceiling, and prescribed a host-specific `readonly: false` setting. It also treated an empty tracker search as evidence that a decision was not ticketed. The updated procedure follows linked evidence first, keeps read-only access, respects leaf and concurrency limits, and states uncertainty accurately.

No skills were removed. There is no usage evidence sufficient to call any capability unused, and the installer does not reconcile arbitrary retired source skills with previously copied user assets.

## Priority order

1. Fix bounded research in `pstack/skills/why/SKILL.md`. Applied in this run. Agent behavior replays remain pending.
2. Reconcile installed agent drift before runtime comparisons. The host check reports installed `deep.md` and `pure.md` differ from this repository. Inspect and preserve intentional customizations; do not blindly overwrite them.
3. Test changed descriptions with both matching and unrelated requests. Measure the current plugin against a proposed variant, not only against `pure`, which changes multiple factors.
4. Review explicit-only discovery for heavy or occasional workflows. Retain explicit access. Do not assume hidden metadata prevents loading, and do not advertise token savings before measuring actual requests.
5. Design safe retirement before deleting skills. `install.js` copies directories and has a fixed stale-asset list, rather than a general ownership manifest. Ordinary plugin setup in `index.js` passes `cleanup: false`. A future retirement needs deliberate migration tests, including preservation of modified user assets.

## Skill decisions

These are review recommendations, not a claim that every proposed discovery change has been applied. Each ID below is relative to its bundle's `skills/<id>/SKILL.md`.

| Bundle and skills | Decision | Reason |
|---|---|---|
| opencode-workflow: `check-agent-compatibility`, `continual-learning` | Keep | Distinct compatibility audit and verified-learning jobs. Keep learning separate from automatic memory accumulation. |
| pstack: `setup-pstack` | Keep | Owns plugin-specific model configuration. |
| pstack: `fix-ci`, `loop-on-ci` | Keep | Repairing a known failure differs from an explicitly requested monitoring/repair loop. Do not merge by name similarity. |
| pstack: `verify-this` | Keep | A claim-level baseline/treatment investigation differs from routine test execution. |
| pstack: `control-cli`, `cli-for-agents`, `frontend-ui`, `typescript-best-practices` | Keep task-scoped | Concrete environment or implementation expertise. Frontend guidance follows UI behavior, not file extensions alone. |
| pstack: `control-ui` | Explicit-only | Retain advanced Electron/CDP and profiling guidance and existing playbook compatibility. Routine frontend verification uses existing tests or host browser tools directly. |
| pstack: `how`, `why` | Tighten | Preserve runtime-mechanics versus motivation distinction. `why` research fan-out and evidence inference repaired in this run. |
| pstack: `deslop`, `no-comments`, `unslop` | Tighten | Code simplification, comment review, and prose editing are distinct. Avoid blanket comment deletion or loading a prose style manual for every technical response. Preserve the user's existing edits to these files. |
| pstack: `tdd` | Keep task-scoped | Useful when a failing test can guide implementation. Do not require a formal TDD process for every edit. |
| pstack: `review-and-ship` | Keep authorization-gated | Shipping has different side effects from a read-only review. Do not infer commit or PR authorization from a generic review request. |
| pstack: `architect`, `arena`, `poteto-mode`, `swarm` | Explicit-only candidates | Heavy design and orchestration tools need clear opt-in boundaries. Preserve architecture placement callers and existing playbook references. |
| pstack: `automate-me`, `blast-radius`, `bro`, `figure-it-out`, `interrogate`, `show-me-your-work` | Explicit-only candidates | Occasional workflows should not compete with ordinary implementation routing. Check existing invocation metadata before changing it. |
| pstack: `create-verification-skill`, `maintain-verification-skill` | Keep, explicit-only candidates | Creating and maintaining a repository verifier are different lifecycle tasks, not everyday verification. |
| pstack: `recall`, `reflect`, `technical-writing` | Keep, explicit-only candidates | Distinct retrieval, retrospective, and substantive writing tasks. Avoid automatic transcript ingestion or unverified durable rules. |
| pstack: `teach` | Tighten, consolidation candidate | Keep an explicit teaching entry point, but inspect whether combining `how` and `why` duplicates research rather than improving the explanation. No merge applied. |
| thermos: `thermos`, `thermo-nuclear-review`, `thermo-nuclear-code-quality-review` | Keep specialist routes | Combined wrapper and separate correctness/security and maintainability rubrics have distinct callers. Specialist rubrics need not be advertised as generic review skills. |

Keep these 22 pstack principles as a referenced library for now. Consolidation may reduce maintenance, but the first task is checking callers and navigation, not flattening them into the always-loaded workflow:

- `principle-boundary-discipline`
- `principle-build-the-lever`
- `principle-encode-lessons-in-structure`
- `principle-exhaust-the-design-space`
- `principle-experience-first`
- `principle-extend-the-existing-home`
- `principle-fix-root-causes`
- `principle-foundational-thinking`
- `principle-guard-the-context-window`
- `principle-laziness-protocol`
- `principle-make-operations-idempotent`
- `principle-migrate-callers-then-delete-legacy-apis`
- `principle-minimize-reader-load`
- `principle-model-the-domain`
- `principle-never-block-on-the-human`
- `principle-outcome-oriented-execution`
- `principle-prove-it-works`
- `principle-redesign-from-first-principles`
- `principle-separate-before-serializing-shared-state`
- `principle-sequence-verifiable-units`
- `principle-subtract-before-you-add`
- `principle-type-system-discipline`

No immediate RETIRE decision. Candidate merges must name the surviving skill, preserve safety requirements, migrate command and playbook references, and handle installed copies. The current user baseline already contains a Beads removal; this review did not introduce it.

## Research and verification

### First implementation batch

Implemented bounded `why` discovery text and investigator templates, simplified `teach` to reuse evidence and load only the investigation needed, and narrowed `review-and-ship` discovery to shipping intent with per-action authorization. Heavy workflows were already explicit-only, so their metadata was left unchanged. No skills were deleted or renamed.

`scripts/skill-routing.test.mjs` protects the written routing contracts and checks that installation preserves explicit-only assets and supporting resources. Both `npm test` and `npm run verify` run these checks. They are not model behavior tests. [SKILL-ROUTING-REPLAYS.md](SKILL-ROUTING-REPLAYS.md) specifies balanced behavior trials; those trials have not been run.

### UI optimization batch

Removed the routine `frontend-ui` dependency on `control-ui`. Frontend guidance now targets UI behavior rather than extensions, includes responsive and accessibility checks, and scales proof to the change. `control-ui` is explicitly loadable but not advertised automatically. Its generic browser scripts were removed; advanced Electron/CDP targeting, profiling, privacy, and process ownership rules remain. Existing explicit playbook callers still resolve. No installed-copy retirement is needed because neither skill was deleted or renamed. Installed copies receive these changes only through the normal plugin update/load path, not by editing global files during this run.

### Safe extraction batch

Updated the existing placement principle to allow cohesive extraction within the owning module, even when neighboring features have not already been split that way. Added behavior baselines, explicit interfaces, state and side-effect preservation, incremental verification, and rejection of harmful fragmentation. New top-level modules still require the architecture workflow.

Updated the thermos quality rubric so 1000 lines triggers structural inspection rather than an automatic finding. Recommendations must identify the responsibility, owner, interface, and behavior checks. No new decomposition skill was added. Static regression checks and positive/negative replay cases cover the written policy; model behavior trials remain pending.

See [RESEARCH-SOURCES.md](RESEARCH-SOURCES.md) for the dated source pass, including Anthropic's 2026-11-06 memory article, current OpenCode V2 discovery behavior, the Agent Skills specification, and evaluation guidance. The [reusable review prompt](SKILLS-REVIEW-PROMPT.md) defines the fuller inventory, source ledger, replay design, migration plan, and implementation gates for subsequent passes.

Baseline: `npm test` passed 13 tests and `npm run verify` passed. Host inspection reports OpenCode v2.2.6 with installed primary-agent drift. No global files were changed. These checks do not demonstrate improved model routing, reduced cost, or live permission enforcement. Those require isolated behavior trials with the same model and settings.
