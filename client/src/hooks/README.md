# Hooks Module

> **Purpose**: React state management layer that orchestrates business logic and provides component-friendly interfaces.

## 🎯 What Hooks Do

- **Manage React state** using `useState`, `useEffect`, `useCallback`
- **Orchestrate service calls** while handling UI states (loading, error)
- **Provide memoized functions** for component consumption
- **Handle React lifecycle** and side effects
- **Transform service data** into component-ready formats

## 📋 Hook Patterns

### ✅ Good Hook Practices

```typescript
export const useMyFeature = () => {
    // 1. State management
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Side effects
    useEffect(() => {
        // React lifecycle management
    }, [dependencies]);

    // 3. Memoized callbacks
    const handleAction = useCallback(async () => {
        setLoading(true);
        try {
            const result = await serviceFunction(); // Delegate to service
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // 4. Return component interface
    return { data, loading, error, handleAction };
};
```

### ❌ What Hooks Should NOT Do

```typescript
// ❌ Don't put pure business logic in hooks
export const useBadExample = () => {
    const calculateComplexScore = (entity) => {
        // This should be in services/
        return entity.stats.reduce((sum, stat) => sum + stat.value, 0);
    };

    // ❌ Don't make direct API calls  
    const fetchData = async () => {
        const response = await fetch('/api/data'); // Use service instead
        return response.json();
    };
};
```

## 📁 Current Hooks

### `useCampaignParser`

- **Purpose**: Manages document processing workflow and entity state
- **Responsibilities**:
  - File upload orchestration
  - Entity list management (discard/restore)
  - Loading/error states
  - Parsed data transformation

### `useFileManager`

- **Purpose**: Handles file selection and validation
- **Responsibilities**:
  - File selection state
  - File validation logic
  - Error handling for file operations

## 🔄 Service Integration

Hooks should **consume services**, not replace them:

```typescript
// ✅ Good: Hook orchestrates service
const processDocument = useCallback(async (file: File) => {
    setLoading(true);
    try {
        const result = await uploadDocument(file); // Service call
        setParsedData(result); // React state management
    } catch (error) {
        setError(error.message); // UI error handling
    } finally {
        setLoading(false);
    }
}, []);

// ❌ Bad: Hook contains business logic
const processDocument = useCallback(async (file: File) => {
    const formData = new FormData(); // This belongs in service
    formData.append('file', file);
    const response = await fetch('/api/upload', { /* ... */ });
    // ...
}, []);
```

## 🧪 Testing Hooks

Use `@testing-library/react-hooks` for hook testing:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCampaignParser } from './useCampaignParser';

describe('useCampaignParser', () => {
    it('should manage loading state', async () => {
        const { result } = renderHook(() => useCampaignParser());
        
        expect(result.current.loading).toBe(false);
        
        await act(async () => {
            await result.current.processDocument(mockFile);
        });
        
        expect(result.current.loading).toBe(false);
    });
});
```

## 💡 When to Create a New Hook

**Create a hook when you need to:**

- Manage related state (loading, data, error)
- Coordinate multiple service calls
- Provide reusable stateful logic
- Handle complex React lifecycle needs

**Don't create a hook for:**

- Pure calculations (use services)
- Simple state that belongs in components
- One-time operations without state

## 🎯 Architecture Flow

```text
Component → Hook → Service → API
    ↑        ↑        ↑
    UI    React     Pure
  Layer   State   Business
         Mgmt     Logic
```
