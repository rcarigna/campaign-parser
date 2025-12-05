import { render, screen, fireEvent } from '@testing-library/react';
import { EntityTypeCard } from './EntityTypeCard';
import type { EntityMetadata } from '@/types';
import { EntityKind } from '@/types';

const metadata: EntityMetadata = {
  kind: EntityKind.NPC,
  emoji: '🧑',
  label: 'Non Player Character',
  description: 'Represents a non player character entity',
  color: '',
};

describe('EntityTypeCard', () => {
  it('renders entity metadata correctly', () => {
    render(
      <EntityTypeCard
        metadata={metadata}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(metadata.emoji)).toBeInTheDocument();
    expect(screen.getByText(metadata.label)).toBeInTheDocument();
    expect(screen.getByText(metadata.description)).toBeInTheDocument();
  });

  it('applies selected class when isSelected is true', () => {
    render(
      <EntityTypeCard
        metadata={metadata}
        isSelected={true}
        onClick={jest.fn()}
      />
    );
    const card = screen.getByRole('button');
    expect(card.className).toContain('selected');
    expect(card).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not apply selected class when isSelected is false', () => {
    render(
      <EntityTypeCard
        metadata={metadata}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    const card = screen.getByRole('button');
    expect(card.className).not.toContain('selected');
    expect(card).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onClick with kind when clicked', () => {
    const handleClick = jest.fn();
    render(
      <EntityTypeCard
        metadata={metadata}
        isSelected={false}
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(metadata.kind);
  });

  it('calls onClick with kind when Enter key is pressed', () => {
    const handleClick = jest.fn();
    render(
      <EntityTypeCard
        metadata={metadata}
        isSelected={false}
        onClick={handleClick}
      />
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith(metadata.kind);
  });

  it('calls onClick with kind when Space key is pressed', () => {
    const handleClick = jest.fn();
    render(
      <EntityTypeCard
        metadata={metadata}
        isSelected={false}
        onClick={handleClick}
      />
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(handleClick).toHaveBeenCalledWith(metadata.kind);
  });

  it('does not call onClick for other keys', () => {
    const handleClick = jest.fn();
    render(
      <EntityTypeCard
        metadata={metadata}
        isSelected={false}
        onClick={handleClick}
      />
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
    expect(handleClick).not.toHaveBeenCalled();
  });
});
