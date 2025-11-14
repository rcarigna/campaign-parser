import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PersistentWelcome } from '../PersistentWelcome';
import userEvent from '@testing-library/user-event';

describe('PersistentWelcome', () => {
  it('renders welcome message and entity types', () => {
    render(<PersistentWelcome />);

    expect(screen.getByText('Welcome to Campaign Parser')).toBeInTheDocument();
    expect(screen.getByText('NPCs')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Quests')).toBeInTheDocument();
  });

  it('shows entity schema view when an entity type is clicked', async () => {
    render(<PersistentWelcome />);
    const npcButton = screen.getByText('NPCs');
    await userEvent.click(npcButton);
    expect(screen.getByTestId('entity-schema-view')).toBeInTheDocument();
  });

  it('toggles entity schema view when clicking the same entity type twice', async () => {
    render(<PersistentWelcome />);
    const npcButton = screen.getByText('NPCs');
    await userEvent.click(npcButton);
    expect(screen.getByTestId('entity-schema-view')).toBeInTheDocument();
    await userEvent.click(npcButton);
    expect(screen.queryByTestId('entity-schema-view')).not.toBeInTheDocument();
  });
});
