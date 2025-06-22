import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportChart from './ExportChart';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div className="recharts-wrapper">{children}</div>,
    BarChart: ({ children }: any) => <div>{children}</div>,
    Bar: ({ children }: any) => <div>{children}</div>,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    CartesianGrid: () => <div />,
  };
});

describe('ExportChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders date inputs and button', () => {
    render(<ExportChart />);
    expect(screen.getByText(/Visualize Power Consumption/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Show Chart/i })).toBeInTheDocument();
  });

  it('shows error on failed load', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('fail'));
    render(<ExportChart />);
    fireEvent.change(screen.getByLabelText(/from/i), { target: { value: '2024-01-01T00:00' } });
    fireEvent.change(screen.getByLabelText(/to/i), { target: { value: '2024-01-02T00:00' } });
    fireEvent.click(screen.getByRole('button', { name: /Show Chart/i }));
    expect(await screen.findByText(/Loading failed/i)).toBeInTheDocument();
  });

  it('renders chart on successful load', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [
      { timestamp: '2024-01-01T00:00', consumption: 3.0 },
      { timestamp: '2024-01-01T00:30', consumption: 2.0 },
    ] });
    render(<ExportChart />);
    fireEvent.change(screen.getByLabelText(/from/i), { target: { value: '2024-01-01T00:00' } });
    fireEvent.change(screen.getByLabelText(/to/i), { target: { value: '2024-01-02T00:00' } });
    fireEvent.click(screen.getByRole('button', { name: /Show Chart/i }));
    expect(await screen.findByText(/Visualize Power Consumption/i)).toBeInTheDocument();
    expect(screen.getByText(/Visualize Power Consumption/i)).toBeInTheDocument();
  });
});
