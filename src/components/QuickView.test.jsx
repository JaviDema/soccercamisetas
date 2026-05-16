import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import QuickView from './QuickView';

const product = { team: 'Real Madrid', type: 'Home 25/26', image: '/rm.jpg', price: 30 };

describe('QuickView', () => {
  it('focuses the close button and closes on Escape', () => {
    const onClose = vi.fn();

    const { unmount } = render(<QuickView product={product} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: 'Cerrar' });
    expect(document.activeElement).toBe(closeButton);
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes when clicking the overlay', () => {
    const onClose = vi.fn();

    render(<QuickView product={product} onClose={onClose} />);

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
