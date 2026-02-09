/**
 * Post-export script: injects SEO meta tags into dist/index.html
 * Run after `npx expo export --platform web`
 */
const fs = require('fs');
const path = require('path');

const DIST_HTML = path.join(__dirname, '..', 'dist', 'index.html');
const SITE_URL = 'https://imaginecalculator.com';
const PAGE_TITLE = 'ImagineCalculator - Imagine Your Crypto Future';
const PAGE_DESCRIPTION =
  'Dream big with ImagineCalculator. See what your crypto portfolio could become with live prices, DCA scenarios, and what-if calculations.';
const OG_IMAGE = `${SITE_URL}/og.png`;

const FAQ_SCHEMA = JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is ImagineCalculator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ImagineCalculator lets you dream about crypto and stock investments. Enter how much you want to invest, pick a crypto, set a target price, and see what your portfolio could become. It uses live prices from CoinGecko.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are the crypto prices real-time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prices update every 60 seconds from the CoinGecko API. They reflect the current spot price in USD with 24-hour change data.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the DCA calculation work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "The calculator assumes all monthly purchases happen at today's price for simplicity. It calculates: total coins = (initial investment + monthly amount \u00d7 months) / current price, then multiplies by your target price.",
        },
      },
      {
        '@type': 'Question',
        name: 'Is this financial advice?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. ImagineCalculator is for entertainment and educational purposes only. Crypto and stock investments are volatile and risky. Always do your own research and consult a financial advisor.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I calculate percentage of a number?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Divide the percentage by 100 and multiply by the number. Example: 15% of 200 = (15/100) \u00d7 200 = 30.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I calculate percent change?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use ((new \u2212 old) / |old|) \u00d7 100. A positive result is an increase; a negative result is a decrease.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I find what percent one number is of another?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Divide the part by the whole and multiply by 100. Example: 25 is what percent of 200? (25/200) \u00d7 100 = 12.5%.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I calculate percent increase or decrease?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use percent change. If the result is positive it is an increase; if negative it is a decrease.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do stock returns relate to percentages?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A stock return is a percentage gain or loss. Multiply your investment by (1 + return/100) to estimate final value.',
        },
      },
    ],
  },
  null,
  2,
);

const seoTags = `
    <!-- SEO Meta -->
    <title>${PAGE_TITLE}</title>
    <meta name="description" content="${PAGE_DESCRIPTION}" />
    <link rel="canonical" href="${SITE_URL}" />
    <meta name="robots" content="index, follow" />
    <meta name="keywords" content="crypto calculator, bitcoin calculator, what if crypto, DCA calculator, imagine calculator, ethereum calculator, solana calculator, percentage calculator, percent change calculator, stock return calculator, investment calculator" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}" />
    <meta property="og:title" content="${PAGE_TITLE}" />
    <meta property="og:description" content="${PAGE_DESCRIPTION}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:alt" content="ImagineCalculator - Imagine Your Crypto Future" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="ImagineCalculator" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${PAGE_TITLE}" />
    <meta name="twitter:description" content="${PAGE_DESCRIPTION}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9VLF050P3G"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-9VLF050P3G');
    </script>

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "ImagineCalculator",
        "url": "${SITE_URL}",
        "description": "Dream big with ImagineCalculator. See what your crypto portfolio could become with live prices, DCA scenarios, and what-if calculations.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    </script>
    <script type="application/ld+json">
      ${FAQ_SCHEMA}
    </script>`;

// Also improve the noscript content for crawlers that don't run JS
const betterNoscript = `<noscript>
      <h1>ImagineCalculator</h1>
      <p>Dream big. See what your crypto investments could become with live prices, DCA scenarios, and what-if calculations. Enable JavaScript to use the interactive calculator.</p>
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
