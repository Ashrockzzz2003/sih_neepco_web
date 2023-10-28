"use client";

import { useRouter } from "next/navigation";
import { GET_OFFICIALS_URL, REGISTER_OFFICIAL_URL } from "../../utils/constants";
import { Fragment, useEffect, useState } from "react";
import { LoadingScreen } from "../../utils/LoadingScreen";
import 'material-icons/iconfont/material-icons.css';
import Aos from "aos";
import "aos/dist/aos.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Link from "next/link";
import Image from "next/image";
import Searchbar from "../../../components/SearchBar";
import { SelectButton } from "primereact/selectbutton";
import secureLocalStorage from "react-secure-storage";
import { Dialog, Transition } from "@headlessui/react";
import DialogScreen from "../../utils/DialogScreen";


export default function OfficialsScreen() {
    const [officials, setOfficials] = useState([]);
    const [officialsFiltered, setOfficialsFiltered] = useState([]);
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
        fetch(GET_OFFICIALS_URL, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem('jaiGanesh')}`
            }
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setOfficials(data["officials"]);
                    setOfficialsFiltered(data["officials"]);
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


    const [searchText, setSearchText] = useState('');

    const [roleOptions, setRoleOptions] = useState(["Admin", "Buyer", "Consignee", "Payment Authority", "Vendor"])
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (officials.length) {
            setOfficialsFiltered(officials.filter((official) => {
                return (official["userName"].toLowerCase().includes(searchText.toLowerCase()) &&
                    official["userEmail"].toLowerCase().includes(searchText.toLowerCase()) &&
                    (role === null || official["userRole"] === roleOptions.indexOf(role).toString()))
            }));
        }
    }, [officials, searchText, roleOptions, role]);

    const [newOfficialName, setNewOfficialName] = useState('');
    const [newOfficialEmail, setNewOfficialEmail] = useState('');
    const [newOfficialRole, setNewOfficialRole] = useState(null);

    const isValidOfficialName = newOfficialName.length > 0;
    const emailREgeX = new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    const isValidOfficialEmail = emailREgeX.test(newOfficialEmail);
    const isValidOfficialRole = newOfficialRole !== null;


    const [newOfficialModalIsOpen, setNewOfficialModalIsOpen] = useState(false);
    function closeNewOfficialModal() {
        setNewOfficialModalIsOpen(false);
    }

    function openNewOfficialModal() {
        setNewOfficialModalIsOpen(true);
    }

    const handleNewOfficial = (e) => {
        e.preventDefault();

        fetch(REGISTER_OFFICIAL_URL, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem('jaiGanesh')}`
            },
            body: JSON.stringify({
                "officialEmail": newOfficialEmail,
                "officialName": newOfficialName,
                "officialRole": roleOptions.indexOf(newOfficialRole).toString()
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setTitle('Success');
                    setMessage(data["message"]);
                    setButtonText('Okay');
                    setType('1');
                    openModal();
                })
            } else if (res.status === 401) {
                secureLocalStorage.clear();
                setTitle('Unauthorized');
                setMessage('Session expired. Please login again!');
                setButtonText('Okay');
                setType('0');
                openModal();

                setTimeout(() => {
                    router.replace('/login');
                }, 3000);
            } else if (res.status === 500) {
                setTitle('Oops');
                setMessage('Something went wrong! Please try again later!');
                setButtonText('Okay');
                setType('0');
                openModal();
            } else if (res.status === 400) {
                res.json().then((data) => {
                    setTitle('Oops');
                    if (data["message"] !== null) {
                        setMessage(data["message"]);
                    } else {
                        setMessage('Something went wrong! Please try again later!');
                    }
                    setButtonText('Okay');
                    setType('0');
                    openModal();
                })
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
            setNewOfficialName('');
            setNewOfficialEmail('');
            setNewOfficialRole(null);
            closeNewOfficialModal();
        });
    }

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
                                openNewOfficialModal();
                            }} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                <span className="material-icons mr-2">add</span>
                                {"New Official"}
                            </button>
                        </div>
                    </nav>
                </header>

                <div className="relative isolate px-6 lg:px-8 justify-center items-center m-auto pt-8">
                    <div className="mx-auto max-w-2xl pt-16 lg:pt-24 ">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {"Officials"}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-fit ml-auto mr-auto text-md bg-white rounded-xl border border-bGray my-16">
                        <h1 className="text-xl font-bold text-center p-2">Power Search</h1>

                        <Searchbar onChange={
                            (value) => setSearchText(value)
                        } placeholderText={"Manager Name or Email or ID"} />

                        <SelectButton value={role} onChange={(e) => {
                            setRole(e.value);
                        }} options={roleOptions} className="p-4 flex" />
                    </div>
                </div>

                <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-red-50 bg-opacity-30 text-center text-sm border-black border-separate border-spacing-0 border-solid">
                    <thead className="border-0 text-lg font-medium">
                        <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                            <th className="px-8 py-4 rounded-tl-2xl border-black">ID</th>
                            <th className="px-8 py-4 border-black">Name</th>
                            <th className="px-8 py-4 border-black">Email-ID</th>
                            <th className={"px-8 py-4 border-black rounded-tr-xl"}>Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {officialsFiltered.length === 0 ? (
                            <tr>
                                <td className="border border-gray-200 rounded-b-2xl px-2 py-8 text-center text-lg" colSpan={6}>No Data Found</td>
                            </tr>
                        ) : (
                            officialsFiltered.map((official, index) => {
                                return (
                                    <tr key={index} className="border border-gray-200">
                                        <td className={"px-8 py-4 border" + (index === officialsFiltered.length - 1 ? " border-separate rounded-bl-2xl" : "")}>{official["userID"]}</td>
                                        <td className="px-8 py-4 border">{official["userName"]}</td>
                                        <td className="px-8 py-4 border">{official["userEmail"]}</td>
                                        <td className={"px-8 py-4 border" + (index === officialsFiltered.length - 1 ? " border-separate rounded-br-2xl" : "")}>
                                            {official["userRole"] === '0' ? (
                                                <span className="bg-red-50 rounded-xl p-2 m-1 w-fit text-[#541515]">{"Admin"}</span>
                                            ) : official["userRole"] === '1' ? (
                                                <span className="bg-yellow-50 rounded-xl p-2 m-1 w-fit text-[#544a15]">{"Buyer"}</span>
                                            ) : official["userRole"] === "2" ? (
                                                <span className="bg-blue-50 rounded-xl p-2 m-1 w-fit text-[#152c54]">{"Consignee"}</span>
                                            ) : official["userRole"] === "3" ? (
                                                <span className="bg-purple-50 rounded-xl p-2 m-1 w-fit text-[#3e1554]">{"Payment Authority"}</span>
                                            ) : official["userRole"] === "4" ? (
                                                <span className="bg-green-50 rounded-xl p-2 m-1 w-fit text-[#15541b]">{"Vendor"}</span>
                                            ) : (
                                                <span className="bg-red-100 rounded-xl p-2 m-1 w-fit text-[#541515]">{"Unknown"}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
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

                <Transition appear show={newOfficialModalIsOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={closeNewOfficialModal}>
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
                                            Register New Official
                                        </Dialog.Title>
                                        <form onSubmit={handleNewOfficial}>
                                            <div className="mt-2">
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-md font-medium leading-6 text-black">
                                                            Email ID
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="email"
                                                                placeholder='Enter Official Email ID'
                                                                onChange={(e) => {
                                                                    setNewOfficialEmail(e.target.value);
                                                                }}
                                                                className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                                    (!isValidOfficialEmail && newOfficialEmail ? ' ring-red-500' : isValidOfficialEmail && newOfficialEmail ? ' ring-green-500' : ' ring-bGray')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-md font-medium leading-6 text-black">
                                                            Full Name
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                placeholder='Enter Official Name'
                                                                onChange={(e) => {
                                                                    setNewOfficialName(e.target.value);
                                                                }}
                                                                className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                                    (!isValidOfficialName && newOfficialName ? ' ring-red-500' : isValidOfficialName && newOfficialName ? ' ring-green-500' : ' ring-bGray')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="border p-2 rounded-lg">
                                                        <SelectButton value={newOfficialRole} onChange={(e) => {
                                                            setNewOfficialRole(e.value || '');
                                                        }} options={roleOptions} required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-center items-center">
                                                <input
                                                    value={"Register Official"}
                                                    type="submit"
                                                    disabled={!(isValidOfficialName && isValidOfficialEmail && isValidOfficialRole)}
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-900"
                                                    onClick={closeNewOfficialModal}
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