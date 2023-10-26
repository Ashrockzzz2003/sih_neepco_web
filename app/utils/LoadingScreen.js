"use client";
import Image from 'next/image';
import { Spinner } from '@material-tailwind/react';


export const LoadingScreen = () => {
    return (
        <main>
            <div className="flex h-screen justify-center items-center">
                <Spinner
                    speed={2}
                    className='h-12 w-12' />
            </div>
        </main>
    );
};