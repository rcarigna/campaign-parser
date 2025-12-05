import { render, screen } from '@testing-library/react';
import { EntityTypesGrid } from './EntityTypesGrid';
import { EntityKind, EntityMetadata } from '@/types';
import { getAllEntityMetadata } from '@/lib/utils/entity';
import userEvent from '@testing-library/user-event';

// Mock getAllEntityMetadata
jest.mock('@/lib/utils/entity', () => ({
  getAllEntityMetadata: jest.fn(),
}));

// Sample entity metadata
const mockEntityTypes: EntityMetadata[] = [
  {
    kind: EntityKind.NPC,
    label: 'Person',
    emoji: '👤',
    description: 'A person entity',
    color: '#FFD700',
  },
  {
    kind: EntityKind.LOCATION,
    label: 'Location',
    emoji: '📍',
    description: 'A location entity',
    color: '#1E90FF',
  },
];

describe('EntityTypesGrid', () => {
  const onEntityClick = jest.fn();

  beforeEach(() => {
    (getAllEntityMetadata as jest.Mock).mockReturnValue(mockEntityTypes);
    onEntityClick.mockClear();
  });

  it('renders all entity type cards', () => {
    render(
      <EntityTypesGrid selectedEntity={null} onEntityClick={onEntityClick} />
    );
    mockEntityTypes.forEach((metadata) => {
      expect(screen.getByText(metadata.label)).toBeInTheDocument();
    });
  });

  it('highlights the selected entity type', () => {
    render(
      <EntityTypesGrid
        selectedEntity={EntityKind.NPC}
        onEntityClick={onEntityClick}
      />
    );
    const selectedCard = screen.getByText('Person');
    expect(selectedCard.parentElement).toHaveClass('selected');
  });

  it('calls onEntityClick when an entity card is clicked', async () => {
    render(
      <EntityTypesGrid selectedEntity={null} onEntityClick={onEntityClick} />
    );
    const personCard = screen.getByText('Person');
    await userEvent.click(personCard);
    expect(onEntityClick).toHaveBeenCalledWith(EntityKind.NPC);
  });
});
