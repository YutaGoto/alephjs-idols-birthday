import React, { FC } from 'react'
import Footer from './components/Footer.tsx'
import './style/index.css'

export default function App({ Page, pageProps }: { Page: FC, pageProps: Record<string, unknown> }) {
  return (
    <main>
      <head>
        <meta name="viewport" content="width=device-width" />
      </head>
      <Page {...pageProps} />
      <Footer />
    </main>
  )
}
