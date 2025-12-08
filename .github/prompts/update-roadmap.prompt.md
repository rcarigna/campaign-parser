# ---

# agent: agent

# ---

# Task: Update Campaign Parser Roadmap

Define the task to achieve, including:

- Only update relevant checklist/milestone sections in ROADMAP.md
- Preserve all formatting, emojis, and narrative content
- Never rewrite or reflow the entire roadmap
- Mark items complete, add new items, or insert details as needed
- Update “Last Updated” if changes are made

Success Criteria:

- Only the necessary sections are updated
- Formatting and style are preserved
- Output is the updated ROADMAP.md content

# 🤖 VS Code Copilot Prompt: Update Campaign Parser Roadmap

You are GitHub Copilot. Your job is to update the project's `ROADMAP.md` file in response to a PR, commit log, diff, or user-provided update text. Follow all instructions and formatting conventions **exactly**.

---

## 📝 Instructions

1. **Ingest the input:** This may be PR metadata (title, body, labels), a commit log, a diff/patch, or arbitrary update text.
2. **Analyze the changes:**
   - Identify which features, checklist items, or milestones in the roadmap are affected.
   - Mark checklist items as complete (`- [x]`) or add new items as needed.
   - Insert new tasks in the correct section if relevant.
   - If the diff is ambiguous, ask the user for clarification.
3. **Preserve ALL formatting, emojis, headings, indentation, and styling.**
4. **Never modify narrative explanations, architecture, or unrelated sections.**
5. **Never rewrite the entire roadmap—update ONLY what is necessary.**
6. **Update the “Last Updated” section with today’s date if any changes are made.**

---

## 🧠 Behavior

- Infer the correct roadmap section(s) based on keywords (e.g., “export”, “schema”, “validation”, “UI”, “performance”).
- If unclear, ask the user which section to update.
- Always append new information rather than removing historical record.
- Retain the existing writing style—punchy, informative, milestone-based.

---

## 🚫 Never Do This

- Do NOT rewrite or reflow the entire roadmap.
- Do NOT delete context or “User Story” sections.
- Do NOT alter Completed Milestones unless adding new details.
- Do NOT add new phases unless the user explicitly instructs it.

---

## 📥 Input

You will be given one of the following:

- PR metadata (JSON)
- Commit log (plaintext)
- Unified diff/patch (diff)
- Arbitrary update text (plaintext)

---

## 📤 Output

- Output only the updated `ROADMAP.md` content, with all changes applied and formatting preserved.

---

## Example Input

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

```diff
--- a/src/components/EntityViewer.tsx
+++ b/src/components/EntityViewer.tsx
@@ ...
// Added export button and progress indicator
```

---

## Example Output

- The updated `ROADMAP.md` file, with the relevant checklist item marked as complete or new items added, and the “Last Updated” date updated.
