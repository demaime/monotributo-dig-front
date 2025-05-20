import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-PWB1KMS0WG`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PWB1KMS0WG');
            `,
          }}
        />
        <meta property="og:title" content="Monotributo Digital" />
        <meta
          property="og:description"
          content="Gestioná tu monotributo de forma simple y rápida."
        />
        <meta property="og:image" content="/assets/logo.png" />
        <meta property="og:url" content="https://monotributo.digital/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
