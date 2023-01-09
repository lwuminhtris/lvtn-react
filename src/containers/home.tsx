import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import SaliencyResult from "../components/saliencyResult";
import Notification from "../components/notification";
import axios from "axios";

const HomePage = () => {
    const [showPreview, setPreview] = useState(false);
    const [predict, setPredict] = useState(false);
    const [salganUrl, setsalganUrl] = useState<string>("");
    const [transalnetUrl, settransalnetUrl] = useState<string>("");
    const [msinetUrl, setmsinetUrl] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [notification, setNotification] = useState<number>(0);
    const [msiLoaded, setMsiLoaded] = useState<boolean>(false);
    const [salganLoaded, setSalganLoaded] = useState<boolean>(false);
    const [transLoaded, setTransLoaded] = useState<boolean>(false);

    // 0 -> Attention; 1 -> Pending; 2 -> Success
    const styles = {
        attention: {
            style:
                "p-4 text-yellow-900 bg-yellow-100 border border-yellow-200 rounded-md",
            title: "Attention",
            img: "M13.6086 3.247l8.1916 15.8c.0999.2.1998.5.1998.8 0 1-.7992 1.8-1.7982 1.8H3.7188c-.2997 0-.4995-.1-.7992-.2-.7992-.5-1.1988-1.5-.6993-2.4 5.3067-10.1184 8.0706-15.385 8.2915-15.8.3314-.6222.8681-.8886 1.4817-.897.6135-.008 1.273.2807 1.6151.897zM12 18.95c.718 0 1.3-.582 1.3-1.3 0-.718-.582-1.3-1.3-1.3-.718 0-1.3.582-1.3 1.3 0 .718.582 1.3 1.3 1.3zm-.8895-10.203v5.4c0 .5.4.9.9.9s.9-.4.9-.9v-5.3c0-.5-.4-.9-.9-.9s-.9.4-.9.8z",
            content: "Since the server's resource is limited, it might take seconds to work!",
        },
        pending: {
            style: "p-4 text-blue-900 bg-blue-100 border border-blue-200 rounded-md",
            title: "Pending",
            img: "M14.1667 17h-3.3334c-.5 0-.8333-.3146-.8333-.7865 0-.472.3333-.7865.8333-.7865H11.5c.0833 0 .1667-.0787.1667-.1573v-3.5394c0-.0786-.0834-.1573-.1667-.1573h-.6667c-.5 0-.8333-.3146-.8333-.7865S10.3333 10 10.8333 10h.8334c.9166 0 1.6666.7079 1.6666 1.573v3.7753c0 .0787.0834.1573.1667.1573h.6667c.5 0 .8333.3146.8333.7865 0 .472-.3333.7079-.8333.7079zM12.3 6c.6933 0 1.3.6067 1.3 1.3s-.52 1.3-1.3 1.3S11 7.9933 11 7.3 11.6067 6 12.3 6zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2",
            content: "Image is being handled!",
        },
        success: {
            style: "p-4 text-green-900 bg-green-100 border border-green-200 rounded-md",
            title: "Success",
            img: "M8.445 12.6675A.9.9 0 0 0 7.1424 13.91l2.5726 2.7448c.3679.3856.9884.3689 1.335-.036l5.591-7.0366a.9.9 0 0 0-1.3674-1.1705l-4.6548 5.9132a.4.4 0 0 1-.607.0252l-1.567-1.6826zM1.9995 12c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z",
            content: "Image handled successfully!",
        },
    };

    useEffect(() => {
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    useEffect(() => {
        return () => URL.revokeObjectURL(salganUrl);
    }, [salganUrl]);

    useEffect(() => {
        if ((transLoaded === true) && (msiLoaded === true) && (salganLoaded === true)) {
            setNotification(2);
        }
    }, [transLoaded, msiLoaded, salganLoaded])

    const uploadImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        setNotification(1);
        const data = new FormData();
        e.target.files
            ? data.append("image", e.target.files[0])
            : console.log(`file is null`);

        await axios
            .post<File>("https://www.minzi.live/save", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            })
            .then((res) => {
                setNotification(2);
                e.target.files ? setPreviewUrl(URL.createObjectURL(e.target.files[0])) : console.log(`file is null`);
                setPreview(true);
            })
            .catch((e) => console.log("Error while uploading image", e));

        const tranSalNetResult = axios
            .post<File>("https://www.minzi.live/transalnet", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            })
            .then((res) => {
                setTransLoaded(true);
                settransalnetUrl(URL.createObjectURL(res.data));
            })
            .catch((e) => console.log("Error at TranSalNet with", e));

        const msiNetResult = axios
            .post<File>("https://www.minzi.live/msinet", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            })
            .then((res) => {
                setMsiLoaded(true);
                setmsinetUrl(URL.createObjectURL(res.data));
            })
            .catch((e) => console.log("Error at MSINet with", e));

        await Promise.all([tranSalNetResult, msiNetResult]);
    };

    const getPrediction = async (): Promise<void> => {
        setNotification(1);
        await axios
            .get<File>("https://www.minzi.live/salgan", {
                headers: {
                    "Content-Type": "image/png",
                },
                responseType: "blob",
            })
            .then((res) => {
                setSalganLoaded(true);
                setsalganUrl(URL.createObjectURL(res.data));
                setPredict(true);
            })
            .catch((e) => console.log("Error at prediction with", e));
    };

    const navigation = [
        { name: "Dashboard", href: "", current: true },
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
                        <h1 className={"text-3xl font-bold tracking-tight"}>Results</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col h-100">
                        <div className="z-10 mb-6">
                            {notification === 0 ?
                                <Notification
                                    style={styles.attention.style}
                                    title={styles.attention.title}
                                    img={styles.attention.img}
                                    content={styles.attention.content}
                                /> : null
                            }
                            {notification === 1 ?
                                <Notification
                                    style={styles.pending.style}
                                    title={styles.pending.title}
                                    img={styles.pending.img}
                                    content={styles.pending.content}
                                /> : null
                            }
                            {notification === 2 ?
                                <Notification
                                    style={styles.success.style}
                                    title={styles.success.title}
                                    img={styles.success.img}
                                    content={styles.success.content}
                                /> : null
                            }
                        </div>
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
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        PNG, JPEG, WEBP file only
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
                                        UPLOADED IMAGE
                                    </span>
                                </h1>
                            </div>
                        ) : (
                            <div className="flex text-center justify-center align-middle h-fit">
                                <h1 className="mt-16 text-5xl font-extrabold text-white dark:text-white md:text-5xl lg:text-6xl">
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

                        {predict ? (
                            <SaliencyResult
                                imageUrl={transalnetUrl || ""}
                                caption="TRANSALNET SALIENCY MAP RESULT"
                            />
                        ) : null}

                        {predict ? (
                            <SaliencyResult
                                imageUrl={msinetUrl || ""}
                                caption="MSI SALIENCY MAP RESULT"
                            />
                        ) : null}

                        {predict ? (
                            <SaliencyResult
                                imageUrl={salganUrl || ""}
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
