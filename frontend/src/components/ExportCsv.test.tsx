import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportCsv from './ExportCsv';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('ExportCsv', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders date inputs and button', () => {
    render(<ExportCsv />);
    expect(screen.getByText(/Export Power Consumption as CSV/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
  });

  it('shows error on failed export', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('fail'));
    render(<ExportCsv />);
    fireEvent.change(screen.getByLabelText(/from/i), { target: { value: '2024-01-01T00:00' } });
    fireEvent.change(screen.getByLabelText(/to/i), { target: { value: '2024-01-02T00:00' } });
    fireEvent.click(screen.getByRole('button', { name: /Export CSV/i }));
    expect(await screen.findByText(/Export failed/i)).toBeInTheDocument();
  });
});
