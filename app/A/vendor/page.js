"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { NEW_VENDOR_URL, VENDOR_ALL_URL } from "../../utils/constants";
import 'material-icons/iconfont/material-icons.css';
import Aos from "aos";
import "aos/dist/aos.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { LoadingScreen } from "../../utils/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import Searchbar from "../../../components/SearchBar";
import { SelectButton } from "primereact/selectbutton";
import secureLocalStorage from "react-secure-storage";
import { Dialog, Transition } from "@headlessui/react";
import DialogScreen from "../../utils/DialogScreen";


export default function VendorsScreen() {
    const [vendors, setVendors] = useState([]);
    const [vendorsFiltered, setVendorsFiltered] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [type, setType] = useState('0');

    const [isOpen, setIsOpen] = useState(false);
    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const router = useRouter();

    useEffect(() => {
        fetch(VENDOR_ALL_URL, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem('jaiGanesh')}`
            }
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    console.log(data);
                    setVendors(data["Vendors"]);
                    setVendorsFiltered(data["Vendors"]);
                    setIsLoading(false);
                })
            } else if (response.status === 401) {
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
            } else {
                setTitle('Oops');
                setMessage('Something went wrong! Please try again later!');
                setButtonText('Okay');
                setType('0');
                openModal();
            }
        }).catch((err) => {
            setTitle('Oops');
            setMessage('Something went wrong! Please try again later!');
            setButtonText('Okay');
            setType('0');
            openModal();
        }).finally(() => {
            setIsLoading(false);
        });

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });
    }, [router]);

    const [isMSMEValue, setIsMSMEValue] = useState(null);
    const [isWomenOwnedValue, setIsWomenOwnedValue] = useState(null);
    const [isSCSTValue, setIsSCSTValue] = useState(null);
    const [searchText, setSearchText] = useState('');

    // Create New Vendor
    const [vendorOrganization, setVendorOrganization] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');

    const msmeOptions = ["MSME", "Not MSME"];
    const womenOwnedOptions = ["Women Owned", "Not Women Owned"]
    const scstOptions = ["SC/ST", "Not SC/ST"];

    const isValidOrganization = vendorOrganization.length > 0;
    const emailRegex = new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    const isValidEmail = emailRegex.test(vendorEmail);

    const [isMSME, setIsMSME] = useState('');
    const isValidMSME = isMSME !== null && isMSME.length > 0 && msmeOptions.includes(isMSME);

    const [isWomenOwned, setIsWomenOwned] = useState('');
    const isValidWomenOwned = isWomenOwned !== null && isWomenOwned.length > 0 && womenOwnedOptions.includes(isWomenOwned);

    const [isSCST, setIsSCST] = useState('');
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

            fetch(VENDOR_ALL_URL, {
                method: 'GET',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${secureLocalStorage.getItem('jaiGanesh')}`
                }
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        console.log(data);
                        setVendors(data["Vendors"]);
                        setVendorsFiltered(data["Vendors"]);
                        setIsLoading(false);
                    })
                } else if (response.status === 401) {
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
                } else {
                    setTitle('Oops');
                    setMessage('Something went wrong! Please try again later!');
                    setButtonText('Okay');
                    setType('0');
                    openModal();
                }
            }).catch((err) => {
                setTitle('Oops');
                setMessage('Something went wrong! Please try again later!');
                setButtonText('Okay');
                setType('0');
                openModal();
            }).finally(() => {
                setIsLoading(false);
            });
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
                setTitle('Adding new vendor Failed');
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

    useEffect(() => {
        if (vendors.length) {
            setVendorsFiltered(vendors.filter((vendor) => {
                return (
                    (vendor["vendorOrganization"].toLowerCase().includes(searchText.toLowerCase())) &&
                    (isMSMEValue === null || isMSMEValue === "" || (isMSMEValue === "MSME" ? vendor["MSME"] === "1" : vendor["MSME"] === "0")) &&
                    (isWomenOwnedValue === null || isWomenOwnedValue === "" || (isWomenOwnedValue === "Women Owned" ? vendor["womenOwned"] === "1" : vendor["womenOwned"] === "0")) &&
                    (isSCSTValue === null || isSCSTValue === "" || (isSCSTValue === "SC/ST" ? vendor["SCST"] === "1" : vendor["SCST"] === "0"))
                );
            }));
        }
    }, [searchText, isMSMEValue, isWomenOwnedValue, isSCSTValue, vendors]);


    return <>
        {isLoading ? <LoadingScreen /> :
            <main data-aos="fade-in">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="lg:flex lg:gap-x-12">
                            <Link href={"/A"}>
                                <Image src="/logo.png" alt="NEEPCO logo" width={72} height={72} className='ml-auto mr-auto my-4' />
                            </Link>
                        </div>
                        <div className="lg:flex lg:flex-1 lg:justify-end space-x-1">
                            <Link href={"/A"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                <span className="material-icons">home</span>
                            </Link>
                            <button onClick={(e) => {
                                openNewVendorModal();
                            }} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                <span className="material-icons mr-2">add</span>
                                {"New vendor"}
                            </button>
                        </div>
                    </nav>
                </header>

                <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">
                    <div className="mx-auto max-w-2xl pt-16 lg:pt-24 ">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {"Vendors"}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-fit ml-auto mr-auto text-md bg-white rounded-xl border border-bGray my-16">
                        <h1 className="text-xl font-bold text-center p-2">Power Search</h1>

                        <Searchbar onChange={
                            (value) => setSearchText(value)
                        } placeholderText={"Vendor Organization Name"} />

                        <div className="flex flex-wrap border-t border-bGray justify-center items-center xl:flex-row space-x-2 space-y-2 p-4">
                            <div className="border p-4 rounded-md">
                                <SelectButton className="block" value={isMSMEValue} onChange={(e) => {
                                    setIsMSMEValue(e.value || '');
                                }} options={msmeOptions} required />
                            </div>
                            <div className="border p-4 rounded-md">
                                <SelectButton className="block" value={isWomenOwnedValue} onChange={(e) => {
                                    setIsWomenOwnedValue(e.value || '');
                                }} options={womenOwnedOptions} required />
                            </div>
                            <div className="border p-4 rounded-md">
                                <SelectButton className="block" value={isSCSTValue} onChange={(e) => {
                                    setIsSCSTValue(e.value || '');
                                }} options={scstOptions} required />
                            </div>
                        </div>
                    </div>
                </div>
                <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-red-50 bg-opacity-30 text-center text-sm border-black border-separate border-spacing-0 border-solid">
                    <thead className="border-0 text-lg font-medium">
                        <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                            <th className="px-8 py-4 rounded-tl-2xl border-black">Vendor ID</th>
                            <th className="px-8 py-4 border-black">Organization Name</th>
                            <th className="px-8 py-4 rounded-tr-2xl border-black">Quick Facts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendorsFiltered.length === 0 ? <tr>
                            <td className="border border-gray-200 rounded-b-2xl px-2 py-8 text-center text-lg" colSpan={6}>No Data Found</td>
                        </tr> : vendorsFiltered.map((vendor, index) => {
                            return (
                                <tr key={index} className="border border-gray-200">
                                    <td className={"px-8 py-4 border" + (index === vendorsFiltered.length - 1 ? " border-separate rounded-bl-2xl" : "")}>{vendor["vendorID"]}</td>
                                    <td className="px-8 py-4 border">{vendor["vendorOrganization"]}</td>
                                    <td className={"border border-gray-200 px-1 py-1" + (index === vendorsFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                        <div className="flex flex-wrap">
                                            {vendor["MSME"] === "1" ? (
                                                <div className="bg-yellow-100 rounded-xl p-2 m-1 w-fit text-[#544a15]">MSME</div>
                                            ) : null}
                                            {vendor["womenOwned"] === "1" ? (
                                                <div className="bg-green-50 rounded-xl p-2 m-1 w-fit text-[#21430e]">Women Owned</div>
                                            ) : null}
                                            {vendor["SCST"] === '1' ? (
                                                <div className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a]">SC/ST</div>
                                            ) : null}
                                            {vendor['MSME'] === '0' && vendor['womenOwned'] === '0' && vendor['SCST'] === '0' ? (
                                                <div className="bg-red-50 rounded-xl p-2 m-1 w-fit text-[#320f0f]">None</div>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

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
            </main>
        }
    </>
}