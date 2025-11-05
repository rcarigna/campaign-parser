---
tags: [location]
region: "{{region}}"
type: "{{type}}"
faction_presence: {{faction_presence || '[]'}}
status: "{{status || 'known'}}"
---

# 🗺️ {{title}}

**Region:** {{region}}
**Type:** {{type}}
**Faction Presence:** {{#each faction_presence}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

---

## 🌍 Description
{{description || 'Atmosphere, geography, and general tone.'}}

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