"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function ProcurementsScreen() {
    const [isLoading, setLoading] = useState(true);
    const [userAccess, setUserAccess] = useState([]);

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
}