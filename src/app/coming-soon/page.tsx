"use client";
import NextImage from "next/image";
import Marquee from "@/components/custom/marquee";
import Link from "next/link";
import Navbar from "@/pages/navbar";
export default function ComingSoon() {
    return (
        <>
            <Navbar />
            <div className="relative py-[5vh] h-[100vh] max-w-[100vw] overflow-hidden overflow-x-hidden">
                <div className="relative flex flex-col items-center w-full">
                    <div className="mt-8 flex flex-col items-center justify-center text-[8vh]">
                        <NextImage
                            src="/globe.svg"
                            alt="globe"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="h-56 my-4 w-auto inline select-none mx-auto"
                        />
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[2vh] lg:text-[3vh] font-bebas">Office of Students' Welfare</p>
                            <p className="text-[1.2vh] lg:text-[1.8vh] font-bebas">presents</p>
                            <NextImage
                                src="/vitmun.svg"
                                alt="vitmun"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-16 w-auto inline select-none mx-auto"
                            />
                            <p className="text-[1.5vh] lg:text-[1.75vh] text-black border border-black justify-center px-4 rounded-3xl select-none italic text-center">
                                WHERE YOUR VOICE MATTERS
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col lg:flex-row gap-y-0 lg:gap-x-8 lg:font-semibold relative justify-center items-center text-white">
                            <div className="z-10 ">
                                <Link href="/">
                                    <button
                                        className="font-bebas text-[2.5vh] lg:text-[3.5vh] bg-[#FF0040] py-1 px-6 lg:px-8 border rounded-3xl z-10 shadow-2xl hover:bg-[#C73C42]"
                                    >
                                        COMING SOON
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <NextImage
                            src="/date.svg"
                            alt="date"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="mt-4 h-12 w-auto inline select-none mx-auto"
                        />
                    </div>
                </div>

                {/* Footer */}
                <NextImage
                    src="/house.svg"
                    alt="house"
                    width={960}
                    height={540}
                    className="h-[20vh] max-w-[60vw] lg:h-[50vh] lg:max-w-[30vw] absolute bottom-[5vh] lg:bottom-[3vh] -left-28 z-0 overflow-hidden"
                />
                <NextImage
                    src="/house.svg"
                    alt="house"
                    width={960}
                    height={540}
                    className="h-[20vh] max-w-[60vw] lg:h-[50vh] lg:max-w-[30vw] absolute bottom-[5vh] lg:bottom-[3vh] transform scale-x-[-1] -right-28 z-0 overflow-hidden"
                />
                <div className="absolute h-[5vh] lg:h-[6vh] bottom-0 w-full z-0 py-0 bg-[#FF0040]">
                    <Marquee text1="VITMUN'26" text2="WHERE YOUR VOICE MATTERS" />
                </div>
            </div>
        </>
    );
};