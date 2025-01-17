import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Scooti. heading from AdminLoginForm', () => {
  render(<App />);
  const headingElement = screen.getByText(/Scooti\./i);
  expect(headingElement).toBeInTheDocument();
});