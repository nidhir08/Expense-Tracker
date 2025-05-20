"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
export default function SignInPage() {
  return (
    <div className="flex flex-col items-center py-40 gap-y-10">
        <div className="flex flex-row">
      <button onClick={() => signIn("github",{ callbackUrl: "/" })} className="bg-blue-600 px-6 py-2 flex items-center gap-2 text-white cursor-pointer">
      <ImGithub className="w-6 h-6"/>
         Sign in with GitHub</button>
      </div>
      <button onClick={() => signIn("google",{ callbackUrl: "/" })} className="bg-blue-600 px-6 py-2 flex items-center gap-2 text-white cursor-pointer">
      <FcGoogle className="w-6 h-6"/>
        Sign in with Google</button>
    </div>
  );
}
