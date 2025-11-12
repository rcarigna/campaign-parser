import { render, screen } from '@testing-library/react';
import {
  MergedEntityPreview,
  type MergedEntityPreviewProps,
} from './MergedEntityPreview';
import { mockNPCEntity } from '@/components/__mocks__/mockedEntities';

jest.mock('@/lib/utils/entity', () => ({
  getEntityIcon: jest.fn().mockReturnValue('🗂️'),
}));

const testEntity = {
  ...mockNPCEntity,
  title: 'John Doe',
  // Only add fields that exist on NPC type
  // For this test, let's use 'role' and 'faction' as extra fields
  role: 'Stranger',
  faction: 'Unknown',
};

const getProps = (
  overrides: Partial<MergedEntityPreviewProps> = {}
): MergedEntityPreviewProps => ({
  primaryEntity: testEntity,
  allFields: ['kind', 'title', 'role', 'faction'],
  mergedFields: {},
  ...overrides,
});

describe('MergedEntityPreview', () => {
  it('renders nothing if primaryEntity is undefined', () => {
    render(
      <MergedEntityPreview
        primaryEntity={undefined}
        allFields={['kind', 'title']}
        mergedFields={{}}
      />
    );
    expect(screen.queryByText('entity-card')).not.toBeInTheDocument();
  });

  it('renders entity icon, type, and title', () => {
    const props = getProps();
    render(<MergedEntityPreview {...props} />);
    expect(screen.getByText('🗂️')).toBeInTheDocument();
    expect(screen.getByText(props.primaryEntity!.kind)).toBeInTheDocument();
    expect(screen.getByText(props.primaryEntity!.title)).toBeInTheDocument();
  });

  it('renders all non-kind/title fields from primaryEntity', () => {
    const props = getProps();
    render(<MergedEntityPreview {...props} />);
    expect(screen.getByTestId('preview-role')).toHaveTextContent(
      'role: Stranger'
    );
    expect(screen.getByTestId('preview-faction')).toHaveTextContent(
      'faction: Unknown'
    );
    expect(screen.queryByTestId('preview-kind')).not.toBeInTheDocument();
    expect(screen.queryByTestId('preview-title')).not.toBeInTheDocument();
  });

  it('renders mergedFields values over primaryEntity values', () => {
    const props = getProps({
      mergedFields: { role: 'Merged Role', faction: 'Merged Faction' },
    });
    render(<MergedEntityPreview {...props} />);
    expect(screen.getByTestId('preview-role')).toHaveTextContent(
      'role: Merged Role'
    );
    expect(screen.getByTestId('preview-faction')).toHaveTextContent(
      'faction: Merged Faction'
    );
  });

  it('does not render fields with falsy values', () => {
    const entity = {
      ...getProps().primaryEntity!,
      role: '',
      faction: '',
    };
    render(
      <MergedEntityPreview
        primaryEntity={entity}
        allFields={['role', 'faction']}
        mergedFields={{}}
      />
    );
    expect(screen.queryByTestId('preview-role')).not.toBeInTheDocument();
    expect(screen.queryByTestId('preview-faction')).not.toBeInTheDocument();
  });
});
