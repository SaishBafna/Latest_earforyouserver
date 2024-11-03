"use client"
import Head from 'next/head';
import React from 'react'
import CountUp from 'react-countup';
import { FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';
import { FiTrendingDown,FiTrendingUp } from "react-icons/fi";
import { PiWarningThin } from "react-icons/pi";

const AdminTalkToFriend = () => {
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className='container h-full '>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row items-center content-start justify-between mb-4'>
          {/* Dashboard Title */}
          <h1 className='hidden sm:block text-xl sm:ml-7 lg:ml-0 sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-0'>
            Talk To Friend
          </h1>
          
          <div className='flex flex-row items-center justify-end sm:justify-center gap-y-2 sm:gap-y-0 sm:gap-x-4'>
            {/* Search Input */}
            <div className='flex items-center   border border-gray-800 rounded-xl p-2 w-[65%] sm:w-auto'>
              <FaSearch className='text-gray-500' />
              <input
                type='text'
                placeholder='Search...'
                className='ml-2 outline-none border-none flex-grow sm:flex-grow-0 w-full'
              />
            </div>
            {/* Icons Section */}
            <div className='flex items-center gap-x-2 pl-3'>
              <div className='flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-800'>
                <FaEnvelope className='text-gray-500' />
              </div>
              <div className='flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-800'>
                <FaBell className='text-gray-500' />
              </div>
            </div>
          </div>
        </div>
        
          {/* count section Section */}
          <div className='bg-slate-100 p-4 rounded-lg'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Users */}
            <div className='items-center p-4 rounded-2xl bg-white shadow-lg w-full'>
              <div className='flex items-center justify-between W-full '>
              <CountUp end={50} duration={1} className='text-base  text-slate-800 font-semibold '/>
              <FiTrendingUp className='h-10 w-10 text-green-500'/>

              </div>
              <div className=''>
                <p className='text-slate-500 '>More Than 2 hours Per day</p>
                <h2 className='text-lg font-bold text-slate-700'>Users</h2>
                
              </div>
            </div>

            {/* Mechanic */}
            <div className='items-center p-4 rounded-2xl bg-white shadow-lg w-full'>
              <div className='flex items-center justify-between W-full '>
              <CountUp end={50} duration={1} className='text-base  text-slate-800 font-semibold '/>
              <FiTrendingDown className='h-10 w-10 text-red-500'/>

              </div>
              <div className=''>
                <p className='text-slate-500 '>Less Than 2 hours Per day</p>
                <h2 className='text-lg font-bold text-slate-700'>Agent</h2>
                
              </div>
            </div>

            {/* Tow */}
            <div className='items-center p-4 rounded-2xl bg-white shadow-lg w-full'>
              <div className='flex items-center justify-between W-full '>
              <CountUp end={50} duration={1} className='text-base  text-slate-800 font-semibold '/>
              <FiTrendingUp className='h-10 w-10 text-green-500'/>

              </div>
              <div className=''>
                <p className='text-slate-500 '>More Than 2 hours Per day</p>
                <h2 className='text-lg font-bold text-slate-700'>Users</h2>
                
              </div>
            </div>

          
            <div className='items-center p-4 rounded-2xl bg-white shadow-lg w-full'>
              <div className='flex items-center justify-between W-full '>
              <CountUp end={50} duration={1} className='text-base  text-slate-800 font-semibold '/>
              <FiTrendingDown className='h-10 w-10 text-red-500'/>

              </div>
              <div className=''>
                <p className='text-slate-500 '>Less Than 2 hours Per day</p>
                <h2 className='text-lg font-bold text-slate-700'>Agent</h2>
                
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6  '>
          {/* Recent Premiums Section */}
          <div className='bg-white p-4 rounded-lg shadow-lg'>
          <div className="flex items-center gap-x-3">
          <PiWarningThin size={24} className='text-red-500'/>
          <h1 className='text-xl font-bold '>Agent Warning</h1>
          </div>
            {/* User List */}
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>John Deo</span>
                <span className='text-sm text-gray-500'>5 hour ago</span>
              </div>
              <div>Warning description</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Jane Doe</span>
                <span className='text-sm text-gray-500'>1 day ago</span>
              </div>
              <div>Warning description</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Mark Smith</span>
                <span className='text-sm text-gray-500'>3 day ago</span>
              </div>
              <div>Warning description</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Emily Jones</span>
                <span className='text-sm text-gray-500'>5 day ago</span>
              </div>
              <div>Warning description</div>
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-lg'>
          <div className="flex items-center gap-x-3">
          <PiWarningThin size={24} className='text-red-500'/>
          <h1 className='text-xl font-bold '>Agent Warning</h1>
          </div>
            {/* User List */}
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>John Deo</span>
                <span className='text-sm text-gray-500'>5 hour ago</span>
              </div>
              <div>Warning description</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Jane Doe</span>
                <span className='text-sm text-gray-500'>1 day ago</span>
              </div>
              <div>Warning description</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Mark Smith</span>
                <span className='text-sm text-gray-500'>3 day ago</span>
              </div>
              <div>Warning description</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Emily Jones</span>
                <span className='text-sm text-gray-500'>5 day ago</span>
              </div>
              <div>Warning description</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminTalkToFriend;