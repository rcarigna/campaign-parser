import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App Component', () => {
  test('renders document parser heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/document parser/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders upload instructions', () => {
    render(<App />);
    const uploadText = screen.getByText(
      /click to select a file or drag and drop/i
    );
    expect(uploadText).toBeInTheDocument();
  });

  test('shows supported formats', () => {
    render(<App />);
    const formatsText = screen.getByText(/supported formats/i);
    expect(formatsText).toBeInTheDocument();
  });
});
