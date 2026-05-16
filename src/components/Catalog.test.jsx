import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../data/products.json', () => ({
  default: [
    { id: 1, league: 'Premier League', team: 'Arsenal', type: 'Home 25/26', image: '/arsenal-home.jpg', price: 25 },
    { id: 2, league: 'Premier League', team: 'Arsenal', type: 'Retro 98/99', image: '/arsenal-retro.jpg', price: 30 },
    { id: 3, league: 'Premier League', team: 'Chelsea', type: 'Away 25/26', image: '/chelsea-away.jpg', price: 20 },
    { id: 4, league: 'La Liga', team: 'Real Madrid', type: 'Home 25/26', image: '/madrid-home.jpg', price: 22 },
  ],
}));

let Catalog;

beforeAll(async () => {
  ({ default: Catalog } = await import('./Catalog'));
});

describe('Catalog', () => {
  it('filters products by search and type', () => {
    render(<Catalog />);

    fireEvent.change(screen.getByPlaceholderText(/buscar equipo/i), { target: { value: 'Arsenal' } });

    expect(screen.getByText('2 resultados')).toBeTruthy();
    expect(document.querySelectorAll('.product-card')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Retro' }));
    expect(document.querySelectorAll('.product-card')).toHaveLength(1);
  });

  it('navigates from league to team to products', () => {
    const { container } = render(<Catalog />);
    const leagueGrid = container.querySelector('.league-grid');
    const premierButton = within(leagueGrid).getByRole('button', { name: /Premier League/ });

    fireEvent.click(premierButton);
    fireEvent.click(screen.getByRole('button', { name: /Arsenal/ }));

    expect(container.querySelectorAll('.product-card')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Volver' })).toBeTruthy();
  });
});
