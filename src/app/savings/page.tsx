'use client'
import React, { use, useEffect, useState } from 'react'
import Header from '../layout/header'
import TimeRange from '../components/timerange'
import { Slider } from "@/components/ui/slider"
import { useSession } from 'next-auth/react'
import supabase from 'lib/supabaseClient'
import { Progress } from '@/components/ui/progress'
import { Wallet } from 'lucide-react'

const Savings = () => {
    const {data: session} = useSession()
    const [isSavingsOpen, setisSavingsOpen] = React.useState(false)
    const [selectedSaving, setSelectedSaving] = useState<Savings | null>(null)
    const [addAmount, setAddAmount] = useState('')
    
const colors = ['#E0533D', '#E78C9D', '#377CC8', '#EED868', '#17B26A', '#9E77ED'];
    interface Savings{
        id:string,
        amount_to_be_saved:number,
        savings_for:string,
        time: string,
        userEmail: string,
        saved_so_far: number
    }
    const [form, setForm] = useState({
        amount_to_be_saved:'',
        savings_for:'',
        time: '',
        userEmail: '',
        saved_so_far:''
      })
      
      const SavingshandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
      }
      const handleSubmit = async () => {
        if (!session?.user?.email) {
          alert("You must be logged in to submit a transaction.");
          return;
        }
      
        const { error } = await supabase
          .from('Savings')
          .insert([{
            amount_to_be_saved: parseFloat(form.amount_to_be_saved),
            savings_for: form.savings_for,
            time: form.time,
            userEmail: session.user.email,
            saved_so_far: form.saved_so_far
          }]);
      
        if (error) {
          console.error('Insert failed:', error);
          alert('Failed to add savings.');
        } else {
          alert('Savings added!');
          setisSavingsOpen(false);
          setForm({
            amount_to_be_saved: '',
            savings_for: '',
            time: '',
            userEmail: '',
            saved_so_far:''
          });
      
        }
      }
      
    const [savings, setSavings] = React.useState<Savings[]>([])
    // Fetch savings from Supabase
    useEffect(() => {
        const fetchSavings = async() =>{
            if(!session?.user?.email) return;
            const {data, error} = await supabase
            .from('Savings')
            .select('*')
            .order('time', {ascending: false})
            .eq('userEmail', session.user.email)
            
            if(error){
                console.error('Error fetching savings:', error)
            }else{
                console.log('Fetched savings:', data);
                setSavings(data)
            }
        }
        fetchSavings()
    }, [session])

  return (
    <>
        <Header/>
        <div className="p-4">
   <div className='flex flex-row mt-4 '>
   <TimeRange/>
   </div>
   <h1 className='font-bold text-2xl text-black px-3 mt-6'>Savings</h1>


<div className='flex flex-wrap gap-6 mt-4'>
  {savings.length > 0 ? (
    savings.map((item, index) => {
      const target = item.amount_to_be_saved ; // Default if missing
      const saved = item.saved_so_far;
      const percentage = Math.min((saved/ target) * 100, 100);
      const bgColor = colors[index % colors.length];

      return (
        <div
          key={item.id}
          className='w-full sm:w-[350px] h-[200px] text-white rounded-md p-4 flex flex-col justify-between'
          style={{ backgroundColor: bgColor }}
          onClick={() => setSelectedSaving(item)}
        >
          <div>
            <h1 className='text-lg font-semibold'>{item.savings_for}</h1>
            <p className='mt-2 text-sm'>Saved: ₹{saved} of ₹{target}</p>
            <p className='text-xl font-bold'>{percentage.toFixed(0)}% complete</p>
          </div>
          <Progress value={percentage} className="w-full bg-white/20" />
        </div>
      );
    })
  ) : (
    <p className="text-gray-500 px-3">No savings found.</p>
  )}
  {selectedSaving && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl text-black">
      <h2 className="text-lg font-semibold mb-4">Add to "{selectedSaving.savings_for}"</h2>

      <input
        type="number"
        value={addAmount}
        onChange={(e) => setAddAmount(e.target.value)}
        placeholder="Enter amount to add"
        className="w-full border p-2 mb-4 rounded"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setSelectedSaving(null)}
          className="bg-gray-200 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={async () => {
            if (!addAmount || isNaN(Number(addAmount))) return alert('Invalid amount')

            const { error } = await supabase
              .from('Savings')
              .update({
                saved_so_far: selectedSaving.saved_so_far + Number(addAmount)
              })
              .eq('id', selectedSaving.id)

            if (error) {
              alert('Failed to update savings')
              console.error(error)
            } else {
              alert('Savings updated!')
              setSelectedSaving(null)
              setAddAmount('')
              // refetch updated data
              const { data } = await supabase
                .from('Savings')
                .select('*')
                .order('time', { ascending: false })
                .eq('userEmail', session?.user?.email)

              if (data) setSavings(data)
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}

</div>

<div className="flex flex-row gap-15 ml-10 m-10">
    <div className="bg-[#FFFFFF] w-full h-[88px] sm:w-full border-black border-1 rounded-xl p-4 cursor-pointer border-dashed"
    onClick={() => setisSavingsOpen(true)}
    >
      <div className="flex flex-row gap-4">
        <div className="bg-[#DCFAE6] w-[50px] h-[50px] border-[#ECEFF2] border-1 rounded-lg p-3 ">
        <Wallet  className="text-[#0B9055]"/>
        </div>
      <div className="flex flex-col overflow-hidden text-ellipsis ">
      <span className="text-black font-semibold">Add Savings</span>
      </div>
      </div>
    </div>
    {/* Modal */}
    {isSavingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl text-black">
            <h2 className="text-lg font-semibold mb-4 text-black">Add Saving</h2>


            <input
              type="float8"
              name="amount_to_be_saved"
              placeholder="Savings Amount"
              value={form.amount_to_be_saved}
              onChange={SavingshandleChange}
              className="w-full border p-2 mb-2 rounded"
            />


            <input
              type="string"
              name="savings_for"
                placeholder="Savings For"
              value={form.savings_for}
              onChange={SavingshandleChange}
              className="w-full border p-2 mb-4 rounded"
            />
<input
              type="string"
              name="time"
                placeholder="Time"
              value={form.time}
              onChange={SavingshandleChange}       
                className="w-full border p-2 mb-4 rounded"
            />

           

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setisSavingsOpen(false)}
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
      </div>
</div>
    </>
  )
}

export default Savings