---
name: principle-extend-the-existing-home
description: "Apply before writing or moving code in an existing repository. Extend the owning module and preserve dependency direction. Permit cohesive extraction within that module; do not create a competing owner or split files merely to meet a line count."
disable-model-invocation: true
---

# Extend the Existing Home

Before the first edit, name the home this change extends: the module path, the layer, and the sibling feature you are matching.

**Why:** The file that mentions the task is often a caller, not the owner. A new util, service, or feature folder next to that caller duplicates a home that already exists one directory over.

**Find the home:**

- Search for the task's words and for a sibling feature that already does the analogous job. Read that module's directory and imports.
- Read project `AGENTS.md`, `docs/agent-progress.md`, or the architecture note when the repo has one.
- Use the repo's own layer names. Map the change onto those names: presentation (render, events, view state), application (one user action), domain (rules that do not know HTTP, UI, or the database), infrastructure (database, HTTP, queue, filesystem), shared (only when two modules already import the same helper).
- Follow the sibling's dependency direction. A UI file does not import the database. An API route or `src/routes` file may.
- A new project, a new package, or a new top-level module has no sibling. Stop and run the **architect** skill. Leave the module uncreated until its Practice section exists.

**Write there:**

- Extend that module and follow neighboring file conventions. A new file within the module is also justified when it isolates a cohesive responsibility behind explicit inputs and outputs. Name the responsibility and explain why the extraction reduces reader load; file length alone is not justification.
- Put each part of the change in the layer the sibling uses for that part. A validation rule that siblings keep in the domain module stays in the domain module. Mapping that siblings keep in the controller stays in the controller.
- Leave the repo's existing layers in place. Do not introduce a generic `utils` file, pass-through wrapper, or new package merely to relocate crowded code.
- If two homes look plausible, extend the one whose callers and types already match. Name the other home in the reply.
- If no home exists after that search, match the nearest sibling feature's layout. Leave new top-level conventions uncreated.

## Safe extraction within the owner

1. Establish current behavior with existing focused tests. If coverage is missing, add a characterization test for the behavior being moved before extraction. Do not silently change behavior to make the split easier.
2. Map the responsibility, callers, dependencies, state, and side effects. Keep tightly coupled code together. If the proposed split needs a large mutable context object or frequent cross-file access to private details, reconsider the boundary.
3. Choose the smallest useful extraction in the existing module and layer. Prefer explicit inputs and outputs, keep helpers private unless callers need them, and avoid circular imports. A new top-level module still requires `architect` under the placement rule above.
4. Move one responsibility at a time. Preserve public interfaces, error behavior, side-effect ordering, and state lifetime unless a separate change is authorized. Update imports and callers without unrelated cleanup.
5. Run focused behavior tests after each extraction and the relevant integration checks for affected callers. Compilation alone does not prove equivalence. Inspect the dependency direction and exported API as well as the result.
6. Judge the result by what a reader must trace and what state they must hold. If the extraction adds more indirection than it removes, revise or reverse only that extraction, preserving unrelated user work. Large cohesive files and generated code need not be split merely for size.

This is source organization, not frontend bundle splitting. Moving code into another source file does not by itself defer browser loading or reduce the initial bundle.

**The tests:**

- "Which existing file would a teammate open to change this behavior?" Edit that file, or its sibling in the same module.
- "Does a sibling feature already have a file for this kind of logic?" Match it.
- "Am I about to create a file because the file I opened feels crowded?" Look up the directory that already owns the concern first.

**Workers:** The brief's paths are the home. If those paths are a caller and the owner lives elsewhere, stop and report the mismatch. Leave a third location uncreated.
