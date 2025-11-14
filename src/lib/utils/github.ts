import { EntityKind } from '@/types';
import type { FieldMetadata } from '@/types';

/**
 * GitHub repository information
 */
const GITHUB_REPO_OWNER = 'rcarigna';
const GITHUB_REPO_NAME = 'campaign-parser';

/**
 * Entity kind to display name mapping
 */
const ENTITY_KIND_LABELS: Record<EntityKind, string> = {
  [EntityKind.NPC]: 'NPC (Non-Player Character)',
  [EntityKind.LOCATION]: 'Location',
  [EntityKind.ITEM]: 'Item',
  [EntityKind.QUEST]: 'Quest',
  [EntityKind.PLAYER]: 'Player',
  [EntityKind.SESSION_SUMMARY]: 'Session Summary',
  [EntityKind.SESSION_PREP]: 'Session Prep',
  [EntityKind.UNKNOWN]: 'Unknown',
};

/**
 * Generates a GitHub issue URL for schema suggestions
 */
export const generateSchemaIssueUrl = (params: {
  entityKind?: EntityKind;
  fieldName?: string;
  currentBehavior?: string;
  proposedChange?: string;
}): string => {
  const { entityKind, fieldName, currentBehavior, proposedChange } = params;

  const baseUrl = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new`;
  const templateParam = 'template=schema_suggestion.yml';

  // Build query parameters
  const queryParams: string[] = [templateParam];

  // Add title
  const titleParts: string[] = ['[Schema]'];
  if (entityKind) {
    titleParts.push(ENTITY_KIND_LABELS[entityKind]);
  }
  if (fieldName) {
    titleParts.push(`- ${fieldName}`);
  }
  const title = titleParts.join(' ');
  queryParams.push(`title=${encodeURIComponent(title)}`);

  // Add entity type
  if (entityKind) {
    queryParams.push(`entity-type=${encodeURIComponent(ENTITY_KIND_LABELS[entityKind])}`);
  }

  // Add field name
  if (fieldName) {
    queryParams.push(`field-name=${encodeURIComponent(fieldName)}`);
  }

  // Add current behavior
  if (currentBehavior) {
    queryParams.push(`current-schema=${encodeURIComponent(currentBehavior)}`);
  }

  // Add proposed change
  if (proposedChange) {
    queryParams.push(`proposed-change=${encodeURIComponent(proposedChange)}`);
  }

  return `${baseUrl}?${queryParams.join('&')}`;
};

/**
 * Generates current schema description for a field
 */
export const getFieldDescription = (field: FieldMetadata): string => {
  const parts: string[] = [
    `Field: ${field.key}`,
    `Type: ${field.type}`,
    `Required: ${field.required ? 'Yes' : 'No'}`,
  ];

  if (field.options && field.options.length > 0) {
    const values = field.options.map((opt) => opt.value).join(', ');
    parts.push(`Values: ${values}`);
  }

  if (field.placeholder) {
    parts.push(`Example: ${field.placeholder}`);
  }

  return parts.join('\n');
};

/**
 * Generates a GitHub issue URL for suggesting a new field
 */
export const generateNewFieldIssueUrl = (entityKind: EntityKind): string => {
  return generateSchemaIssueUrl({
    entityKind,
    proposedChange: `Add a new field to ${ENTITY_KIND_LABELS[entityKind]} schema`,
  });
};

/**
 * Generates a GitHub issue URL for field modification
 */
export const generateFieldModificationIssueUrl = (
  entityKind: EntityKind,
  field: FieldMetadata
): string => {
  const currentBehavior = getFieldDescription(field);

  return generateSchemaIssueUrl({
    entityKind,
    fieldName: field.key,
    currentBehavior,
    proposedChange: `Suggest improvements for the "${field.key}" field`,
  });
};

/**
 * Generates a GitHub issue URL for general schema enhancement
 */
export const generateSchemaEnhancementIssueUrl = (
  entityKind: EntityKind,
  currentSchema?: FieldMetadata[]
): string => {
  return generateSchemaIssueUrl({
    entityKind,
    proposedChange: `Suggest enhancements to the ${ENTITY_KIND_LABELS[entityKind]} schema`,
    currentBehavior: currentSchema ? currentSchema.map(getFieldDescription).join(';') : undefined,
  });
};
