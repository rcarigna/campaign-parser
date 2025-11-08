import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PersistentWelcome } from '../PersistentWelcome';

describe('PersistentWelcome', () => {
  it('renders welcome message and entity types', () => {
    render(<PersistentWelcome />);

    expect(screen.getByText('Welcome to Campaign Parser')).toBeInTheDocument();
    expect(screen.getByText('NPCs')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Quests')).toBeInTheDocument();
  });
});
