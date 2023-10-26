import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function DialogScreen({ isOpen, closeModal, title, message, buttonText, type }) {

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                    className="text-xl font-medium leading-6 text-gray-900"
                                >
                                    {title}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-md text-gray-700">
                                        {message}
                                    </p>
                                </div>

                                <div className="mt-8 flex justify-center items-center">
                                    {type === '0' ? (
                                        <button
                                        type="button"
                                        className={"inline-flex justify-center rounded-md border border-transparen bg-red-100 w-full px-4 py-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-red-900 hover:bg-red-200 focus-visible:ring-red-500"}
                                        onClick={closeModal}
                                    >
                                        {buttonText}
                                    </button>
                                    ) : (
                                        <button
                                        type="button"
                                        className={"inline-flex justify-center rounded-md border border-transparen bg-blue-100 w-full px-4 py-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500"}
                                        onClick={closeModal}
                                    >
                                        {buttonText}
                                    </button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}