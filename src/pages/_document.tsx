import { Html, Head, Main, NextScript } from 'next/document';
import { SEOElements } from '@/components/SEO';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <SEOElements />
        
        {/* Favicon - BRAVECOM Hexagonal Logo */}
        <link rel="icon" type="image/png" href="/bravecom-logo-favicon.png" />
        <link rel="apple-touch-icon" href="/bravecom-logo-favicon.png" />
        <link rel="shortcut icon" href="/bravecom-logo-favicon.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
