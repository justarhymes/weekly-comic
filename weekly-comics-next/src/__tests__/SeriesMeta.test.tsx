import { screen } from '@testing-library/react';
import { renderWithProps } from '@/test-utils';
import SeriesMeta from '@/app/components/SeriesMeta';

describe('SeriesMeta', () => {
  it('renders publisher, type, and genre with separators', () => {
    renderWithProps(<SeriesMeta publisher="DC" type="Ongoing" genre="Superhero" />);
    expect(screen.getByText((text) => text.includes('DC'))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes('Ongoing'))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes('Superhero'))).toBeInTheDocument();
  });

  it('renders genres from array and joins with slashes', () => {
    renderWithProps(<SeriesMeta publisher="DC" genre={['Fantasy', 'Sci-Fi']} />);
    expect(screen.getByText((text) => text.includes('DC'))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes('Fantasy / Sci-Fi'))).toBeInTheDocument();
  });

  it('renders with sr-only class and correct aria-hidden when screenReaderOnly is true', () => {
    const { container } = renderWithProps(
      <SeriesMeta publisher="DC" type="Limited" genre="Horror" screenReaderOnly />
    );
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveClass('sr-only');
    expect(wrapper).toHaveAttribute('aria-hidden', 'false');
  });

  it('renders null when no data is provided', () => {
    const { container } = renderWithProps(<SeriesMeta />);
    expect(container.firstChild).toBeNull();
  });
});
