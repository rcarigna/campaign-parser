# Services Module

> **Purpose**: Pure business logic layer that handles data operations, API communication, and calculations without React dependencies.

## 🎯 What Services Do

- **API communication** with error handling and data transformation
- **Pure business logic** and calculations
- **Data validation** and formatting
- **Utility functions** that can be reused across the app
- **Stateless operations** that don't require React lifecycle

## 📋 Service Patterns

### ✅ Good Service Practices

```typescript
// Pure function - no React dependencies
export const uploadDocument = async (file: File): Promise<ParsedDocument> => {
    const formData = new FormData();
    formData.append('document', file);

    try {
        const response = await axios.post('/api/parse', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        // Handle and transform errors appropriately
        throw new Error(getErrorMessage(error));
    }
};

// Pure calculation
export const calculateEntityScore = (entity: Entity): number => {
    return entity.attributes.reduce((sum, attr) => sum + attr.value, 0);
};

// Data validation
export const validateDocumentFile = (file: File): ValidationResult => {
    const allowedTypes = ['application/pdf', 'text/markdown'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type' };
    }
    
    if (file.size > maxSize) {
        return { valid: false, error: 'File too large' };
    }
    
    return { valid: true };
};
```

### ❌ What Services Should NOT Do

```typescript
// ❌ Don't use React hooks or state
export const badService = () => {
    const [state, setState] = useState(null); // React dependency!
    // Services should be stateless
};

// ❌ Don't handle UI concerns
export const anotherBadService = () => {
    setLoading(true); // UI state management belongs in hooks
    showNotification('Success!'); // UI interactions belong in components
};

// ❌ Don't directly manipulate DOM
export const domManipulationService = () => {
    document.getElementById('result').innerHTML = '...'; // Use React instead
};
```

## 📁 Current Services

### `documentService`

- **Purpose**: Handle document upload and processing API communication
- **Functions**:
  - `uploadDocument(file)` - Upload file to server and return parsed result
- **Responsibilities**:
  - HTTP request formatting
  - Error handling and transformation
  - Response data validation

## 🔄 Hook Integration

Services are **consumed by hooks**, not the other way around:

```typescript
// ✅ Good: Hook calls service
const useCampaignParser = () => {
    const [loading, setLoading] = useState(false);
    
    const processDocument = useCallback(async (file: File) => {
        setLoading(true);
        try {
            const result = await uploadDocument(file); // Service call
            setParsedData(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);
};

// ❌ Bad: Service tries to manage React state
const uploadDocument = async (file: File) => {
    setGlobalLoading(true); // Services shouldn't manage UI state
    // ...
};
```

## 🧪 Testing Services

Services are easy to unit test because they're pure functions:

```typescript
describe('documentService', () => {
    describe('uploadDocument', () => {
        it('should upload file successfully', async () => {
            const mockFile = new File(['content'], 'test.md');
            const expectedResponse = { /* ... */ };
            
            mockAxios.post.mockResolvedValue({ data: expectedResponse });
            
            const result = await uploadDocument(mockFile);
            
            expect(result).toEqual(expectedResponse);
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/parse',
                expect.any(FormData),
                expect.objectContaining({
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            );
        });
        
        it('should handle API errors', async () => {
            const mockFile = new File(['content'], 'test.md');
            mockAxios.post.mockRejectedValue(new Error('Network error'));
            
            await expect(uploadDocument(mockFile)).rejects.toThrow('Network error');
        });
    });
});
```

## 💡 When to Create a New Service

**Create a service when you need to:**

- Make API calls to backend
- Perform complex calculations
- Validate or transform data
- Provide reusable utility functions
- Handle business logic that doesn't need React

**Example service candidates:**

```typescript
// API services
export const userService = {
    login: (credentials) => { /* ... */ },
    logout: () => { /* ... */ },
    getProfile: () => { /* ... */ }
};

// Calculation services  
export const entityCalculations = {
    calculateScore: (entity) => { /* ... */ },
    findDuplicates: (entities) => { /* ... */ },
    sortByImportance: (entities) => { /* ... */ }
};

// Validation services
export const validators = {
    validateEmail: (email) => { /* ... */ },
    validateFile: (file) => { /* ... */ },
    validateEntity: (entity) => { /* ... */ }
};
```

## 🎯 Service Characteristics

**Services should be:**

- ✅ **Pure** - Same input always produces same output
- ✅ **Stateless** - No internal state that persists between calls
- ✅ **Testable** - Easy to mock and unit test
- ✅ **Reusable** - Can be called from multiple hooks/components
- ✅ **Framework agnostic** - Could work outside React if needed

## 🔧 Error Handling Pattern

```typescript
// Consistent error handling in services
export const apiCall = async (data: any): Promise<Result> => {
    try {
        const response = await axios.post('/api/endpoint', data);
        return response.data;
    } catch (error) {
        // Transform errors into consistent format
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'API request failed');
        }
        throw new Error('An unexpected error occurred');
    }
};
```