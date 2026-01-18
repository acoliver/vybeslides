import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Table } from './Table';

describe('Table - grid rendering', () => {
  it('should render table headers', () => {
    const { getByText } = render(<Table headers={['Name', 'Age']} rows={[['Alice', '30']]} />);
    expect(getByText('Name')).toBeTruthy();
  });

  it('should render table rows', () => {
    const { getByText } = render(
      <Table
        headers={['Name', 'Age']}
        rows={[
          ['Alice', '30'],
          ['Bob', '25'],
        ]}
      />,
    );
    expect(getByText('Alice')).toBeTruthy();
  });
});

describe('Table - column alignment', () => {
  it('should render multi-column table', () => {
    const { getByText } = render(
      <Table headers={['Col1', 'Col2', 'Col3']} rows={[['A', 'B', 'C']]} />,
    );
    expect(getByText('Col1')).toBeTruthy();
  });
});
