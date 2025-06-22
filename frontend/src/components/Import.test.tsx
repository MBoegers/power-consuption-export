import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Import from './Import';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Import', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file input and button', () => {
    render(<Import />);
    expect(screen.getByText(/Import Power Consumption Data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import CSV/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/file/i)).toBeInTheDocument();
  });

  it('shows success message on successful import', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: 'Import erfolgreich' });
    render(<Import />);
    const file = new File(['timestamp,consumption\n2024-01-01 00:00:00,1.0'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(screen.getByLabelText(/file/i), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Import CSV/i }));
    expect(await screen.findByText(/Import erfolgreich/i)).toBeInTheDocument();
  });

  it('shows error message on failed import', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('fail'));
    render(<Import />);
    const file = new File(['timestamp,consumption\n2024-01-01 00:00:00,1.0'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(screen.getByLabelText(/file/i), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Import CSV/i }));
    expect(await screen.findByText(/Import failed/i)).toBeInTheDocument();
  });
});
