import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import Home from './page';

// Mock next/link so it renders as a simple <a> tag for testing
vi.mock('next/link', () => {
  return {
    default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => {
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      );
    },
  };
});

describe('Landing Page (Home)', () => {
  it('renders the main heading and CTA button', () => {
    render(<Home />);
    
    const heading = screen.getByRole('heading', { 
      name: /Your Family's AI-Powered Monsoon Preparedness Playbook/i, 
      level: 1 
    });
    expect(heading).toBeInTheDocument();

    const ctaButton = screen.getByRole('button', { name: /Generate Your Playbook/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/generate');
  });

  it('renders 6 capability cards with icons', () => {
    render(<Home />);
    
    // We expect 6 headings level 3 for the cards
    const cardHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(cardHeadings).toHaveLength(6);
    
    // Check for some specific text in cards
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Offline Fallback')).toBeInTheDocument();
  });

  it('has zero accessibility violations', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    (expect(results) as any).toHaveNoViolations();
  });
});
