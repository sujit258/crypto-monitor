import React from 'react';
import { render } from '@testing-library/react';
import { SkeletonCard } from '../SkeletonCard';

describe('SkeletonCard', () => {
  it('should render without crashing', () => {
    const { container } = render(<SkeletonCard />);
    expect(container).toBeInTheDocument();
  });

  it('should have animate-pulse class for loading animation', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.firstChild;
    expect(card).toHaveClass('animate-pulse');
  });

  it('should have skeleton styling classes', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.firstChild;
    
    expect(card).toHaveClass('rounded-2xl');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('dark:bg-slate-900');
  });

  it('should render multiple skeleton elements for different sections', () => {
    const { container } = render(<SkeletonCard />);
    const skeletonElements = container.querySelectorAll('[class*="bg-slate"]');
    
    // Should have multiple skeleton placeholder elements
    expect(skeletonElements.length).toBeGreaterThan(1);
  });

  it('should have dark mode support', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.firstChild;
    
    expect(card).toHaveClass('dark:bg-slate-900');
    expect(card).toHaveClass('dark:border-slate-800');
  });
});
