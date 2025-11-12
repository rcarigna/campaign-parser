// Shared test mocks for FieldMergeOption tests
export const fieldValueOptionMock = {
    optionKey: 'option1',
    value: 'Value 1',
    source: 'Entity A',
    onChange: jest.fn(),
    selected: false,
    groupName: 'fieldGroup',
};

export const customValueOptionMock = {
    customValueKey: 'custom',
    onChange: jest.fn(),
    selected: false,
    groupName: 'fieldGroup',
};
