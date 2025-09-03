import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface MainLogoProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  href?: string
  className?: string
  priority?: boolean
  showText?: boolean
  text?: string
}

export default function SideBarLogo({
  src = '/images/lecify-1.png',
  alt = 'Company Logo',
  width = 150,
  height = 20,
  href = '/',
  className = '',
  priority = false,
  showText = false,
  text = 'Your Company'
}: MainLogoProps) {
  const logoContent = (
    <Image
      src={src || "/images/lecify-1.png"}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`${className} inline-block align-middle h-10 object-cover`} // no h-10!
    />
  )

  if (href) {
    return (
      <Link 
        href={href}
        className="inline-block hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm h-5"
        aria-label={`${alt} - Go to homepage`}
      >
        {logoContent}
        
      </Link>
    )
  }

  return logoContent
}