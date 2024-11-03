"use client"
import React, { useEffect, useState } from 'react';
import Sidebar from '../AdminComponents/Sidebar';
import { FaBars } from 'react-icons/fa';
import { HashLoader } from 'react-spinners';
// import { NavigationEvents } from '../useNProgress';


const AdminDashboard = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
    {/* <NavigationEvents/> */}
    <main className="relative flex h-full w-full overflow-hidden px-2">
      
    <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

    <button
      className={`lg:hidden fixed top-7 left-2.5 z-50 text-black rounded-full ${isSidebarOpen ? 'hidden' : 'block'}`}
      onClick={toggleSidebar}
    >
      <FaBars size={24} />
    </button>

    <div className={`flex flex-col flex-1 overflow-hidden w-full`}>
      <div className={`flex-1 p-5 lg:ml-64 bg-[#ffffff] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50' : 'opacity-100'}`}>
        {loading ? (
          <div className="loading-container">
            <HashLoader />
          </div>
        ) : (
          children
        )}
      </div>
    </div>

    {isSidebarOpen && (
      <div
        className="fixed inset-0 z-40 lg:hidden"
        onClick={toggleSidebar}
      ></div>
    )}
  </main>
  </>
  );
};

export default AdminDashboard;
