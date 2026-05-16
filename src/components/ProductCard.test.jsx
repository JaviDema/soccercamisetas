import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('renders fallback price and badge style for type', () => {
    const product = { team: 'Arsenal', type: 'Retro 98/99', image: '/arsenal.jpg' };

    render(<ProductCard product={product} onQuickView={() => {}} />);

    const badge = screen.getByText('Retro 98/99');
    expect(screen.getByText('15€')).toBeTruthy();
    expect(badge.className).toContain('badge-retro');
  });

  it('invokes quick view callback when clicked', () => {
    const onQuickView = vi.fn();
    const product = { team: 'Chelsea', type: 'Away 25/26', image: '/chelsea.jpg', price: 25 };

    render(<ProductCard product={product} onQuickView={onQuickView} />);

    fireEvent.click(screen.getByRole('button', { name: /ver detalles/i }));
    expect(onQuickView).toHaveBeenCalledTimes(1);
  });
});
