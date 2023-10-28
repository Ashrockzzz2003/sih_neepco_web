"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { LoadingScreen } from "../../utils/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import { All_PROCUREMENTS_URL, UPDATE_PAYMENT_URL, UPLOADS_URL, UPLOAD_CRAC_URL, UPLOAD_PRC_URL } from "../../utils/constants";
import 'material-icons/iconfont/material-icons.css';
import Aos from "aos";
import "aos/dist/aos.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Searchbar from "../../../components/SearchBar";
import { SelectButton } from "primereact/selectbutton";
import { Tooltip, Typography } from "@material-tailwind/react";
import UploadFileComponents from "../../utils/UploadFile";
import DialogScreen from "../../utils/DialogScreen";
import { Dialog, Transition } from "@headlessui/react";

export default function ProcurementsScreen() {
    const [isLoading, setLoading] = useState(true);
    const [userAccess, setUserAccess] = useState("");
    const [procurementData, setProcurementData] = useState([]);
    const [procurementDataFiltered, setProcurementDataFiltered] = useState([]);

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

        setUserAccess(secureLocalStorage.getItem("jaiGanesh"));

        fetch(All_PROCUREMENTS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("jaiGanesh"),
            }
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setProcurementData(data["procurements"]);
                    setProcurementDataFiltered(data["procurements"]);
                })
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
            setLoading(false);
        });

        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });
    }, [router]);


    const [searchText, setSearchText] = useState("");

    const [vendorSelectionOptions, setVendorSelectionOptions] = useState(["Bidding", "Direct Purchase", "Reverse Auction"]);
    const [vendorSelection, setVendorSelection] = useState(null);

    const msmeOptions = ["MSME", "Not MSME"];
    const [isMSME, setIsMSME] = useState(null);

    const womenOwnedOptions = ["Women Owned", "Not Women Owned"]
    const [isWomenOwned, setIsWomenOwned] = useState(null);

    const scstOptions = ["SC/ST", "Not SC/ST"];
    const [isSCST, setIsSCST] = useState(null);

    const statusOptions = ["Waiting for PRC", "PRC Done", "CRAC Done", "Completed", "Cancelled"];
    const [status, setStatus] = useState(null);


    useEffect(() => {
        if (procurementData.length) {
            setProcurementDataFiltered(procurementData.filter((procurement) => {
                return (
                    ((procurement["goodsType"] !== null && procurement["goodsType"].toLowerCase().includes(searchText.toLowerCase()))
                        || (procurement["gemID"] !== null && procurement["gemID"].toString().toLowerCase().includes(searchText.toLowerCase()))
                        || (procurement["vendorOrganization"] !== null && procurement["vendorOrganization"].toLowerCase().includes(searchText.toLowerCase()))
                        || (procurement["Buyer"] !== null && procurement["Buyer"].toLowerCase().includes(searchText.toLowerCase()))
                        || (procurement["Consignee"] !== null && procurement["Consignee"].toLowerCase().includes(searchText.toLowerCase()))
                        || (procurement["Payment_Authority"] !== null && procurement["Payment_Authority"].toLowerCase().includes(searchText.toLowerCase()))) &&
                    (vendorSelection === null || vendorSelection === "" || (vendorSelection === "Bidding" && procurement["vendorSelection"] === "bidding") || (vendorSelection === "Direct Purchase" && procurement["vendorSelection"] === "direct-purchase") || (vendorSelection === "Reverse Auction" && procurement["vendorSelection"] === "reverse-auction")) &&
                    (isMSME === null || isMSME === "" || (isMSME === "MSME" ? procurement["msme"] === "1" : procurement["msme"] === "0")) &&
                    (isWomenOwned === null || isWomenOwned === "" || (isWomenOwned === "Women Owned" ? procurement["womenOwned"] === "1" : procurement["womenOwned"] === "0")) &&
                    (isSCST === null || isSCST === "" || (isSCST === "SC/ST" ? procurement["scst"] === "1" : procurement["scst"] === "0")) &&
                    (status === null || status === "" || (status === "Waiting for PRC" && procurement["Status"] === "0") || (status === "PRC Done" && procurement["Status"] === "1") || (status === "CRAC Done" && procurement["Status"] === "2") || (status === "Completed" && procurement["Status"] === "3") || (status === "Cancelled" && procurement["Status"] === "4"))
                );
            }));
        }
    }, [searchText, procurementData, vendorSelection, isMSME, isWomenOwned, isSCST, status]);

    const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);
    function closeUploadModal() {
        setUploadModalIsOpen(false);
    }

    function openUploadModal() {
        setUploadModalIsOpen(true);
    }

    const [selectedProcurement, setSelectedProcurement] = useState(null);

    const uploadPRC = (e, file) => {
        const formData = new FormData();
        formData.append("prc", file);

        fetch(UPLOAD_PRC_URL, {
            "headers": {
                "Authorization": "Bearer " + secureLocalStorage.getItem("jaiGanesh") + ` ${selectedProcurement}`,
            },
            "body": formData,
            method: "POST"
        }).then((response) => {
            if (response.status === 200) {
                setTitle('Success');
                setMessage('PRC uploaded successfully!');
                setButtonText('Okay');
                setType('1');
                openModal();

                fetch(All_PROCUREMENTS_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + secureLocalStorage.getItem("jaiGanesh"),
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        res.json().then((data) => {
                            setProcurementData(data["procurements"]);
                            setProcurementDataFiltered(data["procurements"]);
                        })
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
                    setLoading(false);
                });
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
            } else if (response.status === 400) {
                response.json().then((data) => {
                    setTitle('Uploading Payment Details Failed');
                    if (data.message !== undefined || data.message !== null)
                        setMessage(data.message);
                    else
                        setMessage('Something went wrong! Please try again later!');
                    setButtonText('Okay');
                    setType('0');
                    openModal();
                });
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
            setLoading(false);
        });
    }

    const uploadCRAC = (e, file) => {
        const formData = new FormData();
        formData.append("crac", file);

        fetch(UPLOAD_CRAC_URL, {
            "headers": {
                "Authorization": "Bearer " + secureLocalStorage.getItem("jaiGanesh") + ` ${selectedProcurement}`,
            },
            "body": formData,
            method: "POST"
        }).then((response) => {
            if (response.status === 200) {
                setTitle('Success');
                setMessage('CRAC uploaded successfully!');
                setButtonText('Okay');
                setType('1');
                openModal();

                fetch(All_PROCUREMENTS_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + secureLocalStorage.getItem("jaiGanesh"),
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        res.json().then((data) => {
                            setProcurementData(data["procurements"]);
                            setProcurementDataFiltered(data["procurements"]);
                        })
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
                    setLoading(false);
                });
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
            } else if (response.status === 400) {
                response.json().then((data) => {
                    setTitle('Uploading Payment Details Failed');
                    if (data.message !== undefined || data.message !== null)
                        setMessage(data.message);
                    else
                        setMessage('Something went wrong! Please try again later!');
                    setButtonText('Okay');
                    setType('0');
                    openModal();
                });
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
            setLoading(false);
        });
    }

    const [uploadType, setUploadType] = useState('0');




    const [paymentDialogModalIsOpen, setPaymentDialogModalIsOpen] = useState(false);
    function closePaymentDialogModal() {
        setPaymentDialogModalIsOpen(false);
    }

    function openPaymentDialogModal() {
        setPaymentDialogModalIsOpen(true);
    }

    const [paymentAmount, setPaymentAmount] = useState('');
    const paymentModeOptions = ["Internet Banking", "NEFT", "IMPS", "RTGS", "Other"];
    const [paymentMode, setPaymentMode] = useState('');
    const [transactionID, setTransactionID] = useState('');

    const isValidAmount = paymentAmount !== '' && paymentAmount !== null && paymentAmount !== undefined && !isNaN(paymentAmount) && parseFloat(paymentAmount) > 0;
    const isValidPaymentMode = paymentMode !== '' && paymentMode !== null && paymentMode !== undefined && paymentModeOptions.includes(paymentMode);
    const isValidTransactionID = transactionID !== '' && transactionID !== null && transactionID !== undefined && !isNaN(transactionID) && parseInt(transactionID) > 0;

    const handlePayment = (e) => {
        e.preventDefault();
        fetch(UPDATE_PAYMENT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("jaiGanesh"),
            },
            body: JSON.stringify({
                procurementID: selectedProcurement,
                paymentAmount: paymentAmount,
                paymentMode: paymentMode,
                transactionID: transactionID,
            })
        }).then((response) => {
            if (response.status === 200) {
                setTitle('Success');
                setMessage('Payment details updated successfully!');
                setButtonText('Okay');
                setType('1');
                openModal();

                fetch(All_PROCUREMENTS_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + secureLocalStorage.getItem("jaiGanesh"),
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        res.json().then((data) => {
                            setProcurementData(data["procurements"]);
                            setProcurementDataFiltered(data["procurements"]);
                        })
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
                    setLoading(false);
                });

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
            } else if (response.status === 400) {
                response.json().then((data) => {
                    setTitle('Uploading Payment Details Failed');
                    if (data.message !== undefined || data.message !== null)
                        setMessage(data.message);
                    else
                        setMessage('Something went wrong! Please try again later!');
                    setButtonText('Okay');
                    setType('0');
                    openModal();
                });
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
            setLoading(false);
        });
    }

    return <>
        {isLoading ?
            <LoadingScreen /> :
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
                            <Link href={"/A/procurements/new"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                <span className="material-icons mr-2">add</span>
                                {"New Procurement"}
                            </Link>
                        </div>
                    </nav>
                </header>

                <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">

                    <div className="mx-auto max-w-2xl pt-16 lg:pt-24 ">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {"Procurements"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center items-center">
                        <div className="text-md bg-white rounded-xl border border-bGray my-16">
                            <h1 className="text-xl font-bold text-center p-2">Power Search</h1>
                            <hr className="w-full border-bGray" />
                            <Searchbar onChange={
                                (value) => setSearchText(value)
                            } placeholderText={"GemID or Goods Type or Official Name ..."} />

                            <div className="flex flex-wrap border-t border-bGray justify-center items-center xl:flex-row space-x-2 space-y-2 p-4">
                                <div className="border p-4 rounded-md">
                                    <SelectButton className="block" value={vendorSelection} onChange={(e) => {
                                        setVendorSelection(e.value || '');
                                    }} options={vendorSelectionOptions} required />
                                </div>
                                <div className="border p-4 rounded-md">
                                    <SelectButton className="block" value={isMSME} onChange={(e) => {
                                        setIsMSME(e.value || '');
                                    }} options={msmeOptions} required />
                                </div>
                                <div className="border p-4 rounded-md">
                                    <SelectButton className="block" value={isWomenOwned} onChange={(e) => {
                                        setIsWomenOwned(e.value || '');
                                    }} options={womenOwnedOptions} required />
                                </div>
                                <div className="border p-4 rounded-md">
                                    <SelectButton className="block" value={isSCST} onChange={(e) => {
                                        setIsSCST(e.value || '');
                                    }} options={scstOptions} required />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap justify-center items-center p-4">
                            <div className="border p-4 py-8 rounded-md">
                                <SelectButton className="block" value={status} onChange={(e) => {
                                    setStatus(e.value || '');
                                }} options={statusOptions} required />
                            </div>
                        </div>
                    </div>

                    <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-pink-50 bg-opacity-30 text-center text-sm border-black border-separate border-spacing-0 border-solid mt-8 justify-center items-center">
                        <thead className="border-0 text-md bg-black">
                            {/*{
                                "procurementID": 1,
                                "gemID": 14554,
                                "goodsType": "Coal",
                                "goodsQuantity": "100kg",
                                "vendorSelection": "bidding",
                                "vendorID": 1,
                                "vendorOrganization": "Sajith Enterprises",
                                "vendorEmail": "vakada@gmail.com",
                                "msme": "1",
                                "womenOwned": "1",
                                "scst": "0",
                                "invoiceNo": 923,
                                "prcNo": 1,
                                "cracNo": 1,
                                "paymentId": 1,
                                "Status": "4",
                                "Buyer_ID": 2,
                                "Buyer": "Venkatakrishnan",
                                "Consignee_ID": 3,
                                "Consignee": "Ashwin",
                                "Payment_Authority_ID": 4,
                                "Payment_Authority": "Sajith"
                            }, */}
                            <tr>
                                <th className="px-2 py-4 rounded-tl-2xl border-black text-white">Gem ID</th>
                                <th className="px-2 py-4 border-black text-white">CreatedAt</th>
                                <th className="px-2 py-4 border-black text-white">Goods</th>
                                <th className="px-2 py-4 border-black text-white">Mode</th>
                                <th className="px-2 py-4 border-black text-white">Vendor Organization</th>
                                <th className="px-2 py-4 border-black text-white">Invoice No</th>
                                <th className="px-2 py-4 border-black text-white">PAO</th>
                                <th className="px-2 py-4 border-black text-white">Actions</th>
                                <th className="px-2 py-4 border-b-black text-white rounded-tr-2xl">Quick Facts</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {procurementDataFiltered.length === 0 ? (
                                <tr>
                                    <td className="border border-gray-200 rounded-b-2xl px-2 py-8 text-center text-lg" colSpan={15}>No Data Found</td>
                                </tr>
                            ) : (
                                procurementDataFiltered.map((procurement, index) => {
                                    return (
                                        <tr key={index} className="text-center">
                                            <td className={"border border-gray-200 px-1 py-1" + (index === procurementDataFiltered.length - 1 ? "border-separate rounded-bl-2xl" : "")}>{procurement["gemID"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>
                                                {
                                                    // date from timestamp
                                                    new Date(procurement["Created_At"]).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }) ?? "-"
                                                }
                                            </td>
                                            <td className={"border border-gray-200 px-1 py-1 flex-col justify-center space-x-2"}>
                                                <span>{procurement["goodsType"] ?? "-"}</span> <span className="bg-green-50 rounded-md p-1 w-fit text-[#143a0e]">{`${procurement["goodsQuantity"] ?? "-"}`}</span></td>
                                            <td className={"border border-gray-200 px-1 py-1"}><div className="flex flex-wrap">
                                                {
                                                    procurement["vendorSelection"] === "bidding" ? (
                                                        <div className="bg-yellow-100 rounded-xl p-2 m-1 w-fit text-[#544a15]">Bidding</div>
                                                    ) :
                                                        procurement["vendorSelection"] === "reverse-auction" ? (
                                                            <div className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a]">Reverse Auction</div>
                                                        ) :
                                                            procurement["vendorSelection"] === "direct-purchase" ? <div className="bg-pink-50 rounded-xl p-2 m-1 w-fit text-[#461348]">Direct Purchase</div> : <div className="bg-red-50 rounded-xl p-2 m-1 w-fit text-[#461348]">Unknown</div>
                                                }
                                            </div>
                                            </td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["vendorOrganization"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["invoiceNo"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>
                                                {procurement['paymentId'] === null ? (procurement["Status"] === "2" ? (
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedProcurement(procurement["procurementID"]);
                                                        openPaymentDialogModal();
                                                    }} className="bg-green-50 rounded-xl p-2 m-1 w-fit text-[#143a0e] cursor-pointer items-center align-middle flex flex-row">
                                                        <i className="material-icons mr-1">currency_rupee</i>
                                                        {"Update Payment"}
                                                    </button>
                                                ) : (
                                                    <div className="bg-red-50 rounded-xl p-2 m-1 w-fit text-[#3a0e0e] cursor-not-allowed items-center align-middle flex flex-row">
                                                        <i className="material-icons mr-1">info</i>
                                                        {"Pending"}
                                                    </div>
                                                )) : (<Tooltip
                                                    className="bg-blue-gray-800 bg-opacity-80 rounded-xl p-2 m-1 w-fit backdrop-blur-2xl"
                                                    content={
                                                        <div>
                                                            <Typography
                                                                variant="small"
                                                                color="white"
                                                                className="font-bold opacity-80"
                                                            >
                                                                Transaction ID: {procurement["transactionID"] ?? "-"}
                                                            </Typography>
                                                            <Typography
                                                                variant="small"
                                                                color="white"
                                                                className="font-bold opacity-80"
                                                            >
                                                                Payment Mode: {procurement["paymentMode"] ?? "-"}
                                                            </Typography>
                                                            <Typography
                                                                variant="small"
                                                                color="white"
                                                                className="font-bold opacity-80"
                                                            >
                                                                Payment Amount: {procurement["paymentAmount"] ?? "-"}
                                                            </Typography>
                                                        </div>
                                                    }>
                                                    <div className="bg-pink-50 rounded-xl p-2 m-1 w-fit text-[#541550] ">{procurement['Payment_Authority'] ?? "-"}</div>
                                                </Tooltip>)}
                                            </td>
                                            <td className={"border border-gray-200 px-1 py-1"}>
                                                <div className="flex flex-wrap">
                                                    {
                                                        procurement["Status"] === "0" ? (
                                                            <div className="flex flex-wrap">
                                                                <Tooltip
                                                                    className="bg-blue-gray-800 bg-opacity-80 rounded-xl p-2 m-1 w-fit backdrop-blur-2xl"
                                                                    content={
                                                                        <div>
                                                                            <Typography
                                                                                variant="small"
                                                                                color="white"
                                                                                className="font-bold opacity-80"
                                                                            >
                                                                                Buyer: {procurement["Buyer"] ?? "-"}
                                                                            </Typography>
                                                                        </div>
                                                                    }>
                                                                    <div className="flex flex-wrap">
                                                                        <div className="bg-red-50 rounded-xl p-2 m-1 w-fit text-[#541515] flex flex-wrap align-middle justify-center items-center">
                                                                            <i className="material-icons mr-1">info</i>
                                                                            {"Waiting for PRC"}
                                                                        </div>
                                                                        <button onClick={
                                                                            () => {
                                                                                setUploadType('0');
                                                                                setSelectedProcurement(procurement["procurementID"]);
                                                                                openUploadModal();
                                                                            }
                                                                        } className="bg-yellow-100 rounded-xl p-2 m-1 w-fit text-[#544a15] cursor-pointer items-center align-middle flex flex-row">
                                                                            <i className="material-icons">upload_file</i>
                                                                            {"Upload PRC"}
                                                                        </button>
                                                                    </div>
                                                                </Tooltip>
                                                            </div>
                                                        ) :
                                                            procurement["Status"] === "1" ? (
                                                                <div className="flex flex-wrap">
                                                                    <Tooltip
                                                                        className="bg-blue-gray-800 bg-opacity-80 rounded-xl p-2 m-1 w-fit backdrop-blur-2xl"
                                                                        content={
                                                                            <div>
                                                                                <Typography
                                                                                    variant="small"
                                                                                    color="white"
                                                                                    className="font-bold opacity-80"
                                                                                >
                                                                                    Buyer: {procurement["Buyer"] ?? "-"}
                                                                                </Typography>
                                                                                <Typography
                                                                                    variant="small"
                                                                                    color="white"
                                                                                    className="font-bold opacity-80"
                                                                                >
                                                                                    Consignee: {procurement["Consignee"] ?? "-"}
                                                                                </Typography>
                                                                            </div>
                                                                        }>
                                                                        <Link target="_blank" href={UPLOADS_URL + "/PRC/" + procurement["procurementID"] + "_PRC.pdf"} className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a] cursor-pointer items-center align-middle flex flex-row">
                                                                            <i className="material-icons mr-1">visibility</i>
                                                                            {"View PRC"}
                                                                        </Link>
                                                                    </Tooltip>
                                                                    <button onClick={
                                                                        () => {
                                                                            setUploadType('1');
                                                                            setSelectedProcurement(procurement["procurementID"]);
                                                                            openUploadModal();
                                                                        }
                                                                    } className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a] cursor-pointer items-center align-middle flex flex-row">
                                                                        <i className="material-icons ">upload_file</i>
                                                                        {"Upload CRAC"}
                                                                    </button>
                                                                </div>

                                                            ) :
                                                                procurement["Status"] === "2" ? (
                                                                    <Tooltip
                                                                        className="bg-blue-gray-800 bg-opacity-80 rounded-xl p-2 m-1 w-fit backdrop-blur-2xl"
                                                                        content={
                                                                            <div>
                                                                                <Typography
                                                                                    variant="small"
                                                                                    color="white"
                                                                                    className="font-bold opacity-80"
                                                                                >
                                                                                    Buyer: {procurement["Buyer"] ?? "-"}
                                                                                </Typography>
                                                                                <Typography
                                                                                    variant="small"
                                                                                    color="white"
                                                                                    className="font-bold opacity-80"
                                                                                >
                                                                                    Consignee: {procurement["Consignee"] ?? "-"}
                                                                                </Typography>
                                                                            </div>
                                                                        }>
                                                                        <div className="flex flex-wrap">
                                                                            <div className="bg-red-50 rounded-xl p-2 m-1 w-fit text-[#541515] flex flex-wrap align-middle justify-center items-center">
                                                                                <i className="material-icons mr-1">info</i>
                                                                                {"Pending Payment"}
                                                                            </div>
                                                                            <Link target="_blank" href={UPLOADS_URL + "/PRC/" + procurement["procurementID"] + "_PRC.pdf"} className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a] cursor-pointer items-center align-middle flex flex-row">
                                                                                <i className="material-icons mr-1">visibility</i>
                                                                                {"PRC"}
                                                                            </Link>
                                                                            <Link target="_blank" href={UPLOADS_URL + "/CRAC/" + procurement["procurementID"] + "_CRAC.pdf"} className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a] cursor-pointer items-center align-middle flex flex-row">
                                                                                <i className="material-icons mr-1">visibility</i>
                                                                                {"CRAC"}
                                                                            </Link>
                                                                        </div>
                                                                    </Tooltip>
                                                                ) :
                                                                    procurement["Status"] === "3" ? (
                                                                        <Tooltip
                                                                            className="bg-blue-gray-800 bg-opacity-80 rounded-xl p-2 m-1 w-fit backdrop-blur-2xl"
                                                                            content={
                                                                                <div>
                                                                                    <Typography
                                                                                        variant="small"
                                                                                        color="white"
                                                                                        className="font-bold opacity-80"
                                                                                    >
                                                                                        Buyer: {procurement["Buyer"] ?? "-"}
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        variant="small"
                                                                                        color="white"
                                                                                        className="font-bold opacity-80"
                                                                                    >
                                                                                        Consignee: {procurement["Consignee"] ?? "-"}
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        variant="small"
                                                                                        color="white"
                                                                                        className="font-bold opacity-80"
                                                                                    >
                                                                                        Payment Authority: {procurement["Payment_Authority"] ?? "-"}
                                                                                    </Typography>
                                                                                </div>
                                                                            }>
                                                                            <div className="flex flex-wrap">
                                                                                <div className="bg-green-50 rounded-xl p-2 m-1 w-fit text-[#21430e] flex justify-center items-center align-middle">
                                                                                    <i className="material-icons mr-1">check_circle</i>
                                                                                    {"Completed"}
                                                                                </div>
                                                                                <Link target="_blank" href={UPLOADS_URL + "/PRC/" + procurement["procurementID"] + "_PRC.pdf"} className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a] cursor-pointer items-center align-middle flex flex-row">
                                                                                    <i className="material-icons mr-1">visibility</i>
                                                                                    {"PRC"}
                                                                                </Link>
                                                                                <Link target="_blank" href={UPLOADS_URL + "/CRAC/" + procurement["procurementID"] + "_CRAC.pdf"} className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a] cursor-pointer items-center align-middle flex flex-row">
                                                                                    <i className="material-icons mr-1">visibility</i>
                                                                                    {"CRAC"}
                                                                                </Link>
                                                                            </div>
                                                                        </Tooltip>
                                                                    ) : 
                                                                    <div className="bg-red-50 rounded-xl p-2 m-1 w-fit text-[#320f0f] flex justify-center align-middle items-center">
                                                                        <i className="material-icons mr-1">cancel</i>
                                                                        {"Cancelled"}
                                                                    </div>
                                                    }
                                                </div>
                                                {
                                                    /*<td className={"border border-gray-200 px-1 py-1"}>{procurement["Buyer"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["Consignee"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["Payment_Authority"] ?? "-"}</td> */
                                                }
                                            </td>
                                            <td className={"border border-gray-200 px-1 py-1" + (index === procurementDataFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                <div className="flex flex-wrap">
                                                    {procurement["msme"] === "1" ? (
                                                        <div className="bg-yellow-100 rounded-xl p-2 m-1 w-fit text-[#544a15]">MSME</div>
                                                    ) : null}
                                                    {procurement["womenOwned"] === "1" ? (
                                                        <div className="bg-green-50 rounded-xl p-2 m-1 w-fit text-[#21430e]">Women Owned</div>
                                                    ) : null}
                                                    {procurement["scst"] === '1' ? (
                                                        <div className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#1d0e3a]">SC/ST</div>
                                                    ) : null}
                                                    {procurement['msme'] === '0' && procurement['womenOwned'] === '0' && procurement['scst'] === '0' ? (
                                                        <div className="bg-red-50 rounded-xl p-2 m-1 w-fit text-[#320f0f]">None</div>
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <DialogScreen
                    isOpen={isOpen}
                    closeModal={closeModal}
                    title={title}
                    message={message}
                    buttonText={buttonText}
                    type={type}
                />

                <UploadFileComponents
                    modalTitle={"Upload Certificate"}
                    isOpen={uploadModalIsOpen}
                    closeModal={closeUploadModal}
                    onUploadFunction={uploadType === '0' ? uploadPRC : uploadCRAC}
                />

                <Transition appear show={paymentDialogModalIsOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={closePaymentDialogModal}>
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
                                            Update Payment Details
                                        </Dialog.Title>
                                        <form onSubmit={handlePayment}>
                                            <div className="mt-2">
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-md font-medium leading-6 text-black">
                                                            Transaction ID
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="number"
                                                                placeholder='Enter Transaction ID'
                                                                onChange={(e) => {
                                                                    setTransactionID(e.target.value);
                                                                }}
                                                                className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                                    (!isValidTransactionID && transactionID ? ' ring-red-500' : isValidTransactionID && transactionID ? ' ring-green-500' : ' ring-bGray')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-md font-medium leading-6 text-black">
                                                            Payment Amount
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                placeholder='Enter Payment Amount'
                                                                onChange={(e) => {
                                                                    setPaymentAmount(e.target.value);
                                                                }}
                                                                className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                                    (!isValidAmount && paymentAmount ? ' ring-red-500' : isValidAmount && paymentAmount ? ' ring-green-500' : ' ring-bGray')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="border p-2 rounded-lg">
                                                        <SelectButton className="block" value={paymentMode} onChange={(e) => {
                                                            setPaymentMode(e.value || '');
                                                        }} options={paymentModeOptions} required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-center items-center">
                                                <input
                                                    value={"Update Payment Details"}
                                                    type="submit"
                                                    disabled={!isValidAmount || !isValidPaymentMode || !isValidTransactionID}
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-900"
                                                    onClick={closePaymentDialogModal}
                                                />
                                            </div>
                                        </form>

                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </main>}
    </>
}