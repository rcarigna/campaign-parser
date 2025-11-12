
export const nameFieldValuesMock = [
    { entityId: '1', entityTitle: 'Entity 1', value: 'Alice' },
    { entityId: '2', entityTitle: 'Entity 2', value: 'Alicia' },
];

export const typeFieldValuesMock = [
    { entityId: '1', entityTitle: 'Entity 1', value: 'Person' },
    { entityId: '2', entityTitle: 'Entity 2', value: 'Person' },
];

export const descriptionFieldValuesMock = [
    { entityId: '1', entityTitle: 'Entity 1', value: 'Desc 1' },
];

export const getFieldValuesMock = (fieldName: string) => {
    if (fieldName === 'name') return nameFieldValuesMock;
    if (fieldName === 'type') return typeFieldValuesMock;
    if (fieldName === 'description') return descriptionFieldValuesMock;
    return [];
};

