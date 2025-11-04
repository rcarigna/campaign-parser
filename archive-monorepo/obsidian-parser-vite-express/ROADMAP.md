# Campaign Parser - Simple Roadmap

## 🎯 What This Is

A personal D&D campaign document parser that extracts entities (NPCs, locations, items, quests) from session notes and lets you clean them up interactively. Built because manually organizing campaign data sucks.

## ✅ What's Working Now

- Upload DOC/DOCX/Markdown files ✅
- Extract entities automatically (NPCs, locations, items, quests) ✅
- View entities as interactive cards with filtering ✅
- Edit individual entities in a modal ✅
- Select multiple entities to mark as duplicates ✅
- Modern React/TypeScript architecture with 124+ tests ✅

## 🚧 What's Missing (The Core Stuff)

### **Next Up - Complete the Duplicate Workflow**

- [ ] **Merge modal** - When you select duplicates, show a UI to actually merge them
  - Pick which entity to keep as primary
  - Combine fields from the others
  - Preview the result before applying

- [ ] **Discard entities** - Simple "delete" button with confirmation
  - Sometimes the parser picks up garbage, need to remove it

### **Then - Actually Use the Clean Data**  

- [ ] **Export the results** - Download cleaned entities as JSON/CSV
  - The whole point is getting usable data out

### **Maybe Later - Nice to Have**

- [ ] **Better duplicate detection** - Currently just matches exact names
- [ ] **Save work in progress** - Don't lose edits if you close the browser  
- [ ] **Bulk operations** - Edit multiple entities at once
- [ ] **Entity relationships** - Link NPCs to locations, etc.

## 🤔 Implementation Notes

### **Technical Approach**

- Keep it simple, avoid over-engineering
- Use existing libraries instead of building from scratch (like react-hot-toast for notifications)
- Write tests for the core functionality
- Don't worry about performance until it's actually slow

### **User Experience Philosophy**

- Make the common case fast (most entities are fine, just need to fix a few duplicates)
- Visual feedback for everything (loading states, success/error messages)
- Undo for destructive actions (deleting entities)
- Don't force users to fill out forms - most extracted data should be good enough

## 💭 Current Questions

- Should the merge modal let you edit fields while merging, or keep it simple?
- Export format: JSON for developers, CSV for spreadsheets, or both?
- How much validation is worth adding vs just trusting the user?
