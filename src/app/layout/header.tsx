'use client'
import React from 'react'
import {Settings, Bell} from 'lucide-react'
import Image from "next/image" 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
const Header = () => {
  const pathname = usePathname()
  const menuItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Savings', href: '/savings' },
    { name: 'Accounts', href: '/accounts' },
  ]
  return (
    <div className='flex flex-row bg-white  text-black gap-70 border-b border-gray-300  '>
        <div className="relative w-80 h-20 ">
  <Image
    src="/images/Trackwise.jpg"
    alt="logo"
    fill
    className="object-cover"
  />
</div>

        <div className='flex flex-row gap-4 pt-3'>
        {menuItems.map((item) => (
          <Link
        key={item.name}
        href={item.href}
        className={`px-4 py-3 rounded cursor-pointer font-medium mb-4 ${
          pathname === item.href
            ? 'bg-blue-500 text-white '
            : 'bg-gray-100 text-black'
        }`}
      >
        {item.name}
      </Link>
      ))}
        </div>
     <div className='flex flex-row pt-5 gap-4'>
     <Settings />
     <Bell />
     <div className='relative w-10 h-10 md:w-20 md:h-10 rounded-full overflow-hidden'>
      <Image
        src='https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww'
        alt='William Cameron'
        fill
        className='object-cover'
      />
    </div>
     </div>
    </div>
  )
}

export default Header