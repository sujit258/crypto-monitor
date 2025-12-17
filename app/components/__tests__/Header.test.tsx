import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import type { SortType } from '../../lib/crypto';

describe('Header', () => {
  const mockProps = {
    searchTerm: '',
    onSearchChange: jest.fn(),
    sortType: 'default' as SortType,
    onSortChange: jest.fn(),
    visibleCount: 10,
    totalCount: 50,
    isRefreshing: false,
    onRefresh: jest.fn(),
    isDark: false,
    onThemeToggle: jest.fn(),
    currentTime: '2024-01-01 12:00:00',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the app title', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText('CryptoMonitor')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText('Live Market Data')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<Header {...mockProps} />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should call onSearchChange when typing in search', () => {
    render(<Header {...mockProps} />);
    const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: 'BTC' } });
    expect(mockProps.onSearchChange).toHaveBeenCalledWith('BTC');
  });

  it('should display visible and total count', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText(/10\s*\/\s*50/)).toBeInTheDocument();
  });

  it('should render sort dropdown with options', () => {
    render(<Header {...mockProps} />);
    const sortSelect = screen.getByDisplayValue('default');
    expect(sortSelect).toBeInTheDocument();
  });

  it('should call onSortChange when sort option is selected', () => {
    render(<Header {...mockProps} />);
    const sortSelect = screen.getByDisplayValue('default') as HTMLSelectElement;
    
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    expect(mockProps.onSortChange).toHaveBeenCalledWith('name');
  });

  it('should render refresh button', () => {
    render(<Header {...mockProps} />);
    const buttons = screen.getAllByRole('button');
    const refreshBtn = buttons.find(btn => btn.title?.includes('refresh') || btn.textContent?.includes('↻'));
    expect(refreshBtn).toBeInTheDocument();
  });

  it('should call onRefresh when refresh button is clicked', () => {
    render(<Header {...mockProps} />);
    const buttons = screen.getAllByRole('button');
    const refreshBtn = buttons.find(btn => btn.title?.includes('refresh') || btn.textContent?.includes('↻'));
    
    if (refreshBtn) {
      fireEvent.click(refreshBtn);
      expect(mockProps.onRefresh).toHaveBeenCalled();
    }
  });

  it('should render theme toggle button', () => {
    render(<Header {...mockProps} />);
    const buttons = screen.getAllByRole('button');
    const themeBtn = buttons.find(btn => btn.title?.includes('theme') || btn.title?.includes('Dark'));
    expect(themeBtn).toBeInTheDocument();
  });

  it('should call onThemeToggle when theme button is clicked', () => {
    render(<Header {...mockProps} />);
    const buttons = screen.getAllByRole('button');
    const themeBtn = buttons.find(btn => btn.title?.includes('theme') || btn.title?.includes('Dark'));
    
    if (themeBtn) {
      fireEvent.click(themeBtn);
      expect(mockProps.onThemeToggle).toHaveBeenCalled();
    }
  });

  it('should display current time', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText('2024-01-01 12:00:00')).toBeInTheDocument();
  });

  it('should show loading state when refreshing', () => {
    const { rerender } = render(<Header {...mockProps} />);
    
    rerender(<Header {...mockProps} isRefreshing={true} />);
    // The refresh button should have a different state (usually disabled or show spinner)
    const buttons = screen.getAllByRole('button');
    const refreshBtn = buttons.find(btn => btn.title?.includes('refresh'));
    expect(refreshBtn).toHaveAttribute('disabled');
  });

  it('should update search input value', () => {
    const { rerender } = render(<Header {...mockProps} />);
    
    rerender(<Header {...mockProps} searchTerm="ETH" />);
    const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    expect(searchInput.value).toBe('ETH');
  });

  it('should update sort select value', () => {
    const { rerender } = render(<Header {...mockProps} />);
    
    rerender(<Header {...mockProps} sortType="price-asc" />);
    const sortSelect = screen.getByDisplayValue('price-asc');
    expect(sortSelect).toBeInTheDocument();
  });
});
