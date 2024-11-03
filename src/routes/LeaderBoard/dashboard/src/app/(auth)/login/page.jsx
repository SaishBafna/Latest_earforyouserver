"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { PulseLoader } from "react-spinners";
import Logo from "../../svg/logo";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  // const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    try {
      if (!email) {
        setEmailError("Email is required");
        setLoading(false);
        return;
      }

      if (!password) {
        setPasswordError("Password is required");
        setLoading(false);
        return;
      }

      const res = await axios.post("/api/adminlogin", {
        email,
        password,
      });
      console.log(res.data.status)
      if (res.data.status === 200) {
        signIn("credentials", {
          email,
          password,
          callbackUrl: "/admin",
          redirect: true,
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setEmailError("No account found with this email");
        } else if (error.response.status === 400) {
          setPasswordError("Please check your credentials");
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      {/* Background image */}
      <img
        src="/admin/login.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover z-0"
      />

      {/* Content */}
      <div className="w-full max-w-md p-8  bg-white border border-black rounded-md shadow-lg shadow-slate-400  z-10">
        <div className="flex justify-center items-center gap-x-4">
          <div className="h-10 w-10">
            <Logo className="" />
          </div>
          <h1 className=" text-2xl font-extrabold text-black">Ear For You</h1>
        </div>
        <div className=" text-center mt-2">
          <b className="font-bold text-lg ">ADMIN</b>{" "}
          <b className="font-bold text-lg ml-1 ">LOGIN</b>
        </div>
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Enter Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-black focus:outline-none focus:ring-black focus:border-black focus:shadow-outline-black sm:text-sm ${
                  emailError ? "border-red-500" : "border-black"
                }`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-black focus:outline-none focus:ring-black focus:border-black focus:shadow-outline-black sm:text-sm ${
                    passwordError ? "border-red-500" : "border-black"
                  }`}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="text-gray-500" />
                  ) : (
                    <AiFillEye className="text-gray-500" />
                  )}
                </span>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
          </div>

          {generalError && (
            <p className="text-red-500 text-sm">{generalError}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              disabled={loading}
            >
              {loading ? <PulseLoader color="#fff" size={8} /> : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
