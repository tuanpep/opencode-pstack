---
description: Execute a non-trivial engineering task with focused investigation and direct verification.
agent: deep
---

Read the relevant files first. Use existing repository conventions and keep changes minimal. Sketch in this session and implement. Skip `how`, `architect`, and `arena` unless the shape is unknown or expensive to reverse. Work directly; delegate at most one hop to a leaf (`@research`, `@worker`, or `@expert`). Do not nest subagents. Verify the result directly with the narrowest meaningful check, followed by broader checks when repository guidance or change scope requires them. If verification is blocked, report the evidence and unverified scope instead of claiming success. Load only skills that directly match the task. Do not load `poteto-mode` or a playbook unless the task requires that process or the user explicitly requests it.

Task:
$ARGUMENTS
