---
tags: [location]
region: "{{region}}"
type: "{{type}}"
faction_presence: {{#if faction_presence}}{{faction_presence}}{{else}}[]{{/if}}
status: "{{#if status}}{{status}}{{else}}known{{/if}}"
---

# 🗺️ {{title}}

**Region:** {{region}}
**Type:** {{type}}
**Faction Presence:** {{#each faction_presence}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

---

## 🌍 Description

{{#if description}}{{description}}{{else}}Atmosphere, geography, and general tone.{{/if}}

---

## 🧠 Points of Interest

{{#if pointsOfInterest}}
{{#each pointsOfInterest}}

- {{this}}
{{/each}}
{{else}}
-
-

{{/if}}

---

## 🧩 Key NPCs
<!-- NPCs located here will be linked automatically -->

---

## 🧶 Hooks & Secrets

{{#if hooks}}
{{hooks}}
{{/if}}

---

## ⚙️ Relevant Quests

{{#if sourceSessions}}
*Referenced in Sessions: {{sourceSessions}}*
{{/if}}

<!-- Links to related quests will be generated automatically -->