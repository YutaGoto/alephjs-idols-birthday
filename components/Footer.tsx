import React from 'react'
import Logo from './logo.tsx'
import { useDeno } from 'aleph/react'

const Footer = () => {
  const version = useDeno(() => Deno.version.deno)

  return (
    <footer className="p-4 bg-gray-100 text-center">
      <Logo />
      <p className="text-xl">Built by Aleph.js in Deno {version}</p>
    </footer>
  )
}

export default Footer
