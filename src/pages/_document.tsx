import { Html, Head, Main, NextScript } from 'next/document';
import { SEOElements } from '@/components/SEO';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <SEOElements />
        
        {/* Favicon - BRAVECOM Hexagonal Logo */}
        <link rel="icon" href="/bravecom-logo-cart.png" />
        <meta name="theme-color" content="#0f172a" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
