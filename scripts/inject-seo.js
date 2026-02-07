/**
 * Post-export script: injects SEO meta tags into dist/index.html
 * Run after `npx expo export --platform web`
 */
const fs = require('fs');
const path = require('path');

const DIST_HTML = path.join(__dirname, '..', 'dist', 'index.html');
const SITE_URL = 'https://calculator.loveyourcountrythankavet.com';

const seoTags = `
    <!-- SEO Meta -->
    <link rel="canonical" href="${SITE_URL}" />
    <meta name="robots" content="index, follow" />
    <meta name="keywords" content="percentage calculator, percent change calculator, what percent is X of Y, stock return calculator, percentage of a number, percent increase, percent decrease, investment calculator" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}" />
    <meta property="og:title" content="Percentage Calculator - Calculate Percent Change, Stock Returns &amp; More" />
    <meta property="og:description" content="Free online percentage calculator. Calculate percentages, percent change, and stock investment returns instantly." />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="Percentage Calculator" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Percentage Calculator - Calculate Percent Change, Stock Returns &amp; More" />
    <meta name="twitter:description" content="Free online percentage calculator. Calculate percentages, percent change, and stock investment returns instantly." />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Percentage Calculator",
        "url": "${SITE_URL}",
        "description": "Free online percentage calculator. Quickly calculate what percent one number is of another, find percentage change, estimate stock investment returns, and more.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    </script>`;

// Also improve the noscript content for crawlers that don't run JS
const betterNoscript = `<noscript>
      <h1>Percentage Calculator</h1>
      <p>Calculate percentages, percent change, stock investment returns, and more. Enable JavaScript to use the interactive calculator.</p>
    </noscript>`;

let html = fs.readFileSync(DIST_HTML, 'utf8');

// Inject SEO tags before </head>
html = html.replace('</head>', seoTags + '\n  </head>');

// Replace default noscript with SEO-friendly version
html = html.replace(
  /<noscript>[\s\S]*?<\/noscript>/,
  betterNoscript
);

fs.writeFileSync(DIST_HTML, html, 'utf8');

console.log('SEO tags injected into dist/index.html');
