import React from 'react';
import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { CryptoCard } from '../CryptoCard';
import type { CryptoRate } from '../../lib/crypto';

// Mock the color utilities
jest.mock('../../lib/utils', () => ({
  stringToColor: () => 'hsl(100, 70%, 85%)',
  stringToTextColor: () => 'hsl(100, 80%, 30%)',
}));

describe('CryptoCard', () => {
  const mockCrypto: CryptoRate = {
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUSD: 50000,
    priceBTC: 1,
  };

  const renderWithDnd = (component: React.ReactNode) => {
    return render(
      <DndContext>
        <SortableContext items={['BTC']}>
          {component}
        </SortableContext>
      </DndContext>
    );
  };

  it('should render crypto name and symbol', () => {
    renderWithDnd(<CryptoCard crypto={mockCrypto} id="BTC" />);

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('should display USD price formatted with 2 decimals', () => {
    renderWithDnd(<CryptoCard crypto={mockCrypto} id="BTC" />);

    const usdPrice = screen.getByText('$50,000.00');
    expect(usdPrice).toBeInTheDocument();
  });

  it('should display BTC price with 7 decimals', () => {
    renderWithDnd(<CryptoCard crypto={mockCrypto} id="BTC" />);

    const btcPrice = screen.getByText('1.0000000');
    expect(btcPrice).toBeInTheDocument();
  });

  it('should display "USD Price" label', () => {
    renderWithDnd(<CryptoCard crypto={mockCrypto} id="BTC" />);

    expect(screen.getByText('USD Price')).toBeInTheDocument();
  });

  it('should display "BTC Value" label', () => {
    renderWithDnd(<CryptoCard crypto={mockCrypto} id="BTC" />);

    expect(screen.getByText('BTC Value')).toBeInTheDocument();
  });

  it('should render drag handle with correct title', () => {
    renderWithDnd(<CryptoCard crypto={mockCrypto} id="BTC" />);

    const buttons = screen.getAllByRole('button');
    const dragButton = buttons.find(btn => btn.getAttribute('title') === 'Drag card to reorder');
    expect(dragButton).toHaveAttribute('title', 'Drag card to reorder');
  });

  it('should format large USD prices with commas', () => {
    const expensiveCrypto: CryptoRate = {
      ...mockCrypto,
      priceUSD: 99999.99,
    };

    renderWithDnd(<CryptoCard crypto={expensiveCrypto} id="BTC" />);

    expect(screen.getByText('$99,999.99')).toBeInTheDocument();
  });

  it('should format small BTC prices correctly', () => {
    const smallCrypto: CryptoRate = {
      ...mockCrypto,
      priceUSD: 100,
      priceBTC: 0.0000200,
    };

    renderWithDnd(<CryptoCard crypto={smallCrypto} id="TEST" />);

    expect(screen.getByText('0.0000200')).toBeInTheDocument();
  });
});
