import { render, screen, waitFor } from '@testing-library/react';
import { EntityMergeModal } from './EntityMergeModal';
import { EntityKind, type EntityWithId } from '@/types';
import { getEntityIcon } from '@/lib/utils/entity';
import userEvent from '@testing-library/user-event';
import { FieldMetadata } from '@/types';

// Mock the entity utils
jest.mock('@/lib/utils/entity', () => {
  const getEntityIcon = jest.fn();
  const getIsEnumField = jest.fn((entityFields) => (fieldName: string) => {
    const fieldMeta = entityFields.find(
      (f: FieldMetadata) => f.key === fieldName
    );
    return fieldMeta?.type === 'select';
  });
  return {
    getEntityIcon,
    getIsEnumField,
    __esModule: true,
  };
});

const mockGetEntityIcon = getEntityIcon as jest.MockedFunction<
  typeof getEntityIcon
>;

describe('EntityMergeModal', () => {
  const mockOnClose = jest.fn();
  const mockOnMerge = jest.fn();
  const mockedGetEntityFields = jest.fn();

  const mockEntities: EntityWithId[] = [
    {
      id: '1',
      kind: EntityKind.PLAYER,
      title: 'Player 1',
      character_name: 'Jane Doe',
      race: 'Elf',
    },
    {
      id: '2',
      kind: EntityKind.PLAYER,
      title: 'Player 2',
      character_name: 'John Doe',
      player_name: 'John',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetEntityIcon.mockReturnValue('🧙');
    mockedGetEntityFields.mockReturnValue([
      { key: 'role', type: 'text' },
      { key: 'description', type: 'text' },
      { key: 'kind', type: 'select' },
      { key: 'race', type: 'select' },
    ]);
  });

  describe('Insufficient entities handling', () => {
    it('should show error message when less than 2 entities provided', () => {
      render(
        <EntityMergeModal
          entities={[mockEntities[0]]}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      expect(screen.getByText('⚠️ Insufficient Entities')).toBeInTheDocument();
      expect(
        screen.getByText('At least 2 entities are required for merging.')
      ).toBeInTheDocument();
    });

    it('should close modal when close button clicked in insufficient entities state', async () => {
      render(
        <EntityMergeModal
          entities={[mockEntities[0]]}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      await userEvent.click(screen.getByText('Close'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should close modal when overlay clicked in insufficient entities state', async () => {
      render(
        <EntityMergeModal
          entities={[mockEntities[0]]}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: '×' }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Primary entity selection', () => {
    it('should render all entities for selection', () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      expect(screen.getByDisplayValue('1')).toBeChecked();
      expect(screen.getByDisplayValue('2')).not.toBeChecked();
      expect(screen.getAllByText('John Doe')).toHaveLength(1);
    });

    it('should allow changing primary entity selection', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      const secondRadio = screen.getByDisplayValue('2');
      await userEvent.click(secondRadio);

      expect(screen.getByDisplayValue('2')).toBeChecked();
      expect(screen.getByDisplayValue('1')).not.toBeChecked();
    });

    it('should select first entity as primary by default', () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      expect(screen.getByDisplayValue('1')).toBeChecked();
    });
  });

  describe('Field merging', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should display fields with conflicting values', () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      //   expect(screen.getByText('player_name')).toBeInTheDocument();
      expect(screen.getByText('character_name')).toBeInTheDocument();
      expect(screen.getAllByText(/race/).length).toBeGreaterThan(0);
    });

    it('should allow selecting field values from different entities', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      const heroRadio = screen.getByDisplayValue('Player 2');
      await userEvent.click(heroRadio);

      expect(heroRadio).toBeChecked();
    });

    it('should show custom option for non-enum fields', () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );
      screen.debug();

      expect(screen.getAllByText('Custom / Combined')).toHaveLength(2);
    });

    it.skip('should not show custom option for enum fields', () => {
      //   mockedGetEntityFields.mockReturnValue([
      //     { key: 'role', type: 'select' },
      //     { key: 'description', type: 'text' },
      //   ]);

      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      const kindSection = screen
        .getByText('kind')
        .closest('.field-merge-group');
      const customOptions = kindSection?.querySelectorAll('.custom-option');
      expect(customOptions).toHaveLength(0);
    });

    it('should show custom input when custom mode is selected', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      const customRadio = screen
        .getAllByText('Custom / Combined')[0]
        .closest('label')
        ?.querySelector('input');
      await userEvent.click(customRadio!);

      expect(
        screen.getByPlaceholderText('Enter custom value for title...')
      ).toBeInTheDocument();
    });

    it('should handle custom value input', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      const customRadio = screen
        .getAllByText('Custom / Combined')[0]
        .closest('label')
        ?.querySelector('input');
      await userEvent.click(customRadio!);

      const textarea = screen.getByPlaceholderText(
        'Enter custom value for title...'
      );
      await userEvent.type(textarea, 'Combined Title');

      expect(textarea).toHaveValue('Combined Title');
    });
  });

  describe('Merged entity preview', () => {
    it('should display merged entity preview with primary entity data', () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      const previewSection = screen
        .getByText('3. Preview Merged Entity')
        .closest('.merge-section');
      expect(previewSection).toBeInTheDocument();
      expect(mockGetEntityIcon).toHaveBeenCalledWith('player');
    });

    it('should update preview when field selections change', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );
      expect(screen.getByTestId('preview-character_name')).toHaveTextContent(
        /character_name: Jane Doe/
      );
      await userEvent.click(screen.getByLabelText(/John Doe/));

      // The preview should reflect the selected value
      await waitFor(() =>
        expect(screen.getByTestId('preview-character_name')).toHaveTextContent(
          /character_name: John Doe/
        )
      );
    });
  });

  describe('Modal interactions', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    it('should close modal when cancel button is clicked', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );
      expect(mockOnClose).toHaveBeenCalledTimes(0);

      await userEvent.click(screen.getByText('Cancel'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should close modal when close button (×) is clicked', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: '×' }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not close modal when modal content is clicked', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      await userEvent.click(screen.getByText('🔄 Merge Duplicate Entities'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it.skip('should call onMerge with correct data when merge button is clicked', async () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      // Select a different value for role
      const heroRadio = screen.getByDisplayValue('player');
      await userEvent.click(heroRadio);

      // Click merge button
      await userEvent.click(screen.getByText('🔄 Merge 2 Entities'));

      expect(mockOnMerge).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          kind: 'character',
          title: 'John Doe',
          role: 'Hero',
        }),
        expect.objectContaining({
          role: 'Hero',
        })
      );
    });

    it('should display correct merge button text with entity count', () => {
      render(
        <EntityMergeModal
          entities={mockEntities}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      expect(screen.getByText('🔄 Merge 2 Entities')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty entities array gracefully', () => {
      render(
        <EntityMergeModal
          entities={[]}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      expect(screen.getByText('⚠️ Insufficient Entities')).toBeInTheDocument();
    });

    it('should handle entities with undefined fields', () => {
      const entitiesWithUndefined: EntityWithId[] = [
        {
          id: '1',
          kind: EntityKind.PLAYER,
          title: 'John Doe',
          character_name: '',
        },
        {
          id: '2',
          kind: EntityKind.PLAYER,
          title: 'John Doe',
          character_name: '',
        },
      ];

      render(
        <EntityMergeModal
          entities={entitiesWithUndefined}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      // Should only show fields that have values in multiple entities
      expect(screen.queryByText('role')).not.toBeInTheDocument();
      expect(screen.queryByText('description')).not.toBeInTheDocument();
    });

    it.skip('should handle entities with empty string values', () => {
      const entitiesWithEmptyStrings: EntityWithId[] = [
        {
          id: '1',
          kind: EntityKind.PLAYER,
          title: 'John Doe',
          character_name: '',
        },
        {
          id: '2',
          kind: EntityKind.PLAYER,
          title: 'John Doe',
          character_name: 'Hero',
        },
      ];

      render(
        <EntityMergeModal
          entities={entitiesWithEmptyStrings}
          onClose={mockOnClose}
          onMerge={mockOnMerge}
        />
      );

      expect(screen.getByText(/character_name/)).toBeInTheDocument();
    });
  });
});
