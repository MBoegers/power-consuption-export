import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Login', () => {
  it('renders login form', () => {
    render(<Login onLogin={jest.fn()} />);
    // Es gibt mehrere Elemente mit "Login"-Text, daher gezielt das Überschrift-Element prüfen
    const headings = screen.getAllByText(/Login/i);
    expect(headings.some(h => h.tagName === 'H2')).toBe(true);
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('calls onLogin on successful login', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: { token: 'testtoken' } });
    const onLogin = jest.fn();
    render(<Login onLogin={onLogin} />);
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await screen.findByText(/Login/i); // wartet auf ein Login-Element, um async zu sein
    expect(onLogin).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBe('testtoken');
  });

  it('shows error on failed login', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('fail'));
    render(<Login onLogin={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(await screen.findByText(/Login failed/i)).toBeInTheDocument();
  });
});
