import { render, screen, fireEvent } from '@testing-library/react';
import { EntityViewer } from './EntityViewer';
import {
  type SerializedParsedDocumentWithEntities,
  DocumentType,
} from '../types/constants';

const mockParsedData: SerializedParsedDocumentWithEntities = {
  filename: 'test.md',
  type: DocumentType.MARKDOWN,
  metadata: {
    size: 1000,
    lastModified: '2024-01-01T00:00:00.000Z',
    mimeType: 'text/markdown',
  },
  content: {
    raw: 'Test content',
    html: '<p>Test content</p>',
    text: 'Test content',
    frontmatter: {},
    headings: [],
    links: [],
    images: [],
  },
  entities: [
    {
      kind: 'npc',
      title: 'Durnan',
      role: 'barkeep',
      description: 'Friendly tavern keeper',
      location: 'Yawning Portal',
    },
    {
      kind: 'npc',
      title: 'Durnan', // Duplicate for testing
      role: 'innkeeper',
    },
    {
      kind: 'location',
      title: 'Yawning Portal',
      type: 'tavern',
    },
    {
      kind: 'item',
      title: 'Magic Sword',
      type: 'weapon',
    },
    {
      kind: 'quest',
      title: 'Rescue the Princess',
      status: 'active',
    },
  ],
};

describe('EntityViewer', () => {
  it('renders entities correctly', () => {
    render(<EntityViewer parsedData={mockParsedData} />);

    expect(screen.getByText('📋 Extracted Entities (5)')).toBeInTheDocument();

    // Check for entity titles - there are 2 Durnan NPCs
    const durnanElements = screen.getAllByText('Durnan');
    expect(durnanElements).toHaveLength(2);

    expect(screen.getByText('Yawning Portal')).toBeInTheDocument();
    expect(screen.getByText('Magic Sword')).toBeInTheDocument();
    expect(screen.getByText('Rescue the Princess')).toBeInTheDocument();
  });

  it('filters entities by type', () => {
    render(<EntityViewer parsedData={mockParsedData} />);

    const filterSelect = screen.getByLabelText('Filter by type:');
    fireEvent.change(filterSelect, { target: { value: 'npc' } });

    // Should show both NPCs
    expect(screen.getAllByText('Durnan')).toHaveLength(2);
    // Should not show location
    expect(screen.queryByText('Yawning Portal')).not.toBeInTheDocument();
  });

  it('detects and highlights duplicates', () => {
    render(<EntityViewer parsedData={mockParsedData} />);

    // Check for duplicate badges
    const duplicateBadges = screen.getAllByText('DUPE');
    expect(duplicateBadges).toHaveLength(2); // Both Durnan entries
  });

  it('shows missing fields warnings', () => {
    render(<EntityViewer parsedData={mockParsedData} />);

    // Look for missing field indicators
    expect(screen.getAllByText(/Missing:/)).toHaveLength(5); // All entities missing some fields
  });

  it('opens edit modal when entity card is clicked', () => {
    render(<EntityViewer parsedData={mockParsedData} />);

    const entityCard = screen.getAllByText('Durnan')[0].closest('.entity-card');
    fireEvent.click(entityCard!);

    expect(screen.getByText('Edit npc: Durnan')).toBeInTheDocument();
  });

  it('handles empty entities', () => {
    const emptyData = { ...mockParsedData, entities: [] };
    render(<EntityViewer parsedData={emptyData} />);

    expect(
      screen.getByText('No entities found in this document.')
    ).toBeInTheDocument();
  });

  it('handles null data', () => {
    render(<EntityViewer parsedData={null} />);

    expect(
      screen.getByText('No entities found in this document.')
    ).toBeInTheDocument();
  });
});
