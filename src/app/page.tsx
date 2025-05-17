'use client'
import Image from "next/image";
import Header from "@/app/layout/header"
import TimeRange from "./components/timerange";
export default function Home() {
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

    <div className="bg-[#FFFFFF] w-[259px] h-[124px] border-[#ECEFF2] rounded-xl p-4">
      <div className="flex flex-col">
      <span className="text-[#516778]">Balance</span>
      <span className="text-[#155EEF]">$5,502.45</span>
      </div>
    </div>
   </div>
   </div>
   </>
  );
}
