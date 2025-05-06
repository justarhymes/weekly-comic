import { screen } from '@testing-library/react';
import IssueDetails from '@/app/components/IssueDetails';
import { mockComic } from '@/__mocks__/mockComic';
import { renderWithProps } from '@/test-utils';

describe('IssueDetails', () => {
  it('renders all expected fields from the Batman mock comic', () => {
    renderWithProps(<IssueDetails comic={mockComic} />);

    expect(screen.getByText('Issue Info')).toBeInTheDocument();
    expect(screen.getByText('Release Date:')).toBeInTheDocument();
    expect(screen.getByText('May 1, 2025')).toBeInTheDocument();
    expect(screen.getByText('Price:')).toBeInTheDocument();
    expect(screen.getByText('$3.99')).toBeInTheDocument();
    expect(screen.getByText('Issue:')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Pages:')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('Rating:')).toBeInTheDocument();
    expect(screen.getByText('T+')).toBeInTheDocument();
    expect(screen.getByText('UPC:')).toBeInTheDocument();
    expect(screen.getByText('123456789012')).toBeInTheDocument();
  });

  it('renders nothing if all values are missing', () => {
    const emptyComic = {
      ...mockComic,
      issue_number: '',
      release_date: '',
      price: 0,
      page_count: undefined,
      rating: '',
      upc: '',
    };

    renderWithProps(<IssueDetails comic={emptyComic} />);

    expect(screen.queryByText('Release Date:')).not.toBeInTheDocument();
    expect(screen.queryByText('Price:')).not.toBeInTheDocument();
    expect(screen.queryByText('Issue:')).not.toBeInTheDocument();
    expect(screen.queryByText('Pages:')).not.toBeInTheDocument();
    expect(screen.queryByText('Rating:')).not.toBeInTheDocument();
    expect(screen.queryByText('UPC:')).not.toBeInTheDocument();
  });
});
