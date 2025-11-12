import { render, screen, fireEvent } from '@testing-library/react';
import {
  PrimaryEntitySelector,
  type PrimaryEntitySelectorProps,
} from '../PrimaryEntitySelector';
import { EntityKind, type EntityWithId } from '@/types';

const mockEntities: EntityWithId[] = [
  {
    id: '1',
    kind: EntityKind.NPC,
    title: 'Alice',
  },
  {
    id: '2',
    kind: EntityKind.LOCATION,
    title: 'Wonderland',
  },
];

const renderEntityDetail = (
  entity: EntityWithId,
  field: string,
  label: string
) => (
  <span data-testid={`detail-${entity.id}-${field}`}>
    {label}: {entity[field as keyof EntityWithId]}
  </span>
);

const setup = (primaryEntityId = '1', setPrimaryEntityId = jest.fn()) => {
  const props: PrimaryEntitySelectorProps = {
    entities: mockEntities,
    primaryEntityId,
    setPrimaryEntityId,
    renderEntityDetail,
  };
  render(<PrimaryEntitySelector {...props} />);
  return { setPrimaryEntityId };
};

describe('PrimaryEntitySelector', () => {
  it('renders all entities as radio options', () => {
    setup();
    mockEntities.forEach((entity) => {
      expect(
        screen.getByRole('radio', { name: new RegExp(entity.title, 'i') })
      ).toBeInTheDocument();
    });
  });

  it('checks the radio for the selected primary entity', () => {
    setup('2');
    const radio = screen.getByRole('radio', {
      name: new RegExp(mockEntities[1].title, 'i'),
    }) as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it('calls setPrimaryEntityId when a radio is selected', () => {
    const setPrimaryEntityId = jest.fn();
    setup('1', setPrimaryEntityId);
    const radio = screen.getByRole('radio', {
      name: new RegExp(mockEntities[1].title, 'i'),
    }) as HTMLInputElement;
    fireEvent.click(radio);
    expect(setPrimaryEntityId).toHaveBeenCalledWith('2');
  });

  it('renders section heading', () => {
    setup();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      '1. Select Primary Entity'
    );
  });
});
