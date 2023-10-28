
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function UploadFileComponents({
    isOpen,
    closeModal,
    onUploadFunction
}) {

    const [file, setFile] = useState(null);

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
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="max-w-xl">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        onUploadFunction(e, file);
                                    }}>
                                        <div className='w-fit ml-auto mr-auto mb-8'>
                                            <input type="file" accept='application/pdf' name="file_upload" onChange={(e) => {
                                                setFile(e.target.files[0]);
                                            }} required />
                                        </div>
                                        <input
                                            value="Upload"
                                            type="submit"
                                            onClick={closeModal}
                                            disabled={file === null}
                                            className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
