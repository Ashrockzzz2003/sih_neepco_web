"use client"

import Image from 'next/image'
import Link from 'next/link'
import 'material-icons/iconfont/material-icons.css';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';

export default function HomeScreen() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      easing: 'ease-in-out',
      delay: 100,
    });
  })

  return (
    <main>
      <div data-aos="fade-in">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="lg:flex lg:gap-x-12">
              <Link href={"/"}>
                <Image src="/logo.png" alt="NEEPCO logo" width={72} height={72} className='ml-auto mr-auto my-4' />
              </Link>
            </div>
            <div className="lg:flex lg:flex-1 lg:justify-end">
              <Link href={"/login"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                <span className="material-icons">login</span>
              </Link>
            </div>
          </nav>
        </header>



        <div className="relative isolate px-6 lg:px-8 flex justify-center items-center h-screen m-auto pt-16">
          <div
            className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
            aria-hidden="true"
          >
            
          </div>

          <div className="mx-auto max-w-2xl py-48 lg:py-56">
            <div className="sm:mb-8 flex justify-center text-center">
              <Link href={"https://neepco.co.in"} target='_blank'>
                <div className="relative rounded-full px-3 py-2 my-8 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 items-center align-middle flex flex-row">
                  {"North Eastern Electric Power Corporation Limited (NEEPCO)"}
                  <span className="material-icons ml-2">open_in_new</span>
                </div>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Procurement Management Portal
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
              {"Unlock transparency and efficiency in NEEPCO's procurement and payments with our dedicated portal. Streamline operations, empower MSEs, and navigate GeM purchases seamlessly."}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href={"/login"} className="bg-[#000000] text-[#ffffff] rounded-lg items-center align-middle flex flex-row hover:bg-[#202020] text-lg px-2 py-1">
                  <span className="material-icons mr-2">login</span>
                  {"Sign In"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}