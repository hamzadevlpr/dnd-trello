"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../components/assets/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function Navbar() {
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      // Sign out the current user
      localStorage.removeItem("user");
      await signOut(auth);
      toast.success("Sign out successful");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    // get user email from local storage and set it to userEmail
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user);
    if (user) {
      setUserEmail(userData.email);
    }
  }, [userEmail]);
  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex items-center justify-center sm:justify-between flex-col sm:flex-row gap-3">
        {/* user email */}
        <span className="bg-white bg-opacity-40 py-3 px-5 text-sm font-bold text-white rounded-xl ">
          {userEmail}
        </span>
        {/* Logo */}
        <Image
          src={logo}
          className="opacity-75 w-28"
          alt="Logo"
          layout="fixed"
        />
        {/* sign out button */}
        <button
          onClick={handleSignOut}
          className="bg-white bg-opacity-40  py-3 px-5 text-sm font-bold text-white rounded-xl "
        >
          Sign out
        </button>
      </div>
      <div className="glass-effect flex items-center justify-center flex-wrap sm:justify-between gap-3 p-2">
        {/*  home and grid icon */}
        <div className="flex gap-2">
          <button className="bg-white bg-opacity-40  p-3 text-sm font-bold text-white rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
              />
            </svg>
          </button>
          <button className="bg-white bg-opacity-40  p-3 text-sm font-bold text-white rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </button>
        </div>

        {/* right icons bell, plus, profile */}
        <div className="flex gap-2 rounded items-center">
          <button className="bg-white bg-opacity-40  p-3 text-sm font-bold text-white rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>

          <button className="bg-white bg-opacity-40  p-3 text-sm font-bold text-white rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </button>

          <button className="bg-white bg-opacity-40  p-3 text-sm font-bold text-white rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </button>

          <img
            onClick={() => router.push("/user")}
            alt="logo"
            src="https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png"
            className="w-11 h-11 rounded-full inline-flex items-center justify-center"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
