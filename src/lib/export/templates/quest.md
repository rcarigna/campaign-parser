---
tags: [quest]
status: "{{#if status}}{{status}}{{else}}active{{/if}}"
owner: "{{owner}}"
faction: "{{faction}}"
arc: "{{arc}}"
type: "{{#if type}}{{type}}{{else}}main{{/if}}"
---

# 📜 {{title}}

**Status:** {{status}}
**Owner:** {{owner}}
**Faction:** {{faction}}
**Arc:** {{arc}}
**Type:** {{type}}

---

## 🎯 Objective

{{#if objective}}{{objective}}{{else}}A single-sentence purpose of the quest.{{/if}}

---

## 🧩 Summary

{{#if description}}{{description}}{{else}}Brief description or recap of events so far.{{/if}}

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
