---
tags: [character, npc]
faction: "{{faction}}"
role: "{{role}}"
status: "{{#if status}}{{status}}{{else}}alive{{/if}}"
importance: "{{#if importance}}{{importance}}{{else}}major{{/if}}"
aliases: []
location: "{{location}}"
---

# 🧑‍🎭 {{title}}

**Faction:** {{faction}}
**Role:** {{role}}
**Status:** {{#if status}}{{status}}{{else}}alive{{/if}}
**Location:** {{location}}

---

## 🧩 Summary

{{#if summary}}{{summary}}{{else}}Short one-sentence overview of who they are and what they want.{{/if}}

---

## 🧠 Description

- **Appearance:** {{description}}
- **Personality / Voice:**
- **Goals / Secrets:**
{{#if class}}
- **Class:** {{class}}
{{/if}}
{{#if race}}
- **Race:** {{race}}
{{/if}}
{{#if CR}}
- **Challenge Rating:** {{CR}}
{{/if}}

---

## 🧶 Relationships

- **Allies:**
- **Enemies:**
- **Ties to PCs:**

---

## 🕯️ Scenes / Quotes

{{#if tags}}
> [!quote] "Example line of dialogue."
{{/if}}

---

## 🧩 Quest Connections

{{#if sourceSessions}}
*Referenced in Sessions: {{sourceSessions}}*
{{/if}}

<!-- Links to related entities will be generated automatically -->