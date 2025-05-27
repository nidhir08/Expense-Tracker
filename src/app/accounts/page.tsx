'use client'

import React from 'react'
import Header from '../layout/header'
import TimeRange from '../components/timerange'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Button } from '@/components/ui/button'
import { EllipsisVertical } from 'lucide-react'

const balanceData = [
  { name: 'Bank', balance: 25000 },
  { name: 'Wallet', balance: 4500 },
  { name: 'Savings', balance: 12000 },
  { name: 'Investments', balance: 8000 },
]

const pieData = [
  { name: 'Income', value: 50000 },
  { name: 'Expenses', value: 32000 },
]

const COLORS = ['#17B26A', '#F04438']

const recentTransactions = [
  { id: 1, description: 'Grocery', method: 'Bank', date: '2025-05-20', amount: -1200 },
  { id: 2, description: 'Salary', method: 'Bank', date: '2025-05-01', amount: 40000 },
  { id: 3, description: 'Recharge', method: 'Wallet', date: '2025-05-18', amount: -300 },
]

const Accounts = () => {
  return (
    <>
      <Header />
      <div className="p-4 ">
        <div className="flex flex-row mt-4">
          <TimeRange />
        </div>

        {/* Account Summary */}
        <h1 className="text-xl font-bold text-black dark:text-white my-4">Account Summary</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {balanceData.map((acc) => (
            <Card key={acc.name} className="rounded-xl shadow-md">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">{acc.name}</p>
                <h2 className="text-lg font-bold text-black dark:text-white">₹{acc.balance.toLocaleString()}</h2>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Balance Chart */}
        <h1 className="text-xl font-bold text-black dark:text-white my-6">Balance Overview</h1>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={balanceData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="balance" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Income vs Expenses Pie */}
        <h1 className="text-xl font-bold text-black dark:text-white my-6">Income vs Expenses</h1>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Recent Transactions */}
        <h1 className="text-xl font-bold text-black dark:text-white my-6">Recent Transactions</h1>
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-200 dark:text-white">
                  <td className="p-3 font-medium text-gray-800">{tx.description}</td>
                  <td className="p-3">{tx.method}</td>
                  <td className="p-3">{tx.date}</td>
                  <td className={`p-3 font-semibold ${tx.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>₹{tx.amount}</td>
                  <td className="p-3"><EllipsisVertical className="h-5 w-5 text-gray-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button>Add Money</Button>
          <Button variant="outline">Transfer</Button>
          <Button variant="outline">Manage Accounts</Button>
        </div>
      </div>
    </>
  )
}

export default Accounts