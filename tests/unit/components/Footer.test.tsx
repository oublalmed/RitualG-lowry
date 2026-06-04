import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/tests/helpers/renderWithProviders';
import { Footer } from '@/components/layout/Footer';

// Mock fetch so newsletter subscription resolves immediately in tests
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }));

describe('Footer', () => {
  it('TC-UI-008 — devrait afficher un message de confirmation après soumission d\'un email valide', async () => {
    renderWithProviders(<Footer />);

    const input = screen.getByPlaceholderText(/votre adresse email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const submitBtn = screen.getByRole('button', { name: /s'inscrire/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/merci.*bienvenue/i)).toBeInTheDocument();
    });

    // Form should no longer be visible after successful subscription
    expect(screen.queryByPlaceholderText(/votre adresse email/i)).not.toBeInTheDocument();
  });

  it('TC-UI-009 — devrait empêcher la soumission si l\'email est vide', () => {
    renderWithProviders(<Footer />);

    // Submit without entering any email value — the state-based guard (`if (email)`) prevents it
    const submitBtn = screen.getByRole('button', { name: /s'inscrire/i });
    fireEvent.click(submitBtn);

    // The success message should NOT appear because email is empty
    expect(screen.queryByText(/merci.*bienvenue/i)).not.toBeInTheDocument();

    // The input should still be present
    expect(screen.getByPlaceholderText(/votre adresse email/i)).toBeInTheDocument();
  });

  it('TC-UI-010 — devrait afficher l\'année courante dans le copyright', () => {
    renderWithProviders(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    // The footer renders "© 2026 Ritual Glowry" — check the year matches today
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
