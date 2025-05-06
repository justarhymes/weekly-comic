import { screen } from '@testing-library/react';
import ComicCard from '@/app/components/ComicCard';
import { mockComic } from '@/__mocks__/mockComic';
import { renderWithProps } from '@/test-utils';

// 👇 Mock framer-motion to inspect props passed to motion.div
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => (
      <div data-motion-props={JSON.stringify(rest)}>{children}</div>
    ),
  },
}));

describe('ComicCard', () => {
  it('renders the comic title and links to the detail page', () => {
    renderWithProps(<ComicCard comic={mockComic} index={0} />);
    const link = screen.getByRole('link', { name: /batman #1/i });
    expect(link).toHaveAttribute('href', `/comics/${mockComic.slug}`);
    expect(link).toHaveAttribute('title', 'View details for Batman #1');
  });

  it('displays the comic price correctly', () => {
    renderWithProps(<ComicCard comic={mockComic} index={0} />);
    expect(screen.getByText('$3.99')).toBeInTheDocument();
  });

  it('displays the comic image with appropriate alt text', () => {
    renderWithProps(<ComicCard comic={mockComic} index={0} />);
    const image = screen.getByAltText(/cover of batman #1/i);
    expect(image).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { container } = renderWithProps(<ComicCard comic={mockComic} index={0} />);
    expect(container).toMatchSnapshot();
  });

  it('applies animation delay based on index', () => {
    const index = 4;
    const { container } = renderWithProps(<ComicCard comic={mockComic} index={index} />);
    const motionDiv = container.querySelector('[data-motion-props]');
    expect(motionDiv).toBeInTheDocument();

    const props = JSON.parse(motionDiv!.getAttribute('data-motion-props') || '{}');
    expect(props.transition.delay).toBeCloseTo(index * 0.05);
  });
});
