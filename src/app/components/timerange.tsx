import { useSession } from 'next-auth/react'
import React, { useState } from 'react'


const timeRanges = ['This Week', 'This Month', 'Last Month', 'This Year', 'Last 12 Months']
const TimeRange = () => {
   const { data: session } = useSession()
   const [selected, setSelected] = useState('This Week')
  return (

    <div className='flex flex-row lg:gap-150 md:gap-100 sm:gap-40 whitespace-nowrap flex-shrink-0'>
         {!session && <h1 className='font-bold text-2xl text-black mt-4 sm:w-auto dark:text-white'>Hello!</h1>}
         {session && <h1 className='font-bold text-2xl text-black mt-4 sm:w-auto dark:text-white'>Hello, {session.user?.name}!</h1>}
          <div className="border rounded-md inline-flex items-center bg-white shadow-sm">
            {timeRanges.map((label, index) => (
              <React.Fragment key={label}>
                <button
                  onClick={() => setSelected(label)}
                  className={`p-3 whitespace-nowrap rounded cursor-pointer font-medium ${
                    selected === label
                      ? 'bg-blue-500 text-white '
                      : 'bg-white text-black'
                  }`}
                >
                  {label}
                </button>
                {index < timeRanges.length - 1 && (
                  <span className="text-gray-300 sm:inline">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
    </div>
  )
}

export default TimeRange