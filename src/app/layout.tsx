import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VarunaSutra — AI-Powered Monsoon Preparedness Playbook',
  description:
    'Generate personalized, monsoon-specific family preparedness playbooks using AI. ' +
    'Get weather-aware guidance, emergency checklists, travel advisories, and safety ' +
    'recommendations in your language.',
  keywords: [
    'monsoon',
    'preparedness',
    'India',
    'flood',
    'safety',
    'emergency',
    'weather',
    'playbook',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
