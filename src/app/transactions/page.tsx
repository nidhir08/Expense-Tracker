'use client'
import React, { useEffect, useState } from 'react'
import Header from '../layout/header'
import supabase from '../../../lib/supabaseClient'
import TimeRange from '../components/timerange'
import { useSession } from 'next-auth/react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EllipsisVertical } from 'lucide-react'

const Transactions = () => {
  const { data: session } = useSession()
    interface Transaction {
      id: string;
      name: string;
      amount_spent: number;
      description: string;
      payment_method:string,
      transaction_at: string;
      Category: string;
    }
    
    const [transactions, setTransactions] = useState<Transaction[]>([])

    // Fetch transactions from Supabase
    useEffect(() => {
      const fetchTransactions = async () => {
        if (!session?.user?.email) return; 
        const { data, error } = await supabase
          .from('Transactions')
          .select('*')
          .order('transaction_at', { ascending: false })
          .eq('userEmail', session.user.email);
  
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
    < >
   <Header/>
   <div className="pl-4 w-full min-h-screen dark:bg-black ">
   <div className='flex flex-row mt-4'>
   <TimeRange/>
   </div>

   <h1 className='font-bold text-2xl text-black px-3 mt-6'>Transactions</h1>

     {/* Display Transactions */}
     <div className='p-10 w-full '>
     <Table className="bg-white rounded-lg w-full">
  <TableCaption>A list of your recent transactions.</TableCaption>
  <TableHeader >
    <TableRow >
    <th className="mx-4 my-2 font-bold text-black text-lg">Last Transactions</th>
    </TableRow>
    </TableHeader>
  <TableHeader>
    <TableRow>
      <TableHead className="text-left dark:text-black font-bold">Name</TableHead>
      <TableHead className="dark:text-black font-bold">Description</TableHead>
      <TableHead className="dark:text-black font-bold">Payment Method</TableHead>
      <TableHead className="dark:text-black font-bold">Date</TableHead>
      <TableHead className="dark:text-black font-bold">Amount</TableHead>
      <TableHead className="text-right dark:text-black font-bold"></TableHead>
    </TableRow>
    </TableHeader>
  <TableBody>
    {transactions.length > 0 ? (
      transactions.map((transaction) => (
        <TableRow key={transaction.id}>
          <TableCell className="font-medium">{transaction.name}</TableCell>
          <TableCell >{transaction.description}</TableCell>
          <TableCell>{transaction.payment_method }</TableCell>
          <TableCell>{transaction.transaction_at}</TableCell>
          <TableCell className={transaction.amount_spent < 0 ? "text-[#F04438]" : "text-[#17B26A]"}>
  ₹{transaction.amount_spent}
</TableCell>
          <TableCell><EllipsisVertical /></TableCell>
         
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={4} className="text-center">
          No transactions found.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
</div>
    </div>

   </>
  )
}

export default Transactions