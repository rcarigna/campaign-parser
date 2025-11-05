---
tags: [session, recap]
session_date: "{{session_date}}"
session_number: {{session_number}}
arc: "{{arc}}"
status: "{{#if status}}{{status}}{{else}}complete{{/if}}"
---

# 📘 Session {{session_number}} — {{session_date}}

**Arc:** {{arc}}

---

## 🧾 Brief Synopsis

{{#if brief_synopsis}}{{brief_synopsis}}{{else}}A 2–3 sentence elevator summary of the session.{{/if}}

---

## 📖 Full Summary

{{#if full_summary}}{{full_summary}}{{else}}Detailed recap of events, dialogue, and consequences.{{/if}}

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

## 🌒 Foreshadowing

{{#if foreshadowing}}
{{#each foreshadowing}}

- {{this}}
{{/each}}
{{else}}
-

{{/if}}

---

## 🧩 Threads Updated

{{#if threads_updated}}
{{#each threads_updated}}

- {{this}}
{{/each}}
{{else}}
<!-- Quest threads and entity references will be linked automatically -->
{{/if}}
