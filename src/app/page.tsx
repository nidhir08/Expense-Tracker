'use client'
import Image from "next/image";
import Header from "@/app/layout/header"
import TimeRange from "./components/timerange";
import { CircleFadingPlus } from "lucide-react";
import supabase from '@/lib/supabaseClient'
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const[isIncomeOpen, setisIncomeOpen]= useState(false)
  const [form, setForm] = useState({
    name: '',
    amount_spent: '',
    description: '',
    transaction_at: new Date().toISOString().slice(0, 10), // default to today
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

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('Transactions')
      .insert([{
        name: form.name,
        amount_spent: parseFloat(form.amount_spent),  // ✅ correct column name
        description: form.description,
        transaction_at: form.transaction_at,
      }])

    if (error) {
      console.error('Insert failed:', error)

      alert('Failed to add income.')
    } else {
      alert('Income added!')
      setIsOpen(false)
      setForm({ name: '', amount_spent: '', description: '', transaction_at: new Date().toISOString().slice(0, 10) })
    }
  }

  const addIncome=async()=>{
    const { error } = await supabase
    .from('Income')
    .insert([{
      Income:IncomeForm.Income,
      created_at: IncomeForm.created_at,
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
  return (
   <>
   <Header/>
   <div className="p-4">
   <div className='flex flex-row mt-4 gap-180 '>
    <h1 className='font-bold text-2xl text-black mt-4'>Hello,{}!</h1>
   <TimeRange/>
   </div>
   <div className="flex flex-row w-full mt-3 gap-10">
    <div className="w-[330px] h-[395px] bg-[#FFFFFF] rounded-xl">
      <div className="flex flex-col p-2">
        <span className="text-[#516778] font-medium text-xl pb-2">My Card</span>
        <span className="text-[#8C89B4] font-light">Card Balance</span>
        <span className="text-[#516778] font-medium">$15,595.015</span>
      </div>
    </div>

<div className="flex flex-col gap-y-10">
  {/* expenses income box */}
<div className="flex flex-row gap-15 ml-10 mt-5 ">
    <div className="bg-[#FFFFFF] w-[259px] h-[124px] border-[#ECEFF2] border-1 rounded-xl p-4">
      <div className="flex flex-col">
      <span className="text-[#516778]">Balance</span>
      <span className="text-[#155EEF] text-3xl">$5,502.45</span>
      </div>
    </div>
    <div className="bg-[#FFFFFF] w-[259px] h-[124px] border-[#ECEFF2] border-1 rounded-xl p-4">
      <div className="flex flex-col">
      <span className="text-[#516778]">Income</span>
      <span className="text-black text-3xl">$5,502.45</span>
      </div>
    </div>
    <div className="bg-[#FFFFFF] w-[259px] h-[124px] border-[#ECEFF2] border-1 rounded-xl p-4">
      <div className="flex flex-col">
      <span className="text-[#516778]">Expenses</span>
      <span className="text-black text-3xl">$5,502.45</span>
      </div>
    </div>
    </div>

{/* add income expenses */}
    <div className="flex flex-row gap-15 ml-10">
    <div className="bg-[#FFFFFF] w-[259px] h-[88px] border-[#ECEFF2] border-1 rounded-xl p-4 cursor-pointer"
    onClick={() => setisIncomeOpen(true)}
    >
      <div className="flex flex-row gap-4">
        <div className="bg-[#DCFAE6] w-[50px] h-[50px] border-[#ECEFF2] border-1 rounded-lg p-3">
        <CircleFadingPlus className="text-[#0B9055]"/>
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
    
    <div className="bg-[#FFFFFF] w-[259px] h-[88px] border-[#ECEFF2] border-1 rounded-xl p-4 cursor-pointer"
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
    <div className="bg-[#FFFFFF] w-[259px] h-[88px] border-[#ECEFF2] border-1 rounded-xl p-4">
      <div className="flex flex-col">
      <span className="text-[#516778]">Expenses</span>
      <span className="text-black text-3xl">$5,502.45</span>
      </div>
    </div>
    </div>
    </div>
   </div>
   </div>
   </>
  );
}
