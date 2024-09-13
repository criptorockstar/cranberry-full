import React from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import SignUpForm from "./form";

export default function SignUp() {
  return (
    <React.Fragment>
      <div className="bg-[#f0f0f0">
        <div className="w-full mt-4 pb-2 lg:hidden xs:block z-20">
          <div className="flex justify-end mr-8">
            <p className="text-[#0A1D35] text-[24px]">Registrarse</p>
            <Lock className="text-[#0A1D35] mt-1.5 ml-1.5" />
          </div>
        </div>

        <div className="flex lg:min-h-screen xs:min-h-[calc(100vh-60px)]">
          <div className="relative hidden lg:block w-[100%]">
            <Image
              src="/auth.png"
              alt=""
              className="w-full h-full object-cover rounded-tr-[20px] rounded-br-[20px]"
              style={{ objectPosition: "center top" }}
              layout="fill"
            />
          </div>

          <div
            className={`flex flex-col justify-center 
            py-6 xs:py-0 xs:mb-3
            rounded-2xl mx-auto px-4 
            lg:min-w-[400px] max-w-[650px]
            lg:w-full lg:mx-0 
            `}
          >
            <div className="pt-12 xs:pt-0">
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
