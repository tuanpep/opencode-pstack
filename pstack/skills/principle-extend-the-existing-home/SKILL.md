---
name: principle-extend-the-existing-home
description: "Apply before writing or moving code in a repository that already has modules and layers. Find the existing owner of this behavior and extend it; do not open a parallel file, folder, or helper."
disable-model-invocation: true
---

# Extend the Existing Home

Before the first edit, name the home this change extends: the module path, the layer, and the sibling feature you are matching.

**Why:** The file that mentions the task is often a caller, not the owner. A new util, service, or feature folder next to that caller duplicates a home that already exists one directory over.

**Find the home:**

- Run `node scripts/find-home.mjs <repo>` in this skill's directory when the owning module is not already obvious. It prints candidates. Pick the one that matches the task. Then read that module's directory and imports.
- Read project `AGENTS.md`, `docs/agent-progress.md`, or the architecture note when the repo has one.
- Use the repo's own layer names. Map the change onto those names: presentation (render, events, view state), application (one user action), domain (rules that do not know HTTP, UI, or the database), infrastructure (database, HTTP, queue, filesystem), shared (only when two modules already import the same helper).
- Follow the sibling's dependency direction. If domain code does not import the database, this change does not either.
- A new project, a new package, or a new top-level module has no sibling. Stop and run the **architect** skill. Leave the module uncreated until its Practice section exists.

**Write there:**

- Extend that module. A new file is justified only when neighbors are already split the same way (one file per use case, one file per entity).
- Put each part of the change in the layer the sibling uses for that part. A validation rule that siblings keep in the domain module stays in the domain module. Mapping that siblings keep in the controller stays in the controller.
- Leave the repo's existing layers in place. A `utils` file, wrapper, or package this kind of change does not already use stays uncreated.
- If two homes look plausible, extend the one whose callers and types already match. Name the other home in the reply.
- If no home exists after that search, match the nearest sibling feature's layout. Leave new top-level conventions uncreated.

**The tests:**

- Run `node scripts/check-layers.mjs <repo>` after a UI change. A hit names the file to fix. The infrastructure import moves to the module that already owns persistence.
- "Which existing file would a teammate open to change this behavior?" Edit that file, or its sibling in the same module.
- "Does a sibling feature already have a file for this kind of logic?" Match it.
- "Am I about to create a file because the file I opened feels crowded?" Look up the directory that already owns the concern first.

**Workers:** The brief's paths are the home. If those paths are a caller and the owner lives elsewhere, stop and report the mismatch. Leave a third location uncreated.
