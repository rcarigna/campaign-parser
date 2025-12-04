# 🛠️ Update Campaign Parser Roadmap (Prompt File)

You are updating the project's ROADMAP.md file.  
Follow all rules and formatting conventions **exactly**.

---

## 📌 Goals

When called, you will:

1. Ingest PR metadata, commit logs, or user-provided update text.
2. Locate the correct roadmap section(s) to update.
3. Add new checklist items, mark existing ones as complete, or move items to “Completed” sections.
4. Preserve ALL formatting, emojis, headings, indentation, and styling.
5. Never modify narrative explanations or unrelated sections.
6. Never rewrite the entire roadmap — update ONLY what is necessary.

---

## 📍 Update Rules

### **1. Scope of Updates**

- Update ONLY:
  - Phase sections (Phase 1, Phase 2, Phase 3)
  - Milestones
  - Priority subsections
  - Checklist items (`- [ ]` and `- [x]`)
- DO NOT modify:
  - Narrative descriptions
  - Architecture decisions
  - Research & Experimentation
  - Metrics or release notes unless explicitly asked

---

### **2. Checklist Behavior**

- When updating checklists:

Convert:

```markdown
- [ ] **Task name**
```

To:

```markdown
- [x] **Task name** 
```

- If a new task is provided and fits a section, insert it naturally into the correct subsection.

- If the PR contributes to partially complete features, add **sub-bullets** when appropriate.

---

### **3. Formatting Requirements**

Follow all formatting conventions shown in the existing roadmap, including:

- Headings with emojis (e.g., `## 🎯`)
- Bold task names
- Use of **ACHIEVED!**, **CRITICAL**, **COMPLETE**, or similar statuses
- Code blocks must remain unchanged unless explicitly asked
- Keep the “Last Updated” section accurate (update date automatically)

---

### **4. Input Structure**

You will be given one of the following as input:

```json
{
  "pr_number": 123,
  "title": "Implement Export UI",
  "body": "Adds export buttons and progress indicators",
  "labels": ["export", "ui", "phase-1"],
  "status": "merged"
}
```

Or:

```plaintext
<arbitrary update text pasted by user>
```

Or:

```diff
<unified diff or patch showing changes to the codebase>
```

**If a diff or patch is provided:**

- Analyze the diff to infer which features, sections, or checklist items in the roadmap are affected.
- Update the relevant roadmap sections as if you had received a PR description, following all other rules above.
- If the diff is ambiguous, ask the user for clarification about which roadmap section(s) to update.

Interpret all input and apply updates accordingly.

🧠 Behavior
Infer where each update belongs based on keywords (e.g., “export”, “schema”, “validation”, “UI”, “performance”).

If unclear, ask the user which roadmap section should be updated.

Always append new information rather than removing historical record.

Retain the existing writing style — punchy, informative, milestone-based.

🚫 Never Do This
Do NOT rewrite or reflow the entire roadmap.

Do NOT delete context or “User Story” sections.

Do NOT alter Completed Milestones unless adding new details.

Do NOT add new phases unless the user explicitly instructs it.
