'use client'

import React, { useEffect, useState } from 'react'
import { Settings, Bell } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'


const Header = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  const menuItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Savings', href: '/savings' },
    { name: 'Accounts', href: '/accounts' },
  ]

    // Load theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = storedTheme === 'dark'
    document.documentElement.classList.toggle('dark', prefersDark)
    setIsDarkMode(prefersDark)
  }, [])

  const handleThemeToggle = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newMode)
  }

  return (
    <>
    <div className='w-full min-w-screen bg-white dark:bg-black text-black items-center px-6 py-4 border-b border-gray-300 flex-shrink-0'>
      <div className="flex items-center justify-between ">
      {/* Logo */}
      <div className="relative w-60 h-14 sm:w-48 sm:h-14 md:w-60 md:h-14 flex-shrink-0">
        <Image
          src="/images/Trackwise.jpg"
          alt="logo"
          fill
          className="object-cover"
        />
      </div>

      {/* Menu */}
      <div className='flex flex-row gap-4'>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`px-4 py-2 rounded font-medium ${
              pathname === item.href
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-black'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Side: Icons + Auth */}
      <div className='flex flex-row gap-4 items-center'>
           <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
        <Settings className='dark:text-white' />
        <Bell className='dark:text-white' />

        {session ? (
          <>
             <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='relative w-10 h-10 rounded-full overflow-hidden cursor-pointer'>
          <Image
            src={session.user?.image || ''}
            alt={session.user?.name || ''}
            fill
            className='object-cover'
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="">
        <DropdownMenuItem disabled>
          {session.user?.email}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} >
         <span className='text-red-500'>Logout</span> 
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
            
            <div className="flex flex-col text-sm">
              <button
                onClick={() => signOut()}
                className="text-blue-600 underline"
              >
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Sign in
          </button>
        )}
      </div>
      </div>
    </div>
    </>
  )
}

export default Header
