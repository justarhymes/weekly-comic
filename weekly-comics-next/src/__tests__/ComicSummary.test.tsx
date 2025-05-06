import { screen } from '@testing-library/react';
import { renderWithProps } from '@/test-utils';
import ComicSummary from '@/app/components/ComicSummary';

describe('ComicSummary', () => {
  it('renders the summary when provided', () => {
    const summary = 'A mysterious figure haunts Gotham.';
    renderWithProps(<ComicSummary summary={summary} />);
    expect(screen.getByText(summary)).toBeInTheDocument();
  });

  it('includes a visually hidden heading', () => {
    renderWithProps(<ComicSummary summary="Summary content" />);
    const heading = screen.getByRole('heading', { name: /summary/i });
    expect(heading).toHaveClass('sr-only');
  });

  it('renders nothing when no summary is provided', () => {
    const { container } = renderWithProps(<ComicSummary />);
    expect(container.firstChild).toBeNull();
  });
});
