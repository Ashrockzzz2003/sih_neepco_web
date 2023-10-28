"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { ALL_VENDOR_URL, CREATE_PROCUREMENT_URL, NEW_VENDOR_URL } from "../../../utils/constants";
import 'material-icons/iconfont/material-icons.css';
import Aos from "aos";
import "aos/dist/aos.css";
import DialogScreen from "../../../utils/DialogScreen";
import Link from "next/link";
import Image from "next/image";
import { LoadingScreen } from "../../../utils/LoadingScreen";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { Dialog, Transition } from "@headlessui/react";


export default function CreateNewProcurementScreen() {
    const [gemID, setGemID] = useState('');
    const [goodsType, setGoodsType] = useState('');
    const [goodsQuantity, setGoodsQuantity] = useState('');
    const [vendorSelectionOptions, setVendorSelectionOptions] = useState(["Bidding", "Direct Purchase", "Reverse Auction"]);
    const [vendorSelection, setVendorSelection] = useState('');

    const [vendorID, setVendorID] = useState('');
    const [invoiceNo, setInvoiceNo] = useState('');

    const isValidGemID = gemID.length > 0;
    const isValidGoodsType = goodsType.length > 0;
    const isValidGoodsQuantity = goodsQuantity.length > 0;
    const isValidVendorSelection = vendorSelection.length > 0 && vendorSelectionOptions.includes(vendorSelection);
    const isValidVendorID = vendorID.toString().length > 0;
    const isValidInvoiceNo = invoiceNo.toString().length > 0;

    const [vendorList, setVendorList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccess, setUserAccess] = useState(secureLocalStorage.getItem("jaiGanesh"));

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

        fetch(ALL_VENDOR_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("jaiGanesh"),
            }
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setVendorList(data["Vendors"]);
                });
            } else if (res.status === 401) {
                secureLocalStorage.clear();
                setTitle('Unauthorized');
                setMessage('Session expired. Please login again!');
                setButtonText('Okay');
                setType('0');
                openModal();
                setTimeout(() => {
                    router.replace("/login");
                }, 3000);
            } else {
                res.json().then((data) => {
                    if (data["message"] !== undefined)
                        setMessage(data["message"]);
                    else
                        setMessage("Something went wrong");
                    setTitle("Error");
                    setType("0");
                    setButtonText("Close");
                    openModal();
                });
            }
        }).catch((err) => {
            setMessage(err.message);
            setTitle("Error");
            setType("0");
            setButtonText("Close");
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

    const isValidMSME = isMSME.length > 0 && msmeOptions.includes(isMSME);
    const isValidWomenOwned = isWomenOwned.length > 0 && womenOwnedOptions.includes(isWomenOwned);
    const isValidSCST = isSCST.length > 0 && scstOptions.includes(isSCST);

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

        if (userAccess === null || userAccess === undefined) {
            alertError("Session Expired", "Please login again to continue.");
            secureLocalStorage.clear();
            setTimeout(() => {
                router.replace("/login");
            }, 3000);
            return;
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
                    vendorList.push({
                        vendorID: data.vendorID,
                        vendorName: data.vendorName
                    });
                    setVendorList(vendorList);
                    setVendorID(data.vendorID);
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
            setIsLoading(false);
        }
    };


    const handleNewProcurement = async (e) => {
        e.preventDefault();

        if (!isValidGemID || !isValidGoodsQuantity || !isValidGoodsType || !isValidVendorSelection || !isValidVendorID) {
            setTitle('Incomplete Data');
            setMessage('Please check all fields and try again.');
            setButtonText('Okay');
            openModal();
        }

        console.log({
            gemID: gemID,
            goodsType: goodsType,
            goodsQuantity: goodsQuantity,
            vendorSelection: vendorSelection === 'Bidding' ? 'bidding' : vendorSelection === 'Direct Purchase' ? 'direct-purchase' : 'reverse-auction',
            vendorID: vendorID
        });

        try {
            const response = await fetch(CREATE_PROCUREMENT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('jaiGanesh')
                },
                body: JSON.stringify({
                    gemID: gemID,
                    goodsType: goodsType,
                    goodsQuantity: goodsQuantity,
                    vendorSelection: vendorSelection === 'Bidding' ? 'bidding' : vendorSelection === 'Direct Purchase' ? 'direct-purchase' : 'reverse-auction',
                    vendorID: vendorID,
                    invoiceNo: invoiceNo
                })
            });

            const data = await response.json();

            if (response.status === 200) {
                setTitle('Success');
                setMessage('New Procurement Added Successfully!');
                setButtonText('Okay');
                setType('1');
                openModal();

                setTimeout(() => {
                    router.replace('/B/procurements');
                }, 3000);
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
            setIsLoading(false);
        }
    };

    return (
        <main>
            {isLoading ? <LoadingScreen /> :
                <div data-aos='fade in' className='flex h-screen flex-1 flex-col justify-center'>
                    <header className="absolute inset-x-0 top-0 z-50">
                        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                            <div className="lg:flex lg:gap-x-12">
                                <Link href={"/B"}>
                                    <Image src="/logo.png" alt="NEEPCO logo" width={72} height={72} className='ml-auto mr-auto my-4' />
                                </Link>
                            </div>
                            <div className="lg:flex lg:flex-1 lg:justify-end space-x-1">
                                <Link href={"/B"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                    <span className="material-icons">home</span>
                                </Link>
                                <Link href={"/B/procurements"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                    <span className="material-icons">work</span>
                                </Link>
                            </div>
                        </nav>
                    </header>

                    <div className="border border-gray-300 rounded-2xl mx-auto backdrop-blur-xl bg-gray-50">
                        <div
                            className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                            aria-hidden="true"
                        >

                        </div>

                        <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                            <div className='flex flex-row justify-center'>
                                <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center'>Add New Procurement</h1>
                            </div>
                            <hr className='border-gray-300 w-full' />
                        </div>

                        <div className="mt-10 mx-auto w-full px-6 pb-8 lg:px-8 ">
                            <form className="space-y-6" onSubmit={handleNewProcurement}>
                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">Company</label>
                                    <div className="mt-2">
                                        <Dropdown
                                            value={vendorID} onChange={(e) => setVendorID(e.value || '')} options={vendorList} optionLabel="vendorName" optionValue='vendorID'
                                            placeholder="Select the company" className="w-full md:w-14rem" required
                                            filter={true}
                                        />
                                    </div>
                                </div>

                                <p className="mt-10 text-center text-md text-gray-500">
                                    {"Can't find the Vendor? "}
                                    <button onClick={openNewVendorModal} className="font-medium leading-6 text-blue-600 hover:underline">Add New Vendor</button>
                                </p>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Gem ID
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            placeholder='Enter GemID'
                                            onChange={(e) => setGemID(e.target.value.trim())}
                                            className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidGemID && gemID ? ' ring-red-500' : isValidGemID && gemID ? ' ring-green-500' : ' ring-bGray')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Goods Type (eg. Coal)
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            placeholder='Enter Goods Type'
                                            onChange={(e) => setGoodsType(e.target.value.trim())}
                                            className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidGoodsType && goodsType ? ' ring-red-500' : isValidGoodsType && goodsType ? ' ring-green-500' : ' ring-bGray')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Goods Quantity (eg. 1000 MT)
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            placeholder='Enter Goods Quantity'
                                            onChange={(e) => setGoodsQuantity(e.target.value.trim())}
                                            className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidGoodsQuantity && goodsQuantity ? ' ring-red-500' : isValidGoodsQuantity && goodsQuantity ? ' ring-green-500' : ' ring-bGray')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Invoice No
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            placeholder='Enter Invoice No'
                                            onChange={(e) => setInvoiceNo(e.target.value.trim())}
                                            className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidInvoiceNo && invoiceNo ? ' ring-red-500' : isValidInvoiceNo && invoiceNo ? ' ring-green-500' : ' ring-bGray')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">Mode</label>
                                    <div className="mt-2 border rounded-md">
                                        <SelectButton value={vendorSelection} onChange={(e) => {
                                            setVendorSelection(e.value || '');
                                        }} options={vendorSelectionOptions} required />
                                    </div>
                                </div>

                                <div>
                                    <input
                                        value="Add New Procurement"
                                        type="submit"
                                        disabled={!isValidGemID || !isValidGoodsQuantity || !isValidGoodsType || !isValidVendorSelection || !isValidVendorID || !isValidInvoiceNo}
                                        className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
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

                                                <div className="border rounded-md">
                                                    <SelectButton value={isMSME} onChange={(e) => {
                                                        setIsMSME(e.value || '');
                                                    }} options={msmeOptions} required />
                                                </div>

                                                <div className="border rounded-md">
                                                    <SelectButton value={isWomenOwned} onChange={(e) => {
                                                        setIsWomenOwned(e.value || '');
                                                    }} options={womenOwnedOptions} required />
                                                </div>

                                                <div className="border rounded-md">
                                                    <SelectButton value={isSCST} onChange={(e) => {
                                                        setIsSCST(e.value || '');
                                                    }} options={scstOptions} required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-center">
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
    );
}