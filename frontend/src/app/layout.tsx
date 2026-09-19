import type { Metadata } from 'next';
import '@/styles/globals.css';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';

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
      var match = document.cookie.match(/storefront=(a|b)/);
      if (match) sf = match[1];
    }
    if (sf === 'a' || sf === 'b') {
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
    <html lang="en" data-storefront="a" data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
