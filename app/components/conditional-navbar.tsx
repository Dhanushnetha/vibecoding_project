'use client'

import { usePathname } from 'next/navigation'
import Navbar from './navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Pages where navbar should not be shown
  const hideNavbarPaths = ['/login']
  const shouldHideNavbar = hideNavbarPaths.includes(pathname)

  if (shouldHideNavbar) {
    return null
  }

  return <Navbar />
} 