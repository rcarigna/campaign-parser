import { EntityKind, FieldMetadata } from '@/types';
import {
  generateSchemaIssueUrl,
  getFieldDescription,
  generateNewFieldIssueUrl,
  generateFieldModificationIssueUrl,
  generateSchemaEnhancementIssueUrl,
} from './github';

describe('GitHub utility functions', () => {
  describe('generateSchemaIssueUrl', () => {
    it('should generate a basic URL with template', () => {
      const url = generateSchemaIssueUrl({});
      expect(url).toContain('github.com/rcarigna/campaign-parser/issues/new');
      expect(url).toContain('template=schema_suggestion.yml');
    });

    it('should include entity kind in URL', () => {
      const url = generateSchemaIssueUrl({
        entityKind: EntityKind.NPC,
      });
      expect(url).toContain('entity-type=NPC');
      expect(url).toContain('title=%5BSchema%5D%20NPC'); // [Schema] NPC
    });

    it('should include field name in URL', () => {
      const url = generateSchemaIssueUrl({
        entityKind: EntityKind.NPC,
        fieldName: 'importance',
      });
      expect(url).toContain('field-name=importance');
      expect(url).toContain('importance');
    });

    it('should include current behavior in URL', () => {
      const url = generateSchemaIssueUrl({
        entityKind: EntityKind.LOCATION,
        currentBehavior: 'Field: type\nType: select',
      });
      expect(url).toContain('current-schema=');
    });

    it('should include proposed change in URL', () => {
      const url = generateSchemaIssueUrl({
        entityKind: EntityKind.ITEM,
        proposedChange: 'Add new field for magical properties',
      });
      expect(url).toContain('proposed-change=');
      expect(url).toContain('magical');
    });

    it('should handle all parameters together', () => {
      const url = generateSchemaIssueUrl({
        entityKind: EntityKind.QUEST,
        fieldName: 'status',
        currentBehavior: 'Field: status\nType: text',
        proposedChange: 'Change to select dropdown',
      });
      expect(url).toContain('entity-type=Quest');
      expect(url).toContain('field-name=status');
      expect(url).toContain('current-schema=');
      expect(url).toContain('proposed-change=');
    });
  });

  describe('getFieldDescription', () => {
    it('should describe a basic text field', () => {
      const field: FieldMetadata = {
        key: 'title',
        label: 'Title',
        type: 'text' as const,
        required: true,
      };
      const description = getFieldDescription(field);
      expect(description).toContain('Field: title');
      expect(description).toContain('Type: text');
      expect(description).toContain('Required: Yes');
    });

    it('should describe an optional field', () => {
      const field: FieldMetadata = {
        key: 'notes',
        label: 'Notes',
        type: 'textarea' as const,
        required: false,
      };
      const description = getFieldDescription(field);
      expect(description).toContain('Required: No');
    });

    it('should include field options', () => {
      const field: FieldMetadata = {
        key: 'importance',
        label: 'Importance Level',
        type: 'select' as const,
        required: false,
        options: [
          { value: 'minor', label: 'Minor' },
          { value: 'major', label: 'Major' },
        ],
      };
      const description = getFieldDescription(field);
      expect(description).toContain('Values: minor, major');
    });

    it('should include placeholder example', () => {
      const field: FieldMetadata = {
        key: 'faction',
        label: 'Faction',
        type: 'text' as const,
        required: false,
        placeholder: 'Harpers, Zhentarim',
      };
      const description = getFieldDescription(field);
      expect(description).toContain('Example: Harpers, Zhentarim');
    });

    it('should include all information when available', () => {
      const field: FieldMetadata = {
        key: 'rarity',
        label: 'Item Rarity',
        type: 'select' as const,
        required: true,
        placeholder: 'common',
        options: [
          { value: 'common', label: 'Common' },
          { value: 'rare', label: 'Rare' },
          { value: 'legendary', label: 'Legendary' },
        ],
      };
      const description = getFieldDescription(field);
      expect(description).toContain('Field: rarity');
      expect(description).toContain('Type: select');
      expect(description).toContain('Required: Yes');
      expect(description).toContain('Values: common, rare, legendary');
      expect(description).toContain('Example: common');
    });
  });

  describe('generateNewFieldIssueUrl', () => {
    it('should generate URL for adding new field to NPC', () => {
      const url = generateNewFieldIssueUrl(EntityKind.NPC);
      expect(url).toContain('entity-type=NPC');
      expect(url).toContain('proposed-change=');
      expect(url).toContain('new%20field');
    });

    it('should generate URL for adding new field to Location', () => {
      const url = generateNewFieldIssueUrl(EntityKind.LOCATION);
      expect(url).toContain('entity-type=Location');
      expect(url).toContain('Location%20schema');
    });
  });

  describe('generateFieldModificationIssueUrl', () => {
    it('should generate URL with field context for NPC importance', () => {
      const field: FieldMetadata = {
        key: 'importance',
        label: 'Importance Level',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'minor', label: 'Minor' },
          { value: 'major', label: 'Major' },
        ],
      };
      const url = generateFieldModificationIssueUrl(EntityKind.NPC, field);
      expect(url).toContain('entity-type=NPC');
      expect(url).toContain('field-name=importance');
      expect(url).toContain('current-schema=');
      expect(url).toContain('proposed-change=');
    });

    it('should include field details in current schema', () => {
      const field: FieldMetadata = {
        key: 'type',
        label: 'Item Type',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'weapon', label: 'Weapon' },
          { value: 'armor', label: 'Armor' },
        ],
      };
      const url = generateFieldModificationIssueUrl(EntityKind.ITEM, field);
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain('Field: type');
      expect(decoded).toContain('Type: select');
      expect(decoded).toContain('Required: Yes');
    });
  });

  describe('generateSchemaEnhancementIssueUrl', () => {
    it('should generate URL for NPC schema enhancement', () => {
      const url = generateSchemaEnhancementIssueUrl(EntityKind.NPC);
      expect(url).toContain('entity-type=NPC');
      expect(url).toContain('proposed-change=');
      expect(url).toContain('enhancements');
    });

    it('should generate URL for Quest schema enhancement', () => {
      const url = generateSchemaEnhancementIssueUrl(EntityKind.QUEST);
      expect(url).toContain('entity-type=Quest');
      expect(url).toContain('Quest%20schema');
    });

    it('should generate URL for all entity types', () => {
      const entityTypes = [
        EntityKind.NPC,
        EntityKind.LOCATION,
        EntityKind.ITEM,
        EntityKind.QUEST,
        EntityKind.PLAYER,
        EntityKind.SESSION_SUMMARY,
        EntityKind.SESSION_PREP,
      ];

      entityTypes.forEach((entityKind) => {
        const url = generateSchemaEnhancementIssueUrl(entityKind);
        expect(url).toContain('github.com/rcarigna/campaign-parser/issues/new');
        expect(url).toContain('template=schema_suggestion.yml');
        expect(url).toContain('entity-type=');
      });
    });
  });

  describe('URL encoding', () => {
    it('should properly encode special characters', () => {
      const url = generateSchemaIssueUrl({
        entityKind: EntityKind.NPC,
        fieldName: 'field&name',
        proposedChange: 'Add support for "special" characters: <>&',
      });
      // Special characters should be URL encoded
      expect(url).not.toContain('&name');
      expect(url).toContain(encodeURIComponent('field&name'));
    });

    it('should handle spaces in field names', () => {
      const url = generateSchemaIssueUrl({
        fieldName: 'field with spaces',
      });
      expect(url).toContain('field%20with%20spaces');
    });
  });
});
