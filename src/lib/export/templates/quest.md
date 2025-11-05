---
tags: [quest]
status: "{{status || 'active'}}"
owner: "{{owner}}"
faction: "{{faction}}"
arc: "{{arc}}"
type: "{{type || 'main'}}"
---

# 📜 {{title}}

**Status:** {{status}}
**Owner:** {{owner}}
**Faction:** {{faction}}
**Arc:** {{arc}}
**Type:** {{type}}

---

## 🎯 Objective
{{objective || 'A single-sentence purpose of the quest.'}}

---

## 🧩 Summary
{{description || 'Brief description or recap of events so far.'}}

---

## 🧭 Steps / Phases
{{#if phases}}
{{#each phases}}
{{@index}}. {{this}}
{{/each}}
{{else}}
1. 
2. 
3. 
{{/if}}

---

## 💀 Consequences
{{#if consequences}}
{{#each consequences}}
- {{this}}
{{/each}}
{{else}}
- 
{{/if}}

---

## 🔗 Related NPCs / Locations
<!-- Related entities will be linked automatically -->

---

## 🪶 Notes
{{#if notes}}
{{notes}}
{{else}}
Use this for DM commentary, pacing beats, or rewards.
{{/if}}

{{#if sourceSessions}}

---

## 📚 Campaign References
*Referenced in Sessions: {{sourceSessions}}*
{{/if}}