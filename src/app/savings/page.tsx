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
        saved_so_far: number,
        total_saved?: number // For aggregated data
    }
    const [form, setForm] = useState({
        amount_to_be_saved:'',
        savings_for:'',
        time: '',
        userEmail: '',
        saved_so_far:'0'
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
            amount_to_be_saved: Number(form.amount_to_be_saved),
            savings_for: form.savings_for,
            time: form.time,
            userEmail: session.user.email,
            saved_so_far: Number(form.saved_so_far)
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
            saved_so_far:'0'
          });
          fetchSavings(); // Refresh data after adding
      
        }
      }
    const [savings, setSavings] = React.useState<Savings[]>([])
    
    
     // Fetch savings from Supabase with aggregated totals
     const fetchSavings = async () => {
        if(!session?.user?.email) return;
        
        try {
            // First, get all unique savings categories with their target amounts
            const {data: categories, error: categoriesError} = await supabase
                .from('Savings')
                .select('savings_for, amount_to_be_saved, time')
                .eq('userEmail', session?.user?.email)
                .order('time', {ascending: false});
            
            if(categoriesError){
                console.error('Error fetching categories:', categoriesError);
                return;
            }
            
            // Get unique categories (in case there are duplicates)
            const uniqueCategories = categories.reduce((acc, current) => {
                const existing = acc.find(item => item.savings_for === current.savings_for);
                if (!existing) {
                    acc.push(current);
                }
                return acc;
            }, [] as typeof categories);
            
            // For each category, calculate the total saved amount
            const savingsWithTotals = await Promise.all(
                uniqueCategories.map(async (category) => {
                    const {data: categoryData, error: totalError} = await supabase
                        .from('Savings')
                        .select('saved_so_far')
                        .eq('userEmail', session?.user?.email)
                        .eq('savings_for', category.savings_for);
                    
                    if(totalError) {
                        console.error('Error fetching totals for category:', category.savings_for, totalError);
                        return {
                            id: `${category.savings_for}_${session?.user?.email || 'unknown'}`, // Provide a default ID
                            userEmail: session?.user?.email || 'unknown', // Provide a default userEmail
                            ...category,
                            saved_so_far: 0,
                            total_saved: 0
                        };
                    }
                    
                    // Sum up all saved amounts for this category
                    const totalSaved = categoryData.reduce((sum, item) => sum + (item.saved_so_far || 0), 0);
                    
                    return {
                        id: `${category.savings_for}_${session?.user?.email}`, // Create unique ID for category
                        amount_to_be_saved: category.amount_to_be_saved,
                        savings_for: category.savings_for,
                        time: category.time,
                        userEmail: session?.user?.email,
                        saved_so_far: totalSaved,
                        total_saved: totalSaved
                    };
                })
            );
            
            console.log('Fetched savings with totals:', savingsWithTotals);
            setSavings(savingsWithTotals);
            
        } catch (error) {
            console.error('Error in fetchSavings:', error);
        }
    }
    
    useEffect(() => {
        fetchSavings()
    }, [session])


    const handleUpdateSaving = async () => {
        if (!selectedSaving || !addAmount || isNaN(Number(addAmount))) {
            alert('Invalid amount');
            return;
        }
        
        const amountToAdd = Number(addAmount);
        
        if (amountToAdd <= 0) {
            alert('Please enter a positive amount');
            return;
        }
        
        console.log('Adding new savings entry:', {
            category: selectedSaving.savings_for,
            amountToAdd,
            userEmail: session?.user?.email
        });
        
        try {
            // Insert a new row for this savings addition
            const { data, error } = await supabase
                .from('Savings')
                .insert([{
                    amount_to_be_saved: selectedSaving.amount_to_be_saved, // Keep the original target
                    savings_for: selectedSaving.savings_for, // Same category
                    time: new Date().toISOString(), // Current timestamp
                    userEmail: session?.user?.email,
                    saved_so_far: amountToAdd // The amount being added now
                }]);
                
            if (error) {
                console.error('Insert failed:', error);
                alert('Failed to add savings amount');
            } else {
                console.log('Successfully added new savings entry');
                alert('Savings amount added successfully!');
                setSelectedSaving(null);
                setAddAmount('');
                fetchSavings(); // Refresh to show updated totals
            }
        } catch (err) {
            console.error('Exception during savings addition:', err);
            alert('An error occurred while adding savings');
        }
    }

    
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
      const saved = item.saved_so_far; // This is now the total saved amount
      const percentage = Math.min((saved/ target) * 100, 100);
      const bgColor = colors[index % colors.length];

      return (
        <div
          key={item.id}
          className='w-full sm:w-[350px] h-[200px] text-white rounded-md p-4 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity'
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
      <p className="text-sm text-gray-600 mb-4">
        Current total: ₹{selectedSaving.saved_so_far} of ₹{selectedSaving.amount_to_be_saved}
      </p>

      <input
        type="number"
        value={addAmount}
        onChange={(e) => setAddAmount(e.target.value)}
        placeholder="Enter amount to add"
        className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        min="0"
        step="0.01"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setSelectedSaving(null);
            setAddAmount('');
          }}
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handleUpdateSaving}
        >
          Add ₹{addAmount || '0'}
        </button>
      </div>
    </div>
  </div>
)}

</div>

<div className="flex flex-row gap-15 ml-10 m-10">
    <div className="bg-[#FFFFFF] w-full h-[88px] sm:w-full border-black border-1 rounded-xl p-4 cursor-pointer border-dashed hover:bg-gray-50 transition-colors"
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
            <h2 className="text-lg font-semibold mb-4 text-black">Add New Savings Goal</h2>
    

            <input
              type="number"
              name="amount_to_be_saved"
              placeholder="Target Amount (₹)"
              value={form.amount_to_be_saved}
              onChange={SavingshandleChange}
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />


            <input
              type="text"
              name="savings_for"
              placeholder="Savings Goal (e.g., Vacation, Emergency Fund)"
              value={form.savings_for}
              onChange={SavingshandleChange}
              className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="time"
              placeholder="Target Date or Time Frame"
              value={form.time}
              onChange={SavingshandleChange}       
              className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

           

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setisSavingsOpen(false);
                  setForm({
                    amount_to_be_saved: '',
                    savings_for: '',
                    time: '',
                    userEmail: '',
                    saved_so_far:'0'
                  });
                }}
                className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                disabled={!form.amount_to_be_saved || !form.savings_for}
              >
                Create Goal
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