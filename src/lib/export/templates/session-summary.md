---
tags: [session, recap]
session_date: "{{session_date}}"
session_number: {{session_number}}
arc: "{{arc}}"
status: "{{status || 'complete'}}"
---

# 📘 Session {{session_number}} — {{session_date}}

**Arc:** {{arc}}

---

## 🧾 Brief Synopsis
{{brief_synopsis || 'A 2–3 sentence elevator summary of the session.'}}

---

## 📖 Full Summary
{{full_summary || 'Detailed recap of events, dialogue, and consequences.'}}

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