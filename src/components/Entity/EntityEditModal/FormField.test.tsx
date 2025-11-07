import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { getEntityFields } from '@/types';
import { EntityKind, EntityWithId, LocationType } from '@/types';

const mockRegister = jest.fn();

// Realistic NPC entity based on actual schema
const mockNPCEntity: EntityWithId = {
  id: 'npc-1',
  kind: EntityKind.NPC,
  title: 'Davil Starsong',
  role: 'Information Broker',
  faction: 'Zhentarim',
  importance: 'supporting' as const,
  status: 'active',
  CR: '2',
  race: 'Half-Elf',
  class: 'Rogue',
  tags: ['zhentarim', 'tavern-keeper', 'information'],
  sourceSessions: [1, 3, 7],
};

// Realistic Location entity based on actual schema
const mockLocationEntity: EntityWithId = {
  id: 'location-1',
  kind: EntityKind.LOCATION,
  title: 'Yawning Portal',
  type: LocationType.TAVERN,
  region: 'Castle Ward',
  faction_presence: ['Harpers', 'Lords Alliance'],
  status: 'active',
  tags: ['tavern', 'famous', 'undermountain-entrance'],
  sourceSessions: [1, 2, 5],
};

describe('FormField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Real NPC Entity Fields', () => {
    it('renders actual NPC title field', () => {
      const npcFields = getEntityFields(EntityKind.NPC);
      const titleField = npcFields.find((f) => f.key === 'title');

      if (titleField) {
        render(
          <FormField
            field={titleField}
            entity={mockNPCEntity}
            register={mockRegister}
          />
        );

        expect(screen.getByLabelText(titleField.label)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Davil Starsong')).toBeInTheDocument();
        expect(mockRegister).toHaveBeenCalledWith('title');
      }
    });

    it('renders actual NPC faction field', () => {
      const npcFields = getEntityFields(EntityKind.NPC);
      const factionField = npcFields.find((f) => f.key === 'faction');

      if (factionField) {
        render(
          <FormField
            field={factionField}
            entity={mockNPCEntity}
            register={mockRegister}
          />
        );

        expect(screen.getByLabelText(factionField.label)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Zhentarim')).toBeInTheDocument();
        expect(mockRegister).toHaveBeenCalledWith('faction');
      }
    });

    it('renders actual NPC importance enum field', () => {
      const npcFields = getEntityFields(EntityKind.NPC);
      const importanceField = npcFields.find((f) => f.key === 'importance');

      if (importanceField && importanceField.type === 'select') {
        render(
          <FormField
            field={importanceField}
            entity={mockNPCEntity}
            register={mockRegister}
          />
        );

        expect(
          screen.getByLabelText(importanceField.label)
        ).toBeInTheDocument();
        const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
        expect(selectElement).toBeInTheDocument();
        expect(selectElement.value).toBe('supporting');
        expect(mockRegister).toHaveBeenCalledWith('importance');
      }
    });
  });

  describe('Real Location Entity Fields', () => {
    it('renders actual Location title field', () => {
      const locationFields = getEntityFields(EntityKind.LOCATION);
      const titleField = locationFields.find((f) => f.key === 'title');

      if (titleField) {
        render(
          <FormField
            field={titleField}
            entity={mockLocationEntity}
            register={mockRegister}
          />
        );

        expect(screen.getByLabelText(titleField.label)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Yawning Portal')).toBeInTheDocument();
        expect(mockRegister).toHaveBeenCalledWith('title');
      }
    });

    it('renders actual Location type enum field', () => {
      const locationFields = getEntityFields(EntityKind.LOCATION);
      const typeField = locationFields.find((f) => f.key === 'type');

      if (typeField && typeField.type === 'select') {
        render(
          <FormField
            field={typeField}
            entity={mockLocationEntity}
            register={mockRegister}
          />
        );

        expect(screen.getByLabelText(typeField.label)).toBeInTheDocument();
        const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
        expect(selectElement).toBeInTheDocument();
        expect(selectElement.value).toBe('tavern');
        expect(mockRegister).toHaveBeenCalledWith('type');
      }
    });
  });

  describe('Dynamic Field Generation', () => {
    it('generates and renders all NPC fields correctly', () => {
      const npcFields = getEntityFields(EntityKind.NPC);

      expect(npcFields.length).toBeGreaterThan(0);

      // Test that we have expected fields based on schema
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

      // Should be different field sets
      expect(npcKeys).not.toEqual(locationKeys);

      // NPC should have faction and importance, Location should have region and type
      expect(npcKeys).toContain('faction');
      expect(npcKeys).toContain('importance');
      expect(locationKeys).toContain('region');
      expect(locationKeys).toContain('type');
    });
  });
});
