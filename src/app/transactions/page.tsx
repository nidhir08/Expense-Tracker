'use client'
import React, { useEffect, useState } from 'react'
import Header from '../layout/header'
import supabase from '@/lib/supabaseClient'
import TimeRange from '../components/timerange'


const Transactions = () => {
    interface Transaction {
      id: string;
      name: string;
      amount_spent: number;
      description: string;
      transaction_at: string;
    }
    
    const [transactions, setTransactions] = useState<Transaction[]>([])

    // Fetch transactions from Supabase
    useEffect(() => {
      const fetchTransactions = async () => {
        const { data, error } = await supabase
          .from('Transactions')
          .select('*')
          .order('transaction_at', { ascending: false })
  
        if (error) {
          console.error('Error fetching transactions:', error)
        } else {
          console.log('Fetched transactions:', data);
          setTransactions(data)
        }
      }
  
      fetchTransactions()
    }, [])
  return (
    <div >
   <Header/>
   <div className='flex flex-row mt-4 gap-180'>
    <h1 className='font-bold text-2xl text-black px-4'>Transactions</h1>
   <TimeRange/>

   </div>
     {/* Display Transactions */}
     <div className="mt-6">
        <h2 className="font-semibold text-xl">Transaction Details</h2>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id} className="py-2">
              <p><strong>Name:</strong> {transaction.name}</p>
              <p><strong>Amount:</strong> ₹{transaction.amount_spent}</p>
              <p><strong>Description:</strong> {transaction.description}</p>
              <p><strong>Date:</strong> {new Date(transaction.transaction_at).toLocaleString()}</p>
              <hr className="my-2" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Transactions