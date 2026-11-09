import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() => new Promise(() => {}));
});

test('renders the brand and the menu loading state', () => {
  render(<App />);
  expect(screen.getAllByText(/Bite-Cloud/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('status')).toHaveTextContent(/loading the menu/i);
});
