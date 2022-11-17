/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import SaliencyResult from "../components/saliencyResult";
import axios from "axios";

const HomePage = () => {
    // const [selectedFile, setSelectedFile] = useState<File>();
    // const [preview, setPreview] = useState<string>();
    const [showPreview, setShowPreview] = useState(false);
    const [predict, setPredict] = useState(false);
    const [msg, setMsg] = useState<Record<string, string>>({ color: "text-gray-900", msg: "⚠️ ONLY SALGAN WORKS, UPLOAD IMAGES ONLY!" });
    const [resultFile, setResultFile] = useState<Blob>();
    const [resultUrl, setResultUrl] = useState<string>();

    const [previewFile, setPreviewFile] = useState<Blob>();
    const [previewUrl, setPreviewUrl] = useState<string>();

    useEffect(() => {
        if (!previewFile) {
            return;
        }
        const url = URL.createObjectURL(
            new Blob([previewFile], { type: "image/png" })
        );
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [previewFile]);

    useEffect(() => {
        if (!resultFile) {
            return;
        }
        const url = URL.createObjectURL(
            new Blob([resultFile], { type: "image/png" })
        );
        console.log(resultFile);
        setResultUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [resultFile]);

    const uploadImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if (!e.target.files || e.target.files.length === 0) {
            // setSelectedFile(undefined);
            return;
        }

        // setSelectedFile(e.target.files[0]);
        setShowPreview(true);

        let data = new FormData();
        data.append("image", e.target.files[0]);

        await axios
            .post<File>("https://minzi.live/resize", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            })
            .then((res) => {
                setPreviewFile(res.data);
                setMsg({
                    color: "text-blue-900",
                    msg: "⬆️ IMAGE UPLOADED!",
                });
            })
            .catch((e) => console.log("Error at uploading with", e));
    };

    const getPrediction = async (): Promise<void> => {
        await axios
            .get<File>("https://minzi.live/salgan", {
                headers: {
                    "Content-Type": "image/png",
                },
                responseType: "blob"
            })
            .then((res) => {
                setResultFile(res.data);
                setMsg({
                    color: "text-blue-900",
                    msg: "✅ MAP GENERATED",
                });
                setPredict(true);
            })
            .catch((e) => console.log("Error at Prediction with", e));
    };

    const navigation = [
        { name: "Dashboard", href: "#", current: true },
        { name: "TranSalNet", href: "#", current: false },
        { name: "CASNet", href: "#", current: false },
        { name: "SalGAN", href: "#", current: false },
    ];

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <>
            <div className="min-h-full min-h-screen bg-gray-800">
                <Disclosure as="nav" className="bg-gray-800">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="hidden sm:block">
                                            <div className="ml-0 flex items-baseline space-x-4">
                                                {navigation.map((item) => (
                                                    <a
                                                        key={item.name}
                                                        href={item.href}
                                                        className={classNames(
                                                            item.current
                                                                ? "bg-gray-900 text-white"
                                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                                            "px-3 py-2 rounded-md text-sm font-medium"
                                                        )}
                                                        aria-current={item.current ? "page" : undefined}
                                                    >
                                                        {item.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Disclosure>

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className={"text-3xl font-bold tracking-tight " + msg.color}>
                            {msg.msg}
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col h-100">
                        <div className="flex-auto w-full h-1/4 mb-2">
                            <div className="flex flex-col rounded-lg">
                                {/* Upload Button */}
                                <div className="justify-center items-center w-full h-full">
                                    {
                                        showPreview ? (
                                            // Generate Saliency Map
                                            <label
                                                htmlFor="generate-result"
                                                className="
                                                    flex flex-col justify-center items-center w-full h-full
                                                    rounded-lg cursor-pointer
                                                    dark:bg-gray-900
                                                    dark:hover:bg-gray-700
                                                    "
                                                onClick={getPrediction}
                                            >
                                                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click</span> to get
                                                        result
                                                    </p>
                                                </div>
                                            </label>
                                        ) : (
                                            // End Generate Saliency Map
                                            // Upload Image
                                            <label
                                                htmlFor="dropzone-file"
                                                className="
                                                flex flex-col justify-center items-center w-full h-full
                                                rounded-lg cursor-pointer
                                                dark:bg-gray-900
                                                dark:hover:bg-gray-700
                                                "
                                            >
                                                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                    <svg
                                                        aria-hidden="true"
                                                        className="mb-3 w-10 h-10 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        ></path>
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">
                                                            Click to upload
                                                        </span>{" "}
                                                        or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        PNG, JPEG file only
                                                    </p>
                                                </div>
                                                <input
                                                    id="dropzone-file"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={uploadImage}
                                                />
                                            </label>
                                        )
                                        // End Upload Image
                                    }
                                </div>
                                {/* End Upload Button */}
                            </div>
                        </div>

                        {showPreview ? (
                            <div className="flex text-center justify-center align-middle h-fit">
                                <h1 className="m-auto mb-4 text-3xl font-extrabold dark:text-white md:text-3xl lg:text-4xl">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                                        ORIGINAL IMAGE RESIZED TO 4:3 RATIO
                                    </span>
                                </h1>
                            </div>
                        ) : (
                            <div className="flex text-center justify-center align-middle h-fit">
                                <h1 className="mt-20 text-5xl font-extrabold text-white dark:text-white md:text-5xl lg:text-6xl">
                                    START BY <br></br>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                                        UPLOADING AN IMAGE
                                    </span>
                                </h1>
                            </div>
                        )}

                        {showPreview ? (
                            <div className="flex-auto h-3/4 mb-4">
                                <div className="flex flex-row h-[720px] align-middle justify-center">
                                    {/* Preview Image */}
                                    <figure className="h-full min-w-fit	">
                                        <img
                                            className="h-full min-w-full"
                                            src={previewUrl}
                                            alt=""
                                        />
                                    </figure>
                                    {/* End Preview Image */}
                                </div>
                            </div>
                        ) : null}

                        {/* {predict ? (
                            <SaliencyResult
                                imageUrl={preview || ""}
                                caption="TRANSALNET SALIENCY MAP RESULT"
                            />
                        ) : null}

                        {predict ? (
                            <SaliencyResult
                                imageUrl={preview || ""}
                                caption="CASNET SALIENCY MAP RESULT"
                            />
                        ) : null} */}

                        {predict ? (
                            <SaliencyResult
                                imageUrl={resultUrl || ""}
                                caption="SALGAN SALIENCY MAP RESULT"
                            />
                        ) : null}

                        {/* /End replace */}
                    </div>
                </main>
            </div>
        </>
    );
};

export default HomePage;
