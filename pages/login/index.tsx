"use client";
import React from "react";
import Logo from "../../components/assets/logo.png";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { auth, provider } from "../../components/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome back ${user.displayName}!`);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (err: any) {
      if (err.response) {
        const { status, data } = err.response;
        console.log(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="fixed grid place-items-center backdrop-blur-sm top-0 right-0 left-0 z-50 w-full inset-0 h-modal h-full justify-center items-center">
        <div className="relative container m-auto px-6">
          <div className="m-auto md:w-[30rem]">
            <div className="rounded-xl glass-effect shadow-xl">
              <div className="p-8 h-[vh] ">
                <div className="space-y-4">
                  <Image
                    src={Logo}
                    loading="lazy"
                    className="w-40"
                    alt="logo"
                  />
                  <h2 className="mb-8 text-4xl text-cyan-900  font-bold">
                    Welcome back :)
                  </h2>
                </div>
                <div className="mt-10 grid space-y-4 px-5">
                  <button
                    onClick={handleGoogleSignIn}
                    className="group h-12 px-6 border rounded-lg"
                  >
                    <div className="relative flex items-center space-x-4 justify-center">
                      <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        className="absolute left-0 w-5"
                        alt="google logo"
                      />
                      <span className="block w-max font-semibold tracking-wide text-gray-50 text-sm">
                        Continue with Google
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
