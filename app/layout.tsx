// app/layout.tsx
import type { Metadata } from 'next';
import { Bungee_Spice, Montserrat, Roboto } from 'next/font/google';
import { Providers } from '../components/providers';
import './globals.css';

// Configure Bungee Spice
const bungee = Bungee_Spice({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bungee',
  display: 'swap',
});

// Configure Montserrat
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  // For variable fonts, use style instead of weight
  style: ['normal', 'italic'],
});

// Configure Roboto
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkillSwap - Exchange Skills, Not Money',
  description:
    'A platform for professionals to exchange skills instead of money',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bungee.variable} ${montserrat.variable} ${roboto.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
