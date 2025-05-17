import React, { useState } from 'react'


const timeRanges = ['This Week', 'This Month', 'Last Month', 'This Year', 'Last 12 Months']
const TimeRange = () => {
   const [selected, setSelected] = useState('This Week')
  return (

    <div>
          <div className="border rounded-md p-2 inline-flex items-center gap-2 bg-white shadow-sm">
            {timeRanges.map((label, index) => (
              <React.Fragment key={label}>
                <button
                  onClick={() => setSelected(label)}
                  className={`px-4 py-2 rounded cursor-pointer font-medium ${
                    selected === label
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  {label}
                </button>
                {index < timeRanges.length - 1 && (
                  <span className="text-gray-300">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
    </div>
  )
}

export default TimeRange