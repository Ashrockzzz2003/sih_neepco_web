"use client";

import 'material-icons/iconfont/material-icons.css';
import Aos from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DialogScreen from "../utils/DialogScreen";
import { LoadingScreen } from '../utils/LoadingScreen';
import { LOGIN_URL, RoleToRoleID } from '../utils/constants';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/navigation';

export default function LoginScreen() {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const emailRegex = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');

    const isValidEmail = emailRegex.test(userEmail);
    const isValidPassword = userPassword.length >= 8;

    const [isLoading, setIsLoading] = useState(false);


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

    const handeLogin = async (e) => {
        e.preventDefault();

        if (!isValidEmail || !isValidPassword) {
            setTitle('Incomplete Credentials');
            setMessage('Please check your credentials and try again.');
            setButtonText('Okay');
            openModal();
        }

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                    userPassword: userPassword
                })
            });

            const data = await response.json();

            if (response.status === 200) {
                setTitle('Success');
                setMessage('Login Successful! Click Okay to continue.');
                setButtonText('Okay');
                setType('1');
                openModal();

                const userRole = RoleToRoleID(data['userRole']);

                secureLocalStorage.setItem('authorization_tier', userRole);
                secureLocalStorage.setItem('jaiGanesh', data['SECRET_TOKEN']);
                secureLocalStorage.setItem('userEmail', data['userEmail']);
                secureLocalStorage.setItem('userName', data['userName']);

                switch (userRole) {
                    case 0:
                        // ADMIN
                        router.replace('/A');
                        break;
                    case 1:
                        // BUYER
                        router.replace('/B');
                        break;
                    case 2:
                        // CONSIGNEE
                        router.replace('/C');
                        break;
                    case 3:
                        // PAYMENT AUTHORITY
                        router.replace('/P');
                        break;
                    case 4:
                        // Vendor
                        secureLocalStorage.setItem('vendorID', data['vendorID']);
                        secureLocalStorage.setItem('vendorOrganization', data['vendorOrganization']);
                        secureLocalStorage.setItem('msme', data['msme']);
                        secureLocalStorage.setItem('womenOwned', data['womenOwned']);
                        secureLocalStorage.setItem('scst', data['scst']);
                        router.replace('/V');
                        break;
                    default:
                        break;
                }
            }
            else if (response.status === 201) {

            } else if (response.status === 500) {
                setTitle('Oops');
                setMessage('Something went wrong! Please try again later!');
                setButtonText('Okay');
                setType('0');
                openModal();
            } else if (data.message !== undefined || data.message !== null) {
                setTitle('Login Failed');
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
        }
    }

    useEffect(() => {
        Aos.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
            delay: 100,
        });
    });

    return (
        <main>
            {isLoading ? <LoadingScreen /> :
                <div data-aos='fade in' className='flex h-screen flex-1 flex-col justify-center'>
                    <header className="absolute inset-x-0 top-0 z-50">
                        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                            <div className="lg:flex lg:gap-x-12">
                                <Link href={"/"}>
                                    <Image src="/logo.png" alt="NEEPCO logo" width={72} height={72} className='ml-auto mr-auto my-4' />
                                </Link>
                            </div>
                            <div className="lg:flex lg:flex-1 lg:justify-end space-x-1">
                                <Link href={"/"} className="bg-[#000000] text-[#ffffff] rounded-xl p-2 items-center align-middle flex flex-row hover:bg-[#3b3b3b] ">
                                    <span className="material-icons">home</span>
                                </Link>
                            </div>
                        </nav>
                    </header>

                    <div className="border border-gray-300 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-gray-50">
                        <div
                            className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
                            aria-hidden="true"
                        >

                        </div>

                        <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                            <div className='flex flex-row justify-center'>
                                <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center'>Sign In</h1>
                            </div>
                            <hr className='border-gray-300 w-full' />
                        </div>

                        <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                            <form className="space-y-6" onSubmit={handeLogin}>
                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Email ID
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            placeholder='Enter your Email ID'
                                            onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
                                            className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidEmail && userEmail ? ' ring-red-500' : isValidEmail && userEmail ? ' ring-green-500' : ' ring-bGray')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-md font-medium leading-6 text-black">
                                            Password
                                        </label>
                                        <div className="text-md">
                                            <Link replace={true} href={"/forgotPassword"} className="font-medium text-blue-600 hover:underline">
                                                Forgot password?
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder='Enter your Password'
                                            className={"block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" + (!isValidPassword && userPassword ? ' ring-red-500' : isValidPassword && userPassword ? ' ring-green-500' : ' ring-bGray')}
                                            onChange={(e) => setUserPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* <p className="mt-10 text-center text-md text-gray-500">
                        {"Don't have an account? "}
                        <Link className="font-semibold leading-6 text-blue-600 hover:underline" href="/register">Register</Link>
                    </p> */}
{/* 
                                <p className="mt-10 text-center text-md text-gray-500">
                                    {"Don't have an account? "}
                                    <Link className="font-medium leading-6 text-blue-600 hover:underline" href="/register">Register</Link>
                                </p> */}

                                <div>
                                    <input
                                        value="Sign In"
                                        type="submit"
                                        disabled={!isValidEmail || !isValidPassword}
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
        </main>
    );
}