---
description: Detect available models and write ~/.pstack/models.conf for pstack roles.
agent: code
---

Load the `setup-pstack` skill in full and follow it. Detect models available in this session, confirm role mappings with the user, and write `~/.pstack/models.conf`. Do not invent a model slug that is not available. `inherit-parent` and `auto` are always valid.

$ARGUMENTS
