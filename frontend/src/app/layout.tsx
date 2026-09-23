import type { Metadata } from 'next';
import { Playfair_Display, Inter, Geist } from 'next/font/google';
import '@/styles/globals.css';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display-next',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-next',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} Atelier | Luxury Haute Couture & Ready-to-Wear`,
  description: `${BRAND_TAGLINE}. Discover Italian leather jackets, virgin wool tailoring, and Grade-A cashmere.`,
};

const antiFlashScript = `
(function() {
  try {
    var params = new URLSearchParams(window.location.search);
    var sf = params.get('storefront');
    if (!sf) {
      sf = localStorage.getItem('aurelia_storefront');
    }
    if (!sf) {
      var match = document.cookie.match(/storefront=(a)/);
      if (match) sf = match[1];
    }
    if (sf === 'a') {
      document.documentElement.setAttribute('data-storefront', sf);
    } else {
      document.documentElement.setAttribute('data-storefront', 'a');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(playfair.variable, inter.variable, "font-sans", geist.variable)}
      data-storefront="a"
      data-theme="light"
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
