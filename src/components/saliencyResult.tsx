import React from 'react';

const SaliencyResult = (props: Record<string, string>) => {
    return (
        <>
            <div className="flex text-center justify-center align-middle">
                <h1 className="m-auto mb-4 text-3xl font-extrabold text-gray-900 dark:text-gray-900 md:text-3xl lg:text-4xl">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                        {props.caption}
                    </span>
                </h1>
            </div>

            <div className="flex-auto h-3/4 mb-4">
                <div className="flex flex-row h-[480px] rounded-lg align-middle justify-center">
                    {/* Preview Image */}
                    <figure className="h-full min-w-fit	">
                        <img
                            className="h-full min-w-full rounded-lg"
                            src={props.imageUrl}
                            alt={props.imageUrl}
                        />
                    </figure>
                    {/* End Preview Image */}
                </div>
            </div>
        </>
    )
}

export default SaliencyResult;