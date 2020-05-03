import React from 'react';
import { render } from '@testing-library/react';
import Video from './App';

test('renders learn react link', () => {
  const { getByText } = render(<Video />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
