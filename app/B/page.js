"use client";

import { Fragment, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { NEW_VENDOR_URL } from "../utils/constants";
import { useRouter } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';
import Aos from "aos";
import "aos/dist/aos.css";
import { LoadingScreen } from "../utils/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import DialogScreen from "../utils/DialogScreen";
import { Dialog, Transition } from "@headlessui/react";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { SelectButton } from "primereact/selectbutton";

export default function BuyerDashboardScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [userAccess, setUserAccess] = useState([]);
    const [userRole, setUserRole] = useState('Buyer');
    const [userName, setUserName] = useState("");

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

    // Create New Vendor
    const [vendorOrganization, setVendorOrganization] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');

    const msmeOptions = ["MSME", "Not MSME"];
    const [isMSME, setIsMSME] = useState(false);

    const womenOwnedOptions = ["Women Owned", "Not Women Owned"]
    const [isWomenOwned, setIsWomenOwned] = useState(false);

    const scstOptions = ["SC/ST", "Not SC/ST"];
    const [isSCST, setIsSCST] = useState(false);

    const isValidOrganization = vendorOrganization.length > 0;
    const emailRegex = new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    const isValidEmail = emailRegex.test(vendorEmail);

    const isValidMSME = isMSME !== null && isMSME.length > 0 && msmeOptions.includes(isMSME);
    const isValidWomenOwned = isWomenOwned !== null && isWomenOwned.length > 0 && womenOwnedOptions.includes(isWomenOwned);
    const isValidSCST = isSCST !== null && isSCST.length > 0 && scstOptions.includes(isSCST);

    const [newVendorIsOpen, setNewVendorIsOpen] = useState(false);
    function closeNewVendorModal() {
        setNewVendorIsOpen(false)
    }
    function openNewVendorModal() {
        setNewVendorIsOpen(true)
    }


    const addNewVendor = async (e) => {
        e.preventDefault();

        if (!isValidOrganization || !isValidEmail || !isValidMSME || !isValidWomenOwned || !isValidSCST) {
            setTitle('Incomplete Data');
            setMessage('Please check all fields and try again.');
            setButtonText('Okay');
            openModal();
        }


        try {
            const response = await fetch(NEW_VENDOR_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('jaiGanesh')
                },
                body: JSON.stringify({
                    vendorOrganization: vendorOrganization,
                    vendorEmail: vendorEmail,
                    msme: isMSME === 'MSME' ? "1" : "0",
                    womenOwned: isWomenOwned === "Women Owned" ? "1" : "0",
                    scst: isSCST === "SC/ST" ? "1" : "0"
                })
            });

            const data = await response.json();

            if (response.status === 200) {
                if (data.vendorID !== undefined || data.vendorID !== null || data.vendorName !== undefined || data.vendorName !== null) {
                    setTitle('Success');
                    setMessage('New Vendor Added Successfully!');
                    setButtonText('Okay');
                    setType('1');
                    openModal();

                    setTimeout(() => {
                        router.replace('/B/vendor');
                    }, 3000);
                }
            }
            else if (response.status === 401) {
                secureLocalStorage.clear();
                setTitle('Unauthorized');
                setMessage('Session expired. Please login again!');
                setButtonText('Okay');
                setType('0');
                openModal();

                setTimeout(() => {
                    router.replace('/login');
                }, 3000);
            } else if (response.status === 500) {
                setTitle('Oops');
                setMessage('Something went wrong! Please try again later!');
                setButtonText('Okay');
                setType('0');
                openModal();
            } else if (data.message !== undefined || data.message !== null) {
                setTitle('Adding new procurement Failed');
                setMessage(data.message);
                setButtonText('Okay');
                setType('0');
                openModal();
            } else {
                setTitle('Oops');
                setMessage('Something went wrong! Please try again later!');
                setButtonText('Okay');
                setType('0');
                openModal();
            }
        } catch (error) {
            console.log(error);
            setTitle('Sorry');
            setMessage('Something went wrong. Please try again later.');
            setButtonText('Okay');
            setType('0');
            openModal();
        } finally {
            setVendorEmail('');
            setVendorOrganization('');
            setIsMSME(null);
            setIsWomenOwned(null);
            setIsSCST(null);
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading ?
                <LoadingScreen /> :
                <main>
                    <div data-aos="fade-in">
                        <header className="absolute inset-x-0 top-0 z-50">
                            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                                <div className="lg:flex lg:gap-x-12">
                                    <Link href={"/B"}>
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
                                <div className="sm:mb-2 flex justify-center text-center">
                                    <Link className="hover:cursor-pointer" href={"/B"} target='_blank'><div className="relative rounded-full px-3 py-1 my-8 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
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
                            </div>

                            <h1 className="text-3xl text-center mb-2">Quick Actions</h1>

                            <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                                <div className="border flex flex-col rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 w-fit max-w-4/5">
                                    <h1 className="px-4 pt-2 text-[#1d0e3a] text-center text-xl">Procurements</h1>
                                    <hr className="w-full border-[#1d0e3a] my-2" />
                                    <div className="px-4 py-4 flex flex-wrap space-x-2 justify-center items-center">
                                        <Link className="hover:cursor-pointer" href="/B/procurements">
                                            <div className="bg-yellow-100 text-[#544a15] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                                <span className="material-icons mr-2">work</span>
                                                {"All Procurements"}
                                            </div>
                                        </Link>
                                        <Link href="/B/procurements/new" className="hover:cursor-pointer">
                                            <div className="bg-yellow-100 text-[#544a15] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                                <span className="material-icons">add</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>


                                <div className="border flex flex-col rounded-xl backdrop-blur-xl bg-red-50 bg-opacity-30 ">
                                    <h1 className="px-4 pt-2 text-[#403914] text-center text-xl">Vendors</h1>
                                    <hr className="w-full border-[#544a15] my-2" />
                                    <div className="px-4 py-4 flex flex-wrap space-x-2 justify-center items-center">
                                        <Link className="hover:cursor-pointer" href="/B/vendor">
                                            <button className="bg-yellow-100 text-[#544a15] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                                <span className="material-icons mr-2">badge</span>
                                                {"All Vendors"}
                                            </button>
                                        </Link>
                                        <button onClick={openNewVendorModal}>
                                            <div className="bg-yellow-100 text-[#544a15] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-opacity-80">
                                                <span className="material-icons">add</span>
                                            </div>
                                        </button>
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


            <Transition appear show={newVendorIsOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeNewVendorModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        New Vendor
                                    </Dialog.Title>
                                    <form onSubmit={addNewVendor}>
                                        <div className="mt-2">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-md font-medium leading-6 text-black">
                                                        Vendor Organization Name
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="name"
                                                            placeholder='Enter Vendor Organization Name'
                                                            onChange={(e) => {
                                                                setVendorOrganization(e.target.value);
                                                            }}
                                                            className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                                (!isValidOrganization && vendorOrganization ? ' ring-red-500' : isValidOrganization && vendorOrganization ? ' ring-green-500' : ' ring-bGray')}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-md font-medium leading-6 text-black">
                                                        Vendor Email
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="email"
                                                            placeholder='Enter Vendor Email'
                                                            onChange={(e) => {
                                                                setVendorEmail(e.target.value);
                                                            }}
                                                            className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                                (!isValidEmail && vendorEmail ? ' ring-red-500' : isValidEmail && vendorEmail ? ' ring-green-500' : ' ring-bGray')}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="border p-2 rounded-lg">
                                                    <SelectButton className="block" value={isMSME} onChange={(e) => {
                                                        setIsMSME(e.value || '');
                                                    }} options={msmeOptions} required />
                                                </div>

                                                <div className="border p-2 rounded-lg">
                                                    <SelectButton className="block" value={isWomenOwned} onChange={(e) => {
                                                        setIsWomenOwned(e.value || '');
                                                    }} options={womenOwnedOptions} required />
                                                </div>

                                                <div className="border p-2 rounded-lg">
                                                    <SelectButton className="block" value={isSCST} onChange={(e) => {
                                                        setIsSCST(e.value || '');
                                                    }} options={scstOptions} required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-center items-center">
                                            <input
                                                value={"Add Vendor"}
                                                type="submit"
                                                disabled={!isValidOrganization || !isValidEmail || !isValidMSME || !isValidWomenOwned || !isValidSCST}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-900"
                                                onClick={closeNewVendorModal}
                                            />
                                        </div>
                                    </form>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>);

}