"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { LoadingScreen } from "../../utils/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import { All_PROCUREMENTS_URL } from "../../utils/constants";
import 'material-icons/iconfont/material-icons.css';
import Aos from "aos";
import "aos/dist/aos.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Searchbar from "../../../components/SearchBar";
import { SelectButton } from "primereact/selectbutton";

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
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
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
                        } placeholderText={"Start Typing"} />

                        <div className="flex flex-wrap border-t border-bGray justify-center items-center xl:flex-row space-x-2 space-y-2 p-4">
                            <div className="border p-4 rounded-md">
                                <SelectButton value={vendorSelection} onChange={(e) => {
                                    setVendorSelection(e.value || '');
                                }} options={vendorSelectionOptions} required />
                            </div>
                            <div className="border p-4 rounded-md">
                                <SelectButton value={isMSME} onChange={(e) => {
                                    setIsMSME(e.value || '');
                                }} options={msmeOptions} required />
                            </div>
                            <div className="border p-4 rounded-md">
                                <SelectButton value={isWomenOwned} onChange={(e) => {
                                    setIsWomenOwned(e.value || '');
                                }} options={womenOwnedOptions} required />
                            </div>
                            <div className="border p-4 rounded-md">
                                <SelectButton value={isSCST} onChange={(e) => {
                                    setIsSCST(e.value || '');
                                }} options={scstOptions} required />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row flex-wrap justify-center items-center p-4">
                        <div className="border p-4 py-8 rounded-md">
                            <SelectButton value={status} onChange={(e) => {
                                setStatus(e.value || '');
                            }} options={statusOptions} required />
                        </div>
                    </div>
                    </div>

                    <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-red-50 bg-opacity-30 text-center text-sm border-black border-separate border-spacing-0 border-solid mt-8">
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
                                <th className="px-2 py-4 border-black text-white">Goods Type</th>
                                <th className="px-2 py-4 border-black text-white">Goods Quantity</th>
                                <th className="px-2 py-4 border-black text-white">Mode</th>
                                <th className="px-2 py-4 border-black text-white">Vendor Organization</th>
                                <th className="px-2 py-4 border-black text-white">Invoice No</th>
                                <th className="px-2 py-4 border-black text-white">PRC</th>
                                <th className="px-2 py-4 border-black text-white">CRAC</th>
                                <th className="px-2 py-4 border-black text-white">Payment ID</th>
                                <th className="px-2 py-4 border-black text-white">Status</th>
                                <th className="px-2 py-4 border-black text-white">Buyer</th>
                                <th className="px-2 py-4 border-black text-white">Consignee</th>
                                <th className="px-2 py-4 border-black text-white">Payment Authority</th>
                                <th className="px-2 py-4 border-b-black text-white rounded-tr-2xl">Quick Facts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procurementDataFiltered.length === 0 ? (
                                <tr>
                                    <td className="border border-gray-200 rounded-b-2xl px-2 py-8 text-center text-lg" colSpan={15}>No Data Found</td>
                                </tr>
                            ) : (
                                procurementDataFiltered.map((procurement, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className={"border border-gray-200 px-1 py-1" + (index === procurementDataFiltered.length - 1 ? "border-separate rounded-bl-2xl" : "")}>{procurement["gemID"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["goodsType"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["goodsQuantity"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}><div className="flex flex-wrap">
                                                {
                                                    procurement["vendorSelection"] === "bidding" ? (<div className="bg-yellow-100 rounded-xl p-2 m-1 w-fit text-[#544a15]">Bidding</div>) :
                                                        procurement["vendorSelection"] === "reverse-auction" ? <div className="bg-purple-100 rounded-xl p-2 m-1 w-fit text-[#1d0e3a]">PRC Done. Waiting for CRAC.</div> :
                                                            procurement["vendorSelection"] === "direct-purchase" ? <div className="bg-pink-100 rounded-xl p-2 m-1 w-fit text-[#461348]">Direct Purchase</div> : <div className="bg-red-100 rounded-xl p-2 m-1 w-fit text-[#461348]">Unknown</div>
                                                }
                                            </div>
                                            </td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["vendorOrganization"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["invoiceNo"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["prcNo"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["cracNo"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["paymentId"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>
                                                <div className="flex flex-wrap">
                                                    {
                                                        procurement["Status"] === "0" ? (<div className="bg-yellow-100 rounded-xl p-2 m-1 w-fit text-[#544a15]">Waiting for PRC</div>) :
                                                            procurement["Status"] === "1" ? <div className="bg-purple-100 rounded-xl p-2 m-1 w-fit text-[#1d0e3a]">PRC Done.</div> :
                                                                procurement["Status"] === "2" ? <div className="bg-pink-100 rounded-xl p-2 m-1 w-fit text-[#461348]">CRAC Done</div> :
                                                                    procurement["Status"] === "3" ? <div className="bg-green-100 rounded-xl p-2 m-1 w-fit text-[#21430e]">Completed</div> : <div className="bg-red-100 rounded-xl p-2 m-1 w-fit text-[#320f0f]">Cancelled</div>
                                                    }
                                                </div>
                                            </td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["Buyer"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["Consignee"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1"}>{procurement["Payment_Authority"] ?? "-"}</td>
                                            <td className={"border border-gray-200 px-1 py-1 flex flex-wrap" + (index === procurementDataFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                                {procurement["msme"] === "1" ? (
                                                    <div className="bg-yellow-100 rounded-xl p-2 m-1 w-fit text-[#544a15]">MSME</div>
                                                ) : null}
                                                {procurement["womenOwned"] === "1" ? (
                                                    <div className="bg-green-100 rounded-xl p-2 m-1 w-fit text-[#21430e]">Women Owned</div>
                                                ) : null}
                                                {procurement["scst"] === '1' ? (
                                                    <div className="bg-purple-100 rounded-xl p-2 m-1 w-fit text-[#1d0e3a]">SC/ST</div>
                                                ) : null}
                                                {procurement['msme'] === '0' && procurement['womenOwned'] === '0' && procurement['scst'] === '0' ? (
                                                    <div className="bg-red-100 rounded-xl p-2 m-1 w-fit text-[#320f0f]">None</div>
                                                ) : null}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </main>}
    </>
}