# 🗺️ Campaign Parser Roadmap

## 🎉 Current Status: **DEPLOYED & LIVE**

✅ **Production Deployment**: Live on Vercel with full Next.js functionality  
✅ **93 Tests Passing**: Comprehensive test coverage across all components  
✅ **Complete Documentation**: GitHub Pages with API docs, architecture guides  
✅ **CI/CD Pipeline**: Automated testing, building, and deployment  

---

## 🎯 **Phase 1: Enhanced Entity Management (Current Focus)**

### **🚀 Priority 1: Export Functionality**
- [ ] **JSON Export** - Download all entities as structured JSON
- [ ] **CSV Export** - Spreadsheet-compatible format for campaign notes
- [ ] **Filtered Export** - Export only selected entity types or importance levels
- [ ] **Campaign Export** - Bundle all documents + entities into single export

**User Story**: *"After cleaning up my entities, I want to export them to use in Roll20, Obsidian, or my own campaign management system."*

### **⚡ Priority 2: Advanced Entity Manipulation**
- [ ] **Bulk Edit Mode** - Select multiple entities and edit common fields
- [ ] **Entity Relationships** - Link NPCs to locations, items to owners, quests to NPCs
- [ ] **Entity Templates** - Quick-create entities with pre-filled D&D fields
- [ ] **Entity History** - Track changes and allow undo operations

**User Story**: *"I want to quickly establish that 'Tavern Owner Bob' works at 'The Prancing Pony' and owns the 'Magic Ale Recipe' without editing each entity individually."*

### **🔍 Priority 3: Enhanced Search & Filter**
- [ ] **Full-text Search** - Search across all entity fields, not just names
- [ ] **Advanced Filters** - Combine multiple filter criteria (type + importance + campaign)
- [ ] **Saved Searches** - Store frequently used filter combinations
- [ ] **Entity Statistics** - Show counts, distributions, campaign analytics

**User Story**: *"I need to quickly find all 'major NPCs' in 'Waterdeep' who are part of the 'Zhentarim faction' across all my uploaded sessions."*

---

## 🔬 **Phase 2: Intelligence Improvements**

### **🧠 Smarter Extraction**
- [ ] **Context-Aware Extraction** - Better understanding of D&D terminology
- [ ] **Custom Extraction Patterns** - User-defined regex patterns for specific campaigns
- [ ] **Extraction Confidence Scoring** - Show how confident the AI is about each entity
- [ ] **Manual Entity Creation** - Add entities the parser missed

### **🔗 Relationship Detection**  
- [ ] **Automatic Relationship Mapping** - "Bob owns the tavern" → create relationship
- [ ] **Relationship Visualization** - Network graph of entity connections
- [ ] **Relationship-Based Deduplication** - Use connections to identify duplicates

### **📚 Campaign Intelligence**
- [ ] **Session Timeline** - Chronological view of entity mentions across documents
- [ ] **Entity Evolution Tracking** - How entities change over time
- [ ] **Campaign Consistency Checking** - Flag potential continuity errors

---

## 🌟 **Phase 3: Collaboration & Integration**

### **👥 Multi-User Features**
- [ ] **User Accounts** - Save campaigns, settings, custom patterns
- [ ] **Campaign Sharing** - Collaborate with other DMs on shared campaigns  
- [ ] **Entity Comments** - Add notes and discussions to entities
- [ ] **Version History** - Track entity changes over time

### **🔌 External Integrations**
- [ ] **Roll20 Integration** - Direct export to Roll20 campaigns
- [ ] **Foundry VTT Export** - Compatible with Foundry data formats
- [ ] **D&D Beyond Integration** - Sync with official character/monster data
- [ ] **API Webhooks** - Push updates to external campaign management tools

### **📱 Enhanced User Experience**
- [ ] **Mobile Optimization** - Fully responsive design for tablet/phone use
- [ ] **Offline Support** - Work with entities without internet connection
- [ ] **Keyboard Shortcuts** - Power user efficiency features
- [ ] **Custom Themes** - Dark mode, high contrast, campaign-specific styling

---

## 🛠️ **Technical Debt & Infrastructure**

### **Performance Optimization**
- [ ] **Large File Handling** - Process 100+ page campaign documents efficiently
- [ ] **Entity Caching** - Faster loading for large entity collections
- [ ] **Incremental Processing** - Parse documents in chunks for better UX
- [ ] **Image Processing** - Extract entities from campaign maps and handouts

### **Developer Experience**  
- [ ] **Component Storybook** - Visual component documentation
- [ ] **E2E Testing** - Playwright tests for critical user workflows
- [ ] **Performance Monitoring** - Real user monitoring and analytics
- [ ] **Error Tracking** - Better error reporting and debugging

---

## 📋 **Implementation Strategy**

### **Phase 1 Milestones (Next 2-4 weeks)**

#### **Milestone 1.1: Export System**
- JSON export with full entity data
- CSV export for spreadsheet compatibility  
- Export filtering by entity type and importance
- Download progress indicators

#### **Milestone 1.2: Bulk Operations**
- Multi-select entity interface
- Bulk edit modal for common fields
- Bulk delete with confirmation
- Bulk duplicate marking

#### **Milestone 1.3: Entity Relationships**  
- Relationship data model and storage
- UI for creating/editing relationships
- Relationship display in entity cards
- Relationship-aware export formats

### **Success Metrics**
- **User Engagement**: Export feature usage rate > 60%
- **Efficiency**: Average time to clean campaign entities < 10 minutes
- **Quality**: User-reported entity accuracy > 85%
- **Satisfaction**: Feature request completion rate > 80%

---

## 🤔 **Current Architecture Decisions**

### **Export Format Philosophy**
- **JSON**: Developer-friendly, preserves full data structure
- **CSV**: Spreadsheet-compatible, flattened entity fields  
- **Campaign Bundle**: ZIP with multiple formats + original documents

### **Entity Relationship Model**
```typescript
type EntityRelationship = {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  relationshipType: 'owns' | 'located_in' | 'member_of' | 'allied_with' | 'enemy_of' | 'custom';
  description?: string;
  confidence?: number;
}
```

### **Bulk Operations UX**
- Checkbox selection model (familiar pattern)
- Floating action button for bulk operations
- Modal-based bulk edit (consistent with existing patterns)
- Clear visual feedback for selected items

---

## 💡 **Research & Experimentation**

### **AI/ML Opportunities**
- [ ] **GPT Integration** - Use LLM for better entity extraction and relationship detection
- [ ] **Vector Similarity** - Better duplicate detection using embeddings
- [ ] **Campaign Analysis** - Automated insights about campaign themes and progression

### **Community Features**
- [ ] **Entity Templates Library** - Share extraction patterns between users
- [ ] **Campaign Showcase** - Public gallery of interesting campaigns (anonymized)
- [ ] **Crowdsourced Improvements** - Community feedback on extraction accuracy

---

**Last Updated**: November 5, 2025  
**Current Version**: v1.0 (Production)  
**Next Release Target**: v1.1 (Export & Bulk Operations) - ~2 weeks