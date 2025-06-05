import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-PK5YLJY9ZZ`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PK5YLJY9ZZ');
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
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Monotributo Digital" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
