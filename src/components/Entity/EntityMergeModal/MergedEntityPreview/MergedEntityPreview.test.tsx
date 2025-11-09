import { render, screen } from '@testing-library/react';
import {
  MergedEntityPreview,
  type MergedEntityPreviewProps,
} from './MergedEntityPreview';
import { EntityKind } from '@/types';

jest.mock('@/lib/utils/entity', () => ({
  getEntityIcon: jest.fn().mockReturnValue('🗂️'),
}));

const baseEntity = {
  id: '1',
  kind: EntityKind.NPC,
  title: 'John Doe',
  description: 'A mysterious stranger',
  age: 42,
} as const;

const defaultProps: MergedEntityPreviewProps = {
  primaryEntity: baseEntity,
  allFields: ['kind', 'title', 'description', 'age'],
  mergedFields: {},
};

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
    render(<MergedEntityPreview {...defaultProps} />);
    expect(screen.getByText('🗂️')).toBeInTheDocument();
    expect(screen.getByText(baseEntity.kind)).toBeInTheDocument();
    expect(screen.getByText(baseEntity.title)).toBeInTheDocument();
  });

  it('renders all non-kind/title fields from primaryEntity', () => {
    render(<MergedEntityPreview {...defaultProps} />);
    expect(screen.getByTestId('preview-description')).toHaveTextContent(
      'description: A mysterious stranger'
    );
    expect(screen.getByTestId('preview-age')).toHaveTextContent('age: 42');
    expect(screen.queryByTestId('preview-kind')).not.toBeInTheDocument();
    expect(screen.queryByTestId('preview-title')).not.toBeInTheDocument();
  });

  it('renders mergedFields values over primaryEntity values', () => {
    const mergedFields = { description: 'Merged desc', age: 99 };
    render(
      <MergedEntityPreview {...defaultProps} mergedFields={mergedFields} />
    );
    expect(screen.getByTestId('preview-description')).toHaveTextContent(
      'description: Merged desc'
    );
    expect(screen.getByTestId('preview-age')).toHaveTextContent('age: 99');
  });

  it('does not render fields with falsy values', () => {
    const entity = { ...baseEntity, description: '', age: null };
    render(
      <MergedEntityPreview
        primaryEntity={entity}
        allFields={['description', 'age']}
        mergedFields={{}}
      />
    );
    expect(screen.queryByTestId('preview-description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('preview-age')).not.toBeInTheDocument();
  });
});
