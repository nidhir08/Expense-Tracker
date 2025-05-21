'use client'
import Header from "@/app/layout/header"
import { ArrowRightLeft, CircleFadingPlus, Eye, Pencil, Wallet } from "lucide-react";
import supabase from '../../../lib/supabaseClient'
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import TimeRange from "../components/timerange";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend)

const Analytics = () => {
    const { data: session } = useSession()
    const userEmail = session?.user?.email;
   const [isOpen, setIsOpen] = useState(false)
   const[isIncomeOpen, setisIncomeOpen]= useState(false)
   const [chartData, setChartData] = useState<any>(null)
   const [chartLabels, setChartLabels] = useState<string[]>([])
   const [chartColors, setChartColors] = useState<string[]>([])
 
   const options = {
     plugins: {
       legend: {
         display: false, // hide built-in legend
       },
     },
   }
 
 
   const [form, setForm] = useState({
     name: '',
     amount_spent: '',
     description: '',
     transaction_at: new Date().toISOString().slice(0, 10), 
     userEmail:'',
     payment_method:'',
     Category:''
   })
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     setForm({ ...form, [e.target.name]: e.target.value })
   }
   const [IncomeForm, setIncomeForm] = useState({
     Income:'',
     created_at: new Date().toISOString().slice(0, 10),
   })
   const IncomehandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     setIncomeForm({ ...IncomeForm, [e.target.name]: e.target.value })
   }
 
   //add expense
   const handleSubmit = async () => {
     if (!session?.user?.email) {
       alert("You must be logged in to submit a transaction.");
       return;
     }
     const { error } = await supabase
       .from('Transactions')
       .insert([{
         name: form.name,
         amount_spent: parseFloat(form.amount_spent),  // ✅ correct column name
         description: form.description,
         transaction_at: form.transaction_at,
         userEmail: session.user.email,
         payment_method: form.payment_method,
         Category: form.Category,
       }])
 
     if (error) {
       console.error('Insert failed:', error)
 
       alert('Failed to add expense.')
     } else {
       alert('Expense added!')
       setIsOpen(false)
       setForm({ name: '', amount_spent: '', description: '', transaction_at: new Date().toISOString().slice(0, 10) , userEmail:'', payment_method:'', Category:''})
     }
   }
 
   const addIncome=async()=>{
     if (!session?.user?.email) {
       alert("You must be logged in to submit a transaction.");
       return;
     }
     const { error } = await supabase
     .from('Income')
     .insert([{
       Income:IncomeForm.Income,
       created_at: IncomeForm.created_at,
       userEmail: session.user.email,
     }])
 
   if (error) {
     console.error('Insert failed:', error)
 
     alert('Failed to add income.')
   } else {
     alert('Income added!')
     setisIncomeOpen(false)
     setIncomeForm({ Income: '', created_at: new Date().toISOString().slice(0, 10) })
   }
   }
 
   //fetch income
   interface Income {
     id: string;
     Income: number;
     created_at: string;
   }
   const [income, setIncome] = useState<Income[]>([])
   useEffect(() => {
     const fetchIncome = async () => {
       if (!session?.user?.email) return; 
       const { data, error } = await supabase
         .from('Income')
         .select('*')
         .eq('userEmail', session.user.email);
       if (error) {
         console.error('Error fetching income:', error)
       } else {
         console.log('Fetched income:', data);
         setIncome(data)
       }
     }
 
     fetchIncome()
   }, [session])
 
   //fetch expense
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
   }, [session])
 
   useEffect(() => {
     const prepareChartData = () => {
       if (!transactions.length) return;
   
       const categoryTotals: { [key: string]: number } = {}
   
       transactions.forEach((t) => {
         if (t.Category) {
           categoryTotals[t.Category] = (categoryTotals[t.Category] || 0) + t.amount_spent
         }
       })
   
       const labels = Object.keys(categoryTotals)
       const data = Object.values(categoryTotals)
   
       const colors = ['#F04438', '#9E77ED', '#0BA5EC', '#17B26A', '#FDBA74', '#4E5BA6', '#ECC94B'] // Add more if needed
   
       setChartData({
        
         datasets: [{
           label: 'Expenses by Category',
           data,
           backgroundColor: colors.slice(0, labels.length)
         }],
         labels,
       })
       setChartLabels(labels)
 setChartColors(colors.slice(0, labels.length))
     }
   
     prepareChartData()
   }, [transactions])
 
 
   return (
    <>
    <Header/>
    <div className="p-4">
    <div className='flex flex-row mt-4 '>
     
    <TimeRange/>
    </div>
    <div className="flex flex-row w-full p-3">
 
 <div className="flex flex-col w-full gap-y-10">
   {/* expenses income box */}
 <div className="flex flex-row gap-10 ml-10 mt-5 ">
     <div className="bg-[#FFFFFF] md:w-full border-[#ECEFF2] border-1 rounded-xl p-4">
       <div className="flex flex-col">
       <span className="text-[#516778]">Balance</span>
       <span className="text-[#155EEF] text-3xl">
        
         ₹{session?
         income.reduce((sum, item) => sum + item.Income, 0) - transactions.reduce((sum, transaction) => sum + transaction.amount_spent, 0)
       : 0}
       
       </span>
       </div>
     </div>
     <div className="bg-[#FFFFFF]  md:w-full border-[#ECEFF2] border-1 rounded-xl p-4">
       <div className="flex flex-col">
       <span className="text-[#516778]">Income</span>
       <span className="text-black text-3xl">
         ₹{session?
       income.length > 0 ? income[0].Income :0
     :0}</span>
       </div>
     </div>
     <div className="bg-[#FFFFFF] md:w-full border-[#ECEFF2] border-1 rounded-xl p-4">
       <div className="flex flex-col">
       <span className="text-[#516778]">Expenses</span>
       <span className="text-black text-3xl">
       {transactions.length > 0 ? (
   <>
     <div className="font-large">
     ₹
       {session?
       transactions.reduce((sum, transaction) => sum + transaction.amount_spent, 0)
     :"No transactions"}
     </div>
   </>
 ) : (
   "No transactions"
 )}
       </span>
       </div>
     </div>
     </div>
 
 {/* add income expenses */}
     <div className="flex flex-row gap-10 ml-10">
     <div className="bg-[#FFFFFF] sm:w-[480px] sm:h-[90px] w-[259px] h-[88px] border-[#ECEFF2] border-1 rounded-xl p-4 cursor-pointer"
     onClick={() => setisIncomeOpen(true)}
     >
       <div className="flex flex-row gap-4">
         <div className="bg-[#DCFAE6] w-[50px] h-[50px] border-[#ECEFF2] border-1 rounded-lg p-3">
         <Wallet  className="text-[#0B9055]"/>
         </div>
       <div className="flex flex-col overflow-hidden text-ellipsis ">
       <span className="text-black font-semibold">Add Income</span>
       <span className="text-[#516778] font-thin whitespace-nowrap truncate ">Create an income manually</span>
       </div>
       </div>
     </div>
     {/* Modal */}
     {isIncomeOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
           <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl text-black">
             <h2 className="text-lg font-semibold mb-4 text-black">Add Expense</h2>
 
 
             <input
               type="float8"
               name="Income"
               placeholder="Income"
               value={IncomeForm.Income}
               onChange={IncomehandleChange}
               className="w-full border p-2 mb-2 rounded"
             />
 
 
             <input
               type="date"
               name="transaction_at"
               value={IncomeForm.created_at}
               onChange={IncomehandleChange}
               className="w-full border p-2 mb-4 rounded"
             />
 
             <div className="flex justify-end gap-2">
               <button
                 onClick={() => setisIncomeOpen(false)}
                 className="bg-gray-200 text-black px-4 py-2 rounded"
               >
                 Cancel
               </button>
               <button
                 onClick={addIncome}
                 className="bg-blue-600 text-white px-4 py-2 rounded"
               >
                 Add
               </button>
             </div>
           </div>
         </div>
       )}
     
     <div className="bg-[#FFFFFF] sm:w-[480px] sm:h-[90px] w-[259px] h-[88px] border-[#ECEFF2] border-1 rounded-xl p-4 cursor-pointer"
     onClick={() => setIsOpen(true)}
     >
       <div className="flex flex-row gap-4">
         <div className="bg-[#DCFAE6] w-[50px] h-[50px] border-[#ECEFF2] border-1 rounded-lg p-3">
         <CircleFadingPlus className="text-[#0B9055]"/>
         </div>
       <div className="flex flex-col overflow-hidden text-ellipsis ">
       <span className="text-black font-semibold">Add Expense</span>
       <span className="text-[#516778] font-thin whitespace-nowrap truncate ">Create an expense manually</span>
       </div>
       </div>
     </div>
     {/* Modal */}
     {isOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
           <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl text-black">
             <h2 className="text-lg font-semibold mb-4 text-black">Add Expense</h2>
 
             <input
               type="text"
               name="name"
               placeholder="Name"
               value={form.name}
               onChange={handleChange}
               className="w-full border p-2 mb-2 rounded"
             />
 
             <input
               type="float8"
               name="amount_spent"
               placeholder="Amount"
               value={form.amount_spent}
               onChange={handleChange}
               className="w-full border p-2 mb-2 rounded"
             />
 
             <textarea
               name="description"
               placeholder="Description"
               value={form.description}
               onChange={handleChange}
               className="w-full border p-2 mb-2 rounded"
             />
 
 <textarea
               name="payment_method"
               placeholder="Payment Method"
               value={form.payment_method}
               onChange={handleChange}
               className="w-full border p-2 mb-2 rounded"
             />
 
             <input
               type="date"
               name="transaction_at"
               value={form.transaction_at}
               onChange={handleChange}
               className="w-full border p-2 mb-4 rounded"
             />
 
             <div className="flex justify-end gap-2">
               <button
                 onClick={() => setIsOpen(false)}
                 className="bg-gray-200 text-black px-4 py-2 rounded"
               >
                 Cancel
               </button>
               <button
                 onClick={handleSubmit}
                 className="bg-blue-600 text-white px-4 py-2 rounded"
               >
                 Add
               </button>
             </div>
           </div>
         </div>
       )}
     <div className="bg-[#FFFFFF] sm:w-[480px] sm:h-[90px] w-[259px] h-[88px] border-[#ECEFF2] border-1 rounded-xl p-4 cursor-pointer"
     onClick={() => setIsOpen(true)}
     >
       <div className="flex flex-row gap-4">
         <div className="bg-[#DCFAE6] w-[50px] h-[50px] border-[#ECEFF2] border-1 rounded-lg p-3">
         <ArrowRightLeft className="text-[#0B9055]"/>
         </div>
       <div className="flex flex-col overflow-hidden text-ellipsis ">
       <span className="text-black font-semibold">Transfer money</span>
       <span className="text-[#516778] font-thin whitespace-nowrap truncate ">Create an expense manually</span>
       </div>
       </div>
     </div>
     </div>
 
     </div>
 
 
    </div>
    <div className="flex flex-col m-5 pl-8">
 <div className="flex flex-row">
 <div className="flex flex-row gap-20">
     <div className="w-[490px] h-[395px] bg-[#FFFFFF] border-1 rounded-xl">
       <div className="flex flex-col p-2">
         <span className="text-[#516778] font-medium text-md pb-2">Expenses By Category</span>
         <div className="w-60 h-60">
         {chartData && (
   <div className="flex flex-col items-center ml-8 w-60 h-60">
     <Doughnut data={chartData} options={options} />
 
     {/* Custom legend below chart */}
     <div className="mt-4 flex flex-col gap-2 text-sm">
       {chartLabels.map((label, index) => (
         <div key={index} className="flex items-center space-x-2">
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index] }}></div>
           <span>{label}</span>
         </div>
       ))}
     </div>
   </div>
 )}
 
     </div>
       </div>
     </div>
     <Table className="bg-white rounded-lg sm:w-full w-[590px] h-[395px]">
   <TableCaption>A list of your recent transactions.</TableCaption>
   <TableHeader >
     <TableRow >
     <h1 className="mx-4 my-2 font-bold text-black text-lg">Last Transactions</h1>
     <p className="mx-4 my-4 font-light text-[#516778]">Check your last transactions</p>
     </TableRow>
     </TableHeader>
   <TableHeader >
     <TableRow>
       <TableHead className="text-left font-bold">Description</TableHead>
       <TableHead className="font-bold ">Payment Method</TableHead>
       <TableHead className="font-bold">Date</TableHead>
       <TableHead className="font-bold">Amount</TableHead>
       <TableHead className="text-right"></TableHead>
     </TableRow>
     </TableHeader>
   <TableBody>
     {transactions.length > 0 ? (
       transactions.map((transaction) => (
         <TableRow key={transaction.id}>
           <TableCell className="font-medium">{transaction.description}</TableCell>
           <TableCell>{transaction.payment_method }</TableCell>
           <TableCell>{transaction.transaction_at}</TableCell>
           <TableCell className={transaction.amount_spent < 0 ? "text-[#F04438]" : "text-[#17B26A]"}>
   ₹{transaction.amount_spent}
 </TableCell>
           <TableCell><Eye /></TableCell>
           <TableCell><Pencil /></TableCell>
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
 </div>
    </div>
    </>
  )
}

export default Analytics