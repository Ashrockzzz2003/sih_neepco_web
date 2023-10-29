"use client";

import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';
import Aos from "aos";
import "aos/dist/aos.css";
import { LoadingScreen } from "../utils/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import DialogScreen from "../utils/DialogScreen";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

export default function VendorDashboardScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [userAccess, setUserAccess] = useState([]);
    const [userRole, setUserRole] = useState('Vendor');
    const [userName, setUserName] = useState("");

    const [vendorID, setVendorID] = useState(secureLocalStorage.getItem("vendorID"));
    const [vendorOrganization, setVendorOrganization] = useState(secureLocalStorage.getItem("vendorOrganization"));
    const [msme, setMSME] = useState(secureLocalStorage.getItem("msme"));
    const [womenOwned, setWomenOwned] = useState(secureLocalStorage.getItem("womenOwned"));
    const [scst, setSCST] = useState(secureLocalStorage.getItem("scst"));

    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [type, setType] = useState('0');

    const [isOpen, setIsOpen] = useState(false);
    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }


    const router = useRouter();

    useEffect(() => {
        setUserAccess(secureLocalStorage.getItem("jaiGanesh"));
        setUserName(secureLocalStorage.getItem("userName"));
        setVendorID(secureLocalStorage.getItem("vendorID"));
        setVendorOrganization(secureLocalStorage.getItem("vendorOrganization"));
        setMSME(secureLocalStorage.getItem("msme"));
        setWomenOwned(secureLocalStorage.getItem("womenOwned"));
        setSCST(secureLocalStorage.getItem("scst"));

        if (secureLocalStorage.getItem("jaiGanesh") === null || secureLocalStorage.getItem("jaiGanesh") === undefined || secureLocalStorage.getItem("jaiGanesh").length === 0) {
            secureLocalStorage.clear();
            setTitle('Unauthorized');
            setMessage('Session expired. Please login again!');
            setButtonText('Okay');
            setType('0');
            openModal();

            setTimeout(() => {
                router.replace('/login');
            }, 3000);
        }

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });

    }, [router]);

    return (
        <>
            {isLoading ?
                <LoadingScreen /> :
                <main>
                    <div data-aos="fade-in">
                        <header className="absolute inset-x-0 top-0 z-50">
                            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                                <div className="lg:flex lg:gap-x-12">
                                    <Link href={"/V"}>
                                        <Image src="/logo.png" alt="NEEPCO logo" width={72} height={72} className='ml-auto mr-auto my-4' />
                                    </Link>
                                </div>
                                <div className="lg:flex lg:flex-1 lg:justify-end">
                                    <div className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                        <span className="material-icons">person</span>
                                    </div>

                                    <button onClick={
                                        () => {
                                            secureLocalStorage.clear();
                                            router.replace("/login");
                                        }
                                    } className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80 ml-2">
                                        {"Logout"}
                                        <span className="material-icons ml-2">logout</span>
                                    </button>
                                </div>
                            </nav>
                        </header>

                        <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">
                            <div
                                className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                                aria-hidden="true"
                            >
                                <div
                                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#cecca8] to-[#decca9] opacity-20"
                                />
                            </div>


                            <div className="mx-auto max-w-2xl py-16 lg:py-24">
                                <div className="flex justify-center text-center">
                                    <Link className="hover:cursor-pointer" href={"/V"} target='_blank'><div className="relative rounded-full px-3 py-1 my-8 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                        {userRole}
                                    </div></Link>
                                </div>
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                        {"Welcome"}
                                    </h1>
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                        {userName}
                                    </h1>
                                </div>

                                {/* <div className="flex flex-wrap justify-center items-center">
                                    {msme === "1" ? (
                                        <div className="bg-yellow-100 rounded-xl p-2 m-1 w-fit text-[#544a15]">MSME</div>
                                    ) : <></>}
                                    {womenOwned === "1" ? (
                                        <div className="bg-green-50 rounded-xl p-2 m-1 w-fit text-[#21430e]">Women Owned</div>
                                    ) : <></>}
                                    {scst === '1' ? (
                                        <div className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a]">SC/ST</div>
                                    ) : <></>}
                                </div> */}
                            </div>

                            <h1 className="text-3xl text-center mb-2">Quick Actions</h1>
                            <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                                <div className="border flex flex-col rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 w-fit max-w-4/5">
                                    <h1 className="px-4 pt-2 text-[#1d0e3a] text-center text-xl">Procurements</h1>
                                    <hr className="w-full border-[#1d0e3a] my-2" />
                                    <div className="px-4 py-4 flex flex-wrap space-x-2 justify-center items-center">
                                        <Link className="hover:cursor-pointer" href="/V/procurements">
                                            <div className="bg-yellow-100 text-[#544a15] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                                <span className="material-icons mr-2">work</span>
                                                {"Track Procurements"}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            }

            <DialogScreen
                isOpen={isOpen}
                closeModal={closeModal}
                title={title}
                message={message}
                buttonText={buttonText}
                type={type}
            />
        </>);

}