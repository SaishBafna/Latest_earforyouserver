"use client";
import { useRouter } from "next/navigation";
// import loginImg from '../../../../public/assets/loginImg.jpg'
import { useState } from "react";
import axios from 'axios';
import { toast } from "sonner";
import { PulseLoader } from "react-spinners";
export default function Login() {
  const [authData, setAuthData] = useState({
    FirstName:"",
    LastName:"",
    email:"",
    password:"",
  })
  const [loading , setLoading]= useState(false);
 const handlesubmit = async  (e)=>{
  e.preventDefault()
  setLoading(true);
  try {
    if(!authData){
      toast.error('Fill the require Fields')
    }
  const res = await  axios.post("/api/adminregister", {
    FirstName: authData.FirstName,
    LastName: authData.LastName,
    email: authData.email,
    password: authData.password
  })
   if (res.status === 200){
    setAuthData({  name:"",
    email:"",
    password:"",})
   } 
   toast.success('User Register Sucessfully') 
  } catch (error) {
    console.log(error)
    toast.error('Unable To Create Customer');
  }finally{
    setLoading(false);
  }
 }
  return (
    <main className="flex w-screen h-screen  items-center justify-center">
      <section className="h-[70%] w-[50%] mx-auto flex">
        <div
          className="left h-full w-[50%] rounded-tl-lg rounded-bl-lg bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center"
        //   style={{ backgroundImage: `url(${loginImg.src})` }}
        >
          <div className="bg-white bg-opacity-65 p-3 rounded-lg border-4 border-white mx-5">
            <h1 className="text-4xl font-extrabold mb-4  bg-opacity-100   text-gradient-bg1 opacity-100 text-center">
              Welcome Back
            </h1>
            <h2 className="text-2xl font-semibold text-center text-gradient-bg2 ">
              To Driverse Admin
            </h2>
          </div>
        </div>

        <form action='#' method="POST" className="right h-full  w-[50%] rounded-tr-lg rounded-br-lg bg-slate-100">
          <div className="flex flex-col items-center  ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-24 h-24  flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className=" text-3xl font-extrabold   text-gradient-bg text-gradient-bg1">
              Register
            </h2>
            <h3 className="text-lg font-semibold text-center text-gradient-bg2">
              Please Register to continue
            </h3>
            <div className="Email mb-1 w-[80%]">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-600"
              >
                FirstName:
              </label>
              <input
                type="text"
                id="FirstName"
                className="w-full p-2 border rounded mb-4"
                placeholder="First Name"
                onChange={(e)=> setAuthData({...authData, FirstName: e.target.value})}
                required
              />
            </div>
            <div className="Email mb-1 w-[80%]">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-600"
              >
                FirstName:
              </label>
              <input
                type="text"
                id="LastName"
                className="w-full p-2 border rounded mb-4"
                placeholder="LastName"
                onChange={(e)=> setAuthData({...authData, LastName: e.target.value})}
                required
              />
            </div>
            <div className="Email mb-1 w-[80%]">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-600"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter your Email"
                required
                onChange={(e)=> setAuthData({...authData, email: e.target.value})}
              />
            </div>
            <div className="password mb-1 w-[80%]">
              <label
                htmlFor="password "
                className="text-sm  font-semibold text-gray-600"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border rounded mb-2"
                placeholder="Enter your password"
                onChange={(e)=> setAuthData({...authData, password: e.target.value})}
                required
              />
            </div>
            <button className="bg-blue-500 w-[50%] mt-3 text-white p-2 rounded hover:bg-blue-700 "
            type="button"
            onClick={handlesubmit}
            >
              {loading ? <PulseLoader color="#fff" size={8} />:'Register' }
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}