'use client'
import React from 'react'
import Header from '../layout/header'
import TimeRange from '../components/timerange'

const Accounts = () => {
  return (
    <>
        <Header/>
        <div className="p-4">
   <div className='flex flex-row mt-4'>
   <TimeRange/>
   </div>
</div>
    </>
  )
}

export default Accounts