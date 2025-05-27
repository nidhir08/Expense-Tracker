'use client'

import React, { useState } from 'react';

import { Progress } from '@/components/ui/progress';
import { useUserSavings } from '../hooks/useUserSavings';

const colors = ['#E0533D', '#E78C9D', '#377CC8', '#EED868', '#17B26A', '#9E77ED'];
export interface Savings {
  id: string;
  amount_to_be_saved: number;
  savings_for: string;
  time: string;
  userEmail: string;
  saved_so_far: number;
  total_saved?: number;
}
const ProgressBar = ({small=false}: { small?: boolean }) => {
  const { savings, loading } = useUserSavings();
    const [selectedSaving, setSelectedSaving] = useState<Savings | null>(null)
  if (loading) return <p className="p-4">Loading savings...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4 dark:text-white">Your Savings Goals</h1>
      <div className="flex flex-wrap gap-6">
        {savings.length > 0 ? (
          savings.map((item: Savings, index: number) => {

            const target = item.amount_to_be_saved;
            const saved = item.saved_so_far;
            const percentage = Math.min((saved / target) * 100, 100);
            const bgColor = colors[index % colors.length];

            return (
              <div
                key={item.id}
                className={`text-white rounded-md p-4 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity ${small ? 'w-[280px] h-[140px]' : 'w-full sm:w-[350px] h-[200px]'}`}
                style={{ backgroundColor: bgColor }}
                onClick={() => setSelectedSaving(item)}
              >
                <div>
                  <h1 className="text-lg font-semibold">{item.savings_for}</h1>
                  <p className="mt-2 text-sm">Saved: ₹{saved} of ₹{target}</p>
                  <p className="text-xl font-bold">{percentage.toFixed(0)}% complete</p>
                </div>
                <Progress value={percentage} className="w-full bg-white/20" />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No savings data available.</p>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
