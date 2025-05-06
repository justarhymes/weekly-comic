import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

// In the future, wrap with any Providers or Router if needed
export function renderWithProps(ui: ReactElement) {
  return render(ui);
}