import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { FieldMetadata, getEntityFields } from '@/types';
import { EntityKind } from '@/types';
import { mockNPCEntity, mockLocationEntity } from '../../__mocks__';

const mockRegister = jest.fn();

type Entity = typeof mockNPCEntity | typeof mockLocationEntity;

type RenderFormFieldProps = {
  field: FieldMetadata;
  entity: Entity;
};

const renderFormField = (
  field: RenderFormFieldProps['field'],
  entity: RenderFormFieldProps['entity']
) =>
  render(<FormField field={field} entity={entity} register={mockRegister} />);

type AssertFieldParams = {
  label: string;
  value: string;
  registerKey: string;
};

const assertField = (
  label: AssertFieldParams['label'],
  value: AssertFieldParams['value'],
  registerKey: AssertFieldParams['registerKey']
): void => {
  expect(screen.getByLabelText(new RegExp(label, 'i'))).toBeInTheDocument();
  expect(screen.getByDisplayValue(value)).toBeInTheDocument();
  expect(mockRegister).toHaveBeenCalledWith(registerKey);
};

describe('FormField', () => {
  beforeEach(() => jest.clearAllMocks());

  it.each([
    ['NPC', mockNPCEntity, 'title', 'Title', 'Davil Starsong'],
    ['NPC', mockNPCEntity, 'faction', 'Faction', 'Zhentarim'],
    ['LOCATION', mockLocationEntity, 'title', 'Title', 'Yawning Portal'],
  ])('renders %s %s field', (kind, entity, key, label, value) => {
    const field = getEntityFields(
      EntityKind[kind as keyof typeof EntityKind]
    ).find((f) => f.key === key);
    if (field) {
      renderFormField(field, entity);
      assertField(label, value, key);
    }
  });

  it('renders actual NPC importance enum field', () => {
    const importanceField = getEntityFields(EntityKind.NPC).find(
      (f) => f.key === 'importance'
    );
    if (importanceField && importanceField.type === 'select') {
      renderFormField(importanceField, mockNPCEntity);
      expect(screen.getByLabelText(/Importance/)).toBeInTheDocument();
      const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selectElement).toBeInTheDocument();
      expect(selectElement.value).toBe('supporting');
      expect(mockRegister).toHaveBeenCalledWith('importance');
    }
  });

  it('renders actual Location type enum field', () => {
    const typeField = getEntityFields(EntityKind.LOCATION).find(
      (f) => f.key === 'type'
    );
    if (typeField && typeField.type === 'select') {
      renderFormField(typeField, mockLocationEntity);
      expect(screen.getByLabelText(/Type/)).toBeInTheDocument();
      const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selectElement).toBeInTheDocument();
      expect(selectElement.value).toBe('tavern');
      expect(mockRegister).toHaveBeenCalledWith('type');
    }
  });

  describe('Dynamic Field Generation', () => {
    it('generates and renders all NPC fields correctly', () => {
      const npcFields = getEntityFields(EntityKind.NPC);
      expect(npcFields.length).toBeGreaterThan(0);
      const fieldKeys = npcFields.map((f) => f.key);
      expect(fieldKeys).toContain('title');
      expect(fieldKeys).toContain('faction');
      expect(fieldKeys).toContain('role');
      expect(fieldKeys).toContain('importance');
    });

    it('generates different fields for different entity types', () => {
      const npcFields = getEntityFields(EntityKind.NPC);
      const locationFields = getEntityFields(EntityKind.LOCATION);
      const npcKeys = npcFields.map((f) => f.key).sort();
      const locationKeys = locationFields.map((f) => f.key).sort();
      expect(npcKeys).not.toEqual(locationKeys);
      expect(npcKeys).toContain('faction');
      expect(npcKeys).toContain('importance');
      expect(locationKeys).toContain('region');
      expect(locationKeys).toContain('type');
    });
  });
});
