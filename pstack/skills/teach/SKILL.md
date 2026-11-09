---
name: teach
description: "Explain a change or subsystem in plain language at the reader's level. Use for 'teach me this' or 'help me understand X'. Reuse available evidence; investigate mechanics or historical rationale only when needed. Does not change code."
disable-model-invocation: true
---

# Teach

Explain what the thing is, how it works, and the reasons supported by evidence. The goal is understanding, not implementation or a report about your process.

## Workflow

1. Identify what the person wants to understand and what they already know from the conversation. State a reasonable scope rather than quizzing them before helping.
2. Reuse evidence already available. Read only enough code or documentation to fill the gaps. Do not rerun an investigation whose findings are already in context.
3. Load `how` when the mechanics need investigation. Load `why` only when historical rationale matters and is not already supported by cited evidence. Loading a skill is not spawning an agent. Do not require both skills or parallel investigations for every explanation. Follow the caller's delegation limits; leaves investigate inline.
4. Start with the smallest complete explanation. Trace a concrete example through the system when it helps. Add detail to match the requested depth rather than forcing every answer into a lecture or a fixed number of sentences.
5. Separate observed behavior from documented intent and inference. Preserve uncertainty and citations from the investigation. Say when the reason is unknown rather than inventing one from the code's shape.
6. Use a compact text or Mermaid diagram only when it clarifies the explanation. Generate images only when the user explicitly asks for them. Do not edit files, run mutating debugger actions, or change external state to teach a concept.

Use consistent terms and plain prose. Load `unslop` for substantive prose polishing when useful, not as a mandatory second workflow for every reply. Answer with the explanation itself. In an interactive exchange, leave room for follow-up without requiring quizzes or staged pauses.
