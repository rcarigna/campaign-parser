# Components Module

> **Purpose**: Feature-based React UI components that render user interfaces and handle user interactions.

## 🎯 What Components Do

- **Render UI elements** and handle user interactions
- **Consume hooks** for state management  
- **Display data** passed via props
- **Handle events** and delegate to parent components or hooks
- **Manage local UI state** (form inputs, toggles, etc.)

## 📋 Component Patterns

### ✅ Good Component Practices

```typescript
// Functional component with clear props interface
type EntityCardProps = {
    entity: EntityWithId;
    selected: boolean;
    onSelect: (id: string) => void;
    onEdit: (entity: EntityWithId) => void;
};

export const EntityCard = ({ entity, selected, onSelect, onEdit }: EntityCardProps): JSX.Element => {
    // Local UI state only
    const [isHovered, setIsHovered] = useState(false);
    
    // Event handlers delegate to parent
    const handleSelect = useCallback(() => {
        onSelect(entity.id);
    }, [onSelect, entity.id]);
    
    const handleEdit = useCallback(() => {
        onEdit(entity);
    }, [onEdit, entity]);
    
    return (
        <div 
            className={`entity-card ${selected ? 'selected' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h3>{entity.title}</h3>
            <p>{entity.description}</p>
            <button onClick={handleSelect}>Select</button>
            <button onClick={handleEdit}>Edit</button>
        </div>
    );
};
```

### ❌ What Components Should NOT Do

```typescript
// ❌ Don't make API calls directly
export const BadComponent = () => {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetch('/api/data').then(/* ... */); // Use hooks + services instead
    }, []);
};

// ❌ Don't contain business logic
export const AnotherBadComponent = ({ entities }) => {
    const calculateScore = (entity) => {
        // Complex business logic belongs in services
        return entity.stats.reduce((sum, stat) => sum + stat.value, 0);
    };
};

// ❌ Don't manage complex state
export const ComplexStateComponent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    // This complex state management belongs in a hook
};
```

## 🏗️ Component Architecture

### Feature-Based Organization

```text
components/
├── Document/          # Document handling features
│   ├── FileUpload/    # File selection UI
│   ├── ActionButtons/ # Process/Reset actions  
│   └── ParsedResults/ # Results display
├── Entity/            # Entity management features
│   ├── EntityViewer/  # Main entity orchestration
│   ├── EntityGrid/    # Entity layout
│   ├── EntityCard/    # Individual entity display
│   ├── EntityFilters/ # Filtering controls
│   └── EntityEditModal/ # Entity editing
└── Layout/            # App structure
    └── Header/        # Page header
```

### Component Responsibilities

#### Container Components (Smart)

```typescript
// Connects to hooks, manages data flow
export const EntityViewer = ({ parsedData, entities, onEntityDiscard }) => {
    const [filterType, setFilterType] = useState('all');
    const [selectedEntities, setSelectedEntities] = useState([]);
    
    // Orchestrate child components
    return (
        <div>
            <EntityFilters filterType={filterType} onFilterChange={setFilterType} />
            <EntityGrid 
                entities={filteredEntities}
                selectedEntities={selectedEntities}
                onEntitySelect={handleEntitySelect}
            />
        </div>
    );
};
```

#### Presentational Components (Dumb)

```typescript
// Pure UI, no business logic
export const EntityGrid = ({ entities, selectedEntities, onEntitySelect }) => {
    return (
        <div className="entity-grid">
            {entities.map(entity => (
                <EntityCard
                    key={entity.id}
                    entity={entity}
                    selected={selectedEntities.includes(entity.id)}
                    onSelect={onEntitySelect}
                />
            ))}
        </div>
    );
};
```

## 📁 Current Components

### Document Components

- **FileUpload**: File selection with drag-and-drop support
- **ActionButtons**: Process/Reset action controls
- **ParsedResults**: Results display orchestration

### Entity Components

- **EntityViewer**: Main entity management container
- **EntityGrid**: Entity card layout and rendering
- **EntityCard**: Individual entity display with selection
- **EntityFilters**: Filtering and search controls  
- **EntityEditModal**: Modal-based entity editing

### Layout Components

- **Header**: Application header with title and subtitle

## 🔄 Data Flow

```text
Hook State → Container Component → Presentational Component
     ↑              ↓                        ↓
User Actions ← Event Handlers ← User Interactions
```

## 🧪 Testing Components

### Container Components

Test integration with hooks:

```typescript
describe('EntityViewer', () => {
    it('should filter entities by type', () => {
        const mockEntities = [
            { id: '1', kind: 'npc', title: 'NPC 1' },
            { id: '2', kind: 'location', title: 'Location 1' }
        ];
        
        render(<EntityViewer entities={mockEntities} />);
        
        fireEvent.click(screen.getByText('NPCs'));
        
        expect(screen.getByText('NPC 1')).toBeInTheDocument();
        expect(screen.queryByText('Location 1')).not.toBeInTheDocument();
    });
});
```

### Presentational Components

Test UI behavior:

```typescript
describe('EntityCard', () => {
    const mockEntity = { id: '1', title: 'Test Entity' };
    const mockOnSelect = jest.fn();
    
    it('should call onSelect when clicked', () => {
        render(<EntityCard entity={mockEntity} onSelect={mockOnSelect} />);
        
        fireEvent.click(screen.getByRole('button', { name: /select/i }));
        
        expect(mockOnSelect).toHaveBeenCalledWith('1');
    });
});
```

## 💡 Component Guidelines

### State Management

**Local UI state** (component-only):

- Form input values
- Hover/focus states  
- Modal open/closed
- Accordion expanded/collapsed

**Hook state** (shared/complex):

- API data
- Loading/error states
- Complex business logic
- Cross-component coordination

### Event Handling

**Delegate complex logic to parent:**

```typescript
// ✅ Good: Simple delegation
const handleEdit = useCallback(() => {
    onEdit(entity);
}, [onEdit, entity]);

// ❌ Bad: Business logic in component  
const handleEdit = useCallback(() => {
    // Complex validation logic
    if (entity.type === 'npc' && entity.level < 5) {
        // This belongs in a hook or service
    }
    onEdit(entity);
}, [onEdit, entity]);
```

### Props Interface

**Clear, specific prop types:**

```typescript
type ComponentProps = {
    // Required data
    entity: EntityWithId;
    
    // Optional display options
    variant?: 'compact' | 'detailed';
    showActions?: boolean;
    
    // Event handlers
    onSelect?: (id: string) => void;
    onEdit?: (entity: EntityWithId) => void;
};
```

## 🎯 Component Best Practices

- ✅ **Single responsibility** - Each component has one clear purpose
- ✅ **Composition over inheritance** - Build complex UIs from simple parts
- ✅ **Props interface** - Clear TypeScript interfaces for all props
- ✅ **Event delegation** - Pass event handlers down from containers
- ✅ **Memoization** - Use `useCallback` and `useMemo` appropriately
- ✅ **Accessibility** - Proper ARIA labels and keyboard navigation
- ✅ **Error boundaries** - Handle component errors gracefully