import React from 'react'

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="mx-auto h-32 w-32">
      <img src="/logo.svg" height={size} title="Aleph.js" />
    </div>
  )
}
