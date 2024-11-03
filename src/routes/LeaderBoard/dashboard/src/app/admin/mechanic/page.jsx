"use client";
import Head from "next/head";
import React from "react";
import {
  FaBell,
  FaEdit,
  FaEnvelope,
  FaEye,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { BiSort } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { TbCurrencyDollarCanadian } from "react-icons/tb";
import { HiOutlineClock } from "react-icons/hi";
const AdminMechanic = () => {
  const data = [
    {
      name: "Jon Doe",
      price: "5000",
      timeStart: "10:00 Am",
      timeEnd:"7:00pm"
    },
    {
      name: "Jane Smith",
      price: "4000",
      timeStart: "10:00 Am",
      timeEnd:"7:00pm"
    },
    {
      name: "Alice Johnson",
      price: "3500",
      timeStart: "10:00 Am",
      timeEnd:"7:00pm"
    },
    {
      name: "Bob Brown",
      price: "5500",
      timeStart: "10:00 Am",
      timeEnd:"7:00pm"
    },
    {
      name: "Charlie Davis",
      price: "5210",
      timeStart: "10:00 Am",
      timeEnd:"7:00pm"
    },
    {
      name: "Eve White",
      price: "3450",
      timeStart: "10:00 Am",
      timeEnd:"7:00pm"
    },
  ];
  return (
    <>
    <Head>
      <title>Admin Dashboard</title>
    </Head>
    <div className="container h-full ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center content-start justify-between mb-4">
        {/* Dashboard Title */}
        <h1 className="hidden sm:block text-xl sm:ml-7 lg:ml-0 sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-0">
          Mechanic </h1>
          <div className="flex flex-row items-center justify-end sm:justify-center gap-y-2 sm:gap-y-0 sm:gap-x-4">
            {/* Search Input */}
            <div className="flex items-center   border border-gray-800 rounded-xl p-2 w-[65%] sm:w-auto">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 outline-none border-none flex-grow sm:flex-grow-0 w-full"
              />
            </div>
            {/* Icons Section */}
            <div className="flex items-center gap-x-2 pl-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-800">
                <FaEnvelope className="text-gray-500" />
              </div>
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-800">
                <FaBell className="text-gray-500" />
              </div>
            </div>

            <div className="hidden sm:block">
              <button className="h-10 w-max bg-black  text-white shadow-md flex justify-between items-center rounded-xl p-2 border-2 gap-x-2">
                <LuDownload size={24} />
                <h1>Download</h1>
              </button>
            </div>
          </div>
        </div>

        {/* Range Selector Section */}
        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4 mt-6  mb-3">
          {/* Custom Dropdown */}
          <div className="w-full flex items-center justify-center gap-x-2 sm:w-auto">
            <h1 className="text-base font-semibold text-slate-600">Show</h1>
            <select className="appearance-none bg-white border border-gray-700 rounded-md py-1.5  px-4 w-full sm:w-auto">
              <option value="1"> 1</option>
              <option value="2"> 2</option>
              <option value="3"> 3</option>
            </select>
            <h1 className="text-base font-semibold text-slate-600">Entries</h1>
           <div className="block sm:hidden">
           <button className="flex items-center justify-center sm:justify-start gap-2  border border-gray-700 rounded-md py-2 px-4 w-full sm:w-auto">
            <BiSort size={20} />
            <span className="text-base font-semibold text-slate-600">Sort</span>
          </button>
           </div>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center justify-center mx-4 sm:gap-2 ">
            <div className="flex flex-row items-center gap-2">
              <div className="relative" >
              <label htmlFor="Start Date" className="absolute top-1.5 left-2 sm:hidden">Start Date</label>
              <input
                type="date"
                className="border text-slate-700 border-gray-700 rounded-md px-4 py-2 bg-white"
                placeholder="Start Date"
              />
              </div>
              <span className="text-slate-600">to</span>
              <div className="relative">
              <label htmlFor="End Date" className="absolute top-1.5 left-2 sm:hidden">End Date</label>
              <input
                type="date"
                className="border border-gray-700 rounded-md px-4 py-2 bg-white"
                placeholder="End Date"
              />
              </div>
            </div>
          </div>

          {/* Sort Button */}
          <div className="hidden sm:block">
          <button className="flex items-center justify-center sm:justify-start gap-2  border border-gray-700 rounded-md py-2 px-4 w-full sm:w-auto">
            <BiSort size={20} />
            <span className="text-base font-semibold text-slate-600">Sort</span>
          </button>
          </div>
        </div>
        {/* small screen Download Button*/}
        <div className="block sm:hidden w-full ">
          <button className="h-10 w-full bg-black text-white shadow-md flex justify-center items-center rounded-xl px-2 py-2 border-2 gap-x-2">
            <LuDownload size={24} />
            <h1 className="py-2">Download</h1>
          </button>
        </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 shadow-md flex flex-col items-start"
          >
            <div className="flex items-center mb-4">
              <FiUser className="text-white text-4xl mr-4 bg-slate-900 p-2 rounded-full" />
              <h2 className="font-bold text-lg">{item.name}</h2>
            </div>
            <div className="flex items-center mb-2">
              <TbCurrencyDollarCanadian className="text-gray-800 mr-2 h-7 w-7" />
              <span>{item.price}</span>
            </div>
            <div className="flex items-center mb-4">
              <HiOutlineClock className="text-gray-800 h-7 w-7 mr-2" />
              <div className="flex items-center gap-x-2">
              <span>{item.timeStart}</span>
              <span>to</span>
              <span>{item.timeEnd}</span>
              </div>
            </div>
            <div className="flex justify-evenly items-center w-full gap-2">
              <div className="">
              <button className="flex items-center justify-center bg-blue-100 text-blue-500 rounded-md p-2 hover:bg-gray-300">
                <FaEdit />
              </button>
              <h1 className="text-sm text-slate-500 text-center">Edit</h1>
              </div>
              <div>
              <button className="flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-md p-2 hover:bg-gray-300">
                <FaEye />
              </button>
              <h1 className="text-sm text-slate-500 text-center">View</h1>
              </div>
              <div>
              <button className="flex items-center justify-center bg-red-100 text-red-600 rounded-md
               p-2 hover:bg-gray-300">
                <FaTrash />
              </button>
              <h1 className="text-sm text-slate-500 text-center">Delete</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
            Prev
          </button>
          <button className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
            1
          </button>
          <button className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
            2
          </button>
          <button className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
            3
          </button>
          <span className="px-2">...</span>
          <button className="px-4 py-2 border border-gray-700 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
            Next
          </button>
        </div>

        {/* Result Count Display */}
        <div className="mt-4 sm:mt-0">
          <span className="text-gray-600">Showing 1-10 of 50 results</span>
        </div>
      </div>
    </div>
  </>
  )
}

export default AdminMechanic;