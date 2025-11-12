import { render, screen } from '@testing-library/react';
import { PrimaryEntitySelector } from '../PrimaryEntitySelector';
import { mockPrimaryEntities } from '@/components/__mocks__/mergeModalMocks/primaryEntitySelectorMocks';
import { EntityWithId, PrimaryEntitySelectorProps } from '@/types';
import userEvent from '@testing-library/user-event';

export const renderEntityDetailMock = (
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
    entities: mockPrimaryEntities,
    primaryEntityId,
    setPrimaryEntityId,
    renderEntityDetail: renderEntityDetailMock,
  };
  render(<PrimaryEntitySelector {...props} />);
  return { setPrimaryEntityId };
};

describe('PrimaryEntitySelector', () => {
  it('renders all entities as radio options', () => {
    setup();
    mockPrimaryEntities.forEach((entity) => {
      expect(
        screen.getByRole('radio', { name: new RegExp(entity.title, 'i') })
      ).toBeInTheDocument();
    });
  });

  it('checks the radio for the selected primary entity', () => {
    setup('2');
    const radio = screen.getByRole('radio', {
      name: new RegExp(mockPrimaryEntities[1].title, 'i'),
    }) as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it('calls setPrimaryEntityId when a radio is selected', async () => {
    const setPrimaryEntityId = jest.fn();
    setup('1', setPrimaryEntityId);
    const radio = screen.getByRole('radio', {
      name: new RegExp(mockPrimaryEntities[1].title, 'i'),
    }) as HTMLInputElement;
    await userEvent.click(radio);
    expect(setPrimaryEntityId).toHaveBeenCalledWith('2');
  });

  it('renders section heading', () => {
    setup();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      '1. Select Primary Entity'
    );
  });
});
