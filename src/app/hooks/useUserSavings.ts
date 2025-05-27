// hooks/useUserSavings.ts
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import supabase from '../../../lib/supabaseClient'

export interface Savings {
  id: string;
  amount_to_be_saved: number;
  savings_for: string;
  time: string;
  userEmail: string;
  saved_so_far: number;
  total_saved?: number;
}

export const useUserSavings = () => {
  const { data: session } = useSession();
  const [savings, setSavings] = useState<Savings[]>([]);
  const [loading, setLoading] = useState(true);
  

  const fetchSavings = async () => {
    if (!session?.user?.email) return;

    try {
      const { data: categories, error: categoriesError } = await supabase
        .from('Savings')
        .select('savings_for, amount_to_be_saved, time')
        .eq('userEmail', session?.user?.email)
        .order('time', { ascending: false });

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return;
      }

      const uniqueCategories = categories.reduce((acc, current) => {
        if (!acc.find(item => item.savings_for === current.savings_for)) {
          acc.push(current);
        }
        return acc;
      }, [] as typeof categories);

      const savingsWithTotals = await Promise.all(
        uniqueCategories.map(async (category) => {
          const { data: categoryData, error: totalError } = await supabase
            .from('Savings')
            .select('saved_so_far')
            .eq('userEmail', session?.user?.email)
            .eq('savings_for', category.savings_for);

          const totalSaved = categoryData?.reduce(
            (sum, item) => sum + (item.saved_so_far || 0), 0
          ) || 0;

          return {
            id: `${category.savings_for}_${session?.user?.email}`,
            ...category,
            userEmail: session?.user?.email || '',
            saved_so_far: totalSaved,
            total_saved: totalSaved,
          };
        })
      );

      setSavings(savingsWithTotals);
    } catch (error) {
      console.error('Error fetching savings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, [session]);

  return { savings, loading, refetch: fetchSavings };
};
