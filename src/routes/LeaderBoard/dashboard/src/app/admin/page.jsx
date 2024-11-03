"use client"
import React, { useEffect, useRef } from 'react'
import Head from 'next/head';
import { FaBell, FaCrown, FaEnvelope, FaSearch, FaTruck, FaUsers, FaWrench } from 'react-icons/fa';
import CountUp from 'react-countup';
import Chart from 'chart.js/auto';


const AdminDashboard = () => {
  const chartRef = useRef(null);
  const myChart = useRef(null); // Ref to hold the chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy the previous chart instance if it exists
    if (myChart.current) {
      myChart.current.destroy();
    }

    // Create a new chart instance
    myChart.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Talk to Friend', 'User', 'Request', 'Tow', 'Mechanic'],
        datasets: [
          {
            data: [22.4, 29.9, 17.9, 14.9, 14.9],
            backgroundColor: ['yellow', 'orange', 'green', 'skyblue', 'red'],
            hoverBackgroundColor: ['#FFD700', '#FF8C00', '#32CD32', '#87CEEB', '#FF6347'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
        },
      },
    });
  }, []);

  return (
    <>
      <div className=' h-full '>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row items-center content-start justify-between mb-4'>
          {/* Dashboard Title */}
          <h1 className='hidden sm:block text-xl sm:ml-7 lg:ml-0 sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-0'>
            Dashboard
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
            <div className='flex items-center justify-evenly p-4 rounded-2xl bg-white shadow-lg'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full text-blue-500 bg-blue-100 '>
                <FaUsers size={24} />
              </div>
              <div className='ml-4'>
                <h2 className='text-lg font-bold text-slate-700'>Users</h2>
                <p className='text-base  text-slate-800 font-semibold '><CountUp end={50}duration={1}/></p>
              </div>
            </div>

            {/* Mechanic */}
            <div className='flex items-center justify-evenly p-4 rounded-2xl bg-white shadow-lg'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full text-green-500 bg-green-100'>
                <FaWrench size={24} />
              </div>
              <div className='ml-4'>
                <h2 className='text-lg text-slate-700 font-bold'>Mechanic</h2>
                <p className='text-base text-slate-800 font-semibold '><CountUp end={15}duration={1}/></p>
              </div>
            </div>

            {/* Tow */}
            <div className='flex items-center justify-evenly p-4 rounded-2xl bg-white shadow-lg'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full text-yellow-500 bg-yellow-100'>
                <FaTruck size={24} />
              </div>
              <div className='ml-4'>
                <h2 className='text-lg text-slate-700 font-bold'>Tow</h2>
                <p className='text-base  text-slate-800 font-semibold '><CountUp end={10}duration={1}/></p>
              </div>
            </div>

          
            <div className='flex items-center justify-evenly p-4 rounded-2xl bg-white  shadow-lg'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full text-purple-500 bg-purple-100'>
                <FaCrown size={24} />
              </div>
              <div className='ml-4'>
                <h2 className='text-lg text-slate-700 font-bold'>Premium</h2>
                <p className='text-base  text-slate-800 font-semibold '>Rs. <CountUp end={5000}duration={1}/></p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6'>
          {/* Recent Premiums Section */}
          <div className='bg-white p-4 rounded-lg shadow-lg'>
            <h1 className='text-xl font-bold mb-4'>Recent Premium</h1>
            {/* User List */}
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>John Deo</span>
                <span className='text-sm text-gray-500'>3 sec ago</span>
              </div>
              <div>Mechanic Premium - Rs.2000</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Jane Doe</span>
                <span className='text-sm text-gray-500'>5 min ago</span>
              </div>
              <div>Tower Premium - Rs.1500</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Mark Smith</span>
                <span className='text-sm text-gray-500'>10 min ago</span>
              </div>
              <div>Mechanic Premium - Rs.1800</div>
            </div>
            <div className='border-b border-gray-300 pb-2 mb-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Emily Jones</span>
                <span className='text-sm text-gray-500'>15 min ago</span>
              </div>
              <div>Users Premium - Rs.2500</div>
            </div>
          </div>

          {/* Doughnut Chart Section */}
          <div className='shadow-lg p-4 rounded-lg'>
            <h1 className='text-lg font-bold'>Service Distribution</h1>
            <div className='h-64'>
              <canvas ref={chartRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard;