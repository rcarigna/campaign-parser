# 🗺️ Campaign Parser Roadmap

## 🎉 Current Status: **DEPLOYED & LIVE**

✅ **Production Deployment**: Live on Vercel with full Next.js functionality  
✅ **93 Tests Passing**: Comprehensive test coverage across all components  
✅ **Complete Documentation**: GitHub Pages with API docs, architecture guides  
✅ **CI/CD Pipeline**: Automated testing, building, and deployment  

---

## 🎯 **Phase 1: Core Workflow Completion (Current Focus)**

### **🚀 Priority 1: Complete Import → Dedupe → Clean → Export Pipeline**

- [x] **Document Import** - Upload and parse .docx and .md files
- [x] **Entity Extraction** - NLP-based entity identification and classification
- [x] **Zod Validation** - Type-safe entity schemas with proper validation
- [x] **Duplicate Detection** - Identify similar entities across documents
- [x] **Entity Management** - View, edit, merge, and discard entities
- [x] **Obsidian Template System** - Handlebars-based templates for export
- [ ] **Export API Implementation** - `/api/export` endpoint with ZIP generation
- [ ] **Export UI Integration** - Frontend export buttons and progress indicators
- [ ] **Export Format Options** - JSON, CSV, and Obsidian markdown bundles
- [ ] **Filtered Export** - Export only selected entity types or importance levels

**User Story**: *"I upload my session notes, clean up the detected entities by merging duplicates and fixing missing fields, then export a clean, organized campaign reference for use in Obsidian or Roll20."*

**Current Status**: Core pipeline is 90% complete. Entity extraction, validation, and deduplication are working. Need to finish export implementation and UI integration.

### **⚡ Priority 2: Workflow Polish & User Experience**

- [ ] **Export Progress Indicators** - Show progress during ZIP file generation
- [ ] **Export Preview** - Preview generated files before download
- [ ] **Export History** - Track and re-download previous exports
- [ ] **Bulk Entity Operations** - Select multiple entities for merge/delete/edit
- [ ] **Entity Validation UI** - Clear indicators for incomplete entities
- [ ] **Undo/Redo System** - Allow users to reverse entity operations
- [ ] **Keyboard Shortcuts** - Power user efficiency for common operations

**User Story**: *"The core workflow works great, but I want better visual feedback, faster bulk operations, and the ability to undo mistakes while cleaning up my entities."*

### **🔧 Priority 3: Static Schema Improvements**

- [ ] **Enhanced Validation Rules** - Better field validation for current entity types
- [ ] **Entity Field Completion** - Smart suggestions for missing fields
- [ ] **Entity Templates** - Quick-create entities with pre-filled D&D fields  
- [ ] **Entity Relationships** - Simple linking between related entities
- [ ] **Custom Field Support** - Add custom fields to existing entity types

**User Story**: *"I want better validation and smart completion for the existing NPC, Location, Item, Quest, Player, Session Summary, and Session Prep entity types before we add new entity types."*

### **🔍 Priority 4: Enhanced Search & Filter**

- [ ] **Full-text Search** - Search across all entity fields, not just names
- [ ] **Advanced Filters** - Combine multiple filter criteria (type + importance + campaign)
- [ ] **Filter Presets** - Quick filters for common scenarios (incomplete entities, duplicates)
- [ ] **Saved Searches** - Store frequently used filter combinations
- [ ] **Entity Statistics** - Show counts, distributions, campaign analytics

**User Story**: *"I need to quickly find all 'major NPCs' in 'Waterdeep' who are part of the 'Zhentarim faction' across all my uploaded sessions."*

---

## 🔬 **Phase 2: Advanced Entity System**

### **🧬 Schema-Driven Entity System**

- [ ] **Entity Schema Management** - Define and customize entity schemas with Zod validation
- [ ] **Dynamic Entity Cards** - Generate entity card UI based on schema definitions
- [ ] **Schema Versioning** - Track and migrate entity schemas across updates
- [ ] **Custom Entity Types** - Users can define their own entity types beyond the default 7
- [ ] **Field Type Library** - Rich field types (enum, date, number, relationship, array)
- [ ] **Conditional Fields** - Show/hide fields based on other field values
- [ ] **Schema Templates** - Pre-built schemas for common RPG systems (D&D, Pathfinder, etc.)

**User Story**: *"After mastering the core workflow, I want to customize entity types for my specific campaign needs - adding Spell entities, Monster stat blocks, or custom faction tracking."*

## 🔬 **Phase 3: Intelligence Improvements**

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

#### **Milestone 1.1: Complete Export Pipeline**

- [x] Obsidian template system with Handlebars
- [x] Vault structure reference and organization
- [x] Zod validation system for entities
- [ ] `/api/export` endpoint implementation  
- [ ] ZIP file generation with organized folders
- [ ] JSON export with full entity data
- [ ] CSV export for spreadsheet compatibility
- [ ] Export UI integration with progress indicators
- [ ] Export filtering by entity type and importance

#### **Milestone 1.2: Enhanced Entity Management**

- [ ] Entity validation UI with clear missing field indicators
- [ ] Bulk selection and operations (merge, delete, edit)
- [ ] Improved duplicate detection and merging workflow
- [ ] Entity completion suggestions and validation feedback
- [ ] Undo/redo system for entity operations

#### **Milestone 1.3: Workflow Polish**

- [ ] Export preview before download
- [ ] Export history and re-download capabilities
- [ ] Keyboard shortcuts for power users
- [ ] Performance optimization for large entity sets
- [ ] Better error handling and user feedback

### **Success Metrics**

- **Core Workflow Completion**: Users successfully complete import → clean → export > 80%
- **Export Adoption**: Export feature usage rate > 70% of active users
- **Efficiency**: Average time to clean and export campaign entities < 15 minutes
- **Quality**: User-reported entity accuracy > 90% (improved validation)
- **User Satisfaction**: Complete workflow satisfaction rating > 4.5/5

---

## 🤔 **Current Architecture Decisions**

### **Export Format Philosophy**

- **JSON**: Developer-friendly, preserves full data structure
- **CSV**: Spreadsheet-compatible, flattened entity fields  
- **Campaign Bundle**: ZIP with multiple formats + original documents

### **Dynamic Schema Architecture**

```typescript
// Schema definition format
type EntitySchema = {
  id: string;
  name: string;
  version: number;
  fields: SchemaField[];
  icon: string;
  color: string;
  requiredFields: string[];
}

type SchemaField = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'enum' | 'boolean' | 'date' | 'array' | 'relationship';
  options?: {
    enumValues?: string[];
    min?: number;
    max?: number;
    relationshipType?: string;
    arrayItemType?: 'text' | 'number' | 'enum';
    placeholder?: string;
    helpText?: string;
  };
  validation?: {
    required: boolean;
    pattern?: string;
    customValidator?: string;
  };
  conditional?: {
    showWhen: string; // Field ID
    equals: any; // Value that triggers showing this field
  };
}

// Runtime schema to Zod conversion
const generateZodSchema = (schema: EntitySchema) => {
  // Dynamically build Zod validation based on schema definition
}
```

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

### **Schema System Implementation**

- [ ] **Visual Schema Editor** - Drag-and-drop interface for building entity schemas
- [ ] **Schema Marketplace** - Community sharing of custom entity schemas
- [ ] **Schema Inheritance** - Base schemas that can be extended (BaseNPC → SpecificNPC)
- [ ] **Migration Engine** - Automatic data migration when schemas change
- [ ] **Schema Validation UI** - Real-time validation feedback in entity forms
- [ ] **Computed Fields** - Fields calculated from other fields (e.g., "Full Name" = "First Name" + "Last Name")

### **AI/ML Opportunities**

- [ ] **GPT Integration** - Use LLM for better entity extraction and relationship detection
- [ ] **Vector Similarity** - Better duplicate detection using embeddings
- [ ] **Campaign Analysis** - Automated insights about campaign themes and progression
- [ ] **Smart Schema Suggestions** - AI-powered field suggestions when creating schemas

### **Community Features**

- [ ] **Entity Templates Library** - Share extraction patterns between users
- [ ] **Campaign Showcase** - Public gallery of interesting campaigns (anonymized)
- [ ] **Crowdsourced Improvements** - Community feedback on extraction accuracy

---

**Last Updated**: November 5, 2025  
**Current Version**: v1.0 (Production)  
**Next Release Target**: v1.1 (Export & Bulk Operations) - ~2 weeks
